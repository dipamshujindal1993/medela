import React, {Component} from 'react';
import {
  ScrollView, Text, View, TouchableOpacity,
  Animated, Keyboard
} from 'react-native';
import Button from '@components/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import I18n from '@i18n';

import {connect} from 'react-redux';
import AppActions from '@redux/AppRedux';
import UserActions from '@redux/UserRedux';

import styles from './Styles/OptedSetupScreenStyles';
import RadioGroup from 'react-native-custom-radio-group';
import CustomTextInput from '@components/CustomTextInput';
import DialogSelectAddress from '@components/DialogSelectAddress';
import Dialog from '@components/Dialog';
import KeyUtils from "@utils/KeyUtils";
import {
  Colors, Constants
} from '@resources'

import CustomMeasurementListView from "@components/CustomMeasurementListView";

import Down from '@svg/ic_down.svg';
import {otpEmail} from "../Redux/UserRedux";
import {StatesList} from "../StaticData/StatesList";
import { BackHandler , Platform} from 'react-native';
import {isEmpty} from "@utils/TextUtils";
import { clearPrevLocaleConfigAtRegistration, setI18nConfigBasedOnUserLocale } from '../I18n/I18n';
import { Analytics } from '@services/Firebase';

const optedOptions = [{
  label: I18n.t('profileSetup2.yes'),
  value: 'yes',
}, {
  label: I18n.t('profileSetup2.no'),
  value: 'no',
}];

const optedOptions1 = [{
  label: I18n.t('profileSetup2.become_a_tester'),
  value: 'yes',
}, {
  label: I18n.t('profileSetup2.dont_become_a_tester'),
  value: 'no',
}];

class OptedSetupScreen extends Component {

