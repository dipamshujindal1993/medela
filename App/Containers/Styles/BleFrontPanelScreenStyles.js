import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import {verticalScale} from "@resources/Metrics";
const { width, height } = Dimensions.get("window")

export default StyleSheet.create({
  mainContainer:{
    backgroundColor:Colors.rgb_f9f9f8,
    flex: 1,
  },
  container:{
    flex: 1,
    paddingTop: verticalScale(30),
    height:height,
    width:width,
    alignItems:'center',
    backgroundColor:Colors.rgb_f9f9f8,
    justifyContent: "center",
  },
  subTitle:{
    color: Colors.rgb_898d8d,
    marginHorizontal: Metrics.moderateScale._5,
    paddingVertical: verticalScale(5),
    ...Fonts.style.bold_14,
    alignSelf: 'center',
    lineHeight: 17,
  },
  imgStyle:{
    resizeMode:'contain',
    flex: 1,
    height:height,
    width:width,
  },

})
