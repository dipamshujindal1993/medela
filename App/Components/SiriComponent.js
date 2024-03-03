import React, { Component } from 'react'
import { NativeEventEmitter} from 'react-native'
import { connect } from 'react-redux'
import HomeActions from '@redux/HomeRedux';
import UserActions from '@redux/UserRedux';
import NavigationService from "@services/NavigationService";
import { getRealmDb } from "../Database/AddBabyDatabase";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import I18n from "react-native-i18n";

let ModuleWithEmitter = require('react-native').NativeModules.ModuleWithEmitter;


class SiriComponent extends Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const moduleEmitter = new NativeEventEmitter(ModuleWithEmitter)
    const subscription = moduleEmitter.addListener('onSessionConnect', async (data) => {
      if(this.props.userProfile.mother.vipStatus){
        this.handleSiriValidations(data)
        this.performSiriAction(data)
      }
      else{
        NavigationService.navigate('VipPackScreen')
        this.props.siriValidationPopUp(I18n.t('voice_command.vip_pack_not_active'),'')
      } })
    const killedModeListner = moduleEmitter.addListener('killedModeListner', async (data) => {
      // setTimeout(() => {
      // this.props.userProfile.mother.vipStatus?this.handleSiriValidations(data):null }, 5500)
      if(!this.props.userProfile.mother.vipStatus){
        NavigationService.navigate('VipPackScreen')
        this.props.siriValidationPopUp(I18n.t('voice_command.vip_pack_not_active'),'') }
      else{
        this.props.startSiriLoader(5000)
      }
      this.props.userProfile.mother.vipStatus?
        setTimeout(() => {
          this.handleSiriValidations(data)
          this.performSiriAction(data) }, 5000):null}
    ) }

  async performSiriAction(data) {
    if (data.Event.title === 'Start breastfeeding') {
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
      let baby = await this.getBabiesFromSiri(this.props, data)
      let isSiriData = false
      // alert(JSON.stringify(baby))
      if (baby.length > 0) {
        isSiriData = true
      }
      else {
        isSiriData = false
      }
      setTimeout(async() => {
        let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
        if(currentScreenName !== 'BreastFeedingScreen'){
          if (data.Event.side === 'Right') {
            let prevTimerCount = await AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE)
            if (prevTimerCount != null || prevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
              isSiriData=true
            }
            NavigationService.navigate('BreastFeedingScreen', {
              isLeftPress: false,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: isSiriData,
              pauseBreasefeeding:true
            })
          }
          else if (data.Event.side === 'Left') {
            let prevTimerCount = await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
            if (prevTimerCount != null || prevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
              isSiriData=true
            }
            NavigationService.navigate('BreastFeedingScreen', {
              isLeftPress: true,
              isRightPress: false,
              refresh: this.refreshView,
              isSiriNameReturned: isSiriData,
              pauseBreasefeeding:true
            })
          }
          else if(data.Event.side === 'Both') {
            let prevTimerCount = await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
            if (prevTimerCount != null || prevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
              isSiriData=true
            }
            let rightPrevTimerCount = await AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE)
            if (rightPrevTimerCount != null || rightPrevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
              isSiriData=true
            }
            NavigationService.navigate('BreastFeedingScreen', {
              isLeftPress: true,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: isSiriData,
              pauseBreasefeeding:true

            })
          }
        }
        else{
          if (data.Event.side === 'Right') {
            let rightPrevTimerCount = await AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE)
            if (rightPrevTimerCount != null || rightPrevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
              isSiriData=true
            }
            NavigationService.replace('BreastFeedingScreen', {
              isLeftPress: false,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: isSiriData,
              pauseBreasefeeding:true
            })
          }
          else if (data.Event.side === 'Left') {
            let prevTimerCount = await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
            if (prevTimerCount != null || prevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
              isSiriData=true
            }
            NavigationService.replace('BreastFeedingScreen', {
              isLeftPress: true,
              isRightPress: false,
              refresh: this.refreshView,
              isSiriNameReturned: isSiriData,
              pauseBreasefeeding:true
            })
          }
          else if(data.Event.side === 'Both') {
            let prevTimerCount = await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
            if (prevTimerCount != null || prevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
              isSiriData=true
            }
            let rightPrevTimerCount = await AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE)
            if (rightPrevTimerCount != null || rightPrevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
              isSiriData=true
            }
            NavigationService.replace('BreastFeedingScreen', {
              isLeftPress: true,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: isSiriData,
              pauseBreasefeeding:true

            })
          }

        }
      }, 100)
    }
    else if (data.Event.title === 'Pause breastfeeding') {
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
      setTimeout(() => {
        AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'pause')
        AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'pause')
        let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
        if(currentScreenName !== 'BreastFeedingScreen'){
          NavigationService.navigate('BreastFeedingScreen', {
            isLeftPress: false,
            isRightPress: false,
            refresh: this.refreshView,
            isSiriNameReturned: true,
            pauseBreasefeeding:true
          })
        }
        else{
          NavigationService.replace('BreastFeedingScreen', {
            isLeftPress: false,
            isRightPress: false,
            refresh: this.refreshView,
            isSiriNameReturned: true,
            pauseBreasefeeding:true
          })
        }

      }, 100)
      let leftTimerValue = await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
      let rightTimerValue =  await AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE)
      if (leftTimerValue == null && rightTimerValue == null) {
        this.props.siriValidationPopUp(I18n.t('voice_command.pause_no_session_title'),'')
      }
    }
    else if (data.Event.title === 'Continuebreastfeeding') {
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')

      setTimeout(() => {
        let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
        if(currentScreenName !== 'BreastFeedingScreen'){
          if (data.Event.side === 'Right') {
            AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(prevTimerCount => {
              if (prevTimerCount != null || prevTimerCount == 0) {
                AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
              }
            })
            NavigationService.navigate('BreastFeedingScreen', {
              isLeftPress: false,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: true,
              pauseBreasefeeding:true

            })
          }
          else if (data.Event.side === 'Left') {
            AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(prevTimerCount => {
              if (prevTimerCount != null || prevTimerCount == 0) {
                AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
              }
            })
            NavigationService.navigate('BreastFeedingScreen', {
              isLeftPress: true,
              isRightPress: false,
              refresh: this.refreshView,
              isSiriNameReturned: true,
              pauseBreasefeeding:true

            })
          }
          else if(data.Event.side === 'Both') {
            AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(prevTimerCount => {
              if (prevTimerCount != null || prevTimerCount == 0) {
                AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
              }
            })
            AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(prevTimerCount => {
              if (prevTimerCount != null || prevTimerCount == 0) {
                AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
              }
            })
            NavigationService.navigate('BreastFeedingScreen', {
              isLeftPress: true,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: true,
              pauseBreasefeeding:true

            })
          }
        }
        else{
          if (data.Event.side === 'Right') {
            AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(prevTimerCount => {
              if (prevTimerCount != null || prevTimerCount == 0) {
                AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
              }
            })
            NavigationService.replace('BreastFeedingScreen', {
              isLeftPress: false,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: true,
              pauseBreasefeeding:true

            })
          }
          else if (data.Event.side === 'Left') {
            AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(prevTimerCount => {
              if (prevTimerCount != null || prevTimerCount == 0) {
                AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
              }
            })
            NavigationService.replace('BreastFeedingScreen', {
              isLeftPress: true,
              isRightPress: false,
              refresh: this.refreshView,
              isSiriNameReturned: true,
              pauseBreasefeeding:true

            })
          }
          else if(data.Event.side === 'Both') {
            AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE).then(prevTimerCount => {
              if (prevTimerCount != null || prevTimerCount == 0) {
                AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'true')
              }
            })
            AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE).then(prevTimerCount => {
              if (prevTimerCount != null || prevTimerCount == 0) {
                AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'true')
              }
            })
            NavigationService.replace('BreastFeedingScreen', {
              isLeftPress: true,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: true,
              pauseBreasefeeding:true

            })
          }

        }
      }, 100)
    }
    else if (data.Event.title === 'StopBreastfeeding') {
      let leftTimerValue = await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
      let rightTimerValue =  await AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE)
      if(leftTimerValue !=null || rightTimerValue !=null ){
        AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
        AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
        AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')

        setTimeout(() => {
          let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
          if(currentScreenName !== 'BreastFeedingScreen'){
            NavigationService.navigate('BreastFeedingScreen', {
              isLeftPress: false,
              isRightPress: false,
              refresh: this.refreshView,
              isSiriNameReturned: true,
              callTrackingApi:true

            })
          }
          else{
            NavigationService.replace('BreastFeedingScreen', {
              isLeftPress: false,
              isRightPress: false,
              refresh: this.refreshView,
              isSiriNameReturned: true,
              callTrackingApi:true

            })
          }
        }, 100)
      }
      else{
        this.props.siriValidationPopUp(I18n.t('voice_command.pause_no_session_title'),'')
      }
    }
    else if (data.Event.title === 'Start Pumping') {
      //
      let bothTimerActive = await AsyncStorage.getItem(
        KeyUtils.BOTH_TIMER_ACTIVE,
      );
      let bothManualTimerActive = await AsyncStorage.getItem(
        KeyUtils.IS_P_TIMER_STARTED,
      );
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false');
      let baby = await this.getBabiesFromSiri(this.props, data);
      let isSiriData = false;
      if (baby.length > 0) {
        isSiriData = true;
      } else {
        isSiriData = false;
      }
      if (bothTimerActive == 'true' || bothManualTimerActive == 'true') {
        this.props.siriValidationPopUp(I18n.t('voice_command.active_pump_title')
          ,I18n.t('voice_command.active_pump_body'))
      } else {
        setTimeout(async () => {
          let currentScreenName = NavigationService.getCurrentRoute(
            NavigationService.getNavigator().state.nav,
          );
          if (currentScreenName !== 'BreastFeedingPumpingScreen') {
            let prevTimerCount = await AsyncStorage.getItem(
              KeyUtils.PUMPING_TIMER_VALUE,
            );
            if (prevTimerCount != null || prevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_P, 'true');
            }
            NavigationService.navigate('BreastFeedingPumpingScreen', {
              isLeftPress: true,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: isSiriData,
            });
          } else {
            let prevTimerCount = await AsyncStorage.getItem(
              KeyUtils.PUMPING_TIMER_VALUE,
            );
            if (prevTimerCount != null || prevTimerCount == 0) {
              AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_P, 'true');
              isSiriData = true;
            }
            NavigationService.replace('BreastFeedingPumpingScreen', {
              isLeftPress: true,
              isRightPress: true,
              refresh: this.refreshView,
              isSiriNameReturned: isSiriData,
            });
          }
        }, 100);
      }
    }
    else if (data.Event.title === 'Stop Pumping') {
      let prevTimerCount = await AsyncStorage.getItem(KeyUtils.PUMPING_TIMER_VALUE)
      let isActivePumping =  await AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_P)
      if(prevTimerCount !=null){
        if (isActivePumping === "") {
          this.props.siriValidationPopUp(I18n.t('voice_command.pause_no_session_title'), '')
        }
        else {
          AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_P, 'false')
          let baby = await this.getBabiesFromSiri(this.props, data)
          let isSiriData = false
          // alert(JSON.stringify(baby))
          if (baby.length > 0) {
            isSiriData = true
          }
          else {
            isSiriData = false
          }
          setTimeout(() => {
            let currentScreenName = NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
            if (currentScreenName !== 'BreastFeedingPumpingScreen') {
              NavigationService.navigate('BreastFeedingPumpingScreen', {
                pumpingData: data.Event,
                refresh: this.refreshView,
                isSiriNameReturned: isSiriData,
                callTrackingApiOnPumpingStop: true
              })
            }
            else {
              NavigationService.replace('BreastFeedingPumpingScreen', {
                pumpingData: data.Event,
                refresh: this.refreshView,
                isSiriNameReturned: isSiriData,
                callTrackingApiOnPumpingStop: true
              })
            }
          }, 100)
        }
      }
      else{
        this.props.siriValidationPopUp(I18n.t('voice_command.pause_no_session_title'),'')
      }
    }
    else if (data.Event.title === 'Track Length') {
      let baby = await this.getBabiesFromSiri(this.props, data)
      let isSiriData = false
      // alert(JSON.stringify(baby))
      if (baby.length > 0) {
        isSiriData = true
      }
      else {
        isSiriData = false
      }
      setTimeout(() => {
        let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
        if(currentScreenName !== 'GrowthScreen'){
          NavigationService.navigate('GrowthScreen', {
            amount: data.Event.length,
            lengthType:data.Event.lengthtType,
            isSiriNameReturned: isSiriData }
          ) }
        else{
          NavigationService.replace('GrowthScreen', {
            amount: data.Event.length,
            lengthType:data.Event.lengthtType,
            isSiriNameReturned: isSiriData }
          )
        }
      }, 300)}
    else if (data.Event.title === 'Track Weight') {
      let baby = await this.getBabiesFromSiri(this.props, data)
      let isSiriData = false
      // alert(JSON.stringify(baby))
      if (baby.length > 0) {
        isSiriData = true
      }
      else {
        isSiriData = false
      }
      setTimeout(() => {
        let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
        if(currentScreenName !== 'WeightScreen'){

          NavigationService.navigate('WeightScreen', {
            amount: data.Event.weight,
            weightType:data.Event.weightType,
            isSiriNameReturned: isSiriData })
        }
        else{
          NavigationService.replace('WeightScreen', {
            amount: data.Event.weight,
            weightType:data.Event.weightType,
            isSiriNameReturned: isSiriData })
        }
      }, 100)
    }
    else if (data.Event.title === 'Track a diaper') {
      let baby = await this.getBabiesFromSiri(this.props, data)
      let isSiriData = false
      if (baby.length > 0) {
        isSiriData = true
      }
      else {
        isSiriData = false
      }
      setTimeout(() => {
        let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
        if(currentScreenName !== 'NappyTrackingScreen'){
          NavigationService.navigate('NappyTrackingScreen', {
            amount: data.Event.length,
            baby:baby[0],
            type:data.Event.diaperType,
            isSiriNameReturned: isSiriData
          })
        }
        else{
          NavigationService.replace('NappyTrackingScreen', {
            amount: data.Event.length,
            baby:baby[0],
            type:data.Event.diaperType,
            isSiriNameReturned: isSiriData
          })
        }
      },500)
    }

    else if (data.Event.title === 'Start Sleep') {
      let baby = await this.getBabiesFromSiri(this.props, data)
      let isSiriData = false
      if (baby.length > 0) {
        isSiriData = true
      }
      else {
        isSiriData = false
      }
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'true')
      let startTime = await AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP)
      if (startTime != null) {
        AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_SLEEP, startTime)
        isSiriData=true
      }
      else {
        let currentTime = new Date().getTime();
        AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_SLEEP, currentTime.toString() );
      }

      setTimeout(() => {
        let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
        if(currentScreenName !== 'SleepScreen'){
          NavigationService.navigate('SleepScreen', {
            isSiriNameReturned: isSiriData})
        }
        else{
          NavigationService.replace('SleepScreen', {
            isSiriNameReturned: isSiriData})
        }
      }, 500)
    }
    else if (data.Event.title === 'Stop Sleep') {
      let istimerActive = await AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP)
      if(istimerActive!= null){
        let baby = await this.getBabiesFromSiri(this.props, data)
        let isSiriData = false
        // alert(JSON.stringify(baby))
        if (baby.length > 0) {
          isSiriData = true
        }
        else {
          isSiriData = false
        }
        AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'false')
        setTimeout(() => {
          let currentScreenName = NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
          if (currentScreenName !== 'SleepScreen') {
            NavigationService.navigate('SleepScreen', {
              isSiriNameReturned: isSiriData,
              callTrackingApi: true
            })
          }
          else {
            NavigationService.replace('SleepScreen', {
              isSiriNameReturned: isSiriData,
              callTrackingApi: true
            })
          }
        }, 100)
      }
      else{
        this.props.siriValidationPopUp(I18n.t('voice_command.pause_no_session_title'),'')
      }
    }
  }

  async getBabiesFromSiri(props, data) {
    let babiesList = [];
    let realmDb=await getRealmDb()
    let babyArr = realmDb.objects('AddBaby');
    babiesList = (JSON.parse(JSON.stringify(babyArr)))
    let baby = babiesList.filter(item => this.hammingDistance(item.name, data.Event.babyName) < 3)
    if (baby.length > 0) {
      this.props.setSelectedBaby(baby[0])
      await this.props.switchBaby(baby[0].babyId)
    }
    return baby;
  }

  async handleSiriValidations(session){
    let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
    if (session.Event.title === 'Start breastfeeding') {
      if (lastSession === 'Start breastfeeding') {
        this.props.siriValidationPopUp(I18n.t('voice_command.active_breastfeeding_title')
          ,I18n.t('voice_command.active_breastfeeding_body'))
      }
      else{
        let rightTimerValue= await AsyncStorage.getItem(KeyUtils.LEFT_TIMER_VALUE)
        let leftTimerValue= await AsyncStorage.getItem(KeyUtils.RIGHT_TIMER_VALUE)
        if(leftTimerValue!=null || rightTimerValue!=null){
          this.props.siriValidationPopUp(I18n.t('voice_command.active_breastfeeding_title')
            ,I18n.t('voice_command.active_breastfeeding_body'))
        }
      }
    }
    else  if (lastSession === session.Event.title) {
      //  if (lastSession === 'Start Pumping') {
      //   this.props.siriValidationPopUp(I18n.t('voice_command.active_pump_title')
      //   ,I18n.t('voice_command.active_pump_body'))
      // }
      if (lastSession === 'Start Sleep') {
        AsyncStorage.setItem('stopmodal', 'true')

        this.props.siriValidationPopUp(I18n.t('voice_command.active_sleep_title')
          ,I18n.t('voice_command.active_sleep_body'))
      }
      else if (lastSession === 'Pause breastfeeding') {
        let leftTimerValue = await AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT)
        let rightTimerValue =  await AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT)
        if(!(leftTimerValue== "true"|| rightTimerValue== "true") ) {
          this.props.siriValidationPopUp( I18n.t('voice_command.pause_already_pause_title'),'')
        }
      }
      else if (lastSession === 'Continuebreastfeeding') {
        this.props.siriValidationPopUp( I18n.t('voice_command.continue_already_continue_title'),'')
      }
    }
    AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, session.Event.title)
  }

  hammingDistance(str1, str2) {
    var dist = 0;
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    for (var i = 0, j = Math.max(str1.length, str2.length); i < j; i++) {
      if (!str1[i] || !str2[i] || str1[i] !== str2[i]) {
        dist++;
      }
    }
    return dist;
  }
  render() {
    return null
  }
}
const mapStateToProps = (state) => ({
  babies: state.home.babies,
  switchBabySuccess: state.user.switchBabySuccess,
  userProfile: state.user.userProfile,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
})
// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({

  setSelectedBaby: (item) => dispatch(HomeActions.setSelectedBaby(item)),
  switchBaby: (item) => dispatch(UserActions.switchBaby(item.babyId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SiriComponent)
