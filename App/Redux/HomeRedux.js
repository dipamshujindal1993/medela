import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getTimeSlices: null,
  getTimeSlicesSuccess: ['timeSlices', 'babies'],
  getTimeSlicesFailure: null,
  getMyBabies: null,
  getMyBabiesSuccess: ['babies'],
  getMyBabiesFailure: null,

  getArticles: ['locale', 'articleId', 'page', 'perPage'],
  getArticlesSuccess: ['response'],
  getArticlesFailure: null,

  getArticleDetail: ['locale', 'articleId'],
  getArticleDetailSuccess: ['response'],
  getArticleDetailFailure: null,

  markFavoriteArticle: ['locale', 'articleId'],
  markFavoriteArticleSuccess: ['response'],
  markFavoriteArticleFailure: null,

  getFavouriteArticles: ['locale', 'page', 'perPage'],
  favoriteArticlesSuccess: ['response'],
  favoriteArticlesFailure: null,

  problemSolver: ['locale', 'page', 'perPage'],
  problemSolverSuccess: ['response'],
  problemSolverFailure: null,

  badSessionArticles: ['locale', 'page', 'perPage'],
  badSessionArticlesSuccess: ['response'],
  badSessionArticlesFailure: null,

  trackingApi: ['trackingData'],
  trackingApiSuccess: ['trackingResponse'],
  trackingApiFailure: ['errorResponse'],
  trackingAddOffline:['trackingData'],

  localTrackingApi: ['trackingId','trackingData'],
  localTrackingApiSuccess: ['trackingResponse','trackingId'],
  localTrackingApiFailure: ['errorResponse'],

  getTrackingApi: ['startDate','endDate','babyId','page','perPage'],
  getTrackingApiSuccess: ['getTrackingResponse'],
  getTrackingApiFailure: ['errorResponse'],

  getWhoTrackingApi: ['startDate','endDate','babyId','page','perPage','trackingType'],
  getWhoTrackingApiSuccess: ['getWhoTrackingResponse'],
  getWhoTrackingApiFailure: ['errorResponse'],

  getMotherTrackingApi: ['startDate','endDate','page','perPage'],
  getMotherTrackingApiSuccess: ['getMotherTrackingResponse'],
  getMotherTrackingApiFailure: ['errorMotherTracking'],

  deleteTrackingApi: ['trackingId','babyId'],
  deleteTrackingApiSuccess: ['deleteTrackingResponse'],
  deleteTrackingApiFailure: ['deleteTrackingError'],

  deleteMotherTrackingApi: ['trackingId'],
  deleteMotherTrackingApiSuccess: ['deleteMotherTrackingResponse'],
  deleteMotherTrackingApiFailure: ['deleteMotherTrackingError'],

  exportTrackingApi: ['trackingData'],
  exportTrackingApiSuccess: ['trackingResponse'],
  exportTrackingApiFailure: ['errorResponse'],

  getBreastfeedingConfidenceApi: ['locale'],
  getBreastfeedingConfidenceApiSuccess: ['getBcaResponse'],
  getBreastfeedingConfidenceApiFailure: ['errorResponse'],

  breastfeedingConfidenceApi: ['locale', 'trackingData'],
  breastfeedingConfidenceApiSuccess: ['bcaResponse'],
  breastfeedingConfidenceApiFailure: ['errorResponse'],

  bcaQuestionnaires: ['locale', 'questionId'],
  bcaQuestionnairesSuccess: ['bcaQuestionnairesResponse'],
  bcaQuestionnairesFailure: ['errorResponse'],

  getContentPersonalizationApi: ['locale'],
  getContentPersonalizationApiSuccess: ['getCPResponse'],
  getContentPersonalizationApiFailure: ['errorResponse'],

  contentPersonalizationApi: ['locale', 'trackingData'],
  contentPersonalizationApiSuccess: ['cPResponse'],
  contentPersonalizationApiFailure: ['errorResponse'],

  getBabyImage:['babyId'],
  getBabyImageSuccess: ['imageResponse'],
  getBabyImageFailure: ['errorResponse'],

  setSelectedBaby: ['baby'],

  addFeedback: ['feedback'],
  getFeedbackSuccess: ['response'],
  getFeedbackFailure: ['errorResponse'],

  getPumpList: null,
  getPumpListSuccess: ['pumps'],
  getPumpListFailure: ['errorResponse'],

  addPump: ['pumpData'],
  addPumpSuccess: ['response'],
  addPumpFailure: ['errorResponse'],

  deletePump: ['pumpId'],
  deletePumpSuccess: ['pumpId','response'],
  deletePumpFailure: ['errorResponse'],

   getToken: null,
   getTokenSuccess: ['response'],
   getTokenFailure: ['errorMessage'],
  motherTrackingApi: ['trackingData'],
  motherTrackingApiSuccess: ['motherTrackingResponse'],
  motherTrackingApiFailure: ['errorResponse'],

  getPromoBannerApi: ['locale'],
  getPromoBannerApiSuccess: ['response'],
  getPromoBannerApiFailure: null,

  createBottleApi: ['createBottleData'],
  createBottleApiSuccess: ['createBottleData','createBottleResponse'],
  createBottleApiFailure: ['errorResponse'],

  getFreezerInventoryApi: ['page','perPage','startDate','endDate',],
  getFreezerInventoryApiSuccess: ['getFreezerInventoryResponse'],
  getFreezerInventoryApiFailure: ['errorResponse'],

  deleteFreezerInventoryApi: ['id'],
  deleteFreezerInventoryApiSuccess: ['deleteFreezerInventoryResponse'],
  deleteFreezerInventoryApiFailure: ['errorResponse'],
  scannedPumpList: ['scannedList'],
  isPumpConnected: ['isConnected'],
  flexPumpData: ['flexData'],
  sonataPumpData: ['sonataData'],
  setPumpType: ['pumpType'],
  isPumpRunning: ['pumpRunning'],
  connectedDevice: ['device'],
  connectionState: ['connectionMessage'],
  connectionPause: ['isConnectionPause'],
  stopAllIntervals: ['onStopIntervals'],
  newPumpAdded: ['isNewPumpAdded'],
  sessionState: ['isManualSession'],
  sessionFromNewPump: ['isFromNewPump'],
  pumpingManualData: ['manualDataFromPumping'],
  pumpingCount: ['pumpingCountValue'],
  setSessionIndex: ['sessionIndexValue'],
  sessionSaveFromPumping: ['isSessionSaveFromPumping'],
  getPumpId: ['pumpId'],

  changePassword: ['email', 'oldPwd', 'newPwd'],
  changePasswordSuccess: ['response'],
  changePasswordFailure: ['response'],

  vipPackApi: ['data'],
  vipPackApiSuccess: ['response'],
  vipPackApiFailure: null,

  pumpSessionActive: ['isPumpSessionActive'],

  logOut: null,

  setLeftTimerActive: ['isLeftTimerActive'],
  setRightTimerActive: ['isRightTimerActive'],
})

