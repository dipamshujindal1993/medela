import React from 'react';
import {Keyboard, Text, TouchableOpacity, View, SafeAreaView, ScrollView, Platform, BackHandler} from 'react-native';
import Button from '@components/Button';
import CustomTextInput from '@components/CustomTextInput';
import CustomVolumeSlider from '@components/CustomVolumeSlider';
import I18n from '@i18n';
import {uuidV4} from '@utils/TextUtils';
import {connect} from 'react-redux';
import moment from 'moment';
import LoadingSpinner from '@components/LoadingSpinner';
import HeaderTrackings from "@components/HeaderTrackings";
import HomeActions from '@redux/HomeRedux';
import {Colors} from '@resources';
import styles from './Styles/WeightScreenStyles';
import {getWeightUnits,getWeightMaxvalue } from '@utils/locale';
import BottomButtonsView from "@components/BottomButtonsView";
import KeyUtils from "@utils/KeyUtils";
import {createTrackedItem} from "@database/TrackingDatabase";
import Toast from 'react-native-simple-toast';
// import { weightTrackNotification } from '@components/Notifications';
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "@services/NavigationService";
import {appendTimeZone} from "@utils/TextUtils";
import SiriBabySelectionModal from "@components/SiriBabySelectionModal";
import {kgToGram, weightConversionHandler} from '@utils/locale';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

