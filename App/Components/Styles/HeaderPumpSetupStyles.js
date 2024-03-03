import {StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
  container: {
    width: '100%',
    height: verticalScale(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_ffcd00,
    lineHeight: 20.3,
    letterSpacing: 0.8,
    position: 'absolute',
    right: Metrics.moderateScale._20
  },
  backIconStyle: {
    position: 'absolute',
    left: Metrics.moderateScale._15
  },
})
