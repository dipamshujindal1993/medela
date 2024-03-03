import { StyleSheet } from 'react-native'
import {
  Colors,
  Fonts
} from '@resources'

export default StyleSheet.create({
  containerStyle: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    margin: 20
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  dialogView: {
    marginHorizontal: 34,
    paddingTop: 23,
    paddingBottom: 17,
    paddingLeft: 33,
    paddingRight: 27,
    borderRadius: 14,
    backgroundColor: Colors.white,
    elevation: 6,
    shadowOffset: { width: 0, height: 6 },
    shadowColor: Colors.rgba_0000004c,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  title: {
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
    lineHeight: 22
  },
  titleStyles: {
    textAlign: 'center',
    lineHeight: 22,
    ...Fonts.style.bold_18,
    color: Colors.rgb_898d8d,
  },
  avatarTextStyles: {
    textAlign: 'center',
    lineHeight: 18,
    ...Fonts.style.bold_15,
    color: Colors.rgb_898d8d,
  },
  selectedIconStyles: {
    right: 10, 
    top: -5, 
    elevation: 3, 
    position: 'absolute',
    zIndex: 9
  }
})