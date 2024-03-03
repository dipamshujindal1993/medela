import React, { Component, Fragment } from 'react'
import {View, SafeAreaView, TouchableOpacity, Text, FlatList, Linking, Platform, AppState, Keyboard,KeyboardAvoidingView} from 'react-native'
import HeaderTitle from '@components/HeaderTitle'
import I18n from '@i18n';
import LoadingSpinner from '@components/LoadingSpinner'
import Dialog from "@components/Dialog";
import SwitchOnIcon from '@svg/ic_switch_on';
import SwitchOffIcon from '@svg/ic_switch_off';
import styles from './Styles/NotificationsStyles';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import { checkNotifications } from 'react-native-permissions';
import PushNotification from "react-native-push-notification";
import CustomTextInput from "../Components/CustomTextInput";
import Colors from "../Resources/Colors";
import {connect} from 'react-redux';
import UserActions from '@redux/UserRedux';
import Toast from '@components/ToastMessage';
import DialogSelectAddress from '@components/DialogSelectAddress';
import { isEmpty,phoneNumberInUsFormat } from '@utils/TextUtils'
import Down from '@svg/ic_down.svg';
import {StatesList} from '../StaticData/StatesList';
import CustomMeasurementListView from '@components/CustomMeasurementListView';
import { saveMotherProfile} from '@database/AddBabyDatabase';
import {verticalScale} from '../Resources/Metrics';
import { scheduleFreezer1Notifications, scheduleFreezer2Notifications } from '@components/Notifications';
import { I18nManager } from 'react-native';
import { Header } from 'react-navigation-stack';
import { Analytics } from '@services/Firebase';
import { getRealmDb } from '../Database/AddBabyDatabase';

let analytics = new Analytics()

class Notifications extends Component{
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      standard: true,
      missingMilkVolume: true,
      pumpSessionComplete: true,
      appNotification: false,
      bca: false,
      cp: false,
      birthday: false,
      virtualFreezerCongrats: false,
      // breastFeedingPumping: false,
      // diaper: false,
      // height: false,
      // weight: false,
      milkExpired: false,
      milkAboutToExpire: false,
      phoneNum:'',
      sms:false,
      mail:false,
      beta:false,
      isLoading: false,

      showSelectAddressDialog:false,
      firstName:'',
      lastName:'',
      address:'',
      apt:'',
      city:'',
      states:I18n.t('generic.select_state'),
      zipcode:'',

