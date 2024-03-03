import {Platform, StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
  } from '@resources'
import {moderateScale, verticalScale} from "../../Resources/Metrics";

export default StyleSheet.create({
  noArticleViewStyle: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  noArticleSvgStyles: {
    height: verticalScale(84),
    width: Metrics.moderateScale._134,
  },
  noArticleTitle: {
    textAlign: 'center',
    lineHeight: 22,
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8)
  },
  noArticleDescription: {
    textAlign:'center',
    lineHeight: 16,
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    letterSpacing: 0.29,
    marginHorizontal: Metrics.moderateScale._65
  },
  loadMoreStyles: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#898d8d', 
    marginHorizontal: Metrics.moderateScale._120, 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: verticalScale(30)
  }
});
