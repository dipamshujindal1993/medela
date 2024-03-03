import React, {Component} from 'react';
import {Text, FlatList, Image, TouchableOpacity} from 'react-native';
import I18n from '@i18n';
import {connect} from 'react-redux';
import styles from './Styles/BleDevicesListScreenStyles';
import {View} from "react-native-animatable";
import HeaderTitle from '@components/HeaderTitle';
import AsyncStorage from "@react-native-community/async-storage";
import {locale, marketData} from "../Utils/locale";
import KeyUtils from "@utils/KeyUtils";
import GetterSetter from "../Components/GetterSetter";
import NavigationService from "@services/NavigationService";
import {
  Metrics,Colors
} from '@resources'
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

const deviceData = [
  {
    id: '0',
    name: 'Sonata',
    img: require('../Images/png/ble_sonata.png')
  },
  {
    id: '1',
    name: 'Freestyle Flex',
    img: require('../Images/png/ble_flex.png')
  }
]

const deviceDataForOther = [
  {
    id: '1',
    name: 'Freestyle Flex',
    img: require('../Images/png/ble_flex.png')
  }
]



class BleDevicesListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showBoth: false,
      pumpsList:[],
      flatListHeight:0
    };
    this.focusListener = null
    this.market= null
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const {navigation, remoteConfig,userProfile}=this.props;
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.focusListener = navigation.addListener('didFocus', async () => {
      let item=remoteConfig.markets.find((e)=>{
        return e.market==userProfile.mother.market
      })
      console.log('marketData--',userProfile.mother.market,item.supportedPumps)
      this.market = remoteConfig && remoteConfig.markets && marketData(remoteConfig.markets,locale().replace("-", "_")).market;
      if (item!=undefined){
        this.setState({pumpsList: [...item.supportedPumps]})
      } else {
        this.setState({pumpsList: []})
      }
    });
    await analytics.logScreenView('ble_devices_list_screen')
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  renderImage(name){
    if (name.includes('sonata')){
      return require('../Images/png/ble_sonata.png')
    }else if (name.includes('freestyleflex')){
      return require('../Images/png/ble_flex.png')
    }else if(name.toLowerCase().includes('maxi')){
      return require ('../Images/png/ble_maxi.png')
    }else{
      return require('../Images/png/ble_flex.png')
    }
  }

  renderItem = ({item,index}) => {
    const {flatListHeight,pumpsList}=this.state;
    return <TouchableOpacity style={{height:flatListHeight/pumpsList.length,alignItems:'center',justifyContent:'center', width:Metrics.screenWidth}} onPress={() => this.onSelectDevice(item)}>
        <Image style={{height:'70%',resizeMode:'contain', width:Metrics.screenWidth}} source={this.renderImage(item.toString().toLowerCase())}/>
        <Text maxFontSizeMultiplier={1.7} style={[styles.deviceName,{color:this.textColor}]}>{item}</Text>
    </TouchableOpacity>
  };

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
    const {pumpsList} = this.state

    return (
      <>
        <View style={{flex:1}}>
          <HeaderTitle title={I18n.t('bluetooth.header_title')} onBackPress={() =>  this._handleBack()}/>
          <View style={styles.container}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.which_pump')}</Text>
              <FlatList
                onLayout={(event) => {
                  const {x, y, width, height} = event.nativeEvent.layout;
                  const {flatListHeight}=this.state;
                  if(pumpsList.length>0&&flatListHeight==0){
                    this.setState({flatListHeight:height});
                  }
                }}
                data={pumpsList}
                renderItem={this.renderItem}
                keyExtractor={(item,index) => index.toString()}
                showsVerticalScrollIndicator={false}
                style={styles.listStyle}
                //scrollEnabled={false}
              />
          </View>
        </View>
      </>
    );
  }

  onSelectDevice = (item) => {
    const {navigation} = this.props
    navigation.navigate('BleSelectedDeviceScreen', {
      name: item
    })
  };
}

const mapStateToProps = (state) => ({
  remoteConfig:state.remoteConfig,
  userProfile: state.user.userProfile,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BleDevicesListScreen);
