import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(50),
    borderRadius: verticalScale(18),
    marginTop:verticalScale(60)
  },
  container:{
    padding:verticalScale(20),
    //marginVertical:30,
    flex:1,
  },
  title:{
    color:Colors.rgb_898d8d,
    alignSelf:'center',
    textAlign:'center',
    marginVertical: verticalScale(10),
    ...Fonts.style.bold_18,
  },
  forgotPwdTitle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_898d8d,
    marginTop: verticalScale(24),
    alignSelf:'center',
  },
  textInput:{
    height: verticalScale(40),
    ...Fonts.style.bold_16,
    marginVertical: verticalScale(15),
    color:Colors.rgb_898d8d,
    paddingHorizontal:Metrics.moderateScale._10,
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  subTitle:{
    color:Colors.rgb_898d8d,
    marginVertical: verticalScale(10),
    marginLeft: Metrics.moderateScale._10,
    ...Fonts.style.regular_14,
  },
})
