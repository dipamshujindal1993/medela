import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

import {verticalScale, moderateScale} from "@resources/Metrics";
import { I18nManager } from 'react-native';

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(50),
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    marginHorizontal:moderateScale(20),
    ...Fonts.style.bold_16,
    borderRadius: verticalScale(18),
    marginVertical:verticalScale(40)
  },
  container:{
    width:'100%',
    height: '100%'
  },
  title:{
    fontSize:22,
    color:'rgba(137, 141, 141, 1)',
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:moderateScale(20),
    marginTop: verticalScale(40),
    marginBottom: verticalScale(10),
    ...Fonts.style.bold_18,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
  },
  subTitle:{
    color:'rgba(137, 141, 141, 1)',
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:moderateScale(20),
    marginVertical: verticalScale(10),
    ...Fonts.style.regular_16,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
  },
})
