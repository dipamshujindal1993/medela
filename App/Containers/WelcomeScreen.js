import React, {Component} from 'react';
import {Text, ImageBackground} from 'react-native';
import Button from '@components/Button';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '@i18n';
import {connect} from 'react-redux';
import AppActions from '@redux/AppRedux';
import styles from './Styles/WelcomeScreenStyles';
import Img from '../Images/welcome_bg.jpg';
import UserActions from '@redux/UserRedux';
import { clearPrevLocaleConfigAtRegistration, setI18nConfigBasedOnUserLocale } from '../I18n/I18n';
import {Colors} from '@resources';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class WelcomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
          name:'',
          isLoading: false
        };
    }

    async componentDidMount() {
      this.setState({isLoading:true})
      this.props.getUserProfile()
      await analytics.logScreenView('welcome_screen')
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
            <ImageBackground source={Img} style={styles.container}>
                <LinearGradient style={{width:'100%', height:'60%'}}
                                colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']} >
                <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:Colors.rgb_000000}]}>{I18n.t('welcome.title')+name}</Text>
                <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:Colors.rgb_000000}]}>{I18n.t('welcome.subTitle')}</Text>


                </LinearGradient>


                <Button
                    title={I18n.t('welcome.dashboardBtn')}
                    onPress={this.onFinishPress}
                    style={styles.buttonContainer}
                />
            </ImageBackground>
        );
    }

  onFinishPress = async () => {
        const{userProfile,optedState,remoteConfigs,signInSuccess} =this.props;
        const {market,incompleteOptIn}=userProfile.mother;
        await clearPrevLocaleConfigAtRegistration();
        let resp=await setI18nConfigBasedOnUserLocale(userProfile.mother,remoteConfigs.markets,signInSuccess);
        console.log('setI18nConfigBasedOnUserLocale complete called')
        resp===true&&signInSuccess()
        optedState({state:'first',value:!incompleteOptIn,market})
        console.log('signInSuccess complete called')
    };
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  remoteConfigs:state.remoteConfig,
});

const mapDispatchToProps = (dispatch) => ({
    optedState: (keys) => dispatch(AppActions.optedState(keys)),
    signInSuccess: () => dispatch(AppActions.signInSuccess()),
    getUserProfile: () => dispatch(UserActions.getUserProfile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
