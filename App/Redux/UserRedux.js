import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import {countryCode, languageCode} from '@utils/locale';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getLogin: ['username', 'password'],
  getLoginSuccess: ['message','username'],
  getLoginFailure: ['message'],
  getForgotPassword: ['email'],
  getForgotPasswordSuccess: ['message'],
  getForgotPasswordFailure: ['message'],
  getUserAvailable: ['email'],
  getUserAvailableSuccess: ['response'],
  getUserAvailableFailure: ['errorResponse'],
  signUp: ['email','password','market','firstname','isOptedInForEmail'],
  getSignUpSuccess: ['response'],
  getSignUpFailure: ['errorResponse'],
  addProfile: ['profile'],
  getProfileSuccess: ['response'],
  getProfileFailure: ['errorResponse'],
  addBabyName: ['babies'],
  addBabyNameSuccess: ['response'],
  addBabyNameFailure: ['errorResponse'],
  uploadBabyPic: ['babyId', 'imgFile'],
  uploadBabyPicSuccess: ['response','babyId'],
  uploadBabyPicFailure: ['errorResponse'],
  syncBabyName: ['syncBabies','imagesArr'],
  syncBabyNameSuccess: ['response'],
  syncBabyNameFailure: ['errorResponse'],
  getUserProfile: null,
  getUserProfileSuccess: ['userProfile','autoLogin'],
  getUserProfileFailure: null,
  deleteBaby: ['babyId'],
  deleteBabySuccess: ['response'],
  deleteBabyFailure: ['errorResponse'],
  deleteBabyImage: ['babyId'],
  deleteBabyImageSuccess: ['response'],
  deleteBabyImageFailure: ['errorResponse'],
  switchBaby:['babyClientId'],
  switchBabySuccess: ['sBabyResponse','babyClientId'],
  switchBabyFailure: ['errorResponse'],

  optedApi:['data'],
  optedApiSuccess: ['response'],
  optedApiFailure: ['errorResponse'],

  getOptedApi:['data'],
  getOptedApiSuccess: ['res'],
  getOptedApiFailure: ['errorResponse'],

  pumpQuestion:['data'],
  pumpQuestionSuccess: ['response'],
  pumpQuestionFailure: ['errorResponse'],

  validateAddressApi:['data'],
  validateAddressApiSuccess: ['response'],
  validateAddressApiFailure: ['errorResponse'],
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({})

/* ------------- Selectors ------------- */

export const UserSelectors = {}

/* ------------- Reducers ------------- */

export const getLogin = (state) =>
  state.merge({isLogin: false, isLoginError: false});

export const getLoginSuccess = (state, action) => {
  const {username,message}=action
  return state.merge({isLogin: true, isLoginError: false,username, message,countryCode:countryCode(),languageCode:languageCode()});
};

export const getLoginFailure = (state,action) =>
  state.merge({isLogin: false, isLoginError: true, message:action.message});

export const getForgotPassword = (state) =>
  state.merge({isForgotPasswordSuccess: false, isForgotPasswordError: false});

export const getForgotPasswordSuccess = (state, action) => {
  return state.merge({isForgotPasswordSuccess: true, isForgotPasswordError: false,message:action.message});
};

export const getForgotPasswordFailure = (state,action) =>{
  return state.merge({isForgotPasswordSuccess: false, isForgotPasswordError: true,message:action.message});
}
export const getUserAvailable = (state) =>
  state.merge({isUserAvailable: false, isUserAvailableError: false});

export const getUserAvailableSuccess = (state, action) => {
  return state.merge({isUserAvailable: true, isUserAvailableError: false});
};

export const getUserAvailableFailure = (state, action) => {
  const {errorResponse}=action
  if(errorResponse && errorResponse.code && errorResponse.code==="10"){
    return state.merge({isUserAvailable: false, isUserAvailableError: true, message:errorResponse.label, errorMessages:errorResponse.errorMessages});
  }else{
    return state.merge({isUserAvailable: false, isUserAvailableError: true, message:'something'});
  }
}

export const signUp = (state) =>
  state.merge({isSignUp: false, isSignUpError: false});

