import { StyleSheet } from 'react-native'
import { Colors, Fonts } from '@resources'

export default StyleSheet.create({
    textPos: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        ...Fonts.style.bold_14
    },
    textLarge:{
        ...Fonts.style.bold_8
    },
    rtl: {
        flexDirection: 'row-reverse'
    },
    ltr: {
        flexDirection: 'row'
    },
    wayBtnActive: {
        borderWidth: 1,
        marginTop: 2,
        marginRight: 2,
        marginLeft: 2
    },
    mainContainer: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center'
    }
  });