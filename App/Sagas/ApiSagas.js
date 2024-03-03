import {all, call, put, select, retry} from 'redux-saga/effects'
import {Constants} from '@resources'
import {RemoteConfigSelectors} from '@redux/RemoteConfigRedux'
import AppActions from '@redux/AppRedux'
import UserActions from '@redux/UserRedux'
import NavigationActions from '@redux/NavigationRedux'
import HomeActions from '@redux/HomeRedux'
import {locale} from '@utils/locale';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import I18n from '@i18n';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

export function* loadHomeScreen() {
  yield put(NavigationActions.loadHomeScreenSuccess())
}


function* onError(response, action) {
  const {status} = response
  //yield put(AppActions.signOut())
}

function* callApi(apiRequest, params, headers) {
  const response = yield call(apiRequest, params, headers)
  if (response.status == 500 || response.status == 504) {
    throw response
  }
  return response
}

function* retrySaga(apiRequest, params, headers) {
  try {
    return yield retry(3, 0, callApi, apiRequest, params, headers)
  } catch (response) {
    return response
  }
}

export function* getLogin(api, action) {
  const service = yield call(getHybrisLoginUrl)
  const casUrl = yield call(getCasUrl)
  const callback = Constants.CALLBACK_GRAP_TICKET
  const {username, password } = action;
  const loginToken = yield call(api.getLoginToken, {casUrl, username, password, service, callback});
  if (loginToken.ok) {
    if (loginToken.data.toString().includes('grepTicket')) {
      let ticket = JSON.parse(loginToken.data.replace("grepTicket('", "").replace("')", ""));
      if (ticket.status) {
        const {message} = ticket.status
        yield put(UserActions.getLoginFailure(message));
      }else {
        const token = ticket.ST
        const loginApp = yield call(api.getLoginAPI, {hybrisLoginUrl: service ,'ticket': token});
        if (loginApp.ok) {
          yield put(UserActions.getLoginSuccess(loginApp.data,username));
        } else {
          yield put(UserActions.getLoginFailure("Something Went Wrong.Please try again later"));
        }
      }
    } else {
      yield put(UserActions.getLoginFailure("Something Went Wrong.Please try again later"));
    }
  } else {
    yield put(UserActions.getLoginFailure("Something Went Wrong.Please try again later"));
  }
}

export function* getForgotPassword(api, action) {
  const casUrl = yield call(getCasUrl)
  const callback = Constants.CALLBACK_GRAP_TICKET
  const {email } = action;


  const locales=locale()

  const loginToken = yield call(api.forgotPasswordAPI, {casUrl, email,locale: locales.replace('-','_'), callback});

  if (loginToken.ok) {
    if (loginToken.data.status) {
      const {passwordForgotten,message}=loginToken.data.status
      if (passwordForgotten) {
        yield put(UserActions.getForgotPasswordSuccess(message));
      } else {
        yield put(UserActions.getForgotPasswordFailure(message));
      }
    }else{
      yield put(UserActions.getForgotPasswordFailure("Something Went Wrong.Please try again later"));
    }
  } else {

    yield put(UserActions.getForgotPasswordFailure("Something Went Wrong.Please try again later"));
  }
}
export function* getUserAvailable(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.userAvailable
  // const baseUrl = yield call(getConfigBaseUrl)
  const {email} = action;
  const isUserAvailable = yield call(api.getUserAvailable, {baseUrl, email});
  if (isUserAvailable.ok) {
    yield put(UserActions.getUserAvailableSuccess(isUserAvailable.data));
  } else {
    yield put(UserActions.getUserAvailableFailure(isUserAvailable.data));
  }
}

export function* signUp(api, action) {
  const baseUrl = yield call(getConfigBaseUrl)

  const {email, password, market, firstname,isOptedInForEmail} = action;
  const signUpData = yield call(api.getSignUp, {baseUrl, email, password, market, firstname,isOptedInForEmail});
  if (signUpData.ok) {
    yield put(UserActions.getSignUpSuccess(signUpData.data));
  } else {
    yield put(UserActions.getSignUpFailure(signUpData.data));
  }
}

