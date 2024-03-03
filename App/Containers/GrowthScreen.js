import React from 'react';
import {Text, TouchableOpacity, Keyboard, View, SafeAreaView, ScrollView, Platform, BackHandler} from 'react-native';
import {connect} from 'react-redux';
import Button from '@components/Button';
import CustomTextInput from '@components/CustomTextInput';
import CustomVolumeSlider from '@components/CustomVolumeSlider';
import I18n from '@i18n';
import moment from 'moment';
import {uuidV4,appendTimeZone} from '@utils/TextUtils';
import HeaderTrackings from "@components/HeaderTrackings";
import LoadingSpinner from '@components/LoadingSpinner';
import HomeActions from '@redux/HomeRedux';
import {Colors} from '@resources';
import styles from './Styles/GrowthScreenStyles';
import {getHeightUnits,getHeightMaxvalue,heightConversionHandler } from '@utils/locale';
import KeyUtils from "@utils/KeyUtils";
import {createTrackedItem} from "@database/TrackingDatabase";
import Toast from 'react-native-simple-toast';
// import { growthTrackNotification } from '@components/Notifications';
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "@services/NavigationService";
import SiriBabySelectionModal from "@components/SiriBabySelectionModal";
import {cmToMm, kgToGram} from '@utils/locale';
import CustomMeasurementView from "@components/CustomMeasurementView";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