export const HomeTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  timeSlices: [],
  localTrackingApiSuccess:true,
  selected_baby: {},
  scannedList: null,
  isConnected: false,
  manualDataFromPumping:null,
  isConnectionPause: false,
  pumpRunning: false,
  flexData: null,
  sonataData: null,
  pumps:null,
  isLeftTimerActive:false,
  isRightTimerActive:false,
})

/* ------------- Selectors ------------- */

export const HomeSelectors = {
  userEmailId:state=>state.app.userProfile.mother.username
}

/* ------------- Reducers ------------- */

// request
export const getTimeSlices = (state) => {
  return state.merge({timeSlicesSuccess: false, timeSlicesFailure: false});
}

// request successful
export const getTimeSlicesSuccess = (state, action) => {
  const {timeSlices, babies} = action;
  //console.log(timeSlices)

  return state.merge({timeSlices,  timeSlicesSuccess: true, timeSlicesFailure: false});
};

// request failed
export const getTimeSlicesFailure = (state) => {
  return state.merge({timeSlicesSuccess: false, timeSlicesFailure: true});
}


export const getMyBabies = (state) => {
  return state.merge({babies:[],babiesSuccess: false,babiesFailure:false});
}

// request successful
export const getMyBabiesSuccess = (state, action) => {
  const {babies} = action;
  return state.merge({babies:babies.babies,babiesSuccess: true,babiesFailure:false});
};

// request failed
export const getMyBabiesFailure = (state) => {
  return state.merge({babiesSuccess: false,babiesFailure:true});
}

export const setSelectedBaby = (state, action) => {
  const { baby } = action
  return state.merge({selected_baby:baby});
}

export const getArticles = (state) =>
  state.merge({getArticlesSuccess: false, getArticlesFailure: false, response: null});

export const getArticlesSuccess = (state, action) => {
  const {response} = action
  return state.merge({getArticlesSuccess: response, getArticlesFailure: false, response});
};

export const getArticlesFailure = (state) =>
  state.merge({getArticlesSuccess: false, getArticlesFailure: true});


export const getArticleDetail = (state) =>
  state.merge({getArticleDetailSuccess: false, getArticleDetailFailure: false});

export const getArticleDetailSuccess = (state, action) => {
  const {response} = action
  return state.merge({getArticleDetailSuccess: true, getArticleDetailFailure: false, response});
};

export const getArticleDetailFailure = (state) =>
  state.merge({getArticleDetailSuccess: false, getArticleDetailFailure: true});

  export const markFavoriteArticle = (state) =>
  state.merge({markFavoriteArticleSuccess: false, markFavoriteArticleFailure: false});

export const markFavoriteArticleSuccess = (state, action) => {
  const {response} = action
  return state.merge({markFavoriteArticleSuccess: response, markFavoriteArticleFailure: false, response});
};

export const markFavoriteArticleFailure = (state) =>
  state.merge({markFavoriteArticleSuccess: false, markFavoriteArticleFailure: true});


export const getFavouriteArticles = (state) =>
  state.merge({favoriteArticlesSuccess: false, favoriteArticlesFailure: false});

export const favoriteArticlesSuccess = (state, action) => {
  const {response} = action
  return state.merge({favoriteArticlesSuccess: response, favoriteArticlesFailure: false});
};

export const favoriteArticlesFailure = (state) =>
  state.merge({favoriteArticlesSuccess: false, favoriteArticlesFailure: true});

export const problemSolver = (state) =>
  state.merge({problemSolverSuccess: false, problemSolverFailure: false});

export const problemSolverSuccess = (state, action) => {
  const {response} = action
  return state.merge({problemSolverSuccess: response, problemSolverFailure: false});
};

export const problemSolverFailure = (state) =>
  state.merge({problemSolverSuccess: false, problemSolverFailure: true});

export const badSessionArticles = (state) =>
  state.merge({badSessionArticlesSuccess: false, badSessionArticlesFailure: false});

export const badSessionArticlesSuccess = (state, action) => {
  const {response} = action
  return state.merge({badSessionArticlesSuccess: response, badSessionArticlesFailure: false});
};

