import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
const displayWidth = Dimensions.get('window').width;

import {verticalScale, moderateScale} from "@resources/Metrics";
import { I18nManager } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  headerView:{
    width: displayWidth/1.7,
    height: verticalScale(25),
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D
  },
  contentView:{
    flex: 1,
    marginHorizontal: Metrics.moderateScale._25,
  },
  listItemViewStyle:{
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  itemTextViewStyle:{
    flex: 1,
    marginVertical: verticalScale(10),
  },
  notificationTitleTextStyle:{
    ...Fonts.style.bold_14,
    color: Colors.rgb_898d8d,
    marginBottom: verticalScale(5),
    lineHeight: 17,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...(I18nManager.isRTL&&Platform.OS=='android')&&{marginRight:'auto'}

  },
  notificationContentTextStyle:{
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
    marginBottom: verticalScale(5),
    lineHeight: 16,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...(I18nManager.isRTL&&Platform.OS=='android')&&{marginRight:'auto'}
  },
  itemViewStyle: {
    flex: 4,
    justifyContent:'center',
  },
  itemTitleTextStyle:{
    ...Fonts.style.regular_16,
    color: Colors.rgb_898d8d,
    lineHeight: 19,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...(I18nManager.isRTL&&Platform.OS=='android')&&{marginRight:'auto'}
  },
  title:{
    color:Colors.rgb_898d8d,
    alignSelf:'flex-start',
    marginVertical: verticalScale(10),
    ...Fonts.style.regular_16,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...(I18nManager.isRTL&&Platform.OS=='android')&&{marginRight:'auto'}
  },
  textInput:{
    height: verticalScale(35),
    ...Fonts.style.bold_16,
    marginBottom:verticalScale(18),
    color:Colors.rgb_898d8d,
    //paddingHorizontal:verticalScale(10),
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  buttonContainer: {
    height: verticalScale(40),
    marginHorizontal: Metrics.moderateScale._50,
    ...Fonts.style.bold_18,
    borderRadius: verticalScale(18),
    marginVertical: verticalScale(10)
  },
  dropDownTitle: {
   marginTop: verticalScale(5),
    marginBottom: verticalScale(10),
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...(I18nManager.isRTL&&Platform.OS=='android')&&{marginRight:'auto'},
 //   marginHorizontal:Metrics.moderateScale._8,
    color: Colors.rgb_898d8d,
    ...Fonts.style.bold_16,
  //  marginStart:Metrics.moderateScale._10,
  },
  dropDownStyle:{
    position:'absolute',
    right:0,
    bottom:verticalScale(15)
  },
  lineStyle:{
    backgroundColor:Colors.rgb_898d8d,
    height:verticalScale(0.8),
    marginHorizontal:Metrics.moderateScale._5,
    marginBottom:verticalScale(10)
  }
})
