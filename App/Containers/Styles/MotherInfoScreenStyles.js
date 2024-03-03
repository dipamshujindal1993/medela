import {StyleSheet, Dimensions, I18nManager} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale, moderateScale } from '@resources/Metrics'
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView:{
    width: displayWidth/1.6,
    height: 48,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._8,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
    alignSelf: 'center'
  },
  backToWorkDateTextStyle:{
    ...Fonts.style.bold_18,
    color: Colors.rgb_888B8D,
    marginTop:verticalScale(20),
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  contentView:{
    flex: 1,
    marginHorizontal: Metrics.moderateScale._25,
  },
  imageWrapper:{
    maxHeight: verticalScale(220),
    marginVertical: verticalScale(10),
    backgroundColor: Colors.rgb_898d8d,
    borderBottomLeftRadius: verticalScale(20),
    borderBottomRightRadius: verticalScale(20),
    ...Platform.select({
      ios: {
        shadowColor: Colors.rgb_000000,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.8,
        shadowRadius: verticalScale(2),
      },
      android: {
        elevation: verticalScale(15),
      },
    }),
  },
  imageStyle:{
    height: verticalScale(220),
    width: displayWidth,
    borderBottomLeftRadius: verticalScale(20),
    borderBottomRightRadius: verticalScale(20),
    overflow: 'hidden',
  },
  textInput:{
    ...Fonts.style.bold_16,
    width: Metrics.percentage._100,
    marginTop: verticalScale(15),
    color:Colors.rgb_898d8d,
    paddingHorizontal: Metrics.moderateScale._10,
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth: verticalScale(1),
    borderColor:Colors.rgb_898d8d,
  },
  textInputStyle:{
    width: Metrics.percentage._100,
    marginBottom: 8
  },
  buttonStyle:{
    width: Metrics.moderateScale._78,
    height: verticalScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Metrics.moderateScale._10,
    marginVertical: verticalScale(10),
    backgroundColor: Colors.rgb_f5f5f5,
    borderRadius: Metrics.moderateScale._10,
  },
  buttonTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d
  },
  deleteBtnWrapper:{
    flex: 1,
    position: "absolute",
    bottom: verticalScale(0),
    width: Metrics.percentage._85,
  },
  deleteButtonStyles: {
    paddingVertical: verticalScale(10),
    backgroundColor:Colors.white,
  },
  deleteTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d
  },
  switchItemView:{
    flexDirection: 'row',
    width: Metrics.percentage._100,
    marginTop: verticalScale(5),
  },
  switchTitleView:{
    width: Metrics.percentage._80,
    justifyContent: 'center',
    marginHorizontal: Metrics.moderateScale._10,
  },
  switchTextStyle: {
    ...Fonts.style.bold_16,
    color:Colors.rgb_898d8d,
  },
  btnView:{
    position: "absolute",
    bottom: verticalScale(80),
    height: verticalScale(48),
    width: Metrics.percentage._100,
  },
  pregnancyBtnStyles:{
    height: verticalScale(40),
  },
  pregnancyBtnTextStyle:{
    ...Fonts.style.bold_16,
  },
  logOutBtnStyles:{
    backgroundColor: Colors.rgb_767676,
    height: verticalScale(40),
    marginVertical: verticalScale(50)
  },
  logOutBtnTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.white
  },
  mainContent:{
    flex: 1,
    alignItems: "center",
    alignSelf: 'center',
    width: Metrics.percentage._85,
  },
  btnWrapper:{
    marginVertical: verticalScale(20),
  },
  unlockNowBtnStyles:{
    height: verticalScale(40),
  },
  textInput:{
    width: Metrics.percentage._100,
    ...Fonts.style.bold_16,
    marginTop: verticalScale(8),
    color:Colors.rgb_898d8d,
    paddingHorizontal: Metrics.moderateScale._10,
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth: verticalScale(1),
    borderColor:Colors.rgb_898d8d,
  },
  passwordTextInput:{
    height: verticalScale(40),
    ...Fonts.style.bold_16,
    marginBottom:verticalScale(15),
    color:Colors.rgb_898d8d,
    paddingHorizontal:verticalScale(10),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  changePasswordView: {
    height: verticalScale(200), 
    width: displayWidth, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: moderateScale(35)
  },
  changePasswordText: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_888B8D
  }
})
