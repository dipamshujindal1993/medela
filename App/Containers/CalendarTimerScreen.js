import React from "react";
import { View ,Modal,Blur} from "react-native";
import { BlurView } from "@react-native-community/blur";
import styles from '../Components/Styles/CustomCalendarStyles';
import {
    Colors,
    Metrics
} from '@resources';
import { connect } from 'react-redux';
import CalendarTimers from "../Components/CalendarTimers";
import CalendarButtons from "../Components/CalendarButtons";
import I18n from 'react-native-i18n';
import CustomCalendar from "../Components/CustomCalendar";
import moment from "moment";
class CalendarTimerScreen extends React.Component{
    constructor(props){
        super(props);
        const {startEndDetainedValue,selectedDate}=this.props;
        //console.log('startEndDetainedValue',startEndDetainedValue)
        this.state={
            disableOkButton:false,
            validationMessage:I18n.t('calendar.timer_alert'),
            isCalendarOpen:false,
            currentCalendarDate:selectedDate,
            defaultStartDate:startEndDetainedValue!=undefined?moment(startEndDetainedValue.startTime).format():selectedDate,
            rightStartDate:(startEndDetainedValue!=undefined&&startEndDetainedValue.startTimeRight)?moment(startEndDetainedValue.startTimeRight).format():selectedDate,
            endDate:startEndDetainedValue!=undefined?moment(startEndDetainedValue.endTime).format():selectedDate,
            openCalendarType:'',
            maxDate:new Date()
        }
    }
    showCalendar = (type) =>{
        const {endDate}=this.state;
        this.setState({
            isCalendarOpen:true,
            currentCalendarDate:this.getCurrentCalendardate(type),
            openCalendarType:type,
            maxDate:type!='end'?endDate:new Date()
        })
    }
    getCurrentCalendardate=(type)=>{
        const {defaultStartDate,rightStartDate,endDate}=this.state;
        if(type=='default'){
            return defaultStartDate
        }else if (type=='right'){
            return rightStartDate
        }else{
            return endDate
        }
    }
    changeDateForOpenCalendar = (type,date) =>{
        if(type=='default'){
            return {defaultStartDate:date}
        }else if (type=='right'){
            return {rightStartDate:date}
        }else{
            return {endDate:date}
        }
    }
    negativeCalendar=()=>{
        this.setState({isCalendarOpen:false})
    }
    positiveCalendar=(updatedDate)=>{
        const {openCalendarType}=this.state;
        const {dualTimer}=this.props;
        this.setState({
            isCalendarOpen:false,
            ...this.changeDateForOpenCalendar(openCalendarType,updatedDate)
        },()=>{
            if(dualTimer){
                this.refTimers.checkDualAfterCheckDiffDates();
            }else{
                this.refTimers.checkDateValidationForEndDate();
            }
        })
    }
    render(){
        const {
            themeSelected,
            dualTimer,
            showStartEndTime,
            notShowTime,
            selectedDate,
            durationInLimit,
            startEndDetainedValue,
            onDateChange,
            positiveOnPress,
            negativeOnPress,
            negative,
            positive,

        }=this.props;
        const {
            disableOkButton,
            isCalendarOpen,
            currentCalendarDate,
            defaultStartDate,
            rightStartDate,
            endDate,
            maxDate
        }=this.state;
        let timerBackgroundcolor = Colors.white;
        let textColor=Colors.rgb_000000;
        if(themeSelected === "dark"){
            timerBackgroundcolor = Colors.rgb_000000;
            textColor=Colors.white;
        }
        return(
            <View>
                {<Modal
                    transparent
                    hardwareAccelerated
                    visible={true}
                    onRequestClose={() => null}
                    animationType={'fade'}
                >
                    <BlurView
                        blurType='light'
                        style={{flex:1}}
                    >
                        <View style={styles.calendarMainContainer}>
                            <View style={[styles.calendarBackground, {backgroundColor: timerBackgroundcolor}]}>
                                <CalendarTimers
                                    themeSelected={themeSelected}
                                    dualTimer={dualTimer}
                                    showStartEndTime={showStartEndTime}
                                    //notShowTime={notShowTime}
                                    selectedDate={selectedDate}
                                    durationInLimit={durationInLimit}
                                    startEndDetainedValue={startEndDetainedValue}
                                    onDateChange={onDateChange}
                                    ref={instance=>{this.refTimers=instance}}
                                    positiveOnPress={positiveOnPress}
                                    showDateBar={true}
                                    validationChange={(obj)=>{
                                        obj&&this.setState(obj);
                                    }}
                                    showCalendar={this.showCalendar}
                                    defaultStartDate={defaultStartDate}
                                    rightStartDate={rightStartDate}
                                    endDate={endDate}
                                    differentDates={true}
                                    textColor={textColor}
                                    //negativeOnPress={() => negativeOnPress()}
                                />
                                <View style={{width:'100%',height:Metrics.moderateScale._10}}>

                                </View>
                                <CalendarButtons
                                    negative={negative}
                                    positive={positive}
                                    negativeOnPress={negativeOnPress}
                                    positiveOnPress={() => {
                                        this.refTimers.okBtn()
                                        //showStatsBtn? this.refTimers.okStatsBtn(): this.refTimers.okBtn()
                                    }}
                                    disableOkButton={disableOkButton}
                                    showStartEndTime={showStartEndTime}
                                    //showStatsBtn={showStatsBtn}
                                />
                            </View>
                        </View>
                    </BlurView>
                    <CustomCalendar
                        visible={isCalendarOpen}
                        title={I18n.t('login.forgot_password_title')}
                        message={I18n.t('login.forgot_password_message')}
                        positive={I18n.t('login.ok')}
                        negative={I18n.t('login.cancel')}
                        selectedDate={currentCalendarDate}
                        maxDate={maxDate}
                        negativeOnPress={() => this.negativeCalendar()}
                        positiveOnPress={(updatedDate) => this.positiveCalendar(updatedDate)}
                        onDismiss={() => {
                        }}
                        onDateChange={(date) => console.log('date changed called : ',date)}
                        showHeader={true}
                        notShowTime={true}
                    />
                </Modal>}  
            </View>
        )
    }
}
const mapStateToProps = (state) => ({
    themeSelected: state.app.themeSelected,
  })
export default connect(mapStateToProps, null)(CalendarTimerScreen)