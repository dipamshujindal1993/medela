import { StyleSheet } from 'react-native';
import {verticalScale} from "@resources/Metrics";

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    itemStyling: {
        height: verticalScale(25),
    },
    tenthItemStyles: {
        height: verticalScale(62),
    }
});