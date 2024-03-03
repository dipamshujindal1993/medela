import React, {Component} from 'react';
import {ScrollView, Text, Image, Alert, View, TouchableOpacity, Platform} from 'react-native';
import Button from '@components/Button';
import I18n from '@i18n';
import {connect} from 'react-redux';
import HomeActions from '@redux/HomeRedux';
import styles from './Styles/YourPumpScreenStyles';
import Arrow from '@svg/arrow_right.svg';
import Battery from '@svg/ic_battery.svg';
import BatteryCharge from '@svg/ic_battery_charge.svg';
import HeaderTitle from '@components/HeaderTitle';
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import KeyUtils from "@utils/KeyUtils";
import LoadingSpinner from "@components/LoadingSpinner";
import BleDManager from "./BleDManager";
import AsyncStorage from "@react-native-community/async-storage";
import Dialog from '@components/Dialog';
import {getLocalFromMarket, locale} from "@utils/locale";
import { Linking} from 'react-native';
import EditPumpIcon from '@svg/ic_edit_photo';
import PumpActive from '@svg/ic_pump_active.svg';
import GetterSetter from "@components/GetterSetter";
import { Analytics } from '@services/Firebase';
import {verticalScale} from "@resources/Metrics";

let analytics = new Analytics()
let item = null
class BlePumpDetailScreen extends Component {

