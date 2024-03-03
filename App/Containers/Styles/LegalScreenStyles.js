import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale, moderateScale } from '@resources/Metrics'
import { I18nManager } from 'react-native';
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView:{
    height: 48,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(5),
    marginHorizontal : moderateScale(20),
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
    position: 'absolute',
    right: 0,
    left: 0,
    textAlign: 'center',
  },
  contentView:{
    flex: 1,
    marginHorizontal: Metrics.moderateScale._25,
  },
  listItemViewStyle:{
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: verticalScale(20)
  },
  itemTextViewStyle:{
    width: Metrics.moderateScale._150,
    alignSelf: "center",
    marginHorizontal: Metrics.moderateScale._20,
  },
  itemTitleTextStyle:{
    ...Fonts.style.bold_15,
    color: Colors.rgb_646363,
    marginBottom: verticalScale(5),
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
  },
  imageContentView:{
    flexDirection: 'row'
  },
  itemContentTextStyle:{
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
  },
  iconWrapper:{
    alignSelf: "center",
  },
  verticalListStyle:{
    flexGrow: 1
  },
})
