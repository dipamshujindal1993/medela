import React from 'react';
import {TouchableOpacity, Text, View, AppState} from 'react-native'
import styles, {options} from './Styles/CustomTimerStyles'
import {Colors} from '@resources';
import I18n from '@i18n';
import CustomTextInput from '@components/CustomTextInput';
import AsyncStorage from '@react-native-community/async-storage'
import KeyUtils from "@utils/KeyUtils";
import Toast from '@components/ToastMessage';
import moment from "moment";

export default class CustomTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sleep_timer: 0,
      left_timer: 0,
      right_timer: 0,
      isActive: false,
      isPaused: false,
      hour: 0,
      min: 0,
      sec: 0,
      appState: AppState.currentState
    };
    this.sleep_increment = React.createRef();
    this.left_increment = React.createRef();
    this.right_increment = React.createRef();


    this.sleep_active = 'false';
    this.left_active = 'false';
    this.right_active = 'false';

    this.sleep_start_time = '';
    this.left_start_time = '';
    this.right_start_time = '';

  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    const {timerType, stopwatchStartStatus, leftStopwatchStartStatus, rightStopwatchStartStatus} = this.props

    AsyncStorage.getItem(KeyUtils.RESET_TIMER).then(value => {
      if (value == 'true') {
        this.handleReset()
      }
    });


    if (timerType === KeyUtils.SLEEP && !stopwatchStartStatus) {
      this.setState({sleep_timer: 0})
      // if (this.sleep_active == 'true') {
      //   let difference = Date.now() - this.sleep_start_time;
      //   let secondsDifference = Math.floor(difference / 1000);
      //   this.setState({sleep_timer: secondsDifference})
      //   this.handleStart()
      // }
      AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_SLEEP).then(value => {
        if (value == 'true') {
          AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP).then(startTime => {
            let difference = Date.now() - startTime;
            let secondsDifference = Math.floor(difference / 1000);
            this.setState({sleep_timer: secondsDifference})
            this.handleStart()
          });
        }
      });
    }

    if (timerType === KeyUtils.BFnP_LEFT && !leftStopwatchStartStatus) {
      this.setState({left_timer: 0})
      // if (this.left_active == 'true') {
      //   let difference = Date.now() - this.left_start_time;
      //   let secondsDifference = Math.floor(difference / 1000);
      //   this.setState({left_timer: secondsDifference})
      //   this.handleStart()
      // } else {
      //   this.startTimerLeft()
      // }
      AsyncStorage.getItem(KeyUtils.IS_LEFT_TIMER_STARTED).then(value => {
        if (value == 'true') {
          AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT).then(value => {
            if (value == 'true') {
              AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT).then(startTime => {
                let difference = Date.now() - startTime;
                let secondsDifference = Math.floor(difference / 1000);
                this.setState({left_timer: secondsDifference})
                this.handleStart()
              });
            }
          });
        } else {
          this.startTimerLeft()
        }
      });
    }


    if (timerType === KeyUtils.BFnP_RIGHT && !rightStopwatchStartStatus) {
      this.setState({right_timer: 0})
      // if (this.right_active == 'true') {
      //   let difference = Date.now() - this.right_start_time;
      //   let secondsDifference = Math.floor(difference / 1000);
      //   this.setState({right_timer: secondsDifference})
      //   this.handleStart()
      // } else {
      //   this.startTimerRight()
      // }
      AsyncStorage.getItem(KeyUtils.IS_RIGHT_TIMER_STARTED).then(value => {
        if (value == 'true') {
          AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT).then(value => {
            if (value == 'true') {
              AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT).then(startTime => {
                let difference = Date.now() - startTime;
                let secondsDifference = Math.floor(difference / 1000);
                this.setState({right_timer: secondsDifference})
                this.handleStart()
              });
            }
          });
        } else {
          this.startTimerRight()
        }
      });
    }

  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
    } else {
      this.setState({isActive: true, isPaused: true, sleep_timer: 0, left_timer: 0, right_timer: 0})
      this.handlePause()
    }
    this.setState({appState: nextAppState});
  };


  handleStart = () => {

    const {timerType, stopwatchStartStatus, leftStopwatchStartStatus, rightStopwatchStartStatus} = this.props

    if( timerType === KeyUtils.SLEEP) {
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'true')
      let updatedSleepObj = {stopwatchSelected: !stopwatchStartStatus};
      if (!stopwatchStartStatus) {
        let getStartTime = moment();
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP).then(value => {
          getStartTime = value
        });
        this.props.changeValue({
          ...updatedSleepObj,
          stopwatchSelectedTimer: this.currentTime,
          getStartTimeValue: getStartTime,
        });
        this.setState({isActive: true, isPaused: true})
        this.sleep_increment.current = setInterval(() => {
          this.setState({
            sleep_timer: this.state.sleep_timer + 1
          }, () => {
            this.formatTime()
          })
        }, 1000)
      } else {
        let getEndTime = moment();
        this.props.changeValue({
          ...updatedSleepObj,
          stopwatchSelectedTimer: this.currentTime,
          getEndTimeValue: getEndTime,
        });
        this.handlePause()
      }
    }
    if( timerType === KeyUtils.BFnP_LEFT) {
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
      AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'true')
      let updatedLeftObj = {stopwatchSelected: !leftStopwatchStartStatus};
      if (!leftStopwatchStartStatus) {
        let getStartTime = moment();
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT).then(value => {
          getStartTime = value
        });
        this.props.changeValue({
          ...updatedLeftObj,
          stopwatchSelectedTimer: this.currentTime,
          getStartTimeValue: getStartTime,
        });
        this.setState({isActive: true, isPaused: true})
        this.left_increment.current = setInterval(() => {
          this.setState({
            left_timer: this.state.left_timer + 1
          }, () => {
            this.formatTime()
          })
        }, 1000)
      } else {
        AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
        AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'false')
        let getEndTime = moment();
        this.props.changeValue({
          ...updatedLeftObj,
          stopwatchSelectedTimer: this.currentTime,
          getEndTimeValue: getEndTime,
        });
        this.handlePause()
      }
    }
    if( timerType === KeyUtils.BFnP_RIGHT) {
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
      AsyncStorage.setItem(KeyUtils.IS_RIGHT_TIMER_STARTED, 'true')
      let updatedRightObj = {stopwatchSelected: !rightStopwatchStartStatus};
      if (!rightStopwatchStartStatus) {
        let getStartTime = moment();
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT).then(value => {
          getStartTime = value
        });

        this.props.changeValue({
          ...updatedRightObj,
          stopwatchSelectedTimer: this.currentTime,
          getStartTimeValue: getStartTime,
        });
        this.setState({isActive: true, isPaused: true})
        this.right_increment.current = setInterval(() => {
          this.setState({
            right_timer: this.state.right_timer + 1
          }, () => {
            this.formatTime()
          })
        }, 1000)
      } else {
        AsyncStorage.setItem(KeyUtils.IS_RIGHT_TIMER_STARTED, 'false')
        AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
        let getEndTime = moment();
        this.props.changeValue({
          ...updatedRightObj,
          stopwatchSelectedTimer: this.currentTime,
          getEndTimeValue: getEndTime,
        });
        this.handlePause()
      }
    }
  }

  handlePause = () => {
    const {timerType} = this.props
    if (timerType === KeyUtils.SLEEP) {
      // AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'false')
      clearInterval(this.sleep_increment.current);
      this.setState({isPaused: true})
    }
    if (timerType === KeyUtils.BFnP_LEFT) {
      // AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
      clearInterval(this.left_increment.current);
      this.setState({isPaused: true})
    }
    if (timerType === KeyUtils.BFnP_RIGHT) {
      // AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
      clearInterval(this.right_increment.current);
      this.setState({isPaused: true})
    }


  }

  handleReset = () => {
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'false')
    clearInterval(this.sleep_increment.current);
    this.setState({isActive: true, isPaused: true, sleep_timer: 0, left_timer: 0, right_timer: 0})

    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
    clearInterval(this.left_increment.current);

    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
    clearInterval(this.right_increment.current);

    AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'false');
  }

  formatTime = () => {
    const {sleep_timer, left_timer, right_timer} = this.state
    const {timerType, stopwatchStartStatus, getHours, getMin, getSec} = this.props
    let getSeconds = '', minutes = '', getMinutes = '', getHrs = ''

    switch (timerType) {
      case KeyUtils.SLEEP:
        getSeconds = `0${(sleep_timer % 60)}`.slice(-2)
        minutes = `${Math.floor(sleep_timer / 60)}`
        getMinutes = `0${minutes % 60}`.slice(-2)
        getHrs = `0${Math.floor(sleep_timer / 3600)}`.slice(-2)

        // getTotalTime(sleep_timer)

        this.setState({
          hour: getHrs,
          min: getMinutes,
          sec: getSeconds
        }, () => {
          getHours(getHrs)
          getMin(getMinutes)
          getSec(getSeconds)
        })
        break
      case KeyUtils.BFnP_LEFT:
        getSeconds = `0${(left_timer % 60)}`.slice(-2)
        minutes = `${Math.floor(left_timer / 60)}`
        getMinutes = `0${minutes % 60}`.slice(-2)
        getHrs = `0${Math.floor(left_timer / 3600)}`.slice(-2)

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
        break
      case KeyUtils.BFnP_RIGHT:
        getSeconds = `0${(right_timer % 60)}`.slice(-2)
        minutes = `${Math.floor(right_timer / 60)}`
        getMinutes = `0${minutes % 60}`.slice(-2)
        getHrs = `0${Math.floor(right_timer / 3600)}`.slice(-2)

        // getTotalTime(right_timer)

        this.setState({
          hour: getHrs,
          min: getMinutes,
          sec: getSeconds
        }, () => {
          getHours(getHrs)
          getMin(getMinutes)
          getSec(getSeconds)
        })
        break
    }
  }


  onChangeHrs(value) {
    this.handlePause()
    this.setState({hour: value})
  }

  onChangeMin(value) {
    this.handlePause()
    if (value < 60) {
      this.setState({min: value})
    } else {
      this.setState({min: 0})
      Toast(I18n.t('generic.minutes_error'));
    }
  }

  onChangeSec(value) {
    this.handlePause()
    if (value < 60) {
      this.setState({sec: value})
    } else {
      this.setState({sec: 0})
      Toast(I18n.t('generic.seconds_error'));
    }
  }

  startTimer() {
    const {timerType} = this.props
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
    AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT, Date.now().toString())
    this.handleStart()
  }

  renderSleepTimer() {
    const {icon, stopwatchStartStatus} = this.props
    return (
      <TouchableOpacity onPress={() => this.startTimer()}>
        <View
          style={[
            styles.StopwatchBtnStyle,
            stopwatchStartStatus
              ? {backgroundColor: Colors.rgb_fd0807}
              : {backgroundColor: Colors.rgb_d8d8d8},
          ]}>
          {icon ? !stopwatchStartStatus ? icon : <Text maxFontSizeMultiplier={1.7} 
            style={[
            styles.StopwatchBtnText,
            stopwatchStartStatus
              ? {color: Colors.white}
              : {color: Colors.rgb_3E3E3E},
          ]}>{I18n.t('sleep.stop').toUpperCase()}</Text> : icon}
          {!icon && <Text maxFontSizeMultiplier={1.7}
            style={[
              styles.StopwatchBtnText,
              stopwatchStartStatus
                ? {color: Colors.white}
                : {color: Colors.rgb_3E3E3E},
            ]}>
            {!stopwatchStartStatus
              ? I18n.t('sleep.start').toUpperCase()
              : I18n.t('sleep.stop').toUpperCase()}
          </Text>}
        </View>
      </TouchableOpacity>
    )
  }

  renderLeftTimer() {
    const {icon, leftStopwatchStartStatus} = this.props
    return (
      <TouchableOpacity onPress={() => this.startTimer()}>
        <View
          style={[
            styles.StopwatchBtnStyle,
            leftStopwatchStartStatus
              ? {backgroundColor: Colors.rgb_fd0807}
              : {backgroundColor: Colors.rgb_d8d8d8},
          ]}>
          {icon ? !leftStopwatchStartStatus ? icon : <Text maxFontSizeMultiplier={1.7}  style={[
            styles.StopwatchBtnText,
            leftStopwatchStartStatus
              ? {color: Colors.white}
              : {color: Colors.rgb_3E3E3E},
          ]}>{I18n.t('sleep.stop').toUpperCase()}</Text> : icon}
          {!icon && <Text maxFontSizeMultiplier={1.7}
            style={[
              styles.StopwatchBtnText,
              leftStopwatchStartStatus
                ? {color: Colors.white}
                : {color: Colors.rgb_3E3E3E},
            ]}>
            {!leftStopwatchStartStatus
              ? I18n.t('sleep.start').toUpperCase()
              : I18n.t('sleep.stop').toUpperCase()}
          </Text>}
        </View>
      </TouchableOpacity>
    )
  }

  renderRightTimer() {
    const {icon, rightStopwatchStartStatus} = this.props
    return (
      <TouchableOpacity onPress={() => this.startTimer()}>
        <View
          style={[
            styles.StopwatchBtnStyle,
            rightStopwatchStartStatus
              ? {backgroundColor: Colors.rgb_fd0807}
              : {backgroundColor: Colors.rgb_d8d8d8},
          ]}>
          {icon ? !rightStopwatchStartStatus ? icon : <Text maxFontSizeMultiplier={1.7}  style={[
            styles.StopwatchBtnText,
            rightStopwatchStartStatus
              ? {color: Colors.white}
              : {color: Colors.rgb_3E3E3E},
          ]}>{I18n.t('sleep.stop').toUpperCase()}</Text> : icon}
          {!icon && <Text maxFontSizeMultiplier={1.7}
            style={[
              styles.StopwatchBtnText,
              rightStopwatchStartStatus
                ? {color: Colors.white}
                : {color: Colors.rgb_3E3E3E},
            ]}>
            {!rightStopwatchStartStatus
              ? I18n.t('sleep.start').toUpperCase()
              : I18n.t('sleep.stop').toUpperCase()}
          </Text>}
        </View>
      </TouchableOpacity>
    )
  }


  renderEditableTimer() {
    const {hour, min, sec} = this.state
    const {timerTypeStyle, timerType} = this.props
    return (
      <View style={styles.StopwatchWrapper}>
        {timerType === KeyUtils.SLEEP && this.renderSleepTimer()}
        {timerType === KeyUtils.BFnP_LEFT && this.renderLeftTimer()}
        {timerType === KeyUtils.BFnP_RIGHT && this.renderRightTimer()}
        <View style={options.container}>
          {timerTypeStyle === 3 ? <View style={[styles.timeBackground, {flexDirection: 'row', alignItems: 'center'}]}>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={styles.textInputStyles}
                value={hour}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={Colors.rgb_898d8d}
                onChangeText={(index, value) => this.onChangeHrs(value)}
              />
              <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: 5}]}>{":"}</Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={styles.textInputStyles}
                value={min}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={Colors.rgb_898d8d}
                onChangeText={(index, value) => this.onChangeMin(value)}
              />
              <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: 5}]}>{":"}</Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={styles.textInputStyles}
                value={sec}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={Colors.rgb_898d8d}
                onChangeText={(index, value) => this.onChangeSec(value)}
              />
            </View> :

            <View style={[styles.timeBackground, {flexDirection: 'row', alignItems: 'center'}]}>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={styles.textInputStyles}
                value={min}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={Colors.rgb_898d8d}
                onChangeText={(index, value) => this.onChangeMin(value)}
              />
              <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: 5}]}>{":"}</Text>
              <CustomTextInput
                maxLength={2}
                keyboardType={'numeric'}
                textStyles={styles.textInputStyles}
                value={sec}
                placeholder={'00'}
                onFocus={(index, value) => this.onFocusValue()}
                placeholderTextColor={Colors.rgb_898d8d}
                onChangeText={(index, value) => this.onChangeSec(value)}
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
        <Text maxFontSizeMultiplier={1.7} style={{color: 'gray', fontSize: 14, marginHorizontal: 10}}>{hour}:{min}:{sec}</Text>
      )
    } else {
      return (
        <Text maxFontSizeMultiplier={1.7} style={{color: 'gray', fontSize: 14, marginHorizontal: 10}}>{min}:{sec}</Text>
      )
    }
  }

  onFocusValue() {
    this.handlePause()
    this.props.isFocusInput(true)
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




