import { StyleSheet,Platform } from 'react-native'
import {
    Colors,
    Fonts,
} from '@resources'
import { verticalScale} from "@resources/Metrics";
import DeviceInfo from 'react-native-device-info';
export default StyleSheet.create({
    bottomTabBarStyle: {
        shadowColor: 'rgba(58,55,55,0.1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 15,
      elevation: 3,

     // borderTopColor: 'transparent',
      height: Platform.OS=='ios'?DeviceInfo.getModel().includes('iPhone 12')?verticalScale(60): DeviceInfo.hasNotch() ? verticalScale(30): verticalScale(60):70

    },

  tabView:{
      flex: 1,
      alignItems: 'center',
      paddingTop:10
   },
    bottomTabLabelStyle: {
        ...Fonts.style.regular_12,
       paddingVertical: 8,
    },
  bottomTabAddIconStyle:{position:'absolute',marginTop:-20},
  headerTitleStyle:{
      ...Fonts.style.bold_16,
    alignSelf:'center',
    color: Colors.rgb_888B8D,
  },
  offlineTextStyle:{
    backgroundColor:Colors.rgb_eed5de,
    textAlign:'center',
    ...Fonts.style.regular_12,
    paddingVertical: verticalScale(15),
    color: Colors.rgb_898d8d
  },customTabStyles:{
      flexDirection:'row',
      height:Platform.OS=='ios'?DeviceInfo.getModel().includes('iPhone 12')?verticalScale(55): DeviceInfo.hasNotch() ? verticalScale(55): verticalScale(70):70,
      shadowColor: 'rgba(58,55,55,0.1)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 15,
      elevation: 3,
      borderTopWidth:.25,
      borderTopColor:'grey'
  }
})
