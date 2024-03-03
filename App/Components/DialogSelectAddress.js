import React from 'react'
import {
    Modal,
    View,
    Text,
    TouchableWithoutFeedback,
} from 'react-native'
import {useSelector} from 'react-redux';

import Button from '@components/Button';
import {Colors, Fonts} from "@resources";
import styles from './Styles/DialogStyles'
import {BlurView} from "@react-native-community/blur";
import RadioGroup from 'react-native-radio-buttons-group';
import I18n from '@i18n';

const renderTitle = (title, textAlign,textColor) => {
    console.log('textColor',textColor)
    if (title) {
        return (
            <Text maxFontSizeMultiplier={1.7} style={[styles.title, { textAlign: 'center',color:textColor }]}>{title}</Text>
        )
    }
    return null
}

const renderMessage = (message, textAlign,textColor) => {
    if (message) {
        return (
            <Text maxFontSizeMultiplier={1.7} style={[styles.message, { textAlign: 'center' ,color:textColor}]}>{message}</Text>
        )
    }
    return null
}


const _renderBody = (addresses, onPressRadioButton,textColor) => {
  const suggestedAdd = addresses.suggestedAddress
  const submittedAdd = addresses.submittedAddress

  const lableUS = suggestedAdd ? "US Mail Format\n"+suggestedAdd.AddressLineOne+" "+suggestedAdd.AddressLineTwo+" "+ suggestedAdd.City+ ", "+suggestedAdd.State+" "+suggestedAdd.PostalCode : ''
  const lableSub = I18n.t('opted.address_dialog_same') + "\n"+submittedAdd.AddressLineOne+" "+submittedAdd.AddressLineTwo+" "+ submittedAdd.City+ ", "+submittedAdd.State+" "+submittedAdd.PostalCode 
  const radioButtons = [{
    id: '1', // acts as primary key, should be unique and non-empty string
    label: lableUS,
    value: 'option1',
    selected: true,
    color: Colors.rgb_ffcd00,
    labelStyle: {...Fonts.style.regular_16, color: textColor}
  }, {
    id: '2',
    label: lableSub,
    value: 'option2',
    color: Colors.rgb_ffcd00,
    labelStyle: {...Fonts.style.regular_16, color: textColor}
  }]

    if (addresses) {
      return <RadioGroup 
            radioButtons={radioButtons} 
            onPress={onPressRadioButton} 
        />
    }
}

const renderCTA = (negative, positive, negativeOnPress, positiveOnPress,textColor) => {
    return (
        <View style={styles.ctaView}>
            {
                positive &&
                <Button
                    disabled={!positiveOnPress}
                    title={positive}
                    onPress={() => positiveOnPress()}
                    style={styles.cta_posative_container}
                    textStyle={[styles.cta, (!positiveOnPress && styles.ctaDisabled)]}
                />
                }
            {
                negative &&
                <Button
                    title={negative}
                    onPress={() => negativeOnPress()}
                    style={styles.cta_negative_container}
                    textStyle={[styles.cta, styles.cta_text_negative,{color:textColor}]}
                />
            }
        </View>
    )
}

export default function DialogSelectAddress(props) {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  let dialogBackgroundColor = Colors.white
  selectedTheme === "dark" && (dialogBackgroundColor = Colors.rgb_000000)
    const {
        title,
        message,
        textAlign,
        addresses,
        cancelable,
        onDismiss,
        visible,
        negative,
        negativeOnPress,
        positive,
        positiveOnPress,
        neutral,
        neutralPress,
        onPressRadioButton,textColor
    } = props
    return (
        <Modal
            transparent
            hardwareAccelerated
            visible={visible}
            onRequestClose={() => cancelable != false && onDismiss ? onDismiss() : null}
        >
          <BlurView
            blurType='dark'
            style={{flex: 1}}>
            <TouchableWithoutFeedback disabled={cancelable == false} onPress={onDismiss}>
                <View style={styles.background}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.dialogView, {backgroundColor: dialogBackgroundColor}]}>
                            
                            {renderTitle(title, textAlign,textColor)}
                            {renderMessage(message, textAlign,textColor)}
                            {_renderBody(addresses,onPressRadioButton,textColor)}
                            {renderCTA(negative, positive, negativeOnPress, positiveOnPress,neutral,neutralPress,textColor)}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </Modal>
    )
}
