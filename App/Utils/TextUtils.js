import moment from "moment-timezone";
import {getTimeZone} from "./locale";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "./KeyUtils";
import { is24HourFormat } from 'react-native-device-time-format';
import I18n from '@i18n';
import {Alert} from "react-native";
import {openSettings} from "react-native-permissions";
var Buffer = require('buffer/').Buffer
// Check if the string is empty
export function isEmpty(str) {
  if (typeof str === 'undefined' || str === undefined || str === null || (typeof str === 'string' && (str.length === 0 || str.trim().length === 0)) || str === 'undefined' || str === '') {
    return true
  } else {
    return false
  }
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email));
}

export function validateSpecialChracter(string) {
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if(format.test(string)){
    return true;
  } else {
    return false;
  }
}

export function uuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8); return v.toString(16);
  });
}
export function convertLocalTimeToUtc(updatedDate) {
  const formattedTime=moment(updatedDate).format()
  let utcTime=moment(formattedTime).utc().format()
  if(utcTime.includes('Z')){
    utcTime = utcTime.substring(0, utcTime.length - 1);
  }
  utcTime=utcTime+moment(formattedTime).tz(getTimeZone()).format('Z')
  return utcTime
}

export async function appendTimeZone(selectedDate) {
  let timeZone=await AsyncStorage.getItem(KeyUtils.SELECTED_TIME_ZONE)
  let a = moment.tz(selectedDate, timeZone);
  return a.format()
}

export function diffInDays(date1,date2){
// To calculate the time difference of two dates
  let Difference_In_Time = date2.getTime() - date1.getTime();
// To calculate the no. of days between two dates
  return Difference_In_Time / (1000 * 3600 * 24);
}

export  function  calculateWeeksBetween(date1, date2) {
  // The number of milliseconds in one week
  let ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
  // Convert both dates to milliseconds
  /*let dd=new Date(date2)
  var day = dd.getDate();

  var month = dd.getMonth() + 1;
  var year = dd.getFullYear();

  let babyDOB = new Date(year,month,day);*/
  let date1_ms = date1.getTime();
  let date2_ms = date2.getTime();
  // Calculate the difference in milliseconds

  let difference_ms = Math.abs(date1_ms - date2_ms);
  let diff=Math.floor(difference_ms / ONE_WEEK)
  //diff+=1
  // Convert back to weeks and return hole weeks
  return diff;
}

export function currentTime(){
  return moment(moment()).format("hh:mm A")
}

export function isDateGreater(date1,date2){
  date1.setHours(24,0,0,0)
  date2.setHours(24,0,0,0)
  return date1.getTime()>=date2.getTime()
}

export function diffInDaysFromNow(date) {
  let days = moment(date).fromNow();
  let number = days.match(/\d/g);
  if (number != null) {
    number = number.join('');

    if (days.includes('minutes')) {
      return `${number} ${I18n.t('time.mins_ago')}`
    } else if (days.includes('hours')) {
      return `${number} ${I18n.t('time.hours_ago')} `
    } else if (days.includes('days')) {
      return `${number} ${I18n.t('time.days_ago')} `
    } else if (days.includes('months')) {
      return `${number} ${I18n.t('time.months_ago')} `
    } else if (days.includes('years')) {
      return `${number} ${I18n.t('time.years_ago')} `
    }
  } else if (days == 'a few seconds ago') {
    return `${I18n.t('time.just_now')}`;
  } else if (days == 'an hour ago') {
    return `${'1'} ${I18n.t('time.hour_ago')} `
  } else if (days == 'a day ago') {
    return `${'1'} ${I18n.t('time.day_ago')} `
  } else if (days == 'a minute ago') {
    return `${'1'} ${I18n.t('time.min_ago')}`
  } else if (days == 'a month ago') {
    return `${I18n.t('time.month_ago')} `
  } else if (days == 'a year ago') {
    return `${I18n.t('time.year_ago')}`
  }
}

