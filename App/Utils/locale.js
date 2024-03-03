import I18n, {getLanguages} from 'react-native-i18n'
import deviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "./KeyUtils";
let deviceLang
export function locale() {
    //result like en_US
    return deviceLang
}

export  function setDeviceLanguage(){
  getLanguages().then((languages)=>{
    deviceLang=languages[0]
  })
}

export function languageCode() {
    //result like en
    return deviceLang.substr(0, 2)
}

export function countryCode() {
    //result like US
    if (deviceLang.substr(3, 5)===''){
      return 'US'
    }else {
      const locale=deviceLang.split('-')
      return  locale[locale.length - 1]
    }
}

export  function getWeightUnits() {
  return new Promise( (resolve,reject) => {
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
      let units=''
      if (_units!=null){
          units = _units==KeyUtils.UNIT_IMPERIAL?"lb":"Kg"
      }else {
         units= countryCode() === "US" ? "lb" : "Kg"
      }
      resolve(units)
    })
  });
}

export function getVolumeUnits() {
    // return countryCode() === "US" ? "oz" : "ml"
    return new Promise( (resolve,reject) => {
      AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
        let units=''
        if (_units!=null){
            units = _units==KeyUtils.UNIT_IMPERIAL?"oz":"ml"
        }else {
           units= countryCode() === "US" ? "oz" : "ml"
        }
        resolve(units)
      })
    });

}

export function getHeightUnits() {
    // return countryCode() === "US" ? "inch" : "cm"
    return new Promise( (resolve,reject) => {
      AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
        let units=''
        if (_units!=null){
            units = _units==KeyUtils.UNIT_IMPERIAL?"inch":"cm"
        }else {
           units= countryCode() === "US" ? "inch" : "cm"
        }
        resolve(units)
      })
    });
}

export function getHeightMaxvalue() {
  // return countryCode() === "US" ? 48 : 90
  return new Promise( (resolve,reject) => {
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
      let units=''
      if (_units!=null){
        units = _units==KeyUtils.UNIT_IMPERIAL? 48 : 122
      }else {
        units= countryCode() === "US" ? 48 : 122
      }
      resolve(units)
    })
  });
}

export function getWeightMaxvalue() {
  return new Promise( (resolve,reject) => {
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
      let units=''
      if (_units!=null){
        units = _units==KeyUtils.UNIT_IMPERIAL? 45 : 20.5
      }else {
        units= countryCode() === "US" ? 45 : 20.5
      }
      resolve(units)
    })
  });
}

export function getVolumeMaxValue() {
  // return countryCode() === "US" ? 200 : 200
  return new Promise( (resolve,reject) => {
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
      let units=''
      if (_units!=null){
        units = _units==KeyUtils.UNIT_IMPERIAL? 34 : 1006
      }else {
        units= countryCode() === "US" ? 34 : 1006
      }
      resolve(units)
    })
  });
}

export function marketData(marketJson,_locale) {
    let defaultLocale = "en_US"
    let marketObject = null
    if(marketJson) {
        for(let i=0; i < marketJson.length; i++){
            let _market = marketJson[i]
            let availableLocales = _market.availableLocales
            for(let j=0; j < availableLocales.length;j++){
                if(availableLocales[j] === _locale){
                    marketObject = _market
                    break
                }
            }
            if(marketObject){
                break
            }
        }

        if(marketObject===null){
        marketObject=marketJson.find((e)=>{
          return e.market==='INT_B2C'
        })
        if (marketObject===undefined){
          marketObject={
            'market':'INT_B2C'
          }
        }
      }
    }

    return marketObject
}
export function getLocalFromMarket(marketJson,market) {
  let _locale = locale().replace("-", "_")
  let localeCode='en_INT'
  if(marketJson){
    let i=marketJson.find((e)=>{
      return e.market===market
    })
    if(i!==undefined){
      const {availableLocales}=i
      localeCode=availableLocales.find((e)=>{
        return e===_locale
      })
      if (market===KeyUtils.INT_MARKET){
        // if market is INT_B2C  and availableLocales does not match with phone language, then need to return default fallback language (en_INT)
        if(localeCode===undefined && availableLocales.length>0){
          localeCode='en_INT'
        }
      }else{
        if(localeCode===undefined && availableLocales.length>0){
          localeCode=availableLocales[0]
        }
      }
    }
  }
  //if(forFrontEnd!=undefined&&forFrontEnd===true){
    if(locale().includes('ar')){
      localeCode='ar_SA';
    }
  //}
  return localeCode
}