  constructor(props) {
    super(props);
    this.device = props.navigation.getParam('device', '')
    item = props.navigation.getParam('item', '')
    this.devicePumpId = item && item.pumpId
    this.state = {
      isLoading: false,
      isConnected: false,
      device_name: item.modelNumber,
      pump_name_sonata: item.name,
      pump_name_flex:item.name,
      version: item.softwareRevision,
      battery_level: '',
      powerConnection: '',
      batteryCharging: '',
      selectedDeviceConnected: props.pumpId === item.pumpId,
      deviceId : '',
      pumpDeletePopup : false,
      isPumpRunning: false,
      editPumpNamePopup:false,
      pumpNameTextInput:item.name,
      imgHeight:0,
      imgWidth:0
    };
    this.manager =  BleDManager.getBleManagerInstance();
    this.subscription = null
    this.isBluetoothActive = false
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)

  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    // this.subscription = this.manager.onStateChange((state) => {
    //   this.isBluetoothActive = state === 'PoweredOn';
    //   this.getData()
    // }, true);
    const {device_name} = this.state
    // AsyncStorage.getItem(KeyUtils.SONATA_PUMP).then(value =>{
    //   if(value!=null){
    //     if(device_name && device_name.toLowerCase().includes('sonata')){
    //      this.setState({ pump_name_sonata: value ,textInput:value})
    //     }
    //   }
    // });
    // AsyncStorage.getItem(KeyUtils.FLEX_PUMP).then(value =>{
    //   if(value!=null){
    //     if(!(device_name && device_name.toLowerCase().includes('sonata'))){
    //      this.setState({ pump_name_flex: value ,textInput:value})
    //     }
    //   }
    // });
    this.manager.state().then((state)=>{
      this.isBluetoothActive = state === 'PoweredOn'
    })
    this.setState({isConnected:this.props.isConnected, deviceId: this.props.bleDeviceId, isPumpRunning: this.props.isPumpSessionActive})
    await analytics.logScreenView('ble_pump_details_screen')
  }

  componentDidUpdate(prevProps, prevState){
    const {
      deletePumpMessage,
      deletePumpSuccess,
      deletePumpFailure,
      isConnected,
      sonataData,
      flexData,
      bleDeviceId,
      isPumpSessionActive,
      pumpId
    } = this.props

    if (deletePumpSuccess && deletePumpSuccess != prevProps.deletePumpSuccess) {
      this.setState({isLoading: false, pumpDeletePopup:true})
    }
    if (deletePumpFailure && deletePumpFailure != prevProps.deletePumpFailure) {
      this.setState({isLoading: false})
      console.log("deletePumpMessage failure",deletePumpMessage)
      // Alert.alert(I18n.t('pump_list_setting.pump_deletion_title'),deletePumpMessage)
    }

    if (sonataData && sonataData != prevProps.sonataData) {

      this.setState({
        batteryCharging:sonataData.batteryCharging,
        battery_level:sonataData.battery_level,
      })
    }

    if (flexData && flexData != prevProps.flexData) {
      this.setState({
        batteryCharging:flexData.batteryCharging,
        battery_level:flexData.battery_level,
      })
    }

    if (isConnected !== prevProps.isConnected) {
      console.log("isConnected-------- ", isConnected)
      this.setState({isConnected})
    }

    if (bleDeviceId && bleDeviceId != prevProps.bleDeviceId) {
      this.setState({deviceId: bleDeviceId})
    }

    if (isPumpSessionActive !== prevProps.isPumpSessionActive) {
      console.log("pumpActive detail screen-------- ", isPumpSessionActive)
      this.setState({
        isPumpRunning: isPumpSessionActive,
      })
    }

    if (pumpId && pumpId !== prevProps.pumpId) {
      console.log("pumpId-------- ", pumpId)
      this.setState({
        selectedDeviceConnected: pumpId === item.pumpId,
      })
    }

}
  onPumpDeleteOkCTA = () => {
    const { navigation } = this.props
    navigation.state.params.onPumpDelete()
    navigation.goBack()
  }

  componentWillUnmount() {
    // this.disconnect()
    // this.subscription.remove()
  }

  disconnect = async () => {
    const {deviceId} = this.state
    console.log('disconnect==-==', this.isBluetoothActive, deviceId)

    AsyncStorage.setItem(KeyUtils.RESET_TIMER, 'true')
    AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
    AsyncStorage.setItem(KeyUtils.START_TIMESTAMP_BFnP_LEFT, '')
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT, 'false')
    AsyncStorage.setItem(KeyUtils.IS_LEFT_TIMER_STARTED, 'false')
    AsyncStorage.setItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT, 'false')
    AsyncStorage.setItem(KeyUtils.IS_RIGHT_TIMER_STARTED, 'false')
    AsyncStorage.setItem(KeyUtils.LEFT_TIMER_VALUE, '')
    AsyncStorage.setItem(KeyUtils.RIGHT_TIMER_VALUE, '')
    AsyncStorage.setItem(KeyUtils.BOTH_TIMER_ACTIVE, 'false')

    this.isBluetoothActive && this.manager.cancelDeviceConnection(deviceId).then(async (res)=>{
      if (this.devicePumpId) {
        this.setState({isLoading: true})
        this.props.deletePump(this.devicePumpId)
      }
    })
  };

  getProductsUrl = () =>{
    let market = this.props.userProfile && this.props.userProfile != null && this.props.userProfile.mother && this.props.userProfile.mother != null && this.props.userProfile.mother.market
    let localeAccordingToMarket = getLocalFromMarket(this.props.remoteConfig && this.props.remoteConfig.markets,market)
    let productManualLink=''
    let productWebsiteLink=''
    let productVideoLink=''
    const {markets}=this.props.remoteConfig
    // console.log(markets)
    // get the selected market data   from config api
    let markObj=markets.find((e)=>{
      return e.market===this.props.userProfile.mother.market
    })
    // pumpName
    let pumpName = ''
    if(this.state.device_name =='freestyle'){
      pumpName = 'FreestyleFlex'
    }else if(this.state.device_name =='Swing Maxi'){
      pumpName = 'SwingMaxi'
    }else{
      pumpName=this.state.device_name
    }

    if (markObj!==undefined){

      const {supportedPumps,productLinks}=markObj
      // check supportedPumps array contains selectedPump
      if (supportedPumps.includes(pumpName)){
        // get the index from product links
        let index=productLinks.findIndex((r,i)=>{
          return Object.keys(r)[0]===pumpName
        })
        let selectedPumpName=supportedPumps[index]
        let selectedPumps=Object.values(productLinks)[index][selectedPumpName]
        const {productManual,productVideo,productWebsite}=selectedPumps[0]

        let productManualIndex=productManual.findIndex((r,i)=>{
          return Object.keys(r)[0]===localeAccordingToMarket
        })
        let productVideoIndex=productVideo.findIndex((r,i)=>{
          return Object.keys(r)[0]===localeAccordingToMarket
        })
        let productWebsiteIndex=productWebsite.findIndex((r,i)=>{
          return Object.keys(r)[0]===localeAccordingToMarket
        })

        if (productManualIndex>-1){
          productManualLink=productManual[productManualIndex][localeAccordingToMarket]
        }
        if (productVideoIndex>-1){
          productVideoLink=productVideo[productVideoIndex][localeAccordingToMarket]
        }
        if (productWebsiteIndex>-1){
          productWebsiteLink=productWebsite[productWebsiteIndex][localeAccordingToMarket]
        }

      }
    }
    return {productManualLink,productVideoLink,productWebsiteLink}
  }

  renderAboutView=()=>{
    const {navigation}=this.props
    const {device_name}=this.state
    const {productManualLink,productVideoLink,productWebsiteLink} = this.getProductsUrl()

    return (
      <View style={{marginBottom:20,flex:3}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.about_pump')}</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('BleQuickStartScreen', {name : device_name})} style={styles.aboutView}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.subTitleBold,{color:this.textColor}]}>{I18n.t('ble_instruction.quick_start')}</Text>
          <Arrow fill={Colors.rgb_898d8d} style={styles.arrowStyle}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('BleFrontPanelScreen', {name : device_name})} style={styles.aboutView}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.subTitleBold,{color:this.textColor}]}>{I18n.t('ble_instruction.front_panel')}</Text>
          <Arrow fill={Colors.rgb_898d8d} style={styles.arrowStyle}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.aboutView} onPress = {() => {(productManualLink && Linking.openURL(productManualLink))}}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.subTitleBold,{color:this.textColor}]}>{I18n.t('ble_instruction.user_manual')}</Text>
          <Arrow fill={Colors.rgb_898d8d} style={styles.arrowStyle}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.aboutView} onPress = {() => {(productVideoLink && Linking.openURL(productVideoLink))}}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.subTitleBold,{color:this.textColor}]}>{I18n.t('bluetooth.tutorial_videos')}</Text>
          <Arrow fill={Colors.rgb_898d8d} style={styles.arrowStyle}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.aboutView} onPress = {() => {(productWebsiteLink && Linking.openURL(productWebsiteLink))}}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.subTitleBold,{color:this.textColor}]}>{I18n.t('bluetooth.product_website')}</Text>
          <Arrow fill={Colors.rgb_898d8d} style={styles.arrowStyle}/>
        </TouchableOpacity>
      </View>
    )
  }

  editPumpPopup(){
    const {editPumpNamePopup,pumpNameTextInput,pump_name_sonata,pump_name_flex,device_name} = this.state
    return (
      <Dialog
        visible={editPumpNamePopup}
        title={I18n.t('pump_list_setting.edit_pump_name')}
        textInput={pumpNameTextInput}
        onChangeText={(pumpNameTextInput) => {
          this.setState({pumpNameTextInput})
        }}
        placeholder={I18n.t('pump_list_setting.edit_pump_name')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        maxLength={15}
        negativeOnPress={() => {
          this.setState({editPumpNamePopup: false })
          if(device_name && device_name.toLowerCase().includes('sonata')){
            this.setState({pumpNameTextInput:pump_name_sonata})
          }else{
            this.setState({pumpNameTextInput:pump_name_flex})
          }
        }}
        positiveOnPress={() => {
            if(pumpNameTextInput){
              if(device_name && device_name.toLowerCase().includes('sonata')){
                this.setState({pump_name_sonata:pumpNameTextInput})
              }else{
                this.setState({pump_name_flex:pumpNameTextInput})
              }
              this.setState({editPumpNamePopup: false })
              this.editPumpName()
            }
        }}
        onDismiss={() => {
          this.setState({editPumpNamePopup: false })
          if(device_name && device_name.toLowerCase().includes('sonata')){
            this.setState({pumpNameTextInput:pump_name_sonata})
          }else{
            this.setState({pumpNameTextInput:pump_name_flex})
          }
        }}
      />
    )
  }
  getPairedDevices(){
    const {isConnected, pumps}=this.props
    const {navigation}=this.props
    let isPumpFound = false
    let pumpL = [];
    if(pumps && pumps.pumps && pumps.pumps.length>0) {
      for (let item of pumps.pumps) {
        !item.deleteFlag && pumpL.push({...item, device: {}, isOnline: false})
      }
      if (pumpL.length > 0) {
        isPumpFound = true
      }
    }
    if(isConnected) {
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')
      navigation.navigate('BreastFeedingPumpingScreen', {
        isFrom: 'bluetooth',
        routeName:'MyBaby',
        isSiriNameReturned:true,
      })
    }else {
      if(isPumpFound) {
        GetterSetter.setParentScreen('home')
        navigation.navigate('PairedPumpListScreen')
      }else {
        GetterSetter.setParentScreen('home')
        navigation.navigate('BleSetupScreen')
      }
    }
  }

  renderView = () => {
    const {device_name,
      battery_level,
      version,
      isConnected,
      selectedDeviceConnected,
      batteryCharging,
      isPumpRunning,
      pump_name_sonata,
      pump_name_flex,
      imgHeight,
      imgWidth
    } = this.state
    const {themeSelected} = this.props

    let imgValue = null
    let pumpConnectedTextColor = themeSelected === 'dark' ? Colors.rgb_ffcd00 : Colors.rgb_000000

    if(device_name && device_name.toLowerCase().includes('sonata')){
      imgValue = require('../Images/png/ble_sonata.png')
    }
    else if(device_name && device_name.toLowerCase().includes('maxi')){
      imgValue = require('../Images/png/ble_maxi.png')
    }
    else {
      imgValue = require('../Images/png/ble_flex.png')
    }
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.container}>
          <View style={styles.pumpContainer}>
            <View onLayout={(e)=>{
              const {height,width}=e.nativeEvent.layout;
              const {imgHeight,imgWidth}=this.state;
              if(imgHeight==0&&imgHeight==0){
                this.setState({imgHeight:height,imgWidth:width});
              }
            }} style={{flex:1.5,justifyContent:'center',alignItems:'center'}}>
              <Image style={{height:imgHeight,width:imgWidth,resizeMode:'contain'}}  source={imgValue}/>
            </View>
            <View style={{justifyContent: 'center',flex:2}}>
            <View style={{flexDirection: 'row', height: 48, alignItems: 'flex-end'}}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.batteryLevel,{color:this.textColor}]}>{device_name && device_name.toLowerCase().includes('sonata')?pump_name_sonata:pump_name_flex}</Text>
                <TouchableOpacity onPress={() => {
                  this.setState({editPumpNamePopup:true})
                }}
                accessible={true}
		            accessibilityLabel={I18n.t("accessibility_labels.edit_pump_name")} 
                style={{height: 48, width: 48, justifyContent: 'flex-end', paddingBottom: verticalScale(7)}}>
                  <EditPumpIcon fill={Colors.rgb_888B8D} style={styles.editPumpIconStyle}/>
                </TouchableOpacity>
            </View>
              <Text maxFontSizeMultiplier={1.7} style={[styles.stepsTitle,{color:this.textColor}]}>{I18n.t('pump_list_setting.version')} {version ? version : "--"}</Text>
              <View style={styles.dotViewStyle}>
                <View style={selectedDeviceConnected && isConnected ? styles.dotStyle : [styles.dotStyle, {backgroundColor: Colors.rgb_898d8d}]}/>
                <Text maxFontSizeMultiplier={1.7} style={selectedDeviceConnected && isConnected ? [styles.connectedText,{color:pumpConnectedTextColor}] : [styles.connectedText, {color:this.textColor}]}>
                  {selectedDeviceConnected && isConnected ? I18n.t('pump_list_setting.pump_status_connected') : I18n.t('pump_list_setting.pump_status_offline')}</Text>
              </View>
              <Text maxFontSizeMultiplier={1.7} style={[styles.stepsTitle,{color:this.textColor}]}>{I18n.t('pump_list_setting.battery')}</Text>
              <View style={styles.batteryLevelView}>
                {batteryCharging==1 ?<BatteryCharge/>:<Battery/>}
                <Text style={[styles.batteryLevel,{color:this.textColor}]}>{selectedDeviceConnected && isConnected ? battery_level : "-/-"}</Text>
                {selectedDeviceConnected && isConnected  && batteryCharging==1 && <Text style={styles.chargingText}>{I18n.t('pump_list_setting.charging')}</Text>}
              </View>
            </View>
          </View>
          {this.renderAboutView()}
          <View style={styles.bottomViewStyle}>
            <Button
              title={I18n.t('bluetooth.remove_pump').toUpperCase()}
              style={styles.buttonContainer}
              onPress={() => this.deletePump()}
              disabled={isPumpRunning && item.isOnline}
            />
            <Text maxFontSizeMultiplier={1.7} style={[styles.deletePumpLevel,{color:this.textColor}]}>{I18n.t('bluetooth.pump_remove_dis')}</Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  deletePumpDialog() {
    const {deletePumpMessage} = this.props
    const {pumpDeletePopup} = this.state
    return (
      <Dialog
        visible={pumpDeletePopup}
        title={I18n.t('pump_list_setting.pump_deletion_title')}
        message={deletePumpMessage}
        positive={I18n.t('login.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({pumpDeletePopup: false})
          this.onPumpDeleteOkCTA()
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  deletePump = () => {
    const {isConnected} = this.state
    if(!isConnected) {
      if (this.devicePumpId) {
        this.setState({isLoading: true})
        this.props.deletePump(this.devicePumpId)
      }
    }else{
      this.disconnect()
    }
  }

  editPumpName() {
    const { addPump, scannedList, scannedPumpList } = this.props
    const { pumpNameTextInput } = this.state
    let obj = {
      pumpId : item.pumpId,
      pumpType : item.pumpType,
      softwareRevision : item.softwareRevision,
      modelNumber : item.modelNumber,
      firmwareRevision : item.firmwareRevision,
      hardwareRevision : item.hardwareRevision
    }
    obj['name'] = pumpNameTextInput
    let pumps = [obj]
    let pumpData = {pumps}
    console.log('scannedList ====== ', JSON.stringify(scannedList))
    let dd = [];
    for (let i of scannedList) {
      if(i.pumpId === item.pumpId){
        dd.push({...i, name : pumpNameTextInput})
      }else{
        dd.push({...i})
      }
    }
    console.log('pumpList ------ ', JSON.stringify(dd))
    scannedPumpList(dd)
    addPump(pumpData)
  }

  render() {
    const {navigation} = this.props
    const { isLoading, pumpDeletePopup, editPumpNamePopup } = this.state
    const {isConnected,
      selectedDeviceConnected,
    } = this.state
    return (
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <HeaderTitle title={I18n.t('bluetooth.your_pump')} onBackPress={() => navigation.goBack()}/>
        { selectedDeviceConnected && isConnected && <View style={[styles.headerView, {flexDirection: 'row', justifyContent: 'flex-end',position:'absolute',right:0}]}>
          <TouchableOpacity activeOpacity={1} onPress={() => {
            this.getPairedDevices()
          }} style={styles.headerRightView}>
            <View style={{flexDirection:'row', alignItems:'center', paddingVertical: 13}}>
              <Text maxFontSizeMultiplier={1.5} style={[styles.headerTextStyles,{color: Colors.rgb_0770E9, marginEnd:10}]}>{I18n.t('pump_list_setting.pump_now')}</Text>
              <PumpActive width={Metrics.moderateScale._24} height={Metrics.moderateScale._24}/>
            </View>
          </TouchableOpacity>
        </View> }
        {this.renderView()}
        {pumpDeletePopup && this.deletePumpDialog()}
        {isLoading && <LoadingSpinner/>}
        {editPumpNamePopup && this.editPumpPopup()}
      </ScrollView>

    );
  }
}

const mapStateToProps = (state) => ({
  deletePumpMessage : state.home.deletePumpMessage,
  deletePumpSuccess : state.home.deletePumpSuccess,
  deletePumpFailure : state.home.deletePumpFailure,
  flexData: state.home.flexData,
  sonataData: state.home.sonataData,
  isConnected: state.home.isConnected,
  bleDeviceId: state.app.bleDeviceId,
  isPumpSessionActive: state.home.isPumpSessionActive,
  userProfile: state.user.userProfile,
  remoteConfig:state.remoteConfig,
  pumpId: state.home.pumpId,
  scannedList: state.home.scannedList,
  pumps: state.home.pumps,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
  deletePump : (pumpId) => dispatch(HomeActions.deletePump(pumpId)),
  addPump : (pumpData) => dispatch(HomeActions.addPump(pumpData)),
  scannedPumpList: (pumpList) => dispatch(HomeActions.scannedPumpList(pumpList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BlePumpDetailScreen);