export const getSignUpSuccess = (state, action) => {
  return state.merge({isSignUp: true, isSignUpError: false,countryCode:countryCode(),languageCode:languageCode()});
};

export const getSignUpFailure = (state, action) => {
  const {errorResponse}=action
  if(errorResponse.code==="10"){
    return state.merge({isSignUp: false, isSignUpError: true, message:errorResponse.label});
  }else{
    return state.merge({isSignUp: false, isSignUpError: true, message:'something'});
  }
}

export const addProfile = (state) =>
  state.merge({isProfile: false, isProfileError: false});

export const getProfileSuccess = (state, action) => {
  return state.merge({isProfile: true, isProfileError: false});
};

export const getProfileFailure = (state, action) => {
  const {errorResponse}=action
  return state.merge({isProfile: false, isProfileError: true, message:errorResponse});

}
export const syncBabyName = (state) => {
  return state.merge({syncBabySuccess: false, syncBabyFailure: false});
}

export const syncBabyNameSuccess = (state, action) => {
  const {response}=action
  console.log('sncBabby---',response)
  const {successIds}=response
  if (successIds && successIds.length>0 ){
    return state.merge({syncBabySuccess: true, syncBabyFailure: false});
  }else{
    return state.merge({syncBabySuccess: false, syncBabyFailure: true});
  }

};

export const syncBabyNameFailure = (state, action) => {
  const {errorResponse}=action

  if(errorResponse.code=="10"){
    return state.merge({syncBabySuccess: false, syncBabyFailure: true, message:errorResponse.label});
  }else{
    return state.merge({syncBabySuccess: false, syncBabyFailure: true, message:'something'});
  }
}

export const uploadBabyPic = (state) =>{
  return state.merge({isPicUploaded: false, isPicUploadedError: false});
}

export const uploadBabyPicSuccess = (state, action) => {
  const {babyId}=action
  return state.merge({picUploadedBabyId:babyId,isPicUploaded: true, isPicUploadedError: false});
};

export const uploadBabyPicFailure = (state, action) => {
  const {errorResponse}=action
  if(errorResponse && errorResponse.code &&  errorResponse.code=="10"){
    return state.merge({isPicUploaded: false, isPicUploadedError: true, message:errorResponse.label});
  }else{
    return state.merge({isPicUploaded: false, isPicUploadedError: true, message:'something'});
  }
}

export const addBabyName = (state) => {
  return state.merge({isBabyNameAdd: false, isBabyNameAddError: false});
}

export const addBabyNameSuccess = (state, action) => {
  const {response}=action

  const {successIds}=response
  if (successIds && successIds.length>0 ){
    return state.merge({babyId:successIds[0],isBabyNameAdd: true, isBabyNameAddError: false});
  }else{
    return state.merge({isBabyNameAdd: false, isBabyNameAddError: true});
  }

};

export const addBabyNameFailure = (state, action) => {
  const {errorResponse}=action

  if(errorResponse.code=="10"){
    return state.merge({isBabyNameAdd: false, isBabyNameAddError: true, message:errorResponse.label});
  }else{
    return state.merge({isBabyNameAdd: false, isBabyNameAddError: true, message:'something'});
  }
}

export const getUserProfile = (state) =>
  state.merge({userProfileSuccess: false, userProfileFailure: false,autoLogin:false});

export const getUserProfileSuccess = (state, action) => {
  const {userProfile,autoLogin}=action
  return state.merge({userProfile,userProfileSuccess: true, userProfileFailure: false,autoLogin});
};

export const getUserProfileFailure = (state) =>
  state.merge({userProfileSuccess: false, userProfileFailure: true,autoLogin:false});


export const deleteBaby = (state) => {
  return state.merge({deleteBabySuccess: false, deleteBabyFailure: false});
}

export const deleteBabySuccess = (state, action) => {
  const {response} = action;
  if (response && response.code=="00") {
    const {successIds}=response
    if (successIds.length>0){
      return state.merge({deleteBabyResponse: response,deletedBabyId:successIds[0], deleteBabySuccess: true, deleteBabyFailure: false});
    }else {
      return state.merge({response:[], deleteBabySuccess: false, deleteBabyFailure: true});
    }
  } else {
    return state.merge({response:[], deleteBabySuccess: false, deleteBabyFailure: true});
  }
};

