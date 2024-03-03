import React from 'react';
import {TouchableOpacity, Text, View, AppState} from 'react-native'
import styles, {options} from './Styles/CustomTimerOnlyStyles'
import {Colors} from '@resources';
import I18n from '@i18n';
import AsyncStorage from '@react-native-community/async-storage'
import KeyUtils from "@utils/KeyUtils";
import Toast from '@components/ToastMessage';
import moment from "moment";

let isTimerPaused = false
export default class CustomLeftTimerOnly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _timer: 0,
      isActive: false,
      isPaused: false,
      hour: 0,
      min: 0,
      sec: 0,
      appState: AppState.currentState
    };

    console.log('constructor call--')
    this._increment = React.createRef();
  }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {appState}=this.props
    if (prevProps.appState!==appState && appState=='background'){
      clearInterval(this._increment.current);
    }
  }

  componentWillUnmount() {
    clearInterval(this._increment.current);
  }

  init = () => {
    const {secondsDifference, timerStatus} = this.props
    if(this.props.initStart){
      if(!this._increment.current){
        this.handleLeftTimerFromParent("start",this.props.secondsDifference)
      }
    }


  }
  handleLeftTimerFromParent = (value, seconds) => {

    console.log('handleLeftTimerFromParent---',value,'--seconds--',seconds)

    if (value === 'start') {
      let dd = parseInt(seconds)
      this.setState({_timer: dd}, () => {
        this.handleStart();
      });
    }
    if (value === 'stop') {
      let dd = parseInt(seconds)
      console.log('Before set STate dd---',dd)
      this.setState({_timer: dd}, () => {
        console.log('After SetState ---',this.state._timer)
        this.formatTime();
      });


    }
  }


  handleStart = () => {

    const {timerType, stopwatchStartStatus, getTimeValues} = this.props

    let updatedSleepObj = {stopwatchSelected: !stopwatchStartStatus};
    console.log('handleSTart Calll---')
    if (!stopwatchStartStatus) {
      console.log('handleSTart Calll----If-')
      if(this.props.initStart&&this._increment.current){ return;}
      this.setState({isActive: true, isPaused: true})
      this._increment.current = setInterval(() => {
        this.setState({
          _timer: this.state._timer + 1
        }, () => {
      //    console.log('_timer Update---',this.state._timer)
          getTimeValues(this.state._timer)
          this.formatTime()
        })
      }, 1000)
    } else {
      console.log('handleSTart Calll----else----')
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
    clearInterval(this._increment.current);
    console.log('handlePause---',isTimerPaused)
    this.setState({isPaused: true})
  }

  formatTime = () => {
    const {_timer} = this.state
    const {timerType, stopwatchStartStatus, getTimeValues} = this.props
    getTimeValues(_timer)
    let getSeconds = '', minutes = '', getMinutes = '', getHrs = ''

    getSeconds = `0${(_timer % 60)}`.slice(-2)
    minutes = `${Math.floor(_timer / 60)}`
    getMinutes = `0${minutes % 60}`.slice(-2)
    getHrs = `0${Math.floor(_timer / 3600)}`.slice(-2)
    // getTotalTime(left_timer)
    this.setState({
      hour: getHrs,
      min: getMinutes,
      sec: getSeconds
    })
  }

  startTimer() {
    const {timerType} = this.props
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'true')
    if (!isTimerPaused)
      AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_SLEEP, Date.now().toString())

    this.handleStart()
  }

  renderTimerOnly() {
    const {
      seconds,
      minutes,
      timerTypeStyle
    } = this.props
    const {hour, min, sec} = this.state

    if (timerTypeStyle === 3||timerTypeStyle===2) {
      return (
        <Text maxFontSizeMultiplier={1.7} style={[styles.timerTextStyle,{color:Colors.rgb_000000}]}>{hour}:{min}:{sec}</Text>
      )
    } else {
      return (
        <Text maxFontSizeMultiplier={1.7} style={[styles.timerTextStyle,{color:Colors.rgb_000000}]}>{minutes}:{seconds}</Text>
      )
    }
  }

  render() {
    return (
      <View>
        {this.renderTimerOnly()}
      </View>
    );
  }
}
