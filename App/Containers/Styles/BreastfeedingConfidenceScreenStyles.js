import {StyleSheet, Dimensions, Platform, I18nManager} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale,moderateScale } from '@resources/Metrics'
const displayWidth = Dimensions.get('window').width;
const isAndroid=Platform.OS=="android"
export default StyleSheet.create({
  container: {
    flex:1,
  },
  headerView:{
    width: displayWidth/1.4,
    height: verticalScale(25),
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: verticalScale(10),
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
  },
  contentViewStyle:{
    marginHorizontal: Metrics.moderateScale._30,
  },
  motivationTextViewStyle:{
    marginVertical: verticalScale(15),
  },
  motivationTextStyle:{
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
    alignSelf: "center",
    marginBottom: verticalScale(3)
  },
  contentListView:{
    flex: 1,
    paddingBottom: verticalScale(20)
  },
  itemViewStyle:{
    alignItems: 'center',
    marginTop: verticalScale(10)
  },
  itemQuesView:{
    flexDirection: "row",
    marginBottom: verticalScale(10)
  },
  itemIndexViewStyle:{
    backgroundColor: Colors.rgb_e7e8e8,
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(23),
    width: Metrics.moderateScale._24,
    borderRadius: 20,
    marginRight: Metrics.moderateScale._10,
    marginTop: verticalScale(2)
  },
  itemIndexTextStyle:{
    ...Fonts.style.bold_14,
    color: Colors.rgb_646363,
  },
  itemQuesTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d,
    marginBottom: verticalScale(10),
    marginTop: verticalScale(2),
    width: Metrics.moderateScale._300,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  sliderWrapper:{
    width: Metrics.moderateScale._300,
  },
  sliderViewStyle:{
    width: '110%',
    zIndex: 9999,
    marginLeft: -12,
    // height: verticalScale(40),
  },
  stepViewStyle:{
    position: "absolute",
    top: isAndroid ? 0 : '35%',
    flexDirection: 'row',
    justifyContent: "space-between",
    width: Metrics.moderateScale._295,
  },
  stepStyle:{
    width: '100%',
    height: 4,
    backgroundColor: Colors.rgb_e7e8e8,
    top: 4,
    position: 'absolute',
  },
  sliderTextValues:{
    width:moderateScale(isAndroid?337:340),
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop:isAndroid?Metrics.moderateScale._7:0
  },
  sliderTextStyle:{
    ...Fonts.style.regular_12,
    width: Metrics.moderateScale._55,
    height: verticalScale(40),
    paddingLeft: Metrics.moderateScale._3,
    textAlign: 'center',
  },
  submitButtonStyles: {
    alignSelf: 'center',
    width: '80%',
    paddingVertical: verticalScale(10),
    borderRadius: 10,
    backgroundColor:Colors.rgb_fecd00,
    marginBottom: verticalScale(20),
    minHeight: 48
  },
  submitTextStyle: {
    ...Fonts.style.bold_16,
  },
  backIconStyle: {
    height: 48,
    width: 48,
    justifyContent: 'center'
  },
});