let unit = ''
class WeightScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      sliderValue: this.props.navigation.state.params!= undefined?this.props.navigation.state.params.amount:0,
      weightByInput: 0,
      selectedDate:moment().format(),
      noteTextInput: '',
      volumeRight: 8,
      showSiriBabySelectionModal:this.props.navigation.state.params!= undefined?this.props.navigation.state.params.isSiriNameReturned:undefined,
      unit:'',
      maxWeightValue:0,
      isFocus:false,
      initialCalenderValue:undefined,
      isCalenderValueDetained:false,
      disableButton:false,
      isDateChanged:false,
      timeCalendarDate:moment()
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getWeightUnits(),getWeightMaxvalue()]).then((values) => {
      this.setState({unit:values[0],maxWeightValue:values[1]})
    });

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }

   this.props.navigation.state.params!= undefined? this.handleWeightConversion() : null
   {this.state.showSiriBabySelectionModal? setTimeout(() => {this.handleValidations()}, 500):null}
    await analytics.logScreenView('weight_screen')
  }

  handleWeightConversion(){
    let weightUnit=this.props.navigation.state.params.weightType
    let weight=this.props.navigation.state.params.amount
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL}, () => {
          const {navigation} = this.props;
          const {
            convertedWeight,
            convertedWeightUnit,
          } = weightConversionHandler(this.state.isImperial, weightUnit, weight);
          this.setState({weightByInput: convertedWeight, sliderValue: convertedWeight});
        });
      }
    })
  }

  _handleBack=()=>{
    const {navigation}=this.props
    this.setState({disableButton:false})
    navigation.goBack()
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

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS,
  ) {
    const {trackingApiSuccess, navigation,trackingApiFailure} = this.props;
    if (
      trackingApiSuccess != prevProps.trackingApiSuccess &&
      trackingApiSuccess &&
      prevState.isLoading
    ) {
      this.saveTrackingInDb(true)
    }

    if (
      trackingApiFailure != prevProps.trackingApiFailure &&
      trackingApiFailure &&
      prevState.isLoading
    ) {
    //  this.saveTrackingInDb(false)
      this.setState({isLoading: false});
    }
  }

  async handleValidations() {
    const {noteTextInput, sliderValue, weightByInput, selectedDate,unit,textInputValue,isBlur,isCalenderValueDetained,timeCalendarDate} = this.state;
    const {selected_baby}=this.props
    const {babyId}=selected_baby
    this.setState({disableButton:true})
    if (this.props.babies && this.props.babies.length > 0) {
      //let weightValue = isBlur?textInputValue:(weightByInput>0) ? weightByInput: sliderValue,
      let weightValue=weightByInput;
      // let formattedDate=await appendTimeZone(isCalenderValueDetained===true?selectedDate:new Date())
      let formattedDate=await appendTimeZone(timeCalendarDate)
      this.trackingObj = {
        babyId: babyId,
        confirmed: true,
        weight: unit===KeyUtils.UNIT_KG?kgToGram(weightValue):parseFloat(weightValue),
        weightUnit:unit===KeyUtils.UNIT_KG?KeyUtils.UNIT_GRAM:unit,
        remark: noteTextInput.toString().trim(),
        quickTracking: false,
        trackAt: formattedDate,
        id: uuidV4(),
        trackingType: KeyUtils.TRACKING_TYPE_WEIGHT,
      };

      // for handle
      let json = {
        trackings: [this.trackingObj],
      };
      console.log('trackings === ', JSON.stringify(json))
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
      console.log('result--',r)
      // alert("Success")
      // weightTrackNotification(this.trackingObj, this.props.selected_baby)
      Toast.show(I18n.t("tracking.tracking_toaster_text"), Toast.SHORT);
      this._handleBack()
    })
  }


  // handleChangeValue = (value) => {
  //   this.setState({
  //     sliderValue: value,
  //     weightByInput: value,
  //     isBlur:false
  //   });
  // };

  // onChangeTextValue =(value)=>{
  //   const {maxWeightValue}=this.state
  //   if(this.state.unit == KeyUtils.UNIT_KG){
  //   let modifiedValue = parseFloat(value.replace(/,/g, '.'));
  //   // modifiedValue>maxWeightValue && (alert(`${I18n.t('generic.maximum_limit')} ${maxWeightValue}`))
  //   let temp=isNaN(modifiedValue)?0:modifiedValue>maxWeightValue?maxWeightValue:modifiedValue
  //   this.setState({
  //     weightByInput:isNaN(modifiedValue)?0:modifiedValue>maxWeightValue?maxWeightValue:modifiedValue,
  //     ...temp==0&&value==0&&{sliderValue:0},
  //     volumeRight: (value.length > 3) ? 2: 8,
  //     textInputValue:isNaN(modifiedValue)?0:modifiedValue>maxWeightValue?maxWeightValue:modifiedValue,
  //   })
  // }
  // else{
  //   // value>maxWeightValue && (alert(`${I18n.t('generic.maximum_limit')} ${maxWeightValue}`))
  //   let temp=isNaN(parseFloat(value)) ? 0: value>maxWeightValue?parseFloat(maxWeightValue):parseFloat(value)
  //   this.setState({
  //     weightByInput: isNaN(parseFloat(value)) ? 0: value>maxWeightValue?parseFloat(maxWeightValue):parseFloat(value),
  //     ...temp==0&&value==0&&{sliderValue:0},
  //     volumeRight: (value.length > 3) ? 2: 8,
  //     textInputValue:isNaN(parseFloat(value))?0:value>maxWeightValue?parseFloat(maxWeightValue):parseFloat(value),
  //   })
  // }
  // }

  renderGrowthView() {
    const {sliderValue,isFocus, weightByInput, volumeRight,maxWeightValue ,unit} = this.state;
    let weightInputValue = 0
    if(sliderValue> 0){
      weightInputValue= sliderValue
    }else{
      weightInputValue= weightByInput
    }
    let multiplicityValue = 0.05
    unit === 'lb' && (multiplicityValue = 0.25)
    let unitTextShown =unit==''||unit==undefined?'':I18n.t(`units.${unit.toLowerCase()}`)
    // unit === 'gram' && (unitTextShown = 'g')

    return (
      <View style={styles.sleepView}>
        <CustomVolumeSlider
          multiplicity={multiplicityValue}
          maxSliderValue={maxWeightValue}
          // value={sliderValue}
          accuracy={true}
          range={unit==='lb'?1:0.25}
          value={sliderValue}
          changeValue={(weightByInput)=>this.setState({weightByInput})}
          onScrollBeginDrag={()=>{
            if(this.nameRef.isFocused()){
              this.nameRef.blur();
            }
          }}
          decimalPlaces={unit==='lb'?2:3}
          numberColor={this.textColor}
        />
        {/* <CustomSlider
          value={weightByInput>0? weightByInput: sliderValue}
          multiplicity={multiplicityValue}
          range={1}
          sliderHeight={180}
          maxValue={maxWeightValue}
          onScroll={this.handleChangeValue}
        /> */}
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
            onBlur={()=>{
              this.setState({isBlur:true,isFocus:false})
            }}
            onFocus={()=>{
              this.setState({isBlur:false,isFocus:true,sliderValue:weightByInput})
            }}
            onChangeText={(index, value) => {
              //this.onChangeTextValue(value)
              let temp=parseFloat(value==''||value==undefined?0:value)
                        this.setState({
                          volumeRight: ((value+'').length > 3) ? 2: 8,
                          sliderValue:isNaN(temp)?0:temp,
                            //value:value
                        })
            }}

          />
          <Text maxFontSizeMultiplier={1.7} style ={[styles.textUnitsStyles, {position: "relative", right: volumeRight,color:this.textColor}]}>{`${unitTextShown}`}</Text>
          </View>
      </View>
    );
  }


  getSelectedBabyDetails(item){
  }


  renderBottomView() {
    const{heightByInput}=this.state
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
            disabled={!heightByInput}
            title={I18n.t('generic.save').toUpperCase()}
            textStyle={styles.saveTextStyle}
            onPress={() => {
              this.handleValidations()
            }}
            style={[styles.saveButtonStyles,!heightByInput?{opacity:0.5}:{opacity: 1}]}
          />
        </View>
      </View>
    );
  }
  render() {
    const{navigation}= this.props
    const {isLoading, weightByInput,isCalenderValueDetained,initialCalenderValue,timeCalendarDate}= this.state;
    return (<>
      <SafeAreaView style={styles.container}>
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
        title={I18n.t('tracking.weight')}
        onBackPress={() => this._handleBack()}
        onBabyListPress={(item) => {
          //this.getSelectedBabyDetails(item)
        }}
        navigation={navigation}
        getSelectedDate={(value)=>{
          console.log('selectedvalue---',value,typeof value)

          this.setState({selectedDate:value,isCalenderValueDetained:true})
        }}
        selectedDate={isCalenderValueDetained==false?initialCalenderValue :undefined}
        calenderIconPressed={()=>{
          if(isCalenderValueDetained===false){
            this.setState({initialCalenderValue: moment().format()});
          }
        }}
        />
      {isLoading && <LoadingSpinner />}
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <>
      {(this.state.showSiriBabySelectionModal!= undefined && !this.state.showSiriBabySelectionModal) && <SiriBabySelectionModal
        showBabySelectionModal={!this.state.showSiriBabySelectionModal}
        cancelBabyPress={(visible)=>{
          this.setState({showSiriBabySelectionModal:false})
          this.handleValidations()

        }}
        onBabyListPress={(item) => {
          this.setState({showSiriBabySelectionModal:false})
          this.handleValidations()
        }}
        navigation={navigation}
      />}
        <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle,{color:this.textColor}]}>
          {I18n.t('baby_weight.title')}
        </Text>
        {this.renderGrowthView()}
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
        <TouchableOpacity onPress={()=>Keyboard.dismiss()} 
          accessible={true}
          accessibilityLabel={I18n.t(" ")}  
          style={{width: '100%', height: 200}}/>
          <BottomButtonsView
          disable={!weightByInput|| this.state.disableButton}
          positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
          negativeButtonTitle={I18n.t('generic.cancel').toUpperCase()}
          onNegativePress={() => this._handleBack()}
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
  selected_baby: state.home.selected_baby,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) =>
    dispatch(HomeActions.trackingApi(trackingData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WeightScreen);
