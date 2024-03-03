import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelSaveView:{
    flexDirection:'row',
    justifyContent:'center',
    position:'absolute',
    bottom:0,
    left:20,
    right:20,
    // backgroundColor:Colors.white,
    paddingBottom:30,
  },
  cancelButtonStyles:{
    marginTop: 10,
    width:'45%',
    paddingVertical:12,
    backgroundColor:Colors.rgb_767676,
    borderRadius:10,
    minHeight: 48
  },
  cancelTextStyle:{
    color:'white',
    ...Fonts.style.bold_16,

  },
  saveButtonStyles:{
    marginTop: 10,
    width:'45%',
    paddingVertical:12,
    borderRadius:10,
    backgroundColor:Colors.rgb_fecd00
  },
  saveTextStyle:{
    ...Fonts.style.bold_16,
  },
})
