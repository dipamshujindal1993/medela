import React, {Component} from 'react';
import {Text, FlatList, Image, TouchableOpacity, View, Alert, Platform, PermissionsAndroid} from 'react-native';
import I18n from '@i18n';
import {connect} from 'react-redux';
import styles from './Styles/MorePumpListScreenStyles';
import HeaderTitle from '@components/HeaderTitle';
import AsyncStorage from '@react-native-community/async-storage'
import KeyUtils from "@utils/KeyUtils";
import ForwardIcon from '@svg/arrow_right';
import {Colors} from '@resources';
import Button from '@components/Button'
import BleDManager from "./BleDManager";
import {getCircularReplacer} from '@utils/TextUtils'
import GetterSetter from "@components/GetterSetter";
var Buffer = require('buffer/').Buffer
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class PairedPumpListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      devices:[],
      isPumpingActive: false
    };
    this.manager  = BleDManager.getBleManagerInstance();
    this.isBluetoothActive = false
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)


  }

  async componentDidMount() {
    const {
      scannedList,
    } = this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.manager.state().then((state)=>{
      this.isBluetoothActive = state === 'PoweredOn'
    })

    this.setState({devices:scannedList, isLoading:false})
    await analytics.logScreenView('paired_pump_list_screen')
  }

  componentDidUpdate(prevProps, prevState){
    const {
      scannedList,
      pumpRunning
    } = this.props

    if (scannedList && scannedList != prevProps.scannedList) {
      this.setState({devices:scannedList})
    }
    if (pumpRunning !== prevProps.pumpRunning) {
      console.log("pumpRunning-------- ", pumpRunning)
      this.setState({isPumpingActive: pumpRunning})
    }
  }

  onSelectDevice(item){
    const {navigation} = this.props
    AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')
    AsyncStorage.setItem(KeyUtils.CONNECTED_DEVICE_ID,item.device.id)
    AsyncStorage.setItem(KeyUtils.CONNECTED_DEVICE,JSON.stringify(item.device, getCircularReplacer()))

    navigation.navigate('BreastFeedingPumpingScreen', {
      isFrom: 'bluetooth',
      pumpId: item.device.id
    })
  }
  getImage(item){
    let value = ''
    if(item.toLowerCase().replace(/ /g,'').includes('sonata')){
      value = require('../Images/png/ble_sonata.png')
    }
    else if(item.toLowerCase().replace(/ /g,'').includes('maxi')){
      value = require('../Images/png/ble_maxi.png')
    }
    else{
      value = require('../Images/png/ble_flex.png')
    }
    return value
  }

  renderItem = ({item}) => (
    !item.deleteFlag && <TouchableOpacity style={styles.listItemStyle} onPress={() => item.isOnline && this.onSelectDevice(item)}>
      <Image style={styles.imageStyle} source={ this.getImage(item.name) }/>
      <View style={styles.deviceInfoContainer}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.deviceName,{color:this.textColor}]}>{item.name}</Text>
        {item.isOnline ? <Text maxFontSizeMultiplier={1.7} style={[styles.deviceStatus,{color:Colors.rgb_ffcd00}]}>{I18n.t('pump_list_setting.pump_status_connected')}</Text> :
          <Text maxFontSizeMultiplier={1.7} style={[styles.deviceStatus,{color:this.textColor}]}>{I18n.t('pump_list_setting.pump_status_offline')}</Text>}
      </View>
      { item.isOnline && <ForwardIcon fill={Colors.rgb_898d8d} width={24} height={24} style={styles.forwardIcon}/>}
    </TouchableOpacity>
  );

  onManualPress=()=>{
    const {navigation} = this.props
    navigation.navigate('BreastFeedingPumpingScreen',{
      isLeftPress:false,
      isRightPress:false,
      isFrom: 'ble_manual'

    })
  }

  onNewSetupPress=()=>{
    const {navigation} = this.props
    GetterSetter.setParentScreen('paired')
    navigation.navigate('BleSetupScreen')
  }

  refreshView(){}

  render() {
    const {navigation} = this.props
    const {devices, isPumpingActive} = this.state;
    console.log(devices)
    return (
      <>
        <HeaderTitle title={I18n.t('pump_list_setting.pumps')} onBackPress={() => navigation.goBack()}/>
        <View style={styles.container}>
          <FlatList
            data={devices}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.listStyle}
          />

          <View style={styles.bottonContainerStyle}>
            <Button
              title={I18n.t('pump_list_setting.manual_tracking').toUpperCase()}
              onPress={this.onManualPress}
              style={styles.buttonLoginContainer}
              textStyle={styles.loginTextStyle}
            />
            <Button
              title={I18n.t('pump_list_setting.setup_new_pump').toUpperCase()}
              onPress={this.onNewSetupPress}
              disabled={isPumpingActive}
              style={styles.buttonSignUpContainer}
            />

          </View>
        </View>
      </>
    );
  }
}




const mapStateToProps = (state) => ({
  scannedList : state.home.scannedList,
  pumpRunning: state.home.pumpRunning,
  themeSelected: state.app.themeSelected
});


export default connect(mapStateToProps, null)(PairedPumpListScreen);
