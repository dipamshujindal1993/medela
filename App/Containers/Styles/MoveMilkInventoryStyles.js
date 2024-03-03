import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

import {verticalScale, moderateScale} from '@resources/Metrics'

const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  bottleBagFilterViewStyle: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalCountTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
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
  btnContainerInActiveStyle: {
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

  cancelSaveView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 15
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

  footerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(10),

  },
  addMilkTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
    textAlign: 'center'
  },
  quickAddViewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: verticalScale(10)
  },
  quickTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d,
    textAlign: 'center',
    marginTop: verticalScale(10)
  },
  moveMilkTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
  },
  rightArrowStyle: {

    alignSelf: 'flex-end'
  },
  milkItemView: {
    flexDirection: 'row',
    marginVertical: verticalScale(5),
    borderRadius: verticalScale(10)
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
  deleteListStyle: {
    backgroundColor: 'red',
    position: 'absolute',
    right: 0,
    height: '100%',
    width: moderateScale(75),
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteTextStyle: {
    color: Colors.white,
    ...Fonts.style.bold_14,
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
  volumeCountView: {
    marginTop:verticalScale(20),
    alignSelf:'center',
    width:moderateScale(80),
    height:verticalScale(30),
    backgroundColor: Colors.rgb_898d8d33,
    borderRadius: verticalScale(7),
    justifyContent:'center',
  },
  volumeCountTextStyles: {
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    alignSelf: 'center'
  },
  listEmptyView: {
    alignItems: "center",
    marginVertical: verticalScale(80)
  },
  emptyListTextStyle: {
    ...Fonts.style.regular_16,
    color: Colors.rgb_646363,
    marginTop: verticalScale(15)
  },
});
