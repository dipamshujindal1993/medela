import {StyleSheet} from 'react-native';
import {Colors, Fonts,metrics} from '@resources';
import {moderateScale, verticalScale} from "../../Resources/Metrics";
import {Metrics} from "../../Resources";

export default StyleSheet.create({
  StopwatchWrapper: {
    height: 200,
    alignItems: 'center',
  },
  StopwatchBtnStyle: {
    alignItems: 'center',
    justifyContent:'center',
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: moderateScale(55),
  },
  StopwatchBtnText: {
    ...Fonts.style.bold_16,
    display: 'flex',
    alignSelf: 'center',
  },
  textInputStyles:{
    ...Fonts.style.regular_16,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_000000,

  },
  textInputStylesCustom:{
    ...Fonts.style.regular_16,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_000000,
    textAlign:'center',
    width: 48,
    height: 48
  },
  textInputLeftStylesCustom:{
    ...Fonts.style.regular_16,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_000000,
    textAlign:'left',
    marginLeft:2,
    width: 48
  },
  textInputRightStylesCustom:{
    ...Fonts.style.regular_16,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_000000,
    textAlign:'right',
    marginRight:3,
    width: 48
  },
  buttonContainer: {
    backgroundColor:Colors.rgb_d8d8d8,
    marginTop:verticalScale(10),
    width:Metrics.moderateScale._50,
    ...Fonts.style.bold_18,
    paddingBottom: 1
  },
  timeBackground: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 48,
    // paddingHorizontal:10,
    borderRadius: 8,
    marginRight: 6,
  },
});
export const options = {
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.rgb_f5f5f5,
    marginVertical: 15,
    borderRadius: 8,
  },
  text: {
    ...Fonts.style.regular_16,
    color: Colors.rgb_898d8d,
  },
};
