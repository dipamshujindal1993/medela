import React, {Component} from 'react';
import {Text, Dimensions, Image} from 'react-native';
import Button from '@components/Button';
import I18n from '@i18n';
import {connect} from 'react-redux';
import styles from './Styles/BluetoothPairingScreenStyles';
import {View} from "react-native-animatable";
import HeaderTitle from '@components/HeaderTitle';
import {WaveIndicator} from 'react-native-indicators';
import { Colors } from '@resources'
import KeyUtils from "@utils/KeyUtils";
import NavigationService from "@services/NavigationService";
import AsyncStorage from "@react-native-community/async-storage";
import GetterSetter from "../Components/GetterSetter";
const {width} = Dimensions.get("window")
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BleConfirmationScreen extends Component {

  constructor(props) {
    super(props);
    this.selectedPump = props.navigation.getParam('device', '')
    this.selectedTypePump = props.navigation.getParam('name', '')
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    await analytics.logScreenView('ble_confirmation_screen')
  }

  componentWillUnmount(){
  }

  renderView = () => {
    let imgValue = null;
    if (this.selectedTypePump.toLowerCase().includes('sonata')){
      imgValue = require('../Images/png/ble_sonata.png')
    }else if (this.selectedTypePump.toLowerCase().includes('freestyleflex')){
      imgValue = require('../Images/png/ble_flex.png')
    }else if(this.selectedTypePump.toLowerCase().includes('maxi')){
      imgValue = require ('../Images/png/ble_maxi.png')
    }else{
      imgValue = require('../Images/png/ble_flex.png')
    }

    let pumpName = null;
    if(this.selectedTypePump.toLowerCase().includes('sonata')){
      pumpName = 'Sonata'
    }else if(this.selectedTypePump.toLowerCase().includes('flex')){
      pumpName = 'Freestyle Flex'
    }else if(this.selectedTypePump.toLowerCase().includes('maxi')){
      pumpName = 'Swing Maxi'
    }else {
      pumpName = 'Freestyle Flex'
    }

    return (
      <View style={styles.childViewStyle}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.confirm_pump_found_sub_title').replace("{0}", pumpName)}</Text>
        <Text maxFontSizeMultiplier={1.7} style={[styles.stepsTitle,{color:this.textColor}]}>{I18n.t('bluetooth.confirm_pump_found_desc')}</Text>
        <View style={styles.container}>
          {/*<WaveIndicator color={Colors.rgb_898d8d_4} size={width - 100}/>*/}
          <Image
            style={{position: 'absolute'}}
            source={imgValue}/>
        </View>
        <View style={styles.bottomViewErrorStyle}>
        <Button
          title={I18n.t('bluetooth.confirm_cta').toUpperCase()}
          onPress={this.onConfirmPress}
          style={styles.buttonContainer}
        />
        </View>
      </View>
    )
  }

  onConfirmPress = () => {
    const { navigation } = this.props
    navigation.navigate('BleConnectionCompleteScreen', {'device': this.selectedPump, manager : this.props.navigation.getParam('manager', '') })
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
    return (
      <View style={styles.mainViewStyle}>
        <HeaderTitle title={I18n.t('bluetooth.header_title')} onBackPress={() => this._handleBack()}/>
        {this.renderView()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BleConfirmationScreen);
