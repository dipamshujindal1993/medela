import React from 'react'
import {
  Text,
  View,TouchableOpacity, I18nManager
} from 'react-native'
import I18n from 'react-native-i18n'
import styles from './Styles/CommonHeaderStyles'
import BackIcon from '@svg/arrow_back'
import Colors from "@resources/Colors";
import { useSelector } from 'react-redux'

const CommonHeader=(props)=> {
  const {headerRight,title,backPress,headerRightPress, rightTextColor}=props
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  let backIconColor = selectedTheme === "dark" ? Colors.rgb_767676 : Colors.rgb_fecd00
  const {titleTextColor} = props
  return (<>
    <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,titleTextColor && {color:titleTextColor}]}>{title}</Text>
    <View style={[styles.headerStyle]}>
      <TouchableOpacity onPress={()=>backPress()} accessibilityLabel={I18n.t('accessibility_labels.back_label')} >
      <BackIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={backIconColor}  width={48} height={48}/>
      </TouchableOpacity>
      <Text maxFontSizeMultiplier={1.7} style={[styles.headerRightTextStyle, {color: rightTextColor}]} onPress={()=>headerRightPress?headerRightPress():null} accessibilityLabel={headerRight?headerRight:' '}>{headerRight?headerRight:' '}</Text>
    </View>


    </>)
}

export default CommonHeader
