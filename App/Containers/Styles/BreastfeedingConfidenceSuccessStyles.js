import {I18nManager, StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView:{
    height: verticalScale(25),
    alignItems: "center",
    marginTop: verticalScale(10),
    marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
    alignSelf: 'center'
  },
  contentView:{
    marginTop: verticalScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratsTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_898d8d,
    marginVertical: verticalScale(10),
  },
  congratsSubTitleView:{
    height: verticalScale(50),
    width: Metrics.moderateScale._250,
    justifyContent: "center",
  },
  congratsSubTitleStyle:{
    ...Fonts.style.regular_14,
    color: Colors.rgb_646363,
    textAlign: "center"
  },
  contentSeparatorLine:{
    height: verticalScale(4),
    width: verticalScale(40),
    backgroundColor: Colors.rgb_ffcd00,
    marginVertical: verticalScale(20)
  },
  updateMessageWrapper:{
    height: verticalScale(80),
    width: verticalScale(280),
    alignItems: "center",
  },
  updateMessageText:{
    ...Fonts.style.regular_14,
    color: Colors.rgb_646363,
    textAlign: "center"
  },
  btnWrapper:{
    marginVertical: verticalScale(30),
    alignItems: "center",
  },
  getStartedBtnStyles:{
    height: verticalScale(40),
    width: '80%',
  },
  questionViewStyles: {
    marginHorizontal: Metrics.moderateScale._20,
    marginVertical: verticalScale(10)
  },
  questionTitleStyle: {
    ...Fonts.style.bold_12,
    color: Colors.rgb_646363,
    letterSpacing: 0.23,
    lineHeight: 16,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  }
})