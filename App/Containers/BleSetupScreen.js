
import React, {Component} from 'react';
import {Text, PermissionsAndroid, Dimensions, Platform, Alert} from 'react-native';
import Button from '@components/Button';
import I18n from '@i18n';
import {connect} from 'react-redux';
import styles from './Styles/BluetoothScanScreenStyles';
import {BleManager} from 'react-native-ble-plx';
import {View} from "react-native-animatable";
import Bluetooth from '@svg/ic_bluetooth.svg';
import HeaderTitle from '@components/HeaderTitle';
import {WaveIndicator} from 'react-native-indicators';
import {
  checkMultiple,
  openSettings, PERMISSIONS, requestMultiple, RESULTS,
} from 'react-native-permissions'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import BleDManager from "./BleDManager";
import GetterSetter from "../Components/GetterSetter";
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "@services/NavigationService";
import KeyUtils from "@utils/KeyUtils";
import {Colors} from '@resources';
import {openPermissionAlert} from '@utils/TextUtils'
import DeviceInfo from "react-native-device-info";
import { Analytics } from '@services/Firebase';
import Dialog from '@components/Dialog';

let analytics = new Analytics()

const {width} = Dimensions.get("window")

const permissionsGreaterThan30 = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
]

const permissionsLessThan31 = [
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
]

class BleSetupScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isBluetoothActive: false,
      isLocationServiceEnable: false,
      showBTDialog: 'true',
      prePermissionPopup:false,
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.subscription = null
    this.manager  = BleDManager.getBleManagerInstance();
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    const {navigation, pumps}=this.props

    this.subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        this.setState({isBluetoothActive: true})
      } else {
        this.setState({isBluetoothActive: false})
      }
    }, true);

    navigation.addListener('didFocus', async () => {
      if (Platform.OS == 'android') {
        await this.checkPermissions()
      }
    })
    await analytics.logScreenView('ble_setup_screen')
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}})
  }

  componentWillUnmount(){
    if(this.subscription != null){
    this.subscription.remove()
    }
  }

  async checkPermissions(){
    if (Platform.OS === 'android') {
      let checkPermission = await this._checkLocationPermission()
      if(checkPermission!='true'){
        this._requestLocationPermission()
      }    
    }
    else{
     // if(!await this._checkIosBLEPermission()){
        this.setState({prePermissionPopup:true})
     // }
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
  


  renderBottomView() {
    const {isBluetoothActive,isLocationServiceEnable} = this.state
    return <View style={styles.bottomViewStyle}>
      <View style={styles.indicatorView}>
        <View style={styles.indicatorActive}/>
        <View style={styles.indicatorInactive}/>
        <View style={styles.indicatorInactive}/>
      </View>
      <Button
        title={isBluetoothActive ? I18n.t('bluetooth.continue').toUpperCase() : I18n.t('bluetooth.turn_on').toUpperCase()}
        onPress={this.onContinuePress}
        disabled={(!isBluetoothActive)}
        style={styles.buttonContainer}
      />
    </View>
  }

  _handleBack=()=>{
    const {navigation}=this.props
    if(GetterSetter.getParentScreen()==='vip'){
      NavigationService.popToTopStack()
      NavigationService.navigate('VipPackScreen')
    }else {
      navigation.popToTop()
      AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName) => {
        if (tabName != null) {
          NavigationService.navigate(tabName)
        } else {
          NavigationService.navigate('Baby')
        }
      })
    }
  }

  onAndroidBackPress = () => {
    this._handleBack()
    return true;
  }
 
  render() {
    const {navigation} = this.props
    return (
      <View style={styles.mainViewStyle}>
        <HeaderTitle title={I18n.t('bluetooth.header_title')} onBackPress={() => this._handleBack()}/>
        <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.to_connect_pump')}</Text>
        <View style={styles.container}>
          <WaveIndicator color='rgba(137, 141, 141, 0.3)' size={width}/>
          <Bluetooth width={30} height={30} style={styles.imgStyle}/>
        </View>
        {this.renderBottomView()}
      </View>
    );
  }

  onContinuePress = () => {
    const {navigation} = this.props
    navigation.navigate('BleDevicesListScreen')
  };
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,
  pumps: state.home.pumps,
  isPumpListSuccess: state.home.isPumpListSuccess,
  isPumpListFailure: state.home.isPumpListFailure,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BleSetupScreen);