import { takeLatest,takeEvery, all } from 'redux-saga/effects'
import API from '@services/Api'

import FixtureAPI from '@services/FixtureApi'
import DebugConfig from '@config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '@redux/StartupRedux'
import { AppTypes } from '@redux/AppRedux'
import { UserTypes } from '@redux/UserRedux'
import { HomeTypes } from '@redux/HomeRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import {
  getLogin,
  getForgotPassword,
  getUserAvailable,
  signUp,
  addProfile,
  getTimeSlices,
  getMyBabies,
  getUserProfile,
  addBabyName,
  uploadBabyPic,
  trackingApi,
  getTrackingData, 
  getWhoTrackingData,
  localTrackingDataUploadToServer,
  exportTrackingApi,
  getBreastfeedingConfidenceApi,
  breastfeedingConfidenceApi,
  bcaQuestionnaires,
  getContentPersonalizationApi,
  contentPersonalizationApi,
  deleteBaby,
  getBabyImage,
  switchBabyClientId,
  signOut,
  addFeedback,
  deleteTrackingApi,
  getPumpList,
  addPump,
  deletePump,
  getArticles,
  getArticleDetail,
  markFavoriteArticle,
  getFavouriteArticles,
  problemSolver,
  badSessionArticles,
  getToken,
  motherTrackingApi,
  syncBabyWithServer,
  deleteBabyImage,
  optedApi,
  getOptedApi,
  pumpQuestion,
  getPromoBannerApi,
  getMotherTrackingData,
  deleteMotherTrackingApi,
  createBottleApi,
  getFreezerInventoryApi,
  deleteFreezerInventoryApi,
  validateAddressApi,
  changePassword,
  vipPackApi
} from './ApiSagas'


/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup, api),

    // some sagas receive extra parameters in addition to an action

    takeLatest(UserTypes.GET_LOGIN, getLogin, api),

    takeLatest(UserTypes.GET_FORGOT_PASSWORD, getForgotPassword, api),

    takeLatest(UserTypes.GET_USER_AVAILABLE, getUserAvailable, api),

    takeLatest(UserTypes.SIGN_UP, signUp, api),

    takeLatest(UserTypes.ADD_PROFILE, addProfile, api),

    takeLatest(HomeTypes.GET_TIME_SLICES, getTimeSlices, api),

    takeLatest(UserTypes.ADD_BABY_NAME, addBabyName, api),

    takeLatest(UserTypes.UPLOAD_BABY_PIC, uploadBabyPic, api),

    takeEvery(UserTypes.SYNC_BABY_NAME, syncBabyWithServer, api),

    takeLatest(UserTypes.GET_USER_PROFILE, getUserProfile, api),

    takeLatest(HomeTypes.GET_MY_BABIES, getMyBabies, api),

    takeLatest(HomeTypes.TRACKING_API, trackingApi, api),

    takeEvery(HomeTypes.LOCAL_TRACKING_API, localTrackingDataUploadToServer, api),

    takeLatest(HomeTypes.GET_TRACKING_API, getTrackingData, api),

    takeLatest(HomeTypes.GET_WHO_TRACKING_API, getWhoTrackingData, api),

    takeLatest(HomeTypes.GET_MOTHER_TRACKING_API, getMotherTrackingData, api),

    takeLatest(HomeTypes.EXPORT_TRACKING_API, exportTrackingApi, api),

    takeLatest(HomeTypes.GET_BREASTFEEDING_CONFIDENCE_API, getBreastfeedingConfidenceApi, api),

    takeLatest(HomeTypes.BREASTFEEDING_CONFIDENCE_API, breastfeedingConfidenceApi, api),

    takeLatest(HomeTypes.BCA_QUESTIONNAIRES, bcaQuestionnaires, api),

    takeLatest(HomeTypes.GET_CONTENT_PERSONALIZATION_API, getContentPersonalizationApi, api),

    takeLatest(HomeTypes.CONTENT_PERSONALIZATION_API, contentPersonalizationApi, api),

    takeLatest(UserTypes.DELETE_BABY, deleteBaby, api),

    takeLatest(UserTypes.DELETE_BABY_IMAGE, deleteBabyImage, api),

    takeLatest(HomeTypes.GET_BABY_IMAGE, getBabyImage, api),

    takeLatest(UserTypes.SWITCH_BABY, switchBabyClientId, api),

    takeLatest(HomeTypes.DELETE_TRACKING_API, deleteTrackingApi, api),

    takeLatest(HomeTypes.DELETE_MOTHER_TRACKING_API, deleteMotherTrackingApi, api),

    takeLatest(AppTypes.SIGN_OUT, signOut, api),

    takeLatest(HomeTypes.GET_PUMP_LIST, getPumpList, api),

    takeLatest(HomeTypes.ADD_PUMP, addPump, api),

    takeLatest(HomeTypes.DELETE_PUMP, deletePump, api),

    takeLatest(HomeTypes.ADD_FEEDBACK, addFeedback, api),

    takeLatest(HomeTypes.GET_ARTICLES, getArticles, api),

    takeLatest(HomeTypes.GET_ARTICLE_DETAIL, getArticleDetail, api),

    takeLatest(HomeTypes.MARK_FAVORITE_ARTICLE, markFavoriteArticle, api),

    takeLatest(HomeTypes.GET_FAVOURITE_ARTICLES, getFavouriteArticles, api),

    takeLatest(HomeTypes.PROBLEM_SOLVER, problemSolver, api),

    takeLatest(HomeTypes.MOTHER_TRACKING_API, motherTrackingApi, api),

    takeLatest(UserTypes.OPTED_API, optedApi, api),

    takeLatest(UserTypes.GET_OPTED_API, getOptedApi, api),

    takeLatest(HomeTypes.BAD_SESSION_ARTICLES, badSessionArticles, api),

    takeLatest(HomeTypes.GET_TOKEN, getToken, api),
    takeLatest(UserTypes.PUMP_QUESTION, pumpQuestion, api),
    takeLatest(HomeTypes.GET_PROMO_BANNER_API, getPromoBannerApi, api),
    takeLatest(HomeTypes.CREATE_BOTTLE_API, createBottleApi , api),
    takeLatest(HomeTypes.GET_FREEZER_INVENTORY_API, getFreezerInventoryApi , api),
    takeLatest(HomeTypes.DELETE_FREEZER_INVENTORY_API, deleteFreezerInventoryApi , api),
    takeLatest(UserTypes.VALIDATE_ADDRESS_API, validateAddressApi, api),

    takeLatest(HomeTypes.CHANGE_PASSWORD, changePassword, api),
    takeLatest(HomeTypes.VIP_PACK_API, vipPackApi, api),
  ])
}
