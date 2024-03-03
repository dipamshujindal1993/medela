import { Constants } from '@resources'
import { Linking } from 'react-native';

export const open = (event, navigationProps) =>{
    if (event === undefined || event === 'about:blank') {
    } else {
        var constants = event.split('?')
        switch (constants[0]) {
            case Constants.OPEN_EXTERNAL:
                Linking.canOpenURL(constants[1].split("=")[1]).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle the url:', constants[0])
                    } else {
                        return Linking.openURL(constants[1].split("=")[1])
                            .catch(error => console.log('Error opening the url: ', error))
                    }
                }).catch(err => console.log('An error occurred', err))
                break
    
            case Constants.OPEN_WEBVIEW:
                break
    
            case Constants.OPEN_SCREEN:
                const screenParam = constants[1]
                const screenParams = screenParam.split("&")
                navigationProps.navigate("ArticleDetailsScreen", {'articleId': screenParams[1].split("=")[1]})
                break
        }
    }
}