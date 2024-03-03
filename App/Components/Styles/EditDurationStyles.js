import {Platform, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  } from '@resources'
import Metrics, {verticalScale} from "../../Resources/Metrics";

export default StyleSheet.create({
  btnContainer: {
    //flexDirection: 'row',
    marginLeft: 10,
    alignItems:'center',
    backgroundColor: Colors.white,
    borderWidth: 0,
    borderRadius: 7,
   // shadowOffset: {width: 2, height: 2,},
  //  shadowColor: 'gray',
   // shadowOpacity: 0.3,
    height: 30,
    paddingHorizontal: 10,
    justifyContent: 'center',
   /* ...Platform.select({
      android: {
        elevation: 4,
      },
    }),*/
  },
  btnActive: {
    backgroundColor: Colors.rgb_898d8d,
    alignItems:'center',
   justifyContent: 'space-around'
  },
  btnInactive: {
    backgroundColor: Colors.rgb_f5f5f5,
    //alignItems:'center',

    justifyContent: 'center'
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 48,
    // width: Metrics.moderateScale._100,
    borderRadius: 8,
    // marginRight: 6,
  },
  timeBackgroundCustom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: verticalScale(33),
    width: Metrics.moderateScale._80,
    borderRadius: 8,
  },
  textInputStyles:{
    ...Fonts.style.bold_14,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d
  },
  textInputStylesCustom:{
    ...Fonts.style.bold_14,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d,
    height:verticalScale(30),
    width:48,
    textAlign:'center'
  },
  sleepViewStyle:{
    flexDirection: 'column',flex:1,justifyContent:'center'
  },
  otherViewStyle:{
    flexDirection: 'row',
  },
  timerTextStyles:{
  marginBottom:verticalScale(5),color: (Colors.rgb_000000)
  }
});