let unit = ''
class GrowthScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      sliderValue: this.props.navigation.state.params!= undefined?this.props.navigation.state.params.amount:0,
      heightByInput: 0,
      noteTextInput: '',
      selectedDate: moment().format(),
      showSiriBabySelectionModal:this.props.navigation.state.params!= undefined?this.props.navigation.state.params.isSiriNameReturned:undefined,
      unit:'',
      maxHeightValue:0,
      isFocus:false,
      initialCalenderValue:undefined,
      isCalenderValueDetained:false,
      disableButton:false,
      isDateChanged:false,
      timeCalendarDate:moment()
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    // unit=getHeightUnits()
  }
  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getHeightUnits(),getHeightMaxvalue()]).then((values) => {
      this.setState({unit:values[0],maxHeightValue:values[1]})
    });

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    this.props.navigation.state.params!= undefined? this.handleVolumeConversion() : null

   {this.state.showSiriBabySelectionModal? setTimeout(() => {this.handleValidations()}, 500):null}
    await analytics.logScreenView('growth_screen')
  }



  handleVolumeConversion(){
    let heightUnit=this.props.navigation.state.params.lengthType
    let height=this.props.navigation.state.params.amount
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL}, () => {
          const {navigation} = this.props;
          const {
            convertedHeight,
          } = heightConversionHandler(this.state.isImperial, heightUnit, height);
          this.setState({heightByInput: convertedHeight, sliderValue: convertedHeight});
        });
      }
    });
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
    const {trackingApiSuccess, trackingApiFailure,navigation} = this.props;
    if (trackingApiSuccess != prevProps.trackingApiSuccess &&
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
    const {noteTextInput, selectedDate,sliderValue, heightByInput , unit,isCalenderValueDetained,timeCalendarDate} = this.state;
    const {selected_baby}=this.props
    const {babyId}=selected_baby
    this.setState({disableButton:true})
    if (this.props.babies && this.props.babies.length > 0) {
      //let heightValue = (heightByInput>0) ? heightByInput: sliderValue;
      let heightValue=heightByInput;
      // let formattedDate=await appendTimeZone(isCalenderValueDetained===true?selectedDate:new Date())
      let formattedDate=await appendTimeZone(timeCalendarDate)
      this.trackingObj = {
        babyId,
        confirmed: true,
        height: unit===KeyUtils.UNIT_CM?cmToMm(heightValue):parseFloat(heightValue),
        heightUnit:unit===KeyUtils.UNIT_CM?KeyUtils.UNIT_MM:unit,
        remark: noteTextInput.toString().trim(),
        quickTracking: false,
        trackAt: formattedDate,
        id: uuidV4(),
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
      console.log('result--',r)
      // alert("Success")
      // growthTrackNotification(this.trackingObj, this.props.selected_baby)
      Toast.show(I18n.t("tracking.tracking_toaster_text"), Toast.SHORT);
      this._handleBack()
    });
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
  //     heightByInput: temp,
  //     ...temp==0&&value==0&&{sliderValue:0}
  //   })
  // }

  renderGrowthView() {
    const {sliderValue, heightByInput , maxHeightValue , unit,isFocus} = this.state;
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
      <View style={styles.sleepView}>
        <CustomVolumeSlider
          multiplicity={multiplicityValue}
          maxSliderValue={maxHeightValue}
          //value={heightByInput}
          range={unit === 'inch'?1:5}
          accuracy={true}
          //value={heightByInput>0? heightByInput: sliderValue}
          value={sliderValue}
          onScrollBeginDrag={()=>{
            if(this.nameRef.isFocused()){
              this.nameRef.blur();
            }
          }}
          //changeValue={this.handleChangeValue}
          decimalPlaces={1}
          changeValue={(heightByInput)=>this.setState({heightByInput})}
          numberColor={this.textColor}
        />
        {/* <View style={styles.textInputWrapperStyle}
          onStartShouldSetResponder={()=> this.nameRef.focus()}
        >
          <CustomTextInput
            inputRef={(input)=>{ this.nameRef = input }}
            maxLength={unit === 'inch'?4:2}
            value={`${heightInputValue}`}
            textContentType="familyName"
            keyboardType={'numeric'}
            onChangeText={(index, value) => this.onChangeTextValue(value) }
            textStyles={styles.heightInputStyle}
          />
          <Text maxFontSizeMultiplier={1.7} style ={styles.textUnitsStyles}>{`${unitTextShown}`}</Text>
          </View> */}
          <CustomMeasurementView
            value={isFocus?sliderValue+'':heightByInput+''}
            maxValue={maxHeightValue}
            //textInputValue={(value) => this.onChangeTextValue(value)}
            units={unitTextShown}
            textInputValue={(value)=>{
              let temp=parseFloat(value==''||value==undefined?0:value)
              this.setState({sliderValue:isNaN(temp)?0:temp,})
            }}
            onBlur={()=>{
              this.setState({isFocus:false})
            }}
            onFocus={()=>{
              this.setState({isFocus:true,sliderValue:heightByInput})
            }}
            inputRef={(input)=>{ this.nameRef = input }}
            height={48}
          />
      </View>
    );
  }

  renderBottomView() {
    const{heightByInput}=this.state
    return (
      <View style={styles.bottomView}>
        <View style={styles.cancelSaveView}>
          <Button
            title={I18n.t('generic.cancel').toUpperCase()}
            textStyle={styles.cancelTextStyle}
            onPress={() => this._handleBack()}
            style={styles.cancelButtonStyles}
          />
          <Button
            disabled={!heightByInput || this.state.disableButton}
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
  getSelectedBabyDetails(item) {
    //Baby's data
   // this.setState({babyId:item.babyId})
  }

  render() {
    const {navigation}= this.props
    const {isLoading,isCalenderValueDetained,initialCalenderValue,timeCalendarDate}= this.state
    return (
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
        title={I18n.t('baby_growth.header')}
        getSelectedDate={(value)=>this.setState({selectedDate:value}) }
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => this._handleBack()}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        getSelectedDate={(value) => {
          this.setState({selectedDate: value,isCalenderValueDetained:true})
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
          {I18n.t('baby_growth.title')}
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
          maxHeight ={200}
          enableDoneButton={true}
        />
        <TouchableOpacity accessible={true} accessibilityLabel={I18n.t(" ")} onPress={()=>Keyboard.dismiss()} style={{width:'100%',height:200}}/>
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
  selected_baby: state.home.selected_baby,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) =>
    dispatch(HomeActions.trackingApi(trackingData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GrowthScreen);
