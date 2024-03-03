import React from 'react'
import {
    View, Text, TouchableOpacity, I18nManager
} from 'react-native'

import styles from './Styles/HeaderPumpSetupStyles'
import HeaderLogo from '@svg/ic_logo'
import BackIcon from '@svg/arrow_back'
import {
  Colors,
} from '@resources'
import I18n from '@i18n';

function HeaderPumpSetup(props) {
  const {
    showSkip,
    onBackPress,
    onSkipPress
  } = props
    return (
        <View style={styles.container}>
          <TouchableOpacity  style={{...styles.backIconStyle , ...props.style} }  onPress={onBackPress} >
          <BackIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} width={32} height={32} fill={Colors.rgb_ffcd00}/>
          </TouchableOpacity>
            <View style={styles.logo}>
                <HeaderLogo fill={Colors.rgb_ffcd00}/>
            </View>

          {showSkip && <Text maxFontSizeMultiplier={1.7} onPress={onSkipPress} style={styles.textStyle}>{I18n.t('profileSetup2.skip')}</Text>}

        </View>
    )
}

export default HeaderPumpSetup
