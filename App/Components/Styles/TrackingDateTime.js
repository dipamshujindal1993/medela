import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts
} from '@resources'

export default StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection:'row',
    marginHorizontal:25
  },
  dateTextStyle:{
    ...Fonts.style.bold_18,
    color: Colors.rgb_646363,
  },
  timeTextStyle:{
    ...Fonts.style.bold_18,
    color: Colors.rgb_646363,
  }

})
