import React, {useRef, useState, useEffect} from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  AppState, Platform
} from 'react-native'
import {Colors} from '@resources'
import BreastFeedingIcon from '@svg/ic_breastfeeding.svg'
import PumpingIcon from '@svg/ic_avatar_pumping.svg'
import Contraction from '@svg/ic_contraction.svg';
import Sleep from '@svg/ic_sleep.svg';
import ActivePumpingIcon from '@svg/ic_stats_pump';
import styles from './Styles/BottomBannerStyles'
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import CustomSleepTimer from '@components/CustomSleepTimer';
import CustomTimerOnly from '@components/CustomTimerOnly';
import CustomLeftTimerOnly from "./CustomLeftTimerOnly";
import I18n from '@i18n';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Dimensions } from 'react-native';
import {connect} from "react-redux";
import Bluetooth from '@svg/ic_bluetooth_stats.svg';
import GetterSetter from "./GetterSetter";
import AppActions from '@redux/AppRedux';
import { withNavigation } from 'react-navigation';
import HomeActions from '@redux/HomeRedux';
let isSleep = false, isBFLeft = false, isBFRight = false, isContractions = false,isPumping=false
let _this;
class BottomBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timerValueLeft: 0,
      timerValueRight: 0,
      timerValuePumping: 0,
      durationTime: 0,
      leftStopwatchStart: false,
      rightStopwatchStart: false,
      showLeftTimer: false,
      showRightTimer: false,
      showDurationTimer: false,
      isMountInit:false,
      timer:'0',
      itemsArr:[
        {
          type: 'sleep',
          name: 'Sleep',
          is_active: isSleep,
          min: 0,
          sec: 0,
        },
        {
          type: 'bf_left',
          name: I18n.t('breastfeeding_pump.breastfeeding_pumping_l'),
          is_active: isBFLeft,
          min: 0,
          sec: 0,
        },
        {
          type: 'bf_right',
          name: I18n.t('breastfeeding_pump.breastfeeding_pumping_r'),
          is_active: isBFRight,
          min: 0,
          sec: 0,
        },
        {
          type: 'contractions',
          name: 'Contractions',
          is_active: isContractions,
          min: 0,
          sec: 0,
        },
        {
          type: 'pumping',
          name: I18n.t('stats_pumping.pumping_title'),
          is_active: isPumping,
        },
        {
          type: KeyUtils.BOTH_TIMER_ACTIVE,
          name: I18n.t('stats_pumping.pumping_title'),
          is_active: false,
          min: 0,
          sec: 0,
        }
      ],
      isDeviceConnected:false
    };
    this.bottombannerFlat=React.createRef()
    this.leftTimerRef = React.createRef();
    this.rightTimerRef = React.createRef();
    this.durationRef = React.createRef();
    this.pumpingRef = React.createRef();
    //this.startLeftTimer = this.startLeftTimer.bind(this)
    this.startRightTimer = this.startRightTimer.bind(this)
    this.startDuration = this.startDuration.bind(this)
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected 
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)

    this.items = [
      {
        is_active: true,
      },
      {
        type: 'sleep',
        name: 'Sleep',
        is_active: isSleep,
      },
      {
        type: 'bf_left',
        name: 'Breastfeeding & Pumping L',
        is_active: isBFLeft,
      },
      {
        type: 'bf_right',
        name: 'Breastfeeding & Pumping R',
        is_active: isBFRight,
      },
      {
        type: 'contractions',
        name: 'Contractions',
        is_active: isContractions,
      } , {
        type: 'pumping',
        name: I18n.t('stats_pumping.pumping_title'),
        is_active: isPumping,
      },
      {
        type: KeyUtils.BOTH_TIMER_ACTIVE,
        name: I18n.t('stats_pumping.title'),
        is_active: false,
        min: 0,
        sec: 0,
      },
    ];

    _this = this;
  }

  componentDidMount() {
    if(!this.state.isMountInit){
      this.init()
    }
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
    if(this.state.isMountInit){
      this.init()
    }

    })
    this.setState({isMountInit:true})

    AsyncStorage.getItem(KeyUtils.BOTH_TIMER_ACTIVE).then(value => {
      if (value === 'true') {
        const {itemsArr} = this.state;
        itemsArr[5].is_active = true;
        this.setState({itemsArr})
      }
      else{
        const {itemsArr} = this.state;
        itemsArr[5].is_active = false;
        this.setState({itemsArr})
      }
    });
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {
      sonataData,
      flexData,
      pumpRunning,
      isConnected
    } = this.props
    if(GetterSetter.getPumpName()==='sonata' && pumpRunning)
    {
      if (sonataData && sonataData != prevProps.sonataData && pumpRunning) {
         this.setState({
          timer: sonataData.timer,
        })
      }
    }
    if(GetterSetter.getPumpName()==='flex' && pumpRunning) {
      if (flexData && flexData != prevProps.flexData && pumpRunning) {
        this.setState({
          timer: flexData.timer,
        })

      }
    }
    if(GetterSetter.getPumpName()==='maxi' && pumpRunning) {
      if (flexData && flexData != prevProps.flexData && pumpRunning) {
        this.setState({
          timer: flexData.timer,
        })

      }
    }

    if (pumpRunning !== prevProps.pumpRunning) {
      const {itemsArr} = this.state;
      itemsArr[5].is_active = pumpRunning;
      this.setState({itemsArr})
    }

    if (isConnected !== prevProps.isConnected) {
      if(isConnected) {

        const {itemsArr} = this.state;
        // itemsArr[1].is_active = false;
        // itemsArr[2].is_active = false;
        itemsArr[4].is_active = false;
        this.setState({itemsArr, isDeviceConnected:isConnected})
      }
    }
  }

  _handleAppStateChange = nextAppState => {
    const { checkAppState} = this.props;
    if (nextAppState == 'background') {
      checkAppState(nextAppState);
    } else if (nextAppState == 'active') {
      setTimeout(() => { this.leftTimerData(true) }, 100)
      setTimeout(() => { this.rightTimerData(true) }, 100)
      setTimeout(() => { this.pumpingTimerData(true) }, 100)
      setTimeout(() => { this.sleepTimerData() }, 100)
      setTimeout(() => { this.contractionTimerData() }, 100)

      checkAppState(nextAppState);
      }
  };
  componentWillUnmount() {
    this.focusListener && this.focusListener.remove()
    // AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_DURATION, Date.now().toString())
    // AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, Date.now().toString())
    // AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT, Date.now().toString())
  }
  getLeftTimerValue = (value) =>{
    AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, value.toString())
    AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, Date.now().toString())
    this.setState({timerValueLeft:parseInt(value)})
  }
  getRightTimerValue = (value) =>{
    AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, value.toString())
    AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT, Date.now().toString())
    this.setState({timerValueRight:parseInt(value)})
  }
  getPumpingTimerValue = (value) =>{
    AsyncStorage.setItem(KeyUtils.PUMPING_TIMER_VALUE, value.toString())
    AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_P, Date.now().toString())
    this.setState({timerValuePumping:parseInt(value)})
  }
  getDurationTimerValue = (value) =>{
    AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE, value.toString())
    this.setState({durationTime:parseInt(value)})
  }

  leftTimerData(isfrombackground) {
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT).then((value) => {
      if (value === 'true') {
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT).then((startTime) => {
            let st = parseInt(startTime);
            let dd = 0;
            if (!isNaN(st)) {
              let difference = Date.now() - st;
              let secondsDifference = Math.floor(difference / 1000);
              dd = isNaN(parseInt(secondsDifference)) ? 0 : parseInt(secondsDifference)
            }
            AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(async(prevTimerCount) => {
                if (prevTimerCount != null) {
                  let remainingSeconds = parseInt(prevTimerCount)
                  let totalCount = remainingSeconds + dd
                  this.items[1].is_active = true
                  const {itemsArr}=this.state
                  itemsArr[1].is_active=true
                  if(isfrombackground){
                  let startTime = await AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP)
                  let st = parseInt(startTime);
                  let difference = Date.now() - st;
                  let secondsDifference = Math.floor(difference / 1000);
                  let dd = isNaN(parseInt(secondsDifference)) ? 0 : parseInt(secondsDifference)
                  totalCount=totalCount+dd
                }
                this.setState({
                    itemsArr,
                    leftStopwatchStart: true,
                    showLeftTimer: true,
                    timerValueLeft: totalCount
                  }, () => AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, totalCount.toString()))
                  this.startLeftTimer('start', parseInt(totalCount))
                } else {
                  let totalCount = dd
                  this.items[1].is_active = true
                  const {itemsArr}=this.state
                  itemsArr[1].is_active=true
                  this.setState({
                    itemsArr,
                    leftStopwatchStart: true,
                    showLeftTimer: true,
                    timerValueLeft: totalCount
                  }, () => AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, totalCount.toString()))
                  this.startLeftTimer('start', parseInt(totalCount))
                }
              });
            });
      } else if (value == 'pause') {
        AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then((prevTimerCount) => {
            let remainingSeconds = parseInt(prevTimerCount)
            this.items[1].is_active = false
            const {itemsArr}=this.state
            itemsArr[1].is_active=false
            this.setState({
              itemsArr,
              showLeftTimer: false,
              leftStopwatchStart: false,
              timerValueLeft: remainingSeconds,
            });
            this.startLeftTimer('stop', parseInt(remainingSeconds));
          },
        );
      } else {
        this.items[1].is_active = false
        const {itemsArr}=this.state
        itemsArr[1].is_active=false
        this.setState({leftStopwatchStart: true, timerValueLeft: 0, itemsArr});
      }
    });
  }

  rightTimerData(isfrombackground) {
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT).then((value) => {
      if (value === 'true') {
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_BFnP_RIGHT).then((startTime) => {
            let st = parseInt(startTime)
            let difference = Date.now() - st;
            let secondsDifference = Math.floor(difference / 1000);
            let dd = isNaN(parseInt(secondsDifference)) ? 0 : parseInt(secondsDifference)
            AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(async(prevTimerCount) => {
              if (prevTimerCount != null) {
                  let remainingSeconds = parseInt(prevTimerCount)
                  let totalCount = remainingSeconds + dd
                  this.items[2].is_active = true
                  const {itemsArr}=this.state
                  itemsArr[2].is_active=true
                  if(isfrombackground){
                    let startTime = await AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP)
                    let st = parseInt(startTime);
                    let difference = Date.now() - st;
                    let secondsDifference = Math.floor(difference / 1000);
                    let dd = isNaN(parseInt(secondsDifference)) ? 0 : parseInt(secondsDifference)
                    totalCount= totalCount+dd
                  }
                  this.setState({
                      itemsArr,
                      rightStopwatchStart: true,
                      showRightTimer: true,
                      timerValueRight: totalCount
                    }, () => AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, totalCount.toString()))
                    this.startRightTimer('start', parseInt(totalCount))
                } else {
                  let totalCount = dd
                  this.items[2].is_active = true
                  const {itemsArr}=this.state
                  itemsArr[2].is_active=true
                  this.setState(
                    {
                      itemsArr,
                      rightStopwatchStart: true,
                      showRightTimer: true,
                      timerValueRight: totalCount
                    }, () => AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, totalCount.toString()))
                    this.startRightTimer('start', parseInt(totalCount))
                  }
                });
              });
      } else if (value == 'pause') {
        AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(prevTimerCount => {
          let remainingSeconds = parseInt(prevTimerCount)
          this.items[2].is_active = false
          const {itemsArr}=this.state
          itemsArr[2].is_active=false
          this.setState({
            itemsArr,
            timerValueRight: remainingSeconds,
            rightStopwatchStart: false,
            showRightTimer: false,
          })
          this.startRightTimer('stop', parseInt(remainingSeconds))
        });
      } else {
        const {itemsArr}=this.state
        itemsArr[2].is_active=false
        this.items[2].is_active = false
        this.setState({rightStopwatchStart: true, timerValueRight: 0,itemsArr})
      }
    });
  }

  pumpingTimerData(isfrombackground) {
    AsyncStorage.getItem(KeyUtils.IS_P_TIMER_STARTED).then((value) => {
      if (value === 'true') {
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_P).then((startTime) => {
          let st = parseInt(startTime)
          let difference = Date.now() - st;
          let secondsDifference = Math.floor(difference / 1000);
          let dd = isNaN(parseInt(secondsDifference)) ? 0 : parseInt(secondsDifference)
          AsyncStorage.getItem(KeyUtils.PUMPING_TIMER_VALUE).then(async(prevTimerCount) => {
            if (prevTimerCount != null) {
              this.props.setLeftTimerActive(true)
              let remainingSeconds = parseInt(prevTimerCount)
              let totalCount = remainingSeconds
              this.items[4].is_active = true
              const {itemsArr}=this.state
              itemsArr[4].is_active=true
              if(isfrombackground){
                let startTime = await AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP)
                let st = parseInt(startTime);
                let difference = Date.now() - st;
                let secondsDifference = Math.floor(difference / 1000);
                let dd = isNaN(parseInt(secondsDifference)) ? 0 : parseInt(secondsDifference)
                totalCount= totalCount+dd
              }
              this.setState({
                itemsArr,
                rightStopwatchStart: true,
                showRightTimer: true,
                timerValuePumping: totalCount
              }, () => AsyncStorage.setItem(KeyUtils.PUMPING_TIMER_VALUE, totalCount.toString()))
              this.startPumpingTimer('start', parseInt(totalCount))
            } else {
              this.props.setLeftTimerActive(true)
              let totalCount = dd
              this.items[4].is_active = true
              const {itemsArr}=this.state
              itemsArr[4].is_active=true
              this.setState(
                {
                  itemsArr,
                  rightStopwatchStart: true,
                  showRightTimer: true,
                  timerValuePumping: totalCount
                }, () => AsyncStorage.setItem(KeyUtils.PUMPING_TIMER_VALUE, totalCount.toString()))
              this.startPumpingTimer('start', parseInt(totalCount))
            }
          });
        });
      } else if (value == 'pause') {
        AsyncStorage.getItem(KeyUtils.PUMPING_TIMER_VALUE).then(prevTimerCount => {
          let remainingSeconds = parseInt(prevTimerCount)
          this.items[4].is_active = false
          const {itemsArr}=this.state
          itemsArr[4].is_active=false
          this.props.setLeftTimerActive(true)
          this.setState({
            itemsArr,
            timerValuePumping: remainingSeconds,
            rightStopwatchStart: false,
            showRightTimer: false,
          })
          this.startPumpingTimer('stop', parseInt(remainingSeconds))
        });
      } else {
        this.props.setLeftTimerActive(false)
        const {itemsArr}=this.state
        itemsArr[4].is_active=false
        this.items[4].is_active = false
        this.setState({rightStopwatchStart: true, timerValuePumping: 0,itemsArr})
      }
    });
  }

  contractionTimerData() {
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_DURATION).then((value) => {
      if (value === 'true') {
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_DURATION).then((startTime) => {
            let st = parseInt(startTime);
            let difference = Date.now() - st;
            let secondsDifference = Math.floor(difference / 1000);
            let dd = parseInt(secondsDifference);
            AsyncStorage.getItem(KeyUtils.DURATION_TIMER_VALUE).then((prevTimerCount) => {
                // if (prevTimerCount!=null){
                //   let remainingSeconds=parseInt(prevTimerCount)
                //   let totalCount=remainingSeconds+dd
                //   this.items[3].is_active = true
                //   this.setState({durationTime: totalCount, showDurationTimer:true},()=> AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE, totalCount.toString()))
                //   this.startDuration('start',parseInt(totalCount))
                // }else {
                let totalCount = dd
                this.items[3].is_active = true
                const {itemsArr}=this.state
                itemsArr[3].is_active=true
                this.setState({
                    itemsArr,
                    showDurationTimer: true,
                    durationTime: totalCount
                  }, () => AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE, totalCount.toString()))
                  this.startDuration('start', parseInt(totalCount))
                // }
              });
            });
      } else if (value == 'pause') {
        this.items[3].is_active = false
        const {itemsArr}=this.state
        itemsArr[3].is_active=false
        this.setState({itemsArr})
        AsyncStorage.getItem(KeyUtils.DURATION_TIMER_VALUE).then((prevTimerCount) => {
            let remainingSeconds = parseInt(prevTimerCount);
            this.setState({showDurationTimer: false, durationTime: remainingSeconds});
            this.startDuration('pause', parseInt(remainingSeconds))
          },
        );
      } else {
        let resetVal = {
          type: 'contractions',
          name: 'Contractions',
          is_active: false,
          min: 0,
          sec: 0,
        };
        this.items[3].is_active=false
        const {itemsArr}=this.state
        itemsArr[3]=resetVal
        this.setState({itemsArr})
      }
    });
  }

  sleepTimerData() {
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_SLEEP).then((value) => {
      if (value === 'true') {
        this.items[0].is_active=true
        const {itemsArr}=this.state
        itemsArr[0].is_active=true
        this.setState({itemsArr})
      }
      // isSleep = trueFset
      else if (value === 'pause') {
        this.items[0].is_active = false
        const {itemsArr}=this.state
        itemsArr[0].is_active=false
        this.setState({itemsArr})
      } else {
        this.items[0].is_active = false;
        const {itemsArr} = this.state;
        itemsArr[0].is_active = false;
        this.setState({itemsArr});
      }
    });
  }

  init() {
    this.leftTimerData(false)
    this.rightTimerData(false)
    this.sleepTimerData()
    this.contractionTimerData()
    this.pumpingTimerData(false)
  }

  startLeftTimer=(key, value)=>{
    _this.leftTimerRef.current &&
    typeof _this.leftTimerRef.current.handleLeftTimerFromParent == 'function'
      ? _this.leftTimerRef.current.handleLeftTimerFromParent(
          key,
          parseInt(value),
        )
      : null;
  };

  startRightTimer=(key, value)=>{
    if (key && value) {
      _this.rightTimerRef.current &&
      typeof _this.rightTimerRef.current.handleTimerFromParent == 'function'
        ? _this.rightTimerRef.current.handleTimerFromParent(
            key,
            parseInt(value),
          )
        : null;
    }
  };

  startPumpingTimer=(key, value)=>{
    if (key && value) {
      _this.pumpingRef.current &&
      typeof _this.pumpingRef.current.handleTimerFromParent == 'function'
        ? _this.pumpingRef.current.handleTimerFromParent(
        key,
        parseInt(value),
        )
        : null;
    }
  };

  startDuration(key, value){
    if(this.durationRef.current&&this.durationRef.current?.handleTimerFromParent){
      this.durationRef.current.handleTimerFromParent(key, parseInt(value))
    }
  }

  renderSleepTimer = (item) => {
    return <CustomSleepTimer
        timerTypeStyle={3}
        timerType={item.type}
        isEditable={false}
        getHours={(hrs) => hrs}
        getMin={(min) => min}
        getSec={(sec) => sec}
        isCallingFromBaby={true}
        changeValue={this.handleChangeValue}/>
  }

  formatTime(value){
    let getSeconds = '', minutes = '', getMinutes = '', getHrs = ''
    let _timer=parseInt(value)
    getSeconds = `0${(_timer % 60)}`.slice(-2)
    minutes = `${Math.floor(_timer / 60)}`
    getMinutes = `0${minutes % 60}`.slice(-2)
    getHrs = `0${Math.floor(_timer / 3600)}`.slice(-2)
    return {getSeconds,getMinutes,getHrs}

  }

  renderLeftTimer = (item,index) => {
    const {timerValueLeft,itemsArr}=this.state
    return <CustomLeftTimerOnly
        ref={this.leftTimerRef}
        navigation={this.props.navigation}
        seconds={item.sec}
        minutes={item.min}
        getTimeValues={(v) => {
          const{getSeconds,getMinutes,getHrs}=this.formatTime(v)
         let i=itemsArr.findIndex((E)=>{
           return E.type===item.type
         })
        if (i>-1) {
          itemsArr[i].min=getMinutes
          itemsArr[i].sec=getSeconds
          this.setState({itemsArr:itemsArr})
        }
        this.getLeftTimerValue(v)
        }}
        timerTypeStyle={3}
        secondsDifference={this.state.timerValueLeft}
        initStart
        />
  }

  renderRightTimer = (item) => {
    const {timerValueLeft,itemsArr}=this.state
    return <CustomTimerOnly
        ref={this.rightTimerRef}
        seconds={item.sec}
        minutes={item.min}
        navigation={this.props.navigation}
        getTimeValues={(v) => {
          const{getSeconds,getMinutes,getHrs}=this.formatTime(v)
          let i=itemsArr.findIndex((E)=>{
            return E.type===item.type;
          })
          if (i>-1) {
            itemsArr[i].min=getMinutes
            itemsArr[i].sec=getSeconds
            this.setState({itemsArr:itemsArr})
          }
          this.getRightTimerValue(v)
        }}
        timerTypeStyle={3}
        initStart
        secondsDifference={this.state.timerValueRight}/>
  }

  renderPumpingTimer = (item) => {
    const {timerValueLeft,itemsArr}=this.state
    return <CustomTimerOnly
      ref={this.pumpingRef}
      seconds={item.sec}
      minutes={item.min}
      navigation={this.props.navigation}
      getTimeValues={(v) => {
        const{getSeconds,getMinutes,getHrs}=this.formatTime(v)
        let i=itemsArr.findIndex((E)=>{
          return E.type===item.type;
        })
        if (i>-1) {
          itemsArr[i].min=getMinutes
          itemsArr[i].sec=getSeconds
          this.setState({itemsArr:itemsArr})
        }
        this.getPumpingTimerValue(v)
      }}
      timerTypeStyle={2}
      initStart
      secondsDifference={this.state.timerValuePumping}/>
  }

  renderContractionTimer = (item) => {
    const {getHrs,getMinutes,getSeconds}=this.formatTime(this.state.durationTime)
    return <CustomTimerOnly
        ref={this.durationRef}
        navigation={this.props.navigation}
        getTimeValues={(v) => this.getDurationTimerValue(v)}
        rendrer={<Text maxFontSizeMultiplier={1.7} style={[styles.timerTextStyle,{color:Colors.rgb_000000}]}>{`${getHrs}:${getMinutes}:${getSeconds}`}</Text>}
        timerTypeStyle={3}
        initStart
        secondsDifference={this.state.durationTime}/>
  }

  renderBleTimer = (item) => {
    const {getHrs,getMinutes,getSeconds}=this.formatTime(this.state.timer)
    return  <Text maxFontSizeMultiplier={1.7} style={{
      color: Colors.rgb_000000,
      fontSize: 14,
      marginHorizontal: 10}
    }>{`00:${getMinutes}:${getSeconds}`}</Text>
  }

  handleChangeValue = () => {}
  refreshView = () => {
    // this.init()
  }
  onSelected(item) {
    const {navigation} = this.props
    const {isDeviceConnected} = this.state
    if (item.type === KeyUtils.SLEEP) {
      navigation.navigate('SleepScreen', {
        refresh: this.refreshView
      })
    }
    else if (item.type === KeyUtils.BFnP_LEFT) {
      navigation.navigate('BreastFeedingScreen', {
        refresh: this.refreshView,
        isLeftPress: true,
        isRightPress: false,
        isSiriNameReturned: true
      })
    }
    else if(item.type===KeyUtils.BFnP_RIGHT) {
      navigation.navigate('BreastFeedingScreen', {
        refresh: this.refreshView,
        isLeftPress: false,
        isRightPress: true,
        isSiriNameReturned: true
      })
    }
    else if(item.type===KeyUtils.PUMPING) {
        navigation.navigate('BreastFeedingPumpingScreen', {
          refresh: this.refreshView,
          isLeftPress: false,
          isRightPress: true,
          isSiriNameReturned: true,
          isFrom: 'pumping',
        })
    }
    else if(item.type===KeyUtils.CONTRACTIONS) {
      navigation.navigate('ContractionScreen', {
        refresh: this.refreshView
      })
    }
    else if(item.type===KeyUtils.BOTH) {
      navigation.navigate('ContractionScreen', {
        refresh: this.refreshView
      })
    }
    else if(item.type===KeyUtils.BOTH_TIMER_ACTIVE) {
      GetterSetter.setParentScreen('pumping')
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')
      navigation.navigate('BreastFeedingPumpingScreen', {
        isFrom: 'bluetooth',
        isSiriNameReturned: true,
      })
    }

  }
  listItem = (item, index) => {
    const {showLeftTimer, showRightTimer, showDurationTimer} = this.state
    return item.is_active ?
      <TouchableOpacity onPress={() => this.onSelected(item)} style={[styles.container]} key={index.toString()}>
        {item.type === KeyUtils.SLEEP && <Sleep width={40} height={40} fill={'white'} style={styles.iconView}/>}
        {item.type === KeyUtils.BFnP_LEFT &&
        <BreastFeedingIcon width={40} height={40} fill={'white'} style={styles.iconView}/>}
        {item.type === KeyUtils.BFnP_RIGHT &&
        <BreastFeedingIcon width={40} height={40} fill={'white'} style={styles.iconView}/>}
        {item.type === KeyUtils.PUMPING &&
        <PumpingIcon width={40} height={40} fill={'white'} style={styles.iconView}/>}
        {item.type === KeyUtils.CONTRACTIONS &&
        <Contraction width={40} height={40} fill={'white'} style={styles.iconView}/>}
        {item.type === KeyUtils.BOTH_TIMER_ACTIVE && <View>
          <ActivePumpingIcon width={40} height={40} fill={'white'} style={styles.iconView}/>
          <Bluetooth width={20} height={20}  style={styles.bluetoothViewStyle}/>
        </View>
        }

        <View style={[styles.titleStyle]}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.titleTextStyle,{color:Colors.rgb_000000}]}>{item.name}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>

          {/*<View style={{justifyContent: 'center', alignItems: 'center'}}>*/}
          {item.type === KeyUtils.SLEEP && this.renderSleepTimer(item)}
          {item.type === KeyUtils.BFnP_LEFT && this.renderLeftTimer(item,index)}
          {item.type === KeyUtils.BFnP_RIGHT && this.renderRightTimer(item)}
          {item.type === KeyUtils.PUMPING && this.renderPumpingTimer(item)}
          {item.type === KeyUtils.CONTRACTIONS && this.renderContractionTimer(item)}
          {item.type === KeyUtils.BOTH_TIMER_ACTIVE && this.renderBleTimer(item)}

          {/*  <Text maxFontSizeMultiplier={1.7} style={styles.subTitleTextStyle}>{'Paused'}</Text>*/}
          {/*</View>*/}
          {/*<TouchableOpacity style={styles.viewTouchableStyle}>*/}
          {/*  <Text maxFontSizeMultiplier={1.7} style={styles.viewTextStyle}>{'VIEW'}</Text>*/}
          {/*</TouchableOpacity>*/}
          {/*<TouchableOpacity onPress={() => onClosePress(item)}>*/}
          {/*  <CloseIcon width={20} height={20} fill={'white'} style={styles.crossIconStyle}/>*/}
          {/*</TouchableOpacity>*/}

        </View>

      </TouchableOpacity> : null
  }

  render() {
    const {itemsArr}=this.state
    const data= itemsArr.filter((e) => {
      return e.is_active
    });
    return ((data.length > 0) && <View>
        {/* <Swiper
          style={{height: 70,}}
          showsPagination={true}
          dotColor={Colors.rgb_898d8d_6}
          activeDotColor={Colors.rgb_898d8d}
          horizontal={true}>
          {itemsArr.map((item, index) => {
            return this.listItem(item, index)
          })}
        </Swiper> */}
        <SwiperFlatList
         style={{height: 70,width:"100%"}}
         horizontal
         index={0}

         autoplay
         autoplayLoop
         autoplayLoopKeepAnimation
         autoplayDelay={3}
      onContentSizeChange={item=>{
        //this.bottombannerFlat.current.goToFirstIndex()
      }}
      ref={this.bottombannerFlat}
         keyExtractor={(item)=>item.type}
         paginationDefaultColor={Colors.rgb_898d8d_6}
         paginationActiveColor={Colors.rgb_898d8d}
       paginationStyle={{alignSelf:"flex-end",paddingTop:5,paddingRight:15}}
       paginationStyleItem={{width:10,height:10,marginLeft:0,marginRight:5}}
        showPagination
        data={data}
       renderItem={({ item,index }) => {
        return <View style={{width:Dimensions.get("window").width}}>
           {this.listItem(item, index)}
        </View>
      }}
    />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  flexData: state.home.flexData,
  sonataData: state.home.sonataData,
  pumpRunning: state.home.pumpRunning,
  pumps: state.home.pumps,
  isPumpSessionActive: state.home.isPumpSessionActive,
  isConnected: state.home.isConnected,
  themeSelected: state.app.themeSelected,
})

const mapDispatchToProps = (dispatch) => ({
  checkAppState: (status) => dispatch(AppActions.checkAppState(status)),
  setLeftTimerActive: (value) => dispatch(HomeActions.setLeftTimerActive(value)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(BottomBanner));
