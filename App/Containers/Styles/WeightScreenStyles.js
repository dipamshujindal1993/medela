import {I18nManager, Platform, StyleSheet} from 'react-native';
import {Colors, Fonts,Metrics} from '@resources';
import {verticalScale, moderateScale} from "@resources/Metrics";
import DeviceInfo from 'react-native-device-info'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    position: 'absolute',
    bottom: 30,
    marginHorizontal: 30,
    alignSelf: 'center',
  },
  sleepView: {
    height: 170,
    //marginHorizontal: Platform.OS==='ios'?31:30,

  },
  durationTextStyle: {
    ...Fonts.style.bold_16,
    marginHorizontal: 40,
    color: Colors.rgb_646363,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  editDurationTextStyle: {
    ...Fonts.style.bold_16,
    marginHorizontal: 40,
    marginTop: 40,
    color: Colors.rgb_646363,
  },
  cancelSaveView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButtonStyles: {
    marginTop: 10,
    width: '45%',
    paddingVertical: 12,
    backgroundColor: Colors.rgb_898d8d,
    borderRadius: 10,
  },
  cancelTextStyle: {
    color: 'white',
    ...Fonts.style.bold_16,
  },
  saveButtonStyles: {
    marginTop: 10,
    width: '45%',
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveTextStyle: {
    ...Fonts.style.bold_16,
  },
  textInputWrapperStyle:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.rgb_898d8d33,
    borderRadius: verticalScale(7),
    width: DeviceInfo.getFontScale() > 1.3 ? 120 : Metrics.moderateScale._95,
    height: 48,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d,
    alignSelf: "center",
    marginTop:5
  },
  weightInputStyle: {
    ...Fonts.style.bold_16,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d,
    textAlign: 'center',
    height: 48,
    width:DeviceInfo.getFontScale() > 1.3 ?'auto':moderateScale(50),
    marginLeft:DeviceInfo.getFontScale() > 1.3 ?7:null,
  },
  textUnitsStyles:{
    ...Fonts.style.bold_16,
    width: DeviceInfo.getFontScale() > 1.3 ? 55:20,
    alignSelf: 'center',
    color: Colors.rgb_898d8d,
    marginLeft:DeviceInfo.getFontScale() > 1.3 ?7:null,
    textAlign:DeviceInfo.getFontScale() > 1.3 ?'center':null
  },
  addNoteTextInput: {
    flexGrow: 1,
    ...Fonts.style.bold_16,
    marginTop: 10,
    color: Colors.rgb_898d8d,
    paddingHorizontal: 10,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1.0,
    borderColor: Colors.rgb_898d8d,
    marginHorizontal: 30,
  },
});
