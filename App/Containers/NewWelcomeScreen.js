import React, {Component} from 'react';
import {Text, View, Image,SafeAreaView} from 'react-native';
import Button from '@components/Button';
import I18n from '@i18n';
import {connect} from 'react-redux';
import AppActions from '@redux/AppRedux';
import styles from './Styles/NewWelcomeScreenStyles';
import Img from '../Images/png/babyWelcome.png';
import UserActions from '@redux/UserRedux';
import { setI18nConfigBasedOnUserLocale } from '../I18n/I18n';
import RNUserDefaults from 'rn-user-defaults';
import KeyUtils from "@utils/KeyUtils";
import {Colors} from '@resources';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class NewWelcomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
          name:props.navigation.state.params.name?props.navigation.state.params.name:'',
          isLoading: false
        };
        this.themeSelected=this.props.themeSelected  && this.props.themeSelected
        this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    }

    async componentDidMount() {
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      this.setState({isLoading:true})
      this.props.getUserProfile();
      RNUserDefaults.clear(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN);
      await analytics.logScreenView('new_welcome_screen')
    }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {userProfileSuccess, userProfileFailure, userProfile, getUserProfile} = this.props
    if (userProfileSuccess != prevProps.userProfileSuccess && userProfileSuccess && prevState.isLoading) {
      const {name} = userProfile.mother
      this.setState({isLoading: false, name})
    }

    if (userProfileFailure != prevProps.userProfileFailure && userProfileFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
  }

  render() {
      const{name} = this.state
        return (
          <>
            <SafeAreaView/>
            <View style={styles.container}>
                <Text style={[styles.title,{color:this.textColor}]}>{I18n.t('newWelcome.title')+name +'!'}</Text>
                <Text style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('newWelcome.subTitle')}</Text>
                <Text style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('newWelcome.subTitle2')}</Text>
                <Text style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('newWelcome.subTitle3')}</Text>
                <Text style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('newWelcome.subTitle4')}</Text>
                <View style={styles.imageContainer}>
                    <Image source={Img} style={styles.imageStyle}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title={I18n.t('welcome.dashboardBtn')}
                        onPress={this.onFinishPress}
                        style={styles.button}
                    />
                </View>
            </View>
          </>
        );
    }

  onFinishPress = async () => {
        let resp=await setI18nConfigBasedOnUserLocale(this.props.userProfile.mother,this.props.remoteConfig.markets,this.props.signInSuccess);
        resp===true&&this.props.signInSuccess()
    };
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  remoteConfig:state.remoteConfig,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
    signInSuccess: () => dispatch(AppActions.signInSuccess()),
    getUserProfile: () => dispatch(UserActions.getUserProfile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewWelcomeScreen);
