import React from 'react'
import {
  I18nManager,
  Text, TouchableOpacity,
  View
} from 'react-native'
import BackIcon from '@svg/arrow_back'
import styles from './Styles/HeaderTitleStyles'
import {
  Colors
} from '@resources'
import { verticalScale, moderateScale } from '@resources/Metrics'
import HeaderMedelaLogo from '@svg/ic_logo';
import {useSelector} from 'react-redux'
import I18n from '@i18n';

function HeaderTitle(props) {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  const{
    title,
    onBackPress,
    style,
    medelaLogo,
    headerStyles,
    titleTextColor
  }=props
    return (
      <View style={{...styles.container,...(headerStyles!=undefined&&headerStyles)}}>
        <TouchableOpacity
          accessibilityLabel={I18n.t("accessibility_labels.back_label")}
          accessible={true}
          style={styles.backIconStyle} activeOpacity={1} onPress={onBackPress}>
          {medelaLogo ?
            <HeaderMedelaLogo fill={Colors.rgb_888B8D} style={styles.medelaLogoStyle}/>:
            <BackIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_fecd00} width={moderateScale(30)} height={verticalScale(30)}/>
          }
        </TouchableOpacity
          >
        <Text numberOfLines={1} maxFontSizeMultiplier={title.length <=20? 1.5:1.1} style={[styles.title, style,{color: selectedTheme=='dark'?Colors.white:Colors.rgb_000000}, titleTextColor && titleTextColor != undefined && {color:titleTextColor} ]}>{title}</Text>
      </View>
    )
}

export default HeaderTitle
