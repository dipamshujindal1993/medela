import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Keyboard} from 'react-native';
import styles from './Styles/VirtualFreezerStyles';
import Colors from "../Resources/Colors";
import CustomOptionSelector from "./CustomOptionSelector";
import I18n from "react-native-i18n";
import CustomTextInput from "./CustomTextInput";
import SwitchOnIcon from '@svg/ic_switch_on'
import SwitchOffIcon from '@svg/ic_switch_off'
import {useSelector} from 'react-redux'

const VirtualFreezer =(props)=>{
  const {title,switchButton,bottle,clearAllFiltered,isClearFilter,isBottleTracking,onBottleBagChange,trayNumber,onFridgeFreezerChange,defaultBottleSelected,defaultFridgeSelected,onTrayChangedText,bottleNumber,onNumberChangedText}=props
  const [isSwitchEnabled,SetIsSwitchEnabled]=useState(false)
  const [isClearFilterSwitchEnabled,SetIsClearSwitchEnabled]=useState(false)
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  const {titleTextColor} = props

  const switchFunc=()=>{
    return(
      <TouchableOpacity
        onPress={()=>{SetIsSwitchEnabled(!isSwitchEnabled)}}>
        {isSwitchEnabled ? <SwitchOnIcon width={30} height={30}/> :
          <SwitchOffIcon width={30} height={30}/>}
      </TouchableOpacity>
    )
  }

  const filterSwitchFunc=()=>{
    return(
      <TouchableOpacity
        onPress={()=>{
          clearAllFiltered()
        }}>
          <View style={{alignItems:'center'}}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.virtualFreezerTextStyle,{color:Colors.rgb_fecd00}]}>{I18n.t('virtual_freezer.clear_filter')}</Text>

          </View>

      </TouchableOpacity>
    )
  }

  const renderBottleBagView=()=>{
    let bottleBagOption = [ {
      label: I18n.t('bottle_tracking.bottle'),
      value: 1,
    }, {
      label: I18n.t('bottle_tracking.bag'),
      value: 2,
    }];
    return <View style={styles.fridgeFreezerView}>
      <CustomOptionSelector
        defaultSelectedIndex={defaultBottleSelected}
        buttonContainerStyle={styles.freezerButtonContainer}
        buttonTextInactiveStyle={styles.btnTextInactive}
        buttonTextActiveStyle={styles.btnTextActive}
        data={bottleBagOption}
        onChange={(item) => onBottleBagChange(item.value)}/>
      <View style={{flex: 1, height: 50,}}>
        <CustomTextInput
          inputStyle={[styles.numberTextInput,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)},titleTextColor && {color:titleTextColor} ]}
          style={{height: 30}}
          maxLength={3}
          textContentType="postalCode"
          placeholder={I18n.t('breastfeeding_pump.number')}
          placeholderTextColor={titleTextColor ? titleTextColor : selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}
          returnKeyType={"done"}
          onSubmitEditing={Keyboard.dismiss}
          onChangeText={(index, value) => {
            onNumberChangedText(value)
          }}
          value={bottleNumber}
          textStyles={[styles.numberTextInput,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}/>
      </View>
    </View>
  }

  const renderFreezerView=()=>{
    let fridgeFreezerOption = [{
      label: I18n.t('bottle_tracking.fridge'),
      value: 1,
    }, {
      label: I18n.t('bottle_tracking.freezer'),
      value: 2,
    }];
    return <View style={styles.fridgeFreezerView}>
      <CustomOptionSelector
        defaultSelectedIndex={defaultFridgeSelected}
        buttonContainerStyle={styles.freezerButtonContainer}
        buttonTextInactiveStyle={styles.btnTextInactive}
        buttonTextActiveStyle={styles.btnTextActive}
        data={fridgeFreezerOption}
        onChange={(item) => onFridgeFreezerChange(item.value)}/>
      <View style={{flex: 1, height: 50,}}>
        <CustomTextInput
          inputStyle={[styles.numberTextInput,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}, titleTextColor && {color:titleTextColor}]}
          // style={{height: 30}}
          maxLength={3}
          textContentType="postalCode"
          returnKeyType={"done"}
          onChangeText={(index, value) => {
            onTrayChangedText(value)
          }}
          value={trayNumber}
          onSubmitEditing={()=>Keyboard.dismiss()}
          placeholder={I18n.t('breastfeeding_pump.tray')}
          placeholderTextColor={titleTextColor ? titleTextColor : selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}
          textStyles={[styles.numberTextInput,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}
          enableDoneButton={true}
        />
      </View>
    </View>
  }

  const renderHeaderView=(title)=> {
    return <View style={{marginTop: 10,}}>
      <View style={styles.freezerHeaderStyle}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.virtualFreezerTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}, titleTextColor && {color:titleTextColor}]}>{title}</Text>
          {switchButton && switchFunc()}
          {isClearFilter && filterSwitchFunc()}
      </View>
    </View>
  }

  return(
    <>
      <View style={[styles.container,props.style]}>
        {!isBottleTracking && title && renderHeaderView(title)}
        {bottle && renderBottleBagView()}
        {renderFreezerView()}
      </View>
    </>
  )
}

export default VirtualFreezer
