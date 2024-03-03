import {Platform,Dimensions, StyleSheet, I18nManager} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import DeviceInfo from 'react-native-device-info'

const WH =Dimensions.get('window').height

const windowWidth = Dimensions.get('window').width;

import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  container:{
    paddingVertical:verticalScale(20),
    //paddingHorizontal:20,
    flex:1
  },

  leftRightTimerViewStyle:{
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginVertical:verticalScale(10),
    marginHorizontal:moderateScale(10),
    // backgroundColor:'red'
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
    position:'absolute',
    left:'47%',
    top:'50%',
  },

  leftRightTimerStyle:{
    borderRadius:verticalScale(7),
    paddingVertical:verticalScale(7),
    width:moderateScale(100),
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
    marginHorizontal: moderateScale(5),
    //  backgroundColor:'red'
  },
  breastFeedingViewStyle:{
    justifyContent:'center',
    alignItems: 'center'
  },
  sessionRightView:{
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  sessionTypeTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    paddingHorizontal:20,
  },
  typeTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_888B8D,
    textAlign: 'center',
    marginTop:verticalScale(5)
  },
  listEmptyView: {
    alignItems: "center",
    marginVertical: verticalScale(80)
  },
  endingSideView:{
    flexDirection: 'row',
    alignItems:'center',
    marginVertical:verticalScale(10),
    marginHorizontal: moderateScale(5),
  },

  buttonShadowStyle:{
    marginLeft:moderateScale(7),
    backgroundColor: Colors.white,
    borderWidth: 0,
    borderRadius: verticalScale(7),
    shadowOffset: { width: verticalScale(2), height: verticalScale(2), },
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    paddingHorizontal: moderateScale(10),
    justifyContent:'center',
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  volumeLeftRightView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    flex: 1,
    marginTop:verticalScale(20),
    marginLeft:moderateScale(-10)
  },
  endingSideTextStyle:{
    ...Fonts.style.regular_16,
    color:Colors.rgb_888B8D,
    textAlign:'center',
    paddingHorizontal:moderateScale(10),
    paddingVertical:verticalScale(5)
  },

  btnTextActive: {
    color: Colors.white,
    ...Fonts.style.regular_16,
  },
  btnTextInactive: {
    color: Colors.rgb_898d8d,
    ...Fonts.style.regular_16,
    alignSelf: 'center'
  },

  addNoteTextInput:{
    ...Fonts.style.bold_16,
    marginVertical:verticalScale(20),
    color:Colors.rgb_898d8d,
    paddingHorizontal:moderateScale(10),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },

  cancelSaveView:{
    flexDirection:'row',
    justifyContent:'center',
    // position:'absolute',
    // bottom:0,
    // left:moderateScale(20),
    // right:moderateScale(20),
    paddingBottom:verticalScale(30),
    marginBottom: 'auto',
    marginHorizontal:verticalScale(15),
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
    minHeight: 48
  },
  saveTextStyle:{
    ...Fonts.style.bold_16,
  },

  pickerContainer:{
    borderRadius:verticalScale(10),
    marginHorizontal:moderateScale(5),
    backgroundColor:Colors.rgb_70898d8d,
    marginVertical:verticalScale(20)
  },

  pickerInput:{
    height: verticalScale(40),
    width:moderateScale(100),
    ...Fonts.style.bold_16,
    backgroundColor:Colors.rgb_e73536,
    color:Colors.rgb_e73536,
    paddingHorizontal:moderateScale(10),
  },

  volumeView:{
    marginVertical:verticalScale(10),
    //marginHorizontal: Platform.OS==='ios'?11:10,
    height:Metrics.screenHeight > 700 ? verticalScale(160) : verticalScale(200)
  },

  volumeCountView:{
    marginTop:verticalScale(20),
    alignSelf:'center',
    width:moderateScale(80),
    height:verticalScale(30),
    backgroundColor: Colors.rgb_898d8d33,
    borderRadius: verticalScale(7),
    justifyContent:'center',
  },

  volumeCountTextStyles:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    alignSelf: 'center'
  },

  bottleBagView:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around'
  },

  virtualFreezerTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    marginBottom:verticalScale(10)
  },
  virtualFreezerListTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    marginLeft: moderateScale(10)
  },

  freezerButtonContainer:{
    width:windowWidth/3.6,
    height:DeviceInfo.getFontScale()>1.6?verticalScale(40)*1.63:verticalScale(40),
    paddingHorizontal: 0,
  },
  freezerSelectionButtonContainer:{
    width:windowWidth/6,
    marginLeft: moderateScale(1),
    height:verticalScale(30),
  },
  btnInactive:{
    marginHorizontal:moderateScale(10)
  },
  numberTextInput:{
    height: verticalScale(40),
    ...Fonts.style.bold_18,
    marginHorizontal:moderateScale(10),
    opacity: 0.6,
    marginVertical:verticalScale(5),
    color:Colors.rgb_898d8d,
    paddingHorizontal:moderateScale(10),
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
  virtualFreezerSelectorView:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
    marginVertical:verticalScale(10),
    backgroundColor:'gray',
    borderRadius:verticalScale(8)
  },

  milkItemView:{
    flexDirection:'row',
    marginVertical:verticalScale(5),
    borderRadius:verticalScale(10)
  },
  itemTitleStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
  },
  itemDateTimeStyle:{
    ...Fonts.style.regular_12,
    color:Colors.rgb_898d8d,
  },
  itemSavedTextStyle:{
    ...Fonts.style.regular_12,
    color:Colors.rgb_898d8d,
  },
  itemFreezerTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_898d8d,
    textAlign:'right'
  },
  virtualFreezerListSelectorView:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
    marginVertical:verticalScale(10),
    backgroundColor:Colors.rgb_898d8d_4,
    borderRadius:verticalScale(8),
    padding:verticalScale(1)
  },

  freezerSelectionListButtonContainer:{
    width:windowWidth/6,
    marginLeft: 0,
    height:verticalScale(25),
    borderRadius:verticalScale(7),
    backgroundColor:Colors.white
  },
  btnSelectorListTextActive: {
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_14,
  },
  btnSelectorListTextInactive: {
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_14,
    alignSelf: 'center'
  },
  deleteListStyle:{
    backgroundColor:'red',
    position:'absolute',
    right:0,
    height:'100%',
    width:moderateScale(75),
    justifyContent:'center',
    alignItems:'center'
  },
  deleteTextStyle: {
    color: Colors.white,
    ...Fonts.style.bold_14,
  },
  freezerHeaderStyle:{
    width:'95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingRight: moderateScale(5),
    paddingHorizontal:20,
  }
})