export const badSessionArticlesFailure = (state) =>
  state.merge({badSessionArticlesSuccess: false, badSessionArticlesFailure: true});

// request
export const trackingApi = (state) => {
  return state.merge({trackingApiSuccess: false, trackingApiFailure: false});
}

// request successful
export const trackingApiSuccess = (state, action) => {
  const {trackingResponse} = action;
  const {code} = trackingResponse
  if (code && code == "00") {
    return state.merge({trackingResponse, trackingApiSuccess: true, trackingApiFailure: false});
  } else {
    return state.merge({trackingResponse, trackingApiSuccess: false, trackingApiFailure: true});
  }
};

// request failed
export const trackingApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({trackingApiSuccess: false, trackingApiFailure: true});
}


export const trackingAddOffline = (state, action) => {
  const {trackingData} = action;
  return state.merge({trackingData,trackingApiSuccess: true, trackingApiFailure: false});
};

// request
export const localTrackingApi = (state) => {
  return state.merge({localTrackingApiSuccess: false, localTrackingApiFailure: false});
}

// request successful
export const localTrackingApiSuccess = (state, action) => {
  const {trackingResponse,trackingId} = action;
  const {code} = trackingResponse
  if (code && code == "00") {
    return state.merge({trackingId,localTrackingApiSuccess: true, localTrackingApiFailure: false});
  } else {
    return state.merge({localTrackingApiSuccess: false, localTrackingApiFailure: true});
  }
};

// request failed
export const localTrackingApiFailure = (state,action) => {
  const {errorResponse} = action
  return state.merge({localTrackingApiSuccess: false, localTrackingApiFailure: true});
}


export const getTrackingApi = (state) => {
  return state.merge({getTrackingApiSuccess: false, getTrackingApiFailure: false});
}

export const getTrackingApiSuccess = (state, action) => {
  const {getTrackingResponse} = action;
  const {items} = getTrackingResponse
  //console.log('trackingResponse--',JSON.stringify(getTrackingResponse))
  
  if (items && items.length>=0) {
    let modifiedItems=items.map((e)=>({...e,isMother:false}))
  return state.merge({getTrackingResponse:modifiedItems, getTrackingApiSuccess: true, getTrackingApiFailure: false});
  } else {
    return state.merge({getTrackingResponse:[], getTrackingApiSuccess: false, getTrackingApiFailure: true});
  }
};

export const getTrackingApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({getTrackingResponse:[],getTrackingApiSuccess: false, getTrackingApiFailure: true});
}

export const getWhoTrackingApi = (state) => {
  return state.merge({getWhoTrackingApiSuccess: false, getWhoTrackingApiFailure: false});
}

export const getWhoTrackingApiSuccess = (state, action) => {
  const {getWhoTrackingResponse} = action;
  const {items} = getWhoTrackingResponse
  
  if (items && items.length>=0) {
    let modifiedItems=items.map((e)=>({...e,isMother:false}))
  return state.merge({getWhoTrackingResponse:modifiedItems, getWhoTrackingApiSuccess: true, getWhoTrackingApiFailure: false});
  } else {
    return state.merge({getWhoTrackingResponse:[], getWhoTrackingApiSuccess: false, getWhoTrackingApiFailure: true});
  }
};

export const getWhoTrackingApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({getWhoTrackingResponse:[],getWhoTrackingApiSuccess: false, getWhoTrackingApiFailure: true});
}

export const createBottleApi = (state) => {
  return state.merge({createBottleApiSuccess: false, createBottleApiApiFailure: false});
}

export const createBottleApiSuccess = (state, action) => {
  const {createBottleResponse,createBottleData} = action;
  console.log('createBottleApiSuccess--',JSON.stringify(createBottleResponse))
  if (createBottleResponse.successIds.length>0 ) {
    return state.merge({createBottleData:createBottleData.milkInventories,createBottleResponse:createBottleResponse, createBottleApiSuccess: true, createBottleApiFailure: false});
  } else {
    return state.merge({createBottleResponse:[], createBottleApiSuccess: false, createBottleApiFailure: true});
  }
};

export const createBottleApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({createBottleResponse:[],createBottleApiSuccess: false, createBottleApiFailure: true});
}

export const getFreezerInventoryApi = (state) => {
  return state.merge({getFreezerInventoryApiResponse: [],getFreezerInventoryApiSuccess:false ,getFreezerInventoryApiFailure: false});
}

export const getFreezerInventoryApiSuccess = (state, action) => {
  const {getFreezerInventoryResponse} = action;
  if (getFreezerInventoryResponse && getFreezerInventoryResponse.items && getFreezerInventoryResponse.items.length>0) {
  return state.merge({getFreezerInventoryApiResponse:getFreezerInventoryResponse.items,getFreezerInventoryApiSuccess:true,getFreezerInventoryApiFailure: false});
  } else {
    return state.merge({getFreezerInventoryApiResponse:[],getFreezerInventoryApiSuccess:false,  getFreezerInventoryApiFailure: true});
  }
};

export const getFreezerInventoryApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({getFreezerInventoryApiResponse:[],getFreezerInventoryApiFailure: true,getFreezerInventoryApiSuccess:false});
}

export const deleteFreezerInventoryApi = (state) => {
  return state.merge({deleteFreezerInventoryApiResponse: {},deleteFreezerInventoryApiSuccess: false,deleteFreezerInventoryApiFailure: false});
}

