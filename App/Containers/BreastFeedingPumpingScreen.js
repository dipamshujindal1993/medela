import React,{Suspense} from 'react'
import {
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View, BackHandler
} from 'react-native'
import {connect} from "react-redux";
import LoadingSpinner from '@components/LoadingSpinner'
import HomeActions from '@redux/HomeRedux';
import NavigationActions from '@redux/NavigationRedux';
import Button from "@components/Button";
import CustomOptionSelector from "@components/CustomOptionSelector";
import CustomTextInput from "@components/CustomTextInput";
import Dialog from '@components/Dialog';
import HeaderTrackings from "@components/HeaderTrackings";
import Active from '@svg/ic_active';
import Inactive from '@svg/ic_inactive';
import { saveVirtualFreezerDatabase } from "../Database/VirtualFreezerDatabase";
import Left from '@svg/ic_left.svg';
import Right from '@svg/ic_right.svg';
import BreastFeedingIcon from '@svg/ic_breastfeeding.svg'
import BreastFeedingActiveIcon from '@svg/ic_breastfeedingactive.svg'
import PumpActiveIcon from '@svg/pumping.svg'
import GoodIcon from '@svg/ic_good'
import BadIcon from '@svg/ic_bad'
import Bluetooth from '@svg/ic_bluetooth.svg'
import Battery from '@svg/ic_battery.svg';
import BatteryCharge from '@svg/ic_battery_charge.svg';
import I18n from 'react-native-i18n';
import {Colors, Metrics} from "@resources";
import styles from './Styles/BreastFeedingPumpingScreenStyles';
import {uuidV4,appendTimeZone,validateSpecialChracter, getFormattedTime, toHHMMSS} from "@utils/TextUtils";
import {getVolumeUnits, getVolumeMaxValue, volumeConversionHandler} from '@utils/locale';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import CustomRightTimer from '@components/CustomRightTimer';
import CustomLeftTimer from '@components/CustomLeftTimer';
import moment from "moment";
import {createTrackedItem} from "../Database/TrackingDatabase";
import Toast from 'react-native-simple-toast';
import {Constants} from "@resources";
import LeftW from '@svg/ic_text_left_w.svg'
import RightW from '@svg/ic_text_right_w.svg'
import BleDManager from "./BleDManager";
import NavigationService from "../Services/NavigationService";
import SiriBabySelectionModal from "@components/SiriBabySelectionModal";
import Bluetooth_off from '@svg/ic_bluetooth_gray.svg';
import {verticalScale} from "../Resources/Metrics";
import {checkDays, savebreastFeedingPumpingTrack} from "../Components/Notifications";
import GetterSetter from "../Components/GetterSetter";
import { milkExpiredNotification } from '@components/Notifications';
import D from '@svg/D_.svg';
import S from '@svg/S_.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { fadeIn } from 'react-navigation-transitions';
import GoalClock from '@svg/goal_clock.svg'
import Down from '@svg/timer_down.svg'
import UpTime from '@svg/timer_up.svg'
import LeftFrench from "../Images/svg/ic-left_French.svg"
import LeftItalian from "../Images/svg/ic-left_Italian.svg"
import LeftPortuguese from "../Images/svg/ic-left_Portuguese.svg"
import LeftRussian from "../Images/svg/ic-left_Russian.svg"
import LeftSpanish from "../Images/svg/ic-left_Spanish.svg"
import LeftSwedish from "../Images/svg/ic-left_Swedish.svg"
import LeftArabic from "../Images/svg/L_Arabic.svg"
import RightArabic from "../Images/svg/R_Arabic.svg"
import RightRussian from "../Images/svg/ic-right_Russian.svg"
import RightSwedish from "../Images/svg/ic-right_Swedish.svg"
import RightFIPS from "../Images/svg/ic-right-French-Italian-Portuguese-Spanish.svg"
import CustomPumpingTimer from "@components/CustomPumpingTimer";
import RightPolish from "../Images/svg/P.svg"
import LeftPolish from "../Images/svg/L.svg"
import { Analytics } from '@services/Firebase';
import { getRealmDb } from '../Database/AddBabyDatabase';
let analytics = new Analytics()

// const volumeList = [{
//   label: I18n.t('breastfeeding_pump.total'),
//   label2: '0ml',
//   value: 'both',
// },
//   {
//     label: `${I18n.t('breastfeeding_pump.left')}`,
//     label2: '0ml',
//     value: 'left',
//   }, {
//     label: I18n.t('breastfeeding_pump.right'),
//     label2: '0ml',
//     value: 'right',
//   }];

const width = Dimensions.get('window').width
let statusFlags = {}
let autoStartTime = true;

class BreastFeedingPumpingScreen extends React.Component {
  endingSideList = [
    {
      label: I18n.t('breastfeeding_pump.left'),
      value: 1,
    },
    {
      label: I18n.t('breastfeeding_pump.right'),
      value: 2,
    },
  ];


  endingPumpingSideList = [
    {
      label: I18n.t('breastfeeding_pump.both'),
      value: 3,
    },
    {
      label: I18n.t('breastfeeding_pump.left'),
      value: 1,
    },
    {
      label: I18n.t('breastfeeding_pump.right'),
      value: 2,
    },
  ];

  experienceList = [{
    label: I18n.t('breastfeeding_pump.good'),
    value: I18n.t('breastfeeding_pump.good'),
    Icon: GoodIcon,
    iconWidth: 20,
    iconHeight: 20,
    activeIconFill: 'white',
    InActiveIconFill: Colors.rgb_898d8d
  }, {
    label: I18n.t('breastfeeding_pump.bad'),
    value: I18n.t('breastfeeding_pump.bad'),
    Icon: BadIcon,
    iconWidth: 20,
    iconHeight: 20,
    activeIconFill: 'white',
    InActiveIconFill: Colors.rgb_898d8d
  }];
  bottleBagOption = [{
    label: I18n.t('breastfeeding_pump.bottle'),
    value: I18n.t('breastfeeding_pump.bottle'),
  }, {
    label: I18n.t('breastfeeding_pump.bag'),
    value: I18n.t('breastfeeding_pump.bag'),
  }];


  fridgeFreezerOption = [{
    label: I18n.t('breastfeeding_pump.fridge'),
    value: I18n.t('breastfeeding_pump.fridge'),
  }, {
    label: I18n.t('breastfeeding_pump.freezer'),
    value: I18n.t('breastfeeding_pump.freezer'),
  }];
  volumeList = [{
    label: I18n.t('breastfeeding_pump.total'),
    label2: '0ml',
    value: 'both',
  },
    {
      label: `${I18n.t('breastfeeding_pump.left')}`,
      label2: '0ml',
      value: 'left',
    }, {
      label: I18n.t('breastfeeding_pump.right'),
      label2: '0ml',
      value: 'right',
    }];