export function* addProfile(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.profile
  const {profile} = action;
  const profileData = yield call(api.addProfile, {baseUrl, profile});
  if (profileData.ok) {
    const {code,label}=profileData.data

    if(code === '00') {
      yield put(UserActions.getProfileSuccess(profileData.data));
    }else{
      yield put(UserActions.getProfileFailure(label));
    }
  } else {
    yield put(UserActions.getProfileFailure("Something Went Wrong.Please try again later"));
  }

}

export function* getTimeSlices(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.timeSlices
  const res = yield call(retrySaga,api.getTimeSlices, {baseUrl});
  if (res.ok) {
    yield put(HomeActions.getTimeSlicesSuccess(res.data.timeSlices,null));
    /* const myBabiesRes = yield call(retrySaga,api.getMyBabies);
     if(myBabiesRes.ok){
       yield put(HomeActions.getTimeSlicesSuccess(res.data.timeSlices,myBabiesRes.data.babies));
     }else {

     }*/
  } else {
    yield put(HomeActions.getTimeSlicesFailure())
  }
}


export function* getToken(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.generatePacifyValidationToken
  const res = yield call(api.getToken, {baseUrl});
  if (res.ok) {
    AsyncStorage.setItem(KeyUtils.PACIFY_TOKEN,res.data.token)
    yield put(HomeActions.getTokenSuccess(res));
  } else {
    yield put(HomeActions.getTokenFailure('Something went wrong. Please try again later'));
  }
}

export function* getMyBabies(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.babies
  const res = yield call(retrySaga,api.getMyBabies, {baseUrl});
  if (res.ok) {
    yield put(HomeActions.getMyBabiesSuccess(res.data));
  } else {
    yield put(HomeActions.getMyBabiesFailure())
  }
}

export function* deleteTrackingApi(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.deleteTracking
  const {trackingId,babyId} = action;
  const res = yield call(retrySaga,api.deleteTrackingApi, {baseUrl,trackingId,babyId});
  if (res.ok) {
    yield put(HomeActions.deleteTrackingApiSuccess(res.data));
  } else {
    yield put(HomeActions.deleteTrackingApiFailure())
  }
}
export function* deleteMotherTrackingApi(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.deleteMotherTracking
  //const baseUrl = yield call(getConfigBaseUrl)
  const {trackingId} = action;
  const res = yield call(retrySaga,api.deleteMotherTrackingApi, {baseUrl,trackingId});
  if (res.ok) {
    yield put(HomeActions.deleteMotherTrackingApiSuccess(res.data));
  } else {
    yield put(HomeActions.deleteMotherTrackingApiFailure())
  }
}

export function* autoLogin(api, action){

  const service = yield call(getHybrisLoginUrl)
  const casUrl =  yield call(getCasUrl)
  const callback = Constants.CALLBACK_GRAP_TICKET
  const {username, password } = yield call(getUserName);
  const loginToken = yield call(api.getLoginToken, {casUrl, username, password, service, callback});
  if (loginToken.ok) {
    if (loginToken.data.toString().includes('grepTicket')) {
      let ticket = JSON.parse(loginToken.data.replace("grepTicket('", "").replace("')", ""));
      if (ticket.status) {
        const {message} = ticket.status
        yield put(UserActions.getUserProfileFailure());
      }else {
        const token = ticket.ST
        const loginApp = yield call(api.getLoginAPI, {hybrisLoginUrl: service ,'ticket': token});
        if (loginApp.ok) {
          const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
          let baseUrl=interfaceBaseUrl+interfaceUrls.profile
          const res = yield call(api.getMyProfile, {baseUrl});
          if (res.ok) {
            yield put(UserActions.getUserProfileSuccess(res.data,true));
          } else{
            yield put(UserActions.getUserProfileFailure());
          }
        } else {
          yield put(UserActions.getUserProfileFailure());
        }
      }
    } else {
      yield put(UserActions.getUserProfileFailure());
    }
  } else {
    yield put(UserActions.getUserProfileFailure());
  }
}
export function* getUserProfile(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.profile
  const res = yield call(api.getMyProfile, {baseUrl});
  if (res.ok) {
    yield put(UserActions.getUserProfileSuccess(res.data));
  } else {
    yield call(autoLogin,api,action)
  }
}
export function* addBabyName(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.babies
  const {babies} = action;
  const babyData = yield call(api.addBabyName, {baseUrl, babies:babies.babies});
  if (babyData.ok) {
    yield put(UserActions.addBabyNameSuccess(babyData.data));
  } else {
    let obj={code:10}
    if (babyData.data){
      yield put(UserActions.addBabyNameFailure(babyData.data));
    }else {
      yield put(UserActions.addBabyNameFailure(obj));
    }


  }
}
export function* uploadBabyPic(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.babyPicture
  const { babyId, imgFile} = action
  const formData = new FormData();
  formData.append('file', imgFile);
  formData.append('contenttype', 'multipart/form-data');

  const response = yield call( api.uploadBabyPic, { baseUrl, babyId, formData }, {
    'Content-Type': 'multipart/form-data',
  })
  if (response.ok) {
    yield put(UserActions.uploadBabyPicSuccess(response.data,babyId));
  } else {
    yield put(UserActions.uploadBabyPicFailure(response.data));
  }
}

