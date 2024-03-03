import React from 'react';
import {Text, TouchableOpacity, Keyboard, View, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import Button from '@components/Button';
import CustomTextInput from '@components/CustomTextInput';
import CustomVolumeSlider from '@components/CustomVolumeSlider';
import I18n from '@i18n';
import moment from 'moment';
import Dialog from '@components/Dialog';
import HeaderTrackings from "@components/HeaderTrackings";
import LoadingSpinner from '@components/LoadingSpinner';
import HomeActions from '@redux/HomeRedux';
import {Colors} from '@resources';
import styles from './Styles/GrowthScreenStyles';
import {getHeightUnits,getHeightMaxvalue, cmToIn, inToCm } from '@utils/locale';
import KeyUtils from "@utils/KeyUtils";
import {createTrackedItem, deleteTrackingItem} from "../Database/TrackingDatabase";
import TrackingDateTime from "@components/TrackingDateTime";
import Toast from "react-native-simple-toast";
import {appendTimeZone} from "@utils/TextUtils";
import AsyncStorage from '@react-native-community/async-storage';
import {cmToMm, heightConversionHandler} from '@utils/locale';
import CustomMeasurementView from "@components/CustomMeasurementView";
import BottomButtonsView from '@components/BottomButtonsView';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
// let unit = ''
let heightValue=''
class EditGrowthScreen extends React.Component {
  constructor(props) {
    super(props);
    let remark=this.props.navigation.state.params&&this.props.navigation.state.params.item&&this.props.navigation.state.params.item.remark?this.props.navigation.state.params.item.remark:'';
    this.state = {
      isLoading: false,
      showDeleteTrackingAlert:false,
      sliderValue: 0,
      heightByInput: 0,
      noteTextInput: remark,
      selectedDate: moment(this.props.navigation.state.params.item.trackAt).format(),
      babyId: this.props.babies[0].babyId,
      unit:'',
      maxHeightValue:0,
      isUnit:'',
      isFocus:false,
      isSliderLoadingDone:false,
      disableButton:false,
      isDateChanged:false
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getHeightUnits(), getHeightMaxvalue()]).then((values) => {
      this.setState({unit: values[0], maxHeightValue: values[1]});
    });
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL}, () => {
          const {navigation} = this.props;
          const {height, heightUnit} = navigation.state.params.item
          const {
            convertedHeight,
          } = heightConversionHandler(this.state.isImperial, heightUnit, height);
          this.setState({heightByInput: convertedHeight, sliderValue: convertedHeight});
        });
      }
    });

    const {navigation}=this.props
    const {babyId,trackAt,height,remark} = navigation.state.params.item
    this.setState({babyId,selectedDate:trackAt})
    await analytics.logScreenView('edit_growth_screen')
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    const {trackingApiSuccess, trackingApiFailure, navigation,deleteTrackingId,deleteTrackingSuccess, deleteTrackingFailure} = this.props;
    if (deleteTrackingSuccess != prevProps.deleteTrackingSuccess && deleteTrackingSuccess && prevState.isLoading) {
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
      navigation.state.params._onSave();
      navigation.goBack()
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
    const {noteTextInput,babyId, selectedDate,sliderValue, heightByInput, maxHeightValue, unit} = this.state;
    const{navigation}= this.props
    const {trackingId,id} = navigation.state.params.item
    if (this.props.babies && this.props.babies.length > 0) {
      //let heightValue = (heightByInput>0) ? heightByInput: sliderValue;
      let heightValue=heightByInput;
      let formattedDate = await appendTimeZone(selectedDate)
      this.trackingObj = {
        id: id,
        babyId,
        confirmed: true,
        height: unit === KeyUtils.UNIT_CM ? cmToMm(heightValue) : parseFloat(heightValue),
        heightUnit: unit === KeyUtils.UNIT_CM ? KeyUtils.UNIT_MM : unit,
        remark: noteTextInput.toString().trim(),
        quickTracking: false,
        trackAt: formattedDate,
        trackingType: KeyUtils.TRACKING_TYPE_GROWTH,
      };

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

  // handleChangeValue = (value) => {
  //   this.setState({
  //     sliderValue: value,
  //     heightByInput: value
  //   });
  // };

  // onChangeTextValue =(value)=>{
  //   const {maxHeightValue}=this.state
  //   let temp=(isNaN(parseFloat(value)) ? 0: value>maxHeightValue?parseFloat(maxHeightValue):parseFloat(value));
  //   this.setState({
  //     heightByInput: (isNaN(parseFloat(value)) ? 0: value>maxHeightValue?parseFloat(maxHeightValue):parseFloat(value)),
  //     ...temp==0&&{sliderValue:0}
  //   })
  // }

  renderGrowthView() {
    const {sliderValue, heightByInput, maxHeightValue, unit,isFocus,isSliderLoadingDone} = this.state;
    let heightInputValue = 0
    if(sliderValue> 0){
      heightInputValue= sliderValue
    }else{
      heightInputValue= heightByInput
    }
    let unitTextShown =  I18n.t(`units.${unit.toLowerCase()}`)
    let multiplicityValue = 1

    unit === 'inch' && (multiplicityValue = 0.5)
    return (
      <View style={[styles.sleepView,{height: 170}]}>
        <CustomVolumeSlider
          multiplicity={multiplicityValue}
          maxSliderValue={maxHeightValue}
          //value={heightByInput>0? heightByInput: sliderValue}
          //changeValue={this.handleChangeValue}
          range={unit === 'inch'?1:5}
          accuracy={true}
          value={isSliderLoadingDone?sliderValue:0}
          onScrollBeginDrag={()=>{
            if(this.nameRef.isFocused()){
              this.nameRef.blur();
            }
          }}
          isLoadingComplete={(isSliderLoadingDone)=>{this.setState({isSliderLoadingDone})}}
          changeValue={(heightByInput)=>{
            //console.log(heightByInput)
            this.setState({heightByInput})
          }}
          decimalPlaces={1}
          numberColor={this.textColor}
        />
        {/* <View style={styles.textInputWrapperStyle}>
          <CustomTextInput
            maxLength={unit === 'inch'?3:2}
            value={`${heightInputValue}`}
            textContentType="familyName"
            keyboardType={'numeric'}
            returnKeyType={'done'}
            onChangeText={(index, value) => this.onChangeTextValue(value) }
            textStyles={styles.heightInputStyle}
          />
          <Text maxFontSizeMultiplier={1.7} style ={styles.textUnitsStyles}>{`${unitTextShown}`}</Text>
          </View> */}
          <CustomMeasurementView
            //value={heightInputValue}
            maxValue={maxHeightValue}
            //textInputValue={(value) => this.onChangeTextValue(value)}
            units={unitTextShown}
            textInputValue={(value)=>{
              let temp=parseFloat(value==''||value==undefined?0:value)
              this.setState({sliderValue:isNaN(temp)?0:temp})
            }}
            onBlur={()=>{
              this.setState({isFocus:false})
            }}
            onFocus={()=>{
              this.setState({isFocus:true,sliderValue:heightByInput})
            }}
            inputRef={(input)=>{ this.nameRef = input }}
            value={isFocus?sliderValue+'':heightByInput+''}
            height={48}
          />
      </View>
    );
  }

  renderBottomView() {
    const{heightByInput,disableButton}=this.state
    return (
      <BottomButtonsView
        disable={disableButton}
        disabled={!heightByInput}
        positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
        negativeButtonTitle={I18n.t('generic.delete').toUpperCase()}
        //onNegativePress={() => this.setState({showDeleteTrackingAlert: true})}
        onNegativePress={()=>{this.setState({showDeleteTrackingAlert:true})}}
        onPositivePress={() => this.handleValidations()}
      />
      // <View style={styles.bottomView}>
      //   <View style={styles.cancelSaveView}>
      //     <Button
      //       title={I18n.t('generic.delete').toUpperCase()}
      //       textStyle={styles.cancelTextStyle}
      //       onPress={() => this.setState({showDeleteTrackingAlert:true})}
      //       style={styles.cancelButtonStyles}
      //     />
      //     <Button
      //       disabled={!heightByInput}
      //       title={I18n.t('generic.save').toUpperCase()}
      //       textStyle={styles.saveTextStyle}
      //       onPress={() => {
      //          this.handleValidations()
      //       }}
      //       style={[styles.saveButtonStyles,!heightByInput?{opacity:0.5}:{opacity: 1}]}
      //     />
      //   </View>
      // </View>
    );
  }
  getSelectedBabyDetails(item) {
    //Baby's data
    this.setState({babyId:item.babyId})
  }

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
    const {navigation}= this.props
    const {isLoading,noteTextInput,showDeleteTrackingAlert,selectedDate}= this.state
    return (
      <SafeAreaView style={styles.container}>
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
          title={I18n.t('tracking.growth')}
          onBackPress={() => navigation.goBack()}
          onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
          navigation={navigation}
          selectedDate={selectedDate}
          getSelectedDate={(value) => this.setState({selectedDate: value})}/>
        {/* <TrackingDateTime date={selectedDate} time={selectedDate}/> */}
        {isLoading && <LoadingSpinner />}
        {showDeleteTrackingAlert && this.showDeleteTrackingPopup()}
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <>
        <Text maxFontSizeMultiplier={1.7} style={[styles.editDurationTextStyle,{color:this.textColor}]}>
          {I18n.t('baby_growth.title')}
        </Text>
        {this.renderGrowthView()}

        <CustomTextInput
          maxLength={1000}
          value={noteTextInput}
          textContentType="familyName"
          onChangeText={(index, value) => this.setState({noteTextInput: value})}
          placeholder={I18n.t('breastfeeding_pump.add_note')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
          multiline={true}
          maxHeight ={100}
          enableDoneButton={true}
        />
        <TouchableOpacity  accessible={true} accessibilityLabel={I18n.t(" ")}  onPress={()=>Keyboard.dismiss()} style={{width:'100%',height:200}}/>
        {this.renderBottomView()}
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
  deleteTrackingSuccess:state.home.deleteTrackingSuccess,
  deleteTrackingFailure:state.home.deleteTrackingFailure,
  deleteTrackingId:state.home.deleteTrackingId,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) =>
    dispatch(HomeActions.trackingApi(trackingData)),
  deleteTrackingApi: (trackingId,babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId,babyId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGrowthScreen);
