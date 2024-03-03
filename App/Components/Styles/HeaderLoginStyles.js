import { StyleSheet } from 'react-native'
import DeviceInfo from "react-native-device-info";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection : 'row',
        justifyContent: 'space-between',
        marginTop:DeviceInfo.getModel().includes('iPhone 12')?60:0
    },
    logo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
