import {Dimensions, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

const { width, height } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    width:width,
    alignSelf:'center',
    paddingHorizontal: 24,
  },
  image: {
    alignSelf: 'center',
    width:width,
    height: height/2.5,
    resizeMode: 'contain',
  },
  title: {
    ...Fonts.style.bold_18,
    lineHeight: 22,
    color: Colors.rgb_898d8d,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 7
  },
  desc: {
    ...Fonts.style.regular_12,
    lineHeight: 14,
    letterSpacing: 0.24,
    color: Colors.rgb_898d8d,
    textAlign: 'center'
  }
});
