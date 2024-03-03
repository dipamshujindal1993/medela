import React from 'react'
import {Dimensions, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {connect} from "react-redux";
import LoadingSpinner from '@components/LoadingSpinner'
import HomeActions from '@redux/HomeRedux';
import Button from "@components/Button";
import CustomOptionSelector from "@components/CustomOptionSelector";
import CustomTextInput from "@components/CustomTextInput";
import CustomVolumeSlider from "@components/CustomVolumeSlider";
import CustomMeasurementView from "@components/CustomMeasurementView";
import Dialog from '@components/Dialog';
import HeaderTrackings from "@components/HeaderTrackings";
import TrackingDateTime from "@components/TrackingDateTime";
import Left from '@svg/ic_text_left.svg'
import Right from '@svg/ic_text_right.svg'
import LinkIcon from '@svg/ic_link.svg'
import GoodIcon from '@svg/ic_good'
import BadIcon from '@svg/ic_bad'
import Bluetooth from '@svg/ic_bluetooth.svg'
import I18n from '@i18n';
import Colors from "@resources/Colors";
import styles from './Styles/BreastFeedingPumpingScreenStyles';
import RNPickerSelect from "react-native-picker-select";
import {getVolumeUnits, getVolumeMaxValue} from '@utils/locale';
import {createTrackedItem, deleteTrackingItem} from "../Database/TrackingDatabase";
import KeyUtils from "@utils/KeyUtils";
import EditDuration from "@components/EditDuration";
import Toast from "react-native-simple-toast";
import {appendTimeZone,convertSecToMinutes} from "@utils/TextUtils";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from "@react-native-community/async-storage";
import {formatTimer, timeConvert} from "@utils/TextUtils";
import moment from 'moment';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
const width = Dimensions.get('window').width

class EditBreastfeedingScreen extends React.Component {
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

   duration = [
    {
      label: I18n.t('bottle_tracking.total'),
      value: '0',
      min:'0',
      sec:'0',
      hour: '0',
      totalMin:'0',
      totalSec:'0',
      ref1:React.createRef(),
      ref2:React.createRef(),
      ref3:React.createRef()
    },
    {
      label: I18n.t('bottle_tracking.left'),
      value: '0',
      min:'0',
      sec:'0',
      hour: '0',
      totalMin:'0',
      totalSec:'0',
      ref1:React.createRef(),
      ref2:React.createRef(),
      ref3:React.createRef()
    },
    {
      label: I18n.t('bottle_tracking.right'),
      value: '0',
      min:'0',
      sec:'0',
      hour: '0',
      totalMin:'0',
      totalSec:'0',
      ref1:React.createRef(),
      ref2:React.createRef(),
      ref3:React.createRef()
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
    let remark=this.props.navigation.state.params&&this.props.navigation.state.params.item&&this.props.navigation.state.params.item.remark?this.props.navigation.state.params.item.remark:'';
    this.state = {
      isLoading: false,
      leftStopwatchStart: false,
      showDeleteTrackingAlert:false,
      leftStopwatchValue: '',
      leftGetCurrentTime: 0,
      leftGetEndTime: 0,
      showClearCounterAlert:false,
      durationList:this.duration,
      rightStopwatchStart: false,
      rightStopwatchValue: '',
      rightGetCurrentTime: 0,
      rightGetEndTime: 0,

      isBreastFeedingSelected: true,
      noteTextInput: remark,
      heightArray: [],
      volumeLeftCount: '0',
      volumeRightCount: '0',
      volumeTotalCount: '0',
      showVolumeAlert: false,
      volumeCount: '0',
      isVolumeSelectedIndex: -1,
      showCalendarPicker: false,
      selectedDate: moment(this.props.navigation.state.params.item.trackAt).format(),
      babyId: '',
      defaultFeedingIndex:1,
      defaultPumpingIndex: 0,
      durationErrorMessageDialogVisible:false,
      showBadArticles: false,
      durationErrorMessageDialogMessage:I18n.t('stats_breastfeeding.error_total_duration'),
      changedDate:undefined,
      durationValue:undefined
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.totalVolumeCount = 0
    this.leftVolumeCount = 0
    this.rightVolumeCount = 0

    this.badSessionIndex = 0
    this.lastBreastIndex = 0

    this.handleRightStopWatchValue = this.handleRightStopWatchValue.bind(this)
    this.handleLeftStopWatchValue = this.handleLeftStopWatchValue.bind(this)
    this.handleChangeValue = this.handleChangeValue.bind(this)
    this.editDuration=React.createRef();
  }

  async componentDidMount() {
    const {navigation}=this.props

    const {babyId,trackAt,lastBreast,isBadSession,remark} = navigation.state.params.item;
    let {durationTotal,durationRight,durationLeft}=navigation.state.params.item;

  //  durationLeft=convertSecToMinutes(parseInt(durationLeft))
    //durationRight=convertSecToMinutes(parseInt(durationRight))
    durationTotal=(durationLeft+durationRight)
    this.setState({babyId,selectedDate:trackAt})
    const {durationList}=this.state
    this.updateTime(durationList[0],durationTotal)
    this.updateTime(durationList[1],durationLeft)
    this.updateTime(durationList[2],durationRight)
    durationList[0].totalSec=durationTotal+''
    this.setState({durationList})
    let lastBreastIndex=this.endingSideList.findIndex((e)=>{
      return e.value==lastBreast
    })
    this.lastBreastIndex=lastBreastIndex===-1?0:lastBreastIndex
    this.badSessionIndex=isBadSession?1:0
    let sessionLargerValue;
    if(durationLeft>durationRight){
      sessionLargerValue=durationLeft;
    }else{
      sessionLargerValue=durationRight;
    }
    const left=timeConvert(durationLeft)
    const {rhours,rminutes,rSeconds}=timeConvert(durationRight)
    const larger=timeConvert(sessionLargerValue)
    let endTime=moment(trackAt).add({hours:parseInt(formatTimer(larger.rhours)),minutes:parseInt(formatTimer(larger.rSeconds))>30? parseInt(formatTimer(larger.rminutes))+1:parseInt(formatTimer(larger.rminutes))});
    console.log(trackAt,endTime.format('YYYY-MM-DDTHH:mm:ss'))
    this.setState({
      defaultFeedingIndex:lastBreastIndex,
      durationValue:{
        selectedDate:moment(trackAt),
        startTime:moment(endTime,'YYYY-MM-DDTHH:mm:ss').subtract({hours:parseInt(formatTimer(left.rhours)),minutes:parseInt(formatTimer(left.rSeconds))>30? parseInt(formatTimer(left.rminutes))+1:parseInt(formatTimer(left.rminutes))}).format('YYYY-MM-DDTHH:mm:ss'),
        startTimeRight:moment(endTime,'YYYY-MM-DDTHH:mm:ss').subtract({hours:parseInt(formatTimer(rhours)),minutes:parseInt(formatTimer(rSeconds))>30? parseInt(formatTimer(rminutes))+1:parseInt(formatTimer(rminutes))}).format('YYYY-MM-DDTHH:mm:ss'),
        endTime:endTime.format('YYYY-MM-DDTHH:mm:ss')
      }
    })
    await analytics.logScreenView('edit_breastfeeding_screen')
  }

  updateTime(durationItem,seconds){
    const {rhours,rminutes,rSeconds}=timeConvert(seconds)
    durationItem.hour=formatTimer(rhours)
    durationItem.min=formatTimer(rminutes)
    durationItem.sec=formatTimer(rSeconds)
    durationItem.totalSec=seconds+''
  }

  componentWillUnmount() {
    this.totalVolumeCount = 0
    this.leftVolumeCount = 0
    this.rightVolumeCount = 0
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {trackingApiSuccess, trackingApiFailure, navigation,deleteTrackingId,deleteTrackingSuccess, deleteTrackingFailure} = this.props;
    if (deleteTrackingSuccess != prevProps.deleteTrackingSuccess && deleteTrackingSuccess && prevState.isLoading) {
      deleteTrackingItem(deleteTrackingId)
      this.setState({isLoading: false})
      this.props.navigation.goBack()
    }

    if (deleteTrackingFailure != prevProps.deleteTrackingFailure && deleteTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
    if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
      this.saveTrackingInDb(true)
      Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
      navigation.state.params._onSave();
      navigation.goBack()
    }

    if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
     this.saveTrackingInDb(false)
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

    const {rightStopwatchStart, leftStopwatchStart, isBreastFeedingSelected} = this.state

    if (!isBreastFeedingSelected && !leftStopwatchStart && rightStopwatchStart){
        this.setState({defaultFeedingIndex: 0, defaultPumpingIndex: 0})
    }

    if (!leftStopwatchStart && !rightStopwatchStart) {
      this.setState({defaultFeedingIndex: 0, defaultPumpingIndex: 0})
    }
    if (leftStopwatchStart && rightStopwatchStart) {
      this.setState({defaultFeedingIndex: 1, defaultPumpingIndex: 0})
    }

    if (getStartTimeValue) {
      this.setState({
        leftStopwatchStart: stopwatchSelected,
        leftStopwatchValue: stopwatchSelectedTimer,
        leftGetCurrentTime: getStartTimeValue,
      });
    } else {
      this.setState({
        leftStopwatchStart: stopwatchSelected,
        leftStopwatchValue: stopwatchSelectedTimer,
        leftGetEndTime: getEndTimeValue,
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
    const {rightStopwatchStart, leftStopwatchStart, isBreastFeedingSelected} = this.state

    if (!isBreastFeedingSelected && leftStopwatchStart && !rightStopwatchStart){
         this.setState({defaultFeedingIndex: 0, defaultPumpingIndex: 0})
    }

    if (rightStopwatchStart && leftStopwatchStart) {
      this.setState({defaultFeedingIndex: 0, defaultPumpingIndex: 0})
    }
    if (!leftStopwatchStart && !rightStopwatchStart) {
      this.setState({defaultFeedingIndex: 1, defaultPumpingIndex: 0})
    }

    if (getStartTimeValue) {
      this.setState({
        rightStopwatchStart: stopwatchSelected,
        rightStopwatchValue: stopwatchSelectedTimer,
        rightGetCurrentTime: getStartTimeValue,
      });
    } else {
      this.setState({
        rightStopwatchStart: stopwatchSelected,
        rightStopwatchValue: stopwatchSelectedTimer,
        rightGetEndTime: getEndTimeValue,
      });
    }


  }


  handleChangeValue = (value) => {
    const {isVolumeSelectedIndex, volumeCount, volumeList} = this.state
    let currentValue = parseFloat(value)

    if (isVolumeSelectedIndex == -1) {
      volumeList[0].label2 = `${value} ${getVolumeUnits()}`
      this.totalVolumeCount = currentValue
      this.setState({isVolumeSelectedIndex: 0, volumeList})
    } else {
      let previousCount = parseFloat(volumeCount)
      switch (isVolumeSelectedIndex) {
        case 0:
          this.totalVolumeCount = parseFloat(value).toFixed(2)
          volumeList[isVolumeSelectedIndex].label2 = `${value} ${getVolumeUnits()}`
          volumeList[1].label2 = `${this.totalVolumeCount / 2} ${getVolumeUnits()}`
          volumeList[2].label2 = `${this.totalVolumeCount / 2} ${getVolumeUnits()}`
          this.leftVolumeCount = this.totalVolumeCount / 2
          this.rightVolumeCount = this.totalVolumeCount / 2
          break
        case 1:
          //volumeList[1].label2 = `0 ml`
          this.rightVolumeCount = currentValue
          volumeList[1].label2 = `${this.rightVolumeCount} ${getVolumeUnits()}`
          volumeList[0].label2 = `${currentValue + this.leftVolumeCount} ${getVolumeUnits()}`
          break
        case 2:

          this.leftVolumeCount = currentValue
          volumeList[2].label2 = `${this.leftVolumeCount} ${getVolumeUnits()}`
          volumeList[0].label2 = `${this.rightVolumeCount + this.leftVolumeCount} ${getVolumeUnits()}`
          break
      }
      this.setState({isVolumeSelectedIndex: isVolumeSelectedIndex, volumeList})
    }

    this.setState({
      volumeCount: value,
    });
  };

  renderVolumeView() {
    const {volumeList, isVolumeSelectedIndex, volumeCount,} = this.state
    let multiplicityValue = 1
    if(getVolumeUnits() === 'oz'){
      multiplicityValue = 0.25
    }

    return <View style={styles.volumeView}>
      <View style={{flex: 1,}}>
        <Text maxFontSizeMultiplier={1.7} style={styles.sessionTypeTextStyle}>{I18n.t('breastfeeding_pump.total_volume')}</Text>
      </View>

      <View style={styles.volumeLeftRightView}>
        <CustomOptionSelector
          buttonContainerStyle={{width: width / 3 - 24, height: 50, flexDirection: 'column', paddingVertical: 10}}
          data={volumeList}
          defaultSelectedIndex={0}
          onChange={(item, index) => {
            this.setState({isVolumeSelectedIndex: index})
          }}/>
      </View>
      <CustomVolumeSlider
        multiplicity={multiplicityValue}
        maxSliderValue={getVolumeMaxValue()}
        value={volumeCount}
        changeValue={this.handleChangeValue}
        numberColor={this.textColor}
      />

      <CustomMeasurementView
        value={volumeCount}
        maxValue={getVolumeMaxValue()}
        textInputValue={(value)=>this.setState({volumeCount:value})}
        units={getVolumeUnits()}/>
    </View>
  }

  timeConvert(seconds) {
    let  rSec,rMinus
    if (seconds===3600){
      rMinus='60'
      rSec='00'
    }else{
      rSec = `0${(seconds % 60)}`.slice(-2)
      let min = `${Math.floor(seconds / 60)}`
      rMinus = `0${min % 60}`.slice(-2)
    }
    return  {rMinus,rSec}
  }

  renderDurationView() {
    const {volumeList, durationList, volumeCount,} = this.state
    let multiplicityValue = 1
    if(getVolumeUnits() === 'oz'){
      multiplicityValue = 0.25
    }

    return <View style={[styles.volumeView,{paddingHorizontal:20}]}>
      <View style={{flex: 1,}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.duration')}</Text>
      </View>

      <View style={styles.volumeLeftRightView}>
        <EditDuration
          ref={this.editDuration}
          isEditable={true}
          timerTypeStyle={true}
          editBreastfeedingScreen={true}
          buttonContainerStyle={{width: width / 3 - 24, height: 50, flexDirection: 'column', paddingVertical: 10}}
          data={durationList}
          defaultSelectedIndex={-1}
          onChange={(item, index,callback) => {
            durationList[index]=item
            let copyOfItem=JSON.parse(JSON.stringify(
              {
                min:item.min,
                sec:item.sec,
                hour:item.hour
              }
            ))
            const digits_only = string => [...string].every(c => '0123456789'.includes(c));
            let minute=durationList[index].min
            let seconds=durationList[index].sec
            let hours=durationList[index].hour
            //console.log(index,minute,seconds,hours)
            let min,sec,h
            if (!digits_only(hours) || hours==''){
              h=0
            } else {
              h=parseInt(hours)
            }
            if (!digits_only(minute) || minute==''){
              min=0
            } else {
              min=parseInt(minute)
            }
            if (!digits_only(seconds) || seconds==''){
              sec=0
            } else {

              sec=parseInt(seconds)
            }
            if (minute>60){
               //duration
              this.setState({durationErrorMessageDialogVisible:true,durationErrorMessageDialogMessage:I18n.t('stats_breastfeeding.error_total_duration')})
              durationList[index].min=0+'0'
              durationList[index].sec=0+'0'
              if (index===0){
                durationList[1].min=0+'0'
                durationList[1].sec=0+'0'
                durationList[2].min=0+'0'
                durationList[2].sec=0+'0'
              }else {
                durationList[0].min=index===1?durationList[2].min:durationList[1].min
                durationList[0].sec=index===1?durationList[2].sec:durationList[1].sec
              }
              this.setState({durationList:durationList},()=>{
                callback!=undefined&&callback()
              })

            }else {
              if (index===0){
                let seconds=durationList[index].sec
                if (seconds==''){
                  let totalMin=min
                  let totalHour=h
                  let totalSeconds=parseInt(((totalMin*60+(totalHour*3600)))/2)
                  const {rhours,rminutes,rSeconds}=timeConvert(totalSeconds)
                  durationList[index].totalMin=totalMin+''
                  durationList[index].min=minute.startsWith('0')&&minute.length>1?'0'+totalMin+'':totalMin+''
                  durationList[index].sec=''
                  durationList[1].totalMin=(totalSeconds/60)+''
                  durationList[2].totalMin=(totalSeconds/60)+''
                  durationList[1].hour=rhours+''
                  durationList[1].min=rminutes+''
                  durationList[1].sec=rSeconds+''
                  durationList[2].min=rminutes+''
                  durationList[2].sec=rSeconds+''
                  durationList[2].hour=rhours+''
                }else {
                  let totalMin=min
                  let totalHour=h
                  let total_sec=parseInt((sec>60?0:sec+(totalMin*60)+(totalHour*3600)))
                  let totalSeconds=parseInt(total_sec/2)
                  if (parseInt(sec+(totalMin*60)+(totalHour*3600))>12000){
                    this.setState({durationErrorMessageDialogVisible:true,durationErrorMessageDialogMessage:I18n.t('stats_breastfeeding.error_sleep_duration_total_min')})
                    durationList[0].min=0+'0'
                    durationList[0].sec=0+'0'
                    durationList[0].hour=0+'0'
                    durationList[1].min=0+'0'
                    durationList[1].sec=0+'0'
                    durationList[1].hour=0+'0'
                    durationList[2].min=0+'0'
                    durationList[2].sec=0+'0'
                    durationList[2].hour=0+'0'
                  }else {
                    const {rhours,rminutes,rSeconds}=timeConvert(totalSeconds)
                    durationList[1].hour=rhours+''
                    durationList[1].min=rminutes+''
                    durationList[1].sec=rSeconds+''
                    durationList[2].hour=rhours+''
                    durationList[2].min= rminutes+''
                    durationList[2].sec= rSeconds+''

                    durationList[index].hour=hours
                    durationList[index].totalMin=totalMin+''
                    durationList[index].min=minute.startsWith('0')&&minute.length>1?'0'+totalMin+'':totalMin+''
                    durationList[index].sec=seconds.startsWith('0')?seconds:sec+''

                    durationList[1].totalMin=(totalSeconds/60)+''
                    durationList[2].totalMin=(totalSeconds/60)+''
                    console.log('totalMin--',totalMin)

                    if (sec>60){
                      this.setState({durationErrorMessageDialogVisible:true,})
                      durationList[0].sec=0+'0'
                    }

                  }
                }
              } else {
                let previousSec=index===1?durationList[2].sec==''?0:parseInt(durationList[2].sec):durationList[1].sec==''?0:parseInt(durationList[1].sec)
                let totalMinutes=index===1?durationList[2].min==''?0:parseInt(durationList[2].min):durationList[1].min==''?0:parseInt(durationList[1].min)
                let prevHours=index===1?durationList[2].hour==''?0:parseInt(durationList[2].hour):durationList[1].hour==''?0:parseInt(durationList[1].hour)
                let selectedSec=(h*3600)+(sec>60?0:sec)+(min*60)
                let prevSec=previousSec+(totalMinutes*60)+(prevHours*3600)
                let currentSec=selectedSec+prevSec // left +right

                if (selectedSec>6000 || currentSec>12000){
                  this.setState({durationErrorMessageDialogVisible:true,durationErrorMessageDialogMessage:I18n.t('stats_breastfeeding.error_sleep_duration_total_min')})
                  durationList[0].min=index===1?durationList[2].min:durationList[1].min
                  durationList[0].sec=index===1?durationList[2].sec:durationList[1].sec
                  durationList[0].hour=index===1?durationList[2].hour:durationList[1].hour
                  durationList[index].min=0+'0'
                  durationList[index].sec=0+'0'
                  durationList[index].hour=0+'0'

                } else {
                  let leftMin=min
                  let totalMin=leftMin+parseInt(index===1?durationList[2].totalMin:durationList[1].totalMin)
                  let totalSec=sec+parseInt(durationList[0].totalSec)
                  durationList[index].totalMin= leftMin+''
                  const {rhours,rminutes,rSeconds}=timeConvert(currentSec)
                  durationList[0].hour=rhours+''
                  durationList[0].min=rminutes+''
                  durationList[0].sec=rSeconds+''
                  durationList[0].totalSec=currentSec+''

                  durationList[0].totalMin=totalMin+''
                  durationList[0].totalSec=totalSec+''
                 // durationList[0].min=rMinus+''
                 // durationList[0].sec=rSec+''
                  durationList[index].sec=seconds.startsWith('0')?seconds:sec+''
                  if (min==0){
                    durationList[index].min=minute.startsWith('0')?minute: ''
                  }
                  if (sec>60){
                    this.setState({durationErrorMessageDialogVisible:true,durationErrorMessageDialogMessage:I18n.t('stats_breastfeeding.error_total_duration')})
                    durationList[index].sec=0+'0'
                  }
                  if (h>1){
                    this.setState({durationErrorMessageDialogVisible:true,durationErrorMessageDialogMessage:I18n.t('stats_breastfeeding.error_total_duration')})
                    durationList[index].hour=0+'0'
                    durationList[index].sec=0+'0'
                    durationList[index].min=0+'0'
                  }
                }
              }
              durationList.forEach((val,i)=>{
                if(i!=index){
                  if((val.hour+'').length==1){
                    val.hour='0'+val.hour
                  }
                  if((val.min+'').length==1){
                    val.min='0'+val.min
                  }
                  if((val.sec+'').length==1){
                    val.sec='0'+val.sec
                  }
                }
                if(i==index){
                  if(copyOfItem.hour==''||val.hour===0){
                    val.hour=''
                  }
                  if(copyOfItem.min==''||val.min===0){
                    val.min=''
                  }
                  if(copyOfItem.sec==''||val.sec===0){
                    val.sec=''
                  }
                }
              })
              this.setState({durationList:durationList},()=>{
                callback!=undefined&&callback()
              })
            }

          }}/>
      </View>
    </View>
  }


  renderEndingSide() {

    const {defaultFeedingIndex} = this.state
    return <View style={styles.endingSideView}>
      <View style={{flex: 1}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.ending_side')}</Text>
      </View>

      <View style={styles.sessionRightView}>
        <CustomOptionSelector
          buttonContainerStyle={{width: 100,height:48}}
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

        <CustomOptionSelector data={this.experienceList}
                              buttonContainerStyle={{width: 100,height:48}}
                              defaultSelectedIndex={this.badSessionIndex}
                              onChange={(item, index) => {this.addExperience(index)}}/>

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
    const {rightStopwatchStart,noteTextInput,leftStopwatchStart,isLoading} = this.state
    return <View style={{flex:1,marginHorizontal:20}}>
      <CustomTextInput
        maxLength={1000}
        textContentType="familyName"
        value={noteTextInput}
        onChangeText={(index, value) => this.setState({noteTextInput: value})}
        placeholder={I18n.t('breastfeeding_pump.add_note')}
        placeholderTextColor={this.textColor}
        textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
        multiline={true}
        enableDoneButton={true}/>

      <View style={styles.cancelSaveView}>
        <Button title={I18n.t('generic.delete').toUpperCase()} textStyle={styles.cancelTextStyle}
                onPress={() => this.setState({showDeleteTrackingAlert:true})}
                style={styles.cancelButtonStyles}/>
        <Button
         disabled={this.state.disableButton}
          title={I18n.t('generic.save').toUpperCase()} textStyle={styles.saveTextStyle} onPress={() => {
          this.handleVolumeValidation()
        }}
          style={[styles.saveButtonStyles, (rightStopwatchStart || leftStopwatchStart) ? {opacity: 0.5} : {opacity: 1}]}/>
      </View>
    </View>
  }

  getSelectedBabyDetails(item) {
    //Baby's data
    this.setState({babyId: item.babyId})
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
          this.handleValidations()
        }}
        positiveOnPress={() => {
          this.setState({showVolumeAlert: false})
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
        positiveOnPress={() => {
          this.setState({showClearCounterAlert: false})
          this.props.navigation.goBack()
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  showDeleteTrackingPopup() {
    const {showDeleteTrackingAlert} = this.state
    return (
      <Dialog
        visible={showDeleteTrackingAlert}
        title={I18n.t('tracking.title')}
        message={I18n.t('tracking.delete_tracking_message')}
        positive={I18n.t('generic.yes')}
        negative={I18n.t('generic.no')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showDeleteTrackingAlert: false})

        }}
        positiveOnPress={() => {
          const {deleteTrackingApi,navigation}=this.props
          const {babyId,id} = navigation.state.params.item
          this.setState({showDeleteTrackingAlert: false,isLoading:true})
          deleteTrackingApi(id,babyId)
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  showDurationErrorMessageDialog(){
    const {durationErrorMessageDialogVisible,durationErrorMessageDialogMessage} = this.state
    return <Dialog
      visible={durationErrorMessageDialogVisible}
      title={I18n.t('breastfeeding_pump.duration')}
      message={durationErrorMessageDialogMessage}//I18n.t('stats_breastfeeding.error_total_duration')
      positive={I18n.t('login.ok')}
      isIcon={false}
      positiveOnPress={() => {
        this.setState({ durationErrorMessageDialogVisible: false})
      }}
      onDismiss={() => {
      }}
    />
  }
  setTimer(dateObj,prevDateObj){
    const {durationList}=this.state;
    let minute=dateObj.duration.minutes()
    let seconds=dateObj.duration.seconds()
    let hours=dateObj.duration.hours()
    let min=dateObj.duration.minutes()
    let sec=dateObj.duration.seconds()
    let hour=dateObj.duration.hours()
    let RMin=dateObj.durationRight.minutes();
    let RHour=dateObj.durationRight.hours();
    let RSec=dateObj.durationRight.seconds();
    let hourMin=60*hour
    let totalMin=hourMin+min
    let leftMinutes=totalMin/2
    let TotalSec=sec+parseInt(totalMin)*60
    let left=0,right=0;
    if(dateObj.endTime.isSameOrAfter(dateObj.startTime)){
      left=dateObj.duration.asSeconds();
      durationList[1].hour=formatTimer(hours)
      durationList[1].min=formatTimer(minute)
      durationList[1].sec=formatTimer(seconds)
      durationList[1].totalMin=totalMin+''
      durationList[1].totalSec=TotalSec+''
    }
    if(dateObj.endTime.isSameOrAfter(dateObj.startTimeRight)){
      right=dateObj.durationRight.asSeconds();
      durationList[2].hour=formatTimer(RHour)
      durationList[2].min=formatTimer(RMin)
      durationList[2].sec=formatTimer(RSec)
      durationList[2].totalMin=totalMin+''
      durationList[2].totalSec=TotalSec+''
    }
    if(left==0){
      let leftDuration=parseInt(durationList[1].hour)*60*60;
      leftDuration+=parseInt(durationList[1].min)*60;
      leftDuration+=parseInt(durationList[1].sec);
      if(!isNaN(leftDuration)){
        left=leftDuration
      }

    }
    if(right==0){
      let rightDuration=parseInt(durationList[2].hour)*60*60;
      rightDuration+=parseInt(durationList[2].min)*60;
      rightDuration+=parseInt(durationList[2].sec);
      if(!isNaN(rightDuration)){
        right=rightDuration
      }

    }
    const {rhours,rminutes,rSeconds}=timeConvert(left+right)
    //const {rhours,rminutes,rSeconds}=timeConvert(dateObj.duration.asSeconds()+dateObj.durationRight.asSeconds())
    durationList[0].hour=formatTimer(rhours)
    durationList[0].min=formatTimer(rminutes)
    durationList[0].sec=formatTimer(rSeconds)
    durationList[0].totalMin=totalMin+''
    durationList[0].totalSec=TotalSec+''
    // durationList[1].hour=formatTimer(hours)
    // durationList[1].min=formatTimer(minute)
    // durationList[1].sec=formatTimer(seconds)
    // durationList[1].totalMin=totalMin+''
    // durationList[1].totalSec=TotalSec+''
    // durationList[2].hour=formatTimer(RHour)
    // durationList[2].min=formatTimer(RMin)
    // durationList[2].sec=formatTimer(RSec)
    // durationList[2].totalMin=totalMin+''
    // durationList[2].totalSec=TotalSec+''
    this.setState({durationList:durationList})
    this.editDuration.current.forceInit();
  }
  render() {
    const {navigation} = this.props
    const {trackingType} = navigation.state.params.item
    const {durationErrorMessageDialogVisible,changedDate,durationValue, selectedDate,showVolumeAlert,showClearCounterAlert, isLoading,showDeleteTrackingAlert} = this.state
    let headerDate;
    if(changedDate==undefined){
      headerDate=selectedDate;
    }else{
      console.log(changedDate)
      if(changedDate.durationRight.asSeconds()>changedDate.duration.asSeconds()){
        headerDate=changedDate.startTimeRight
      }else{
        headerDate=changedDate.startTime
      }
    }
    if(changedDate==undefined ?selectedDate:changedDate.startTime)
    return  <KeyboardAwareScrollView contentContainerStyle={{flex:1}}>
      <HeaderTrackings
        isEditable={true}
        title={I18n.t('stats_breastfeeding.title')}
        hideCalendarIcon = {true}
        timeCalendarDate={selectedDate}
        textStartTime={true}
        updateTimeCalendarUIPress={(date,duration)=>{
          this.setState({
            isDateChanged:true,
            selectedDate:date
          })
        }}
        updateValidation={(val)=>{
          this.setState({disableButton:val})
        }}
        showStartEndTime={true}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => navigation.goBack()}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        //selectedDate={selectedDate}
        startEndDetainedValue={changedDate!=undefined?changedDate:durationValue!=undefined?durationValue:undefined}
        selectedDate={changedDate!=undefined?changedDate.selectedDate:selectedDate}
        durationInLimit={100}
        dualTimer={true}
        getSelectedDate={(value,dateObj) => {
          //this.setState({selectedDate: value})
          if(dateObj!=undefined&&dateObj.duration.isValid()&&dateObj.durationRight.isValid()){
            const {changedDate,durationValue}=this.state;
            this.setTimer(dateObj,changedDate==undefined?durationValue:changedDate);
            let date={
              selectedDate:value,
              startTime:dateObj.startTime.format('YYYY-MM-DDTHH:mm'),
              endTime:dateObj.endTime.format('YYYY-MM-DDTHH:mm'),
              startTimeRight:dateObj.startTimeRight.format('YYYY-MM-DDTHH:mm'),
              duration:dateObj.duration,
              durationRight:dateObj.durationRight
            }
            this.setState({selectedDate: value,changedDate:date})
          }
        }}
        calenderIconPressed={async ()=>{
          if(changedDate!=undefined){
            const {changedDate,durationList,durationValue}=this.state;
            //changedDate.startTime=moment(changedDate.endTime).subtract({hours:durationList[0].hour,minutes:parseInt(durationList[0].sec)>30?parseInt(durationList[0].min)+1:parseInt(durationList[0].min)})
            //let sessionLargerDurationObj=durationList[]
            this.setState({
              changedDate:{
                selectedDate:moment(changedDate.selectedDate).format('YYYY-MM-DDTHH:mm'),
                startTime:moment(changedDate.endTime).subtract({hours:durationList[1].hour,minutes:parseInt(durationList[1].sec)>30?parseInt(durationList[1].min)+1:parseInt(durationList[1].min)}).format('YYYY-MM-DDTHH:mm'),
                endTime:moment(changedDate.endTime).format('YYYY-MM-DDTHH:mm'),
                startTimeRight:moment(changedDate.endTime).subtract({hours:durationList[2].hour,minutes:parseInt(durationList[2].sec)>30?parseInt(durationList[2].min)+1:parseInt(durationList[2].min)}).format('YYYY-MM-DDTHH:mm'),
                duration:changedDate.duration,
                durationRight:changedDate.durationRight
              }
            })
          }else{
            const {durationList,durationValue}=this.state;
            //changedDate.startTime=moment(changedDate.endTime).subtract({hours:durationList[0].hour,minutes:parseInt(durationList[0].sec)>30?parseInt(durationList[0].min)+1:parseInt(durationList[0].min)})
            this.setState({
              durationValue:{
                selectedDate:moment(durationValue.selectedDate).format('YYYY-MM-DDTHH:mm'),
                startTime:moment(moment(durationValue.endTime).subtract({hours:durationList[1].hour,minutes:parseInt(durationList[1].sec)>30?parseInt(durationList[1].min)+1:parseInt(durationList[1].min)}).format('YYYY-MM-DDTHH:mm')),
                endTime:moment(moment(durationValue.endTime).format('YYYY-MM-DDTHH:mm')),
                startTimeRight:moment(moment(durationValue.endTime).subtract({hours:durationList[2].hour,minutes:parseInt(durationList[2].sec)>30?parseInt(durationList[2].min)+1:parseInt(durationList[2].min)}).format('YYYY-MM-DDTHH:mm')),
              }
            },()=>{
              console.log(this.state.durationValue)
            })
          }
        }}
        />
      <ScrollView contentContainerStyle={styles.container}>

        {isLoading && <LoadingSpinner/>}
        <View style={{flex:1}}>

          {this.renderDurationView()}
          {this.renderEndingSide()}
          {this.renderExperienceView()}
          {this.renderBottomView()}
          {showVolumeAlert && this.showVolumeDialog()}
          {showClearCounterAlert && this.showClearCounterPopup()}
          {showDeleteTrackingAlert && this.showDeleteTrackingPopup()}
          {durationErrorMessageDialogVisible && this.showDurationErrorMessageDialog()}
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


  handleVolumeValidation() {
    const {isBreastFeedingSelected} = this.state

    if (!isBreastFeedingSelected && this.totalVolumeCount < 1) {
      this.setState({showVolumeAlert: true})
    } else {
      this.handleValidations()
    }

  }

  getTotalMin(hour,min,sec){
    return parseInt(hour*3600)+parseInt(min)*60+parseInt(sec)
  }

  async handleValidations() {
    const {noteTextInput, selectedDate,changedDate} = this.state
    const{navigation}= this.props
    const {trackingType,id} = navigation.state.params.item
    const {durationList}=this.state

    if (this.props.babies && this.props.babies.length > 0) {

      if (isNaN(durationList[0].totalMin) || isNaN(durationList[1].totalMin)  || isNaN(durationList[2].totalMin)){
        alert(I18n.t('calendar.timer_alert'))
        return
      }

      if(parseInt(durationList[0].sec)>60) {
        alert(I18n.t('stats_breastfeeding.error_total_duration_sec'))
        return
      }

      if(parseInt(durationList[1].sec)>60) {
        alert(I18n.t('stats_breastfeeding.error_left_duration_sec'))
        return
      }
      if(parseInt(durationList[2].sec)>60) {
        alert(I18n.t('stats_breastfeeding.error_right_duration_sec'))
        return
      }

      let durationLeftSec=this.getTotalMin(parseInt(durationList[1].hour),parseInt(durationList[1].min),durationList[1].sec==''?0:parseInt(durationList[1].sec))
      let durationRightSec=this.getTotalMin(parseInt(durationList[2].hour),parseInt(durationList[2].min),durationList[2].sec==''?0:parseInt(durationList[2].sec))

      let totalMin=durationLeftSec+durationRightSec
      if (totalMin===0){
        alert(I18n.t('calendar.timer_alert'))
        return
      }
      let date;
      if(changedDate!=undefined){
        if(changedDate.duration.asSeconds()>changedDate.durationRight.asSeconds()){
          date=moment(changedDate.startTime)
        }else{
          date=moment(changedDate.startTimeRight)
        }
      }else{
        date=selectedDate;
      }
      let formattedDate = await appendTimeZone(date)
      let obj = {
        "babyId": this.state.babyId,
        "id": id,
        "trackingType": KeyUtils.TRACKING_TYPE_BREASTFEEDING ,
        "trackAt": formattedDate,
        "durationLeft": durationLeftSec,
        "durationRight": durationRightSec,
        "durationTotal": totalMin,
        "confirmed": true,
        "remark": noteTextInput.toString().trim(),
        "quickTracking": true,
      }

      if (this.badSessionIndex > -1) {
        obj['isBadSession'] = this.badSessionIndex === 1
      }
      obj['lastBreast'] = this.endingSideList[this.lastBreastIndex].value

      this.trackingObj=obj

      let json = {
        "trackings": [this.trackingObj]
      }
      const {isInternetAvailable,trackingApi}=this.props
      if (isInternetAvailable){
        this.setState({isLoading: true});
        trackingApi(json);
      }else {
        this.saveTrackingInDb(false)
      }
    }
  }

  saveTrackingInDb(isSync){
    this.trackingObj.isSync= isSync
    this.trackingObj.userId= this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r)=>{
      if(!isSync) {
        Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
        this.props.navigation.goBack()
      }
    })
  }

}

const mapStateToProps = (state) => ({
  isInternetAvailable:state.app.isInternetAvailable,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  deleteTrackingSuccess:state.home.deleteTrackingSuccess,
  deleteTrackingFailure:state.home.deleteTrackingFailure,
  deleteTrackingId:state.home.deleteTrackingId,
  themeSelected: state.app.themeSelected,
})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  deleteTrackingApi: (trackingId,babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId,babyId)),
});


export default connect(mapStateToProps, mapDispatchToProps)(EditBreastfeedingScreen);
