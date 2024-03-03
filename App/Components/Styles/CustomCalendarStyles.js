import { I18nManager, StyleSheet ,Platform} from 'react-native'
import { Colors, Fonts, Metrics } from '@resources'
import { verticalScale ,moderateScale} from '@resources/Metrics'
import DeviceInfo from 'react-native-device-info'

export default StyleSheet.create({
  calendarMainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor:'rgba(255,255,255,0)',
    paddingTop: verticalScale(42)
  },
  dateContainer: {
    padding: Metrics.moderateScale._16,
    backgroundColor: Colors.rgb_ffcd00,
    marginBottom: verticalScale(8),
  },
  year: {
    ...Fonts.style.bold_16,
    lineHeight: 19,
    color: Colors.white,
    paddingBottom: verticalScale(8),
    ...I18nManager.isRTL&&{marginRight:'auto'}
    //writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  day: {
    ...Fonts.style.bold_32,
    lineHeight: 37,
    color: Colors.white,
    ...I18nManager.isRTL&&{marginRight:'auto'}
  },
  calendarBackground: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    //borderWidth: 1,
    borderColor: Colors.rgb_b9b9b9,
    shadowOffset: { width: 0, height: -2 },
    shadowColor: Colors.rgb_b9b9b9,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  timeContainer: {
    marginVertical: verticalScale(24),
    marginHorizontal: moderateScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  switchTimerContainer:{
    marginHorizontal: verticalScale(10),
    position:'relative',
    bottom:(verticalScale(15)*-1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timeTitle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
    paddingBottom: verticalScale(8),
    marginHorizontal:DeviceInfo.getFontScale()>1.6?0:verticalScale(8),
  },
  timeBackground: {
    flexDirection: "row",
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: DeviceInfo.getFontScale()>1.6?verticalScale(40)*1.63:verticalScale(36),
    width: Metrics.moderateScale._80,
    backgroundColor: Colors.rgb_898d8d33,
    borderRadius: Metrics.moderateScale._8,
    marginRight: Metrics.moderateScale._6,
    // paddingVertical: verticalScale(8)
  },
  timeBackgroundTimers: {
    flexDirection: "row",
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 105,
    backgroundColor: Colors.rgb_898d8d33,
    borderRadius: Metrics.moderateScale._8,
    marginRight: Metrics.moderateScale._6,
  },
  textInputStyles:{
    ...Fonts.style.bold_16,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d,
    textAlignVertical: 'center'
  },
  dateTextStyles:{
    ...Fonts.style.bold_16,
  },
  textStylesForAlignment:{
    textAlignVertical:'center',
    marginHorizontal:5,
  },
  dashContainer:{
    height:'100%',
    justifyContent: 'center',
    paddingBottom: verticalScale(2)
  },
  time: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_646363,
  },
  ctaView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: verticalScale(4),
  },
  cta: {
    ...Fonts.style.bold_14,
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: 0.5,
    color: Colors.rgb_ffcd00,
    minWidth: Metrics.moderateScale._75,
    minHeight: 48,
    paddingLeft: verticalScale(9),
    paddingRight: verticalScale(9),
  },
  buttonWrapper:{
    flex: 1,
    flexDirection: 'row',
    marginLeft: Metrics.moderateScale._20,
    flexWrap: "wrap"
  },
  buttonStyle:{
    width: Metrics.moderateScale._98,
    height: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Metrics.moderateScale._10,
    marginVertical: verticalScale(10),
    backgroundColor: Colors.rgb_f5f5f5,
    borderRadius: Metrics.moderateScale._10,
    padding: 5
  },
  buttonTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d,
    textAlign: 'center'
  },
  calenderButton:{
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
    minHeight: 48,
    minWidth: 48,
    justifyContent: 'center'
  },errorContainer:{
    position:'absolute',
    bottom:moderateScale(13)*-(1.5),
    width:'100%',
    alignItems:'center'
  },errorMessage:{
    ...Fonts.style.bold_16,
    color:'rgb(225,41,50)'
  },durationOverContainer:{
    position:'absolute',
    width:'100%',
    height:'100%',
    top:0,
    left:0,
    zIndex:1
  },
  dateTimeContainerStyle:{
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    // marginRight: 10
  },
  dateSelectionStyle:{
    minHeight: 48,
    justifyContent: 'center'
  },
  timeSelectionStyle:{
    minHeight: 48,
    minWidth: 48,
  }
  
})
