import {StyleSheet} from 'react-native';
import {Colors, Fonts,metrics} from '@resources';
import {moderateScale, verticalScale} from "../../Resources/Metrics";

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
    color: Colors.rgb_898d8d,
  },
  timerTextStyle:{
    color: Colors.rgb_70898d8d,
    fontSize: 14,
    marginHorizontal: 10
  }
});
export const options = {
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    paddingHorizontal:20,
    borderRadius: 8,
  },
  text: {
    ...Fonts.style.regular_16,
    color: Colors.rgb_898d8d,
  },
};
