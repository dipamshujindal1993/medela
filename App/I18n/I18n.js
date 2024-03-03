// @flow

import { I18nManager, Platform } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n'
import KeyUtils from '../Utils/KeyUtils';
import RNUserDefaults from 'rn-user-defaults';
import { getLocalFromMarket, locale } from '../Utils/locale';
import RNRestart from 'react-native-restart';
// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true

//Rtl languages
//Needs to put these languages inside ios/Projectname/appdelegate.m for ios and android/app/src/main/res/values/languages.xml for android
export const rtl_langs=['ar']
export const allAppSupportedLanguages=['en','ar','fr','it','de','pt','es','nl','sv','no','da','ru','nb', 'pl']

export const setLocale = async(locale,called) => {
  console.log(locale + called + 'set locale');
  I18n.locale=locale;
  if(Platform.OS=='android'){
     await I18nManager.allowRTL(rtl_langs.includes(locale));
  }
};
export const setI18nConfig=async ()=>{
  let deviceResult = await RNUserDefaults.get(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP);
  let result= await RNUserDefaults.get(KeyUtils.SELECTED_LANGUAGE_LOCALE);
  let languages = await getLanguages();
  let userLocale=await  RNUserDefaults.get(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN);
  if(result!=null&&result!=undefined&&result!=''&&deviceResult!=null&&deviceResult!=undefined&&deviceResult!=''){
    //getLanguages().then((languages)=>{
      console.log(result,deviceResult,languages[0],'setI18n')
      if(deviceResult!=languages[0].substr(0,2)){
        getLanguage(languages[0].substr(0,2))
        setLocale(languages[0].substr(0,2));
        setTimeout(() => {
          RNUserDefaults.clear(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP)
          RNUserDefaults.clear(KeyUtils.SELECTED_LANGUAGE_LOCALE)
        }, 10000);
      }else{
        getLanguage(result)
        setLocale(result)
      }
    }else{
     let userLocale=await  RNUserDefaults.get(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN);
     if(userLocale!=undefined&&userLocale!=null&&userLocale!=''&&deviceResult!=null&&deviceResult!=undefined&&deviceResult!=''){
       if(deviceResult!=languages[0].substr(0,2)){
          getLanguage(languages[0].substr(0,2))
          setLocale(languages[0].substr(0,2));
          setTimeout(() => {
            RNUserDefaults.clear(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP)
            RNUserDefaults.clear(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN)
          }, 10000);
       }else{
        if(!I18n.locale.includes(userLocale.substr(0,2))){
          getLanguage(userLocale.substr(0,2))
          setLocale(userLocale.substr(0,2))
        }
       }
      }
    }
  return true;
  // RNUserDefaults.get(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP).then((deviceResult)=>{
  //   RNUserDefaults.get(KeyUtils.SELECTED_LANGUAGE_LOCALE).then((result)=>{
  //     if(result!=null&&result!=undefined&&result!=''&&deviceResult!=null&&deviceResult!=undefined&&deviceResult!=''){
  //       getLanguages().then((languages)=>{
  //         console.log(result,deviceResult,languages[0],'setI18n')
  //         if(deviceResult!=languages[0].substr(0,2)){
  //           setTimeout(() => {
  //             console.log('clear called');
  //             RNUserDefaults.clear(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP)
  //             RNUserDefaults.clear(KeyUtils.SELECTED_LANGUAGE_LOCALE)
  //           }, 20000);
  //         }else{
  //           getLanguage(result)
  //           setLocale(result+'-'+I18n.locale.substr(3,5))
  //         }
  //         return true;
  //       })
  //     }
  //     return true;
  //   })
  // })
}
export const clearPrevLocaleConfigAtRegistration=async()=>{
  await RNUserDefaults.clear(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP);
  await RNUserDefaults.clear(KeyUtils.SELECTED_LANGUAGE_LOCALE);
  //await RNUserDefaults.clear(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN);
  return true;
}
export const setI18nConfigBasedOnUserLocale=async (user,remoteConfig,callBack)=>{
  let userLocale= getLocalFromMarket(remoteConfig && remoteConfig, user.market);
  let deviceResult=await RNUserDefaults.get(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP);
  let result=await RNUserDefaults.get(KeyUtils.SELECTED_LANGUAGE_LOCALE);
  let languages = await getLanguages();
  // RNUserDefaults.get(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP).then((deviceResult)=>{
  //   RNUserDefaults.get(KeyUtils.SELECTED_LANGUAGE_LOCALE).then((result)=>{
      //new registred user 
      //&&(deviceResult==null||deviceResult==undefined||deviceResult=='')
      if((result==null||result==undefined||result=='')){
        if(!I18n.locale.includes(userLocale.substr(0,2))){
          if(allAppSupportedLanguages.includes(userLocale.substr(0,2))){
            if(rtl_langs.includes(userLocale.substr(0,2))){
              if(I18nManager.isRTL){
                RNUserDefaults.set(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN,userLocale);
                RNUserDefaults.set(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP,languages[0].substr(0,2))
                getLanguage(userLocale.substr(0,2));
                setLocale(userLocale.substr(0,2));
              }else{
                RNUserDefaults.set(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN,userLocale);
                RNUserDefaults.set(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP,languages[0].substr(0,2))
                getLanguage(userLocale.substr(0,2));
                setLocale(userLocale.substr(0,2));
                I18nManager.forceRTL(true);
                callBack()
                setTimeout(() => {
                  RNRestart.Restart();
                }, 100);
                return false;
              }
            }else{
              if(I18nManager.isRTL){
                RNUserDefaults.set(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN,userLocale);
                RNUserDefaults.set(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP,languages[0].substr(0,2))
                getLanguage(userLocale.substr(0,2));
                setLocale(userLocale.substr(0,2));
                I18nManager.forceRTL(false);
                callBack()
                setTimeout(() => {
                  RNRestart.Restart();
                }, 100);
                return false;
              }else{
                RNUserDefaults.set(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN,userLocale);
                RNUserDefaults.set(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP,languages[0].substr(0,2))
                getLanguage(userLocale.substr(0,2));
                setLocale(userLocale.substr(0,2));
              }
            }
          }
        }
      } 
      return true;
      //else part we dont need to handle because if user is registering again and also changed the app langugae so we are setting app locale in setI18nConfig 
  //   })
  // })
}
// English language is the main language for fall back:
I18n.translations = {
  ar: require('./languages/arabic.json'),
  en: require('./languages/english.json'),
  sv: require('./languages/swedish.json'),
  da: require('./languages/danish.json'),
  de: require('./languages/german.json'),
  es: require('./languages/spanish.json'),
  fr: require('./languages/french.json'),
  it: require('./languages/italian.json'),
  nl: require('./languages/dutch.json'),
  nb: require('./languages/norwegian.json'),
  pt: require('./languages/portuguese.json'),
  ru: require('./languages/russian.json'),
  no: require('./languages/norwegian.json'),
  pl: require('./languages/polish.json'),
}

