import React from 'react'
import {
    Modal,
    View,
    Platform,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Image
} from 'react-native'
import {useSelector} from 'react-redux';

import Button from '@components/Button';
import Colors from "@resources/Colors";
import styles from './Styles/DialogStyles'

import BabyIcon from '@svg/ic_baby_popup.svg'
import Logo from '@svg/logo.svg'
import {BlurView} from "@react-native-community/blur";
import OfflineIcon from '@svg/ic_offline.svg'
import {Fonts} from '@resources'

const renderIcon = (isIcon) => {
  if (isIcon) {
    return (
      <BabyIcon style={{alignSelf:'center', marginBottom:20}}/>
    )
  }
  return null
}

const renderAppIcon = (isAppIcon) => {
  if (isAppIcon) {
    return (
      <Image
        style={styles.appIcon_style}
        source = {require('../Images/png/icon-app.png')
      }/>
    )
  }
  return null
}

const renderOfflineIcon = (isOffine) => {
    if (isOffine) {
      return (
        <OfflineIcon style={{alignSelf:'center', marginBottom:20}}/>
      )
    }
    return null
}

const renderImage = (imageURL) => {
  if (imageURL) {
    return (
      <Image
        source={imageURL}
        style={{alignSelf:'center', marginBottom:20}}/>
    )
  }
  return null
}

const renderTitle = (title, textAlign) => {
const selectedTheme = useSelector(state=>state.app.themeSelected)
    if (title) {
        return (
            <Text maxFontSizeMultiplier={1.7} style={[styles.title, { textAlign: 'center' ,color:selectedTheme === 'dark' ?(Colors.white):( Colors.rgb_000000)}]}>{title}</Text>
        )
    }
    return null
}

const renderFeedbackTitle = (title, textAlign) => {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  if (title) {
    return (
      <View style={textAlign ? [styles.feedback_view_container, {justifyContent: 'center',}] : styles.feedback_view_container}>
      <Text maxFontSizeMultiplier={1.7}
            style={textAlign ? [styles.feedback_title, {paddingTop: 0}] : styles.feedback_title}>
              {title}
      </Text>
      </View>
    )
  }
  return null
}

const renderMessage = (message, textAlign) => {
const selectedTheme = useSelector(state=>state.app.themeSelected)
    if (message) {
        return (
            <Text maxFontSizeMultiplier={1.7} style={[styles.message, { textAlign: 'center',color:selectedTheme === 'dark' ?(Colors.white):( Colors.rgb_000000) }]}>{message}</Text>
        )
    }
    return null
}

const renderTextInput = (placeholder, props) => {
  const {onChangeText,textInput,maxLength}=props
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  if (placeholder) {
    return (
    <TextInput maxFontSizeMultiplier={1.7}
      style={[styles.textInputStyle,{color:selectedTheme === 'dark' ?(Colors.white):( Colors.rgb_000000)}]}
      onChangeText={text => onChangeText(text)}
      value={textInput}
      placeholder={placeholder}
      placeholderTextColor={selectedTheme === 'dark' ?(Colors.white):( Colors.rgb_000000)}
      returnKeyType={"done"}
      maxLength={maxLength}
    />
    )
  }
  return null
}

const _renderBody = (renderBody) => {
    if (renderBody) {
        return renderBody()
    }
}

