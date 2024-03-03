import React, {Component} from 'react';
import {ScrollView, Text, TextInput, View, Switch, SafeAreaView,findNodeHandle} from 'react-native';
import Button from '@components/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import I18n from '@i18n';
import {connect} from 'react-redux';
import UserActions from '@redux/UserRedux';
import AppActions from '@redux/AppRedux'
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import moment from "moment";
import styles from './Styles/PumpSetupScreenStyles';
import RadioGroup from 'react-native-custom-radio-group';
import HeaderPumpSetup from '@components/HeaderPumpSetup';
import {countryCode} from "@utils/locale";
import {Colors} from '@resources';
import { BackHandler , Platform} from 'react-native';
import { Analytics } from '@services/Firebase';

class PumpSetupScreen extends Component {

  constructor(props) {
    havePump = [{
      label: I18n.t('profileSetup2.yes'),
      value: 'yes',
    }, {
      label: I18n.t('profileSetup2.no'),
      value: 'no',
    }];
    pumpBrand = [{
      label: I18n.t('profileSetup2.medela'),
      value: 'Medela',
    }, {
      label: I18n.t('profileSetup2.other'),
      value: 'Other',
    }];
    pumpFor = [{
      label: I18n.t('profileSetup2.thisPregnancy'),
      value: 'thisPregnancy',
    }, {
      label: I18n.t('profileSetup2.previousPregnancy'),
      value: 'prePregnancy',
    }];
    insurance = [{
      label: I18n.t('profileSetup2.coveredByMyInsurance'),
      value: 'my_insurance',
    }, {
      label: I18n.t('profileSetup2.notPurchasedInsurance'),
      value: 'not_purchased',
    }];
    super(props);
    const {loadUserProfile} = this.props.navigation.state.params
    this.state = {
      isLoading: false,
      isUserProfileLoading:loadUserProfile==true,
      username: '',
      password: '',
      showAllQuestions: false,
      switchValue: false,
      pumpSelected:false,
      pumpBrandSelected:false,
      insurancePump:false,
      pumpUsage:false,
      isValidate:false,
      isPumpBrandSelected:'',
      showPumpUsageQues:'',
      showInsQues:'',
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.showSkip = props.navigation.state.params.market!==KeyUtils.US_MARKET

    this.pumpData = {
      hasPump: false
    }
    this.havePump = [{
      label: I18n.t('profileSetup2.yes'),
      value: 'yes',
    }, {
      label: I18n.t('profileSetup2.no'),
      value: 'no',
    }];
    this.pumpBrand = [{
      label: I18n.t('profileSetup2.medela'),
      value: 'Medela',
    }, {
      label: I18n.t('profileSetup2.other'),
      value: 'Other',
    }];
    this.pumpFor = [{
      label: I18n.t('profileSetup2.thisPregnancy'),
      value: 'thisPregnancy',
    }, {
      label: I18n.t('profileSetup2.previousPregnancy'),
      value: 'prePregnancy',
    }];
    this.insurance = [{
      label: I18n.t('profileSetup2.coveredByMyInsurance'),
      value: 'my_insurance',
    }, {
      label: I18n.t('profileSetup2.notPurchasedInsurance'),
      value: 'not_purchased',
    }];
  }
  async componentDidMount() {
    const {getUserProfile}=this.props;
    const {loadUserProfile} = this.props.navigation.state.params;
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    if(loadUserProfile==true){
      getUserProfile()
    }
    let analytics = new Analytics()
    await analytics.logScreenView('pump_setup_screen')
  }
  componentWillUnmount() {
    if (Platform.OS === 'android'){
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
  }

  onBackPress = () => {
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    const {isPumpQuestionSuccess, isPumpQuestionFailure,optedState,signInSuccess,userProfileSuccess,userProfileFailure,userProfile} = this.props;

    if ((prevProps.isPumpQuestionFailure != isPumpQuestionFailure) && isPumpQuestionFailure && prevState.isLoading) {
      this.setState({
        isLoading: false
      });
    }
    if ((prevProps.isPumpQuestionSuccess != isPumpQuestionSuccess) && isPumpQuestionSuccess && prevState.isLoading) {
      this.setState({
        isLoading: false
      });
      AsyncStorage.setItem(KeyUtils.CP_NOTIFICATION_FIREDATE, moment().add(2, 'days').format('YYYY-MM-DD'));
      optedState({state:'initial',value:false,market:null});
      signInSuccess();
      //this.props.navigation.navigate('WelcomeScreen');

    }
    if(prevProps.userProfileSuccess != userProfileSuccess&& userProfileSuccess &&  prevState.isUserProfileLoading  ){
      if(userProfile.mother.hasOwnProperty('hasPump')){
        optedState({state:'initial',value:false,market:null});
        signInSuccess();
      }
      this.setState({isUserProfileLoading:false});
    }
    if(prevProps.userProfileFailure != userProfileFailure && userProfileFailure &&  prevState.isUserProfileLoading ){
      this.setState({isUserProfileLoading:false});
      console.log('userProfile API failure');
    }
  }


  toggleSwitch = (value) => {
    //onValueChange of the switch this function will be called
    this.setState({switchValue: value});
    //state changes according to switch
    //which will result in re-render the text
  };
  showAll = (value) => {
    if (value === 'yes') {
      this.setState({showAllQuestions: true,pumpSelected:value === 'yes', isValidate:false});
    } else {
      this.setState({showAllQuestions: false,pumpSelected:value === 'yes', isValidate:true, showPumpUsageQues:'',
        showInsQues:'',});
    }
  };

  renderTwoIndicator(){
    return <View style={styles.indicatorView}>
      <View style={styles.indicatorInactive}/>
      <View style={styles.indicatorActive}/>
    </View>
  }

  renderThreeIndicator(){
    return <View style={styles.indicatorView}>
      <View style={styles.indicatorInactive}/>
      <View style={styles.indicatorInactive}/>
      <View style={styles.indicatorActive}/>
    </View>
  }

  renderBottomView() {
    const {isValidate}=this.state
    const{themeSelected}=this.props
    const {market} = this.props.navigation.state.params
    let bottomViewColor = Colors.white
    themeSelected === "dark" && (bottomViewColor= Colors.rgb_000000)
    return <View style={[styles.bottomViewStyle, {backgroundColor: bottomViewColor}]}>
      {/*<View style={styles.indicatorView}>*/}
      {/*  <View style={styles.indicatorInactive}/>*/}
      {/*  <View style={styles.indicatorActive}/>*/}
      {/*</View>*/}
      {/* {market!==KeyUtils.US_MARKET ? this.renderTwoIndicator() : this.renderThreeIndicator()} */}
      {market==KeyUtils.US_MARKET ? this.renderTwoIndicator() : <></>}
      <Button
        //(!insurancePump ||  !pumpBrandSelected || !pumpSelected)
        disabled={!isValidate }
        title={I18n.t('profileSetup2.finishBtn')}
        onPress={this.onRegisterPress}
        style={styles.buttonContainer}
      />
    </View>
  }

  pumpBrandChange = (value) => {
    this.setState({pumpBrandSelected:value === 'Medela', isPumpBrandSelected:'added', showPumpUsageQues:'show'})
  };

  renderPumpFor(){
    const{themeSelected}=this.props

    let inactiveRadioButtonColor = Colors.rgb_f5f5f5
    let activeTextColor = Colors.white
    if(themeSelected==="dark"){
      inactiveRadioButtonColor = Colors.rgb_373838
      activeTextColor = Colors.rgb_000000
    }
    return(
      <View>
        <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('profileSetup2.pumpFor')}</Text>

        <RadioGroup
          buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
          buttonContainerActiveStyle={styles.radioBtnActive}
          buttonContainerStyle={styles.radioBtnContainerV}
          buttonTextActiveStyle={[styles.radioBtnTextActive, {color: activeTextColor}]}
          buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:this.textColor}]}
          containerStyle={styles.radioGroupStyle}
          onChange={(value)=>{
            this.setState({pumpUsage:value === 'thisPregnancy', showInsQues:'show',isValidate:(value != 'thisPregnancy')},()=>{
              const {showInsQues,pumpUsage}=this.state;
              if(showInsQues !== '' && countryCode() ==='US' && pumpUsage){
                this.setState({isValidate:false})
              }else{
                this.setState({isValidate:true})
              }
              if(this.insQuestionViewRef!=null&&this.insQuestionViewRef!=undefined){
                this.insQuestionViewRef.measureLayout(
                  findNodeHandle(this.scrollViewRef),
                  (x, y) => {
                    this.scrollViewRef.scrollTo({x: 0, y: y, animated: true});
                  }
                );
              }
            })

          }}
          radioGroupList={this.pumpFor}/>
      </View>
    )
  }

  renderPumpIns(){
    const{themeSelected}=this.props
    let inactiveRadioButtonColor = Colors.rgb_f5f5f5
    let activeTextColor = Colors.white
    if(themeSelected==="dark"){
      inactiveRadioButtonColor = Colors.rgb_373838
      activeTextColor = Colors.rgb_000000
    }
    return(
      <View ref={(element)=>{this.insQuestionViewRef=element}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('profileSetup2.insurancePump')}</Text>

        <RadioGroup
          buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
          buttonContainerActiveStyle={styles.radioBtnActive}
          buttonContainerStyle={styles.radioBtnContainerV}
          buttonTextActiveStyle={[styles.radioBtnTextActive, {color: activeTextColor}]}
          buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:this.textColor}]}
          containerStyle={styles.radioGroupStyle}
          onChange={(value)=>{
            this.setState({insurancePump:value === 'my_insurance',isValidate:true})
          }}
          radioGroupList={this.insurance}/>
      </View>
    )
  }

  setScrollViewRef = (element) => {
    this.scrollViewRef = element;
  };
  render() {
    const {username, password, isLoading, showPumpUsageQues, showInsQues, pumpUsage,isUserProfileLoading} = this.state;
    const{themeSelected}=this.props

    let inactiveRadioButtonColor = Colors.rgb_f5f5f5
    let activeTextColor = Colors.white
    if(themeSelected==="dark"){
      inactiveRadioButtonColor = Colors.rgb_373838
      activeTextColor = Colors.rgb_000000
    }
    if(isUserProfileLoading===true){
      return <LoadingSpinner/>
    }else return (
      <SafeAreaView style={{flex:1}}>
        <HeaderPumpSetup
          // onBackPress={()=>this.props.navigation.goBack()}
          style={{ transform: [{ scale: 0 }] }}
          //showSkip={this.showSkip}
          onSkipPress={()=>this.props.navigation.navigate('WelcomeScreen')} />
        <ScrollView contentContainerStyle={{flexGrow: 1}} ref={this.setScrollViewRef}>
          <View style={styles.container}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:this.textColor}]}>{I18n.t('profileSetup2.title')}</Text>


            <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('profileSetup2.havePump')}</Text>

            <RadioGroup
              buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
              buttonContainerActiveStyle={styles.radioBtnActive}
              buttonContainerStyle={styles.radioBtnContainer}
              buttonTextActiveStyle={[styles.radioBtnTextActive, {color: activeTextColor}]}
              buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:this.textColor}]}
              onChange={this.showAll}
              radioGroupList={this.havePump}/>


            {this.state.showAllQuestions ?
              <View>
                <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('profileSetup2.pumpBrand')}</Text>

                <RadioGroup
                  buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
                  buttonContainerActiveStyle={styles.radioBtnActive}
                  buttonContainerStyle={styles.radioBtnContainer}
                  buttonTextActiveStyle={[styles.radioBtnTextActive, {color: activeTextColor}]}
                  buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:this.textColor}]}
                  onChange={this.pumpBrandChange}
                  radioGroupList={this.pumpBrand}/>


                {showPumpUsageQues !== '' && this.renderPumpFor()}

                {showInsQues !== '' && countryCode() ==='US' && pumpUsage && this.renderPumpIns()}

              </View> : null}
          </View>
        </ScrollView>
        {this.renderBottomView()}
        {isLoading && <LoadingSpinner/>}

      </SafeAreaView>
    );
  }

  onRegisterPress = () => {
    this.setState({isLoading: true});
    const {pumpSelected, pumpBrandSelected, insurancePump, pumpUsage,isValidate,isPumpBrandSelected, showPumpUsageQues, showInsQues} = this.state

    if(countryCode() =='US') {
      if (pumpSelected) {
        this.pumpData.hasPump = pumpSelected
        this.pumpData['isMedela'] = pumpBrandSelected
        this.pumpData['thisPregnancy'] = pumpUsage
        this.pumpData['insuranceCovered'] = insurancePump
      } else {
        this.pumpData.hasPump = pumpSelected
      }
    }else{
      if (pumpSelected) {
        this.pumpData.hasPump = pumpSelected
        if(isPumpBrandSelected!=='') {
          this.pumpData['isMedela'] = pumpBrandSelected
        }
        if(showPumpUsageQues!=='') {
          this.pumpData['thisPregnancy'] = pumpUsage
        }
        if(showInsQues!=='') {
          this.pumpData['insuranceCovered'] = insurancePump
        }
      } else {
        this.pumpData.hasPump = pumpSelected
      }
    }

    this.props.pumpQuestion(this.pumpData);
  };
}

const mapStateToProps = (state) => ({
  isPumpQuestionSuccess: state.user.isPumpQuestionSuccess,
  isPumpQuestionFailure: state.user.isPumpQuestionFailure,
  themeSelected: state.app.themeSelected,
  userProfileSuccess:state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = (dispatch) => ({
  pumpQuestion: (data) => dispatch(UserActions.pumpQuestion(data)),
  optedState: (keys) => dispatch(AppActions.optedState(keys)),
  signInSuccess: () => dispatch(AppActions.signInSuccess()),
  getUserProfile: () => dispatch(UserActions.getUserProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(PumpSetupScreen);
