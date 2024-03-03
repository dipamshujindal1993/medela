import React, {Component} from 'react';
import {Text, FlatList, Image, TouchableOpacity, View } from 'react-native';
import I18n from '@i18n';
import {connect} from 'react-redux';
import HomeActions from '@redux/HomeRedux';
import styles from './Styles/MorePumpListScreenStyles';
import HeaderTitle from '@components/HeaderTitle';
import LoadingSpinner from "@components/LoadingSpinner";
import ForwardIcon from '@svg/arrow_right';
import {Colors} from '@resources';
import AsyncStorage from '@react-native-community/async-storage'
import KeyUtils from "@utils/KeyUtils";
import Button from '@components/Button'
import BleDManager from "./BleDManager";
import {getCircularReplacer} from '@utils/TextUtils'
import GetterSetter from "@components/GetterSetter";
import {isListEqual} from '@utils/TextUtils';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
let connectTextColor;
let connectTextStyle;

class MorePumpListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      devices: [],
      connectedDeviceId: '',
      isLoading: true,
      isPumpingActive: false
    };
    this.manager  = BleDManager.getBleManagerInstance();
    this.isBluetoothActive = false
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    connectTextColor = this.themeSelected === 'dark' ? Colors.rgb_ffcd00 : Colors.rgb_000000
    connectTextStyle = this.themeSelected === 'dark' ? 'normal' : 'bold'
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
    await analytics.logScreenView('more_pump_list_screen')
  }

  componentDidUpdate(prevProps, prevState){
    const {
      scannedList,
      pumpRunning
    } = this.props

    if (scannedList && !isListEqual(scannedList,prevProps.scannedList)) {
      console.log('scannedList %%%%%%%%', scannedList)
      this.setState({devices:scannedList, isLoading:false})
    }

    if (pumpRunning !== prevProps.pumpRunning) {
      console.log("pumpRunning-------- ", pumpRunning)
      this.setState({isPumpingActive: pumpRunning})
    }
  }
  getImage(item){
    let value = '';
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
    !item.deleteFlag && <TouchableOpacity style={styles.listItemStyle} onPress={() => this.onSelectDevice(item)}>
      <Image style={styles.imageStyle} source={this.getImage(item.name)}/>
      <View style={styles.deviceInfoContainer}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.deviceName,{color:this.textColor}]}>{item.name}</Text>
        {item.isOnline ? 
        <Text maxFontSizeMultiplier={1.7} 
          style={[styles.deviceStatus,{color:connectTextColor, fontWeight: connectTextStyle}]}>
            {I18n.t('pump_list_setting.pump_status_connected')}</Text> :
          <Text maxFontSizeMultiplier={1.7} style={[styles.deviceStatus,{color:this.textColor}]}>
            {I18n.t('pump_list_setting.pump_status_offline')}</Text>}
      </View>
      <ForwardIcon fill={Colors.rgb_898d8d} width={24} height={24} style={styles.forwardIcon}/>
    </TouchableOpacity>
  );

  render() {
    const {navigation} = this.props
    const { devices, isLoading, isPumpingActive } = this.state
    return (
      <>
        <HeaderTitle title={I18n.t('more.pump_title')} onBackPress={() => navigation.goBack()}/>
        <View style={styles.container}>
          {
            (devices && devices.length > 0) ?
              <>
                <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('pump_list_setting.description')}</Text>
                <FlatList
                  data={devices}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  style={styles.listStyle}
                />
              </> :
              !isLoading && <View style={styles.noDataContainer}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.noDataText,{color:this.textColor}]}>{I18n.t('pump_list_setting.no_pump')}</Text>
              </View>
          }
          <View style={styles.bottonContainerStyle}>
            <Button
              title={I18n.t('pump_list_setting.setup_new_pump').toUpperCase()}
              disabled={isPumpingActive}
              onPress={this.onNewSetupPress}
              style={styles.buttonSignUpContainer}
            />

          </View>
          {isLoading && <LoadingSpinner/>}
        </View>
      </>
    );
  }

  onNewSetupPress=()=>{
    const {navigation} = this.props
    GetterSetter.setParentScreen('more')
    navigation.navigate('BleSetupScreen')
  }

  onPumpDelete = () => {
    this.props.getPumpList()
  }

  onSelectDevice = (item) => {
    const {navigation} = this.props
    if(item.isOnline) {
      AsyncStorage.setItem(KeyUtils.CONNECTED_DEVICE,JSON.stringify(item.device, getCircularReplacer()))
      navigation.navigate('BlePumpDetailScreen', {
        'device': item.device,
        'onPumpDelete': this.onPumpDelete,
        item,
        selectedDeviceConnected:true
      })
    }else{
      navigation.navigate('BlePumpDetailScreen', {
        'device': null,
        'onPumpDelete': this.onPumpDelete,
        item,
        selectedDeviceConnected:false
      })
    }
  };
}

const mapStateToProps = (state) => ({
  scannedList : state.home.scannedList,
  pumpRunning: state.home.pumpRunning,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
  getPumpList: () => dispatch(HomeActions.getPumpList())
})

export default connect(mapStateToProps, mapDispatchToProps)(MorePumpListScreen);

