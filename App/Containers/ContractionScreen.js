import React from 'react';
import {Text, View, TouchableOpacity, SafeAreaView, ScrollView, Modal,Platform,BackHandler} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import LoadingSpinner from '@components/LoadingSpinner';
import HomeActions from '@redux/HomeRedux';
import Dialog from '@components/Dialog';
import CustomTextInput from '@components/CustomTextInput';
import I18n from '@i18n';
import {Colors} from '@resources';
import {uuidV4,appendTimeZone} from '@utils/TextUtils';
import CustomTimerOnly from '@components/CustomTimerOnly';
import HeaderTrackings from "@components/HeaderTrackings";
import styles from './Styles/ContractionScreenStyles';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {createTrackedItem} from "../Database/TrackingDatabase";
import CustomOptionGridSelector from "@components/CustomOptionGridSelector";
import Button from '@components/Button';
import {BlurView} from "@react-native-community/blur";
import Reset from '@svg/ic_reset';
import ResetLight from '@svg/ic_reset_light';
import NavigationService from "@services/NavigationService";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class ContractionScreen extends React.Component {
  data = [{
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
  }
  ];
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
      showPainLevels: false,
      selectedDate: moment().format(),
      frqTimer: '1:1:1',
      painLevelValue: -1,
      durationTime: 0,
      frequencyTime: 0,
      frequencyTimeToSend: 0,
      stopwatchStartStatus: false,
      isUiLoading:false,
      disableResetButton: true,
    };
    this.durationInMins = 0
    this.durationInSec = 0
    this.durationInHour = 0
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)

    this.durationRef = React.createRef();
    this.frequencyRef = React.createRef();

    this.init = this.init.bind(this)
    this.startDuration = this.startDuration.bind(this)
    this.startFrequency = this.startFrequency.bind(this)

  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
      this.tabName=tabName
      /*if (tabName!=null){
        NavigationService.navigate(tabName)
      }else{
        NavigationService.navigate('Baby')
      }*/
    })
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      this.init()
    })
    await analytics.logScreenView('contraction_tracking_screen')
  }

  _handleBack=()=>{
    const {navigation}=this.props
    navigation.goBack()
    if (this.tabName!=null){
      NavigationService.navigate(this.tabName)
    }else{
      NavigationService.navigate('Baby')
    }
  }

  onAndroidBackPress = () => {
    this._handleBack()
    return true;
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  init = () => {
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_DURATION).then((value) => {
      if (value === 'true') {
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_DURATION).then(
          (startTime) => {
            let st = parseInt(startTime);
            let difference = Date.now() - st;
            let secondsDifference = Math.floor(difference / 1000);
            let dd = parseInt(secondsDifference);

            AsyncStorage.getItem(KeyUtils.DURATION_TIMER_VALUE).then((prevTimerCount) => {
                let totalCount = dd;
                this.setState({durationTime: totalCount}, () =>
                  AsyncStorage.setItem(
                    KeyUtils.DURATION_TIMER_VALUE,
                    totalCount.toString(),
                  ),
                );
                this.startDuration('start', parseInt(totalCount));
                this.setState({
                  stopwatchStartStatus: true,
                });
              },
            );
          },
        );
      } else if (value == 'pause') {
        AsyncStorage.getItem(KeyUtils.DURATION_TIMER_VALUE).then(
          (prevTimerCount) => {
            let remainingSeconds = parseInt(prevTimerCount);
            this.setState({durationTime: remainingSeconds});
            this.startDuration('pause', parseInt(remainingSeconds));
          },
        );
      }
    });

    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_FREQUENCY).then((value) => {
      if (value === 'true') {
        AsyncStorage.getItem(KeyUtils.START_TIMESTAMP_DURATION).then(
          (startTime) => {
            let st = parseInt(startTime);
            let difference = Date.now() - st;
            let secondsDifference = Math.floor(difference / 1000);
            let dd = parseInt(secondsDifference);
            AsyncStorage.getItem(KeyUtils.FREQUENCY_TIMER_VALUE).then((prevTimerCount) => {
                let totalCount = dd;
                console.log('totalCouint----',dd)
                this.setState({frequencyTime: totalCount}, () =>
                  AsyncStorage.setItem(
                    KeyUtils.FREQUENCY_TIMER_VALUE,
                    totalCount.toString(),
                  ),
                );
                this.startFrequency('start', parseInt(totalCount));
              },
            );
          },
        );
      } else if (value == 'pause') {
        AsyncStorage.getItem(KeyUtils.FREQUENCY_TIMER_VALUE).then(
          (prevTimerCount) => {
            let remainingSeconds = prevTimerCount==null?0:parseInt(prevTimerCount);
            this.setState({frequencyTime: remainingSeconds});
            this.startFrequency('pause', parseInt(remainingSeconds));
          },
        );
      }
    });
  };

  startDuration = (key, value) => {
    if (key && value) {
      this.durationRef.current &&
      typeof this.durationRef.current.handleTimerFromParent == 'function'
        ? this.durationRef.current.handleTimerFromParent(
        key,
        parseInt(value),
        )
        : null;
    }
    //this.durationRef.current.handleTimerFromParent(key, parseInt(value));
  };

  startFrequency = (key, value) => {
    this.setState({disableResetButton: false});
    if (key && value) {
      this.frequencyRef.current &&
      typeof this.frequencyRef.current.handleTimerFromParent == 'function'
        ? this.frequencyRef.current.handleTimerFromParent(
        key,
        parseInt(value),
        )
        : null;
    }
    //this.frequencyRef.current.handleTimerFromParent(key, parseInt(value));
  };

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    const {motherTrackingApiSuccess, motherTrackingApiFailure, appState} = this.props;
    if (
      motherTrackingApiSuccess != prevProps.motherTrackingApiSuccess &&
      motherTrackingApiSuccess &&
      prevState.isLoading
    ) {
      this.saveTrackingInDb(true);
      this.setState({isLoading: false});
    }

    if (motherTrackingApiFailure != prevProps.motherTrackingApiFailure && motherTrackingApiFailure) {
      this.setState({isLoading: false});
    }

    if (appState && appState != prevProps.appState) {
      console.log('App State --------- ', appState,this.isConnectionIntervalRunning,this.isScannerRunning)
      if (appState === 'background') {
      console.log('contraction timer in background')
      } else if (appState === 'active') {
        console.log('contraction timer in active')
        //this.init()
      }
    }
  }

  onPainLevelChange = (value) => {
    this.setState({painLevelValue: parseInt(value)});
  };

  async handleValidations() {
    const {
      noteTextInput,
      selectedDate,
      durationTime,
      frequencyTimeToSend,
      painLevelValue,
    } = this.state;
    let frequencyValue = 0;
    AsyncStorage.getItem(KeyUtils.DURATION_TIMER_VALUE).then((value) => {
      this.setState({durationTime: parseInt(value)});
    });

    AsyncStorage.getItem(KeyUtils.FREQUENCY_TIMER_VALUE).then((value) => {
      this.setState({frequencyTime: parseInt(value)});
    });

    AsyncStorage.getItem(KeyUtils.IS_THIS_FIRST_SESSION).then((value) => {
      if (value === 'false') {
        frequencyValue = frequencyTimeToSend;
      } else {
        frequencyValue = 0;
      }
    });
    let d= new Date();
    d.setSeconds(d.getSeconds() - durationTime);
    let formattedDate=await appendTimeZone(d)
    //let formattedDate = await appendTimeZone(selectedDate);
    setTimeout(() => {
      AsyncStorage.setItem(KeyUtils.IS_THIS_FIRST_SESSION, 'false');
      this.trackingObj = {
        id: uuidV4(),
        trackingType: 1,
        quickTracking: false,
        trackAt: formattedDate,
        painLevel: painLevelValue, // 0 (None), 1 (Very mild), 2 (Mild), 3 (Medium), 4 (Strong), 5 (Very strong)
        durationTotal: durationTime,
        frequency: frequencyValue,
        remark: noteTextInput.toString().trim(),
        confirmed: false,
      };
      let json = {
        trackings: [this.trackingObj],
      };
      const {isInternetAvailable, motherTrackingApi} = this.props;
      if (isInternetAvailable) {
        this.setState({
          showPainLevels: false,
          painLevelValue: -1,
          isLoading: true,
        });
        motherTrackingApi(json);
      } else {
        this.setState({showPainLevels: false});
        this.saveTrackingInDb(false);
      }
    }, 100);
  }

  saveTrackingInDb(isSync) {
    AsyncStorage.getItem(KeyUtils.USER_NAME).then((_result) => {
      if (_result != null) {
        this.trackingObj.isSync = isSync;
        this.trackingObj.userId = _result;
        this.trackingObj.isMother = true;
        createTrackedItem(this.trackingObj).then((r) => {
          console.log('result--', r);
          // this.props.navigation.goBack()
        });
      }
    });
  }

  startDurationTimer(value) {
    const {durationTime, frequencyTime} = this.state;
    this.setState({disableResetButton: false});
    if (value) {
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_DURATION, 'pause');
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_FREQUENCY, 'true');

      AsyncStorage.getItem(KeyUtils.FREQUENCY_TIMER_VALUE).then((value) => {
        this.setState({showPainLevels: true});
        this.setState({frequencyTimeToSend: parseInt(value)}, () => {
          AsyncStorage.getItem(KeyUtils.DURATION_TIMER_VALUE).then((value) => {
            this.durationRef.current.handleTimerFromParent(
              'stop',
              parseInt(durationTime),
            );
            this.frequencyRef.current.handleTimerFromParent(
              'start',
              parseInt(value),
            );
            AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE, '0');
          });
        });
      });
    } else {
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_DURATION, 'true');
      AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_FREQUENCY, 'pause');

      AsyncStorage.setItem(
        KeyUtils.START_TIMESTAMP_DURATION,
        Date.now().toString(),
      );

      this.durationRef.current.handleTimerFromParent('start', parseInt(0));
      this.frequencyRef.current.handleTimerFromParent(
        'stop',
        parseInt(durationTime),
      );

      AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE, '0');
    }

    this.setState({
      stopwatchStartStatus: !this.state.stopwatchStartStatus,
    });
  }

  renderTimerView() {
    const {stopwatchStartStatus, durationTime} = this.state;
    return (
      <View style={styles.durationTimerView}>
        <TouchableOpacity
          onPress={() => this.startDurationTimer(stopwatchStartStatus)}>
          <View
            style={[
              styles.StopwatchBtnStyle,
              stopwatchStartStatus
                ? {backgroundColor: Colors.rgb_fd0807}
                : {backgroundColor: Colors.rgb_d8d8d8},
            ]}>
            <Text maxFontSizeMultiplier={1.7}
              style={[
                styles.StopwatchBtnText,
                stopwatchStartStatus
                  ? {color: Colors.white}
                  : {color: Colors.rgb_3E3E3E},
              ]}>
              {!stopwatchStartStatus
                ? I18n.t('sleep.start').toUpperCase()
                : I18n.t('sleep.stop').toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{marginTop: 10}}>
          <CustomTimerOnly
            appState={this.props.appState}
            ref={this.durationRef}
            navigation={this.props.navigation}
            getTimeValues={(v) => this.getDurationTimerValue(v)}
            timerTypeStyle={3}
            secondsDifference={durationTime}
            textColor={this.textColor}
          />
        </View>
      </View>
    );
  }

  getDurationTimerValue(value) {
    AsyncStorage.setItem(KeyUtils.DURATION_TIMER_VALUE, value.toString());
    this.setState({durationTime: parseInt(value)});
  }
  getFrequencyTimerValue(value) {
    AsyncStorage.setItem(KeyUtils.FREQUENCY_TIMER_VALUE, value.toString());
    this.setState({frequencyTime: parseInt(value)});
  }

  renderFrequency() {
    const {frequencyTime} = this.state;
    return (
      <View>
        <View style={styles.frequencyViewStyle}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle, {flex: 1,color:this.textColor}]}>
            {I18n.t('contractions.frequency')}
          </Text>
          <View style={styles.timerBgStyle}>
            <CustomTimerOnly
              appState={this.props.appState}
              ref={this.frequencyRef}
              navigation={this.props.navigation}
              getTimeValues={(v) => this.getFrequencyTimerValue(v)}
              timerTypeStyle={3}
              secondsDifference={frequencyTime}
            />
          </View>
        </View>
      </View>
    );
  }

  renderPain() {
    return (
      <View>
        <View style={styles.painStyle}>
          <Text maxFontSizeMultiplier={1.7}
            style={[styles.durationTextStyle, {marginTop: 10, marginLeft: 0,color:this.textColor}]}>
            {I18n.t('contractions.pain')}
          </Text>
          <View style={{marginTop: 20, height: 150, alignItems: 'center'}}>
            <CustomOptionGridSelector
              buttonContainerInactiveStyle={styles.radioBtnInactive}
              buttonContainerStyle={styles.radioBtnContainer}
              buttonContainerActiveStyle={styles.radioBtnActive}
              buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:Colors.rgb_000000}]}
              buttonTextActiveStyle={styles.radioBtnTextActive}
              data={this.data}
              defaultSelectedIndex={-1}
              onChange={({item}) => this.onPainLevelChange(item.value)}
            />
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
          this.handleRest();
        }}
        onDismiss={() => {}}
      />
    );
  }

  getUserDetailsPopup() {
    const {showPainLevels, painLevelValue} = this.state
    const {themeSelected}=this.props
    let dialogBackgroundColor = Colors.white
    themeSelected === "dark" && (dialogBackgroundColor = Colors.rgb_000000)
    return (
      <Modal transparent={true} hardwareAccelerated visible={showPainLevels}>
        <BlurView blurType="dark" style={{flex: 1}}>
          <View style={styles.userDetailsStyle}>
            <View
              style={[
                styles.popupStyle,
                {backgroundColor: dialogBackgroundColor},
              ]}>
              {this.renderPain()}
              <View style={{height: 120}}>
                <CustomTextInput
                  maxLength={1000}
                  textContentType="familyName"
                  onChangeText={(index, value) =>
                    this.setState({noteTextInput: value})
                  }
                  placeholder={I18n.t('breastfeeding_pump.add_note')}
                  placeholderTextColor={this.textColor}
                  textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
                  multiline={true}
                  maxHeight={100}
                  enableDoneButton={true}
                />
              </View>
              <Button
                disabled={painLevelValue == -1 ? true : false}
                title={I18n.t('generic.submit')}
                onPress={() => this.handleValidations()}
                style={styles.buttonContainer}
              />
            </View>
          </View>
        </BlurView>
      </Modal>
    );
  }

  renderBottomView() {
    return (
      <View style={{position: 'absolute', left: 0, right: 0, bottom: 30}}>
        <TouchableOpacity
          disabled={this.state.disableResetButton}
          onPress={() => this.setState({showClearCounterAlert: true})}>
          <View style={styles.resetViewStyle}>
          {this.state.disableResetButton?<ResetLight/>:<Reset />}
            <Text maxFontSizeMultiplier={1.7}
              style={[
                styles.durationStyle,
                {margin: 10},
                this.state.disableResetButton
                  ? {color: Colors.rgb_d8d8d8}
                  : null,
              ]}>
              {I18n.t('contractions.reset').toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  handleRest() {
    this.durationRef.current.handleTimerFromParent('reset');
    this.frequencyRef.current.handleTimerFromParent('reset');
    this.setState({disableResetButton: true});
    let keys = [
      KeyUtils.IS_FREQUENCY_TIMER_STARTED,
      KeyUtils.FREQUENCY_TIMER_VALUE,
      KeyUtils.IS_DURATION_TIMER_STARTED,
      KeyUtils.DURATION_TIMER_VALUE,
      KeyUtils.START_TIMESTAMP_DURATION,
      KeyUtils.IS_TIME_ACTIVE_DURATION,
      KeyUtils.START_TIMESTAMP_FREQUENCY,
      KeyUtils.IS_TIME_ACTIVE_FREQUENCY,
      KeyUtils.IS_THIS_FIRST_SESSION,
      KeyUtils.BACKGROUND_TIME_STAMP
    ];
    AsyncStorage.multiRemove(keys).then((res) => {
      console.log(res, 'kry');
      this.setState({stopwatchStartStatus: false, frequencyTimeToSend: 0});
    });
  }

  render() {
    const {navigation} = this.props;
    const {
      isLoading,
      showClearCounterAlert,
      showPainLevels,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderTrackings
          title={I18n.t('contractions.title')}
          onPressBaby={() => this.setState({showBabyList: true})}
          onBackPress={() => {
            this._handleBack();
          }}
          onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
          navigation={navigation}
          getSelectedDate={(value) => this.setState({selectedDate: value})}
          hideCalendarNBaby={true}
        />
        {isLoading && <LoadingSpinner />}
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <>
            <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle,{color:this.textColor}]}>
              {I18n.t('sleep.duration')}
            </Text>
            {this.renderTimerView()}
            {this.renderFrequency()}
            {showPainLevels && this.getUserDetailsPopup()}
            {showClearCounterAlert && this.showClearCounterPopup()}

            {this.renderBottomView()}
          </>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  appState: state.app.appState,
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
});

const mapDispatchToProps = (dispatch) => ({
  motherTrackingApi: (trackingData) => dispatch(HomeActions.motherTrackingApi(trackingData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContractionScreen);
