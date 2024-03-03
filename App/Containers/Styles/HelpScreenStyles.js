import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView:{
    width: displayWidth/1.9,
    height: 48,
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(5),
    marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
    alignSelf: 'center'
  },
  contentView:{
    flex: 1,
    marginHorizontal: Metrics.moderateScale._25,
  },
  listItemViewStyle:{
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: verticalScale(20)
  },
  itemTextViewStyle:{
    alignSelf: "center",
    marginHorizontal: Metrics.moderateScale._20,
  },
  itemTitleTextStyle:{
    ...Fonts.style.bold_15,
    color: Colors.rgb_646363,
    marginBottom: verticalScale(5),
  },
  imageContentView:{
    flexDirection: 'row'
  },
  iconWrapper:{
    alignSelf: "center",
  },
  verticalListStyle:{
    flexGrow: 1
  },
})