  constructor(props) {
    super(props);
    const {loadUserProfile} = this.props.navigation.state.params
    this.state = {
      errorMessageDialogVisible:false,
      isLoading:false,
      isUserProfileLoading:loadUserProfile== true,
      isOptedInForSms:false,
      isOptedInForMail:false,
      isOptedInForTesting:false,
      showStatesListViewEmail:false,
      showStatesListViewTester:false,
      noAddressFoundDialog:false,
      phoneNum:'',
      firstName:'',
      lastName:'',
      address:'',
      apt:'',
      city:'',
      states:'State',
      zipcode:'',

      phoneNumError:false,
      firstNameError:false,
      lastNameError:false,
      addressError:false,
      aptError:false,
      CityError:false,
      statesError:false,
      zipcodeError:false,
      showSelectAddressDialog:false,
      isNextBtnDisabled:true,
      isOptedInForMailValue:'',
      isOptedInForTestingValue:''
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.data = {
      "isOptedInForSms": false,
      "isOptedInForMail": false,
      "isOptedInForTesting": false
    }

  }
  async componentDidMount() {
    const {loadUserProfile} = this.props.navigation.state.params;
    const {getUserProfile}=this.props;
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    if(loadUserProfile==true){
      getUserProfile()
    }
    let analytics=new Analytics()
    await analytics.logScreenView('optin_setup_screen')
  }

  async componentDidUpdate(prevProps, prevState) {
    const {isOptedApiSuccess, isOptedApiFailure, optedErrorMessage,addressValidate, isValidateAddressApiSuccess, isValidateAddressApiFailure,userProfile,remoteConfig,userProfileSuccess,userProfileFailure,optedState,signInSuccess} = this.props;
    if (isOptedApiSuccess!=prevProps.isOptedApiSuccess && isOptedApiSuccess && prevState.isLoading) {
      this.setState({isLoading: false});
      const {isSignUp, market}=this.props.navigation.state.params
      if (!isSignUp){
        const {incompleteOptIn} = userProfile.mother
        if(incompleteOptIn && userProfile.mother.market==KeyUtils.US_MARKET) {
          this.props.navigation.navigate('PumpSetupScreen', {market: userProfile.mother.market, isSignUp});
        }
        else{
          await clearPrevLocaleConfigAtRegistration();
          let resp=await setI18nConfigBasedOnUserLocale(userProfile.mother,remoteConfig.markets,this.props.signInSuccess);
          resp===true&&this.props.signInSuccess()
        }
      }else {
        this.props.navigation.navigate('PumpSetupScreen',{market:this.props.navigation.state.params.market});
      }

    }
    if ((prevProps.isOptedApiFailure != isOptedApiFailure) && isOptedApiFailure && prevState.isLoading) {
      if (optedErrorMessage && optedErrorMessage!=''){
       this.setState({errorMessageDialogVisible:true,isLoading:false})
      }else {
        this.setState({isLoading: false});
      }

    }

    if (isValidateAddressApiSuccess!=prevProps.isValidateAddressApiSuccess && isValidateAddressApiSuccess && prevState.isLoading) {
      const {success,suggestedAddress}=addressValidate
      if (success){
        if(suggestedAddress && suggestedAddress != undefined){
          this.setState({isLoading: false, showSelectAddressDialog: true});
        }else{
          this.saveOptedInData()
        }
      }else {
        this.setState({isLoading: false, noAddressFoundDialog: true});
      }
    }
    if ((prevProps.isValidateAddressApiFailure != isValidateAddressApiFailure) && isValidateAddressApiFailure && prevState.isLoading) {
      this.setState({isLoading: false});
    }
    if(prevProps.userProfileSuccess != userProfileSuccess && userProfileSuccess && prevState.isUserProfileLoading){
      const {incompleteOptIn}=userProfile.mother;
      if(!incompleteOptIn&&userProfile.mother.hasOwnProperty('hasPump')){
        optedState({state:'initial',value:false,market:null});
        signInSuccess();
      }else if(incompleteOptIn==false && !userProfile.mother.hasOwnProperty('hasPump')){
        this.props.navigation.navigate('PumpSetupScreen',{market:this.props.navigation.state.params.market});
      }
      this.setState({isUserProfileLoading:false});
    }
    if(prevProps.userProfileFailure != userProfileFailure && userProfileFailure &&  prevState.isUserProfileLoading ){
      this.setState({isUserProfileLoading:false});
      console.log('userProfile API failure');
    }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
  }

  onBackPress = () => {
    return true;
  }

  showNoAddressFoundDialog() {
    const {noAddressFoundDialog} = this.state
    const {errorMessage}=this.props.addressValidate
    return (
      <Dialog
        visible={noAddressFoundDialog}
        title={I18n.t('opted.no_address_title')}
        message={errorMessage}
        positive={I18n.t('generic.close')}
        positiveOnPress={() => {
          this.setState({noAddressFoundDialog: false})
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  onPressRadioButton(radioButtonsArray) {
    const { saveData } = this.state
    const { addressValidate } = this.props
    if(saveData) {
      if(radioButtonsArray){
        const selectedAddress = radioButtonsArray && radioButtonsArray.filter((data)=> data.selected==true)
        if(selectedAddress.id=="1"){
          const add = addressValidate.suggestedAddress
          this.setState({
            address : add.AddressLineOne,
            apt:isEmpty(add.AddressLineTwo)?" ":add.AddressLineTwo,
            city:add.City,
            states:add.State,
            zipcode:add.PostalCode,
          }, () => this.saveOptedInData())
        }
        else {
          this.saveOptedInData()
        }
      }
      else{
        const add = addressValidate.suggestedAddress
        this.setState({
          address : add.AddressLineOne,
          apt:isEmpty(add.AddressLineTwo)?" ":add.AddressLineTwo,
          city:add.City,
          states:add.State,
          zipcode:add.PostalCode,
        }, () => this.saveOptedInData())
      }

    }
  }

  showAddressDialog() {
    const {addressValidate} = this.props
    const { selectedData } = this.state
    return (
      <DialogSelectAddress
        visible={this.state.showSelectAddressDialog}
        title={I18n.t('opted.address_dialog_title')}
        message={I18n.t('opted.address_dialog_desc')}
        positive={I18n.t('opted.address_dialog_positive')}
        negative={I18n.t('opted.address_dialog_nagetive')}
        addresses={addressValidate}
        onPressRadioButton={(selectedData) => this.setState({selectedData: selectedData})}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({ showSelectAddressDialog: false, saveData: false })
        }}
        positiveOnPress={() => {
          this.setState({ showSelectAddressDialog: false, saveData: true }, () => this.onPressRadioButton(selectedData))
        }}
        onDismiss={() => {
        }}
        textColor={this.textColor}
      />
    )
  };

  renderBottomView() {
    const {showAllQuestions, isSelected, insurancePump, pumpBrandSelected,phoneNum, pumpSelected,isNextBtnDisabled,phoneNumError} = this.state
    const{themeSelected}=this.props
    let bottomViewColor = Colors.white
    themeSelected === "dark" && (bottomViewColor= Colors.rgb_000000)
    return <View style={[styles.bottomViewStyle, {backgroundColor: bottomViewColor}]}>
      <View style={styles.indicatorView}>
        {/* <View style={styles.indicatorInactive}/> */}
        <View style={styles.indicatorActive}/>
        <View style={styles.indicatorInactive}/>
      </View>
      <Button
        //(!insurancePump ||  !pumpBrandSelected || !pumpSelected)
        // disabled={ (!isSelected) || (isSelected && !insurancePump ||  !pumpBrandSelected || !pumpSelected) }
        disabled={isNextBtnDisabled}
        title={I18n.t('profileSetup.next')}
        onPress={this.onNextPress}
        style={styles.buttonContainer}
      />
    </View>
  }

  onFirstNameUpdate(value){
    this.setState({firstName: value})
    if(value.trim()==='')
    this.setState({firstNameError:true},()=>{
      this.checkIsBtnDisabled()
    })
    else this.setState({firstNameError:false},()=>{
      this.checkIsBtnDisabled()
    })
  }
  onLastNameUpdate(value){
    this.setState({lastName: value})
    if(value.trim()==='')
    this.setState({lastNameError:true},()=>{
      this.checkIsBtnDisabled()
    })
    else this.setState({lastNameError:false},()=>{
      this.checkIsBtnDisabled()
    })
  }
  onAddressUpdate(value){
    this.setState({address: value})
    if(value.trim()==='')
    this.setState({addressError:true},()=>{
      this.checkIsBtnDisabled()
    })
    else this.setState({addressError:false},()=>{
      this.checkIsBtnDisabled()
    })
  }
  onAptUpdate(value){
    this.setState({apt: value})
    /*if(value.trim()==='')
    this.setState({aptError:true},()=>{
      this.checkIsBtnDisabled()
    })
    else this.setState({aptError:false},()=>{
      this.checkIsBtnDisabled()
    })*/
  }
  onCityUpdate(value){
    this.setState({city: value})
    if(value.trim()==='')
    this.setState({cityError:true},()=>{
      this.checkIsBtnDisabled()
    })
    else this.setState({cityError:false},()=>{
      this.checkIsBtnDisabled()
    })
  }
  onZipcodeUpdate(value){
    this.setState({zipcode: value})
    if(value.trim()==='')
    this.setState({zipcodeError:true},()=>{
      this.checkIsBtnDisabled()
    })
    else this.setState({zipcodeError:false},()=>{
      this.checkIsBtnDisabled()
    })
  }
  checkIsBtnDisabled=()=>{
    const {
      isOptedInForMail,
      isOptedInForTesting,
      firstNameError,
      lastNameError,
      addressError,
      cityError,
      statesError,
      zipcodeError,
      aptError,
      isOptedInForTestingValue,
      isOptedInForMailValue,
      isNextBtnDisabled,
      phoneNumError,
      phoneNum,
      firstName,
      lastName,
      address,
      city,
      states,
      zipcode,
      apt
    }=this.state;
    if(isOptedInForMail==false&&isOptedInForTesting==false){
      if(isOptedInForMailValue==''&&isOptedInForTestingValue==''){
        this.setState({isNextBtnDisabled:true})
      }else if(isOptedInForMailValue!=''&&isOptedInForTestingValue==''){
        this.setState({isNextBtnDisabled:true})
      }else if (isOptedInForMailValue==''&&isOptedInForTestingValue!=''){
        this.setState({isNextBtnDisabled:true})
      }else if(phoneNumError==true){
        this.setState({isNextBtnDisabled:true})
      }
      else{
        this.setState({isNextBtnDisabled:false})
      }
    }else if(isOptedInForTestingValue!=''&&isOptedInForMailValue!='') {
      if(isOptedInForMail==true&&isOptedInForTesting==false){
        if(phoneNumError==false&&firstNameError==false && firstName!='' && lastNameError==false &&lastName!='' &&addressError==false && address!='' &&cityError==false &&city!='' && statesError==false&&states!='State'&&zipcodeError==false &&zipcode!=''){
          this.setState({isNextBtnDisabled:false})
        }else{
          this.setState({isNextBtnDisabled:true})
        }
      }else if(isOptedInForTesting==true&&isOptedInForMail==false){

        if(phoneNumError==false&&firstNameError==false && firstName!='' && lastNameError==false &&lastName!='' &&addressError==false && address!='' &&cityError==false &&city!='' && statesError==false&&states!='State' &&zipcodeError==false &&zipcode!='' ){
          this.setState({isNextBtnDisabled:false})
        }else{
          this.setState({isNextBtnDisabled:true})
        }
      }else{
        if(phoneNumError==false&&firstNameError==false && firstName!='' && lastNameError==false &&lastName!='' &&addressError==false && address!='' &&cityError==false &&city!='' && statesError==false&&states!='State' &&zipcodeError==false &&zipcode!='' ){
          this.setState({isNextBtnDisabled:false})
        }else{
          this.setState({isNextBtnDisabled:true})
        }
      }
    }else{
      this.setState({isNextBtnDisabled:true})
    }
  }
  showEmailDetailsView() {
    const{themeSelected}=this.props
    let themeTextColor = themeSelected === 'dark' ? Colors.white: Colors.rgb_000000
    const {firstName, lastName, address,
      city, states, zipcode, apt, firstNameError, lastNameError, addressError,
      cityError, statesError, zipcodeError, aptError,
    } = this.state
    return (
      <View>
        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.first_name')}
          placeholderTextColor={themeTextColor}
          textStyles={[styles.textInput,{color:themeTextColor}]}
          onChangeText={(index, value) => this.onFirstNameUpdate(value)}
          error={firstNameError}
          value={firstName}
          errorMessage={I18n.t('opted.first_name_error')}
          onSubmitEditing={() => {
            this.lastNameTextInput.focus();
          }}
        />
        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.last_name')}
          placeholderTextColor={themeTextColor}
          textStyles={[styles.textInput,{color:themeTextColor}]}
          onChangeText={(index, value) => this.onLastNameUpdate(value)}
          error={lastNameError}
          value={lastName}
          errorMessage={I18n.t('opted.last_name_error')}
          onSubmitEditing={() => {
            this.addressTextInput.focus();
          }}
          inputRef={(input)=>{ this.lastNameTextInput = input }}
        />
        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.address')}
          placeholderTextColor={themeTextColor}
          textStyles={[styles.textInput,{color:themeTextColor}]}
          onChangeText={(index, value) => this.onAddressUpdate(value)}
          error={addressError}
          value={address}
          errorMessage={I18n.t('opted.address_error')}
          onSubmitEditing={() => {
            this.aptTextInput.focus();
          }}
          inputRef={(input)=>{ this.addressTextInput = input }}
        />

        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.apt_unit')}
          placeholderTextColor={themeTextColor}
          textStyles={[styles.textInput,{color:themeTextColor}]}
          onChangeText={(index, value) => this.onAptUpdate(value)}
          error={aptError}
          value={apt}
          errorMessage={I18n.t('opted.apt_unit_error')}
          onSubmitEditing={() => {
            this.cityTextInput.focus();
          }}
          inputRef={(input)=>{ this.aptTextInput = input }}
        />

        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.city')}
          placeholderTextColor={themeTextColor}
          textStyles={[styles.textInput,{color:themeTextColor}]}
          onChangeText={(index, value) => this.onCityUpdate(value)}
          error={cityError}
          value={city}
          errorMessage={I18n.t('opted.city_error')}
          onSubmitEditing={() => {
            this.setState({showStatesListViewEmail:true})
            Keyboard.dismiss()
          }}
          inputRef={(input)=>{ this.cityTextInput = input }}
        />

       <TouchableOpacity onPress={()=>this.setState({showStatesListViewEmail:true})}>
         <Text maxFontSizeMultiplier={1.7} style={[styles.dropDownTitle,{color:themeTextColor}]}>{states}</Text>
         <Down width={34} height={34} style={[styles.dropDownStyle,{color:themeTextColor}]}/>
         <View style={[styles.lineStyle,{color:themeTextColor}]}/>
       </TouchableOpacity>

        <CustomTextInput
          maxLength={5}
          placeholder={I18n.t('opted.zip')}
          placeholderTextColor={themeTextColor}
          textStyles={[styles.textInput,{color:themeTextColor}]}
          onChangeText={(index, value) => this.onZipcodeUpdate(value)}
          error={zipcodeError}
          value={zipcode}
          errorMessage={I18n.t('opted.zip_error')}
          inputRef={(input)=>{ this.zipTextInput = input }}
          returnKeyType={"done"}
          enableDoneButton={true}
          onSubmitEditing={Keyboard.dismiss}
          textContentType={'postalCode'}/>

      </View>
    )
  }
  onMailOptionSelected=(value)=>{
    if (value === 'yes') {
      this.setState({isOptedInForMail: true,isOptedInForMailValue:value},()=>{
        this.checkIsBtnDisabled();
      });
    } else {
      this.setState({isOptedInForMail: false,isOptedInForMailValue:value},()=>{
        this.checkIsBtnDisabled();
      });
    }
  }

  onTesterOptionSelected=(value)=>{
    if (value === 'yes') {
      this.setState({isOptedInForTesting: true,isOptedInForTestingValue:value},()=>{
        this.checkIsBtnDisabled();
      });
    } else {
      this.setState({isOptedInForTesting: false,isOptedInForTestingValue:value},()=>{
        this.checkIsBtnDisabled();
      });
    }
  }
  onPhoneNumberChange(text) {

    if(text.trim()!=='') {
      if (text.trim().length < 14) {
        this.setState({phoneNumError: true})
      } else {
        this.setState({phoneNumError: false})
      }
    }else{
      this.setState({phoneNumError: false})
    }

    let cleaned = ('' + text).replace(/\D/g, '')
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)

    if (match) {
      let intlCode = (match[1] ? '+1 ' : ''),
        number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');

      this.setState({
        phoneNum: number,
        phoneNumError: false
      });

      return;
    }

    this.setState({
      phoneNum: text
    });
    setTimeout(() => {
      this.checkIsBtnDisabled()
    }, 500);
  }

  showOptedErrorMessageDialog(){
    const {errorMessageDialogVisible} = this.state
    const{optedErrorMessage}=this.props
    return <Dialog
      visible={errorMessageDialogVisible}
      title={I18n.t('breastfeeding_pump.pump_alert_title')}
      message={optedErrorMessage.length>0?JSON.stringify(optedErrorMessage[0]):'Something went wrong'}
      positive={I18n.t('login.ok')}
      isIcon={false}
      positiveOnPress={() => {
        this.setState({ errorMessageDialogVisible: false})
      }}
      onDismiss={() => {
      }}
    />
  }
  render() {
    const {phoneNum, isLoading, isOptedInForMail, isOptedInForTesting, showStatesListViewEmail, phoneNumError,isUserProfileLoading, showSelectAddressDialog,noAddressFoundDialog,errorMessageDialogVisible} = this.state;
    const{themeSelected}=this.props
    let themeTextColor = themeSelected === 'dark' ? Colors.white: Colors.rgb_000000
    let inactiveRadioButtonColor = Colors.rgb_f5f5f5
    let activeRadioButtonColor = Colors.rgb_767676
    let activeTextColor = Colors.white
    if(isUserProfileLoading==true){
      return <LoadingSpinner/>
    }else return (
      <View style={{flex:1}}>
        <ScrollView  contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.container}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:themeTextColor}]}>{I18n.t('opted.title')}</Text>

