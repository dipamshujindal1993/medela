import { StyleSheet, Dimensions } from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources';
import {verticalScale, moderateScale} from "@resources/Metrics";
const displayWidth = Dimensions.get('window').width;

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
  headerView:{
    width: displayWidth/1.7,
    height: verticalScale(25),
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(10),
    marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D
  },
  sendButtonStyles: {
    ...Fonts.style.bold_17,
    color: Colors.rgb_ffcd00,
  },
  usernameStyles: {
    ...Fonts.style.regular_12,
    lineHeight: 16,
    textAlign: "left",
    letterSpacing: 0.29
  },
  leftBubbleStyles: {
    backgroundColor: Colors.rgb_898d8d99
  },
  rightBubbleTextStyles: {
    ...Fonts.style.regular_16,
    color: Colors.white,
    lineHeight: 19,
    textAlign: 'left'
  },
  leftBubbleTextStyles: {
    ...Fonts.style.regular_16,
    color: Colors.rgb_646363,
    lineHeight: 19,
    textAlign: 'left'
  },
  customtInputToolbarStyle:{
    backgroundColor: Colors.white,
    borderColor: Colors.rgb_e8e8e8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    alignSelf: 'center',
  },
  sendStyles: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(10),
    borderTopColor: "blue",
    minHeight: 48
  },
  inputToolbarStyles: {
    borderTopWidth: 1.5,
    borderTopColor: Colors.rgb_898d8d33
  },
  linkViewStyles: {
    marginHorizontal: moderateScale(10)
  },
  linkTextStyles: {
    color: Colors.rgb_ffcd00,
    ...Fonts.style.bold_17,
    lineHeight: 24,
    paddingVertical: 12
  },
  offlineMsgStyles: {
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D
  },
  offlineViewStyles: {
    flex: 8,
    marginBottom: Dimensions.get("window").height/2.3,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
