import React from 'react'
import {BackHandler, Dimensions, Platform, ScrollView, Text, View, TouchableOpacity} from 'react-native'
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
import Left from '@svg/ic_left.svg';
import Right from '@svg/ic_right.svg';
import GoodIcon from '@svg/ic_good'
import BadIcon from '@svg/ic_bad'
import I18n from 'react-native-i18n';
import {Colors, Metrics} from "@resources";
import styles from './Styles/BreastFeedingPumpingScreenStyles';
import {appendTimeZone, uuidV4} from "@utils/TextUtils";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import CustomRightTimer from '@components/CustomRightTimer';
import CustomLeftTimer from '@components/CustomLeftTimer';
import moment from "moment";
import {createTrackedItem} from "../Database/TrackingDatabase";
import Toast from 'react-native-simple-toast';
import NavigationService from "../Services/NavigationService";
import SiriBabySelectionModal from "@components/SiriBabySelectionModal";
import {verticalScale} from "../Resources/Metrics";
import {checkDays, savebreastFeedingPumpingTrack} from "../Components/Notifications";
import {milkExpiredNotification} from '@components/Notifications';
import S from '@svg/S_.svg';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import LeftFrench from "@svg/ic-left_French.svg"
import LeftItalian from "@svg/ic-left_Italian.svg"
import LeftPortuguese from "@svg/ic-left_Portuguese.svg"
import LeftRussian from "@svg/ic-left_Russian.svg"
import LeftSpanish from "@svg/ic-left_Spanish.svg"
import LeftSwedish from "@svg/ic-left_Swedish.svg"
import LeftArabic from "@svg/L_Arabic.svg"
import RightArabic from "@svg/R_Arabic.svg"
import RightRussian from "@svg/ic-right_Russian.svg"
import RightSwedish from "@svg/ic-right_Swedish.svg"
import RightFIPS from "@svg/ic-right-French-Italian-Portuguese-Spanish.svg"
import RightPolish from "../Images/svg/P.svg"
import LeftPolish from "../Images/svg/L.svg"
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

let autoStartTime = true;
let startTime = null;

class BreastFeedingScreen extends React.Component {
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


  constructor(props) {
    super(props);
    const {isLeftPress, isBothPressed,isRightPress } = this.props.navigation.state.params
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
      isBreastFeedingSelected: true,
      noteTextInput: '',
      heightArray: [],
      showCalendarPicker: false,
      selectedDate: moment().format(),
      defaultFeedingIndex: isLeftPress ? 0 : 1,
      timer: 0,
      timerValueLeft: -1,
      timerValueRight: -1,
      showTimers: false,
      isUiLoading: true,
      connectionMsg:'',
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
      showBadArticles: false,
      handleTimerLeft : 0,
      handleTimerRight : 0,
      isBothPressed : isBothPressed,
      initialCalenderValue:undefined,
      isCalenderValueDetained:undefined,
      initialCalenderTimer:undefined,
      disableButton:false,
      timeCalendarDate:moment(),
      timeCalendarDateAM:moment(),
      checkStartTimer:0
    }
    this.updateTimerFlag=false,
    this.inventoryUUID= uuidV4()
    this.trackingUuid=''

    this.badSessionIndex = 0
    this.lastBreastIndex = -1

    this.handleRightStopWatchValue = this.handleRightStopWatchValue.bind(this)
    this.handleLeftStopWatchValue = this.handleLeftStopWatchValue.bind(this)

    this.durationLeftInMins = 0
    this.durationLeftInSec = 0
    this.durationRightInSec = 0
    this.durationRightInMins = 0

    this.durationBothInMins = 0
    this.durationBothInSec = 0

