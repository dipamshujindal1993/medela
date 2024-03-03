import React, { Component } from 'react'
import {
  View,
  Modal,
  Text,
  Dimensions
} from 'react-native'

import {
  Colors,
  Metrics
} from '@resources'
import I18n from 'react-native-i18n';
import CalendarPicker from 'react-native-calendar-picker'
import moment from "moment";
import ArrowLeft from '@svg/arrow_left'
import ArrowRight from '@svg/arrow_right'
import { monthsArab,monthsEng,engToArabicNumber ,weekdaysArab,weekdaysEng ,monthsNameFunc } from '@utils/locale';
import styles from './Styles/CustomCalendarStyles'
import { BlurView } from "@react-native-community/blur";
import { verticalScale } from '@resources/Metrics'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';
import KeyUtils from "@utils/KeyUtils";
require("moment/min/locales.min")
import CalendarButtons from './CalendarButtons';
import CalendarTimers from './CalendarTimers';
class CustomCalendar extends Component {
  constructor(props) {
    super(props)
    this.state={
      dateSelected: moment().format(),
      startDate: this.props.showStatsBtn ? this.props.selectedCustomDates[0]:moment().format(),
      endDate: this.props.showStatsBtn ? this.props.selectedCustomDates[1]:moment().format(),
      btnSelected: I18n.t('calendar.period'),
      userLocale: false,
      disableOkButton:false,
      validationMessage:I18n.t('calendar.timer_alert'),
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected 
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    const {width}=Dimensions.get('screen');
    this.screenWidth=width;
  }
  selectedRangeStartEndViewStyle={
    backgroundColor: Colors.rgb_ffcd00,
    height: 60,
    width: 48,
    borderBottomLeftRadius: Metrics.moderateScale._25,
    borderTopLeftRadius: Metrics.moderateScale._25,
    borderBottomRightRadius: Metrics.moderateScale._25,
    borderTopRightRadius: Metrics.moderateScale._25,
  }
  selectedRangeViewStyle={
    backgroundColor: Colors.rgb_feeb99,
    height: 48,
    width: '147%'
  }
  async componentDidMount(){
    const {selectedDate, userLocale, showStatsBtn, selectedCustomDates, btnSelected,startEndDetainedValue,showStartEndTime,dualTimer} = this.props;
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.setState({
      dateSelected:selectedDate,
      userLocale: userLocale !== undefined ? userLocale : await AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE),
    })
    if(showStatsBtn === true && btnSelected === I18n.t('calendar.period') && selectedCustomDates.length > 0){
      this.setState({
        startDate: selectedCustomDates[0],
        endDate: selectedCustomDates[1],
        selectedCustomDates
      })
    }
  }
  render() {
    const {
        cancelable,
        onDismiss,
        visible,
        minDate,
        maxDate,
        negative,
        negativeOnPress,
        positive,
        positiveOnPress,
        selectedDate,
        showHeader,
        notShowTime,
        showStatsBtn,
        themeSelected,
        selectedCustomDates,
        showStartEndTime,
        dualTimer,
        isAddBaby,
        onDateChange,
        startEndDetainedValue,
        durationInLimit,
        selectInvalidDate
    } = this.props
    const { btnSelected, startDate, endDate, userLocale,disableOkButton} = this.state
    let year = 0, day = 0
    if(showHeader && selectedDate){
        year =  moment(selectedDate).format("YYYY")
        let dayName = moment(selectedDate).format(userLocale === 'en_US' ? "Do" : "DD")
        dayName=I18n.locale.includes('ar')?engToArabicNumber(dayName.split('').filter(v=>!isNaN(parseInt(v))).join('')):dayName;
        let monthName = moment(selectedDate).format("MMMM")
        monthName=I18n.locale.includes('ar')?monthsArab[monthsEng.findIndex(val=>val.includes(monthName))] :I18n.t(`months.${monthName.toLowerCase()}`)
        day = (userLocale === 'en_US') ? `${monthName} ${dayName}` :`${dayName} ${monthName}`;
    }
    const format = moment(selectedDate).format("hh:mm A").split(' ')[1]

    let updatedStartDate= startDate
    let updatedendDate= endDate

    if(showStatsBtn === true && btnSelected === I18n.t('calendar.period')){
      updatedStartDate= selectedCustomDates[0],
      updatedendDate = selectedCustomDates[1]
    }else{
      updatedStartDate= selectedDate
    }
    btnSelected === I18n.t('calendar.today') && (updatedStartDate = moment().format('YYYY-MM-DD'))
    btnSelected === I18n.t('calendar.yesterday') && (updatedStartDate = moment().subtract(1, 'days').format('YYYY-MM-DD'))
    btnSelected === I18n.t('calendar.last_week') && (updatedStartDate = moment().subtract(6, 'days').format('YYYY-MM-DD')) && (updatedendDate = moment().format('YYYY-MM-DD'))
    btnSelected === I18n.t('calendar.last_month') && (updatedStartDate = moment().subtract(30, 'days').format('YYYY-MM-DD')) && (updatedendDate = moment().format('YYYY-MM-DD'))
    let calendarBackgroundcolor = Colors.white
    let disabledTextColor = Colors.rgb_767676
    if(themeSelected === "dark"){
      calendarBackgroundcolor = Colors.rgb_000000
      disabledTextColor = Colors.rgb_767676
      // disabledTextColor = Colors.rgb_424242
    }
    
    for(let i =0 ; i<weekdaysEng.length;i++){
      weekdaysEng[0]='S1'
      weekdaysEng[6]='S2'
      weekdaysEng[2]='T1'
      weekdaysEng[4]='T2'
    }

  const customDayHeaderStyles = dayOfWeek => {
    return {
      textStyle: {
        fontWeight: 'bold'
      }
    }
  }

    return (
        <Modal
            transparent
            hardwareAccelerated
            visible={visible}
            onRequestClose={() => cancelable != false && onDismiss ? onDismiss() : null}
            animationType={'fade'}
        >
          <BlurView
            blurType='light'
            style={{flex: 1}}>
              <KeyboardAwareScrollView automaticallyAdjustContentInsets={false}  style={{marginBottom:'auto'}} contentContainerStyle={{flexGrow: 1}}>
              <View style={styles.calendarMainContainer}>
                <View style={[styles.calendarBackground, {backgroundColor: calendarBackgroundcolor}]}>
                    {/* {
                      showHeader && <View style={styles.dateContainer}>
                            <Text maxFontSizeMultiplier={1.7} style={[styles.year, {color: calendarBackgroundcolor}]}>{I18n.locale.includes('ar')?engToArabicNumber(year): year}</Text>
                            <Text maxFontSizeMultiplier={1.7} style={[styles.day, {color: calendarBackgroundcolor}]}>{day}</Text>
                        </View>
                    } */}
                  <CalendarPicker
                    startFromMonday={false}
                    onDateChange={showStatsBtn? (date,type)=>this.refTimers._onStatsDateChange(date,type): (date)=>this.refTimers._onDateChange(date)}
                    minDate={minDate && minDate}
                    maxDate={maxDate}
                    allowRangeSelection={(showStatsBtn && btnSelected !== I18n.t('calendar.today') && btnSelected !== I18n.t('calendar.yesterday') ) ? true: false}
                    selectedDayColor={Colors.rgb_ffcd00}
                    selectedStartDate={showStatsBtn? updatedStartDate: selectedDate}
                    selectedEndDate={showStatsBtn ? updatedendDate: false}
                    selectedRangeStartStyle={this.selectedRangeStartEndViewStyle}
                    selectedRangeStyle={this.selectedRangeViewStyle}
                    selectedRangeEndStyle={this.selectedRangeStartEndViewStyle}

                    selectedDayTextColor={Colors.rgb_000000}
                    dayLabelsWrapper={{borderColor: calendarBackgroundcolor}}
                    textStyle={{color:this.textColor, height: 48, minWidth: 48, paddingVertical: 13, textAlign: 'center', textAlignVertical: 'center'}}
                    selectYearTitle={I18n.locale.includes('ar')?'حدد السنة':'Select Year'}
                    months={monthsNameFunc(I18n.locale.substr(0,2))}
                    weekdays={I18n.locale.includes('ar')?weekdaysArab:weekdaysEng.map(d=>I18n.t(`days.${d.toLowerCase()}`))}
                    previousComponent={<View style={styles.calenderButton} accessible={true}
                                        accessibilityLabel={I18n.t("accessibility_labels.last_month")}>
                                          <ArrowLeft width={24} height={24} fill={Colors.rgb_888B8D}/></View>}
                    nextComponent={<View style={[styles.calenderButton, {alignItems: 'flex-end'}]} accessible={true}
                                        accessibilityLabel={I18n.t("accessibility_labels.next_month")}>
                                          <ArrowRight width={24} height={24} fill={Colors.rgb_888B8D}/></View>}
                    disabledDatesTextStyle={{color: disabledTextColor}}
                    initialDate={showStatsBtn? updatedStartDate : (selectedDate || dateSelected)}
                    customDayHeaderStyles={customDayHeaderStyles}
                  />
                  <CalendarTimers
                    dualTimer={dualTimer}
                    showStartEndTime={showStartEndTime}
                    themeSelected={themeSelected}
                    notShowTime={notShowTime}
                    showStatsBtn={showStatsBtn}
                    btnSelected={this.props.btnSelected}
                    btnSelectionChange={(btnSelected)=>{this.setState({btnSelected})}}
                    startEndDateChange={(startDate,endDate)=>{
                      this.setState({startDate,endDate})
                    }}
                    selectedDate={selectedDate}
                    validationChange={(obj)=>{
                      obj&&this.setState(obj);
                    }}
                    ref={instance=>{this.refTimers=instance}}
                    positiveOnPress={positiveOnPress}
                    selectedCustomDates={selectedCustomDates}
                    isAddBaby={isAddBaby}
                    onDateChange={onDateChange}
                    startEndDetainedValue={startEndDetainedValue}
                    durationInLimit={durationInLimit}
                    textColor={this.textColor}
                    selectInvalidDate={selectInvalidDate}
                  />
                  
                  <CalendarButtons
                    negative={negative}
                    positive={positive}
                    negativeOnPress={negativeOnPress}
                    positiveOnPress={() => {
                      showStatsBtn? this.refTimers.okStatsBtn(): this.refTimers.okBtn()
                    }}
                    disableOkButton={disableOkButton}
                    showStartEndTime={showStartEndTime}
                    showStatsBtn={showStatsBtn}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </BlurView>
        </Modal>
    )
  }
}
const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,
})
export default connect(mapStateToProps, null)(CustomCalendar)