export function hasPumpSupport(marketJson,market) {
  let hasPumpSupport=false
  if(marketJson){
    let i=marketJson.find((e)=>{
      return e.market===market
    })
    if(i!==undefined && i.hasOwnProperty('pumpSupport')){
      hasPumpSupport=i.pumpSupport
    }
  }
  return hasPumpSupport
}

export function getTimeZone(){
  return deviceInfo.getTimezone()
}

export function roundToNearest(nearest,number){
  return number + nearest/2 - (number+nearest/2) % nearest;
}
//oz to ml conversion with 2 decimal places
export const ozToMl = (volumeOz) => {
  // return (parseFloat(volumeOz) * 29.5735296 ).toFixed(2);
  var number = (parseFloat(volumeOz) * 29.5735296 )
  var rounded = roundToNearest(1,number)
  return rounded
}

//inches to cm conversion with 2 decimal places
export const inToCm = (heightInches) => {
  // return (parseFloat(heightInches) * 2.54 ).toFixed(2);
  var number = (parseFloat(heightInches) * 2.54 )
  var rounded = roundToNearest(1,number)
  return rounded
}

//pound to kg conversion with 2 decimal places
export const lbsToKg = (weightPound) => {
  if(parseInt(weightPound)===0){
    return 0
  }
  if(weightPound==45){
    return 20.5
  }
  return (parseFloat(weightPound) * 0.45359237).toFixed(3);
}

//ml to oz conversion with 2 decimal places
export const mlToOz = (volumeMl) => {
  // return Math.round((parseFloat( volumeMl) * 0.0338 ).toFixed(2));
  var number = (parseFloat( volumeMl) * 0.0338 )
  var rounded = roundToNearest(0.25,number)
  if(rounded < 0.25 && rounded != 0){
    return number.toFixed(2)
  }
  return rounded
}

//cm to inches conversion with 2 decimal places
export const cmToIn = (heightCm) => {
  // return Math.round((parseFloat( heightCm) * 0.3937007874 ).toFixed(2));
  var number = (parseFloat( heightCm) * 0.3937007874 )
  var rounded = roundToNearest(0.5,number)
  if(rounded < 0.5 && rounded != 0){
    return number.toFixed(2)
  }
  return rounded
}

//kg to pound conversion with 2 decimal places
export const kgToLbs = (weightKg) => {
  // return Math.round((parseFloat( weightKg) * 2.20462 ).toFixed(3)) ;
  var number = (parseFloat( weightKg) * 2.20462 )
  var rounded = roundToNearest(0.25,number)
  if(rounded < 0.25 && rounded != 0){
    return number.toFixed(2)
  }
  if(weightKg==20.5){
    return 45;
  }
  return rounded
}
//kg to gram conversion with 2 decimal places
export const kgToGram = (weightKg) => {
  return parseFloat((parseFloat(weightKg) * 1000 ).toFixed(3)) ;
}
//kg to gram conversion with 2 decimal places
export const gramToKg = (weightKg) => {
  return parseFloat((parseFloat(weightKg) / 1000 ).toFixed(3)) ;
}
//cm to mm conversion with 2 decimal places
export const cmToMm = (height) => {
  return parseFloat((parseFloat(height) * 10 ).toFixed(2)) ;
}
//mm to cm conversion with 2 decimal places
export const mmToCm = (height) => {
  return parseFloat((parseFloat(height) / 10 ).toFixed(2)) ;
}

