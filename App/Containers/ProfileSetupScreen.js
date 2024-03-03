import React, {Component} from 'react';
import { Keyboard, Text, TextInput, View, Image, TouchableOpacity ,findNodeHandle} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RadioGroup from 'react-native-custom-radio-group';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {connect} from 'react-redux';
import UserActions from '@redux/UserRedux';
import AppActions from '@redux/AppRedux'
import HomeActions from '@redux/HomeRedux';
import Button from '@components/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import CustomCalendar from '@components/CustomCalendar'
import I18n from '@i18n';
import styles from './Styles/ProfileSetupScreenStyles';
import {Colors,Constants} from '@resources';
import moment from 'moment';
import {uuidV4} from "@utils/TextUtils";
import BabyIcon from '@svg/ic_baby.svg'
import CustomTextInput from '@components/CustomTextInput';
import {isDateGreater} from "@utils/TextUtils";
import {countryCode, getTimeZone, getLocalFromMarket, locale } from '@utils/locale';
import Dialog from "@components/Dialog";
import KeyUtils from "@utils/KeyUtils";
import { BackHandler , Platform} from 'react-native';
import { clearPrevLocaleConfigAtRegistration, setI18nConfigBasedOnUserLocale } from '../I18n/I18n';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

const genderList = [{
  label: I18n.t('addBaby.male'),
  value: 1,
}, {
  label: I18n.t('addBaby.female'),
  value: 2,
}];

let heightUnit = ''
let weightUnit = ''
let localeAccordingToMarket = '';

class ProfileSetupScreen extends Component {