export const deleteBabyFailure = (state) => {
  const {errorResponse} = state
  return state.merge({deleteBabySuccess: false, deleteBabyFailure: true});
}

export const deleteBabyImage = (state) => {
  return state.merge({deleteBabyImageSuccess: false, deleteBabyImageFailure: false});
}

export const deleteBabyImageSuccess = (state, action) => {
  const {response} = action;
  console.log(response)
  if (response && response.code=="00") {
    const {successIds}=response
    if (successIds.length>0){
      return state.merge({deletedBabyImageId:successIds[0], deleteBabyImageSuccess: true, deleteBabyImageFailure: false});
    }else {
      return state.merge({deletedBabyImageId:'', deleteBabyImageSuccess: true, deleteBabyImageFailure: false});
    }
  } else {
    return state.merge({deletedBabyImageId:'',  deleteBabyImageSuccess: false, deleteBabyImageFailure: true});
  }
};

export const deleteBabyImageFailure = (state) => {
  const {errorResponse} = state
  return state.merge({deleteBabyImageSuccess: false, deleteBabyImageFailure: true});
}

export const switchBaby = (state) => {
  return state.merge({switchBabySuccess: false, switchBabyFailure: false});
}

export const switchBabySuccess = (state, action) => {
  const {sBabyResponse,babyClientId} = action;
  if (sBabyResponse) {
    const { userProfile } = state;
    let userProfilePrev=JSON.parse(JSON.stringify(userProfile))
    userProfilePrev.mother.currentBabyClientId=babyClientId
    return state.merge({selectedBabyClientId:babyClientId, userProfile:userProfilePrev, switchBabySuccess: true, switchBabyFailure: false});
  } else {
    return state.merge({selectedBabyClientId:'', switchBabySuccess: false, switchBabyFailure: true});
  }
};

export const switchBabyFailure = (state) => {
  const {errorResponse} = state
  return state.merge({switchBabySuccess: false, switchBabyFailure: true});
}

export const optedApi = (state) => {
  return state.merge({isOptedApiSuccess: false, isOptedApiFailure: false});
}

export const optedApiSuccess = (state, action) => {
  const {response} = action;
  return state.merge({isOptedApiSuccess: true, isOptedApiFailure: false});
};

export const optedApiFailure = (state,action) => {
  const{errorResponse}=action
  if (errorResponse && errorResponse.errorMessages && errorResponse.errorMessages.length>0){
    return state.merge({isOptedApiSuccess: false, isOptedApiFailure: true,optedErrorMessage:errorResponse.errorMessages});
  }else {
    return state.merge({isOptedApiSuccess: false, isOptedApiFailure: true,optedErrorMessage:''});
  }

}

export const getOptedApi = (state) => {
  return state.merge({isGetOptedApiSuccess: false, isGetOptedApiFailure: false});
}

export const getOptedApiSuccess = (state, action) => {
  const {res} = action;
  return state.merge({getOptedResponse:res,isGetOptedApiSuccess: true, isGetOptedApiFailure: false});
};

export const getOptedApiFailure = (state) => {
  console.log('getOptedResponse failure = ')

  return state.merge({isGetOptedApiSuccess: false, isGetOptedApiFailure: true});
}

export const pumpQuestion = (state) => {
  return state.merge({isPumpQuestionSuccess: false, isPumpQuestionFailure: false});
}

export const pumpQuestionSuccess = (state, action) => {
  const {response} = action;
  if (response) {
    return state.merge({isPumpQuestionSuccess: true, isPumpQuestionFailure: false});
  } else {
    return state.merge({isPumpQuestionSuccess: false, isPumpQuestionFailure: true});
  }
};

export const pumpQuestionFailure = (state) => {
  return state.merge({isPumpQuestionSuccess: false, isPumpQuestionFailure: true});
}

export const validateAddressApi = (state) => {
  return state.merge({isValidateAddressApiSuccess: false, isValidateAddressApiFailure: false});
}

export const validateAddressApiSuccess = (state, action) => {
  const {response} = action;
  return state.merge({addressValidate: response, isValidateAddressApiSuccess: true, isValidateAddressApiFailure: false});
};

