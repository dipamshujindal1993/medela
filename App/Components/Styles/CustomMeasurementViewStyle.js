import {Platform, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import {verticalScale} from "../../Resources/Metrics";
import DeviceInfo from 'react-native-device-info'

export default StyleSheet.create({
  textInputWrapperStyle:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.rgb_898d8d33,
    borderRadius: 7,
    width: DeviceInfo.getFontScale() > 1.3 ? 130 : 80,
    height: Platform.OS==='ios'?verticalScale(31):verticalScale(35),
    marginTop:5,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    color: Colors.rgb_898d8d,
    alignSelf: "center",
    marginLeft: verticalScale(10),
  },
  heightInputStyle: {
    width:DeviceInfo.getFontScale() > 1.3 ?'auto':50,
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    textAlign: 'center',
    height: Platform.OS==='ios'?verticalScale(31):verticalScale(35),
    paddingRight:10,
  },
  textUnitsStyles:{
    ...Fonts.style.bold_16,
    color:Colors.rgb_646363,
    right: 5,
    alignSelf: 'center',
    bottom: 1,
  },
})
