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
export default class CustomTimerOnly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _timer: 0,
      isActive: false,
      isPaused: false,
      hour: '00',
      min: '00',
      sec: '00',
      appState: AppState.currentState
    };
    this.isAppStateChanged=false
    this._increment = React.createRef();
  }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
     const {appState}=this.props
    if (prevProps.appState!==appState && appState=='active'){
      if (!this.isAppStateChanged){
        this.isAppStateChanged=true
      AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_DURATION).then(value => {
        if (value === 'true') {
          AsyncStorage.getItem(KeyUtils.DURATION_TIMER_VALUE).then(startTime => {
            AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP).then(backgroundTime => {
              let st = parseInt(backgroundTime);
              let difference = Date.now() - st;
              let secondsDifference = Math.floor(difference / 1000);
              let backgroundtime = parseInt(secondsDifference);
              let dd = +startTime + +backgroundtime
              AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE, (dd).toString())
              this.setState({ _timer: parseInt(dd) })
            })
          })
        }
      })
      AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_FREQUENCY).then(value => {
        if (value === 'true') {
          AsyncStorage.getItem(KeyUtils.FREQUENCY_TIMER_VALUE).then(startTime => {
            AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP).then(backgroundTime => {
              let st = parseInt(backgroundTime);
              let difference = Date.now() - st;
              let secondsDifference = Math.floor(difference / 1000);
              let backgroundtime = parseInt(secondsDifference);
              let dd = +startTime + +backgroundtime
              AsyncStorage.setItem(KeyUtils.FREQUENCY_TIMER_VALUE, (dd).toString())
              this.setState({ _timer: parseInt(dd) })
            })
          })
        }
      })
      }
    }
    if (prevProps.appState!==appState && appState=='background'){
        this.isAppStateChanged=false
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
        this.handleTimerFromParent("start",this.props.secondsDifference)
      }
    }

  }
  handleTimerFromParent = (value, seconds) => {

    if (value === 'start') {
      let dd = parseInt(seconds)
      this.setState({_timer: dd}, () => {
        this.handleStart();
      });
    }
    if (value === 'stop') {
      let dd = parseInt(seconds)
      this.setState({_timer: dd}, () => {
        this.handlePause();
      });
    }
    if (value === 'reset') {
        this.handleReset();
    }
    if (value === 'pause') {
      let dd = parseInt(seconds)
      this.setState({_timer: dd},()=>{
        this.formatTime()
      })
    }

  }

  handleReset=()=>{
    this.setState({ _timer: 0},()=> this.formatTime())
    clearInterval(this._increment.current);

  }

  handleStart = () => {

    const {timerType, stopwatchStartStatus, getTimeValues} = this.props

    let updatedSleepObj = {stopwatchSelected: !stopwatchStartStatus};
    if (!stopwatchStartStatus) {

      this.setState({isActive: true, isPaused: true})
      if(this.props.initStart&&this._increment.current){ return;}
      this._increment.current = setInterval(() => {
        this.setState({
          _timer: this.state._timer + 1
        }, () => {
          getTimeValues(this.state._timer)
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

  handlePause = () => {
    const {timerType} = this.props
    isTimerPaused = true
    clearInterval(this._increment.current);
    this.setState({isPaused: true})
  }

  formatTime = () => {
    const {_timer} = this.state
    let getSeconds = '', minutes = '', getMinutes = '', getHrs = ''
    const {timerType, stopwatchStartStatus, getTimeValues} = this.props
    getTimeValues(_timer)
    getSeconds = `0${(_timer % 60)}`.slice(-2)
    minutes = `${Math.floor(_timer / 60)}`
    getMinutes = `0${minutes % 60}`.slice(-2)
    getHrs = `0${Math.floor(_timer / 3600)}`.slice(-2)
    // getTotalTime(left_timer)

   // console.log('_timer-',_timer)
    this.setState({
      hour: getHrs.toString(),
      min: getMinutes.toString(),
      sec: getSeconds.toString()
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
    const {hour, min, sec} = this.state;
    if (timerTypeStyle === 3||timerTypeStyle ===2) {
      return (
        <Text maxFontSizeMultiplier={1.7} style={[styles.timerTextStyle,{color:this.props.textColor ?this.props.textColor:'black'}]}>{hour}:{min}:{sec}</Text>
      )
    } else {
      return (
        <Text maxFontSizeMultiplier={1.7} style={[styles.timerTextStyle,{color:'black'}]}>{minutes}:{seconds}</Text>
      )
    }
  }

  render() {
    const {rendrer}=this.props
    return (
      <View>
        {!rendrer?this.renderTimerOnly():rendrer}
      </View>
    );
  }
}