export function diffInHoursMinutes(dateNow, dateFuture) {
  //console.log('dateNow--',dateNow,'---dateFuture--',dateFuture)

  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  //console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  // console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {
    if (hours==0 && minutes==0){
      difference += (days === 1) ? `${days} ${I18n.t('time.day_ago')} ` : `${days} ${I18n.t('time.days_ago')} `;
      return  difference
    }else {
      difference += (days === 1) ? `${days} ${I18n.t('time.day')}, ` : `${days} ${I18n.t('time.days')}, `;
    }
  }

  if (hours>0){
    if (minutes==0){
      difference += (hours === 0 || hours === 1) ? `${hours} ${I18n.t('time.hour_ago')} ` : `${hours} ${I18n.t('time.hours_ago')} `;
      return difference;
    }else {
      difference += (hours === 0 || hours === 1) ? `${hours} ${I18n.t('time.h')}, ` : `${hours} ${I18n.t('time.h')}, `;
    }
  }


  if (minutes>0){
    difference += (minutes === 0 || hours === 1) ? `${minutes} ${I18n.t('time.min_ago')}` : `${minutes} ${I18n.t('time.min_ago')}`;
  }else {
    difference +=  `${I18n.t('time.just_now')}`;
  }

  return difference;
}

export function convertSecondsToMinHours(second){
  let n=second
  let day = parseInt(n / (24 * 3600));

  n = n % (24 * 3600);
  let hour = parseInt(n / 3600);

  n %= 3600;
  let minutes = parseInt(n / 60) ;

  n %= 60;
  let seconds = parseInt(n);
  if (day===0 && hour===0 &&minutes===0){
    return seconds+` ${I18n.t('time.sec')}`
  }else if (day===0 && hour===0 &&minutes>=0){
    return seconds===0?minutes+` ${I18n.t('time.min')} `:minutes+` ${I18n.t('time.min')} `+seconds+` ${I18n.t('time.sec')}`
  } else if (day===0 && hour>0 &&minutes>=0){
    let dd=hour+` ${I18n.t('time.h')} `
    if (minutes>0){
      dd+=minutes+` ${I18n.t('time.min')} `
    }
    if (seconds>0){
      dd+=seconds+` ${I18n.t('time.sec')}`
    }
    return  dd
  }else if (day>0 && hour>=0 &&minutes>=0){
    let dd=day +` ${I18n.t('time.d')} `
    if (hour>0){
      dd+=hour+` ${I18n.t('time.h')} `
    }
    if (minutes>0){
      dd+=minutes+` ${I18n.t('time.min')} `
    }
    if (seconds>0){
      dd+=seconds+` ${I18n.t('time.sec')}`
    }
    return  dd
  }else{
    return  0+` ${I18n.t('time.sec')}`
  }
}
export function diffInHoursAndMinutes(dateNow, dateFuture) {
  //console.log('dateNow--',dateNow,'---dateFuture--',dateFuture)

  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  //console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  // console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {
    if (hours==0 && minutes==0){
      difference += (days === 1) ? `${days} ${I18n.t('time.day_ago')} ` : `${days} ${I18n.t('time.days_ago')} `;
      return  difference
    }else {
      difference += (days === 1) ? `${days} ${I18n.t('time.day_ago')}` : `${days} ${I18n.t('time.days_ago')}`;
      return  difference
    }
  }

  if (hours>0){
    difference += (hours === 0 || hours === 1) ? `${hours} ${I18n.t('time.h_ago')} ` : `${hours} ${I18n.t('time.h_ago')} `;
    return  difference
  }

  if (hours>0 && minutes==0){
    difference += (hours === 0 || hours === 1) ? `${hours} ${I18n.t('time.hour_ago')} ` : `${hours} ${I18n.t('time.hours_ago')}`;
    return difference;
  }

  if (minutes>0){
    difference += (minutes === 0 || hours === 1) ? `${minutes} ${I18n.t('time.min_ago')}` : `${minutes} ${I18n.t('time.min_ago')}`;
  }else {
    difference +=  `${I18n.t('time.just_now')}`;
  }

  return difference;
}

