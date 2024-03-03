import {StyleSheet, Dimensions, I18nManager} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
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
  headerContentViewStyles: {
    marginTop: 20,
    marginBottom: 10
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
  },
  headerTitleStyle:{
    ...Fonts.style.bold_14,
    color: Colors.rgb_888B8D,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  contentView:{
    flex: 1,
    marginHorizontal: Metrics.moderateScale._25,
  },
  measurementTitleStyles: {
    ...Fonts.style.regular_16,
    color: Colors.rgb_898d8d,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  measurementInfoStyles: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  measurementTitleViewStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  measurementInnerViewStyle: {
    flex: 1,
  },
  measurementToggleViewStyle:{
    width: 48,
    height: 48,
    alignItems:'flex-end',
    justifyContent:'flex-end',
  }
})