      showSelectAddressDialogBeta: false,
      firstNameBeta:'',
      lastNameBeta:'',
      addressBeta:'',
      aptBeta:'',
      cityBeta:'',
      statesBeta:I18n.t('generic.select_state'),
      zipcodeBeta:'',
      isEmailNewsLetter:false,
      isSaveEnabled:false,
      isMailValue:0,
      showBadArticles: false
    }
    this.saveButtonType = ""
    this.data = {}
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount(){
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    let realmDb=await getRealmDb()
    this.setState({realmDb})
    let profile = realmDb.objects('UserMotherProfile');
    let userProfile = JSON.parse(JSON.stringify(profile))
    this.setState({userProfile:userProfile[0]})
    AppState.addEventListener("change", this._handleAppStateChange);
    this.checkPushNotifications()
    this.checkInAppNotification()
    this.setState({ data: I18n.t('NotificationsData').NotificationsData,isEmailNewsLetter: userProfile[0].mother.isOptedInForEmail})
    this.setState({isLoading:true,})
    const{getOptedApi}=this.props
    getOptedApi()
    await analytics.logScreenView('notifications_screen')
    //isEmailNewsLetter:userProfile[0].mother.isOptedInForEmail
  }

  handleUserProfileApiResponse(prevProps,prevState){
    const {getMyBabies, userProfileSuccess, userProfileFailure, userProfile ,getOptedApi} = this.props

    if (userProfileSuccess != prevProps.userProfileSuccess && userProfileSuccess && prevState.isLoading) {
      const {isOptedInForEmail,username} = userProfile.mother
      this.setState({ userProfile,isEmailNewsLetter:isOptedInForEmail })

      let mP = JSON.parse(JSON.stringify(userProfile))
      mP['username'] = username
      mP.isSync = true
      saveMotherProfile(this.state.realmDb, mP).then(r => {
      })
      this.setState({isLoading: false})
    }

    if (userProfileFailure !== prevProps.userProfileFailure && userProfileFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {isOptedApiSuccess, isOptedApiFailure, getUserProfile, addressValidate,isValidateAddressApiSuccess, optedErrorMessage,isValidateAddressApiFailure,getOptedResponse,isGetOptedApiFailure,isGetOptedApiSuccess,isProfile,isProfileError} = this.props;
    this.handleUserProfileApiResponse(prevProps,prevState)

    if (isProfile != prevProps.isProfile && isProfile && prevState.isLoading) {
        let profile = this.state.realmDb.objects('UserMotherProfile');
        let userProfile = JSON.parse(JSON.stringify(profile))
        let mP=userProfile[0]
        mP.mother.isOptedInForEmail=this.state.isEmailNewsLetter
        mP.isSync=true
        saveMotherProfile(this.state.realmDb, mP).then(r => {
        })
        getUserProfile()
    }

    if (isProfileError != prevProps.isProfileError && isProfileError && prevState.isLoading) {
      this.setState({isLoading: false})
    }

    if (isGetOptedApiSuccess!=prevProps.isGetOptedApiSuccess && isGetOptedApiSuccess && prevState.isLoading) {
      const {isOptedInForSms,isOptedInForTesting,isOptedInForMail,phone}=getOptedResponse
      getUserProfile()
      if (isOptedInForSms){
        const {isOptedInForSms,phone,}=getOptedResponse
        this.setState({sms:isOptedInForSms,phoneNum:phoneNumberInUsFormat(phone),phoneNumError:false});
      }
      if (isOptedInForMail){
        const {isOptedInForMail,firstName,lastName,address}=getOptedResponse
        const {city,postalCode,streetAddress1,streetAddress2,stateAbbrev}=address
        this.setState({mail:isOptedInForMail,firstName,lastName,city,zipcode:postalCode,address:streetAddress1,apt:(streetAddress2=="" || streetAddress2===undefined)?"  ":streetAddress2,states:stateAbbrev});
      }
      if (isOptedInForTesting){
        const {isOptedInForTesting,firstName,lastName,address}=getOptedResponse
        const {city,postalCode,streetAddress1,streetAddress2,stateAbbrev}=address
        this.setState({beta:isOptedInForTesting,firstName,lastName,city,zipcode:postalCode,address:streetAddress1,apt:(streetAddress2=="" || streetAddress2===undefined)?"  ":streetAddress2,states:stateAbbrev});
      }
    }

    if (isGetOptedApiFailure!=prevProps.isGetOptedApiFailure && isGetOptedApiFailure && prevState.isLoading) {
      getUserProfile()
    }

    if (isOptedApiSuccess!=prevProps.isOptedApiSuccess && isOptedApiSuccess && prevState.isLoading) {
      this.setState({isLoading: false});
      this.props.navigation.goBack()
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
  }


  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  checkPushNotifications() {
    checkNotifications().then(({status}) => {
      if(status === 'granted'){
        // AsyncStorage.getItem(KeyUtils.BREASTFEEDING_PUMPING_NOTIF, (err, result) => {
        //   this.setState({ breastFeedingPumping: result === "false" ? false : true })
        //   AsyncStorage.setItem(KeyUtils.BREASTFEEDING_PUMPING_NOTIF, result === "false" ? 'false' : 'true');
        //   AsyncStorage.getItem(KeyUtils.DIAPER_NOTIF, (err, result) => {
        //     this.setState({ diaper: result === "false" ? false : true })
        //     AsyncStorage.setItem(KeyUtils.DIAPER_NOTIF, result === "false" ? 'false' : 'true');
        //   })
          // AsyncStorage.getItem(KeyUtils.WEIGHT_NOTIFICATION, (err, result) => {
          //   this.setState({ weight: result === "false" ? false : true })
          //   AsyncStorage.setItem(KeyUtils.WEIGHT_NOTIFICATION, result === "false" ? 'false' : 'true');
          // })
          // AsyncStorage.getItem(KeyUtils.HEIGHT_NOTIFICATION, (err, result) => {
          //   this.setState({ height: result === "false" ? false : true })
          //   AsyncStorage.setItem(KeyUtils.HEIGHT_NOTIFICATION, result === "false" ? 'false' : 'true');
          // })
          AsyncStorage.getItem(KeyUtils.MILK_ABOUT_TO_EXPIRE_NOTIF, (err, result) => {
            this.setState({ milkAboutToExpire: result === "false" ? false : true })
            AsyncStorage.setItem(KeyUtils.MILK_ABOUT_TO_EXPIRE_NOTIF, result === "false" ? 'false' : 'true');
          })
          AsyncStorage.getItem(KeyUtils.MILK_EXPIRE_NOTIF, (err, result) => {
            this.setState({ milkExpired: result === "false" ? false : true })
            AsyncStorage.setItem(KeyUtils.MILK_EXPIRE_NOTIF, result === "false" ? 'false' : 'true');
          })
          this.setState({ appNotification: true })
        // })
      } else {
        this.setState({
          appNotification: false,
          milkExpired: false,
          milkAboutToExpire: false
          // breastFeedingPumping: false,
          // diaper: false,
          // weight: false,
          // height: false,
          // loading: false
        })
      }
    });
  }

  checkInAppNotification() {
    AsyncStorage.getItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN, (err, result) => {
      this.setState({ missingMilkVolume: result === "true" ? false : true  })
    })
    AsyncStorage.getItem(KeyUtils.PUMP_COMPLETE_NEVER_SHOW_AGAIN, (err, result) => {
      this.setState({ pumpSessionComplete: result === "true" ? false : true  })
    })
    AsyncStorage.getItem(KeyUtils.NEVER_SHOW_BAD_ARTICLES, (err, result) => {
      this.setState({ showBadArticles: result !== "true" })
    })
    AsyncStorage.getItem(KeyUtils.BCA_POPUP_NOTIF, (err, result) => {
      this.setState({ bca: result === "false" ? false : true })
    })
    AsyncStorage.getItem(KeyUtils.CP_POPUP_NOTIF, (err, result) => {
      this.setState({ cp: result === "false" ? false : true })
    })
    AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS_NOTIF, (err, result) => {
      this.setState({ virtualFreezerCongrats: result == "false" ? false : true })
    })
    AsyncStorage.getItem(KeyUtils.BIRTHDAY_POPUP_NOTIF, (err, result) => {
      this.setState({ birthday: result === "false" ? false : true })
    })
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState == 'active') {
      this.checkPushNotifications()
    }
  };

  onPhoneNumberChange(text) {

    if(text.trim()!=='') {
      if (text.trim().length < 10) {
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
        phoneNum: number
      });

      return;
    }

    this.setState({
      phoneNum: text
    });

  }
  onFirstNameBetaUpdate(value){
    this.setState({firstNameBeta: value})
    if(value.trim()==='')
      this.setState({firstNameBetaError:true})
    else this.setState({firstNameBetaError:false})
  }
  onLastNameBetaUpdate(value){
    this.setState({lastNameBeta: value})
    if(value.trim()==='')
      this.setState({lastNameBetaError:true})
    else this.setState({lastNameBetaError:false})
  }
  onAddressBetaUpdate(value){
    this.setState({addressBeta: value})
    if(value.trim()==='')
      this.setState({addressBetaError:true})
    else this.setState({addressBetaError:false})
  }
  onAptBetaUpdate(value){
    this.setState({aptBeta: value})
    if(value.trim()==='')
      this.setState({aptBetaError:true})
    else this.setState({aptBetaError:false})
  }
  onCityBetaUpdate(value){
    this.setState({cityBeta: value})
    if(value.trim()==='')
      this.setState({cityBetaError:true})
    else this.setState({cityBetaError:false})
  }
  onZipcodeBetaUpdate(value){
    this.setState({zipcodeBeta: value})
    if(value.trim()==='')
      this.setState({zipcodeBetaError:true})
    else this.setState({zipcodeBetaError:false})
  }


  renderBetaTesterView(){
    const {firstNameBeta, lastNameBeta, addressBeta,
      cityBeta, zipcodeBeta, aptBeta, firstNameBetaError, lastNameBetaError, addressBetaError,
      cityBetaError, zipcodeBetaError, aptBetaError,statesBeta,
    } = this.state
    return (
      <View>
        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.first_name')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onFirstNameBetaUpdate(value)}
          error={firstNameBetaError}
          value={firstNameBeta}
          errorMessage={I18n.t('opted.first_name_error')}
          onSubmitEditing={() => {
            this.lastNameTextInput.focus();
          }}
          enableDoneButton={false}
        />
        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.last_name')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onLastNameBetaUpdate(value)}
          error={lastNameBetaError}
          value={lastNameBeta}
          errorMessage={I18n.t('opted.last_name_error')}
          onSubmitEditing={() => {
            this.addressTextInput.focus();
          }}
          inputRef={(input)=>{ this.lastNameTextInput = input }}
        />
        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.address')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onAddressBetaUpdate(value)}
          error={addressBetaError}
          value={addressBeta}
          errorMessage={I18n.t('opted.address_error')}
          onSubmitEditing={() => {
            this.aptTextInput.focus();
          }}
          inputRef={(input)=>{ this.addressTextInput = input }}
        />

        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.apt_unit')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onAptBetaUpdate(value)}
          error={aptBetaError}
          value={aptBeta}
          errorMessage={I18n.t('opted.apt_unit_error')}
          onSubmitEditing={() => {
            this.cityTextInput.focus();
          }}
          inputRef={(input)=>{ this.aptTextInput = input }}
        />

        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.city')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onCityBetaUpdate(value)}
          error={cityBetaError}
          value={cityBeta}
          errorMessage={I18n.t('opted.city_error')}
          onSubmitEditing={() => {
            // this.setState({showStatesListViewEmail:true})
            Keyboard.dismiss()
          }}
          inputRef={(input)=>{ this.cityTextInput = input }}
        />

        <TouchableOpacity onPress={()=>this.setState({showStatesListViewEmail:true,betaStateDialog:true})}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.dropDownTitle,{color:this.textColor}]}>{statesBeta}</Text>
          <Down width={34} height={34} style={styles.dropDownStyle}/>
          <View style={styles.lineStyle}/>
        </TouchableOpacity>

        <CustomTextInput
          maxLength={5}
          placeholder={I18n.t('opted.zip')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onZipcodeBetaUpdate(value)}
          error={zipcodeBetaError}
          value={zipcodeBeta}
          errorMessage={I18n.t('opted.zip_error')}
          inputRef={(input)=>{ this.zipTextInput = input }}
          returnKeyType={"done"}
          onSubmitEditing={Keyboard.dismiss}
          enableDoneButton={true}
          onFocus={()=>{
            this.setState({zipCodeFocus:true})
          }}
          onBlur={()=>{
            this.setState({zipCodeFocus:false})
          }}
          textContentType={'postalCode'}/>
      </View>
    )
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

  onFirstNameUpdate(value){
    this.setState({firstName: value})
    if(value.trim()==='')
      this.setState({firstNameError:true})
    else this.setState({firstNameError:false})
  }
  onLastNameUpdate(value){
    this.setState({lastName: value})
    if(value.trim()==='')
      this.setState({lastNameError:true})
    else this.setState({lastNameError:false})
  }
  onAddressUpdate(value){
    this.setState({address: value})
    if(value.trim()==='')
      this.setState({addressError:true})
    else this.setState({addressError:false})
  }
  onAptUpdate(value){
    this.setState({apt: value})
  }
  onCityUpdate(value){
    this.setState({city: value})
    if(value.trim()==='')
      this.setState({cityError:true})
    else this.setState({cityError:false})
  }
  onZipcodeUpdate(value){
    this.setState({zipcode: value})
    if(value.trim()==='')
      this.setState({zipcodeError:true})
    else this.setState({zipcodeError:false})
  }
  renderMailView(){
    const {firstName, lastName, address,
      city, states, zipcode, apt, firstNameError, lastNameError, addressError,
      cityError, statesError, zipcodeError, aptError,
    } = this.state
    return (
      <View>
        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.first_name')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onFirstNameUpdate(value)}
          error={firstNameError}
          value={firstName}
          errorMessage={I18n.t('opted.first_name_error')}
          onSubmitEditing={() => {
            this.lastNameTextInput.focus();
          }}
          enableDoneButton={false}
        />
        <CustomTextInput
          maxLength={50}
          placeholder={I18n.t('opted.last_name')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
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
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
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
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
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
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onCityUpdate(value)}
          error={cityError}
          value={city}
          errorMessage={I18n.t('opted.city_error')}
          onSubmitEditing={() => {
           // this.setState({showStatesListViewEmail:true})
            Keyboard.dismiss()
          }}
          inputRef={(input)=>{ this.cityTextInput = input }}
        />

        <TouchableOpacity onPress={()=>this.setState({showStatesListViewEmail:true,betaStateDialog:false})}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.dropDownTitle,{color:this.textColor}]}>{states}</Text>
          <Down width={34} height={34} style={styles.dropDownStyle}/>
          <View style={styles.lineStyle}/>
        </TouchableOpacity>

        <CustomTextInput
          maxLength={5}
          placeholder={I18n.t('opted.zip')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          onChangeText={(index, value) => this.onZipcodeUpdate(value)}
          error={zipcodeError}
          value={zipcode}
          errorMessage={I18n.t('opted.zip_error')}
          inputRef={(input)=>{ this.zipTextInput = input }}
          returnKeyType={"done"}
          onSubmitEditing={Keyboard.dismiss}
          enableDoneButton={true}
          onFocus={()=>{
            this.setState({zipCodeFocus:true})
          }}
          onBlur={()=>{
            this.setState({zipCodeFocus:false})
          }}
          textContentType={'postalCode'}/>
      {/*  <Button
          title={I18n.t('generic.save').toString().toUpperCase()}
          onPress={()=>this.onMailSavePress()}
          style={styles.buttonContainer}
        />*/}
      </View>
    )
  }

  saveOptedInMailData = () => {
    const {firstName, lastName, city,
      apt, address, states, zipcode, saveData} = this.state

    this.data['isOptedInForMail'] = false

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
      this.data['isOptedInForSms'] = false
      this.data['isOptedInForMail'] = true
      this.data['isOptedInForTesting'] = false

      this.data['firstName'] = firstName
      this.data['lastName'] = lastName

      let dd = {
        streetAddress1: address,
        streetAddress2: isEmpty(apt) ? "  " : apt,
        city: city,
        stateAbbrev: states,
        postalCode: zipcode
      }

      this.data['address'] = dd
      this.setState({isLoading: true});
      this.props.optedApi(this.data);
    }
  }


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
            apt:isEmpty(add.AddressLineTwo)?"  ":add.AddressLineTwo,
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
          apt:isEmpty(add.AddressLineTwo)?"  ":add.AddressLineTwo,
          city:add.City,
          states:add.State,
          zipcode:add.PostalCode,
        }, () => this.saveOptedInData())
      }

    }
  }

  saveOptedInData = () => {
    const {phoneNum, firstName, lastName, city,
      apt, address, states, zipcode, beta, mail} = this.state


    this.data['isOptedInForMail'] = mail
    this.data['isOptedInForTesting'] = beta

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

    if(mail || beta) {

      if(firstName.trim()===''){
        this.setState({firstNameError:true})

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

        this.data['firstName'] = firstName
        this.data['lastName'] = lastName

        let dd = {
          streetAddress1: address,
          streetAddress2: isEmpty(apt) ? "  " : apt,
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
        onPressRadioButton={(selectedData) => {
          this.setState({selectedData: selectedData})
        } }
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

  renderSmsView(){
    const {phoneNum,phoneNumError}=this.state
    return <View>
      <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:this.textColor}]}>{I18n.t('opted.title')}</Text>
      <CustomTextInput
        maxLength={14}
        textContentType="telephoneNumber"
        placeholder={I18n.t('opted.phone')}
        placeholderTextColor={this.textColor}
        textStyles={[styles.textInput,{color:this.textColor}]}
        onChangeText={(index, value) => this.onPhoneNumberChange(value)}
        error={phoneNumError}
        value={phoneNum}
        errorMessage={I18n.t('opted.phone_error')}
        enableDoneButton={true}
        onSubmitEditing={Keyboard.dismiss}
        onFocus={()=>{
          this.setState({phoneNumFocus:true})
        }}
        onBlur={()=>{
          this.setState({phoneNumFocus:false})
        }}
      />

    </View>
  }

  onSMSSavePress = () => {
    const {phoneNum, sms, beta, mail} = this.state;
    if (!sms && !beta && !mail) {
      this.data['isOptedInForSms'] = false;
      this.data['isOptedInForMail'] = false;
      this.data['isOptedInForTesting'] = false;
      this.setState({isLoading: true});
      this.props.optedApi(this.data);
    } else {
      this.data['isOptedInForSms'] = false;
      this.data['isOptedInForMail'] = false;
      this.data['isOptedInForTesting'] = false;
      if (sms) {
        if (phoneNum.trim() == '' || phoneNum.trim().length < 14) {
          this.setState({phoneNumError: true});
          return;
        }else {
          this.data['isOptedInForSms'] = true;
          this.data['phone'] = phoneNum;
        }
      }
      if (mail || beta){
          const { firstName, lastName, city, apt, address, states, zipcode} = this.state
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
          else if(states.trim()===I18n.t('generic.select_state')){
            alert(I18n.t('opted.state_error'))
            return
          }
          else if(zipcode.trim()===''){
            this.setState({zipcodeError:true})
            return
          }else {
            let addressData = {
              addressLineOne: address,
              addressLineTwo: isEmpty(apt) ? "  " : apt,
              city: city,
              state: states,
              postalCode: zipcode
            }
            this.setState({isLoading: true});
            this.props.validateAddressApi(addressData);

            let dd = {
              streetAddress1: address,
              streetAddress2: apt,
              city: city,
              stateAbbrev: states,
              postalCode: zipcode
            }
            this.data['address']=dd
            this.data['isOptedInForMail'] = true;
            this.data['firstName']=firstName
            this.data['lastName']=lastName
            /*this.setState({isLoading: true});
            this.props.validateAddressApi(addressData);*/
          }
      }else {
        this.setState({isLoading: true});
        this.props.optedApi(this.data);
      }
    }


  };


  renderNotification(item,index){
    const {userProfile}=this.state
    return <View key={index.toString()}>
      {(item.list !== undefined) ?
        <Text
          accessibilityLabel={I18n.t(item.label)}
          accessible={true}
          maxFontSizeMultiplier={1.7}
          style={[styles.notificationTitleTextStyle,{color:this.textColor}]}>
          {item.title}
        </Text> : null }
      {(item.list !== undefined) ? item.list.map((listItem, index) =>
          <Fragment key={listItem.Key}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.itemViewStyle}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{listItem.item}</Text>
              </View>
              {this.renderItem(listItem)}

            </View>

          </Fragment>
        )
        :
        <Fragment key={item.Key}>
          {(item.Key=='SMS' || item.Key=='Mail'  || item.Key=='Beta Tester') && userProfile.mother.market!==KeyUtils.US_MARKET ?
            null:
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.itemViewStyle}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{item.item}</Text>
              </View>
              {this.renderItem(item)}
            </View>
          }
          {item.Key=='SMS' && this.state.sms && this.renderSmsView()}
          {item.Key=='Mail' && (this.state.mail) && this.renderMailView()}
          {item.Key=='Beta Tester' && (this.state.beta && !this.state.mail) && this.renderMailView()}
          <View style={{paddingBottom:item.Key=='Beta Tester' && (this.state.phoneNumFocus ||  this.state.zipCodeFocus) ?verticalScale(150):0 }}>
          </View>

        </Fragment>
      }
    </View>
  }
  renderListItem=({item})=>{
    const {userProfile}=this.state
    return(
      <View>
        <View style={styles.listItemViewStyle}>
          <View style={styles.itemTextViewStyle}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.notificationTitleTextStyle,{color:this.textColor}]}>{item.notifications_heading}</Text>
            {item.notification_description ?  <Text maxFontSizeMultiplier={1.7} style={[styles.notificationContentTextStyle,{color:this.textColor}]}>{item.notification_description}</Text> : null}
            <View>
              {item.notifications_list.map((e, index) =>this.renderNotification(e,index)
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }

  onClickToggle(item){
    if (item=='Email newsletters'){
      const {isEmailNewsLetter}=this.state
      if (!isEmailNewsLetter){
         this.setState({isEmailSubscriptionDialog:true})
      }else {
        this.setState({isEmailNewsLetter: !this.state.isEmailNewsLetter},()=>{
          this.updateEmailSubscription()
        })

      }

    } else if(item === "Allow Notifications"){
      if(Platform.OS === 'ios'){
        Linking.openURL('app-settings://')
      } else {
        Linking.openSettings();
      }
    } else if(item === "Missing Milk Volume") {
      if(this.state.missingMilkVolume) {
        this.setState({ missingMilkVolume: false })
        AsyncStorage.setItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN, 'true');
      } else {
        this.setState({ missingMilkVolume: true })
        AsyncStorage.removeItem(KeyUtils.VOLUME_NEVER_SHOW_AGAIN)
      }
    } else if(item === "Breastfeeding & Pumping") {
      if(this.state.showBadArticles) {
        this.setState({ showBadArticles: false })
        AsyncStorage.setItem(KeyUtils.NEVER_SHOW_BAD_ARTICLES, 'true');
      } else {
        this.setState({ showBadArticles: true })
        AsyncStorage.removeItem(KeyUtils.NEVER_SHOW_BAD_ARTICLES)
      }
    } else if(item === "Pump Session Complete") {
      if(this.state.pumpSessionComplete) {
        this.setState({ pumpSessionComplete: false })
        AsyncStorage.setItem(KeyUtils.PUMP_COMPLETE_NEVER_SHOW_AGAIN, 'true');
      } else {
        this.setState({ pumpSessionComplete: true })
        AsyncStorage.removeItem(KeyUtils.PUMP_COMPLETE_NEVER_SHOW_AGAIN)
      }
    } else if(item === "Breastfeeding Confidence") {
      if(this.state.bca) {
        this.setState({ bca: false })
        AsyncStorage.setItem(KeyUtils.BCA_POPUP_NOTIF, 'false')
      } else {
        this.setState({ bca: true })
        AsyncStorage.setItem(KeyUtils.BCA_POPUP_NOTIF, 'true');
      }
    } else if(item === "Content Personalization") {
      if(this.state.cp) {
        this.setState({ cp: false })
        AsyncStorage.setItem(KeyUtils.CP_POPUP_NOTIF, 'false')
      } else {
        this.setState({ cp: true })
        AsyncStorage.setItem(KeyUtils.CP_POPUP_NOTIF, 'true');
      }
    } else if(item === "Baby Birth Date") {
      if(this.state.birthday) {
        this.setState({ birthday: false })
        AsyncStorage.setItem(KeyUtils.BIRTHDAY_POPUP_NOTIF, 'false')
      } else {
        this.setState({ birthday: true })
        AsyncStorage.setItem(KeyUtils.BIRTHDAY_POPUP_NOTIF, 'true');
      }
    } else if(item === "Congratulations") {
      if(this.state.virtualFreezerCongrats) {
        this.setState({ virtualFreezerCongrats: false })
        AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS_NOTIF, 'false')
      } else {
        this.setState({ virtualFreezerCongrats: true })
        AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS_NOTIF, 'true');
      }
    } else if(this.state.appNotification) {
       if(item === "Milk About to Expire") {
        if(this.state.milkAboutToExpire) {
          AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, (err, result) => {
            if(result !== null && JSON.parse(result).length > 0) {
              JSON.parse(result).map((record) => {
                PushNotification.cancelLocalNotifications({ id: record.notifId });
              })
            }
          })
          AsyncStorage.removeItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS)
          AsyncStorage.setItem(KeyUtils.MILK_ABOUT_TO_EXPIRE_NOTIF, 'false')
          this.setState({ milkAboutToExpire: false })
        } else {
          this.setState({ milkAboutToExpire: true })
          AsyncStorage.setItem(KeyUtils.MILK_ABOUT_TO_EXPIRE_NOTIF, 'true');
          scheduleFreezer2Notifications()
        }
       } else if(item === 'Milk Expired') {
        if(this.state.milkExpired) {
          AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, (err, result) => {
            if(result !== null && JSON.parse(result).length > 0) {
              JSON.parse(result).map((record) => {
                PushNotification.cancelLocalNotifications({ id: record.notifId });
              })
            }
          })
          AsyncStorage.removeItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS)
          AsyncStorage.setItem(KeyUtils.MILK_EXPIRE_NOTIF, 'false')
          this.setState({ milkExpired: false })
        } else {
          AsyncStorage.setItem(KeyUtils.MILK_EXPIRE_NOTIF, 'true');
          this.setState({ milkExpired: true })
          scheduleFreezer1Notifications()
        }
       }
      // if(item === "Breastfeeding and Pumping") {
      //   if(this.state.breastFeedingPumping) {
      //     AsyncStorage.getItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS, (err, result) => {
      //       if(result !== null && JSON.parse(result).length > 0) {
      //         JSON.parse(result).map((record) => {
      //           PushNotification.cancelLocalNotifications({ id: record });
      //         })
      //       }
      //     })
      //     AsyncStorage.setItem(KeyUtils.BREASTFEEDING_PUMPING_NOTIF, 'false')
      //     AsyncStorage.removeItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS)
      //     this.setState({ breastFeedingPumping: false })
      //   } else {
      //     this.setState({ breastFeedingPumping: true })
      //     AsyncStorage.setItem(KeyUtils.BREASTFEEDING_PUMPING_NOTIF, 'true');
      //   }
      // } else if(item === "Diaper") {
      //   if(this.state.diaper) {
      //     AsyncStorage.getItem(KeyUtils.NAPPY_NOTIFICATIONS, (err, result) => {
      //       if(result !== null && JSON.parse(result).length > 0) {
      //         JSON.parse(result).map((record) => {
      //           PushNotification.cancelLocalNotifications({ id: record });
      //         })
      //       }
      //     })
      //     AsyncStorage.setItem(KeyUtils.DIAPER_NOTIF, 'false')
      //     AsyncStorage.removeItem(KeyUtils.NAPPY_NOTIFICATIONS)
      //     this.setState({ diaper: false })
      //   } else {
      //     this.setState({ diaper: true })
      //     AsyncStorage.setItem(KeyUtils.DIAPER_NOTIF, 'true');
      //   }
      // if(item === "Weight") {
      //   if(this.state.weight) {
      //     this.setState({ weight: false })
      //     AsyncStorage.setItem(KeyUtils.WEIGHT_NOTIFICATION, 'false')
      //   } else {
      //     this.setState({ weight: true })
      //     AsyncStorage.setItem(KeyUtils.WEIGHT_NOTIFICATION, 'true');
      //   }
      // } else if(item === "Height") {
      //   if(this.state.height) {
      //     this.setState({ height: false })
      //     AsyncStorage.setItem(KeyUtils.HEIGHT_NOTIFICATION, 'false')
      //   } else {
      //     this.setState({ height: true })
      //     AsyncStorage.setItem(KeyUtils.HEIGHT_NOTIFICATION, 'true');
      //   }
    }
    if (item==='SMS'){
      this.setState({sms:!this.state.sms,isSaveEnabled:true})
    }
    else if (item==='Mail'){
      this.setState({mail:!this.state.mail,isSaveEnabled:true,isMailValue:this.state.beta?2:!this.state.beta && !this.state.mail?1:0})
    }else if (item==='Beta Tester'){
      this.setState({beta:!this.state.beta,isSaveEnabled:true,isMailValue:this.state.mail?1:!this.state.mail && !this.state.beta?2:0})
    }
  }

  renderItem(item) {
    let value;
    let itemLabel = '';
    switch (item.Key) {
      // case "Diaper":
      // value = this.state.diaper
      // break;
      // case "Weight":
      // value = this.state.weight
      // break;
      // case "Height":
      // value = this.state.height
      // break;
      case "Allow Notifications":
      value = this.state.appNotification
      itemLabel = I18n.t("accessibility_labels.allow_notifications")
      break;
      // case "Breastfeeding and Pumping":
      // value = this.state.breastFeedingPumping
      // break;
      case "Breastfeeding Confidence":
      value = this.state.bca
        itemLabel = I18n.t("accessibility_labels.breastfeeding_confidence")
        break;
      case "Content Personalization":
      value = this.state.cp
        itemLabel = I18n.t("accessibility_labels.content_personalization")
      break;
      case "Baby Birth Date":
      value = this.state.birthday
        itemLabel = I18n.t("accessibility_labels.baby_birth_date")
      break;
      case "Pump Session Timeout":
      value = this.state.appNotification
        itemLabel = I18n.t("accessibility_labels.pump_session_timeout")
      break;
      case "Milk Expired":
      value = this.state.milkExpired
        itemLabel = I18n.t("accessibility_labels.milk_expired")
      break;
      case "Milk About to Expire":
      value = this.state.milkAboutToExpire
        itemLabel = I18n.t("accessibility_labels.milk_about_to_expire")
      break;
      case "Missing Milk Volume":
        value = this.state.missingMilkVolume
        itemLabel = I18n.t("accessibility_labels.missing_milk_volume")
      break;
      case "Breastfeeding & Pumping":
        value = this.state.showBadArticles
        itemLabel = I18n.t("accessibility_labels.breastfeeding_and_pumping")
      break;
      case "Pump Session Complete":
        value = this.state.pumpSessionComplete
        itemLabel = I18n.t("accessibility_labels.pump_session_complete")
      break;
      case 'Email newsletters':
        value = this.state.isEmailNewsLetter
        itemLabel = I18n.t("accessibility_labels.email_newsletters")
        break;
      case 'Congratulations':
        value = this.state.virtualFreezerCongrats
        itemLabel = I18n.t("accessibility_labels.congratulations")
        break;
      case "SMS":
        value = this.state.sms
        itemLabel = I18n.t("accessibility_labels.sms")
        break;
      case "Mail":
        value = this.state.mail
        itemLabel = I18n.t("accessibility_labels.mail")
        break;
      case "Beta Tester":
        value=this.state.beta
        itemLabel = I18n.t("accessibility_labels.beta_tester")
        break;
      default:
        value=true
    }
    return(
      <TouchableOpacity
        accessibilityLabel={itemLabel}
        accessible={true}
        style={{alignItems:'flex-end',transform: [{scaleX: I18nManager.isRTL ? -1 : 1}] }}
        onPress={() => this.onClickToggle(item.Key)}
      >
        {value ?
          <SwitchOnIcon width={48} height={48} /> :
          <SwitchOffIcon width={48} height={48}/>
        }
      </TouchableOpacity>
    )
  }

  updateEmailSubscription(){
    const {addProfile}=this.props
    const {userProfile}=this.state
    let profile=JSON.parse(JSON.stringify(userProfile))
    if (profile.mother.hasOwnProperty('username')){
      delete profile.mother.username
    }
    if (profile.hasOwnProperty('isSync')){
      delete profile.isSync
    }
    if (profile.hasOwnProperty('username')){
      delete profile.username
    }
    if (profile.mother.hasOwnProperty('isSync')){
      delete profile.mother.isSync
    }
    if (profile.mother.hasOwnProperty('registrationType')){
      delete profile.mother.registrationType
    }
    if (profile.mother.hasOwnProperty('market')){
      delete profile.mother.market
    }
    if (profile.mother.hasOwnProperty('userType')){
      delete profile.mother.userType
    }
    if (profile.mother.hasOwnProperty('currentBabyClientId')){
      delete profile.mother.currentBabyClientId
    }
    if (profile.mother.hasOwnProperty('source')){
      delete profile.mother.source
    }
    profile.mother.isOptedInForEmail=this.state.isEmailNewsLetter
    this.setState({isLoading:true})
    addProfile({profile})
  }

  showEmailSubscriptionDialog() {
    const {addressValidate} = this.props
    const { isEmailSubscriptionDialog } = this.state
    return (
      <Dialog
        visible={isEmailSubscriptionDialog}
        title={I18n.t('login.email_subscription_msg')}
        positive={I18n.t('login.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({isEmailSubscriptionDialog: false, isEmailNewsLetter: !this.state.isEmailNewsLetter },()=>{
              this.updateEmailSubscription()
          })
        }}
        onDismiss={() => {
        }}
      />
    )
  };

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

  render(){
    const{navigation}=this.props;
    const { showSelectAddressDialog, showSelectAddressDialogBeta,showStatesListViewEmail,betaStateDialog ,isEmailSubscriptionDialog,errorMessageDialogVisible} = this.state
    return(
      <SafeAreaView style={styles.container}>
        <HeaderTitle title={I18n.t('notifications.header_title')} onBackPress={()=>{
            const {getOptedResponse}=this.props;
            const {sms,beta,mail}=this.state;
            if (getOptedResponse){
              const {isOptedInForSms,phone,isOptedInForTesting,isOptedInForMail,firstName,lastName,address}=getOptedResponse
              const {city,postalCode,streetAddress1,streetAddress2,stateAbbrev}=address
              if (isOptedInForMail!==this.state.mail ||isOptedInForSms!==this.state.sms || isOptedInForTesting!==this.state.beta || phone!==this.state.phoneNum
                || firstName!==this.state.firstName || lastName!==this.state.lastName || city!==this.state.city
                || postalCode!==this.state.zipcode || streetAddress1!==this.state.address || streetAddress2!==this.state.apt || stateAbbrev!==this.state.states
              ){
                if(sms!=isOptedInForSms||mail!=isOptedInForMail||beta!=isOptedInForTesting){
                  this.onSMSSavePress()
                }else{
                  navigation.goBack()
                }
              }else{
                navigation.goBack()
              }
            }else{
              navigation.goBack()
            }

        }}/>
        {this.state.loading ?
          <LoadingSpinner/>
        :
          <View style={styles.contentView}>
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : null} keyboardVerticalOffset={Platform.OS == "ios" ? Header.HEIGHT + verticalScale(25) : 0 } >
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                data={this.state.data}
                renderItem={this.renderListItem}
                ListEmptyComponent={<LoadingSpinner/>}
              />
              {this.state.isLoading && <LoadingSpinner/>}
              {showSelectAddressDialog && this.showAddressDialog()}
              {showSelectAddressDialogBeta && this.showNoAddressFoundDialog()}
              {isEmailSubscriptionDialog && this.showEmailSubscriptionDialog()}
              {errorMessageDialogVisible && this.showOptedErrorMessageDialog()}
              {showStatesListViewEmail && <CustomMeasurementListView
                data={StatesList}
                getItem={(item) => {
                  if (betaStateDialog){
                    this.setState({statesBeta: item.value, showStatesListViewEmail: false,betaStateDialog:false})
                  }else {
                    this.setState({states: item.value, showStatesListViewEmail: false,betaStateDialog:false})
                  }
                } }
                headerText={I18n.t('generic.select_state')}
              />}
            </KeyboardAvoidingView>
          </View>
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  isProfile: state.user.isProfile,
  isProfileError: state.user.isProfileError,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  isOptedApiSuccess: state.user.isOptedApiSuccess,
  isOptedApiFailure: state.user.isOptedApiFailure,
  addressValidate: state.user.addressValidate,
  isValidateAddressApiSuccess: state.user.isValidateAddressApiSuccess,
  isValidateAddressApiFailure: state.user.isValidateAddressApiFailure,
  getOptedResponse:state.user.getOptedResponse,
  isGetOptedApiSuccess:state.user.isGetOptedApiSuccess,
  isGetOptedApiFailure:state.user.isGetOptedApiFailure,
  optedErrorMessage:state.user.optedErrorMessage,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  optedApi: (data) => dispatch(UserActions.optedApi(data)),
  getOptedApi: () => dispatch(UserActions.getOptedApi()),
  validateAddressApi: (data) => dispatch(UserActions.validateAddressApi(data)),
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  addProfile: (profile) => dispatch(UserActions.addProfile(profile.profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
