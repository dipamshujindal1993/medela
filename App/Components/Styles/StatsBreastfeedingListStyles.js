import {StyleSheet, Dimensions} from 'react-native';
import {Colors, Fonts} from '@resources';

export default StyleSheet.create({
  container:{
    flex:1
  },
  itemWrapper: {
    flexDirection: 'row',
  //  marginBottom: 30,
  },
  expViewStyle:{
    marginHorizontal: 5,
    position:'absolute',
    bottom:1,
    right:0
  },
  bluetoothViewStyle:{
    marginHorizontal: 5,
    position:'absolute',
    top:1,
    right:0
  },
  noteStyle:{
    marginHorizontal: 5,
  },
  itemTextWrapperStyle:{
    flex: 2,
    marginHorizontal:10,
    justifyContent:'space-between'
  },
  timeTextStyle:{
    ...Fonts.style.bold_15,
    color:Colors.rgb_646363,
  },
  durationTextStyle:{
    ...Fonts.style.regular_18,
    color:Colors.rgb_898d8d,
  },
  parentView:{
    flexDirection:'row',
    justifyContent:'space-between'
  },

  hoursAgoTextStyle:{
    ...Fonts.style.regular_12,
    color:Colors.rgb_898d8d,
  },
  itemsLeftRightTextStyle:{
    ...Fonts.style.regular_18,
    color:Colors.rgb_898d8d,
  },
  rightArrowStyle:{
    justifyContent:'center',
    alignSelf: 'flex-end',
    marginRight:10,
    transform: [
      { rotateX: "180deg" },
      { rotateY: "180deg" }
    ]}
});

