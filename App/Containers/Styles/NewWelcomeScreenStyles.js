import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'
import {verticalScale, moderateScale} from "@resources/Metrics";
import DeviceInfo from "react-native-device-info";

export default StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'column'
  },
  buttonContainer: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: DeviceInfo.hasNotch()?20:0
  },
  button:{
    marginHorizontal:moderateScale(20),
    ...Fonts.style.bold_16,
    borderRadius: verticalScale(18),
    marginVertical:verticalScale(10),
    height: verticalScale(50),
    width:'90%',
    position: 'absolute',
    bottom: 0
  },
  imageContainer:{
    flex: 1,
  },
  imageStyle:{
    width:'100%'
  },
  title:{
    fontSize:22,
    color:'rgba(137, 141, 141, 1)',
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:moderateScale(20),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
    ...Fonts.style.bold_18,
  },
  subTitle:{
    color:'rgba(137, 141, 141, 1)',
    alignSelf:'center',
    textAlign:'center',
    marginHorizontal:moderateScale(20),
    marginVertical: verticalScale(5),
    ...Fonts.style.regular_16,
  },
})
