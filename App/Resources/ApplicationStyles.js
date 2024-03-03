import { Platform } from 'react-native'
import DeviceInfo from "react-native-device-info";

// This file is for a reusable grouping of Theme items.

const ApplicationStyles = {

    titleStyle: {
        ...Platform.select({
            android: {
                paddingLeft: 16,
            }
        }),
    },
    backIcon: {
        ...Platform.select({
            ios: {
                margin: 12,
                marginTop:DeviceInfo.getModel().includes('iPhone 12')?60:0
            },
        }),
    },
    noShadowHeaderStyle: {
        ...Platform.select({
            ios: {
                borderBottomWidth: 0,
            },
            android: {
                elevation: 0,
            }
        }),
    },
}

export default ApplicationStyles
