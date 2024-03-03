import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  InputAccessoryView,
  Keyboard,
  Platform
} from 'react-native'

import { isEmpty } from '@utils/TextUtils'
import I18n from '@i18n'
import {
  Constants,
  Colors,
} from '@resources'
import KeyUtils from '@utils/KeyUtils'
import styles from './Styles/CustomTextInputStyles'

export default class CustomTextInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      text: props.value ? props.value : '',
      hidePassword: this.props.textContentType == 'password',
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected 
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {isSecChange,isTimeCharSame=false}=this.props
    //console.log('Selected theme ====', this.props)
    // if(isTimeCharSame && isTimeCharSame!=undefined){
    //   if((this.props.value != prevProps.value) || (prevState.text !== this.state.text)){
    //     this.setState({
    //       text: this.props.value,
    //     })
    //   }
    // }
    if (isSecChange){
      if ((this.props.value != prevProps.value) || (this.props.value!=prevState.text)) {
        this.setState({
          text: this.props.value,
        })
      }
    }else {
      if ((this.props.value != prevProps.value)) {
        this.setState({
          text: this.props.value,
        })
      }
    }

    if (this.props.isFocused != prevProps.isFocused) {
      this.setState({
        isFocused: this.props.isFocused,
      })
    }
  }

  _onFocus = () => {
    this.setState({
      isFocused: true,
    })

    if (this.props.onFocus) {
      this.props.onFocus(this.props.index, this.state.isFocused)
    }
  }

  _onBlur = () => {
    this.setState({
      isFocused: false,
    })

    if (this.props.onBlur) {
      this.props.onBlur(this.props.index, this.state.text)
    }
  }

  _onChangeText = (text) => {
    if (this.props.textContentType == 'password') {
      text = text.replace(Constants.SPACES_PATTERN, '')
    }

    this.setState({ text })

    if (this.props.onChangeText) {
      this.props.onChangeText(this.props.index, text)
    }
  }

  autoCapitalize(textContentType) {
    switch (textContentType) {
      case 'emailAddress':
      case 'password':
        return 'none'

      case 'givenName':
      case 'familyName':
        return 'words'

      default:
        return 'sentences'
    }
  }

  autoCompleteType(textContentType) {
    switch (textContentType) {
      case 'emailAddress':
        return 'email'

      case 'password':
      case 'confirmPassword':
        return 'password'

      case 'firstName':
      case 'lastName':
        return 'name'

      case 'phone':
        return 'tel'

      case 'zip':
        return 'postal-code'

      default:
        return 'off'
    }
  }

  keyboardType(textContentType) {
    switch (textContentType) {
      case 'emailAddress':
        return 'email-address'

      case 'telephoneNumber':
        return 'phone-pad'

      case 'postalCode':
        return 'numeric'
    }
  }

  showHidePassword = () => {
    this.setState(prevState => {
      return {
        hidePassword: !prevState.hidePassword
      }
    })
  }

  render() {
    const {
      isFocused,
      text,
      hidePassword,
    } = this.state
    const {
      index,
      inputRef,
      style,
      inputStyle,
      label,
      labelStyle,
      onPress,
      icon,
      value,
      onIconPress,
      editable,
      returnKeyType,
      textContentType,
      keyboardType,
      onSubmitEditing,
      error,
      errorMessage,
      maxLength,
      showCounter,
      textStyles,
      onSubmit,
      multiline,
      maxHeight,
      enableDoneButton,
      selection,
      selectTextOnFocus=false,
      contextMenuHidden=false,
      themeSelected,ableToOpen
    } = this.props

    const textLength = text ? text.length : 0
    let defaultStyleObj={
      borderColor: Colors.rgb_b9b9b9,
      borderWidth: 1,
      borderRadius: 6,
    }
    maxHeight && (defaultStyleObj["maxHeight"] = maxHeight)
    return (
      <View style={style}>
        {/* <View style={styles.label_info}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.label, labelStyle]}>{label}</Text>
          {icon && <TouchableOpacity disabled={!onIconPress} onPress={onIconPress} style={styles.icon}>{icon}</TouchableOpacity>}
        </View> */}
        <View>
          <TouchableOpacity disabled={!onPress} onPress={onPress}>
            <TextInput maxFontSizeMultiplier={1.7}
              {...this.props}
              ref={inputRef}
              style={[
                styles.textInput,
                textStyles,
                inputStyle,
                defaultStyleObj,
                // {
                //   borderBottomColor: error ? Colors.rgb_ff4337 : isFocused ? Colors.rgb_4297ff : Colors.rgb_d3dfef,
                //   borderBottomWidth: isFocused ? 2 : 0.5,
                // },
                {
                  paddingRight: textContentType == 'password' && !isEmpty(text) ? 65 : 0,
                },
              ]}
              maxFontSizeMultiplier={1.7}
              autoCapitalize={this.autoCapitalize(textContentType)}
              autoCompleteType={this.autoCompleteType(textContentType)}
              pointerEvents={editable == false ? 'none' : 'auto'}
              keyboardType={keyboardType || this.keyboardType(textContentType)}
              returnKeyType={returnKeyType ? returnKeyType : 'next'}
              secureTextEntry={hidePassword}
              onFocus={this._onFocus}
              onBlur={this._onBlur}
              onSubmitEditing={onSubmitEditing ? () => onSubmitEditing(index, text) : null}
              onChangeText={this._onChangeText}
              value={text}
              selection={editable == false ? { start: 0 } : selection || null}
              blurOnSubmit={false}
              autoCorrect={false}
              multiline={multiline? multiline : false}
              inputAccessoryViewID={KeyUtils.DONE_BUTTON_ID}
              selectTextOnFocus={selectTextOnFocus}
              contextMenuHidden={contextMenuHidden}
              themeSelected={themeSelected}
              editable = {ableToOpen ? false : true}
              />
            {Platform.OS === 'ios' && enableDoneButton &&
              <InputAccessoryView nativeID={KeyUtils.DONE_BUTTON_ID}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                  <View style={styles.doneButtonView}>
                    <Text maxFontSizeMultiplier={1.7} style={styles.doneButtonText}>{I18n.t('generic.done')}</Text>

                  </View>


                </TouchableWithoutFeedback>
              </InputAccessoryView>}

          </TouchableOpacity>
          {showCounter && maxLength && <Text maxFontSizeMultiplier={1.7} style={styles.counterNumber}>{`${textLength}/${maxLength}`}</Text>}
          {
            textContentType == 'password' && !isEmpty(text) &&
            <Text maxFontSizeMultiplier={1.7} style={[styles.showHidePassword,{color:this.textColor}]} onPress={this.showHidePassword}>{hidePassword ? I18n.t('signup.show') : I18n.t('signup.hide')}</Text>
          }
        </View>
        {error && errorMessage && <Text maxFontSizeMultiplier={1.7} style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
    )
  }
}

