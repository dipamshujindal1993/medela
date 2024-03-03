import React from 'react'
import {
  View,
  Text
} from 'react-native'
import I18n from '@i18n'

import styles from './Styles/AppInfoStyles'

function AppInfo() {
  return (
    <View style={styles.container}>
      <Text maxFontSizeMultiplier={1.7} style={styles.textAppName}>{I18n.t('common.app_name')}</Text>
    </View>
  )
}

export default AppInfo
