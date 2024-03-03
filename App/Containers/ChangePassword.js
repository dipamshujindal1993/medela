import React, { Component } from 'react'
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import HeaderTitle from '@components/HeaderTitle';
import styles from './Styles/MotherInfoScreenStyles';
import HomeActions from '@redux/HomeRedux';
import I18n from '@i18n';
import CustomTextInput from '@components/CustomTextInput';
import Dialog from '@components/Dialog';
import Colors from '@resources/Colors';
import Button from '@components/Button';
import LoadingSpinner from "@components/LoadingSpinner";
import AsyncStorage from '@react-native-community/async-storage';
import KeyUtils from '@utils/KeyUtils';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class ChangePassword extends Component{
  constructor(props) {
    super(props)
    this.state = {
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
      showSuccessPopup: false,
      currentPwdError1: false,
      currentPwdError2: '',
      newPwdError: '',
      repeatPwdError1: false,
      repeatPwdError2: '',
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }
  async componentDidMount(){
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    await analytics.logScreenView('change_password_screen')
  }
  componentDidUpdate(prevProps, prevState) {
    const { changePasswordSuccess, changePasswordFailure } = this.props;
    if(prevProps.changePasswordSuccess != changePasswordSuccess && changePasswordSuccess && prevState.isLoading) {
      if(changePasswordSuccess) {
        AsyncStorage.setItem(KeyUtils.USER_LAST_PASSWORD, this.state.newPassword);
        this.setState({ showSuccessPopup: true, isLoading:false })
      }
    }
    if(prevProps.changePasswordFailure != changePasswordFailure && changePasswordFailure) {
      this.setState({ currentPwdError1: true, isLoading:false, currentPwdError2: I18n.t("mom_information.current_password_error") })
    }
  }

  onConfirm() {
      const { currentPassword, newPassword, repeatPassword } = this.state
      const{ changePassword, userProfile }=this.props
      if (newPassword.length < 8 || newPassword.length > 20 || newPassword.search(/\d/) == -1 || newPassword.search(/[a-zA-Z]/) == -1) {
        this.setState({
          newPwdError2: I18n.t("mom_information.new_password_error"),
          newPwdError1: true,
          currentPwdError1: false
        })
      } else if (newPassword.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
        this.setState({
          newPwdError2: I18n.t('signup.password_invalid_characters'),
          newPwdError1: true,
          currentPwdError1: false
        })
      } else if(newPassword !== repeatPassword) {
        this.setState({ repeatPwdError2: I18n.t("mom_information.repeat_password_err"), repeatPwdError1: true, currentPwdError1: false, newPwdError1: false})
      } else {
        this.setState({isLoading:true})
        changePassword(userProfile.mother.username, currentPassword, newPassword)
      }
  }

  render(){
    const{currentPassword, newPassword, repeatPassword, showSuccessPopup,isLoading}=this.state;
    return(
      <View style={styles.container}>
        <HeaderTitle title={I18n.t("mom_information.change_password_title")} onBackPress={()=> this.props.navigation.goBack()}/>
        {isLoading && <LoadingSpinner/>}
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <CustomTextInput
            maxLength={50}
            placeholder={I18n.t('mom_information.current_password')}
            placeholderTextColor={this.props.themeSelected === 'dark' ?(Colors.white):(Colors.rgb_000000)}
            value={currentPassword ? currentPassword : ''}
            onChangeText={(index, value) => this.setState({currentPassword: value, currentPwdError1: false })}
            returnKeyType={"done"}
            textStyles={[styles.passwordTextInput,{color:this.textColor}]}
            error={this.state.currentPwdError1}
            textContentType="password"
            errorMessage={I18n.t("mom_information.current_password_error")}
            onSubmitEditing={Keyboard.dismiss}
            themeSelected={this.props.themeSelected}
          />
          <CustomTextInput
            maxLength={50}
            placeholder={I18n.t('mom_information.new_password')}
            placeholderTextColor={this.props.themeSelected === 'dark' ?(Colors.white):(Colors.rgb_000000)}
            textStyles={[styles.passwordTextInput,{color:this.textColor}]}
            value={newPassword ? newPassword : ''}
            onChangeText={(index, value) => this.setState({ newPassword: value, newPwdError1: false })}
            returnKeyType={"done"}
            onSubmitEditing={Keyboard.dismiss}
            error={this.state.newPwdError1}
            textContentType="password"
            errorMessage={this.state.newPwdError2}
            themeSelected={this.props.themeSelected}
          />
          <CustomTextInput
            maxLength={50}
            placeholder={I18n.t('mom_information.repeat_password')}
            placeholderTextColor={this.props.themeSelected === 'dark' ?(Colors.white):(Colors.rgb_000000)}
            textStyles={[styles.passwordTextInput,{color:this.textColor}]}
            value={repeatPassword ? repeatPassword : ''}
            onChangeText={(index, value) => this.setState({repeatPassword: value, repeatPwdError2: false })}
            returnKeyType={"done"}
            onSubmitEditing={Keyboard.dismiss}
            error={this.state.repeatPwdError1}
            textContentType="password"
            errorMessage={this.state.repeatPwdError2}
            themeSelected={this.props.themeSelected}
          />
        </View>
        <View style={styles.btnWrapper}>
          <Button title={I18n.t('mom_information.change_password_button')}
            style={styles.unlockNowBtnStyles}
            disabled={currentPassword === '' || newPassword === '' || repeatPassword === ''}
            onPress={() => this.onConfirm()}
          />
        </View>
        <Dialog
          visible={showSuccessPopup}
          title={I18n.t('mom_information.change_password_congrts_msg')}
          positive={I18n.t('mom_information.ok')}
          isIcon={false}
          positiveOnPress={() => {
            this.setState({showSuccessPopup: false})
            this.props.navigation.navigate("MotherInfoScreen")
          }}
          onDismiss={() => {
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  changePasswordSuccess: state.home.changePasswordSuccess,
  changePasswordFailure: state.home.changePasswordFailure,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  changePassword: (email, oldPwd, newPwd) => dispatch(HomeActions.changePassword(email, oldPwd, newPwd)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

