import {StyleSheet, Dimensions, I18nManager} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'

const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Metrics.moderateScale._5,
  },
  headerView:{
    marginVertical: verticalScale(10),
    width: displayWidth/2,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
  },
  contentView:{
    marginHorizontal: Metrics.moderateScale._20,
    marginTop: verticalScale(20)
  },
  titleTextStyle:{
    ...Fonts.style.bold_14,
    color: Colors.rgb_646363,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  allTextStyle:{
    ...Fonts.style.bold_15,
    color: Colors.rgb_898d8d
  },
  selectAllView:{
    marginTop: verticalScale(15),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectDateView:{
    marginTop: verticalScale(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContentView:{
    marginTop: verticalScale(15),
  },
  listItemView:{
    marginTop: verticalScale(2),
  },
  list1ItemView:{
    marginTop: verticalScale(2),
    paddingBottom:100,
  },
  itemWrapper:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageTextWrapper:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextStyle:{
    ...Fonts.style.bold_15,
    color: Colors.rgb_898d8d,
    marginLeft: Metrics.moderateScale._10,
  },
  exportDataBtnView:{
    position: 'absolute',
    bottom: 30,
    marginTop: verticalScale(25),
    alignSelf: 'center',
  },
  exportButtonStyles:{
    height: 51,
    width: displayWidth/1.2
  },
  exportBtnTextStyle:{
    ...Fonts.style.bold_16,
  },
  calendarTextWraper:{
    flexDirection: 'row',
    marginRight: Metrics.moderateScale._10,
  },
  startEndDateStyle:{
    ...Fonts.style.regular_14,
   color:Colors.rgb_898d8d,
    alignSelf: 'center'
  },
  emptyListView:{
    flexDirection: "column",
    alignSelf: 'center',
    marginVertical: verticalScale(80)
  },
  emptyListIconView:{
    marginVertical: verticalScale(20)
  },
  emptyListTextStyle:{
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
  }
});

