import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(255,255,255,0)'
  },
  timeTitle: {
    ...Fonts.style.bold_16,
    lineHeight: 19,
    color: Colors.rgb_646363,
    paddingBottom: 8
  },
  ctaView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  cta: {
    ...Fonts.style.bold_14,
    textAlign: 'center',
    letterSpacing: 0.5,
    color: Colors.rgb_ffcd00,
    minWidth: 75,
    paddingTop: 11,
    paddingBottom: 9,
    paddingLeft: 9,
    paddingRight: 8,
    marginLeft: 8,
  },
  title: {
    ...Fonts.style.bold_18,
    textAlign: 'center',
    color: Colors.rgb_868B8D,
    marginVertical:20
  },
  message: {
    ...Fonts.style.regular_16,
    textAlign: 'center',
    color: Colors.rgb_868B8D,
  },
  background: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    width: '90%',
    borderColor: Colors.rgb_b9b9b9,
    shadowOffset: { width: 0, height: -2 },
    shadowColor: Colors.rgb_b9b9b9,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
    margin:20,
    paddingVertical:10
  },
})
