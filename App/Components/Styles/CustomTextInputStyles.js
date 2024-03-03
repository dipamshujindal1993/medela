import { StyleSheet,I18nManager } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import DeviceInfo from 'react-native-device-info'

export default StyleSheet.create({
  label_info: {
    flexDirection: 'row',
  },
  label: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_000000,
  },
  icon: {
    paddingHorizontal: 9.6,
  },
  textInput: {
    ...Fonts.style.regular_17,
    color: Colors.rgb_000000,
    paddingVertical: DeviceInfo.getFontScale() > 1.3 ? 5: 10,
    textAlign:I18nManager.isRTL?'right':'left'
  },
  showHidePassword: {
    ...Fonts.style.regular_14,
    position: 'absolute',
    right: 0,
    bottom: 20,
    padding: 10,
    color: Colors.rgb_767676
  },
  errorMessage: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_e73536,
    marginHorizontal:10,
    marginTop:-15,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...(I18nManager.isRTL&&Platform.OS=='android')&&{marginRight:'auto'}
  },
  counterNumber: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_e73536,
    letterSpacing: 0.3,
    lineHeight: 14,
    textAlign: 'right',
  },
  doneButtonView: {
    width: '100%',
    height: 40, alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: Colors.rgb_F9F8F8,
    paddingRight: 10
  },
  doneButtonText: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_ffcd00,
    letterSpacing: 0.3,
    textAlign: 'right',
  }
})
