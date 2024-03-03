import React from 'react'
import { View, Text } from 'react-native'
import styles from './Styles/AlertMessageStyles'

export default AlertMessage = (props) => {
  const { title } = this.props
      return (
        <View
          style={[styles.container, this.props.style]}
        >
          <View style={styles.contentContainer}>
            <Text maxFontSizeMultiplier={1.7} allowFontScaling={false} style={styles.message}>{title && title.toUpperCase()}</Text>
          </View>
        </View>
      ) 
}
