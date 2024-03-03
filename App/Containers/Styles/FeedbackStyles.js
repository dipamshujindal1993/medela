import {StyleSheet, Dimensions, I18nManager} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
const displayWidth = Dimensions.get('window').width;

import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  container:{
    alignSelf:'center',
    justifyContent:'flex-end',
    width:'100%',
    height:'100%',
    paddingHorizontal:moderateScale(20),
    paddingVertical:verticalScale(40),
  },
  container: {
    flex: 1
  },
  headerView:{
    width: displayWidth/1.7,
    height: verticalScale(25),
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D
  },
  textInput:{
    //height: verticalScale(30),
    width: '100%',
    ...Fonts.style.bold_18,
    marginTop: verticalScale(15),
    color:Colors.rgb_898d8d,
    paddingHorizontal: Metrics.moderateScale._10,
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d,
  },
  sendButtonStyles: {
    alignSelf: 'center',
    width: moderateScale(327),
    height: verticalScale(51),
    paddingVertical: verticalScale(10),
    borderRadius: verticalScale(10),
    backgroundColor:Colors.rgb_fecd00,
    marginVertical: verticalScale(20)
  },
  ratingTextStyle: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_888B8D,
    lineHeight: 22
  },
  feedbackTextStyle: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_888B8D,
    lineHeight: 17,
    //textAlign:I18nManager.isRTL?'right':'left',
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
    
  }, 
  ratingViewStyle: {
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1.5 
  }, 
  feedbackTextViewStyles: {
    flex: 4, 
    marginHorizontal: moderateScale(25)
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  dialogView: {
    marginHorizontal: 34,
    paddingTop: 23,
    paddingBottom: 17,
    paddingLeft: 33,
    paddingRight: 27,
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
  titleStyles: {
    textAlign: 'center',
    lineHeight: 22,
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
  },
  avatarTextStyles: {
    textAlign: 'center',
    lineHeight: 18,
    ...Fonts.style.bold_15,
    color: Colors.rgb_898d8d,
  },
  selectedIconStyles: {
    right: 10, 
    top: -5, 
    elevation: 3, 
    position: 'absolute'
  },
  noBtnStyles: {
    height: verticalScale(40),
    marginHorizontal: moderateScale(30),
    marginVertical: verticalScale(10),
    borderRadius: 20
  },
  yesBtnStyles: {
    backgroundColor: Colors.white,
  },
  yesBtnTextStyles: {
    lineHeight: 20.3,
    ...Fonts.style.bold_18,
    textAlign: 'center',
    color: Colors.rgb_898d8d99,
    letterSpacing: 0.8
  },
  noBtnTextStyles: {
    lineHeight: 20.3,
    ...Fonts.style.bold_16,
    textAlign: 'center',
    color: Colors.rgb_000000,
    letterSpacing: 0.8
  },
  popupHeaderTextStyles: {
    lineHeight: 22,
    ...Fonts.style.bold_18,
    textAlign: 'center',
    color: Colors.rgb_767676
  },
  popupTitleTextStyles: {
    lineHeight: 16,
    ...Fonts.style.regular_12,
    textAlign: 'center',
    marginHorizontal: moderateScale(30),
    marginVertical: verticalScale(10),
    letterSpacing: 0.29
  },
  starsViewStyle:{ 
    marginHorizontal: Metrics.moderateScale._10,
    marginVertical: verticalScale(10)
  }
})