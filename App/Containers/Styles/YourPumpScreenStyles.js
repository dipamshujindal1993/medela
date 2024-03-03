import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container:{
    // marginVertical:verticalScale(40),
    marginHorizontal: Metrics.moderateScale._16,
    flex: 1,
  },
  pumpContainer:{
    flexDirection:'row',
    flex:1,
    marginBottom:verticalScale(40),
  },
  subTitle:{
    color: Colors.rgb_898d8d,
    marginHorizontal: Metrics.moderateScale._5,
    paddingVertical: verticalScale(5),
    ...Fonts.style.bold_14,
    lineHeight: 17,
  },
  subTitleBold:{
    color: Colors.rgb_646363,
    marginHorizontal: Metrics.moderateScale._5,
    paddingVertical: verticalScale(5),
    ...Fonts.style.bold_15,
    lineHeight: 18,
    letterSpacing: 0.6
  },
  batteryLevel:{
    color: Colors.rgb_898d8d,
    marginHorizontal: Metrics.moderateScale._5,
    paddingVertical: verticalScale(5),
    ...Fonts.style.bold_16
  },
  chargingText:{
    color: Colors.rgb_fecd00,
    marginHorizontal: Metrics.moderateScale._4,
    ...Fonts.style.regular_12
  },
  stepsTitle:{
    color: Colors.rgb_898d8d,
    marginHorizontal: Metrics.moderateScale._5,
    paddingVertical:verticalScale(5),
    ...Fonts.style.regular_12
  },
  dotViewStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dotStyle: {
    width: Metrics.moderateScale._16,
    height: Metrics.moderateScale._16,
    backgroundColor: Colors.rgb_ffcd00,
    borderRadius: Metrics.moderateScale._8,
    textAlignVertical: 'center'
  },
  connectedText:{
    color:Colors.rgb_00d000,
    marginHorizontal: Metrics.moderateScale._5,
    paddingVertical:verticalScale(5),
    ...Fonts.style.regular_12,
    alignItems: 'center',
  },
  inputTitle:{
    color: Colors.rgb_898d8d,
    textAlign:'left',
    marginHorizontal:Metrics.moderateScale._30,
    paddingVertical:verticalScale(5),
    ...Fonts.style.regular_12
  },
  deviceName:{
    color: Colors.rgb_898d8d,
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:Metrics.moderateScale._20,
    paddingVertical: verticalScale(20),
    ...Fonts.style.regular_16
  },
  buttonContainer: {
    height: 48,
    ...Fonts.style.bold_16,
    borderRadius: Metrics.moderateScale._12,
  },
  bottomViewStyle: {
    flex: 1,
    justifyContent: 'flex-end'
 },
  imgStyle:{
    width: Metrics.moderateScale._60,
    height: Metrics.moderateScale._60,
    position:'absolute',
  },
  textInput:{
    height: verticalScale(40),
    ...Fonts.style.bold_16,
    backgroundColor:Colors.white,
    marginHorizontal: verticalScale(15),
    color:Colors.rgb_898d8d,
    paddingHorizontal:verticalScale(10),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  aboutView:{
    flexDirection:'row',
    alignItems:'center',
    minHeight: 48
  },
  arrowStyle:{
    position:'absolute',
    right:0
  },
  batteryLevelView:{
    flexDirection:'row',
    alignItems:'center',
    marginHorizontal: Metrics.moderateScale._5
  },
  deletePumpLevel:{
    color: Colors.rgb_898d8d,
    marginHorizontal: Metrics.moderateScale._5,
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(5),
    ...Fonts.style.regular_16,
    textAlign:'center',
    marginBottom: verticalScale(10)
  },
  editPumpIconStyle:{
    marginHorizontal: Metrics.moderateScale._10,
    top:verticalScale(3.5)
  },
  contentContainerStyle:{
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  headerView: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 48
  },
  headerRightView: {
    marginHorizontal: moderateScale(10),
    alignItems: 'flex-end'
  },
  headerTextStyles: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_898d8d,
    lineHeight: 17,
  },
})