export function* syncBabyWithServer(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.babies
  const {syncBabies} = action;
  const babyData = yield call(api.addBabyName, {baseUrl, babies:syncBabies.babies});

  if (babyData.ok) {
    const {data}=babyData
    if (syncBabies.imagesArr && syncBabies.imagesArr.length>0){
      if (data && data.successIds && data.successIds.length>0){
        const {successIds}=data
        for (let i = 0; i <successIds.length ; i++) {
          let babyId=successIds[i]
          let item=syncBabies.imagesArr.find((e)=>{
            return e.babyId===babyId
          })
          if (item!=undefined){

            const { image} = item

            const formData = new FormData();
            formData.append('file', image);
            formData.append('contenttype', 'multipart/form-data');
            const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
            let baseUrl=interfaceBaseUrl+interfaceUrls.babyPicture
            const response = yield call( api.uploadBabyPic, { baseUrl, babyId, formData }, {
              'Content-Type': 'multipart/form-data',
            })
          }

        }
        yield put(UserActions.syncBabyNameSuccess(babyData.data));
      }
    }else {
      yield put(UserActions.syncBabyNameSuccess(babyData.data));
    }
  } else {
    let obj={code:10}
    if (babyData.data){
      yield put(UserActions.syncBabyNameFailure(babyData.data));
    }else {
      yield put(UserActions.syncBabyNameFailure(obj));
    }


  }
}

export function* trackingApi(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.tracking
  const {trackingData} = action;
  if(trackingData && trackingData.trackings && trackingData.trackings.length>0){
    let sessionOf = trackingData.trackings[0].trackingType
    let obj = {}
    switch (sessionOf){
      case 1:
        obj = {'tracking_type':Constants.SAVE_BREASTFEEDING_TRACKING}
        yield analytics.logEvent(Constants.TRACKINGS, obj);
        break;
      case 2:
        // obj = {'tracking_type':Constants.SAVE_PUMPING_TRACKING}
        // yield analytics.logEvent(Constants.TRACKINGS, obj);
        break;
      case 3:
        obj = {'tracking_type':Constants.SAVE_BOTTLE_TRACKING}
        yield analytics.logEvent(Constants.TRACKINGS, obj);
        break;
      case 4:
        obj = {'tracking_type':Constants.SAVE_DIAPERS_TRACKING}
        yield analytics.logEvent(Constants.TRACKINGS, obj);
        break;
      case 5:
        obj = {'tracking_type':Constants.SAVE_SLEEP_TRACKING}
        yield analytics.logEvent(Constants.TRACKINGS, obj);
        break;
      case 6:
        obj = {'tracking_type':Constants.SAVE_WEIGHT_TRACKING}
        yield analytics.logEvent(Constants.TRACKINGS, obj);
        break;
      case 7:
        obj = {'tracking_type':Constants.SAVE_LENGTH_TRACKING}
        yield analytics.logEvent(Constants.TRACKINGS, obj);
        break;
      case 8:
        obj = {'tracking_type':Constants.SAVE_CONTRACTION_TRACKING}
        yield analytics.logEvent(Constants.TRACKINGS, obj);
        break;
    }
  }
  const tracking = yield call(api.trackingApi, {baseUrl, trackingData});
  if (tracking.ok) {
    yield put(HomeActions.trackingApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.trackingApiFailure());
  }
}

