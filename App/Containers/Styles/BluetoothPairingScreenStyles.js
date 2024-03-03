import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";
const { width, height } = Dimensions.get("window")

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(50),
    marginHorizontal:moderateScale(20),
    ...Fonts.style.bold_16,
    borderRadius: verticalScale(15),
    marginVertical:verticalScale(40)
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
    alignSelf:'center',
    textAlign:'center',
    color:'rgba(137, 141, 141, 1)',
    marginHorizontal:moderateScale(20),
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
  indicatorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:verticalScale(40)
  },
  indicatorActive: {
    width: verticalScale(7),
    height: verticalScale(7),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.rgb_fecd00,
    marginHorizontal: moderateScale(5)
  },
  indicatorInactive: {
    width: verticalScale(7),
    height: verticalScale(7),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.rgb_898d8d,
    marginHorizontal: moderateScale(5)
  },
  bottomViewStyle: {
    width: '100%',
    position: 'absolute',
    bottom:verticalScale(5),
  },
  imgStyle:{
    width:verticalScale(60),
    height:verticalScale(60),
    position:'absolute',
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
  mainViewStyle:{
    flex:1
  },
  bottomViewErrorStyle:{
    position:'absolute',
    bottom:verticalScale(12),
    width:'100%'
  },
  childViewStyle:{
    height:'95%'
  }



})