// let languageCode = I18n.locale.substr(0, 2)

// All other translations for the app goes to the respective language file:
export const getLanguage = (languageCodee) => {
  switch (languageCodee) {
    case 'ar':
      I18n.translations.ar = require('./languages/arabic.json')
      break
    case 'da':
      I18n.translations.da = require('./languages/danish.json')
      break
    case 'de':
      I18n.translations.de = require('./languages/german.json')
      break
    case 'en':
      I18n.translations.es = require('./languages/english.json')
      break
    case 'es':
      I18n.translations.es = require('./languages/spanish.json')
      break
    case 'fr':
      I18n.translations.fr = require('./languages/french.json')
      break
    case 'it':
      I18n.translations.it = require('./languages/italian.json')
      break
    case 'nl':
      I18n.translations.nl = require('./languages/dutch.json')
      break
    case 'nb':
      I18n.translations.nb = require('./languages/norwegian.json')
      break
    case 'pt':
      I18n.translations.pt = require('./languages/portuguese.json')
      break
    case 'ru':
      I18n.translations.ru = require('./languages/russian.json')
      break
    case 'sv':
      I18n.translations.sv = require('./languages/swedish.json')
      break
    case 'no':
      I18n.translations.no = require('./languages/norwegian.json')
      break
    case 'pl':
      I18n.translations.pl = require('./languages/polish.json')
      break
  }
}