export const heightConversionHandler = (isImperial,heightUnit,height) => {
  let convertedHeight=height,convertedHeightUnit=heightUnit
  if (heightUnit===KeyUtils.UNIT_MM){
    convertedHeightUnit=KeyUtils.UNIT_CM
    convertedHeight=mmToCm(height)
  }
  if (isImperial && (convertedHeightUnit===KeyUtils.UNIT_CM || convertedHeightUnit===KeyUtils.UNIT_MM)) {
    convertedHeight = cmToIn(convertedHeight);
    convertedHeightUnit = 'inch';
  } else if (!isImperial && convertedHeightUnit == 'inch') {
    convertedHeight = inToCm(convertedHeight);
    convertedHeightUnit = 'cm';
  }
  return {convertedHeight,convertedHeightUnit}
};

export const weightConversionHandler = (isImperial,weightUnit,weight) => {
  let convertedWeight=weight,convertedWeightUnit=weightUnit
  if (weightUnit===KeyUtils.UNIT_GRAM){
    convertedWeightUnit=KeyUtils.UNIT_KG
    convertedWeight=gramToKg(weight)
  }
  if (isImperial && (convertedWeightUnit===KeyUtils.UNIT_GRAM || convertedWeightUnit===KeyUtils.UNIT_KG)) {
    convertedWeight = kgToLbs(convertedWeight);
    convertedWeightUnit = 'lb';
  } else if (!isImperial && convertedWeightUnit == 'lb') {
    convertedWeight = lbsToKg(weight);
    convertedWeightUnit = 'Kg';
  }
  return {convertedWeight , convertedWeightUnit}
};

export const volumeConversionHandler = (isImperial,amountTotalUnit,amountTotal) => {
  let convertedVolume = amountTotal , convertedVolumeUnit = amountTotalUnit
  if (isImperial && amountTotalUnit == 'ml') {
    convertedVolume = mlToOz(amountTotal);
    convertedVolumeUnit = 'oz';
  } else if (!isImperial && amountTotalUnit == 'oz') {
    convertedVolume = ozToMl(amountTotal);
    convertedVolumeUnit = 'ml';
  }
  return {convertedVolume , convertedVolumeUnit}
};

export const engToArabicNumber=(n)=>{
  //let arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let num=n+'';
  let chars=num.split('');
  for (let index=0;index<chars.length;index++){
      if (/\d/.test(chars[index])) {
          chars[index] = arabicNumbers[chars[index]];
      }
  }
  return chars.join('');
}

export const monthsArab=['كانون الثاني','شهر فبراير','مارس','أبريل','مايو','يونيو','تموز','أغسطس','شهر سبتمبر','اكتوبر','شهر نوفمبر','ديسمبر']
export const monthsEng=['January','February','March','April','May','June','July','August','September','October','November','December']
export const weekdaysEng=['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const weekdaysArab=['ٱلْأَحَد','الاِثْنَيْن','ٱلثُّلَاثَاء','ٱلْأَرْبِعَاء','ٱلْخَمِيس','ٱلْجُمْعَة','ٱلسَّبْت'];
export const arabicNumbers = ['۰', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

export const monthsNameFunc = (locale)=>{
  switch (locale){
    case 'en':
      return  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    case 'da':
      return ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]
    case 'nl':
      return ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]
    case 'fr':
      return ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    case 'de':
      return  ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    case 'it':
      return ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
    case 'nb':
      return ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"]
    case 'no':
      return ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"]
    case 'pt':
      return ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
    case 'ru':
      return ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    case 'es':
      return ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    case 'sv':
      return ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"]
    case 'ar':
      return ['كانون الثاني','شهر فبراير','مارس','أبريل','مايو','يونيو','تموز','أغسطس','شهر سبتمبر','اكتوبر','شهر نوفمبر','ديسمبر']

    default:
      return  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


  }


}
