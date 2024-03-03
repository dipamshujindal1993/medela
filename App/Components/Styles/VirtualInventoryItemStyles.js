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
  itemTitleStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
  },
  itemExpiredTitleStyle: {
    ...Fonts.style.bold_16,
    color: 'red',
  },
  itemDateTimeStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_898d8d,
  },
  itemExpiredDateTimeStyle: {
    ...Fonts.style.regular_12,
    color: 'red',
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
  bottleBagTopViewChild:{
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  fridgeFreezerView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5
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
  createdExpireView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10
  },
  textItemContainer:{ width: 0,flexGrow: 1,flex: 1,}
});