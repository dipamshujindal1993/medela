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
  milkItemView: {
    flexDirection: 'row',
    marginVertical: verticalScale(5),
    borderRadius: verticalScale(10)
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
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    bottom: 1,
    top:1,
    right: 2,
  },
  standalone: {
    marginTop: verticalScale(5),
    marginBottom: verticalScale(5),
  },
  standaloneRowFront: {
    backgroundColor: 'white',
    paddingVertical:verticalScale(10),
    flex: 1,
    marginHorizontal: 5
  },
  standaloneRowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: verticalScale(15),
    marginHorizontal: 5
  },

});
