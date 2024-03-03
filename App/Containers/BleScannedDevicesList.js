import React, {Component} from 'react';
import {Text, FlatList, Image, TouchableOpacity} from 'react-native';
import I18n from '@i18n';
import {connect} from 'react-redux';
import styles from './Styles/BleScannedDevicesListStyles';
import {View} from "react-native-animatable";
import HeaderTitle from '@components/HeaderTitle';
import Dialog from '@components/Dialog';
import ForwardIcon from '@svg/arrow_right';
import {Colors} from '@resources'
import GetterSetter from "../Components/GetterSetter";
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "@services/NavigationService";
import KeyUtils from "@utils/KeyUtils";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BleScannedDevicesList extends Component {

  constructor(props) {
    super(props);
    this.selectedTypePump = props.navigation.getParam('name', '')
    this.state = {
      deviceData: [],
      showInfoDialog : true
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }
  async componentDidMount() {
    //
    // let resArr = [];
    // this.props.navigation.getParam('device', '').forEach((item)=>{
    //   let i = resArr.findIndex(x => x.id == item.id);
    //   if(i <= -1){
    //     resArr.push(item);
    //   }
    // });
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.setState({deviceData: this.props.navigation.getParam('device', '')})
    await analytics.logScreenView('ble_scanned_devices_list_screen')
  }

  renderDialog() {
    const {showInfoDialog} = this.state
    const message = this.selectedTypePump === 'Sonata' ? I18n.t('bluetooth.sonata_pair_info') : I18n.t('bluetooth.flex_pair_info')
    const imageURL = this.selectedTypePump === 'Sonata' ? require('../Images/png/sonata_pair.png') : require('../Images/png/flex_pair.png')
    return <Dialog
        visible={showInfoDialog}
        title={I18n.t('bluetooth.pump_select_dialog_title')}
        message={message}
        positive={I18n.t('bluetooth.ok')}
        imageURL={imageURL}
        positiveOnPress={() => {
          this.setState({showInfoDialog: false})
        }}
        onDismiss={() => {
        }}
      />
  }

  renderItem = ({item}) => (
    item.localName !== '' && <TouchableOpacity style={styles.listItemStyle} onPress={() => this.onSelectDevice(item)}>
      <Image style={styles.imageStyle} source={this.selectedTypePump === 'Sonata' ? require('../Images/png/ble_sonata.png') : this.selectedTypePump.toLowerCase().includes('maxi')? require('../Images/png/ble_maxi.png') :require('../Images/png/ble_flex.png')}/>
      <Text maxFontSizeMultiplier={1.7} style={[styles.deviceName,{color:this.textColor}]}>{item.localName}</Text>
      <ForwardIcon fill={Colors.rgb_898d8d} width={24} height={24} style={styles.forwardIcon}/>
    </TouchableOpacity>
  );

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
    const {deviceData, showInfoDialog} = this.state
    let filterData=deviceData.filter((e)=>{
      return e.localName!==null
    })

    return (
      <>
        <HeaderTitle title={I18n.t('bluetooth.header_title')} onBackPress={() => this._handleBack()}/>
        <View style={styles.container}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('bluetooth.which_pump')}</Text>
          <FlatList
            data={filterData}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.listStyle}
          />
          {showInfoDialog && this.renderDialog()}
        </View>
      </>
    );
  }

  onSelectDevice = (item) => {
    const {navigation} = this.props
    navigation.navigate('BleConfirmationScreen', {'device': item, 'name': this.selectedTypePump})
  };
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BleScannedDevicesList);
