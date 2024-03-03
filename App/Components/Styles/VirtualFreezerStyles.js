import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

import {verticalScale, moderateScale} from '@resources/Metrics'
import DeviceInfo from 'react-native-device-info'

const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    marginLeft: -10
    //marginHorizontal: 10,
  },

  freezerHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: moderateScale(20)
  },
  virtualFreezerTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
    marginLeft: moderateScale(10),
    marginBottom: verticalScale(10)
  },

  freezerButtonContainer: {
    width: windowWidth / 3.6,
    height: 48,
    paddingHorizontal: 0,
  },
  freezerSelectionButtonContainer: {
    width: windowWidth / 6,
    marginLeft: moderateScale(1),
    height: verticalScale(30),
  },
  btnInactive: {
    marginHorizontal: moderateScale(10)
  },
  numberTextInput: {
    height: 48,
    ...Fonts.style.bold_18,
    marginHorizontal: moderateScale(10),
    // opacity: 0.6,
    marginVertical: verticalScale(5),
    color: Colors.rgb_898d8d,
    paddingHorizontal: moderateScale(10),
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 1.0,
    borderColor: Colors.rgb_898d8d
  },

  fridgeFreezerView:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
    marginVertical:verticalScale(10)
  },
  virtualFreezerSelectorView:{
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-around',
    marginVertical:verticalScale(10),
    backgroundColor:'gray',
    borderRadius:verticalScale(8)
  },


});
