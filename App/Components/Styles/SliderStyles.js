import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

import { verticalScale } from '@resources/Metrics'

export default StyleSheet.create({
    image: {
      height: verticalScale(30),
      resizeMode: 'stretch',
    },
    container: {
      height: verticalScale(150),
    },
    indicatorContainerStyle: {
      marginTop: 18,
    },
    shadow: {
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 3, height: 3},
          shadowOpacity: 0.4,
          shadowRadius: 10,
        },
        android: {
          elevation: 5,
        },
      }),
    },
});
