import React, {Component} from 'react';
import {Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import Button from '@components/Button';
import I18n from '@i18n';
import {connect} from 'react-redux';
import styles from './Styles/BluetoothPairingScreenStyles';
import {BleManager} from 'react-native-ble-plx';
import {View} from "react-native-animatable";
import Error from '@svg/ic_error.svg';
import HeaderTitle from '@components/HeaderTitle';
import {WaveIndicator} from 'react-native-indicators';
import { Colors } from '@resources'
import KeyUtils from "@utils/KeyUtils";
import BleDManager from "./BleDManager";
import AppActions from "@redux/AppRedux";
import HomeActions from "@redux/HomeRedux";
import GetterSetter from "../Components/GetterSetter";
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "@services/NavigationService";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

const {width} = Dimensions.get("window")

class BlePairingScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      barSize: '1%',
      isDeviceConnectionError: false,
      isConnected: false,
    };
    this.selectedTypePump = props.navigation.getParam('name', '')
    this.manager = BleDManager.getBleManagerInstance()
    this.subscription = null
    this.availableMedeleDevice = []
    this.isBluetoothActive = false
    this.deviceId = ''
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const {bleDeviceId} = this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.subscription = this.manager.onStateChange((state) => {
      this.isBluetoothActive = state === 'PoweredOn';
    }, true);
    this.subscription = this.manager.state().then((state) => {
      this.isBluetoothActive = state === 'PoweredOn';
      this.startScanning()
    });
    await analytics.logScreenView('ble_pairing_screen')
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {bleDeviceId} = this.props
    if (bleDeviceId && bleDeviceId != prevProps.bleDeviceId) {
      console.log('deviceId --------- ', bleDeviceId)
      this.deviceId = bleDeviceId
    }
  }

  componentWillUnmount(){
    this.manager.stopDeviceScan();
    clearInterval(this.uiInterval)
    // this.subscription.remove()
  }

  startScanning() {
    let v = 1, size = ''
    this.uiInterval = setInterval(() => {
      v = v + 1
      size = v + '%'
      if (v <= 100) {
        this.setState({barSize: size})
      }else {
        this.isBluetoothActive && this.afterScanningDone()
      }

    }, 120) //10 sec
    this.isBluetoothActive && this.scanAndConnect();
  }

  afterScanningDone =() => {
    const {navigation} = this.props
    clearInterval(this.uiInterval)
    this.manager.stopDeviceScan();
    if(this.availableMedeleDevice.length==0){
      this.setState({isDeviceConnectionError: true, isConnected: false})
    }
    else{
      const distinctArray = []
      this.availableMedeleDevice.forEach(obj => {
        if(obj.localName !== '' || obj.localName !== null) {
          if (!distinctArray.some(item => item.localName === obj.localName)) {
            distinctArray.push({...obj})
          }
        }
      });
      setTimeout(()=>{
        if(distinctArray.length>1){
          navigation.navigate('BleScannedDevicesList', {'device': distinctArray, 'name': this.selectedTypePump})
        }
        else if(distinctArray.length===1){
          navigation.navigate('BleConfirmationScreen', {'device': distinctArray[0], 'name': this.selectedTypePump, manager: this.manager})
        }
        this.setState({isConnected: true})
      },1000)
    }
  }

  scanAndConnect() {
    this.manager.startDeviceScan([KeyUtils.MEDELA_PUMP_SERVICE_UUID_OLD, KeyUtils.MEDELA_PUMP_SERVICE_UUID], { allowDuplicates: false }, (error, device) => {
      if(error!=null) {
        console.log("BlePairingScreen Error = ",error)
      }
      let deviceName = device && device.name
      if (deviceName &&
          (device.name.toLowerCase().replace(/ /g,"").includes(this.selectedTypePump.toLowerCase().replace(/ /g,""))
           || this.selectedTypePump.toLowerCase().includes(device.name.toLowerCase()))) {
        this.props.getBleDeviceId(device.id)
        if(device.localName!== null) {
          this.availableMedeleDevice.push(device)
        }
      }
    });
  }

  renderBottomView() {
    const { barSize } = this.state
    return <View style={styles.bottomViewStyle}>
      <View style={styles.indicatorView}>
        <View style={styles.indicatorInactive}/>
        <View style={styles.indicatorInactive}/>
        <View style={styles.indicatorActive}/>
      </View>

      <View style={styles.progressBarView}>
        <View style={[styles.progressSlider, {width: `${barSize}`}]}/>
        <Text maxFontSizeMultiplier={1.7}
          style={styles.progressTextStyle}>{I18n.t('bluetooth.searching').toUpperCase()}</Text>
      </View>
    </View>
  }

  renderSearchView = () => {
    const {navigation} = this.props
    return (
      <View style={styles.mainViewStyle}>
        <Text maxFontSizeMultiplier={1.7}
          style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.searching_message')}</Text>
        <View style={styles.container}>
          <WaveIndicator color={Colors.rgb_898d8d_4} size={width-100}/>
          {/* <Image
            style={{position: 'absolute'}}
            source={navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_pair.png') : require('../Images/png/flex_pair.png')}/> */}
        </View>
        {this.renderBottomView()}
      </View>
    )
  }

  getSteps(){
    if (this.selectedTypePump.toLowerCase().includes('maxi')){
      return <Text maxFontSizeMultiplier={1.7}
                   style={[styles.stepsTitle,{color:this.textColor}]}>{I18n.t('bluetooth.bluetooth_turned_on_steps_swing_maxi')}</Text>
    }else if (this.selectedTypePump.toLowerCase().includes('flex')){
      return <Text maxFontSizeMultiplier={1.7}
                   style={[styles.stepsTitle,{color:this.textColor}]}>{I18n.t('bluetooth.bluetooth_turned_on_steps_flex')}</Text>
    }else{
      return <Text maxFontSizeMultiplier={1.7}
                   style={[styles.stepsTitle,{color:this.textColor}]}>{I18n.t('bluetooth.bluetooth_turned_on_steps')}</Text>
    }
  }

  renderErrorView = () => {
    const {navigation} = this.props

    return (
      <View style={styles.childViewStyle}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.no_pump_found')}</Text>
        <Text maxFontSizeMultiplier={1.7} style={[styles.stepsTitle,{color:this.textColor}]}>{I18n.t('bluetooth.make_sure_bluetooth_on')}</Text>
        {this.getSteps()}

        <View style={styles.container}>
          <WaveIndicator color={Colors.rgb_e73536} size={width-100}/>
          <Error style={{position: 'absolute'}}/>
        </View>
        <View style={styles.bottomViewErrorStyle}>
        <Button
          title={I18n.t('bluetooth.search_again').toUpperCase()}
          onPress={this.onSearchPress}
          style={styles.buttonContainer}
        />
        </View>
      </View>
    )
  }

  onSearchPress = () => {
    this.setState({isDeviceConnectionError: false})
    this.startScanning()
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
    const {isDeviceConnectionError} = this.state
    const { navigation } = this.props
    return (
      <View style={{flex:1}}>
        <HeaderTitle title={I18n.t('bluetooth.header_title')} onBackPress={() => this._handleBack()}/>
        {isDeviceConnectionError ? this.renderErrorView() : this.renderSearchView()}
      </View>

    );
  }
}

const mapStateToProps = (state) => ({
  bleDeviceId: state.app.bleDeviceId,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
  getBleDeviceId: (id) => dispatch(AppActions.getBleDeviceId(id)),
  newPumpAdded: (data) => dispatch(HomeActions.newPumpAdded(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlePairingScreen);
