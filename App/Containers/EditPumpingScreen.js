import React,{Suspense} from 'react'
import {Dimensions, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {connect} from "react-redux";
import LoadingSpinner from '@components/LoadingSpinner'
import HomeActions from '@redux/HomeRedux';
import Button from "@components/Button";
import CustomOptionSelector from "@components/CustomOptionSelector";
import CustomTextInput from "@components/CustomTextInput";
import Dialog from '@components/Dialog';
import HeaderTrackings from "@components/HeaderTrackings";
import { saveVirtualFreezerDatabase } from "../Database/VirtualFreezerDatabase";
import { deleteFreezerFromDb } from "../Database/VirtualFreezerDatabase";
import Active from '@svg/ic_active';
import Inactive from '@svg/ic_inactive';
import Left from '@svg/ic_text_left.svg'
import Right from '@svg/ic_text_right.svg'
import BreastFeedingIcon from '@svg/ic_breastfeeding.svg'
import BreastFeedingActiveIcon from '@svg/ic_breastfeedingactive.svg'
import PumpIcon from '@svg/ic_pump.svg'
import PumpActiveIcon from '@svg/ic_pumpactive.svg'
import GoodIcon from '@svg/ic_good'
import BadIcon from '@svg/ic_bad'
import I18n from '@i18n';
import {Colors, Constants} from "@resources";
import styles from './Styles/BreastFeedingPumpingScreenStyles';
import RNPickerSelect from "react-native-picker-select";
import {getVolumeMaxValue, getVolumeUnits,volumeConversionHandler} from '@utils/locale';
import moment from "moment";
import {createTrackedItem, deleteTrackingItem} from "../Database/TrackingDatabase";
import KeyUtils from "@utils/KeyUtils";
import TrackingDateTime from "@components/TrackingDateTime";
import EditDuration from "@components/EditDuration";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-simple-toast";
import {uuidV4,appendTimeZone,validateSpecialChracter,formatTimer,timeConvert} from "@utils/TextUtils";
import NavigationService from "@services/NavigationService";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import CustomVolumeSlider from "@components/CustomVolumeSlider";
// import CustomMeasurementView from "@components/CustomMeasurementView";
import { Analytics } from '@services/Firebase';
import { getRealmDb } from '../Database/AddBabyDatabase';

let analytics = new Analytics()
const width = Dimensions.get('window').width
let durationLeftSec = 0;
let durationRightSec = 0;
let totalSec = 0;

class EditPumpingScreen extends React.Component {

  static navigationOptions = {
    tabBarOptions: {
      tabBarVisible: false,
    }

  };
  endingPumpingSideList = [
    {
      label: I18n.t('breastfeeding_pump.both'),
      value: 3,
    },
    {
      label: I18n.t('breastfeeding_pump.left'),
      value: 1,
    },
    {
      label: I18n.t('breastfeeding_pump.right'),
      value: 2,
    },
  ];
  duration = [
    {
      label: I18n.t('bottle_tracking.total'),
      value: '0',
      min: '0',
      sec: '0',
      hour: '0',
      totalMin: '0',
      totalSec: '0',
      ref1:React.createRef(),
      ref2:React.createRef(),
      ref3:React.createRef()
    }
  ];

  experienceList = [
    {
      label: I18n.t('breastfeeding_pump.good'),
      value: I18n.t('breastfeeding_pump.good'),
      Icon: GoodIcon,
      iconWidth: 20,
      iconHeight: 20,
      activeIconFill: 'white',
      InActiveIconFill: Colors.rgb_898d8d
    }, {
      label: I18n.t('breastfeeding_pump.bad'),
      value: I18n.t('breastfeeding_pump.bad'),
      Icon: BadIcon,
      iconWidth: 20,
      iconHeight: 20,
      activeIconFill: 'white',
      InActiveIconFill: Colors.rgb_898d8d
    }];
  bottleBagOption = [{
    label: I18n.t('breastfeeding_pump.bottle'),
    value: I18n.t('breastfeeding_pump.bottle'),
  }, {
    label: I18n.t('breastfeeding_pump.bag'),
    value: I18n.t('breastfeeding_pump.bag'),
  }];


  fridgeFreezerOption = [{
    label: I18n.t('breastfeeding_pump.fridge'),
    value: I18n.t('breastfeeding_pump.fridge'),
  }, {
    label: I18n.t('breastfeeding_pump.freezer'),
    value: I18n.t('breastfeeding_pump.freezer'),
  }];
  volumeList = [{
    label: I18n.t('breastfeeding_pump.total'),
    label2: '0 ml',
    value: 'Both',
  }, {
    label: `${I18n.t('breastfeeding_pump.left')}`,
    label2: '0 ml',
    value: 'Left',
  },
    {
      label: I18n.t('breastfeeding_pump.right'),
      label2: '0 ml',
      value: 'Right',
    }];

  constructor(props) {
    super(props);
    let remark=this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.item && this.props.navigation.state.params.item.remark?this.props.navigation.state.params.item.remark:'';
    this.state = {
      showExistingInventoryAlert:false,
      isLoading: false,
      leftStopwatchStart: false,
      leftStopwatchValue: '',
      leftGetCurrentTime: 0,
      leftGetEndTime: 0,
      showClearCounterAlert:false,
      showDeleteTrackingAlert:false,
      rightStopwatchStart: false,
      rightStopwatchValue: '',
      rightGetCurrentTime: 0,
      rightGetEndTime: 0,
      durationList:this.duration,
      isBreastFeedingSelected: true,
      noteTextInput: remark,
      heightArray: [],
      volumeLeftCount: '0',
      volumeRightCount: '0',
      volumeTotalCount: '0',
      showVolumeAlert: false,
      volumeCount: '0',
      isVolumeSelectedIndex: -1,
      showCalendarPicker: false,
      selectedDate:moment(this.props.navigation.state.params.item.trackAt).format(),
      volumeList: [...this.volumeList],
      babyId: '',
      location: -1,
      containerType: -1,
      defaultFeedingIndex:1,
      inventoryObj:props.navigation.state.params.item,
      /*defaultFeedingIndex: this.props.navigation.state.params.isLeftPress ? 0 : 1,*/
      defaultPumpingIndex: 0,
      isInvenoryAvailable: props.navigation.state.params.item.inventory == undefined || props.navigation.state.params.item.inventory.isConsumed === false ? true : false,
      unit:'',
      maxVolumeValue:0,
      isUnit:'',
      isImperial:'',
      pumpLevel: 0,
      phaseLevel: 0,
      rhythemLevel: 0,
      isFlex : false,
      mPumpId : false,
      saveToVirtualStorage:false,
      fridgeSelected: 0,
      bottleSelected: 0,
      number: '',
      tray: '',
      bottleBagNumber: -1,
      trayNumber: '',
      showErrorPrompt: false,
      errorMessage:'',
      durationErrorMessageDialogVisible:false,
      showBadArticles: false,
      changedDate:undefined,
      durationValue:undefined,
      sliderValue:0,
      isFocus:false,
      timeCalendarDate:moment(),
      disableButton:false,
      isDateChanged:false,
      accuracy:true,
      CustomMeasurementView:()=><></>,
      CustomVolumeSlider:()=><></>
    }
    this.totalVolumeCount = 0
    this.leftVolumeCount = 0
    this.rightVolumeCount = 0

    this.badSessionIndex = 0
    this.lastBreastIndex = -1
    this.lastBreastPumpingIndex = 0

    this.handleRightStopWatchValue = this.handleRightStopWatchValue.bind(this)
    this.handleLeftStopWatchValue = this.handleLeftStopWatchValue.bind(this)
    this.handleChangeValue = this.handleChangeValue.bind(this)
    this.editDuration=React.createRef()
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }
  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    //console.log('navigation.state.params.item----',this.props.navigation.state.params)
    let freezerDb = await getRealmDb()
    this.userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    this.setState({freezerDb})
    Promise.all([getVolumeUnits(), getVolumeMaxValue()]).then((values) => {
      this.setState({unit: values[0], maxVolumeValue: values[1]})
    })

    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL}, () => {
          const {navigation} = this.props;
          const {amountTotalUnit, amountTotal,amountLeft,amountRightUnit,amountLeftUnit,amountRight} = navigation.state.params.item;
          let list=this.volumeList
          list=list.map((e)=>({...e,label2:`0 ${_units === KeyUtils.UNIT_IMPERIAL?"oz":"ml"}`}))
          let volumeCount=0
          if (amountTotal!=undefined){
            const {convertedVolume , convertedVolumeUnit} = volumeConversionHandler(this.state.isImperial, amountTotalUnit, amountTotal);
            volumeCount=convertedVolume
            list[0].label2=`${convertedVolume} ${convertedVolumeUnit}`
          }
          if (amountRight!=undefined){
            const{convertedVolume , convertedVolumeUnit} = volumeConversionHandler(this.state.isImperial,amountRightUnit,amountRight);
            list[2].label2=`${convertedVolume} ${convertedVolumeUnit}`
            this.rightVolumeCount=convertedVolume
          }
          if (amountLeft!=undefined){
            const{convertedVolume , convertedVolumeUnit} = volumeConversionHandler(this.state.isImperial,amountLeftUnit,amountLeft);
            list[1].label2=`${convertedVolume} ${convertedVolumeUnit}`
            this.leftVolumeCount=convertedVolume
          }
          this.totalVolumeCount=amountTotal
          this.setState({volumeList: list,volumeCount: volumeCount,sliderValue:volumeCount})

        });
      }
    });

    const {navigation}=this.props
    const {babyId,trackAt,lastBreast, isBadSession, remark, inventory, savedMilk, deviceLevel, devicePattern, devicePhase} = navigation.state.params.item
    let {durationTotal}=navigation.state.params.item;
    let a = moment();//now
    let b = moment(trackAt);
    let diff=a.diff(b, 'days')
    if (inventory) {
      const {tray, number, containerType, location} = inventory
      this.setState({saveToVirtualStorage: true, trayNumber: tray, number, containerType, location})
    } else {
      this.setState({saveToVirtualStorage: false,isVirtualFreezerDisable:savedMilk?savedMilk:diff>=1,})
    }
    this.setState({
      babyId,
      selectedDate:trackAt,
      noteTextInput:remark===undefined?'':remark,
    })
    // this.setState({babyId,selectedDate:trackAt,noteTextInput:remark, volumeCount:amountTotal})
    let lastBreastIndex=this.endingPumpingSideList.findIndex((e)=>{
      return e.value==lastBreast
    })
    const {pumpId} = navigation.state.params.item;
    const {durationList}=this.state
    const {rhours,rminutes,rSeconds}=timeConvert(durationTotal)
    durationList[0].hour=formatTimer(rhours)
    durationList[0].min=formatTimer(rminutes)
    durationList[0].sec=formatTimer(rSeconds)
    durationList[0].totalSec=durationTotal+''
    if(pumpId!=="" && pumpId!==undefined){
      this.setState({mPumpId:true})
    }
    this.lastBreastPumpingIndex=lastBreastIndex>-1?lastBreastIndex:0
    this.badSessionIndex=isBadSession?1:0
    this.setState({
      defaultPumpingIndex:this.lastBreastPumpingIndex,
      durationList,
      durationValue:{
        selectedDate:moment(trackAt),
        startTime:moment(trackAt),
        endTime:moment(trackAt).add({hours:parseInt(formatTimer(rhours)),minutes:parseInt(formatTimer(rSeconds))>30? parseInt(formatTimer(rminutes))+1:parseInt(formatTimer(rminutes))})
      }
    })
    //this.setState({defaultPumpingIndex:this.lastBreastPumpingIndex,durationList})
    const CustomVolumeSlider = React.lazy(
      () =>
        new Promise((resolve, reject) =>
          setTimeout(() => resolve(import("@components/CustomVolumeSlider")), 0)
        )
    );
    const CustomMeasurementView = React.lazy(
      () =>
        new Promise((resolve, reject) =>
          setTimeout(() => resolve(import("@components/CustomMeasurementView")), 0)
        )
    );
    this.setState({CustomMeasurementView,CustomVolumeSlider})
    await analytics.logScreenView('edit_pumping_screen')
  }

  timeConvert(seconds) {
    let  rSec,rMinus
    if (seconds===3600){
      rMinus='60'
      rSec='00'
    }else{
      rSec = `0${(seconds % 60)}`.slice(-2)
      let min = `${Math.floor(seconds / 60)}`
      rMinus = `0${min % 60}`.slice(-2)
    }
    return  {rMinus,rSec}
  }

  componentWillUnmount() {
    this.totalVolumeCount = 0
    this.leftVolumeCount = 0
    this.rightVolumeCount = 0

  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {trackingApiSuccess, trackingApiFailure, navigation, deleteTrackingId, deleteTrackingSuccess, deleteTrackingFailure,
      createBottleApiSuccess,createBottleApiFailure,deleteFreezerInventoryApiResponse,deleteFreezerInventoryApiFailure,deleteFreezerInventoryApiSuccess } = this.props;
    if (deleteTrackingSuccess != prevProps.deleteTrackingSuccess && deleteTrackingSuccess && prevState.isLoading) {
      this.setState({isLoading: false})
      deleteTrackingItem(deleteTrackingId)
      const {babyId,id,inventory} = navigation.state.params.item
      if (inventory===null || inventory===undefined){
        this._handleBack()
      }

    }

    if (deleteTrackingFailure != prevProps.deleteTrackingFailure && deleteTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
    if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
      Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
      this.editFreezerDataApi(false)
      /*if((this.props.navigation.state.params && this.props.navigation.state.params.item && this.props.navigation.state.params.item.inventory) || this.state.saveToVirtualStorage) {
        this.editFreezerDataApi(false)
      }else{
        this.setState({isLoading: false})
        navigation.state.params._onSave();
        navigation.goBack()
      }*/


    }
    //todo unit test
    if (createBottleApiSuccess != prevProps.createBottleApiSuccess && createBottleApiSuccess && prevState.isLoading) {
      this.setState({isLoading: false})
      this.saveToVirtualFreezerDb(true)
    }

    if ((prevProps.createBottleApiFailure != createBottleApiFailure) && createBottleApiFailure && prevState.isLoading) {
      this.setState({
        isLoading: false, refreshing: false, noMoreFound: true
      });
    }

    if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
      this.saveTrackingInDb(false)
      this.setState({isLoading: false})
    }

    if ((prevProps.deleteFreezerInventoryApiSuccess != deleteFreezerInventoryApiSuccess) && deleteFreezerInventoryApiSuccess && prevState.isLoading) {
      const {navigation} = this.props
      if (!navigation.state.params.isBleScreen){
        navigation.state.params._onSave();
      }
      navigation.goBack()
      deleteFreezerFromDb(deleteFreezerInventoryApiResponse.successIds[0])

    }

  }

  handleLeftStopWatchValue(obj) {
    const {
      getStartTimeValue,
      stopwatchSelected,
      stopwatchSelectedTimer,
      getEndTimeValue,
    } = obj;

    const {rightStopwatchStart, leftStopwatchStart, isBreastFeedingSelected} = this.state

    if (!isBreastFeedingSelected && !leftStopwatchStart && rightStopwatchStart){
      this.setState({defaultFeedingIndex: 0, defaultPumpingIndex: 0})
    }

    if (!leftStopwatchStart && !rightStopwatchStart) {
      this.setState({defaultFeedingIndex: 0, defaultPumpingIndex: 0})
    }
    if (leftStopwatchStart && rightStopwatchStart) {
      this.setState({defaultFeedingIndex: 1, defaultPumpingIndex: 0})
    }

    if (getStartTimeValue) {
      this.setState({
        leftStopwatchStart: stopwatchSelected,
        leftStopwatchValue: stopwatchSelectedTimer,
        leftGetCurrentTime: getStartTimeValue,
      });
    } else {
      this.setState({
        leftStopwatchStart: stopwatchSelected,
        leftStopwatchValue: stopwatchSelectedTimer,
        leftGetEndTime: getEndTimeValue,
      });
    }


  }


  handleRightStopWatchValue(obj) {
    const {
      getStartTimeValue,
      stopwatchSelected,
      stopwatchSelectedTimer,
      getEndTimeValue,
    } = obj;
    const {rightStopwatchStart, leftStopwatchStart, isBreastFeedingSelected} = this.state

    if (!isBreastFeedingSelected && leftStopwatchStart && !rightStopwatchStart){
      this.setState({defaultFeedingIndex: 0, defaultPumpingIndex: 0})
    }

    if (rightStopwatchStart && leftStopwatchStart) {
      this.setState({defaultFeedingIndex: 0, defaultPumpingIndex: 0})
    }
    if (!leftStopwatchStart && !rightStopwatchStart) {
      this.setState({defaultFeedingIndex: 1, defaultPumpingIndex: 0})
    }


    if (getStartTimeValue) {
      this.setState({
        rightStopwatchStart: stopwatchSelected,
        rightStopwatchValue: stopwatchSelectedTimer,
        rightGetCurrentTime: getStartTimeValue,
      });
    } else {
      this.setState({
        rightStopwatchStart: stopwatchSelected,
        rightStopwatchValue: stopwatchSelectedTimer,
        rightGetEndTime: getEndTimeValue,
      });
    }


  }


  handleChangeValue = (value) => {
    const {isVolumeSelectedIndex, volumeCount, volumeList} = this.state
    let currentValue = parseFloat(value)

    if (isVolumeSelectedIndex == -1) {
      volumeList[0].label2 = `${value} ${this.state.unit}`
      this.totalVolumeCount = currentValue
      this.setState({isVolumeSelectedIndex: 0, volumeList})
    } else {
      let previousCount = parseFloat(volumeCount)
      switch (isVolumeSelectedIndex) {
        case 0:
          this.totalVolumeCount = parseFloat(value).toFixed(2)
          volumeList[isVolumeSelectedIndex].label2 = `${value} ${this.state.unit}`
          volumeList[1].label2 = `${this.totalVolumeCount / 2} ${this.state.unit}`
          volumeList[2].label2 = `${this.totalVolumeCount / 2} ${this.state.unit}`
          this.leftVolumeCount = this.totalVolumeCount / 2
          this.rightVolumeCount = this.totalVolumeCount / 2

          break
        case 2:
          //volumeList[1].label2 = `0 ml`
          this.rightVolumeCount = currentValue
          volumeList[2].label2 = `${this.rightVolumeCount} ${this.state.unit}`
          volumeList[0].label2 = `${currentValue + this.leftVolumeCount} ${this.state.unit}`
          this.totalVolumeCount=currentValue + this.leftVolumeCount
          break
        case 1:

          this.leftVolumeCount = currentValue
          volumeList[1].label2 = `${this.leftVolumeCount} ${this.state.unit}`
          volumeList[0].label2 = `${this.rightVolumeCount + this.leftVolumeCount} ${this.state.unit}`
          this.totalVolumeCount=this.rightVolumeCount + this.leftVolumeCount
          break
      }
      this.setState({isVolumeSelectedIndex: isVolumeSelectedIndex, volumeList})
    }

    this.setState({
      volumeCount: value,
    });
  };
  nearestMaxValue=(maxValue,multiplicity)=>{
    let temp=0;
    while (temp<maxValue) {
      temp+=multiplicity;
    }
    return temp;
  }
  renderVolumeView() {
    const {volumeList, isVolumeSelectedIndex, volumeCount,unit,inventoryObj,isFocus,sliderValue,CustomMeasurementView,CustomVolumeSlider,accuracy} = this.state
    const {savedMilk} = this.props.navigation.state.params.item
    let multiplicityValue = 10
    if(unit === 'oz'){
      multiplicityValue = 0.25
    }

    return <View style={styles.volumeView}>
      <View style={{flex: 1,paddingHorizontal:20}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.total_volume')}</Text>
      </View>

      <View style={[styles.volumeLeftRightView,{paddingHorizontal:20}]}>
        <CustomOptionSelector
          buttonContainerStyle={{width: width / 3 - 24, height: 50, flexDirection: 'column', paddingVertical: 10}}
          data={volumeList}
          defaultSelectedIndex={0}
          onChange={(item, index) => {
            this.setState({isVolumeSelectedIndex: index,defaultPumpingIndex:index})
            this.lastBreastPumpingIndex = index
          }}/>
      </View>
      <Suspense fallback={
        <View style={{height:170}}>
          <LoadingSpinner/>
        </View>
      }>
        {(!savedMilk || (savedMilk && inventoryObj.inventory!==undefined) ) &&
        <CustomVolumeSlider
          multiplicity={multiplicityValue}
          //maxSliderValue={this.state.maxVolumeValue}
          maxSliderValue={this.nearestMaxValue(this.state.maxVolumeValue,multiplicityValue)}
          restrictPoint={this.state.maxVolumeValue}
          //value={volumeCount}
          changeValue={this.handleChangeValue}
          range={unit==='oz'?1:50}
          accuracy={unit === 'oz'?accuracy:true}
          onScrollBeginDrag={()=>{
            if(this.nameRef.isFocused()){
              this.nameRef.blur();
            }
            this.setState({accuracy:false})
          }}
          decimalPlaces={unit==='oz'?2:0}
          value={sliderValue}
          numberColor={this.textColor}
        />
        }
        {(!savedMilk || (savedMilk && inventoryObj.inventory !== undefined)) &&
        <CustomMeasurementView
          //value={volumeCount}
          maxValue={this.state.maxVolumeValue}
          //textInputValue={(value) => this.setState({volumeCount: value})}
          // disabled={renderSlider}
          units={I18n.t(`units.${(this.state.unit).toLowerCase()}`)}
          inputRef={(input)=>{ this.nameRef = input }}
          onBlur={()=>{
            this.setState({isFocus:false,accuracy:false})
          }}
          onFocus={()=>{
            this.setState({isFocus:true,sliderValue:volumeCount,accuracy:true})
          }}
          textInputValue={(value)=>{
            let temp=parseFloat(value==''||value==undefined?0:value)
            this.setState({sliderValue:isNaN(temp)?0:temp})
          }}
          value={isFocus?sliderValue+'':volumeCount+''}
        />
        }
      </Suspense>
    </View>
  }
  renderDurationView() {
    const {durationList,unit} = this.state
    let multiplicityValue = 1
    if(unit === 'oz'){
      multiplicityValue = 0.25
    }

    return <View style={[styles.volumeView,{paddingHorizontal:20}]}>
      <View style={{flex: 1,}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.duration')}</Text>
      </View>

      <View style={styles.volumeLeftRightView}>
        <EditDuration
          ref={this.editDuration}
          isEditable={true}
          timerTypeStyle={true}
          buttonContainerStyle={{ height: 50, flexDirection: 'column', paddingVertical: 10,justifyContent:'center',}}
          data={durationList}
          defaultSelectedIndex={-1}
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
            durationList[index].hour=hours+''
            durationList[index].min=minute+''
            durationList[index].sec=seconds+''
            durationList[index].totalMin=totalMin+''
            durationList[index].totalSec=TotalSec+''
            this.setState({durationList:durationList},()=>{
              callback!=undefined&&callback()
            })
          }}/>
      </View>
    </View>
  }

  renderSessionType() {
    const {navigation} = this.props
    const {isBreastFeedingSelected, isPumpSelected} = this.state

    return <View style={styles.sessionTypeView}>
      <View style={{flex: 1,}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.session_type')}</Text>
      </View>

      <View style={[styles.sessionRightView, {flex: 1}]}>
        <View>
          <TouchableOpacity onPress={() => this.setState({isBreastFeedingSelected: true})}
                            style={styles.breastFeedingViewStyle}>
            {isBreastFeedingSelected ? <BreastFeedingActiveIcon width={60} height={60}/> :
              <BreastFeedingIcon width={60} height={60} fill={Colors.rgb_898d8d33}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.breastFeedingTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.breastfeed')}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.setState({isBreastFeedingSelected: false})}
                            style={[styles.breastFeedingViewStyle]}>
            {!isBreastFeedingSelected ? <PumpActiveIcon width={60} height={60}/> : <PumpIcon width={60} height={60}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.breastFeedingTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.pumping')}</Text>
        </View>
      </View>
    </View>
  }

  renderPumpingEndingSide() {

    const {defaultPumpingIndex} = this.state
    return <View style={styles.endingSideView}>
      <View style={{flex: 1}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.ending_side')}</Text>
      </View>

      <View style={styles.sessionRightView}>
        <CustomOptionSelector
          buttonContainerStyle={{width: 63}}
          defaultSelectedIndex={defaultPumpingIndex}
          data={this.endingPumpingSideList} onChange={(item, index) => this.lastBreastPumpingIndex = index}/>
      </View>
    </View>
  }

  renderExperienceView() {
    const {isBreastFeedingSelected, isPumpSelected} = this.state
    return <View style={styles.endingSideView}>
      <View style={{flex: 1.5}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.experience')}</Text>
      </View>

      <View style={styles.sessionRightView}>

        <CustomOptionSelector data={this.experienceList}
                              buttonContainerStyle={{width: 100}}
                              defaultSelectedIndex={this.badSessionIndex}
                              onChange={(item, index) => this.addExperience(index)}/>

      </View>
    </View>
  }

  async addExperience(index){
    let neverShowArticles =  await AsyncStorage.getItem(KeyUtils.NEVER_SHOW_BAD_ARTICLES)
    if(index === 1 && !neverShowArticles){
      this.setState({ showBadArticles: true })
    }
    this.badSessionIndex = index;
  }

  getHeight() {
    let arr = []
    for (let i = 1; i < 45; i++) {
      let obj = {
        label: (i) + ' inch',
        value: (i).toString(),
      }
      arr.push(obj)
    }
    this.setState({heightArray: arr})
  }

  renderPumpSettingsView() {
    const {navigation} = this.props
    const {isBreastFeedingSelected, heightArray, isPumpSelected} = this.state
    return <View style={styles.endingSideView}>
      <View style={{flex: 2}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.pump_settings')}</Text>
      </View>

      <View style={styles.sessionRightView}>
        <View style={styles.pickerContainer}>

          <RNPickerSelect
            pickerProps={{
              style: {
                ...Platform.select({
                  android: styles.pickerInput,
                  ios: {
                    height: 214,
                  },
                }),
                overflow: 'hidden',
              }
            }}
            onValueChange={(value) => this.setState({babyHeight: value})}
            style={{
              iconContainer: {
                top: 20,
                right: 10,
              },
              inputIOS: styles.pickerInput,
              done: {color: Colors.rgb_fecd00},
              placeholder: {color: Colors.rgb_898d8d}
            }}
            placeholder={{
              label: I18n.t('addBaby.babyHeight'),
              value: null,
            }}
            placeholderTextColor={Colors.rgb_898d8d}
            items={heightArray}
            value={this.state.babyHeight}
            displayValue={true}
          />

        </View>
        <View style={styles.pickerContainer}>

          <RNPickerSelect
            pickerProps={{
              style: {
                ...Platform.select({
                  android: styles.pickerInput,
                  ios: {
                    height: 214,
                  },
                }),
                //overflow: 'hidden',
              }
            }}
            onValueChange={(value) => this.setState({babyHeight: value})}
            style={{
              iconContainer: {
                top: 20,
                right: 10,
              },
              inputIOS: styles.pickerInput,
              done: {color: Colors.rgb_fecd00},
              placeholder: {
                color: 'red'

              }
            }}
            placeholder={{
              label: I18n.t('addBaby.babyHeight'),
              value: null,
            }}
            placeholderTextColor={Colors.rgb_da7015}
            items={heightArray}
            value={this.state.babyHeight}
            displayValue={true}
          />

        </View>


      </View>


    </View>
  }

  _onDateChange = (date) => {
    this.setState({
      selectedDate: date
    });
  }

  positiveOnPress = () => {
    this.setState({
      showCalendarPicker: false
    });
  }

  negativeOnPress = () => {
    this.setState({
      selectedDate: new Date(),
      showCalendarPicker: false
    });
  }

  async handleCancel() {
    let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
    if(lastSession==='Start breastfeeding' || lastSession==='Pause breastfeeding'|| lastSession==='Continuebreastfeeding'|| lastSession==='StopBreastfeeding' || lastSession=== 'Stop Pumping' || lastSession=== 'Start Pumping' ){
      AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, '')
    }
    this.setState({ showDeleteTrackingAlert:true})
  }
  renderBottomView() {
    const {rightStopwatchStart, noteTextInput,totalVolume,leftStopwatchStart,saveToVirtualStorage} = this.state
    const {inventory,savedMilk}=this.props.navigation.state.params.item

    let isDisable=(saveToVirtualStorage && (totalVolume==0 ))
    return <View style={{paddingHorizontal:20}}>
      <CustomTextInput
        maxLength={1000}
        value={noteTextInput + ''}
        textContentType="familyName"
        onChangeText={(index, value) => this.setState({noteTextInput: value})}
        placeholder={I18n.t('breastfeeding_pump.add_note')}
        placeholderTextColor={this.textColor}
        textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
        multiline={true}
        enableDoneButton={true}/>

      <View style={styles.cancelSaveView}>
        {(!savedMilk || (savedMilk && inventory)) && <Button
          title={I18n.t('generic.delete').toUpperCase()} textStyle={styles.cancelTextStyle}
          onPress={() => this.handleCancel()}
          style={styles.cancelButtonStyles}/>
        }

        <Button
          // disabled={isDisable}
          disabled={(this.state.isFrom === 'bluetooth' && isFlex && this.flexDataList.length === 0)|| this.state.disableButton}
          title={I18n.t('generic.save').toUpperCase()} textStyle={styles.saveTextStyle} onPress={() => {
          this.handleVolumeValidation()
        }}
          style={[styles.saveButtonStyles, (isDisable) ? { opacity: 0.5 } : {opacity: 1}]} />
      </View>
    </View>
  }

  getSelectedBabyDetails(item) {
    //Baby's data
    this.setState({babyId: item.babyId})
  }


  showVolumeDialog() {
    const {showVolumeAlert} = this.state
    return (
      <Dialog
        visible={showVolumeAlert}
        title={I18n.t('volume_popup.title')}
        message={I18n.t('volume_popup.message')}
        positive={I18n.t('volume_popup.add_amount')}
        negative={I18n.t('volume_popup.save_without_amount')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showVolumeAlert: false})
          if (this.state.saveToVirtualStorage) {
            if (this.handleFreezerValidations()) {
              this.handleValidations()
            }
          }
          else {
            this.handleValidations()
          }
        }}
        positiveOnPress={() => {
          this.setState({showVolumeAlert: false})
        }}
        neutral={I18n.t('volume_popup.never_show_again')}
        neutralPress={() => {
          AsyncStorage.setItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN, 'true');
          this.setState({showVolumeAlert: false})
          if (this.state.saveToVirtualStorage) {
            if (this.handleFreezerValidations()) {
              this.handleValidations()
            }
          }
          else {
            this.handleValidations()
          }
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
          const {deleteTrackingApi, navigation} = this.props
          const {babyId,id,inventory} = navigation.state.params.item
          this.setState({showDeleteTrackingAlert: false, isLoading: true})
          deleteTrackingApi(id,babyId)
          console.log('inventoy--',inventory,inventory!==undefined)
          if(inventory!=null && inventory!==undefined){
            this.props.deleteFreezerInventoryApi(inventory.id)
          }
        }}
        onDismiss={() => {
        }}
      />
    )
  };
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

  showBLEDetail() {
    const {navigation} = this.props
    const {isFlex} = this.state
    const {deviceLevel, devicePhase, devicePattern} = navigation.state.params.item;

    return (
      <View style={[styles.bleContainer,{marginTop:20}]}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.pump_setting')}</Text>
        <View style={styles.bleDataContainer}>
          <View style={styles.pumpLevelViewStyle}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.pump_level')} : {(isFlex && deviceLevel===0)?3:deviceLevel}</Text>
          </View>
          <View style={styles.phaseLevelViewStyle}>
            {/*<Simulation/>*/}
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.phase')}</Text>
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{Constants.PUMP_PHASE[devicePhase]}</Text>
          </View>
          <View style={styles.rhythemLevelViewStyle}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.rhythm')}</Text>
            <Text maxFontSizeMultiplier={1.7} style={[styles.pumpSettingSubLableStyle,{color:this.textColor}]}>{devicePattern ? Constants.PUMP_RHYTHEM[devicePattern] : Constants.PUMP_RHYTHEM[0]}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderVirtualFreezer() {
    const {navigation} = this.props
    const {number,trayNumber,location, containerType} = this.state
    const {inventory} = this.props.navigation.state.params.item
    return <View style={{marginTop: 10, marginLeft: -5}}>
      <View style={{flex: 2}}>
      </View>
      <View style={styles.bottleBagView}>
        <CustomOptionSelector
          isTappable={inventory}
          buttonContainerStyle={styles.freezerButtonContainer}
          defaultSelectedIndex={containerType > 0 ? containerType == 2 ? 1 : 0 : containerType}
          data={this.bottleBagOption} onChange={(item, index) => {
          index === 1 ? this.setState({containerType: 2}) : this.setState({containerType: 1})
        }}/>
        <View style={{flex: 1, height: 50,}}>
          <CustomTextInput
            inputStyle={[styles.numberTextInput,{color:this.textColor}]}
            style={{height: 30}}
            maxLength={3}
            value={number + ''}
            textContentType="postalCode"
            placeholder={I18n.t('breastfeeding_pump.number')}
            placeholderTextColor={Colors.rgb_898d8d_6}
            textStyles={[styles.numberTextInput,{color:this.textColor}]}
            editable={!inventory}
            onChangeText={(index, value) => {
              if (value>250){
                this.setState({showErrorPrompt: true,errorMessage:I18n.t('virtual_freezer.number_limit_msg')})
                this.setState({number:value>250?'':value})
              }
              else if(validateSpecialChracter(value.toString())){
                this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.container_special_character_error')})
                this.setState({number:validateSpecialChracter(value.toString())===true?'':value})
              }
              else{
                this.setState({number:value})
              }
            }}
          />
        </View>
      </View>

      <View style={styles.fridgeFreezerView}>
        <CustomOptionSelector
          isTappable={inventory}
          buttonContainerStyle={styles.freezerButtonContainer}
          defaultSelectedIndex={location > 0 ? location == 2 ? 1 : 0 : location}
          data={this.fridgeFreezerOption} onChange={(item, index) => {
          index === 1 ? this.setState({ location: 2 }) : this.setState({ location: 1 })
        }}/>
        <View style={{ flex: 1, height: 50, }}>
          <CustomTextInput
            inputStyle={[styles.numberTextInput,{color:this.textColor}]}
            style={{height: 30}}
            maxLength={3}
            value={trayNumber + ''}
            editable={!inventory}
            textContentType="postalCode"
            placeholder={I18n.t('breastfeeding_pump.tray')}
            placeholderTextColor={Colors.rgb_898d8d_6}
            textStyles={[styles.numberTextInput,{color:this.textColor}]}
            onChangeText={(index, value) => {
              if (value>250){
                this.setState({showErrorPrompt: true,errorMessage:I18n.t('virtual_freezer.tray_limit_msg')})
                this.setState({trayNumber:value>250?'':value})
              }
              else if(validateSpecialChracter(value.toString())){
                this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_special_character_error')})
                this.setState({trayNumber:validateSpecialChracter(value.toString())===true?'':value})
              }
              else{
                this.setState({trayNumber:value})
              }
            }}
          />
        </View>
      </View>
      {this.state.showErrorPrompt && <Text maxFontSizeMultiplier={1.7} style={[styles.volumeCountTextStyles, {
        color: 'red',
        marginTop: 15
      }]}>{this.state.errorMessage}</Text>}
      <Text maxFontSizeMultiplier={1.7}
            style={[styles.virtualFreezerTextStyle, { marginBottom: 5 ,color:this.textColor}]}
            onPress={() => this.props.navigation.navigate('CheckAvailableInventory', { isCheckInventory: true })}>
        {I18n.t('breastfeeding_pump.Check_available_inventory')}
      </Text>

    </View>
  }

  renderVirtualFreezerView(){
    const{saveToVirtualStorage,isVirtualFreezerDisable}=this.state
    const {inventory} = this.props.navigation.state.params.item
    const {userProfile}=this.props
    if(userProfile.mother == null ){
      return null
    }
    if (isVirtualFreezerDisable && !inventory){
      return  null
    }
    if (userProfile && userProfile != null && userProfile.mother && userProfile.mother != null &&  !userProfile.mother.vipStatus){
      return null
    }
    return <View style={{paddingHorizontal:20}}>
      <View style={styles.virtualFreezerSaveView}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.virtualFreezerTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.save_to_virtual_freezer')}</Text>
        {!inventory && (saveToVirtualStorage ?
          <Active style={styles.rightArrowStyle} width={45} height={45} onPress={() => {
            this.setState({saveToVirtualStorage: false})
          }}/>
          : <Inactive style={{}} width={45} height={45} onPress={() => {
            this.setState({saveToVirtualStorage: true})
            setTimeout(() => {this.scrollView.scrollToEnd({animated: true})}, 100)

          }}/>)}
      </View>
      {saveToVirtualStorage && this.renderVirtualFreezer()}
    </View>
  }


  _handleBack=()=>{
    const {navigation}=this.props
    if (navigation.state.params.isBleScreen){
      NavigationService.popToTopStack()
      AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
        if (tabName!=null){
          NavigationService.navigate(tabName)
        }else{
          NavigationService.navigate('Baby')
        }
      })
    }else {
      navigation.state.params._onSave();
      navigation.goBack()
    }
  }

  showDurationErrorMessageDialog(){
    const {durationErrorMessageDialogVisible} = this.state
    return <Dialog
      visible={durationErrorMessageDialogVisible}
      title={I18n.t('breastfeeding_pump.duration')}
      message={I18n.t('stats_breastfeeding.error_total_duration')}
      positive={I18n.t('login.ok')}
      isIcon={false}
      positiveOnPress={() => {
        this.setState({ durationErrorMessageDialogVisible: false})
      }}
      onDismiss={() => {
      }}
    />
  }
  setTimer(dateObj){
    const {durationList}=this.state
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
    const {pumpId} = navigation.state.params.item;
    const {changedDate,durationValue,showExistingInventoryAlert, showVolumeAlert,showClearCounterAlert,selectedDate, isLoading,showDeleteTrackingAlert,durationErrorMessageDialogVisible,disableButton} = this.state
    return <KeyboardAwareScrollView extraScrollHeight ={150} ref={ref => {this.scrollView = ref}} style={{flex: 1}}>
      <HeaderTrackings
        isEditable={true}
        hideCalendarIcon={true}
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
        title={I18n.t('breastfeeding_pump.pumping')}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => this._handleBack()}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        //selectedDate={selectedDate}
        durationInLimit={100}
        startEndDetainedValue={changedDate!=undefined?changedDate:durationValue!=undefined?durationValue:undefined}
        selectedDate={changedDate!=undefined?changedDate.selectedDate:selectedDate}
        getSelectedDate={(value,dateObj) => {
          if(dateObj!=undefined&&dateObj.duration.isValid()){
            let a = moment();//now
            let b = moment(value);
            let diff=a.diff(b, 'days')
            this.setTimer(dateObj);
            let date={
              selectedDate:value,
              startTime:dateObj.startTime.format('YYYY-MM-DDTHH:mm'),
              endTime:dateObj.endTime.format('YYYY-MM-DDTHH:mm'),
            }
            this.setState({selectedDate: value,isVirtualFreezerDisable:diff>=1,changedDate:date})
          }
        }}
        calenderIconPressed={async ()=>{
          if(changedDate!=undefined){
            const {changedDate,durationList}=this.state;
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

      {/* <TrackingDateTime date={changedDate==undefined ?selectedDate:changedDate.startTime} time={changedDate==undefined ?selectedDate:changedDate.startTime}/> */}
      {/* <KeyboardAwareScrollView extraScrollHeight ={150} ref={ref => {this.scrollView = ref}} style={{flex: 1}}> */}
        <ScrollView style={styles.container}>
          {isLoading && <LoadingSpinner/>}
          <View style={{marginBottom:20}}>

            {this.renderDurationView()}
            {/*{pumpId!=="" && pumpId!==undefined ? this.renderDurationViewBle() : this.renderDurationView()}*/}
            {pumpId!=="" && pumpId!==undefined && this.showBLEDetail()}
            {this.renderVolumeView()}
            {this.renderPumpingEndingSide()}
            {/*{!isBreastFeedingSelected && this.renderVirtualFreezer()}*/}
            {this.renderExperienceView()}
            {this.renderVirtualFreezerView()}
            {this.renderBottomView()}
            {showVolumeAlert && this.showVolumeDialog()}
            {showClearCounterAlert && this.showClearCounterPopup()}
            {showExistingInventoryAlert && this.showExistingInventoryDialog()}
            {showDeleteTrackingAlert && this.showDeleteTrackingPopup()}
            {durationErrorMessageDialogVisible && this.showDurationErrorMessageDialog()}
          </View>

        </ScrollView>
        <Dialog
          visible={this.state.showBadArticles}
          title={I18n.t('tracking.bad_session_popup_tite')}
          positive={I18n.t('tracking.bad_session_popup_option1')}
          negative={I18n.t('tracking.bad_session_popup_option2')}
          neutral={I18n.t('tracking.bad_session_popup_option3')}
          positiveOnPress={() => {
            this.setState({ showBadArticles: false })
            navigation.navigate("BadSessionArticles");
          }}
          negativeOnPress={() => { this.setState({ showBadArticles: false }) }}
          neutralPress={() => {
            AsyncStorage.setItem(KeyUtils.NEVER_SHOW_BAD_ARTICLES, 'true');
            this.setState({ showBadArticles: false })
          }}
          onDismiss={() => {
          }}
        />
    </KeyboardAwareScrollView>

  }

  showExistingInventoryDialog() {
    const { showExistingInventoryAlert } = this.state
    return (
      <Dialog
        visible={showExistingInventoryAlert}
        title={I18n.t('freezer_popup.title')}
        positive={I18n.t('freezer_popup.ok')}

        isIcon={false}

        positiveOnPress={() => {
          this.setState({ showExistingInventoryAlert: false })
        }}

        onDismiss={() => {
        }}
      />
    )
  };

  handleFreezerValidations() {
    if (this.state.containerType === -1) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.container_type_error')})
      return false
    }

    else if (this.state.location === -1) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.location_type_error')})
      return false
    }
    else if (this.state.number == '') {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.number_error')})
      return false
    }
    else if (this.state.trayNumber === '') {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_error')})
      return false
    }else if (this.state.number == 0) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.number_zero_error')})
      return false
    }
    else if (this.state.trayNumber == 0) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_zero_error')})
      return false
    }
    else{
      return true
    }
  }

  async handleVolumeValidation() {
    const {isBreastFeedingSelected} = this.state
    const {inventory} = this.props.navigation.state.params.item

    if (this.totalVolumeCount < 1) {
      AsyncStorage.getItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN).then(async (value) => {
        if (value !== null) {
          if (inventory) {
            this.handleValidations()
          } else if (this.state.saveToVirtualStorage) {
            if(this.handleFreezerValidations()){
              let entryExist = await this.checkFreezerInventoryAlreadyExist();
              entryExist ? this.setState({showExistingInventoryAlert: true}) : this.handleValidations()
            }
          } else {
            this.handleValidations()
          }
        } else {
          this.setState({showVolumeAlert: true})
        }
      })
    } else {
      if (inventory) {
        this.handleValidations()
      } else if (this.state.saveToVirtualStorage) {
        if(this.handleFreezerValidations()){
          let entryExist = await this.checkFreezerInventoryAlreadyExist();
          entryExist ? this.setState({showExistingInventoryAlert: true}) : this.handleValidations()
        }
      }else {
        this.handleValidations()
      }
    }

  }

  getTotalMin(min,sec){
    return parseInt(min)*60+parseInt(sec)
  }

  async editFreezerDataApi(isSync) {
    const {volumeCount, containerType, location, unit, number, trayNumber, saveToVirtualStorage} = this.state

    if (saveToVirtualStorage) {
      // either user add inventory or user already update the inventory
      let apiObj = {
        trackingMethod: 1,
        location: location,
        tray: parseInt(trayNumber),
        containerType: containerType,         // 1: Bottle, 2: Bag
        number: parseInt(number),         // container number
        amount: parseFloat(volumeCount),
        unit: unit,      // oz, ml
        isConsumed: false,
      };
      if (this.props.navigation.state.params.item.inventory) {
        const {
          id, trackingMethod, trackAt, createdFrom,
          expireAt, movedAt, isConsumed, consumedBy, consumedAt, isExpired
        } = this.props.navigation.state.params.item.inventory
        apiObj.id = id
        apiObj.trackAt = trackAt
        apiObj.createdFrom = createdFrom
        apiObj.consumedBy = consumedBy
        apiObj.consumedAt = consumedAt
        apiObj.isExpired = isExpired
        apiObj.expireAt = expireAt
        apiObj.movedAt = movedAt
        //apiObj.
      } else {
        let expire = location == 1 ? moment().add(3, 'days').format() : moment().add(6, 'months').format()
        apiObj.id = uuidV4()
        apiObj.trackAt = moment().format()
        apiObj.createdFrom = this.props.navigation.state.params.item.id
        apiObj.consumedBy = ""
        apiObj.consumedAt = ""
        apiObj.isExpired = false
        apiObj.expireAt = expire
        apiObj.movedAt = ""
      }
      this.inventoryObj = JSON.parse(JSON.stringify(apiObj))
      let bottleData = Object.assign({milkInventories: [apiObj]});
      console.log('bottleData---- >>', JSON.stringify(bottleData))
      this.props.createBottleApi(bottleData)
      this.saveFreezerPumpingDataInDb(isSync)
    } else {
      // either user delete the inventory  or inventory does not exist
      this.saveTrackingInDb(true)
      const {navigation} = this.props
      this._handleBack()
      /*if (!navigation.state.params.isBleScreen){
        navigation.state.params._onSave();
      }
      navigation.goBack()*/
    }
  }


  saveFreezerPumpingDataInDb(isSync) {
    const {volumeCount, containerType, location, tray, number, trayNumber} = this.state
    //expireAt 1: Fridge --> 3 days 2: Freezer --> 6 months
    this.inventoryObj.isDeleted = false
    this.inventoryObj.userId = this.userName
    this.inventoryObj.isSync = isSync
    this.inventoryObj.isMoved = false
    this.trackingObj.inventory = this.inventoryObj
    this.saveTrackingInDb(true)
    this.saveToVirtualFreezerDb(isSync)
  }

  async saveToVirtualFreezerDb(isSync) {
    const {freezerDb} = this.state
    await saveVirtualFreezerDatabase(freezerDb, this.inventoryObj)
    if (isSync) {
      const {navigation} = this.props
      if (navigation.state.params.isBleScreen){
        NavigationService.popToTopStack()
        AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
          if (tabName!=null){
            NavigationService.navigate(tabName)
          }else{
            NavigationService.navigate('Baby')
          }
        })
      }else {
        navigation.state.params._onSave();
        navigation.goBack()
      }
    }
  }


  async handleValidations() {
    const {noteTextInput, selectedDate, durationListBle, mPumpId,changedDate} = this.state
    const{navigation}= this.props
    const {trackingType,id, durationTotal, durationLeft, durationRight, pumpId} = navigation.state.params.item
    const {durationList}=this.state
    let totalTimeInSec=0
    if (this.props.babies && this.props.babies.length > 0) {
      console.log('durationList[0].totalSec----',isNaN(durationList[0].totalSec),durationList[0].totalSec)
      if (isNaN(durationList[0].totalSec)){
        alert(I18n.t('calendar.timer_alert'))
        return
      }

      if(parseInt(durationList[0].hour)>1 ||(parseInt(durationList[0].min)>40 && durationList[0].hour===1) ) {
        alert(I18n.t('stats_breastfeeding.error_sleep_duration_min'))
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

      totalTimeInSec=parseInt(durationList[0].totalSec)
      if (totalTimeInSec===0 || totalTimeInSec>6000){
        alert(I18n.t('stats_breastfeeding.error_sleep_duration_total_min'))
        return
      }
      let date;
      if(changedDate!=undefined){
         date = moment(this.state.selectedDate).format();
      }else{
         date = moment(this.state.selectedDate).format();
      }
      let formattedDate = await appendTimeZone(date)
      const {savedMilk, deviceLevel, devicePattern, devicePhase, pumpId, pumpRecordId, goalTime} = navigation.state.params.item
      let obj = {
        "babyId": this.state.babyId,
        "id":id ,
        "trackingType":  KeyUtils.TRACKING_TYPE_PUMPING,
        "trackAt": formattedDate,
        "durationLeft": parseInt(totalTimeInSec)/2,
        "durationRight": parseInt(totalTimeInSec)/2,
        "durationTotal": parseInt(totalTimeInSec),
        "confirmed": true,
        "remark": noteTextInput===undefined?'':noteTextInput.toString().trim(),
        "quickTracking": true,
        "savedMilk":savedMilk?savedMilk:this.state.saveToVirtualStorage
      }
      obj['amountLeft'] = parseFloat(this.leftVolumeCount)
      obj['amountLeftUnit'] = this.state.unit
      obj['amountRight'] = parseFloat(this.rightVolumeCount)
      obj['amountRightUnit'] = this.state.unit
      obj['amountTotal'] = parseFloat(this.totalVolumeCount)
      obj['amountTotalUnit'] = this.state.unit
      if (this.badSessionIndex > -1) {
        obj['isBadSession'] = this.badSessionIndex === 1
      }
      if(pumpId!=="" && pumpId!==undefined){
        obj['pumpId'] = pumpId
        obj['pumpRecordId'] = pumpRecordId
        console.log('devicePattern----',devicePattern)
        if(devicePattern===undefined) {
          obj['deviceLevel'] = parseInt(deviceLevel)
          obj['devicePhase'] = parseInt(devicePhase)
        }else{
          obj['deviceLevel'] = parseInt(deviceLevel)
          obj['devicePhase'] = parseInt(devicePhase)
          obj['devicePattern'] = parseInt(devicePattern)
          obj['goalTime'] = parseInt(goalTime)
        }
      }
      obj['lastBreast'] = this.endingPumpingSideList[this.lastBreastPumpingIndex].value
      // if (navigation.state.params.item.inventory !== undefined) {
      //   const new_obj = { ...navigation.state.params.item.inventory, amount: this.state.volumeCount}
      //
      //   obj['savedMilk'] = true
      //  // obj['inventory'] = new_obj
      // }
      this.trackingObj = obj
      console.log('thistrackingObj---', this.trackingObj)

      let json = {
        "trackings": [this.trackingObj]
      }
      const {isInternetAvailable,trackingApi}=this.props
      if (isInternetAvailable){
        this.setState({isLoading: true});
        trackingApi(json);
      }else {
        this.saveTrackingInDb(false)
      }
      /*if (this.state.saveToVirtualStorage) {
        //Add DB entry in Inventory
        this.saveFreezerPumpingDataInDb(false)
      }*/
    }
  }


  async checkFreezerInventoryAlreadyExist() {
    const {freezerDb} = this.state
    let myItems = freezerDb.objects('VirtualFreezerSchema');
    /*let inventoryName = myItems.filtered(
      `number = ${this.state.number} && containerType = ${this.state.containerType}  && isConsumed=${false} && userId=${userName}` );*/
    let inventoryName=myItems.filter((item)=>{
      return item.userId==this.userName && item.number==this.state.number && item.containerType==this.state.containerType && item.isConsumed == false
    })
    return inventoryName.length>0
  }

  async saveTrackingInDb(isSync){
    this.trackingObj.isSync= isSync
    this.trackingObj.userId= this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r)=>{
      console.log('result--',r)
      /*  Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
        this.props.navigation.goBack()*/
      if (!this.props.isInternetAvailable) {
        this._handleBack()
      }
    })
    let lastSession=  await AsyncStorage.getItem(KeyUtils.LAST_SIRI_SESSION)
    if(lastSession==='Start breastfeeding' || lastSession==='Pause breastfeeding'|| lastSession==='Continuebreastfeeding'|| lastSession==='StopBreastfeeding' || lastSession=== 'Stop Pumping' || lastSession=== 'Start Pumping' ){
      AsyncStorage.setItem(KeyUtils.LAST_SIRI_SESSION, '')
    }
  }

}

const mapStateToProps = (state) => ({
  isInternetAvailable:state.app.isInternetAvailable,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  deleteTrackingSuccess:state.home.deleteTrackingSuccess,
  deleteTrackingFailure:state.home.deleteTrackingFailure,
  deleteTrackingId:state.home.deleteTrackingId,
  createBottleResponse:state.home.createBottleResponse,
  deleteFreezerInventoryApiResponse:state.home.deleteFreezerInventoryApiResponse,
  deleteFreezerInventoryApiSuccess:state.home.deleteFreezerInventoryApiSuccess,
  deleteFreezerInventoryApiFailure:state.home.deleteFreezerInventoryApiFailure,
  createBottleApiSuccess:state.home.createBottleApiSuccess,
  createBottleApiFailure:state.home.createBottleApiFailure,
  themeSelected: state.app.themeSelected,
})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  deleteTrackingApi: (trackingId, babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId, babyId)),
  deleteFreezerInventoryApi: (id) => dispatch(HomeActions.deleteFreezerInventoryApi('/inventoryId/' + id)),
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
});


export default connect(mapStateToProps, mapDispatchToProps)(EditPumpingScreen);
