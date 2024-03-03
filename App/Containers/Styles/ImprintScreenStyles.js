import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'
import { I18nManager } from 'react-native';
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView:{
    width: displayWidth/1.9,
    height: 48,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
    alignSelf: 'center'
  },
  contentView:{
    flex: 1,
    marginLeft: Metrics.moderateScale._15,
  },
  contentHeaderView:{
    marginTop: verticalScale(10),
    marginLeft: Metrics.moderateScale._12
  },
  versionTextStyle:{
    ...Fonts.style.regular_15,
    color: Colors.rgb_888B8D,
    marginTop : verticalScale(10),
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  }
})
