import React from 'react';
import {Keyboard, Text, TouchableOpacity, View, SafeAreaView, ScrollView} from 'react-native';
import Button from '@components/Button';
import CustomTextInput from '@components/CustomTextInput';
import CustomVolumeSlider from '@components/CustomVolumeSlider';
import Dialog from '@components/Dialog';
import TrackingDateTime from '@components/TrackingDateTime';
import I18n from '@i18n';
import {connect} from 'react-redux';
import moment from 'moment';
import LoadingSpinner from '@components/LoadingSpinner';
import HeaderTrackings from '@components/HeaderTrackings';
import HomeActions from '@redux/HomeRedux';
import {Colors} from '@resources';
import styles from './Styles/WeightScreenStyles';
import {getWeightUnits,getWeightMaxvalue, lbsToKg,kgToLbs} from '@utils/locale';
import BottomButtonsView from '@components/BottomButtonsView';
import KeyUtils from '@utils/KeyUtils';
import {createTrackedItem, deleteTrackingItem} from '@database/TrackingDatabase';
import Toast from 'react-native-simple-toast';
import {appendTimeZone} from '@utils/TextUtils';
import AsyncStorage from '@react-native-community/async-storage';
import {kgToGram, weightConversionHandler} from '@utils/locale';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class EditWeightScreen extends React.Component {
  constructor(props) {
    super(props);
    let remark=this.props.navigation.state.params&&this.props.navigation.state.params.item&&this.props.navigation.state.params.item.remark?this.props.navigation.state.params.item.remark:'';
    this.state = {
      isLoading: false,
      weightValue: 0,
      sliderValue: 0,
      weightByInput: 0,
      selectedDate: moment(this.props.navigation.state.params.item.trackAt).format(),
      babyId: this.props.babies[0].babyId,
      babyId: '',
      noteTextInput: remark,
      volumeRight: 8,
      showDeleteTrackingAlert: false,
      unit: '',
      maxWeightValue: 0,
      isUnit: '',
      isBlur:true,
      isFocus:false,
      isSliderLoadingDone:false,
      disableButton:false,
      isDateChanged:false
    };
    // unit=getWeightUnits()
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getWeightUnits(), getWeightMaxvalue()]).then((values) => {
      this.setState({unit: values[0], maxWeightValue: values[1]});
    });
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL}, () => {
          const {navigation} = this.props;
          const {weight, weightUnit} = navigation.state.params.item;
          const {
            convertedWeight,
            convertedWeightUnit,
          } = weightConversionHandler(this.state.isImperial, weightUnit, weight);
          this.setState({weightByInput: convertedWeight, sliderValue: convertedWeight});
        });
      }
    });
    const {navigation} = this.props;
    const {babyId, trackAt, weight, remark} = navigation.state.params.item;
    this.setState({babyId, selectedDate: trackAt});

    await analytics.logScreenView('edit_weight_screen')
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

    const {
      trackingApiSuccess,
      trackingApiFailure,
      navigation,
      deleteTrackingId,
      deleteTrackingSuccess,
      deleteTrackingFailure,
    } = this.props;
    if (deleteTrackingSuccess != prevProps.deleteTrackingSuccess && deleteTrackingSuccess && prevState.isLoading) {
      deleteTrackingItem(deleteTrackingId);
      this.setState({isLoading: false});
      this.props.navigation.goBack();
    }

    if (deleteTrackingFailure != prevProps.deleteTrackingFailure && deleteTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false});
    }
    if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
      Toast.show(I18n.t('tracking.tracking_toaster_update_text'), Toast.SHORT);
      this.saveTrackingInDb(true);
      navigation.goBack();
      this.setState({isLoading: false});
    }

    if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
      this.saveTrackingInDb(false);
      this.setState({isLoading: false});
    }

  }

  async handleValidations() {
    const {noteTextInput, sliderValue, weightByInput, babyId, selectedDate, unit,textInputValue,isBlur} = this.state;
    const {navigation} = this.props;
    const {trackingType, id} = navigation.state.params.item;


    if (this.props.babies && this.props.babies.length > 0) {
      //let weightValue = isBlur?textInputValue:(weightByInput>0) ? weightByInput: sliderValue
      let weightValue=weightByInput;
      let formattedDate = await appendTimeZone(selectedDate);
      this.trackingObj = {
        babyId: babyId,
        confirmed: true,
        weight: unit === KeyUtils.UNIT_KG ? kgToGram(weightValue) : parseFloat(weightValue),
        weightUnit: unit === KeyUtils.UNIT_KG ? KeyUtils.UNIT_GRAM : unit,
        remark: noteTextInput.toString().trim(),
        quickTracking: false,
        trackAt: formattedDate,
        id: id,
        trackingType: KeyUtils.TRACKING_TYPE_WEIGHT,
      };

      // for handle
      let json = {
        trackings: [this.trackingObj],
      };
      console.log('this.trackingObj--', this.trackingObj);
      const {isInternetAvailable, trackingApi} = this.props;
      if (isInternetAvailable) {
        this.setState({isLoading: true});
        trackingApi(json);
      } else {
        this.saveTrackingInDb(false);
      }
    }
  }

  saveTrackingInDb(isSync) {
    this.trackingObj.isSync = isSync;
    this.trackingObj.userId = this.props.userProfile.mother.username;
    createTrackedItem(this.trackingObj).then((r) => {
      if (!isSync){
        Toast.show(I18n.t('tracking.tracking_toaster_update_text'), Toast.SHORT);
        this.props.navigation.goBack();
      }

    });
  }


  // handleChangeValue = (value) => {
  //   if(this.state.unit == KeyUtils.UNIT_KG){
  //     this.setState({
  //       sliderValue: this.state.weightByInput,
  //       weightByInput: value,
  //       isBlur:false
  //     });
  //     if(!this.state.isBlur){
  //       this.setState({
  //         sliderValue: value,
  //       });
  //     }
  //   }else {
  //     this.setState({
  //       sliderValue: value,
  //       weightByInput: value,
  //       isBlur:false
  //     });
  //   }
  // };

  // onChangeTextValue =(value)=>{
  //   const {maxWeightValue}=this.state
  //   if(this.state.unit == KeyUtils.UNIT_KG){
  //   var modifiedValue = parseFloat(value.replace(/,/g, '.'));
  //   // modifiedValue>maxWeightValue && (alert(`${I18n.t('generic.maximum_limit')} ${maxWeightValue}`))
  //   let temp=isNaN(modifiedValue)?0:modifiedValue>maxWeightValue?maxWeightValue:modifiedValue;
  //   this.setState({
  //     weightByInput:isNaN(modifiedValue)?0:modifiedValue>maxWeightValue?maxWeightValue:modifiedValue,
  //     ...temp==0&&{sliderValue:0},
  //     volumeRight: (value.length > 3) ? 2: 8,
  //     textInputValue:isNaN(modifiedValue)?0:modifiedValue>maxWeightValue?maxWeightValue:modifiedValue,
  //   })
  // }
  // else{
  //   // value>maxWeightValue && (alert(`${I18n.t('generic.maximum_limit')} ${maxWeightValue}`))
  //   let temp=isNaN(parseFloat(value)) ? 0: value>maxWeightValue?parseFloat(maxWeightValue):parseFloat(value);
  //   this.setState({
  //     weightByInput: isNaN(parseFloat(value)) ? 0: value>maxWeightValue?parseFloat(maxWeightValue):parseFloat(value),
  //     ...temp==0&&{sliderValue:0},
  //     volumeRight: (value.length > 3) ? 2: 8,
  //     textInputValue:isNaN(parseFloat(value))?0:value>maxWeightValue?parseFloat(maxWeightValue):parseFloat(value),
  //   })
  // }
  // }


  renderGrowthView() {
    const {sliderValue,isFocus,isSliderLoadingDone, weightByInput, volumeRight, maxWeightValue, unit, isImperial} = this.state;
    let weightInputValue = 0
    if(sliderValue> 0){
      weightInputValue= sliderValue
    }else{
      weightInputValue= weightByInput
    }
    let multiplicityValue = 0.05
    unit === 'lb' && (multiplicityValue = 0.25)
    //if(unit==''||unit==undefined)
    //console.log(I18n.t(`units.${unit.toLowerCase()}`),'unfdsfitdfd');
    let unitTextShown =unit==''||unit==undefined?'':I18n.t(`units.${unit.toLowerCase()}`)
    // unit === 'gram' && (unitTextShown = 'g')
    return (
      <View style={styles.sleepView}>
        <CustomVolumeSlider
          multiplicity={multiplicityValue}
          maxSliderValue={maxWeightValue}
          accuracy={true}
          range={unit === 'lb'?1:0.25}
          //value={weightByInput>0? weightByInput: sliderValue}
          value={isSliderLoadingDone?sliderValue:0}
          //changeValue={this.handleChangeValue}
          changeValue={(weightByInput)=>this.setState({weightByInput})}
          isLoadingComplete={(isSliderLoadingDone)=>{this.setState({isSliderLoadingDone})}}
          onScrollBeginDrag={()=>{
            if(this.nameRef.isFocused()){
              this.nameRef.blur();
            }
          }}
          decimalPlaces={unit === 'lb'?2:3}
          numberColor={this.textColor}
        />
        <View style={styles.textInputWrapperStyle}
              onStartShouldSetResponder={()=> this.nameRef.focus()}
        >
          <CustomTextInput
            inputRef={(input)=>{ this.nameRef = input }}
            maxLength={6}
            textContentType="familyName"
            keyboardType={'numeric'}
            textStyles={[styles.weightInputStyle,{color:this.textColor}]}
            //value={`${weightInputValue}`}
            value={isFocus?sliderValue+'':weightByInput + ''}
            onChangeText={(index, value) =>{
              //this.onChangeTextValue(value)
              let temp=parseFloat(value==''||value==undefined?0:value)
                        this.setState({
                          volumeRight: ((value+'').length > 3) ? 2: 8,
                          sliderValue:isNaN(temp)?0:temp,
                            //value:value
                        })
            }}
            onBlur={()=>{
              this.setState({isBlur:true,isFocus:false})
            }}
            onFocus={()=>{
              this.setState({isFocus:true,sliderValue:weightByInput})
            }}

          />
          <Text maxFontSizeMultiplier={1.7} style ={[styles.textUnitsStyles, {position: "relative", right: volumeRight,color:this.textColor}]}>{`${unitTextShown}`}</Text>
        </View>
      </View>
    );
  }


  getSelectedBabyDetails(item) {
    this.setState({babyId: item.babyId});
  }

  showDeleteTrackingPopup() {
    const {showDeleteTrackingAlert} = this.state;
    return (
      <Dialog
        visible={showDeleteTrackingAlert}
        title={I18n.t('tracking.title')}
        message={I18n.t('tracking.delete_tracking_message')}
        positive={I18n.t('generic.yes')}
        negative={I18n.t('generic.no')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showDeleteTrackingAlert: false});

        }}
        positiveOnPress={() => {
          const {deleteTrackingApi, navigation} = this.props;
          const {babyId, id} = navigation.state.params.item;
          this.setState({showDeleteTrackingAlert: false, isLoading: true});
          deleteTrackingApi(id, babyId);
        }}
        onDismiss={() => {
        }}
      />
    );
  };

  renderBottomView() {
    const {heightByInput,disableButton} = this.state;
    return (
      <View style={styles.bottomView}>
        <View style={styles.cancelSaveView}>
          <Button
            title={I18n.t('generic.cancel').toUpperCase()}
            textStyle={styles.cancelTextStyle}
            onPress={() => this.props.navigation.goBack()}
            style={styles.cancelButtonStyles}
          />
          <Button
            //disabled={!heightByInput}
            title={I18n.t('generic.delete').toUpperCase()}
            textStyle={styles.saveTextStyle}
            onPress={() => {
              this.handleValidations();
            }}
            style={[styles.saveButtonStyles, !heightByInput ? {opacity: 0.5} : {opacity: 1}]}
          />
        </View>
      </View>
    );
  }

  render() {
    const {navigation} = this.props;

    const {isLoading, noteTextInput, selectedDate, weightByInput, showDeleteTrackingAlert} = this.state;
    return (<>
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
            title={I18n.t('tracking.weight')}
            onBackPress={() => navigation.goBack()}
            onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
            navigation={navigation}
            selectedDate={selectedDate}
            getSelectedDate={(value) => this.setState({selectedDate: value})}/>
          {/* <TrackingDateTime date={selectedDate} time={selectedDate}/> */}
          {isLoading && <LoadingSpinner/>}
          {showDeleteTrackingAlert && this.showDeleteTrackingPopup()}
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <>
              <Text maxFontSizeMultiplier={1.7} style={[styles.editDurationTextStyle,{color:this.textColor}]}>
                {I18n.t('baby_weight.title')}
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
                maxHeight={100}
                enableDoneButton={true}
              />
              <TouchableOpacity 
                onPress={() => Keyboard.dismiss()} 
                accessible={true}
                accessibilityLabel={I18n.t(" ")}  
                style={{width: '100%', height: 200}}/>
              <BottomButtonsView
                disable={!weightByInput}
                positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
                negativeButtonTitle={I18n.t('generic.delete').toUpperCase()}
                onNegativePress={() => this.setState({showDeleteTrackingAlert: true})}
                onPositivePress={() => this.handleValidations()}
              />
            </>
          </ScrollView>
        </SafeAreaView>

      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isInternetAvailable: state.app.isInternetAvailable,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  deleteTrackingSuccess: state.home.deleteTrackingSuccess,
  deleteTrackingFailure: state.home.deleteTrackingFailure,
  deleteTrackingId: state.home.deleteTrackingId,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) =>
    dispatch(HomeActions.trackingApi(trackingData)),
  deleteTrackingApi: (trackingId, babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId, babyId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditWeightScreen);