export const validateAddressApiFailure = (state) => {
  return state.merge({isValidateAddressApiSuccess: false, isValidateAddressApiFailure: true});
}


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_LOGIN]: getLogin,
  [Types.GET_LOGIN_SUCCESS]: getLoginSuccess,
  [Types.GET_LOGIN_FAILURE]: getLoginFailure,
  [Types.GET_FORGOT_PASSWORD]: getForgotPassword,
  [Types.GET_FORGOT_PASSWORD_SUCCESS]: getForgotPasswordSuccess,
  [Types.GET_FORGOT_PASSWORD_FAILURE]: getForgotPasswordFailure,
  [Types.GET_USER_AVAILABLE]: getUserAvailable,
  [Types.GET_USER_AVAILABLE_SUCCESS]: getUserAvailableSuccess,
  [Types.GET_USER_AVAILABLE_FAILURE]: getUserAvailableFailure,
  [Types.SIGN_UP]: signUp,
  [Types.GET_SIGN_UP_SUCCESS]: getSignUpSuccess,
  [Types.GET_SIGN_UP_FAILURE]: getSignUpFailure,
  [Types.ADD_PROFILE]: addProfile,
  [Types.GET_PROFILE_SUCCESS]: getProfileSuccess,
  [Types.GET_PROFILE_FAILURE]: getProfileFailure,
  [Types.ADD_BABY_NAME]: addBabyName,
  [Types.ADD_BABY_NAME_SUCCESS]: addBabyNameSuccess,
  [Types.ADD_BABY_NAME_FAILURE]: addBabyNameFailure,
  [Types.SYNC_BABY_NAME]: syncBabyName,
  [Types.SYNC_BABY_NAME_SUCCESS]: syncBabyNameSuccess,
  [Types.SYNC_BABY_NAME_FAILURE]: syncBabyNameFailure,
  [Types.UPLOAD_BABY_PIC]: uploadBabyPic,
  [Types.UPLOAD_BABY_PIC_SUCCESS]: uploadBabyPicSuccess,
  [Types.UPLOAD_BABY_PIC_FAILURE]: uploadBabyPicFailure,
  [Types.GET_USER_PROFILE]: getUserProfile,
  [Types.GET_USER_PROFILE_SUCCESS]: getUserProfileSuccess,
  [Types.GET_USER_PROFILE_FAILURE]: getUserProfileFailure,
  [Types.DELETE_BABY]: deleteBaby,
  [Types.DELETE_BABY_SUCCESS]: deleteBabySuccess,
  [Types.DELETE_BABY_FAILURE]: deleteBabyFailure,
  [Types.DELETE_BABY_IMAGE]: deleteBabyImage,
  [Types.DELETE_BABY_IMAGE_SUCCESS]: deleteBabyImageSuccess,
  [Types.DELETE_BABY_IMAGE_FAILURE]: deleteBabyImageFailure,
  [Types.SWITCH_BABY]: switchBaby,
  [Types.SWITCH_BABY_SUCCESS]: switchBabySuccess,
  [Types.SWITCH_BABY_FAILURE]: switchBabyFailure,
  [Types.OPTED_API]: optedApi,
  [Types.OPTED_API_SUCCESS]: optedApiSuccess,
  [Types.OPTED_API_FAILURE]: optedApiFailure,
  [Types.GET_OPTED_API]: getOptedApi,
  [Types.GET_OPTED_API_SUCCESS]: getOptedApiSuccess,
  [Types.GET_OPTED_API_FAILURE]: getOptedApiFailure,
  [Types.PUMP_QUESTION]: pumpQuestion,
  [Types.PUMP_QUESTION_SUCCESS]: pumpQuestionSuccess,
  [Types.PUMP_QUESTION_FAILURE]: pumpQuestionFailure,
  [Types.VALIDATE_ADDRESS_API]: validateAddressApi,
  [Types.VALIDATE_ADDRESS_API_SUCCESS]: validateAddressApiSuccess,
  [Types.VALIDATE_ADDRESS_API_FAILURE]: validateAddressApiFailure,
})
