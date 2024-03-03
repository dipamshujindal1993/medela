import React,{Suspense} from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {connect} from "react-redux";
import LoadingSpinner from '@components/LoadingSpinner'
import HomeActions from '@redux/HomeRedux';
import TrackingDateTime from "@components/TrackingDateTime";
import CustomOptionSelector from "@components/CustomOptionSelector";
import CustomTextInput from "@components/CustomTextInput";
import BreastFeedingIcon from '@svg/ic_breastfeeding.svg'
import BreastFeedingActiveIcon from '@svg/ic_breastfeedingactive.svg'
import MixIcon from '@svg/ic_mix.svg'
import MixActiveIcon from '@svg/ic_mixactive.svg'
import FormulaIcon from '@svg/ic_formula.svg'
import FormulaActiveIcon from '@svg/ic_formulaactive.svg'
import BottleIcon from '@svg/ic_bottle'
import SelectedIcon from '@svg/ic_item_selected'
import I18n from '@i18n';
import Colors from "../Resources/Colors";
import styles from './Styles/BottleTrackingScreenStyles';
import {appendTimeZone} from "@utils/TextUtils";
import moment from "moment";
import HeaderTrackings from "@components/HeaderTrackings";
import BottomButtonsView from "@components/BottomButtonsView";
import {getVolumeMaxValue, getVolumeUnits,ozToMl,mlToOz} from '@utils/locale';
import Dialog from '@components/Dialog';
import {createTrackedItem, deleteTrackingItem} from "../Database/TrackingDatabase";
import KeyUtils from "@utils/KeyUtils";
import SwitchOnIcon from '@svg/ic_switch_on'
import SwitchOffIcon from '@svg/ic_switch_off'
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-simple-toast";
import {volumeConversionHandler} from "@utils/locale";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
//import CustomVolumeSlider from '@components/CustomVolumeSlider';
//import CustomMeasurementView from "@components/CustomMeasurementView";
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

class EditBottleTrackingScreen extends React.Component {

   fridgeFreezerOption = [{
    label: I18n.t('bottle_tracking.fridge'),
    value: I18n.t('bottle_tracking.fridge'),
  }, {
    label: I18n.t('bottle_tracking.freezer'),
    value: I18n.t('bottle_tracking.freezer'),
  }];

   fridgeFreezerListOption = [{
    label: I18n.t('bottle_tracking.all'),
    value: I18n.t('bottle_tracking.all'),
  }, {
    label: I18n.t('bottle_tracking.bottle'),
    value: I18n.t('bottle_tracking.bottle'),
  }, {
    label: I18n.t('bottle_tracking.bag'),
    value: I18n.t('bottle_tracking.bag'),
  }];

