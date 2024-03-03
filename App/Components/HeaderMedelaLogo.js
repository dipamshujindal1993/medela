import React from 'react'
import {
    View
} from 'react-native'

import {
    Colors
} from '@resources'

import styles from './Styles/HeaderMedelaLogoStyles'
import HeaderLogo from '@svg/header_medela_logo'

function HeaderMedelaLogo(props) {
   const {isMaintenanceScreen,themeSelected}=props
    return (
        <View style={[styles.container,props.style]}>
            <HeaderLogo height={40} width={160} fill={isMaintenanceScreen && themeSelected==='dark'?Colors.white:Colors.rgb_000000}/>
        </View>
    )
}

export default HeaderMedelaLogo