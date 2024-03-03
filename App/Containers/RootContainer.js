import React, { Component } from 'react'
import { SafeAreaView, StatusBar,Text,View,PanResponder,  PermissionsAndroid, Platform } from 'react-native'
import AppNavigation from '@navigation/AppNavigation'
import { connect } from 'react-redux'
import StartupActions from '@redux/StartupRedux'
import UserActions from '@redux/UserRedux';
import ReduxPersist from '@config/ReduxPersist'
import Styles from '../Navigation/Styles/NavigationStyles'
import {
  Colors
} from '@resources'
import AppStateHandler from "@components/AppStateHandler";
import I18n from "react-native-i18n";
import AppActions from '@redux/AppRedux';
import { DarkModeContext } from 'react-native-dark-mode';
import NotificationPopups from '@containers/NotificationPopups';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import SiriComponent from '../Components/SiriComponent'
import BleRootConnection from "@components/BleRootConnection";
import CookieManager from "@react-native-community/cookies";
import Dialog from '@components/Dialog';
import RemoteConfig from '@components/RemoteConfig';
import {PERMISSIONS, requestMultiple, checkMultiple, RESULTS,check} from "react-native-permissions";
import {openPermissionAlert} from '@utils/TextUtils'
import DeviceInfo from 'react-native-device-info'

const permissionsGreaterThan30 = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
]
const permissionsLessThan31 = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
]
const permissionsIos = [
  PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
]

class RootContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startLoader:false,
      showSiriValidationDialog:false,
      prePermissionPopup:false,
    }
    this._panResponder = {};
    this.timer = 0;
  }

  static contextType = DarkModeContext;
  async componentDidMount () {
    // if redux persist is not active fire startup action
    this.toDetectIdleState()
    if (!ReduxPersist.active) {
      this.props.startup()
    }
    if (!this.props.signedIn){
      CookieManager.clearAll().then(r => {
      })
    }
    let email=await AsyncStorage.getItem(KeyUtils.USER_LAST_EMAIL)
    let password=await  AsyncStorage.getItem(KeyUtils.USER_LAST_PASSWORD)
    if (email!=null && password!=null){
      this.props.loggedInUserInfo(email,password)
    }
    this.props.darkMode(this.context);
    await this.checkPermissions()
  }

  async checkPermissions(){
    if (Platform.OS === 'android') {
      let checkPermission = await this._checkLocationPermission()
      if(checkPermission==='false'){
        this.setState({prePermissionPopup:true})
      }    
    }
    else{
      let checkIOSPermission = await this._checkIosBLEPermission()
      if(checkIOSPermission==='false'){   
        this.setState({prePermissionPopup:true})
      }
    }
  }
  async _checkLocationPermission(){
    let isPermissionGranted = 'false';
    let permissions = [];
    if(DeviceInfo.getAPILevel()<31) {
      permissions = permissionsLessThan31;
    }else{
      permissions = permissionsGreaterThan30;
      }
    const statuses = await checkMultiple(permissions);
    for (let index in permissions) {
      if (statuses[permissions[index]] === RESULTS.GRANTED) {
        isPermissionGranted = 'true';
      }
      else if (statuses[permissions[index]] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || statuses[permissions[index]] == 'blocked')
      {
        isPermissionGranted = 'blocked';
        break;
      }
      else {
        isPermissionGranted = 'false';
        break;
      }
    }
    return isPermissionGranted;
  }

  async _checkIosBLEPermission(){
    let isPermissionGranted = false;
    let permissions = [];
    permissions=permissionsIos
    const statuses = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL, {type: 'whenInUse'});

      if (statuses === RESULTS.GRANTED) {
        isPermissionGranted = "true";
      }
      else if(statuses === RESULTS.BLOCKED) {
        isPermissionGranted = "blocked";
      }
      else if(statuses === RESULTS.DENIED){
        isPermissionGranted = "false";
      }
    return isPermissionGranted;
  }

  async _requestLocationPermission(){
    let isPermissionGranted = false;
    let permissions = [];
    if(DeviceInfo.getAPILevel()<31) {
      permissions = permissionsLessThan31;
    }else{
      permissions = permissionsGreaterThan30;
    }
    const statuses = await requestMultiple(permissions);
    for (let index in permissions) {
      if (statuses[permissions[index]] === RESULTS.GRANTED) {
        isPermissionGranted = true;
      } else if (statuses[permissions[index]] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || statuses[permissions[index]] == 'blocked')
      {
      openPermissionAlert();
      }
    
      else {
        isPermissionGranted = false;
        break;
      }
    }
    return isPermissionGranted;
  }

  async _requestIosBLEPermission(){
    let isPermissionGranted = false;
    let permissions = [];
    permissions=permissionsIos
    const statuses = await requestMultiple(permissions);
    for (let index in permissions) {
      if (statuses[permissions[index]] === RESULTS.GRANTED) {
        isPermissionGranted = true;
      } else if (statuses[permissions[index]] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || statuses[permissions[index]] == 'blocked')
      {
    //  openPermissionAlert();
      }
    
      else {
        isPermissionGranted = false;
        break;
      }
    }
    return isPermissionGranted;
  }

  toDetectIdleState=()=>{
    this._panResponder = PanResponder.create({

      onStartShouldSetPanResponder: () => {
        //console.log('onStartShouldSetPanResponder',Platform.OS)
        this.resetTimer()
        return false
      },
      onMoveShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => { 
        //console.log('onStartShouldSetPanResponderCapture',Platform.OS)
        this.resetTimer() ;
        return false
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    });
    this.timer = setTimeout(this.timeout,60000*10)
  }
  resetTimer(){
    clearTimeout(this.timer)
    this.timer = setTimeout(this.timeout,60000*10)
  }
  timeout=()=>{
    const {signedIn, isInternetAvailable,getUserProfile}=this.props;
    if(signedIn&&isInternetAvailable){
      //console.log('inactive',Platform.OS);
      getUserProfile();
    }
    this.resetTimer()
  }
  showDialog() {
    const { startLoader } = this.state
    return (
      <Dialog
        visible={startLoader}
        title={'Please wait your request is being processed'}
        isIcon={false}
      />
    )
  };

  startSiriLoader(interval){
    this.setState({startLoader:true})
    setTimeout(() => {this.setState({startLoader:false})
  }, interval)
 }

 siriValidationPopUp(title, subtitle) {
 if(title!=undefined){
    this.setState({showSiriValidationDialog:true,title:title,subtitle:subtitle})
    this.showSiriValidationPopUpDialog()
   }
  }

  showSiriValidationPopUpDialog(title, subtitle) {
    return (
      <Dialog
        visible={this.props.showSiriValidationDialog}
        title={this.state.title}
        message={this.state.subtitle}
        positive={I18n.t('voice_command.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({showSiriValidationDialog: false})
        }}
      />
    )
  }

   prePermissionDialog(){
    const {prePermissionPopup}=this.state;
    return  <Dialog
      visible={prePermissionPopup}
      title={I18n.t('bluetooth_pre_permissions.title')}
      message={Platform.OS === "ios" ?  I18n.t('bluetooth_pre_permissions.iOS_text') : I18n.t('bluetooth_pre_permissions.android_text')}
      positive={I18n.t('bluetooth_pre_permissions.button')}
      positiveOnPress={async () => {
        if (Platform.OS === 'android'){
        this.setState({prePermissionPopup:false});
        await this._requestLocationPermission()
      }
      
    else{
      this.setState({prePermissionPopup:false});
      await this._requestIosBLEPermission()
    }}}
      onDismiss={() => {
      }}
      />
  }

  render () {
    const {signedIn, isInternetAvailable}=this.props
    const {prePermissionPopup} =this.state
    const themeModeSelected = this.context;
    let statusBarColor = Colors.white
    let statusBarStyle = 'dark-content'
    themeModeSelected === 'dark' && (statusBarColor = Colors.rgb_000000, statusBarStyle = 'light-content')
    return (
      <View 
        style={{flex:1}}
        {...this._panResponder.panHandlers}
      >
        <StatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle}/>
        {signedIn && <SafeAreaView style={{backgroundColor: statusBarColor}}/>}
        <AppNavigation />
        <SiriComponent startSiriLoader={this.startSiriLoader.bind(this)} siriValidationPopUp={this.siriValidationPopUp.bind(this)} {...this.props}/>
        {signedIn && !isInternetAvailable && <Text maxFontSizeMultiplier={1.7} style={[Styles.offlineTextStyle,{color:Colors.rgb_000000}]}>{I18n.t('offline.offline_message')}</Text>}
        {signedIn && <BleRootConnection  navigation={this.props.navigation} />}
        {signedIn && <NotificationPopups />}
        {this.state.startLoader && this.showDialog()}
        {this.state.showSiriValidationDialog && this.showSiriValidationPopUpDialog()}
        <RemoteConfig/>
        <AppStateHandler/> 
        {prePermissionPopup && this.prePermissionDialog()}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  signedIn: state.app.signedIn,
  isInternetAvailable: state.app.isInternetAvailable,
  remoteConfig:state.remoteConfig,
})
// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  loggedInUserInfo: (username,password) => dispatch(AppActions.loggedInUserInfo(username,password)),
  darkMode: (themeModeSelected) => dispatch(AppActions.darkMode(themeModeSelected)),
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
})

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)