export const deleteFreezerInventoryApiSuccess = (state, action) => {
  const {deleteFreezerInventoryResponse} = action;
 // const {items} = getFreezerInventoryResponse
 console.log('deleteResponse--',JSON.stringify(deleteFreezerInventoryResponse))
  if (deleteFreezerInventoryResponse && deleteFreezerInventoryResponse.successIds.length>0) {
    return state.merge({deleteFreezerInventoryApiResponse:deleteFreezerInventoryResponse,deleteFreezerInventoryApiSuccess: true,deleteFreezerInventoryApiFailure: false});
  } else {
    return state.merge({deleteFreezerInventoryApiResponse:[],deleteFreezerInventoryApiSuccess: false,  deleteFreezerInventoryApiFailure: true});
  }
};

export const deleteFreezerInventoryApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({deleteFreezerInventoryApiResponse:[],deleteFreezerInventoryApiSuccess: false,deleteFreezerInventoryApiFailure: true});
}

export const getMotherTrackingApi = (state) => {
  return state.merge({getMotherTrackingApiSuccess: false, getMotherTrackingApiFailure: false});
}

export const getMotherTrackingApiSuccess = (state, action) => {
  const {getMotherTrackingResponse} = action;
  const {items} = getMotherTrackingResponse
  //console.log('trackingResponse--',JSON.stringify(getTrackingResponse))

  if (items && items.length>0) {
    let modifiedItems=items.map((e)=>({...e,isMother:true}))
    return state.merge({getMotherTrackingResponse:modifiedItems, getMotherTrackingApiSuccess: true, getMotherTrackingApiFailure: false});
  } else {
    return state.merge({getTrackingResponse:[], getMotherTrackingApiSuccess: false, getMotherTrackingApiFailure: true});
  }
};

export const getMotherTrackingApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({getTrackingResponse:[],getMotherTrackingApiSuccess: false, getMotherTrackingApiFailure: true});
}


// request
export const exportTrackingApi = (state) => {
  return state.merge({exportTrackingApiSuccess: false, exportTrackingApiFailure: false});
}

// request successful
export const exportTrackingApiSuccess = (state, action) => {
  const {trackingResponse} = action;
  const {code} = trackingResponse
  if (code && code == "00") {
    return state.merge({trackingResponse, exportTrackingApiSuccess: true, exportTrackingApiFailure: false});
  } else {
    return state.merge({trackingResponse, exportTrackingApiSuccess: false, exportTrackingApiFailure: true});
  }
};

// request failed
export const exportTrackingApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({exportTrackingApiSuccess: false, exportTrackingApiFailure: true});
}

export const getBreastfeedingConfidenceApi = (state) => {
  return state.merge({getBreastfeedingConfidenceApiSuccess: false, getBreastfeedingConfidenceApiFailure: false});
}

export const getBreastfeedingConfidenceApiSuccess = (state, action) => {
  const {getBcaResponse} = action;
  const {questions} = getBcaResponse
  if (questions && questions.length>0) {
    return state.merge({getBcaResponse: getBcaResponse, getBreastfeedingConfidenceApiSuccess: true, getBreastfeedingConfidenceApiFailure: false});
  } else {
    return state.merge({getBcaResponse:[], getBreastfeedingConfidenceApiSuccess: false, getBreastfeedingConfidenceApiFailure: true});
  }
};

export const getBreastfeedingConfidenceApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({getBreastfeedingConfidenceApiSuccess: false, getBreastfeedingConfidenceApiFailure: true});
}



export const breastfeedingConfidenceApi = (state) => {
  return state.merge({breastfeedingConfidenceApiSuccess: false, breastfeedingConfidenceApiFailure: false});
}
export const breastfeedingConfidenceApiSuccess = (state, action) => {
  const {bcaResponse} = action;
  const {code} = bcaResponse
  if (code && code == "00") {
    return state.merge({bcaResponse, breastfeedingConfidenceApiSuccess: true, breastfeedingConfidenceApiFailure: false});
  } else {
    return state.merge({bcaResponse, breastfeedingConfidenceApiSuccess: false, breastfeedingConfidenceApiFailure: true});
  }
};

export const breastfeedingConfidenceApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({breastfeedingConfidenceApiSuccess: false, breastfeedingConfidenceApiFailure: true});
}

export const bcaQuestionnaires = (state) => {
  return state.merge({bcaQuestionnairesSuccess: false, bcaQuestionnairesFailure: false});
}

export const bcaQuestionnairesSuccess = (state, action) => {
  const {bcaQuestionnairesResponse} = action
  return state.merge({bcaQuestionnairesSuccess: bcaQuestionnairesResponse, bcaQuestionnairesFailure: false});
};

export const bcaQuestionnairesFailure = (state) => {
  const {errorResponse} = state
  return state.merge({bcaQuestionnairesSuccess: false, bcaQuestionnairesFailure: true});
}


export const getContentPersonalizationApi = (state) => {
  return state.merge({getContentPersonalizationApiSuccess: false, getContentPersonalizationApiFailure: false});
}

export const getContentPersonalizationApiSuccess = (state, action) => {
  const {getCPResponse} = action;
  const {questions} = getCPResponse
  if (questions && questions.length>0) {
    return state.merge({getCPResponse: getCPResponse, getContentPersonalizationApiSuccess: true, getContentPersonalizationApiFailure: false});
  } else {
    return state.merge({getCPResponse:[], getContentPersonalizationApiSuccess: false, getContentPersonalizationApiFailure: true});
  }
};

export const getContentPersonalizationApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({getContentPersonalizationApiSuccess: false, getContentPersonalizationApiFailure: true});
}