            <CustomTextInput
              maxLength={14}
              textContentType="telephoneNumber"
              placeholder={I18n.t('opted.phone')}
              placeholderTextColor={themeTextColor}
              textStyles={[styles.textInput,{color:themeTextColor}]}
              onChangeText={(index, value) => this.onPhoneNumberChange(value)}
              error={phoneNumError}
              value={phoneNum}
              errorMessage={I18n.t('opted.phone_error')}
              returnKeyType={"done"}
              onSubmitEditing={Keyboard.dismiss}
            />

            <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:themeTextColor}]}>{I18n.t('opted.mail_ques')}</Text>

            <RadioGroup
              buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
              buttonContainerActiveStyle={[styles.radioBtnActive,{color:themeTextColor, backgroundColor: activeRadioButtonColor}]}
              buttonContainerStyle={[styles.radioBtnContainer,{color:themeTextColor}]}
              buttonTextActiveStyle={[styles.radioBtnTextActive, {color: Colors.white}]}
              buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:Colors.rgb_000000}]}
              onChange={this.onMailOptionSelected}
              radioGroupList={optedOptions}/>

            {isOptedInForMail && this.showEmailDetailsView()}

            <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:themeTextColor}]}>{I18n.t('opted.become_tester')}</Text>

            <RadioGroup
              buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
              buttonContainerActiveStyle={[styles.radioBtnActive,{color:themeTextColor, backgroundColor: activeRadioButtonColor}]}
              buttonContainerStyle={[styles.radioBtnContainer,{color:themeTextColor}]}
              buttonTextActiveStyle={[styles.radioBtnTextActive, {color: Colors.white}]}
              buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:Colors.rgb_000000}]}
              onChange={this.onTesterOptionSelected}
              radioGroupList={I18n.locale == 'en-US' ? optedOptions1 : optedOptions}/>

            {!isOptedInForMail && isOptedInForTesting && this.showEmailDetailsView()}


          </View>
        </ScrollView>
        {this.renderBottomView()}
        {showStatesListViewEmail && <CustomMeasurementListView
          data={StatesList}
          getItem={(item) => this.setState({states: item.value, showStatesListViewEmail: false},()=>{this.zipTextInput.focus();this.checkIsBtnDisabled()})}
          headerText={I18n.t('generic.select_state')}
        />}

        {/*{showStatesListViewTester && <CustomMeasurementListView*/}
        {/*  data={KeyUtils.GET_STATES}*/}
        {/*  getItem={(item) => this.setState({stateForTester: item.value, showStatesListViewTester: false})}*/}
        {/*  headerText={'Select State'}*/}
        {/*/>}*/}

        {isLoading && <LoadingSpinner/>}
        {showSelectAddressDialog && this.showAddressDialog()}
        {noAddressFoundDialog && this.showNoAddressFoundDialog()}
        {errorMessageDialogVisible && this.showOptedErrorMessageDialog()}

      </View>
    );
  }

  onNextPress = () => {
    const {isOptedInForMail,isOptedInForTesting, firstName, lastName, city,
      apt, address, states, zipcode} = this.state
    if(isOptedInForMail || isOptedInForTesting) {

      if(firstName.trim()===''){
        this.setState({firstNameError:true})
        return
      }
      else if(lastName.trim()===''){
        this.setState({lastNameError:true})
        return
      }
      else if(address.trim()===''){
        this.setState({addressError:true})
        return
      }

      else if(city.trim()===''){
        this.setState({cityError:true})
        return
      }
      else if(states.trim()==='State'){
        alert(I18n.t('opted.state_error'))
        return
      }
      else if(zipcode.trim()===''){
        this.setState({zipcodeError:true})
        return
      }else {

        let addressData = {
          addressLineOne: address,
          addressLineTwo: (apt===undefined || apt=='')?' ': apt.length > 1  ? apt.trim():' ',
          city: city,
          state: states,
          postalCode: zipcode
        }
        this.setState({isLoading: true});
        this.props.validateAddressApi(addressData);
      }
    }else{
      this.saveOptedInData()
    }
  }

  saveOptedInData = () => {
    const {phoneNum, isOptedInForMail, isOptedInForTesting, firstName, lastName, city,
      apt, address, states, zipcode, saveData} = this.state

    this.data['isOptedInForMail'] = isOptedInForMail
    this.data['isOptedInForTesting'] = isOptedInForTesting

    if(phoneNum.trim() !=='') {
      if(phoneNum.trim().length<14){
        this.setState({phoneNumError:true})
        return;
      }else {
        this.data['phone'] = phoneNum
        this.data['isOptedInForSms'] = true
      }
    }else{
      this.data['isOptedInForSms'] = false
    }

    if(isOptedInForMail || isOptedInForTesting) {

      if(firstName.trim()===''){
        this.setState({firstNameError:true})
        return
      }
      else if(lastName.trim()===''){
        this.setState({lastNameError:true})
        return
      }
      else if(address.trim()===''){
        this.setState({addressError:true})
        return
      }
      else if(!saveData && apt.trim()===''){
        this.setState({aptError:true})
        return
      }
      else if(city.trim()===''){
        this.setState({cityError:true})
        return
      }
      else if(states.trim()==='State'){
        alert(I18n.t('opted.state_error'))
        return
      }
      else if(zipcode.trim()===''){
        this.setState({zipcodeError:true})
        return
      }else {

        this.data['firstName'] = firstName
        this.data['lastName'] = lastName

        let dd = {
          streetAddress1: address,
          streetAddress2: isEmpty(apt)?' ':apt,
          city: city,
          stateAbbrev: states,
          postalCode: zipcode
        }
        this.data['address'] = dd
        this.setState({isLoading: true});
        this.props.optedApi(this.data);
      }
    }else{
      this.setState({isLoading: true});
      this.props.optedApi(this.data);
    }
  };
}

const mapStateToProps = (state) => ({
  isOptedApiSuccess: state.user.isOptedApiSuccess,
  isOptedApiFailure: state.user.isOptedApiFailure,
  optedErrorMessage:state.user.optedErrorMessage,
  themeSelected: state.app.themeSelected,
  addressValidate: state.user.addressValidate,
  isValidateAddressApiSuccess: state.user.isValidateAddressApiSuccess,
  isValidateAddressApiFailure: state.user.isValidateAddressApiFailure,
  userProfile: state.user.userProfile,
  userProfileSuccess:state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  remoteConfigs:state.remoteConfig,
});

const mapDispatchToProps = (dispatch) => ({
  optedApi: (data) => dispatch(UserActions.optedApi(data)),
  validateAddressApi: (data) => dispatch(UserActions.validateAddressApi(data)),
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  optedState: (keys) => dispatch(AppActions.optedState(keys)),
  signInSuccess: () => dispatch(AppActions.signInSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OptedSetupScreen);
