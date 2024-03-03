import {Platform, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  } from '@resources'
import Metrics, {verticalScale} from "../../Resources/Metrics";

export default StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    marginLeft: 10,
    backgroundColor: Colors.white,
    borderWidth: 0,
    borderRadius: 7,
   // shadowOffset: {width: 2, height: 2,},
  //  shadowColor: 'gray',
   // shadowOpacity: 0.3,
    paddingTop:10,
    paddingBottom:10,
    paddingHorizontal: 10,
    justifyContent: 'center',
   /* ...Platform.select({
      android: {
        elevation: 4,
      },
    }),*/
  },
  btnActive: {
    backgroundColor: Colors.rgb_767676,
    alignItems:'center',
    justifyContent: 'space-around'
  },
  btnInactive: {
    backgroundColor: Colors.rgb_f5f5f5,
    alignItems:'center',
    justifyContent: 'space-around'
  },
  btnTextActive: {
    color: Colors.white,
    ...Fonts.style.regular_16,
    alignSelf: 'center',
  },
  btnTextInactive: {
    color: Colors.rgb_898d8d,
    ...Fonts.style.regular_16,
    alignSelf: 'center',
  },
  btnSubTextActive: {
    color: Colors.white,
    ...Fonts.style.regular_12,
    alignSelf: 'center',
  },
  btnSubTextInactive: {
    color: Colors.rgb_898d8d,
    ...Fonts.style.regular_12,
    alignSelf: 'center',
  },

  timeBackground: {
    flexDirection: "row",
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: verticalScale(32),
    width: Metrics.moderateScale._80,
    //backgroundColor: Colors.rgb_898d8d33,
    borderRadius: 8,
    marginRight: 6,
  },
  textInputStyles:{
    ...Fonts.style.bold_14,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d,
  },
});
