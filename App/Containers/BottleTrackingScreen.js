import React, {Component,Suspense} from 'react'
import {Image, Platform, FlatList, ScrollView, Dimensions, Text, TouchableOpacity, View, Animated,BackHandler,RefreshControl} from 'react-native'
import {connect} from "react-redux";
import LoadingSpinner from '@components/LoadingSpinner'
import HomeActions from '@redux/HomeRedux';
import CustomTextInput from "@components/CustomTextInput";
import BreastFeedingIcon from '@svg/ic_breastfeeding.svg'
import BreastFeedingActiveIcon from '@svg/ic_breastfeedingactive.svg'
import MixIcon from '@svg/ic_mix.svg'
import MixActiveIcon from '@svg/ic_mixactive.svg'
import FormulaIcon from '@svg/ic_formula.svg'
import FormulaActiveIcon from '@svg/ic_formulaactive.svg'
import I18n from '@i18n';
import Colors from "../Resources/Colors";
import styles from './Styles/BottleTrackingScreenStyles';
import {uuidV4,appendTimeZone} from "@utils/TextUtils";
import moment from "moment";
import HeaderTrackings from "@components/HeaderTrackings";
import VirtualInventory from "@components/VirtualInventory";
import BottomButtonsView from "@components/BottomButtonsView";
import {getVolumeUnits, getVolumeMaxValue } from '@utils/locale';
import Dialog from '@components/Dialog';
import {createTrackedItem} from "@database/TrackingDatabase";
import KeyUtils from "@utils/KeyUtils";
import SwitchOnIcon from '@svg/ic_switch_on'
import SwitchOffIcon from '@svg/ic_switch_off'
import AsyncStorage from "@react-native-community/async-storage";
import Toast from 'react-native-simple-toast';
import NavigationService from "@services/NavigationService";
import {verticalScale} from "@resources/Metrics";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { I18nManager } from 'react-native';
import Button from "@components/Button";
import { Analytics } from '@services/Firebase';
import { Constants } from '../Resources';

let analytics = new Analytics()
let unit = ''


const fridgeFreezerOption = [{
  label: I18n.t('bottle_tracking.fridge'),
  value: I18n.t('bottle_tracking.fridge'),
}, {
  label: I18n.t('bottle_tracking.freezer'),
  value: I18n.t('bottle_tracking.freezer'),
}];

const fridgeFreezerListOption = [{
  label: I18n.t('bottle_tracking.all'),
  value: 0,
}, {
  label: I18n.t('bottle_tracking.bottle'),
  value: 1,
}, {
  label: I18n.t('bottle_tracking.bag'),
  value: 2,
}];



class BottleTrackingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      milkItemSelectedIndex: -1,
      isLoading: false,
      isMilkSelected: true,
      isMixSelected: false,
      isFormulaSelected: false,
      noteTextInput: '',
      //volumeCount: '0',
      volumeCount: 0,
      showBabyList: false,
      isExpended: false,
      experience: true,
      selectedDate:moment().format(),
      showVolumeAlert:false,
      isSwitchEnabled:true,
      freezerItems: [],
      fridgeSelected: 0,
      bottleSelected: 0,
      trayNumber: '',
      unit:'',
      maxVolumeValue:0,
      deleteId:'',
      refreshing: false,
      noMoreFound: false,
      isVipPackActive:true,
      isFocus:false,
      sliderValue:0,
      CustomVolumeSlider:()=><></>,
      CustomMeasurementView:()=><></>,
      initialCalenderValue:undefined,
      isCalenderValueDetained:false,
      disableButton:false,
      isDateChanged:false,
      timeCalendarDate:moment(),
      accuracy:false
    }
    this.badSessionIndex = 0
    this.lastBreastIndex = -1
    this.pageNumber = 1
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    unit=getVolumeUnits()

  }

 async componentDidMount() {
   const {userProfile}=this.props
   this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
   this.setState({isVipPackActive:userProfile.mother.vipStatus})
   getVolumeUnits().then((unit)=>{
      this.setState({unit})
    })
    getVolumeMaxValue().then((maxVolumeValue)=>{
      console.log('maxVolumeValue---',maxVolumeValue)
      this.setState({maxVolumeValue})
    })

   AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
     if (_units != null) {
       this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL})
     }
   })
   AsyncStorage.getItem(KeyUtils.IS_VIRTUAL_FREEZER).then((_units) => {
     if (_units != null) {
       this.setState({isSwitchEnabled: _units === 'true'})
     }
   })

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
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
    await analytics.logScreenView('bottle_tracking_screen')
  }


  _handleBack=()=>{
    const {navigation}=this.props
    this.setState({disableButton:false})
    if (navigation.state.params.isFreezerTracking){
      navigation.popToTop()
    }else {
      navigation.goBack()
    }
    // setTimeout(()=>{
    AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
      if (tabName!=null){
        NavigationService.navigate(tabName)
      }else{
        NavigationService.navigate('Baby')
      }
    })
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

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {trackingApiSuccess, trackingApiFailure} = this.props
    if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
      this.saveTrackingInDb(true)
    }
    if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
  }


  handleVolumeChangeValue = (value) => {
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
  renderVolumeView(switchVisible = false) {
    const {navigation} = this.props
    const {isMilkSelected, volumeCount,maxVolumeValue,unit,isFocus,sliderValue,CustomMeasurementView,CustomVolumeSlider,accuracy} = this.state
    let multiplicityValue = 10
    unit === 'oz' && (multiplicityValue = .25)
    return <View style={[styles.volumeView]}>

      <Suspense fallback={
        <View style={{height:170}}>
          <LoadingSpinner/>
        </View>
      }>
        <CustomVolumeSlider
          multiplicity={multiplicityValue}
          maxSliderValue={this.nearestMaxValue(maxVolumeValue,multiplicityValue)}
          value={sliderValue}
          restrictPoint={maxVolumeValue}
          //changeValue={this.handleVolumeChangeValue}
          range={unit==='oz'?1:50}
          onScrollBeginDrag={()=>{
            if(this.nameRef.isFocused()){
              this.nameRef.blur();
            }
            this.setState({accuracy:false})
          }}
          changeValue={(volumeCount)=>{this.setState({volumeCount})}}
          decimalPlaces={unit==='oz'?2:0}
          accuracy={unit === 'oz'?accuracy:true}
          numberColor={this.textColor}
        />
      <CustomMeasurementView
        //value={volumeCount}
        maxValue={maxVolumeValue}
        //textInputValue={(value) => this.setState({volumeCount: value})}
        units={I18n.t(`units.${unit.toLowerCase()}`)}
        textInputValue={(value)=>{
          let temp=parseFloat(value==''||value==undefined?0:value)
          this.setState({sliderValue:isNaN(temp)?0:temp})
        }}
        onBlur={()=>{
          this.setState({isFocus:false,accuracy:false})
        }}
        onFocus={()=>{
          this.setState({isFocus:true,sliderValue:volumeCount,accuracy:true})
        }}
        inputRef={(input)=>{ this.nameRef = input }}
        value={isFocus?sliderValue+'':volumeCount+''}
        height={48}
      />
      </Suspense>
    </View>
  }

  renderType() {
    const {navigation} = this.props
    const {isMilkSelected, isPumpSelected, isMixSelected, isFormulaSelected} = this.state

    return <View style={styles.sessionTypeView}>
      <View style={{flex: 0.5,paddingHorizontal:20}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('bottle_tracking.type')}</Text>
      </View>

      <View style={[styles.sessionRightView, {flex: 1.5}]}>
      <View style={{width:0,flexGrow:1,flex:1}}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={I18n.t("accessibility_labels.breast_milk_selector")}
            onPress={() => this.setState({isMilkSelected: true, isMixSelected: false, isFormulaSelected: false})}
            style={styles.breastFeedingViewStyle}>
            {isMilkSelected ? <BreastFeedingActiveIcon width={70} height={70}/> :
              <BreastFeedingIcon width={70} height={70}  fill={'rgba(137,141,141,0.22)'}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.typeTextStyle,{color:this.textColor}]}>{I18n.t('bottle_tracking.breastmilk')}</Text>
        </View>
        <View style={{width:0,flexGrow:1,flex:1}}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={I18n.t("accessibility_labels.mix_milk_selector")}
            onPress={() => this.setState({isMilkSelected: false, isMixSelected: true, isFormulaSelected: false})}
            style={[styles.breastFeedingViewStyle]}>
            {isMixSelected ? <MixActiveIcon width={70} height={70}/> : <MixIcon width={70} height={70}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.typeTextStyle,{color:this.textColor}]}>{I18n.t('bottle_tracking.mix')}</Text>
        </View>
        <View style={{width:0,flexGrow:1,flex:1}}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={I18n.t("accessibility_labels.milk_formula_selector")}
            onPress={() => this.setState({isMilkSelected: false, isMixSelected: false, isFormulaSelected: true})}
            style={[styles.breastFeedingViewStyle]}>
            {isFormulaSelected ? <FormulaActiveIcon width={70} height={70}/> : <FormulaIcon width={70} height={70}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.typeTextStyle,{color:this.textColor}]}>{I18n.t('bottle_tracking.formula')}</Text>
        </View>
      </View>
    </View>
  }

  switchFunc(){
    const {isSwitchEnabled} = this.state
    return(
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={I18n.t("accessibility_labels.virtual_milk_storage_selector")}
        style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
        onPress={()=> {
          AsyncStorage.setItem(KeyUtils.IS_VIRTUAL_FREEZER, !isSwitchEnabled+'');
          this.setState({
            isSwitchEnabled: !isSwitchEnabled
          })
        }}

      >
        {isSwitchEnabled ? <SwitchOnIcon width={verticalScale(48)} height={verticalScale(48)}/> :
          <SwitchOffIcon width={verticalScale(48)} height={verticalScale(48)}/>}
      </TouchableOpacity>
    )
  }

  renderNoteView() {
    return<CustomTextInput
    style={{paddingHorizontal:20,}}
    maxLength={1000}
    maxHeight={50}
    textContentType="familyName"
    onChangeText={(index, value) => this.setState({noteTextInput: value})}
    placeholder={I18n.t('bottle_tracking.add_note')}
    placeholderTextColor={this.textColor}
    textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
    multiline={true}
    enableDoneButton={true}/>
  }

  getSelectedBabyDetails(item) {
 //   this.setState({babyId: item.babyId})
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
          this.handleValidations()
        }}
        positiveOnPress={() => {
          this.setState({showVolumeAlert: false})
        }}
        neutral={I18n.t('volume_popup.never_show_again')}
        neutralPress={() => {
          AsyncStorage.setItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN, 'true');
          this.setState({showVolumeAlert: false})
          this.handleValidations()
        }}
        onDismiss={() => {
        }}
      />
    )
  };
  renderBottomView(){
    return (
      <>
        {/* <BottomButtonsView
        positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
        negativeButtonTitle={I18n.t('generic.cancel').toUpperCase()}
        onNegativePress={() => this._handleBack()}
        onPositivePress={() => this.handleVolumeValidations()}
      /> */}
        <View>
          <View style={styles.cancelSaveView}>
            <Button
              title={I18n.t('generic.cancel').toUpperCase()}
              textStyle={styles.cancelTextStyle}
              onPress={() => this._handleBack()}
              style={styles.cancelButtonStyles}
            />
            <Button
              disabled={this.state.disableButton}
              title={I18n.t('generic.save').toUpperCase()}
              textStyle={styles.saveTextStyle}
              onPress={() => { this.handleVolumeValidations()}}
              style={[styles.saveButtonStyles]}
            />
          </View>
        </View>
      </>
    );
  }

  render() {

    const {isMilkSelected,isDateChanged,timeCalendarDate, isLoading, isMixSelected, isFormulaSelected, showVolumeAlert,isVipPackActive, isSwitchEnabled,isCalenderValueDetained,initialCalenderValue} = this.state
    const {navigation} = this.props
     console.log('isMilkSelected---',isMilkSelected,isSwitchEnabled)

    return <KeyboardAwareScrollView contentContainerStyle={{flexGrow:1}}>
      <HeaderTrackings
        hideCalendarIcon={true}
        timeCalendarDate={timeCalendarDate}
        updateTimeCalendarUIPress={(date,duration)=>{
          this.setState({
            isDateChanged:true,
            timeCalendarDate:date
          })
        }}
        updateValidation={(val)=>{
          this.setState({disableButton:val})
        }}
        title={I18n.t('bottle_tracking.bottle_feeding')}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => this._handleBack()}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        getSelectedDate={(value)=>this.setState({selectedDate:value,isCalenderValueDetained:true}) }
        selectedDate={isCalenderValueDetained==false?initialCalenderValue :undefined}
        calenderIconPressed={()=>{
          if(isCalenderValueDetained===false){
            this.setState({initialCalenderValue: moment().format()});
          }
        }}

      />
        {isLoading && <LoadingSpinner/>}
        {/* <KeyboardAwareScrollView style={{flex: 1}}> */}
      <ScrollView >
        <View style={[styles.container]}>
          {this.renderType()}
{/*          {isSwitchEnabled && isMilkSelected && !isMixSelected && !isFormulaSelected && this.renderVirtualFreezer()}
          {isSwitchEnabled && isMilkSelected && !isMixSelected && !isFormulaSelected && this.renderVirtualFreezerList()}*/}

          {isVipPackActive && isMilkSelected ?
            <View style={styles.freezerHeaderStyle}>
              <Text maxFontSizeMultiplier={1.5} style={[styles.virtualFreezerTextStyle,{color:this.textColor}]}>{I18n.t('bottle_tracking.use_from_virtual_freezer')}</Text>
              {this.switchFunc()}
            </View>:
            <Text maxFontSizeMultiplier={1.5} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('bottle_tracking.use_volume')}</Text>
          }

          {isVipPackActive && isSwitchEnabled && isMilkSelected && !isMixSelected && !isFormulaSelected &&
          <VirtualInventory
            {...this.props}
            title={I18n.t('bottle_tracking.use_from_virtual_freezer')}
            parentStyle={{marginHorizontal:0,paddingHorizontal:20,}}
            switchButton={true}
            isBottleTracking={true} inventoryData={(data)=>{

          }}/>}
          {!isSwitchEnabled && isMilkSelected && !isMixSelected && !isFormulaSelected && this.renderVolumeView(true)}
          {/* {!isSwitchEnabled && isMilkSelected && !isMixSelected && !isFormulaSelected && this.renderExperienceView()} */}
          {!isSwitchEnabled && isMilkSelected && !isMixSelected && !isFormulaSelected && this.renderNoteView()}

          {(isMixSelected || isFormulaSelected || !isVipPackActive) && this.renderVolumeView()}
          {/* {(isMixSelected || isFormulaSelected) && this.renderExperienceView()} */}
          {(isMixSelected || isFormulaSelected  || !isVipPackActive) && this.renderNoteView()}


        </View>
      </ScrollView>
      {/* </KeyboardAwareScrollView> */}
      {showVolumeAlert && this.showVolumeDialog()}
      {(!isVipPackActive || isMixSelected || isFormulaSelected || (isMilkSelected && !isSwitchEnabled)) && this.renderBottomView()}
    </KeyboardAwareScrollView>
  }

  handleVolumeValidations(){
    const {volumeCount} = this.state;
    if(volumeCount>0) {
      this.handleValidations()
    }else{
      AsyncStorage.getItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN).then((value)=>{
        if (value!==null){
          this.handleValidations()
        }else{
          this.setState({showVolumeAlert: true})
        }
      })
    }
  }

  async handleValidations() {
    const {noteTextInput, isMilkSelected, isMixSelected, isFormulaSelected, volumeCount,selectedDate ,amountTotalUnit , unit,isCalenderValueDetained,timeCalendarDate} = this.state
    const {babies,selected_baby}=this.props
    const {babyId}=selected_baby
    this.setState({disableButton:true})
    if (babies && babies.length > 0) {
      // let formattedDate=await appendTimeZone(isCalenderValueDetained===true?selectedDate:new Date())
      let formattedDate=await appendTimeZone(timeCalendarDate)
      this.trackingObj = {
          "amountTotal":parseFloat(volumeCount),
          "amountTotalUnit":unit,
          "babyId": babyId,
          "isBadSession": false,
          "confirmed": true,
          "feedType": 1,
          "remark": noteTextInput.toString().trim(),
          "quickTracking": false,
          "trackAt": formattedDate,
          "id": uuidV4(),
          "trackingType": KeyUtils.TRACKING_TYPE_BOTTLE
        }
        if (isMilkSelected) {
          this.trackingObj.feedType = 1
        }
        if (isMixSelected) {
          this.trackingObj.feedType = 3
        }
        if (isFormulaSelected) {
          this.trackingObj.feedType = 2
        }


      // for handle
      let json = {
        trackings: [this.trackingObj],
      };
      let param = {
        'interaction':'milk_consumed_from_bottle',
      }
      await analytics.logEvent(Constants.VIRTUAL_FREEZER, param);  // Firebase event for Users using milk from Virtual Milk Storage in Bottle feeding session
      const {isInternetAvailable,trackingApi}=this.props
      if (isInternetAvailable){
        this.setState({isLoading: true});
        trackingApi(json);
      }else {
        this.saveTrackingInDb(false)
      }

    }
  }

  saveTrackingInDb(isSync){
    this.trackingObj.isSync= isSync
    this.trackingObj.userId= this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r)=>{
      Toast.show(I18n.t("tracking.tracking_toaster_text"), Toast.SHORT);
      this._handleBack()
    })
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
  deleteFreezerInventoryApiResponse: state.home.deleteFreezerInventoryApiResponse
})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
});


export default connect(mapStateToProps, mapDispatchToProps)(BottleTrackingScreen);
