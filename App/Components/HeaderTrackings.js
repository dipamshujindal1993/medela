import React, {useState, useEffect,useRef} from 'react'
import { useSelector } from 'react-redux'
import {
  Text, TouchableOpacity,
  View, Image, I18nManager
} from 'react-native'
import {
  Colors
} from '@resources'
import styles from './Styles/HeaderTrackingStyles'
import CalendarLogo from '@svg/ic_calendar'
import DownIcon from '@svg/ic_down'
import BackIcon from '@svg/arrow_left'
import I18n from '@i18n';
import CustomCalendar from '@components/CustomCalendar'
import moment from "moment";
import {Constants} from "@resources";
import BabySelectionModal from "./BabySelectionModal";
import {getRealmDb} from "../Database/AddBabyDatabase";
import DeviceInfo from 'react-native-device-info'
import  CalendarTimerScreen  from '../Containers/CalendarTimerScreen';
import StartEndTimers from './StartEndTimers'
import { getTimeFormat } from '@utils/TextUtils';

let updatedHour;
let updatedMin;
let updatedAmPm;

function HeaderTrackings(props) {
  const[babyModalVisible, setBabyModalVisible]=useState(false)
  const[showCalendarPicker, setShowCalendarPicker]=useState(false)
  const [imagePath,setImagePath]=useState('');
  const[selectedDate, setSelectedDate]=useState(moment().format())
  const [babyId,SetBabyId]=useState('')
  const [imageLoading,setImageLoading]=useState(false)
  const [is24HourFormat,setHourFormat]=useState(true)
  const [showTimeCalendar,setShowTimerCalendar]=useState(false);
  const [hour,setHour]=useState('')
  const [min,setMin]=useState('')
  const [time,setTime]=useState(props.timeCalendarDate)
  const [initialAmPm,setInitialAmPm]=useState(moment().format('A')=='AM'?1:2)
  const [showTimeCalendarUI,setShowTimeCalendarUI]=useState(false)
  const [disableOkButton,setDisableOkButton]=useState(false)
  const currentSelectedBaby = useSelector(state=>state.home.selected_baby)
  const babies = useSelector(state=>state.home.babies);
  const selectedTheme = useSelector(state=>state.app.themeSelected);
  const didMount = useRef(false);
  const didMountValidation = useRef(false);
  let realm;
  let ref;
  useEffect(()=>{
    const init=async ()=>{
      let is24HourFormat = await getTimeFormat(true);
      setHourFormat(is24HourFormat);
      setTimeValues(is24HourFormat)
      realm = await getRealmDb();
      if (currentSelectedBaby) {
        let babyArr = realm.objects('AddBaby');
        let babiesList = JSON.parse(JSON.stringify(babyArr));
        let currentSelectedBabyLocal=babiesList.find((e)=>{
          return  e.babyId==currentSelectedBaby.babyId
        })
        setImagePath(currentSelectedBabyLocal.imagePath);
        setImageLoading(false)
        SetBabyId(currentSelectedBaby.babyId);
      }
      setShowTimerCalendar(hideCalendarIcon)
    }
    init();
    return ()=> {
      if (realm!=null){
      }
    };
  },[currentSelectedBaby])
  const getCrntDate=(prevDate=time , parsedHour = hour , parsedMin = min , parsedAmPm =  initialAmPm) =>{
    let crntDate=moment(prevDate).format()
    let meridian=parsedAmPm===1?'AM':'PM'
    let date=is24HourFormat
    ?moment(crntDate.slice(0,crntDate.indexOf('T'))+'T'+parsedHour+':'+parsedMin,'YYYY-MM-DDTHH:mm')
    :moment(crntDate.slice(0,crntDate.indexOf('T'))+' '+parsedHour+':'+parsedMin+' '+meridian,'YYYY-MM-DD hh:mm A');
    return date;
  }
  const {
    updateValidation,
    onBackPress,
    title,
    onPressBaby,
    navigation,
    isEditable,
    onBabyListPress,
    getSelectedDate,
    hideCalendarNBaby,
    ableToOpen,
    showStartEndTime,
    calenderIconPressed,
    calendarNegativePressed,
    startEndDetainedValue,
    durationInLimit,
    dualTimer,
    hideCalendarIcon,
    timeCalendarDate,
    timeCalendarDateAM,
    updateTimeCalendarUIPress,
    textStartTime
  } = props;
  if(hideCalendarIcon===true){

    useEffect(()=>{
      if ( !didMount.current ) {
        didMount.current = true;
      }
      updatedHour = hour ;
      updatedMin = min;
      updatedAmPm = initialAmPm;
    },[hour,min,initialAmPm])
    useEffect(()=>{
      if ( !didMountValidation.current ) {
        didMountValidation.current = true;
      }
      updateValidation(disableOkButton)
    },[disableOkButton])
    useEffect(()=>{
      setTime(timeCalendarDate)
      setTimeValues(is24HourFormat,timeCalendarDate)
    },[timeCalendarDate])
    useEffect(()=>{
    if(props.timeCalendarDateAM=='AM'||props.timeCalendarDateAM=='PM'){
       setInitialAmPm(props.timeCalendarDateAM ==='AM'?1:2)
      } 
     else{
     setInitialAmPm(moment(props.timeCalendarDateAM).format('A')==='AM'?1:2)
       }
    },[props.timeCalendarDateAM])
  }
  
  const setTimeValues=(is24HourFormat , parsedTime = time)=>{
    if(hideCalendarIcon===true){
      setHour(moment(parsedTime).format(is24HourFormat ? "HH" : "hh"))
      setMin(moment(parsedTime).format('mm'))
      setInitialAmPm(moment(parsedTime).format('A')=='AM'?1:2)
    }
  }
  const setHourMin = (type, value) =>{
    if(type === 'hour'){
      setHour(value)
    }
    if(type === 'min'){
      setMin(value)
    } 
    if(type === 'ampm'){
      setInitialAmPm(value)
    }
   let timer =  setInterval (()=>{
     if(type=== 'hour' && parseInt(updatedHour)  === parseInt(value)){
       clearInterval(timer)
       updateTimeCalendarUIPress(getCrntDate(undefined , value))
     }
     if(type=== 'min' && parseInt(updatedMin) ===  parseInt(value)){
      clearInterval(timer)
      updateTimeCalendarUIPress(getCrntDate(undefined , undefined , value))
    }  
    if(type === 'ampm' && parseInt(updatedAmPm) === parseInt(value) ){
      clearInterval(timer)
      updateTimeCalendarUIPress(getCrntDate(undefined , undefined , undefined , value))
    }
    },50)


  }
  const showCustomCalendar = () =>{
    return <CustomCalendar
      visible={showCalendarPicker}
      title={I18n.t('login.forgot_password_title')}
      message={I18n.t('login.forgot_password_message')}
      positive={I18n.t('login.ok')}
      negative={I18n.t('login.cancel')}
      selectedDate={props.selectedDate || selectedDate}
      maxDate={new Date()}
      startEndDetainedValue={startEndDetainedValue}
      negativeOnPress={() => negativeOnPress()}
      positiveOnPress={(updatedDate,duration) => positiveOnPress(updatedDate,duration)}
      onDismiss={() => {
      }}
      onDateChange={(date) => _onDateChange(date)}
      showHeader={true}
      durationInLimit={durationInLimit}
      showStartEndTime={showStartEndTime}
      dualTimer={dualTimer}
    />
  }
  const showCalendarTimers = () =>{
    return <CalendarTimerScreen
      dualTimer={dualTimer}
      showStartEndTime={showStartEndTime}
      selectedDate={props.selectedDate || selectedDate}
      durationInLimit={durationInLimit}
      startEndDetainedValue={startEndDetainedValue}
      onDateChange={(date) => _onDateChange(date)}
      positiveOnPress={(updatedDate,duration) => positiveOnPress(updatedDate,duration)}
      negativeOnPress={() => negativeOnPress()}
      positive={I18n.t('login.ok')}
      negative={I18n.t('login.cancel')}
    />
  }
  const timeCalendarUI = () =>{
    return (
      <CustomCalendar
        visible={showTimeCalendarUI}
        title={I18n.t('login.forgot_password_title')}
        message={I18n.t('login.forgot_password_message')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        selectedDate={time}
        maxDate={new Date()}
        negativeOnPress={() => negativeTimeCalendarUI()}
        positiveOnPress={(updatedDate) => positiveTimeCalendarUI(updatedDate)}
        onDismiss={() => {
        }}
        selectInvalidDate={true}
        onDateChange={(date) => {
        }}
        showHeader={true}
        notShowTime={true}
      />
    )
  }
  const positiveOnPress = (updatedDate,duration) => {
    setShowCalendarPicker(false)
    setSelectedDate(updatedDate)
    getSelectedDate(updatedDate,duration)
  }
  const positiveTimeCalendarUI = (updatedDate,duration)=>{
    setShowTimeCalendarUI(false);
    moment(updatedDate).isValid()&&checkValidDate(updatedDate)
    updateTimeCalendarUIPress(
      moment(updatedDate).isValid()?getCrntDate(updatedDate):moment(time)
    );
  }
  const negativeOnPress = () => {
    setSelectedDate(moment().format())
    setShowCalendarPicker(false)
    if(calendarNegativePressed!=undefined&&typeof calendarNegativePressed =='function'){
      calendarNegativePressed()
    }
  }
  const negativeTimeCalendarUI = () =>{
    setShowTimeCalendarUI(false)
  }
  const _onDateChange = (date) => {
    setSelectedDate(date)
    getSelectedDate(moment(date).format())
  }

  const ImageLoading_Error=()=>{
    setImageLoading(true)
  }
  /**
     * 
     * @returns this will return the background color for both the themes 
     */
   const getTimeBackgroundColor=()=>{
    let timebackgroundColor = Colors.rgb_898d8d33
    if(selectedTheme === "dark"){
        timebackgroundColor = Colors.rgb_1A1C1C
    }
    return timebackgroundColor
  }
  const getTextColor=()=>{
    let textColor = Colors.rgb_000000
    if(selectedTheme === "dark"){
      textColor = Colors.white
    }
    return textColor
  } 
  const renderBabyPic=()=>{
    let babyPic = {}
    if(imagePath!=''&&imagePath!=null&&imagePath!=undefined){
      babyPic ={uri:imagePath}
    }else if(babies && babies.length>0&&babyId!=undefined&&babyId!=null&&babyId!=''){
      babyPic = {uri: `${Constants.BASE_URL}rest/baby/picture/${babyId}`}
    }
    return <Image
      style={styles.baby}
      defaultSource={require('../Images/png/ic_baby_default.png')}
      source={!imageLoading ? babyPic : require('../Images/png/ic_baby_default.png')}
      onError={()=>ImageLoading_Error()}
    />
  }
  const checkValidDate=(Date=time,h=hour,m=min,meridian=initialAmPm)=>{
    if(typeof meridian === 'number'){
      meridian=meridian===1?'AM':'PM';
    }   
     Date=moment(Date).format()
    let date=is24HourFormat
                          ?moment(Date.slice(0,Date.indexOf('T'))+'T'+h+':'+m,'YYYY-MM-DDTHH:mm')
                          :moment(Date.slice(0,Date.indexOf('T'))+' '+h+':'+m+' '+meridian,'YYYY-MM-DD hh:mm A');
    // if(date.isValid()){
      let res=date.isBefore(moment())
      //let diff=now.diff(date,'minute')
     // if(diff>0){
      //  setDisableOkButton(true)
      //}else{
        setDisableOkButton(!res)
      //}
      //setDisableOkButton(date.isAfter(moment()))
      //console.log(Date,date,h,m,meridian,!res)
      //console.log(res)
      //return diff>0?false:true
      return res
    //}
  }
  return (
    <View>
      <View style={styles.container}>
      <TouchableOpacity style={styles.backIconViewStyle} activeOpacity={1} onPress={onBackPress} accessible={true} accessibilityLabel={isEditable?I18n.t('accessibility_labels.back_label'):I18n.t('accessibility_labels.down_label')}>
        {isEditable?<BackIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_fecd00}  width={40} height={40} />:<DownIcon fill={Colors.rgb_fecd00} width={30} height={30}  style={{marginLeft: 5}}/>}
      </TouchableOpacity>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{title}</Text>
      {!hideCalendarNBaby ? <View style={styles.headerRightView}>
        {hideCalendarIcon!==true?
        <TouchableOpacity style={styles.calenderIconStyle} activeOpacity={1} accessible={true} accessibilityLabel= {I18n.t('accessibility_labels.calendar_label')} onPress={() =>{
          if(ableToOpen===undefined){
            if(calenderIconPressed!=undefined && typeof calenderIconPressed =='function'){
              // if(showStartEndTime!=undefined&&showStartEndTime==true){
              //   calenderIconPressed();
              //   setTimeout(()=>{
              //     showTimerCalendars(true)
              //   },100)
              // }else{
                calenderIconPressed();
                setTimeout(()=>{
                  setShowCalendarPicker(true)
                },100)
              //}
            }else{
              setShowCalendarPicker(true)
            }
          }
          //ableToOpen === undefined && setShowCalendarPicker(true)
          }}>
          {showCalendarPicker ? <CalendarLogo fill={Colors.rgb_fecd00}/> : <CalendarLogo fill={Colors.rgb_898d8d}/>}
        </TouchableOpacity>
        :null}
        <TouchableOpacity style={styles.babyIconStyle} activeOpacity={1} accessible={true} accessibilityLabel= {I18n.t('accessibility_labels.baby_label')} onPress={() => setBabyModalVisible(true)}>
          {renderBabyPic()}
        </TouchableOpacity>
      </View> : null}
      {babyModalVisible && <BabySelectionModal
        showBabySelectionModal={babyModalVisible}
        cancelBabyPress={(visible)=>{
          setBabyModalVisible(false)
        }}
        onBabyListPress={(item) => {
          setBabyModalVisible(false)
          onBabyListPress(item)
        }}
        navigation={navigation}
      />}
      {/* {showCalendarPicker &&  showCustomCalendar()} */}
      {showCalendarPicker && (showStartEndTime==undefined || showStartEndTime==false) && showCustomCalendar()}
      {showCalendarPicker && showStartEndTime===true && showCalendarTimers()}
      
    </View>
    {showTimeCalendar===true && hideCalendarIcon ?
    <View style={{width:'100%'}}>
      <StartEndTimers
        hideCalendarIcon={hideCalendarIcon}
        disableOkButton={disableOkButton}
        validationMessage={I18n.t('calendar.timer_alert')}
        renderValidation={true}
        ableToOpen={ableToOpen}
        hour={moment(timeCalendarDate).format(is24HourFormat ? "HH" : "hh")}
        min={moment(timeCalendarDate).format('mm')}
        onChangeTextHour={(index,value)=>{
          if(checkValidDate(undefined,value)){
            if(value.length>1){
              setHourMin('hour',value)
              ref.minInput.focus()
            }
          }
        }}
        onChangeTextMin={(index,value)=>{
         if (checkValidDate(undefined,undefined,value)){
          if(value.length>1){
            setHourMin('min',value)
          }
         }
        }}
        is12Hour={!is24HourFormat}
        onSwitchValueChange={(val) => {
          checkValidDate(undefined,undefined,undefined,(val===1)?'AM':'PM')
          setHourMin('ampm',val)
        }}
        initialAmPm={initialAmPm}
        updateSwitch = {true}
        timebackgroundColor={getTimeBackgroundColor()}
        ref={instance=>{ref=instance}} 
        title={ (textStartTime ? ( I18n.t('calendar.start_time')) : ( I18n.t('calendar.time')))}
        showDateBar={true}
        dateSelected={time}
        showCalendar={()=>{
          setShowTimeCalendarUI(true);
        }}
        type={'default'}
        textColor={getTextColor()}
      />
    </View>
    :null}
    {showTimeCalendarUI&&timeCalendarUI()}
    </View>
  )

}


export default HeaderTrackings
