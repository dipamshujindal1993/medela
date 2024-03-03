import {StyleSheet,Platform, I18nManager,Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import {verticalScale, moderateScale} from "@resources/Metrics";
const displayWidth = Dimensions.get('window').width;
const displayHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    position: 'absolute',
    bottom: verticalScale(30),
    alignSelf: 'center',
    marginHorizontal: Metrics.moderateScale._30,
  },
  sleepView: {
    height: verticalScale(180),
    //marginHorizontal: Platform.OS==='ios'?31:30,
    marginVertical:verticalScale(10),
  },
  durationTextStyle: {
    ...Fonts.style.bold_16,
    marginHorizontal: Metrics.moderateScale._40,
    marginVertical: verticalScale(15),
    color: Colors.rgb_646363,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  editDurationTextStyle: {
    ...Fonts.style.bold_16,
    marginHorizontal: Metrics.moderateScale._25,
    marginTop: verticalScale(40),
    color: Colors.rgb_646363,
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
    backgroundColor:Colors.rgb_fecd00,
    minHeight: 48
  },
  saveTextStyle: {
    ...Fonts.style.bold_16,
  },
  textInputWrapperStyle:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.rgb_f5f5f5,
    borderRadius: verticalScale(7),
    width: Metrics.moderateScale._95,
    height: Platform.OS==='ios'?verticalScale(31):verticalScale(35),
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d,
    alignSelf: "center",
    marginTop:5,
    marginLeft: verticalScale(10),
  },
  heightInputStyle: {
    ...Fonts.style.bold_15,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d,
    textAlign: 'center',
    height: Platform.OS==='ios'?verticalScale(34):verticalScale(38),
    paddingRight:10,
  },
  textUnitsStyles:{
    ...Fonts.style.bold_16,
    position: 'relative',
    right: Metrics.moderateScale._10,
    alignSelf: 'center',
    color: Colors.rgb_898d8d,
  },
  addNoteTextInput: {
    flexGrow: 1,
    ...Fonts.style.bold_16,
    marginVertical: verticalScale(20),
    color: Colors.rgb_898d8d,
    paddingHorizontal: Metrics.moderateScale._10,
    marginHorizontal: Metrics.moderateScale._20,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1.0,
    borderColor: Colors.rgb_898d8d,
  },
  modelStyles: {
    backgroundColor: Colors.white,
    position: 'absolute',
    top: verticalScale(5),
    paddingBottom: verticalScale(50),
    height: displayHeight,
    width: displayWidth,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    bottom: 0,
    elevation: 6,
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  }
});
