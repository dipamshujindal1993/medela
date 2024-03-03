import {Platform, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'

import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(50),
    marginHorizontal: Metrics.moderateScale._20,
    ...Fonts.style.bold_18,
    borderRadius: verticalScale(18),
    marginTop: verticalScale(20)
  },
  container:{
    padding:verticalScale(20),
    marginVertical:verticalScale(10),
    flex: 1,
    marginBottom:verticalScale(150),
  },
  title:{
    color:Colors.rgb_00000,
    alignSelf:'center',
    marginVertical: verticalScale(10),
    textAlign:'center',
    ...Fonts.style.bold_18,
  },
  subTitle: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(5),
    marginHorizontal:Metrics.moderateScale._8,
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_16,
  },
  dropDownTitle: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    marginHorizontal:Metrics.moderateScale._8,
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_16,
    marginStart:Metrics.moderateScale._10,
  },
  termsTitle:{
    ...Fonts.style.bold_14,
    color:Colors.rgb_898d8d,
    marginVertical: verticalScale(20),
    alignSelf:'center',
  },
  radioBtnActive:{
    height:verticalScale(48),
    backgroundColor: Colors.rgb_898d8d,
  },

  radioBtnInactive:{
    height:verticalScale(48),
    backgroundColor: Colors.rgb_f5f5f5,
  },
  radioBtnTextActive:{
    color: Colors.white,
    ...Fonts.style.regular_14,
    alignSelf: 'flex-start',
  },
  radioBtnTextInactive:{
    color: Colors.rgb_898d8d,
    ...Fonts.style.regular_14,
    alignSelf: 'flex-start'
  },
  radioGroupStyle:{
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
  radioBtnContainer: {
    flex: 1,
    marginHorizontal: Metrics.moderateScale._5,
    backgroundColor: Colors.white,
    borderWidth: 0,
    borderRadius: verticalScale(10)
  },
  radioBtnContainerV:{
    width:'95%',
    marginVertical: verticalScale(10),
    backgroundColor: Colors.white,
    borderWidth:0,
    borderRadius: verticalScale(10)
  },
  textInput:{
    height: verticalScale(48),
    ...Fonts.style.bold_16,
    marginVertical:verticalScale(18),
    color:Colors.rgb_898d8d,
    paddingHorizontal:verticalScale(10),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  indicatorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:verticalScale(20)
  },
  indicatorActive:{
    width:verticalScale(7),
    height:verticalScale(7),
    borderRadius:verticalScale(50),
    backgroundColor:Colors.rgb_fecd00,
    marginHorizontal:Metrics.moderateScale._5
  },
  indicatorInactive:{
    width:verticalScale(7),
    height:verticalScale(7),
    borderRadius:verticalScale(50),
    backgroundColor:Colors.rgb_898d8d,
    marginHorizontal:Metrics.moderateScale._5
  },
  bottomViewStyle: {
    width: '100%',
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(50),
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    backgroundColor:'white'
  },
  modal: {
    height: Metrics.screenHeight,
    width: Metrics.screenWidth,
    position: 'absolute',
    top:0,
    left:0,
    backgroundColor: '#ededed',
    justifyContent: 'center',
  },
  dropDownStyle:{
    position:'absolute',
    right:0,
    bottom:verticalScale(15)
  },
  lineStyle:{
    backgroundColor:Colors.rgb_898d8d,
    height:verticalScale(0.8),
    marginHorizontal:Metrics.moderateScale._5,
    marginBottom:verticalScale(10)
  }
})
