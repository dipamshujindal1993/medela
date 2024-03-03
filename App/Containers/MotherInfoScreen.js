import React from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, Keyboard, I18nManager, Alert} from 'react-native';
import BackIcon from '@svg/arrow_back';
import I18n from '@i18n';
import { Colors, Metrics } from '@resources'
import styles from './Styles/MotherInfoScreenStyles';
import CustomTextInput from '@components/CustomTextInput';
import {connect} from 'react-redux';
import moment from 'moment';
import CustomCalendar from '@components/CustomCalendar'
import SwitchOnIcon from '@svg/ic_switch_on';
import SwitchOffIcon from '@svg/ic_switch_off';
import Button from '@components/Button';
import CookieManager from '@react-native-community/cookies';
import AsyncStorage from "@react-native-community/async-storage";
import AppActions from '@redux/AppRedux';
import KeyUtils from "@utils/KeyUtils";
import {countryCode, getTimeZone } from '@utils/locale';
import UserActions from '@redux/UserRedux';
import LoadingSpinner from '@components/LoadingSpinner';
import Dialog from '@components/Dialog';
import ForwardIcon from '@svg/arrow_right';
import RNUserDefaults from 'rn-user-defaults';
import {
  deleteMotherProfileTimeLine,
  getRealmDb,
  saveMotherProfile
} from "../Database/AddBabyDatabase";
import { cancelNotifications } from '@components/Notifications';
import HomeActions from '@redux/HomeRedux';
import { verticalScale, moderateScale } from "@resources/Metrics";
import {getLanguages} from "react-native-i18n";
import { setLocale, getLanguage } from '@i18n/I18n';
import { getDateFormat } from "@utils/TextUtils";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class MotherInfoScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={
      mother: {},
      momPicture: '',
      showCalendar: false,
      selectedDate: moment().format(),
      chooseBackWorkDate: '',
      switchSelected: '',
      isLoading: false,
      showPregnancyPopup: false,
      backSuccess: false,
      showLogOutpopup: false,
      realmDb:null,
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)

    this.profile = {
      "client": {
        "notifications": {
          "breastfeeding": true,
          "diaper": true,
          "pumpMissingMilkVolume": true,
          "pumpSessionComplete": true,
          "pumpSessionTimeout": true,
          "pumping": true,
          "weight": true
        },
      },
      "mother": {
        "timezone": getTimeZone(),
        "name": "",
        "country": countryCode(),
        "backToWorkStatus":0,
        "analyticsOptout": true,
        "units": countryCode()=='US'?KeyUtils.UNIT_IMPERIAL:KeyUtils.UNIT_METRICAL,
        "isOptedInForEmail": true
      },
    }
    this.userProfile=this.profile
  }


  async componentDidMount(){
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.init()
    await analytics.logScreenView('mother_info_screen')
  }

  componentWillUnmount() {
  }

  init=async ()=>{
    let realmDb=await getRealmDb()
    this.setState({realmDb})
    let profile = realmDb.objects('UserMotherProfile');
    let uerProfile = JSON.parse(JSON.stringify(profile))
    if (uerProfile.length>0){
      this.userProfile=uerProfile[0]
      this.updateData(uerProfile[0])
      this.setState({isLoading: true})
      const{getUserProfile}= this.props
      getUserProfile()
    }
  }
  updateData=  async(userProfile)=>{
    this.userProfile=userProfile
    let tempBackWorkDate
    const {mother}=userProfile
    let backWorkDateValue = mother.backToWorkDate
    let validDate = moment(backWorkDateValue, 'YYYY-MM-DD')

    if(mother){
      this.profile.client=userProfile.client
      //   this.profile.mother=mother
      this.profile.mother['name'] = mother.name
      this.profile.mother['backToWorkDate'] = mother.backToWorkDate
      this.profile.mother['backToWorkStatus'] = mother.backToWorkStatus
      this.profile.mother['isOptedInForEmail'] = mother.isOptedInForEmail
      if(validDate.isValid()){
        tempBackWorkDate = mother.backToWorkDate
        let newDate = await getDateFormat(backWorkDateValue)
        this.setState({
          mother: mother,
          chooseBackWorkDate: newDate,
          formattedDate:newDate,
          switchSelected: '',
          selectedDate: mother.backToWorkDate
        })
      }else if(mother.backToWorkStatus === -2){
        this.setState({
          mother: mother,
          chooseBackWorkDate: '',
          switchSelected: 'dontKnowYet'
        })
      }else if(mother.backToWorkStatus === -1){
        this.setState({
          mother: mother,
          chooseBackWorkDate: '',
          switchSelected: 'notPlanToWork'
        })
      }else{
        this.setState({
          mother: mother,
          chooseBackWorkDate: '',
          switchSelected: '',
        })
      }
    }
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

    const {isProfile, isProfileError, signOutSuccess, signOutFailure,
      userProfileSuccess, userProfileFailure,userProfile,getUserProfile,
      navigation, scannedPumpList, getBleDeviceId, isPumpConnected, flexPumpData, sonataPumpData} = this.props;
    const {backSuccess} = this.state


    // if ((prevProps.deleteBabySuccess != deleteBabySuccess) && deleteBabySuccess && prevState.isLoading) {
    // 	this.setState({isLoading: false})
    // 	this.props.navigation.goBack()
    // }
    // if ((prevProps.deleteBabyFailure != deleteBabyFailure) && deleteBabyFailure && prevState.isLoading) {
    // 	this.setState({isLoading: false});
    // 	alert(I18n.t('generic.error_message'))
    // }

    if (userProfileSuccess != prevProps.userProfileSuccess && userProfileSuccess && prevState.isLoading) {
      this.setState({isLoading: false})
      if (userProfile && userProfile.mother){
        let mP=JSON.parse(JSON.stringify(userProfile))
        mP.username=userProfile.mother.username
        mP.isSync=true
        saveMotherProfile(this.state.realmDb, mP).then(r => {
        })
        if (backSuccess){
          navigation.goBack()
        }else {
          this.updateData(mP)
        }

      }

    }

    if (userProfileFailure != prevProps.userProfileFailure && userProfileFailure && prevState.isLoading) {
      this.setState({isLoading: false})
      this.callBack1()
    }

    if ((prevProps.isProfile != isProfile) && isProfile && prevState.isLoading) {
      this.props.getUserProfile()
    }
    if ((prevProps.isProfileError != isProfileError) && isProfileError && prevState.isLoading) {
      this.setState({isLoading: false})
      this.callBack1()
    }
    if ((prevProps.signOutSuccess != signOutSuccess) && signOutSuccess && prevState.isLoading) {
      scannedPumpList([])
      getBleDeviceId(null)
      isPumpConnected(false)
      flexPumpData(null)
      sonataPumpData(null)
      this.setState({isLoading: false})
    }
    if ((prevProps.signOutFailure != signOutFailure) && signOutFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
  }
  callBack1=()=>{
    Alert.alert(
      I18n.t('generic.alert_title'),
      I18n.t('generic.error_message'),
      [
        { text:  I18n.t('freezer_popup.ok'), onPress: () => this.props.navigation.goBack() }
      ]
    );
  }

  updateMotherName=(value)=>{
    this.profile.mother['name'] = value
    this.setState(prevState => ({
      mother: {
        ...prevState.mother,
        name: value
      }
    }))
  }

  positiveOnPress = (updatedDate) => {
    const{mother}=this.state
    this.setState({
      chooseBackWorkDate: updatedDate.toString().split('T')[0],
      showCalendar: false,
      switchSelected: '',
      // isLoading: true
    })
    this.profile.mother['name'] = mother.name
    this.profile.mother['backToWorkDate'] = updatedDate.toString().split('T')[0]
    this.profile.mother['backToWorkStatus'] = 1

    // let profile = this.profile
    // this.props.addProfile({profile})
  }

  _onDateChange = async(date) => {
    let newDate = await getDateFormat(date)
    this.setState({
      chooseBackWorkDate: moment(date).format('YYYY-MM-DD'),
      formattedDate: newDate,
      selectedDate: date
    })
  }

  negativeOnPress = async() => {
    const{userProfile}=this.props
    if (userProfile.mother.backToWorkDate){
      let newDate = await getDateFormat(userProfile.mother.backToWorkDate)
      this.setState({
        chooseBackWorkDate: moment(userProfile.mother.backToWorkDate).format('YYYY-MM-DD'),
        showCalendar: false,
        formattedDate: newDate,
        selectedDate: userProfile.mother.backToWorkDate
      })
    }else {
      this.setState({
        showCalendar: false
      })
    }
  }

  showCustomCalendar = () =>{
    let currentDate = moment().add(1, "days");
    currentDate = currentDate.format("YYYY/MM/DD");
    const{showCalendar, selectedDate}= this.state
    return (
      <CustomCalendar
        visible={showCalendar}
        title={I18n.t('login.forgot_password_title')}
        message={I18n.t('login.forgot_password_message')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        selectedDate={selectedDate}
        minDate={currentDate}
        negativeOnPress={() => this.negativeOnPress()}
        positiveOnPress={(updatedDate) => this.positiveOnPress(updatedDate)}
        onDismiss={() => {
        }}
        onDateChange={(date) => this._onDateChange(date)}
        showHeader={true}
        notShowTime={true}
      />
    )
  }

  clickBackToWorkDate=()=>{
    this.setState({showCalendar: true})
  }

  switchHandler=(selectedValue)=>{
    const{mother}=this.state
    const{userProfile}=this.props
    let backToWorkStatusValue = selectedValue === 'dontKnowYet'? -2: -1
    this.setState({switchSelected: selectedValue, chooseBackWorkDate: '',formattedDate:'', selectedDate: moment().format() })
    this.profile.mother['name'] = mother.name
    this.profile.mother['backToWorkDate'] = ''
    this.profile.mother['backToWorkStatus'] = backToWorkStatusValue
    // let profile = this.profile
    // this.props.addProfile({profile})
  }

  onClickpregnancyBtn=()=>{
    this.setState({showPregnancyPopup: true})
  }

  logOut(){
    cancelNotifications([], false, true)
    // Commenetd the below code  because user should be in their app language untill or unless user uninstall the app
    // getLanguages().then(languages => {
    //   if (languages && languages.length>0){
    //     setLocale(languages[0])
    //     getLanguage(languages[0])
    //   }
    // });

    this.setState({isLoading: true})
    this.props.stopAllIntervals(true)
    CookieManager.clearAll()
      .then((success) => {
        deleteMotherProfileTimeLine().then((r)=>{
          console.log('r---',r)
          AsyncStorage.setItem(KeyUtils.BABY_ID, '');
          AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'true');
          AsyncStorage.setItem(KeyUtils.P_RESET_TIMER, 'true');
          AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
          AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, '')
          AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
          AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'false')
          AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
          AsyncStorage.setItem(KeyUtils.IS_RIGHT_TIMER_STARTED, 'false')
          AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, '')
          AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, '')
          AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')
          AsyncStorage.removeItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS)
          AsyncStorage.removeItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS_NOTIF)
          AsyncStorage.removeItem(KeyUtils.MILK_ABOUT_TO_EXPIRE_NOTIF)
          AsyncStorage.removeItem(KeyUtils.MILK_EXPIRE_NOTIF)
          AsyncStorage.removeItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS)
          AsyncStorage.removeItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS)
          AsyncStorage.removeItem(KeyUtils.IS_VIRTUAL_FREEZER)
          AsyncStorage.removeItem(KeyUtils.PUMPING_IS_VIRTUAL_FREEZER)
          AsyncStorage.removeItem(KeyUtils.VIP_STATUS)
          //RNUserDefaults.clear(KeyUtils.SELECTED_LANGUAGE_LOCALE)
          //AsyncStorage.removeItem(KeyUtils.SELECTED_LANGUAGE_LOCALE)
          AsyncStorage.removeItem(KeyUtils.SELECTED_LANGUAGE)
          AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_SLEEP, 'false')
          AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_DURATION, 'false')
          AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_FREQUENCY, 'false')
          AsyncStorage.setItem(KeyUtils.SAVED_SLEEP_TIMER,"true")
          AsyncStorage.removeItem(KeyUtils.PACIFY_TOKEN)
          AsyncStorage.removeItem(KeyUtils.START_TIMESTAMP_SLEEP)
        })
        setTimeout(() => {
          this.props.logOut()
          this.props.signOut()

        }, 1000)

      });
  }

  onClickDeleteAccount=()=>{
    alert('Account deleted successfully')
  }

  newPregnancyDialog() {
    const {showPregnancyPopup} = this.state
    const{navigation}=this.props
    return (
      <Dialog
        visible={showPregnancyPopup}
        title={I18n.t('new_pregnancy_popup.title')}
        positive={I18n.t('new_pregnancy_popup.add_baby_due_date')}
        negative={I18n.t('new_pregnancy_popup.cancel')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showPregnancyPopup: false})
        }}
        positiveOnPress={() => {
          this.setState({showPregnancyPopup: false})
          navigation.navigate("AddBabyScreen", { newPregnancy: true })
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  logOutpopup(){
    const {showLogOutpopup} = this.state
    return (
      <Dialog
        visible={showLogOutpopup}
        title={I18n.t('mom_information.log_out_popup_title')}
        positive={I18n.t('mom_information.ok')}
        negative={I18n.t('new_pregnancy_popup.cancel')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showLogOutpopup: false})
        }}
        positiveOnPress={() => {
          this.setState({showLogOutpopup: false})
          this.logOut()
        }}
        onDismiss={() => {
        }}
      />
    )
  }

  onClickBackBtn = () => {
    const {addProfile, userProfile, navigation, isInternetAvailable} = this.props

    if (isInternetAvailable) {
      if(userProfile && userProfile!=null && userProfile.mother && userProfile.mother !=null ){
      if (this.profile.mother['name'] !== userProfile.mother.name ||
        this.profile.mother['backToWorkDate'] !== userProfile.mother.backToWorkDate ||
        this.profile.mother['backToWorkStatus'] !== userProfile.mother.backToWorkStatus) {
        let profile = this.profile
        if (profile.hasOwnProperty('username')){
          delete profile.username
        }
        if (profile.hasOwnProperty('isSync')){
          delete profile.isSync
        }

        this.setState({backSuccess: true, isLoading: true})
        addProfile({profile})
      }else {
        navigation.goBack()
      }
      } else {
        navigation.goBack()
      }
  } else {

      this.profile.isSync=false
      this.profile.username=this.userProfile.username
      saveMotherProfile(this.state.realmDb,this.profile).then((r)=>{

        navigation.goBack()
      })
    }

  }

  render(){
    const{navigation}=this.props
    const{mother, formattedDate, showCalendar, chooseBackWorkDate, switchSelected, isLoading, showPregnancyPopup, showLogOutpopup}=this.state
    if (isLoading){
      return  <LoadingSpinner/>
    }
    return(
      <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={I18n.t("accessibility_labels.back_label")}
            onPress={() => this.onClickBackBtn()}>
            <BackIcon fill={Colors.rgb_fecd00} width={48} height={48} style={{marginLeft: 15,transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} />
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}> {I18n.t('more.mom_profile')}</Text>
        </View>
        {isLoading && <LoadingSpinner />}
        <View style={styles.mainContent}>
          <View style={styles.textInputStyle}>
            <CustomTextInput
              placeholder={I18n.t('mom_information.mom_name')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.textInput,{color:this.textColor}]}
              value={(mother.name && mother.name.length) ? mother.name: ''}
              onChangeText={(index, value) => this.updateMotherName(value)}
              returnKeyType={"done"}
              onSubmitEditing={Keyboard.dismiss}
            />
             <CustomTextInput
              placeholder={I18n.t('login.email')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.textInput,{color:this.textColor}]}
              value={(mother.username && mother.username.length) ? mother.username: ''}
              editable={false}
            />
            <Text maxFontSizeMultiplier={1.7} style={[styles.backToWorkDateTextStyle,{color:this.textColor}]}> {I18n.t('mom_information.back_to_work_date')}</Text>
            <CustomTextInput
              //placeholder={I18n.t('mom_information.back_to_work_date')}
              placeholder={I18n.t('stats_list_export.select_date_text')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.textInput,{marginTop: 1,color:this.textColor}]}
              errorMessage={I18n.t('profileSetup.back_to_work_date')}
              editable={false}
              ableToOpen={true}
              value={formattedDate}
              onPress={() => this.clickBackToWorkDate()}
            />
          </View>
          <View style={styles.switchItemView}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={I18n.t("accessibility_labels.I_dont_know")}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}], padding: 2}}
              onPress={()=> this.switchHandler('dontKnowYet')}
            >
              {switchSelected === 'dontKnowYet' ? <SwitchOnIcon width={44} height={44}/> :
                <SwitchOffIcon width={44} height={44}/>}
            </TouchableOpacity>
            <View style={styles.switchTitleView}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.switchTextStyle,{color:this.textColor}]}>{I18n.t('mom_information.dont_know_yet')}</Text>
            </View>
          </View>
          <View style={styles.switchItemView}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={I18n.t("accessibility_labels.do_not_plan_to_return")}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}], padding: 2}}
              onPress={()=> this.switchHandler('notPlanToWork')}
            >
              {switchSelected === 'notPlanToWork' ? <SwitchOnIcon width={44} height={44}/> :
                <SwitchOffIcon width={44} height={44}/>}
            </TouchableOpacity>
            <View style={styles.switchTitleView}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.switchTextStyle,{color:this.textColor}]}>{I18n.t('mom_information.do_not_plan_to_work')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.changePasswordView} onPress={() => navigation.navigate('ChangePassword')}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.changePasswordText,{color:this.textColor}]}>{I18n.t("mom_information.change_password_title")}</Text>
            <ForwardIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_898d8d} width={Metrics.moderateScale._35} height={verticalScale(35)}/>
          </TouchableOpacity>
          <View style={styles.btnView}>
            <Button
              title={I18n.t('mom_information.log_out')}
              textStyle={styles.logOutBtnTextStyle}
              style={styles.logOutBtnStyles}
              onPress={() => this.setState({showLogOutpopup: true})}
            />
            {/* <Button
							title={I18n.t('mom_information.delete_account').toUpperCase()}
							style={styles.deleteButtonStyles}
							textStyle={styles.deleteTextStyle}
							onPress={() => {this.onClickDeleteAccount()}}
						/> */}
          </View>
        </View>
        {showCalendar && this.showCustomCalendar()}
        {showPregnancyPopup && this.newPregnancyDialog()}
        {showLogOutpopup && this.logOutpopup()}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  babies: state.home.babies,
  isProfile: state.user.isProfile,
  isProfileError: state.user.isProfileError,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  signOutSuccess: state.app.signOutSuccess,
  signOutFailure: state.app.signOutFailure,
  themeSelected: state.app.themeSelected,
  isInternetAvailable:state.app.isInternetAvailable
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  addProfile: (profile) => dispatch(UserActions.addProfile(profile.profile)),
  signOut: () => dispatch(AppActions.signOut()),
  logOut: () => dispatch(HomeActions.logOut()),
  stopAllIntervals: (v) => dispatch(HomeActions.stopAllIntervals(v)),

  scannedPumpList: (pumpList) => dispatch(HomeActions.scannedPumpList(pumpList)),
  getBleDeviceId: (id) => dispatch(AppActions.getBleDeviceId(id)),
  isPumpConnected: (isConnected) => dispatch(HomeActions.isPumpConnected(isConnected)),
  flexPumpData: (flexData) => dispatch(HomeActions.flexPumpData(flexData)),
  sonataPumpData: (sonataData) => dispatch(HomeActions.sonataPumpData(sonataData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MotherInfoScreen);
