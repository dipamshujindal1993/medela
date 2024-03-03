import {Platform,Dimensions, StyleSheet, I18nManager} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
  container:{
    paddingVertical:verticalScale(20),
    //paddingHorizontal:20,
    flexGrow:1
  },
  durationTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
    marginHorizontal: Metrics.moderateScale._6,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    paddingHorizontal:20
  },
  leftRightTimerViewStyle:{
    flexDirection: 'row',
    justifyContent:'center',
    // alignItems:'center',
    marginTop:verticalScale(10),
    marginBottom:verticalScale(5),
    //marginHorizontal:10,
  },
  bluetoothStyle:{
    marginBottom:verticalScale(15),
    alignSelf:'center'
  },
  leftRightViewStyle:{
    width:verticalScale(130),
    height:verticalScale(130),
    borderRadius:verticalScale(65),
    backgroundColor: Colors.rgb_d8d8d8,
    justifyContent:'center',
    alignItems: 'center'
  },

  linkIconStyle:{
    alignItems:'center',
    // position:'absolute',
    left:'47%',
    top:'33%',

  },

  leftRightTimerStyle:{
    borderRadius:verticalScale(7),
    paddingVertical:verticalScale(7),
    width:Metrics.moderateScale._100,
    backgroundColor: Colors.rgb_f5f5f5,
    justifyContent:'center',
    alignItems: 'center',
  },

  timerTextStyle:{
    ...Fonts.style.regular_16,
    color:Colors.rgb_898d8d,
  },

  sessionTypeView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:verticalScale(10),
    marginHorizontal: Metrics.moderateScale._5,
    paddingHorizontal:20
    //  backgroundColor:'red'
  },
  breastFeedingViewStyle:{
    justifyContent:'center',
    alignItems: 'center',

  },
  sessionRightView:{
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  sessionTypeTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  breastFeedingTextStyle:{
    textAlign:'center',
    ...Fonts.style.bold_16,
    color:Colors.rgb_888B8D,
    marginTop:verticalScale(5)
  },
  endingSideView:{
    flexDirection: 'row',
    alignItems:'center',
    marginVertical:verticalScale(10),
    marginHorizontal: Metrics.moderateScale._20
  },
  volumeLeftRightView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    flex: 1,
    marginTop:verticalScale(20),
    marginLeft:Metrics.moderateScale._10n
  },
  endingSideTextStyle:{
    ...Fonts.style.regular_16,
    color:Colors.rgb_888B8D,
    textAlign:'center',
    paddingHorizontal:Metrics.moderateScale._10,
    paddingVertical:verticalScale(5)
  },


  addNoteTextInput:{
    ...Fonts.style.bold_16,
    marginVertical:verticalScale(20),
    color:Colors.rgb_898d8d,
    paddingHorizontal:Metrics.moderateScale._10,
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },

  cancelSaveView:{
    flexDirection:'row',
    justifyContent:'center',
    marginTop:'auto'
  },
  cancelButtonStyles:{
    marginTop: verticalScale(10),
    width:'45%',
    backgroundColor:Colors.rgb_767676,
    borderRadius:verticalScale(10),
    minHeight: 48
  },
  cancelTextStyle:{
    color:'white',
    ...Fonts.style.bold_16,
  },
  saveButtonStyles:{
    marginTop: verticalScale(10),
    width:'45%',
    borderRadius:verticalScale(10),
    opacity: 1,
    minHeight: 48
  },
  saveTextStyle:{
    ...Fonts.style.bold_16,
  },
  pickerContainer:{
    borderRadius:verticalScale(10),
    marginHorizontal:Metrics.moderateScale._5,
    backgroundColor:Colors.rgb_70898d8d,
    marginVertical:verticalScale(20)
  },

  pickerInput:{
    height: verticalScale(40),
    width:Metrics.moderateScale._100,
    ...Fonts.style.bold_16,
    backgroundColor:Colors.rgb_e73536,
    color:Colors.rgb_e73536,
    paddingHorizontal:Metrics.moderateScale._10,
  },

  volumeView:{
    marginVertical:verticalScale(10),
    //paddingHorizontal:20,
  //  / marginHorizontal:Platform.OS==='ios'?11:10,
    //paddingRight:'auto',
    //backgroundColor:'red'
  },

  volumeCountView:{
    marginTop:verticalScale(20),
    alignSelf:'center',
    width:Metrics.moderateScale._80,
    height:verticalScale(30),
    backgroundColor: Colors.rgb_898d8d33,
    borderRadius: verticalScale(7),
    justifyContent:'center',
  },
  bottleBagView:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around'
  },

  virtualFreezerSaveView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  virtualFreezerTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    marginLeft: Metrics.moderateScale._5,
    marginBottom:verticalScale(0)
  },

  freezerButtonContainer:{
    width:Metrics.screenWidth/3.6,
    height:verticalScale(40),
    paddingHorizontal: 0,
  },
  numberTextInput:{
    height: verticalScale(40),
    ...Fonts.style.bold_18,
    marginHorizontal:Metrics.moderateScale._10,
    // opacity: 0.6,
    marginVertical:verticalScale(5),
    color:Colors.rgb_898d8d,
    paddingHorizontal:Metrics.moderateScale._10,
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },

  fridgeFreezerView:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
    marginVertical:verticalScale(10)
  },
  bleContainer: {
    marginBottom: verticalScale(16),
    marginHorizontal: Metrics.moderateScale._8,
    paddingHorizontal:20
  },
  bleDataContainer: {
    //flex :1,
    flexDirection: 'row',
    marginTop: 8,
    justifyContent:'space-around'
  },
  pumpSettingTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
  },
  pumpSettingSubLableStyle: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_646363,
    marginHorizontal: Metrics.moderateScale._16
  },
  pumpSettingBleMessageLableStyle: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_ed0212,
    marginHorizontal: Metrics.moderateScale._16,
    marginVertical: verticalScale(4)
  },
  StopwatchBtnStyle: {
    alignItems: 'center',
    justifyContent:'center',
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  timerBgStyle:{
    alignSelf:'center',
    width: Metrics.moderateScale._100,
    backgroundColor: Colors.rgb_f5f5f5,
    borderRadius: 10,
    padding: 10,
    marginBottom: Metrics.moderateScale._20,
    alignItems: 'center'
  },
  batteryLableStyle: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_646363,
    marginLeft:Metrics.moderateScale._5,
  },
  batteryViewStyle:{
    flexDirection: 'row',
    marginBottom:verticalScale(10),
    justifyContent:'center',
    alignItems:'center'
  },
  bothLableStyle: {
    color: Colors.rgb_646363,
    marginHorizontal: Metrics.moderateScale._16,
    paddingHorizontal: Metrics.moderateScale._8,
    borderRadius:Metrics.moderateScale._6,
    ...Fonts.style.bold_18,
    marginTop:verticalScale(10),
  },
  buttonContainer: {
    backgroundColor:Colors.rgb_d8d8d8,
    marginTop:verticalScale(10),
    width:Metrics.moderateScale._50,
    ...Fonts.style.bold_18,
    paddingBottom: 1
  },
  pumpLevelViewStyle:{
    justifyContent:'flex-start',
    alignItems:'center',
    flexDirection:'row'
  },
  phaseLevelViewStyle:{
    justifyContent:'center',
    alignItems:'center',
  },
  rhythemLevelViewStyle:{
    justifyContent:'flex-end',
    alignItems:'center',
  },
  messageViewStyle:{
    width:'100%',
    alignItems:'center',
    marginTop:verticalScale(-5)
  },
  volumeCountTextStyles:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    alignSelf: 'center',
    marginBottom:10
  },
  sessionPausedViewStyle:{
    alignItems:'center'
  },
  GoalTimerViewStyle:{
    flexDirection:'row',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginTop:verticalScale(-2),
    marginBottom:verticalScale(2)
  },
  goalTimerLabelStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_ffcd00,
    marginHorizontal: Metrics.moderateScale._2,
    marginVertical: verticalScale(4)
  },
  GoalTimerBgStyle:{
    flexDirection:'row',
    justifyContent:'center',
    alignSelf:'center',
    width: Metrics.moderateScale._100,
    backgroundColor: Colors.rgb_f5f5f5,
    borderRadius: 10,
    padding: 10,
    marginBottom: Metrics.moderateScale._20,
    alignItems: 'center'
  },
  pumpTimerTextStyle: {
    flex:1,
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
    textAlign: 'center'
  },
  StopwatchBtnText: {
    ...Fonts.style.bold_16,
    display: 'flex',
    alignSelf: 'center',
  },
  buttonContainer:{  
    minHeight: 48,
    width:Metrics.moderateScale._48,
    justifyContent: 'center'
  },
  buttonView: {
      backgroundColor:Colors.rgb_d8d8d8,
      borderRadius: 8,
      paddingVertical: verticalScale(2),
      width:Metrics.moderateScale._48,
    },
    buttonTextStyle: {
      ...Fonts.style.bold_14,
      paddingBottom: 1,
      alignSelf: 'center'
    },
    linkViewStyle:{
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal:Metrics.moderateScale._20,
      marginVertical:verticalScale(10)
  },
})
