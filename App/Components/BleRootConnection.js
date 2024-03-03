import React, {Component} from 'react'
import {connect} from "react-redux";
import BleDManager from "../Containers/BleDManager";
import KeyUtils from "@utils/KeyUtils";
import {
  appendTimeZone,
  bits,
  convertNumberToBoolean,
  getManufacturerData,
  toHexString,
  uuidV4,
  valueToByte,
  isListEqual
} from '@utils/TextUtils'
import HomeActions from '@redux/HomeRedux';
import AppActions from "@redux/AppRedux";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import base64 from 'react-native-base64'
import Dialog from '@components/Dialog';
import I18n from '@i18n';
import NavigationService from "@services/NavigationService";
import {getLocalFromMarket, getVolumeMaxValue, getVolumeUnits} from '@utils/locale';
import Toast from '@components/ToastMessage';
import {getRealmDb, saveMotherProfile} from "../Database/AddBabyDatabase";
import {createAllTrackedItems, createTrackedItem} from "../Database/TrackingDatabase";
import GetterSetter from "@components/GetterSetter";
import NavigationActions from '@redux/NavigationRedux';
import LoadingSpinner from '@components/LoadingSpinner'
import UserActions from '@redux/UserRedux';
import {saveVirtualFreezerDatabase} from "../Database/VirtualFreezerDatabase";
import { milkExpiredNotification } from '@components/Notifications';
import {Alert, PermissionsAndroid, Platform} from "react-native";
import { Analytics } from '@services/Firebase';
import {Constants} from "@resources";
import {openSettings, PERMISSIONS, requestMultiple, RESULTS} from "react-native-permissions";
import {openPermissionAlert, toHHMMSS, getNextNonce} from '@utils/TextUtils'
import DeviceInfo from "react-native-device-info";

var Buffer = require('buffer/').Buffer
var MD5s   = require("blueimp-md5")

let pumpL = []
let sessionIndex = 0
let statusFlags = {}
let statusFlagsSonata = {
  "sessionType": 1,
  "sessionAborted": false,
  "goalCompleted": false,
  "goalExtended": false,
  "autoLetdown": false,
  "leaksDetected": false,
  "timestampInvalid": false
}
let indx = 0
let addNewPump = false
let pumpAdded = false
let pumpLevel = 0, phaseLevel = 0, rhythemLevel = 0, goalTime = 0
let mNextNonce = 0
let analytics = new Analytics()
let pumpLevelParams = 0

const permissionsGreaterThan30 = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
]

const permissionsLessThan31 = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
]

