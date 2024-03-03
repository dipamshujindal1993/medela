import React, {Component} from 'react';
import {Text, Image,SafeAreaView} from 'react-native';
import I18n from '@i18n';
import styles from './Styles/MaintenanceScreenStyles';
import Img from '../Images/png/Maintenance.png'
import HeaderMedelaLogo from '@components/HeaderMedelaLogo'
import colors from '../Resources/Colors';
import {Colors} from "../Resources";
import DeviceInfo from "react-native-device-info";
import {verticalScale} from "../Resources/Metrics";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class MaintenanceScreen extends Component {
    constructor(props) {
        super(props);
    }
   async componentDidMount() {
      await analytics.logScreenView('maintenance_screen')
    }

  render() {
      const {signedIn,themeSelected}=this.props
      this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
        return (
            <SafeAreaView style={[styles.container,{backgroundColor:themeSelected==='dark'?Colors.rgb_000000:Colors.white}]}>
                <HeaderMedelaLogo style={[styles.logo,{top:signedIn && DeviceInfo.hasNotch()?verticalScale(10):verticalScale(40)}]} isMaintenanceScreen={true} {...this.props} />
                <Image style={styles.imageStyle} source={Img} />
                <Text style={[styles.title,{color:this.textColor}]}>{I18n.t('maintenancescreen.text1')}</Text>
                <Text style={[styles.title,{color:this.textColor}]}>{I18n.t('maintenancescreen.text2')}</Text>
                <Text style={[styles.title,{color:colors.rgb_ffcd00}]}>{I18n.t('maintenancescreen.text3')}</Text>
          </SafeAreaView>
        );
    }
}

export default MaintenanceScreen;
