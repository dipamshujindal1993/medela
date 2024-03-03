import React, {Component} from 'react';
import {Text, View, Keyboard, TouchableOpacity, SafeAreaView, ScrollView, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LoadingSpinner from '@components/LoadingSpinner';
import HomeActions from '@redux/HomeRedux';
import Dialog from '@components/Dialog';
import CustomTextInput from '@components/CustomTextInput';
import I18n from '@i18n';
import {Colors} from '@resources';
import HeaderTrackings from "@components/HeaderTrackings";
import styles from './Styles/SleepScreenStyles';
import BottomButtonsView from "@components/BottomButtonsView";
import KeyUtils from "@utils/KeyUtils";
import {createTrackedItem, deleteTrackingItem} from "../Database/TrackingDatabase";
import TrackingDateTime from "@components/TrackingDateTime";
import EditDuration from "@components/EditDuration";
import {convertSecToHours, formatTimer, timeConvert} from "@utils/TextUtils";
import Toast from "react-native-simple-toast";
import {appendTimeZone,convertSecToHourMin} from "@utils/TextUtils";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

const duration = [
  {
    label: ' ',
    value: '0',
    min:'0',
    hour:'0',
    sec:'0',
    totalMin:'11',
    totalSec:'0',
    ref1:React.createRef(),
    ref2:React.createRef(),
    ref3:React.createRef()
  }
];
class EditSleepScreen extends React.Component {
  constructor(props) {
    super(props);
    let remark=this.props.navigation.state.params&&this.props.navigation.state.params.item&&this.props.navigation.state.params.item.remark?this.props.navigation.state.params.item.remark:'';
    this.state = {
      isLoading: false,
      stopwatchStart: false,
      showDeleteTrackingPopup:false,
      stopwatchValue: '',
      noteTextInput: remark,
      getCurrentTime: 0,
      getEndTime: 0,
      timerValue: 0,
      durationList:duration,
      showClearCounterAlert: false,
      selectedDate: moment(this.props.navigation.state.params.item.trackAt).format(),
      babyId: this.props.babies && this.props.babies[0] && this.props.babies[0].babyId ? this.props.babies[0].babyId :'',
      changedDate:undefined,
      durationValue:undefined
    };
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.editDuration=React.createRef()
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const {navigation}=this.props
    const {babyId,trackAt,remark} = navigation.state.params.item;
    let {durationTotal}=navigation.state.params.item;
    //durationTotal=(parseInt(convertSecToHourMin(parseInt(durationTotal))[0])*60)
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)

    const {durationList}=this.state
    const {rhours,rminutes,rSeconds}=timeConvert(durationTotal)
    durationList[0].hour=formatTimer(rhours)
    durationList[0].min=formatTimer(rminutes)
    durationList[0].sec=formatTimer(rSeconds)
    durationList[0].totalSec=durationTotal+''
    this.setState({
      babyId,
      selectedDate:trackAt,
      durationValue:{
        selectedDate:moment(trackAt),
        startTime:moment(trackAt),
        endTime:moment(trackAt).add({hours:parseInt(formatTimer(rhours)),minutes:parseInt(formatTimer(rSeconds))>30? parseInt(formatTimer(rminutes))+1:parseInt(formatTimer(rminutes))})
      }
    })
    await analytics.logScreenView('edit_sleep_screen')
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    const {trackingApiSuccess, trackingApiFailure, navigation,deleteTrackingId,deleteTrackingSuccess, deleteTrackingFailure} = this.props;
    if (deleteTrackingSuccess != prevProps.deleteTrackingSuccess && deleteTrackingSuccess && prevState.isLoading) {
      console.log('deleteTRackingId--',deleteTrackingId)
      deleteTrackingItem(deleteTrackingId)
      this.setState({isLoading: false})
      this.props.navigation.goBack()
    }

    if (deleteTrackingFailure != prevProps.deleteTrackingFailure && deleteTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
    if (
      trackingApiSuccess != prevProps.trackingApiSuccess &&
      trackingApiSuccess &&
      prevState.isLoading
    ) {
      this.saveTrackingInDb(true)
      Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
      navigation.state.params._onSave()
      navigation.goBack()
      this.setState({isLoading: false});
    }

    if (
      trackingApiFailure != prevProps.trackingApiFailure &&
      trackingApiFailure &&
      prevState.isLoading
    ) {
      this.saveTrackingInDb(false)
      this.setState({isLoading: false});
    }
  }

  async handleValidations() {
    const {noteTextInput,  selectedDate, babyId,changedDate} = this.state;
    const{navigation}= this.props
    const {id} = navigation.state.params.item
    const {durationList}=this.state

    if (this.props.babies && this.props.babies.length > 0) {
      if (isNaN(durationList[0].totalSec)){
        alert(I18n.t('calendar.timer_alert'))
        return
      }

      if(parseInt(durationList[0].min)>60) {
        alert(I18n.t('stats_breastfeeding.error_sleep_duration_min'))
        return
      }

      if(parseInt(durationList[0].sec)>60) {
        alert(I18n.t('stats_breastfeeding.error_sleep_duration_sec'))
        return
      }

      let totalSec=parseInt(durationList[0].totalSec)
      if (totalSec===0){
        alert(I18n.t('calendar.timer_alert'))
        return
      }
      let date;
      if(changedDate!=undefined){
        date=moment(changedDate.startTime)
      }else{
        date=selectedDate;
      }
      let formattedDate = await appendTimeZone(date)
      this.trackingObj = {
        babyId: babyId,
        confirmed: true,
        durationTotal: totalSec,
        remark: noteTextInput.toString().trim(),
        quickTracking: false,
        trackAt: formattedDate,
        id: id,
        trackingType: KeyUtils.TRACKING_TYPE_SLEEP,
      };
      let json = {
        trackings: [this.trackingObj],
      };
      const {isInternetAvailable, trackingApi} = this.props
      if (isInternetAvailable) {
        this.setState({isLoading: true});
        trackingApi(json);
      } else {
        this.saveTrackingInDb(false)
      }
    }
  }

  saveTrackingInDb(isSync) {
    this.trackingObj.isSync = isSync
    this.trackingObj.userId = this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r) => {
      if(!isSync) {
        Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
        this.props.navigation.goBack()
      }
    })
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
      // when user stops the timer on tap
      this.setState({
        stopwatchStart: stopwatchSelected,
        stopwatchValue: stopwatchSelectedTimer,
        getEndTime: getEndTimeValue,
      });
    }
  }

  renderSleepView() {
    const {stopwatchStart, timerValue,durationValue,changedDate} = this.state;
    const {volumeList, durationList, volumeCount,} = this.state;
    const {trackAt} = this.props.navigation.state.params.item

    return (
      <View style={styles.durationView}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.durationStyle,{color:this.textColor}]}>{I18n.t('sleep.duration')}</Text>
        <EditDuration
          ref={this.editDuration}
          isEditable={true}
          timerTypeStyle={true}
          buttonContainerStyle={{height:35,alignSelf:'center'}}
          data={durationList}
          //defaultSelectedIndex={-1}

          onChange={(item, index,callback) => {
            durationList[index]=item
            const digits_only = string => [...string].every(c => '0123456789'.includes(c));
            let minute=durationList[index].min
            let seconds=durationList[index].sec
            let hours=durationList[index].hour
            let min,sec,hour
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
            if (!digits_only(hours) || hours==''){
              hour=0
            } else {
              hour=parseInt(hours)
            }
              let hourMin=60*hour
              let totalMin=hourMin+min
              let leftMinutes=totalMin/2
              let TotalSec=sec+parseInt(totalMin)*60
              const  {rhours,rminutes}=convertSecToHours(leftMinutes)
              durationList[index].hour=hours+''
              durationList[index].min= minute+''// formatTimer(minute)
              durationList[index].sec=seconds+''//formatTimer(seconds)
              durationList[index].totalMin=totalMin+''
              durationList[index].totalSec=TotalSec+''
              this.setState({durationList:durationList},()=>{
                callback!=undefined&&callback()
              })

          }}/>
      </View>
    );
  }

  getSelectedBabyDetails(item) {
    this.setState({babyId: item.babyId})
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
  setTimer(dateObj){
    const {durationList}=this.state;
    let minute=dateObj.duration.minutes()
    let seconds=dateObj.duration.seconds()
    let hours=dateObj.duration.hours()
    let min=dateObj.duration.minutes()
    let sec=dateObj.duration.seconds()
    let hour=dateObj.duration.hours()
    let hourMin=60*hour
    let totalMin=hourMin+min
    let leftMinutes=totalMin/2
    let TotalSec=sec+parseInt(totalMin)*60
    const  {rhours,rminutes}=convertSecToHours(leftMinutes)
    durationList[0].hour=formatTimer(hours)
    durationList[0].min=formatTimer(minute)
    durationList[0].sec=formatTimer(seconds)
    durationList[0].totalMin=totalMin+''
    durationList[0].totalSec=TotalSec+''
    this.setState({durationList:durationList})
    this.editDuration.current.forceInit();
  }
  render() {
    const {navigation} = this.props
    const {trackingType,timeStamp} = navigation.state.params.item
    const {isLoading,durationValue, changedDate,showDeleteTrackingPopup, noteTextInput,selectedDate,showClearCounterAlert, stopwatchValue} = this.state;
    return (

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
        <HeaderTrackings
          isEditable={true}
          title={I18n.t('sleep.header_title')}
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
          startEndDetainedValue={changedDate!=undefined?changedDate:durationValue!=undefined?durationValue:undefined}
          selectedDate={changedDate!=undefined?changedDate.selectedDate:selectedDate}
          getSelectedDate={(value,dateObj) =>{
            if(dateObj!=undefined&&dateObj.duration.isValid()){
              this.setTimer(dateObj);
              let date={
                selectedDate:value,
                startTime:dateObj.startTime.format('YYYY-MM-DDTHH:mm'),
                endTime:dateObj.endTime.format('YYYY-MM-DDTHH:mm'),
              }
              this.setState({selectedDate: value,changedDate:date})}
            }
          }
          calenderIconPressed={async ()=>{
            if(changedDate!=undefined){
              const {changedDate,durationList,durationValue}=this.state;
              //changedDate.startTime=moment(changedDate.endTime).subtract({hours:durationList[0].hour,minutes:parseInt(durationList[0].sec)>30?parseInt(durationList[0].min)+1:parseInt(durationList[0].min)})
              this.setState({
                changedDate:{
                  selectedDate:moment(changedDate.selectedDate).format('YYYY-MM-DDTHH:mm'),
                  startTime:moment(changedDate.endTime).subtract({hours:durationList[0].hour,minutes:parseInt(durationList[0].sec)>30?parseInt(durationList[0].min)+1:parseInt(durationList[0].min)}).format('YYYY-MM-DDTHH:mm'),
                  endTime:moment(changedDate.endTime).format('YYYY-MM-DDTHH:mm')
                }
              })
            }else{
              const {durationList,durationValue}=this.state;
              //changedDate.startTime=moment(changedDate.endTime).subtract({hours:durationList[0].hour,minutes:parseInt(durationList[0].sec)>30?parseInt(durationList[0].min)+1:parseInt(durationList[0].min)})
              this.setState({
                durationValue:{
                  selectedDate:moment(durationValue.selectedDate).format('YYYY-MM-DDTHH:mm'),
                  startTime:moment(durationValue.endTime).subtract({hours:durationList[0].hour,minutes:parseInt(durationList[0].sec)>30?parseInt(durationList[0].min)+1:parseInt(durationList[0].min)}).format('YYYY-MM-DDTHH:mm'),
                  endTime:moment(durationValue.endTime).format('YYYY-MM-DDTHH:mm')
                }
              })
            }
          }}
        />
        {isLoading && <LoadingSpinner/>}
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <>

              {this.renderSleepView()}
              {showClearCounterAlert && this.showClearCounterPopup()}
              {showDeleteTrackingPopup && this.showDeleteTrackingPopup()}
              <CustomTextInput
                maxLength={1000}
                value={noteTextInput}
                textContentType="familyName"
                onChangeText={(index, value) => this.setState({noteTextInput: value})}
                placeholder={I18n.t('breastfeeding_pump.add_note')}
                placeholderTextColor={this.textColor}
                textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
                multiline={true}
                maxHeight={100}
                enableDoneButton={true}
              />
            <TouchableOpacity 
              accessible={true}
              accessibilityLabel={I18n.t(" ")}
              onPress={() => Keyboard.dismiss()} style={{width: '100%', height: 400}}/>
            <BottomButtonsView
              positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
              negativeButtonTitle={I18n.t('generic.delete').toUpperCase()}
              onNegativePress={() => this.setState({showDeleteTrackingPopup:true})}
              onPositivePress={() => this.handleValidations()}
            />
          </>
        </ScrollView>
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
  deleteTrackingSuccess:state.home.deleteTrackingSuccess,
  deleteTrackingFailure:state.home.deleteTrackingFailure,
  deleteTrackingId:state.home.deleteTrackingId,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  deleteTrackingApi: (trackingId,babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId,babyId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSleepScreen);
