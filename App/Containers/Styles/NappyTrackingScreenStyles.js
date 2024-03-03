import {Platform,Dimensions, StyleSheet, I18nManager} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

const WIDTH=Dimensions.get('window').width

const windowWidth = Dimensions.get('window').width;
import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  container:{
    paddingVertical:verticalScale(20),
    paddingHorizontal:moderateScale(20),
    width:'100%',
    height:'100%'
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
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
    // backgroundColor:'red',
    //extAlign:'center'
  },
  typeTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_888B8D,
    textAlign: 'center',
    marginTop:verticalScale(5)
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
    justifyContent:'center'
  },
  cancelButtonStyles:{
    marginTop: verticalScale(10),
    width:'45%',
    paddingVertical:verticalScale(12),
    backgroundColor:Colors.rgb_898d8d,
    borderRadius:verticalScale(10)
  },
  cancelTextStyle:{
    color:'white',
    ...Fonts.style.bold_16,

  },
  saveButtonStyles:{
    marginTop: verticalScale(10),
    width:'45%',
    paddingVertical:verticalScale(12),
    borderRadius:verticalScale(10)
  },
  saveTextStyle:{
    ...Fonts.style.bold_16,
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

  itemFreezerTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_898d8d,
    textAlign:'right'
  },
  addBabyStyle:{
    backgroundColor:'white',
    width:'100%',
    marginTop:verticalScale(50),
    shadowOffset: { width: verticalScale(2), height: verticalScale(2), },
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    ...Platform.select({
      android: {
        elevation: verticalScale(8),
      },
    }),
    borderBottomLeftRadius:verticalScale(15),
    borderBottomRightRadius:verticalScale(15),
    padding:verticalScale(10)
  },
  addBabyItemStyle:{
    flexDirection:'row',
    marginVertical:verticalScale(10),
    marginHorizontal:moderateScale(10),
    alignItems:'center',
  },
  addBabyBottomViewStyle:{
    flexDirection:'row',
    marginVertical:verticalScale(10),
    marginHorizontal:moderateScale(10),
    alignItems:'center'
  },
  babyNameTextStyle:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_898d8d,
    marginHorizontal:moderateScale(15),
  },
  babyImage:{
    width: verticalScale(44),
    height: verticalScale(44),
    borderRadius:verticalScale(50)
  }
})