    this.durationLeftInHour=0
    this.durationRightInHour=0
    this.customLeftTimer=React.createRef();
    this.customRightTimer=React.createRef();
    this.timerStatus={
      left:isBothPressed||isLeftPress,
      right:isBothPressed||isRightPress
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)

  }

  async componentDidMount() {
    let leftTimerValue = await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
    let rightTimerValue = await AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE)
    if( leftTimerValue === null && rightTimerValue === null){
      AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING,Date.now().toString());
    }
    else{
    let newDate= await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING);
     this.updateStartTime(new Date(parseInt(newDate)))
    }
    startTime = moment();
    const {navigation} = this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.tabName=await AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME)

    AsyncStorage.getItem(KeyUtils.IS_BOTH_BF_SELECTED).then((res)=>{
      if(res === 'true'){
        this.setState({isBothPressed:true})
      }else{
        this.setState({isBothPressed:false})
      }
    });

    navigation.addListener('willFocus', () => {
      AsyncStorage.getItem(KeyUtils.SELECTED_LANGUAGE).then((language)=>{
        if (language!=null){
          this.setState({ isItalian: language == 'Italian' ? true : false })
        }
      })

      AsyncStorage.getItem(KeyUtils.IS_BOTH_BF_SELECTED).then((res)=>{
        if(res === 'true'){
          this.setState({isBothPressed:true})
        }else{
          this.setState({isBothPressed:false})
        }
      });
    })

    this.setState({
      rightStopwatchStart: true,
      leftStopwatchStart: true
    })

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

    this.callBreastFeedingApiFromSiri()
    this.init()

    setTimeout(() => {
      this.setState({isUiLoading: false})
    }, 100)
    await analytics.logScreenView('breastfeeding_tracking_screen')
  }

  callBreastFeedingApiFromSiri(){
    if (this.state.callTrackingApiOnStop && this.state.showSiriBabySelectionModal) {
      var leftTimerValue = 0
      var rightTimerValue = 0
      AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(prevTimerCount => {
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
      AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(prevTimerCount => {
        if (prevTimerCount != null) {
          let remainingSeconds = parseInt(prevTimerCount)
          //let totalCount = remainingSeconds + dd
          this.setState({
            rightStopwatchStart: true,
            //   timerValueRight: totalCount,
            showTimers: true
          })
          rightTimerValue = remainingSeconds
        }

      });
      setTimeout(() => {
        this.handleValidations(true,leftTimerValue,rightTimerValue)
      }, 100)

    }
  }

  _handleBack=()=>{
    const {navigation}=this.props
    const {isFrom}=this.state
    navigation.popToTop()
    if (this.tabName != null) {
      NavigationService.navigate(this.tabName)
    } else {
      NavigationService.navigate('Baby')
    }
  }

  onAndroidBackPress = () => {
    this._handleBack()
    return true;
  }

  init() {
    const {isLeftPress,isFrom} = this.props.navigation.state.params
    this.setState({isFrom})
    this.lastBreastIndex = isLeftPress ? 0 : 1


    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT).then(value => {
      if (value === 'true') {
        this.props.setLeftTimerActive(true)
        this.setState({leftTimerRunnig : true})
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT).then(startTime => {
          let st = parseInt(startTime)
          let difference = Date.now() - st;
          let secondsDifference = Math.floor(difference / 1000);
          let dd = parseInt(secondsDifference)
          AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(prevTimerCount => {
            if (prevTimerCount != null) {
              let remainingSeconds = parseInt(prevTimerCount)
              let totalCount = remainingSeconds + dd
              this.setState({
                leftStopwatchStart: true,
                timerValueLeft: totalCount,
                showTimers: true
              }, () => AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, totalCount.toString()))
            } else {
              let totalCount = dd
              this.setState({
                leftStopwatchStart: true,
                timerValueLeft: totalCount,
                showTimers: true
              }, () => AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, totalCount.toString()))
            }
          });
        });
      } else if (value == 'pause') {
        this.props.setLeftTimerActive(true)
        this.setState({leftTimerRunnig : true})
        AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(prevTimerCount => {
          let remainingSeconds = parseInt(prevTimerCount)
          this.setState({leftStopwatchStart: true, timerValueLeft: remainingSeconds, showTimers: true,leftTimerPause:true})
        });
      } else {
        this.props.setLeftTimerActive(false)
        this.setState({leftStopwatchStart: true, showTimers: true, timerValueLeft: 0, leftTimerRunnig : false})
      }
    });


    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT).then(value => {
      if (value === 'true') {
        this.props.setRightTimerActive(true)
        this.setState({rightTimerRunnig : true})
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT).then(startTime => {
          let st = parseInt(startTime)
          let difference = Date.now() - st;
          let secondsDifference = Math.floor(difference / 1000);
          let dd = parseInt(secondsDifference)
          AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(prevTimerCount => {
            if (prevTimerCount != null) {
              let remainingSeconds = parseInt(prevTimerCount)
              let totalCount = remainingSeconds + dd
              this.setState({
                rightStopwatchStart: true,
                timerValueRight: totalCount,
                showTimers: true
              }, () => AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, totalCount.toString()))
            } else {
              let totalCount = dd
              this.setState({
                rightStopwatchStart: true,
                timerValueRight: totalCount,
                showTimers: true
              }, () => AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, totalCount.toString()))
            }
          });
        });
      } else if (value == 'pause') {
        this.props.setRightTimerActive(true)
        this.setState({rightTimerRunnig : true})
        AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(prevTimerCount => {
          let remainingSeconds = parseInt(prevTimerCount)
          this.setState({timerValueRight: remainingSeconds, showTimers: true, rightStopwatchStart: true,rightTimerPause:true})
        });
      } else {
        this.props.setRightTimerActive(false)
        this.setState({rightStopwatchStart: true, showTimers: true, timerValueRight: 0, rightTimerRunnig : true})
      }
    });

    AsyncStorage.getItem(KeyUtils.BOTH_TIMER_ACTIVE).then(value => {
      if (value === 'true') {
        this.setState({
          rightStopwatchStart: false,
          leftStopwatchStart: false
        })
      } else {
        this.setState({
          rightStopwatchStart: true,
          leftStopwatchStart: true
        })
      }
    });
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }

  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {trackingApiSuccess,trackingApiFailure,trackingResponse}=this.props

    if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
      if (trackingResponse && trackingResponse.successIds && trackingResponse.successIds.length>0){
        this.saveTrackingInDb(true,trackingResponse.successIds[0])
      }
    }

    if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
      //this.saveTrackingInDb(false)
      this.setState({isLoading: false})
    }

  }


  handleLeftStopWatchValue(obj) {
    const {
      getStartTimeValue,
      stopwatchSelected,
      stopwatchSelectedTimer,
      getEndTimeValue,
    } = obj;
    if(this.timerStatus && this.timerStatus.left && this.timerStatus.right && !this.state.isBothPressed){
      this.setState({defaultFeedingIndex: 1})
      this.lastBreastIndex=1
    }else{
      this.setState({defaultFeedingIndex: 0})
      this.lastBreastIndex=0
    }
    if (getStartTimeValue) {
      this.props.setLeftTimerActive(true)
      this.setState({
        leftStopwatchStart: stopwatchSelected,
        leftStopwatchValue: stopwatchSelectedTimer,
        leftGetCurrentTime: getStartTimeValue,
        leftTimerRunnig : stopwatchSelected
      });
    } else {
      this.props.setLeftTimerActive(false)
      this.setState({
        leftStopwatchStart: stopwatchSelected,
        leftStopwatchValue: stopwatchSelectedTimer,
        leftGetEndTime: getEndTimeValue,
        leftTimerRunnig : stopwatchSelected
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
    if(this.timerStatus && this.timerStatus.left && this.timerStatus.right  && !this.state.isBothPressed){
      this.setState({defaultFeedingIndex: 0})
      this.lastBreastIndex=0
    }else{
      this.setState({defaultFeedingIndex: 1})
      this.lastBreastIndex=1
    }
    if (getStartTimeValue) {
      this.props.setRightTimerActive(true)
      this.setState({
        rightStopwatchStart: stopwatchSelected,
        rightStopwatchValue: stopwatchSelectedTimer,
        rightGetCurrentTime: getStartTimeValue,
        rightTimerRunnig : stopwatchSelected
      });
    } else {
      this.props.setRightTimerActive(false)
      this.setState({
        rightStopwatchStart: stopwatchSelected,
        rightStopwatchValue: stopwatchSelectedTimer,
        rightGetEndTime: getEndTimeValue,
        rightTimerRunnig : stopwatchSelected
      });
    }
  }

  onFocusInputLeft = (value) => {
    console.log('on Left Timer press --- ', value)
    autoStartTime = false;
    this.setState({leftStopwatchStart: true, leftTimerPause: true})
  }
  onFocusInputRight = (value) => {
    autoStartTime = false;
    console.log('on Right Timer press --- ', value)
    this.setState({rightStopwatchStart: true, rightTimerPause: true})
  }

  sessionPaused(){
    const {leftTimerPause, rightTimerPause, isBreastFeedingSelected} = this.state;
    if(leftTimerPause &&  rightTimerPause){
      return (
        <Text maxFontSizeMultiplier={1.7}
          style={styles.pumpSettingBleMessageLableStyle}>{I18n.t('breastfeeding_pump.breastfeeding_paused')}</Text>
      );
    }
    else{
      return (
        <Text maxFontSizeMultiplier={1.7}
          accessible={true} accessibilityLabel={I18n.t('breastfeeding_pump.null_value')}
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

  updateStartTime(date){
    const {isShortcutTracking} = this.props.navigation.state.params
    if(!isShortcutTracking){
      if(this.updateTimerFlag === false){
        this.updateTimerFlag = true;
          let updateDate = date === undefined ?  Date.now() : date.getTime() ; 
          this.setState({timeCalendarDate:moment(updateDate),timeCalendarDateAM:moment(updateDate)})
          AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING,updateDate.toString());    
      }
    }
  }
  renderLeftRightView() {
    const {
      leftStopwatchStart,
      rightStopwatchStart,
      timerValueLeft,
      timerValueRight,
      isItalian,
      handleTimerLeft,
      handleTimerRight,
      isBothPressed,           
    } = this.state;
    const {isLeftPress, isRightPress} = this.props.navigation.state.params

    return <View style={{position: 'relative'}}>
      <View style={[styles.leftRightTimerViewStyle]}>
        <View>
          <CustomLeftTimer
            ref={this.customLeftTimer}
            handlePauseRightTimer={()=>{
              // if(isBothPressed) {
              //   this.setState({handleTimerRight: 1, leftStopwatchStart: true, rightStopwatchStart: true})
              // }
            }}
            handleStartRightTimer={()=>{
              // if(isBothPressed) {
              //   this.setState({handleTimerRight: 2, rightStopwatchStart: true})
              // }
            }}
            onPressTimer={(status)=>{
              const {isBothPressed }=this.state;
              this.updateStartTime();
              if(isBothPressed){
                if(status){
                  this.customRightTimer.current.handleStart()
                  this.timerStatus.right=true;
                  this.timerStatus.left=true;
                  this.setState({leftTimerPause:false,rightTimerPause:false})
                }else{
                  this.setState({rightStopwatchStart: true,leftStopwatchStart: true,leftTimerPause:true,rightTimerPause:true},()=>{
                    this.customRightTimer.current.handlePause()
                    this.timerStatus.right=false;
                    this.timerStatus.left=false;
                  })
                }
              }else{
                if(status){
                  this.timerStatus.left=true;
                }else{
                  this.timerStatus.left=false;
                }
                this.setState({leftTimerPause:!this.timerStatus.left})
              }
            }}
            timerTypeStyle={3}
            isLeftPress={isLeftPress}
            icon={this.renderLeftIcons(I18n.locale.substr(0, 2))}
            getHours={(hrs) => {
              if (parseInt(hrs)>0){
                this.durationLeftInHour=parseInt(hrs)
              }
            }}
            getMin={(min) => {
              this.durationLeftInMins = min==''?0:parseInt(min)
              if (this.durationLeftInMins>0 && this.state.isLeftTimerValue===0) {
                this.setState({isLeftTimerValue:this.durationLeftInMins})
              }
            }}
            getSec={(sec) => {
              this.durationLeftInSec = sec==''?0:parseInt(sec)
              if (this.durationLeftInSec>0 && this.state.isLeftTimerValue===0){
                this.setState({isLeftTimerValue:this.durationLeftInSec})
              }
            }}
            rightTimerInHour={this.durationRightInHour}
            rightTimerInSec={this.durationRightInSec}
            rightTimerInMin={this.durationRightInMins}
            isEditable={true}
            timerType={KeyUtils.BFnP_LEFT}
            stopwatchStartStatus={leftStopwatchStart}
            isCallingFromBaby={false}
            isFocusInput={(value) => this.onFocusInputLeft(value)}
            changeValue={this.handleLeftStopWatchValue}
            navigation={this.props.navigation}
            secondsDifference={timerValueLeft}
            isPausedFromSiri={this.props.navigation.state.params.pauseBreasefeeding!==undefined?true:false}/>
        </View>
        <View style={{
          marginTop: verticalScale(20),
          alignItems: 'center'
        }}>
          <View style={styles.linkViewStyle}>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isBothPressed: !isBothPressed })
                this.updateStartTime();
                if (!isBothPressed) {
                  AsyncStorage.setItem(KeyUtils.IS_BOTH_BF_SELECTED, 'true')
                  if (leftStopwatchStart && rightStopwatchStart) {
                    this.customRightTimer.current.handleStart()
                    this.customLeftTimer.current.handleStart()
                    this.timerStatus.left = true;
                    this.timerStatus.right = true;
                  } else if (!leftStopwatchStart && rightStopwatchStart) {
                    this.customRightTimer.current.handleStart()
                    this.timerStatus.right = true;
                  } else if (leftStopwatchStart && !rightStopwatchStart) {
                    this.customLeftTimer.current.handleStart()
                    this.timerStatus.left = true;
                  }
                  this.setState({ leftTimerPause: !this.timerStatus.left, rightTimerPause: this.timerStatus.right })
                } else {
                  AsyncStorage.setItem(KeyUtils.IS_BOTH_BF_SELECTED, 'false')
                }
              }} style={styles.buttonContainer}
            >
             <View style={[styles.buttonView, { width: 48, backgroundColor:isBothPressed ? Colors.rgb_898d8d: Colors.rgb_d8d8d8 }]}>  
                <Text 
                  style={[styles.buttonTextStyle,{color:isBothPressed ? 'white' : Colors.rgb_000000}]}>
                  {I18n.t('breastfeeding_pump.both')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <CustomRightTimer
            ref={this.customRightTimer}
            handlePauseLeftTimer={()=>{
              // if(isBothPressed) {
              //   this.setState({handleTimerLeft: 1, leftStopwatchStart: true, rightStopwatchStart:true})
              // }
            }}
            handleStartLeftTimer={()=>{
              // if(isBothPressed) {
              //   this.setState({handleTimerLeft: 2, leftStopwatchStart: true})
              // }
            }}
            onPressTimer={(status)=>{
              const {isBothPressed}=this.state;
              this.updateStartTime();
              if(isBothPressed){
                if(status){
                  this.customLeftTimer.current.handleStart();
                  this.timerStatus.left=true;
                  this.timerStatus.right=true;
                  this.setState({leftTimerPause:false,rightTimerPause:false})
                }else{
                  this.setState({leftStopwatchStart: true,rightStopwatchStart:true,leftTimerPause:true,rightTimerPause:true },()=>{
                    this.customLeftTimer.current.handlePause();
                    this.timerStatus.left=false;
                    this.timerStatus.right=false;
                  })
                }
              }else{
                if(status){
                  this.timerStatus.right=true;
                }else{
                  this.timerStatus.right=false;
                }
                this.setState({rightTimerPause:!this.timerStatus.right})
              }
            }}
            timerTypeStyle={3}
            isRightPress={isRightPress}
            icon={this.renderRightIcons(I18n.locale.substr(0, 2))}
            getHours={(hrs) => {
              if (parseInt(hrs)>0){
                this.durationRightInHour=parseInt(hrs)
              }
            }}
            getMin={(min) => {
              this.durationRightInMins = min==''?0:parseInt(min)
              if (this.durationRightInMins>0 && this.state.isRightTimerValue===0) {
                this.setState({isRightTimerValue:this.durationRightInMins})
              }
            }}
            getSec={(sec) => {
              this.durationRightInSec = sec==''?0:parseInt(sec)
              if (this.durationRightInSec>0 && this.state.isRightTimerValue==0){
                this.setState({isRightTimerValue:this.durationRightInSec})
              }
            }}
            leftTimerInSec={this.durationLeftInSec}
            leftTimerInMin={this.durationLeftInMins}
            leftTimerInHour={this.durationLeftInHour}
            isEditable={true}
            isFocusInput={(value) => this.onFocusInputRight(value)}
            stopwatchStartStatus={rightStopwatchStart}
            changeValue={this.handleRightStopWatchValue}
            isCallingFromBaby={false}
            navigation={this.props.navigation}
            secondsDifference={timerValueRight}
            isPausedFromSiri={this.props.navigation.state.params.pauseBreasefeeding!==undefined?true:false}/>
        </View>

      </View>
      <View style={styles.sessionPausedViewStyle}>
        {this.sessionPaused()}
      </View>
    </View>
  }

  onBreastfeedingPress = () => {
    AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
    this.setState({isBreastFeedingSelected: true})
  }

  renderEndingSide() {
    const { defaultFeedingIndex} = this.state
    return <View style={styles.endingSideView}>
      <View style={{flex: 1}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.ending_side')}</Text>
      </View>

      <View style={styles.sessionRightView}>
        <CustomOptionSelector
          buttonContainerStyle={{width: 100, height: 48 }}
          defaultSelectedIndex={defaultFeedingIndex}
          data={this.endingSideList} onChange={(item, index) => this.lastBreastIndex = index}/>
      </View>
    </View>
  }


  renderExperienceView() {
    const {navigation} = this.props
    const {isBreastFeedingSelected, isPumpSelected} = this.state
    return <View style={styles.endingSideView}>
      <View style={{flex: 1.5}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.experience')}</Text>
      </View>

      <View style={styles.sessionRightView}>

        <CustomOptionSelector
          data={this.experienceList}
          buttonContainerStyle={{width: 100,height: 48 }}
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

  renderBottomView() {
    const {rightStopwatchStart,  leftStopwatchStart, noteTextInput,isLeftTimerValue,isRightTimerValue,isLoading} = this.state
    let isDisable= (isRightTimerValue==0 && isLeftTimerValue==0) || isLoading

    return <View>
      <CustomTextInput
        maxLength={1000}
        textContentType="familyName"
        value={noteTextInput}
        onChangeText={(index, value) => {
          this.setState({noteTextInput: value})
        }}
        placeholder={I18n.t('breastfeeding_pump.add_note')}
        placeholderTextColor={this.textColor}
        textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
        multiline={true}
        maxHeight={50}
        enableDoneButton={true}
      />

      <View style={styles.cancelSaveView}>
        <Button title={I18n.t('generic.cancel').toUpperCase()} textStyle={styles.cancelTextStyle}
          onPress={() => this.setState({showClearCounterAlert: true})}
          style={styles.cancelButtonStyles}/>
        <Button
          disabled={isDisable || this.state.disableButton}
          title={I18n.t('generic.save').toUpperCase()} textStyle={styles.saveTextStyle} onPress={() => {
            this.setState({disableButton:true, handleTimerLeft: 1, handleTimerRight: 1, leftStopwatchStart: true, rightStopwatchStart:true, isBothPressed:false},()=>this.handleValidations())
          }}
          style={[styles.saveButtonStyles]}/>
      </View>
    </View>
  }

  getSelectedBabyDetails(item) {
    //Baby's data
    //this.setState({babyId: item.babyId})
  }

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
          this.props.setLeftTimerActive(false)
          this.props.setRightTimerActive(false)
          let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
          if(lastSession==='Start breastfeeding' || lastSession==='Pause breastfeeding'|| lastSession==='Continuebreastfeeding'|| lastSession==='StopBreastfeeding' || lastSession=== 'Stop Pumping' || lastSession=== 'Start Pumping' ){
            AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, '')
            AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT,'')
            AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT,'')
          }
          AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'true').then(() => {
            let keys = [
              KeyUtils.BF_SESSION_TYPE,
              KeyUtils.LEFT_TIMER_VALUE,
              KeyUtils.RIGHT_TIMER_VALUE,
              KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT,
              KeyUtils.START_TIMESTAMP_BFnP_LEFT,
              KeyUtils.START_TIMESTAMP_BFnP_RIGHT,
              KeyUtils.IS_LEFT_TIMER_STARTED,
              KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT,
              KeyUtils.IS_RIGHT_TIMER_STARTED,
              KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING,
              KeyUtils.BACKGROUND_TIME_STAMP,
              KeyUtils.IS_BOTH_BF_SELECTED
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

  setIntialTimer=async (dateObj,prevobj)=>{
    const {initialCalenderTimer}=this.state;
    let prevDateObj=prevobj==undefined?initialCalenderTimer:prevobj;
    let left,right;
    if(dateObj.endTime.isSameOrAfter(dateObj.startTime)){
      left=true;
      await AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT,'pause');
      await AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT,dateObj.startTime.valueOf().toString());
      await AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE,dateObj.duration.asSeconds().toString())
      this.customLeftTimer.current.forceInit(dateObj.startTime,dateObj.endTime);
    }
    if(dateObj.endTime.isSameOrAfter(dateObj.startTimeRight)){
      right=true;
      await AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT,'pause');
      await AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT,dateObj.startTimeRight.valueOf().toString());
      await AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE,dateObj.durationRight.asSeconds().toString())
      this.customRightTimer.current.forceInit(dateObj.startTimeRight,dateObj.endTime);
    }
    this.setState({
      ...left&&{isLeftTimerValue:dateObj.duration.asSeconds(),leftStopwatchStart:true},
      ...right&&{isRightTimerValue:dateObj.durationRight.asSeconds(),rightStopwatchStart:true}
    })
  }
  render() {
    const {navigation} = this.props
    const {
      showClearCounterAlert,
      isLoading,
      isUiLoading,
      showTimers,
      isCalenderValueDetained,
      initialCalenderTimer,
      initialCalenderValue,
      timeCalendarDate,
      timeCalendarDateAM
    } = this.state
    if (isUiLoading) {
      return <LoadingSpinner/>
    }
      
    return <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
      <HeaderTrackings
        title={I18n.t('tracking.breastfeed')}
        hideCalendarIcon = {true}
        timeCalendarDate={timeCalendarDate}
        timeCalendarDateAM={timeCalendarDateAM}
        textStartTime={true}
        updateTimeCalendarUIPress={(date,duration)=>{
          this.setState({
            isDateChanged:true,
            timeCalendarDate:date
          })
          AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING,new Date(date).getTime().toString());
        }}
        updateValidation={(val)=>{
          this.setState({disableButton:val})
        }}
        showStartEndTime={true}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => {
          this._handleBack()
        }}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        dualTimer={true}
        durationInLimit={100}
        //getSelectedDate={(value) => this.setState({selectedDate: value})}
        // getSelectedDate={(value) => {
        //   this.setState({selectedDate: value,isCalenderValueDetained:value})
        //   AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING,value);
        // }}
        getSelectedDate={(value,dateObj) => {
          if(dateObj!=undefined&&dateObj.duration.isValid()&&dateObj.durationRight.isValid()){
            const {isCalenderValueDetained}=this.state;
            this.setIntialTimer(dateObj,isCalenderValueDetained);
            let date={
              selectedDate:value,
              startTime:dateObj.startTime.format('YYYY-MM-DDTHH:mm'),
              endTime:dateObj.endTime.format('YYYY-MM-DDTHH:mm'),
              startTimeRight:dateObj.startTimeRight.format('YYYY-MM-DDTHH:mm')
            }
            this.setState({selectedDate: value,isCalenderValueDetained:date,leftTimerPause:true,rightTimerPause:true})
          }
          // this.setState({selectedDate: value,isCalenderValueDetained:value})
          // AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_BREASTFEEDING,value);
        }}
        selectedDate={isCalenderValueDetained==undefined?initialCalenderValue :isCalenderValueDetained.selectedDate}
        startEndDetainedValue={isCalenderValueDetained!==undefined?isCalenderValueDetained:initialCalenderTimer!=undefined?initialCalenderTimer:undefined}
        //selectedDate={isCalenderValueDetained==undefined?initialCalenderValue :isCalenderValueDetained}
        calenderIconPressed={async ()=>{
          if(isCalenderValueDetained==undefined||isCalenderValueDetained==null||isCalenderValueDetained==''){
            this.setState({initialCalenderValue: moment().format()});
          }
          if(isCalenderValueDetained==undefined||isCalenderValueDetained==null||isCalenderValueDetained==''){
            this.setState({initialCalenderValue: moment().format()});
            if(this.durationLeftInHour>0||this.durationLeftInMins>=0||this.durationLeftInSec>=0||this.durationRightInHour>0||this.durationRightInMins>=0||this.durationRightInSec>=0){
              this.setState({initialCalenderTimer:{
                  selectedDate:moment().format(),
                  //startTime:moment().subtract({hours:timeStampToSave.hour(),minutes:timeStampToSave.seconds()>=30?timeStampToSave.minutes()+1:timeStampToSave.minutes()}),
                  startTime:moment(moment().subtract({hours:this.durationLeftInHour,minutes:this.durationLeftInSec>=30?this.durationLeftInMins+1:this.durationLeftInMins}).format('YYYY-MM-DDTHH:mm')),
                  endTime:moment().format(),
                  startTimeRight:moment(moment().subtract({hours:this.durationRightInHour,minutes:this.durationRightInSec>=30?this.durationRightInMins+1:this.durationRightInMins}).format('YYYY-MM-DDTHH:mm'))
                }})
            }
          }else{
            if(this.durationLeftInHour>0||this.durationLeftInMins>=0||this.durationLeftInSec>=0||this.durationRightInHour>0||this.durationRightInMins>=0||this.durationRightInSec>=0){
              // let leftTimeStamp=moment(`${this.durationLeftInHour}:${this.durationLeftInMins}:${this.durationLeftInSec}`,'HH:mm:ss');
              // let rightTimeStamp=moment(`${this.durationRightInHour}:${this.durationRightInMins}:${this.durationRightInSec}`,'HH:mm:ss');
              // let timeStampToSave;
              // if(leftTimeStamp.isSameOrAfter(rightTimeStamp)){
              //   timeStampToSave=leftTimeStamp;
              // }else timeStampToSave=rightTimeStamp;
              let obj=isCalenderValueDetained;
              obj.startTime=moment(obj.endTime).subtract({hours:this.durationLeftInHour,minutes:this.durationLeftInSec>=30?this.durationLeftInMins+1:this.durationLeftInMins});
              obj.startTimeRight=moment(obj.endTime).subtract({hours:this.durationRightInHour,minutes:this.durationRightInSec>=30?this.durationRightInMins+1:this.durationRightInMins})
              this.setState({isCalenderValueDetained:obj})
            }
          }
        }}
        calendarNegativePressed={()=>{
          this.setState({isCalenderValueDetained:undefined})
        }}
        // calenderIconPressed={async ()=>{
        //   if(isCalenderValueDetained==undefined||isCalenderValueDetained==null||isCalenderValueDetained==''){
        //     this.setState({initialCalenderValue: moment().format()});
        //   }
        // }}
        // calendarNegativePressed={()=>{
        //   AsyncStorage.removeItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING);
        //   this.setState({isCalenderValueDetained:undefined})
        // }}
        ableToOpen={ undefined}/>

      <ScrollView showsVerticalScrollIndicator={false}>

        {isLoading && <LoadingSpinner/>}
        <View style={[styles.container]}>
          {(this.state.showSiriBabySelectionModal!= undefined && !this.state.showSiriBabySelectionModal) && <SiriBabySelectionModal
            showBabySelectionModal={!this.state.showSiriBabySelectionModal}
            cancelBabyPress={(_)=>{
              this.setState({showSiriBabySelectionModal:true})
              setTimeout(() => {
                this.callBreastFeedingApiFromSiri()},200)
            }}
            onBabyListPress={(_) => {
              this.setState({showSiriBabySelectionModal:true})
              setTimeout(() => {
                this.callBreastFeedingApiFromSiri()
              },200)
            }}
            navigation={navigation}
          />}
          <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.duration')}</Text>
          {showTimers && this.renderLeftRightView()}
          {this.renderEndingSide()}
          {this.renderExperienceView()}
          {this.renderBottomView()}
          {showClearCounterAlert && this.showClearCounterPopup()}
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
    </KeyboardAwareScrollView>
  }

  async handleValidations(isComingFromSiri,lefttimeInMinutes,righttimeInMinutes) {
    const {noteTextInput, selectedDate,isCalenderValueDetained} = this.state
    const {babies, selected_baby} = this.props
    const {babyId} = selected_baby
    this.trackingUuid = uuidV4()
    this.props.setLeftTimerActive(false)
    this.props.setRightTimerActive(false)
    AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'true')
    AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, '')
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
    AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'false')
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
    AsyncStorage.setItem(KeyUtils.IS_RIGHT_TIMER_STARTED, 'false')
    AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, '')
    AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, '')
    AsyncStorage.setItem(KeyUtils.BACKGROUND_TIME_STAMP, '')
    AsyncStorage.setItem(KeyUtils.IS_BOTH_BF_SELECTED, '')

    if (babies && babies.length > 0) {
      if (this.durationLeftInHour>0) {
        this.durationLeftInSec += (parseInt(this.durationLeftInHour)* 3600)
      }
      if (this.durationLeftInMins>0) {
        this.durationLeftInSec += (parseInt(this.durationLeftInMins)* 60)
      }
      if (this.durationRightInMins>0) {
        this.durationRightInSec += (parseInt(this.durationRightInMins)* 60)
      }
      if (this.durationRightInHour>0) {
        this.durationRightInSec += (parseInt(this.durationRightInHour)* 3600)
      }

      if (this.durationBothInMins>0) {
        this.durationBothInSec += (parseInt(this.durationBothInMins)* 60)
      }

      let dTotal = 0,durationRight,durationLeft;

      durationRight=parseInt(isComingFromSiri?righttimeInMinutes:this.durationRightInSec)
      durationLeft=parseInt(isComingFromSiri?lefttimeInMinutes:this.durationLeftInSec)
      dTotal = durationLeft + durationRight

      if (dTotal===0){
        alert(I18n.t('calendar.timer_alert'))
        return
      }
      // console.log('dTotall----',dTotal,durationRight,durationLeft)
      let sessionLargerValue = 0;

      if(durationLeft>durationRight)
        sessionLargerValue = durationLeft
      else
        sessionLargerValue = durationRight
      let d;
      // if(isCalenderValueDetained!=null&&isCalenderValueDetained!=undefined&&isCalenderValueDetained!=''){
      //   d = new Date(isCalenderValueDetained.startTime);
      //   AsyncStorage.removeItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING);
      // }else
      //   d = new Date();
      //   d.setSeconds(d.getSeconds() - sessionLargerValue);
      // let formattedDate = await appendTimeZone(d)
      let formattedDate = null;
      if(!autoStartTime) {
        if (isCalenderValueDetained != null && isCalenderValueDetained != undefined && isCalenderValueDetained != '') {
          d = moment(this.state.timeCalendarDate).format();
        } else {
          d = moment();
        }
        var dd = await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING);
        formattedDate = await appendTimeZone(new Date(parseInt(dd)));
      }else{

        if (isCalenderValueDetained != null && isCalenderValueDetained != undefined && isCalenderValueDetained != '') {
          startTime = moment(this.state.timeCalendarDate).format();
        }
        var dd = await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING);
        var date  = new Date(parseInt(dd));
        formattedDate = await appendTimeZone(date);
      }
      // let formattedDate=await appendTimeZone(selectedDate)
      let obj = {
        "babyId": babyId,
        "id": this.trackingUuid,
        "trackingType": KeyUtils.TRACKING_TYPE_BREASTFEEDING,
        "trackAt": formattedDate,
        "durationLeft": durationLeft,
        "durationRight": durationRight,
        "durationTotal": dTotal,
        "confirmed": true,
        "remark": noteTextInput===undefined?'':noteTextInput.toString().trim(),
        "quickTracking": true,
      }
      if (this.badSessionIndex > -1) {
        obj['isBadSession'] = this.badSessionIndex === 1
      }
      obj['lastBreast'] = this.endingSideList[this.lastBreastIndex].value
      this.trackingObj = obj
      let json = {
        "trackings": [this.trackingObj]
      }
      const {isInternetAvailable, trackingApi} = this.props
      // this.saveTrackInNotif(this.trackingObj, selected_baby)
      if (isInternetAvailable) {
        this.setState({isLoading: true, timer: 0});
        trackingApi(json);
      } else {
        this.saveTrackingInDb(false,obj.id)

      }
    }
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
      this.onGoBack()
    })
    let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
    if(lastSession==='Start breastfeeding' || lastSession==='Pause breastfeeding'|| lastSession==='Continuebreastfeeding'|| lastSession==='StopBreastfeeding' || lastSession==='Stop Pumping'|| lastSession==='Start Pumping' ){
      AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, '')
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(BreastFeedingScreen);
