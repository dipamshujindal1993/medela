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
  text: {
    ...Fonts.style.bold_16,
    color: Colors.rgb_1d1d1b,
    lineHeight: 20.3,
    letterSpacing: 0.8
  },
  placeholderStyle:{
    color:Colors.rgb_898d8d,
    ...Fonts.style.bold_16,
  },
  dateIconStyle:{
    width:0,
    height:0
  },
  dateInputStyles:{
    borderWidth: 0,
    alignItems: 'flex-start',
  },
  dateText:{
    color:Colors.rgb_898d8d,
    ...Fonts.style.bold_16,
  },
  errorMessage: {
    ...Fonts.style.regular_12,
    color: Colors.rgb_e73536,
    marginHorizontal:10,
    marginTop:-15
  },
  confirmBtnText:{
    color:Colors.rgb_fecd00
  }

})
