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
import {useSelector} from 'react-redux'
import {Colors} from '@resources';

export const NotificationPopup = ({showPopup, onClose, onNeverShow, title, message, remindMessage, neverShow, onPressYes}) => {
const selectedTheme = useSelector(state=>state.app.themeSelected)
  return(
    <View>
      <Modal
        transparent
        hardwareAccelerated
        visible={showPopup}
        onRequestClose={() => onClose(false)}
      >
        <BlurView
          blurType='dark'
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.background}>
              <Fragment>
                <View style={styles.dialogView}>
                  <Text maxFontSizeMultiplier={1.7} style={[styles.popupHeaderTextStyles,{color: (Colors.rgb_000000)}]}>{title}</Text>
                  <Button title={message}
                    textStyle={styles.yesBtnTextStyle}
                    style={styles.yesBtnStyles}
                    onPress={() => onPressYes()}
                  />
                  <Button title={remindMessage}
                    textStyle={styles.remindBtnTextStyles}
                    style={styles.remindBtnStyles}
                    onPress={() => onClose(false)}
                  />
                  {neverShow !== "" &&
                    <Button title={neverShow}
                      textStyle={[styles.neverBtnTextStyles,{color: (Colors.rgb_000000)}]}
                      style={styles.neverBtnStyles}
                      onPress={() => onNeverShow && onNeverShow != undefined && onNeverShow()}
                    />
                  }
                </View>
              </Fragment>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </Modal>
    </View>
  )
}