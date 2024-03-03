import { StyleSheet, Dimensions } from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources';
import {verticalScale, moderateScale} from "@resources/Metrics";
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1
  },
  headerView:{
    width: displayWidth/2,
    height: verticalScale(25),
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._10,
    marginBottom: 10
  },
  chatHeading: {
    flex: 1.2,
    marginTop: verticalScale(5),
    marginHorizontal: moderateScale(20),
    justifyContent: 'center',
  },
  chatHeadingTextStyle: {
    ...Fonts.style.bold_22,
    lineHeight: 26,
    color: Colors.rgb_888B8D,
    textAlign: 'left'
  },
  chatContentStyle: {
    ...Fonts.style.regular_16,
    lineHeight: 19,
    color: Colors.rgb_646363,
    textAlign: 'left'
  },
  listItemViewStyle:{
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  itemTextViewStyle:{
    // marginVertical: verticalScale(10),
    // marginHorizontal: Metrics.moderateScale._20,
  },
  itemTitleTextStyle:{
    ...Fonts.style.bold_15,
    color: Colors.rgb_646363,
    marginBottom: verticalScale(5),
    lineHeight: 18,
    marginRight: 'auto'
  },
  imageContentView:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContentTextStyle:{
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
    marginRight: 'auto'
  },
  disclaimerTextStyles: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    textAlign: 'center',
    lineHeight: 19,
  },
  contentView:{
    width: displayWidth/1.15,
    height: verticalScale(70),
    backgroundColor: Colors.rgb_f5f5f5,
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginTop: verticalScale(20)
  },
  iconWrapper:{
    marginRight: verticalScale(10),
    alignSelf: "center",
  },
  editAvatarViewStyles:{
    marginTop:10,
    justifyContent: 'center',
    height: 48
  },
  editAvatarStyles: {
    lineHeight: 16,
    ...Fonts.style.bold_12,
    color: Colors.rgb_898d8d,
    textAlignVertical: 'center',
    height: 48,
  },
  viewLineStyles: {
    marginHorizontal: moderateScale(25),
    backgroundColor: Colors.rgb_ffcd00,
    height: verticalScale(5),
    width: Metrics.moderateScale._50,
    margin: moderateScale(10)
  },
  disclaimerViewStyles: {
    marginHorizontal: moderateScale(25),
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: verticalScale(20)
  },
  chatContentViewStyle: {
    flex: 6,
    marginHorizontal: Metrics.moderateScale._25
  },
  headerTitleView:{
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Metrics.moderateScale._30,
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_22,
    color: Colors.rgb_888B8D
  },
  arabicTextStyles: {
    color: Colors.rgb_ffcd00,
    ...Fonts.style.bold_32
  },
  blurViewStyles: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
})
