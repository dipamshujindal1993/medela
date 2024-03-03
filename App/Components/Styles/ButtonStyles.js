import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_1d1d1b,
    lineHeight: 20.3,
    letterSpacing: 0.8
  },
})