export  function getMilkAge(dateNow, dateFuture) {
  //console.log('dateNow--',dateNow,'---dateFuture--',dateFuture)

  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  //console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  // console.log('minutes', minutes);

  let difference = '';
  if (days > 0) {
    if (hours==0 && minutes==0){
      difference += (days === 1) ? `${days} ${I18n.t('time.day_old')} ` : `${days} ${I18n.t('time.days_old')} `;
      return  difference
    }else {
      difference += (days === 1) ? `${days} ${I18n.t('time.day_old')}` : `${days} ${I18n.t('time.days_old')}`;
      return  difference
    }
  }

  if (hours>0){
    difference += (hours === 0 || hours === 1) ? `${hours} ${I18n.t('time.h_old')} ` : `${hours} ${I18n.t('time.h_old')} `;
    return  difference
  }

  if (hours>0 && minutes==0){
    difference += (hours === 0 || hours === 1) ? `${hours} ${I18n.t('time.hour_old')} ` : `${hours} ${I18n.t('time.hours_old')} `;
    return difference;
  }

  if (minutes>0){
    difference += (minutes === 0 || hours === 1) ? `${minutes} ${I18n.t('time.min_old')}` : `${minutes}${I18n.t('time.min_old')}`;
  }else {
    difference +=  `${I18n.t('time.just_now')}`;
  }

  return difference;
}

export function convertMinToHours(n){
  let num = n;
  let hours = (num / 60);
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);
  if (rhours==0 && rminutes<60){
    return rminutes + ` ${I18n.t('time.min')}`
  }
  if (rhours>0 && rminutes===0){
    return rhours + ` ${I18n.t('time.hour')}`
  }

  return rhours + ` ${I18n.t('time.h')} ` + rminutes + ` ${I18n.t('time.min')}`;
}
export function convertSecToHours(n){
  let num = n;
  let hours = (num / 60);
  let rhours = Math.floor(hours);
  let minutes = (hours - rhours) * 60;
  let rminutes = Math.round(minutes);
  if (rhours==0 && rminutes<60){
    return rminutes + ` ${I18n.t('time.min')}`
  }
  if (rhours>0 && rminutes===0){
    return rhours + ` ${I18n.t('time.hours')}`
  }

  return rhours +  ` ${I18n.t('time.h')} ` + rminutes + ` ${I18n.t('time.min')}`;
}

export function convertSecToHourMin(n){
  let hours = Math.floor(n/3600);
  let minutes = Math.floor(n / 60) - (hours * 60)
  let rMinutes = Math.round(minutes)
  if(n==0){
    return 0 + ` ${I18n.t('stats_breastfeeding.mins')}`
  }
  if (n<60){
    return 1 + ` ${I18n.t('stats_breastfeeding.mins')}`
  }
  let remainingSeconds=n%60
  if(remainingSeconds>=30){
    rMinutes+=1
  }
  if (hours===0 && rMinutes<60){
    return remainingSeconds===0?rMinutes + ` ${I18n.t('stats_breastfeeding.mins')}`:rMinutes + ` ${I18n.t('stats_breastfeeding.mins')}`
  }
  if (hours>0 && minutes===0){
    return hours==1?hours + ` ${I18n.t('time.hour')} `: hours+ ` ${I18n.t('time.hours')} `
  }
  return hours + ` ${I18n.t('time.h')} ` + rMinutes + ` ${I18n.t('stats_breastfeeding.mins')}`;
}
export function timeConvert(n) {
  let rSeconds = Math.floor(n % 60)
  let rminutes = Math.floor((n / 60) % 60)
  let rhours = Math.floor(n / 3600)
  return  {rhours,rminutes,rSeconds}
}
export function convertSecToMinutes(n) {
  let minute = Math.floor(n / 60);
  let rSeconds = Math.floor(n % 60)
  if (n<60 && n>0){
    minute=1
    return minute
  }
  if (rSeconds>=30){
    minute+=1
  }
  return minute;
}