  constructor(props) {
    workList = [{
      label: I18n.t('profileSetup.yes'),
      value: 'yes',
    },
    {
      label: I18n.t('profileSetup.dontKnow'),
      value: 'dont',
    },
    {
      label: I18n.t('profileSetup.no'),
      value: 'no',
    }];
    super(props);
    this.babyId = uuidV4();
    const {isSignUp}=props.navigation.state.params
    let name='',birthDate=''
    if (!isSignUp){
      let profileData = props.userProfile
      name = (profileData && profileData.mother) ? profileData.mother.name : ''
      birthDate = (profileData && profileData.mother) ? profileData.mother.birthDate : ''
    }
    this.state = {
      isLoading: false,
      name: name,
      babyDob: birthDate,
      babyName: '',
      username:name,
      showBabySection: false,
      showWorkDateSection: false,
      switchValue: false,
      chooseBackWorkDate: '',
      babyPicture: '',
      name_error: false,
      baby_name_error: false,
      babyDob_error: false,
      back_to_work_error: false,
      showErrorMessage: false,
      alert_message: '',
      showCalendarPicker: false,
      showWorkCalendarPicker: false,
      calendarType: "dob",
      babyGender:0,
      isNextBtnDisabled:true,
      chooseBackWorkDateValue:'dont',//Default value for 1 version of the app
      userLocale: ''
    };
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
        "backToWorkStatus":-2,//Default value for 1 version of the app
        "analyticsOptout": true,
        "units": countryCode()=='US'?KeyUtils.UNIT_IMPERIAL:KeyUtils.UNIT_METRICAL,
        "isOptedInForEmail": props.navigation.state.params.isOptedInForEmail,
        // "isOptedInForSms": false,
        // "isOptedInForMail": false,
        // "isOptedInForTesting": false
      },

    }
    this.babies = {
      "babies": [{
        "name": "",
        "babyId": this.babyId,
        "birthWeight": {"unit": "", "quantity": 0.0},
        "birthHeight": {"unit": "", "quantity": 0.0},
        "gender": 0
      }
      ]
    }

    let minDate = moment();
    this.minDate = minDate.subtract(3, "years");
    this.minDate = this.minDate.format("YYYY/MM/DD");

    let maxDate = moment()
    this.maxDate = maxDate.add('38', 'weeks')
    this.maxDate = this.maxDate.format("YYYY/MM/DD");
    this.imgFile = {}
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const {isSignUp, market}=this.props.navigation.state.params
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    if (!isSignUp){
      let profileData = this.props.userProfile
      let birthDate = (profileData && profileData.mother) ? profileData.mother.birthDate : ''
      if (birthDate==undefined){
        this.setState({showBabySection:false})
      }else {
        this._onDateChange(birthDate)
      }
    }
    if(countryCode()==='US'){
       heightUnit = KeyUtils.UNIT_INCH
       weightUnit = KeyUtils.UNIT_LB
    }else{
      heightUnit = KeyUtils.UNIT_MM
      weightUnit = KeyUtils.UNIT_GRAM
    }
    this.babies.babies[0].birthHeight.unit = heightUnit
    this.babies.babies[0].birthWeight.unit = weightUnit
    const {getMyBabies, remoteConfig}=this.props
    localeAccordingToMarket = getLocalFromMarket(remoteConfig && remoteConfig.markets, market)
    this.setState({isLoading:true, userLocale: localeAccordingToMarket})
    getMyBabies()
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    await analytics.logScreenView('profile_setup_screen')
  }
    componentWillUnmount() {
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
  }
    onBackPress = () => {
     return true;
  }

  _updateBabyData(baby){
    const {birthday,birthHeight,birthWeight,gender,babyId}=baby
    if (birthHeight){
      this.babies.babies[0].birthHeight=birthHeight
    }
    if(birthWeight){
      this.babies.babies[0].birthWeight = birthWeight
    }
    this.setState({babyGender:gender})
    this.babies.babies[0].gender = gender
    this.babies.babies[0].babyId=babyId
    if (birthday==undefined || birthday==''){
      this.setState({showBabySection:false})
    }else {
      this._onDateChange(birthday)
    }

  }

  async componentDidUpdate(prevProps, prevState) {
    const {showBabySection, babyName} = this.state
    const {isProfile, isProfileError, isBabyNameAdd,addBabyName, isBabyNameAddError, isPicUploaded, babyId, isPicUploadedError, message,babiesSuccess, babiesFailure, babies,remoteConfig,optedState} = this.props;
    const {market} = this.props.navigation.state.params
    if (babiesSuccess!=prevProps.babiesSuccess && babiesSuccess && prevState.isLoading) {
      if (babies.length>0){
        //if (babies.length===1){
           this._updateBabyData(babies[0])
       // }
      }
      this.setState({isLoading: false})
    }

    if (babiesFailure!=prevProps.babiesFailure && babiesFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
    if ((prevProps.isProfileError != isProfileError) && isProfileError && prevState.isLoading) {
      this.setState({
        isLoading: false,
        showErrorMessage:true,
        alert_message:message
      });
    }
    if ((prevProps.isProfile != isProfile) && isProfile && prevState.isLoading) {
      const {market}=this.props.navigation.state.params
      await analytics.setProperty('market', market);
      await analytics.setProperty('language', localeAccordingToMarket);
      await analytics.setProperty(Constants.USER_TYPE, 'normal_user');
      await analytics.setProperty(Constants.PUMP_USER, 'none');

      let param = {
        'locale':locale(),
        'target_locale': localeAccordingToMarket,
        'target_country': countryCode(),
      }
      await analytics.logEvent('market_country_assignment', param);
      let babies = this.babies
      addBabyName({babies});
      /*if (showBabySection && babyName && babyName.toString().trim().length > 0) {
        addBabyName({babies});
      } else {
        this.setState({isLoading: false});
        this.props.navigation.navigate('WelcomeScreen');
      }*/
    }

    if (prevProps.isBabyNameAdd != isBabyNameAdd && isBabyNameAdd && prevState.isLoading) {
      if (Object.keys(this.imgFile).length > 0) {
        this.props.uploadBabyPic(babyId, this.imgFile);
      } else {
        this.setState({isLoading: false})
        const {isSignUp, market}=this.props.navigation.state.params
        console.log('isiSgnup---',isSignUp)
        if (!isSignUp){
          const {userProfile} = this.props
          console.log('userProfile---',userProfile)
          const {incompleteOptIn, vipStatus} = userProfile.mother
          await analytics.setProperty(Constants.USER_TYPE, 'normal_user');

          if(incompleteOptIn && userProfile.mother.market===KeyUtils.US_MARKET) {
            this.props.navigation.navigate('OptedSetupScreen',{market:userProfile.mother.market,isSignUp});
          }else if(userProfile.mother.market!==KeyUtils.US_MARKET && !userProfile.mother.hasOwnProperty('hasPump')){
            this.props.navigation.navigate('PumpSetupScreen',{market:userProfile.mother.market,isSignUp});
          }else{
            await clearPrevLocaleConfigAtRegistration();
            let resp=await setI18nConfigBasedOnUserLocale(userProfile.mother,remoteConfig.markets,this.props.signInSuccess);
            resp===true&&this.props.signInSuccess()
          }

        }else{
          // if(market==KeyUtils.US_MARKET)
          //   this.props.navigation.navigate('OptedSetupScreen',{market,isSignUp});
          // else this.props.navigation.navigate('PumpSetupScreen',{market,isSignUp});
          this.props.navigation.navigate('WelcomeScreen');
        }
      }

    }
    if ((prevProps.isBabyNameAddError != isBabyNameAddError) && isBabyNameAddError && prevState.isLoading) {
      this.setState({isLoading: false, showErrorMessage:true, alert_message:I18n.t('generic.error_message')});
    }
    if (prevProps.isPicUploaded != isPicUploaded && isPicUploaded && prevState.isLoading) {
      this.setState({isLoading: false});
      this.imgFile = {}
      const {isSignUp, market}=this.props.navigation.state.params
      console.log('isiSgnup---',isSignUp)
      if (!isSignUp){
        const {userProfile} = this.props
        console.log('userProfile---',userProfile)
        const {incompleteOptIn} = userProfile.mother
        if(incompleteOptIn && userProfile.mother.market===KeyUtils.US_MARKET) {
          this.props.navigation.navigate('OptedSetupScreen',{market:userProfile.mother.market,isSignUp});
        }else if(userProfile.mother.market!==KeyUtils.US_MARKET && !userProfile.mother.hasOwnProperty('hasPump')){
          this.props.navigation.navigate('PumpSetupScreen',{market:userProfile.mother.market,isSignUp});
        }else{
          await clearPrevLocaleConfigAtRegistration();
          let resp=await setI18nConfigBasedOnUserLocale(userProfile.mother,remoteConfig.markets,this.props.signInSuccess);
          resp===true&&this.props.signInSuccess()
        }

      }else{
        // if(market==KeyUtils.US_MARKET)
        //   this.props.navigation.navigate('OptedSetupScreen',{market,isSignUp});
        // else this.props.navigation.navigate('PumpSetupScreen',{market,isSignUp});
        //optedState({market});
        this.props.navigation.navigate('WelcomeScreen')
      }
    }
    if ((prevProps.isPicUploadedError != isPicUploadedError) && isPicUploadedError && prevState.isLoading) {
      this.setState({isLoading: false, showErrorMessage:true, alert_message:I18n.t('generic.error_message')});
    }

  }


  planToReturnWork = (value) => {
    const {showBabySection}=this.state;
    if (value === 'yes') {
      this.setState({showWorkDateSection: true,chooseBackWorkDateValue:value},()=>{
        this.checkStatusOfNextBtn();
        if(showBabySection){
          Keyboard.dismiss()
        }
        this.whenToStartRef.focus();
        if(this.pageEndRef!=null&&this.pageEndRef!=undefined){
          this.pageEndRef.measureLayout(
            findNodeHandle(this.keyboardScrollViewRef),
            (x, y) => {
              this.keyboardScrollViewRef.scrollTo({x:0,y:y,animated:true});
            }
          );
        }
      });
    } else {
        this.profile.mother['backToWorkStatus'] = value=='dont'?-2:-1
      this.setState({showWorkDateSection: false, chooseBackWorkDate: '',chooseBackWorkDateValue:value},()=>{
        this.checkStatusOfNextBtn()
      });
    }
  };

  selectBabyPicture = () => {
    const options = {
      title: I18n.t("baby_information.select_photo"),
      cancelButtonTitle: I18n.t("baby_information.cancel"),
      takePhotoButtonTitle: I18n.t("baby_information.take_photo"),
      chooseFromLibraryButtonTitle: I18n.t("baby_information.choose_from_library"),
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // Toast(I18n.t('generic.cancelled_picker'));
      } else if (response.error) {
        // Toast(I18n.t('generic.image_error'), response.error);
      } else if (response.customButton) {
        // Toast(I18n.t('generic.tap_custom_btn'), response.customButton);
      } else {
        let source = {uri: response.uri};
        let arr = null
        let fileName = null
        if (response.uri.includes('/')) {
          arr = response.uri.split('/')
          fileName = arr[arr.length - 1]
        }

        let photo = {
          uri: response.uri,
          type: 'image/jpeg',
          name: fileName,
        };

        this.imgFile = photo

        this.setState({
          babyPicture: source,
        });
      }
    });
  }

  addBabyDOB(date) {
    let selectedDate = moment(date).format('YYYY-MM-DD')
    // let currentDate=moment().format('YYYY-MM-DD')
    let currentDate=moment().add(1,'days').format('YYYY-MM-DD')
    this.setState({babyDob: date, showBabySection: moment(selectedDate).isBefore(currentDate), babyDob_error:false},()=>{
      this.checkStatusOfNextBtn()
    })
  }

  getFormattedDate(selectDate) {
    let momentObj = moment(selectDate, 'YYYY/MM/DD')
    let newDate = moment(momentObj).format('YYYY-MM-DD')
    return newDate
  }

  onRegisterPress = () => {
    Keyboard.dismiss()
    const {username, babyName, chooseBackWorkDate,showBabySection,babyGender, babyDob, showWorkDateSection} = this.state;
    if (!username) {
      this.setState({name_error: true})
    }
    else if (!babyDob) {
      this.setState({babyDob_error: true})
    }
    else if (showBabySection && babyName === '') {
      this.setState({baby_name_error: true})
    }
    else if (showWorkDateSection && !chooseBackWorkDate) {
      this.setState({back_to_work_error: true})
    } else {
      if (!chooseBackWorkDate) {
      //  this.profile.mother['backToWorkStatus'] = "BACKTOWORK_UNKNOWN"
      } else {
        this.profile.mother['backToWorkDate'] = this.getFormattedDate(chooseBackWorkDate)
        this.profile.mother['backToWorkStatus'] = 1
      }

      this.babies.babies[0].name = showBabySection?babyName.toString().trim():Constants.BABY_NAME

      this.babies.babies[0].birthday = this.getFormattedDate(babyDob)
      this.babies.babies[0].gender=parseInt(babyGender)
      this.profile.mother.name = username

      console.log('Profile Screen - ',JSON.stringify(this.profile))

      this.setState({isLoading: true});
      this.props.addProfile(this.profile);

      // this.props.navigation.navigate('PumpSetupScreen',{
      //   babies:this.babies,
      //   profile:this.profile,
      //   imgFile,
      //   showBabySection,
      //   babyName:showBabySection?babyName.toString().trim():Constants.BABY_NAME
      // });

    }

  }


  renderBabySection() {
    const {babyName, babyPicture, baby_name_error} = this.state
    const{themeSelected}=this.props

    let sectionBackgroundColor = Colors.white
    let inactiveRadioButtonColor = Colors.rgb_f5f5f5
    let activeTextColor = Colors.white
    if(themeSelected==="dark"){
      sectionBackgroundColor = Colors.rgb_373838
      inactiveRadioButtonColor = Colors.rgb_373838
      activeTextColor = Colors.rgb_000000
    }

    //styles.radioBtnInactive.backgroundColor = inactiveRadioButtonColor
    //styles.radioBtnTextActive.color = activeTextColor

    return <View ref={(element)=>{this.babySelectionViewRef=element}}>
      <CustomTextInput
        inputRef={(element)=>{this.babyNameTextInRef=element}}
        maxLength={20}
        textStyles={[styles.textInput,{color:this.textColor}]}
        onChangeText={(index, value) => {
          this.setState({babyName: value},()=>{
            this.checkStatusOfNextBtn()
          })
        }}
        placeholder={I18n.t('profileSetup.babyName')}
        placeholderTextColor={this.textColor}
        error={baby_name_error}
        errorMessage={I18n.t('profileSetup.baby_name_error')}
        value={babyName}
        returnKeyType={"done"}
        onSubmitEditing={Keyboard.dismiss}
      />

      <TouchableOpacity
        style={[styles.babyImageContainer, {backgroundColor: sectionBackgroundColor}]}
        onPress={this.selectBabyPicture}>

        {babyPicture == "" ? <View style={styles.babyPlaceHolder}>

            <BabyIcon fill={Colors.rgb_70898d8d}  style={styles.babyIcon}/>
            <Text maxFontSizeMultiplier={1.7} style={[styles.uploadText,{color:this.textColor}]}>{I18n.t('profileSetup.upload')}</Text>


          </View> :
          <Image
            style={styles.babyImage}
            source={babyPicture}
          />}

      </TouchableOpacity>

      <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('addBaby.gender')}</Text>

      <View ref={(element)=>{this.genderRadioRef=element}}>
        <RadioGroup
          initialValue={this.state.babyGender}
          buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
          buttonContainerActiveStyle={styles.radioBtnActive}
          buttonContainerStyle={styles.radioBtnContainer}
          buttonTextActiveStyle={[styles.radioBtnTextActive, {color: activeTextColor}]}
          buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:this.textColor}]}
          radioGroupList={genderList}
          onChange={(value)=>{
            this.setState({babyGender:value},()=>{
              this.checkStatusOfNextBtn()
            })
          }}/>
      </View>
    </View>
  }

  renderWorkDateSection() {
    const { back_to_work_error,babyDob, chooseBackWorkDate } = this.state
    return <CustomTextInput
              inputRef={(element)=>{this.whenToStartRef=element}}
              placeholder={I18n.t('profileSetup.chooseDate')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.textInput,{color:this.textColor}]}
              error={back_to_work_error}
              errorMessage={I18n.t('profileSetup.back_to_work_date')}
              editable={false}
              minDate={babyDob}
              value={chooseBackWorkDate && this.getDateFormat(chooseBackWorkDate)+""}
              onPress={() => this.onWorkDateClick()}
            />

  }

  renderTwoIndicator(){
    return <View style={styles.indicatorView}>
      <View style={styles.indicatorActive}/>
      <View style={styles.indicatorInactive}/>
    </View>
  }

  renderThreeIndicator(){
    return <View style={styles.indicatorView}>
      <View style={styles.indicatorActive}/>
      <View style={styles.indicatorInactive}/>
      <View style={styles.indicatorInactive}/>
    </View>
  }

  renderBottomView() {
    const{themeSelected}=this.props
    const {isNextBtnDisabled}=this.state
    const {market} = this.props.navigation.state.params
    let bottomViewColor = Colors.white
    themeSelected === "dark" && (bottomViewColor= Colors.rgb_000000)
    return <View style={[styles.bottomViewStyle, {backgroundColor: bottomViewColor}]}>
      {/* {market!==KeyUtils.US_MARKET ? this.renderTwoIndicator() : this.renderThreeIndicator()} */}
      <Button
        disabled={isNextBtnDisabled}
        title={I18n.t('profileSetup.next')}
        onPress={this.onRegisterPress}
        style={styles.buttonContainer}
      />
    </View>
  }

  checkName(value) {
    this.setState({username: value})
    if (value === '') {
      this.setState({name_error: true},()=>{
        this.checkStatusOfNextBtn()
      })
    } else {
      this.setState({name_error: false},()=>{
        this.checkStatusOfNextBtn()
      })
    }
  }
  checkStatusOfNextBtn=()=>{
    const {babyName,babyGender,username,name_error,babyDob_error,babyDob,chooseBackWorkDateValue,showBabySection,chooseBackWorkDate}=this.state;
    if(babyDob!=''&&babyDob_error==false){
      if(showBabySection==true){
        if(babyName!=''&&babyGender!=0&&babyName.trim().length>0){
          if(chooseBackWorkDateValue!=''){
            if(username!=''&&name_error==false){
              if(chooseBackWorkDateValue=='yes'){
                let date=moment(chooseBackWorkDate);
                if(date.isValid()){
                  this.setState({isNextBtnDisabled:false})
                }else{
                  this.setState({isNextBtnDisabled:true})
                }
              }else if(chooseBackWorkDateValue=='no'||chooseBackWorkDateValue=='dont'){
                this.setState({isNextBtnDisabled:false})
              }else{
                this.setState({isNextBtnDisabled:true});
              }
            }else{
              this.setState({isNextBtnDisabled:true})
            }
          }else{
            this.setState({isNextBtnDisabled:true})
          }
        }else{
          this.setState({isNextBtnDisabled:true})
        }
      }else{
        if(chooseBackWorkDateValue!=''){
          if(username!=''&&name_error==false){
            if(chooseBackWorkDateValue=='yes'){
              let date=moment(chooseBackWorkDate);
              if(date.isValid()){
                this.setState({isNextBtnDisabled:false})
              }else{
                this.setState({isNextBtnDisabled:true})
              }
            }else if(chooseBackWorkDateValue=='no'||chooseBackWorkDateValue=='dont'){
              this.setState({isNextBtnDisabled:false})
            }else{
              this.setState({isNextBtnDisabled:true});
            }
          }else{
            this.setState({isNextBtnDisabled:true})
          }
        }else{
          this.setState({isNextBtnDisabled:true})
        }
      }
    }else{
      this.setState({isNextBtnDisabled:true})
    }
  }
  showStatusMessage() {
    const {showErrorMessage } = this.state
    return (
      <Dialog
        visible={showErrorMessage}
        title={I18n.t('generic.alert_title')}
        message={I18n.t('generic.error_message')}
        positive={I18n.t('login.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({showErrorMessage: false})
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  _onDateChange = (date) => {
    const { calendarType } = this.state
    let isDOBSelect = calendarType === "dob" ? true : false;
    //this.selectedBabyDate=date;
    isDOBSelect ?  this.addBabyDOB(date) : this.setState({chooseBackWorkDate: date, back_to_work_error:false})
  }

  positiveOnPress = (isBabyDate) => {
    this.setState({showCalendarPicker: false,showWorkCalendarPicker: false},()=>{
      this.checkStatusOfNextBtn();
      if(isBabyDate==true){
          const {showBabySection}=this.state;
          if(showBabySection==true){
            if(this.genderRadioRef!=null&&this.genderRadioRef!=undefined){
              this.genderRadioRef.measureLayout(
                findNodeHandle(this.keyboardScrollViewRef),
                (x, y) => {
                  this.keyboardScrollViewRef.scrollTo({x:0,y:y,animated:true});
                  this.babyNameTextInRef.focus();
                }
              );
            }
          }else{
            setTimeout(() => {
              this.nameTextInRef.blur()
            }, 100);
          }
      }else if (isBabyDate==false){
        this.closeTextInputFocusIfAny([this.babyNameTextInRef,this.nameTextInRef,this.whenToStartRef])
      }
    });
  }
  closeTextInputFocusIfAny=(textInputesRef)=>{
    textInputesRef.forEach(element => {
      setTimeout(()=>{
        if(element!=undefined&&element!=null){
          console.log(element.isFocused())
          if(element.isFocused()){
            element.blur()
          }
        }
      },0)
    });
  }
  negativeOnPress = (isDobCancel) => {
    const { calendarType } = this.state
    let isDOBSelect = calendarType === "dob" ? true : false
    if (isDobCancel){
      this.setState({babyDob: '',showCalendarPicker: false},()=>{
        this.checkStatusOfNextBtn()
      });
    }else {
      this.setState({chooseBackWorkDate: '',showWorkCalendarPicker: false},()=>{
        this.checkStatusOfNextBtn()
      });
    }

  }

  showCalendar() {
    const {showCalendarPicker, babyDob, userLocale} = this.state
    return (
      <CustomCalendar
        visible={showCalendarPicker}
        title={I18n.t('login.forgot_password_title')}
        message={I18n.t('login.forgot_password_message')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        selectedDate={babyDob}
        minDate={this.minDate}
        maxDate={this.maxDate}
        negativeOnPress={() => this.negativeOnPress(true)}
        positiveOnPress={() => this.positiveOnPress(true)}
        onDismiss={() => {
        }}
        onDateChange={(date) => this._onDateChange(date)}
        showHeader={true}
        notShowTime
        userLocale={userLocale}
      />
    )
  }

  showWorkCalendar() {

    let currentDate = moment().add(1, "days");
    currentDate.format("YYYY/MM/DD");
    const {showWorkCalendarPicker,babyDob, chooseBackWorkDate, userLocale} = this.state
    let minDate=isDateGreater(new Date(),new Date(babyDob))?moment().add(1, "days"):moment(babyDob).add(1, "days")


    return (
        <CustomCalendar
        visible={showWorkCalendarPicker}
        title={I18n.t('login.forgot_password_title')}
        message={I18n.t('login.forgot_password_message')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        selectedDate={chooseBackWorkDate}
        minDate={minDate}
        negativeOnPress={() => this.negativeOnPress(false)}
        positiveOnPress={() => this.positiveOnPress(false)}
        onDismiss={() => {
        }}
        onDateChange={(date) => this._onDateChange(date)}
        showHeader={true}
        notShowTime
        userLocale={userLocale}
      />
    )
  }

  onBabyDOBClick() {
    this.setState({babyDob: this.state.babyDob ? moment(this.state.babyDob).format() : moment().add(1, 'days'), showCalendarPicker: true, calendarType: 'dob'},()=>{
      this.checkStatusOfNextBtn()
    })
  }

  onWorkDateClick() {
    this.setState({chooseBackWorkDate: this.state.chooseBackWorkDate ? moment(this.state.chooseBackWorkDate).format() : moment().add(1, 'days'),showWorkCalendarPicker: true, calendarType: 'work'})
  }

  getDateFormat(babyDob) {
    return moment(babyDob).format(this.state.userLocale === 'en_US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY')
  }

  render() {
    const {username, name, babyDob, showCalendarPicker, showWorkCalendarPicker, showBabySection, isLoading, showWorkDateSection, name_error, babyDob_error, showErrorMessage} = this.state;
    const{themeSelected}=this.props;

    let sectionBackgroundColor = Colors.white
    let inactiveRadioButtonColor = Colors.rgb_f5f5f5
    let activeTextColor = Colors.white
    if(themeSelected==="dark"){
      sectionBackgroundColor = Colors.rgb_373838
      inactiveRadioButtonColor = Colors.rgb_373838
      activeTextColor = Colors.rgb_000000
    }
    //styles.radioBtnInactive.backgroundColor = inactiveRadioButtonColor
    //styles.radioBtnTextActive.color = activeTextColor
    if (isLoading){
      return <LoadingSpinner/>
    }
  else{
    return (
      <>
        <KeyboardAwareScrollView
          enableAutomaticScroll={false}
          enableResetScrollToCoords={false}
          showsVerticalScrollIndicator={false}
          innerRef={(element)=>{this.keyboardScrollViewRef=element}}
          keyboardShouldPersistTaps='always'
          contentContainerStyle={{flexGrow: 1,paddingBottom:100}}
        >
          <View style={[styles.container]}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:this.textColor}]}>{I18n.t('profileSetup.title')}</Text>

            <CustomTextInput
              inputRef={(element)=>{this.nameTextInRef=element}}
              maxLength={20}
              placeholder={I18n.t('profileSetup.name')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.textInput,{color:this.textColor}]}
              onChangeText={(index, value) => this.checkName(value)}
              error={name_error}
              // errorMessage={I18n.t('profileSetup.name_error')}
              returnKeyType={"done"}
              onSubmitEditing={Keyboard.dismiss}
              value={name}
            />

            <CustomTextInput
              placeholder={I18n.t('profileSetup.babyDob')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.textInput,{color:this.textColor}]}
              error={babyDob_error}
              errorMessage={I18n.t('profileSetup.baby_dob_error')}
              minDate={this.minDate}
              maxDate={this.maxDate}
              editable={false}
              ableToOpen={true}
              value={babyDob && this.getDateFormat(babyDob)+""}
              onPress={() => this.onBabyDOBClick()}
            />

            {showCalendarPicker && this.showCalendar()}

            {showWorkCalendarPicker && this.showWorkCalendar()}

            {showBabySection && this.renderBabySection()}

            {/* <Text maxFontSizeMultiplier={1.7} style={styles.subTitle}>{I18n.t('profileSetup.planReturnWork')}</Text> */}

            {/* <RadioGroup
              buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
              buttonContainerActiveStyle={styles.radioBtnActive}
              buttonContainerStyle={styles.radioBtnContainer}
              buttonTextActiveStyle={[styles.radioBtnTextActive, {color: activeTextColor}]}
              buttonTextInactiveStyle={styles.radioBtnTextInactive}
              onChange={this.planToReturnWork}
              radioGroupList={workList}/> */}

            {showWorkDateSection && this.renderWorkDateSection()}

          </View>
          {showErrorMessage && this.showStatusMessage()}
          {<View ref={(element)=>{this.pageEndRef=element}}></View>}
        </KeyboardAwareScrollView>
        {this.renderBottomView()}
        {isLoading && <LoadingSpinner/>}
      </>
    );
  }
 }

}

