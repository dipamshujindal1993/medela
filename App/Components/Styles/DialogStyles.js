import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts
} from '@resources'

export default StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialogView: {
    marginHorizontal: 34,
    paddingTop: 23,
    paddingBottom: 17,
    paddingHorizontal: 33,
    borderRadius: 14,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  title: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
    lineHeight: 22
  },
  message: {
    ...Fonts.style.regular_12,
    marginTop: 8,
    lineHeight: 16,
    letterSpacing: 0.29,
    color: Colors.rgb_888B8D,
  },
  textInputStyle:{
    ...Fonts.style.regular_17,
    color: Colors.rgb_767676,
    height: 48,
    borderBottomWidth:1,
    borderBottomColor:Colors.rgb_868B8D
  },
  ctaView: {
    marginTop: 24,
  },
  cta: {
    ...Fonts.style.bold_16,
    textAlign: 'center',
    lineHeight: 20.3,
    letterSpacing: 0.8,
    color: Colors.rgb_000000,
    minWidth: 191,
    paddingVertical: 16,
    paddingLeft: 9,
    paddingRight: 8
  },
  cta_posative_container: {
    borderRadius: 12,
  },
  cta_negative_container: {
    backgroundColor: Colors.transparent
  },
  cta_text_negative: {
    color: Colors.rgb_898d8d,
  },
  ctaDisabled: {
    opacity: 0.3
  },
  iosFooter: {
    height: 200
  },
  feedback_positive_container: {
    marginHorizontal: 5,
    width: '50%',
    height: 48,
    borderRadius: 25
  },
  feedback_negative_container: {
    backgroundColor: '#d1d1d2',
    marginHorizontal: 5,
    width: '50%',
    height: 48,
    borderRadius: 25
  },
  feedback_view_container: {
    alignSelf: 'center',
    minHeight: 48
  },
  feedback_title: {
    ...Fonts.style.bold_18,
    textAlign: 'center',
    color: Colors.rgb_000000,
    paddingTop: 10,
    lineHeight: 25
  },
  feedback_button_text: {
    ...Fonts.style.regular_14,
    textAlign: 'center',
    color: Colors.rgb_000000,
    lineHeight: 20.3
  },
  appIcon_style: {
    alignSelf:'center',
    marginVertical: 5,
    width: 70,
    height: 70,
    borderRadius: 20
  }
})
