import {StyleSheet, I18nManager} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  container: {
    paddingVertical:verticalScale(20),
    flex:1
  },
  durationTextStyle: {
    ...Fonts.style.bold_16,
    marginLeft: Metrics.moderateScale._24,
    color: Colors.rgb_646363,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  sleepView: {
    display: 'flex',
    alignSelf: 'center',
    width: verticalScale(150),
    height: verticalScale(150),
    marginTop: verticalScale(10),
  },
  sleepTimerViewStyle: {
    width: verticalScale(120),
    height: verticalScale(120),
    borderRadius: verticalScale(65),
    backgroundColor: Colors.rgb_d8d8d8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  TimerStyle: {
    borderRadius: verticalScale(7),
    paddingVertical: verticalScale(7),
    marginTop: verticalScale(10),
    width: Metrics.moderateScale._100,
    backgroundColor: Colors.rgb_f5f5f5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startTimerStyle: {
    ...Fonts.style.regular_16,
    color: Colors.black,
  },
  stopTimerStyle: {
    ...Fonts.style.regular_16,
    color: Colors.white,
  },
  timerTextStyle: {
    ...Fonts.style.regular_16,
    color: Colors.rgb_898d8d,
  },

  addNoteTextInput: {
    flexGrow: 1,
    ...Fonts.style.bold_16,
    marginTop: verticalScale(10),
    color: Colors.rgb_898d8d,
    paddingHorizontal: moderateScale(10),
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1.0,
    borderColor: Colors.rgb_898d8d,
    marginHorizontal: moderateScale(30),
  },
  bottomView: {
    position: 'absolute',
    bottom: verticalScale(30),
    left: moderateScale(10),
  },
  cancelSaveView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButtonStyles: {
    marginTop: verticalScale(10),
    width: '45%',
    backgroundColor: Colors.rgb_767676,
    borderRadius: verticalScale(10),
    minHeight: 48
  },
  cancelTextStyle: {
    color: 'white',
    ...Fonts.style.bold_16,
  },
  saveButtonStyles: {
    marginTop: verticalScale(10),
    width: '45%',
    borderRadius: verticalScale(10),
    minHeight: 48
  },
  saveTextStyle: {
    ...Fonts.style.bold_16,
  },

  durationView:{
    marginTop:verticalScale(30),
    marginHorizontal: moderateScale(24),
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  durationStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
  },
});