  constructor(props) {
    super(props);
    const {isLeftPress } = this.props.navigation.state.params
    this.batteryAlertCount = 0
    this.pumpOffCount = 0
    this.state = {
      isLoading: false,
      leftStopwatchStart: false,
      leftStopwatchValue: '',
      leftGetCurrentTime: 0,
      leftGetEndTime: 0,
      showClearCounterAlert: false,
      showCongratsPopup: false,
      rightStopwatchStart: false,
      rightStopwatchValue: '',
      rightGetCurrentTime: 0,
      rightGetEndTime: 0,
      noteTextInput: '',
      heightArray: [],
      volumeLeftCount: '0',
      volumeRightCount: '0',
      volumeTotalCount: '0',
      showVolumeAlert: false,
      showExistingInventoryAlert: false,
      volumeCount: '0',
      isVolumeSelectedIndex: -1,
      showCalendarPicker: false,
      selectedDate: moment().format(),
      volumeList: [],
      defaultFeedingIndex: isLeftPress ? 0 : 1,
      defaultPumpingIndex: 0,
      bleDevicePowerState: '',
      timer: 0,
      goalTime: 0,
      battery_level: '',
      pumpLevel: 0,
      phaseLevel: 0,
      rhythemLevel: 0,
      deviceState: '',
      deviceAlertState: '',
      timerValueLeft: -1,
      timerValueRight: -1,
      showTimers: false,
      batteryCharging: '',
      showPumpOffAlert: false,
      showPumpBatteryAlert: false,
      isUiLoading: false,
      isBLETimerRunning: false,
      pumpRecordId: 1,

      saveToVirtualStorage: false,
      totalVolume:0,
      freezerItems: [],
      containerType: -1, // 1: Bottle 2: Bag
      location: -1, //  1: Fridge 2: Freezer
      fridgeSelected: 0,
      bottleSelected: 0,
      number: '',
      tray: '',
      bottleBagNumber: -1,
      trayNumber: '',
      connectionState: false,
      isFlex:false,
      connectionMsg:'',
      unit:'',
      maxVolumeValue:0,
      showSiriBabySelectionModal:this.props.navigation.state.params!= undefined?this.props.navigation.state.params.isSiriNameReturned:undefined,
      callTrackingApiOnStop:this.props.navigation.state.params.callTrackingApi,
      isLeftTimerValue:0,
      isRightTimerValue:0,
      milkNotif: false,
      showErrorPrompt: false,
      errorMessage:'',
      isItalian:false,
      isFrom:null,
      leftTimerRunnig : false,
      rightTimerRunnig : false,
      leftTimerPause: false,
      rightTimerPause: false,
      isGoalTimeComplete: true,
      sliderValue:0,
      isFocus:false,
      isSliderLoadingDone:false,
      CustomVolumeSlider:()=> <></>,
      CustomMeasurementView:()=> <></>,
      showBadArticles: false,
      initialCalenderValue:undefined,
      isCalenderValueDetained:undefined,
      initialCalenderTimer:undefined,
      //isCalenderValueDetainedLocally
      handlePumpTimer:-1,
      isSessionActive: false,
      disableButton:false,
      isDateChanged:false,
      timeCalendarDate:moment(),
      timeCalendarDateAM:moment(),
      checkStartTimer:0,
      accuracy:false
    }
    this.updateTimerFlag=false,
    this.inventoryUUID= uuidV4()
    this.trackingUuid=''
    this.totalVolumeCount = 0
    this.leftVolumeCount = 0
    this.rightVolumeCount = 0

    this.badSessionIndex = 0
    this.lastBreastIndex = -1
    this.lastBreastPumpingIndex = -1

    this.handleRightStopWatchValue = this.handleRightStopWatchValue.bind(this)
    this.handleLeftStopWatchValue = this.handleLeftStopWatchValue.bind(this)
    this.handleChangeValue = this.handleChangeValue.bind(this)

    this.durationLeftInMins = 0
    this.durationLeftInSec = 0
    this.durationRightInSec = 0
    this.durationRightInMins = 0

    this.durationBothInMins = 0
    this.durationBothInSec = 0

    this.manager = BleDManager.getBleManagerInstance()
    this.subscription = null
    this.isBluetoothActive = false
    this.flexDataList = []
    this.PUMP_OPERATOR_LAST_COMPLATE_RECORD_FLEX = []
    this.activeSessionId = ""
    this.inventoryObj={}
    this.pumpingDataObj = {}
    this.focusListener = null
    this.isCountDownSelected = true,
    this.customPumpingTimer=React.createRef();
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    let pumpingDuration = await AsyncStorage.getItem(KeyUtils.PUMPING_TIMER_VALUE)
    if( pumpingDuration === null ){
      AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING,Date.now().toString());
    }
    else{
    let newDate= await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING);
      this.updateStartTime(new Date(parseInt(newDate)))
    }
    const {flexData, sonataData, pumpType, pumpRunning,navigation} = this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    navigation.addListener('willFocus', () => {
      AsyncStorage.getItem(KeyUtils.SELECTED_LANGUAGE).then((language)=>{
        if (language!=null){
          this.setState({ isItalian: language == 'Italian' ? true : false })
        }
      })
    })
    AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
      this.tabName=tabName
    })
    Promise.all([getVolumeUnits(),getVolumeMaxValue()]).then((values) => {
      this.setState({unit:values[0],maxVolumeValue:values[1]})
      this.volumeList[1].label2 = `${0} ${this.state.unit}`
      this.volumeList[2].label2 = `${0} ${this.state.unit}`
      this.volumeList[0].label2 = `${0} ${this.state.unit}`

      this.setState({volumeList:this.volumeList})
    });
    if(GetterSetter.getPumpName()==='flex'){
      if(flexData && flexData.batteryCharging) {
        this.setState({
          batteryCharging: flexData.batteryCharging,
          isFlex: true
        })
      }
    } else if (GetterSetter.getPumpName()==='maxi'){
      if(sonataData && sonataData.batteryCharging) {
        this.setState({
          batteryCharging: sonataData.batteryCharging,
          isFlex: false,
          deviceAlertState: sonataData.deviceAlertState
        })
      }
    } else if (sonataData){
      if(sonataData && sonataData.batteryCharging) {
        this.setState({
          batteryCharging: sonataData.batteryCharging,
          isFlex: false,
          deviceAlertState: sonataData.deviceAlertState
        })
      }
    }

    if(pumpRunning){
      this.setState({
        isBLETimerRunning: true,
        rightStopwatchStart: false,
        leftStopwatchStart: false
      })
    }else{
      this.setState({
        isBLETimerRunning: false,
        rightStopwatchStart: true,
        leftStopwatchStart: true
      })
    }

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }


    this.callPumpingApiFromSiri()
    this.init()

    setTimeout(() => {
      this.setState({isUiLoading: false})
      const {saveToVirtualStorage}=this.props.navigation.state.params
      if (saveToVirtualStorage){
        this.setState({saveToVirtualStorage:true})
      }
    }, 100)
    const CustomVolumeSlider = React.lazy(
      () =>
        new Promise((resolve, reject) =>
          setTimeout(() => resolve(import("@components/CustomVolumeSlider")), 0)
      )
    );
    const CustomMeasurementView = React.lazy(
      () =>
        new Promise((resolve, reject) =>
          setTimeout(() => resolve(import("@components/CustomMeasurementView")), 0)
      )
    );
    this.setState({CustomVolumeSlider,CustomMeasurementView})
    await analytics.logScreenView('pumping_tracking_screen')
  }

  callBreastFeedingApiFromSiri(){
    if (this.state.callTrackingApiOnStop && this.state.showSiriBabySelectionModal) {
      var leftTimerValue = 0
      var rightTimerValue = 0
      AsyncStorage.getItem(KeyUtils.PUMPING_TIMER_VALUE).then(prevTimerCount => {
        if (prevTimerCount != null) {
          let remainingSeconds = parseInt(prevTimerCount)
          // let totalCount = remainingSeconds + dd
          this.setState({
            leftStopwatchStart: true,
            //  timerValueLeft: totalCount,
            showTimers: true
          })
          leftTimerValue = remainingSeconds
        }
      });

      setTimeout(() => {
        this.handleValidations(true,leftTimerValue,rightTimerValue)
      }, 100)

    }
  }

  callPumpingApiFromSiri(){
    if (this.props.navigation.state.params.callTrackingApiOnPumpingStop && this.state.showSiriBabySelectionModal) {
      const { milkUnit, milkQuantity, bottleNumber, container, trayNumber, fridge, isSaveMilk } = this.props.navigation.state.params.pumpingData
      if (isSaveMilk === 'Yes') {
        this.setState({
          saveToVirtualStorage: true, trayNumber: trayNumber, number: bottleNumber,
          containerType: container === 'Bag' ? 2 : 1, location: fridge === 'Fridge' ? 1 : 2
        })

      }
      AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
        if (_units != null) {
          const {
            convertedVolume,
            convertedVolumeUnit
          } = volumeConversionHandler(_units === KeyUtils.UNIT_IMPERIAL, milkUnit, milkQuantity);
          // let sliderMaxValue = this.state.isFrom === 'bottleTracking' ? convertedVolume : this.state.maxVolumeValue
          this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL, volumeCount: convertedVolume,unit:convertedVolumeUnit}, () => {
            this.leftVolumeCount = this.state.volumeCount / 2
            this.rightVolumeCount = this.state.volumeCount / 2
            this.totalVolumeCount=this.state.volumeCount
          })
        }
      })

      var leftTimerValue = 0
      var rightTimerValue = 0
      AsyncStorage.getItem(KeyUtils.PUMPING_TIMER_VALUE).then(prevTimerCount => {
        if (prevTimerCount != null) {
          let remainingSeconds = parseInt(prevTimerCount)
          this.setState({
            leftStopwatchStart: true,
            showTimers: true
          })
          let minutes = Math.floor(remainingSeconds / 60);
          const seconds = remainingSeconds % 60;
          leftTimerValue =  seconds
        }
      });

      setTimeout(() => {
       this.handleValidations(true,leftTimerValue,rightTimerValue)
      }, 200)

    }
  }

 /* leftFormatTime=(value)=>{
    let _timer = value;
    let getSeconds = '', minutes = '', getMinutes = ''
    getSeconds = `0${(_timer % 60)}`.slice(-2)
    minutes = `${Math.floor(_timer / 60)}`
    getMinutes = `0${minutes % 60}`.slice(-2)
    this.durationLeftInMins=getMinutes
    this.durationLeftInSec=getSeconds


    AsyncStorage.getItem(KeyUtils.PUMPING_IS_VIRTUAL_FREEZER).then((_isEnable) => {
      if (_isEnable != null) {
        this.setState({saveToVirtualStorage: _isEnable === 'true'})
      }
    })

  }*/

  _handleBack=()=>{
    const {navigation}=this.props
    const {isFrom}=this.state
    if (isFrom == 'bluetooth') {
      this.pumpingDataObj['amountLeft'] = parseFloat(this.leftVolumeCount)
      this.pumpingDataObj['amountLeftUnit'] = this.state.unit
      this.pumpingDataObj['amountRight'] = parseFloat(this.rightVolumeCount)
      this.pumpingDataObj['amountRightUnit'] = this.state.unit
      this.pumpingDataObj['amountTotal'] = parseFloat(this.totalVolumeCount)
      this.pumpingDataObj['amountTotalUnit'] = this.state.unit
      this.pumpingDataObj['note'] = this.state.noteTextInput===undefined?'':this.state.noteTextInput.toString().trim()

      if (this.badSessionIndex > -1) {
        this.pumpingDataObj['isBadSession'] = this.badSessionIndex === 1
      }
      this.pumpingDataObj['lastBreast'] = this.endingPumpingSideList[this.lastBreastPumpingIndex].value

      this.props.pumpingManualData(this.pumpingDataObj)
      this.props.navigation.navigate("TrackingScreen")
    }
    navigation.popToTop()
    if (this.tabName != null) {
      NavigationService.navigate(this.tabName)
    } else {
     NavigationService.navigate('Baby')
    }
  }

  onAndroidBackPress = () => {
    const {isSessionActive,isFrom} = this.state
    this._handleBack()
    // if(isSessionActive && isFrom!== 'bluetooth') this.setState({showClearCounterAlert: true})
    // else this._handleBack()
    return true;
  }

  init() {

    const {isLeftPress,isFrom} = this.props.navigation.state.params
    let list = this.volumeList.map((e) => ({...e, label2: `0 ${this.state.unit}`}))
    this.setState({volumeList: list})
    this.setState({isFrom})
    this.lastBreastIndex = isLeftPress ? 0 : 1
    this.lastBreastPumpingIndex = 0

    // if (isFrom === 'bluetooth') {
    const {manualDataFromPumping} = this.props
    if(manualDataFromPumping && manualDataFromPumping!=null){
      console.log('this.props.sessionIndexValue --- ', this.props.sessionIndexValue)
      console.log("manualDataFromPumping-------- ", manualDataFromPumping)
      this.totalVolumeCount = manualDataFromPumping.amountTotal===undefined?0:manualDataFromPumping.amountTotal
      this.leftVolumeCount = manualDataFromPumping.amountLeft===undefined?0:manualDataFromPumping.amountLeft
      this.rightVolumeCount = manualDataFromPumping.amountRight===undefined?0:manualDataFromPumping.amountRight
      this.badSessionIndex = manualDataFromPumping.isBadSession ? 1 : 0

      if(manualDataFromPumping.lastBreast == 3){
        this.setState({defaultPumpingIndex:0})
      }else  if(manualDataFromPumping.lastBreast == 1){
        this.setState({defaultPumpingIndex:1})
      }else  if(manualDataFromPumping.lastBreast == 2){
        this.setState({defaultPumpingIndex:2})
      }

      this.totalVolumeCount = manualDataFromPumping.amountTotal
      this.volumeList[1].label2 = `${this.totalVolumeCount / 2} ${this.state.unit}`
      this.volumeList[2].label2 = `${this.totalVolumeCount / 2} ${this.state.unit}`

      this.volumeList[1].label2 = `${this.rightVolumeCount} ${this.state.unit}`
      this.volumeList[0].label2 = `${this.rightVolumeCount + this.leftVolumeCount} ${this.state.unit}`

      this.volumeList[2].label2 = `${this.leftVolumeCount} ${this.state.unit}`
      this.volumeList[0].label2 = `${this.rightVolumeCount + this.leftVolumeCount} ${this.state.unit}`

      this.setState({
        unit: manualDataFromPumping.amountLeftUnit,
        noteTextInput:manualDataFromPumping.note,
        volumeCount: manualDataFromPumping.amountTotal==undefined?0:manualDataFromPumping.amountTotal,
        sliderValue:manualDataFromPumping.amountTotal==undefined?0:manualDataFromPumping.amountTotal,
        volumeList:this.volumeList
      })
    }
    // }

    this.setState({connectionState:this.props.isConnected})

    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_P).then(value => {
      if (value === 'true') {
        this.props.setLeftTimerActive(true)
        this.setState({leftTimerRunnig : true})
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_P).then(startTime => {
          let st = parseInt(startTime)
          let difference = Date.now() - st;
          let secondsDifference = Math.floor(difference / 1000);
          let dd = parseInt(secondsDifference)
          AsyncStorage.getItem(KeyUtils.PUMPING_TIMER_VALUE).then(prevTimerCount => {
            if (prevTimerCount != null) {
              let remainingSeconds = parseInt(prevTimerCount)
              let totalCount = remainingSeconds + dd
              this.setState({
                leftStopwatchStart: true,
                timerValueLeft: totalCount,
                showTimers: true,
                isSessionActive:true
              }, () => AsyncStorage.setItem(KeyUtils.PUMPING_TIMER_VALUE, totalCount.toString()))
            } else {
              let totalCount = dd
              this.setState({
                leftStopwatchStart: true,
                timerValueLeft: totalCount,
                showTimers: true,
                isSessionActive:true
              }, () => AsyncStorage.setItem(KeyUtils.PUMPING_TIMER_VALUE, totalCount.toString()))
            }
          });
        });
      } else if (value == 'pause') {
        this.props.setLeftTimerActive(true)
        this.setState({leftTimerRunnig : true})
        AsyncStorage.getItem(KeyUtils.PUMPING_TIMER_VALUE).then(prevTimerCount => {
          let remainingSeconds = parseInt(prevTimerCount)
          this.setState({leftStopwatchStart: true,isSessionActive:true, timerValueLeft: remainingSeconds, showTimers: true})
        });
      } else {
        this.props.setLeftTimerActive(false)
        this.setState({isSessionActive:false, showTimers: true, timerValueLeft: 0, leftTimerRunnig : true})
      }
    });


   /* AsyncStorage.getItem(KeyUtils.BF_SESSION_TYPE).then(value => {
      if (value === 'true') {
        this.setState({isBreastFeedingSelected: true})
      } else {
        this.setState({isBreastFeedingSelected: false})
      }
    });*/

  /*  AsyncStorage.getItem(KeyUtils.BOTH_TIMER_ACTIVE).then(value => {
      if (value === 'true') {
        this.setState({
          isBLETimerRunning: true,
          rightStopwatchStart: false,
          leftStopwatchStart: false
        })
      } else {
        this.setState({
          isBLETimerRunning: false,
          rightStopwatchStart: true,
          leftStopwatchStart: true
        })
      }
    });*/
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
    this.totalVolumeCount = 0
    this.leftVolumeCount = 0
    this.rightVolumeCount = 0

  }

  async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {trackingApiSuccess,trackingApiFailure,createBottleApiSuccess,trackingResponse,
      isConnected, isLeftTimerActive, isRightTimerActive, manualDataFromPumping}=this.props
    const {leftTimerRunnig,rightTimerRunnig, isFrom}=this.state

    if (createBottleApiSuccess != prevProps.createBottleApiSuccess  && createBottleApiSuccess && prevState.isLoading){
      this.saveFreezerPumpingDataInDb(true)
    }

    if (isConnected !== prevProps.isConnected) {
      console.log("isConnected---Pumping screen----- ", isConnected)
      if(isConnected) {
        // if( isLeftTimerActive ) {
          this.props.setLeftTimerActive(false)
          this.props.setRightTimerActive(false)
          this.clearStoreAfterApiCall();
          if(manualDataFromPumping && manualDataFromPumping!=null){
            console.log('this.props.sessionIndexValue --- ', this.props.sessionIndexValue)
            console.log("manualDataFromPumping-------- ", manualDataFromPumping)
            this.totalVolumeCount = 0
            this.leftVolumeCount = 0
            this.rightVolumeCount = 0
            this.badSessionIndex = 0
            this.setState({defaultPumpingIndex:0,
              saveToVirtualStorage: false, trayNumber: '', number: '',
              containerType: -1, location: -1})
            this.setState({sliderValue:1},()=>{
              this.setState({sliderValue:0})
            })
            this.totalVolumeCount = 0
            this.volumeList[1].label2 = `${this.totalVolumeCount / 2} ${this.state.unit}`
            this.volumeList[2].label2 = `${this.totalVolumeCount / 2} ${this.state.unit}`

            this.volumeList[1].label2 = `${this.rightVolumeCount} ${this.state.unit}`
            this.volumeList[0].label2 = `${this.rightVolumeCount + this.leftVolumeCount} ${this.state.unit}`

            this.volumeList[2].label2 = `${this.leftVolumeCount} ${this.state.unit}`
            this.volumeList[0].label2 = `${this.rightVolumeCount + this.leftVolumeCount} ${this.state.unit}`

            this.setState({
              unit: manualDataFromPumping.amountLeftUnit,
              noteTextInput:'',
              volumeCount:0,
              volumeList:this.volumeList
            })
          }
          AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')
          this.setState({isFrom: 'bluetooth',
            leftTimerRunnig : false, rightTimerRunnig : false, connectionState:true})
        // }
      }
    }

    if(isFrom === 'bluetooth') {
      const {
        sonataData,
        flexData,
        pumpType,
        pumpRunning,
        connectionMessage,
        pumpingCountValue,
        sessionSaveFromPumping
      } = this.props

      // if(!this.props.pumpType)
      if(GetterSetter.getPumpName()==='sonata')
      {
        if (sonataData && sonataData != prevProps.sonataData) {

          this.setState({
            batteryCharging: sonataData.batteryCharging,
            timer: sonataData.timer,
            deviceState: sonataData.deviceState,
            battery_level: sonataData.battery_level,
            pumpLevel: sonataData.pumpLevel,
            phaseLevel: sonataData.phaseLevel,
            rhythemLevel: sonataData.rhythemLevel,
            deviceAlertState: sonataData.deviceAlertState,
            isFlex:false,
            goalTime: sonataData.goalTime
          })

          if(sonataData.goalTime > 0) {
            let val = sonataData.goalTime - sonataData.timer
            if(val<1) {
              this.setState({isGoalTimeComplete: true})
            }else{
              this.setState({isGoalTimeComplete: false})
            }
          }

          statusFlags = sonataData.statusFlags

          // if (sonataData.deviceState == 5 && sonataData.timer > 0 && pumpingCountValue == 0) {
          //   this.props.pumpingCount(1)
          //   sessionSaveFromPumping(true)
          //   setTimeout(() => {
          //     this.handleValidations()
          //   }, 2000)
          //
          // }
          //console.log('sonataData --------- ', sonataData.deviceState, pumpingCountValue)
        }
      }

      if(GetterSetter.getPumpName()==='flex') {
        if (flexData && flexData != prevProps.flexData) {
          this.setState({
            batteryCharging: flexData.batteryCharging,
            timer: flexData.timer,
            deviceState: flexData.deviceState,
            battery_level: flexData.battery_level,
            pumpLevel: flexData.pumpLevel,
            phaseLevel: flexData.phaseLevel,
            isFlex:true
          })

          statusFlags = flexData.statusFlags

          // if ((flexData.deviceState == 0 || flexData.deviceState == 3) && flexData.timer > 0 && pumpingCountValue == 0) {
          //   this.props.pumpingCount(1)
          //   sessionSaveFromPumping(true)
          //   setTimeout(() => {
          //     console.log('flexData --------- handleValidations()')
          //     this.handleValidations()
          //   }, 2000)
          // }
        }
      }

      if(GetterSetter.getPumpName()==='maxi') {
        if (flexData && flexData != prevProps.flexData) {
          this.setState({
            batteryCharging: flexData.batteryCharging,
            timer: flexData.timer,
            deviceState: flexData.deviceState,
            battery_level: flexData.battery_level,
            pumpLevel: flexData.pumpLevel,
            phaseLevel: flexData.phaseLevel,
            isFlex:true
          })

          statusFlags = flexData.statusFlags
        }
      }

      if (isConnected !== prevProps.isConnected) {
        console.log("isConnected-------- ", isConnected)
        this.setState({connectionState: isConnected})
      }

      // if (pumpType !== prevProps.pumpType) {
      //   console.log("pumpType-------- ", pumpType)
      //   this.setState({isFlex: this.props.pumpType})
      // }

      if (pumpRunning !== prevProps.pumpRunning) {
        console.log("pumpRunning----%%%%%%%%%%%%---- ", pumpRunning)
        this.setState({
          isBLETimerRunning: pumpRunning,
          rightStopwatchStart: !pumpRunning,
          leftStopwatchStart: !pumpRunning
        })
      }

      if (connectionMessage !== prevProps.connectionMessage) {
        console.log("connectionMessage-------- ", connectionMessage)
        this.setState({
          connectionMsg: connectionMessage,
        })
      }
    }else{
      if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
        if (trackingResponse && trackingResponse.successIds && trackingResponse.successIds.length>0){
          this.saveTrackingInDb(true,trackingResponse.successIds[0])
        }
        if (this.state.saveToVirtualStorage) {
          //todo check trackingResponse > 0
          //Save to Virtual Milk Storage API
          let apiObj = this.setupInventoryObject()
          this.saveFreezerPumpingDataInDb(false)
          if (this.props.isInternetAvailable) {
            let bottleData = Object.assign({ milkInventories: [apiObj] });
            this.props.createBottleApi(bottleData)
          }
        }
      }

      if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
        //this.saveTrackingInDb(false)
        this.setState({isLoading: false})
      }

    }
  }


  handleLeftStopWatchValue(obj) {
    const {
      getStartTimeValue,
      stopwatchSelected,
      stopwatchSelectedTimer,
      getEndTimeValue,
    } = obj;
    this.setState({defaultFeedingIndex: 0})
    this.lastBreastIndex=0
    if (getStartTimeValue) {
      this.props.setLeftTimerActive(true)
      this.setState({
        isSessionActive: stopwatchSelected,
        leftStopwatchStart: stopwatchSelected,
        leftStopwatchValue: stopwatchSelectedTimer,
        leftGetCurrentTime: getStartTimeValue,
        leftTimerRunnig : stopwatchSelected
      },()=>{
        //this.handleVolumeSide()
      });
    } else {
      this.props.setLeftTimerActive(false)
      this.setState({
        isSessionActive: stopwatchSelected,
        leftStopwatchStart: stopwatchSelected,
        leftStopwatchValue: stopwatchSelectedTimer,
        leftGetEndTime: getEndTimeValue,
        leftTimerRunnig : stopwatchSelected
      },()=>{
       // this.handleVolumeSide()
      });
    }

  }

  handleRightStopWatchValue(obj) {
    const {
      getStartTimeValue,
      stopwatchSelected,
      stopwatchSelectedTimer,
      getEndTimeValue,
    } = obj;
    this.setState({defaultFeedingIndex: 1})
    this.lastBreastIndex=1
    if (getStartTimeValue) {
      this.props.setRightTimerActive(true)
      this.setState({
        rightStopwatchStart: stopwatchSelected,
        rightStopwatchValue: stopwatchSelectedTimer,
        rightGetCurrentTime: getStartTimeValue,
        rightTimerRunnig : stopwatchSelected
      },()=>{
        this.handleVolumeSide()
      });
    } else {
      this.props.setRightTimerActive(false)
      this.setState({
        rightStopwatchStart: stopwatchSelected,
        rightStopwatchValue: stopwatchSelectedTimer,
        rightGetEndTime: getEndTimeValue,
        rightTimerRunnig : stopwatchSelected
      },()=>{
        this.handleVolumeSide()
      });
    }
  }

  handleVolumeSide(){
    let isLeftTimerRunning=!this.state.leftStopwatchStart
    let isRightTimerRunning=!this.state.rightStopwatchStart
    let isVolumeSelectedIndex=this.state.isVolumeSelectedIndex
    this.lastBreastPumpingIndex=this.state.defaultPumpingIndex
    if(isLeftTimerRunning && isRightTimerRunning){
      isVolumeSelectedIndex=0
      this.lastBreastPumpingIndex=0
    }else if (isLeftTimerRunning && !isRightTimerRunning){
      isVolumeSelectedIndex=1
      this.lastBreastPumpingIndex=1
    }else if (!isLeftTimerRunning && isRightTimerRunning){
      isVolumeSelectedIndex=2
      this.lastBreastPumpingIndex=2
    }
    this.setState({isVolumeSelectedIndex:isVolumeSelectedIndex,defaultPumpingIndex: this.lastBreastPumpingIndex,leftTimerPause:!isLeftTimerRunning,rightTimerPause:!isRightTimerRunning})
  }
  onFocusInputLeft = (value) => {
    this.setState({leftStopwatchStart: true, leftTimerPause: true})
    autoStartTime = false;
  }
  onFocusInputRight = (value) => {
    this.setState({rightStopwatchStart: true, rightTimerPause: true})
    autoStartTime = false;
  }

  sessionPaused(){
    const {leftTimerPause, rightTimerPause} = this.state;
    if(leftTimerPause &&  rightTimerPause){
      return (
        <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}>{I18n.t('breastfeeding_pump.pumping_paused')}</Text>
      );
    }
    else{
      return (
        <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}>{' '}</Text>
      );
    }
  }
  renderLeftIcons = (locale) => {
    switch(locale){
      case 'en' :
        return <Left width={verticalScale(72)} height={verticalScale(72)}  />
      case 'da':
        return <Left width={verticalScale(72)} height={verticalScale(72)}  />
      case 'nl':
        return <Left width={verticalScale(72)} height={verticalScale(72)}  />
      case 'fr':
        return <LeftFrench width={verticalScale(72)} height={verticalScale(72)}  />
      case 'de':
        return <Left width={verticalScale(72)} height={verticalScale(72)}  />
      case 'it':
      return <LeftItalian width={verticalScale(72)} height={verticalScale(72)}  />
      case 'nb':
        return <Left width={verticalScale(72)} height={verticalScale(72)}  />
      case 'no':
        return <Left width={verticalScale(72)} height={verticalScale(72)}  />
      case 'pt':
        return <LeftPortuguese width={verticalScale(72)} height={verticalScale(72)}  />
      case 'ru':
        return <LeftRussian width={verticalScale(72)} height={verticalScale(72)}  />
      case 'es':
        return <LeftSpanish width={verticalScale(72)} height={verticalScale(72)}  />
      case 'sv':
        return <LeftSwedish width={verticalScale(72)} height={verticalScale(72)}  />
      case 'ar':
        return <LeftArabic width={verticalScale(72)} height={verticalScale(72)}  />
      case 'pl':
        return <LeftPolish width={verticalScale(72)} height={verticalScale(72)}  />
      default:
        return <Left width={verticalScale(72)} height={verticalScale(72)}  />
    }
    }
    renderRightIcons = (locale) => {
      switch(locale){
        case 'en' :
          return <Right width={verticalScale(72)} height={verticalScale(72)}  />
        case 'da':
          return <Right width={verticalScale(72)} height={verticalScale(72)}  />
        case 'nl':
          return <Right width={verticalScale(72)} height={verticalScale(72)}  />
        case 'fr':
          return <RightFIPS width={verticalScale(72)} height={verticalScale(72)}  />
        case 'de':
          return <Right width={verticalScale(72)} height={verticalScale(72)}  />
        case 'it':
        return <RightFIPS width={verticalScale(72)} height={verticalScale(72)}  />
        case 'nb':
          return <Right width={verticalScale(72)} height={verticalScale(72)}  />
        case 'no':
          return <Right width={verticalScale(72)} height={verticalScale(72)}  />
        case 'pt':
          return <RightFIPS width={verticalScale(72)} height={verticalScale(72)}  />
        case 'ru':
          return <RightRussian width={verticalScale(72)} height={verticalScale(72)}  />
        case 'es':
          return <RightFIPS width={verticalScale(72)} height={verticalScale(72)}  />
        case 'sv':
          return <RightSwedish width={verticalScale(72)} height={verticalScale(72)}  />
        case 'ar':
          return <RightArabic width={verticalScale(72)} height={verticalScale(72)}  />
        case 'pl':
          return <RightPolish width={verticalScale(72)} height={verticalScale(72)}  />
        default:
          return <Right width={verticalScale(72)} height={verticalScale(72)}  />
      }
      }
  // renderLeftRightView() {
  //   const {
  //     leftStopwatchStart,
  //     rightStopwatchStart,
  //     timerValueLeft,
  //     timerValueRight,
  //     isItalian
  //   } = this.state;
  //   const {isLeftPress, isRightPress} = this.props.navigation.state.params
  //
  //   return <View style={{position: 'relative'}}>
  //     <View style={[styles.leftRightTimerViewStyle]}>
  //       <View>
  //         <CustomLeftTimer
  //           timerTypeStyle={2}
  //           isLeftPress={isLeftPress}
  //           // icon={!isItalian ? <Left width={Metrics.moderateScale._50} height={Metrics.moderateScale._50}/>: <S width={Metrics.moderateScale._50} height={Metrics.moderateScale._50}/>}
  //           icon={this.renderLeftIcons(I18n.locale.substr(0, 2))}
  //           getHours={(hrs) => {
  //           }}
  //           getMin={(min) => {
  //             this.durationLeftInMins = min==''?0:parseInt(min)
  //             if (this.durationLeftInMins>0 && this.state.isLeftTimerValue===0) {
  //               this.setState({isLeftTimerValue:this.durationLeftInMins})
  //             }
  //           }}
  //           getSec={(sec) => {
  //             this.durationLeftInSec = sec==''?0:parseInt(sec)
  //             if (this.durationLeftInSec>0 && this.state.isLeftTimerValue===0){
  //               this.setState({isLeftTimerValue:this.durationLeftInSec})
  //             }
  //           }}
  //           rightTimerInSec={this.durationRightInSec}
  //           rightTimerInMin={this.durationRightInMins}
  //           timerType={KeyUtils.BFnP_LEFT}
  //           isEditable={true}
  //           stopwatchStartStatus={leftStopwatchStart}
  //           isCallingFromBaby={false}
  //           isFocusInput={(value) => this.onFocusInputLeft(value)}
  //           changeValue={this.handleLeftStopWatchValue}
  //           navigation={this.props.navigation}
  //           secondsDifference={timerValueLeft}
  //           isPausedFromSiri={this.props.navigation.state.params.pauseBreasefeeding!==undefined?true:false}/>
  //       </View>
  //       <View style={{
  //         marginTop: verticalScale(30),
  //         alignItems: 'center'
  //       }}>
  //         <Button
  //           title={I18n.t('breastfeeding_pump.both')}
  //           disabled={true}
  //           style= {I18n.t('breastfeeding_pump.both').length >5?[styles.buttonContainer,{width:Metrics.moderateScale._70,backgroundColor:!leftStopwatchStart && !rightStopwatchStart ? Colors.rgb_ffcd00 : Colors.rgb_d8d8d8 }]: [styles.buttonContainer,{backgroundColor:!leftStopwatchStart && !rightStopwatchStart ? Colors.rgb_ffcd00 : Colors.rgb_d8d8d8 }]}/>
  //       </View>
  //
  //       <View>
  //         <CustomRightTimer
  //           timerTypeStyle={2}
  //           isRightPress={isRightPress}
  //           // icon={!isItalian ? <Right width={Metrics.moderateScale._50} height={Metrics.moderateScale._50}/> : <D width={Metrics.moderateScale._50} height={Metrics.moderateScale._50}/>}
  //           icon={this.renderRightIcons(I18n.locale.substr(0, 2))}
  //           getHours={(hrs) => {
  //           }}
  //           getMin={(min) => {
  //             this.durationRightInMins = min==''?0:parseInt(min)
  //             if (this.durationRightInMins>0 && this.state.isRightTimerValue===0) {
  //               this.setState({isRightTimerValue:this.durationRightInMins})
  //             }
  //           }}
  //           getSec={(sec) => {
  //             this.durationRightInSec = sec==''?0:parseInt(sec)
  //             if (this.durationRightInSec>0 && this.state.isRightTimerValue==0){
  //               this.setState({isRightTimerValue:this.durationRightInSec})
  //             }
  //           }}
  //           leftTimerInSec={this.durationLeftInSec}
  //           leftTimerInMin={this.durationLeftInMins}
  //           timerType={KeyUtils.BFnP_RIGHT}
  //           isEditable={true}
  //           isFocusInput={(value) => this.onFocusInputRight(value)}
  //           stopwatchStartStatus={rightStopwatchStart}
  //           changeValue={this.handleRightStopWatchValue}
  //           isCallingFromBaby={false}
  //           navigation={this.props.navigation}
  //           secondsDifference={timerValueRight}
  //           isPausedFromSiri={this.props.navigation.state.params.pauseBreasefeeding!==undefined?true:false}/>
  //       </View>
  //
  //     </View>
  //     <View style={styles.sessionPausedViewStyle}>
  //       {this.sessionPaused()}
  //     </View>
  //   </View>
  // }
  updateStartTime(date){
      if(this.updateTimerFlag === false){
        this.updateTimerFlag = true;
          let updateDate = date === undefined ?  Date.now() : date.getTime() ; 
          this.setState({timeCalendarDate:moment(updateDate),timeCalendarDateAM:moment(updateDate)})
          AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING,updateDate.toString());    
      }
  }

  renderPumpTimerFromBLEView() {
    const {
      batteryCharging,
      isBLETimerRunning,
      timer,
      connectionState,
      battery_level,
      goalTime
    } = this.state;

    return <View style={{justifyContent:'center',paddingHorizontal:20}}>
      <View style={styles.leftRightTimerViewStyle}>
        <View>
          <View
            style={[
              styles.StopwatchBtnStyle,
              isBLETimerRunning
                ? {backgroundColor: Colors.rgb_fd0807}
                : {backgroundColor: Colors.rgb_d8d8d8},
            ]}>
            <Text maxFontSizeMultiplier={1.7}
                  style={[
                    styles.StopwatchBtnText,
                    isBLETimerRunning
                      ? {color: Colors.white}
                      : {color: Colors.rgb_3E3E3E},
                  ]}>
              {!isBLETimerRunning
                ? I18n.t('sleep.start').toUpperCase()
                : I18n.t('sleep.pause').toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={{
          alignItems: 'center',
          justifyContent:'center',
          position:'absolute',
          right:Metrics.moderateScale._35,
          height:'100%'
        }}>
          {<View style={styles.batteryViewStyle}>
            {batteryCharging == 1 ? <BatteryCharge/> : <Battery/>}
            {connectionState ? <Text maxFontSizeMultiplier={1.7} style={[styles.batteryLableStyle,{color:this.textColor}]}>{battery_level}</Text>: <Text maxFontSizeMultiplier={1.7} style={[styles.batteryLableStyle,{color:this.textColor}]}>{'-/-'}</Text>}
          </View>}
          {connectionState ? <Bluetooth width={Metrics.moderateScale._30} height={Metrics.moderateScale._30} style={styles.imgStyle}/>
            : <Bluetooth_off width={Metrics.moderateScale._30} height={Metrics.moderateScale._30} style={styles.imgStyle} />}
        </View>
      </View>
      <View style={styles.messageViewStyle}>
        {this.showStatus()}
      </View>
      {this.showGoalTimer()}
      {this.formatTime(timer, goalTime)}


    </View>
  }

  renderManualTimer() {
    const {
      batteryCharging,
      isBLETimerRunning,
      timer,
      connectionState,
      battery_level,
      goalTime
    } = this.state;

    const {
      leftStopwatchStart,
      rightStopwatchStart,
      timerValueLeft,
      timerValueRight,
      isItalian,
      handlePumpTimer
    } = this.state;
    const {isLeftPress, isRightPress} = this.props.navigation.state.params
    return <View style={{position: 'relative',marginTop:verticalScale(10),paddingHorizontal:Metrics.moderateScale._18}}>

      <CustomPumpingTimer
        ref={this.customPumpingTimer}
        timerTypeStyle={3}
        isLeftPress={isLeftPress}
        callChild={handlePumpTimer}
        // icon={!isItalian ? <Left width={Metrics.moderateScale._50} height={Metrics.moderateScale._50}/>: <S width={Metrics.moderateScale._50} height={Metrics.moderateScale._50}/>}
        // icon1={this.renderLeftIcons(I18n.locale.substr(0, 2))}
        // icon2={this.renderRightIcons(I18n.locale.substr(0, 2))}
        getHours={(hrs) => {
          if (parseInt(hrs)>0){
            this.durationBothInHour=parseInt(hrs)
          }
        }}
        getMin={(min) => {
          this.durationBothInMins = min==''?0:parseInt(min)
          if (this.durationBothInMins>0 && this.state.isLeftTimerValue===0) {
            //this.setState({isLeftTimerValue:this.durationLeftInMins})
          }
        }}
        getSec={(sec) => {
          this.durationBothInSec = sec==''?0:parseInt(sec)
          if (this.durationBothInSec>0 && this.state.isLeftTimerValue===0){
           // this.setState({isLeftTimerValue:this.durationLeftInSec})
          }
        }}
        onPressTimer={(status)=>{
          this.updateStartTime()
        }}
        rightTimerInSec={this.durationRightInSec}
        rightTimerInMin={this.durationRightInMins}
        timerType={KeyUtils.BFnP_LEFT}
        isEditable={true}
        stopwatchStartStatus={leftStopwatchStart}
        isCallingFromBaby={false}
        isFocusInput={(value) => this.onFocusInputLeft(value)}
        changeValue={this.handleLeftStopWatchValue}
        navigation={this.props.navigation}
        secondsDifference={timerValueLeft}
        isPausedFromSiri={this.props.navigation.state.params.pauseBreasefeeding!==undefined?true:false}/>
    </View>
  }

  showGoalTimer(){
    const {goalTime, isGoalTimeComplete} = this.state;
    return(
      <View style={styles.GoalTimerViewStyle}>
        {!isGoalTimeComplete && <GoalClock/>}
        {!isGoalTimeComplete ? <Text maxFontSizeMultiplier={1.7}
                                     style={styles.goalTimerLabelStyle}>{getFormattedTime(goalTime)}</Text>:
          <Text maxFontSizeMultiplier={1.7} style={styles.goalTimerLabelStyle}>{''}</Text>}
      </View>
    )
  }

  showStatus(){
    const {
      connectionState,
      connectionMsg,
      deviceAlertState
    } = this.state;
    if(this.props.isConnectionPause) {
      return (
        <View style={{alignItems:'center'}}>
        <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}>{I18n.t('ble_pumping.pumping_paused')}</Text>
              {GetterSetter.getPumpName()==='flex' && connectionState ?
              <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}>{I18n.t('breastfeeding_pump.pumping_paused_flex')}</Text>
              :
              GetterSetter.getPumpName()==='maxi' && connectionState ?
              <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}>{I18n.t('breastfeeding_pump.pumping_paused_maxi')}</Text>
              :
              GetterSetter.getPumpName()==='sonata' && connectionState ?
              <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}>{I18n.t('breastfeeding_pump.pumping_paused_sonata')}</Text>
              : null
            }
     </View>
      )
    }else if(!connectionState){
      return (
        <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}>{this.props.connectionMessage}</Text>
      )
    }else if(deviceAlertState == 32){
      return (
        <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}>{I18n.t('breastfeeding_pump.air_leaked')}</Text>
      )
    }else{
      return (
        <Text maxFontSizeMultiplier={1.7}
              style={styles.pumpSettingBleMessageLableStyle}> </Text>
      )
    }
  }

  formatTime = (value, gt) => {
    const {isGoalTimeComplete} = this.state

    if(parseInt(gt)>0 && this.isCountDownSelected) {
      let timeValue = parseInt(gt) - parseInt(value);
      let _timer, formatTime;
      let getSeconds = '', minutes = '', getMinutes = '';
      if(timeValue>0) {
        _timer = timeValue
        getSeconds = `0${(_timer % 60)}`.slice(-2);
        minutes = `${Math.floor(_timer / 60)}`;
        getMinutes = `0${minutes % 60}`.slice(-2);

        this.durationBothInMins = parseInt(getMinutes);
        this.durationBothInSec = parseInt(getSeconds);

        formatTime = '00:'+getMinutes + ':' + getSeconds;
        return (
          <TouchableOpacity activeOpacity={1} onPress={()=>this.isCountDownSelected = !this.isCountDownSelected}>
            <View style={styles.GoalTimerBgStyle}>
              {!isGoalTimeComplete && (this.isCountDownSelected ? <Down style={{position: 'absolute', left: 10}}/> : <Up style={{position:'absolute', left:10}}/>)}
              <Text maxFontSizeMultiplier={1.7} style={styles.pumpTimerTextStyle}>{formatTime}</Text>
            </View>
          </TouchableOpacity>
        );
      }else{
        _timer = value
        getSeconds = `0${(_timer % 60)}`.slice(-2);
        minutes = `${Math.floor(_timer / 60)}`;
        getMinutes = `0${minutes % 60}`.slice(-2);

        this.durationBothInMins = parseInt(getMinutes);
        this.durationBothInSec = parseInt(getSeconds);

        formatTime = '00:'+getMinutes + ':' + getSeconds;
        return (
          <TouchableOpacity activeOpacity={1} onPress={()=>this.isCountDownSelected = !this.isCountDownSelected}>
            <View style={styles.GoalTimerBgStyle}>
              {!isGoalTimeComplete && (this.isCountDownSelected ? <Down style={{position: 'absolute', left: 10}}/> : <UpTime style={{position:'absolute', left:10}}/>)}
              <Text maxFontSizeMultiplier={1.7} style={styles.pumpTimerTextStyle}>{formatTime}</Text>
            </View>
          </TouchableOpacity>
        );
      }

    }else{
      let _timer = value, formatTime;
      let getSeconds = '', minutes = '', getMinutes = '';

      getSeconds = `0${(_timer % 60)}`.slice(-2);
      minutes = `${Math.floor(_timer / 60)}`;
      getMinutes = `0${minutes % 60}`.slice(-2);

      this.durationBothInMins = parseInt(getMinutes);
      this.durationBothInSec = parseInt(getSeconds);

      formatTime = '00:'+getMinutes + ':' + getSeconds
      return (
        <TouchableOpacity activeOpacity={1} onPress={()=> {
          if(parseInt(gt) > 0 )
            this.isCountDownSelected = !this.isCountDownSelected;
        }}>
          <View style={styles.GoalTimerBgStyle}>
            {!isGoalTimeComplete && (this.isCountDownSelected ? <Down style={{position: 'absolute', left: 10}}/> : <UpTime style={{position:'absolute', left:10}}/>)}
            <Text maxFontSizeMultiplier={1.7} style={styles.pumpTimerTextStyle}>{formatTime}</Text>
          </View>
        </TouchableOpacity>
        // <View style={styles.timerBgStyle}>
        //   <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingTextStyle, {flex: 1, textAlign: 'center'}]}>{formatTime}</Text>
        // </View>
      )

    }
  }


  handleChangeValue = (value) => {
    const {isVolumeSelectedIndex, volumeCount, volumeList} = this.state
    let currentValue = parseFloat(value)

    if (isVolumeSelectedIndex == -1) {
      volumeList[0].label2 = `${value} ${this.state.unit}`
      this.totalVolumeCount = currentValue
      this.setState({isVolumeSelectedIndex: 0, volumeList})
    } else {
      let previousCount = parseFloat(volumeCount)
      switch (isVolumeSelectedIndex) {
        case 0:
          this.totalVolumeCount = parseFloat(value).toFixed(2)
          volumeList[isVolumeSelectedIndex].label2 = `${value} ${this.state.unit}`
          volumeList[1].label2 = `${this.totalVolumeCount / 2} ${this.state.unit}`
          volumeList[2].label2 = `${this.totalVolumeCount / 2} ${this.state.unit}`
          this.leftVolumeCount = this.totalVolumeCount / 2
          this.rightVolumeCount = this.totalVolumeCount / 2
          break
        case 2:
          //volumeList[1].label2 = `0 ml`
          this.rightVolumeCount = currentValue
          volumeList[2].label2 = `${this.rightVolumeCount} ${this.state.unit}`
          volumeList[0].label2 = `${currentValue + this.leftVolumeCount} ${this.state.unit}`
          this.totalVolumeCount=currentValue + this.leftVolumeCount
          break
        case 1:

          this.leftVolumeCount = currentValue
          volumeList[1].label2 = `${this.leftVolumeCount} ${this.state.unit}`
          volumeList[0].label2 = `${this.rightVolumeCount + this.leftVolumeCount} ${this.state.unit}`
          this.totalVolumeCount=this.rightVolumeCount + this.leftVolumeCount
          break
      }
      this.setState({isVolumeSelectedIndex: isVolumeSelectedIndex, volumeList,totalVolume:this.totalVolumeCount})
    }
    this.pumpingDataObj['amountLeft'] = parseFloat(this.leftVolumeCount)
    this.pumpingDataObj['amountLeftUnit'] = this.state.unit
    this.pumpingDataObj['amountRight'] = parseFloat(this.rightVolumeCount)
    this.pumpingDataObj['amountRightUnit'] = this.state.unit
    this.pumpingDataObj['amountTotal'] = parseFloat(this.totalVolumeCount)
    this.pumpingDataObj['amountTotalUnit'] = this.state.unit
    this.props.pumpingManualData(this.pumpingDataObj)
    this.setState({
      volumeCount: value,
    });
  };
  nearestMaxValue=(maxValue,multiplicity)=>{
    let temp=0;
    while (temp<maxValue) {
      temp+=multiplicity;
    }
    return temp;
  }
  renderVolumeView() {
    const {volumeList, maxVolumeValue,isVolumeSelectedIndex,leftStopwatchStart , rightStopwatchStart, volumeCount,unit,sliderValue,isFocus,isSliderLoadingDone,CustomMeasurementView,CustomVolumeSlider,accuracy} = this.state
    let multiplicityValue = 10
    unit === 'oz' && (multiplicityValue = 0.25)
    // if (getVolumeUnits() === 'oz') {
    //   multiplicityValue = 0.25
    // }
    return <View style={styles.volumeView}>
      <View style={{paddingHorizontal:20,marginHorizontal:Platform.OS==='ios'?11:10}}>
        <View style={{flex: 1,}}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.total_volume')}</Text>
        </View>

        <View style={styles.volumeLeftRightView}>
          <CustomOptionSelector
            buttonContainerStyle={{width: width / 3 - 24, height: 50, flexDirection: 'column', paddingVertical: 10}}
            data={volumeList}
            defaultSelectedIndex={isVolumeSelectedIndex}
            onChange={(item, index) => {
              this.setState({isVolumeSelectedIndex: index, defaultPumpingIndex:index},()=>{
                this.lastBreastPumpingIndex = index
                this.pumpingDataObj['lastBreast'] = this.endingPumpingSideList[index].value
                this.props.pumpingManualData(this.pumpingDataObj)
              })
            }}/>
        </View>
      </View>
      {/* <View style={{position:'relative',right:50}}> */}
      <Suspense fallback={
        <View style={{height:170}}>
          <LoadingSpinner/>
        </View>
      }>
        <CustomVolumeSlider
            multiplicity={multiplicityValue}
            //maxSliderValue={maxVolumeValue}
            maxSliderValue={this.nearestMaxValue(maxVolumeValue,multiplicityValue)}
            restrictPoint={maxVolumeValue}
            //value={volumeCount}
            changeValue={this.handleChangeValue}
            range={unit==='oz'?1:50}
            accuracy={unit === 'oz'?accuracy:true}
            onScrollBeginDrag={()=>{
              if(this.nameRef.isFocused()){
                this.nameRef.blur();
              }
              this.setState({accuracy:false})
            }}
            //sliderStyle={{position:'relative',right:Platform.OS=='ios'?31:30}}
            //changeValue={(volumeCount)=>{this.setState({volumeCount})}}
            decimalPlaces={unit==='oz'?2:0}
            isLoadingComplete={(isSliderLoadingDone)=>{this.setState({isSliderLoadingDone})}}
            value={sliderValue}
            numberColor={this.textColor}
          />

        {/*    <View style={styles.volumeCountView}>
          <Text maxFontSizeMultiplier={1.7} style={styles.volumeCountTextStyles}>{`${volumeCount} ${getVolumeUnits()}`}</Text>
        </View>*/}

        <CustomMeasurementView
          //value={volumeCount}
          maxValue={maxVolumeValue}
          //textInputValue={(value) => this.setState({volumeCount: value})}
          units={unit && unit != undefined && I18n.t(`units.${unit.toLowerCase()}`)}
          inputRef={(input)=>{ this.nameRef = input }}
          onBlur={()=>{
            this.setState({isFocus:false,accuracy:false})
          }}
          onFocus={()=>{
            this.setState({isFocus:true,sliderValue:volumeCount,accuracy:true})
          }}
          textInputValue={(value)=>{
            let temp=parseFloat(value==''||value==undefined?0:value)
            this.setState({sliderValue:isNaN(temp)?0:temp})
          }}
          value={isFocus?sliderValue+'':volumeCount+''}
          style={{height:48,width:48}}
          inputStyle={{height:48,width:48}}
          height={48}
        />
      </Suspense>
      {/* </View> */}
    </View>
  }


  renderEndingSide() {
    const { defaultFeedingIndex} = this.state
    return <View style={[styles.endingSideView,{paddingHorizontal:15}]}>
      <View style={{flex: 1}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.ending_side')}</Text>
      </View>

      <View style={styles.sessionRightView}>
        <CustomOptionSelector
          buttonContainerStyle={{width: 100}}
          defaultSelectedIndex={defaultFeedingIndex}
          data={this.endingSideList} onChange={(item, index) => this.lastBreastIndex = index}/>
      </View>
    </View>
  }


  renderPumpingEndingSide() {

    const {defaultPumpingIndex} = this.state
    return <View style={[styles.endingSideView,{paddingHorizontal:15}]}>
      <View style={{flex: 1}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.ending_side')}</Text>
      </View>

      <View style={styles.sessionRightView}>
        <CustomOptionSelector
          buttonContainerStyle={{width: 63,height:48}}
          defaultSelectedIndex={defaultPumpingIndex}
          data={this.endingPumpingSideList} onChange={(item, index) => {
          this.lastBreastPumpingIndex = index
          this.pumpingDataObj['lastBreast'] = this.endingPumpingSideList[index].value
          this.props.pumpingManualData(this.pumpingDataObj)
        }}/>
      </View>
    </View>
  }

  renderVirtualFreezer() {
    const {pumpingManualData} = this.props
    const {containerType,location} = this.state
    return <View style={{marginTop: 10, marginLeft: -5}}>
      <View style={{flex: 2}}>
      </View>
      <View style={styles.bottleBagView}>
        <CustomOptionSelector
          buttonContainerStyle={[styles.freezerButtonContainer,{height:48}]}
          defaultSelectedIndex={containerType > 0 ? containerType == 2 ? 1 : 0 : containerType}
          data={this.bottleBagOption} onChange={(item,index) => {
          this.inventoryObj={
            ...this.pumpingDataObj.inventory,
            containerType:index===1?2:1
          }
          this.pumpingDataObj['inventory']=this.inventoryObj
          pumpingManualData(this.pumpingDataObj)
          index===1 ? this.setState({ containerType: 2 }) : this.setState({ containerType: 1 })
        }}/>
        <View style={{flex: 1, height: 50,}}>
          <CustomTextInput
            inputStyle={[styles.numberTextInput,{color:this.textColor,height:48}]}
            style={{height: 30}}
            maxLength={3}
            textContentType="postalCode"
            placeholder={I18n.t('breastfeeding_pump.number')}
            placeholderTextColor={this.textColor}
            textStyles={[styles.numberTextInput,{color:this.textColor}]}
            value={this.state.number+''}
            onChangeText={(index, value) => {
              if (value>250){
                this.setState({showErrorPrompt: true,errorMessage:I18n.t('virtual_freezer.number_limit_msg')})
                this.inventoryObj={
                  ...this.pumpingDataObj.inventory,
                  number: ''
                }
                this.pumpingDataObj['inventory']=this.inventoryObj
                pumpingManualData(this.pumpingDataObj)
                this.setState({ number: '' })
              }
              else if(validateSpecialChracter(value.toString())){
                this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.container_special_character_error')})
                this.setState({number:validateSpecialChracter(value.toString())===true?'':value})
                this.inventoryObj={
                  ...this.pumpingDataObj.inventory,
                  number: ''
                }
                this.pumpingDataObj['inventory']=this.inventoryObj
                pumpingManualData(this.pumpingDataObj)
              }
              else {
                this.inventoryObj={
                  ...this.pumpingDataObj.inventory,
                  number: value
                }
                this.pumpingDataObj['inventory']=this.inventoryObj
                pumpingManualData(this.pumpingDataObj)
                this.setState({ number: value })
              }

            }}
          />
        </View>
      </View>

      <View style={styles.fridgeFreezerView}>
        <CustomOptionSelector
          buttonContainerStyle={[styles.freezerButtonContainer,{height:48}]}
          defaultSelectedIndex={location > 0 ? location == 2 ? 1 : 0 : location}
          data={this.fridgeFreezerOption} onChange={(item,index) => {
          this.inventoryObj={
            ...this.pumpingDataObj.inventory,
            location: index === 1?2:1
          }
          this.pumpingDataObj['inventory']=this.inventoryObj
          pumpingManualData(this.pumpingDataObj)
          index === 1 ? this.setState({ location: 2 }) : this.setState({ location: 1 })
        }}/>
        <View style={{ flex: 1, height: 50, }}>
          <CustomTextInput
            inputStyle={[styles.numberTextInput,{color:this.textColor,height:48}]}
            style={{height: 30}}
            maxLength={3}
            textContentType="postalCode"
            placeholder={I18n.t('breastfeeding_pump.tray')}
            placeholderTextColor={this.textColor}
            textStyles={[styles.numberTextInput,{color:this.textColor}]}
            value={this.state.trayNumber+ ''}
            onChangeText={(index, value) => {
              if (value>250){
                this.setState({showErrorPrompt: true,errorMessage:I18n.t('virtual_freezer.tray_limit_msg')})
                this.inventoryObj={
                  ...this.pumpingDataObj.inventory,
                  trayNumber: ''
                }
                this.pumpingDataObj['inventory']=this.inventoryObj
                pumpingManualData(this.pumpingDataObj)
                this.setState({trayNumber: ''})
              }
              else if(validateSpecialChracter(value.toString())){
                this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_special_character_error')})
                this.setState({trayNumber:validateSpecialChracter(value.toString())===true?'':value})
                this.inventoryObj={
                  ...this.pumpingDataObj.inventory,
                  trayNumber: ''
                }
                this.pumpingDataObj['inventory']=this.inventoryObj
                pumpingManualData(this.pumpingDataObj)
              }
              else {
                this.inventoryObj={
                  ...this.pumpingDataObj.inventory,
                  trayNumber: value
                }
                this.pumpingDataObj['inventory']=this.inventoryObj
                pumpingManualData(this.pumpingDataObj)
                this.setState({trayNumber: value})
              }

            }}
          />
        </View>
      </View>
      {this.state.showErrorPrompt && <Text maxFontSizeMultiplier={1.7} style={[styles.volumeCountTextStyles, {
        color: 'red',
        marginTop: 15
      }]}>{this.state.errorMessage}</Text>}
      <Text maxFontSizeMultiplier={1.7}
            style={[styles.virtualFreezerTextStyle, { marginBottom: 5 ,color:this.textColor}]}
            onPress={() => this.props.navigation.navigate('CheckAvailableInventory', { isCheckInventory: true })}>
        {I18n.t('breastfeeding_pump.Check_available_inventory')}
      </Text>

    </View>
  }

  renderExperienceView() {
    const {navigation} = this.props
    const { isPumpSelected} = this.state
    return <View style={[styles.endingSideView,{paddingHorizontal:15}]}>
      <View style={{flex: 1.5}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.experience')}</Text>
      </View>

      <View style={styles.sessionRightView}>

        <CustomOptionSelector
          data={this.experienceList}
          buttonContainerStyle={{width: 100,height:48}}
          defaultSelectedIndex={this.badSessionIndex}
          onChange={(item, index) => this.addExperience(index)}/>

      </View>
    </View>
  }

  async addExperience(index){
    let neverShowArticles =  await AsyncStorage.getItem(KeyUtils.NEVER_SHOW_BAD_ARTICLES)
    if(index === 1 && !neverShowArticles){
      this.setState({ showBadArticles: true })
    }
    this.badSessionIndex = index;
    this.pumpingDataObj['isBadSession'] = index === 1;
    this.props.pumpingManualData(this.pumpingDataObj);
  }

  _onDateChange = (date) => {
    this.setState({
      selectedDate: date
    });
  }

  positiveOnPress = () => {
    this.setState({
      showCalendarPicker: false
    });
  }

  negativeOnPress = () => {
    this.setState({
      selectedDate: new Date(),
      showCalendarPicker: false
    });
  }
  handleFreezerValidations() {
    if (this.state.containerType === -1) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.container_type_error')})
      return false
    }

    else if (this.state.location === -1) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.location_type_error')})
      return false
    }
    else if (this.state.number == '') {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.number_error')})
      return false
    }
    else if (this.state.trayNumber === '') {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_error')})
      return false
    }else if (this.state.number == 0) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.number_zero_error')})
      return false
    }
    else if (this.state.trayNumber == 0) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_zero_error')})
      return false
    } else if (this.state.volumeCount<=0){
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.volume_error_msg')})
      return false
    }
    else{
      return true
    }
  }
  renderBottomView() {
    const {userProfile}=this.props
    const {rightStopwatchStart, leftStopwatchStart,
      isFlex,selectedDate, noteTextInput,isLeftTimerValue,isRightTimerValue,saveToVirtualStorage, isFrom} = this.state
    let isDisable= (!rightStopwatchStart || !leftStopwatchStart ) || (isRightTimerValue==0 && isLeftTimerValue==0)  || (this.state.isFrom === 'bluetooth' && isFlex && this.flexDataList.length === 0 )
    let a = moment();//now
    let b = moment(selectedDate);
    let diff=a.diff(b, 'days')
    return <View style={{paddingHorizontal:20}}>
      <CustomTextInput
        inputStyle={{height:48}}
        maxLength={1000}
        textContentType="familyName"
        value={noteTextInput}
        onChangeText={(index, value) => {
          this.setState({noteTextInput: value})
          this.pumpingDataObj['note'] = value.toString().trim()
          this.props.pumpingManualData(this.pumpingDataObj)
        }}
        placeholder={I18n.t('breastfeeding_pump.add_note')}
        placeholderTextColor={this.textColor}
        textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
        multiline={true}
        maxHeight={50}
        enableDoneButton={true}
      />

      { userProfile && userProfile != null && userProfile.mother && userProfile.mother != null && userProfile.mother.vipStatus &&  <View style={styles.virtualFreezerSaveView}>
        <Text maxFontSizeMultiplier={1.7} style={styles.virtualFreezerTextStyle}>{I18n.t('breastfeeding_pump.save_to_virtual_freezer')}</Text>
        {saveToVirtualStorage ?
          <Active style={styles.rightArrowStyle} width={45} height={45} onPress={() => {
            AsyncStorage.setItem(KeyUtils.PUMPING_IS_VIRTUAL_FREEZER, 'false');
            delete this.pumpingDataObj.inventory
            this.props.pumpingManualData(this.pumpingDataObj)
            this.setState({saveToVirtualStorage: false})
          }}/>
          : <Inactive style={{}} width={45} height={45} onPress={() => {
            AsyncStorage.setItem(KeyUtils.PUMPING_IS_VIRTUAL_FREEZER, 'true');
            this.props.pumpingManualData(this.pumpingDataObj)
            this.setState({saveToVirtualStorage: true})
            setTimeout(() => {this.scrollView.scrollToEnd({animated: true})}, 100)
          }}/>}
      </View>}
      {saveToVirtualStorage &&  this.renderVirtualFreezer()}
      {isFrom !== 'bluetooth' && <View style={styles.cancelSaveView}>
        <Button title={I18n.t('generic.cancel').toUpperCase()} textStyle={styles.cancelTextStyle}
                onPress={() => this.setState({showClearCounterAlert: true})}
                style={[styles.cancelButtonStyles,{height:48}]}/>
        <Button
    disabled={(this.state.isFrom === 'bluetooth' && isFlex && this.flexDataList.length === 0)|| this.state.disableButton}
    title={I18n.t('generic.save').toUpperCase()}
     textStyle={styles.saveTextStyle} 
     onPress={() => {
       if (this.state.volumeCount > 0) {
        if (this.state.saveToVirtualStorage) {
          if (this.handleFreezerValidations()) {
            this.setState({disableButton: true});
          }
        } else {
          this.setState({disableButton: true});
        }
       }
          AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_P).then(value => {
            console.log('IS_TIME--',value)
            if (value=='true'){
              this.setState({handlePumpTimer:1,leftStopwatchStart:!leftStopwatchStart,rightStopwatchStart:!rightStopwatchStart},()=>this.handleVolumeValidation())
            }else{
              this.handleVolumeValidation()
            }
          })

        }}
          style={styles.saveButtonStyles}/>
      </View>}
    </View>
  }

  getSelectedBabyDetails(item) {
    //Baby's data
    //this.setState({babyId: item.babyId})
  }


  showVolumeDialog() {
    const {showVolumeAlert} = this.state
    return (
      <Dialog
        visible={showVolumeAlert}
        title={I18n.t('volume_popup.title')}
        message={I18n.t('volume_popup.message')}
        positive={I18n.t('volume_popup.add_amount')}
        negative={I18n.t('volume_popup.save_without_amount')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showVolumeAlert: false})
          if (this.state.saveToVirtualStorage) {
            if (this.handleFreezerValidations()) {
              this.handleValidations()
            }
          }
          else {
            this.handleValidations()
          }
        }}
        positiveOnPress={() => {
          this.setState({showVolumeAlert: false})
        }}
        neutral={I18n.t('volume_popup.never_show_again')}
        neutralPress={() => {
          AsyncStorage.setItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN, 'true');
          this.setState({showVolumeAlert: false})
          if (this.state.saveToVirtualStorage) {
            if (this.handleFreezerValidations()) {
              this.handleValidations()
            }
          }
          else {
            this.handleValidations()
          }
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  showClearCounterPopup() {
    const {showClearCounterAlert} = this.state
    return (
      <Dialog
        visible={showClearCounterAlert}
        title={I18n.t('tracking.title')}
        message={I18n.t('tracking.tracking_clear_message')}
        positive={I18n.t('generic.yes')}
        negative={I18n.t('generic.no')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showClearCounterAlert: false})

        }}
        positiveOnPress={async() => {
          this.setState({showClearCounterAlert: false})
          this.clearStoreAfterApiCall()
          this.props.setLeftTimerActive(false)
          this.props.setRightTimerActive(false)
          let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
          if(lastSession==='Start breastfeeding' || lastSession==='Pause breastfeeding'|| lastSession==='Continuebreastfeeding'|| lastSession==='StopBreastfeeding' || lastSession=== 'Stop Pumping' || lastSession=== 'Start Pumping' ){
            AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, '')
            AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT,'')
            AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT,'')
          }
          AsyncStorage.setItem(KeyUtils.P_RESET_TIMER, 'true').then(() => {
            let keys = [
              KeyUtils.BF_SESSION_TYPE,
              KeyUtils.PUMPING_TIMER_VALUE,
              KeyUtils.IS_TIME_ACTIVE_P,
              KeyUtils.START_TIMESTAMP_P,
              KeyUtils.IS_P_TIMER_STARTED,
              KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING,
              KeyUtils.BACKGROUND_TIME_STAMP
            ]
            AsyncStorage.multiRemove(keys).then((res) => {
              this._handleBack()
            });
          });
        }}
        onDismiss={() => {
        }}
      />
    )
  };


  getHeaderTitle(){
    if (GetterSetter.getPumpName()==='maxi'){
      return 'Swing Maxi'
    }else  if(GetterSetter.getPumpName()==='flex') {
      return 'Freestyle Flex'
    }else if (GetterSetter.getPumpName()==='sonata'){
      return 'Sonata'
    }else {
      return  I18n.t('tracking.pumping')
    }
  }
  async setIntialTimer(dateObj){
    //console.log(dateObj.startTime.format('YYYY-MM-DDTHH:mm'),this.state.selectedDate,this.state.isCalenderValueDetained)
    await AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_P,'pause');
    await AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_P,dateObj.startTime.valueOf().toString());
    await AsyncStorage.setItem(KeyUtils.PUMPING_TIMER_VALUE,dateObj.duration.asSeconds().toString())
    this.customPumpingTimer.current.forceInit(dateObj.startTime,dateObj.endTime);
    setTimeout(()=>{
      const {leftStopwatchStart}=this.state
      //this.setState({leftStopwatchStart:false})
    },200)
  }
  render() {
    const {navigation} = this.props
    const {
      showVolumeAlert,
      showExistingInventoryAlert,
      showClearCounterAlert,
      isLoading,
      isUiLoading,
      showTimers,
      isFrom,
      isBLETimerRunning,
      initialCalenderValue,
      isCalenderValueDetained,
      detainedValue,
      initialCalenderTimer,
      timeCalendarDate,
      timeCalendarDateAM
    } = this.state
    if (isUiLoading) {
      return <LoadingSpinner/>
    }

    return <KeyboardAwareScrollView ref={ref => {this.scrollView = ref}} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
      <HeaderTrackings
        hideCalendarIcon = {true}
        timeCalendarDate={timeCalendarDate}
        timeCalendarDateAM={timeCalendarDateAM}
        textStartTime={true}
        updateTimeCalendarUIPress={(date,duration)=>{
          this.setState({
            isDateChanged:true,
            timeCalendarDate:date
          })
          AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING,new Date(date).getTime().toString());
        }}
        updateValidation={(val)=>{
          this.setState({disableButton:val})
        }}
        showStartEndTime={true}
        durationInLimit={100}
        title={isFrom === 'bluetooth'?this.getHeaderTitle():I18n.t('tracking.pumping')}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => {
          const {isSessionActive,isFrom} = this.state
          // if((isSessionActive && isFrom!== 'bluetooth')) this.setState({showClearCounterAlert: true})
          // else this._handleBack()
          this._handleBack()
        }}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        getSelectedDate={(value,dateObj) => {
          if(dateObj!=undefined&&dateObj.duration.isValid()){
            this.setIntialTimer(dateObj);
            let date={
              selectedDate:value,
              startTime:dateObj.startTime.format('YYYY-MM-DDTHH:mm'),
              endTime:dateObj.endTime.format('YYYY-MM-DDTHH:mm'),
            }
            this.setState({selectedDate: value,isCalenderValueDetained:date})
          }
          // this.setState({selectedDate: value,isCalenderValueDetained:value})
          // AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING,value);
        }}
        //selectedDate={isCalenderValueDetained==undefined?initialCalenderValue :isCalenderValueDetained}
        selectedDate={isCalenderValueDetained==undefined?initialCalenderValue :isCalenderValueDetained.selectedDate}
        startEndDetainedValue={isCalenderValueDetained!==undefined?isCalenderValueDetained:initialCalenderTimer!=undefined?initialCalenderTimer:undefined}
        calenderIconPressed={async ()=>{
          if(isCalenderValueDetained==undefined||isCalenderValueDetained==null||isCalenderValueDetained==''){
            this.setState({initialCalenderValue: moment().format()});
          }
          if(isCalenderValueDetained==undefined||isCalenderValueDetained==null||isCalenderValueDetained==''){
            this.setState({initialCalenderValue: moment().format()});
            if(this.durationBothInHour>0||this.durationBothInMins>=0||this.durationBothInSec>=0){
              this.setState({initialCalenderTimer:{
                selectedDate:moment().format(),
                startTime:moment().subtract({hours:this.durationBothInHour,minutes:this.durationBothInSec>=30?this.durationBothInMins+1:this.durationBothInMins}),
                endTime:moment().format()
              }})
            }
          }else{
            if(this.durationBothInHour>0||this.durationBothInMins>=0||this.durationBothInSec>=0){
              let obj=isCalenderValueDetained;
              obj.startTime=moment(obj.endTime).subtract({hours:this.durationBothInHour,minutes:this.durationBothInSec>=30?this.durationBothInMins+1:this.durationBothInMins});
              this.setState({isCalenderValueDetained:obj})
            }
          }
        }}
        calendarNegativePressed={()=>{
          AsyncStorage.removeItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING);
          this.setState({isCalenderValueDetained:undefined})
        }}
        ableToOpen={isBLETimerRunning ? true : undefined}/>

      <ScrollView showsVerticalScrollIndicator={false}>

        {isLoading && <LoadingSpinner/>}
        <View style={styles.container}>
          {(this.state.showSiriBabySelectionModal!= undefined && !this.state.showSiriBabySelectionModal) && <SiriBabySelectionModal
            showBabySelectionModal={!this.state.showSiriBabySelectionModal}
            cancelBabyPress={(_)=>{
              this.setState({showSiriBabySelectionModal:true})
              setTimeout(() => {

                this.callPumpingApiFromSiri(),200})
            }}
            onBabyListPress={(_) => {
              this.setState({showSiriBabySelectionModal:true})
              setTimeout(() => {
                this.callPumpingApiFromSiri(),200})
            }}
            navigation={navigation}
          />}
          <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.duration')}</Text>
          {/*{isFrom === 'bluetooth' && showTimers && this.renderLeftRightView()}*/}
          {isFrom === 'bluetooth' ? this.renderPumpTimerFromBLEView():this.renderManualTimer()}
          {isFrom === 'bluetooth' && this.showBLEDetail()}
          {this.renderVolumeView()}
          {this.renderPumpingEndingSide()}
          {this.renderExperienceView()}
          {this.renderBottomView()}
          {showVolumeAlert && this.showVolumeDialog()}
          {showClearCounterAlert && this.showClearCounterPopup()}
          {showExistingInventoryAlert && this.showExistingInventoryDialog()}
        </View>

      </ScrollView>
      <Dialog
        visible={this.state.showBadArticles}
        title={I18n.t('tracking.bad_session_popup_tite')}
        positive={I18n.t('tracking.bad_session_popup_option1')}
        negative={I18n.t('tracking.bad_session_popup_option2')}
        neutral={I18n.t('tracking.bad_session_popup_option3')}
        positiveOnPress={() => {
          this.setState({ showBadArticles: false })
          navigation.navigate("BadSessionArticles");
        }}
        negativeOnPress={() => { this.setState({ showBadArticles: false }) }}
        neutralPress={() => {
          AsyncStorage.setItem(KeyUtils.NEVER_SHOW_BAD_ARTICLES, 'true');
          this.setState({ showBadArticles: false })
        }}
        onDismiss={() => {
        }}
      />
      <Dialog
        visible={this.state.showCongratsPopup}
        title={I18n.t('virtual_freezer.notification_title1')}
        message={I18n.t('virtual_freezer.notification_description1')}
        positive={I18n.t('login.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({ showCongratsPopup: false })
          AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS, 'true')
          this.onGoBack()
        }}
        onDismiss={() => {
        }}
      />
    </KeyboardAwareScrollView>
  }

  showBLEDetail() {
    const {
      timer,
      pumpLevel,
      phaseLevel,
      rhythemLevel,
      isFlex
    } = this.state
    return (
      <View style={styles.bleContainer}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.pump_setting')}</Text>
        <View style={styles.bleDataContainer}>
          <View style={styles.pumpLevelViewStyle}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.pump_level')} : {(isFlex && pumpLevel===0)?3:pumpLevel}</Text>
          </View>
          <View style={styles.phaseLevelViewStyle}>
            {/*<Simulation/>*/}
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.phase')}</Text>
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{Constants.PUMP_PHASE[phaseLevel]}</Text>
          </View>
          <View style={styles.rhythemLevelViewStyle}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.rhythm')}</Text>
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{Constants.PUMP_RHYTHEM[rhythemLevel]}</Text>
          </View>
        </View>
      </View>
    )
  }

  async handleVolumeValidation() {

    setTimeout(async() => {
      if (this.totalVolumeCount < 1) {
          AsyncStorage.getItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN).then((value) => {
            if (value !== null) {
              this.handleValidations()
            } else {
              this.setState({showVolumeAlert: true})
            }
          })
        } else {
          if (this.state.saveToVirtualStorage) {
            if (this.handleFreezerValidations()) {
              let entryExist = await this.checkFreezerInventoryAlreadyExist();
              (entryExist && this.handleFreezerValidations()) ? this.setState({showExistingInventoryAlert: true}) : this.handleValidations()
            }
          } else {
            this.handleValidations()
          }
        }
    }, 1000)




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

  showExistingInventoryDialog() {
    const { showExistingInventoryAlert } = this.state
    return (
      <Dialog
        visible={showExistingInventoryAlert}
        title={I18n.t('freezer_popup.title')}
        positive={I18n.t('freezer_popup.ok')}

        isIcon={false}

        positiveOnPress={() => {
          this.setState({ showExistingInventoryAlert: false })
        }}

        onDismiss={() => {
        }}
      />
    )
  };
  async handleValidations(isComingFromSiri,lefttimeInMinutes,righttimeInMinutes) {
    const {
      noteTextInput, selectedDate, isFrom,isCalenderValueDetained} = this.state
    const {babies, selected_baby,sessionState} = this.props
    const {babyId} = selected_baby
    this.trackingUuid = uuidV4()

    this.props.setLeftTimerActive(false)
    this.props.setRightTimerActive(false)

    if(isFrom !== 'bluetooth')
    {
      sessionState(true)
    }else{
      sessionState(false)
    }

    AsyncStorage.setItem(KeyUtils.P_RESET_TIMER, 'true')
    AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_P, 'false')
    AsyncStorage.setItem(KeyUtils.IS_P_TIMER_STARTED, 'false')
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_P, 'false')
    AsyncStorage.setItem(KeyUtils.PUMPING_TIMER_VALUE, '')

    if (babies && babies.length > 0) {

      if (this.durationLeftInMins>0) {
        this.durationLeftInSec += (parseInt(this.durationLeftInMins)* 60)
      }
      if (this.durationRightInMins>0) {
        this.durationRightInSec += (parseInt(this.durationRightInMins)* 60)
      }

      if (this.durationBothInMins>0) {
        this.durationBothInSec += (parseInt(this.durationBothInMins)* 60)
      }

      if (this.durationBothInHour>0) {
        this.durationBothInSec += (parseInt(this.durationBothInHour)* 3600)
      }


      let durationRight,durationLeft;
      let dTotal = this.durationBothInSec
      if (isFrom !== 'bluetooth') {
        durationRight=parseInt(isComingFromSiri?righttimeInMinutes:this.durationRightInSec)
        durationLeft=parseInt(isComingFromSiri?lefttimeInMinutes:this.durationLeftInSec)
        //dTotal = durationLeft + durationRight
      }
  if(isComingFromSiri){
    dTotal=lefttimeInMinutes
  }
      if (dTotal===0){
        alert(I18n.t('calendar.timer_alert'))
        this.setState({disableButton:false})
        return
      }
      console.log('dTotall----',dTotal,durationRight,durationLeft)
       let d;
      // if(isCalenderValueDetained!=null&&isCalenderValueDetained!=undefined&&isCalenderValueDetained!=''){
      //   //d = new Date(Platform.OS=='ios'?isCalenderValueDetained.startTime:isCalenderValueDetained.startTime.split('.')[0]);
      //   //d=Platform.OS=='ios'?d:d.split
      //   d=moment(isCalenderValueDetained.startTime);
      //   //d.
      //   AsyncStorage.removeItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING);
      // }else
      //   d = new Date();

      // // let sessionLargerValue = 0;

      // // if(durationLeft>durationRight)
      // // sessionLargerValue = durationLeft
      // // else
      // // sessionLargerValue = durationRight

      // if(d._isAMomentObject){
      //   d.set('s',d.second()-dTotal)
      // }else{
      //   d.setSeconds(d.getSeconds() - dTotal);
      // }
      // let formattedDate = await appendTimeZone(d);
      let formattedDate = null;
      if(!autoStartTime) {
        if (isCalenderValueDetained != null && isCalenderValueDetained != undefined && isCalenderValueDetained != '') {
          d = moment(isCalenderValueDetained.endTime);
          AsyncStorage.removeItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING);
        } else{
          d = moment();
        }
        d.set('s', d.second() - dTotal)
        var dd = moment(this.state.timeCalendarDate).format();
        var dd = await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING);
        formattedDate = await appendTimeZone(new Date(parseInt(dd)));
      }else{
        let startTime = await AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_P);
        var dd = await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING);
        var date  = new Date(parseInt(dd));
        formattedDate = await appendTimeZone(date);
      
    }
      const {unit}=this.state
      let obj = {
        "babyId": babyId,
        "id": this.trackingUuid,
        "trackingType":KeyUtils.TRACKING_TYPE_PUMPING,
        "trackAt": formattedDate,
        "durationLeft": dTotal/2,
        "durationRight": dTotal/2,
        "durationTotal": dTotal,
        "confirmed": true,
        "remark": noteTextInput===undefined?'':noteTextInput.toString().trim(),
        "quickTracking": true,
        "amountLeft":parseFloat(this.leftVolumeCount),
        "amountLeftUnit":unit,
        "amountRight":parseFloat(this.rightVolumeCount),
        "amountRightUnit":unit,
        "amountTotal":parseFloat(this.totalVolumeCount),
        "amountTotalUnit":unit,
      }


      if (this.badSessionIndex > -1) {
        obj['isBadSession'] = this.badSessionIndex === 1
      }
      obj['lastBreast'] = this.endingPumpingSideList[this.lastBreastPumpingIndex].value
      obj['savedMilk'] = this.state.saveToVirtualStorage
      this.trackingObj = obj
      let json = {
        "trackings": [this.trackingObj]
      }

         let param = {
          'interaction':'milk_stored_from_pumping_session',
        }
        await analytics.logEvent(Constants.VIRTUAL_FREEZER, param); // Firebase event for Users saving successfully milk in Pumping session to Virtual Milk Storage
      const {isInternetAvailable, trackingApi} = this.props
      // this.saveTrackInNotif(this.trackingObj, selected_baby)
      AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_P, '')

      if (isInternetAvailable) {
        this.setState({isLoading: true, timer: 0});
        let param = {
          'pump_tracking_type':'manual',
          'pump_type':'none',
          'duration':toHHMMSS(dTotal),
        }
        await analytics.logEvent(Constants.PUMP_TRACKING, param);
        obj = {'tracking_type':Constants.SAVE_PUMPING_TRACKING}
        await analytics.logEvent(Constants.TRACKINGS, obj);
        trackingApi(json);
        this.clearStoreAfterApiCall()
      } else {
        this.saveTrackingInDb(false,obj.id)
        if (this.state.saveToVirtualStorage) {
          //Add DB entry in Inventory
          this.saveFreezerPumpingDataInDb(false)
        }
        this.clearStoreAfterApiCall()
      }
    }
  }

  setupInventoryObject() {
    const { volumeCount, containerType, location, unit, number, trayNumber ,selectedDate} = this.state
    //expireAt 1: Fridge --> 3 days 2: Freezer --> 6 months
    let expireAt = location == 1 ? moment(selectedDate).add(3, 'days').format() : moment(selectedDate).add(6, 'months').format()
    let a = moment();//now
    let b = moment(selectedDate);
    let diff=a.diff(b, 'days')
    let trackAtDate= diff && diff >1 ? moment(selectedDate).format() : moment().format()
    let apiObj = {
      id:this.inventoryUUID,
      trackingMethod: 1,
      trackAt: trackAtDate,
      location: location,
      tray: parseInt(trayNumber),
      containerType: containerType,         // 1: Bottle, 2: Bag
      number: parseInt(number),         // container number
      amount: parseFloat(this.totalVolumeCount),
      unit: unit,      // oz, ml
      createdFrom: this.trackingUuid,      // optional: UUID of the pump tracking if Pump Added inventory
      isConsumed: false,
      consumedBy: '',
      consumedAt: "",
      isExpired: false,
      expireAt: expireAt,
      movedAt: "",
    };
    this.inventoryObj=apiObj
    return apiObj
  }

  //   async saveFreezerPumpAddDataApi() {
  //   const { volumeCount, containerType, location, unit, number, trayNumber } = this.state
  //   //expireAt 1: Fridge --> 3 days 2: Freezer --> 6 months
  //   let expireAt = location == 1 ? moment().add(3, 'days').format() : moment().add(6, 'months').format()
  //   let apiObj = {
  //     id:this.inventoryUUID,
  //     trackingMethod: 1,
  //     trackAt: moment().format(),
  //     location: location,
  //     tray: parseInt(trayNumber),
  //     containerType: containerType,         // 1: Bottle, 2: Bag
  //     number: parseInt(number),         // container number
  //     amount: parseFloat(volumeCount),
  //     unit: unit,      // oz, ml
  //     createdFrom: this.trackingUuid,      // optional: UUID of the pump tracking if Pump Added inventory
  //     isConsumed: false,
  //     consumedBy: '',
  //     consumedAt: "",
  //     isExpired: false,
  //     expireAt: expireAt,
  //     movedAt: "",
  //   };
  //   this.inventoryObj=apiObj

  //   this.saveFreezerPumpingDataInDb(false)
  //   if (this.props.isInternetAvailable) {
  //     let bottleData = Object.assign({ milkInventories: [apiObj] });
  //     console.log('bottleData', JSON.stringify(bottleData))
  //     this.props.createBottleApi(bottleData)
  //   }
  // }

  async saveFreezerPumpingDataInDb(isSync){
    const { location } = this.state
    this.setupInventoryObject()
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    this.inventoryObj.isDeleted=false
    this.inventoryObj.userId=userName
    this.inventoryObj.isSync=isSync
    this.inventoryObj.isMoved=false

    this.trackingObj.inventory=this.inventoryObj
    this.saveTrackingInDb(true)
    let realmDb = await getRealmDb()
    saveVirtualFreezerDatabase(realmDb, this.inventoryObj).then((r) => {
    })
  }

  saveTrackInNotif(trackingData, baby) {
    if(checkDays(baby.birthday) <= 0 && checkDays(baby.birthday) >= -26) {
      savebreastFeedingPumpingTrack(trackingData, baby)
    }
  }

  async saveTrackingInDb(isSync,trackingId) {
    this.trackingObj.isSync = isSync
    this.trackingObj.userId = this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r) => {
      if(this.state.saveToVirtualStorage) {
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
                  this.onGoBack()
                }
              })
            } else {
              if(items.length > 1) {
                AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS, 'true')
                this.onGoBack()
              }
            }
          } else {
            this.onGoBack()
          }
        })
      } else {
        this.onGoBack()
      }
    })
    let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
    if(lastSession==='Start breastfeeding' || lastSession==='Pause breastfeeding'|| lastSession==='Continuebreastfeeding'|| lastSession==='StopBreastfeeding' || lastSession==='Stop Pumping'|| lastSession==='Start Pumping' ){
      AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, '')
    }
  }

  clearStoreAfterApiCall(){
    let manualData = {"amountLeft": 0, "amountLeftUnit": "oz", "amountRight": 0,
      "amountRightUnit": "oz", "amountTotal": 0, "amountTotalUnit": "oz", "note": ""}
    this.props.pumpingManualData(manualData)
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


  onGoBack() {
    this.setState({disableButton:false})
    Toast.show(I18n.t("tracking.tracking_toaster_text"), Toast.SHORT);
    if (this.state.isFrom == 'ble_manual') {
      this.props.navigation.navigate("TrackingScreen")
    } else {
      this._handleBack()
    }
  }
}

