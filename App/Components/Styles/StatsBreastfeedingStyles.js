import {StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'

export default StyleSheet.create({
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: verticalScale(30),
  },
  itemHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextWrapperStyle:{
    flex: 1,
    paddingHorizontal: Metrics.moderateScale._5,
  },
  itemTitleStyle: {
    ...Fonts.style.bold_15,
    color: Colors.rgb_898d8d,
  },
  itemContentStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemStatusKeyStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
  },
  itemStatusValueStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
  },
  itemDateTimeStyle: {
    ...Fonts.style.regular_12,
    height: verticalScale(20),
    color: Colors.rgb_898d8d,
  },
  textItemContainer:{ width: 0,flexGrow: 1,flex: 1,}
});

