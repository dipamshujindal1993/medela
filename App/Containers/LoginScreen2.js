import React, {Component} from 'react';
import { Keyboard, Text, TouchableOpacity, StatusBar, View, AppState} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '@components/Button';
import Dialog from '@components/Dialog';
import LoadingSpinner from '@components/LoadingSpinner';
import I18n from '@i18n';
import {connect} from 'react-redux';
import UserActions from '@redux/UserRedux';
import AppActions from '@redux/AppRedux'
import {validateEmail} from '@utils/TextUtils';
import styles from './Styles/LoginScreenStyles';
import {Colors, Constants } from '@resources'
import CustomTextInput from '@components/CustomTextInput';
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-community/async-storage'
import KeyUtils from "@utils/KeyUtils";
import NoInternetConnectionView from "@components/NoInternetConnectionView";
import { getLocalFromMarket, locale, marketData } from '@utils/locale';
import {getLanguages} from "react-native-i18n";
import { setI18nConfigBasedOnUserLocale } from '../I18n/I18n';
import { Analytics } from '@services/Firebase';
import { updatePopupService } from '../Services/Firebase';

let analytics = new Analytics()

class LoginScreen2 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            username: '',
            password: '',
            showForgetPasswordDialog: false,
            showForgetPasswordSuccessDialog: false,
            showForgetPasswordFailureDialog: false,
            email_error: false,
            password_error: false,
            error_message: '',
            showAlert: false,
            showGenericAlert: false,
            noInternet: false,
            isActive : false,
            password_error_msg: I18n.t('login.blank_password_error_message'),
            name:'',
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
      });

       this.isOptedInForEmail = false;
      this.firstname=Constants.MOM_NAME
    }

    async componentDidMount() {
      const {username, isActive} = this.props.navigation.state.params
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      this.setState({username, isActive}) ;
      AsyncStorage.getItem(KeyUtils.IS_FIRST_LOGIN_COMPLETED).then((value)=>{
        let val =JSON.parse(value)
        if(val!=null && val.ids!= undefined && val.ids.length>0){
          this.setState({firstUserIds:val.ids})
        }
      })
    }

    async componentDidUpdate(prevProps, prevState) {
        const {isLogin, isLoginError,isForgotPasswordError,isForgotPasswordSuccess,message,
          userProfileSuccess, userProfileFailure, userProfile, getUserProfile, isSignUp, isSignUpError, getLogin} = this.props;
        if ((prevProps.isForgotPasswordError != isForgotPasswordError) && isForgotPasswordError && prevState.isLoading) {
            this.setState({
                isLoading: false,
                showForgetPasswordFailureDialog: true
            });

        }
        if ((prevProps.isForgotPasswordSuccess != isForgotPasswordSuccess) && isForgotPasswordSuccess && prevState.isLoading) {
            this.setState({
                isLoading: false,
                showForgetPasswordSuccessDialog: true
            });

        }
        if ((prevProps.isLogin != isLogin) && isLogin && prevState.isLoading) {

            AsyncStorage.setItem(KeyUtils.USER_LAST_EMAIL, this.state.username);
            AsyncStorage.setItem(KeyUtils.USER_LAST_PASSWORD, this.state.password);
            getUserProfile()
        }
        if ((prevProps.isLoginError != isLoginError) && isLoginError && prevState.isLoading) {
            this.setState({
                isLoading: false,
            });
            if(message==='Login failed.')
              this.setState({showAlert:true, error_message:I18n.t('login.login_failed')})
            else
              this.setState({showGenericAlert:true, error_message:I18n.t('generic.error_message')})
        }

        if (userProfileSuccess != prevProps.userProfileSuccess && userProfileSuccess && prevState.isLoading) {
          console.log('userProfileSuccess')
          const {incompleteProfile, incompleteOptIn,isOptedInForEmail} = userProfile.mother
          const {name} = userProfile.mother
          this.setState({isLoading: false,name})

          const { remoteConfig}=this.props
          let localeAccordingToMarket = getLocalFromMarket(remoteConfig && remoteConfig.markets, userProfile.mother.market)

          let param = {
            'market': userProfile.mother.market,
            'language': localeAccordingToMarket
          }
          await analytics.logEvent(Constants.LOGIN, param);

          if(incompleteProfile){
              this.props.navigation.navigate('ProfileSetupScreen',{market:userProfile.mother.market,isSignUp:false,isOptedInForEmail})
            } else if(incompleteOptIn && userProfile.mother.market===KeyUtils.US_MARKET) {
            this.props.navigation.navigate('OptedSetupScreen',{market:userProfile.mother.market,isSignUp});
          } else if (userProfile.mother.market!==KeyUtils.US_MARKET && !userProfile.mother.hasOwnProperty('hasPump')){  // !hasPump
            this.props.navigation.navigate('PumpSetupScreen',{market:userProfile.mother.market,isSignUp});
          }
          /*else if(incompleteOptIn && userProfile.mother.market==KeyUtils.US_MARKET) {
            this.props.navigation.navigate('OptedSetupScreen',{market:userProfile.mother.market});
          }
          else if(!userProfile.mother.hasOwnProperty('hasPump'))
            this.props.navigation.navigate('PumpSetupScreen',{market:userProfile.mother.market});*/
          else{
            const{firstUserIds}=this.state
            const {username} = this.props.navigation.state.params
            if(firstUserIds.length>0 && firstUserIds.includes(username)){
              let resp=await setI18nConfigBasedOnUserLocale(this.props.userProfile.mother,this.props.remoteConfig.markets,this.props.signInSuccess);
              resp===true&&this.props.signInSuccess()
            }
            else{
              AsyncStorage.setItem(KeyUtils.IS_FIRST_LOGIN_COMPLETED, JSON.stringify({ids: [...firstUserIds,username]}));
              this.props.navigation.navigate('NewWelcomeScreen',{name:name})
            }
            updatePopupService.setData();
          }
        }

        if (userProfileFailure != prevProps.userProfileFailure && userProfileFailure && prevState.isLoading) {
          this.setState({isLoading: false})
        }

        if (isSignUp!=prevProps.isSignUp && isSignUp && prevState.isLoading) {
          const {username, password} = this.state;
          AsyncStorage.setItem(KeyUtils.USER_LAST_EMAIL, username);
          AsyncStorage.setItem(KeyUtils.USER_LAST_PASSWORD, password);
          getLogin(username, password);
        }
        if ((prevProps.isSignUpError != isSignUpError) && isSignUpError && prevState.isLoading) {
          this.setState({isLoading: false});
          if (message === "signup.customer.already.exists") {
            this.setState({alert_message:I18n.t('signup.emailAlreadyExist'), showAlert:true})
          }else{
            this.setState({alert_message:I18n.t('generic.error_message'), showGenericAlert:true})
          }
        }
    }

    onForgotPasswordPress = ()=>{
        Keyboard.dismiss()
        const {username} = this.state
        if(validateEmail(username)){
        this.setState({showForgetPasswordDialog: true})
        }
    }

    checkEmail(value){
      this.setState({username:value})
      if(!validateEmail(value)){
        this.setState({email_error:true,})
      }else{
        this.setState({email_error:false})

      }
    }

    checkPwd(value){
      this.setState({password:value})
      if(value===''){
      this.setState({
        password_error:true,
        password_error_msg:I18n.t('login.blank_password_error_message')
      })
      }else if (value.indexOf(' ') >= 0) {
        this.setState({
          password_error_msg: I18n.t('login.no_space_in_password'),
          password_error: true
        })
      }else{
        this.setState({password_error:false})
      }
    }

    render() {
        const {
            username,
            password,
            isLoading,
            showForgetPasswordDialog,
            showForgetPasswordSuccessDialog,
            showForgetPasswordFailureDialog,
            email_error,
            password_error,
            showAlert,
            showGenericAlert,
            noInternet,
            isActive,
            password_error_msg

        } = this.state;
        const forgot_password_style =
            (username && username.length > 0 && validateEmail(username)) ?
                [styles.forgotPwdTitle, {color:Colors.rgb_ffcd00}] :
                styles.forgotPwdTitle
        return (
            <>
              <KeyboardAwareScrollView keyboardShouldPersistTaps='always' >
                <StatusBar hidden={false}/>
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={()=>Keyboard.dismiss()}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:this.textColor}]}>{I18n.t('login.title')}</Text>

                  {isActive && <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('login.subscribed_user_msg')}</Text>}


                  {/*<CustomTextInput*/}
                  {/*  maxLength={50}*/}
                  {/*  textContentType="emailAddress"*/}
                  {/*  placeholder={I18n.t('login.email')}*/}
                  {/*  placeholderTextColor={Colors.rgb_898d8d}*/}
                  {/*  textStyles={styles.textInput}*/}
                  {/*  value={username}*/}
                  {/*  onChangeText={(index, value) => this.checkEmail(value)}*/}
                  {/*  error={email_error}*/}
                  {/*  errorMessage={I18n.t('login.email_error_message')}*/}
                  {/*  onSubmitEditing={() => { this.passwordTextInput.focus(); }}/>*/}

                  <CustomTextInput
                    maxLength={50}
                    textContentType="password"
                    placeholder={I18n.t('login.password')}
                    placeholderTextColor={this.textColor}
                    textStyles={[styles.textInput,{color:this.textColor}]}
                    onChangeText={(index, value) => this.checkPwd(value)}
                    error={password_error}
                    value={password}
                    errorMessage={password_error_msg}
                    inputRef={(input)=>{ this.passwordTextInput = input }}
                    returnKeyType={"done"}
                    onSubmitEditing={Keyboard.dismiss}
                    themeSelected={this.props.themeSelected}/>

                  {!isActive && <TouchableOpacity
                    onPress={() => this.onForgotPasswordPress()}>
                    <Text maxFontSizeMultiplier={1.7} style={forgot_password_style}>
                      {I18n.t('login.forgot_your_password')}
                    </Text>
                  </TouchableOpacity>}
                    <Button
                        title={ !isActive ? I18n.t('login.login') : I18n.t('profileSetup.next')}
                        onPress={this.onLoginPress}
                        style={styles.buttonContainer}
                        disabled={!password}
                    />
                    {showForgetPasswordDialog && this.forgotPassword()}
                    {(showForgetPasswordSuccessDialog || showForgetPasswordFailureDialog) && this.forgotPasswordStatus()}
                    {showAlert && this.showStatusMessage()}
                    {showGenericAlert && this.showGenericStatusMessage()}
                </TouchableOpacity>
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
        positiveOnPress={()=>this.onLoginPress()}
        textColor={this.textColor}
      />
    }

    onLoginPress = async () => {
      Keyboard.dismiss()
      this.setState({noInternet:false})
      await analytics.logOnPress(Constants.LOGIN);
      const {username, password, isActive} = this.state;
      if(username && password){
        NetInfo.fetch().then((state) => {
          if(state.isConnected){
            this.setState({isLoading: true});
            if(!isActive) {
              this.props.getLogin(username, password);
            }
            else {
              this.props.signUp(username, password, KeyUtils.INT_MARKET, this.firstname, this.isOptedInForEmail);
            }
          }else{
            this.setState({noInternet:true})
          }
        });
      }
    };

    forgotPassword() {
        const { showForgetPasswordDialog } = this.state
        return (
            <Dialog
                visible={showForgetPasswordDialog}
                title={I18n.t('login.forgot_password_title')}
                message={I18n.t('login.forgot_password_message')}
                positive={I18n.t('login.yes')}
                negative={I18n.t('login.no')}
                isIcon={false}
                negativeOnPress={() => {
                    this.setState({showForgetPasswordDialog: false})
                }}
                positiveOnPress={() => {
                    this.setState({isLoading:true, showForgetPasswordDialog: false})
                    this.props.getForgotPassword(this.state.username, I18n.locale.replace("-", "_"))
                }}
                onDismiss={() => {
                }}
            />
        )
    };

    forgotPasswordStatus() {
        const { showForgetPasswordSuccessDialog, showForgetPasswordFailureDialog } = this.state
        return (
            <Dialog
                visible={showForgetPasswordSuccessDialog || showForgetPasswordFailureDialog}
                title={I18n.t('login.forgot_password_success_title')}
                message={I18n.t('login.forgot_password_success_message')}
                positive={I18n.t('login.ok')}
                positiveOnPress={() => {
                    this.setState({showForgetPasswordSuccessDialog: false, showForgetPasswordFailureDialog: false})
                }}
                onDismiss={() => {
                }}
            />
        )
    };

    showStatusMessage() {
      const { error_message, showAlert, username } = this.state
      const { navigation } = this.props
      return (
        <Dialog
          visible={showAlert}
          title={I18n.t('generic.alert_title')}
          message={error_message}
          positive={I18n.t('login.edit_email')}
          negative={I18n.t('login.sign_up')}
          isIcon={false}
          negativeOnPress={() => {
            this.setState({showAlert: false})
            navigation.navigate('SignUpScreen',{
              emailId: username,
            })
          }}
          positiveOnPress={() => {
            this.setState({showAlert: false})
            navigation.goBack()
          }}
          onDismiss={() => {
          }}
        />
      )
    };

  showGenericStatusMessage() {
      const { error_message, showGenericAlert, username } = this.state
      const { navigation } = this.props
      return (
        <Dialog
          visible={showGenericAlert}
          title={I18n.t('generic.alert_title')}
          message={error_message}
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

}

const mapStateToProps = (state) => ({
    isLogin: state.user.isLogin,
    isLoginError: state.user.isLoginError,
    isForgotPasswordSuccess:state.user.isForgotPasswordSuccess,
    isForgotPasswordError:state.user.isForgotPasswordError,
    message:state.user.message,
    remoteConfig:state.remoteConfig,
    userProfile: state.user.userProfile,
    userProfileSuccess: state.user.userProfileSuccess,
    userProfileFailure: state.user.userProfileFailure,
    isSignUp: state.user.isSignUp,
    isSignUpError: state.user.isSignUpError,
    themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
    signInSuccess: () => dispatch(AppActions.signInSuccess()),
    getLogin: (username, password) => dispatch(UserActions.getLogin(username, password)),
    getForgotPassword:(email, locale)=>dispatch(UserActions.getForgotPassword(email, locale)),
    getUserProfile: () => dispatch(UserActions.getUserProfile()),
    signUp: (email, password, market, firstname,isOptedInForEmail) => dispatch(UserActions.signUp(email, password, market, firstname,isOptedInForEmail)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen2);
