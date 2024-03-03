import React, { Component } from 'react'
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native'
import styles from './Styles/NoInternetConnectionStyles'
import Logo from '@svg/ic_logo.svg';
import I18n from '@i18n';
import {BlurView} from "@react-native-community/blur";

export default class NoInternetConnectionView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
        visible,
        negativeOnPress,
        positiveOnPress,
        textColor
    } = this.props

    return (
        <Modal
            transparent
            hardwareAccelerated
            visible={visible}
            animationType={'fade'}>
          <BlurView
            blurType='light'
            style={{flex: 1}}>
          <View style={styles.container}>
            <View style={styles.background}>
              <Logo style={{alignSelf:'center', marginTop:10}} width={40} height={40} fill={"#ffc000"}/>
              <Text maxFontSizeMultiplier={1.7} style={[styles.title,textColor && {color:textColor}]}>{'MyMedela'}</Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.message,textColor && {color:textColor}]}>{I18n.t('generic.no_internet')}</Text>
              <View style={styles.ctaView}>
                <TouchableOpacity onPress={() => negativeOnPress()}>
                  <Text maxFontSizeMultiplier={1.7} style={styles.cta}>{I18n.t('generic.cancel').toUpperCase()}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => positiveOnPress()}>
                  <Text maxFontSizeMultiplier={1.7} style={styles.cta}>{I18n.t('generic.retry').toUpperCase()}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </BlurView>
        </Modal>
    )
  }
}
