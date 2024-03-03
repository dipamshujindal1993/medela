import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView:{
    width: displayWidth/2,
    height: 48,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: verticalScale(10)
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D
  },
  contentView:{
    marginHorizontal: Metrics.moderateScale._8,
  },
  listItemViewStyle:{
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: verticalScale(20)
  },
  itemTextViewStyle:{
    marginVertical: verticalScale(10),
    marginHorizontal: Metrics.moderateScale._20,
  },
  itemTitleTextStyle:{
    ...Fonts.style.bold_15,
    color: Colors.rgb_646363,
    marginBottom: verticalScale(5)
  },
  imageContentView:{
    flexDirection: 'row'
  },
  itemContentTextStyle:{
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
  },
  iconWrapper:{
    marginRight: Metrics.moderateScale._8,
    alignSelf: "center",
  }
});