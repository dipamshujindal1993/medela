import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contentViewStyles: {
    marginHorizontal: Metrics.moderateScale._25,
    marginBottom: 30,
    paddingBottom: 20
  },
  authorNameStyles: {
    ...Fonts.style.bold_15,
    lineHeight: 18,
    color: Colors.rgb_646363,
    textAlign: 'left'
  },
  versionNameStyles: {
    ...Fonts.style.regular_12,
    lineHeight: 16,
    color: Colors.rgb_898d8d99,
    textAlign: 'left'
  },
  descriptionStyles: {
    ...Fonts.style.regular_12,
    lineHeight: 16,
    color: Colors.rgb_898d8d,
    textAlign: 'left',
    letterSpacing: 0.29
  },
  knowMoreStyles: {
    backgroundColor: Colors.rgb_ffcd00,
    borderRadius: 8,
    padding: 5,
    height: 48,
    justifyContent: 'center'
  },
  knowmoreTextStyles: {
    ...Fonts.style.bold_12,
    lineHeight: 16,
    color: Colors.rgb_000000,
    textAlign: 'center'
  }
})
