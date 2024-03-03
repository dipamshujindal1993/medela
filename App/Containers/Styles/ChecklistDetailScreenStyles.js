import {StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  checkListStyle: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(200),
  },
  itemStyle: {
    marginVertical: verticalScale(7),
    marginLeft:moderateScale(12),
  },
  descriptionTextStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
  },
  title: {
    flex: 1,
    ...Fonts.style.bold_14,
    color: Colors.rgb_898d8d,
    marginBottom: verticalScale(5)
  },
  itemDetailStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:'white'
  },
  itemDetailTitleStyle: {
    ...Fonts.style.regular_16,
    color: Colors.rgb_898d8d,
    flex: 6,
  },
  switchStyle: {
    flex: 1,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end'
  },
  headerView: {
    flexDirection: 'row',
    marginTop: verticalScale(12),
    marginLeft: moderateScale(10)
  },
  addViewStyle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.rgb_fecd00,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTextView: {
    flex: 1,
  },
  addItemTextStyle: {
    flex: 1,
    ...Fonts.style.regular_16,
    color: Colors.rgb_898d8d,
    marginLeft: moderateScale(15),
    textAlignVertical:'bottom'
  },
  headerDivider: {
    marginLeft: moderateScale(15),
    marginTop: verticalScale(10),
    height: 1,
    backgroundColor: Colors.rgb_868B8D
  },

  headerLabelItemsView:{
    flexDirection:'row',
    marginVertical:verticalScale(10),
  },
  itemsLeftTextStyle: {
    flex:1,
    ...Fonts.style.bold_14,
    color: Colors.rgb_fecd00,
    marginLeft: moderateScale(15),
   alignSelf: 'center',
    marginTop: verticalScale(5)
  },
  titleTextStyle: {
    flex:3,
    ...Fonts.style.bold_18,
    // color: Colors.rgb_1f0808,
    color: Colors.rgb_767676,
    marginLeft: moderateScale(15),
    marginTop: verticalScale(5)
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    height: verticalScale(60),
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: moderateScale(15),
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: moderateScale(75),
    height:moderateScale(80)
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    bottom: 1
  },
  standalone: {
    marginTop: verticalScale(30),
    marginBottom: verticalScale(30),
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical:verticalScale(15)
  },
  standaloneRowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: verticalScale(15),
  },

})
