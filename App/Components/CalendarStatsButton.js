import React from 'react';
import {View,TouchableOpacity,Text} from 'react-native';
import styles from './Styles/CustomCalendarStyles';
import I18n from 'react-native-i18n';
import {Colors} from '@resources';
export default class StatsButton extends React.Component{
    buttons=[
        I18n.t('calendar.period'),
        I18n.t('calendar.today'),
        I18n.t('calendar.yesterday'),
        I18n.t('calendar.last_week'),
        I18n.t('calendar.last_month'),
        I18n.t('calendar.all')
    ]
    renderItem=(item,index)=>{
        const {btnSelected,onPress,defaultButtonPress}=this.props;
        return(
            <TouchableOpacity key={index+''} onPress={()=>{
                if(item==I18n.t('calendar.period')){
                    defaultButtonPress()
                }else{
                    onPress(item)
                }
            }}>
                <View style={[styles.buttonStyle, btnSelected === item && {backgroundColor: Colors.rgb_707575} ]}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.buttonTextStyle, btnSelected === item && {color: Colors.white},btnSelected !== item &&{color:Colors.rgb_000000}]}>{item}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render(){
        return (
            <View style={styles.buttonWrapper}>
                {this.buttons.map((item,index)=>{
                    return this.renderItem(item,index);
                })}
            </View>
        )
    }
}