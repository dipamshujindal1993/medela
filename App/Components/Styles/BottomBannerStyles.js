import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  container: {
    width:'100%',
    backgroundColor:Colors.rgb_efdae3,
    flexDirection:'row',
    paddingHorizontal:10,
    height:70,
    alignItems: 'center'

  },

  iconView:{
    flex:1,
    marginRight:10
  },
  bluetoothViewStyle:{
    marginHorizontal: 5,
    position:'absolute',
    top:-3,
    right:-5
  },
  titleStyle:{
   flex:2,
    marginLeft:12
  },
  titleTextStyle:{
    ...Fonts.style.bold_14,
    color: Colors.rgb_646363,
  },
  subTitleTextStyle:{
    ...Fonts.style.regular_12,
    color: Colors.rgb_646363,
  },
  viewTouchableStyle:{
    backgroundColor:'white',
    borderRadius:10,
    alignItems:'center',
    paddingHorizontal: 10,
    paddingVertical:3,
    marginRight:10,
    justifyContent:'center'
  },
  viewTextStyle:{
    ...Fonts.style.bold_12,
    color: Colors.rgb_646363,
  },
  text: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_1d1d1b,
    lineHeight: 20.3,
    letterSpacing: 0.8
  },
  crossIconStyle:{
    marginHorizontal:5
  },

  dotContainerStyle:{
    flexDirection:'row',   position:'absolute',bottom:4,right:10
  },
  dotStyle:{
    backgroundColor:'green',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDotStyle:{
    backgroundColor:'blue',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  timerTextStyle:{
    color: Colors.rgb_70898d8d,
    fontSize: 14,
    marginHorizontal: 10
  }
})
