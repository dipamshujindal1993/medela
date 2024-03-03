import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts, Metrics} from '@resources';
import { verticalScale,moderateScale } from '@resources/Metrics'
const displayWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex:1
  },
  title: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
    alignSelf: 'center',
    marginVertical: verticalScale(20),
  },
  horizontalListStyle: {
    paddingHorizontal: Metrics.moderateScale._10,
    justifyContent: 'space-around',
    alignItems: "center",
    height: verticalScale(55)
  },
  horizontalRenderItemView: {
    justifyContent: 'center',
    paddingHorizontal: Metrics.moderateScale._3
  },
  horizontalCalenderListStyle: {
    width: displayWidth,
    paddingHorizontal: Metrics.moderateScale._16,
    justifyContent: 'space-around'
  },

  currentDayName:{
    justifyContent:'center',
    textAlign:'center',
    marginVertical:5,
    color:Colors.rgb_646363,
    ...Fonts.style.bold_14,
  },
  currentDateSelectedItem:{
    width:verticalScale(30),
    height:verticalScale(30),
    borderRadius:verticalScale(15),
    backgroundColor:Colors.rgb_ffcd00,
    justifyContent:'center'
  },
  currentDateSelectedText:{
    color:'white',
    justifyContent:'center',
    textAlign:'center',
    ...Fonts.style.bold_18,
  },
  bottomLine:{
    justifyContent:'center',
    marginTop:verticalScale(5),
    alignSelf:'center',
    width:25,
    height:2,
    paddingVertical:2,
    backgroundColor:Colors.rgb_898d8d
  },
  last7DaysSelectedItem:{
    width:verticalScale(30),
    height:verticalScale(30),
    borderRadius:verticalScale(15),
    justifyContent:'center'
  },
  last7DaysSelectedText:{
    color:Colors.rgb_898d8d,
    justifyContent:'center',
    textAlign:'center',
    ...Fonts.style.bold_18,
  },

  horizontalCalenderRenderItemView: {
    minHeight: verticalScale(100),
    justifyContent: 'center',
  },
  dateAndTimeContainer: {
    marginTop: verticalScale(10),
    paddingHorizontal: Metrics.moderateScale._16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dateAndTimeTextWrapper: {
    flexDirection: 'column',
  },
  dayText: {
    ...Fonts.style.bold_18,
    alignSelf: 'center',
    color: Colors.rgb_898d8d,
  },
  dateText: {
    ...Fonts.style.regular_14,
    color: Colors.rgb_898d8d,
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: verticalScale(30),
  },
  itemHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: Metrics.moderateScale._10,
    marginRight: Metrics.moderateScale._10,
  },
  verticalListStyle: {
    flexGrow: 1,
    marginHorizontal: Metrics.moderateScale._10,
    marginTop: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  itemContentStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listEmptyView: {
    alignItems: "center",
    marginVertical: verticalScale(30)
  },
  emptyListTextStyle: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
    marginTop: verticalScale(15)
  },
  graphEmptyStyle:{
    ...Fonts.style.regular_14,
    color: Colors.rgb_646363,
    marginTop: verticalScale(15),
    alignSelf:'center',
    textAlign:'center'
  },
  graphEmptyViewStyle:{
    flex:1,justifyContent:'center',alignItems:'center'
  },
  barContainer: {
    height: verticalScale(220),
    marginTop: verticalScale(16)
  },
  iconStyle:{
    marginHorizontal: 5
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    height: verticalScale(60),
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: moderateScale(15),
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: moderateScale(75),
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    bottom: 1,
    top:1,
    right: 2,
  },
  standalone: {
    marginTop: verticalScale(30),
    marginBottom: verticalScale(30),
  },
  standaloneRowFront: {
    backgroundColor: 'white',
    paddingVertical:verticalScale(10),
    flex: 1,
    marginHorizontal: 5
  },
  standaloneRowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: verticalScale(15),
    marginHorizontal: 5
  },
  statsAllView:{
    flexDirection:'row'
  },
  statsChildrenView:{
    backgroundColor:Colors.rgb_898d8d99,
    flex:1,
    height:verticalScale(30),
    justifyContent:'center',
  },
  statsMotherView:{
    backgroundColor:Colors.rgb_fecd00,
    flex:1,
    height:verticalScale(30),
    justifyContent:'center'
  },
  statsChildrenTextView:{
    alignSelf:'center',
    color:Colors.white
  },
  statsMotherTextView:{
    alignSelf:'center',
    color:Colors.white
  },
  backTextWhite: {
    color: '#FFF',
  },
  avatarView:{borderRadius:80,
    borderWidth:2}
});

