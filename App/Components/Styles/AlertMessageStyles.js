import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginVertical: 25
  },
  contentContainer: {
    alignSelf: 'center',
    alignItems: 'center'
  },
  message: {
    ...Fonts.style.regular_12,
    marginTop: 10,
    marginHorizontal: 10,
    textAlign: 'center',
    color: Colors.rgb_e0d7e5
  },
  icon: {
    color: Colors.rgb_e0d7e5
  }
})
