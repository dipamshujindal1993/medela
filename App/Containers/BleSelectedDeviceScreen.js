import React, {Component} from 'react';
import {Text, Dimensions, Image} from 'react-native';
import Button from '@components/Button';
import I18n from '@i18n';
import {connect} from 'react-redux';
import styles from './Styles/BluetoothScanScreenStyles';
import {View} from "react-native-animatable";
import HeaderTitle from '@components/HeaderTitle';
import BleDManager from "./BleDManager";
import HomeActions from '@redux/HomeRedux';
import NavigationService from "@services/NavigationService";
import GetterSetter from "../Components/GetterSetter";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {Colors} from '@resources';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BleSelectedDeviceScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isBluetoothActive: false,
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.manager = BleDManager.getBleManagerInstance()

  }

  async componentDidMount() {
    const {bleDeviceId, stopAllIntervals, pumps} = this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.manager.state().then((state)=>{
      this.isBluetoothActive = state === 'PoweredOn'
        if (pumps && pumps.pumps.length>0 && bleDeviceId !== null) {
          stopAllIntervals(true)
          try {
            this.isBluetoothActive && pumps && pumps.pumps.length > 0 && bleDeviceId !== undefined && this.manager.isDeviceConnected(bleDeviceId)
              .then((connection) => {
                if (connection) {
                  try {
                    this.manager.cancelDeviceConnection(bleDeviceId)
                  } catch (e) {
                    console.log('ERROR back --- ', e)
                  }
                }
              });
          }catch (e){}
        }
    })
    await analytics.logScreenView('ble_selected_device_screen')
  }

  renderBottomView() {
    const {isBluetoothActive} = this.state
    return <View style={styles.bottomViewStyle}>
      <View style={styles.indicatorView}>
        <View style={styles.indicatorInactive}/>
        <View style={styles.indicatorActive}/>
        <View style={styles.indicatorInactive}/>
      </View>
      <Button
        title={I18n.t('profileSetup.next').toUpperCase()}
        onPress={this.onNextPress}
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
    let imgValue = null
    if (navigation.getParam('name', '').toLowerCase().includes('sonata')){
      imgValue = require('../Images/png/ble_sonata.png')
    }else if (navigation.getParam('name', '').toLowerCase().includes('freestyleflex')){
      imgValue = require('../Images/png/ble_flex.png')
    }else if(navigation.getParam('name', '').toLowerCase().includes('maxi')){
      imgValue = require ('../Images/png/ble_maxi.png')
    }else{
      imgValue = require('../Images/png/ble_flex.png')
    }

    return (
      <View style={styles.mainViewStyle}>
        <HeaderTitle title={I18n.t('bluetooth.header_title')} onBackPress={() => this._handleBack()}/>
        {navigation.getParam('name', '').toLowerCase().includes('maxi') ? <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.plug_your_swing_pump')}</Text>:
          <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.plug_your_pump')}</Text>}
        <View style={styles.container}>
          <Image
            style={{width:'80%', height:'80%', resizeMode:'contain'}}
            source = {imgValue}/>
        </View>
        {this.renderBottomView()}
      </View>
    );
  }

  onNextPress = () => {
    const {navigation} = this.props
    navigation.navigate('BlePairingScreen', {
      name: navigation.getParam('name', '')
    })
  };
}

const mapStateToProps = (state) => ({
  bleDeviceId: state.app.bleDeviceId,
  pumps: state.home.pumps,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
  stopAllIntervals: (v) => dispatch(HomeActions.stopAllIntervals(v)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BleSelectedDeviceScreen);
