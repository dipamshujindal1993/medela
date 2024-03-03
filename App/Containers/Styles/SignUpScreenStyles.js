import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(50),
    borderRadius: verticalScale(18),
    marginVertical:verticalScale(40),
    ...Fonts.style.bold_18,
  },
  container:{
    padding:verticalScale(20),
    marginVertical:verticalScale(10),
    flex:1,
  },
  title:{
    alignSelf:'center',
    textAlign:'center',
    marginVertical: verticalScale(10),
    ...Fonts.style.bold_18,
  },
  termsTitle:{
    ...Fonts.style.regular_14,
    marginVertical: verticalScale(20),
    alignSelf:'center',
    textAlignVertical: 'center',
    height: 48
  },
  privacy:{
    ...Fonts.style.bold_14,
    color:Colors.rgb_fecd00,
    marginVertical: verticalScale(20),
  },
  textInput:{
    height: 48,
    paddingVertical: verticalScale(5),
    ...Fonts.style.bold_16,
    marginVertical:verticalScale(15),
    paddingHorizontal:verticalScale(10),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  switch:{
    height: 48,
    width: 48
  }
})
