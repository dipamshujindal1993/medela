import React from 'react'
import {
  TouchableOpacity,
  Text,
} from 'react-native'

import { Colors } from '@resources'

import styles from './Styles/ButtonStyles'

function Button(props) {
  const {
    disabled,
    title,
    style,
    onPress,
    textStyle
  } = props

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor: disabled ? Colors.rgb_b9b9b9 : Colors.rgb_fecd00
        },
        style
      ]}
      onPress={onPress}>
      <Text maxFontSizeMultiplier={1.3} style={[styles.text,textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button
