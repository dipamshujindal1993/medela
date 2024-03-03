import {StyleSheet} from 'react-native'
import {
  Colors,
  Fonts,
} from '@resources'

export default StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal:15,
    paddingVertical:10,
  },

  headerRightTextStyle:{
    ...Fonts.style.bold_16,
    color: Colors.rgb_fecd00,
    marginRight:5
  },

  headerTextStyle: {
    position:'absolute',
    left:0,
    right:0,
    
    textAlign: 'center',
    justifyContent: 'center',
    ...Fonts.style.bold_17,
    color: Colors.rgb_898d8d,
  },
})