const mapStateToProps = (state) => ({
  isInternetAvailable: state.app.isInternetAvailable,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  trackingResponse:state.home.trackingResponse,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  selected_baby: state.home.selected_baby,
  createBottleResponse:state.home.createBottleResponse,
  createBottleApiSuccess:state.home.createBottleApiSuccess,
  flexData: state.home.flexData,
  sonataData: state.home.sonataData,
  isConnected: state.home.isConnected,
  pumpType: state.home.pumpType,
  pumpRunning: state.home.pumpRunning,
  connectionMessage: state.home.connectionMessage,
  isConnectionPause: state.home.isConnectionPause,
  pumpingCountValue: state.home.pumpingCountValue,
  manualDataFromPumping: state.home.manualDataFromPumping,
  sessionIndexValue: state.home.sessionIndexValue,
  isSessionSaveFromPumping: state.home.isSessionSaveFromPumping,
  isLeftTimerActive: state.home.isLeftTimerActive,
  isRightTimerActive: state.home.isRightTimerActive,
  themeSelected: state.app.themeSelected
})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
  sessionState: (value) => dispatch(HomeActions.sessionState(value)),
  pumpingManualData: (value) => dispatch(HomeActions.pumpingManualData(value)),
  pumpingCount: (value) => dispatch(HomeActions.pumpingCount(value)),
  flexPumpData: (flexData) => dispatch(HomeActions.flexPumpData(flexData)),
  sonataPumpData: (sonataData) => dispatch(HomeActions.sonataPumpData(sonataData)),
  sessionSaveFromPumping: (value) => dispatch(HomeActions.sessionSaveFromPumping(value)),
  sessionNavigation:(routeName,trackingId)=>dispatch(NavigationActions.sessionNavigation(routeName,trackingId)),
  setLeftTimerActive: (value) => dispatch(HomeActions.setLeftTimerActive(value)),
  setRightTimerActive: (value) => dispatch(HomeActions.setRightTimerActive(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BreastFeedingPumpingScreen);
