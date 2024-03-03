import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

import { verticalScale } from '@resources/Metrics'

const { width, height } = Dimensions.get("window")

export default StyleSheet.create({
    container: {
      justifyContent:'center',
      alignItems:'center',
      height: height/1.2,
      width: width
    }
});
