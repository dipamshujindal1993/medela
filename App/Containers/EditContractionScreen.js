import React, {Component} from 'react';
import {Text, View, Keyboard, TouchableOpacity, SafeAreaView, ScrollView, Modal} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import LoadingSpinner from '@components/LoadingSpinner';
import HomeActions from '@redux/HomeRedux';
import Dialog from '@components/Dialog';
import CustomTextInput from '@components/CustomTextInput';
import I18n from '@i18n';
import {Colors} from '@resources';
import {uuidV4} from '@utils/TextUtils';
import CustomTimerOnly from '@components/CustomTimerOnly';
import HeaderTrackings from "@components/HeaderTrackings";
import styles from './Styles/ContractionScreenStyles';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {createTrackedItem, deleteTrackingItem} from "../Database/TrackingDatabase";
import CustomOptionGridSelector from "@components/CustomOptionGridSelector";
import Button from '@components/Button';
import {BlurView} from "@react-native-community/blur";
import Reset from '@svg/ic_reset';
import BottomButtonsView from "../Components/BottomButtonsView";
import TrackingDateTime from "../Components/TrackingDateTime";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
const data = [{
  label: I18n.t('stats_contraction.none'),
  value: '0',
}, {
  label: I18n.t('stats_contraction.very_mild'),
  value: '1',
}, {
  label: I18n.t('stats_contraction.mild'),
  value: '2',
}, {
  label: I18n.t('stats_contraction.medium'),
  value: '3',
}, {
  label: I18n.t('stats_contraction.strong'),
  value: '4',
}, {
  label: I18n.t('stats_contraction.very_strong'),
  value: '5',
}];

