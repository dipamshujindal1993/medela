import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(50),
    marginHorizontal:Metrics.moderateScale._20,
    ...Fonts.style.bold_16,
    borderRadius: verticalScale(15),
    marginVertical:verticalScale(40)
  },
  container:{
    flex: 20,
    alignItems:'center',
    width:Metrics.screenWidth
  },
  subTitle:{
    color: Colors.rgb_898d8d,
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:Metrics.moderateScale._20,
    marginTop: verticalScale(15),
    ...Fonts.style.bold_16
  },
  listStyle: {
    marginTop: verticalScale(10),
  },
  deviceName:{
    color: Colors.rgb_898d8d,
    alignSelf:'center',
    textAlign:'center',
    ...Fonts.style.bold_16
  },
  indicatorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:verticalScale(40),
    backgroundColor: 'white'
  },
  indicatorActive: {
    width: verticalScale(7),
    height: verticalScale(7),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.rgb_fecd00,
    marginHorizontal: Metrics.moderateScale._6
  },
  indicatorInactive: {
    width: verticalScale(7),
    height: verticalScale(7),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.rgb_898d8d,
    marginHorizontal: Metrics.moderateScale._6
  },
  bottomViewStyle: {
    width: '100%',
    paddingTop: Metrics.moderateScale._6,
    height:'10%',
  },
  imgStyle:{
    width:verticalScale(60),
    height:verticalScale(60),
    position:'absolute',
  },
})