class BleRootConnection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      milkNotif:false,
      isDeviceComparison: false,
      isLoading: false,
      showPumpOffAlert: false,
      showPumpBatteryAlert: false,
      battery_level: '',
      isBluetoothOff: true,
      realmDb: null,
      showViewAlert: false,
      isOnlineSessionActive: false,
      unit:'',
      maxVolumeValue:0,
      showVipSuccessPupup : false,
      isFirstTime:false,
      volNotifValue: false,
      showRemoveManualSessionAlert: false
    }
    this.manager = BleDManager.getBleManagerInstance();
    this.pumpList = []
    this.isBluetoothActive = false
    this.deviceIdentifier = '';
    this.subscriptionHeartRate = null
    this.subscriptionTimer = null
    this.subscriptionPumpLevel = null
    this.subscriptionRhythemLevel = null
    this.subscriptionPhaseLevel = null
    this.subscriptionDeviceState = null
    this.subscriptionDeviceAlertState = null
    this.subscriptionBatteryCharging = null
    this.flexDataList = []
    this.isFlex = false
    this.PUMP_OPERATOR_LAST_COMPLATE_RECORD_FLEX = []
    this.activeSessionId = ""
    this.device = {}
    this.durationBothInMins = 0
    this.durationBothInSec = 0
    this.totalVolumeCount = 0
    this.leftVolumeCount = 0
    this.rightVolumeCount = 0
    this.pumpId = ''
    this.batteryAlertCount = 0
    this.pumpOffCount = 0
    this.isTimerRunning = false
    this.sessionList = []
    this.trackingList = []
    this.lastRecordIndex = 0
    this.subscription = null
    this.subscriptionAllRecord = null

    this.connection_interval = React.createRef();
    this.scan_interval = React.createRef();
    this.trackingObj = null
    this.isActiveSessionSaved = false;
    this.pumpTime = 0;

    this.isActiveFlexSessionWrite=false  // for active session write the characterstic and cmdType return d16
    this.readFlexData = {
      "batteryCharging": 0,
      "batteryLevel": 0,
      "battery_level": '',
      "sessionIndex": 0,
      "timer": 0,
      "pumpLevel": 3,
      "phaseLevel": 0,
      "deviceState": 1,
      "statusFlags": {}
    }

    this.readSonataData = {
      "batteryCharging": 0,
      "battery_level": '',
      "deviceAlertState": 0,
      "deviceState": 0,
      "goalTime": 0,
      "phaseLevel": 0,
      "pumpLevel": 2,
      "rhythemLevel": 0,
      "timer": 0,
      "statusFlags" : {}
    }
    this.deviceId = ''
    this.mTrackingId = '';
    this.isOnlineSessionStarted = false;
    this.isScannerRunning = false
    this.isConnectionIntervalRunning = false
    this.subscriptionGoalTime = null
    this.isFirstTime = true
    this.isOfflineSessionSyncingOfSwing = false
    this.readingLastIndexForActiveSession = false
    this.pumpMacAddress = ''
  }

  async componentDidMount() {
    Promise.all([getVolumeUnits(),getVolumeMaxValue()]).then((values) => {
      this.setState({unit:values[0],maxVolumeValue:values[1]})
    });
    this.subscription = this.manager.onStateChange((state) => {
      const {bleDeviceId, isPumpConnected, isConnected,pumps, connectionState, scannedPumpList, scannedList} = this.props
      console.log('bluetooth--- ', state)
      this.flexDataList = []
      this.sessionList = []
        if(state === 'PoweredOn'){
          this.isBluetoothActive = state === 'PoweredOn'
          if(!this.isFirstTime){
          this.setState({isBluetoothOff: state === 'PoweredOn'})
          if (pumps && pumps.pumps &&  pumps.pumps.length > 0) {
            pumpL = []
            for (let item of pumps.pumps) {
              !item.deleteFlag && pumpL.push({...item, device: {}, isOnline: false})
            }
            console.log('pumpL--- ', pumpL)

            if (pumpL.length > 0) {
              this.isActiveSessionSaved = false;
              this.pumpList = pumpL
              // if(!isListEqual(scannedList,this.pumpList)) {
                scannedPumpList(this.pumpList);
              // }
              // check if it is already stooped, then do not call stopScanSInterval
              //this.stopScanInterval()
              console.log('onStateChange ***** LN 171---',this.isScannerRunning)
              if (!this.isScannerRunning){
                this.startScanInterval()
              }
              //this.startConnectionInterval(this.pumpList)
            }else{
              isPumpConnected(false)
              if(this.isConnectionIntervalRunning) {
                this.stopConnectionInterval()
              }
              if(this.isScannerRunning) {
                this.stopScanInterval()
              }
              this.props.scannedPumpList([])
            }
          }else{
            isPumpConnected(false)
            if(this.isConnectionIntervalRunning) {
              this.stopConnectionInterval()
            }
            if(this.isScannerRunning) {
              this.stopScanInterval()
            }
            this.props.scannedPumpList([])
          }
        }
      }else{
        this.isBluetoothActive = false
        this.props.isPumpRunning(false)
        connectionState(I18n.t('ble_pumping.connection_lost'));
        isPumpConnected(false)
        if(this.isConnectionIntervalRunning) {
          this.stopConnectionInterval()
        }
        if(this.isScannerRunning) {
          this.stopScanInterval()
        }
        let pp = []
        for (let item of this.pumpList) {
          !item.deleteFlag && pp.push({...item, device: {}, isOnline:false})
        }
        this.pumpList = pp
        // if(!isListEqual(scannedList,this.pumpList)) {
          scannedPumpList(this.pumpList);
        // }
      }
    }, true);
    this.manager.state().then((state) => {
      this.isBluetoothActive = state === 'PoweredOn'
      this.setState({isBluetoothOff:state === 'PoweredOn'})
      // this.props.isPumpConnected(false)
    })
    this.device = this.props.device
    this.props.setPumpType(false)

    let realmDb = await getRealmDb()
    this.setState({ realmDb })

    const {navigation,pumps } = this.props
    navigation.addListener('didFocus', async () => {
      if (Platform.OS == 'android') {
        let pumpsL = []
        if (pumps && pumps.pumps &&  pumps.pumps.length > 0) {
          for (let item of pumps.pumps) {
            !item.deleteFlag && pumpsL.push({...item})
          }
          if (pumpsL.length > 0) {
            if(!await this._requestLocationPermission()){
              openPermissionAlert();
              await this._requestLocationPermission()
            }
          }
        }
      }
    })
  }

  async _requestLocationPermission(){
    let isPermissionGranted = false;
    let permissions = [];
    if(DeviceInfo.getAPILevel()<31) {
      permissions = permissionsLessThan31;
    }else{
      permissions = permissionsGreaterThan30;
    }
    const statuses = await requestMultiple(permissions);
    for (let index in permissions) {
      if (statuses[permissions[index]] === RESULTS.GRANTED) {
        this.setState({isLocationServiceEnable: true})
        isPermissionGranted = true;
      } else if (statuses[permissions[index]] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
      {
        openPermissionAlert();
      }
      else {
        this.setState({isLocationServiceEnable: false})
        isPermissionGranted = false;
        break;
      }
    }
    return isPermissionGranted;
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      pumps,
      isPumpListSuccess,
      isPumpListFailure,
      appState,
      bleDeviceId,
      scannedPumpList,
      sonataData,
      flexData,
      isPumpConnected,
      device,
      trackingApiSuccess,
      createBottleApiSuccess,
      trackingApiFailure,
      isNewPumpAdded,
      addPumpSuccess,
      onStopIntervals,
      isManualSession,
      isFromNewPump,
      trackingResponse,
      isConnected,
      vipPackApi,
      vipPackSuccess,
      vipPackFailure,
      getUserProfile,
      userProfile,
      userProfileSuccess,
      remoteConfig,
      getPumpList,
      createBottleApi,
      connectionState,
      isLeftTimerActive,
      isRightTimerActive,
      scannedList
    } = this.props

    if (appState && appState != prevProps.appState) {
      console.log('App State --------- ', appState,this.isConnectionIntervalRunning,this.isScannerRunning)
      if (appState === 'background') {
        isPumpConnected(false)
        // connectionState(I18n.t('ble_pumping.connection_lost'));
        if(this.isConnectionIntervalRunning) {
          this.stopConnectionInterval()
        }
        if(this.isScannerRunning) {
          this.stopScanInterval()
        }
        // this.disconnectDevice()
      } else if (appState === 'active') {
        this.flexDataList = []
        this.sessionList = []
        if (pumps && pumps.pumps &&  pumps.pumps.length > 0) {
          pumpL = []
          for (let item of pumps.pumps) {
            !item.deleteFlag && pumpL.push({...item, device: {}, isOnline: false})
          }
          if (pumpL.length > 0) {
            this.isActiveSessionSaved = false;
            this.pumpList = pumpL
            // if(!isListEqual(scannedList,this.pumpList)) {
              scannedPumpList(this.pumpList);
            // }
            console.log('DidUpdate ACtive ***** LN 277---',this.isScannerRunning)
            if (!this.isScannerRunning){
              this.startScanInterval()
            }
            // this.stopScanInterval()
            // this.startConnectionInterval(this.pumpList)
          }else{
            scannedPumpList([])
            if(this.isConnectionIntervalRunning) {
              this.stopConnectionInterval()
            }
            if(this.isScannerRunning) {
              this.stopScanInterval()
            }
          }
        }
      }
    }
    if (bleDeviceId && bleDeviceId != prevProps.bleDeviceId) {
      // console.log('deviceId --------- ', bleDeviceId)
      this.deviceId = bleDeviceId
    }

    if (isPumpListSuccess && prevProps.isPumpListSuccess != isPumpListSuccess) {
      //  Pump Delete , Pump Add and onLaunch screen pump
      this.isFirstTime = false
      pumpL = []
      this.flexDataList = []
      this.sessionList = []
      if (pumps && pumps.pumps && pumps.pumps.length > 0) {
        for (let item of pumps.pumps) {
          !item.deleteFlag && pumpL.push({...item, device: {}, isOnline: false})
        }
        if(pumpL.length>0) {
          this.pumpList = pumpL
          console.log('pumps---------', pumpL)
          // if(!isListEqual(scannedList,this.pumpList)) {
            scannedPumpList(this.pumpList);
          // }
          isPumpConnected(false)
          if(this.isConnectionIntervalRunning) {
            this.stopConnectionInterval()
          }
          if(this.isScannerRunning) {
            this.stopScanInterval()
          }

          if (pumpAdded) {
            this.connectToNewPump(bleDeviceId, 0)
          } else {
            console.log('isPumpListSuccessApi ***** LN 323---',this.isScannerRunning)
            if(!this.isScannerRunning) {
              this.startScanInterval()
            }
          }
        }else{
          scannedPumpList([])
          if(this.isConnectionIntervalRunning) {
            this.stopConnectionInterval()
          }
          if(this.isScannerRunning) {
            this.stopScanInterval()
          }
          // this.isBluetoothActive && this.manager.stopDeviceScan();
        }
      }else{
        this.props.scannedPumpList([])
        isPumpConnected(false)
      }

    }

    if (addPumpSuccess && addPumpSuccess != prevProps.addPumpSuccess) {
      console.log('addPumpSuccess---------', addPumpSuccess)
      this.isFirstTime = false
      getUserProfile()
      addNewPump = true
      pumpAdded = true
    }

    if (trackingApiSuccess && trackingApiSuccess != prevProps.trackingApiSuccess && prevState.isLoading) {
      console.log('trackingApiSuccess ********',this.isActiveSessionSaved)
      this.sessionList = []
      statusFlags={}
        if (!this.isActiveSessionSaved) {
          this.setState({isLoading:false})
          console.log('tracking success Offline------------', trackingResponse)
            //if (!this.state.isOnlineSessionActive) {
              this.saveTrackingInDb(true)
            //}
        }
        if(this.isActiveSessionSaved){
          this.setState({isLoading: false})
          this.isActiveSessionSaved = false;
          console.log('tracking success ------------', trackingResponse,this.isInventoryAvailable)
          if (trackingResponse && trackingResponse.successIds && trackingResponse.successIds.length > 0)
          {
          if (this.isInventoryAvailable) {
            let bottleData = Object.assign({milkInventories: [JSON.parse(JSON.stringify(this.createInventoryObj))]});
            console.log('bottleData--->>',bottleData)
            let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
            this.inventoryObj.isDeleted = false
            this.inventoryObj.userId = userName
            this.inventoryObj.isSync = true
            this.inventoryObj.isMoved = false
            this.trackingObj.inventory = this.inventoryObj
            this.setState({isLoading: true})
            createBottleApi(bottleData)
          } else {
            this.setState({isLoading: false})
            this.saveActiveTrackingInDb(true, trackingResponse.successIds[0])
          }
        }
      }
    }

    if (createBottleApiSuccess != prevProps.createBottleApiSuccess && createBottleApiSuccess && prevState.isLoading) {
       console.log('createBottleApiSuccess---',"")
      this.saveFreezerPumpingDataInDb(true)
      if(this.inventoryObj && Object.keys(this.inventoryObj).length > 0 && !this.state.milkNotif) {
        this.setState({ milkNotif: true })
        milkExpiredNotification(this.inventoryObj, false)
      }
      AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS).then(async (result)=>{
        if(result !== 'true')  {
          let realmDb = await getRealmDb()
          let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
          let myItems = realmDb.objects('VirtualFreezerSchema');
          let items=myItems.filter((e)=>{
            return e.userId==userName
          })
          if(items.length === 1) {
            AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS_NOTIF).then((value)=>{
              if (value !== 'false'){
                this.setState({ showCongratsPopup: true })
              } else {
                this.saveActiveTrackingInDb(true, this.trackingObj.id)
              }
            })
          } else {
            if(items.length > 1) {
              AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS, 'true')
              this.saveActiveTrackingInDb(true, this.trackingObj.id)
            }
          }
        } else {
          this.saveActiveTrackingInDb(true, this.trackingObj.id)
        }
      })

      //this.saveActiveTrackingInDb(true, this.trackingObj.id)
      this.setState({isLoading: false})
      this.isInventoryAvailable=false
    }
    if (trackingApiFailure && trackingApiFailure != prevProps.trackingApiFailure && prevState.isLoading) {
      statusFlags={}
        // console.log('trackingApiFailure--')
      console.log('Tracking Failure -----***** ')
      this.setState({ isLoading: false})
    }

    //- to stop all intervals
    if (onStopIntervals && onStopIntervals != prevProps.onStopIntervals) {
      if(onStopIntervals) {
        if(this.isConnectionIntervalRunning) {
          this.stopConnectionInterval()
        }
        if(this.isScannerRunning) {
          this.stopScanInterval()
        }
        this.disconnectDevice()
        this.props.stopAllIntervals(false)
      }else {
        this.props.stopAllIntervals(false)
      }
    }

    if (userProfileSuccess != prevProps.userProfileSuccess && userProfileSuccess) {
        const {realmDb,isFirstTime} = this.state
        // isPumpConnected
         if (!isFirstTime){
           getPumpList()
           this.setState({isFirstTime:true})
         }
        const {units, username, timezone, market, vipStatus} = userProfile.mother
        //console.log('USER profile --- ', JSON.stringify(userProfile.mother));
        if (!vipStatus && addNewPump) {
          let value = {"vipStatus": true}
          vipPackApi(value)
        }
        let localeAccordingToMarket = getLocalFromMarket(remoteConfig && remoteConfig.markets, market)
        AsyncStorage.setItem(KeyUtils.SELECTED_LOCALE, localeAccordingToMarket)
        AsyncStorage.setItem(KeyUtils.SELECTED_TIME_ZONE, timezone)
        AsyncStorage.setItem(KeyUtils.USER_NAME, username)
        AsyncStorage.setItem(KeyUtils.UNITS, units)

        let mP = JSON.parse(JSON.stringify(userProfile))
        mP['username'] = username
        mP.isSync = true
        saveMotherProfile(realmDb, mP).then(r => {
        })

    }

    if (vipPackSuccess != prevProps.vipPackSuccess && vipPackSuccess) {
      console.log('Vip success')
      getUserProfile()
      addNewPump=false
      await analytics.setProperty(Constants.USER_TYPE, 'vip_user');
      AsyncStorage.setItem(KeyUtils.VIP_STATUS, 'true')
      this.setState({showVipSuccessPupup:true})
    }
    if (vipPackFailure != prevProps.vipPackSuccess && vipPackFailure) {
      console.log('Vip fail')
    }

    if (isConnected && isConnected !== prevProps.isConnected) {
      console.log("isConnected-------- ", isConnected )

      if(isConnected) {
        if(isLeftTimerActive ) {
          this.setState({showRemoveManualSessionAlert: true})
        }
      }
    }

  }

  async componentWillUnmount() {
    this.subscription.remove()
  }
  saveTrackingInDb(isSync) {
    this.isOfflineSessionSyncingOfSwing = false;
    const { realmDb } = this.state
    this.trackingList = this.trackingList.map((e) => ({ ...e, isSync: true }))
    createAllTrackedItems(realmDb, this.trackingList).then((r) => {
      console.log('result--', r)
      this.setState({ isLoading: false, showViewAlert: true })
    })
  }
  saveActiveTrackingInDb(isSync, trackingId) {
    this.trackingObj.isSync = isSync
    this.trackingObj.userId = this.props.userProfile.mother.username
    this.isActiveSessionSaved = false;
    this.setState({ isLoading: false})
    console.log('saveActiveTrackingInDb----',isSync,trackingId)
    createTrackedItem(this.trackingObj).then(async (r) => {
      console.log('currentScreenName----',currentScreenName)
      let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
      if(currentScreenName !== 'BreastFeedingPumpingScreen') {
          this.mTrackingId = trackingId
          this.setState({ volNotifValue: await AsyncStorage.getItem(KeyUtils.PUMP_COMPLETE_NEVER_SHOW_AGAIN),showPumpOffAlert: true})
        this.props.sessionNavigation('StatsScreen',null)
        setTimeout(()=>{
          this.props.sessionNavigation('StatsScreen',trackingId)
        },300)
      }else if(currentScreenName === 'BreastFeedingPumpingScreen'){
        //NavigationService.popToTopStack()
        if (trackingId){
          let obj=JSON.parse(JSON.stringify(this.trackingObj))
          if (obj.userId){
            delete obj.userId
          }
          NavigationService.navigate('EditPumpingScreen', {item: obj,isBleScreen:true})
        }
        else{
          NavigationService.navigate('StatsScreen', {openListView: true})
        }
      }
    })
  }

  showViewDialog() {
    return (
      <Dialog
        visible={this.state.showViewAlert}
        title={I18n.t('ble_offline_popup.title')}
        message={I18n.t('ble_offline_popup.message')}
        positive={I18n.t('ble_offline_popup.view')}
        negative={I18n.t('ble_offline_popup.cancel')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({ showViewAlert: false })

        }}
        positiveOnPress={() => {
          this.setState({ showViewAlert: false })
          NavigationService.popToTopStack()
          NavigationService.navigate('OfflineSessionScreen',{trackingIds:this.props.trackingResponse.successIds})
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  startConnectionInterval(arr) {
    let count = 0
    this.pumpList = arr
    const {bleDeviceId, scannedPumpList, pumps, isPumpConnected, connectionState, scannedList} = this.props
    // check if the scanner is running, check connection interval is running
    //  if (!this.isConnectionIntervalRunning && !this.isScannerRunning){
    //    // start scanner
    //  } else if(this.isConnectionIntervalRunning && !this.isScannerRunning){
    //    // connectionInterval Running
    //    // do nothing
    //  }else if(!this.isConnectionIntervalRunning && this.isScannerRunning){
    //     //  do nothing
    //  }

     if (bleDeviceId != undefined && bleDeviceId != null) {
      this.connection_interval.current = setInterval(async () => {
        // console.log('connection interval ---- ', count++)
        this.isConnectionIntervalRunning=true
       //this.isBluetoothActive &&
       //  let connection = this.isBluetoothActive && await this.manager.isDeviceConnected(bleDeviceId)
        this.isBluetoothActive && this.manager.isDeviceConnected(bleDeviceId).then((connection) => {
        // console.log('Connection state = ', connection)
          if (!connection) {
            console.log('Connection LOST = ', connection)
            if(this.isConnectionIntervalRunning) {
              this.stopConnectionInterval()
            }
           if(this.isScannerRunning) {
              this.stopScanInterval()
           }
            Toast(I18n.t('ble_pumping.connection_lost'), Toast.SHORT);
            connectionState(I18n.t('ble_pumping.connection_lost'));
            isPumpConnected(false)
            if(pumps && pumps.pumps && pumps.pumps.length>0) {
              pumpL = []
              for (let item of pumps.pumps) {
                !item.deleteFlag && pumpL.push({...item, device: {}, isOnline: false})
              }
              if(pumpL.length>0) {
                this.pumpList = pumpL
                // if(!isListEqual(scannedList,this.pumpList)) {
                  scannedPumpList(this.pumpList);
                // }
                // console.log('---disconnected---- ')
                console.log('startConnection Interval ***** LN 581---',this.isScannerRunning)
                if(!this.isScannerRunning) {
                  this.startScanInterval()
                }
              }
            }
          }else{
            isPumpConnected(true)
            // if(!isListEqual(scannedList,this.pumpList)) {
              scannedPumpList(this.pumpList);
            // }
          }
       })
      }, 1000)
    } else {
      // scannedPumpList(this.pumpList)
       console.log('startConnectionInterval Interval ***** LN 595---',this.isScannerRunning)
       if(!this.isScannerRunning) {
         this.startScanInterval()
       }
    }
  }

  stopConnectionInterval() {
    console.log('stopConnectionInterval --- called')
    clearInterval(this.connection_interval.current)
    this.isConnectionIntervalRunning=false
  }

  disconnectDevice(){
    const {bleDeviceId, pumps} = this.props
    this.flexDataList = []
    this.sessionList = []
    this.lastRecordIndex = 0
    try {
      if (bleDeviceId) {
        this.manager && this.manager.stopDeviceScan()
        this.manager.cancelDeviceConnection(bleDeviceId).then((device) => {
          console.log('disconnedSuccesfully----', device.id)
        })
      }
    }catch (e){
      console.log('disconnect error --- ', e)
    }
  }

  startScanInterval(){
    this.isScannerRunning=true
    this.scan_interval.current = setInterval(() => {
      //console.log('start scan ***')
      // indx = 0
      // this.getPumpId()
      this.isScannerRunning=true
      this.scanBleDevices()
    },3000);

  }

  stopScanInterval() {
    console.log('stopScanInterval --- called')
    clearInterval(this.scan_interval.current)
    this.isScannerRunning=false
  }

  // async getPumpId() {
  //   // this.props.scannedPumpList(this.pumpList)
  //   if(this.pumpList.length>indx) {
  //     this.scanBleDevices(this.pumpList[indx], indx)
  //   }else{
  //     indx = 0;
  //     this.props.isPumpConnected(false)
  //     // this.isBluetoothActive && this.manager.stopDeviceScan();
  //   }
  // }

  formatTime = (value) => {

    let _timer = value;
    let getSeconds = '', minutes = '', getMinutes = ''

    getSeconds = `0${(_timer % 60)}`.slice(-2)
    minutes = `${Math.floor(_timer / 60)}`
    getMinutes = `0${minutes % 60}`.slice(-2)
    this.durationBothInMins = parseInt(getMinutes)
    this.durationBothInSec = parseInt(getSeconds)

  }

  getIndexAndFlagData(){
    console.log('getIndexAndFlagData **** **** called',)
    this.isFlex ? this.readLastSessionFlex() : this.writeToGetBluetoothLastSession()
    this.resetAsyncData()
    this.formatTime(this.pumpTime)
    this.isActiveSessionSaved = true;
     if(this.isFlex) {
       console.log('this,durationBothInSec----',this.durationBothInSec)
        if (this.durationBothInSec>0){
          if(parseInt(GetterSetter.getLastRecordIndex())>this.lastRecordIndex) {
            this.setState({isLoading: true});
            this.saveSessionData();
          }
       }
     }else{
       setTimeout(()=> {
         if (GetterSetter.getApiCallCount() === 0) {
           this.setState({isLoading: true})
           this.saveSessionData()
         }
       },2000)
     }
  }

  resetAsyncData(){
    AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'true')
    AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
    // AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, '')
    // AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
    // AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'false')
    // AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
    // AsyncStorage.setItem(KeyUtils.IS_RIGHT_TIMER_STARTED, 'false')
    // AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, '')
    // AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, '')
    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
  }


  async checkFreezerInventoryAlreadyExist() {
    let realmDb = await getRealmDb()
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    let myItems = realmDb.objects('VirtualFreezerSchema');
    /*let inventoryName = myItems.filtered(
      `number = ${this.state.number} && containerType = ${this.state.containerType}  && isConsumed=${false} && userId=${userName}` );*/
    let inventoryName=myItems.filter((item)=>{
      return item.userId==userName && item.number==this.state.number && item.containerType==this.state.containerType && item.isConsumed==false
    })
    return inventoryName.length>0
  }

  async saveSessionData(){
    const {selected_baby, isInternetAvailable, trackingApi, sessionFromNewPump, manualDataFromPumping,pumpSessionActive,isPumpRunning} = this.props
    const {babyId} = selected_baby
    GetterSetter.setApiCallCount(1)
    sessionFromNewPump(false)
    this.isOnlineSessionStarted = false
    pumpSessionActive(false)
    isPumpRunning(false)
    this.setState({isOnlineSessionActive:true})
    let d = new Date();
    let dTotal = (60*this.durationBothInMins)+this.durationBothInSec;
    let pumpName = ''
    if(GetterSetter.getPumpName()==='sonata')
      pumpName = 'sonata'
    else if(GetterSetter.getPumpName()==='maxi')
      pumpName = 'swing_maxi'
    else if(GetterSetter.getPumpName()==='flex')
      pumpName = 'freestyle_flex'

    let level = 0
    if(this.isFlex){
      level = parseInt(pumpLevel) === 0 ? 3 : parseInt(pumpLevel)
    }else{
      level = parseInt(pumpLevel)
    }

    let param = {
      'pump_tracking_type':'connected',
      'pump_type':pumpName,
      'ending_vacuum_level':parseInt(level),
      'duration':toHHMMSS(dTotal),
      'sync_type':'online',
    }
    await analytics.logEvent(Constants.PUMP_TRACKING, param);
    let pumpingObj = {'tracking_type':Constants.SAVE_PUMPING_TRACKING}
    await analytics.logEvent(Constants.TRACKINGS, pumpingObj);
    d.setSeconds(d.getSeconds() - dTotal);
    let formattedDate = await appendTimeZone(d)
    let obj = {
      "babyId": babyId,
      "id": uuidV4(),
      "trackingType": KeyUtils.TRACKING_TYPE_PUMPING,
      "trackAt": formattedDate,
      "durationTotal": parseInt(dTotal),
      "durationLeft": dTotal/2,
      "durationRight": dTotal/2,
      "confirmed": true,
      "quickTracking": true,
    }
    console.log('manualDataFrom Pumping---',manualDataFromPumping)
    if(manualDataFromPumping!= null){
      obj['remark'] = manualDataFromPumping.note
      if(manualDataFromPumping.isBadSession) {
        obj['isBadSession'] = manualDataFromPumping.isBadSession
      }else{
        obj['isBadSession'] = false
      }
      obj['amountLeft'] = manualDataFromPumping.amountLeft
      obj['amountLeftUnit'] = manualDataFromPumping.amountLeftUnit
      obj['amountRight'] = manualDataFromPumping.amountRight
      obj['amountRightUnit'] = manualDataFromPumping.amountRightUnit
      obj['amountTotal'] = manualDataFromPumping.amountTotal
      obj['amountTotalUnit'] = manualDataFromPumping.amountTotalUnit
      obj['lastBreast'] = manualDataFromPumping.lastBreast
    }else {
      obj['remark'] = ''
      obj['isBadSession'] = false
      obj['amountLeft'] = 0
      obj['amountLeftUnit'] = this.state.unit
      obj['amountRight'] = 0
      obj['amountRightUnit'] = this.state.unit
      obj['amountTotal'] = 0
      obj['amountTotalUnit'] = this.state.unit
      obj['lastBreast'] = 3
    }
    console.log('pumpRecordId----Active Session--->>>>',statusFlags)
    obj['pumpId'] = GetterSetter.getPumpId()
    obj['pumpRecordId'] = parseInt(GetterSetter.getLastRecordIndex())
    this.lastRecordIndex = parseInt(GetterSetter.getLastRecordIndex())
    if(this.isFlex) {
      pumpLevelParams = parseInt(pumpLevel) === 0 ? 3 : parseInt(pumpLevel)
      obj['deviceLevel'] = parseInt(pumpLevel) === 0 ? 3 : parseInt(pumpLevel)
      obj['devicePhase'] = parseInt(phaseLevel)
      obj['statusFlags'] = statusFlags
    }else{
      pumpLevelParams = parseInt(pumpLevel)
      obj['deviceLevel'] = parseInt(pumpLevel)
      obj['devicePhase'] = parseInt(phaseLevel)
      obj['devicePattern'] = parseInt(rhythemLevel)
      obj['goalTime'] = parseInt(goalTime)
      obj['statusFlags'] = statusFlags
    }

    this.isInventoryAvailable=false
    if (manualDataFromPumping!=null){
      const{inventory}=manualDataFromPumping
      if (inventory){
        const {containerType,location,number,trayNumber}=inventory
        if (containerType && location && number && trayNumber && manualDataFromPumping.amountTotal && manualDataFromPumping.amountTotal>1){
          let entryExist = await this.checkFreezerInventoryAlreadyExist();
          if (!entryExist){
            obj['savedMilk']=true
            let expireAt = location == 1 ? moment().add(3, 'days').format() : moment().add(6, 'months').format()
            this.inventoryObj = {
              id:uuidV4(),
              trackingMethod: 1,
              trackAt:moment().format(),
              location: location,
              tray: parseInt(trayNumber),
              containerType: containerType,         // 1: Bottle, 2: Bag
              number: parseInt(number),         // container number
              amount: parseFloat(manualDataFromPumping.amountTotal),
              unit: manualDataFromPumping.amountTotalUnit,      // oz, ml
              createdFrom:obj.id,
              isConsumed: false,
              consumedBy:"",
              consumedAt:"",
              isExpired: false,
              expireAt:expireAt,
              movedAt:""
            };
            this.isInventoryAvailable=true
            this.createInventoryObj=JSON.parse(JSON.stringify(this.inventoryObj))
            console.log('bottleData-->>', JSON.stringify(this.createInventoryObj))
            this.saveFreezerPumpingDataInDb(false)

          }
        }
      }
    }
    this.trackingObj = obj
    let json = {
      "trackings": [JSON.parse(JSON.stringify(this.trackingObj))]
    }
    //console.log('Tracking---Root------ ', JSON.stringify(json));
    this.readingLastIndexForActiveSession = false
    if (isInternetAvailable) {
      this.setState({isLoading:true})
      trackingApi(json);
    }else{
      if (this.isInventoryAvailable){
        let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
        this.inventoryObj.isDeleted = false
        this.inventoryObj.userId = userName
        this.inventoryObj.isSync = false
        this.inventoryObj.isMoved = false
        this.trackingObj.inventory = this.inventoryObj
      }
      this.saveActiveTrackingInDb(false,obj.id)
    }
    this.clearStoreAfterApiCall()
  }

  async saveFreezerPumpingDataInDb(isSync) {
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    this.inventoryObj.isDeleted = false
    this.inventoryObj.userId = userName
    this.inventoryObj.isSync = isSync
    this.inventoryObj.isMoved = false
    this.trackingObj.inventory=this.inventoryObj
    let realmDb = await getRealmDb()
    saveVirtualFreezerDatabase(realmDb, this.inventoryObj).then((r) => {
    })

  }

  clearStoreAfterApiCall(){
    this.props.pumpingManualData(null)
    let readFlex = {
      "batteryCharging": 0,
      "batteryLevel": 0,
      "battery_level": '',
      "sessionIndex": 0,
      "timer": 0,
      "pumpLevel": 3,
      "phaseLevel": 0,
      "deviceState": 1
    }
    let readSonata = {
      "batteryCharging": 0,
      "battery_level": '',
      "deviceAlertState": 0,
      "deviceState": 0,
      "goalTime": 0,
      "phaseLevel": 0,
      "pumpLevel": 2,
      "rhythemLevel": 0,
      "timer": 0
    }
    this.props.flexPumpData(readFlex)
    this.props.sonataPumpData(readSonata)
  }


  scanBleDevices() {
    this.props.connectionState(I18n.t('ble_pumping.connection_lost'));
    // const id = item.pumpId
    const {getBleDeviceId, scannedPumpList, isPumpConnected, scannedList} = this.props
    // if(isPumpConnected){
    //   this.stopScanInterval()
    // }
   // console.log('start scan ****', this.isBluetoothActive)
   //  this.isBluetoothActive && this.manager.startDeviceScan(null, null, (error, device) => {
    this.isBluetoothActive && this.manager.startDeviceScan([KeyUtils.MEDELA_PUMP_SERVICE_UUID_OLD, KeyUtils.MEDELA_PUMP_SERVICE_UUID], { allowDuplicates: false }, (error, device) => {
      if (error) {
        this.isBluetoothActive && this.manager.stopDeviceScan();
        console.log("scanning Error = " + error)
        // if(this.isScannerRunning)
        // {
        //   clearInterval(this.scan_interval.current)
        // }
        this.pumpOffCount=0
      }
      console.log('ble Scanner---')
      let item = device && device.id && device.name && this.pumpList.find((e, index) => {
        const  deviceName=device.name
        if (e.pumpId === getManufacturerData(device.manufacturerData,deviceName)) {
          this.device = device
          this.pumpOffCount=0
          console.log('pumpId----',e.pumpId)
          console.log('getFormattedMacAddress----  ',this.getFormattedMacAddress(e.pumpId))
          if(Platform.OS === 'ios'){
            this.pumpMacAddress = this.getFormattedMacAddress(e.pumpId)
          }
          this.props.getPumpId(e.pumpId)
          Toast(I18n.t('ble_pumping.connecting_pump'), Toast.SHORT);
          console.log('lastRecordIndex ======== ', e.lastRecordIndex)
          GetterSetter.setPumpId(getManufacturerData(this.device.manufacturerData,deviceName))
          // if(e.lastRecordIndex > this.lastRecordIndex) {
            this.lastRecordIndex = e.lastRecordIndex
          // }
          this.isBluetoothActive && this.manager.stopDeviceScan();
          const {id,localName,name}=device
          this.pumpList[index].device = {
            id, localName, name
          }
          this.pumpList[index].isOnline = true
          getBleDeviceId(device.id)
          this.deviceId = device.id
          // if(!isListEqual(scannedList,this.pumpList)) {
            scannedPumpList(this.pumpList);
          // }
          // console.log("device found = ", device.name)

          return true
        }
      })
      if (item!==undefined && item!=null){
        isPumpConnected(true)
        if(this.isScannerRunning) {
          this.stopScanInterval()
        }
        //Toast(I18n.t('ble_pumping.pump_connected'), Toast.SHORT);
        this.isBluetoothActive && this.manager.stopDeviceScan();
        this.isBluetoothActive && this.connectToPump()
      }
    })
  }

  getFormattedMacAddress(value) {
    let macAddress = value || null;

    if (macAddress !== null) {
      let deviceMac = macAddress;
      deviceMac = deviceMac.toUpperCase();

      return deviceMac.match(/.{1,2}/g).join(':');
    }
  }


  connectToNewPump = async (id, index) => {
    this.lastRecordIndex = this.pumpList[index].lastRecordIndex
    console.log('Connect to new Pump ------- --',this.lastRecordIndex)
    pumpAdded = false
    if(this.isScannerRunning) {
      this.stopScanInterval()
    }
    if(this.isConnectionIntervalRunning) {
      this.stopConnectionInterval()
    }
    const {scannedPumpList, pumps, scannedList}= this.props
    let ar = [id]
    this.isBluetoothActive && this.manager.devices(ar)
      .then((devices) => {
        devices.length > 0 && devices[0].isConnected().then(async (res) => {
        console.log('IS connected = ', res)
          if(!this.isConnectionIntervalRunning) {
            this.startConnectionInterval(this.pumpList)
          }
        if (res) {
          console.log('device already connected - ', id)
          const isFlex = devices[0].name.toLowerCase().includes("freestyle") || devices[0].name.toLowerCase().includes("maxi")
          this.isFlex = isFlex
          if(devices[0].name.toLowerCase().includes("freestyle")){
            let param = {
              'pump_type':'freestyle_flex',
            }
            await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
            GetterSetter.setPumpName('flex')
            this.device = devices[0]
            this.callFlexData(devices[0])
          }else if(devices[0].name.toLowerCase().includes("maxi")){
            let param = {
              'pump_type':'swing_maxi',
            }
            await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
            this.device = devices[0]
            GetterSetter.setPumpName('maxi')
            this.callSwingMaxiData(devices[0])
          }else{
            let param = {
              'pump_type':'sonata',
            }
            await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
            GetterSetter.setPumpName('sonata')
            this.device = devices[0]
            this.callSonata(devices[0])
            }
            const {id, localName, name} = devices[0]
            this.pumpList[index].device = {
              id, localName, name
            }
            this.pumpList[index].isOnline = true
            // if(!isListEqual(scannedList,this.pumpList)) {
              scannedPumpList(this.pumpList);
            // }
            this.props.setPumpType(isFlex)
            this.props.isPumpConnected(true)
          } else {
            devices[0].connect()
              .then((device) => {
                return device.discoverAllServicesAndCharacteristics()
              })
              .then(async (device) => {
                const isFlex = device.name.toLowerCase().includes("freestyle") || devices[0].name.toLowerCase().includes("maxi")
                this.isFlex = isFlex
                if(device.name.toLowerCase().includes("freestyle")){
                  let param = {
                    'pump_type':'freestyle_flex',
                  }
                  await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
                  GetterSetter.setPumpName('flex')
                  this.device = device
                  this.callFlexData(devices[0])
                }else if(device.name.toLowerCase().includes("maxi")){
                  let param = {
                    'pump_type':'swing_maxi',
                  }
                  await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
                  this.device = devices[0]
                  GetterSetter.setPumpName('maxi')
                  this.callSwingMaxiData(devices[0])
                } else {
                  let param = {
                    'pump_type':'sonata',
                  }
                  await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
                  GetterSetter.setPumpName('sonata')
                  this.device = devices[0]
                  this.callSonata(devices[0])
                }
                const {id, localName, name} = devices[0]
                this.pumpList[index].device = {
                  id, localName, name
                }
                this.pumpList[index].isOnline = true
                // if(!isListEqual(scannedList,this.pumpList)) {
                  scannedPumpList(this.pumpList);
                // }
                this.props.setPumpType(isFlex)
                this.props.isPumpConnected(true)
              })
              .catch((error) => {
                // console.log('connection error ---- ', error)
              });
          }
        })
      })
  }

  connectToPump = async () => {
    console.log('connectToPump *******', this.deviceId)
    // if(this.isScannerRunning) {
      this.stopScanInterval()
    // }
    if(this.isConnectionIntervalRunning) {
      this.stopConnectionInterval()
    }
    const {scannedPumpList, pumps} = this.props
    // console.log('DeviceIdentifier == ', this.deviceId)
    let ar = [this.deviceId]
    this.isBluetoothActive && this.manager.devices(ar).then((devices) => {
        devices.length > 0 && devices[0].isConnected().then(async (res) => {
          console.log('connectToPump    IS connected = ', res)
            if(!this.isConnectionIntervalRunning) {
              this.startConnectionInterval(this.pumpList)
            }
          if (res) {
            console.log('device already connected - ', this.deviceId)
            const isFlex = devices[0].name.toLowerCase().includes("freestyle") || devices[0].name.toLowerCase().includes("maxi")
            this.isFlex = isFlex
            if(devices[0].name.toLowerCase().includes("freestyle")){
              let param = {
                'pump_type':'freestyle_flex',
              }
              await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
              GetterSetter.setPumpName('flex')
              this.device = devices[0]
              this.callFlexData(devices[0])
            }else if(devices[0].name.toLowerCase().includes("maxi")){
              let param = {
                'pump_type':'swing_maxi',
              }
              await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
              this.device = devices[0]
              GetterSetter.setPumpName('maxi')
              this.callSwingMaxiData(devices[0])
            }else{
              let param = {
                'pump_type':'sonata',
              }
              await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
              GetterSetter.setPumpName('sonata')
              this.device = devices[0]
              this.callSonata(devices[0])
            }
            this.props.setPumpType(isFlex)
          } else {
            devices[0].connect()
              .then((device) => {
                return device.discoverAllServicesAndCharacteristics()
              })
              .then(async (device) => {
                const isFlex = device.name.toLowerCase().includes("freestyle") || devices[0].name.toLowerCase().includes("maxi")
                this.isFlex = isFlex
                if(device.name.toLowerCase().includes("freestyle")){
                  let param = {
                    'pump_type':'freestyle_flex',
                  }
                  await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
                  GetterSetter.setPumpName('flex')
                  this.device = device
                  this.callFlexData(devices[0])
                }else if(device.name.toLowerCase().includes("maxi")){
                  let param = {
                    'pump_type':'swing_maxi',
                  }
                  await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
                  this.device = devices[0]
                  GetterSetter.setPumpName('maxi')
                  this.callSwingMaxiData(devices[0])
                }
                else{
                  let param = {
                    'pump_type':'sonata',
                  }
                  await analytics.logEvent(Constants.SUCCESSFUL_CONNECTION, param);
                  GetterSetter.setPumpName('sonata')
                  this.device = devices[0]
                  this.callSonata(devices[0])
                }
                // const {id,localName,name}=devices[0]
                // this.pumpList[index].device = {
                //   id, localName, name
                // }
                // this.pumpList[index].isOnline = true
                // scannedPumpList(this.pumpList)
                this.props.setPumpType(isFlex)
                this.props.isPumpConnected(true)
              })
              .catch((error) => {
                // console.log('connection error ---- ', error)
              });
          }
        })
    })
  }

  callFlexData(device) {
    console.log('callFlexDataCalled---- *** ** *** ** ** ** ** **')
    this.isFlex = true
    this.readFlexAllCharacterstics(device)
    this.getMD5Data(device)
  }

  getMD5Data(device){
    let buffer16Byte = [], customMac = ''
    console.log('ID ######### ',device.id);
    if(Platform.OS === 'ios'){
      customMac = this.pumpMacAddress+':'+mNextNonce
    }else{
      customMac = device.id+':'+mNextNonce
    }
    console.log('customMac === ', customMac);

    let a = MD5s(customMac)
    console.log('MD5 === ', a);
    let md5ByteArray = this.unpack(a)
    for(let i = 0; i<16; i++){
      buffer16Byte.push(md5ByteArray[i])
    }
    const buffer1 = new Buffer([129, 11, 1, 0])
    let buffer2 = Buffer(buffer16Byte)

    let newBuffer = Buffer.concat([buffer1, buffer2]);

    console.log('Final buffer === ', newBuffer.length, newBuffer);

    this.writeMD5AccessToPump(newBuffer, device)
  }

  getMD5DataSwingMaxi(device){
    let buffer16Byte = [], customMac = ''
    console.log('ID ######### ',device.id);
    if(Platform.OS === 'ios'){
      customMac = this.pumpMacAddress+':'+mNextNonce
    }else{
      customMac = device.id+':'+mNextNonce
    }
    console.log('customMac === ', customMac);

    let a = MD5s(customMac)
    console.log('MD5 === ', a);
    let md5ByteArray = this.unpack(a)
    for(let i = 0; i<16; i++){
      buffer16Byte.push(md5ByteArray[i])
    }
    const buffer1 = new Buffer([129, 11, 1, 0])
    let buffer2 = Buffer(buffer16Byte)

    let newBuffer = Buffer.concat([buffer1, buffer2]);

    console.log('Final buffer === ', newBuffer.length, newBuffer);

    this.writeMD5AccessToSwingMaxiPump(newBuffer, device)
  }

  unpack(str) {
    let bytes = []; // char codes
    let bytesv2 = []; // char codes

    for (let i = 0; i < str.length; ++i) {
      let code = str.charCodeAt(i);
      bytes = bytes.concat([code]);
      bytesv2 = bytesv2.concat([code & 0xff, code / 256 >>> 0]);
    }
    return bytes
  }


  writeMD5AccessToPump(buffer, device) {
    try {
      const base64String = buffer.toString('base64')
      console.log('base64String ----',base64String)
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
          this.writeToSetTimestampForFlex(device) // -- to set date time on flex pump
          // this.writeToGetBluetoothAllSessionFlex(device) // -- to get all offline sessions from the flex pump
          console.log('writeMD5AccessToPumpForFlex success ***&&** ', characteristic.value)
        }).catch((error) => {
        console.log("write writeMD5AccessToPumpForFlex = ", error)
      });
    }catch (e){
      console.log('writeMD5AccessToPumpForFlex e *****',e)

    }
  }

  writeMD5AccessToSwingMaxiPump(buffer, device) {
    try {
      const base64String = buffer.toString('base64')
      console.log('base64String ----',base64String)
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
          this.writeToSetTimestampForSwingMaxi(device) // -- to set date time on swing pump
          // this.writeToGetBluetoothAllSessionSwingMaxi(device) // -- to get all offline session from the swing pump
          console.log('writeMD5AccessToPumpForFlex success ***&&** ', characteristic.value)
        }).catch((error) => {
        console.log("write writeMD5AccessToPumpForFlex = ", error)
      });
    }catch (e){
      console.log('writeMD5AccessToPumpForFlex e *****',e)

    }
  }

  callSwingMaxiData(device) {
    console.log('callSwingDataCalled---- *** ** *** ** ** ** ** **')
    this.isFlex = true
    this.readSwingMaxiAllCharacterstics(device)
    this.getMD5DataSwingMaxi(device)
  }

  callSonata(device) {
    this.writeConfirmationBluetooth(device)
    this.writeToSetTimestampForSonata(device)
  }

  /**
   * This method is used to sync offline sessions for sonata
   */
  readAllSession() {
    const device = this.device
    this.sessionList = []
    let offlineTimeout;
    console.log('readAllSession called *****')
    this.subscriptionAllRecord = device.monitorCharacteristicForService(KeyUtils.SESSION_HISTORY_SERVICE_UUID,
      KeyUtils.SESSION_HISTORY_RECORDS_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          clearTimeout(offlineTimeout);
          if(!this.readingLastIndexForActiveSession) {
            console.log('monitorCharacteristicForService called *****')
            const session = Buffer.from(characteristic.value, 'base64');
            let sessionInd = session.readUInt16BE(0)
            console.log("All session === ===", sessionInd, this.isTimerRunning)
            this.sessionList.push(session)
            // if (!this.isTimerRunning) {
            //   this.isTimerRunning = true
            //   setTimeout(() => {
            //     if (this.sessionList.length > 0) {
            //       this.isActiveSessionSaved = false;
            //       this.convertBleDataToText(this.sessionList)
            //     } else {
            //       this.isTimerRunning = false
            //     }
            //   }, 3000)
            // }
            offlineTimeout = setTimeout(() => {
              if (!this.isTimerRunning) {
                this.isTimerRunning = true
                if(this.sessionList.length>0) {
                  this.isActiveSessionSaved = false;
                  this.convertBleDataToText(this.sessionList)
                }else{
                  this.isTimerRunning=false
                }
              }
            },1500);
          }

        } else {
          console.log("error", error)
        }
      })
  }

  /**
   * * To read all offline session's data from the pumps and post the data to the tracking api
   * **/
  async convertBleDataToText(sessionList) {
    console.log('convertBleDataToText called *****')
    console.log('this.sessionList.length *****########*****', sessionList.length)
    let list = []
    let lastIndex = 0
    const { selected_baby } = this.props
    this.isTimerRunning=false
    if (sessionList.length > 0 && selected_baby && selected_baby.babyId) {
      for (const e of sessionList) {
        const buffer = new Buffer(e);
        console.log(buffer);
        let statusFlags = {}
        let obj = {}

        let sessionIndex, timeStamp, duration, level = 1, rythem = 0, phaseLevel = 0, goalTime = 0
        if (this.isFlex) {
          sessionIndex = buffer.readUInt16LE(2)
          timeStamp = buffer.readUInt32LE(4);
          console.log(timeStamp,buffer.readUInt32LE(2),'timestamp for offline sessions');
          duration = buffer.readUInt16LE(8)
          level = (buffer.readUInt8(10) + 1)
          rythem = 0 //255
          let phase = buffer.readUInt8(12) //255
          phaseLevel = (phase == 255) ? 0 : 1
          //const goalTime = buffer.readUInt16BE(11)

          const flags = buffer.readUInt16LE(16);
          const switchTime = buffer.readUInt16LE(14);   // second byte
          //const secondData = JSON.parse(JSON.stringify(data)).data[1]
          statusFlags.sessionType = bits(switchTime, 0x00, 0x04)
          statusFlags.autoLetdown = ((switchTime & (0xffff)) == 0xffff)
          statusFlags.timestampInvalid = (flags & 0x800) != 0
        } else {
          sessionIndex = buffer.readUInt16BE(0)
          timeStamp = buffer.readUInt32BE(2)
          duration = buffer.readUInt16BE(6)
          level = buffer.readUInt8(8)
          // console.log("level", level)
          rythem = buffer.readUInt8(9)
          phaseLevel = buffer.readUInt8(10)
          goalTime = buffer.readUInt16BE(11)


          const data = buffer.readUInt16LE(13);
          //const secondData = JSON.parse(JSON.stringify(data)).data[1]
          const sessionTypes = bits(data, 0x00, 0x04)
          statusFlags.sessionType = sessionTypes
          const sessionAborted = bits(data, 0x04, 0x01)
          statusFlags.sessionAborted = convertNumberToBoolean(sessionAborted)
          const goalCompleted = bits(data, 0x05, 0x01)
          statusFlags.goalCompleted = convertNumberToBoolean(goalCompleted)
          const goalExtended = bits(data, 0x06, 0x01)
          statusFlags.goalExtended = convertNumberToBoolean(goalExtended)
          const autoLetdown = bits(data, 0x07, 0x01)
          statusFlags.autoLetdown = convertNumberToBoolean(autoLetdown)
          //const firstData = JSON.parse(JSON.stringify(data)).data[0]
          const leaksDetected = bits(data, 0x08, 0x01)
          statusFlags.leaksDetected = convertNumberToBoolean(leaksDetected)
          const timestampInvalid = bits(data, 0x09, 0x01)
          statusFlags.timestampInvalid = convertNumberToBoolean(timestampInvalid)
        }

        console.log('L.N 1065 sessionindex offline-- ', sessionIndex, ' <<<<- Last index from API ->>>> ', this.lastRecordIndex)
        /*******
         * "sessionindex" is the number value which we are getting from the pumps.
         * It is like an index of an array. Every session has it's own session index.
         * Here we are comparing the "this.lastRecordIndex" which we are getting from the get pumps api
         * with the "sessionindex" which we are getting from the pumps with read characteristics
         ********/
        if (sessionIndex > this.lastRecordIndex) {
          this.isOfflineSessionSyncingOfSwing = true
          lastIndex = parseInt(sessionIndex)
          this.props.sessionFromNewPump(false)
          let formattedDate = await appendTimeZone(moment(timeStamp * 1000).format("YYYY-MM-DDTHH:mm:ss"))
          console.log('Total duration---- ',duration)

          let getSeconds = `0${(duration % 60)}`.slice(-2)
          let minutes = `${Math.floor(duration / 60)}`
          let getMinutes = `0${minutes % 60}`.slice(-2)
          let durationInM = parseInt(getMinutes)
          let durationInS = parseInt(getSeconds)

          let dTotal = durationInS + (60 * durationInM);

          let pumpName = ''
          if(GetterSetter.getPumpName()==='sonata')
            pumpName = 'sonata'
          else if(GetterSetter.getPumpName()==='maxi')
            pumpName = 'swing_maxi'
          else if(GetterSetter.getPumpName()==='flex')
            pumpName = 'freestyle_flex'

          let obj1 = {
            'pump_tracking_type':'connected',
            'pump_type':pumpName,
            'ending_vacuum_level':parseInt(level),
            'duration':toHHMMSS(dTotal),
            'sync_type':'offline',
          }
          await analytics.logEvent(Constants.PUMP_TRACKING, obj1);
          let obj2 = {'tracking_type':Constants.SAVE_PUMPING_TRACKING}
          await analytics.logEvent(Constants.TRACKINGS, obj2);

          // console.log('Total converted duration---- ', dTotal)
          obj = {
            "babyId": selected_baby.babyId,
            "id": uuidV4(),
            "trackingType": KeyUtils.TRACKING_TYPE_PUMPING,
            "trackAt": formattedDate,
            "durationLeft": dTotal / 2,
            "durationRight": dTotal / 2,
            "durationTotal": parseInt(dTotal),
            "confirmed": true,
            "remark": '',
            "quickTracking": true,
            "isBadSession": false,
            "lastBreast": 3
          }
          obj['pumpId'] = this.props.pumpId
          obj['pumpRecordId'] = parseInt(sessionIndex)
          obj['deviceLevel'] = parseInt(level)
          obj['devicePhase'] = parseInt(phaseLevel)
          obj['statusFlags'] = statusFlags
          obj['amountLeft'] = 0
          obj['amountLeftUnit'] = this.state.unit
          obj['amountRight'] = 0
          obj['amountRightUnit'] = this.state.unit
          obj['amountTotal'] = 0
          obj['amountTotalUnit'] = this.state.unit
          if(!this.isFlex) {
            obj['devicePattern'] = parseInt(rythem)
            obj['goalTime'] = parseInt(goalTime)
          }
          list.push(obj)
      }
    }

      if (list.length > 0) {
        let uniqList = list.filter(
          (v, i, a) => a.findIndex(t => t.pumpRecordId === v.pumpRecordId) === i
        );
        console.log('uniqList == ', uniqList.length)
          AsyncStorage.getItem(KeyUtils.USER_NAME).then(async(username) => {
            if (username != null) {
              // const {realmDb} = this.state
              let realmDb = await getRealmDb()
              let myItems = realmDb.objects('Tracking');
              let arr = JSON.parse(JSON.stringify(myItems))
              arr = arr.filter((e) => {
                return e.userId === username
              })
              let isDuplicate = false
              for (let i = uniqList.length - 1; i >= 0; i--) {
                for (let j = 0; j < arr.length; j++) {
                  if (uniqList[i] && (uniqList[i].pumpRecordId === arr[j].pumpRecordId) && (uniqList[i].pumpId === arr[j].pumpId)) {
                    uniqList.splice(i, 1);
                  }
                }
              }
              console.log('uniqList after splice == ', uniqList.length)
              this.tracingList = uniqList
              let ll = uniqList.map((e) => ({ ...e, isSync: false, userId: username }))
              createAllTrackedItems(realmDb, ll).then((r) => {
                //console.log('r--', r)
              })
              this.trackingList = ll
              const { isInternetAvailable } = this.props
              if (isInternetAvailable) {
                if (uniqList.length > 0) {
                  let json = {
                    trackings: uniqList,
                  };
                  AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'true')
                  AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
                  AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, '')
                  AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
                  AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'false')
                  AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
                  AsyncStorage.setItem(KeyUtils.IS_RIGHT_TIMER_STARTED, 'false')
                  AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, '')
                  AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, '')
                  AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
                  console.log("Offline Tracking api request", JSON.stringify(json))
                  this.setState({ isLoading: true })
                  this.sessionList = []
                  GetterSetter.setLastRecordIndex(lastIndex)
                  this.lastRecordIndex = lastIndex
                  this.props.trackingApi(json)
                }
              }

            }
          })
        }

    }
  }

  readFlexAllCharacterstics(dd) {
    const device = this.device
    const {showPumpOffAlert} = this.state
    let _timer=0, count = 0

    //All
    //timer : 10 => [129, 10, 0, 4, 0, 0, 0] -127
    //pumpLevel : 9 => [129, 9, 3]
    //rhythemLevel : no (sonata normal)
    //phaseLevel : 7 => [129, 7, 255] and [129, 7, 254]
    //goalTime : no (we can't set)
    //deviceState : 3 => [129, 3, 2] (stVacuumOff : 0x00, stVacuumOn : 0x01, stVacuumPaused: 0x02, stPowerOff : 0x03)
    //deviceAlertState (airleak (no), battery low (<5%)) : no
    //batteryCharging : 10 => [0, 10, 4, 77(%charged)] (0 means not charging 4 means charging)
    //All record
    //{"data": [131(classId), 17(cmdId), 6(recordIndex), 0, 47, 4, 0, 0, 22, 0, 0, 255, 255, 255, 74, 8, 0, 2, 0, 1], "type": "Buffer"}
    //{"data": [131, 17, 37, 0, 197, 0, 0, 0, 9, 0, 2, 255, 255, 255, 6, 8, 2, 2, 0, 2], "type": "Buffer"}
    // End - {"data": [131, 16, 6, 0, 1, 1], "type": "Buffer"}
    //Active session
    //[131, 23, 41(recordIndex), 0, 47, 2, 0, 0, 0]
    this.subscriptionTimer = device.monitorCharacteristicForService(KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
      KeyUtils.CHARACTERISTIC_MDC_UPSTREAM, (error, characteristic) => {
        if (!error) {
          try {
            const flexData = Buffer.from(characteristic.value, 'base64');
            // console.log('flexData ==== ', flexData)
            const jsonData = JSON.parse(JSON.stringify(flexData))
            const array = jsonData.data
            if (array.length > 0) {
              const type = array[0]
              const cmdType = array[1]
              if (type === 129) {
                if (cmdType === 10) {
                  const buffer = new Buffer(array)
                  _timer = buffer.readUInt16LE(3)
                  this.pumpOffCount = 0
                  this.readFlexData['timer'] = _timer
                  this.pumpTime = _timer
                  this.props.isPumpRunning(true)
                } else if (cmdType === 7) {
                  array[2] === 255 ? this.readFlexData['phaseLevel'] = 0 : this.readFlexData['phaseLevel'] = 1
                  array[2] === 255 ? phaseLevel = 0 : phaseLevel = 1
                } else if (cmdType === 9) {
                  this.readFlexData['pumpLevel'] = array[2] + 1
                  pumpLevel = array[2] + 1
                } else if (cmdType === 3) {
                  const _deviceState = array[2]
                  if (this.pumpOffCount == 0 && (_deviceState == 0 || _deviceState == 3) && _timer > 0) {
                    // console.log(' LN 1206 session Off off---',_deviceState)
                    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
                    this.props.isPumpRunning(false)
                    this.props.pumpSessionActive(false)
                    this.props.connectionPause(false)
                   // this.getIndexAndFlagData()
                    this.readFlexData['deviceState'] = _deviceState
                  } else if (_deviceState == 1) {
                    this.props.pumpingCount(0)
                    //TODO
                    //this.props.isPumpRunning(true)
                    this.isOnlineSessionStarted = true;
                    this.props.pumpSessionActive(true)
                    GetterSetter.setApiCallCount(0)
                    this.props.sessionSaveFromPumping(false)
                    this.props.connectionPause(false)
                    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'true')
                    this.readFlexData['deviceState'] = _deviceState
                  } else if (_deviceState == 2) {
                    this.props.pumpingCount(0)
                    this.props.isPumpRunning(false)
                    this.props.pumpSessionActive(true)
                    this.props.connectionPause(true)
                    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'true')
                    this.readFlexData['deviceState'] = _deviceState
                  } else {
                    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
                    this.props.connectionPause(false)
                    this.props.isPumpRunning(false)
                    this.props.pumpSessionActive(false)
                    this.readFlexData['deviceState'] = _deviceState
                  }
                }
              } else if (type === 131) {
                //console.log('type----cmdType---',cmdType)
                if (cmdType === 23) {  // active session only
                console.log('cmdType 23  called *********** ',cmdType,array)
                  let inde = flexData.readUInt16LE(2)
                  console.log('-- Index flex---- ',inde)
                  const activeSessionIndex = flexData.readUInt16LE(2)

                  //const activeSessionIndex = array[2]
                  console.log('LN 1238 sessionIndex', activeSessionIndex)
                  let value = valueToByte(activeSessionIndex);
                  let index = parseInt(activeSessionIndex)
                  let firstByte = index & 0XFF
                  let secondByte = (index & 0XFF00) >> 8
                  this.props.setSessionIndex(activeSessionIndex)
                  //TODO
                  GetterSetter.setLastRecordIndex(activeSessionIndex)
                  this.readFlexData['sessionIndex'] = array[2]
                  console.log('LN 1270 sessionIndex', activeSessionIndex, array[array.length - 1], array, array.length, value)

                  if (array[array.length - 1]) {
                    this.props.isPumpRunning(false)
                    this.isActiveFlexSessionWrite=true;
                    this.PUMP_OPERATOR_LAST_COMPLATE_RECORD_FLEX = [131, 16, 1, 3, 0, 0, 0, secondByte, firstByte];
                    console.log('LN 1276 sessionIndex', activeSessionIndex)
                    this.writeToGetBluetoothLastSession20ByteDataFlex(device)
                  }
                } else if (cmdType === 17) {  // all offline records  not the running record
                  //console.log('cmdType Offline-----',cmdType)
                  const buffer = new Buffer(array)
                  let flexSessionIndex = buffer.readUInt16LE(2)
                  // console.log('activeSessionData buffer --',flexSessionIndex)
                  this.flexDataList.push(array)
                }else if (cmdType===16){
                  const buffer = new Buffer(this.flexDataList[this.flexDataList.length-1])
                  let flexSessionIndex = buffer.readUInt16LE(2)
                  console.log('cmdType 16 calledd -----',buffer,this.isActiveFlexSessionWrite,this.isOnlineSessionStarted)
                  //this.readLastSessionFlex()
                  if (this.isActiveFlexSessionWrite){
                    this.isActiveFlexSessionWrite=false
                    this.getIndexAndFlagData()
                    /*
                    * added this condition added because cmdtype 16 is getting called when we connect with pump and then click on it's power button.
                    * So api is getting called with with 0 values. (This happens only for flex)
                    * */
                  /*  if(this.isOnlineSessionStarted) {
                      this.setState({ isLoading: true })
                      this.getIndexAndFlagData()
                    }else{
                      //TODO Comment
                      //this.setState({ isLoading: false })
                    }*/
                  }else{

                    this.convertBleDataToText(this.flexDataList)
                  }
                }
              } else if (type === 0 && cmdType === 10) {
                array[2] === 4 ? this.readFlexData['batteryCharging'] = 1 : this.readFlexData['batteryCharging'] = 0
                const batteryLevel = array[3]
                this.readFlexData['batteryLevel'] = array[3]
                if (batteryLevel < 5 && this.batteryAlertCount == 0) {
                  this.batteryAlertCount++
                  this.readFlexData['battery_level'] = batteryLevel + '%'
                } else {
                  this.readFlexData['battery_level'] = batteryLevel + '%'
                }
              }
            }
            // console.log('READ FLEX ALL CHAR ------------------',this.readFlexData)
            this.props.flexPumpData(this.readFlexData)
           // const  deviceName=device.name
           //device.manufacturerData && this.props.getPumpId(getManufacturerData(device.manufacturerData,deviceName))
          }catch (e){
            // console.log('error ---- '+JSON.stringify(e))
          }
        }
      })


  }

  readSwingMaxiAllCharacterstics(dd) {
    const device = this.device || dd
    const {showPumpOffAlert} = this.state
    let _timer=0, count = 0;
    //All
    //timer : 10 => [129, 10, 0, 4, 0, 0, 0] -127
    //pumpLevel : 9 => [129, 9, 3]
    //rhythemLevel : no (sonata normal)
    //phaseLevel : 7 => [129, 7, 255] and [129, 7, 254]
    //goalTime : no (we can't set)
    //deviceState : 3 => [129, 3, 2] (stVacuumOff : 0x00, stVacuumOn : 0x01, stVacuumPaused: 0x02, stPowerOff : 0x03)
    //deviceAlertState (airleak (no), battery low (<5%)) : no
    //batteryCharging : 10 => [0, 10, 4, 77(%charged)] (0 means not charging 4 means charging)
    //All record
    //{"data": [135(classId), 17(cmdId), 6(recordIndex), 0, 47, 4, 0, 0, 22, 0, 0, 255, 255, 255, 74, 8, 0, 2, 0, 1], "type": "Buffer"}
    //{"data": [135, 17, 37, 0, 197, 0, 0, 0, 9, 0, 2, 255, 255, 255, 6, 8, 2, 2, 0, 2], "type": "Buffer"}
    // End - {"data": [135, 16, 6, 0, 1, 1], "type": "Buffer"}
    //Active session
    //[135, 23, 41(recordIndex), 0, 47, 2, 0, 0, 0]
    this.subscriptionTimer = device.monitorCharacteristicForService(KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
      KeyUtils.CHARACTERISTIC_MDC_UPSTREAM, (error, characteristic) => {
        if (!error) {
          try {
            const swingData = Buffer.from(characteristic.value, 'base64');
            console.log('buffer ----- ', swingData)
            const jsonData = JSON.parse(JSON.stringify(swingData))
            const array = jsonData.data
            if (array.length > 0) {
              const type = array[0]
              const cmdType = array[1]
              if (type === 129) {
                if (cmdType === 10) {
                  const buffer = new Buffer(array)
                  _timer = buffer.readUInt16LE(3)
                  this.pumpOffCount = 0
                  this.readFlexData['timer'] = _timer
                  this.pumpTime = _timer
                  this.props.isPumpRunning(true)
                } else if (cmdType === 7) {
                  array[2] === 255 ? this.readFlexData['phaseLevel'] = 0 : this.readFlexData['phaseLevel'] = 1
                  array[2] === 255 ? phaseLevel = 0 : phaseLevel = 1
                } else if (cmdType === 9) {
                  this.readFlexData['pumpLevel'] = array[2] + 1
                  pumpLevel = array[2] + 1
                } else if (cmdType === 3) {
                  const _deviceState = array[2]
                  if (this.pumpOffCount == 0 && (_deviceState == 0 || _deviceState == 3) && _timer > 0) {
                    // console.log(' LN 1206 session Off off---',_deviceState)
                    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
                    this.props.isPumpRunning(false)
                    this.props.pumpSessionActive(false)
                    this.props.connectionPause(false)
                   // this.getIndexAndFlagData()
                    this.readFlexData['deviceState'] = _deviceState
                  } else if (_deviceState == 1) {
                    this.props.pumpingCount(0)
                    //TODO
                    //this.props.isPumpRunning(true)
                    this.isOnlineSessionStarted = true;
                    this.props.pumpSessionActive(true)
                    GetterSetter.setApiCallCount(0)
                    this.props.sessionSaveFromPumping(false)
                    this.props.connectionPause(false)
                    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'true')
                    this.readFlexData['deviceState'] = _deviceState
                  } else if (_deviceState == 2) {
                    this.props.pumpingCount(0)
                    this.props.isPumpRunning(false)
                    this.props.pumpSessionActive(true)
                    this.props.connectionPause(true)
                    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'true')
                    this.readFlexData['deviceState'] = _deviceState
                  } else {
                    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
                    this.props.connectionPause(false)
                    this.props.isPumpRunning(false)
                    this.props.pumpSessionActive(false)
                    this.readFlexData['deviceState'] = _deviceState
                  }
                }
              } else if (type === 135) {
                //console.log('type----cmdType---',cmdType)
                if (cmdType === 23) {  // active session only
                console.log('cmdType 23  called *********** ',cmdType,this.isOfflineSessionSyncingOfSwing)
                  if(!this.isOfflineSessionSyncingOfSwing) {
                    console.log(GetterSetter.getLastRecordIndex(),' <<<<***********>>>> ',this.lastRecordIndex)
                    let inde = swingData.readUInt16LE(2);
                    console.log('-- Index flex---- ', inde);
                    console.log('timsatmp in active sessions',swingData.readUInt32LE(4));
                    const activeSessionIndex = swingData.readUInt16LE(2);
                    //const activeSessionIndex = array[2]
                    console.log('LN 1238 sessionIndex', activeSessionIndex);
                    let value = valueToByte(activeSessionIndex);
                    let index = parseInt(activeSessionIndex);
                    let firstByte = index & 0XFF;
                    let secondByte = (index & 0XFF00) >> 8;
                    this.props.setSessionIndex(activeSessionIndex);
                    //TODO
                    GetterSetter.setLastRecordIndex(activeSessionIndex);
                    this.readFlexData['sessionIndex'] = array[2];
                    console.log('LN 1270 sessionIndex', activeSessionIndex, array[array.length - 1], array, array.length, value);

                    if (array[array.length - 1]) {
                      this.props.isPumpRunning(false);
                      this.isActiveFlexSessionWrite = true;
                      this.PUMP_OPERATOR_LAST_COMPLATE_RECORD_FLEX = [135, 16, 1, 3, 0, 0, 0, secondByte, firstByte];
                      console.log('LN 1276 sessionIndex', activeSessionIndex);
                      this.writeToGetBluetoothLastSession20ByteDataSwingMaxi(device);
                    }
                  }
                } else if (cmdType === 17) {  // all offline records  not the running record
                  //console.log('cmdType Offline-----',cmdType)
                  const buffer = new Buffer(array)
                  let flexSessionIndex = buffer.readUInt16LE(2)
                  // console.log('activeSessionData buffer --',flexSessionIndex)
                  this.flexDataList.push(array)
                }else if (cmdType===16){
                  const buffer = new Buffer(this.flexDataList[this.flexDataList.length-1])
                  let SwingSessionIndex = buffer.readUInt16LE(2);
                  console.log('cmdType 16 calledd -----',buffer,this.isActiveFlexSessionWrite,this.isOnlineSessionStarted)
                  if (this.isActiveFlexSessionWrite){
                    this.isActiveFlexSessionWrite=false
                    this.getIndexAndFlagData()
                  }else{
                    this.convertBleDataToText(this.flexDataList)
                  }
                }
              } else if (type === 0 && cmdType === 10) {
                array[2] === 4 ? this.readFlexData['batteryCharging'] = 1 : this.readFlexData['batteryCharging'] = 0
                const batteryLevel = array[3]
                this.readFlexData['batteryLevel'] = array[3]
                if (batteryLevel < 5 && this.batteryAlertCount == 0) {
                  this.batteryAlertCount++
                  this.readFlexData['battery_level'] = batteryLevel + '%'
                } else {
                  this.readFlexData['battery_level'] = batteryLevel + '%'
                }
              }
            }
            // console.log('READ FLEX ALL CHAR ------------------',this.readFlexData)
            this.props.flexPumpData(this.readFlexData)
           // const  deviceName=device.name
           //device.manufacturerData && this.props.getPumpId(getManufacturerData(device.manufacturerData,deviceName))
          }catch (e){
            // console.log('error ---- '+JSON.stringify(e))
          }
        }
      })


  }

  writeToGetBluetoothLastSessionFlex(device) {
    try {
      const base64String2 = Buffer.from(KeyUtils.PUMP_OPERATOR_LAST_RECORD_FLEX, 'hex').toString('base64');
      const base64String = base64String2
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
          console.log('writeToGetBluetoothLastSessionFlex **** ', "SuccessFully writed ** **",characteristic.value)
        }).catch((error) => {
        console.log("writeToGetBluetoothLast flex session error = ", error)
      });
    } catch (e) {
      console.log("writeToGetBluetoothLast Catch = ", e)
    }
  }

  writeToGetBluetoothLastSession20ByteDataFlex(device) {
    try {
      console.log('writeToGetBluetoothLastSession20ByteDataFlex ***&&** ', "Called")
      const base64String2 = Buffer.from(this.PUMP_OPERATOR_LAST_COMPLATE_RECORD_FLEX, 'hex').toString('base64');
      const base64String = base64String2
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
            //this.readLastSessionFlex()
        }).catch((error) => {
        console.log("writeToGetBluetoothLastSession20ByteDataFlex error = ", error)
      });
    }catch (e){
      console.log("write writeToGetBluetoothLastSession20ByteDataFlex  catch = ", e)
    }
  }
  writeToGetBluetoothLastSession20ByteDataSwingMaxi(device) {
    try {
      console.log('writeToGetBluetoothLastSession20ByteDataSwingMaxi ***&&** ', "Called")
      const base64String2 = Buffer.from(this.PUMP_OPERATOR_LAST_COMPLATE_RECORD_FLEX, 'hex').toString('base64');
      const base64String = base64String2
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
            //this.readLastSessionFlex()
        }).catch((error) => {
        console.log("writeToGetBluetoothLastSession20ByteDataSwingMaxi error = ", error)
      });
    }catch (e){
      console.log("write writeToGetBluetoothLastSession20ByteDataSwingMaxi  catch = ", e)
    }
  }

  /**
   * This method is used to write last index on pump to
   * sync sessions on the basis of that index
   */
  writeToGetBluetoothAllSession() {
    console.log('writeToGetBluetoothAllSession called *****',this.lastRecordIndex)
    const device = this.device
    let index = parseInt(this.lastRecordIndex)
    let firstByte = index & 0XFF
    let secondByte = (index & 0XFF00) >> 8

    console.log('BYTES--->>>', firstByte, secondByte,index)
    let PUMP_OPERATOR_LAST_RECORD = [1, 3, 1, 0, 0, secondByte, firstByte] //-- imp ##### to get offline session on the basis of last record index

    console.log('PUMP_OPERATOR_LAST_RECORD ---- ', PUMP_OPERATOR_LAST_RECORD)
    console.log('hex buffer --- ', Buffer.from(PUMP_OPERATOR_LAST_RECORD, 'hex'))
    const buff = Buffer(PUMP_OPERATOR_LAST_RECORD)
    const base64String = buff.toString('base64');
    // const base64String2 = Buffer.from(KeyUtils.PUMP_OPERATOR_ALL_RECORD, 'hex').toString('base64');
    // const base64String = base64String2
    device.writeCharacteristicWithResponseForService(
      KeyUtils.SESSION_HISTORY_SERVICE_UUID,
      KeyUtils.RACP_CHARACTERISTIC_UUID,
      base64String)
      .then((characteristic) => {
        console.log("writeToGetBluetoothAllSession   ", "Write Successfully",characteristic.value)
        this.readAllSession()
      }).catch((error) => {
      console.log("writeToGetBluetoothAllSession error = ", error)
    });
  }

  /*
  * this function is to write to get all offline session from the flex pump
  * */
  writeToGetBluetoothAllSessionFlex(device) {
    try {
      console.log('writeToGetBluetoothAllSessionFlex--- U****', "called",this.lastRecordIndex)
      let value = valueToByte(this.lastRecordIndex);
      console.log('writeToGetBluetoothAllSessionFlex--- U****', "called",value)
      let index = parseInt(this.lastRecordIndex)
      let firstByte = index & 0XFF
      let secondByte = (index & 0XFF00) >> 8
      let apiSavedLastRecordIndex = [131, 16, 1, 3, 0, 0, 0, secondByte, firstByte];
      console.log('writeToGetBluetoothAllSessionFlex ***&&** ', "Called")
      const base64String = Buffer.from(apiSavedLastRecordIndex, 'hex').toString('base64');
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
          console.log('writeToGetBluetoothAllSessionFlex ***&&** ', characteristic.value)
        }).catch((error) => {
        console.log("writeToGetBluetoothAllSessionFlex error = ", error)
      });
    } catch (e) {
      console.log("writeToGetBluetoothAllSessionFlex catch &*****", e)
    }
  }


  /*
  * this function is to write to get all offline session from the Swing pump
  * */
  writeToGetBluetoothAllSessionSwingMaxi(device) {
    try {
      console.log('writeToGetBluetoothAllSessionSwingMaxi--- ****', "called",this.lastRecordIndex)
      let index = parseInt(this.lastRecordIndex)
      let firstByte = index & 0XFF
      let secondByte = (index & 0XFF00) >> 8
      let apiSavedLastRecordIndex = [135, 16, 1, 3, 0, 0, 0, secondByte, firstByte];
      const base64String = Buffer.from(apiSavedLastRecordIndex, 'hex').toString('base64');
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
          console.log('writeToGetBluetoothAllSessionSwingMaxi ***&&** ', characteristic.value)
          let buf = Buffer.from(characteristic.value, 'base64')
          console.log('writeToGetBluetoothAllSessionSwingMaxi buffer ***&&** ', buf)
          //this.readSwingMaxiAllCharacterstics(device)
        }).catch((error) => {
        console.log("writeToGetBluetoothAllSessionSwingMaxi error = ", error)
      });
    } catch (e) {
      console.log("writeToGetBluetoothAllSessionSwingMaxi catch &*****", e)
    }
  }

  /*
  * this function is to write current date on the pump
  * */
  writeToSetTimestampForFlex(device) {
    try {
      console.log('writeToSetTimestampForFlex called *****')
      console.log('Current date ------ for RTC ********* ',moment(),moment().unix());
      let currentDate = moment().unix();
      let timeStamp = [
        131,
        9,
        currentDate & 0x000000FF,
        (currentDate & 0x0000FF00) >>  8,
        (currentDate & 0x00FF0000) >> 16,
        (currentDate & 0xFF000000) >> 24]

      console.log('timestamp ---for RTC ---- ',timeStamp);
      const base64String2 = Buffer.from(timeStamp, 'hex').toString('base64');
      const base64String = base64String2;
      console.log('base64String ----',base64String)
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
          this.writeToGetBluetoothAllSessionFlex(device) // -- to get all offline sessions from the flex pump
          console.log('writeToSetTimestampForFlex success ***&&** ', characteristic.value)
        }).catch((error) => {
      console.log("write ToSetTimestampForFlex = ", error)
      // let buf = Buffer.from(result.value, 'base64')
      // console.log('writeToSetTimestampForFlex buffer success ***&&** ', buf);
      });
    }catch (e){
      console.log('writeToSetTimestampForFlex e *****',e)

    }
  }

  /*
  * this function is to write current date on the pump
  * */
  writeToSetTimestampForSwingMaxi(device) {
    try {
      console.log('writeToSetTimestampForSwingMaxi called *****')
      console.log(moment(),moment().unix());
      let currentDate = moment().unix();
      let timeStamp = [
        135,
        9,
        currentDate & 0x000000FF,
        (currentDate & 0x0000FF00) >>  8,
        (currentDate & 0x00FF0000) >> 16,
        (currentDate & 0xFF000000) >> 24]
      console.log('timestamp ---',timeStamp);
      const base64String2 = Buffer.from(timeStamp, 'hex').toString('base64');
      const base64String = base64String2;
      console.log('base64String2 ----',base64String2)
      device.writeCharacteristicWithResponseForService(
        KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
        KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
        base64String)
        .then((characteristic) => {
          console.log('writeToSetTimestampForSwingMaxi success ***&&** ', characteristic.value)
          this.writeToGetBluetoothAllSessionSwingMaxi(device)
        }).catch((error) => {
        console.log("writeToSetTimestampForSwingMaxi catch = ", error)
      });
    }catch (e){
      console.log('writeToSetTimestampForSwingMaxi error ***** ',e)

    }
  }
  async readLastSessionFlex() {  // Active Session Index
    let flexArray = this.flexDataList
    try {
      console.log('readLastSessionFlex try ----', this.flexDataList.length)
      if (this.flexDataList.length > 0) {
        for (const e of flexArray) {
          const buffer = new Buffer(e)
          // console.log('activeSessionData buffer --',JSON.stringify(buffer))
          let flexSessionIndex = buffer.readUInt16LE(2)
          const timeStamp = buffer.readUInt32LE(4)
          let formattedDate = await appendTimeZone(moment(timeStamp * 1000).format("YYYY-MM-DDTHH:mm:ss"))
          //console.log('formattedDate----', formattedDate)

          const flags = buffer.readUInt16LE(16)
          const timestampInvalid = (flags & 0x800) != 0


          statusFlags.timestampInvalid = convertNumberToBoolean(timestampInvalid)

          //console.log('timeStampInvalid-----',flags,timestampInvalid,convertNumberToBoolean(timestampInvalid))

        }
        let activeSessionData = flexArray.length > 0 && flexArray[this.flexDataList.length - 1]
        const buffer = new Buffer(activeSessionData)
        // console.log('activeSessionData buffer --',JSON.stringify(buffer))
        sessionIndex = buffer.readUInt16LE(2)
        //console.log('Active L N 1398 --sessionIndex FLEX -- ', sessionIndex)
        const timeStamp = buffer.readUInt32LE(4)
        // console.log("timeStamp", timeStamp)
        const duration = buffer.readUInt16LE(8)
        const level = buffer.readUInt8(10)
        const rythem = buffer.readUInt8(11) //255
        const phase = buffer.readUInt8(12) //255
        //const goalTime = buffer.readUInt16BE(11)

        //statusFlags.sessionType = 1

        const switchTime = buffer.readUInt16LE(14);   // second byte
        //const secondData = JSON.parse(JSON.stringify(data)).data[1]
        statusFlags.sessionType = bits(switchTime, 0x00, 0x04)
        statusFlags.autoLetdown = ((switchTime & (0xffff)) == 0xffff)

        const flags = buffer.readUInt16LE(16);
        statusFlags.timestampInvalid = (flags & 0x800) != 0
        this.readFlexData['statusFlags'] = statusFlags
        this.props.flexPumpData(this.readFlexData)
        // this.props.setSessionIndex(sessionIndex)
        console.log('L N 1412  Session Index--', sessionIndex, GetterSetter.getLastRecordIndex())

      }
    } catch (e) {
      console.log('readLastSessionFlex Catch ----', e)

    }

  }
  /*
  * this function is to read all offline session from the flex pump
  * */
  // readAllSessionFlex() {
  //   this.sessionList = []
  //   const device = this.device
  //   //All record
  //   //{"data": [131(classId), 17(cmdId), 6(recordIndex), 0, 47, 4, 0, 0, 22, 0, 0, 255, 255, 255, 74, 8, 0, 2, 0, 1], "type": "Buffer"}
  //   //{"data": [131, 17, 37, 0, 197, 0, 0, 0, 9, 0, 2, 255, 255, 255, 6, 8, 2, 2, 0, 2], "type": "Buffer"}
  //   // End - {"data": [131, 16, 6, 0, 1, 1], "type": "Buffer"}
  //   this.subscriptionAllRecord = device.monitorCharacteristicForService(KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
  //     KeyUtils.CHARACTERISTIC_MDC_UPSTREAM, (error, characteristic) => {
  //       if (!error) {
  //         const flexData = Buffer.from(characteristic.value, 'base64');
  //         const jsonData = JSON.parse(JSON.stringify(flexData))
  //         const array = jsonData.data
  //         if(array.length > 0 ){
  //           const type = array[0]
  //           const cmdType = array[1]
  //           if(type === 131){
  //             if(cmdType === 16){
  //               if (!this.isTimerRunning) {
  //                 this.isTimerRunning = true
  //                 if (this.isOfflineSession) { //--- If online session is ongoing then no need to sync offline sessions
  //                   this.convertBleDataToText(this.sessionList) // -- To get all data from pump and hit tracking api along with all the offline data as an array
  //                 }
  //               }
  //             }
  //             else if(cmdType === 17){
  //               this.sessionList.push(flexData)
  //             }
  //           }
  //         }
  //       }
  //     })
  // }

  writeToGetBluetoothLastSession() {
    const device = this.device
    try {
      console.log("writeToGetBluetoothLastSession ****","called",this.activeSessionId )
      if (this.activeSessionId) {
        this.readingLastIndexForActiveSession = true
        let value = valueToByte(this.activeSessionId);
        console.log('write active session ---- ', this.activeSessionId)

        let firstByte = this.activeSessionId & 0XFF
        let secondByte = (this.activeSessionId & 0XFF00) >> 8

        console.log('BYTES', firstByte, secondByte)
        let PUMP_OPERATOR_LAST_RECORD = [1, 3, 1, 0, 0, secondByte, firstByte] //-- imp ##### manage last recorded index and pass here in the case of offline sessions

        console.log('PUMP_OPERATOR_LAST_RECORD ---- ', PUMP_OPERATOR_LAST_RECORD)
        console.log('hex buffer --- ', Buffer.from(PUMP_OPERATOR_LAST_RECORD, 'hex'))
        const buff = Buffer(PUMP_OPERATOR_LAST_RECORD)
        const base64String = buff.toString('base64');
        device.writeCharacteristicWithResponseForService(
          KeyUtils.SESSION_HISTORY_SERVICE_UUID,
          KeyUtils.RACP_CHARACTERISTIC_UUID,
          base64String)
          .then((characteristic) => {
            console.log("writeToGetBluetoothLastSession  *********", "  Write Successfully")
            this.readLastSession()
          }).catch((error) => {
          console.log("writeToGetBluetoothLastSession session error = ", error)
        });
      }
    } catch (e) {
      console.log("writeToGetBluetoothLastSession Exception = ", e)
    }
  }

  /**
   * This method is used to enable Bluetooth icon on Pump
   * @param device
   */
  writeConfirmationBluetooth(device) {
    try {
      let serviceId = ''
      if(device.name.toLowerCase().includes("freestyle")) {
        serviceId = KeyUtils.MEDELA_MIDIAS_SERICE_UUID_FLEX
      }else{
        serviceId = KeyUtils.MEDELA_MIDIAS_SERICE_UUID_SONATA
      }
      console.log('LN 1567 writeConfirmationBluetooth *******')
      const base64String = Buffer.from(KeyUtils.SONATA_PAIRING_CONFIRMATION_MAGIC_NUMBER, 'hex').toString('base64');
      device.writeCharacteristicWithResponseForService(
        serviceId,
        KeyUtils.MEDELA_MIDIAS_CHARACTERISTIC_UUID,
        base64String)
        .then((characteristic) => {
          console.log("write sonata confirm--- ", characteristic.value)
          this.readAllCharacterstics(device)
        }).catch((error) => {
        console.log("write characteristic error = ", error)
      });
    } catch (e) {
      console.log('Bluetooth icon write error - ', e)
    }
  }

  /**
   * This method is used to set current date and time on pump
   * @param device
   * @returns {Promise<void>}
   */
  async writeToSetTimestampForSonata(device) {
    try {
      console.log('writeToSetTimestampForSonata called *****')
      let currentDate = await appendTimeZone(new Date())
      console.log('time currentDate --- ', currentDate)

      let time = new Date().getTime();
      let seconds = parseInt(time / 1000);
      const buffer = new Buffer(4)
      buffer.writeUInt32BE(seconds);

      const base64String = buffer.toString('base64')
      device.writeCharacteristicWithResponseForService(
        KeyUtils.TIME_SERVICE_UUID,
        KeyUtils.TIME_CHARACTERISTICS_UUID,
        base64String)
        .then((characteristic) => {
          console.log('writeToSetTimestampForSonata ---- ', "Write Successfully")
          this.writeToGetBluetoothAllSession()
        }).catch((error) => {
        console.log("write session error = ", error)
      });
    } catch (e) {
      console.log("writeToSetTimestampForSonata Exception = ", e)
    }
  }

  /**
   * This method is used to return pump details like battery
   * @param device
   */
  readAllCharacterstics(device) {
    const {showPumpOffAlert, showPumpBatteryAlert, timer} = this.state
    const {sonataPumpData} = this.props
    console.log('readAllCharacterstics****')
    const _this = this
    //Read last record index
    this.subscriptionActiveSession = device.monitorCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_RECORD_INDEX_UUID, (error, characteristic) => {
        if (!error) {
          const activeSessionData = Buffer.from(characteristic.value, 'base64');
          _this.activeSessionId = parseInt(toHexString(activeSessionData), 16).toString()
          console.log("LN 1624 monitor case active session index-- ", _this.activeSessionId)
          GetterSetter.setLastRecordIndex(_this.activeSessionId)
          // this.lastRecordIndex = _this.activeSessionId
          this.isOnlineSessionStarted = true // update variable to handle online and offline sessions separately
        } else {
          console.log("error from read all", error)
          this.pumpOffCount=0
        }
      })

    //-- to read active record index
    device.readCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_RECORD_INDEX_UUID)
      .then((characteristic) => {
        const activeSessionData = Buffer.from(characteristic.value, 'base64');
        _this.activeSessionId = parseInt(toHexString(activeSessionData), 16).toString()
        console.log("LN 1640 read case active session index-- ", _this.activeSessionId)
        GetterSetter.setLastRecordIndex(_this.activeSessionId)
        // this.lastRecordIndex = _this.activeSessionId
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });


    //Battery
    this.subscriptionHeartRate = device.monitorCharacteristicForService(KeyUtils.BATTERY_SERVICE_UUID,
      KeyUtils.BATTERY_LEVEL_UUID, (error, characteristic) => {
        console.log('battery--1605-',error)
        if (!error) {
          const heartRateData = Buffer.from(characteristic.value, 'base64');
          const batteryLevel = parseInt(toHexString(heartRateData), 16).toString()
          console.log('battery---',batteryLevel)
          if(batteryLevel < 5 && this.batteryAlertCount == 0 && !showPumpBatteryAlert){
            this.batteryAlertCount++
            this.readSonataData['battery_level'] = parseInt(toHexString(heartRateData), 16).toString() + '%'
          }
          else{
            this.readSonataData['battery_level'] = parseInt(toHexString(heartRateData), 16).toString() + '%'
          }
          sonataPumpData(this.readSonataData)
        }
      })

    device.readCharacteristicForService(KeyUtils.BATTERY_SERVICE_UUID, KeyUtils.BATTERY_LEVEL_UUID)
      .then((characteristic) => {
        const heartRateData = Buffer.from(characteristic.value, 'base64');
        const batteryLevel = parseInt(toHexString(heartRateData), 16).toString()
        if(batteryLevel < 5 && this.batteryAlertCount == 0 && !showPumpBatteryAlert){
          this.batteryAlertCount++
          this.readSonataData['battery_level'] = parseInt(toHexString(heartRateData), 16).toString() + '%'
        }
        else{
          this.readSonataData['battery_level'] = parseInt(toHexString(heartRateData), 16).toString() + '%'
        }
        sonataPumpData(this.readSonataData)
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //Timer
    this.subscriptionTimer = device.monitorCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_CURRENT_TIMER_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const timerData = Buffer.from(characteristic.value, 'base64');
          this.pumpTime = parseInt(toHexString(timerData), 16).toString() !== 0 && parseInt(toHexString(timerData), 16).toString()
          this.readSonataData['timer'] = parseInt(toHexString(timerData), 16).toString()
          sonataPumpData(this.readSonataData)
        }
      })

    device.readCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_CURRENT_TIMER_CHARACTERISTIC_UUID)
      .then((characteristic) => {
        const timerData = Buffer.from(characteristic.value, 'base64');
        this.pumpTime = parseInt(toHexString(timerData), 16).toString() !== 0 && parseInt(toHexString(timerData), 16).toString()
        this.readSonataData['timer'] = parseInt(toHexString(timerData), 16).toString()
        sonataPumpData(this.readSonataData)
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    this.subscriptionPumpLevel = device.monitorCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_PUMP_LEVEL_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const pumpLevelData = Buffer.from(characteristic.value, 'base64');
          this.readSonataData['pumpLevel'] = parseInt(toHexString(pumpLevelData), 16).toString()
          pumpLevel = parseInt(toHexString(pumpLevelData), 16).toString()
          sonataPumpData(this.readSonataData)
        }
      })

    device.readCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_PUMP_LEVEL_CHARACTERISTIC_UUID)
      .then((characteristic) => {
        const pumpLevelData = Buffer.from(characteristic.value, 'base64');
        this.readSonataData['pumpLevel'] = parseInt(toHexString(pumpLevelData), 16).toString()
        pumpLevel = parseInt(toHexString(pumpLevelData), 16).toString()
        sonataPumpData(this.readSonataData)
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //If rhythemLevel = 0  then so 1, rhythemLevel = 1 then 2
    this.subscriptionRhythemLevel = device.monitorCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_RHYTHEM_LEVEL_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const rhythemLevelData = Buffer.from(characteristic.value, 'base64');
          this.readSonataData['rhythemLevel'] = parseInt(toHexString(rhythemLevelData), 16).toString()
          rhythemLevel = parseInt(toHexString(rhythemLevelData), 16).toString()
          sonataPumpData(this.readSonataData)

        }
      })

    device.readCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_RHYTHEM_LEVEL_CHARACTERISTIC_UUID)
      .then((characteristic) => {
        const rhythemLevelData = Buffer.from(characteristic.value, 'base64');
        this.readSonataData['rhythemLevel'] = parseInt(toHexString(rhythemLevelData), 16).toString()
        rhythemLevel = parseInt(toHexString(rhythemLevelData), 16).toString()
        sonataPumpData(this.readSonataData)
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    // If pumplevel = 0  then show 1, pumplevel = 1 then 2
    this.subscriptionPhaseLevel = device.monitorCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_PHASE_LEVEL_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const phaseLevelData = Buffer.from(characteristic.value, 'base64');
          this.readSonataData['phaseLevel'] = parseInt(toHexString(phaseLevelData), 16).toString()
          phaseLevel =  parseInt(toHexString(phaseLevelData), 16).toString()
          sonataPumpData(this.readSonataData)
        }
      })

    device.readCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_PHASE_LEVEL_CHARACTERISTIC_UUID)
      .then((characteristic) => {
        const phaseLevelData = Buffer.from(characteristic.value, 'base64');
        this.readSonataData['phaseLevel'] = parseInt(toHexString(phaseLevelData), 16).toString()
        phaseLevel = parseInt(toHexString(phaseLevelData), 16).toString()
        sonataPumpData(this.readSonataData)
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //Goal time
    device.readCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_GOAL_TIME_CHARACTERISTIC_UUID)
      .then((characteristic) => {
        const goalTimeData = Buffer.from(characteristic.value, 'base64');
        this.readSonataData['goalTime'] = parseInt(toHexString(goalTimeData), 16).toString()
        sonataPumpData(this.readSonataData)
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    this.subscriptionGoalTime = device.monitorCharacteristicForService(KeyUtils.ACTIVE_SESSION_SERVICE_UUID,
      KeyUtils.ACTIVE_SESSION_GOAL_TIME_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const goalTimeData = Buffer.from(characteristic.value, 'base64');
          this.readSonataData['goalTime'] = parseInt(toHexString(goalTimeData), 16).toString()
          console.log('Goal time ------->>>>>>-------', parseInt(toHexString(goalTimeData), 16).toString())
          sonataPumpData(this.readSonataData)
        }
      })

    //1 = pumping ready to run
    //3 = pumping running
    //4 = pumping paused
    //5 = pump offed
    this.subscriptionDeviceState = device.monitorCharacteristicForService(KeyUtils.DEVICE_STATE_SERVICE_UUID,
      KeyUtils.DEVICE_SESSION_STATE_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const deviceStateData = Buffer.from(characteristic.value, 'base64');
          const _deviceState = parseInt(toHexString(deviceStateData), 16).toString()
           console.log('_deviceState == ', _deviceState,this.pumpOffCount)
          if (this.pumpOffCount == 0 && _deviceState == 5) {
            AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
            this.props.connectionPause(false)
            this.props.pumpSessionActive(false)
            this.getIndexAndFlagData()
            this.readSonataData['deviceState'] = _deviceState
            this.pumpOffCount = 1
            this.props.isPumpRunning(false)
          } else if (_deviceState == 3) {
            this.props.pumpingCount(0)
            AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'true')
            this.props.isPumpRunning(true)
            this.isOnlineSessionStarted = true // updating variable on pump resuming to handle online and offline sessions separately
            this.props.pumpSessionActive(true)
            GetterSetter.setApiCallCount(0)
            this.props.sessionSaveFromPumping(false)
            this.props.connectionPause(false)
            this.readSonataData['deviceState'] = _deviceState
          } else if (_deviceState == 4) {
            AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'true')
            this.props.isPumpRunning(false)
            this.props.pumpSessionActive(true)
            this.props.connectionPause(true)
            this.readSonataData['deviceState'] = _deviceState
          } else if (_deviceState == 1) {
            this.pumpOffCount = 0
            this.props.pumpingCount(0)
            AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
            this.props.isPumpRunning(false)
            this.props.pumpSessionActive(false)
            this.props.connectionPause(false)
            this.readSonataData['deviceState'] = _deviceState
          } else {
            this.readSonataData['deviceState'] = _deviceState
          }
          sonataPumpData(this.readSonataData)
        }
      })

    device.readCharacteristicForService(KeyUtils.DEVICE_STATE_SERVICE_UUID,
      KeyUtils.DEVICE_SESSION_STATE_CHARACTERISTIC_UUID)
      .then((characteristic) => {
        const deviceStateData = Buffer.from(characteristic.value, 'base64');
        this.setState({deviceState: parseInt(toHexString(deviceStateData), 16).toString()})
        const _deviceState = parseInt(toHexString(deviceStateData), 16).toString()
        this.readSonataData['deviceState'] = _deviceState
        if (this.pumpOffCount == 0 && _deviceState == 5) {
          AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
          this.props.connectionPause(false)
          this.getIndexAndFlagData()
          this.readSonataData['deviceState'] = _deviceState
          this.pumpOffCount = 1
          this.props.isPumpRunning(false)
        } else if (_deviceState == 3) {
          this.props.pumpingCount(0)
          AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'true')
          this.readSonataData['deviceState'] = _deviceState
          this.isOnlineSessionStarted = true // updating variable on pump resuming to handle online and offline sessions separately
          this.props.isPumpRunning(true)
          this.props.pumpSessionActive(true)
          GetterSetter.setApiCallCount(0)
          this.props.sessionSaveFromPumping(false)
          this.props.connectionPause(false)
        } else if (_deviceState == 4 ){
          this.readSonataData['deviceState'] = _deviceState
          AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'true')
          this.props.isPumpRunning(false)
          this.props.pumpSessionActive(true)
          this.props.connectionPause(true)
        } else if (_deviceState == 1) {
          this.pumpOffCount = 0
          this.props.pumpingCount(0)
          this.readSonataData['deviceState'] = _deviceState
          AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
          this.props.isPumpRunning(false)
          this.props.pumpSessionActive(false)
          this.props.connectionPause(false)
        } else {
          this.readSonataData['deviceState'] = _deviceState
        }
        sonataPumpData(this.readSonataData)
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });
    //0 = no alert
    //32 = air leak
    //2 = battery low
    //1 = battery low as per document
    //2 = time not synced
    //4 = high altitude
    //8 = battery broken
    //10 = Muted
    //20 = leak alert
    //0x8000 = call service
    this.subscriptionDeviceAlertState = device.monitorCharacteristicForService(KeyUtils.DEVICE_STATE_SERVICE_UUID,
      KeyUtils.DEVICE_ALERT_STATE_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const deviceAlertStateData = Buffer.from(characteristic.value, 'base64');
          const _alertState = parseInt(toHexString(deviceAlertStateData), 16).toString()
          //console.log('_alertState ****** LN 1851 -- ', _alertState)
          if (this.batteryAlertCount == 0 && _alertState == 2 && !showPumpBatteryAlert) {
            this.batteryAlertCount++
            // this.setState({deviceAlertState: _alertState, showPumpBatteryAlert: true})
            this.readSonataData['deviceAlertState'] = _alertState
          } else {
            this.readSonataData['deviceAlertState'] = _alertState
          }
          sonataPumpData(this.readSonataData)
        }
      })

    device.readCharacteristicForService(KeyUtils.DEVICE_STATE_SERVICE_UUID,
      KeyUtils.DEVICE_ALERT_STATE_CHARACTERISTIC_UUID)
      .then((characteristic) => {
        const deviceAlertStateData = Buffer.from(characteristic.value, 'base64');
        this.readSonataData['deviceAlertState'] = parseInt(toHexString(deviceAlertStateData), 16).toString()
        sonataPumpData(this.readSonataData)
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //0 = no battery charging
    //1 = battery charging
    this.subscriptionBatteryCharging = device.monitorCharacteristicForService(KeyUtils.POWER_SERVICE_UUID,
      KeyUtils.POWER_CONNECTED_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const batteryChargingData = Buffer.from(characteristic.value, 'base64');
          this.readSonataData['batteryCharging'] = parseInt(toHexString(batteryChargingData), 16).toString()
          sonataPumpData(this.readSonataData)
        }
      })

    device.manufacturerData && device.name && this.props.getPumpId(getManufacturerData(device.manufacturerData,device.name))
  }

  readLastSession() {
    console.log('LN 1957 readLastSession--- called ')
    const device = this.device
    const _this = this;
      this.subscriptionLastRecord = device.monitorCharacteristicForService(KeyUtils.SESSION_HISTORY_SERVICE_UUID,
        KeyUtils.SESSION_HISTORY_RECORDS_CHARACTERISTIC_UUID, (error, characteristic) => {
          if (!error) {
            const session = Buffer.from(characteristic.value, 'base64');
            const buffer = new Buffer(session)
            sessionIndex = buffer.readUInt16BE(0)
            const timeStamp = buffer.readUInt32BE(2)
            const duration = buffer.readUInt16BE(6)
            const level = buffer.readUInt8(8)
            const rythem = buffer.readUInt8(9)
            const phase = buffer.readUInt8(10)
            const goalTime = buffer.readUInt16BE(11)//Not in Flex


            const data = buffer.readUInt16LE(13);
            //const secondData = JSON.parse(JSON.stringify(data)).data[1]
            const sessionType = bits(data, 0x00, 0x04)
            statusFlags.sessionType = sessionType
            const sessionAborted = bits(data, 0x04, 0x01)
            statusFlags.sessionAborted = convertNumberToBoolean(sessionAborted)
            const goalCompleted = bits(data, 0x05, 0x01)
            statusFlags.goalCompleted = convertNumberToBoolean(goalCompleted)
            const goalExtended = bits(data, 0x06, 0x01)
            statusFlags.goalExtended = convertNumberToBoolean(goalExtended)
            const autoLetdown = bits(data, 0x07, 0x01)
            statusFlags.autoLetdown = convertNumberToBoolean(autoLetdown)
            //const firstData = JSON.parse(JSON.stringify(data)).data[0]
            const leaksDetected = bits(data, 0x08, 0x01)
            statusFlags.leaksDetected = convertNumberToBoolean(leaksDetected)
            const timestampInvalid = bits(data, 0x09, 0x01)
            statusFlags.timestampInvalid = convertNumberToBoolean(timestampInvalid)
            console.log("sessionIndex ----SONATA------- $$$$$$$$$$$$$$ ", sessionIndex)
            this.readSonataData['statusFlags'] = statusFlags
            this.props.sonataPumpData(this.readSonataData)
            // this.props.setSessionIndex(sessionIndex)
          } else {
            console.log("readLastSession error = ", error)
          }
        })
  }

  dialogPumpOffAlert() {
    const {showPumpOffAlert, volNotifValue} = this.state

    if(!this.props.isSessionSaveFromPumping && volNotifValue===null) {
      return (
        <Dialog
          visible={showPumpOffAlert}
          title={'Pumping session complete'}
          message={I18n.t('breastfeeding_pump.disclaimer_msg')}
          positive={I18n.t('volume_popup.add_amount')}
          negative={I18n.t('volume_popup.save_without_amount')}
          isIcon={false}
          positiveOnPress={() => {
            let trackingId = this.mTrackingId;
            this.setState({showPumpOffAlert: false})
            NavigationService.popToTopStack()
            if (trackingId!==null){
              console.log('trackingId------->> **',this.trackingObj)
              let obj=JSON.parse(JSON.stringify(this.trackingObj))
              if (obj.userId){
                delete obj.userId
              }
              NavigationService.navigate('EditPumpingScreen', {item: obj,isBleScreen:true})
              //NavigationService.navigate('EditPumping', {openListView: true,trackingId})
              //this.props.sessionNavigation('StatsScreen',trackingId)
               //this.props.sessionNavigation('StatsScreen',null)
              setTimeout(()=>{
                //this.props.sessionNavigation('StatsScreen',trackingId)
              },300)

            }else{
              NavigationService.navigate('StatsScreen', {openListView: true,})
            }
          }}
          negativeOnPress={() => {
            this.setState({showPumpOffAlert: false})
          }}
          neutral={I18n.t('volume_popup.never_show_again')}
          neutralPress={() => {
            AsyncStorage.setItem(KeyUtils.PUMP_COMPLETE_NEVER_SHOW_AGAIN, 'true');
            this.setState({showPumpOffAlert: false,volNotifValue:'true'})
          }}
          onDismiss={() => {
          }}
        />
      )
    }
    };

  showVipDialog() {
    const {showVipSuccessPupup} = this.state
      return (
        <Dialog
          visible={showVipSuccessPupup}
          title={I18n.t('vip_pack.congrats_title')}
          message={I18n.t('vip_pack.congrats_message')}
          positive={I18n.t('login.ok')}
          negative={I18n.t('vip_pack.findout_more')}
          isIcon={false}
          positiveOnPress={() => {
            this.setState({ showVipSuccessPupup: false})
          }}
          onDismiss={() => {
          }}
          negativeOnPress={() => {
            this.setState({ showVipSuccessPupup: false})
            NavigationService.navigate("VipPackScreen")
          }}
        />
      )
    };


  dialogPumpBatteryAlert() {
    const {showPumpBatteryAlert} = this.state
    return (
      <Dialog
        visible={showPumpBatteryAlert}
        title={I18n.t('breastfeeding_pump.pump_alert_title')}
        message={I18n.t('breastfeeding_pump.pump_battery_alert_message')}
        positive={I18n.t('login.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({showPumpBatteryAlert: false})
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  showDeleteManualSessionPopup() {
    const {showRemoveManualSessionAlert} = this.state
    return (
      <Dialog
        visible={showRemoveManualSessionAlert}
        title={I18n.t('tracking.title')}
        message={I18n.t('tracking.manual_session_lost')}
        positive={I18n.t('bluetooth.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({showRemoveManualSessionAlert:false})
          this.clearStoreAfterApiCall()
          this.props.setLeftTimerActive(false)
          this.props.setRightTimerActive(false)
          AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'true').then(() => {
            let keys = [
              KeyUtils.IS_TIME_ACTIVE_P,
              KeyUtils.START_TIMESTAMP_P,
              KeyUtils.PUMPING_TIMER_VALUE,
              KeyUtils.IS_P_TIMER_STARTED,
            ]
            AsyncStorage.multiRemove(keys).then((res) => {
              console.log('manual session reset-----123')
            });
          });
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  renderVirtualFreezerDialog(){
    const {showCongratsPopup}=this.state
    return  <Dialog
      visible={showCongratsPopup}
      title={I18n.t('virtual_freezer.notification_title1')}
      message={I18n.t('virtual_freezer.notification_description1')}
      positive={I18n.t('login.ok')}
      isIcon={false}
      positiveOnPress={() => {
        this.setState({ showCongratsPopup: false })
        AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS, 'true')
        this.saveActiveTrackingInDb(true, this.trackingObj.id)
      }}
      onDismiss={() => {
      }}
    />
  }

  render() {
    const {
      showPumpOffAlert,
      showCongratsPopup,
      timer,
      showViewAlert,
      isLoading,
      showVipSuccessPupup,
      showRemoveManualSessionAlert
    } = this.state
    return <>
      {isLoading && <LoadingSpinner/>}
      {showPumpOffAlert && this.dialogPumpOffAlert()}
      {/*{showPumpBatteryAlert && this.dialogPumpBatteryAlert()}*/}
      {showVipSuccessPupup && this.showVipDialog()}
      {showViewAlert && this.showViewDialog()}
      {showRemoveManualSessionAlert && this.showDeleteManualSessionPopup()}
      {showCongratsPopup && this.renderVirtualFreezerDialog()}
    </>
  }


}

const mapStateToProps = (state) => ({
  isInternetAvailable: state.app.isInternetAvailable,
  appState: state.app.appState,
  bleDeviceId: state.app.bleDeviceId,
  pumps: state.home.pumps,
  isPumpListSuccess: state.home.isPumpListSuccess,
  isPumpListFailure: state.home.isPumpListFailure,
  addPumpMessage : state.home.addPumpMessage,
  addPumpSuccess : state.home.addPumpSuccess,
  addPumpFailure : state.home.addPumpFailure,
  selected_baby: state.home.selected_baby,
  device : state.home.device,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  flexData: state.home.flexData,
  sonataData: state.home.sonataData,
  isNewPumpAdded: state.home.isNewPumpAdded,
  onStopIntervals: state.home.onStopIntervals,
  isManualSession: state.home.isManualSession,
  isFromNewPump: state.home.isFromNewPump,
  manualDataFromPumping: state.home.manualDataFromPumping,
  pumpingCountValue: state.home.pumpingCountValue,
  sessionIndexValue: state.home.sessionIndexValue,
  isSessionSaveFromPumping: state.home.isSessionSaveFromPumping,
  pumpId: state.home.pumpId,
  pumpType: state.home.pumpType,
  trackingResponse:state.home.trackingResponse,
  userProfile: state.user.userProfile,
  vipPackSuccess: state.home.vipPackSuccess,
  vipPackFailure: state.home.vipPackFailure,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  remoteConfig:state.remoteConfig,
  createBottleApiSuccess:state.home.createBottleApiSuccess,
  createBottleApiFailure:state.home.createBottleApiFailure,
  isConnected: state.home.isConnected,
  scannedList : state.home.scannedList,
  isLeftTimerActive: state.home.isLeftTimerActive,
  isRightTimerActive: state.home.isRightTimerActive
})

const mapDispatchToProps = (dispatch) => ({
  getPumpList: () => dispatch(HomeActions.getPumpList()),
  scannedPumpList: (pumpList) => dispatch(HomeActions.scannedPumpList(pumpList)),
  getBleDeviceId: (id) => dispatch(AppActions.getBleDeviceId(id)),
  isPumpConnected: (isConnected) => dispatch(HomeActions.isPumpConnected(isConnected)),
  flexPumpData: (flexData) => dispatch(HomeActions.flexPumpData(flexData)),
  sonataPumpData: (sonataData) => dispatch(HomeActions.sonataPumpData(sonataData)),
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  setPumpType: (pumpType) => dispatch(HomeActions.setPumpType(pumpType)),
  isPumpRunning: (pumpState) => dispatch(HomeActions.isPumpRunning(pumpState)),
  pumpSessionActive: (pumpState) => dispatch(HomeActions.pumpSessionActive(pumpState)),
  checkInternetConnection: (status) => dispatch(AppActions.checkInternetConnection(status)),
  connectionState: (msg) => dispatch(HomeActions.connectionState(msg)),
  connectionPause: (msg) => dispatch(HomeActions.connectionPause(msg)),
  sessionFromNewPump: (value) => dispatch(HomeActions.sessionFromNewPump(value)),
  pumpingManualData: (value) => dispatch(HomeActions.pumpingManualData(value)),
  pumpingCount: (value) => dispatch(HomeActions.pumpingCount(value)),
  stopAllIntervals: (v) => dispatch(HomeActions.stopAllIntervals(v)),
  setSessionIndex: (v) => dispatch(HomeActions.setSessionIndex(v)),
  sessionSaveFromPumping: (value) => dispatch(HomeActions.sessionSaveFromPumping(value)),
  getPumpId: (value) => dispatch(HomeActions.getPumpId(value)),
  sessionNavigation:(routeName,trackingId)=>dispatch(NavigationActions.sessionNavigation(routeName,trackingId)),
  vipPackApi:(value)=>dispatch(HomeActions.vipPackApi(value)),
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
  setLeftTimerActive: (value) => dispatch(HomeActions.setLeftTimerActive(value)),
  setRightTimerActive: (value) => dispatch(HomeActions.setRightTimerActive(value)),
})
export default connect(mapStateToProps, mapDispatchToProps)(BleRootConnection)