export function* localTrackingDataUploadToServer(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.tracking
  const {trackingData,trackingId} = action;
  const tracking = yield call(api.trackingApi, {baseUrl, trackingData});

  if (tracking.ok) {
    yield put(HomeActions.localTrackingApiSuccess(tracking.data,trackingId));
  } else {
    yield put(HomeActions.localTrackingApiFailure());
  }

}

export function* getTrackingData(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.tracking
  const {startDate,endDate,babyId,page,perPage} = action;
  const tracking = yield call(api.getTrackingData, {baseUrl, startDate,endDate,babyId,page,perPage});
  //console.log('trackingData--',JSON.stringify(tracking.data))
  if (tracking.ok) {
    yield put(HomeActions.getTrackingApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.getTrackingApiFailure());
  }
}

export function* getWhoTrackingData(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.tracking
  const {startDate,endDate,babyId,page,perPage,trackingType} = action;
  const tracking = yield call(api.getTrackingData, {baseUrl, startDate,endDate,babyId,page,perPage,trackingType});
  if (tracking.ok) {
    yield put(HomeActions.getWhoTrackingApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.getWhoTrackingApiFailure());
  }
}

export function* createBottleApi(api, action) {
  const baseUrl = yield call(getConfigBaseUrl)
  const {createBottleData} = action;
  const createBottle = yield call(api.createBottleApi, {baseUrl, createBottleData});
  if (createBottle.ok) {
    yield put(HomeActions.createBottleApiSuccess(createBottleData,createBottle.data));
  } else {
    yield put(HomeActions.createBottleApiFailure());
  }
}

export function* getFreezerInventoryApi(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.virtualFreezer
  const {startDate,endDate,page,perPage} = action;
  const tracking = yield call(api.getFreezerInventoryApi, {baseUrl,page,perPage,startDate,endDate});
  if (tracking.ok) {
    yield put(HomeActions.getFreezerInventoryApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.getFreezerInventoryApiFailure());
  }
}

export function* deleteFreezerInventoryApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const { id }= action

  const baseUrl=interfaceBaseUrl+interfaceUrls.virtualFreezer+id
  const res = yield call(api.deleteFreezerInventoryApi, {baseUrl});
  //console.log('delete inventoory saga response',JSON.stringify(res))
  if (res.ok) {
    yield put(HomeActions.deleteFreezerInventoryApiSuccess(res.data));
  } else {
    yield put(HomeActions.deleteFreezerInventoryApiFailure());
  }
}

export function* getMotherTrackingData(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.motherTracking
  //const baseUrl = yield call(getConfigBaseUrl)
  const {startDate,endDate,page,perPage} = action;
  const tracking = yield call(api.getMotherTrackingData, {baseUrl, startDate,endDate,page,perPage});
  // console.log('getMotherTrackingData--',JSON.stringify(tracking.data))
  if (tracking.ok) {
    yield put(HomeActions.getMotherTrackingApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.getMotherTrackingApiFailure());
  }
}

export function* exportTrackingApi(api, action) {
  const {interfaceBaseUrl,interfaceUrls} = yield call(getConfigUrls)
  let baseUrl=interfaceBaseUrl+interfaceUrls.customerTrackingStats
  const {trackingData} = action;
  const tracking = yield call(api.exportTrackingApi, {baseUrl, trackingData});
  if (tracking.ok) {
    yield put(HomeActions.exportTrackingApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.exportTrackingApiFailure());
  }
}

export function* getBreastfeedingConfidenceApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.bca
  const {locale} = action;
  const tracking = yield call(api.getBreastfeedingConfidenceApi, {baseUrl, locale});
  if (tracking.ok) {
    yield put(HomeActions.getBreastfeedingConfidenceApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.getBreastfeedingConfidenceApiFailure());
  }
}

export function* breastfeedingConfidenceApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.bcaAnswer
  const {trackingData, locale} = action;
  const tracking = yield call(api.breastfeedingConfidenceApi, {baseUrl, locale, trackingData});
  if (tracking.ok) {
    yield put(HomeActions.breastfeedingConfidenceApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.breastfeedingConfidenceApiFailure());
  }
}

