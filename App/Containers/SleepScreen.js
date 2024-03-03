import React, {Component} from 'react';
import {Text, View, Keyboard, TouchableOpacity, SafeAreaView, Platform, BackHandler,ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import LoadingSpinner from '@components/LoadingSpinner';
import HomeActions from '@redux/HomeRedux';
import Dialog from '@components/Dialog';
import CustomTextInput from '@components/CustomTextInput';
import I18n from '@i18n';
import {Colors} from '@resources';
import {uuidV4,appendTimeZone} from '@utils/TextUtils';
import CustomSleepTimer from '@components/CustomSleepTimer';
import HeaderTrackings from "@components/HeaderTrackings";
import styles from './Styles/SleepScreenStyles';
import Button from "@components/Button";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {createTrackedItem} from "@database/TrackingDatabase";
import Toast from 'react-native-simple-toast';
import NavigationService from "@services/NavigationService";
import SiriBabySelectionModal from "@components/SiriBabySelectionModal";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

let autoStartTime = true;

class SleepScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      stopwatchStart: false,
      stopwatchValue: '',
      noteTextInput: '',
      getCurrentTime: 0,
      getEndTime: 0,
      timerValue: 0,
      showClearCounterAlert: false,
      selectedDate: moment().format(),
      showSiriBabySelectionModal:this.props.navigation.state.params!= undefined?this.props.navigation.state.params.isSiriNameReturned:undefined,
      callTrackingApiOnStop:this.props.navigation.state.params!= undefined?this.props.navigation.state.params.callTrackingApi:undefined,
      isTimmerInPausedState:false,
      initialCalenderValue:undefined,
      isCalenderValueDetained:undefined,
      initialCalenderTimer:undefined,
      handleTimer : 0,
      disableButton:false,
      timeCalendarDate:moment(),
      timeCalendarDateAM:moment(),
      checkStartTimer:0
    };
    this.updateTimerFlag=false,
    this.durationInMins=0
    this.durationInSec=0
    this.durationInHour=0
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.customSleepTimer = React.createRef();
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }
  async componentDidMount() {
    let sleepDuration = await AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE)

    if( sleepDuration === null){
      AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP,Date.now().toString());
    }
    else{
    let newDate= await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP);
     this.updateStartTime(new Date(parseInt(newDate)))
    }
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    let stopModal=await AsyncStorage.getItem('stopmodal')
    this.tabName=await AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME)
    this.setState({isstopModal:stopModal})
    if (this.state.callTrackingApiOnStop!= undefined && this.state.showSiriBabySelectionModal ==true){
      AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE).then((prevTimerCount) => {
        console.log('sleep timer val',remainingSeconds)
        let remainingSeconds = parseInt(prevTimerCount)
        this.setState({sleepStopwatchStart: true, timerValue: remainingSeconds, showTimers: true},()=>{
          let  minutes = Math.floor(remainingSeconds / 60);
          this.handleValidations(true,minutes>=30?(minutes*60):(minutes+1)*60)
        })
      });
    }
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
        this.init()
   })
    await analytics.logScreenView('sleep_tracking_screen')
  }

  init(){
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_SLEEP).then((value) => {
      if (value === 'true') {
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP).then((startTime) => {
            let st = parseInt(startTime)
            let difference = Date.now() - st;
            let secondsDifference = Math.floor(difference / 1000);
            let dd = parseInt(secondsDifference)
            AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE).then((prevTimerCount) => {
                if (prevTimerCount != null) {
                  let remainingSeconds = parseInt(prevTimerCount)
                  let totalCount = remainingSeconds + dd
                  this.setState({
                      sleepStopwatchStart: true,
                      timerValue: totalCount,
                      showTimers: true
                  }, () => AsyncStorage.setItem(KeyUtils.SLEEP_TIMER_VALUE, totalCount.toString()))
                } else {
                  let totalCount = dd
                  this.setState({
                      sleepStopwatchStart: true,
                      timerValue: totalCount,
                      showTimers: true
                    }, () => AsyncStorage.setItem(KeyUtils.SLEEP_TIMER_VALUE, totalCount.toString()))
                }
              });
          });
      } else if (value == 'pause') {
        AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE).then((prevTimerCount) => {
            let remainingSeconds = parseInt(prevTimerCount)
            this.setState({sleepStopwatchStart: true, timerValue: remainingSeconds, showTimers: true})
        });
      } else {
        this.setState({sleepStopwatchStart: true, showTimers: true, timerValue: 0})
      }
    });
  }

  _handleBack=()=>{
    const {navigation}=this.props
    this.setState({disableButton:false})
    navigation.goBack()
    // setTimeout(()=>{
    if (this.tabName!=null){
      NavigationService.navigate(this.tabName)
    }else{
      NavigationService.navigate('Baby')
    }
  }

  onAndroidBackPress = () => {
    // if(this.state.isTimmerInPausedState){
    //   this.setState({showClearCounterAlert: true})
    // }else{
      this._handleBack()
    // }
    return true;
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
    this.focusListener && this.focusListener.remove();
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    const {trackingApiSuccess, trackingApiFailure, navigation, callChild} = this.props;

    if(prevProps.callChild!==callChild && callChild === 1){
      this.handlePause();
    }

    if (
      trackingApiSuccess != prevProps.trackingApiSuccess &&
      trackingApiSuccess &&
      prevState.isLoading
    ) {
      let keys = [
        KeyUtils.IS_TIME_ACTIVE_SLEEP,
        KeyUtils.START_TIMESTAMP_SLEEP,
        KeyUtils.SLEEP_TIMER_VALUE
      ]
      AsyncStorage.multiRemove(keys).then((res) => {
      });
      this.saveTrackingInDb(true)
    }

    if (
      trackingApiFailure != prevProps.trackingApiFailure &&
      trackingApiFailure &&
      prevState.isLoading
    ) {
      // this.saveTrackingInDb(false)
      this.setState({isLoading: false});
    }
  }

  async handleValidations(isComingFromSiri,timeInMinutes) {
    const {noteTextInput, getEndTime, selectedDate, getCurrentTime,  stopwatchValue, stopwatchStart,isCalenderValueDetained} = this.state;
    const {selected_baby}=this.props
    const {babyId}=selected_baby
    this.setState({ handleTimer: 1, stopwatchStart:false})

    let keys = [
      KeyUtils.IS_TIME_ACTIVE_SLEEP,
      KeyUtils.SLEEP_TIMER_VALUE,
      KeyUtils.BACKGROUND_TIME_STAMP
    ]
    AsyncStorage.multiRemove(keys).then((res) => {
    });


    if (this.props.babies && this.props.babies.length > 0) {

      // if (stopwatchStart) {
      //   alert(I18n.t('generic.stop_watch'))
      //   return
      // }
      let durationTotal = this.durationInSec > 0 ? this.durationInSec : 0
      if (this.durationInMins>0){
        durationTotal+=(this.durationInMins*60)
      }
      if (this.durationInHour>0){
        durationTotal+=(this.durationInHour*60*60)
      }
      let d;
      let formattedDate = null;
      if(!autoStartTime){
        if (isCalenderValueDetained != null && isCalenderValueDetained != undefined && isCalenderValueDetained != '') {
          d = moment(this.state.timeCalendarDate);
        } else{
          d = moment();
        }
           var dd = await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP);
           formattedDate = await appendTimeZone(new Date(parseInt(dd)));
         }else{
           // let startTime = sleepTimestamp;
           // let dd = moment(new Date(parseInt(startTime))).format();
           // if (isCalenderValueDetained != null && isCalenderValueDetained != undefined && isCalenderValueDetained != '') {
           //   startTime = moment(isCalenderValueDetained.endTime);
           //   startTime.set('s', startTime.second() - durationTotal);
           //   dd=startTime;
           //   AsyncStorage.removeItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP);
           // }
           // formattedDate = await appendTimeZone(dd);
           let startTime = await AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_SLEEP);
           // let dd = moment(new Date(parseInt(startTime))).format();
           var dd = await AsyncStorage.getItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP);
           var date  = new Date(parseInt(dd));
           formattedDate = await appendTimeZone(date);
         }


      this.trackingObj = {
        babyId: babyId,
        confirmed: true,
        durationTotal: isComingFromSiri?timeInMinutes:durationTotal>0?durationTotal:null,
        remark: noteTextInput.toString().trim(),
        quickTracking: false,
        trackAt: formattedDate,
        id: uuidV4(),
        trackingType: KeyUtils.TRACKING_TYPE_SLEEP,
      };
      let json = {
        trackings: [this.trackingObj],
      };
      let keys = [
        KeyUtils.START_TIMESTAMP_SLEEP
      ]
      AsyncStorage.multiRemove(keys).then((res) => {
      });
      const {isInternetAvailable, trackingApi} = this.props
      if (isInternetAvailable) {
        this.setState({isLoading: true});
        trackingApi(json);
      } else {
        this.saveTrackingInDb(false)
      }
    }
  }

  async saveTrackingInDb(isSync) {
    this.trackingObj.isSync = isSync
    this.trackingObj.userId = this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r) => {
      //   console.log('result--', r)
      // alert("Success")
      Toast.show(I18n.t("tracking.tracking_toaster_text"), Toast.SHORT);
      this._handleBack()
    })
    AsyncStorage.setItem(KeyUtils.SAVED_SLEEP_TIMER, 'true');
    let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
    if(lastSession==='Start Sleep' || lastSession==='Stop Sleep' ){
      AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, '')
    }
  }
  handleChangeValue(obj) {
    const {
      getStartTimeValue,
      stopwatchSelected,
      stopwatchSelectedTimer,
      getEndTimeValue,
    } = obj;

    if (getStartTimeValue) {
      this.setState({
        stopwatchStart: stopwatchSelected,
        stopwatchValue: stopwatchSelectedTimer,
        getCurrentTime: getStartTimeValue,
      });

    } else {
      this.setState({
        stopwatchStart: stopwatchSelected,
        stopwatchValue: stopwatchSelectedTimer,
        getEndTime: getEndTimeValue,
      });
    }
  }

  onFocusInput=(value)=>{
    this.setState({stopwatchStart:false})
    autoStartTime = false;
  }
  updateStartTime(date){
    if(this.updateTimerFlag === false){
    this.updateTimerFlag = true;
      let updateDate = date === undefined ?  Date.now() : date.getTime() ; 
      this.setState({timeCalendarDate:moment(updateDate),timeCalendarDateAM:moment(updateDate)})
      AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP,updateDate.toString());    
  }
}
  renderSleepView() {
    const {stopwatchStart, timerValue, handleTimer} = this.state;
    return (
      <View style={styles.sleepView}>
        <CustomSleepTimer
          callChild={handleTimer}
          ref={this.customSleepTimer}
          timerTypeStyle={3}
          getHours={(hrs) => {
            if (parseInt(hrs)>0){
              this.durationInHour=parseInt(hrs)
            }
          }}
          getMin={(min) => {
            if (parseInt(min)>0){
              this.durationInMins=parseInt(min);
            }
          }}
          getSec={(sec) => {
            this.durationInSec=parseInt(sec);
          }}
          onPaused={(value)=>{
            this.setState({isTimmerInPausedState:value})
          }}
          onPressTimer={(status)=>{
            this.updateStartTime();
            //autoStartTime = true;
          }}
          timerType={KeyUtils.SLEEP}
          stopwatchStartStatus={stopwatchStart}
          isCallingFromBaby={false}
          changeValue={this.handleChangeValue}
          isFocusInput={(value)=> this.onFocusInput(value)}
          isEditable={true}
          navigation={this.props.navigation}
          secondsDifference={timerValue}
          onManualChange={()=>{
            this.setState({
              stopwatchStart:false,
              isTimmerInPausedState:true
            })
            }}
          />
      </View>
    );
  }

  getSelectedBabyDetails(item) {
    // this.setState({babyId: item.babyId})
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
          this.setState({showClearCounterAlert: false, stopwatchStart:false})
          let keys = [
            KeyUtils.IS_TIME_ACTIVE_SLEEP,
            KeyUtils.START_TIMESTAMP_SLEEP,
            KeyUtils.SLEEP_TIMER_VALUE,
            KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP,
            KeyUtils.BACKGROUND_TIME_STAMP
          ]
          let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
          if(lastSession==='Start Sleep' || lastSession==='Stop Sleep' ){
            AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, '')
          }
          AsyncStorage.setItem(KeyUtils.SAVED_SLEEP_TIMER, 'true');
          AsyncStorage.multiRemove(keys).then((res) => {
            this._handleBack()
          });
        }}
        onDismiss={() => {}}
      />
    )
  };
  async setIntialTimer(dateObj){
    //console.log(dateObj.startTime.format('YYYY-MM-DDTHH:mm'),this.state.selectedDate,this.state.isCalenderValueDetained)
    await AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP,'pause');
    await AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_SLEEP,dateObj.startTime.valueOf().toString());
    await AsyncStorage.setItem(KeyUtils.SLEEP_TIMER_VALUE,dateObj.duration.asSeconds().toString())
    this.customSleepTimer.current.forceInit(dateObj.startTime,dateObj.endTime);
    setTimeout(()=>{
      const {stopwatchStart}=this.state
      this.setState({stopwatchStart:false})
    },200)
  }
  render() {
    const {navigation} = this.props
    const {isLoading,initialCalenderTimer, stopwatchStart, showClearCounterAlert,isCalenderValueDetained,initialCalenderValue,timeCalendarDate ,timeCalendarDateAM} = this.state;
    return (
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
      <HeaderTrackings
        title={I18n.t('sleep.header_title')}
        hideCalendarIcon = {true}
        timeCalendarDate={timeCalendarDate}
        timeCalendarDateAM={timeCalendarDateAM}
        textStartTime={true}
        updateTimeCalendarUIPress={(date,duration)=>{
          this.setState({
            isDateChanged:true,
            timeCalendarDate:date
          })
          AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP,new Date(date).getTime().toString());
        }}
        updateValidation={(val)=>{
          this.setState({disableButton:val})
        }}
        showStartEndTime={true}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => {
          // if(this.state.isTimmerInPausedState){
          //   this.setState({showClearCounterAlert: true})
          // }else{
            this._handleBack()
          // }
        }}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        getSelectedDate={(value,dateObj) => {
          if(dateObj!=undefined&&dateObj.duration.isValid()){
            this.setIntialTimer(dateObj);
            //console.log(duration.hours(),duration.minutes(),duration.seconds(),'from duration object')
            let date={
              selectedDate:value,
              startTime:dateObj.startTime.format('YYYY-MM-DDTHH:mm'),
              endTime:dateObj.endTime.format('YYYY-MM-DDTHH:mm'),
            }
            this.setState({selectedDate: value,isCalenderValueDetained:date})
            // AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP,JSON.stringify(date));
          }
        }}
        selectedDate={isCalenderValueDetained==undefined?initialCalenderValue :isCalenderValueDetained.selectedDate}
        startEndDetainedValue={isCalenderValueDetained!==undefined?isCalenderValueDetained:initialCalenderTimer!=undefined?initialCalenderTimer:undefined}
        calenderIconPressed={async ()=>{
          if(isCalenderValueDetained==undefined||isCalenderValueDetained==null||isCalenderValueDetained==''){
            //console.log('calendardetained undefined ',moment().format())
            this.setState({initialCalenderValue: moment().format()});
            //this.setState({initialCalenderValue:moment().subtract({hours:this.durationInHour,minutes:this.durationInSec>=30?this.durationInMins+1:this.durationInMins}).format()})
            if(this.durationInHour>0||this.durationInMins>=0||this.durationInSec!=0){
              //console.log('calendardetained undefined but duration  present',moment().format(),moment().subtract({hours:this.durationInHour,minutes:this.durationInSec>=30?this.durationInMins+1:this.durationInMins}).format())
              this.setState({initialCalenderTimer:{
                //initialCalenderValue:moment().subtract({hours:this.durationInHour,minutes:this.durationInSec>=30?this.durationInMins+1:this.durationInMins}).format(),
                selectedDate:moment().format(),
                //selectedDate:moment().subtract({hours:this.durationInHour,minutes:this.durationInSec>=30?this.durationInMins+1:this.durationInMins}).format(),
                startTime:moment().subtract({hours:this.durationInHour,minutes:this.durationInSec>=30?this.durationInMins+1:this.durationInMins}),
                endTime:moment().format()
              }})
            }
          }else{
            if(this.durationInHour>0||this.durationInMins>=0||this.durationInSec!=0){
              //console.log('calendardetained ! undefined  ',isCalenderValueDetained)
              let obj=isCalenderValueDetained;
              obj.startTime=moment(obj.endTime).subtract({hours:this.durationInHour,minutes:this.durationInSec>=30?this.durationInMins+1:this.durationInMins});
              this.setState({isCalenderValueDetained:obj})
              // AsyncStorage.setItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP,JSON.stringify(obj));
            }
          }
        }}
        calendarNegativePressed={()=>{
          AsyncStorage.removeItem(KeyUtils.DETAINED_CALENDAR_VALUE_SLEEP);
          this.setState({isCalenderValueDetained:undefined})
        }}
        // getSelectedDate={(value) => this.setState({selectedDate: value,isCalenderValueDetained:true})}
        // selectedDate={isCalenderValueDetained===false?initialCalenderValue:undefined}
        // calenderIconPressed={()=>{
        //   if(isCalenderValueDetained===false){
        //     this.setState({initialCalenderValue: moment().format()});
        //   }
        // }}
        />
      {isLoading && <LoadingSpinner/>}
      <View style={styles.container}>
      {(this.state.showSiriBabySelectionModal!= undefined && !this.state.showSiriBabySelectionModal) && <SiriBabySelectionModal
      showBabySelectionModal={!this.state.showSiriBabySelectionModal}
      cancelBabyPress={(visible)=>{
        this.setState({showSiriBabySelectionModal:false})
        if (this.state.callTrackingApiOnStop!= undefined){
          AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE).then((prevTimerCount) => {
            console.log('sleep timer val',remainingSeconds)
            let remainingSeconds = parseInt(prevTimerCount)
            this.setState({sleepStopwatchStart: true, timerValue: remainingSeconds, showTimers: true},()=>{
              let  minutes = Math.floor(remainingSeconds / 60);
              this.handleValidations(true,minutes>=30?(minutes*60):(minutes+1)*60)
            })
          });
        }
      }}
      onBabyListPress={(item) => {
        this.setState({showSiriBabySelectionModal:false})
        if (this.state.callTrackingApiOnStop!= undefined){
          AsyncStorage.getItem(KeyUtils.SLEEP_TIMER_VALUE).then((prevTimerCount) => {
            console.log('sleep timer val',remainingSeconds)
            let remainingSeconds = parseInt(prevTimerCount)
            this.setState({sleepStopwatchStart: true, timerValue: remainingSeconds, showTimers: true},()=>{
              let  minutes = Math.floor(remainingSeconds / 60);
              this.handleValidations(true,minutes>=30?(minutes*60):(minutes+1)*60)
            })
          });
        }
      }}
      navigation={navigation}
    />}
        <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle,{color:this.textColor}]}>{I18n.t('sleep.duration')}</Text>
        {this.renderSleepView()}
        {showClearCounterAlert && this.showClearCounterPopup()}
        <CustomTextInput
          maxLength={1000}
          textContentType="familyName"
          onChangeText={(index, value) => this.setState({noteTextInput: value})}
          placeholder={I18n.t('breastfeeding_pump.add_note')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
          multiline={true}
          maxHeight={200}
          enableDoneButton={true}
        />
        <TouchableOpacity 
          accessible={true}
          accessibilityLabel={I18n.t(" ")} 
          onPress={() => Keyboard.dismiss()} style={{width: '100%',height:'45%'}}/>
        <View style={[styles.cancelSaveView,{marginTop:'auto'}]}>
        <Button title={I18n.t('generic.cancel').toUpperCase()} textStyle={styles.cancelTextStyle}
                onPress={() => this.setState({showClearCounterAlert: true})}
                style={styles.cancelButtonStyles}/>
        <Button
          disabled={this.state.disableButton}
          title={I18n.t('generic.save').toUpperCase()} textStyle={styles.saveTextStyle} onPress={() => {
            this.handleValidations(false,0)
        }}
          style={[styles.saveButtonStyles]}/>
          </View>
      </View>
    </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  isInternetAvailable: state.app.isInternetAvailable,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  selected_baby: state.home.selected_baby,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SleepScreen);