const
  mapStateToProps = (state) => ({
    isProfile: state.user.isProfile,
    isProfileError: state.user.isProfileError,
    isBabyNameAdd: state.user.isBabyNameAdd,
    isBabyNameAddError: state.user.isBabyNameAddError,
    isPicUploaded: state.user.isPicUploaded,
    isPicUploadedError: state.user.isPicUploadedError,
    babyId: state.user.babyId,
    themeSelected: state.app.themeSelected,
    userProfile: state.user.userProfile,
    babies: state.home.babies,
    babiesSuccess: state.home.babiesSuccess,
    babiesFailure: state.home.babiesFailure,
    remoteConfig:state.remoteConfig,
  });

const
  mapDispatchToProps = (dispatch) => ({
    signInSuccess: () => dispatch(AppActions.signInSuccess()),
    addProfile: (profile) => dispatch(UserActions.addProfile(profile)),
    addBabyName: (babies) => dispatch(UserActions.addBabyName(babies)),
    uploadBabyPic: (babyId, imgFile) => dispatch(UserActions.uploadBabyPic(babyId, imgFile)),
    getMyBabies: () => dispatch(HomeActions.getMyBabies()),
    optedState: (keys) => dispatch(AppActions.optedState(keys)),
  });

export default connect(mapStateToProps, mapDispatchToProps)

(
  ProfileSetupScreen
)
;
