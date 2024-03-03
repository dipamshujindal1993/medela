import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Linking} from 'react-native';
import {connect} from 'react-redux';
import UserActions from '@redux/UserRedux';
import HeaderTitle from '@components/HeaderTitle';
import I18n from '@i18n';
import styles from './Styles/MeasurementsStyles';
import SwitchOnIcon from '@svg/ic_switch_on';
import SwitchOffIcon from '@svg/ic_switch_off';
import AsyncStorage from '@react-native-community/async-storage';
import KeyUtils from '@utils/KeyUtils';
import {getRealmDb, saveMotherProfile} from '../Database/AddBabyDatabase';
import LoadingSpinner from '../Components/LoadingSpinner';
import { BackHandler , Platform} from 'react-native';
import {Colors} from '@resources';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class Measurements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unit: KeyUtils.UNIT_IMPERIAL,
    };
    this.onBackPress = this.onBackPress.bind(this);
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    let realmDb=await getRealmDb()
    this.setState({realmDb})
    let userMotherProfile = realmDb.objects('UserMotherProfile')
    console.log('userMotherProfile--->>>',JSON.stringify(userMotherProfile))
    if(userMotherProfile.length>0){
      this.setState({motherProfile:userMotherProfile[0]})
    }
    AsyncStorage.getItem(KeyUtils.UNITS).then(value => {
      if (value != null) {
        this.setState({unit: value});
      }
    });
    await analytics.logScreenView('measurements_screen')
  }
  onBackPress(){
    this._handleBackPress();
    return true;
  }
  componentWillUnmount() {
    if (Platform.OS === 'android'){
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {isProfile,isProfileError,navigation} = this.props;
    if (isProfile != prevProps.isProfile && isProfile && prevState.isLoading) {
      AsyncStorage.setItem(KeyUtils.UNITS, this.state.unit);
      this.setState({isLoading: false})
      let profile = this.state.realmDb.objects('UserMotherProfile');
      let userProfile = JSON.parse(JSON.stringify(profile))
      let mP=userProfile[0]
      mP.mother.units=this.state.unit
      mP.isSync=true
      saveMotherProfile(this.state.realmDb, mP).then(r => {
      })
      navigation.goBack()
    }

    if (isProfileError != prevProps.isProfileError && isProfileError && prevState.isLoading) {
      this.setState({isLoading: false})
    }
  }

  onPressHandler = (value) => {
    this.setState({unit: value});
  };

  _handleBackPress=()=>{
    const {navigation} = this.props;
    const {unit,motherProfile}=this.state
    if (unit!=motherProfile.mother.units){
      this._updateProfile()
    }else{
      navigation.goBack()
    }
  }

  _updateProfile(){
    const {addProfile}=this.props
    const {unit,motherProfile}=this.state
    let profile=JSON.parse(JSON.stringify(motherProfile))
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
    profile.mother.units=unit
    this.setState({isLoading:true})
    addProfile({profile})
  }
  render() {
    const {isLoading,unit}=this.state
    return (
      <View style={styles.container}>
        <HeaderTitle title={I18n.t('measurements.header_title')} onBackPress={() => this._handleBackPress()}/>
        {isLoading && <LoadingSpinner/>}
        <View style={styles.contentView}>
          <View style={styles.headerContentViewStyles}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.headerTitleStyle,{color:this.textColor}]}>{I18n.t('measurements.header_text')}</Text>
          </View>
          <View style={styles.measurementInnerViewStyle}>
            <View style={styles.measurementTitleViewStyle}>
              <View style={{flex: 3}}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.measurementTitleStyles,{color:this.textColor}]}>{I18n.t('measurements.standard_title')}</Text>
              </View>
              <TouchableOpacity
                accessibilityLabel={I18n.t("accessibility_labels.standard_checkbox")}
                accessible={true}
                style={styles.measurementToggleViewStyle}
                onPress={() => this.onPressHandler(KeyUtils.UNIT_IMPERIAL)}
              >
                {unit === KeyUtils.UNIT_IMPERIAL ?
                  <SwitchOnIcon width={44} height={44}/> :
                  <SwitchOffIcon width={44} height={44}/>
                }

              </TouchableOpacity>
            </View>
            <View style={styles.measurementInnerViewStyle}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.measurementInfoStyles,{color:this.textColor}]}>{I18n.t('measurements.standard_info_title')}</Text>
            </View>
          </View>
          <View style={styles.measurementInnerViewStyle}>
            <View style={styles.measurementTitleViewStyle}>
              <View style={{flex: 3}}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.measurementTitleStyles,{color:this.textColor}]}>{I18n.t('measurements.metric_title')}</Text>
              </View>
              <TouchableOpacity
                accessibilityLabel={I18n.t("accessibility_labels.metric_checkbox")}
                accessible={true}
                style={styles.measurementToggleViewStyle}
                onPress={() => this.onPressHandler(KeyUtils.UNIT_METRICAL)}
              >
                {unit === KeyUtils.UNIT_METRICAL ?
                  <SwitchOnIcon width={44} height={44}/> :
                  <SwitchOffIcon width={44} height={44}/>
                }
              </TouchableOpacity>
            </View>
            <View style={styles.measurementInnerViewStyle}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.measurementInfoStyles,{color:this.textColor}]}>{I18n.t('measurements.metric_info_title')}</Text>
            </View>
          </View>
          <View style={{flex: 5}}/>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  isProfile: state.user.isProfile,
  isProfileError: state.user.isProfileError,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  addProfile: (profile) => dispatch(UserActions.addProfile(profile.profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Measurements);
