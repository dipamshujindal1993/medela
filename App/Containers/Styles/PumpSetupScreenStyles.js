import {Platform, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

import {verticalScale, moderateScale} from "@resources/Metrics";
import { I18nManager } from 'react-native';

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(50),
    marginHorizontal: moderateScale(20),
    ...Fonts.style.bold_18,
    borderRadius: verticalScale(18),
    marginTop: verticalScale(20)
  },
  container:{
    padding:verticalScale(20),
    marginVertical:verticalScale(10),
    marginBottom:verticalScale(140),
    flex: 1
  },
  title:{
    color:Colors.rgb_898d8d,
    alignSelf:'center',
    marginVertical: verticalScale(10),
    textAlign:'center',
    ...Fonts.style.bold_18,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
  },
  subTitle: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(5),
    marginHorizontal:moderateScale(8),
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_16,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
  },
  termsTitle:{
    ...Fonts.style.bold_14,
    color:Colors.rgb_898d8d,
    marginVertical: verticalScale(20),
    alignSelf:'center',
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
    marginHorizontal: moderateScale(5),
    backgroundColor: Colors.white,
    borderWidth: 0,
    borderRadius: verticalScale(10),
    minHeight: 48
    // shadowOffset: { width: 2, height: 2, },
    // shadowColor: 'gray',
    // shadowOpacity: 0.3,
    // ...Platform.select({
    //   android: {
    //     elevation: 4,
    //   },
    // }),
  },
  radioBtnContainerV:{
    width:'95%',
    marginVertical: verticalScale(10),
    backgroundColor: Colors.white,
    borderWidth:0,
    borderRadius: verticalScale(10),
    // shadowOffset:{  width: 2,  height: 2,  },
    // shadowColor: 'gray',
    // shadowOpacity: 0.3,
    // ...Platform.select({
    //   android: {
    //     elevation: 4,
    //   },
    // }),
  },
  textInput:{
    height: verticalScale(40),
    ...Fonts.style.bold_16,
    marginVertical:verticalScale(20),
    color:Colors.rgb_000000,
    borderBottomWidth:1.0
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
    marginHorizontal:moderateScale(5)
  },
  indicatorInactive:{
    width:verticalScale(7),
    height:verticalScale(7),
    borderRadius:verticalScale(50),
    backgroundColor:Colors.rgb_898d8d,
    marginHorizontal:moderateScale(5)
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
  }
})
