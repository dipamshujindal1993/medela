import {StyleSheet, Dimensions, I18nManager} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale } from '@resources/Metrics'
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex:1,
  },
  headerView:{
    width: displayWidth/1.4,
    height: verticalScale(25),
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: verticalScale(10),
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_888B8D,
  },
  contentViewStyle:{
    marginHorizontal: Metrics.moderateScale._30,
  },
  motivationTextViewStyle:{
    marginVertical: verticalScale(15),
  },
  motivationTextStyle:{
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
    alignSelf: "center",
    marginBottom: verticalScale(3),
  },
  contentListView:{
    flex: 1,
    paddingBottom: verticalScale(30)
  },
  verticalListStyle:{
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  itemQuesTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_898d8d,
    marginBottom: verticalScale(10),
    width: Metrics.moderateScale._300,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  itemViewStyle:{
    flex: 1,
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  buttonView:{
    width: Metrics.moderateScale._300,
    minHeight: verticalScale(35),
    paddingHorizontal: Metrics.moderateScale._12,
    justifyContent: 'center',
    // borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
    marginTop: verticalScale(8),
  },
  btnTextStyle:{
    ...Fonts.style.regular_16,
    writingDirection:I18nManager.isRTL?'rtl':'ltr'
  },
  submitButtonStyles: {
    alignSelf: 'center',
    width: '80%',
    paddingVertical: verticalScale(10),
    borderRadius: 10,
    backgroundColor:Colors.rgb_fecd00,
    marginBottom: verticalScale(20)
  },
  submitTextStyle: {
    ...Fonts.style.bold_16,
  },
  itemQuesView:{
    flexDirection: "row",
    marginTop: verticalScale(5),
  },
  itemIndexViewStyle:{
    backgroundColor: Colors.rgb_e7e8e8,
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(23),
    width: Metrics.moderateScale._24,
    borderRadius: 20,
    marginRight: Metrics.moderateScale._10,
    marginTop: verticalScale(2)
  },
  itemIndexTextStyle:{
    ...Fonts.style.bold_14,
    color: Colors.rgb_646363,
  },
  textInput:{
    height: 40,
    width:'100%',
    ...Fonts.style.bold_16,
    marginVertical:20,
    color:Colors.rgb_898d8d,
    paddingHorizontal:10,
    borderTopWidth:0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderBottomWidth:1.0,
    borderColor:Colors.rgb_898d8d
  },
  dateTextInputStyle:{
    width: '80%',
  }
});