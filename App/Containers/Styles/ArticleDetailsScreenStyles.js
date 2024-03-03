import { StyleSheet, Dimensions, I18nManager } from 'react-native'
import {
  Colors,
  Fonts,
  Metrics,
} from '@resources'
import {verticalScale, moderateScale } from "@resources/Metrics";
const window = Dimensions.get('window')
const width = window.width
export default StyleSheet.create({
  container:{
    alignSelf:'center',
    justifyContent:'flex-end',
    width:'100%',
    height:'100%',
    paddingHorizontal:moderateScale(20),
    paddingVertical:verticalScale(40),
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  articleImageView: {
    width: width,
    height: verticalScale(260),
    // overflow: 'hidden',
    backgroundColor: 'white',
    position: 'relative'
  },
  headerIconsView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    // height: verticalScale(50),
    width: "100%",
    overflow: "hidden",
    zIndex: 999,
    borderBottomColor: "#EFEFF4",
    padding: 10,
    backgroundColor: "white"
  },
  articleTitleViewStyles: {
    flex: 1,
    marginHorizontal: moderateScale(20),
    marginVertical: verticalScale(5)
  },
  articleTitleTextStyles: {
    ...Fonts.style.bold_32,
    lineHeight: 37,
    color: Colors.rgb_898d8d,
    textAlign: 'left'
  },
  articleTitleSubtitleTextStyles: {
    ...Fonts.style.bold_17,
    lineHeight: 20,
    color: Colors.rgb_898d8d,
    textAlign: 'left'
  },
  lineViewStyles: {
    marginHorizontal: Metrics.moderateScale._25, 
    backgroundColor: '#ffcd00', 
    height: verticalScale(5), 
    width: Metrics.moderateScale._50, 
    marginBottom: verticalScale(10)
  },
  webviewStyles: {
    flex: 1, 
    width: Dimensions.get('window').width-30, 
    marginHorizontal: Metrics.moderateScale._20, 
    bottom: verticalScale(10), 
    marginTop: verticalScale(10)
  },
  viewLineStyles: {
    marginHorizontal: moderateScale(20), 
    backgroundColor: '#ffcd00', 
    height: verticalScale(5), 
    width: Metrics.moderateScale._60,
    marginBottom: verticalScale(10)
  },
  abstractStyles: {
    flex: 1,
    marginHorizontal: moderateScale(20),
    marginBottom: verticalScale(10)
  },
  abstractTextStyles: {
    lineHeight: 16,
    ...Fonts.style.regular_12,
    textAlign: 'left',
    letterSpacing: 0.29,
    color: Colors.rgb_646363,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  dialogView: {
    marginHorizontal: Metrics.moderateScale._34,
    paddingTop: verticalScale(23),
    paddingBottom: verticalScale(17),
    paddingLeft: Metrics.moderateScale._33,
    paddingRight: Metrics.moderateScale._27,
    borderRadius: 14,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  title: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
    lineHeight: 22
  },
  titleStyles: {
    textAlign: 'center',
    lineHeight: 22,
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
  },
  avatarTextStyles: {
    textAlign: 'center',
    lineHeight: 18,
    ...Fonts.style.bold_15,
    color: Colors.rgb_898d8d,
  },
  selectedIconStyles: {
    right: Metrics.moderateScale._10, 
    top: -5, 
    elevation: 3, 
    position: 'absolute'
  },
  noBtnStyles: {
    height: verticalScale(40),
    marginHorizontal: Metrics.moderateScale._30,
    marginVertical: verticalScale(10),
    borderRadius: 20
  },
  yesBtnStyles: {
    backgroundColor: Colors.white,
    height: verticalScale(40),
    marginHorizontal: Metrics.moderateScale._30,
    marginBottom: verticalScale(10),
    borderRadius: 20
  },
  yesBtnTextStyles: {
    lineHeight: 20.3,
    ...Fonts.style.bold_18,
    textAlign: 'center',
    color: Colors.rgb_898d8d99,
    letterSpacing: 0.8
  },
  noBtnTextStyles: {
    lineHeight: 20.3,
    ...Fonts.style.bold_16,
    textAlign: 'center',
    color: Colors.rgb_000000,
    letterSpacing: 0.8
  },
  popupHeaderTextStyles: {
    lineHeight: 22,
    ...Fonts.style.bold_18,
    textAlign: 'center',
    color: Colors.rgb_898d8d
  },
  popupTitleTextStyles: {
    lineHeight: 16,
    ...Fonts.style.regular_12,
    textAlign: 'center',
    marginHorizontal: moderateScale(30),
    marginVertical: verticalScale(10),
    letterSpacing: 0.29,
    color: Colors.rgb_898d8d
  },
  noFavouriteIconStyles: {
    marginHorizontal: Metrics.moderateScale._10, 
    top: verticalScale(10),
    // height: verticalScale(25),
    // width: Metrics.moderateScale._25
  },
  favouriteIconStyles: {
    // height: verticalScale(55),
    // width: Metrics.moderateScale._55,
    bottom: verticalScale(5)
  },
  headerViewStyles: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
  },
  backIconStyles: {
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  }
  
})
