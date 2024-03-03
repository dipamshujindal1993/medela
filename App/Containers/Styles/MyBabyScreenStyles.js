import {Dimensions, I18nManager, Platform, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";

const window = Dimensions.get('window')
const width = window.width
export default StyleSheet.create({

  container: {
    flex: 1
  },
  relativeStyle: {
    position: 'relative'
  },
  header: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    height:40
  },

  headerView: {
    flex: 1,
    justifyContent: 'center'
  },
  headerTextStyle: {
    ...Fonts.style.bold_22,
    textAlign: 'center',
    justifyContent: 'center',
    marginHorizontal : Metrics.moderateScale._15
  },
  headerRightView: {
    marginHorizontal: moderateScale(10),
    height: 56,
    alignItems: 'flex-end',
    justifyContent:'center'
  },

  babyImageView: {
    width: width,
    position: 'relative',
    borderBottomLeftRadius: moderateScale(35),
    borderBottomRightRadius: 35,
    overflow: 'hidden',
    backgroundColor: 'white',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  babyImageInnerContainer:{
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  babyNameTextView: {
    // color: Colors.rgb_898d8d,
    color: Colors.rgb_000000,
    ...Fonts.style.bold_32,
    textShadowColor: 'rgba(193,195,195,0.2)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: verticalScale(10),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    ...I18nManager.isRTL&&{marginRight:'auto'}
  },
  babyAgeTextView: {
    marginTop: verticalScale(10),
    color: Colors.rgb_000000,
    ...Fonts.style.regular_22,
    textShadowColor: 'rgba(137, 141, 141, 0.10)',
    textShadowRadius: verticalScale(10),
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'
  },
  switchView: {
    borderRadius: verticalScale(7),
    flex:1,
    alignSelf:'flex-start',
    //width: moderateScale(80),
    padding: verticalScale(15),
    marginTop: verticalScale(10),
    backgroundColor: Colors.white
  },
  switchTextView: {
    flex:1,
    color: Colors.rgb_000000,
    ...Fonts.style.bold_14,
    paddingHorizontal:verticalScale(5)
  },

  sliderStyle: {
    width: '70%',
    height: verticalScale(25),
    marginTop: verticalScale(10),
    marginLeft: Platform.OS == 'ios' ? 0 : moderateScale(-10),
    ...Platform.select({
      android: {
        marginLeft: moderateScale(-10)
      },
    }),
    transform: [{scaleY: 3}]
  },
  babyBottomView: {
    flexDirection: 'row',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  birthView1: {
    flex: 1.2,
    height: verticalScale(57),
    borderBottomLeftRadius: verticalScale(25),
    backgroundColor: Colors.rgb_898d8d,
    ...Fonts.style.regular_12,
    justifyContent: 'center',
  },
  birthView2: {
    flex: 2.8,
    height: verticalScale(57),
    paddingVertical: verticalScale(5),
    borderBottomRightRadius: 35,
    backgroundColor: Colors.white,
    opacity: 0.8,
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20)

  },

  babyBirthStaticView: {
    position: 'absolute',
    zIndex: 9999,
    width: verticalScale(25),
    height: verticalScale(25),
    borderRadius: verticalScale(10),
    top: verticalScale(10)
  },

  monthBeforeText: {
    ...Fonts.style.regular_8,
    color: Colors.rgb_898d8d,
  },
  eggStyle: {
    alignSelf: 'center',
  },

  rubberTextView: {
    color: Colors.rgb_000000,
    ...Fonts.style.bold_15,
    justifyContent: 'center',
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...I18nManager.isRTL&&{marginRight:'auto'}
  },
  volumeTextView: {
    color: Colors.rgb_000000,
    ...Fonts.style.regular_15,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...I18nManager.isRTL&&{marginRight:'auto'}
  },
  readerMoreView: {
    backgroundColor: Colors.rgb_fecd00,
    alignItems: 'center',
    borderRadius: verticalScale(5),
    paddingHorizontal: moderateScale(7),
    paddingVertical: verticalScale(3)
  },
  readerMoreTextStyle: {
    ...Fonts.style.bold_12,
    color: Colors.rgb_898d8d,
  },
  lastTrackedTextViewStyle: {
    marginTop: verticalScale(20),
  },
  trackedBabyStyle: {
    textAlign: 'center',
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
  },
  lastTrackedViewStyle: {
    flexDirection:'row',
    justifyContent:'space-around',
    marginTop:verticalScale(15),
    flex:1
  },
  lastTrackedItemStyle:{
    alignItems:'center',
    flex:1,
  },
  lastTrackedItemDateTextStyle:{
    marginTop:verticalScale(10),
    ...Fonts.style.bold_14,
    color: Colors.rgb_898d8d,
  },
  lastTrackedItemTextStyle:{
    marginTop:verticalScale(5),
    ...Fonts.style.regular_14,
    color: Colors.rgb_898d8d,

  },
  overlayStyle:{
    flex:1,
    paddingHorizontal: moderateScale(15),
    paddingVertical: verticalScale(10)
  },
  articleViewStyles: {
    backgroundColor: Colors.rgb_e7e8e8,
    flex: 1,
  },
  articleHeaderStyles: {
    flexDirection:'row',
    width:'100%',
    justifyContent: 'center',
    alignItems:'center',
    paddingHorizontal:Metrics.moderateScale._20,
  },
  articleHeaderTextStyles: {
    ...Fonts.style.bold_14,
    lineHeight: 17,
  },
  favTextStyles: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_898d8d,
    lineHeight: 17,
    marginHorizontal: Metrics.moderateScale._5,
  },
  articleImageStyles: {
    height: verticalScale(187),
    width: width-30,
    borderRadius: Metrics.moderateScale._14,
    backgroundColor: Colors.rgb_f2f2f2
  },
  articleView: {
    marginHorizontal: Metrics.moderateScale._16,
    borderRadius: Metrics.moderateScale._50,
    marginBottom: verticalScale(25)
  },
  articleTitleViewStyles: {
    backgroundColor:Colors.rgb_767676,
    paddingHorizontal: Metrics.moderateScale._20,
    paddingVertical: verticalScale(10),
    borderBottomLeftRadius: Metrics.moderateScale._12,
    borderBottomRightRadius: Metrics.moderateScale._12
  },
  articleTitleStyles: {
    ...Fonts.style.bold_15,
    textAlign: 'left',
    lineHeight: 18,
    letterSpacing: 0.6,
    color: Colors.white
  },
  articleAbstractStyles: {
    ...Fonts.style.regular_14,
    textAlign: 'left',
    lineHeight: 15,
    color: Colors.white
  },
  loadMoreStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Metrics.moderateScale._100,
    padding: 10,
    borderRadius: 10,
    marginBottom: verticalScale(20)
  },
  offlineView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  articleOfflineTextStyles: {
    textAlign: 'center',
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
    lineHeight: 0.29,
    padding: verticalScale(20)
  },
  offlineIconStyles: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadMoreTextStyles: {
    ...Fonts.style.regular_14,
    color: Colors.white,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  yesBtnStyles: {
    height: 48,
    width: Metrics.moderateScale._230,
    marginTop: verticalScale(5),
    marginHorizontal: Metrics.moderateScale._30,
    marginVertical: verticalScale(2),
    borderRadius: 20
  },
  yesBtnTextStyles: {
    lineHeight: 20.3,
    ...Fonts.style.bold_16,
    textAlign: 'center',
    color: Colors.rgb_000000,
    letterSpacing: 0.8
  },
  remindBtnStyles: {
    height: 48,
    width: Metrics.moderateScale._230,
    marginHorizontal: Metrics.moderateScale._30,
    marginVertical: verticalScale(2),
    borderRadius: 20,
    backgroundColor: Colors.rgb_767676,
    marginBottom: verticalScale(10),
  },
  remindBtnTextStyles: {
    lineHeight: 20.3,
    ...Fonts.style.bold_16,
    textAlign: 'center',
    color: Colors.white,
    letterSpacing: 0.8
  },
  neverBtnStyles: {
    backgroundColor: Colors.white,
  },
  neverBtnTextStyles: {
    lineHeight: 20,
    ...Fonts.style.bold_16,
    textAlign: 'center',
    color: Colors.rgb_898d8d99,
    letterSpacing: 0.8
  },
  popupHeaderTextStyles: {
    lineHeight: 22,
    ...Fonts.style.bold_18,
    textAlign: 'center',
    color: Colors.rgb_898d8d,
    marginBottom: verticalScale(10),
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
  listEmptyView: {
    flex:1,
    justifyContent:'center',
    alignSelf: "center",
    marginVertical: verticalScale(30)
  },
  emptyListTextStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    marginTop: verticalScale(15)
  },
  promoBannerViewStyle:{
    borderRadius:Metrics.moderateScale._15,
    backgroundColor:Colors.rgb_fdf1d2,
    width:'90%',
    height:verticalScale(120),
    alignSelf:'center',
    elevation:verticalScale(4),
    flexDirection:'row',
    marginTop:verticalScale(10)
  },
  // promoBannerImageStyle:{
  //   height: verticalScale(120),
  //   borderTopRightRadius:Metrics.moderateScale._15,
  //   borderBottomRightRadius:Metrics.moderateScale._15,
  //   flex:1,
  //   marginRight: 2,
  // },
  imageContainer: {
    alignSelf: 'flex-end',
    width: '50%',
    overflow: 'hidden',
    height: verticalScale(120),
    borderTopRightRadius:Metrics.moderateScale._15,
    borderBottomRightRadius:Metrics.moderateScale._15,
  },
  imageBg: {
    borderRadius: 250,
    width: 400,
    height: 325,
    marginTop: -100,
    position: 'absolute',
    left: 0,
    overflow: 'hidden',

  },
  imageRounded: {
    height: verticalScale(120),
    width: '50%',
    position: 'absolute',
    left: 0,
    marginTop: 100,
  },
  promoBannerSliderStyle:{
    height: verticalScale(140)
  },
  favViewStyle: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center'
    }
})
