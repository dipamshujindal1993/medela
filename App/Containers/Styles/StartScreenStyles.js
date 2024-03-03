import { Dimensions, StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources'

import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
  bottonContainer: {
    paddingHorizontal: Metrics.moderateScale._24,
    position: 'absolute',
    bottom: verticalScale(35),
    left: 0,
    right: 0
  },
  buttonSignUpContainer: {
    height: verticalScale(48),
    borderRadius: verticalScale(16)
  },
  buttonLoginContainer: {
    height: verticalScale(48),
    marginTop: verticalScale(16),
    borderRadius: Metrics.moderateScale._16,
    backgroundColor: Colors.rgb_767676
  },
  loginTextStyle: {
    color: Colors.white
  },
  logo: {
    position: 'absolute',
    top: verticalScale(40),
    left: 0,
    right: 0
  },
  video: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  sliderContainer: {
    position: 'absolute',
    left: 0,
    bottom:verticalScale(150)
  },
  indicatorStyle: {
    marginVertical: verticalScale(8)
  }
})
