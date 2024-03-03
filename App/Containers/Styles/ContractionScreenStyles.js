import {Platform, Dimensions, StyleSheet, I18nManager} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';

const WIDTH = Dimensions.get('window').width;

const windowWidth = Dimensions.get('window').width;
import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  container: {
    flex:1
  },
  buttonContainer: {
    height: verticalScale(50),
    marginHorizontal: moderateScale(20),
    ...Fonts.style.bold_18,
    borderRadius: verticalScale(18),
    marginTop: verticalScale(40)
  },
  durationTextStyle: {
    ...Fonts.style.bold_16,
    marginLeft: Metrics.moderateScale._24,
    color: Colors.rgb_646363,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  durationTimerView: {
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(10),
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
    marginHorizontal: moderateScale(20),
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
    paddingVertical: verticalScale(12),
    backgroundColor: Colors.rgb_898d8d,
    borderRadius: verticalScale(10),
  },
  cancelTextStyle: {
    color: 'white',
    ...Fonts.style.bold_16,
  },
  saveButtonStyles: {
    marginTop: verticalScale(10),
    width: '45%',
    paddingVertical: verticalScale(12),
    borderRadius: verticalScale(10),
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
  radioBtnActive:{
    backgroundColor: Colors.rgb_898d8d,
    height:verticalScale(40),
  },

  radioBtnInactive:{
    backgroundColor: Colors.rgb_f5f5f5,
    height:verticalScale(40),
  },
  radioBtnTextActive:{
    color: Colors.white,
    ...Fonts.style.regular_14,
    alignSelf: 'center',
  },
  radioBtnTextInactive:{
    color: Colors.rgb_898d8d,
    ...Fonts.style.regular_14,
    alignSelf: 'center'
  },
  radioGroupStyle:{
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
  radioBtnContainer: {
    justifyContent:'center',
    alignItems:'center',
    width:windowWidth/4.2,
    height:verticalScale(40),
    paddingHorizontal: 0,
    borderRadius: verticalScale(10),
    marginVertical: verticalScale(5),
    marginHorizontal: verticalScale(5),
  },
  StopwatchBtnStyle: {
    alignItems: 'center',
    justifyContent:'center',
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: moderateScale(55),
  },
  StopwatchBtnText: {
    ...Fonts.style.bold_16,
    display: 'flex',
    alignSelf: 'center',
  },
  frequencyViewStyle:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  timerBgStyle:{
    backgroundColor: Colors.rgb_f5f5f5,
    borderRadius: 10,
    padding: 10,
    flex: 2,
    marginEnd: 20,
    alignItems: 'center'
  },
  painStyle:{
    marginTop: 20,
    alignItems:'center'
  },
  userDetailsStyle:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.rgb_898d8d,
    flex: 1
  },
  popupStyle:{
    width: '90%',
    marginHorizontal: 34,
    paddingTop: 23,
    paddingBottom: 17,
    paddingVertical: 33,
    borderRadius: 14,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowOffset: {width: 0, height: 6},
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  resetViewStyle:{
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  addNoteTextInputEdit: {
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
    marginHorizontal: moderateScale(20),
  },
});
