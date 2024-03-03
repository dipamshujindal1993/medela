import {StyleSheet} from 'react-native'
import {Fonts, Constants, Colors} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  applicationView: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.rgb_1f0808
  },
  welcome: {
    ...Fonts.style.regular_14,
    textAlign: 'center',
    margin: verticalScale(10)
  },
  myImage: {
    width: verticalScale(200),
    height: verticalScale(200),
    alignSelf: 'center'
  }
})
