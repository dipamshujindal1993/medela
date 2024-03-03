import React from 'react'
import {
    Modal,
    View,
    Platform,
    Text,
    TouchableWithoutFeedback,
} from 'react-native'
import {useSelector} from 'react-redux';
import Button from '@components/Button';
import Colors from "@resources/Colors";
import styles from './Styles/DialogStyles'
import {Fonts} from '@resources'
import { verticalScale, moderateScale } from "@resources/Metrics";


const renderFeedbackTitle = (title, textAlign) => {
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

const renderCTA = (negative, positive, negativeOnPress, positiveOnPress) => {
      return (
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              {
                negative &&
                <Button
                  title={negative}
                  onPress={() => negativeOnPress()}
                  style={[styles.feedback_negative_container,{width: '40%', marginHorizontal: 30}]}
                  textStyle={[styles.feedback_button_text, {...Fonts.style.bold_14,}]}
                />
              }
              {
                  positive &&
                  <Button
                      disabled={!positiveOnPress}
                      title={positive}
                      onPress={() => positiveOnPress()}
                      style={[styles.feedback_positive_container,{width: '40%', marginHorizontal: 30}]}
                      textStyle={[styles.feedback_button_text, {...Fonts.style.bold_14,}]}
                  />
              }
          </View>
      ) 
}

export default function FeedbackDialog(props) {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  let dialogBackgroundColor = Colors.white
  selectedTheme === "dark" && (dialogBackgroundColor = Colors.rgb_000000)
    const {
        cancelable,
        onDismiss,
        negative,
        negativeOnPress,
        positive,
        positiveOnPress,
        feedbackTitle,
        autoReviewPopupStyle
    } = props
    return (
      <View>
          <TouchableWithoutFeedback disabled={cancelable == false} onPress={onDismiss}>
          <View style={
                      { height: verticalScale(80), width: '95%', justifyContent: 'flex-end', bottom: 20, position: 'absolute', alignSelf: 'center'}}>
              <TouchableWithoutFeedback>
                  <View style={{backgroundColor: Colors.white, borderRadius: 15,
                         paddingBottom: 10,
                        paddingHorizontal: 25}}>
                      {renderFeedbackTitle(feedbackTitle, autoReviewPopupStyle)}
                      {renderCTA(negative, positive, negativeOnPress, positiveOnPress)}
                  </View>
              </TouchableWithoutFeedback>
          </View>
          </TouchableWithoutFeedback> 
        </View>
    )
}
