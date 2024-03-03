import { StyleSheet } from 'react-native'
import {Fonts,Colors} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";
import colors from '../../Resources/Colors';

export default StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: verticalScale(40),
    left: 0,
    right: 0,
    marginBottom:0
  },

  imageStyle:{
    marginTop:0  ,
    marginBottom:verticalScale(50) 
  },
  title:{
    color:colors.rgb_898d8d,
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:moderateScale(20),
    marginVertical: verticalScale(5),
    ...Fonts.style.bold_18,
  },
})