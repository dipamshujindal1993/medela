import {StyleSheet, Dimensions, Platform} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources';
import {verticalScale, moderateScale} from "@resources/Metrics";

const displayWidth = Dimensions.get('window').width;
const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  bottleBagFilterViewStyle: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  milkItemView: {
    flexDirection: 'row',
    marginVertical: verticalScale(5),
    borderRadius: verticalScale(10)
  },
  endingSideView:{
    flexDirection: 'row',
    alignItems:'center',
    marginVertical:verticalScale(10),
    marginHorizontal: moderateScale(5),
  },
  totalCountTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
  },
  sessionTypeTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    // backgroundColor:'red',
    //extAlign:'center'
  },
  itemTitleStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
  },
  itemDateTimeStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
  },
  itemSavedTextStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
  },
  itemFreezerTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d,
    textAlign: 'right'
  },
  bottleBagFilterSelectorView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: verticalScale(10),
    backgroundColor: Colors.rgb_898d8d_4,
    borderRadius: verticalScale(8),
    padding: verticalScale(1)
  },

  btnContainer: {
    width: windowWidth / 6,
    marginLeft: 0,
    height: verticalScale(22),
    borderRadius: verticalScale(7),
    backgroundColor: Colors.white,
  },
  btnContainerInActiveStyle:{
    borderRadius: 0,
    backgroundColor: 'transparent'
  },
  btnTextActiveStyle: {
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_14,
  },
  btnContainerTextInactive: {
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_14,
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
  cancelSaveView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 50
  },
  cancelButtonStyles: {
    marginTop: 10,
    width: '45%',
    paddingVertical: 12,
    backgroundColor: Colors.rgb_898d8d,
    borderRadius: 10,
  },
  cancelTextStyle: {
    color: 'white',
    ...Fonts.style.bold_16,
  },
  saveButtonStyles: {
    marginTop: 10,
    width: '45%',
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveTextStyle: {
    ...Fonts.style.bold_16,
  },

  footerView:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    marginVertical: verticalScale(10),

  },
  addMilkTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
    textAlign:'center'
  },
  quickAddViewStyle:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical:verticalScale(10)
  },
  quickTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d,
    textAlign:'center',
    marginTop:verticalScale(10)
  },
  moveMilkTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
  },
  rightArrowStyle:{
    marginVertical:verticalScale(10),
    alignSelf: 'flex-end'
  },
  bottleBagView: {
    justifyContent: 'space-between',
    flex: 1,
    marginLeft: 10,
    marginVertical: verticalScale(5),
  },
  bottleBagTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  volumeTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
    marginLeft: moderateScale(15),
    marginBottom: verticalScale(10)
  },


  volumeView:{
    marginVertical:verticalScale(10),
    marginHorizontal: Platform.OS==='ios'?11:10,
    height:verticalScale(200)
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
  volumeEditableViewStyle:{
    marginTop:verticalScale(20),
  },
  volumeCountTextStyles:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    alignSelf: 'center'
  },
  expNoteView:{
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 15
  }

})
