import { StyleSheet } from 'react-native'
import {
    Colors,
    Fonts,
    Metrics
} from '@resources'
import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
    title: {
        ...Fonts.style.bold_16,
        color: Colors.rgb_000000,
        position:'absolute'
    },
    container:{
      flexDirection:'row',
      width:'100%',
      justifyContent:'center',
      alignItems:'center',
      height:50
    },
    backIconStyle:{
      position:'absolute',
      left:4,
      padding: verticalScale(13)
    },
    medelaLogoStyle:{
      marginHorizontal: Metrics.moderateScale._4
    }
})
