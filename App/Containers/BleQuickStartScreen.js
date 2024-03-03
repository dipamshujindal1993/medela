import React, {Component} from 'react'
import {Dimensions, ScrollView, View, Image} from 'react-native'
import I18n from '@i18n'

const {width, height} = Dimensions.get('window');
import {Colors} from '@resources'
import Button from '@components/Button'
import CustomViewPager from '@components/CustomViewPager'
import styles from './Styles/StartScreenStyles'
import HeaderTitle from '@components/HeaderTitle';
import DeviceInfo from 'react-native-device-info';
import {verticalScale} from "@resources/Metrics";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BleQuickStartScreen extends Component {

  async componentDidMount() {
    await analytics.logScreenView('ble_quick_start_screen')
  }

  flex_data = [
    {
      image: require('../Images/png/flex_qs_1.png'),
      title: I18n.t('ble_quick_start.charge_pump'),
      desc:  I18n.t('ble_quick_start.charge_pump_desc'),
    },
    {
      image: require('../Images/png/flex_qs_2.png'),
      title: I18n.t('ble_quick_start.disassemble'),
      desc: I18n.t('ble_quick_start.disassemble_desc'),
    },
    {
      image: require('../Images/png/flex_qs_3.png'),
      title: I18n.t('ble_quick_start.wash_part'),
      desc: I18n.t('ble_quick_start.wash_part_desc'),
    },
    {
      image: require('../Images/png/flex_qs_4.png'),
      title: I18n.t('ble_quick_start.Sanitize_parts'),
      desc: I18n.t('ble_quick_start.Sanitize_parts_desc'),
    },
  ]
  sonata_data = [
    {
      image: require('../Images/png/sonata_qs_1.png'),
      title: I18n.t('ble_quick_start.charge_pump'),
      desc:  I18n.t('ble_quick_start.charge_pump_desc'),
    },
    {
      image: require('../Images/png/sonata_qs_2.png'),
      title: I18n.t('ble_quick_start.disassemble'),
      desc: I18n.t('ble_quick_start.disassemble_desc'),
    },
    {
      image: require('../Images/png/sonata_qs_3_.png'),
      title: I18n.t('ble_quick_start.wash_part'),
      desc: I18n.t('ble_quick_start.wash_part_desc'),
    },
    {
      image: require('../Images/png/sonata_qs_4.png'),
      title: I18n.t('ble_quick_start.Sanitize_parts'),
      desc: I18n.t('ble_quick_start.Sanitize_parts_desc'),
    },
  ]

  maxi_data = [
    {
      image: require('../Images/png/sonata_qs_1.png'),
      title: I18n.t('ble_quick_start.charge_pump'),
      desc:  I18n.t('ble_quick_start.charge_pump_desc_swing_maxi'),
    },
    {
      image: require('../Images/png/sonata_qs_2.png'),
      title: I18n.t('ble_quick_start.disassemble'),
      desc: I18n.t('ble_quick_start.disassemble_desc'),
    },
    {
      image: require('../Images/png/sonata_qs_3_.png'),
      title: I18n.t('ble_quick_start.wash_part'),
      desc: I18n.t('ble_quick_start.wash_part_desc'),
    },
    {
      image: require('../Images/png/sonata_qs_4.png'),
      title: I18n.t('ble_quick_start.Sanitize_parts'),
      desc: I18n.t('ble_quick_start.Sanitize_parts_desc'),
    },
  ]

  getViewPagerData(){
    const {navigation} = this.props
    if(navigation.getParam('name', '').includes('Sonata')){
      return this.sonata_data
    }else if(navigation.getParam('name', '').includes('maxi')){
      return this.maxi_data
    }else{
      return this.flex_data
    }
  }

  render() {
    const {navigation} = this.props
    return (
      // <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{width:width, height:height}}>
          <HeaderTitle title={I18n.t('ble_quick_start.title')} onBackPress={() => navigation.goBack()}/>
          <CustomViewPager
            data={ this.getViewPagerData() }
            loop={false}
            autoscroll={false}
            indicatorActiveColor={Colors.rgb_ffcd00}
            indicatorStyle={{marginVertical: 24}}
            local={true}
            localSVG={false}
          />

          <View style={[styles.bottonContainer,{bottom:DeviceInfo.hasNotch()?verticalScale(55):verticalScale(35)}]}>
            <Button
              title={I18n.t('generic.close').toUpperCase()}
              onPress={()=>navigation.goBack()}
              style={{   height: 48,
                borderRadius: 16, backgroundColor:'white'}}
            />
          </View>
        </View>
      /* </ScrollView> */
    )
  }
}

export default BleQuickStartScreen