class EditContractionScreen extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = props
    const {painLevel} = navigation.state.params.item
    console.log(navigation.state.params.item)
    let index=data.findIndex((e)=>{
      return e.value==painLevel
    })
    let remark=this.props.navigation.state.params&&this.props.navigation.state.params.item&&this.props.navigation.state.params.item.remark?this.props.navigation.state.params.item.remark:'';
    this.state = {
      isLoading: false,
      stopwatchStart: false,
      stopwatchValue: '',
      noteTextInput: remark,
      getCurrentTime: 0,
      getEndTime: 0,
      timerValue: 0,
      showClearCounterAlert: false,
      showPainLevels: false,
      selectedDate: moment().format(),
      frqTimer: '1:1:1',
      painLevelValue: index,
      durationTime: 0,
      frequencyTime: 0,
      frequencyTimeToSend: 0,
      stopwatchStartStatus: false,
      isUiLoading:false,
      defaultSelectedPainLevel:index,
      showDeleteTrackingPopup:false

    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.durationInMins = 0
    this.durationInSec = 0
    this.durationInHour = 0

    this.durationRef = React.createRef();
    this.frequencyRef = React.createRef();

  }

  async componentDidMount() {
    const {navigation}=this.props
    const {babyId,trackAt,weight,remark,painLevel} = navigation.state.params.item
    console.log(navigation.state.params.item)
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)

    const {frequency, durationTotal} = navigation.state.params.item
    this.durationRef.current.handleTimerFromParent('pause', parseInt(durationTotal))
    this.frequencyRef.current.handleTimerFromParent('pause', parseInt(frequency))

    this.setState({babyId, selectedDate: trackAt, sliderValue: weight, weightByInput: weight})
    //
    //this.frequencyRef.current.
    await analytics.logScreenView('edit_contraction_screen')
  }

  componentWillUnmount(){
    // AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_DURATION, Date.now().toString())
  }


  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    const {motherTrackingApiSuccess, motherTrackingApiFailure, deleteMotherTrackingSuccess,deleteMotherTrackingFailure,deleteMotherTrackingId} = this.props;
    if (motherTrackingApiSuccess != prevProps.motherTrackingApiSuccess && motherTrackingApiSuccess && prevState.isLoading) {
      this.saveTrackingInDb(true)
      this.setState({isLoading: false});
    }

    if (motherTrackingApiFailure != prevProps.motherTrackingApiFailure && motherTrackingApiFailure) {
      this.setState({isLoading: false});
    }

    if (deleteMotherTrackingSuccess != prevProps.deleteMotherTrackingSuccess && deleteMotherTrackingSuccess && prevState.isLoading) {
      deleteTrackingItem(deleteMotherTrackingId)
      this.props.navigation.goBack()
      this.setState({isLoading: false})
    }

    if (deleteMotherTrackingFailure != prevProps.deleteMotherTrackingFailure && deleteMotherTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
  }

  onPainLevelChange = (value) => {

    this.setState({painLevelValue: parseInt(value)})
  };

  handleValidations() {
    const {noteTextInput,painLevelValue} = this.state
    const {navigation} = this.props
    console.log(navigation.state.params.item)
    const {
      id,
      trackingType,
      quickTracking,
      trackAt,
      painLevel,
      durationTotal,
      frequency,
      remark,
      confirmed
    } = navigation.state.params.item

    this.trackingObj = {
      id,
      trackingType,
      quickTracking,
      trackAt,
      painLevel:painLevelValue,
      durationTotal,
      frequency,
      remark: noteTextInput.toString().trim(),
      confirmed,
    };
    console.log('---',this.trackingObj)
    let json = {
      trackings: [this.trackingObj],
    };
    const {isInternetAvailable, motherTrackingApi} = this.props
    if (isInternetAvailable) {
      this.setState({ isLoading: true});
      motherTrackingApi(json);
    } else {
      this.setState({showPainLevels: false});
      this.saveTrackingInDb(false)
    }


  }

  saveTrackingInDb(isSync) {
    AsyncStorage.getItem(KeyUtils.USER_NAME).then((_result)=>{
      if (_result!=null){
        this.trackingObj.isSync = isSync
        this.trackingObj.userId = _result
        this.trackingObj.isMother=true
        createTrackedItem(this.trackingObj).then((r) => {
          console.log('result--', r)
          this.props.navigation.goBack()

        })
      }
    })
  }

  startDurationTimer(value) {

    const {durationTime, frequencyTime} = this.state

    if(value){
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_DURATION, "pause")
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_FREQUENCY, "true")

      AsyncStorage.getItem(KeyUtils.FREQUENCY_TIMER_VALUE).then(value => {

        this.setState({showPainLevels: true})
        this.setState({frequencyTimeToSend: parseInt(value)}, () => {
          AsyncStorage.getItem(KeyUtils.DURATION_TIMER_VALUE).then(value => {
            this.durationRef.current.handleTimerFromParent('stop', parseInt(durationTime))
            this.frequencyRef.current.handleTimerFromParent('start', parseInt(value))
            AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE, "0")
          });
        })
      });


    }else{

      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_DURATION,"true")
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_FREQUENCY,"pause")

      AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_DURATION, Date.now().toString())

      this.durationRef.current.handleTimerFromParent('start', parseInt(0))
      this.frequencyRef.current.handleTimerFromParent('stop', parseInt(durationTime))

      AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE,"0")

    }

    this.setState({
      stopwatchStartStatus: !this.state.stopwatchStartStatus,
    })
  }

  renderTimerView() {
    const {stopwatchStartStatus, durationTime} = this.state;
    const {navigation}=this.props
    const {durationTotal} = navigation.state.params.item
    console.log(durationTotal)
    return (
      <View>
        <View style={styles.frequencyViewStyle}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle, {flex: 1,color:this.textColor}]}>{I18n.t('sleep.duration')}</Text>
          <View style={styles.timerBgStyle}>
            <CustomTimerOnly
              ref={this.durationRef}
              navigation={this.props.navigation}
              getTimeValues={() => {
              }}
              timerTypeStyle={3}
              secondsDifference={durationTotal}/>
          </View>
        </View>
      </View>
    );
  }

  renderFrequency() {
    const {frequencyTime} = this.state;
    const {navigation} = this.props
    const {frequency} = navigation.state.params.item
    return (
      <View>
        <View style={styles.frequencyViewStyle}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle, {flex: 1,color:this.textColor}]}>{I18n.t('contractions.frequency')}</Text>
          <View style={styles.timerBgStyle}>
            <CustomTimerOnly
              ref={this.frequencyRef}
              navigation={this.props.navigation}
              getTimeValues={() => {
              }}
              timerTypeStyle={3}
              secondsDifference={frequency}/>
          </View>
        </View>
      </View>
    );
  }

  renderPain() {
    const {defaultSelectedPainLevel} = this.state;
    console.log('defaultSleectedIndex---',defaultSelectedPainLevel)
    return (
      <View>
        <View style={styles.painStyle}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle, {marginTop: 10, marginLeft: 0,color:this.textColor}]}>{I18n.t('contractions.pain')}</Text>
          <View style={{marginTop: 20, height: 150, alignItems: 'center'}}>

            <CustomOptionGridSelector
              buttonContainerInactiveStyle={styles.radioBtnInactive}
              buttonContainerStyle={styles.radioBtnContainer}
              buttonContainerActiveStyle={styles.radioBtnActive}
              buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:Colors.rgb_000000}]}
              buttonTextActiveStyle={styles.radioBtnTextActive}
              data={data}
              defaultSelectedIndex={defaultSelectedPainLevel}
              onChange={({item}) => this.onPainLevelChange(item.value)}/>
          </View>
        </View>
      </View>
    );
  }


  showClearCounterPopup() {
    const {showClearCounterAlert} = this.state
    return (
      <Dialog
        visible={showClearCounterAlert}
        title={I18n.t('contractions.reset')}
        message={I18n.t('contractions.reset_message')}
        positive={I18n.t('generic.yes')}
        negative={I18n.t('generic.no')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showClearCounterAlert: false})
        }}
        positiveOnPress={() => {
          this.setState({showClearCounterAlert: false})

        }}
        onDismiss={() => {
        }}
      />
    )
  };



  showDeleteTrackingPopup() {
    const {showDeleteTrackingPopup} = this.state
    return (
      <Dialog
        visible={showDeleteTrackingPopup}
        title={I18n.t('tracking.title')}
        message={I18n.t('tracking.delete_tracking_message')}
        positive={I18n.t('generic.yes')}
        negative={I18n.t('generic.no')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showDeleteTrackingPopup: false})

        }}
        positiveOnPress={() => {
          const {deleteMotherTrackingApi,navigation}=this.props
          const {id} = navigation.state.params.item
          this.setState({showDeleteTrackingPopup: false,isLoading:true})
          deleteMotherTrackingApi(id)
        }}
        onDismiss={() => {
        }}
      />
    )
  };
  render() {
    const {navigation} = this.props
    const {
      isLoading, selectedDate,
      showDeleteTrackingPopup,
      showClearCounterAlert,
      stopwatchValue,
      getCurrentTime,
      showPainLevels
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderTrackings
          title={I18n.t('contractions.title')}
          onPressBaby={() => this.setState({showBabyList: true})}
          onBackPress={() => {
            navigation.goBack()
          }}
          onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
          navigation={navigation}
          getSelectedDate={(value) => this.setState({selectedDate: value})}
          hideCalendarNBaby={true}/>
        <TrackingDateTime date={selectedDate} time={selectedDate}/>
        {isLoading && <LoadingSpinner/>}
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <>

            {this.renderTimerView()}
            {this.renderFrequency()}
            {this.renderPain()}
            {showDeleteTrackingPopup && this.showDeleteTrackingPopup()}
            <CustomTextInput
              style={{marginTop: 20}}
              maxLength={1000}
              value={this.state.noteTextInput}
              textContentType="familyName"
              onChangeText={(index, value) => this.setState({noteTextInput: value})}
              placeholder={I18n.t('breastfeeding_pump.add_note')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.addNoteTextInputEdit,{color:this.textColor}]}
              multiline={true}
              maxHeight={100}
              enableDoneButton={true}
            />
            <BottomButtonsView
              positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
              negativeButtonTitle={I18n.t('generic.delete').toUpperCase()}
              onNegativePress={() => this.setState({showDeleteTrackingPopup: true})}
              onPositivePress={() => this.handleValidations()}
            />
          </>
        </ScrollView>
      </SafeAreaView>
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
  themeSelected: state.app.themeSelected,

  motherTrackingResponse: state.home.motherTrackingResponse,
  motherTrackingApiSuccess: state.home.motherTrackingApiSuccess,
  motherTrackingApiFailure: state.home.motherTrackingApiFailure,
  deleteMotherTrackingSuccess: state.home.deleteMotherTrackingSuccess,
  deleteMotherTrackingFailure: state.home.deleteMotherTrackingFailure,
  deleteMotherTrackingId: state.home.deleteMotherTrackingId,
});

const mapDispatchToProps = (dispatch) => ({
  motherTrackingApi: (trackingData) => dispatch(HomeActions.motherTrackingApi(trackingData)),
  deleteMotherTrackingApi:(trackingId) => dispatch(HomeActions.deleteMotherTrackingApi(trackingId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditContractionScreen);
