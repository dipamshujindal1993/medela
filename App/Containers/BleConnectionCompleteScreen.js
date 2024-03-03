import React, {Component} from 'react';
import {Text, Platform, Keyboard, Alert, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import I18n from '@i18n';
import {connect} from 'react-redux';
import HomeActions from '@redux/HomeRedux';
import styles from './Styles/BluetoothConnectionCompleteScreenStyles';
import {View} from "react-native-animatable";
import Complete from '@svg/ic_complete_radar.svg';
import CustomTextInput from '@components/CustomTextInput';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import LoadingSpinner from '@components/LoadingSpinner';
import base64 from 'react-native-base64'
import {getManufacturerData} from '@utils/TextUtils'
import BleDManager from "./BleDManager";
import moment from "moment";
var Buffer = require('buffer/').Buffer
import {getVolumeUnits, getVolumeMaxValue} from '@utils/locale';
import NavigationService from "@services/NavigationService";
import Dialog from '@components/Dialog';
import {WaveIndicator} from "react-native-indicators";
import { Colors } from '@resources'
import AppActions from "@redux/AppRedux";
import GetterSetter from "../Components/GetterSetter";
const {width} = Dimensions.get("window")
import { Analytics } from '@services/Firebase';
import {Constants} from "@resources";

let analytics = new Analytics()
let sessionIndex = 0
let statusFlags = {}
let  deviceName=''

class BleConnectionCompleteScreen extends Component {

  constructor(props) {
    super(props);
    this.device = props.navigation.getParam('device', '')
    this.state = {
      device_name: this.device? (this.device.name.toLowerCase().includes("freestyle") ? 'Freestyle Flex' : this.device.name): '',
      isButtonDiabled: true,
      isLoading: false,
      showPumpOffAlert: false,
      timer : 0,
      goalTime: 0,
      battery_level: '',
      pumpLevel: 0,
      phaseLevel: 0,
      rhythemLevel: 0,
      unit:'',
      maxVolumeValue:0,
      barSize: '1%',
      isCompleteActive : false
    };
    // this.manager = props.navigation.getParam('manager', '')
    this.manager = BleDManager.getBleManagerInstance()
    this.pumpData = {}
    this.subscription = null
    this.isBluetoothActive = false

    this.readFlexData = {
      "batteryCharging": 0,
      "batteryLevel": 0,
      "battery_level": '',
      "sessionIndex": 0,
      "timer": 0,
      "pumpLevel": 3,
      "phaseLevel": 0,
      "deviceState": 1
    }

    this.readSonataData = {
      "batteryCharging": 0,
      "battery_level": '',
      "deviceAlertState": 0,
      "deviceState": 0,
      "goalTime": 0,
      "phaseLevel": 0,
      "pumpLevel": 2,
      "rhythemLevel": 0,
      "timer": 0
    }
    this.flexDataList = []
    this.durationBothInMins = 0
    this.durationBothInSec = 0
    this.subscription = null
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.startLoading()
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getVolumeUnits(),getVolumeMaxValue()]).then((values) => {
      this.setState({unit:values[0],maxVolumeValue:values[1]})
    });


    this.subscription = this.manager.state().then((state) => {
      this.isBluetoothActive = state === 'PoweredOn';
      state === 'PoweredOn' && this.connectToBLE()
    });
    await analytics.logScreenView('ble_connection_complete_screen')
  }

  componentWillUnmount() {
    // this.subscription.remove()
    clearInterval(this.uiInterval)
  }

  formatTime = (value) => {

    let _timer = value;
    let getSeconds = '', minutes = '', getMinutes = ''

    getSeconds = `0${(_timer % 60)}`.slice(-2)
    minutes = `${Math.floor(_timer / 60)}`
    getMinutes = `0${minutes % 60}`.slice(-2)
    this.durationBothInMins = parseInt(getMinutes)
    this.durationBothInSec = parseInt(getSeconds)

  }

  async componentDidUpdate(prevProps, prevState){
    const {
      addPumpMessage,
      addPumpSuccess,
      addPumpFailure,
      navigation,
      getPumpList,
      sonataData,
      flexData,
    } = this.props

    if (addPumpSuccess && addPumpSuccess != prevProps.addPumpSuccess) {
      this.setState({isLoading: false})
      if(this.device && this.device.name){
        if(this.device.name.toLowerCase().includes("sonata")){
          let obj = {
            pump_type:'sonata',
          }
          await analytics.logEvent(Constants.PAIR_SUCCESSFULLY, obj);
          await analytics.setProperty(Constants.PUMP_USER, 'sonata_user');
        }else if(this.device.name.toLowerCase().includes("freestyle")){
          let obj = {
            pump_type:'freestyle_flex',
          }
          await analytics.logEvent(Constants.PAIR_SUCCESSFULLY, obj);
          await analytics.setProperty(Constants.PUMP_USER, 'freestyle_flex_user');
        }else if(this.device.name.toLowerCase().includes("maxi")){
          let obj = {
            pump_type:'swing_maxi',
          }
          await analytics.logEvent(Constants.PAIR_SUCCESSFULLY, obj);
          await analytics.setProperty(Constants.PUMP_USER, 'swing_user');
        }
      }
      getPumpList()
      setTimeout(()=>{
        AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')
        setTimeout(()=>{
          navigation.popToTop()
          navigation.navigate('BreastFeedingPumpingScreen',
            {
              isFrom: 'bluetooth',
              isSiriNameReturned:true

            })
        },100)
      },2000);
    }

    if (addPumpFailure && addPumpFailure != prevProps.addPumpFailure) {
      console.log("Failure", addPumpMessage)
      this.setState({isLoading: false})
      Alert.alert(I18n.t('bluetooth.pump_add_failure_title'),
        I18n.t('bluetooth.somethingWentWrong'))
    }
  }

  connectToBLE = () => {
    this.props.getBleDeviceId(this.device.id)
    this.deviceIdentifier = this.device.id
    const  deviceName=this.device&& this.device.name
    console.log('deviceName--',deviceName)
    this.device.manufacturerData && this.props.getPumpId(getManufacturerData(this.device.manufacturerData,deviceName))
    this.device.manufacturerData && GetterSetter.setPumpId(getManufacturerData(this.device.manufacturerData,deviceName))
    this.pumpData.pumpId = this.device.manufacturerData && getManufacturerData(this.device.manufacturerData,deviceName)
    console.log('**** manufacturerData PumpID ***** == ', this.device.manufacturerData && getManufacturerData(this.device.manufacturerData,deviceName))
    if(deviceName.toLowerCase().includes("freestyle")) {
      this.pumpData.pumpType = KeyUtils.MEDELA_MIDIAS_SERICE_UUID_FLEX
    }else{
      this.pumpData.pumpType = KeyUtils.MEDELA_MIDIAS_SERICE_UUID_SONATA
    }

    let ar = [this.deviceIdentifier]
    this.isBluetoothActive && this.manager.devices(ar).then((devices)=>{
      this.device = devices[0]
      // console.log('devices ### = ',devices)
      if(Platform.OS==='android') {
        devices.length>0 && devices[0].isConnected().then((res) => {
          console.log('IS connected = ', res)
          if (res) {
            this.readAllCharactersticsDevices()
          } else {
            devices[0].connect()
              .then((device) => {
                return device.discoverAllServicesAndCharacteristics()
              })
              .then((device) => {
                const isFlex = device.name.toLowerCase().includes("freestyle")
                if(isFlex){
                  this.readAllCharactersticsDevices()
                }else {
                  this.writeConfirmationBluetooth(device)
                  this.readAllCharactersticsDevices()
                }
              })
              .catch((error) => {
                console.log("BleConnectionCompleteScreen error = ", error)
              });
          }
        });
      }else{
        devices[0].connect()
          .then((device) => {
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            const isFlex = device.name.toLowerCase().includes("freestyle")
            if(isFlex){
              this.readAllCharactersticsDevices()
            }else {
              this.writeConfirmationBluetooth(device)
              this.readAllCharactersticsDevices()
            }
          })
          .catch((error) => {
            console.log("BleConnectionCompleteScreen error = ", error)
          });
      }

    })
  }

  writeConfirmationBluetooth(device){
    try {
      let serviceId = ''
      if(device.name.toLowerCase().includes("freestyle")) {
        serviceId = KeyUtils.MEDELA_MIDIAS_SERICE_UUID_FLEX
      }else{
        serviceId = KeyUtils.MEDELA_MIDIAS_SERICE_UUID_SONATA
      }
      const base64String = Buffer.from(KeyUtils.SONATA_PAIRING_CONFIRMATION_MAGIC_NUMBER, 'hex').toString('base64');
      device.writeCharacteristicWithResponseForService(
        serviceId,
        KeyUtils.MEDELA_MIDIAS_CHARACTERISTIC_UUID,
        base64String)
        .then((characteristic) => {
          console.log("write sonata confirm--- ", characteristic.value)
        }).catch((error) => {
        console.log("write characteristic error = ", error)
      });
    }catch (e) {
      console.log('Bluetooth icon write error - ', e)
    }
  }


  readAllCharactersticsDevices(){
    const device = this.device
    //Only pumpId is mandatory in add pump api
    //Software version : Done (softwareRevision : 1.6)
    device.readCharacteristicForService(KeyUtils.DEVICE_INFORMATION_SERVICE_UUID, KeyUtils.SOFTWARE_REVISION_UUID)
      .then((characteristic) => {
        let softwareRevision = base64.decode(characteristic.value)
        this.pumpData.softwareRevision = softwareRevision
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //Model number : Done (modelNumber : Sonata)
    device.readCharacteristicForService(KeyUtils.DEVICE_INFORMATION_SERVICE_UUID, KeyUtils.MODEL_NUMBER_UUID)
      .then((characteristic) => {
        let modelNumber = base64.decode(characteristic.value)
        this.pumpData.modelNumber = modelNumber
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //Serial number version : (serialNumber : 888916043834286100000)
    device.readCharacteristicForService(KeyUtils.DEVICE_INFORMATION_SERVICE_UUID, KeyUtils.SERIAL_NUMBER_UUID)
      .then((characteristic) => {
        let serialNumber = base64.decode(characteristic.value)
        const isFlex = device.name.toLowerCase().includes("freestyle")
        if(isFlex){
          this.pumpData.serialNumber = serialNumber
        }
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //Firmware version : Done (firmwareRevision : 1.6.19.6490)
    device.readCharacteristicForService(KeyUtils.DEVICE_INFORMATION_SERVICE_UUID, KeyUtils.FIRMWARE_REVISION_UUID)
      .then((characteristic) => {
        let firmwareRevision = base64.decode(characteristic.value)
        this.pumpData.firmwareRevision = firmwareRevision
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //Hardware version : Done (hardwareRevision : 1.6.19.6490)
    device.readCharacteristicForService(KeyUtils.DEVICE_INFORMATION_SERVICE_UUID, KeyUtils.HARDWARE_REVISION_UUID)
      .then((characteristic) => {
        let hardwareRevision = base64.decode(characteristic.value)
        this.pumpData.hardwareRevision = hardwareRevision
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    //Manufacturer name : Not needed(manufacturerName : Medela)
    device.readCharacteristicForService(KeyUtils.DEVICE_INFORMATION_SERVICE_UUID, KeyUtils.MANUFACTURER_NAME_UUID)
      .then((characteristic) => {
        let manufacturerName = base64.decode(characteristic.value)
        // this.setState({isButtonDiabled: false})
      }).catch((error) => {
      console.log("read characteristic error = ", error)
    });

    // //System id : Done (pumpId : e8f4bf0000730478)
    // device.readCharacteristicForService(KeyUtils.DEVICE_INFORMATION_SERVICE_UUID, KeyUtils.SYSTEM_ID_UUID)
    //   .then((characteristic) => {
    //     let pumpId = Buffer.from(characteristic.value, 'base64');
    //     pumpId = toHexaString(pumpId)
    //     this.pumpData.pumpId = pumpId
    //     this.setState({isButtonDiabled: false})
    //   }).catch((error) => {
    //   console.log("read characteristic error = ", error)
    // });
  }

  renderView = () => {
    const {device_name, isLoading, barSize, isCompleteActive} = this.state
    return (
      <View>
        <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.congratulations')}</Text>
        <Text maxFontSizeMultiplier={1.7} style={[styles.stepsTitle,{color:this.textColor}]}>{I18n.t('bluetooth.successfully_paired')}</Text>
        <View style={styles.container}>
          <WaveIndicator color={Colors.rgb_ffcd00} size={width-100}/>
          <Complete style={{position: 'absolute'}}/>
        </View>
        <Text maxFontSizeMultiplier={1.7} style={[styles.inputTitle,{color:this.textColor}]}>{I18n.t('bluetooth.your_device_name')}</Text>
        <CustomTextInput
          textStyles={[styles.textInput,{color:Colors.rgb_000000}]}
          value={device_name}
          onChangeText={(index, value) => this.setState({device_name:value})}
          returnKeyType={"done"}
          onSubmitEditing={Keyboard.dismiss}/>

        <TouchableOpacity onPress={()=> {
         isCompleteActive && this.onCompletePress()
        }}>
        <View style={styles.progressBarView}>
          <View style={[styles.progressSlider, {width: `${barSize}`}]}/>
          <Text maxFontSizeMultiplier={1.7}
            style={styles.progressTextStyle}>{!isCompleteActive ? I18n.t('bluetooth.setting_up').toUpperCase() : I18n.t('generic.done').toUpperCase()}</Text>
        </View>
        </TouchableOpacity>
        {isLoading && <LoadingSpinner/>}
      </View>
    )
  }

  onCompletePress= async ()=>{
    const { addPump, pumps } = this.props
    let pumpName = deviceName
    if(pumpName.toString().trim()==''){
      pumpName = this.device? (this.device.name.toLowerCase().includes("freestyle") ? 'Freestyle Flex' : this.device.name): ''
    }
    if(pumps && pumps.pumps && pumps.pumps.length>0) {
      if(this.pumpData && this.pumpData.pumpId) {
        if (!pumps.pumps.some(e => e.Name === this.pumpData.pumpId)) {
          if(pumpName.toLowerCase().includes("sonata")){
            let obj = {
              pump_type:'sonata',
              successful_pairing:1
            }
            await analytics.logEvent(Constants.PAIR_SUCCESSFULLY, obj);
          }else if(pumpName.toLowerCase().includes("freestyle")){
            let obj = {
              pump_type:'freestyle_flex',
              successful_pairing:1
            }
            await analytics.logEvent(Constants.PAIR_SUCCESSFULLY, obj);
          }else if(pumpName.toLowerCase().includes("maxi")){
            let obj = {
              pump_type:'swing_maxi',
              successful_pairing:1
            }
            await analytics.logEvent(Constants.PAIR_SUCCESSFULLY, obj);
          }
        }
      }
    }
    this.pumpData.name = pumpName
    if(this.pumpData && this.pumpData.pumpId){
      this.setState({isLoading: true})
      let pumps = [this.pumpData]
      let pumpData = {pumps}
      console.log('pumpData ====== ', JSON.stringify(pumpData))
      addPump(pumpData)

    }
  }

  startLoading() {
    let v = 1, size = ''
    this.uiInterval = setInterval(() => {
      v = v + 1
      size = v + '%'
      if (v <= 100) {
        this.setState({barSize: size})
      }else {
        this.setState({isCompleteActive:true})
      }
    }, 80)
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
      <ScrollView>
      <View>
        {this.renderView()}
      </View>
      </ScrollView>

    );
  }
}

const mapStateToProps = (state) => ({
  addPumpMessage : state.home.addPumpMessage,
  addPumpSuccess : state.home.addPumpSuccess,
  addPumpFailure : state.home.addPumpFailure,
  selected_baby: state.home.selected_baby,
  isInternetAvailable: state.app.isInternetAvailable,
  flexData: state.home.flexData,
  sonataData: state.home.sonataData,
  manualDataFromPumping: state.home.manualDataFromPumping,
  pumpingCountValue: state.home.pumpingCountValue,
  sessionIndexValue: state.home.sessionIndexValue,
  pumps: state.home.pumps,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  addPump : (pumpData) => dispatch(HomeActions.addPump(pumpData)),
  flexPumpData: (flexData) => dispatch(HomeActions.flexPumpData(flexData)),
  sonataPumpData: (sonataData) => dispatch(HomeActions.sonataPumpData(sonataData)),
  getPumpList: () => dispatch(HomeActions.getPumpList()),
  setPumpType: (pumpType) => dispatch(HomeActions.setPumpType(pumpType)),
  isPumpRunning: (pumpState) => dispatch(HomeActions.isPumpRunning(pumpState)),
  connectionState: (msg) => dispatch(HomeActions.connectionState(msg)),
  connectionPause: (msg) => dispatch(HomeActions.connectionPause(msg)),
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  sessionFromNewPump: (value) => dispatch(HomeActions.sessionFromNewPump(value)),
  pumpingManualData: (value) => dispatch(HomeActions.pumpingManualData(value)),
  pumpingCount: (value) => dispatch(HomeActions.pumpingCount(value)),
  setSessionIndex: (v) => dispatch(HomeActions.setSessionIndex(v)),
  sessionSaveFromPumping: (value) => dispatch(HomeActions.sessionSaveFromPumping(value)),
  getPumpId: (value) => dispatch(HomeActions.getPumpId(value)),
  getBleDeviceId: (id) => dispatch(AppActions.getBleDeviceId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BleConnectionCompleteScreen);
