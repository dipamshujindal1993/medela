import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'
import { I18nManager } from 'react-native';
const { width, height } = Dimensions.get("window")
export default StyleSheet.create({

  container: {
    flex: 1
  },
  headerView:{
    width: width/1,
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
  vipStatusStyles: {
    ...Fonts.style.bold_17,
    color: Colors.rgb_fecd00,
    marginRight: Metrics.moderateScale._30
    // alignSelf: 'center'
  },
  contentWrapper:{
    flex: 1,
    marginHorizontal: Metrics.moderateScale._25,
  },
  contentHeaderView:{
    height: verticalScale(110),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    marginVertical: verticalScale(20),
  },
  contentHeaderTextView:{
    flex: 2,
    justifyContent: "center",
    paddingHorizontal: Metrics.moderateScale._2,
  },
  diamondImageView:{
    flex: 1,
    alignItems: 'flex-end',
  },
  contentHeaderTextStyle:{
    ...Fonts.style.bold_18,
    color: Colors.rgb_888B8D,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
  },
  verticalListStyle:{
    flexGrow: 1,
  },
  listItemViewStyle:{
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: verticalScale(20)
  },
  itemTextViewStyle:{
    width: Metrics.moderateScale._220,
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
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
  },
  iconWrapper:{
    marginRight: Metrics.moderateScale._8,
    alignSelf: "center",
  },
  btnWrapper:{
    marginVertical: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockNowBtnStyles:{
    ...Fonts.style.regular_15
  },
  connectPumpStyles: {
    height: verticalScale(50),
    width: Metrics.moderateScale._300,
    marginTop: verticalScale(10),
    // marginHorizontal: Metrics.moderateScale._30,
    // marginVertical: verticalScale(2),
    borderRadius: 20
  },
  registerBtnTextStyles: {
    ...Fonts.style.bold_16,
    color: Colors.white
  },
  pumpBtnTextStyles: {
    ...Fonts.style.bold_16,
  },
  registerPumpStyles: {
    height: verticalScale(50),
    width: Metrics.moderateScale._300,
    marginTop: Metrics.moderateScale._10,
    // marginVertical: verticalScale(2),
    borderRadius: 20,
    backgroundColor: Colors.rgb_898d8d99,
    marginBottom: verticalScale(10),
  },
  vipClosetextStyles: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d,
    lineHeight: 20.3,
    textAlign: 'center',
    letterSpacing: 0.8
  },
  bottonContainer: {
    paddingHorizontal: Metrics.moderateScale._24,
  },
  image: {
    alignSelf: 'center',
    width:width,
    height: height/2.5,
    resizeMode: 'contain',
  },
})