export function* bcaQuestionnaires(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.bcaSuccess
  const { locale, questionId } = action;
  const res = yield call(api.bcaQuestionnaires, {baseUrl, locale, questionId});
  if (res.ok) {
    yield put(HomeActions.bcaQuestionnairesSuccess(res.data));
  } else {
    yield put(HomeActions.bcaQuestionnairesFailure());
  }
}

export function* getContentPersonalizationApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.contentPersonalization
  const {locale} = action;
  const tracking = yield call(api.getContentPersonalizationApi, {baseUrl, locale});
  if (tracking.ok) {
    yield put(HomeActions.getContentPersonalizationApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.getContentPersonalizationApiFailure());
  }
}

export function* contentPersonalizationApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.contentPersonalizationAnswer
  const {trackingData, locale} = action;
  const tracking = yield call(api.contentPersonalizationApi, {baseUrl, locale, trackingData});
  if (tracking.ok) {
    yield put(HomeActions.contentPersonalizationApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.contentPersonalizationApiFailure());
  }
}

export function* deleteBaby(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.babies
  const{babyId}= action
  const res = yield call(api.deleteBaby, {baseUrl, babyId});
  if (res.ok) {
    yield put(UserActions.deleteBabySuccess(res.data));
  } else {
    yield put(UserActions.deleteBabyFailure());
  }
}
export function* deleteBabyImage(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.babyPicture
  const{babyId}= action
  const res = yield call(api.deleteBabyImage, {baseUrl, babyId});
  if (res.ok) {
    yield put(UserActions.deleteBabyImageSuccess(res.data));
  } else {
    yield put(UserActions.deleteBabyImageFailure());
  }
}

export function* getBabyImage(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.babyPicture
  const{babyId}= action
  const res = yield call(api.getBabyImage, {baseUrl, babyId});
  if (res.ok) {
    yield put(HomeActions.getBabyImageSuccess(res.data));
  } else {
    yield put(HomeActions.getBabyImageFailure());
  }
}
export function* switchBabyClientId(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.currentBaby
  const{babyClientId}= action
  const res = yield call(api.switchBabyClientId, {baseUrl, babyClientId});
  if (res.ok) {
    yield put(UserActions.switchBabySuccess(res.data,babyClientId));
  } else {
    yield put(UserActions.switchBabyFailure());
  }
}


export function* signOut(api, action) {
  const baseUrl = yield call(getHybrisLogoutUrl)
  const res = yield call(api.signOut, {baseUrl});
  if (res.ok) {
    yield put(AppActions.signOutSuccess(res.data));
  } else {
    yield put(AppActions.signOutFailure());
  }
}

export function* addFeedback(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.feedback
  const { feedback } = action;

  const res = yield call(api.sendFeedback, {feedback: feedback, baseUrl });
  if (res.ok) {
    yield put(HomeActions.getFeedbackSuccess(res.data));
  } else {
    yield put(HomeActions.getFeedbackFailure(res.data));
  }
}

export function* getPumpList(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.pumps

  const res = yield call(api.getPumpList, {baseUrl});
  if (res.ok) {
    yield put(HomeActions.getPumpListSuccess(res.data));
  } else {
    yield put(HomeActions.getPumpListFailure(I18n.t('pump_list_setting.pump_something_wrong')));
  }
}

export function* addPump(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.pumps
  const { pumpData } = action;
  const res = yield call(api.addPump, {baseUrl, pumpData });
  if (res.ok) {
    const pumpRes = yield call(api.getPumpList, {baseUrl});
    if (pumpRes.ok) {
      yield put(HomeActions.getPumpListSuccess(pumpRes.data));
    } else {
      yield put(HomeActions.getPumpListFailure(I18n.t('pump_list_setting.pump_something_wrong')));
    }
    yield put(HomeActions.addPumpSuccess(I18n.t('pump_list_setting.pump_addition_success_message')));
  } else {
    yield put(HomeActions.addPumpFailure(I18n.t('pump_list_setting.pump_addition_error_message')));
  }
}