export function capitalizeFirstLetter(text){
  if (typeof text !== 'string') return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function toHexString(byteArray) {
  let s = '0x';
  byteArray.forEach(function(byte) {
    s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
  });
  return s;
}
//0xe8f4bf0000730478 to e8f4bf0000730478
export function toHexaString(byteArray) {
  let s = '';
  byteArray.forEach(function(byte) {
    s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
  });
  return s;
}

export function bits(value, bitsStart, bitsWidth){
  return (value >>> bitsStart) & ( Math.pow(2, bitsWidth) - 1);
}

export function convertNumberToBoolean(number){
  if(number === 0)
    return false
  else
    return true
}

export function convertOZIntoML(value) {
  return value*29.57;
}

export function convertMLIntoOZ(value) {
  return value*0.03;
}

export function convertInchToMM(value) {
  return value*25.4;
}

export function convertMMToInch(value) {
  return value*0.03;
}

export function convertPoundIntoGram(value) {
  return value*453.59;
}

export function convertGramIntoPound(value) {
  return value*0.002204;
}

export function getTrackingType(type){
  switch (type){
    case 1:
      return "Breastfeeding"
    case 2:
      return "Pumping"
    case 3:
      return "Bottle"
    case 4:
      return "Nappy"
    case 5:
      return "Sleep"
    case 6:
      return "Weight"
    case 7:
      return "Growth"

  }
}
export function getCircularReplacer(){
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

export function getManufacturerData(manufacturerData,deviceName){
  let manData=manufacturerData, hex = '';
  if(manData!=undefined){
    if( manData.length != undefined && manData.length>16 ){
      let startIndex=manData.length-16
      manData=manData.substr(startIndex,manData.length)
    }
    const manufacturerDataBuffer = Buffer.from(manData, 'base64');
    const bb = new Buffer(manufacturerDataBuffer)
    let mData = JSON.parse(JSON.stringify(bb))
    if( manData.length != undefined && manData.length > 12) {
      hex = toHexaString(mData.data.slice(5, mData.data.length))
      if(deviceName.includes("freestyle")){
        return hex
      }
      return reverseStr(hex)
    }else{
      hex = toHexaString(mData.data.slice(2, 8))
      return hex
    }
  }
}

export function formatTimer(data){
    return data.toString()+''.length===0?'00':data.toString().length===1?'0'+data.toString():data.toString()+''
}

export function formatString(str, ...args) {
  for (let i = 0; i < args.length; i++) {
    let startIndex=str.indexOf('{')
    let endIndex=str.indexOf('}')
    let newStr = str.slice(startIndex,endIndex+1)
    str=str.replace(newStr,args[i])
  }
  return str
}

export function valueToByte(number) {
  let tmp = number & 255;
  if ((tmp & 128) === 128) {
    let bit = 1;
    let mask = 0;
    for (;;) {
      {
        mask |= bit;
        if ((tmp & bit) === 0) {
          bit <<= 1;
          continue;
        }
        let left = tmp & (~mask);
        let right = tmp & mask;
        left = ~left;
        left &= (~mask);
        tmp = left | right;
        tmp = -(tmp & 255);
        break;
      }
    }
  }
  return tmp;
}

export function isListEqual(first, second){
  return JSON.stringify(first)===JSON.stringify(second)
}

export function getDateFormat(selectedDate,dots) {
  return new Promise( (resolve,reject) => {
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((result)=>{
      resolve(moment(selectedDate).format(result === 'en_US' ?dots===true?'MM.DD.YY': 'MM/DD/YYYY' :dots===true?'DD.MM.YY':'DD/MM/YYYY'))
    })
  });
}

export async function getTimeFormat(format=false, time) {
  const is24Hour = await is24HourFormat()
  return format ? is24Hour : is24Hour ? moment(time).format('HH:mm') : moment(time).format('LT')
}

export async function getDateTimeFormat(format=false, time) {
  const is24Hour = await is24HourFormat()
  return format ? is24Hour : is24Hour ? moment(time).format('DD.MM.YYYY HH:mm') : moment(time).format('DD.MM.YYYY LT')
}
export async function getDateTimeFormatAccToLocale(format = false, time) {
  const is24Hour = await is24HourFormat();
  let locale =await AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE);
  locale=locale=='en_US'?'US':locale.slice(-2)
  return format
    ? is24Hour
    : is24Hour
    ? locale == 'US'
      ? moment(time).format('MM/DD/YYYY HH:mm')
      : moment(time).format('DD/MM/YYYY HH:mm')
    : locale == 'US'
    ? moment(time).format('MM/DD/YYYY LT')
    : moment(time).format('DD/MM/YYYY LT');
}
export function reverseStr(str){
  //let str='6cc374d96304'
  console.log('str---',str)
  let splitString = str.split(""); // var splitString = "hello".split("");
  let reverseArray = splitString.reverse();
  let joinArray = reverseArray.join("");
  const found = joinArray.match(/(..?)/g);
  console.log('found---',found)
  let string=''
  if (found!=null){
    for(let i=0;i<found.length;i++){
      let x=found[i]
      let y=x.charAt(0)
      let z=x.charAt(1)
      let temp=y
      y=z
      z=temp
      string+=y+z
    }
  }

  return string
}

export function getTotalMin(min,sec){
  console.log('getTotalMin----',min,sec)
  return parseInt(min)*60+parseInt(sec)
}

export function getTotalMinHoursInSec(hour,min,sec){
  if(isNaN(hour)||hour==''){
    hour=0;
  }
  if(isNaN(min)||min==''){
    min=0;
  }
  if(isNaN(sec)||sec==''){
    sec=0;
  }
  console.log('getTotalMin----',min,sec)
  return parseInt(hour*3600)+parseInt(min)*60+parseInt(sec)
}

export function phoneNumberInUsFormat(text) {
  let formatStr = text
  let cleaned = ('' + text).replace(/\D/g, '')
  let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    let intlCode = (match[1] ? '+1 ' : ''),
      number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    return number
  } else {
    return formatStr
  }
}

