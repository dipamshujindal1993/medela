import React from 'react'
import {
  ActivityIndicator,
} from 'react-native'
import { Colors } from '@resources'

import styles from './Styles/LoadingSpinnerStyles'

function LoadingSpinner(props) {
  return (
    <ActivityIndicator
      { ...props }
      style={[props.doNotFill ? null : styles.absoluteFill, props.style]}
      color={Colors.rgb_767676}
    />
  )
}

export default LoadingSpinner