export function* deletePump(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.pump
  const { pumpId }= action
  const res = yield call(api.deletePump, {baseUrl, pumpId});
  if (res.ok) {
    if(res.data && res.data.successIds && res.data.successIds.length > 0) {
    /*  const pumpRes = yield call(api.getPumpList, {baseUrl});
      if (pumpRes.ok) {
        yield put(HomeActions.getPumpListSuccess(pumpRes.data));
      } else {
        yield put(HomeActions.getPumpListFailure(I18n.t('pump_list_setting.pump_something_wrong')));
      }*/
      yield put(HomeActions.deletePumpSuccess(pumpId,I18n.t('pump_list_setting.pump_deletion_success_message')));
    } else{
      yield put(HomeActions.deletePumpFailure(I18n.t('pump_list_setting.pump_deletion_error_message')));
    }
  } else {
    yield put(HomeActions.deletePumpFailure(I18n.t('pump_list_setting.pump_deletion_error_message')));
  }
}

function* getConfigBaseUrl(){
  const [
    remoteConfigs
  ] = yield all([
    select(RemoteConfigSelectors.remoteConfigs)
  ])
  const baseUrl = remoteConfigs && remoteConfigs.interfaceBaseUrl
  return baseUrl//+'v2/'
}
function* getConfigUrls(){
  const [
    remoteConfigs
  ] = yield all([
    select(RemoteConfigSelectors.remoteConfigs)
  ])
  const interfaceUrls = remoteConfigs && remoteConfigs.interfaceUrls
  const interfaceBaseUrl = remoteConfigs && remoteConfigs.interfaceBaseUrl
  return  {interfaceUrls,interfaceBaseUrl}
}
function* getUserName(){
  //const username=await AsyncStorage.getItem(KeyUtils.USER_LAST_EMAIL);
  //const password=await AsyncStorage.getItem(KeyUtils.USER_LAST_PASSWORD);
  // console.log('username password inside getUserName',username,password)
  const [username,password]=yield all([
    AsyncStorage.getItem(KeyUtils.USER_LAST_EMAIL),
    AsyncStorage.getItem(KeyUtils.USER_LAST_PASSWORD)
  ])
  // const [username,password]= yield all([
  //   select(AppSelectors.username),
  //   select(AppSelectors.password)
  // ])

  return {username,password}
}
function* getHybrisLoginUrl(){
  const [
    remoteConfigs
  ] = yield all([
    select(RemoteConfigSelectors.remoteConfigs)
  ])
  const hybrisLoginUrl = remoteConfigs && remoteConfigs.hybrisLoginUrl
  return hybrisLoginUrl
}

function* getCasUrl(){
  const [
    remoteConfigs
  ] = yield all([
    select(RemoteConfigSelectors.remoteConfigs)
  ])
  const casUrl = remoteConfigs && remoteConfigs.casUrl
  return casUrl
}

function* getHybrisLogoutUrl(){
  const [
    remoteConfigs
  ] = yield all([
    select(RemoteConfigSelectors.remoteConfigs)
  ])
  const hybrisLogoutUrl = remoteConfigs && remoteConfigs.hybrisLogoutUrl
  return hybrisLogoutUrl
}

export function* getArticles(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.article
  const{ locale, articleId, page, perPage }= action;
  const res = yield call(api.getArticles, {baseUrl, locale, articleId, page, perPage});
  if (res.ok) {
    yield put(HomeActions.getArticlesSuccess(res.data));
  } else {
    yield put(HomeActions.getArticlesFailure());
  }
}

export function* getArticleDetail(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.article
  const{ locale, articleId }= action;
  const res = yield call(api.getArticleDetail, {baseUrl, locale, articleId});
  if (res.ok) {
    yield put(HomeActions.getArticleDetailSuccess(res.data));
  } else {
    yield put(HomeActions.getArticleDetailFailure());
  }
}

export function* markFavoriteArticle(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.article
  const{ locale, articleId }= action;
  const res = yield call(api.markFavoriteArticle, {baseUrl, locale, articleId});
  if (res.ok) {
    yield put(HomeActions.markFavoriteArticleSuccess(res.data));
  } else {
    yield put(HomeActions.markFavoriteArticleFailure());
  }
}


