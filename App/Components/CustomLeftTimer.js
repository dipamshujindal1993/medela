import React from 'react';
import {TouchableOpacity, Text, View, Keyboard,Platform} from 'react-native'
import styles, {options} from './Styles/CustomTimerStyles'
import {Colors} from '@resources';
import I18n from '@i18n';
import CustomTextInput from '@components/CustomTextInput';
import AsyncStorage from '@react-native-community/async-storage'
import KeyUtils from "@utils/KeyUtils";
import Dialog from '@components/Dialog';
import moment from "moment";
import {getTotalMin} from "@utils/TextUtils";
import {connect} from 'react-redux';
import {getTotalMinHoursInSec} from "../Utils/TextUtils";
import { moderateScale } from '../Resources/Metrics';
let isTimerPaused = false
 class CustomLeftTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _timer: 0,
      isActive: false,
      isPaused: false,
      hour: '',
      min: '',
      sec: '',
      durationErrorMessageDialogVisible:false,
      durationErrorMessage:I18n.t('stats_breastfeeding.error_total_duration')
    };

    this._increment = React.createRef();

    this.handleStart = this.handleStart.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.isFirstTime = false;
  }

  componentDidMount() {
    this.init()
  }
  forceInit(startDate,endDate){
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT).then(value => {
      if (value === 'pause') {
        this.handlePause();
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT).then(startTime => {
          let st = parseInt(startTime)
          let difference = endDate.valueOf() - st;
          let secondsDifference = Math.floor(difference / 1000);
          let dd = parseInt(secondsDifference);
          this.setState({ _timer: dd }, () => {
            //AsyncStorage.setItem(KeyUtils.PUMPING_TIMER_VALUE, this.props.secondsDifference.toString())
            this.formatTime();
          })
        })
      }  
    });
  }
  componentWillUnmount(){
    clearInterval(this._increment.current);
    AsyncStorage.getItem(KeyUtils.RESET_TIMER).then(value => {
      if (value !== 'true') {
        AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, Date.now().toString())
      }else {
        AsyncStorage.removeItem(KeyUtils.LEFT_TIMER_VALUE)
      }
    });

  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {secondsDifference, appState, callChild} = this.props
    // if(prevProps.callChild!==callChild && callChild === 1){
    //   this.handlePause();
    // }
    // if(prevProps.callChild!==callChild && callChild === 2){
    //   this.handleStart();
    // }

    if (secondsDifference !== prevProps.secondsDifference && secondsDifference === -1) {
      isTimerPaused = true
    }

    if (secondsDifference !== prevProps.secondsDifference && secondsDifference > 0) {

      if (!this.isFirstTime) {
        this.isFirstTime = true
        isTimerPaused=true
        let dd = parseInt(secondsDifference)
        this.setState({_timer: dd})
        AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT).then(value => {
          if (value==='true'){
            this.startTimer()
          }
        })
      }
    }

    if (appState && appState != prevProps.appState) {
      if (appState === 'background') {
      } else if (appState === 'active') {
        AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT).then(value => {
          if (value === 'true') {
            AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(startTime => {
              AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP).then(backgroundTime => {
                let st = parseInt(backgroundTime);
                let difference = Date.now() - st;
                let secondsDifference = Math.floor(difference / 1000);
                let backgroundtime = parseInt(secondsDifference);
                let dd = +startTime + +backgroundtime
                AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, (dd).toString())
                this.setState({ _timer: parseInt(dd) })
              })
            })
          }
        })
      }
    }
  }

 async init() {
    let {isLeftPress, isCallingFromBaby, secondsDifference} = this.props
    let resetValue= await AsyncStorage.getItem(KeyUtils.RESET_TIMER)
    if (resetValue === 'true') {
      this.handleReset()
    }else{
      let timer = await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
      if (timer && timer !== '') {
        this.setState({_timer: parseInt(timer)})
      }
    }



    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT).then(value => {
      if (value === 'true') {
        if (secondsDifference !== -1) {
          this.isFirstTime = true
          let dd = parseInt(secondsDifference)
          this.setState({_timer: dd}, () => {
            if (secondsDifference) {
              AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, secondsDifference.toString())
              this.handleStart();
            }
          });
        }
      }else if (value === 'pause') {
        if (this.props.isPausedFromSiri) {
          if (this.props.secondsDifference) {
          let dd = parseInt(this.props.secondsDifference)
          console.log('timrediff',this.props.secondsDifference)
          this.setState({ _timer: dd }, () => {
          AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, this.props.secondsDifference.toString())
          })}
        else{
          this.setState({ _timer: 0 }, () => {
           AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, '0')
          })}}
        this.formatTime()
      } else {
        if (!isCallingFromBaby && isLeftPress) {
          this.startTimer()
        }
      }
    });
  }

  handleStart() {
    const {stopwatchStartStatus,handleStartRightTimer, callChild} = this.props

    let mObj = {stopwatchSelected: !stopwatchStartStatus};
    if (stopwatchStartStatus) {
      callChild!==0 && callChild!==2 && handleStartRightTimer()
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
      AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'true')
      let getStartTime = moment();
      AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT).then(value => {
        getStartTime = value
      });

      if(this.props.isEditable) {
        this.props.changeValue({
          ...mObj,
          stopwatchSelectedTimer: this.currentTime,
          getStartTimeValue: getStartTime,
        });
      }
      this.setState({isActive: true, isPaused: true})
      this._increment.current = setInterval(() => {
        let count = this.state._timer
        count = parseInt(count) + 1
        this.setState({
          _timer: count.toString()
        }, () => {
          AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, Date.now().toString())
          AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, this.state._timer.toString())
          this.formatTime()
        })
      }, 1000)
    } else {
      let getEndTime = moment();
      if(this.props.isEditable)
        this.props.changeValue({
        ...mObj,
        stopwatchSelectedTimer: this.currentTime,
        getEndTimeValue: getEndTime,
      });
      this.handlePause()
    }
  }

  handlePause(){
    const {handlePauseRightTimer} = this.props
    isTimerPaused = true
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'pause')
    AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'pause')
    clearInterval(this._increment.current);
    this.setState({isPaused: true})
    handlePauseRightTimer()
  }

  handleReset(){
    this.setState({isActive: true, isPaused: true, _timer: 0})
    AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, '')
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
    AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'false')
    clearInterval(this._increment.current);

    AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'false');
  }

  formatTime() {
    let {_timer} = this.state
    const {getHours, getMin, getSec} = this.props
    let getSeconds = '', minutes = '', getMinutes = '', getHrs = ''
    _timer = parseInt(_timer)
    getSeconds = `0${(_timer % 60)}`.slice(-2)
    minutes = `${Math.floor(_timer / 60)}`
    getMinutes = `0${minutes % 60}`.slice(-2)
    getHrs = `0${Math.floor(_timer / 3600)}`.slice(-2)

    // getTotalTime(left_timer)

    this.setState({
      hour: getHrs,
      min: getMinutes,
      sec: getSeconds
    }, () => {
      getHours(getHrs)
      getMin(getMinutes)
      getSec(getSeconds)
    })
  }


  onChangeHrs(value) {
    const {hour, min, sec} = this.state
    this.handlePause()

    if (value>1){
      this.setState({durationErrorMessageDialogVisible:true,durationErrorMessage:I18n.t('stats_breastfeeding.error_sleep_duration_total_min'),hour:'00'})
    }else {
      if(value.length>1){
        this.minInput.focus()
      }
      this.setState({hour:value})
    }
  }

  onChangeMin(value) {
    const {hour, min, sec} = this.state
    const {rightTimerInSec,rightTimerInMin,rightTimerInHour}=this.props
    this.handlePause()
    //let rightTotalTimeInSec=getTotalMinHoursInSec(rightTimerInHour,rightTimerInMin,rightTimerInSec)
    let leftTotalTimeInSec=getTotalMinHoursInSec(hour,value==''?0:value,parseInt(sec))
    let totalTime=leftTotalTimeInSec
    console.log('hour---',hour)

    if(value.length>1){
      this.secInput.focus()
    }
    if (value <= 60 && leftTotalTimeInSec<=6000) {
      this.setState({min: value})
    }
    if (value > 60){
      this.minInput.focus()
      this.setState({min: 0})
      this.setState({durationErrorMessageDialogVisible:true,durationErrorMessage:I18n.t('stats_breastfeeding.error_total_duration')})
    }
    else if ((parseInt(hour)>0 && value>40)){
      this.minInput.focus()
      this.setState({min: 0})
      this.setState({durationErrorMessageDialogVisible:true,durationErrorMessage:I18n.t('stats_breastfeeding.error_sleep_duration_total_min')})
    }
    if(value==''){
      this.hoursInput.focus()
    }
  }

  onChangeSec(value) {
    const {hour, min, sec} = this.state
    const {rightTimerInSec,rightTimerInMin,rightTimerInHour}=this.props
    this.handlePause()
    let rightTotalTimeInSec=getTotalMinHoursInSec(rightTimerInHour,rightTimerInMin,rightTimerInSec)
    let leftTotalTimeInSec=getTotalMinHoursInSec(hour,min,value==''?0:value)
//    let leftTotalTimeInSec=getTotalMin(min,value==''?0:value)
    let totalTime=leftTotalTimeInSec+rightTotalTimeInSec
    if(value==''){
      this.minInput.focus()
    }

    if (value>60){
      this.secInput.focus()
      this.setState({durationErrorMessageDialogVisible:true,durationErrorMessage:I18n.t('stats_breastfeeding.error_total_duration'),sec: '00'})
    }else if (hour>0 && min>=40 && value>0){
      this.secInput.focus()
      this.setState({durationErrorMessageDialogVisible:true,durationErrorMessage:I18n.t('stats_breastfeeding.error_sleep_duration_total_min'),sec: '00'})
    }else{
      this.setState({sec: value})
    }

    /*if (value <60 && totalTime<=12000) {
      this.secInput.focus()
      this.setState({sec: value})
      this.setState({durationErrorMessageDialogVisible:true,sec: 0,durationErrorMessage:I18n.t('stats_breastfeeding.error_sleep_duration_total_min')})

    } else {
      this.secInput.focus()
      this.setState({sec: value})
      this.setState({durationErrorMessageDialogVisible:true,sec: 0,durationErrorMessage:I18n.t('stats_breastfeeding.error_total_duration')})
    }*/
  }

  startTimer() {
    //const _handleStart = this.handleStart
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
    AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'true')
    if(!isTimerPaused) {
    AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, Date.now().toString())
    }
    this.handleStart()
  }

  setTimeValuesOnChange(){
    const {handlePauseRightTimer} = this.props
    const { hour, min, sec } = this.state
    let hms = `${hour}:${min}:${sec}`;
    let a = hms.split(':');
    let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    this.setState({
      _timer:seconds
    })
    handlePauseRightTimer()
  }

  renderTimer=()=> {
    const {icon, stopwatchStartStatus,onPressTimer} = this.props
    return (
      <TouchableOpacity accessible={true} accessibilityLabel={I18n.t('breastfeeding_pump.left_timer')} onPress={() => {
          this.startTimer()
          if(typeof onPressTimer =='function'){
            onPressTimer(stopwatchStartStatus)
          }
        }}
      >
        <View
          style={[
            styles.StopwatchBtnStyle,
            !stopwatchStartStatus
              ? {backgroundColor: Colors.rgb_ed0212}
              : {backgroundColor: Colors.rgb_d8d8d8},
          ]}>
          {icon ? stopwatchStartStatus ? icon : <Text maxFontSizeMultiplier={1.7} style={[
            styles.StopwatchBtnText,
            !stopwatchStartStatus
              ? {color: Colors.white}
              : {color: Colors.rgb_3E3E3E},
          ]}>{I18n.t('sleep.pause').toUpperCase()}</Text> : icon}
          {!icon && <Text maxFontSizeMultiplier={1.7}
            style={[
              styles.StopwatchBtnText,
              stopwatchStartStatus
                ? {color: Colors.white}
                : {color: Colors.rgb_3E3E3E},
            ]}>
            {!stopwatchStartStatus
              ? I18n.t('sleep.start').toUpperCase()
              : I18n.t('sleep.pause').toUpperCase()}
          </Text>}
        </View>
      </TouchableOpacity>
    )
  }

  renderEditableTimer() {
    const {hour, min, sec} = this.state
    const {timerTypeStyle} = this.props
    return (
      <View style={[styles.StopwatchWrapper,{left:moderateScale(25)}]}>
        {this.renderTimer()}
        <View style={options.container}>
          {timerTypeStyle === 3 ? <View style={[styles.timeBackground, {flexDirection: 'row', alignItems: 'center',height:48}]}>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                accessible={true} 
                textStyles={[styles.textInputStylesCustom,{color:Colors.rgb_000000}]}
                inputStyle={{width:48,height:48}}
                value={hour}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue(this.hoursInput,hour)}
                placeholderTextColor={Colors.rgb_000000}
                onChangeText={(index, value) => this.onChangeHrs(value)}
                returnKeyType={"done"}
                onSubmitEditing={Keyboard.dismiss}
                inputRef={(input)=>{ this.hoursInput = input }}
                selectTextOnFocus={true}
                contextMenuHidden={true}
              />
              <Text accessibilityLabel={I18n.t("breastfeeding_pump.left_hrs_separator")} accessible={true}  maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: 5,color:Colors.rgb_000000}]}>{":"}</Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={[styles.textInputStylesCustom,{color:Colors.rgb_000000}]}
                inputStyle={{width:48,height:48}}
                value={min}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue(this.minInput,min)}
                placeholderTextColor={Colors.rgb_000000}
                onChangeText={(index, value) => this.onChangeMin(value)}
                returnKeyType={"done"}
                onSubmitEditing={Keyboard.dismiss}
                inputRef={(input)=>{ this.minInput = input }}
                selectTextOnFocus={true}
                contextMenuHidden={true}
              />
              <Text accessibilityLabel={I18n.t("breastfeeding_pump.left_mins_separator")} accessible={true}  maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: 5,color:Colors.rgb_000000}]}>{":"}</Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={[styles.textInputStylesCustom,{color:Colors.rgb_000000}]}
                inputStyle={{width:48,height:48}}
                value={sec}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue(this.secInput,sec)}
                placeholderTextColor={Colors.rgb_000000}
                onChangeText={(index, value) => this.onChangeSec(value)}
                returnKeyType={"done"}
                onSubmitEditing={Keyboard.dismiss}
                inputRef={(input)=>{ this.secInput = input }}
                selectTextOnFocus={true}
                contextMenuHidden={true}
              />
            </View> :

            <View style={[styles.timeBackground, {flexDirection: 'row', alignItems: 'center'}]}>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={styles.textInputRightStylesCustom}
                value={min}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={Colors.rgb_898d8d}
                onChangeText={(index, value) => this.onChangeMin(value)}
                returnKeyType={"done"}
                onSubmitEditing={Keyboard.dismiss}
                inputRef={(input)=>{ this.minInput = input }}
              />
              <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: 5}]}>{":"}</Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={styles.textInputLeftStylesCustom}
                value={sec}
                placeholder={'00'}
                isSecChange={true}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={Colors.rgb_898d8d}
                onChangeText={(index, value) => this.onChangeSec(value)}
                returnKeyType={"done"}
                onSubmitEditing={Keyboard.dismiss}
                inputRef={(input)=>{ this.secInput = input }}
              />
            </View>}
        </View>
      </View>
    )
  }

  renderTimerOnly() {
    const {
      timerTypeStyle
    } = this.props
    const {hour, min, sec} = this.state
    if (timerTypeStyle === 3) {
      return (
        <Text maxFontSizeMultiplier={1.7} style={{color:Colors.rgb_000000, fontSize: 14, marginHorizontal: 10}}>{hour}:{min}:{sec}</Text>
      )
    } else {
      return (
        <Text maxFontSizeMultiplier={1.7} style={{color:Colors.rgb_000000, fontSize: 14, marginHorizontal: 10}}>{min}:{sec}</Text>
      )
    }
  }

  onFocusValue(ref,value) {
    // ref&&ref.setNativeProps({
    //   selection:{
    //     start:value.length,
    //     end:value.length
    //   }
    // })
    // setTimeout(() => {
    //   Platform.OS=='android'&&ref&&ref.setNativeProps({
    //     selection:{
    //       start:undefined,
    //       end:undefined
    //     }
    //   })
    // }, 0);
    this.handleOnFocus()
    this.props.isFocusInput(true)
  }

  handleOnFocus() {
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'pause')
    clearInterval(this._increment.current);
    this.setTimeValuesOnChange()
    this.setState({isPaused: true})
  }

  showDurationErrorMessageDialog(){
    const {durationErrorMessageDialogVisible,durationErrorMessage} = this.state
    return <Dialog
      visible={durationErrorMessageDialogVisible}
      title={I18n.t('breastfeeding_pump.duration')}
      message={durationErrorMessage}
      positive={I18n.t('login.ok')}
      isIcon={false}
      positiveOnPress={() => {
        this.setState({ durationErrorMessageDialogVisible: false})
      }}
      onDismiss={() => {
      }}
    />
  }

  render() {
    const {
      getHours,
      getMin,
      getSec,
      isEditable,
    } = this.props

    const {hour, min, sec,durationErrorMessageDialogVisible} = this.state
    getHours(hour)
    getMin(min)
    getSec(sec)
    return (
      <View>
        {isEditable && this.renderEditableTimer()}
        {!isEditable && this.renderTimerOnly()}
        {durationErrorMessageDialogVisible && this.showDurationErrorMessageDialog()}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  appState: state.app.appState,
})

export default connect(mapStateToProps, null,null,{forwardRef:'true'})(CustomLeftTimer)
