import Toast from 'react-native-root-toast'
import styles from './Styles/ToastMessageStyles'

function ToastMessage(msg, style = styles) {
    return (
        Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            containerStyle: {
                ...style.defaultContainerStyle
            },
            textStyle: {
                ...style.textStyle
            }
        })
    )
}

export default ToastMessage
