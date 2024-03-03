import React from 'react'
import {View} from 'react-native'
import Button from "@components/Button";
import styles from './Styles/BottomButtonsViewStyles'

function BottomButtonsView(props) {
  const {
    positiveButtonTitle,
    negativeButtonTitle,
    onNegativePress,
    onPositivePress,
    disable,
    hideView
  } = props

  return (
    <View style={styles.cancelSaveView}>
      {hideView !== true &&
        <Button title={negativeButtonTitle} textStyle={styles.cancelTextStyle}
          onPress={onNegativePress}
          style={styles.cancelButtonStyles} />
      }
      
      <Button
        disabled={disable}
        title={positiveButtonTitle} textStyle={styles.saveTextStyle} onPress={onPositivePress}
              style={[styles.saveButtonStyles,disable?{opacity: 0.5}:{opacity: 1}]}/>
    </View>
  )
}

export default BottomButtonsView
