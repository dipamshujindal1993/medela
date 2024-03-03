import React ,{Fragment} from 'react';
import {View,Text,Platform, I18nManager} from 'react-native';
import SwitchButton from '@components/SwitchButton';
import styles from './Styles/CustomCalendarStyles';
import I18n from 'react-native-i18n';
import {Colors,Metrics} from '@resources';
import DeviceInfo from 'react-native-device-info';
import { getTimeFormat } from '@utils/TextUtils';
import moment from "moment";
import { isEmpty } from '@utils/TextUtils'
import StartEndTimers from './StartEndTimers';
import StatsButton from './CalendarStatsButton';
import {  Fonts } from '@resources';

export default class CalendarTimers extends React.Component{
    constructor(props){
        super(props);
        const {showStatsBtn,selectedCustomDates}=this.props;
        let propStartDate=showStatsBtn ? selectedCustomDates[0]:moment().format();
        let propEndDate=showStatsBtn ? selectedCustomDates[1]:moment().format();
        this.state={
            leftTimeActive:true,
            hour:'00',
            min:'00',
            startRightHour:'00',
            startRightMin:'00',
            endHour:'00',
            endMin:'00',
            disableOkButton:false,
            validationMessage:I18n.t('calendar.timer_alert'),
            isAmPm:'',
            is24Hour:false,
            startDate: propStartDate,
            endDate: propEndDate,
            btnSelected: I18n.t('calendar.period'),
            selectedCustomDates:[],
            dateSelected: moment().format(),
            startTimeAmPm:undefined,
            endTimeAmPm:undefined,
            startRightAmPm:undefined,
        }
        this.endTimerRefrences={left:undefined,right:undefined}

    }
    async componentDidMount(){
        const {selectedDate, userLocale, showStatsBtn, selectedCustomDates, btnSelected,startEndDetainedValue,showStartEndTime,dualTimer} = this.props;
        let time={};
        let is24HourFormat = await getTimeFormat(true);
        if(showStartEndTime==true&&startEndDetainedValue!=undefined){
          var diffInSeconds = moment(startEndDetainedValue.endTime).diff(moment(startEndDetainedValue.startTime),'seconds');
          var diffInMinutes = moment(startEndDetainedValue.endTime).diff(moment(startEndDetainedValue.startTime),'minutes');
            if(is24HourFormat){
                let startTimeObj=moment(startEndDetainedValue.startTime);
                let endTimeObj=moment(startEndDetainedValue.endTime);
                time.hour=startTimeObj.format('HH').toString();
                time.min=startTimeObj.format('mm').toString();
                time.endHour=endTimeObj.format('HH').toString();
                time.endMin=endTimeObj.format('mm').toString();
                if(dualTimer){
                  let rightStartObj=moment(startEndDetainedValue.startTimeRight);
                  time.startRightHour=rightStartObj.format('HH').toString();
                  time.startRightMin=rightStartObj.format('mm').toString();
                }
            }else{
                let startTimeObj=moment(startEndDetainedValue.startTime);
                let endTimeObj=moment(startEndDetainedValue.endTime);
                time.hour=startTimeObj.format('hh').toString();
                time.min=startTimeObj.format('mm').toString();
                time.startTimeAmPm=startTimeObj.format('A')
                time.endHour=endTimeObj.format('hh').toString();
                time.endMin=endTimeObj.format('mm').toString();
                time.endTimeAmPm=endTimeObj.format('A');
                if(dualTimer){
                  let rightStartObj=moment(startEndDetainedValue.startTimeRight);
                  time.startRightHour=rightStartObj.format('hh').toString();
                  time.startRightMin=rightStartObj.format('mm').toString();
                  time.initialRightAmPm=rightStartObj.format('A');
                }
            }
        }
        const timeArr = moment(selectedDate).format("hh:mm A").split(':')
        this.setState({
            dateSelected:selectedDate,
            btnSelected: btnSelected,
            hour:Object.keys(time).length==0?moment(selectedDate).format(is24HourFormat ? "HH" : "hh"):time.hour,
            min: Object.keys(time).length==0?timeArr[1].split(' ')[0]:time.min,
            endHour:Object.keys(time).length==0?moment(selectedDate).format(is24HourFormat ? "HH" : "hh"):time.endHour,
            endMin:Object.keys(time).length==0?timeArr[1].split(' ')[0]:time.endMin,
            startRightHour:!time.hasOwnProperty('startRightHour')?moment(selectedDate).format(is24HourFormat ? "HH" : "hh"):time.startRightHour,
            startRightMin:!time.hasOwnProperty('startRightMin')?timeArr[1].split(' ')[0]:time.startRightMin,
            isAmPm: timeArr[1].split(' ')[1],
            is24Hour: is24HourFormat,
            is12Hour:!is24HourFormat,
            //userLocale: userLocale !== undefined ? userLocale : await AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE),
            startTimeAmPm:time.startTimeAmPm,
            endTimeAmPm:time.endTimeAmPm,
            startRightAmPm:time.initialRightAmPm,
            initialEndAmPm:this.intialAmPm(time.startTimeAmPm,time.endTimeAmPm).initialEndAmPm,
            intialStartAmPm:this.intialAmPm(time.startTimeAmPm,time.endTimeAmPm).intialStartAmPm,
            initialRightAmPm:this.intialAmPm(time.initialRightAmPm,time.endTimeAmPm).intialStartAmPm,
            disableOkButton:diffInSeconds<60&&diffInMinutes==0,
            validationMessage:diffInSeconds<60&&diffInMinutes==0?'':I18n.t('calendar.timer_alert'),
        })
        if(showStatsBtn === true && btnSelected === I18n.t('calendar.period') && selectedCustomDates.length > 0){
            this.setState({
              startDate: selectedCustomDates[0],
              endDate: selectedCustomDates[1],
              selectedCustomDates
            })
        }

    }
    _onDateChange = (date) => {
      const { hour, min } = this.state;
      const {showStartEndTime,dualTimer}=this.props;
      this.setState({
        dateSelected: date.format()
      }, () => {
        if(moment(date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD') && !this.props.notShowTime) {
          this.onChangeTextValue(parseInt(hour), I18n.t('calendar.hours'),'hour','min',this.refStartLeftTimer.hoursInput,this.refStartLeftTimer.minInput)
          this.onChangeTextValue(min, I18n.t('calendar.mins'),'hour','min',this.refStartLeftTimer.hoursInput,this.refStartLeftTimer.minInput)
        }
        if(showStartEndTime==true){
          if(dualTimer){
            this.checkDateValidationIfDualTimer()
          }else{
            this.checkDateValidationForEndDate()
          }
        }
      })
      this.props.onDateChange(date)
    }
    _onStatsDateChange =(date, type)=>{
      const{btnSelected}=this.state;
      const {btnSelectionChange,startEndDateChange}=this.props;
      let updatedBtnSelected = btnSelected;
      btnSelected === I18n.t('calendar.today') && I18n.t('calendar.yesterday')
      updatedBtnSelected = I18n.t('calendar.period')
      if (type === 'END_DATE') {
        this.setState({
          endDate: moment(date).format('YYYY-MM-DD'),
        });
        startEndDateChange(this.state.startDate,moment(date).format('YYYY-MM-DD'));
      } else {
        this.setState({
          startDate: moment(date).format('YYYY-MM-DD'),
          endDate: null,
          btnSelected: updatedBtnSelected
        });
        startEndDateChange(moment(date).format('YYYY-MM-DD'),null);
        btnSelectionChange(updatedBtnSelected);
        this.props.onDateChange(date)
      }
    }
    /**
     * 
     * @param {* Pass the value for startTime meridian} startTimeAmPm 
     * @param {* Pass the value for endTime meridian} endTimeAmPm 
     * @returns formatted meridian value for start and endtime
     */
    intialAmPm(startTimeAmPm,endTimeAmPm){
        const {selectedDate}=this.props;
        //const {dateSelected}=this.state;
        let intialStartAmPm,initialEndAmPm;
        if(startTimeAmPm!=undefined){
          if(startTimeAmPm=='AM'){
            intialStartAmPm=1
          }else{
            intialStartAmPm=2
          }
        }else{
          if(moment(selectedDate || dateSelected).format('A') == 'AM'){
            intialStartAmPm=1
          }else{
            intialStartAmPm=2;
          }
        }
        if(endTimeAmPm!=undefined){
          if(endTimeAmPm=='AM'){
            initialEndAmPm=1;
          }else{
            initialEndAmPm=2
          }
        }else{
          if(moment(selectedDate || dateSelected).format('A') == 'AM' ){
            initialEndAmPm=1
          }else{
            initialEndAmPm=2
          }
        }
        return {initialEndAmPm,intialStartAmPm}
    }
    /**
     * 
     * @param {* if to check for left timer} checkLeftValidation 
     * @returns whether validation applied or not
     */
    checkDateValidationIfDualTimer=(checkLeftValidation)=>{
        const {
          hour,min,endHour,endMin,startRightHour,startRightMin,
          is24Hour,startRightAmPm,startTimeAmPm,endTimeAmPm,dateSelected,
          leftTimeActive
        }=this.state;
        const {durationInLimit,defaultStartDate,endDate,differentDates,rightStartDate}=this.props;
        let startDateLocally=(differentDates===true?defaultStartDate:dateSelected);
        let startRightDateLocally=(differentDates===true?rightStartDate:dateSelected);
        let endDateLocally=(differentDates===true?endDate:dateSelected)

        let startTime;
        if(checkLeftValidation!==undefined&&checkLeftValidation===true){
            startTime=is24Hour
                            ?moment(startDateLocally.slice(0,startDateLocally.indexOf('T'))+'T'+hour+':'+min,'YYYY-MM-DDTHH:mm')
                            :moment(startDateLocally.slice(0,startDateLocally.indexOf('T'))+' '+hour+':'+min+' '+startTimeAmPm,'YYYY-MM-DD hh:mm A')
        }else if (checkLeftValidation!==undefined&&checkLeftValidation===false){
            startTime=is24Hour
                            ?moment(startRightDateLocally.slice(0,startRightDateLocally.indexOf('T'))+'T'+startRightHour+':'+startRightMin,'YYYY-MM-DDTHH:mm')
                            :moment(startRightDateLocally.slice(0,startRightDateLocally.indexOf('T'))+' '+startRightHour+':'+startRightMin+' '+startRightAmPm,'YYYY-MM-DD hh:mm A')
        }else{
          if(leftTimeActive){
            startTime=is24Hour
                            ?moment(startDateLocally.slice(0,startDateLocally.indexOf('T'))+'T'+hour+':'+min,'YYYY-MM-DDTHH:mm')
                            :moment(startDateLocally.slice(0,startDateLocally.indexOf('T'))+' '+hour+':'+min+' '+startTimeAmPm,'YYYY-MM-DD hh:mm A')
          }else{
            startTime=is24Hour
                          ?moment(startRightDateLocally.slice(0,startRightDateLocally.indexOf('T'))+'T'+startRightHour+':'+startRightMin,'YYYY-MM-DDTHH:mm')
                          :moment(startRightDateLocally.slice(0,startRightDateLocally.indexOf('T'))+' '+startRightHour+':'+startRightMin+' '+startRightAmPm,'YYYY-MM-DD hh:mm A')
          }
        }
        let endTime=is24Hour
                        ?moment(endDateLocally.slice(0,endDateLocally.indexOf('T'))+'T'+endHour+':'+endMin,'YYYY-MM-DDTHH:mm')
                        :moment(endDateLocally.slice(0,endDateLocally.indexOf('T'))+' '+endHour+':'+endMin+' '+endTimeAmPm,'YYYY-MM-DD hh:mm A')
        
        let isBefore = startTime.isBefore(endTime);
        let isSame=startTime.isSame(endTime);
        let isValid=startTime.diff(moment())<=0&&endTime.diff(moment())<=0;
        let duration=moment.duration(endTime.diff(startTime));
        if(durationInLimit!=undefined&&durationInLimit>0&&duration.asMinutes()>durationInLimit){
          this.setState({validationMessage:I18n.t('stats_breastfeeding.error_sleep_duration_total_min'),disableOkButton:true},()=>{this.validationOnChange()})
          return true;
        }else{
          //this.setState({validationMessage:I18n.t('calendar.timer_alert')});
          if(isValid){
            if(isBefore){
              this.setState({validationMessage:I18n.t('calendar.timer_alert'),disableOkButton:false},()=>{this.validationOnChange()});
              return false;
            }else{
              if(isSame){
                //console.log('if time has changed',this.toCheckIfTimeChanged());
                this.setState({validationMessage:this.toCheckIfTimeChanged()?I18n.t('calendar.timer_alert'):'',disableOkButton:this.toCheckIfTimeChanged()},()=>{this.validationOnChange()});
                return this.toCheckIfTimeChanged();
              }else{
                this.setState({validationMessage:I18n.t('calendar.timer_alert'),disableOkButton:true},()=>{this.validationOnChange()});
                return true;
              }
            }
          }else{
            this.setState({validationMessage:I18n.t('calendar.timer_alert'),disableOkButton:true},()=>{this.validationOnChange()});
            return true;
          }
        }
      }
    /**
     * 
     * @param {* pass the 24 hour value } value 
     * @returns it will return the same but in 12 hour format
     */
    getAmPmValue(value) {
        let newValue = 0
        if(this.state.isAmPm === I18n.t('calendar.is_pm')){
          newValue = (parseInt(value) !== 12) ? parseInt(value) + 12 : parseInt(value)
        } else {
          if(parseInt(value) === 12){
            newValue = parseInt(value)-12
          } else {
            newValue = parseInt(value)
          }
        }
        return parseInt(newValue)
    }
    /**
     * 
     * @param { which time field needs to be blank } type 
     * @param {* get called after setting field blank } callback 
     */
    setBlankInEditFields=(type,callback)=>{  
        let obj={disableOkButton:true,validationMessage:I18n.t('calendar.timer_alert')}
        obj[type]=''
        this.setState(obj,()=>{
          if(callback!=undefined&&typeof callback =='function'){
            callback();
            this.validationOnChange();
          }
        })
    }
    /**
     * 
     * @param { refrence for the text field for which you want to set cursor position } ref 
     * @param {* at what position you want to set position} value 
     */
    setCursorInAndroid=(ref,value)=>{
        if(Platform.OS=='android'){
          ref&&ref.setNativeProps({
            selection:{
              start:undefined,
              end:undefined
            }
          })
        }
    }
    /**
     * 
     * @returns whether validation is set or not for end time timer
     */
    checkDateValidationForEndDate=()=>{
        const {hour,min,endHour,endMin,dateSelected,is24Hour,startTimeAmPm,endTimeAmPm}=this.state;
        const {durationInLimit,defaultStartDate,endDate,differentDates}=this.props;
        //(defaultStartDate!=undefined?defaultStartDate:dateSelected)
          let startDateLocally=(differentDates===true?defaultStartDate:dateSelected);
          let endDateLocally=(differentDates===true?endDate:dateSelected)
          let startTime=is24Hour
                          ?moment(startDateLocally.slice(0,startDateLocally.indexOf('T'))+'T'+hour+':'+min,'YYYY-MM-DDTHH:mm')
                          :moment(startDateLocally.slice(0,startDateLocally.indexOf('T'))+' '+hour+':'+min+' '+startTimeAmPm,'YYYY-MM-DD hh:mm A')
          let endTime=is24Hour
                          ?moment(endDateLocally.slice(0,endDateLocally.indexOf('T'))+'T'+endHour+':'+endMin,'YYYY-MM-DDTHH:mm')
                          :moment(endDateLocally.slice(0,endDateLocally.indexOf('T'))+' '+endHour+':'+endMin+' '+endTimeAmPm,'YYYY-MM-DD hh:mm A')
          let isBefore = startTime.isBefore(endTime);
          let isSame=startTime.isSame(endTime);
          let isValid=startTime.diff(moment())<=0&&endTime.diff(moment())<=0;
          let duration=moment.duration(endTime.diff(startTime));
          if(durationInLimit!=undefined&&durationInLimit>0&&duration.asMinutes()>durationInLimit){
            this.setState({validationMessage:I18n.t('stats_breastfeeding.error_sleep_duration_total_min'),disableOkButton:true},()=>{this.validationOnChange()})
            return true;
          }else if (duration.asDays()>=1){
            this.setState({validationMessage:I18n.t('stats_breastfeeding.duration_cant_exceed_a_day'),disableOkButton:true},()=>{this.validationOnChange()})
            return true;
          }else{
            //this.setState({validationMessage:I18n.t('calendar.timer_alert')});
            if(isValid){
              if(isBefore){
                this.setState({validationMessage:I18n.t('calendar.timer_alert'),disableOkButton:false},()=>{this.validationOnChange()});
                return false
              }else{
                if(isSame){
                  // if(this.toCheckIfTimeChanged()){

                  // }
                  //console.log('if time has changed',this.toCheckIfTimeChanged())
                  this.setState({validationMessage:this.toCheckIfTimeChanged()?I18n.t('calendar.timer_alert'):'',disableOkButton:this.toCheckIfTimeChanged()},()=>{this.validationOnChange()});
                  return this.toCheckIfTimeChanged()
                }else{
                  this.setState({validationMessage:I18n.t('calendar.timer_alert'),disableOkButton:true},()=>{this.validationOnChange()});
                  return true
                }
              }
            }else{
              this.setState({validationMessage:I18n.t('calendar.timer_alert'),disableOkButton:true},()=>{this.validationOnChange()});
              return true
            }
        }
    }
    /**
     * 
     * @returns will return if any timer value has changed or not
     */
    toCheckIfTimeChanged=()=>{
      const {dualTimer,showStartEndTime,differentDates}=this.props;
      let timers=[...['refStartLeftTimer','endTimerRefrences.left'],...(differentDates===true&&dualTimer)?['endTimerRefrences.right']:[],...dualTimer&&showStartEndTime?['refStartRightTimer']:[]];
      //...dualTimer&&showStartEndTime?['refStartRightTimer']:[]
      //console.log('timers',timers)
      let flag=false;
      for(let index=0;index<timers.length;index++){
        let timer=timers[index].includes('.')?this[timers[index].split('.')[0]][timers[index].split('.')[1]]:this[timers[index]];
        if(timer!=undefined){
          if(timer.forms.changed.hour || timer.forms.changed.min||timer.forms.changed.switch){
            flag= true;
            break;
          }
        }
      }
      return flag;
    }
    /**
     * Send onValidationChange event to parent
     */
    validationOnChange=()=>{
        const {validationChange}=this.props;
        const {validationMessage,disableOkButton}=this.state;
        validationChange({validationMessage,disableOkButton});
    }
    /**
     * called on ok press if opened in stats page 
     */
    okStatsBtn=()=>{
        const {positiveOnPress}=this.props;
        const{startDate, endDate, btnSelected}= this.state
        positiveOnPress(startDate, endDate, btnSelected)
    }
    /**
     * 
     * @returns 
     */
    okBtn=()=>{
        const {isAddBaby,onDateChange,showStartEndTime,dualTimer,differentDates,selectInvalidDate,defaultStartDate}=this.props
        const {dateSelected, hour, min, isAmPm, is24Hour} = this.state
        if(isEmpty(dateSelected)) {
          return
        }
        let  pattern = /^\d+$/;
    
        if((hour !== '0' && min !== '0') && (hour !== '0') && (min !== '0') && (hour !== '' && min !== '') && (hour !== '') && (min !== '')  && pattern.test(hour) && pattern.test(min)){
          let updatedHour = hour
          let isToday = moment(dateSelected).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')
          let hrs = parseInt(moment().format('HH'))
          let minutes = moment().format('mm')
          let newValue = this.getAmPmValue(hour)
          if(!is24Hour) {
            if(parseInt(hour) === 12){
              updatedHour = (isAmPm === I18n.t('calendar.is_am') ? 0 : 12) + ''
            } else {
              isAmPm === I18n.t('calendar.is_pm') && (updatedHour = (parseInt(hour) + 12) + '')
            }
          }
          if (dateSelected.toString().includes('T')){
            let splittedDateArr = dateSelected.toString().split('T')
            let splittedTimeArr = splittedDateArr[1].split(':')
            splittedTimeArr[0] = (updatedHour.length === 1) ? '0' + updatedHour : updatedHour
            splittedTimeArr[1] = (min.length === 1) ? '0' + min : min
            let updatedTime = splittedTimeArr.join(':')
            var updatedDate = splittedDateArr[0] + 'T' + updatedTime
            if(!is24Hour && isToday &&!differentDates && (parseInt(newValue) > hrs || (parseInt(newValue) === hrs && min > minutes))){
              if(selectInvalidDate===true){
                this.props.positiveOnPress(
                  differentDates===true?defaultStartDate.toString():updatedDate,
                )
                isAddBaby && onDateChange(dateSelected)
              }else
              alert(I18n.t('calendar.date_time_alert')+I18n.t('calendar.first'))
            } else {
              this.props.positiveOnPress(
                differentDates===true?defaultStartDate.toString():updatedDate,
                showStartEndTime===true?dualTimer?this.getDurationForDualTimer():this.getDurationIfEndTimePresent():undefined
              )
              isAddBaby && onDateChange(dateSelected)
            }
          }else {
            if(!is24Hour && isToday&&!differentDates && (parseInt(newValue) > hrs || (parseInt(newValue) === hrs && min > minutes))){
              alert(I18n.t('calendar.date_time_alert')+I18n.t('calendar.second'))
            } else {
              this.props.positiveOnPress(
                differentDates===true?defaultStartDate.toString():dateSelected.toString(),
                showStartEndTime===true?this.getDurationIfEndTimePresent():undefined
              )
              isAddBaby && onDateChange(dateSelected)
            }
          }
        }else{
          alert(I18n.t('calendar.date_time_alert')+I18n.t('calendar.last'))
        }
    }
    getDurationForDualTimer=()=>{
        const {
          hour,min,endHour,endMin,dateSelected,
          startTimeAmPm,endTimeAmPm,is24Hour,
          startRightAmPm,startRightHour,startRightMin
        }=this.state;
        const {startEndDetainedValue,differentDates,defaultStartDate,rightStartDate,endDate}=this.props;
        let startDateLocally=(differentDates===true?defaultStartDate:dateSelected);
        let startRightDateLocally=(differentDates===true?rightStartDate:dateSelected);
        let endDateLocally=(differentDates===true?endDate:dateSelected)

        let timerStatus,startTime,endTime,duration,durationRight,startTimeRight;
        if(!this.checkDateValidationIfDualTimer(true)){
          timerStatus='left'
        }
        if(!this.checkDateValidationIfDualTimer(false)){
          if(timerStatus=='left'){
            timerStatus='both'
          }else{
            timerStatus='right'
          }
        }
        if(differentDates===true){
          if(!this.checkDateValidationIfDualTimer(true)&&!this.checkDateValidationIfDualTimer(false)){
            timerStatus='both'
          }
        }
        if(is24Hour){
          if(timerStatus=='left'){
            startTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+hour+':'+min,'YYYY-MM-DDTHH:mm')
            endTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+endHour+':'+endMin,'YYYY-MM-DDTHH:mm')
            duration=moment.duration(endTime.diff(startTime))
            let rightStartObj=moment(startEndDetainedValue.startTimeRight);
            startTimeRight=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+rightStartObj.hours()+':'+rightStartObj.format('mm'),'YYYY-MM-DDTHH:mm')
            let startEndObj=moment(startEndDetainedValue.endTime)
            let startTimeEnd=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+startEndObj.hours()+':'+startEndObj.format('mm'),'YYYY-MM-DDTHH:mm')
            durationRight=moment.duration(startTimeEnd.diff(startTimeRight))
          }else if(timerStatus=='right'){
            let startTimeObj=moment(startEndDetainedValue.startTime);
            startTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+startTimeObj.hours()+':'+startTimeObj.format('mm'),'YYYY-MM-DDTHH:mm')
            //endTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+endHour+':'+endMin,'YYYY-MM-DDTHH:mm')
            let endTimeObj=moment(startEndDetainedValue.endTime)
            endTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+endTimeObj.hours()+':'+endTimeObj.format('mm'),'YYYY-MM-DDTHH:mm')
            duration=moment.duration(endTime.diff(startTime))
            startTimeRight=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+startRightHour+':'+startRightMin,'YYYY-MM-DDTHH:mm')
            let startTimeEnd=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+' '+endHour+':'+endMin+' '+endTimeAmPm,'YYYY-MM-DD hh:mm A')
            startTimeEnd=moment(startTimeEnd,'YYYY-MM-DDTHH:mm');
            durationRight=moment.duration(startTimeEnd.diff(startTimeRight))
            if(!endTime.isSame(startTimeEnd)){
              endTime=startTimeEnd;
            }
          }else{
            startTime=moment(startDateLocally.slice(0,startDateLocally.indexOf('T'))+'T'+hour+':'+min,'YYYY-MM-DDTHH:mm')
            endTime=moment(endDateLocally.slice(0,endDateLocally.indexOf('T'))+'T'+endHour+':'+endMin,'YYYY-MM-DDTHH:mm')
            duration=moment.duration(endTime.diff(startTime))
            startTimeRight=moment(startRightDateLocally.slice(0,startRightDateLocally.indexOf('T'))+'T'+startRightHour+':'+startRightMin,'YYYY-MM-DDTHH:mm')
            durationRight=moment.duration(endTime.diff(startTimeRight))
          }
          return {duration,startTime,endTime,startTimeRight,durationRight};
        }else{
          if(timerStatus=='left'){
            startTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+' '+hour+':'+min+' '+startTimeAmPm,'YYYY-MM-DD hh:mm A')
            startTime=moment(startTime,'YYYY-MM-DDTHH:mm');
            //startTime=moment(this.get24HoursDateFrom12Hours(dateSelected,hour,min,startTimeAmPm),'YYYY-MM-DDTHH:mm');
            //endTime=moment(this.get24HoursDateFrom12Hours(dateSelected,endHour,endMin,endTimeAmPm),'YYYY-MM-DDTHH:mm');
            endTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+' '+endHour+':'+endMin+' '+endTimeAmPm,'YYYY-MM-DD hh:mm A')
            endTime=moment(endTime,'YYYY-MM-DDTHH:mm');
            duration=moment.duration(endTime.diff(startTime));
            //let rightStartObj=moment(startEndDetainedValue.startTimeRight);
            let rightStartObj=moment(startEndDetainedValue.startTimeRight);
            startTimeRight=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+rightStartObj.hours()+':'+rightStartObj.format('mm'),'YYYY-MM-DDTHH:mm')
            let startEndObj=moment(startEndDetainedValue.endTime)
            let startTimeEnd=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+startEndObj.hours()+':'+startEndObj.format('mm'),'YYYY-MM-DDTHH:mm')
            //console.log(startTimeRight.hours(),startTimeRight.format('mm'))
            //console.log(dateSelected,rightStartObj.format('hh'),rightStartObj.format('mm'),rightStartObj.format('A'),this.get24HoursDateFrom12Hours(dateSelected,rightStartObj.format('hh'),rightStartObj.format('mm'),rightStartObj.format('A')))
            //startTimeRight=moment(this.get24HoursDateFrom12Hours(dateSelected,rightStartObj.format('hh'),rightStartObj.format('mm'),rightStartObj.format('A')),'YYYY-MM-DDTHH:mm')
            //console.log(startTimeRight,'left')
            durationRight=moment.duration(startTimeEnd.diff(startTimeRight))
          }else if(timerStatus=='right'){
            let startTimeObj=moment(startEndDetainedValue.startTime);
            startTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+startTimeObj.hours()+':'+startTimeObj.format('mm'),'YYYY-MM-DDTHH:mm')
            let endTimeObj=moment(startEndDetainedValue.endTime)
            endTime=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+'T'+endTimeObj.hours()+':'+endTimeObj.format('mm'),'YYYY-MM-DDTHH:mm')
            //startTime=moment(this.get24HoursDateFrom12Hours(dateSelected,startTimeObj.format('hh'),startTimeObj.format('mm'),startTimeObj.format('A')),'YYYY-MM-DDTHH:mm')
            //endTime=moment(this.get24HoursDateFrom12Hours(dateSelected,endHour,endMin,endTimeAmPm),'YYYY-MM-DDTHH:mm');
            duration=moment.duration(endTime.diff(startTime));
            //startTimeRight=moment(this.get24HoursDateFrom12Hours(dateSelected,startRightHour,startRightMin,startRightAmPm),'YYYY-MM-DDTHH:mm');
            startTimeRight=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+' '+startRightHour+':'+startRightMin+' '+startRightAmPm,'YYYY-MM-DD hh:mm A')
            startTimeRight=moment(startTimeRight,'YYYY-MM-DDTHH:mm');
            let startTimeEnd=moment(dateSelected.slice(0,dateSelected.indexOf('T'))+' '+endHour+':'+endMin+' '+endTimeAmPm,'YYYY-MM-DD hh:mm A')
            startTimeEnd=moment(startTimeEnd,'YYYY-MM-DDTHH:mm');
            durationRight=moment.duration(startTimeEnd.diff(startTimeRight))
            //console.log(startTimeRight,'right')
            if(!endTime.isSame(startTimeEnd)){
              endTime=startTimeEnd
            }
          }else{
            //startTime=moment(this.get24HoursDateFrom12Hours(dateSelected,hour,min,startTimeAmPm),'YYYY-MM-DDTHH:mm');
            startTime=moment(startDateLocally.slice(0,startDateLocally.indexOf('T'))+' '+hour+':'+min+' '+startTimeAmPm,'YYYY-MM-DD hh:mm A')
            startTime=moment(startTime,'YYYY-MM-DDTHH:mm');
            endTime=moment(endDateLocally.slice(0,endDateLocally.indexOf('T'))+' '+endHour+':'+endMin+' '+endTimeAmPm,'YYYY-MM-DD hh:mm A')
            endTime=moment(endTime,'YYYY-MM-DDTHH:mm');
            //endTime=moment(this.get24HoursDateFrom12Hours(dateSelected,endHour,endMin,endTimeAmPm),'YYYY-MM-DDTHH:mm');
            duration=moment.duration(endTime.diff(startTime));
            //startTimeRight=moment(this.get24HoursDateFrom12Hours(dateSelected,startRightHour,startRightMin,startRightAmPm),'YYYY-MM-DDTHH:mm');
            startTimeRight=moment(startRightDateLocally.slice(0,startRightDateLocally.indexOf('T'))+' '+startRightHour+':'+startRightMin+' '+startRightAmPm,'YYYY-MM-DD hh:mm A')
            startTimeRight=moment(startTimeRight,'YYYY-MM-DDTHH:mm');
            durationRight=moment.duration(endTime.diff(startTimeRight))
            //console.log(startTimeRight,'both')
          }
          return {duration,startTime,endTime,startTimeRight,durationRight};
        }
    
    }
    getDurationIfEndTimePresent=()=>{
        const {hour,min,endHour,endMin,dateSelected,startTimeAmPm,endTimeAmPm,is24Hour}=this.state;
        const {differentDates,defaultStartDate,endDate}=this.props;
        let startDate=differentDates===true?defaultStartDate:dateSelected;
        let lastDate=differentDates===true?endDate:dateSelected;
        if(is24Hour){
          let startTime=moment(startDate.slice(0,startDate.indexOf('T'))+'T'+hour+':'+min,'YYYY-MM-DDTHH:mm')
          let endTime=moment(lastDate.slice(0,lastDate.indexOf('T'))+'T'+endHour+':'+endMin,'YYYY-MM-DDTHH:mm')
          let duration=moment.duration(endTime.diff(startTime));
          console.log({duration,startTime,endTime},'inside 24 hour')
          return {duration,startTime,endTime};
        }else{
          let startTime=moment(startDate.slice(0,startDate.indexOf('T'))+' '+hour+':'+min+' '+startTimeAmPm,'YYYY-MM-DD hh:mm A')
          startTime=moment(startTime,'YYYY-MM-DDTHH:mm');
          let endTime=moment(lastDate.slice(0,lastDate.indexOf('T'))+' '+endHour+':'+endMin+' '+endTimeAmPm,'YYYY-MM-DD hh:mm A')
          endTime=moment(endTime,'YYYY-MM-DDTHH:mm');
          let duration=moment.duration(endTime.diff(startTime));
          return {duration,startTime,endTime};
        }
    }
    get24HoursDateFrom12Hours(date,hour,min,meridiem){
        date=date.slice(0,date.indexOf('T'));
        if(meridiem=='AM'){
          return `${date}T${hour}:${min}`
        }else{
          return `${date}T${parseInt(hour)+12}:${min}`
        }
    }
    btnOnClick =(selectedBtn)=>{
      const{startDate, endDate} = this.state;
      let updatedStartDate = startDate
      let updatedendDate = endDate != 'Invalid date' ? endDate : startDate
      selectedBtn === I18n.t('calendar.today') && (updatedStartDate = moment().format('YYYY-MM-DD'))&& (updatedendDate = moment().format('YYYY-MM-DD'))
      selectedBtn === I18n.t('calendar.yesterday') && (updatedStartDate = moment().subtract(1, 'days').format('YYYY-MM-DD'))
      selectedBtn === I18n.t('calendar.last_week') && (updatedStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD')) && (updatedendDate = moment().format('YYYY-MM-DD'))
      selectedBtn === I18n.t('calendar.last_month') && (updatedStartDate = moment().subtract(30, 'days').format('YYYY-MM-DD')) && (updatedendDate = moment().format('YYYY-MM-DD'))
      this.setState({startDate: updatedStartDate, endDate:selectedBtn === I18n.t('calendar.yesterday')?updatedStartDate :updatedendDate, btnSelected: selectedBtn})
      this.props.startEndDateChange(updatedStartDate,selectedBtn === I18n.t('calendar.yesterday')?updatedStartDate :updatedendDate)
      this.props.btnSelectionChange(selectedBtn);
      this.props.onDateChange(updatedStartDate)
    }
    selectDateAccrodingToTimerType=(type)=>{
      const {defaultStartDate,rightStartDate,endDate}=this.props;
      if(type=='default'){
        return defaultStartDate
      }else if(type=='right'){
        return rightStartDate
      }else{
        return endDate
      }
    }
    checkDualAfterCheckDiffDates=()=>{
      const {differentDates}=this.props;
      if(differentDates===true){
        if(!this.checkDateValidationIfDualTimer(true)){
          this.checkDateValidationIfDualTimer(false);
        }
      }else{
        this.checkDateValidationIfDualTimer();
      }
    }
    onChangeTextValue=(value, type,hourKey,minKey,hourRef,minRef,timerType)=>{
      const { is24Hour, dateSelected, isAmPm  } = this.state;
      const hour=this.state[hourKey];
      const min=this.state[minKey];
      const {showStartEndTime,dualTimer,differentDates}=this.props;
      let timeWithDate=dateSelected;
      if(differentDates===true){
        timeWithDate=this.selectDateAccrodingToTimerType(timerType)
      }
      let isToday = moment(timeWithDate).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
      let hrs = moment().format('HH')
      let minutes = moment().format('mm')
      if(type === I18n.t('calendar.hours')){
        let hourValue = is24Hour ? value : this.getAmPmValue(value)
        if(isToday && parseInt(hourValue) > hrs) {
          this.setBlankInEditFields(hourKey,()=>{this.setCursorInAndroid(hourRef,0)});
        } else if(isToday && parseInt(hourValue) === parseInt(hrs) && parseInt(min) > minutes){
          this.setBlankInEditFields(hourKey,()=>{this.setCursorInAndroid(hourRef,0)});
        }else {
          if(value.length === 1){
            this.setState({[hourKey]: value},()=>{
              this.setCursorInAndroid(hourRef,value.length)
              if(showStartEndTime==true){
                if(dualTimer){
                  this.checkDualAfterCheckDiffDates();
                    if(value.length>1){
                      minRef && minRef.focus()
                    }
                }else{
                  this.checkDateValidationForEndDate()
                    if(value.length>1){
                      minRef && minRef.focus()
                    }
                }
              }
            })
          }else if(value.length === 2){
            if(parseInt(value) > (is24Hour ? 24 : 12) || (!is24Hour && value === '00')){
              this.setBlankInEditFields(hourKey,()=>{this.setCursorInAndroid(hourRef,0)})
            }else{
              this.setState({[hourKey]: value},()=>{
                this.setCursorInAndroid(hourRef,value.length)
                if(showStartEndTime==true){
                  if(dualTimer){
                    this.checkDualAfterCheckDiffDates()
                    if(value.length>1){
                      minRef && minRef.focus()
                    }
                  }else{
                    this.checkDateValidationForEndDate()
                    if(value.length>1){
                      minRef && minRef.focus()
                    }
                  }
                }
              })
            }
          }else{
            this.setBlankInEditFields([hourKey],()=>{this.setCursorInAndroid(hourRef,0)})
          }
        }
      }
      else{
        let hourValue = is24Hour ? hour : this.getAmPmValue(hour)
        if(isToday && parseInt(hourValue) === parseInt(hrs) && parseInt(value) > minutes) {
          this.setBlankInEditFields(minKey,()=>{this.setCursorInAndroid(minRef,0)})
        } else {
          if(value.length === 1){
            this.setState({[minKey]: value},()=>{
              this.setCursorInAndroid(minRef,value.length)
              if(showStartEndTime==true){
                if(dualTimer){
                  this.checkDualAfterCheckDiffDates()
                }else{
                  this.checkDateValidationForEndDate()
                }
              }
            })
          }else if(value.length === 2){
            if(value > 59){
              this.setBlankInEditFields(minKey,()=>{this.setCursorInAndroid(minRef,0)})
            }else{
              this.setState({[minKey]: value},()=>{
                this.setCursorInAndroid(minRef,value.length)
                if(showStartEndTime==true){
                  if(dualTimer){
                    this.checkDualAfterCheckDiffDates()
                  }else{
                    this.checkDateValidationForEndDate()
                  }
                }
              })
            }
          }else{
            this.setBlankInEditFields(minKey,()=>{this.setCursorInAndroid(minRef,0)})
          }
        }
      }
    }
    /**
     * 
     * @returns this will return the background color for both the themes 
     */
    getTimeBackgroundColor=()=>{
      const {themeSelected}=this.props;
      let timebackgroundColor = Colors.rgb_898d8d33
      if(themeSelected === "dark"){
          timebackgroundColor = Colors.rgb_1A1C1C
      }
      return timebackgroundColor
    }
    /**
     * 
     * @returns this will render the sides to switch b/w left and right timer in case of dual timer like in breastfeeding screen
     */
    renderSideBar=()=>{
      let dualSwitchWidth=0;
      if(I18n.t('calendar.is_pm').length<5){
          dualSwitchWidth+=(DeviceInfo.getFontScale()>1.6?90*1.63:90)+Metrics.moderateScale._80+Metrics.moderateScale._6
      }else{
          dualSwitchWidth=(DeviceInfo.getFontScale()>1.6?100*1.63:170)+Metrics.moderateScale._80+Metrics.moderateScale._6
      }
      return(
        <View style={[styles.switchTimerContainer]}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.timeTitle,{textAlignVertical:'center',color:this.props.textColor}]}>{I18n.t(`calendar.side`)}</Text>
          <SwitchButton
            onValueChange={(val) => {
              const {startRightAmPm,startTimeAmPm}=this.state;
              if(val==1){
                this.setState({
                  leftTimeActive:true,
                  intialStartAmPm:startTimeAmPm=='AM'?1:2
                },()=>{
                  this.checkDateValidationIfDualTimer()
                })
              }else{
                this.setState({
                  leftTimeActive:false,
                  initialRightAmPm:startRightAmPm=='AM'?1:2
                },()=>{
                  this.checkDateValidationIfDualTimer()
                })
              }
            }}
            text1 = {I18n.t('breastfeeding_pump.left')}
            text2 = {I18n.t('breastfeeding_pump.right')}
            activeSwitch={1}
            switchWidth={dualSwitchWidth}
            switchHeight = {DeviceInfo.getFontScale()>1.6?40*1.63:36}
            switchBorderRadius = {8}
            switchBorderColor = 'transparent'
            switchBackgroundColor = {this.getTimeBackgroundColor()}
            btnBorderColor = 'transparent'
            btnBackgroundColor = {Colors.white}
            fontColor = {this.props.textColor}
            activeFontColor = {Colors.rgb_000000}
            switchdirection={I18nManager.isRTL?'rtl':'ltr'}
          />
        </View>
      )
    }
    renderBar = (type)=>{
      return (
        <View style={[styles.switchTimerContainer]}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.timeTitle,{textAlignVertical:'center',...Fonts.style.bold_25,color:this.props.textColor, width: Metrics.moderateScale._110}]}>{I18n.t('breastfeeding_pump.'+type)+' '+I18n.t(`calendar.side`)}</Text>
        </View>
      )
    }
    /**
     * 
     * @returns this is the default timer and will be rendered every time
     */
    defaultTimer=()=>{
      const {showStartEndTime,dualTimer,showDateBar,showCalendar,defaultStartDate, differentDates}=this.props;
      const {disableOkButton,validationMessage,hour,min,is12Hour,intialStartAmPm,dateSelected, leftTimeActive}=this.state;
      return(<StartEndTimers
        showStartEndTime={showStartEndTime}
        disableOkButton={disableOkButton}
        validationMessage={validationMessage}
        renderValidation={false}
        hour={hour}
        min={min}
        onChangeTextHour={(index,value)=>{
          this.onChangeTextValue(value,I18n.t('calendar.hours'),'hour','min',this.refStartLeftTimer.hoursInput,this.refStartLeftTimer.minInput,'default')
        }}
        onChangeTextMin={(index,value)=>{
          this.onChangeTextValue(value,I18n.t('calendar.mins'),'hour','min',this.refStartLeftTimer.hoursInput,this.refStartLeftTimer.minInput,'default')
        }}
        // formValidationChange={()=>{
        //   console.log('forms',this.refStartLeftTimer.forms)
        // }}
        is12Hour={is12Hour}
        onSwitchValueChange={(val) => {
          this.setState({
            isAmPm: (val === 1)? I18n.t('calendar.is_am'): I18n.t('calendar.is_pm'),
            startTimeAmPm:(val===1)?'AM':'PM'
          },()=>{
            if(dualTimer)
              this.checkDualAfterCheckDiffDates()
            else
              this.checkDateValidationForEndDate()
          })
        }}
        initialAmPm={intialStartAmPm}
        timebackgroundColor={this.getTimeBackgroundColor()}
        ref={instance=>{this.refStartLeftTimer=instance}}
        title={I18n.t(`calendar.${showStartEndTime ? 'start_time' : 'time'}`)}
        showDateBar={showDateBar}
        dateSelected={defaultStartDate}
        showCalendar={showCalendar}
        type={'default'}
        textColor={this.props.textColor}
        accessibilityTitleLabel={leftTimeActive===true && dualTimer===true ? "Left Side Start time" : "Start time"}
        accessibilityDateLabel={leftTimeActive===true && dualTimer===true ? "Left Side Start Date" : "Start Date"}
        accessibilityhrLabel={leftTimeActive===true && dualTimer===true && differentDates===true ? "Left Side Start, hours" : leftTimeActive===true && dualTimer===true ? "Start hours" : "hours"}
        accessibilityColonLabel={leftTimeActive===true && dualTimer===true && differentDates===true ? "Left Side Start, hour minute separator" : leftTimeActive===true && dualTimer===true ? "Start hour minute separator" : "hour minute separator"}
        accessibilityMinutesLabel={leftTimeActive===true && dualTimer===true && differentDates===true ? "Left Side Start, minutes" : leftTimeActive===true && dualTimer===true ? "Start minutes" : "minutes"}
        accessibilityAmPmLabel={leftTimeActive===true && dualTimer===true && differentDates===true ? "Left Side Start, AM PM selector" : leftTimeActive===true && dualTimer===true ? "Start AM PM selector" : "AM PM selector"}
      />)
    }
    /**
     * 
     * @returns this will return the start time timer when side is right in case of breastfeeding screen
     */
    startRightTimer=()=>{
      const {showStartEndTime,dualTimer,showDateBar,showCalendar,rightStartDate, differentDates}=this.props;
      const {disableOkButton,validationMessage,startRightHour,startRightMin,is12Hour,initialRightAmPm, leftTimeActive}=this.state;
      return(
        <StartEndTimers
          textColor={this.props.textColor}
          showStartEndTime={showStartEndTime}
          disableOkButton={disableOkButton}
          validationMessage={validationMessage}
          renderValidation={false}
          hour={startRightHour}
          min={startRightMin}
          onChangeTextHour={(index,value)=>{
            this.onChangeTextValue(value,I18n.t('calendar.hours'),'startRightHour','startRightMin',this.refStartRightTimer.hoursInput,this.refStartRightTimer.minInput,'right')
          }}
          onChangeTextMin={(index,value)=>{
            this.onChangeTextValue(value,I18n.t('calendar.mins'),'startRightHour','startRightMin',this.refStartRightTimer.hoursInput,this.refStartRightTimer.minInput,'right')
          }}
          is12Hour={is12Hour}
          onSwitchValueChange={(val) => {
            this.setState({
              startRightAmPm:(val===1)?'AM':'PM'
            },()=>{
              if(dualTimer)
                this.checkDualAfterCheckDiffDates()
              else
                this.checkDateValidationForEndDate()
            })
          }}
          initialAmPm={initialRightAmPm}
          timebackgroundColor={this.getTimeBackgroundColor()}
          ref={instance=>{this.refStartRightTimer=instance}}
          title={I18n.t(`calendar.${showStartEndTime ? 'start_time' : 'time'}`)}
          showDateBar={showDateBar}
          showCalendar={showCalendar}
          dateSelected={rightStartDate}
          type={'right'}
          accessibilityTitleLabel={(showStartEndTime &&dualTimer&&(leftTimeActive===false||differentDates===true)) ? "Right Side Start time" : "Time"}
          accessibilityDateLabel={(showStartEndTime &&dualTimer&&(leftTimeActive===false||differentDates===true)) ? "Right Side Start Date" : "Date"}
          accessibilityhrLabel={"hours"}
          accessibilityColonLabel={(showStartEndTime &&dualTimer&&(leftTimeActive===false||differentDates===true)) ? "Right Side Start, hour minute separator" : "Start hour minute separator"}
          accessibilityMinutesLabel={"minutes"}
          accessibilityAmPmLabel={(showStartEndTime &&dualTimer&&(leftTimeActive===false||differentDates===true)) ? "Right Side Start, AM PM selector" : "Start AM PM selector"}
        />
      )
    }
    /**
     * 
     * @returns this will render the endtime timer 
     */
    endTimer=(bar)=>{
      const {showStartEndTime,dualTimer,showDateBar,showCalendar,endDate, differentDates}=this.props;
      const {disableOkButton,validationMessage,endHour,endMin,is12Hour,initialEndAmPm}=this.state;
      return(
        <StartEndTimers
          showStartEndTime={showStartEndTime}
          disableOkButton={disableOkButton}
          validationMessage={validationMessage}
          notStyles={bar=='left'}
          renderValidation={bar=='right'}
          hour={endHour}
          min={endMin}
          onChangeTextHour={(index,value)=>{
            this.onChangeTextValue(value,I18n.t('calendar.hours'),'endHour','endMin',this.endTimerRefrences[bar].hoursInput,this.endTimerRefrences[bar].minInput,'end')
          }}
          onChangeTextMin={(index,value)=>{
            this.onChangeTextValue(value,I18n.t('calendar.mins'),'endHour','endMin',this.endTimerRefrences[bar].hoursInput,this.endTimerRefrences[bar].minInput,'end')
          }}
          is12Hour={is12Hour}
          onSwitchValueChange={(val) => {
            const {differentDates}=this.props;
            //console.log('ref',typeof this.endTimerRefrences[bar=='left'?'right':'left'].switchRef._switchThump('ltr',true))
            if(differentDates===true&&dualTimer){
              this.endTimerRefrences[bar=='left'?'right':'left'].switchRef._switchThump(I18nManager.isRTL?'rtl':'ltr',true)
            }
            this.setState({
                endTimeAmPm:(val===1)?'AM':'PM',
              },()=>{
                if(dualTimer)
                  this.checkDualAfterCheckDiffDates()
                else
                  this.checkDateValidationForEndDate()
              })
          }}
          initialAmPm={initialEndAmPm}
          timebackgroundColor={this.getTimeBackgroundColor()}
          //ref={instance=>{this.refEndTimer=instance}}
          title={I18n.t('calendar.end_time')}
          showDateBar={showDateBar}
          showCalendar={showCalendar}
          dateSelected={endDate}
          type={'end'}
          ref={instance=>{this.endTimerRefrences[bar]=instance}}
          textColor={this.props.textColor}
          accessibilityTitleLabel={dualTimer&&showStartEndTime&&differentDates===true&&bar=='left' ? "Left side end time" : 
            dualTimer&&showStartEndTime&&differentDates===true&&bar=='right' ? "Right side end time" : "end time"}
          accessibilityDateLabel={dualTimer&&showStartEndTime&&differentDates===true&&bar=='left' ? "Left side end date" : 
            dualTimer&&showStartEndTime&&differentDates===true&&bar=='right' ? "Right side end date" : "end date"}
          accessibilityhrLabel={"hours"}
          accessibilityColonLabel={dualTimer&&showStartEndTime&&differentDates===true&&bar=='left' ? "Left side end, hour minute separator" : 
          dualTimer&&showStartEndTime&&differentDates===true&&bar=='right' ? "Right side end, hour minute separator" : "hour minute separator"}
          accessibilityMinutesLabel={"minutes"}
          accessibilityAmPmLabel={dualTimer&&showStartEndTime&&differentDates===true&&bar=='left' ? "Left side end, AM PM selector" : 
          dualTimer&&showStartEndTime&&differentDates===true&&bar=='right' ? "Right side end, AM PM selector" : "end AM PM selector"}
        />
      )
    }
    render(){
        const {dualTimer,showStartEndTime,notShowTime,showStatsBtn,differentDates}=this.props;
        const {leftTimeActive,btnSelected}=this.state;
        return(
          <View>
            {dualTimer&&showStartEndTime&&!differentDates&&this.renderSideBar()}
            {dualTimer&&showStartEndTime&&differentDates&&this.renderBar('left')}
            { !notShowTime &&
              <Fragment >
                {(leftTimeActive===true||differentDates===true)&&this.defaultTimer()}
                {dualTimer&&showStartEndTime&&differentDates===true&&this.endTimer('left')}
                
                {dualTimer&&showStartEndTime&&differentDates&&this.renderBar('right')}
                {(showStartEndTime &&dualTimer&&(leftTimeActive===false||differentDates===true))&&this.startRightTimer()}
                {showStartEndTime &&this.endTimer('right')}
              </Fragment>
            }
            { showStatsBtn &&
              <StatsButton
                btnSelected={btnSelected}
                onPress={this.btnOnClick}
                defaultButtonPress={()=>{
                  this.setState({btnSelected:I18n.t('calendar.period')});
                  this.props.btnSelectionChange(I18n.t('calendar.period'))
                }}
              />
            }
          </View>
        )
    }
}
