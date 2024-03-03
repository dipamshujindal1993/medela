import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerView:{
    height: 48,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
    alignSelf: 'center',
  },
  contentView:{
    flex: 1,
    marginLeft: Metrics.moderateScale._15,
  },
  backArrowViewStyle:{
    position:'absolute',
    left:10,
    // paddingHorizontal:5
  }
})
