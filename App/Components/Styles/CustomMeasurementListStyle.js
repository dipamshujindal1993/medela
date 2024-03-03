import { StyleSheet, Dimensions } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";
const displayWidth = Dimensions.get('window').width;
const displayHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  viewContainerStyle:{
    backgroundColor: Colors.white,
    position: 'absolute',
    top: verticalScale(5),
    paddingBottom: verticalScale(50),
    height: displayHeight,
    width: displayWidth,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    bottom: 0,
    elevation: 6,
    shadowOffset: { width: 0, height: verticalScale(6) },
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
   // right: moderateScale(15),
  },
  headerViewStyle: {
    height: verticalScale(50),
    width: moderateScale(350),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  titleViewStyles: {
    flex: 1, 
    alignItems: 'center', 
    marginLeft: verticalScale(30)
  },
  iconViewStyles: {
    flex: 0.1, 
    alignItems: 'flex-end'
  },
  headerTextStyle: {
    ...Fonts.style.bold_18,
    lineHeight: 25,
    color: Colors.rgb_898d8d
  },
  measurementsListViewStyles: {
    height: verticalScale(50),
    width: moderateScale(350),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderColor: Colors.rgb_979197
  },
  measurementsTextStyles: {
    ...Fonts.style.regular_16,
    lineHeight: verticalScale(25),
    textAlign: 'center',
    color: Colors.rgb_898d8d

  },
  selectedMeasumentTextValueStyles: {
    ...Fonts.style.bold_16,
    lineHeight: verticalScale(25),
    textAlign: 'center',
    color: Colors.rgb_646363
  }
})