  constructor(props) {
    super(props);
    let remark=this.props.navigation.state.params&&this.props.navigation.state.params.item&&this.props.navigation.state.params.item.remark?this.props.navigation.state.params.item.remark:'';
    this.state = {
      milkItemSelectedIndex: -1,
      isLoading: false,
      isMilkSelected: false,
      showDeleteTrackingAlert:false,
      isMixSelected: false,
      isFormulaSelected: false,
      isSavedMilkSelected:false,
      noteTextInput: remark,
      //volumeCount: '0',
      volumeCount: 0,
      showBabyList: false,
      isExpended: false,
      experience: true,
      selectedDate:moment(this.props.navigation.state.params.item.trackAt).format(),
      babyId: '',
      showVolumeAlert:false,
      isSwitchEnabled: true,
      defaultExperience:0,
      unit:'',
      maxVolumeValue:0,
      isUnit:'',
      isFocus:false,
      sliderValue:0,
      isSliderLoadingDone:false,
      disableButton:false,
      isDateChanged:false,
      accuracy:true

    }
    this.badSessionIndex = -1
    this.lastBreastIndex = -1
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getVolumeUnits(),getVolumeMaxValue()]).then((values)=>{
      this.setState({unit:values[0],maxVolumeValue:values[1]})
    })

    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL}, () => {
          const {navigation} = this.props;
          const {amountTotalUnit, amountTotal} = navigation.state.params.item;
          const {convertedVolume , convertedVolumeUnit} = volumeConversionHandler(this.state.isImperial, amountTotalUnit, amountTotal);
          this.setState({ volumeCount : convertedVolume,sliderValue:convertedVolume})
        });
      }
    });

    const {navigation}=this.props
    const {babyId,trackAt,lastBreast,amountTotal,durationTotal,feedType,durationLeft,isBadSession,remark , amountTotalUnit} = navigation.state.params.item
    this.setState({babyId,selectedDate:trackAt})

    switch (feedType){
      case 1:
        this.setState({babyId,selectedDate:trackAt,isMilkSelected:true})
        break;
      case 3:
        this.setState({babyId,selectedDate:trackAt,isMixSelected:true})
        break;
      case 2:
        this.setState({babyId,selectedDate:trackAt,isFormulaSelected:true})
        break;
      case 4:
        this.setState({ babyId, selectedDate: trackAt, isSavedMilkSelected: true })
        break;
    }
    this.badSessionIndex=isBadSession?1:0
    this.setState({defaultExperience:this.badSessionIndex})
    await analytics.logScreenView('edit_bottle_tracking_screen')
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {trackingApiSuccess, trackingApiFailure, navigation,deleteTrackingId,deleteTrackingSuccess, deleteTrackingFailure} = this.props;
    if (deleteTrackingSuccess != prevProps.deleteTrackingSuccess && deleteTrackingSuccess && prevState.isLoading) {
      deleteTrackingItem(deleteTrackingId)
      this.setState({isLoading: false})
      this.props.navigation.goBack()
    }

    if (deleteTrackingFailure != prevProps.deleteTrackingFailure && deleteTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
    if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
      this.saveTrackingInDb(true)
      Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
      this.setState({isLoading: false})
      navigation.goBack()
    }

    if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
      this.saveTrackingInDb(false)
      this.setState({isLoading: false})
    }

  }


  planToReturnWork = (value) => {
    if (value === 'yes') {
      this.setState({showWorkDateSection: true});
    } else {
      this.setState({showWorkDateSection: false, chooseBackWorkDate: ''});
    }
  };


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
    const {isMilkSelected, volumeCount, maxVolumeValue, unit,isFocus,isSliderLoadingDone,sliderValue,accuracy} = this.state
    let multiplicityValue = 10
    unit === "oz" && (multiplicityValue = 0.25)
    return <View style={styles.volumeView}>
      {/* {isMilkSelected && switchVisible ?
      <View style={styles.freezerHeaderStyle}>
        <Text maxFontSizeMultiplier={1.7} style={styles.virtualFreezerTextStyle}>{I18n.t('bottle_tracking.use_from_virtual_freezer')}</Text>
        {this.switchFunc()}
      </View>:
      <Text maxFontSizeMultiplier={1.7} style={styles.sessionTypeTextStyle}>{I18n.t('bottle_tracking.use_volume')}</Text>
    } */}
      <Suspense fallback={
        <View style={{height:170}}>
          <LoadingSpinner/>
        </View>
      }>
        <CustomVolumeSlider
          multiplicity={multiplicityValue}
          //maxSliderValue={maxVolumeValue}
          maxSliderValue={this.nearestMaxValue(maxVolumeValue,multiplicityValue)}
          restrictPoint={maxVolumeValue}
          //value={volumeCount}
          //changeValue={this.handleVolumeChangeValue}
          value={isSliderLoadingDone?sliderValue:0}
          accuracy={unit === 'oz'?accuracy:true}
          changeValue={(volumeCount)=>{this.setState({volumeCount})}}
          onScrollBeginDrag={()=>this.setState({accuracy:false})}
          decimalPlaces={unit==='oz'?2:0}
          range={unit==='oz'?1:50}
          isLoadingComplete={(isSliderLoadingDone)=>{this.setState({isSliderLoadingDone})}}
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
          value={!isSliderLoadingDone?'0':isFocus?sliderValue+'':volumeCount+''}
          editable={true}
          height={48}
        />
      </Suspense>
      {/* <View style={styles.volumeCountView}>
        <Text maxFontSizeMultiplier={1.7} style={styles.volumeCountTextStyles}>{`${volumeCount} ${I18n.t(`units.${unit.toLowerCase()}`)}`}</Text>
      </View> */}

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
          <Text maxFontSizeMultiplier={1.7} style={[styles.typeTextStyle,{color:this.textColor}]}>{I18n.t('bottle_tracking.milk')}</Text>
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
        onPress={()=> this.setState({
          isSwitchEnabled: !isSwitchEnabled
        })}
      >
        {isSwitchEnabled ? <SwitchOnIcon width={30} height={30}/> :
          <SwitchOffIcon width={30} height={30}/>}
      </TouchableOpacity>
    )
  }

  renderVirtualFreezer() {
    const {navigation} = this.props
    const {isMilkSelected, isPumpSelected} = this.state
    return <View style={{marginTop: 10, marginLeft: -5}}>
      {/* <View style={styles.freezerHeaderStyle}>
      <Text maxFontSizeMultiplier={1.7} style={styles.virtualFreezerTextStyle}>{I18n.t('bottle_tracking.use_from_virtual_freezer')}</Text>
        {this.switchFunc()}
      </View> */}

      <View style={styles.fridgeFreezerView}>
        <CustomOptionSelector
          buttonContainerStyle={styles.freezerButtonContainer}
          buttonTextInactiveStyle={styles.btnTextInactive}
          buttonTextActiveStyle={styles.btnTextActive}
          data={this.fridgeFreezerOption} onChange={(item) => console.log(item.value)}/>
        <View style={{flex: 1, height: 50,}}>
          <CustomTextInput
            inputStyle={[styles.numberTextInput,{color:this.textColor}]}
            style={{height: 30}}
            maxLength={30}
            textContentType="postalCode"
            placeholder={I18n.t('breastfeeding_pump.tray')}
            placeholderTextColor={this.textColor}
            textStyles={[styles.numberTextInput,{color:this.textColor}]}
            enableDoneButton={true} />
        </View>
      </View>

    </View>
  }

  onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    if (value < -85 &&
      !this.animationIsRunning
    ) {
      this.animationIsRunning = true;
    }
  };


  renderNoteView() {
    const {noteTextInput}=this.state
    return<CustomTextInput
      maxLength={1000}
      maxHeight={100}
      value={noteTextInput}
      textContentType="familyName"
      onChangeText={(index, value) => this.setState({ noteTextInput: value })}
      placeholder={I18n.t('bottle_tracking.add_note')}
      placeholderTextColor={this.textColor}
      textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
      multiline={true}
      enableDoneButton={true} />
  }

  getSelectedBabyDetails(item) {
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

  render() {

    const {isMilkSelected, isLoading, isMixSelected,disableButton,isSavedMilkSelected, isFormulaSelected, showVolumeAlert,selectedDate, isSwitchEnabled,showDeleteTrackingAlert,unit} = this.state
    const {navigation} = this.props
    const {trackingType,timeStamp,amountTotal,feedType} = navigation.state.params.item
    return <KeyboardAwareScrollView contentContainerStyle={{flex:1}}>
      <HeaderTrackings
        hideCalendarIcon={true}
        timeCalendarDate={selectedDate}
        updateTimeCalendarUIPress={(date,duration)=>{
          this.setState({
            isDateChanged:true,
            selectedDate:date
          })
        }}
        updateValidation={(val)=>{
          this.setState({disableButton:val})
        }}
        isEditable={true}
        title={I18n.t('bottle_tracking.bottle')}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => navigation.goBack()}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        selectedDate={selectedDate}
        getSelectedDate={(value)=>this.setState({selectedDate:value})}/>
      {/* <TrackingDateTime date={selectedDate} time={selectedDate}/> */}
      <ScrollView style={{marginBottom: 90}}>
        {isLoading && <LoadingSpinner/>}
        <View style={[styles.container]}>
          {!isSavedMilkSelected && this.renderType()}
          {/* {isSwitchEnabled && isMilkSelected && !isMixSelected && !isFormulaSelected && this.renderVirtualFreezer()} */}
          {/* {isSwitchEnabled && isMilkSelected && !isMixSelected && !isFormulaSelected && this.renderVirtualFreezerList()} */}

          {isSavedMilkSelected && <View style={{flexDirection:'row',width:'100%',justifyContent:'center'}}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{position:'absolute',left:0,bottom:10,marginLeft:5,color:this.textColor}]}>{I18n.t('bottle_tracking.volume')}</Text>
            <View style={[styles.volumeCountView]}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.volumeCountTextStyles,{color:this.textColor}]}>{`${amountTotal} ${this.state.unit}`}</Text>
            </View>
          </View>
          }

          {(isMilkSelected || isMixSelected || isFormulaSelected) && this.renderVolumeView()}
          {(isMilkSelected ||isMixSelected || isFormulaSelected || isSavedMilkSelected) && this.renderNoteView()}

        </View>
      </ScrollView>
      {showVolumeAlert && this.showVolumeDialog()}
      {showDeleteTrackingAlert && this.showDeleteTrackingPopup()}
      <BottomButtonsView
        disable={disableButton}
        positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
        negativeButtonTitle={I18n.t('generic.delete').toUpperCase()}
        onNegativePress={() => this.setState({showDeleteTrackingAlert:true})}
        onPositivePress={() => this.handleVolumeValidations()}
        hideView={feedType===4}
      />

    </KeyboardAwareScrollView>
  }

  handleVolumeValidations() {
    const {volumeCount,isSavedMilkSelected} = this.state
    if (!isSavedMilkSelected){
      if(volumeCount > 0) {
        this.handleValidations()
      }else{
        AsyncStorage.getItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN).then((value) => {
          if (value!==null){
            this.handleValidations()
          }else{
            this.setState({showVolumeAlert: true})
          }
        })
      }
    }
    else {
      this.handleValidations()
    }

  }

  async handleValidations() {
    const {noteTextInput, isMilkSelected, isMixSelected, isFormulaSelected, volumeCount,amountTotal ,selectedDate, babyId, isSavedMilkSelected, unit } = this.state
    const {babies,navigation} = this.props
    const {id} = navigation.state.params.item
    let milkvolumeCount = isSavedMilkSelected ? navigation.state.params.item.inventory !== undefined ? navigation.state.params.item.inventory.amount : volumeCount : volumeCount
    if (babies && babies.length > 0) {
      let formattedDate = await appendTimeZone(selectedDate)

      this.trackingObj = {
          "amountTotal":volumeCount,
          "amountTotalUnit":unit,
          "babyId": babyId,
          "confirmed": true,
          "isBadSession":false,
          "feedType": 1,
          "remark": noteTextInput.toString().trim(),
          "quickTracking": false,
          "trackAt": formattedDate,
          "id": id,
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
        if (isSavedMilkSelected) {
          this.trackingObj.feedType = 4
        }
        if (this.badSessionIndex > -1) {
          this.trackingObj['isBadSession'] = this.badSessionIndex === 1
        }



      if (navigation.state.params.item.inventory !== undefined) {
        this.trackingObj['inventory'] = navigation.state.params.item.inventory
      }
      // for handle
      let json = {
        trackings: [this.trackingObj],
      };
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
      if (!isSync){
        Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
        this.props.navigation.goBack()
      }
    })
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
  themeSelected: state.app.themeSelected,
})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  deleteTrackingApi: (trackingId,babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId,babyId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBottleTrackingScreen);