const renderCTA = (negative, positive, negativeOnPress, positiveOnPress,neutral,neutralPress, buttonStyle,nagativeButtonStyles, autoReviewPopupStyle) => {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
    if(buttonStyle) {
      return (
          <View style={autoReviewPopupStyle ? 
                {flexDirection: 'row', alignSelf: 'center'} : 
                [styles.ctaView, {flexDirection: 'row', alignSelf: 'center',
            justifyContent: 'space-between'}]}>
              {
                negative &&
                <Button
                  title={negative}
                  onPress={() => negativeOnPress()}
                  style={autoReviewPopupStyle ? 
                    [styles.feedback_negative_container,{width: '40%', marginHorizontal: 30}] : 
                    styles.feedback_negative_container}
                  textStyle={autoReviewPopupStyle ? 
                    [styles.feedback_button_text, {...Fonts.style.bold_14,}] : 
                    styles.feedback_button_text}
                />
              }
              {
                  positive &&
                  <Button
                      disabled={!positiveOnPress}
                      title={positive}
                      onPress={() => positiveOnPress()}
                      style={autoReviewPopupStyle ? 
                        [styles.feedback_positive_container,{width: '40%', marginHorizontal: 30}] : 
                        styles.feedback_positive_container}
                      textStyle={autoReviewPopupStyle ? 
                        [styles.feedback_button_text, {...Fonts.style.bold_14,}] : 
                        styles.feedback_button_text}
                  />
              }
          </View>
      ) 
      } else {
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
              style={[styles.cta_negative_container,nagativeButtonStyles!=undefined?nagativeButtonStyles:{}]}
              textStyle={[styles.cta, styles.cta_text_negative,{color:selectedTheme === 'dark' ?(Colors.white):( Colors.rgb_000000)}]}
            />
          }
          {
            neutral &&
            <Button
              title={neutral}
              onPress={() => neutralPress()}
              style={styles.cta_negative_container}
              textStyle={[styles.cta, styles.cta_text_negative,{color:selectedTheme === 'dark' ?(Colors.white):( Colors.rgb_000000)}]}
            />
          }
        </View>
      )
    }
}

export default function Dialog(props) {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  let dialogBackgroundColor = Colors.white
  selectedTheme === "dark" && (dialogBackgroundColor = Colors.rgb_000000)
    const {
        title,
        message,
        placeholder,
        textInput,
        textAlign,
        renderBody,
        cancelable,
        onDismiss,
        visible,
        hasTextInput,
        negative,
        negativeOnPress,
        positive,
        positiveOnPress,
        neutral,
        neutralPress,
        isIcon,
        isAppIcon,
        isOffine,
        imageURL,
        nagativeButtonStyles,
        buttonStyle,
        feedbackTitle,
        autoReviewPopupStyle
    } = props
    return (
        <Modal
            transparent
            hardwareAccelerated
            visible={visible}
            onRequestClose={() => cancelable != false && onDismiss ? onDismiss() : null}
        > 
          {autoReviewPopupStyle ? 
          <TouchableWithoutFeedback disabled={cancelable == false} onPress={onDismiss}>
          <View style={
                      {paddingHorizontal: 5, flex:1, justifyContent: 'flex-end', bottom: 90}}>
              <TouchableWithoutFeedback>
                  <View style={{backgroundColor: Colors.white, borderRadius: 15,
                         paddingBottom: 10,
                        paddingHorizontal: 25}}>
                      {renderFeedbackTitle(feedbackTitle, autoReviewPopupStyle)}
                      {renderCTA(negative, positive, negativeOnPress, positiveOnPress,neutral,neutralPress, buttonStyle,nagativeButtonStyles, autoReviewPopupStyle)}
                  </View>
              </TouchableWithoutFeedback>
              {/* {hasTextInput && Platform.OS === 'ios' && <View style={styles.iosFooter} />} */}
          </View>
          </TouchableWithoutFeedback> :
          <BlurView
            blurType='dark'
            style={{flex: 1}}>
            <TouchableWithoutFeedback disabled={cancelable == false} onPress={onDismiss}>
                <View style={
                            buttonStyle ? [styles.background, {paddingHorizontal: 70}]
                            : styles.background}>
                    <TouchableWithoutFeedback>
                        <View style={
                            buttonStyle ? [styles.dialogView, {backgroundColor: Colors.white, borderRadius: 35,
                                marginHorizontal: 10, paddingVertical: 15,
                                paddingHorizontal: 15,}] :
                            [styles.dialogView, {backgroundColor: dialogBackgroundColor}]}>
                            {renderImage(imageURL)}
                            {renderIcon(isIcon)}
                            {renderAppIcon(isAppIcon)}
                            {renderOfflineIcon(isOffine)}
                            {renderTitle(title, textAlign)}
                            {renderFeedbackTitle(feedbackTitle, textAlign)}
                            {renderMessage(message, textAlign)}
                            {renderTextInput(placeholder,props)}
                            {_renderBody(renderBody)}
                            {renderCTA(negative, positive, negativeOnPress, positiveOnPress,neutral,neutralPress, buttonStyle,nagativeButtonStyles)}
                        </View>
                    </TouchableWithoutFeedback>
                    {hasTextInput && Platform.OS === 'ios' && <View style={styles.iosFooter} />}
                </View>
            </TouchableWithoutFeedback>
          </BlurView>}
        </Modal>
    )
}
