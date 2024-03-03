import { StyleSheet } from 'react-native'
import { Colors, Fonts, Metrics } from '@resources'
import { verticalScale } from '@resources/Metrics'
import DeviceInfo from 'react-native-device-info'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginRight: Metrics.moderateScale._8,
    marginTop: 35,
    marginBottom: verticalScale(10)
  },
  chart: {
    flex: 1,
    marginTop: DeviceInfo.getFontScale()>1.6?verticalScale(30):verticalScale(8),
    top: DeviceInfo.getFontScale()>1.6?verticalScale(30):0
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: Metrics.moderateScale._8,
    marginTop: verticalScale(5)
  },
  title: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_646363
  },
  WHOContainer: {
    position: 'absolute',
    top: 0,
    right: Metrics.moderateScale._8
  },
  DurationContainer: {
    position: 'absolute',
    top: DeviceInfo.getFontScale()>1.6?verticalScale(30):0,
    right: Metrics.moderateScale._50
  },
  unitLeft: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    alignSelf: 'center',
    marginLeft: 4,
    marginTop: 15,
   transform: [{ rotate: "270deg" }]
  },
  unitBottom: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    alignSelf: 'center',
    justifyContent:'center',
    marginTop: verticalScale(5),
  },
  unitRight: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    alignSelf: 'center',
    marginRight: 4,
    transform: [{ rotate: "270deg" }]
  },
  listEmptyView: {
    alignItems: "center",
    marginVertical: verticalScale(30)
  },
  emptyListTextStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    marginTop: verticalScale(15)
  },
  noInternetTextStyle: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_646363,
    textAlign: 'center',
    marginTop: verticalScale(15),
    
  },
  noInternetViewStyle:{flex:1,justifyContent:'center'}
})
