import React, {Component} from 'react';
import { Keyboard, Text, TouchableOpacity, StatusBar, View, AppState} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '@components/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import I18n from '@i18n';
import {connect} from 'react-redux';
import UserActions from '@redux/UserRedux';
import {validateEmail} from '@utils/TextUtils';
import styles from './Styles/LoginScreenStyles';
import {Colors } from '@resources'
import CustomTextInput from '@components/CustomTextInput';
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from '@react-native-community/async-storage'
import KeyUtils from "@utils/KeyUtils";
import NoInternetConnectionView from "@components/NoInternetConnectionView";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class LoginScreen1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email_error: false,
            error_message: '',
            showAlert: false,
            showGenericAlert: false,
            noInternet: false,
            isLoading: false,
        };
        this.themeSelected=this.props.themeSelected  && this.props.themeSelected
        this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    }

    async componentDidMount() {
      const {params}=this.props.navigation.state;
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      AsyncStorage.getItem(KeyUtils.USER_LAST_EMAIL).then(value =>{
        let resp=value;
        if(params && params.username && params.username.length>0 && validateEmail(params.username)){
            resp=params.username;
        }
        //AsyncStorage returns a promise so adding a callback to get the value
        resp && this.setState({ username: resp })
        //Setting the value in Text
      });
      await analytics.logScreenView('login_screen')
    }

  componentDidUpdate(prevProps, prevState) {
    const {isUserAvailable, isUserAvailableError,message, errorMessages} = this.props;
    if ((prevProps.isUserAvailableError != isUserAvailableError) && isUserAvailableError && prevState.isLoading) {
      this.setState({isLoading: false});
      let dd = errorMessages

      dd.map((item)=>{
        console.log('item === ',item)
        if(JSON.stringify(item).includes('Salesforce'))
          this.props.navigation.navigate('LoginScreen2',{username:this.state.username, isActive:true})
        else  this.props.navigation.navigate('LoginScreen2',{username:this.state.username, isActive:false})
      })
    }
    if ((prevProps.isUserAvailable != isUserAvailable) && isUserAvailable && prevState.isLoading) {
      this.setState({isLoading: false});
      this.props.navigation.navigate('LoginScreen2',{username:this.state.username, isActive:false})
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

    render() {
        const {
            username,
            email_error,
            noInternet,
            isLoading

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

                  <CustomTextInput
                    maxLength={50}
                    textContentType="emailAddress"
                    placeholder={I18n.t('login.email')}
                    placeholderTextColor={this.textColor}
                    textStyles={[styles.textInput,{color:this.textColor}]}
                    value={username}
                    onChangeText={(index, value) => this.checkEmail(value)}
                    error={email_error}
                    errorMessage={I18n.t('login.email_error_message')}
                    returnKeyType={"done"}
                    onSubmitEditing={Keyboard.dismiss}/>

                    <Button
                        title={I18n.t('profileSetup.next')}
                        onPress={this.onNextPress}
                        style={styles.buttonContainer}
                        disabled={ !username || !validateEmail(username)}
                    />
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
      positiveOnPress={()=>this.onNextPress()}
      textColor={this.textColor}
    />
  }
  onNextPress = () => {
      Keyboard.dismiss()
    this.setState({noInternet:false})
    const {username} = this.state;
    if(username){
      NetInfo.fetch().then((state) => {
        if(state.isConnected){
          this.setState({isLoading: true});
          AsyncStorage.setItem(KeyUtils.USER_LAST_EMAIL,username)
          this.props.getUserAvailable(username);
        }else{
          this.setState({noInternet:true})
        }
      });
    }
    };
}

const mapStateToProps = (state) => ({
  isUserAvailable: state.user.isUserAvailable,
  isUserAvailableError: state.user.isUserAvailableError,
  message: state.user.message,
  errorMessages: state.user.errorMessages,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
  getUserAvailable: (email) => dispatch(UserActions.getUserAvailable(email)),
  getUserAvailableSuccess: () => dispatch(UserActions.getUserAvailableSuccess()),
  getUserAvailableFailure: () => dispatch(UserActions.getUserAvailableFailure()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen1);
