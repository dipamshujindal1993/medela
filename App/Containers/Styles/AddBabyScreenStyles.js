import { I18nManager, Platform, StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  buttonContainer: {
    height: verticalScale(40),
    marginHorizontal: 20,
    ...Fonts.style.bold_18,
    borderRadius: 18,
    marginTop: verticalScale(32)
  },
  container: {
    paddingHorizontal: moderateScale(20),
  },
  title: {
    color: Colors.rgb_898d8d,
    alignSelf: 'center',
    marginVertical: verticalScale(10),
    textAlign: 'center',
    ...Fonts.style.bold_18,
  },
  subTitle: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
    marginHorizontal:moderateScale(5),
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_16,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  termsTitle: {
    ...Fonts.style.bold_14,
    color: Colors.rgb_898d8d,
    marginVertical: verticalScale(10),
    alignSelf: 'center',
  },
  uploadText:{
    color: Colors.rgb_70898d8d,
    ...Fonts.style.regular_16,
    marginTop:verticalScale(10)
  },
  radioBtnActive: {
    backgroundColor: Colors.rgb_767676,
    height:verticalScale(40),
  },

  radioBtnInactive: {
    backgroundColor: Colors.rgb_f5f5f5,
    height:verticalScale(40),
  },
  radioBtnTextActive: {
    color: Colors.white,
    ...Fonts.style.regular_14,
    alignSelf: 'flex-start',
  },
  radioBtnTextInactive: {
    color: Colors.rgb_898d8d,
    ...Fonts.style.regular_14,
    alignSelf: 'flex-start'
  },
  radioGroupStyle: {
    flexDirection: 'column'
  },
  radioBtnContainer: {
    flex: 1,
    marginHorizontal: moderateScale(5),
    backgroundColor: Colors.white,
    borderWidth: 0,
    borderRadius: verticalScale(10),
    //shadowOffset: { width: 2, height: 2, },
    //shadowColor: 'gray',
    //shadowOpacity: 0.3,
  },
  babyImageContainer: {
    borderRadius: verticalScale(18),
    flex: 1,
    backgroundColor: 'white',
    height: verticalScale(120),
    padding: verticalScale(5),
    marginTop:verticalScale(5),
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
    shadowOffset: { width: verticalScale(2), height: verticalScale(2) },
    shadowColor: 'gray',
    shadowOpacity: 0.3,
  },
  babyPlaceHolder: {
    width: '100%',
    height: '100%',
    borderRadius: verticalScale(12),
    borderWidth: verticalScale(1),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.rgb_70898d8d,
    borderStyle: 'dashed',
    alignSelf: 'center'
  },
  babyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: verticalScale(12),
    alignSelf: 'center'
  },
  babyIcon:{
    width:verticalScale(30),
    height:verticalScale(30)
  },
  textInput:{
    height: verticalScale(40),
    width:'100%',
    ...Fonts.style.bold_16,
    marginVertical:verticalScale(10),
    color:Colors.rgb_898d8d,
    paddingHorizontal:moderateScale(5),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  pickerInput:{
    height: verticalScale(40),
    width:'100%',
    ...Fonts.style.bold_16,
    backgroundColor:Colors.white,
    color:Colors.rgb_898d8d,
    paddingHorizontal:10,
  },
  pickerContainer:{
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    marginHorizontal:moderateScale(5),
    borderColor:Colors.rgb_898d8d,
    marginVertical:verticalScale(10)
  },
  indicatorView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(120),
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white'
  },
  indicatorActive: {
    width: verticalScale(7),
    height: verticalScale(7),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.rgb_fecd00,
    marginHorizontal: moderateScale(5)
  },
  indicatorInactive: {
    width: verticalScale(7),
    height: verticalScale(7),
    borderRadius: verticalScale(40),
    backgroundColor: Colors.rgb_898d8d,
    marginHorizontal: moderateScale(5)
  },
  datePickerContainer: {
    width: '98%',
    borderWidth: 0,
    ...Fonts.style.bold_16,
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
    marginHorizontal: moderateScale(5),
    paddingHorizontal: moderateScale(5),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_70898d8d
  },
  dateInputStyles: {
    borderWidth: 0,
    alignItems: 'flex-start',
    color: Colors.rgb_898d8d,
  },
  bottomViewStyle: {
    width: '100%',
    paddingTop: verticalScale(5)
  },
  weightListView:{
    height: '100%',
    zIndex: 2,
    // left: moderateScale(15),
  },
  homeContainer:{
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 1
  }
})
