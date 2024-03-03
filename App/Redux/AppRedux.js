import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  rehydrationComplete: null,
  optedState:['keys'],
  //signInSuccess:['keys'],
  signInSuccess:null,
  signOut: null,
  checkInternetConnection: ['internetStatus'],
  loggedInUserInfo:['username','password'],
  saveRealmDb:['realmDb'],
  signOutSuccess: ['response'],
  signOutFailure: ['errorResponse'],
  darkMode: ['themeSelected'],
  checkAppState: ['appState'],
  getBleDeviceId: ['deviceId'],
})

export const AppTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
//Set initial states here
  rehydrated: false,
  opted:{state:'initial',value:false,market:null},
  signedIn: false,
  isInternetAvailable:false,
  realmDb:null,
  themeSelected: 'light',
  username:null,
  password:null,
})

/* ------------- Selectors ------------- */

export const AppSelectors = {
  //set values to initial state if we want
  isSignedIn: state => state.app.signedIn,
  isInternetAvailable:state=>state.app.isInternetAvailable,
  realmDb:state=>state.app.realmDb,
  username:state=>state.app.username,
  password:state=>state.app.password,
  opted:state=>state.app.opted
}

/* ------------- Reducers ------------- */

export const optedState=(state,action)=>{
  const {keys}=action;
  let prevOpted=JSON.parse(JSON.stringify(state.opted));
  return state.merge({opted:{...prevOpted,...keys}})
}

export const rehydrationComplete = (state) =>
  state.merge({ rehydrated: true })

export const signInSuccess = (state,action) =>{
  // const {keys}=action;
  // let opted;
  // if(keys!=undefined){
  //   let prevOpted=JSON.parse(JSON.stringify(state.opted));
  //   opted={...prevOpted,...keys}
  // }
  // return state.merge({ signedIn: true ,...opted&&{opted}})
  return state.merge({ signedIn: true})
}

export const checkInternetConnection = (state,action) =>{
  const {internetStatus}=action
  return state.merge({ isInternetAvailable: internetStatus })
}
export const loggedInUserInfo = (state,action) =>{
  const {username,password}=action
  return state.merge({ username,password })
}
export const saveRealmDb = (state,action) =>{
  const {realmDb}=action
  return state.merge({ realmDb: realmDb })
}

// export const signOut = (state) =>
//   state.merge({ signedIn: false})

// LOGOUT API
export const signOut = (state) =>
  state.merge({signOutSuccess: false, signOutFailure: false})

export const signOutSuccess = (state, action) => {
  const {response}=action
  return state.merge({response, signedIn: false, signOutSuccess: true, signOutFailure: false});
};

export const signOutFailure = (state) =>{
  return state.merge({signOutSuccess: false, signOutFailure: true,signedIn: false,})
}


// DARK MODE
export const darkMode = (state, action) =>{
  const{themeSelected}=action
  return state.merge({themeSelected: themeSelected})
}

// App State
export const checkAppState = (state,action) =>{
  const {appState}=action
  return state.merge({ appState })
}

// BLE device data
export const getBleDeviceId = (state,action) =>{
  const {deviceId}=action
  return state.merge({ bleDeviceId:deviceId })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.REHYDRATION_COMPLETE]: rehydrationComplete,
  [Types.OPTED_STATE]: optedState,
  [Types.SIGN_IN_SUCCESS]: signInSuccess,
  [Types.CHECK_INTERNET_CONNECTION]: checkInternetConnection,
  [Types.LOGGED_IN_USER_INFO]: loggedInUserInfo,
  //loggedInUserInfo
  [Types.SAVE_REALM_DB]: saveRealmDb,
  [Types.SIGN_OUT]: signOut,
  [Types.SIGN_OUT_SUCCESS]: signOutSuccess,
  [Types.SIGN_OUT_FAILURE]: signOutFailure,
  [Types.DARK_MODE]: darkMode,
  [Types.CHECK_APP_STATE]: checkAppState,
  [Types.GET_BLE_DEVICE_ID]: getBleDeviceId,
})