export function* getFavouriteArticles(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.favouriteArticles
  const{ locale, page, perPage }= action;
  const res = yield call(api.getFavouriteArticles, {baseUrl, locale, page, perPage});
  if (res.ok) {
    yield put(HomeActions.favoriteArticlesSuccess(res.data));
  } else {
    yield put(HomeActions.favoriteArticlesFailure());
  }
}

export function* problemSolver(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.problemSolverFull
  const{ locale, page, perPage }= action;
  const res = yield call(api.problemSolver, {baseUrl, locale, page, perPage});
  if (res.ok) {
    yield put(HomeActions.problemSolverSuccess(res.data));
  } else {
    yield put(HomeActions.problemSolverFailure());
  }
}

export function* badSessionArticles(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.problemSolverBadSession
  const{ locale, page, perPage }= action;
  const res = yield call(api.badSessionArticles, {baseUrl, locale, page, perPage});
  if (res.ok) {
    yield put(HomeActions.badSessionArticlesSuccess(res.data));
  } else {
    yield put(HomeActions.badSessionArticlesFailure());
  }
}

export function* motherTrackingApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.motherTracking
  //const baseUrl = yield call(getConfigBaseUrl)
  const {trackingData} = action;
  const tracking = yield call(api.motherTrackingApi, {baseUrl, trackingData});
  if (tracking.ok) {
    yield put(HomeActions.motherTrackingApiSuccess(tracking.data));
  } else {
    yield put(HomeActions.motherTrackingApiFailure());
  }
}

export function* optedApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.optIn
  //const baseUrl = yield call(getConfigBaseUrl)

  const {data} = action;
  const res = yield call(api.optedApi, {baseUrl, data});
  if (res.ok) {
    yield put(UserActions.optedApiSuccess(res.data));
  } else {
    yield put(UserActions.optedApiFailure(res.data));
  }
}

export function* getOptedApi(api) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.optIn
  const res = yield call(api.getOptedApi, {baseUrl});
  if (res.ok) {
    yield put(UserActions.getOptedApiSuccess(res.data));
  } else {
    yield put(UserActions.getOptedApiFailure(res.data));
  }
}

export function* pumpQuestion(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.pumpQuestion
  // const baseUrl = yield call(getConfigBaseUrl)
  const {data} = action;
  const res = yield call(api.pumpQuestion, {baseUrl, data});
  if (res.ok) {
    yield put(UserActions.pumpQuestionSuccess(res.data));
  } else {
    yield put(UserActions.pumpQuestionFailure(res.data));
  }
}

export function* getPromoBannerApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.banners
  const{ locale } = action;
  const res = yield call(api.getPromoBannerApi, {baseUrl, locale});
  if (res.ok) {
    yield put(HomeActions.getPromoBannerApiSuccess(res.data));
  } else {
    yield put(HomeActions.getPromoBannerApiFailure());
  }
}

export function* validateAddressApi(api, action) {
  const baseUrl=Constants.VALIDATE_ADDRESS_URL
  const {data} = action;
  const res = yield call(api.validateAddressApi, {baseUrl, data});
  if (res.ok) {
    yield put(UserActions.validateAddressApiSuccess(res.data));
  } else {
    yield put(UserActions.validateAddressApiFailure(res.data));
  }
}

export function* changePassword(api, action) {
  const casUrl = yield call(getCasUrl)
  //const baseUrl='https://qs-sso.medela.com/cas/v1/reset'
  const{ email, oldPwd, newPwd }= action;
  const res = yield call(api.changePassword, {casUrl, email, oldPwd, newPwd});
  if (res.ok) {
    yield put(HomeActions.changePasswordSuccess(res.data));
  } else {
    yield put(HomeActions.changePasswordFailure());
  }
}

export function* vipPackApi(api, action) {
  const {interfaceUrls,interfaceBaseUrl}=yield call(getConfigUrls)
  const baseUrl=interfaceBaseUrl+interfaceUrls.vip
  const{ data } = action;
  const res = yield call(api.vipPackApi, {baseUrl, data});
  if (res.ok) {
    yield put(HomeActions.vipPackApiSuccess(res.data));
  } else {
    yield put(HomeActions.vipPackApiFailure());
  }
}
