import React from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import styles from './Styles/CustomCalendarStyles';
import { connect } from 'react-redux'
import { Colors } from '@resources'
class CalendarButtons extends React.Component{
    render(){
        const {disableOkButton,showStartEndTime,negativeOnPress,positiveOnPress,negative,positive,showStatsBtn, themeSelected}=this.props;
        let cancelTextColor = themeSelected && themeSelected === 'dark' ? Colors.rgb_ffcd00 : Colors.rgb_767676
        let okTextColor = themeSelected && themeSelected === 'dark' ? Colors.rgb_ffcd00 : Colors.rgb_000000
        let okTextSize = themeSelected && themeSelected === 'dark' ? 'bold' : 'normal'
        return(
            <View style={styles.ctaView}>
                <TouchableOpacity onPress={() => negativeOnPress()}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.cta,{color: cancelTextColor}]}>{negative}</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={showStartEndTime&&disableOkButton} onPress={positiveOnPress}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.cta,showStartEndTime&&disableOkButton?{color:'rgb(138,143,143)'}:{color: okTextColor}]}>{positive}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
	themeSelected: state.app.themeSelected
});

export default connect(mapStateToProps, null)(CalendarButtons);