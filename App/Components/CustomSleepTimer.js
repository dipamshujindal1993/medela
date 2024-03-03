import React from 'react';
import {TouchableOpacity, Text, View,Platform} from 'react-native'
import styles, {options} from './Styles/CustomTimerStyles'
import {Colors} from '@resources';
import I18n from '@i18n';
import CustomTextInput from '@components/CustomTextInput';
import AsyncStorage from '@react-native-community/async-storage'
import KeyUtils from "@utils/KeyUtils";
import Toast from '@components/ToastMessage';
import moment from "moment";
import {connect} from 'react-redux';
import { I18nManager } from 'react-native';
let isTimerPaused = false

class CustomSleepTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _timer: 0,
      isActive: false,
      isPaused: false,
      hour: '',
      min: '',
      sec: '',
      pausedState:true
    };

    this._increment = React.createRef();
  }

  componentDidMount() {
    this.init()
  }
  forceInit(startDate,endDate){
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_SLEEP).then(async (value) => {
      if (value === 'pause') {
        this.handlePause()
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP).then(
          (startTime) => {
            // AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE).then((value) => {
            //   initialTimmer = value;
              if (startTime) {
                let difference = endDate.valueOf() - startTime;
                let secondsDifference = Math.floor(difference / 1000);
                //console.log(secondsDifference, initialTimmer, difference, 'sid');
                //if (secondsDifference >= initialTimmer) {
                  this.setState({_timer: secondsDifference}, () =>{
                    // AsyncStorage.setItem(
                    //   KeyUtils.SLEEP_TIMER_VALUE,
                    //   secondsDifference.toString(),
                    // )
                    AsyncStorage.setItem(KeyUtils.SAVED_SLEEP_TIMER, 'false')
                    this.formatTime()
                    }
                  )
                //}
              }
            //});
            
          },
        );
      }
    });
  }
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {appState, callChild} = this.props
    if(prevProps.callChild!==callChild && callChild === 1){
      this.handlePause();
    }
    if (appState && appState != prevProps.appState) {
      if (appState === 'background') {
      } else if (appState === 'active') {
        AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_SLEEP).then(value => {
          if (value === 'true') {
            AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE).then(startTime => {
              AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP).then(backgroundTime => {
                let st = parseInt(backgroundTime);
                let difference = Date.now() - st;
                let secondsDifference = Math.floor(difference / 1000);
                let backgroundtime = parseInt(secondsDifference);
                let dd = +startTime + +backgroundtime
                AsyncStorage.setItem(KeyUtils.SLEEP_TIMER_VALUE, (dd).toString())
                this.setState({ _timer: parseInt(dd) })
              })
            })
          }
        })
      }
    }
  }

  init = () => {
    const {timerType, stopwatchStartStatus} = this.props;
    let initialTimmer = 0;
    AsyncStorage.getItem(KeyUtils.RESET_TIMER).then((value) => {
      if (value === 'true') {
        // this.handleReset()
      }
    });

    AsyncStorage.getItem(KeyUtils.SAVED_SLEEP_TIMER).then((val) => {
      console.log('SAVED_SLEEP_TIMER',val)
      if (val == 'true') {
        this.setState({_timer: parseInt(0)});
      } else {
        AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE).then((value) => {
          initialTimmer = value;
          console.log(initialTimmer, 'initial timmer');
          if (value && value !== '') this.setState({_timer: parseInt(value)});
          this.formatTime();
        });
      }
    });

    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_SLEEP).then(async (value) => {
      if (value === 'true') {
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP).then(
          (startTime) => {
            if (startTime) {
              let difference = Date.now() - startTime;
              let secondsDifference = Math.floor(difference / 1000);
              console.log(secondsDifference, initialTimmer, difference, 'sid');
              if (secondsDifference > initialTimmer) {
                this.setState({_timer: secondsDifference}, () =>
                  AsyncStorage.setItem(
                    KeyUtils.SLEEP_TIMER_VALUE,
                    secondsDifference.toString(),
                  ),
                );
              }
            }
            this.handleStart();
          },
        );
      } else if (value === 'pause') {
        this.formatTime();
      }
    });
  };

  handleStart = () => {
    const {timerType, stopwatchStartStatus} = this.props;

    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'true')
    let updatedSleepObj = {stopwatchSelected: !stopwatchStartStatus};
    if (!stopwatchStartStatus) {
      this.setState({pausedState:false})
      this.props.onPaused? this.props.onPaused(false):null
      let getStartTime = moment();
      AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP).then((value) => {
        getStartTime = value
      });
      this.props.changeValue({
        ...updatedSleepObj,
        stopwatchSelectedTimer: this.currentTime,
        getStartTimeValue: getStartTime,
      });
      this.setState({isActive: true, isPaused: true})
      this._increment.current = setInterval(() => {
        this.setState(
          {
            _timer: this.state._timer + 1,
          },
          () => {
            AsyncStorage.setItem(
              KeyUtils.SLEEP_TIMER_VALUE,
              this.state._timer.toString(),
            );
            this.formatTime();
          },
        );
      }, 1000);
    } else {
      this.setState({pausedState:true})
      this.props.onPaused? this.props.onPaused(true):null
      let getEndTime = moment();
      this.props.changeValue({
        ...updatedSleepObj,
        stopwatchSelectedTimer: this.currentTime,
        getEndTimeValue: getEndTime,
      });
      this.handlePause()
    }
  }

  handlePause = () => {
    const {timerType} = this.props
    isTimerPaused = true
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'pause')
    AsyncStorage.setItem('get_pasued_time', Date.now().toString());
    clearInterval(this._increment.current)
    this.setState({isPaused: true})
  }

  handleReset = () => {
    this.setState({isActive: true, isPaused: true, _timer: 0})
    AsyncStorage.setItem(KeyUtils.SLEEP_TIMER_VALUE, '0')
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'false')
    AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_SLEEP, '')
    clearInterval(this._increment.current);

    AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'false');
    AsyncStorage.setItem(KeyUtils.PAUSE_SLEEP_TIMER, 'false');
  }

  formatTime = () => {
    const {_timer} = this.state
    const {timerType, stopwatchStartStatus, getHours, getMin, getSec} = this.props
    let getSeconds = '', minutes = '', getMinutes = '', getHrs = ''

    getSeconds = `0${_timer % 60}`.slice(-2)
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
  saveSleepTimerValue(value){
    this.setState({_timer:value})
    AsyncStorage.setItem(KeyUtils.SAVED_SLEEP_TIMER, 'false')
    AsyncStorage.setItem(KeyUtils.SLEEP_TIMER_VALUE,value.toString());
  }
  onChangeHrs(value) {
    const {_timer, hour, min, sec} = this.state
    if(this.props.isEditable){
      const isChange=value>0||min>0||sec>0
      this.props.onManualChange?this.props.onManualChange(isChange):null
      this.props.getHours(value)
    }
    this.handlePause()
    this.setState({hour: value},()=>{
      this.saveSleepTimerValue(this.getTotalDurationInSeconds())
    })
    if(value.length>1){
      this.minInput.focus()
    }
  }

  onChangeMin(value) {
    const {_timer, hour, min, sec} = this.state
    if(this.props.isEditable){
      const isChange=hour>0||value>0||sec>0
      this.props.onManualChange?this.props.onManualChange(isChange):null
      this.props.getMin(value<60?value:0)
    }
    this.handlePause()
    if (value < 60) {
      this.setState({min: value},()=>{
        this.saveSleepTimerValue(this.getTotalDurationInSeconds())
      })
    } else {
      this.setState({min: 0},()=>{
        this.saveSleepTimerValue(this.getTotalDurationInSeconds())
      })
      Toast(I18n.t('generic.minutes_error'));
    }
    if(value.length>1){
      this.secInput.focus()
    }
    if(value==''){
      this.hoursInput.focus()
    }
  }

  onChangeSec(value) {
    const {_timer, hour, min, sec} = this.state
    if(this.props.isEditable){
      const isChange=hour>0||min>0||value>0
      this.props.onManualChange?this.props.onManualChange(isChange):null
      this.props.getSec(value<60?value:0)
    }
    this.handlePause()
    if (value < 60) {
      this.setState({sec: value},()=>{
        this.saveSleepTimerValue(this.getTotalDurationInSeconds())
      })
    } else {
      this.setState({sec: 0},()=>{
        this.saveSleepTimerValue(this.getTotalDurationInSeconds())
      })
      Toast(I18n.t('generic.seconds_error'));
    }
    if(value==''){
      this.minInput.focus()
    }
  }

  setTimeValuesOnChange(){
    const { hour, min, sec } = this.state
    let hms = `${hour}:${min}:${sec}`;
    let a = hms.split(':');
    let seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    this.setState({
      _timer:seconds
    })
  }
  getTotalDurationInSeconds(){
    const { hour, min, sec } = this.state
    let hms = `${hour}:${min}:${sec}`;
    let a = hms.split(':');
    let seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    return seconds
  }
  startTimer() {
    const {timerType} = this.props
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'true')
    AsyncStorage.setItem(KeyUtils.SAVED_SLEEP_TIMER, 'false')
    if (this.state.pausedState)
    AsyncStorage.setItem(
        KeyUtils.START_TIMESTAMP_SLEEP,
        Date.now().toString(),
      );

    this.handleStart()
  }

  renderTimer() {
    const {icon, stopwatchStartStatus, onPressTimer} = this.props
    return (
      <TouchableOpacity onPress={() => {
        this.startTimer()
        if(typeof onPressTimer =='function'){
          onPressTimer(stopwatchStartStatus)
        }
      }
      }>
        <View
          style={[
            styles.StopwatchBtnStyle,
            stopwatchStartStatus
              ? {backgroundColor: Colors.rgb_ed0212}
              : {backgroundColor: Colors.rgb_d8d8d8},
          ]}>
          {icon ? (
            !stopwatchStartStatus ? (
              icon
            ) : (
              <Text maxFontSizeMultiplier={1.7}
                style={[
                  styles.StopwatchBtnText,
                  stopwatchStartStatus
                    ? {color: Colors.white}
                    : {color: Colors.rgb_3E3E3E},
                ]}>
                {I18n.t('sleep.pause').toUpperCase()}
              </Text>
            )
          ) : (
            icon
          )}
          {!icon && (
            <Text maxFontSizeMultiplier={1.7}
              style={[
                styles.StopwatchBtnText,
                stopwatchStartStatus
                  ? {color: Colors.white}
                  : {color: Colors.rgb_3E3E3E},
              ]}>
              {!stopwatchStartStatus
                ? I18n.t('sleep.start').toUpperCase()
                : I18n.t('sleep.pause').toUpperCase()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  renderEditableTimer() {
    const {hour, min, sec} = this.state;
    const {timerTypeStyle, timerType} = this.props;
    return (
      <View style={styles.StopwatchWrapper}>
        {this.renderTimer()}
        <View style={options.container}>
          {timerTypeStyle === 3 ? (
            <View
              style={[
                styles.timeBackground,
                {flexDirection: I18nManager.isRTL ?'row-reverse':'row', alignItems: 'center'},
              ]}>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={[styles.textInputRightStylesCustom]}
                value={hour}
                placeholder={'00 h'}
                onFocus={(index, value) => this.onFocusValue(this.hoursInput,hour)}
                placeholderTextColor={'black'}
                onChangeText={(index, value) => this.onChangeHrs(value)}
                inputRef={(input)=>{ this.hoursInput = input }}
                selectTextOnFocus={true}
                contextMenuHidden={true}
              />
              <Text maxFontSizeMultiplier={1.7} 
                accessible={true}
                accessibilityLabel={I18n.t("accessibility_labels.minutes_seperator")} 
                style={[styles.textInputStyles, {marginBottom: 5}]}>
                {':'}
              </Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={[styles.textInputStylesCustom,{marginRight:3,marginLeft:2}]}
                value={min}
                placeholder={'00 m'}
                onFocus={(index, value) => this.onFocusValue(this.minInput,min)}
                placeholderTextColor={'black'}
                onChangeText={(index, value) => this.onChangeMin(value)}
                inputRef={(input)=>{ this.minInput = input }}
                selectTextOnFocus={true}
                contextMenuHidden={true}
              />
              <Text maxFontSizeMultiplier={1.7} 
                accessible={true}
                accessibilityLabel={I18n.t("accessibility_labels.seconds_seperator")} 
                style={[styles.textInputStyles, {marginBottom: 5}]}>
                {':'}
              </Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={[styles.textInputLeftStylesCustom,{color:'black'}]}
                value={sec}
                placeholder={'00 s'}
                onFocus={(index, value) => this.onFocusValue(this.secInput,sec)}
                placeholderTextColor={'black'}
                onChangeText={(index, value) => this.onChangeSec(value)}
                inputRef={(input)=>{ this.secInput = input }}
                selectTextOnFocus={true}
                contextMenuHidden={true}
                
              />
            </View>
          ) : (
            <View
              style={[
                styles.timeBackground,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={[styles.textInputStylesCustom,{color:'black'}]}
                value={min}
                placeholder={'00 m'}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={'black'}
                onChangeText={(index, value) => this.onChangeMin(value)}
              />
              <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: 5,color:'black'}]}>
                {':'}
              </Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={[styles.textInputStylesCustom,{color:'black'}]}
                value={sec}
                placeholder={'00 s'}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={'black'}
                onChangeText={(index, value) => this.onChangeSec(value)}
              />
            </View>
          )}
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
        <Text maxFontSizeMultiplier={1.7} style={{color: Colors.rgb_000000, fontSize: 14, marginHorizontal: 10}}>
          {hour}:{min}:{sec}
        </Text>
      );
    } else {
      return (
        <Text maxFontSizeMultiplier={1.7} style={{color: Colors.rgb_000000, fontSize: 14, marginHorizontal: 10}}>
          {min}:{sec}
        </Text>
      );
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
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'pause');
    clearInterval(this._increment.current);
    this.setTimeValuesOnChange()
    this.setState({isPaused: true})
  }

  render() {
    const {
      timerTypeStyle,
      icon,
      getHours,
      getMin,
      getSec,
      stopwatchStartStatus,
      startTimer,
      isEditable,
      isFocusInput
    } = this.props

    const {hour, min, sec} = this.state
    getHours(hour)
    getMin(min)
    getSec(sec)
    return (
      <View>
        {isEditable && this.renderEditableTimer()}
        {!isEditable && this.renderTimerOnly()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  appState: state.app.appState,
})

export default connect(mapStateToProps, null,null,{forwardRef:'true'})(CustomSleepTimer)