export const contentPersonalizationApi = (state) => {
  return state.merge({contentPersonalizationApiSuccess: false, contentPersonalizationApiFailure: false});
}
export const contentPersonalizationApiSuccess = (state, action) => {
  const {cPResponse} = action;
  const {code} = cPResponse
  if (code && code == "00") {
    return state.merge({cPResponse, contentPersonalizationApiSuccess: true, contentPersonalizationApiFailure: false});
  } else {
    return state.merge({cPResponse, contentPersonalizationApiSuccess: false, contentPersonalizationApiFailure: true});
  }
};

export const contentPersonalizationApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({contentPersonalizationApiSuccess: false, contentPersonalizationApiFailure: true});
}

export const addFeedback = (state) => {
  return state.merge({getFeedbackSuccess: false, getFeedbackFailure: false});
}

export const getFeedbackSuccess = (state, action) => {
  const {response} = action
  return state.merge({getFeedbackSuccess: response, getFeedbackFailure: false});
};

export const getFeedbackFailure = (state, action) => {
  const {errorResponse} = action
  return state.merge({getFeedbackSuccess: false, getFeedbackFailure: true});
}


export const getBabyImage = (state) => {
  return state.merge({getBabyImageSuccess: false, getBabyImageFailure: false});
}

export const getBabyImageSuccess = (state, action) => {
  const {imageResponse} = action;
  if (imageResponse) {
    return state.merge({imageResponse: imageResponse, getBabyImageSuccess: true, getBabyImageFailure: false});
  } else {
    return state.merge({imageResponse:[], getBabyImageSuccess: false, getBabyImageFailure: true});
  }
};

export const getBabyImageFailure = (state) => {
  const {errorResponse} = state
  return state.merge({getBabyImageSuccess: false, getBabyImageFailure: true});
}

export const deleteTrackingApi = (state) => {
  return state.merge({deleteTrackingSuccess: false, deleteTrackingFailure: false});
}
export const deleteTrackingApiSuccess = (state, action) => {
  const {deleteTrackingResponse} = action;
  if (deleteTrackingResponse && deleteTrackingResponse.successIds.length>0){
    return state.merge({deleteTrackingId:deleteTrackingResponse.successIds[0],deleteTrackingSuccess: true, deleteTrackingFailure: false});
  }else {
    return state.merge({deleteTrackingSuccess: false, deleteTrackingFailure: true});
  }
};

export const deleteTrackingApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({deleteTrackingSuccess: false, deleteTrackingFailure: true});
}
export const deleteMotherTrackingApi = (state) => {
  return state.merge({deleteMotherTrackingSuccess: false, deleteMotherTrackingFailure: false});
}
export const deleteMotherTrackingApiSuccess = (state, action) => {
  const {deleteMotherTrackingResponse} = action;
  if (deleteMotherTrackingResponse && deleteMotherTrackingResponse.successIds.length>0){
    return state.merge({deleteMotherTrackingId:deleteMotherTrackingResponse.successIds[0],deleteMotherTrackingSuccess: true, deleteMotherTrackingFailure: false});
  }else {
    return state.merge({deleteMotherTrackingSuccess: false, deleteMotherTrackingFailure: true});
  }
};

export const deleteMotherTrackingApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({deleteMotherTrackingSuccess: false, deleteMotherTrackingFailure: true});
}
export const getPumpList = (state) => {
  return state.merge({isPumpListSuccess: false, isPumpListFailure: false});
}

export const getPumpListSuccess = (state, action) => {
  const {pumps} = action;
  return state.merge({pumps: pumps, isPumpListSuccess: true, isPumpListFailure: false});
};

export const getPumpListFailure = (state, action) => {
  const {errorResponse} = action
  return state.merge({pumpListFailureMessage: errorResponse, isPumpListSuccess: false, isPumpListFailure: true});
}

export const addPump = (state) => {
  return state.merge({addPumpSuccess: false, addPumpFailure: false});
}

export const addPumpSuccess = (state, action) => {
  const {response} = action;
  return state.merge({addPumpMessage: response, addPumpSuccess: true, addPumpFailure: false});
};

export const addPumpFailure = (state, action) => {
  const {errorResponse} = action
  return state.merge({addPumpMessage: errorResponse, addPumpSuccess: false, addPumpFailure: true});
}


export const deletePump = (state) => {
  return state.merge({deletePumpSuccess: false, deletePumpFailure: false});
}

export const deletePumpSuccess = (state, action) => {
  const {response,pumpId} = action;
  const {pumps}=state
  let pump=JSON.parse(JSON.stringify(pumps))
  if (pump && pump.pumps){
     let index=pump.pumps.findIndex((e)=>{
        return e.pumpId===pumpId
     })
    if (index>-1){
      let item=pump.pumps[index]
      item.deleteFlag=true
      pump.pumps.splice(index,1,item)
    }
  }
  return state.merge({deletePumpMessage:response,pumps:pump,deletePumpSuccess: true, deletePumpFailure: false});
};

export const deletePumpFailure = (state) => {
  const {errorResponse} = state
  return state.merge({deletePumpMessage:errorResponse, deletePumpSuccess: false, deletePumpFailure: true});
}

export const getToken = (state) =>
state.merge({isTokenSuccess: false, isTokenError: false});

export const getTokenSuccess = (state, action) => {
const {token}=action
return state.merge({isTokenSuccess: true, isTokenError: false, pacifyToken: token});
};

