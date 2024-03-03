import React, {useState, useEffect} from 'react'
import styles from "./Styles/CustomMeasurementViewStyle";
import I18n from '@i18n';
import {Text, Platform, View} from "react-native";
import CustomTextInput from "./CustomTextInput";
import {useSelector} from 'react-redux'
import {Colors} from '@resources';

const CustomMeasurementView = (props) => {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  const [textInput, SetTextInput] = useState('')
  const {maxValue, textInputValue, value, units,editable,inputRef} = props
  let nameRef;
  useEffect(() => {
    SetTextInput(value)

  }, [value])
  const {titleTextColor,style,inputStyle,height} = props
  return (<View style={[styles.textInputWrapperStyle,height &&{height:height}]}
        onStartShouldSetResponder={()=>{ if(nameRef)nameRef.focus()}}
      >
      <CustomTextInput
        //inputRef={input=> this.nameRef = input }
        style={style?style:null}
        inputStyle={inputStyle?inputStyle:null}
        inputRef={(input)=>{
          nameRef=input;
          if (inputRef&&typeof inputRef=='function') {
            inputRef(input);
          }
        }}
        textContentType="familyName"
        value={textInput + ''}
        keyboardType={'decimal-pad'}
        returnKeyType={'done'}
        editable={editable}
        onChangeText={(index, value) => {
          console.log('value--', textInput,value, maxValue)
          //if (Platform.OS == 'ios') {

            if (parseFloat(value) > parseFloat(maxValue)) {
              // textInput.replace('')
              //let previousValue = textInput
              SetTextInput(' ')
              setTimeout(() => {
                SetTextInput(maxValue)
                textInputValue(maxValue)
              }, 10)

            } else {
              SetTextInput(parseFloat(value==''?0:value))
              textInputValue(parseFloat(value==''?0:value))
            }
          // } else {
          //   SetTextInput(parseFloat(value==''?0:value))
          //   textInputValue(parseFloat(value==''?0:value))
          // }

        }}
        textStyles={[styles.heightInputStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}, titleTextColor && {color:titleTextColor} ,height && {height:height}]}
        {...props}
      />
      <Text maxFontSizeMultiplier={1.7} style={[styles.textUnitsStyles,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)},titleTextColor && {color:titleTextColor}]}>{units}</Text>
    </View>
  )

}
export default CustomMeasurementView
