import React, { Fragment } from 'react'
import {
    Text,
    View,
    Modal,
    TouchableWithoutFeedback,
  } from 'react-native'
import {BlurView} from "@react-native-community/blur";
import Button from '@components/Button';
import styles from '../Containers/Styles/MyBabyScreenStyles';
import { useSelector } from 'react-redux';
import {Colors} from '@resources';


export const ArabicLangConfirmingModal=({cancel,reload,message})=>{
    const selectedTheme = useSelector(state=>state.app.themeSelected)
  return(
    <View>
      <Modal
        transparent={true}
        visible={true}
        onRequestClose={cancel}
       >
        <BlurView
          blurType={selectedTheme}
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={cancel}>
            <View style={styles.background}>
              <Fragment>
                <View style={styles.dialogView}>
                  <Text maxFontSizeMultiplier={1.7} style={[styles.popupHeaderTextStyles,{color: Colors.rgb_000000}]}>{message}</Text>
                  <Button title={'Reload it'}
                    textStyle={styles.yesBtnTextStyle}
                    style={styles.yesBtnStyles}
                    onPress={reload}
                  />
                  <Button title={'Cancel'}
                    textStyle={styles.remindBtnTextStyles}
                    style={styles.remindBtnStyles}
                    onPress={cancel}
                  />
                </View>
              </Fragment>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </Modal>
    </View>
  )
}