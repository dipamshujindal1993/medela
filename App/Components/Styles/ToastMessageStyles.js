import {
    StyleSheet,
    Dimensions
} from 'react-native'

import {
    Colors,
    Fonts,
} from '@resources'
import DeviceInfo from 'react-native-device-info';
import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
    defaultContainerStyle: {
        alignSelf: 'flex-end',
       // width: 100,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.rgb_00b1eb,
        borderRadius: 24,
        marginTop:DeviceInfo.hasNotch()?verticalScale(20):0
    },
    textStyle: {
        ...Fonts.style.regular_12,
        color: Colors.white,
        textAlign: 'center'
    }
})
