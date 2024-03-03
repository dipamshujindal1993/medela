import React from 'react'
import {
    View
} from 'react-native'

import styles from './Styles/HeaderLoginStyles'
import HeaderLogo from '@svg/ic_logo'
import { useSelector } from 'react-redux'
import {Colors} from '@resources';

function HeaderLogin() {
    const selectedTheme = useSelector(state=>state.app.themeSelected)
    return (
        <View style={styles.container}>
            <View style={styles.logo}>
                <HeaderLogo fill={selectedTheme==="dark"? Colors.rgb_767676: Colors.rgb_ffcd00}/>
            </View>
        </View>
    )
}

export default HeaderLogin