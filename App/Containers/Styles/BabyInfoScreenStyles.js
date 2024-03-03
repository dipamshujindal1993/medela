import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'
import { I18nManager } from 'react-native';
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({

  container: {
    flex: 1,
  },
  headerView:{
    width: displayWidth/1.6,
    height: verticalScale(25),
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(8),
    // marginHorizontal : Metrics.moderateScale._10,
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
  },
  imageWrapper:{
    maxHeight: verticalScale(220),
    marginBottom: verticalScale(10),
    backgroundColor: Colors.rgb_898d8d,
    //borderBottomLeftRadius: verticalScale(20),
   // borderBottomRightRadius: verticalScale(20),
    /*...Platform.select({
      ios: {
        shadowColor: Colors.rgb_000000,
        shadowOffset: { width: 0, height: verticalScale(2) },
        shadowOpacity: 0.8,
        shadowRadius: Metrics.moderateScale._2,
      },
      android: {
        elevation: verticalScale(15),
      },
    }),*/
  },
  imageStyle:{
    height: verticalScale(220),
    width: displayWidth,
 //   borderBottomLeftRadius: verticalScale(20),
 //   borderBottomRightRadius: verticalScale(20),
    overflow: 'hidden',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  textInput:{
    width: Metrics.percentage._100,
    ...Fonts.style.bold_16,
    marginTop: verticalScale(8),
    color:Colors.rgb_898d8d,
    paddingHorizontal: Metrics.moderateScale._10,
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth: verticalScale(1),
    borderColor:Colors.rgb_898d8d,
  },
  textInputStyle:{
    width: Metrics.percentage._100,
  },
  genderView:{
    flexDirection: 'row',
    width: Metrics.percentage._100,
    justifyContent: 'space-between',
    marginVertical: verticalScale(20),
  },
  genderTitleView:{
    alignSelf: "center",
  },
  genderTitleTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_646363,
    marginLeft: Metrics.moderateScale._8
  },
  genderBtnView:{
    flexDirection: "row",
  },
  buttonStyle:{
    width: Metrics.moderateScale._88,
    height: verticalScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Metrics.moderateScale._10,
    marginVertical: verticalScale(10),
    backgroundColor: Colors.rgb_f5f5f5,
    borderRadius: Metrics.moderateScale._10,
  },
  buttonTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d
  },
  deleteBtnWrapper:{
    flex: 1,
    position: "absolute",
    bottom: verticalScale(0),
    width: Metrics.percentage._100,
  },
  deleteButtonStyles: {
    paddingVertical: verticalScale(12),
    borderRadius: Metrics.moderateScale._10,
    backgroundColor:Colors.white,
    marginVertical: verticalScale(20)
  },
  deleteTextStyle: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d
  },
  editPhotoIconView:{
    alignSelf: 'flex-end',
    marginRight: Metrics.moderateScale._20,
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(2)
  },
  editPhotoIconStyle:{
    height: verticalScale(22),
    width: Metrics.moderateScale._22,
  },
  weightListView:{
    height: '100%',
    zIndex: 2,
    // left: Metrics.moderateScale._15,
  },
  contentWrapper:{
    flex: 1,
    alignItems: "center",
    alignSelf: 'center',
    width: Metrics.percentage._85,
  }
})
