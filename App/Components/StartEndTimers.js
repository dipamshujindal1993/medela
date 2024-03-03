import React from 'react';
import {View,Text,TouchableOpacity, Platform, I18nManager} from 'react-native';
import CustomTextInput from '@components/CustomTextInput';
import SwitchButton from '@components/SwitchButton';
import { verticalScale,moderateScale } from '@resources/Metrics';
import styles from './Styles/CustomCalendarStyles';
import I18n from 'react-native-i18n';
import { engToArabicNumber,arabicNumbers } from '@utils/locale';
import DeviceInfo from 'react-native-device-info';
import {Colors,Metrics} from '@resources';
import moment from "moment";
import { getDateFormat } from "@utils/TextUtils";
export default class StartEndTimers extends React.Component{
    constructor(props){
        super(props);
        this.forms={
          touched:{
            hour:false,
            min:false,
            switch:false
          },changed:{
            hour:false,
            min:false,
            switch:false
          }
        }
        this.state={
          date:''
        }
    }
    componentDidMount(){
      const {dateSelected}=this.props;
      getDateFormat(dateSelected,true).then((e) =>{
        this.setState({date:e})
      })
    }
    onFocus=(ref,val)=>{
        if(Platform.OS=='ios'||Platform.OS=='android'){
            ref.setNativeProps({selection:{start:val.length,end:val.length}});
            if(Platform.OS=="android")
                setTimeout(()=>{
                    ref&&ref.setNativeProps({selection:{start:undefined,end:undefined}})
                },0)
        }
    }
    changeFormValidation=(type,which)=>{
      const {formValidationChange}=this.props;
      this.forms[type][which]=true;
      formValidationChange&&formValidationChange();
    }
    componentDidUpdate(prevProps,prevState){
      const {dateSelected}=this.props;
      if(!moment(dateSelected).isSame(prevProps.dateSelected)){
        //getDateFormat()
        getDateFormat(dateSelected,true).then((e) =>{
          this.setState({date:e})
        })
      }
    }
    render(){
        const {showStartEndTime,hour,min,onChangeTextHour,onChangeTextMin,is12Hour,onSwitchValueChange,initialAmPm,timebackgroundColor,disableOkButton,validationMessage,title,renderValidation,showDateBar,dateSelected,showCalendar,type,notStyles, 
          accessibilityDateLabel, accessibilityhrLabel, accessibilityColonLabel, accessibilityMinutesLabel, accessibilityAmPmLabel, accessibilityTitleLabel, hideCalendarIcon , ableToOpen}=this.props;
        const {date}=this.state;
        return(
                <View style={[styles.timeContainer, { [(renderValidation||notStyles)?'marginVertical':'marginBottom']: verticalScale(showStartEndTime ? (renderValidation||notStyles)?5:10 : 24)}]}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.timeTitle,{color:this.props.textColor}]}
                      accessible={true}
                      accessibilityLabel={accessibilityTitleLabel}>{title}</Text>
                <View style={styles.dateTimeContainerStyle}>
                  {showDateBar===true &&<View style= {[styles.timeBackgroundTimers, {width: Metrics.moderateScale._70}]}>
                      <TouchableOpacity
                        onPress={()=>  showCalendar(type)}
                        disabled = {ableToOpen ? true : false}
                        activeOpacity={1}
                        style={styles.dateSelectionStyle}
                        accessible={true}
                        accessibilityLabel={accessibilityDateLabel}>
                        <Text
                          style={[styles.textInputStyles,{textAlign:'center',color:this.props.textColor}]}
                        >{date}</Text>
                      </TouchableOpacity>
                    </View>}
                  <View style= {[styles.timeBackgroundTimers, {width: I18n.locale.includes('en') ? 110: Metrics.moderateScale._75}]}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.timeSelectionStyle}
                      accessible={true}
		                  accessibilityLabel={accessibilityhrLabel}>
                      <CustomTextInput
                        maxLength={2}
                        keyboardType={'number-pad'}
                        ableToOpen={ableToOpen}
                        textStyles={[styles.textInputStyles,{textAlign:'right',color:this.props.textColor, height: 48}]}
                        placeholderTextColor={this.props.textColor}
                        placeholder={'--'}
                        value={I18n.locale.includes('ar')?hour!=undefined&&!arabicNumbers.includes(hour.split('')[0])?engToArabicNumber(hour):hour : hour}
                        // onChangeText={(index, value) => {
                        //   this.timerValueOnChange(value, I18n.t('calendar.hours'))
                        // }}
                        onChangeText={(index,value)=>{
                          this.changeFormValidation('changed','hour');
                          onChangeTextHour(index,value);
                        }}
                        // onFocus={()=>{this.onFocus(this.hoursInput,hour)}}
                        onBlur={()=>{this.changeFormValidation('touched','hour')}}
                        inputRef={(input)=>{ this.hoursInput = input }}
                        selectTextOnFocus={true}
                        contextMenuHidden={true}
                        // isTimeCharSame={true}
                      />
                    </TouchableOpacity>
                    <View style={styles.dashContainer}
                          accessible={true}
		                      accessibilityLabel={accessibilityColonLabel}>
                      <Text maxFontSizeMultiplier={1.7} style={[styles.textInputStyles, styles.textStylesForAlignment,{color:this.props.textColor}]}>{":"}</Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.timeSelectionStyle}
                      accessible={true}
		                  accessibilityLabel={accessibilityMinutesLabel}>
                      <CustomTextInput
                        maxLength={2}
                        keyboardType={'number-pad'}
                        placeholder={'--'}
                        ableToOpen={ableToOpen}
                        textStyles={[styles.textInputStyles,{color:this.props.textColor, height: 48}]}
                        placeholderTextColor={this.props.textColor}
                        value={I18n.locale.includes('ar')?min!=undefined&&!arabicNumbers.includes(min.split('')[0])?engToArabicNumber(min):min : min}
                        onChangeText={(index,value)=>{
                            this.changeFormValidation('changed','min');
                            onChangeTextMin(index,value);
                            if(value=='')
                                this.hoursInput&&this.hoursInput.focus()
                        }}
                        // onFocus={()=>{this.onFocus(this.minInput,min)}}
                        onBlur={()=>{this.changeFormValidation('touched','min')}}
                        inputRef={(input)=>{ this.minInput = input }}
                        selectTextOnFocus={true}
                        contextMenuHidden={true}
                        // isTimeCharSame={true}
                      />
                    </TouchableOpacity>
                  </View>
                  {is12Hour===true &&
                    <SwitchButton
                      onValueChange={(val)=>{
                        this.changeFormValidation('touched','switch');
                        this.changeFormValidation('changed','switch');
                        onSwitchValueChange(val)
                      }}
                      text1 = {I18n.t('calendar.is_am')}
                      text2 = {I18n.t('calendar.is_pm')}
                      ableToOpen={ableToOpen}
                      activeSwitch={initialAmPm}
                      switchWidth = {I18n.t('calendar.is_pm').length<5?(DeviceInfo.getFontScale()>1.6?90*1.63:70):(DeviceInfo.getFontScale()>1.6?100*1.63:moderateScale(105))}
                      switchHeight = {DeviceInfo.getFontScale()>1.6?40*1.63:36}
                      switchBorderRadius = {8}
                      switchBorderColor = 'transparent'
                      switchBackgroundColor = {timebackgroundColor}
                      btnBorderColor = 'transparent'
                      btnBackgroundColor = {Colors.white}
                      fontColor = {this.props.textColor}
                      activeFontColor = {Colors.rgb_000000}
                      amPmStart={true}
                      switchdirection={I18nManager.isRTL?'rtl':'ltr'}
                      ref={instance=>{this.switchRef=instance}}
                      accessibilityLabel={accessibilityAmPmLabel}
                    />
                  }
                </View>
                {(showStartEndTime&&disableOkButton&&renderValidation) ||(hideCalendarIcon&&disableOkButton&&renderValidation)?
                    <View  style={[styles.errorContainer,hideCalendarIcon?{bottom:-30}:{}]}>
                        <Text maxFontSizeMultiplier={1.7} style={styles.errorMessage}>{validationMessage}</Text>
                    </View>
                :null} 
              </View>
        )
    }
}
