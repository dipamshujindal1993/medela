import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
 container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingBottom:verticalScale(30)

  },
  textStyle: {
    marginTop: verticalScale(7),
    ...Fonts.style.bold_16,
    color:Colors.rgb_898d8d,
  },
  titleTextStyle: {
    //alignSelf:'flex-start',
    marginHorizontal: Metrics.moderateScale._20,
    //marginTop: verticalScale(5),
    ...Fonts.style.bold_20,
    // color:Colors.rgb_1f0808,
    color: Colors.rgb_898d8d
  },
  touchViewStyle: {
    width:Metrics.moderateScale._90,
    alignItems:'center',
    marginVertical: verticalScale(8),
  },
  imgStyle:{
    width:verticalScale(55),
    height:verticalScale(55)
  },
  imgCloseStyle:{
    width:Metrics.moderateScale._60,
    height:Metrics.moderateScale._60,
    marginTop:verticalScale(10)
  },
  linkIconStyle:{
    width:Metrics.moderateScale._10,
    height:Metrics.moderateScale._10,
    marginVertical: 10
  },
  linkViewStyle:{
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal:Metrics.moderateScale._20,
      marginVertical:verticalScale(10)
  },
  bluetoothViewStyle:{
    flexDirection: 'row',
    marginTop: verticalScale(5)
  },
  momViewStyle:{
   flexDirection: 'row',
    alignSelf:'flex-start',
    width:'100%'
 },
  buttonContainer: {
    minHeight: 48,
    width:Metrics.moderateScale._48,
    justifyContent: 'center'
  },
  buttonTextStyle: {
    ...Fonts.style.bold_14,
    paddingBottom: 1,
    alignSelf: 'center'
  },
  buttonView: {
    backgroundColor:Colors.rgb_d8d8d8,
    borderRadius: 8,
    paddingVertical: verticalScale(2),
    width:Metrics.moderateScale._48,
  }
})
