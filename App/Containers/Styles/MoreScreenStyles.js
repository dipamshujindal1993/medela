import {StyleSheet, Dimensions, I18nManager, Platform} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
const displayWidth = Dimensions.get('window').width;

import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  container: {
    flex: 1
  },
  headerTitleView:{
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Metrics.moderateScale._30,
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._10
  },
  headerTextStyle:{
    ...Fonts.style.bold_22,
    color: Colors.rgb_888B8D
  },
  contentView:{
    marginHorizontal: Metrics.moderateScale._16,
    paddingBottom: verticalScale(30),
    ...Platform.OS=='ios' && I18nManager.isRTL &&{paddingLeft:Metrics.moderateScale._20}
  },
  listItemViewStyle:{
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  itemTextViewStyle:{
    width: 0,
    flexGrow: .9,
    flex: .9,
    justifyContent: "center",
    marginHorizontal: Metrics.moderateScale._8,
  },
  itemTitleTextStyle:{
    flexWrap: 'wrap',
    ...Fonts.style.bold_15,
    color: Colors.rgb_646363,
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
  },
  imageContentView:{
    flexDirection: 'row'
  },
  itemContentTextStyle:{
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
    marginTop: verticalScale(5),
    writingDirection:I18nManager.isRTL?'rtl':'ltr',
    ...(I18nManager.isRTL&&Platform.OS=='android')&&{marginRight:'auto'},
  },
  iconWrapper:{
    flex:.3,
    position:'absolute',
    right:2,
    marginBottom: verticalScale(5),
  },
  vipImageView:{
    marginTop: verticalScale(15),
    alignSelf: 'center'
  },
  SecondListStyle:{
    flexGrow: 1,
    marginBottom: verticalScale(20)
  },
  title:{
    ...Fonts.style.bold_18,
    color:Colors.rgb_898d8d,
    alignSelf:'center',
  },
  buttonContainer: {
    height: verticalScale(50),
    borderRadius: verticalScale(18),
    marginVertical:verticalScale(40),
    ...Fonts.style.bold_18,
  },
  listViewStyles: {
    marginBottom: verticalScale(30)
  }
})
