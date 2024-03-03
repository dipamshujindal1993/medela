import {StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'

export default StyleSheet.create({
  container:{
    flex:1
  },
  listEmptyView: {
    alignItems: 'center',
    flex: 1,
    marginVertical: verticalScale(30)
  },
  emptyListTextStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    marginTop: verticalScale(15)
  },
  standaloneRowFront: {
    flex: 1,
    paddingVertical:verticalScale(10),
    marginHorizontal: 5
  },
  headerList:{
  flex:1,
  flexDirection:'row'
  },
  title:{
    flex:1,
    ...Fonts.style.bold_20,
    color: Colors.rgb_646363,
    marginTop: verticalScale(15),
    marginHorizontal:verticalScale(15)
  },
  counter:{
    ...Fonts.style.bold_20,
    color: Colors.rgb_646363,
    marginTop: verticalScale(15),
    marginHorizontal:verticalScale(15)
  }
});