export const getTokenFailure = (state,action) =>
state.merge({isTokenSuccess: false, isTokenError: true, message:action.errorMessage});
export const motherTrackingApi = (state) => {
  return state.merge({motherTrackingApiSuccess: false, motherTrackingApiFailure: false});
}


// request successful
export const motherTrackingApiSuccess = (state, action) => {
  const {motherTrackingResponse} = action;
  const {code} = motherTrackingResponse
  console.log('motherTrackingApiResponse---',motherTrackingResponse.successIds)
  if (code && code == "00" && motherTrackingResponse.successIds.length>0) {
    return state.merge({motherTrackingResponse:motherTrackingResponse.successIds, motherTrackingApiSuccess: true, motherTrackingApiFailure: false});
  } else {
    return state.merge({motherTrackingResponse, motherTrackingApiSuccess: false, motherTrackingApiFailure: true});
  }
};

// request failed
export const motherTrackingApiFailure = (state) => {
  const {errorResponse} = state
  return state.merge({motherTrackingApiSuccess: false, motherTrackingApiFailure: true});
}

export const getPromoBannerApi = (state) =>
  state.merge({bannerApiSuccess: false, bannerApiFailure: false, response: null});

export const getPromoBannerApiSuccess = (state, action) => {
  const {response} = action
  return state.merge({bannerApiSuccess: true, bannerApiFailure: false, response});
};

export const getPromoBannerApiFailure = (state) =>
  state.merge({bannerApiSuccess: false, bannerApiFailure: true});

export const scannedPumpList = (state, action) => {
  const {scannedList} = action
  return state.merge({scannedList});
}

export const isPumpConnected = (state, action) => {
  const {isConnected} = action
  return state.merge({isConnected});
}

export const flexPumpData = (state, action) => {
  const {flexData} = action
  return state.merge({flexData});
}

export const sonataPumpData = (state, action) => {
  const {sonataData} = action
  return state.merge({sonataData});
}

export const setPumpType = (state, action) => {
  const {pumpType} = action
  return state.merge({pumpType});
}

export const isPumpRunning = (state, action) => {
  const {pumpRunning} = action
  return state.merge({pumpRunning});
}

export const connectedDevice = (state, action) => {
  const {device} = action
  return state.merge({device});
}

export const connectionState = (state, action) => {
  const {connectionMessage} = action
  return state.merge({connectionMessage});
}

export const connectionPause = (state, action) => {
  const {isConnectionPause} = action
  return state.merge({isConnectionPause});
}

export const stopAllIntervals = (state, action) => {
  const {onStopIntervals} = action
  return state.merge({onStopIntervals});
}

export const newPumpAdded = (state, action) => {
  const {isNewPumpAdded} = action
  return state.merge({isNewPumpAdded});
}

export const sessionState = (state, action) => {
  const {isManualSession} = action
  return state.merge({isManualSession});
}

export const sessionFromNewPump = (state, action) => {
  const {isFromNewPump} = action
  return state.merge({isFromNewPump});
}

export const pumpingManualData = (state, action) => {
  const {manualDataFromPumping} = action
  return state.merge({manualDataFromPumping});
}

export const pumpingCount = (state, action) => {
  const {pumpingCountValue} = action
  return state.merge({pumpingCountValue});
}

export const setSessionIndex = (state, action) => {
  const {sessionIndexValue} = action
  return state.merge({sessionIndexValue});
}

export const sessionSaveFromPumping = (state, action) => {
  const {isSessionSaveFromPumping} = action
  return state.merge({isSessionSaveFromPumping});
}

export const getPumpId = (state, action) => {
  const {pumpId} = action
  return state.merge({pumpId});
}

export const changePassword = (state) =>
  state.merge({changePasswordSuccess: false, changePasswordFailure: false});

export const changePasswordSuccess = (state, action) => {
  const {response} = action
  if (response.toString().includes('grepStatus')){
    let changePasswordResponse = JSON.parse(response.replace("grepStatus('", "").replace("')", ""));
    const {resetedPassword}=changePasswordResponse.status
    if(resetedPassword) {
      return state.merge({changePasswordSuccess: true, changePasswordFailure: false });
    } else {
      return state.merge({changePasswordSuccess: false, changePasswordFailure: true });
    }
  }
}

export const changePasswordFailure = (state) => {
  return state.merge({changePasswordSuccess: response, changePasswordFailure: false});
};


export const vipPackApi = (state) => {
  return state.merge({vipPackSuccess: false, vipPackFailure: false});
}

export const vipPackApiSuccess = (state, action) => {
  const {response} = action;
  return state.merge({vipPackSuccess: true, vipPackFailure: false, response});
};

export const vipPackApiFailure = (state) => {
  return state.merge({vipPackSuccess: false, vipPackFailure: true});
}

export const pumpSessionActive = (state, action) => {
  const {isPumpSessionActive} = action
  return state.merge({isPumpSessionActive});
}

export const setLeftTimerActive = (state, action) => {
  const {isLeftTimerActive} = action
  return state.merge({isLeftTimerActive});
}

export const setRightTimerActive = (state, action) => {
  const {isRightTimerActive} = action
  return state.merge({isRightTimerActive});
}

