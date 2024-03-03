import React from 'react'
import {
   View
} from 'react-native'
import AppInfo from '@components/AppInfo'

import LoadingSpinner from '@components/LoadingSpinner'

import styles from './Styles/SplashScreenStyles'

function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* <AppInfo /> */}
      <LoadingSpinner />
    </View>
  )
}

export default SplashScreen
