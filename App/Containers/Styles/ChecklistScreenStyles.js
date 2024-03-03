import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

import {verticalScale, moderateScale} from "@resources/Metrics";

export default StyleSheet.create({
  container:{
    //padding:20,
    flex:1,
    //backgroundColor:'red'
  },
  headerTextStyle:{
    ...Fonts.style.bold_17,
    color: Colors.rgb_898d8d,
  },
  itemStyle:{
    flex:2,
   flexDirection:'row',
   //justifyContent:'space-between',
   marginVertical:verticalScale(10),
    marginHorizontal: moderateScale(10),
  },


  imageViewStyle: {
    flex:2.4,
    flexDirection:'row',
    marginHorizontal: moderateScale(10),
  },
  titleStyle:{
   // flex:1,
   // width:'60%',
    ...Fonts.style.bold_15,
    color:Colors.rgb_646363,
   // alignSelf:'center',
    marginHorizontal:moderateScale(15),

  },
  itemsLeftTextStyle:{
    ...Fonts.style.bold_14,
    color:Colors.rgb_fecd00,
    //alignSelf:'center',
    marginHorizontal:moderateScale(15)
  },
  rightArrowStyle:{
    justifyContent:'center',
    alignSelf: 'flex-end',
    marginRight:moderateScale(10),
    transform: [
      { rotateX: "180deg" },
      { rotateY: "180deg" }
    ]}
})
