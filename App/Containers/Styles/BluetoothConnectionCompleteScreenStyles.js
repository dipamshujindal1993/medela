import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";
const { width, height } = Dimensions.get("window")

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(40),
    marginHorizontal:moderateScale(20),
    ...Fonts.style.bold_16,
    borderRadius: verticalScale(15),
    marginVertical:verticalScale(30)
  },
  container:{
    marginVertical:verticalScale(10),
    height:width,
    width:width,
    justifyContent:'center',
    alignItems:'center'
  },
  subTitle:{
    color:'rgba(137, 141, 141, 1)',
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:moderateScale(20),
    paddingVertical: verticalScale(20),
    ...Fonts.style.bold_16
  },
  stepsTitle:{
    color:'rgba(137, 141, 141, 1)',
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:moderateScale(20),
    paddingVertical:verticalScale(5),
    ...Fonts.style.regular_12
  },
  inputTitle:{
    color:'rgba(137, 141, 141, 1)',
    textAlign:'left',
    marginHorizontal:moderateScale(30),
    paddingVertical:verticalScale(5),
    ...Fonts.style.regular_12
  },
  deviceName:{
    color:'rgba(137, 141, 141, 1)',
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:moderateScale(20),
    paddingVertical: verticalScale(20),
    ...Fonts.style.regular_16
  },
  bottomViewStyle: {
    width: '100%',
    paddingTop: 5,
    height:'10%',
  },
  imgStyle:{
    width:moderateScale(60),
    height:verticalScale(60),
    position:'absolute',
  },
  textInput:{
    height: verticalScale(40),
    ...Fonts.style.bold_16,
    backgroundColor:Colors.white,
    marginHorizontal: verticalScale(15),
    color:Colors.rgb_898d8d,
    paddingHorizontal:verticalScale(10),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  progressBarView:{
    backgroundColor: 'rgba(245, 245, 245, 0.9)',
    height: verticalScale(50),
    marginHorizontal: moderateScale(20),
    ...Fonts.style.bold_16,
    borderRadius: verticalScale(15),
    marginVertical: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressSlider:{
    backgroundColor: Colors.rgb_fecd00 ,
    height: '100%',
    position: 'absolute',
    left: 0,
    ...Fonts.style.bold_16,
    borderRadius: verticalScale(15),
  },
  progressTextStyle:{
    position: 'absolute',
    ...Fonts.style.bold_16
  },

})
