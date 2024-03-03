import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform, BackHandler, SafeAreaView
} from 'react-native';
let PacifySDKModule = require('react-native').NativeModules.PacifySDKModule;
let { callPacify } = PacifySDKModule;
import HomeActions from '@redux/HomeRedux';
import Dialog from '@components/Dialog';
import styles from './Styles/TrackingScreenStyles';
import {connect} from 'react-redux';
import Freezer from '@svg/ic_freezer.svg';
import Checklist from '@svg/ic_checklists.svg';
import Icon24 from '@svg/ic_24x7lc.svg';
import Question from '@svg/ic_questionnaires.svg';
import Weight from '@svg/ic_weight.svg';
import Growth from '@svg/ic_growth.svg';
import Sleep from '@svg/ic_sleep.svg';
import Nappy from '@svg/ic_nappy.svg';
import Bottle from '@svg/ic_bottle.svg';
import Bluetooth from '@svg/ic_bluetooth.svg';
import Left from '@svg/ic_left.svg';
import Right from '@svg/ic_right.svg';
import Clock from '@svg/ic_clock.svg';
import Close from '@svg/ic_close.svg';
import I18n from 'react-native-i18n';
import Link from '@svg/ic_link.svg';
import Contraction from '@svg/ic_contraction.svg';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {Constants} from "@resources";
import {
  Metrics,
  Colors
} from '@resources'
import {BleManager} from 'react-native-ble-plx';
let isSleepTimerActive = false;
let isLeftTimerActive = false;
let isRightTimerActive = false;
let isContractionTimerActive = false;
import Bluetooth_off from '@svg/ic_bluetooth_gray.svg';
import {verticalScale} from "../Resources/Metrics";
import BleDManager from "./BleDManager";
var Buffer = require('buffer/').Buffer
import NavigationService from "../Services/NavigationService";
import Button from '@components/Button';
import PushController from './PushController';
import GetterSetter from "@components/GetterSetter";
import D from '@svg/D.svg';
import S from '@svg/S.svg';
import {getRealmDb, readMotherProfile} from "../Database/AddBabyDatabase";
import {hasPumpSupport} from "@utils/locale";
import BreastFeedingActiveIcon from '@svg/ic_breastfeedingactive.svg'
import PumpActiveIcon from '@svg/pumping.svg'
import LeftFrench from "../Images/svg/ic-left_French.svg"
import LeftItalian from "../Images/svg/ic-left_Italian.svg"
import LeftPortuguese from "../Images/svg/ic-left_Portuguese.svg"
import LeftRussian from "../Images/svg/ic-left_Russian.svg"
import LeftSpanish from "../Images/svg/ic-left_Spanish.svg"
import LeftSwedish from "../Images/svg/ic-left_Swedish.svg"
import LeftArabic from "../Images/svg/L_Arabic.svg"
import RightArabic from "../Images/svg/R_Arabic.svg"
import RightRussian from "../Images/svg/ic-right_Russian.svg"
import RightSwedish from "../Images/svg/ic-right_Swedish.svg"
import RightFIPS from "../Images/svg/ic-right-French-Italian-Portuguese-Spanish.svg"
import RightPolish from "../Images/svg/P.svg"
import LeftPolish from "../Images/svg/L.svg"
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
class TrackingScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDeviceConnected:false,
      isBothTimerActive : false,
      isCanadaUsaUser:false,
      showOfflinePopUp:false,
      pairedPumps:[],
      notifPermissions: null,
      isItalian:false,
      pumpSupport:false,
      isPumpingActive:false
    };
    this.isBluetoothActive = false
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
      if (_local!=null){
        this.locale=_local
        let s=_local.split('_')
        s.length>0 && s[1] && this.setState({isCanadaUsaUser:s[1]=='US' || s[1]=='CA'})
      }
    })
    this.manager  = BleDManager.getBleManagerInstance();
    this.device = {}
    this.subscription = null

    // this.autoConnect_interval = React.createRef();
  }

  async componentDidMount() {
    this.init()
    const {navigation, isConnected, scannedList,remoteConfig} = this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    let realmDb=await getRealmDb()
    let profile = realmDb.objects('UserMotherProfile');
    if (profile.length>0) {
      let motherProfileObj = JSON.parse(JSON.stringify(profile))
      const {market} = motherProfileObj[0].mother
      let pumpSupport = hasPumpSupport(remoteConfig && remoteConfig.markets, market)
      this.setState({pumpSupport})
    }

    navigation.addListener('willFocus', () => {
      AsyncStorage.getItem(KeyUtils.SELECTED_LANGUAGE).then((language)=>{
        if (language!=null){
        this.setState({ isItalian: language == 'Italian' ? true : false })
      }
    })
      console.log('willFocus')
      this.manager.state().then((state)=>{
        console.log('state = ', state)
        this.isBluetoothActive = state === 'PoweredOn'

        this.init()
      })
    })
    AsyncStorage.getItem(KeyUtils.NOTIF_PERMISSIONS).then((permission)=>{
      this.setState({ notifPermissions: permission === 'true' ? true : false })
    })
    this.setState({isDeviceConnected:isConnected, pairedPumps:scannedList})
    await analytics.logScreenView('tracking_screen')
  }

  componentDidUpdate(prevProps, prevState){
    const {
      scannedList,
      isConnected
    } = this.props

    if (scannedList && scannedList !== prevProps.scannedList) {
      this.setState({pairedPumps:scannedList})
    }

    if (isConnected !== prevProps.isConnected) {
      console.log("isConnected-----tracking ---- ", isConnected)
      this.setState({isDeviceConnected:isConnected})
    }
  }

  componentWillUnmount() {
    // clearInterval(this.autoConnect_interval.current)
  }

  _navigateToRoute(route,params){
    const {navigation}=this.props
    navigation.navigate(route)
  }

  refreshView = () =>{
    this.manager.state().then((state)=>{
      console.log('state = ', state)
      this.isBluetoothActive = state === 'PoweredOn'
      this.init()
    })
  }

  init(){
    AsyncStorage.getItem(KeyUtils.CONNECTED_DEVICE).then( device => {
      if(device!= undefined || device!= null) {
        this.device = JSON.parse(device)
      }
    })

    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_SLEEP).then(value => {
      if (value === 'true') {
        isSleepTimerActive=true
        this.setState({})
      }else if (value === 'pause') {
        isSleepTimerActive=true
        this.setState({})
      }
      else{
        isSleepTimerActive=false
        this.setState({})
      }
    }
    );
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_LEFT).then(value => {
      if (value === 'true') {
        isLeftTimerActive=true
        this.setState({})
      }else if (value === 'pause') {
        isLeftTimerActive=true
        this.setState({})
      }
      else{
        isLeftTimerActive=false
        this.setState({})
      }
    }
    );
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_BFnP_RIGHT).then(value => {
      if (value === 'true') {
        isRightTimerActive=true
        this.setState({})
      }else if (value === 'pause') {
        isRightTimerActive=true
        this.setState({})
      }
      else{
        isRightTimerActive=false
        this.setState({})
      }
    }
    );
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_DURATION).then(value => {
        if (value === 'true') {
          isContractionTimerActive=true
          this.setState({})
        } else{
          isContractionTimerActive=false
          this.setState({})
        }
      }
    );
    AsyncStorage.getItem(KeyUtils.BOTH_TIMER_ACTIVE).then(value => {
        if (value === 'true') {
          this.setState({isBothTimerActive : true})
        } else{
          this.setState({isBothTimerActive : false})
        }
      }
    );
    AsyncStorage.getItem(KeyUtils.IS_TIME_ACTIVE_P).then(value => {
      if (value === 'true'||value === 'pause') {
        this.setState({isPumpingActive : true})
      } else{
        this.setState({isPumpingActive : false})
      }
    }
  );



  }

  async callPacifymethod() {
    let token = await AsyncStorage.getItem(KeyUtils.PACIFY_TOKEN)
    let params = {
      'pacify_initiated':'connected',
    }
    await analytics.logEvent(Constants.PACIFY, params);
    if (token == null) {
      //Hit Api then fetch again
      await this.props.getToken();
      setTimeout(async () => {
        token = await AsyncStorage.getItem(KeyUtils.PACIFY_TOKEN)
        this.callPacifyApimethod(token)
      }, 300)
    } else {
      this.callPacifyApimethod(token)
    }
  }

  async callPacifyApimethod(token) {
    const args = {
      apiKey: Constants.PACIFY_QA,
      userToken: token,
      coupon: '',
      name: this.props.userProfile.mother.name,
      email: this.props.userProfile.mother.username
    }
    const callbackFn = (mvalue) => {
    }
    callPacify(args, callbackFn)
  }

  offlinePopUp(){
    const {showOfflinePopUp} = this.state
    const{navigation}=this.props
    return (
      <Dialog
        visible={showOfflinePopUp}
        title={I18n.t('breastfeeding_confidence.offline_popup_title')}
        message={I18n.t('breastfeeding_confidence.offline_popup_message')}
        positive={I18n.t('mom_information.ok')}
        isOffine={true}
        positiveOnPress={() => {
          this.setState({showOfflinePopUp: false})
        }}
        onDismiss={() => {
        }}
      />
    )
  }
  onStorageIconPress = () =>{
    const {navigation, userProfile}= this.props
    if(userProfile && userProfile != null && userProfile.mother && userProfile.mother != null){
      (!userProfile.mother.vipStatus) ? navigation.navigate("VipPackScreen") : navigation.navigate("FreezerTrackingScreen")
    }
  }

  renderTopItems() {
    const {isCanadaUsaUser,pumpSupport}=this.state
    const {isInternetAvailable, navigation, userProfile}= this.props
    return <View style={{ flexDirection: 'row',width:'100%',justifyContent:'space-around',}}>
      {pumpSupport && <TouchableOpacity style={styles.touchViewStyle}>
        <Freezer width={verticalScale(55)} height={verticalScale(55)} onPress={() => {this.onStorageIconPress()}}/>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.freezer')}</Text>
      </TouchableOpacity>}
      <TouchableOpacity style={styles.touchViewStyle}>
        <Checklist width={verticalScale(55)} height={verticalScale(55)}   onPress={() => {
          this._navigateToRoute('ChecklistScreen')
        }}/>
        <Text numberOfLines={1}  maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.checklists')}</Text>
      </TouchableOpacity>
      {/* {isCanadaUsaUser && <TouchableOpacity style={styles.touchViewStyle}>
        <Icon24 width={verticalScale(55)} height={verticalScale(55)}   onPress={() => {
          if(isInternetAvailable){
            this.callPacifymethod()
          }else{
            this.setState({showOfflinePopUp: true})
          }

        }}/>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.24x7')}</Text>
      </TouchableOpacity>} */}
      <TouchableOpacity style={styles.touchViewStyle}>
        <Question width={verticalScale(55)} height={verticalScale(55)}   onPress={() => this.props.navigation.navigate('TestsScreen')}/>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.questionnaires')}</Text>
      </TouchableOpacity>
    </View>
  }

  renderSecondItems() {
    const {navigation,babies}=this.props
    return <View style={styles.momViewStyle}>
      <TouchableOpacity style={styles.touchViewStyle} onPress={()=>navigation.navigate('ContractionScreen')}  >
        <Contraction width={verticalScale(55)} height={verticalScale(55)} />
        {isContractionTimerActive && <Clock width={Metrics.moderateScale._20} height={Metrics.moderateScale._20} style={{position: 'absolute', top: 0, right: 2}}/>}
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.contraction')}</Text>
      </TouchableOpacity>
    </View>
  }
  renderThirdItem() {
    const {navigation,babies} = this.props
    const {isPumpingActive,isBothTimerActive}=this.state;
    return <>
    <View style={{ flexDirection: 'row',width:'100%',justifyContent:'space-around',}}>
      <TouchableOpacity style={styles.touchViewStyle}>
        <Nappy width={verticalScale(55)} height={verticalScale(55)} onPress={() => {
          if (babies && babies.length>0){
            //navigation.navigate('NappyTrackingScreen',{refresh: this.refreshView})
            this._navigateToRoute('NappyTrackingScreen')
          }else {
            navigation.navigate('AddBabyScreen')
          }
        }}/>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.nappy')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchViewStyle}>
        <Bottle width={verticalScale(55)} height={verticalScale(55)}  onPress={() => {
          if (babies && babies.length>0){
            navigation.navigate('BottleTrackingScreen',{refresh: this.refreshView})
          }else {
            navigation.navigate('AddBabyScreen')
          }
        }}/>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('bottle_tracking.bottle')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchViewStyle}>
        <Sleep width={verticalScale(55)} height={verticalScale(55)} fill="#daeffa"
               onPress={() => { if (babies && babies.length>0){
                navigation.navigate('SleepScreen')
               }else {
                 navigation.navigate('AddBabyScreen')
               }
               }}/>
        {isSleepTimerActive && <Clock width={Metrics.moderateScale._20} height={Metrics.moderateScale._20} style={{position: 'absolute', top: 0, right: 2}}/>}
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.sleep')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchViewStyle}>
        <Growth width={verticalScale(55)} height={verticalScale(55)}  onPress={() => {
          if (babies && babies.length>0){
            navigation.navigate('GrowthScreen')
          }else {
            navigation.navigate('AddBabyScreen')
          }
        }}/>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.growth')}</Text>
      </TouchableOpacity>


      </View>
    <View style={{ flexDirection: 'row',width:'100%',justifyContent:'space-between',}}>
      <TouchableOpacity style={styles.touchViewStyle}>
        <Weight width={verticalScale(55)} height={verticalScale(55)}
                onPress={() => {
                  if (babies && babies.length>0){
                    navigation.navigate('WeightScreen')
                  }else {
                    navigation.navigate('AddBabyScreen')
                  }
                }}
                style={styles.imgStyle}
        />
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.weight')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchViewStyle}>
        <BreastFeedingActiveIcon width={verticalScale(55)} height={verticalScale(55)}
                onPress={() => {
                  AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
                  if (babies && babies.length>0){
                    navigation.navigate('BreastFeedingScreen',{
                      isLeftPress:false,
                      isRightPress:false,
                      refresh: this.refreshView,
                      isSiriNameReturned:true,
                      isBreastFeedingSelected: true,
                      isFromIndividualTracking: true,
                      isBothPressed:false
                    })
                  }else {
                    navigation.navigate('AddBabyScreen')
                  }
                }}
                style={styles.imgStyle}
        />
        {(isLeftTimerActive||isRightTimerActive) && <Clock width={Metrics.moderateScale._20} height={Metrics.moderateScale._20} style={{position: 'absolute', top: 0, right: 2}}/>}
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.breastfeed')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touchViewStyle}>
        <PumpActiveIcon width={verticalScale(55)} height={verticalScale(55)} fill={Colors.rgb_efdae3}
                onPress={() => {
                  AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')

                  if (babies && babies.length>0){
                    this.getPairedDevices()

                  }else {
                    navigation.navigate('AddBabyScreen')
                  }
                }}
                style={styles.imgStyle}
        />
        {isBothTimerActive && <Clock width={Metrics.moderateScale._20} height={Metrics.moderateScale._20} style={{position: 'absolute', top: 0, right: 2}}/>}
        {(isPumpingActive) && <Clock width={Metrics.moderateScale._20} height={Metrics.moderateScale._20} style={{position: 'absolute', top: 0, right: 2}}/>}
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>{I18n.t('tracking.pumping')}</Text>
      </TouchableOpacity>
      <View style={styles.touchViewStyle}/>
    </View>
    </>
  }
  renderLeftIcons = (locale) => {
    switch(locale){
      case 'en' :
        return <Left width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'da':
        return <Left width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'nl':
        return <Left width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'fr':
        return <LeftFrench width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'de':
        return <Left width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'it':
      return <LeftItalian width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'nb':
        return <Left width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'no':
        return <Left width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'pt':
        return <LeftPortuguese width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'ru':
        return <LeftRussian width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'es':
        return <LeftSpanish width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'sv':
        return <LeftSwedish width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'ar':
        return <LeftArabic width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      case 'pl':
        return <LeftPolish width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
      default:
        return <Left width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onLeftPress()}} />
    }
    }
    renderRightIcons = (locale) => {
      switch(locale){
        case 'en' :
          return <Right width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'da':
          return <Right width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'nl':
          return <Right width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'fr':
          return <RightFIPS width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'de':
          return <Right width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'it':
        return <RightFIPS width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'nb':
          return <Right width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'no':
          return <Right width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'pt':
          return <RightFIPS width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'ru':
          return <RightRussian width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'es':
          return <RightFIPS width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'sv':
          return <RightSwedish width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'ar':
          return <RightArabic width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        case 'pl':
          return <RightPolish width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
        default:
          return <Right width={verticalScale(72)} height={verticalScale(72)} onPress={()=>{this.onRightPress()}} />
      }
}

  renderBluetoothConnection() {
    const {isDeviceConnected, isBothTimerActive,isItalian,pumpSupport}=this.state
    return (<View style={styles.bluetoothViewStyle}>
       <TouchableOpacity accessible={true} accessibilityLabel={I18n.t('breastfeeding_pump.left')}>
        {this.renderLeftIcons(I18n.locale.substr(0, 2))}
        {isLeftTimerActive && <Clock width={Metrics.moderateScale._20} height={Metrics.moderateScale._20} style={{position: 'absolute', top: 0, right: 0}}/>}
      </TouchableOpacity>

      <View style={styles.linkViewStyle}>
        {/*{pumpSupport?isDeviceConnected ? <Bluetooth width={Metrics.moderateScale._30} height={Metrics.moderateScale._30} style={styles.imgStyle} onPress={() =>this.getPairedDevices()} />*/}
        {/*  : <Bluetooth_off width={Metrics.moderateScale._30} height={Metrics.moderateScale._30} style={styles.imgStyle} onPress={() =>this.getPairedDevices()}  />:null}*/}
          <TouchableOpacity
            onPress={this.onBothPress}
            style= {styles.buttonContainer}>
            {!((isLeftTimerActive &&  isRightTimerActive) || isDeviceConnected)?
            <View style= {I18n.t('breastfeeding_pump.both').length >5?[styles.buttonView,{width:Metrics.moderateScale._70 }] : styles.buttonView}>
            <Text
              style= {styles.buttonTextStyle}>
              {I18n.t('breastfeeding_pump.both')}
            </Text>
            </View>  :
              <View
                style= {I18n.t('breastfeeding_pump.both').length >5?[styles.buttonView,{width:Metrics.moderateScale._70,backgroundColor:Colors.rgb_ffcd00 }]: [styles.buttonView,{backgroundColor:Colors.rgb_ffcd00 }]}>
                <Text style= {styles.buttonTextStyle}>
                  {I18n.t('breastfeeding_pump.both')}
                </Text>
              </View>
            }
          </TouchableOpacity>
      </View>
      <TouchableOpacity accessible={true} accessibilityLabel={I18n.t('breastfeeding_pump.right')}>

      {this.renderRightIcons(I18n.locale.substr(0, 2))}
        {isRightTimerActive && <Clock width={Metrics.moderateScale._20} height={Metrics.moderateScale._20} style={{position: 'absolute', top: 0, right: 0}}/>}
       </TouchableOpacity>
      </View>
    )
  }

  onLeftPress(){
    AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
    const {isDeviceConnected}=this.state
    const {navigation,babies}=this.props
    if (babies && babies.length>0){
        navigation.navigate('BreastFeedingScreen',{
          isLeftPress:true,
          isRightPress:false,
          refresh: this.refreshView,
          isSiriNameReturned:true,
          isBothPressed:false,
          isShortcutTracking:true
        })
    }else {
      navigation.navigate('AddBabyScreen')
    }
  }

  onRightPress(){
    AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
    const {isDeviceConnected}=this.state
    const {navigation,babies}=this.props
    if (babies && babies.length>0){
        navigation.navigate('BreastFeedingScreen', {
          isLeftPress: false,
          isRightPress: true,
          refresh: this.refreshView,
          isSiriNameReturned: true,
          isBothPressed:false,
          isShortcutTracking:true
        })
    }else {
      navigation.navigate('AddBabyScreen')
    }
  }

  getPairedDevices(){
    const {isDeviceConnected,pairedPumps}=this.state
    const {navigation}=this.props
    let isPumpFound = false
    if(pairedPumps && pairedPumps.length>0) {
      isPumpFound = true
    }
    if(isDeviceConnected) {
      GetterSetter.setParentScreen('pumping')
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')
      navigation.navigate('BreastFeedingPumpingScreen', {
        isFrom: 'bluetooth',
        isSiriNameReturned:true,
      })
    }else {
      console.log('isPumpFound--',isPumpFound)
      if(isPumpFound) {
        GetterSetter.setParentScreen('tracking')
        navigation.navigate('PairedPumpListScreen')
      }else {
        GetterSetter.setParentScreen('tracking')
        navigation.navigate('BreastFeedingPumpingScreen',{
          // isLeftPress:false,
          // isRightPress:false,
          refresh: this.refreshView,
          isSiriNameReturned:true,
          isBreastFeedingSelected: false,
          isFromIndividualTracking: true
        })
      }
    }
  }

  onClosePress() {
    AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
      if (tabName!=null){
        NavigationService.navigate(tabName)
      }else{
        NavigationService.navigate('Baby')
      }
    })
  }

  onBothPress =()=>{
    AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'true')
    const {isDeviceConnected} = this.state
    const {navigation, babies} = this.props

      if (babies && babies.length > 0) {
        AsyncStorage.setItem(KeyUtils.IS_BOTH_BF_SELECTED, 'true')
          navigation.navigate('BreastFeedingScreen', {
            isFrom: 'tracking',
            isLeftPress: true,
            isRightPress: true,
            refresh: this.refreshView,
            isSiriNameReturned:true,
            isBothPressed:true,
            isShortcutTracking:true
          })
      } else {
        navigation.navigate('AddBabyScreen')
      }
  }

  render() {
    return (
      <ScrollView
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}>
      <View style={styles.container}>
        {this.state.showOfflinePopUp && this.offlinePopUp()}
        <View style={styles.modal}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.titleTextStyle,{color:this.textColor}]}>{I18n.t('tracking.tools')}</Text>
          {this.renderTopItems()}
          <Text maxFontSizeMultiplier={1.7} style={[styles.titleTextStyle,{color:this.textColor}]}>{I18n.t('tracking.mom')}</Text>
          {this.renderSecondItems()}
          <Text maxFontSizeMultiplier={1.7} style={[styles.titleTextStyle,{color:this.textColor}]}>{I18n.t('tracking.baby')}</Text>
          {this.renderThirdItem()}
          {this.renderBluetoothConnection()}

          <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.textStyle,{color:this.textColor}]}>
            {/* {I18n.t('tracking.breastfeeding')} */}
            {I18n.t('tracking.breastfeedingPumpingShortcut')}
          </Text>

          <Close
            onPress={() => {
              this.onClosePress();
            }}
            style={styles.imgCloseStyle}
          />
        </View>
        {Platform.OS === 'ios' &&
        <>
          {this.state.notifPermissions ?
            <PushController navigation={this.props.navigation} />
          :
            <Dialog
              visible={!this.state.notifPermissions}
              title={I18n.t('notifications.permission_header')}
              message={I18n.t('notifications.permission_text')}
              positive={I18n.t('notifications.ok')}
              isIcon={false}
              positiveOnPress={() => {
                AsyncStorage.setItem(KeyUtils.NOTIF_PERMISSIONS, 'true')
                this.setState({ notifPermissions: true })
              }}
            />
          }
        </>
        }
      </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  isToken: state.user.getLoginSuccess,
  isTokenError: state.user.isTokenError,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  isInternetAvailable: state.app.isInternetAvailable,
  isConnected: state.home.isConnected,
  scannedList : state.home.scannedList,
  remoteConfig:state.remoteConfig,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
  getToken: () => dispatch(HomeActions.getToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackingScreen);

