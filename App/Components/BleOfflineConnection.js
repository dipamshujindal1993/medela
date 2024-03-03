import React, { Component } from 'react'
import {
  View,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'
import AppActions from '@redux/AppRedux'
import HomeActions from '@redux/HomeRedux';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import { bits, convertLocalTimeToUtc, convertNumberToBoolean, uuidV4 } from "@utils/TextUtils";
import moment from "moment-timezone";
import { getVolumeUnits } from "@utils/locale";
import { createAllTrackedItems, createTrackedItem } from "../Database/TrackingDatabase";
import Dialog from "./Dialog";
import I18n from "react-native-i18n";
import NavigationService from "@services/NavigationService";
import { getRealmDb } from "../Database/AddBabyDatabase";
import BleDManager from "../Containers/BleDManager";
var Buffer = require('buffer/').Buffer
import {getManufacturerData,appendTimeZone} from '@utils/TextUtils'

class BleOfflineConnection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showViewAlert: false,
      realmDb: null,
    }
    this.sessionList = []
    this.connectedDeviceId = ''
    this.connectedDevice = ''
    this.manager = BleDManager.getBleManagerInstance();
    this.device = {}
    this.isTimerRunning = false
    this.trackingList = []
    this.isBluetoothActive = false
    this.subscription = null
    this.lastRecordIndex = 0
    this.isFlex = false
  }

  async componentDidMount() {
    this.subscription = this.manager.onStateChange((state) => {
      this.isBluetoothActive = state === 'PoweredOn';
    }, true);
    const { getPumpList } = this.props
    this.connectedDeviceId = await AsyncStorage.getItem(KeyUtils.CONNECTED_DEVICE_ID)
    this.connectedDevice = await AsyncStorage.getItem(KeyUtils.CONNECTED_DEVICE)
    let realmDb = await getRealmDb()
    this.setState({ realmDb })
    getPumpList()
  }
  componentWillUnmount() {
    this.subscription.remove()
  }

  scanAndConnect() {
    const { deviceList } = this.state
    this.isBluetoothActive && this.manager.startDeviceScan([KeyUtils.MEDELA_PUMP_SERVICE_UUID], { allowDuplicates: false }, (error, device) => {
      let deviceName = device && device.name

      let item = device && device.id && deviceList.find((e) => {
        if (e.pumpId === getManufacturerData(device.manufacturerData)) {
          this.device = device
          this.pumpId = getManufacturerData(this.device.manufacturerData)
          this.lastRecordIndex = e.lastRecordIndex
          return true
        }
      })
      if (item!==undefined && item!=null){
        this.isBluetoothActive && this.manager.stopDeviceScan();
        this.isBluetoothActive && this.connectToBLE()
      }

      /* if (deviceName &&
         (device.name.toLowerCase().includes(this.selectedTypePump.toLowerCase())
           || this.selectedTypePump.toLowerCase().includes(device.name.toLowerCase()))) {
         this.availableMedeleDevice.push(device)
       }*/
    });
  }

  connectToBLE = () => {
    this.deviceIdentifier = this.device.id
    console.log('deviceIdentifier-- Offline ', this.deviceIdentifier, this.device.id)
    // this.isBluetoothActive && this.device && this.manager.connectToDevice(this.deviceIdentifier, { autoConnect: true })
    //   .then((device) => {
    //     return device.discoverAllServicesAndCharacteristics()
    //   })
    //   .then((device) => {
    //     this.writeToGetBluetoothAllSession()
    //   })
    //   .catch((error) => {
    //     console.log("error", error)
    //   });
    let ar = [this.deviceIdentifier]
    this.isBluetoothActive && this.device && this.manager.devices(ar).then((devices)=>{
      console.log('devices ### offline = ',devices)
      if(Platform.OS==='android') {
        devices.length>0 && devices[0].isConnected().then((res) => {
          console.log('IS connected = ', res)
          const isFlex = devices[0].name.toLowerCase().includes("freestyle")
          this.isFlex = isFlex
          console.log("Is Flex",this.isFlex)
          if (res) {
            this.device = devices[0]
            if(this.isFlex){
              this.readAllSessionFlex()
              this.writeToGetBluetoothAllSessionFlex()
            }
            else{
              this.writeToGetBluetoothAllSession()
            }
          } else {

            devices[0].connect()
              .then((device) => {
                return device.discoverAllServicesAndCharacteristics()
              })
              .then((device) => {
                this.device = device
                const isFlex = device.name.toLowerCase().includes("freestyle")
                this.isFlex = isFlex
                if(this.isFlex){
                  this.readAllSessionFlex()
                  this.writeToGetBluetoothAllSessionFlex()
                }
                else{
                  this.writeToGetBluetoothAllSession()
                }
              })
              .catch((error) => {
                console.log("error offline = ", error)
              });
          }
        });
      }else {
        devices[0].connect()
          .then((device) => {
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.device = device
            const isFlex = device.name.toLowerCase().includes("freestyle")
            this.isFlex = isFlex
            if(this.isFlex){
              this.readAllSessionFlex()
              this.writeToGetBluetoothAllSessionFlex()
            }
            else{
              this.writeToGetBluetoothAllSession()
            }
          })
          .catch((error) => {
            console.log("error offline = ", error)
          });
      }
    })
  }

  writeToGetBluetoothAllSession() {
    const device = this.device
    const base64String2 = Buffer.from(KeyUtils.PUMP_OPERATOR_ALL_RECORD, 'hex').toString('base64');
    const base64String = base64String2
    device.writeCharacteristicWithResponseForService(
      KeyUtils.SESSION_HISTORY_SERVICE_UUID,
      KeyUtils.RACP_CHARACTERISTIC_UUID,
      base64String)
      .then((characteristic) => {
        // console.log("writeToGetBluetoothAllSession", characteristic)
        this.readAllSession()
      }).catch((error) => {
        console.log("write session error = ", error)
      });
  }

  writeToGetBluetoothAllSessionFlex() {
    const device = this.device
    const flexBuffer = Buffer.from(KeyUtils.PUMP_OPERATOR_ALL_RECORD_FLEX, 'hex')
    const base64String2 = flexBuffer.toString('base64');
    const base64String = base64String2
    device.writeCharacteristicWithResponseForService(
      KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
      KeyUtils.CHARACTERISTIC_MDC_DOWNSTREAM,
      base64String)
      .then((characteristic) => {    
      }).catch((error) => {
      console.log("write session error = ", error)
    });
  }

  readAllSessionFlex(){
    //All record
    //{"data": [131(classId), 17(cmdId), 6(recordIndex), 0, 47, 4, 0, 0, 22, 0, 0, 255, 255, 255, 74, 8, 0, 2, 0, 1], "type": "Buffer"}
    //{"data": [131, 17, 37, 0, 197, 0, 0, 0, 9, 0, 2, 255, 255, 255, 6, 8, 2, 2, 0, 2], "type": "Buffer"}
    // End - {"data": [131, 16, 6, 0, 1, 1], "type": "Buffer"}
    this.subscriptionAllRecord = this.device.monitorCharacteristicForService(KeyUtils.SERVICE_MEDELA_DEVICE_COMMUNICATION,
      KeyUtils.CHARACTERISTIC_MDC_UPSTREAM, (error, characteristic) => {
        if (!error) {
          const flexData = Buffer.from(characteristic.value, 'base64');
          const jsonData = JSON.parse(JSON.stringify(flexData))
          const array = jsonData.data
          if(array.length > 0 ){
            const type = array[0]
            const cmdType = array[1]
            if(type === 131){
              if(cmdType === 16){
                this.convertBleDataToText()
              }
              else if(cmdType === 17){
                this.sessionList.push(flexData)
              }
            }
          }
        }
      })
  }

  readAllSession() {
    const device = this.device

    this.subscriptionAllRecord = device.monitorCharacteristicForService(KeyUtils.SESSION_HISTORY_SERVICE_UUID,
      KeyUtils.SESSION_HISTORY_RECORDS_CHARACTERISTIC_UUID, (error, characteristic) => {
        if (!error) {
          const session = Buffer.from(characteristic.value, 'base64');
          // console.log("All session", session)
          this.sessionList.push(session)
          if (!this.isTimerRunning) {
            this.isTimerRunning = true
            setTimeout(() => {
              this.convertBleDataToText()
            }, 30000)
          }

        } else {
          console.log("error", error)
        }
      })
  }
  async convertBleDataToText() {
    let list = []
    const { selected_baby } = this.props

    if (this.sessionList.length > 0 && selected_baby && selected_baby.babyId) {
      for (const e of this.sessionList) {
        const buffer = new Buffer(e)
        //console.log("buffer", buffer)
        let statusFlags = {}
        let obj = {}

        let sessionIndex,timeStamp,duration,level=1,rythem=0,phaseLevel=0,goalTime=0
        if(this.isFlex){
          sessionIndex = buffer.readUInt16LE(2)
          timeStamp = buffer.readUInt32LE(4)
          //console.log("timeStamp", timeStamp)
          duration = buffer.readUInt16LE(8)
          level = buffer.readUInt8(10)
          rythem = 0 //255
          let phase = buffer.readUInt8(12) //255
          phaseLevel = (phase == 255) ? 0 : 1
          //const goalTime = buffer.readUInt16BE(11)
      
          statusFlags.sessionType = 1
      
          const switchTime = buffer.readUInt16LE(14);
          const autoLetdown = ((switchTime & (0xffff)) == 0xffff)
          statusFlags.autoLetdown = convertNumberToBoolean(autoLetdown)
      
          const flags = buffer.readUInt16LE(16);
          const timestampInvalid = (flags & 0x800) != 0
          statusFlags.timestampInvalid = convertNumberToBoolean(timestampInvalid)
        }
        else{
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

        if(sessionIndex > this.lastRecordIndex) {
          let formattedDate = await appendTimeZone(moment(timeStamp * 1000).format("YYYY-MM-DDThh:mm:ss"))
          obj = {
            "babyId": selected_baby.babyId,
            "id": uuidV4(),
            "trackingType": KeyUtils.TRACKING_TYPE_PUMPING,
            "trackAt": formattedDate,
            "durationLeft": duration / 2,
            "durationRight": duration / 2,
            "durationTotal": duration,
            "confirmed": true,
            "remark": '',
            "quickTracking": true,
            "isBadSession": false,
            "lastBreast": 3,
            "statusFlags": statusFlags
          }
          obj['pumpId'] = this.pumpId
          obj['pumpRecordId'] = sessionIndex
          obj['deviceLevel'] = parseInt(level)
          obj['devicePattern'] = parseInt(rythem)
          obj['devicePhase'] = parseInt(phaseLevel)
          obj['goalTime'] = parseInt(goalTime)
          obj['statusFlags'] = statusFlags
          obj['amountLeft'] = 0
          obj['amountLeftUnit'] = getVolumeUnits()
          obj['amountRight'] = 0
          obj['amountRightUnit'] = getVolumeUnits()
          obj['amountTotal'] = 0
          obj['amountTotalUnit'] = getVolumeUnits()
          list.push(obj)
        }
      }

      if (list.length > 0) {
        const { realmDb } = this.state
        AsyncStorage.getItem(KeyUtils.USER_NAME).then((username) => {
          if (username != null) {
            let myItems = realmDb.objects('Tracking');
            let arr = JSON.parse(JSON.stringify(myItems))
            arr = arr.filter((e) => {
              return e.userId === username
            })
            //console.log(arr.length)
            let isDuplicate = false
            for (let i = list.length - 1; i >= 0; i--) {
              for (let j = 0; j < arr.length; j++) {
                if (list[i] && (list[i].pumpRecordId === arr[j].pumpRecordId)) {
                  list.splice(i, 1);
                }
              }
            }
            //console.log('list--->>', list)
            this.tracingList = list
            let ll = list.map((e) => ({ ...e, isSync: false, userId: username }))
            createAllTrackedItems(realmDb, ll).then((r) => {
              //console.log('r--', r)
            })
            this.trackingList = ll
            const { isInternetAvailable } = this.props
            if (isInternetAvailable) {
              if (list.length > 0) {
                let json = {
                  trackings: list,
                };
                console.log("Tracking api request", json)
                this.setState({ isLoading: true })
                this.props.trackingApi(json)
              }
            }

          }
        })
      }

      /*   if (list.length>0){
           let json = {
             trackings: list,
           };
           this.setState({isLoading:true})
           this.props.trackingApi(json)
         }
      */
    }
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const { pumps, isPumpListSuccess, isPumpListFailure } = this.props
    const { trackingApiSuccess, navigation, trackingApiFailure } = this.props;
    if (
      trackingApiSuccess != prevProps.trackingApiSuccess &&
      trackingApiSuccess &&
      prevState.isLoading
    ) {
      console.log('success--')
      this.saveTrackingInDb(true)
    }

    if (
      trackingApiFailure != prevProps.trackingApiFailure &&
      trackingApiFailure &&
      prevState.isLoading
    ) {
      console.log('trackingApiFailure--')
      this.setState({ isLoading: false });
    }

    if (isPumpListSuccess && isPumpListSuccess != prevProps.isPumpListSuccess) {
      const pumpList = []
      for (let item of pumps.pumps) {
        !item.deleteFlag &&  pumpList.push(item)
      }
      // console.log('pumpList---', pumpList)
      this.setState({ isLoading: false, deviceList: pumpList }, () => {
        this.scanAndConnect()
      })

    }
    if (isPumpListFailure && isPumpListFailure != prevProps.isPumpListFailure) {
      this.setState({ isLoading: false, deviceList: [] })
    }
  }

  saveTrackingInDb(isSync) {
    const { realmDb } = this.state
    this.trackingList = this.trackingList.map((e) => ({ ...e, isSync: true }))
    createAllTrackedItems(realmDb, this.trackingList).then((r) => {
      //console.log('result--', r)
      this.setState({ isLoading: false, showViewAlert: true })
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
          NavigationService.navigate('Stats')
        }}
        onDismiss={() => {
        }}
      />
    )
  };
  render() {
    return <View>
      {this.state.showViewAlert && this.showViewDialog()}
    </View>
  }
}

const mapStateToProps = (state) => ({
  pumps: state.home.pumps,
  userProfile: state.user.userProfile,
  isPumpListSuccess: state.home.isPumpListSuccess,
  isPumpListFailure: state.home.isPumpListFailure,
  selected_baby: state.home.selected_baby,
  getTrackingResponse: state.home.getTrackingResponse,
  getTrackingApiSuccess: state.home.getTrackingApiSuccess,
  isInternetAvailable: state.app.isInternetAvailable,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
})

const mapDispatchToProps = (dispatch) => ({
  checkInternetConnection: (status) => dispatch(AppActions.checkInternetConnection(status)),
  getPumpList: () => dispatch(HomeActions.getPumpList()),
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),

})

export default connect(mapStateToProps, mapDispatchToProps)(BleOfflineConnection)
