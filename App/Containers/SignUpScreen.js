import React, {Component} from 'react';
import { Keyboard, Switch, StatusBar, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '@components/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import I18n from '@i18n';
import UserActions from '@redux/UserRedux';
import {validateEmail} from '@utils/TextUtils';
import {connect} from 'react-redux';
import AppActions from '@redux/AppRedux'
import CustomTextInput from '@components/CustomTextInput';
import {
  Colors,Constants
} from '@resources'
import styles from './Styles/SignUpScreenStyles';
import Dialog from '@components/Dialog';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import NoInternetConnectionView from "@components/NoInternetConnectionView";
import NetInfo from "@react-native-community/netinfo";
import { getLanguages } from 'react-native-i18n';
import {countryCode, getLocalFromMarket, locale, marketData} from "@utils/locale";
import GetterSetter from "../Components/GetterSetter";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
import {moderateScale} from "@resources/Metrics";

class SignUpScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      password: '',
      isOptedInForEmail: false,
      email_error: false,
      password_error: false,
      password_error_msg: I18n.t('signup.password_null'),
      showAlert:false,
      alert_message:'',
      showGenericAlert: false,
      noInternet: false,
      loginFlow:false,
      firstUserIds:[]
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    getLanguages().then(languages => {
      if (languages && languages.length>0){
        this.market= this.props.remoteConfig && this.props.remoteConfig.markets && marketData(this.props.remoteConfig.markets,languages[0].replace("-", "_")).market;
      }else {
        this.market= this.props.remoteConfig && this.props.remoteConfig.markets && marketData(this.props.remoteConfig.markets,locale().replace("-", "_")).market;
      }
      if(this.market === KeyUtils.US_MARKET){
        this.setState({isOptedInForEmail:true})
      }
    });
    this.firstname=Constants.MOM_NAME
  }

  async componentDidMount() {
    const { params } = this.props.navigation.state;
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    countryCode()
    let value = params ? params.emailId : ''
    this.setState({email: value}) ;
    AsyncStorage.getItem(KeyUtils.IS_FIRST_LOGIN_COMPLETED).then((value)=>{
      let val =JSON.parse(value)
      if(val!=null && val.ids!= undefined && val.ids.length>0){
        this.setState({firstUserIds:val.ids})
      }
    })
    await analytics.logScreenView('sign_up_screen')
  }
  isNewUser=false;
  async componentDidUpdate(prevProps, prevState) {
    const {isSignUp, isSignUpError, isUserAvailable,optedState, isUserAvailableError, isLogin, isLoginError, message,signUp,getLogin,errorMessages,getUserProfile,userProfileSuccess,userProfileFailure,userProfile,opted} = this.props;
    const {email, password} = this.state;
    let salesForceUserFlag=false;
    let CASUserFlag=false;
    if ((prevProps.isUserAvailableError != isUserAvailableError) && isUserAvailableError && prevState.isLoading) {
      let errorCatchForExistingSalesForceUser=errorMessages;
      errorCatchForExistingSalesForceUser.map((item)=>{
        if(JSON.stringify(item).includes('Salesforce')){
          salesForceUserFlag=true;
        }else if(JSON.stringify(item).includes('CAS')){
          CASUserFlag=true;
        }else{
          salesForceUserFlag=false;
          CASUserFlag=false;
        }
      })
      if(CASUserFlag){
        getLogin(email, password);
      }
      else if(salesForceUserFlag){
        const {email, password,isOptedInForEmail} = this.state;
        signUp(email, password, KeyUtils.INT_MARKET, this.firstname,isOptedInForEmail);
      }
      else if (message === "signup.customer.already.exists") {
        getLogin(email, password);
      }else{
        this.setState({alert_message:I18n.t('generic.error_message'), showAlert:true,isLoading: false})
      }
    }
    if ((prevProps.isUserAvailable != isUserAvailable) && isUserAvailable && prevState.isLoading) {
      const {email, password,isOptedInForEmail} = this.state;
      this.isNewUser=true;
      signUp(email, password, this.market, this.firstname,isOptedInForEmail);
    }
    if (userProfileSuccess != prevProps.userProfileSuccess && userProfileSuccess && prevState.isLoading) {
      AsyncStorage.setItem(KeyUtils.USER_LAST_EMAIL, email);
      AsyncStorage.setItem(KeyUtils.USER_LAST_PASSWORD, password);
      const {incompleteProfile, incompleteOptIn,isOptedInForEmail} = userProfile.mother;

      const { remoteConfig}=this.props
      let localeAccordingToMarket = getLocalFromMarket(remoteConfig && remoteConfig.markets, userProfile.mother.market)

      let signUpParam = {
        'market': userProfile.mother.market,
        'language': localeAccordingToMarket
      }
      await analytics.logEvent(Constants.SIGN_UP, signUpParam);


      this.setState({isLoading: false},()=>{
        if(incompleteProfile){
          this.props.navigation.navigate('ProfileSetupScreen',{market:userProfile.mother.market,signUp:false,isOptedInForEmail})
        }else if(incompleteOptIn && userProfile.mother.market===KeyUtils.US_MARKET) {
          this.props.navigation.navigate('OptedSetupScreen',{market:userProfile.mother.market,isSignUp});
        } else if (userProfile.mother.market!==KeyUtils.US_MARKET && !userProfile.mother.hasOwnProperty('hasPump')){
          this.props.navigation.navigate('PumpSetupScreen',{market:userProfile.mother.market,isSignUp});
        }
        /*else if(incompleteOptIn && userProfile.mother.market==KeyUtils.US_MARKET) {
          this.props.navigation.navigate('OptedSetupScreen',{market:userProfile.mother.market,signUp:false});
        }
        else if(!userProfile.mother.hasOwnProperty('hasPump')){
          this.props.navigation.navigate('PumpSetupScreen',{market:userProfile.mother.market});
        }*/
        else{
          this.props.signInSuccess()
        }
      })
    }

    if (userProfileFailure != prevProps.userProfileFailure && userProfileFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
    if (isSignUp!=prevProps.isSignUp && isSignUp && prevState.isLoading) {
      const {email, password} = this.state;
      let prevEmail=await AsyncStorage.getItem(KeyUtils.USER_LAST_EMAIL);
      let prevPassWord=await AsyncStorage.getItem(KeyUtils.USER_LAST_PASSWORD);
      await AsyncStorage.setItem(KeyUtils.USER_LAST_EMAIL, email);
      await AsyncStorage.setItem(KeyUtils.USER_LAST_PASSWORD, password);
      if(prevEmail!=null&&prevPassWord!=null&&prevEmail!=''&&prevPassWord!=''&&prevEmail!=email&&(opted.state=='first'||opted.state=='background')&&opted.value==false&&opted.market!=null){
        GetterSetter.setUserChangedWithoutCompletedItsProfile(true);
      }
      getLogin(email, password);
    }
    if ((prevProps.isSignUpError != isSignUpError) && isSignUpError && prevState.isLoading) {
      this.setState({isLoading: false},()=>{
        if (message === "signup.customer.already.exists") {
          this.setState({alert_message:I18n.t('signup.emailAlreadyExist'), showAlert:true})
        }else{
          this.setState({alert_message:I18n.t('generic.error_message'), showGenericAlert:true})
        }
      });
    }
    if ((prevProps.isLogin != isLogin) &&isLogin &&prevState.isLoading) {
      if(this.isNewUser){
        if(GetterSetter.getUserChangedWithoutCompletedItsProfile()===true){
          optedState({state:'initial',value:false,market:null});
        }
        this.setState({isLoading:false},()=>{
          this.props.navigation.navigate('ProfileSetupScreen',{market:this.market,isSignUp:true,isOptedInForEmail:this.state.isOptedInForEmail})
        })
      }else{
        getUserProfile();
      }
    }
    if ((prevProps.isLoginError != isLoginError) && isLoginError && prevState.isLoading) {
      this.setState({
        isLoading: false
      },()=>{
        if(message==='Login failed.')
          this.setState({showAlert:true, error_message:I18n.t('login.login_failed')})
        else
          this.setState({showGenericAlert:true, error_message:I18n.t('generic.error_message')})
      });
    }

  }

  toggleSwitch = (value) => {
    //onValueChange of the switch this function will be called
    this.setState({isOptedInForEmail: value});
    //state changes according to switch
    //which will result in re-render the text
  };
  checkEmail(value){
    this.setState({ email: value })
    if(!validateEmail(value)){
      this.setState({ email_error: true })
    }else{
      this.setState({ email_error: false })
    }
  }

  checkPwd(value) {
    this.setState({ password: value })
    if(value.length === 0)    {
      this.setState({ password_error: false })
    }else if (value.length < 8) {
      this.setState({
        password_error_msg: I18n.t('signup.password_min_length'),
        password_error: true
      })
    } else if (value.length > 20) {
      this.setState({ password_error_msg: I18n.t('signup.password_too_long'),
        password_error: true
      })
    } else if (value.search(/\d/) == -1) {
      this.setState({ password_error_msg: I18n.t('signup.password_no_numbers'),
        password_error: true
      })
    } else if (value.search(/[a-zA-Z]/) == -1) {
      this.setState({ password_error_msg: I18n.t('signup.password_no_letters'),
        password_error: true
      })
    } else if (value.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
      this.setState({ password_error_msg: I18n.t('signup.password_invalid_characters'),
        password_error: true
      })
    }else{
      this.setState({ password_error: false })
    }

  }
  showStatusMessage() {
    const { alert_message, showAlert, email } = this.state
    const { navigation } = this.props
    return (
      <Dialog
        visible={showAlert}
        title={I18n.t('generic.alert_title')}
        message={alert_message}
        positive={I18n.t('signup.edit_email')}
        negative={I18n.t('signup.login_up')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showAlert: false})
          navigation.navigate('LoginScreen1',{
            username: email,
          })
        }}
        positiveOnPress={() => {
          this.setState({showAlert: false})
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  showGenericStatusMessage() {
    const { alert_message, showGenericAlert, email } = this.state
    const { navigation } = this.props
    return (
      <Dialog
        visible={showGenericAlert}
        title={I18n.t('generic.alert_title')}
        message={alert_message}
        positive={I18n.t('login.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({showGenericAlert: false})
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  render() {
    const { email, email_error,password, password_error, password_error_msg, isLoading, showAlert, showGenericAlert, noInternet } = this.state;
    return (
      <>
        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
          <StatusBar hidden={false}/>
          <View style={styles.container}>

            <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:this.textColor}]}>{I18n.t('signup.title')}</Text>

            <CustomTextInput
              maxLength={50}
              textContentType="emailAddress"
              placeholder={I18n.t('signup.email')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.textInput,{color:this.textColor}]}
              onChangeText={(index, value) => this.checkEmail(value)}
              error={email_error}
              value={email}
              errorMessage={I18n.t('signup.email_error')}
              onSubmitEditing={() => { this.passwordTextInput.focus(); }}
            />

            <CustomTextInput
              maxLength={50}
              textContentType="password"
              placeholder={I18n.t('signup.password')}
              placeholderTextColor={this.textColor}
              textStyles={[styles.textInput,{color:this.textColor}]}
              onChangeText={(index, value) => this.checkPwd(value)}
              error={password_error}
              value={password}
              errorMessage={password_error_msg}
              inputRef={(input)=>{ this.passwordTextInput = input }}
              returnKeyType={"done"}
              onSubmitEditing={Keyboard.dismiss}
              themeSelected={this.props.themeSelected}
            />

            <View style={{
              paddingHorizontal: moderateScale(20),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Switch
                onValueChange={this.toggleSwitch}
                value={this.state.isOptedInForEmail}
                trackColor={{true: Colors.rgb_fecd00, false: Colors.rgb_e0d7e5}}
                style={styles.switch}
              />
              <Text maxFontSizeMultiplier={1.7} style={[styles.termsTitle, {paddingStart: moderateScale(10),color:this.textColor}]}>{I18n.t('signup.offer')}</Text>
            </View>


            <Text maxFontSizeMultiplier={1.7}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.termsTitle,{color:this.textColor}]}>{I18n.t('signup.terms')}</Text>
              <Text maxFontSizeMultiplier={1.7} onPress={() => this.props.navigation.navigate('TermsConditionsScreen')}
                    style={styles.privacy}>{I18n.t('signup.privacyPolicy')}</Text>
            </Text>


            <Button
              title={I18n.t('signup.signUpBtn')}
              onPress={this.onRegisterPress}
              style={styles.buttonContainer}
              disabled={ !email || !password || !validateEmail(email) || password_error}
            />
            {showAlert && this.showStatusMessage()}
            {showGenericAlert && this.showGenericStatusMessage()}
          </View>
        </KeyboardAwareScrollView>
        {isLoading && <LoadingSpinner/>}
        {noInternet && this.showInternetError()}
      </>
    );
  }

  showInternetError(){
    const{noInternet}=this.state
    return <NoInternetConnectionView
      visible={noInternet}
      negativeOnPress={()=>this.setState({noInternet:false})}
      positiveOnPress={()=>this.onRegisterPress()}
    />
  }

  onRegisterPress = async () => {
    Keyboard.dismiss()
    this.setState({noInternet:false})
    await analytics.logOnPress(Constants.SIGN_UP);
    const {email, password, password_error,firstUserIds} = this.state;
    if (!validateEmail(email)) {
      this.setState({email_error:true})
    }
    if (password_error || password === ''|| password>20) {
      this.setState({password_error:true})
    } else {
      NetInfo.fetch().then((state) => {
        if(state.isConnected){
          this.setState({isLoading: true});
          this.props.getUserAvailable(email);
          AsyncStorage.setItem(KeyUtils.IS_FIRST_LOGIN_COMPLETED, JSON.stringify({ids: [...firstUserIds,email]}));
        }else{
          this.setState({noInternet:true})
        }
      });
    }
  };
}

const mapStateToProps = (state) => ({

  isSignUp: state.user.isSignUp,
  isSignUpError: state.user.isSignUpError,
  isUserAvailable: state.user.isUserAvailable,
  isUserAvailableError: state.user.isUserAvailableError,
  isLogin: state.user.isLogin,
  isLoginError: state.user.isLoginError,
  message: state.user.message,
  remoteConfig:state.remoteConfig,
  errorMessages: state.user.errorMessages,
  userProfile: state.user.userProfile,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  opted: state.app.opted,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
  signInSuccess: () => dispatch(AppActions.signInSuccess()),
  getUserAvailable: (email) => dispatch(UserActions.getUserAvailable(email)),
  getUserAvailableSuccess: () => dispatch(UserActions.getUserAvailableSuccess()),
  getUserAvailableFailure: () => dispatch(UserActions.getUserAvailableFailure()),
  signUp: (email, password, market, firstname,isOptedInForEmail) => dispatch(UserActions.signUp(email, password, market, firstname,isOptedInForEmail)),
  getSignUpSuccess: () => dispatch(UserActions.getSignUpSuccess()),
  getSignUpFailure: () => dispatch(UserActions.getSignUpFailure()),
  getLogin: (email, password) => dispatch(UserActions.getLogin(email, password)),
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  optedState: (keys) => dispatch(AppActions.optedState(keys)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