// LOGOUT API
export const logOut = (state) =>{
  console.log('pumps---',state.pumps)
  return state.merge({pumps:[],scannedList:[],sonataPumpData:{},flexPumpData:{},isPumpConnected:false,
    isPumpSessionActive:false, isLeftTimerActive:false, isRightTimerActive:false})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_TIME_SLICES]: getTimeSlices,
  [Types.GET_TIME_SLICES_SUCCESS]: getTimeSlicesSuccess,
  [Types.GET_TIME_SLICES_FAILURE]: getTimeSlicesFailure,

  [Types.GET_MY_BABIES]: getMyBabies,
  [Types.GET_MY_BABIES_SUCCESS]: getMyBabiesSuccess,
  [Types.GET_MY_BABIES_FAILURE]: getMyBabiesFailure,

  [Types.GET_ARTICLES]: getArticles,
  [Types.GET_ARTICLES_SUCCESS]: getArticlesSuccess,
  [Types.GET_ARTICLES_FAILURE]: getArticlesFailure,

  [Types.GET_ARTICLE_DETAIL]: getArticleDetail,
  [Types.GET_ARTICLE_DETAIL_SUCCESS]: getArticleDetailSuccess,
  [Types.GET_ARTICLE_DETAIL_FAILURE]: getArticleDetailFailure,

  [Types.MARK_FAVORITE_ARTICLE]: markFavoriteArticle,
  [Types.MARK_FAVORITE_ARTICLE_SUCCESS]: markFavoriteArticleSuccess,
  [Types.MARK_FAVORITE_ARTICLE_FAILURE]: markFavoriteArticleFailure,

  [Types.GET_FAVOURITE_ARTICLES]: getFavouriteArticles,
  [Types.FAVORITE_ARTICLES_SUCCESS]: favoriteArticlesSuccess,
  [Types.FAVORITE_ARTICLES_FAILURE]: favoriteArticlesFailure,

  [Types.PROBLEM_SOLVER]: problemSolver,
  [Types.PROBLEM_SOLVER_SUCCESS]: problemSolverSuccess,
  [Types.PROBLEM_SOLVER_FAILURE]: problemSolverFailure,

  [Types.BAD_SESSION_ARTICLES]: badSessionArticles,
  [Types.BAD_SESSION_ARTICLES_SUCCESS]: badSessionArticlesSuccess,
  [Types.BAD_SESSION_ARTICLES_FAILURE]: badSessionArticlesFailure,

  [Types.TRACKING_API]: trackingApi,
  [Types.TRACKING_API_SUCCESS]: trackingApiSuccess,
  [Types.TRACKING_API_FAILURE]: trackingApiFailure,
  [Types.TRACKING_ADD_OFFLINE]: trackingAddOffline,

  [Types.LOCAL_TRACKING_API]: localTrackingApi,
  [Types.LOCAL_TRACKING_API_SUCCESS]: localTrackingApiSuccess,
  [Types.LOCAL_TRACKING_API_FAILURE]: localTrackingApiFailure,


  [Types.GET_TRACKING_API]: getTrackingApi,
  [Types.GET_TRACKING_API_SUCCESS]: getTrackingApiSuccess,
  [Types.GET_TRACKING_API_FAILURE]: getTrackingApiFailure,

  [Types.GET_WHO_TRACKING_API]: getWhoTrackingApi,
  [Types.GET_WHO_TRACKING_API_SUCCESS]: getWhoTrackingApiSuccess,
  [Types.GET_WHO_TRACKING_API_FAILURE]: getWhoTrackingApiFailure,

  [Types.GET_MOTHER_TRACKING_API]: getMotherTrackingApi,
  [Types.GET_MOTHER_TRACKING_API_SUCCESS]: getMotherTrackingApiSuccess,
  [Types.GET_MOTHER_TRACKING_API_FAILURE]: getMotherTrackingApiFailure,

  [Types.EXPORT_TRACKING_API]: exportTrackingApi,
  [Types.EXPORT_TRACKING_API_SUCCESS]: exportTrackingApiSuccess,
  [Types.EXPORT_TRACKING_API_FAILURE]: exportTrackingApiFailure,

  [Types.GET_BREASTFEEDING_CONFIDENCE_API]: getBreastfeedingConfidenceApi,
  [Types.GET_BREASTFEEDING_CONFIDENCE_API_SUCCESS]: getBreastfeedingConfidenceApiSuccess,
  [Types.GET_BREASTFEEDING_CONFIDENCE_API_FAILURE]: getBreastfeedingConfidenceApiFailure,

  [Types.BREASTFEEDING_CONFIDENCE_API]: breastfeedingConfidenceApi,
  [Types.BREASTFEEDING_CONFIDENCE_API_SUCCESS]: breastfeedingConfidenceApiSuccess,
  [Types.BREASTFEEDING_CONFIDENCE_API_FAILURE]: breastfeedingConfidenceApiFailure,

  [Types.BCA_QUESTIONNAIRES]: bcaQuestionnaires,
  [Types.BCA_QUESTIONNAIRES_SUCCESS]: bcaQuestionnairesSuccess,
  [Types.BCA_QUESTIONNAIRES_FAILURE]: bcaQuestionnairesFailure,

  [Types.GET_CONTENT_PERSONALIZATION_API]: getContentPersonalizationApi,
  [Types.GET_CONTENT_PERSONALIZATION_API_SUCCESS]: getContentPersonalizationApiSuccess,
  [Types.GET_CONTENT_PERSONALIZATION_API_FAILURE]: getContentPersonalizationApiFailure,

  [Types.CONTENT_PERSONALIZATION_API]: contentPersonalizationApi,
  [Types.CONTENT_PERSONALIZATION_API_SUCCESS]: contentPersonalizationApiSuccess,
  [Types.CONTENT_PERSONALIZATION_API_FAILURE]: contentPersonalizationApiFailure,

  [Types.GET_BABY_IMAGE]: getBabyImage,
  [Types.GET_BABY_IMAGE_SUCCESS]: getBabyImageSuccess,
  [Types.GET_BABY_IMAGE_FAILURE]: getBabyImageFailure,

  [Types.DELETE_TRACKING_API]: deleteTrackingApi,
  [Types.DELETE_TRACKING_API_SUCCESS]: deleteTrackingApiSuccess,
  [Types.DELETE_TRACKING_API_FAILURE]: deleteTrackingApiFailure,

  [Types.DELETE_MOTHER_TRACKING_API]: deleteMotherTrackingApi,
  [Types.DELETE_MOTHER_TRACKING_API_SUCCESS]: deleteMotherTrackingApiSuccess,
  [Types.DELETE_MOTHER_TRACKING_API_FAILURE]: deleteMotherTrackingApiFailure,

  [Types.SET_SELECTED_BABY]: setSelectedBaby,

  [Types.ADD_FEEDBACK]: addFeedback,
  [Types.GET_FEEDBACK_SUCCESS]: getFeedbackSuccess,
  [Types.GET_FEEDBACK_FAILURE]: getFeedbackFailure,

  [Types.GET_PUMP_LIST]: getPumpList,
  [Types.GET_PUMP_LIST_SUCCESS]: getPumpListSuccess,
  [Types.GET_PUMP_LIST_FAILURE]: getPumpListFailure,

  [Types.ADD_PUMP]: addPump,
  [Types.ADD_PUMP_SUCCESS]: addPumpSuccess,
  [Types.ADD_PUMP_FAILURE]: addPumpFailure,

  [Types.DELETE_PUMP]: deletePump,
  [Types.DELETE_PUMP_SUCCESS]: deletePumpSuccess,
  [Types.DELETE_PUMP_FAILURE]: deletePumpFailure,

  [Types.GET_TOKEN]: getToken,
  [Types.GET_TOKEN_SUCCESS]: getTokenSuccess,
  [Types.GET_TOKEN_FAILURE]: getTokenFailure,
  [Types.MOTHER_TRACKING_API]: motherTrackingApi,
  [Types.MOTHER_TRACKING_API_SUCCESS]: motherTrackingApiSuccess,
  [Types.MOTHER_TRACKING_API_FAILURE]: motherTrackingApiFailure,

  [Types.GET_PROMO_BANNER_API]: getPromoBannerApi,
  [Types.GET_PROMO_BANNER_API_SUCCESS]: getPromoBannerApiSuccess,
  [Types.GET_PROMO_BANNER_API_FAILURE]: getPromoBannerApiFailure,

  [Types.CREATE_BOTTLE_API]: createBottleApi,
  [Types.CREATE_BOTTLE_API_SUCCESS]: createBottleApiSuccess,
  [Types.CREATE_BOTTLE_API_FAILURE]: createBottleApiFailure,

  [Types.GET_FREEZER_INVENTORY_API]: getFreezerInventoryApi,
  [Types.GET_FREEZER_INVENTORY_API_SUCCESS]: getFreezerInventoryApiSuccess,
  [Types.GET_FREEZER_INVENTORY_API_FAILURE]: getFreezerInventoryApiFailure,

  [Types.DELETE_FREEZER_INVENTORY_API]: deleteFreezerInventoryApi,
  [Types.DELETE_FREEZER_INVENTORY_API_SUCCESS]: deleteFreezerInventoryApiSuccess,
  [Types.DELETE_FREEZER_INVENTORY_API_FAILURE]: deleteFreezerInventoryApiFailure,
  [Types.SCANNED_PUMP_LIST]: scannedPumpList,
  [Types.IS_PUMP_CONNECTED]: isPumpConnected,
  [Types.FLEX_PUMP_DATA]: flexPumpData,
  [Types.SONATA_PUMP_DATA]: sonataPumpData,
  [Types.SET_PUMP_TYPE]: setPumpType,
  [Types.IS_PUMP_RUNNING]: isPumpRunning,
  [Types.CONNECTED_DEVICE]: connectedDevice,
  [Types.CONNECTION_STATE]: connectionState,
  [Types.CONNECTION_PAUSE]: connectionPause,
  [Types.STOP_ALL_INTERVALS]: stopAllIntervals,
  [Types.NEW_PUMP_ADDED]: newPumpAdded,
  [Types.SESSION_STATE]: sessionState,
  [Types.SESSION_FROM_NEW_PUMP]: sessionFromNewPump,
  [Types.PUMPING_MANUAL_DATA]: pumpingManualData,
  [Types.PUMPING_COUNT]: pumpingCount,
  [Types.SET_SESSION_INDEX]: setSessionIndex,
  [Types.SESSION_SAVE_FROM_PUMPING]: sessionSaveFromPumping,
  [Types.GET_PUMP_ID]: getPumpId,

  [Types.CHANGE_PASSWORD]: changePassword,
  [Types.CHANGE_PASSWORD_SUCCESS]: changePasswordSuccess,
  [Types.CHANGE_PASSWORD_FAILURE]: changePasswordFailure,
  [Types.VIP_PACK_API]: vipPackApi,
  [Types.VIP_PACK_API_SUCCESS]: vipPackApiSuccess,
  [Types.VIP_PACK_API_FAILURE]: vipPackApiFailure,

  [Types.PUMP_SESSION_ACTIVE]: pumpSessionActive,

  [Types.LOG_OUT]: logOut,
  [Types.SET_LEFT_TIMER_ACTIVE]: setLeftTimerActive,
  [Types.SET_RIGHT_TIMER_ACTIVE]: setRightTimerActive,
})