export function getFormattedTime(value) {
  let _timer = parseInt(value), formatTime;
  let getSeconds = '';
  let minutes = '';
  let getMinutes = '';

  getSeconds = `0${(_timer % 60)}`.slice(-2);
  minutes = `${Math.floor(_timer / 60)}`;
  getMinutes = `0${minutes % 60}`.slice(-2);
  formatTime = getMinutes + ':' + getSeconds
  return formatTime
}
/**
 *
 * @param {*} num Provide a decimal number
 * @param {*} rounded upto what decimal places you want to truncate the number
 * @returns number after truncating with string type
 */
export function toFixedWithoutRoundOff(num,rounded) {
  let number=num.toString();
  let index=number.indexOf('.');
  if(index==-1)
    return num+'';
  else {
    return `${number.split('.')[0]+'.'+number.split('.')[1].split('').slice(0,rounded).join('')}`
  }
}

export function openPermissionAlert(){
  Alert.alert(
    I18n.t('bluetooth.location_permission_title'),
    I18n.t('bluetooth.location_permission_description'),
    [
      {
        text: I18n.t('bluetooth.cancel')
      },
      {
        text: I18n.t('bluetooth.open_setting'),
        onPress: openSettings,
      },
    ],
    { cancelable: false },
  )
}

export function toHHMMSS (sec) {
  let sec_num = parseInt(sec); // don't forget the second param
  let hours   = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}

export function getNextNonce(value){
  let y = value.replace(",","");
  let z = y.replace(",","");
  let z1 = z.replace(",","");
  console.log('last bytes ===== ', z1);
  return z1;
}