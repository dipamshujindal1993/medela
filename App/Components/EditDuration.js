import React, {useState, useEffect} from 'react'
import {Text, Platform, View, TouchableOpacity} from 'react-native'
import styles from './Styles/EditDurationStyles'
import CustomTextInput from "./CustomTextInput";
import I18n from '@i18n'
import { connect } from 'react-redux'
import {Colors} from '@resources';
import { verticalScale } from '../Resources/Metrics';

 class EditDuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      durationList:[]
    }
  }

  componentDidMount() {
    const {data}=this.props;
    this.setState({durationList:data})
  }
  forceInit(){
    const {data}=this.props;
    this.setState({durationList:data});
  }
  onTimerChange=(j,value,type)=>{
    const {onChange,data}=this.props
    if(type === I18n.t('calendar.hours')){
      data[j].hour=value
      onChange(data[j],j,()=>{this.callBackAfterUpdation(data[j].ref1,value.length)})

    }else if (type==I18n.t('calendar.mins')) {
      data[j].min=value
      onChange(data[j],j,()=>this.callBackAfterUpdation(data[j].ref2,value.length))
    }else {
      data[j].sec=value
      onChange(data[j],j,()=>this.callBackAfterUpdation(data[j].ref3,value.length))
    }
  }
  callBackAfterUpdation=(ref,value)=>{
    const {data}=this.props;
    if(Platform.OS=='android'){
      ref&&ref.current.setNativeProps({
        selection: {
            start: value,
            end: value
        }
      })
      ref&&ref.current.setNativeProps({
        selection:{
          start:undefined,
          end:undefined
        }
      })
    }
  }
  editableSelectorTimeWithSec=(item,j)=>{
    const {min,hour,sec}=item
    const {data} = this.props
    return  <View style= {[styles.timeBackground,{ backgroundColor: Colors.rgb_f5f5f5,}]}>
      <CustomTextInput
        maxLength={2}
        keyboardType={'numeric'}
        textStyles={[styles.textInputStylesCustom,{height:48, color:Colors.rgb_000000}]}
        value={hour}
        placeholder={'00 h'}
        selectTextOnFocus={true}
        contextMenuHidden={true}
        placeholderTextColor={this.textColor}
        onChangeText={(index, value) => {
          this.onTimerChange(j,value,I18n.t('calendar.hours'),data[j].ref1)
          if(value.length>1){
           // if(index < data.length) {
              data[j].ref2 && data[j].ref2.current.focus()
          //  }
            //this.minInput.focus()
            /*if(value.length>1){

            }*/
          }
        }}
        // onFocus={Platform.OS=='ios'||Platform.OS=='android'?()=>{
        //   data[j].ref1 && data[j].ref1.current.setNativeProps({
        //     selection: {
        //         start: hour.length ,
        //         end: hour.length
        //     }
        //   })
        //   setTimeout(() => {
        //     Platform.OS=='android' && data[j].ref1 && data[j].ref1.current.setNativeProps({
        //       selection:{
        //         start:undefined,
        //         end:undefined
        //       }
        //     })
        //   }, 0);
        // }:()=>{}}
        inputRef={item.ref1}
        //selection={hour.length === 2 ? {start: 2, end: 2} : {start: 1, end: 1}}
      />
      <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: Platform.OS=='ios'?3:6,marginLeft:2,color:Colors.rgb_000000}]}>{":"}</Text>
      <CustomTextInput
        maxLength={2}
        keyboardType={'numeric'}
        textStyles={[styles.textInputStylesCustom,{height:48,color:Colors.rgb_000000}]}
        value={min}
        placeholder={'00 m'}
        selectTextOnFocus={true}
        contextMenuHidden={true}
        placeholderTextColor={this.textColor}
        onChangeText={(index, value) => {
          this.onTimerChange(j,value,I18n.t('calendar.mins'),data[j].ref2)
          if(value.length>1){
            //if(j < data.length) {
              data[j].ref3 && data[j].ref3.current.focus()
           // }
          }
          if(value==''){
            if(j < data.length) {
              data[j].ref1 && data[j].ref1.current.focus()
            }
          }
        }}
        // onFocus={Platform.OS=='ios'||Platform.OS=='android'?()=>{
        //   data[j].ref2 && data[j].ref2.current.setNativeProps({
        //     selection: {
        //         start: min.length ,
        //         end: min.length
        //     }
        //   })
        //   setTimeout(() => {
        //     Platform.OS=='android' && data[j].ref2 && data[j].ref2.current.setNativeProps({
        //       selection:{
        //         start:undefined,
        //         end:undefined
        //       }
        //     })
        //   }, 0);
        // }:()=>{}}
        inputRef={item.ref2}
        //selection={min.length === 2 ? {start: 2, end: 2} : min.length>0?{start: 1, end: 1}:null}
      />
      <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: Platform.OS=='ios'?3:6,marginHorizontal:2,color:Colors.rgb_000000}]}>{":"}</Text>
      <CustomTextInput
        maxLength={2}
        keyboardType={'numeric'}
        textStyles={[styles.textInputStylesCustom,{height:48,color:Colors.rgb_000000}]}
        value={sec}
        placeholder={'00 s'}
        selectTextOnFocus={true}
        contextMenuHidden={true}
        placeholderTextColor={this.textColor}
        onChangeText={(index, value) => {
          this.onTimerChange(j,value,I18n.t('calendar.sec'),data[j].ref3)
          if(value==''){
           // if(j < data.length) {
              data[j].ref2 && data[j].ref2.current.focus()
          //  }
          }
        }}
        // onFocus={Platform.OS=='ios'||Platform.OS=='android'?()=>{
        //   data[j].ref3 && data[j].ref3.current.setNativeProps({
        //     selection: {
        //         start: sec.length ,
        //         end: sec.length
        //     }
        //   })
        //   setTimeout(() => {
        //     Platform.OS=='android' && data[j].ref3 && data[j].ref3.current.setNativeProps({
        //       selection:{
        //         start:undefined,
        //         end:undefined
        //       }
        //     })
        //   }, 0);
        // }:()=>{}}
        inputRef={item.ref3}
       //selection={sec.length === 2 ? {start: 2, end: 2} : {start: 1, end: 1}}
      />
    </View>

  }

  _focusFromMin = (index) => {
    const {data} = this.props
    if(index < data.length) {
      data[index].ref2 && data[index].ref2.current.focus()
    }
  }
  _focusFromSec = (index) => {
    const {data} = this.props
    if(index < data.length) {
      data[index].ref1 && data[index].ref1.current.focus()
    }
  }

  editableSelectorTime=(item,j)=>{
    const {isEditPumping}=this.props
    const {min,sec}=item
    let _this = this
    return  <View style= {[styles.timeBackground,{marginTop:-5}]}>
      <CustomTextInput
        maxLength={2}
        keyboardType={'numeric'}
        textStyles={[styles.textInputStylesCustom,{height:35,textAlign: 'right',marginRight:2,color:Colors.rgb_000000}]}
        value={min}
        placeholder={'00 h'}
        placeholderTextColor={this.textColor}
        editable={!(isEditPumping && j === 0)}
        onChangeText={(index, value) => {
          this.onTimerChange(j,value,I18n.t('calendar.mins'))
          if(value.length>1){
            this._focusFromMin(j)
          }
        }}
        inputRef={item.ref1}
        //selection={min.length === 2 ? {start: 2, end: 2} : {start: 1, end: 1}}
      />
      <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, {marginBottom: 6,color:Colors.rgb_000000}]}>{":"}</Text>
      <CustomTextInput
        maxLength={2}
        keyboardType={'numeric'}
        textStyles={[styles.textInputStylesCustom,{height:35,textAlign: 'left',marginLeft:2,color:Colors.rgb_000000}]}
        value={sec}
        placeholder={'00 m'}
        placeholderTextColor={this.textColor}
        editable={!(isEditPumping && j === 0)}
        onChangeText={(index, value) => {
          this.onTimerChange(j,value,I18n.t('calendar.sec'))
          if(value==''){
            this._focusFromSec(j)
          }
        }}
        inputRef={item.ref2}
        //selection={sec.length === 2 ? {start: 2, end: 2} : {start: 1, end: 1}}
      />
    </View>

  }

  renderItem = (item, index) => {
    const {
      buttonContainerStyle,
      buttonContainerActiveStyle,
      buttonContainerInactiveStyle,
      buttonTextActiveStyle, buttonTextInactiveStyle, data, onChange,
      defaultSelectedIndex,
      isEditable,
      timerTypeStyle,
      editBreastfeedingScreen,themeSelected
    } = this.props
    const {label, label2, value, Icon, iconWidth, iconHeight, activeIconFill, InActiveIconFill} = item
    const activeContainerStyles =  [styles.btnContainer, styles.btnInactive, buttonContainerStyle, buttonContainerInactiveStyle];
    const activeTextStyles = [styles.btnTextInactive, buttonTextInactiveStyle];
    const timerTextStyles = [styles.timerTextStyles]
      let textColor = themeSelected && themeSelected === 'dark' ?  Colors.white: Colors.rgb_000000


    return <TouchableOpacity activeOpacity={1} onPress={() => item.ref1 && item.ref1.current.focus()} style={{}} key={index.toString()}>
      {!timerTypeStyle &&<Text maxFontSizeMultiplier={1.1} style={[activeTextStyles,{marginTop:10}]}>{label}</Text>}
      {editBreastfeedingScreen ?
        (index === 0 ?
          <View style={{alignSelf: 'center'}}>
            <Text allowFontScaling={false} style={[activeTextStyles,timerTextStyles,{color:textColor}]}> {I18n.t('breastfeeding_pump.total')}</Text>
            {timerTypeStyle ? this.editableSelectorTimeWithSec(item, index) : this.editableSelectorTime(item, index)}
          </View> :
          index === 1 ?
            <View style={{  alignSelf: 'flex-start',marginTop:verticalScale(20)}}>
              <Text allowFontScaling={false} style={[activeTextStyles,timerTextStyles,{color:textColor}]}> {I18n.t('breastfeeding_pump.left')}</Text>
              {timerTypeStyle ? this.editableSelectorTimeWithSec(item, index) : this.editableSelectorTime(item, index)}
            </View>
            :
            <View style={{  alignSelf: 'flex-end', bottom: 0 ,position:'absolute' }}>
              <Text allowFontScaling={false} style={[activeTextStyles,timerTextStyles,{color:textColor}]}> {I18n.t('breastfeeding_pump.right')}</Text>
              {timerTypeStyle ? this.editableSelectorTimeWithSec(item, index) : this.editableSelectorTime(item, index)}
            </View>)
        :
       ( timerTypeStyle ? this.editableSelectorTimeWithSec(item, index) : this.editableSelectorTime(item, index))
      }
    </TouchableOpacity>

  }

  render() {
    const {durationList} = this.state
    const {data,editBreastfeedingScreen} = this.props

    return <View style={[editBreastfeedingScreen? styles.sleepViewStyle : styles.otherViewStyle]}>
      {data && data.map((e, index) => this.renderItem(e, index))}
    </View>

  }
}
const mapStateToProps = (state) => ({
	themeSelected: state.app.themeSelected
});

export default connect(mapStateToProps, null)(EditDuration);