import React, {useState,useEffect} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import styles from './Styles/CustomOptionSelectorStyles'
import CustomTextInput from "./CustomTextInput";
import I18n from '@i18n'
import {useSelector} from 'react-redux'
import {Colors} from '@resources';

const CustomOptionSelector = (props) => {
  const {
    buttonContainerStyle,
    buttonContainerActiveStyle,
    buttonContainerInactiveStyle,
    buttonTextActiveStyle, buttonTextInactiveStyle, data, onChange,
    defaultSelectedIndex,
    isEditable,
    isTappable
  } = props
  const [list,SetList]=useState(data)
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  const [selectedIndex, SetSelectedIndex] = useState(defaultSelectedIndex)

  const onTimerChange=(j,value,type)=>{
    if(type === I18n.t('calendar.hours')){
      if(value.length === 1){
        //this.setState({hour: value})
      }else if(value.length === 2){
        if(value > 12 ){
          data[j].hour='0'
          onChange('0',j)
          alert(I18n.t('calendar.timer_alert'))
        }else{
          // this.setState({hour: value})
        }
      }
    }else {

    }

  }

  const editableSelectorTime=(item,j)=>{
    let xx=item.value
    const {min,hour}=item

    return  <View style= {styles.timeBackground}>
      <CustomTextInput
        maxLength={2}
        keyboardType={'numeric'}
        textStyles={styles.textInputStyles}
        value={hour}
        onChangeText={(index, value) => {
          onTimerChange(j,value,I18n.t('calendar.hours'))
        }}
      />
      <Text style={[styles.textInputStyles, {marginBottom: 8}]}>{":"}</Text>
      <CustomTextInput
        maxLength={2}
        keyboardType={'numeric'}
        textStyles={styles.textInputStyles}
        value={min}
        onChangeText={(index, value) => {
          onTimerChange(j,value,I18n.t('calendar.mins'))
        }}
      />
    </View>

  }

  useEffect(()=>{
    SetSelectedIndex(defaultSelectedIndex)
  },[defaultSelectedIndex])

  useEffect(()=>{
    if (data!==list){
      SetList(data)
    }
  },[data])

  const renderItem = (item, index) => {
    const {label, label2,value, Icon, iconWidth, iconHeight, activeIconFill, InActiveIconFill} = item
    const activeContainerStyles = index === selectedIndex ? [styles.btnContainer, styles.btnActive, buttonContainerStyle, buttonContainerActiveStyle] : [styles.btnContainer, styles.btnInactive, buttonContainerStyle, buttonContainerInactiveStyle];
    const activeTextStyles = index === selectedIndex ? [styles.btnTextActive, buttonTextActiveStyle] : [styles.btnTextInactive, buttonTextInactiveStyle,{color: (Colors.rgb_000000)}];
    const activeSubLabelTextStyles = index === selectedIndex ? [styles.btnSubTextActive] : [styles.btnSubTextInactive,{color: (Colors.rgb_000000)}];

    if (isEditable){
      return <View style={activeContainerStyles} key={index.toString()}>
        <Text allowFontScaling={false} style={activeTextStyles}>{label}</Text>
        {editableSelectorTime(item,index)}
      </View>


    }
    return <TouchableOpacity activeOpacity={1} key={index.toString()} onPress={() => {
      if (!isTappable){
        SetSelectedIndex(index)
        onChange(item,index)
      }
    }} style={activeContainerStyles}>
      <Text allowFontScaling={false} style={activeTextStyles}>{label}</Text>
      {label2 &&<Text allowFontScaling={false} style={[activeSubLabelTextStyles]}>{label2 && `\n ${label2.split(' ')[0]} ${I18n.t(`units.${label2.split(' ')[1].toLowerCase()}`)} `}</Text>}

      {Icon &&
      <Icon width={iconWidth} height={iconHeight} fill={index === selectedIndex ? activeIconFill : InActiveIconFill}/>}
    </TouchableOpacity>
  }


  return <View style={{flexDirection: 'row'}}>
    {list.map((e, index) => renderItem(e, index))}
  </View>

}

export default CustomOptionSelector
