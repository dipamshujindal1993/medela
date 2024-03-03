import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'
import { verticalScale } from '@resources/Metrics'
export default StyleSheet.create({
    container: {
      paddingHorizontal: Metrics.moderateScale._24,
    },
    image: {
      height: verticalScale(250),
      resizeMode: 'stretch',
    },
    title: {
      ...Fonts.style.bold_18,
      lineHeight: 22,
      color: Colors.rgb_000000,
      textAlign: 'center',
      marginTop: verticalScale(12),
      marginBottom: verticalScale(7)
    },
    desc: {
      ...Fonts.style.regular_12,
      lineHeight: 14,
      letterSpacing: 0.24,
      color: Colors.rgb_000000,
      textAlign: 'center'
    }
});
