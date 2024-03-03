import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";
const { width, height } = Dimensions.get("window")

export default StyleSheet.create({
  buttonContainer: {
    height: moderateScale(50),
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
    marginTop:verticalScale(40),
    backgroundColor: Colors.transparent
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
  mainViewStyle:{
    flex:1
  }


})
