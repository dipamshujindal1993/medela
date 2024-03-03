import apisauce from 'apisauce'
import Config from 'react-native-config'
import {Constants} from "@resources";
import { addParam } from '@utils/UrlUtils'
import {formatString} from "@utils/TextUtils";

const create = () => {

  const api = apisauce.create({
    headers: {
      'Cache-Control': 'no-cache',
      "Content-Type": "application/json",
      "accept": "application/json",
      "Accept-Encoding": "gzip"
    },
    timeout: 100000
  })

  const getConfig = () => {
    let url = Constants.BASE_URL+'config/v2'
    return api.get(url)
  }

  const getLoginToken = ({casUrl, username, password, service, callback}) => {
    let url = `${casUrl}/v1/login`
    if (username) {
      url = addParam(url, 'username', username)
    }
    if (password) {
      url = addParam(url, 'password', password)
    }
    if (service) {
      url = addParam(url, 'service', service)
    }
    if (callback) {
      url = addParam(url, 'callback', callback)
    }
    return api.get(url)
  }

  const getLoginAPI = ({ hybrisLoginUrl, ticket }) => {
    let url = hybrisLoginUrl
    if (ticket) {
      url = addParam(url, 'ticket', ticket)
    }
    return api.get(url)
  }

  const forgotPasswordAPI = ({casUrl, email, locale, callback}) => {
    let url = `${casUrl}/v1/forgottenpassword`
    if (email) {
      url = addParam(url, 'email', email)
    }
    if (locale) {
      url = addParam(url, 'locale', locale)
    }
    if (callback) {
      // url = addParam(url, 'callback', 'grepStatus')
      url = addParam(url, 'callback', callback)
    }
    url = addParam(url, 'site', 'medelabst')
    return api.get(url)
  }

  const getUserAvailable = ({ baseUrl, email }) => {
    let url = `${formatString(baseUrl,email)}`
    // let url=formatString(baseUrl,email)
    //let url = `${baseUrl}userAvailable/`+email
    return api.get(url)
  }

  const getSignUp = (body, headers) => {
    const { baseUrl } = body
    let url = `${baseUrl}signup`
    delete body.baseUrl;
    return api.post(url, body, { headers })
  }
  const addProfile = (body, headers) => {
    const { profile, baseUrl } = body
    let url = `${baseUrl}`
    return api.post(url, profile, { headers })
  }

  const getTimeSlices = ({baseUrl}) => {
    let url = `${baseUrl}`
    return api.get(url)
  }

  const getToken = async ({ baseUrl }) => {
    let url = `${baseUrl}`
    return api.get(url)

  }
  const addBabyName = (body, headers) => {
    const { babies, baseUrl } = body
    let url = `${baseUrl}`
    return api.post(url, babies, { headers })
  }
  const uploadBabyPic = ({baseUrl, babyId,formData}, headers) => {
    let url=formatString(baseUrl,babyId)
    // let url = `${baseUrl}rest/baby/picture/${babyId}`
    return api.post(url, formData, { headers })
  }

  const getMyBabies = ({baseUrl}) => {
    let url = `${baseUrl}`
    return api.get(url)
  }

  const getMyProfile = ({baseUrl}) => {
    let url = `${baseUrl}`
    return api.get(url)
  }

  const getBabyImage = ({baseUrl, babyId}) => {
    let url =formatString(baseUrl,babyId)
    //  `${baseUrl}rest/baby/picture/${babyId}`
    return api.get(url)
  }
  const switchBabyClientId = ({baseUrl, babyClientId}) => {
    let url = `${formatString(baseUrl,babyClientId)}`
    return api.post(url)
  }

  const trackingApi = ({baseUrl, trackingData}) => {
    let url = `${baseUrl}`
    return api.post(url, trackingData )
  }

  const deleteTrackingApi = ({baseUrl, trackingId,babyId}) => {
    let url = `${formatString(baseUrl,trackingId,babyId)}`
    return api.delete(url)
  }

  const deleteMotherTrackingApi=({baseUrl, trackingId,babyId})=>{
    let url = `${formatString(baseUrl,trackingId)}`
    return api.delete(url)
  }
  const getTrackingData = ({baseUrl, startDate,endDate,babyId,page,perPage,trackingType}) => {
    let url = `${baseUrl}`
    if (page) {
      url = addParam(url, 'page', page)
    }
    if (perPage) {
      url = addParam(url, 'perPage', perPage)
    }
    if (startDate) {
      url = addParam(url, 'startDate', startDate)
    }
    if (endDate){
      url = addParam(url, 'endDate', endDate)
    }
    if (babyId){
      url = addParam(url, 'babyId', babyId)
    }
    if(trackingType){
      url = addParam(url, 'trackingType', trackingType)

    }
    console.log('url--',url)
    return api.get(url)
  }

  const createBottleApi = ({baseUrl,createBottleData}) => {
    let url = `${baseUrl}rest/virtualFreezer`
    return api.post(url,createBottleData)
  }

  const getFreezerInventoryApi = ({baseUrl, page,perPage,startDate,endDate,}) => {
    let url = `${baseUrl}`
    if (page) {
      url = addParam(url, 'page', page)
    }
    if (perPage) {
      url = addParam(url, 'perPage', perPage)
    }
    if (startDate) {
      url = addParam(url, 'startDate', startDate)
    }
    if (endDate){
      url = addParam(url, 'endDate', endDate)
    }
    return api.get(url)
  }


  const deleteFreezerInventoryApi = ({baseUrl}) => {
    let url = `${formatString(baseUrl)}`
     return api.delete(url)
  }

  const getMotherTrackingData = ({baseUrl, startDate,endDate,babyId,page,perPage}) => {
    let url = `${baseUrl}`
    if (page) {
      url = addParam(url, 'page', page)
    }
    if (perPage) {
      url = addParam(url, 'perPage', perPage)
    }
    if (startDate) {
      url = addParam(url, 'startDate', startDate)
    }
    if (endDate){
      url = addParam(url, 'endDate', endDate)
    }
    console.log('motherTrackingurl--',url)
    return api.get(url)
  }

  const exportTrackingApi = ({baseUrl, trackingData}) => {
    let url = `${baseUrl}`
    console.log(url)
    return api.post(url, trackingData)
  }

  const getBreastfeedingConfidenceApi = ({baseUrl, locale}) => {
    let url=formatString(baseUrl,locale)
    return api.get(url)
  }

  const bcaQuestionnaires = ({baseUrl, locale, questionId}) => {
    let hostUrl=formatString(baseUrl,locale)
    let url = `${hostUrl}?questionnaireId=${questionId}`
    return api.get(url)
  }

  const breastfeedingConfidenceApi = ({baseUrl, locale, trackingData}) => {
    let url = `${formatString(baseUrl,locale)}`
    return api.post(url, trackingData)
  }

  const getContentPersonalizationApi = ({baseUrl, locale}) => {
    let url = formatString(baseUrl,locale)
    //`${baseUrl}rest/contentPersonalization/${locale}`
    return api.get(url)
  }
  const contentPersonalizationApi = ({baseUrl, locale, trackingData}) => {
    let url =formatString(baseUrl,locale)
    //`${baseUrl}rest/contentPersonalization/${locale}/answer`
    return api.post(url, trackingData)
  }
  const deleteBaby= ({baseUrl, babyId})=>{
    let url = `${baseUrl}/babyId/${babyId}`
    return api.delete(url)
  }
  const deleteBabyImage= ({baseUrl, babyId})=>{
    let url =formatString(baseUrl,babyId)
    //`${baseUrl}rest/baby/picture/${babyId}`
    return api.delete(url)
  }
  const signOut = ({ baseUrl }) => {
    let url = baseUrl
    return api.get(url)
  }

  const sendFeedback = ({feedback, baseUrl}, headers) => {
    let url = `${baseUrl}`
    return api.post(url, feedback, { headers })
  }

  const getPumpList = ({ baseUrl }) => {
    let url = `${baseUrl}`
    return api.get(url)
  }

  const addPump = ({baseUrl, pumpData}) => {
    let url = `${baseUrl}`
    return api.post(url, pumpData)
  }

  const deletePump = ({baseUrl, pumpId}) => {
    let url = `${formatString(baseUrl,pumpId)}`
    return api.delete(url)
  }

  const getArticles = ({baseUrl, locale, articleId, page, perPage}) => {
    let url=`${formatString(baseUrl,locale,articleId)}?page=${page}&perPage=${perPage}`
    //let url = `${baseUrl}rest/article/${locale}/${articleId}?page=${page}&perPage=${perPage}`
    return api.get(url)
  }

  const getArticleDetail = ({baseUrl, locale, articleId}) => {
    let url=formatString(baseUrl,locale,articleId)
    //let url = `${baseUrl}rest/article/${locale}/${articleId}`
    return api.get(url)
  }

  const markFavoriteArticle = ({baseUrl, locale, articleId}) => {
    let url=formatString(baseUrl,locale,articleId)
    //let url = `${baseUrl}rest/article/${locale}/${articleId}`
    return api.post(url)
  }

  const getFavouriteArticles = ({baseUrl, locale, page=1, perPage=10}) => {
    //let url=formatString(baseUrl,locale,articleId)
    let url = `${formatString(baseUrl,locale)}?page=${page}&perPage=${perPage}`
    return api.get(url)
  }

  const problemSolver = ({baseUrl, locale, page=1, perPage=10}) => {
    let url = `${formatString(baseUrl,locale)}?page=${page}&perPage=${perPage}`
    return api.get(url)
  }

  const badSessionArticles = ({baseUrl, locale, page=1, perPage=10}) => {
    let url = `${formatString(baseUrl,locale)}?page=${page}&perPage=${perPage}`
    return api.get(url)
  }

  const motherTrackingApi = ({baseUrl, trackingData}) => {
    let url = `${baseUrl}`
    return api.post(url, trackingData )
  }

  const optedApi = ({baseUrl, data}) => {
    let url = `${baseUrl}`
    return api.post(url, data )
  }

  const getOptedApi = ({baseUrl}) => {
    let url = `${baseUrl}`
    return api.get(url)
  }

  const pumpQuestion = ({baseUrl, data}) => {
    let url = `${baseUrl}`
    return api.post(url, data )
  }

  const getPromoBannerApi = ({baseUrl, locale}) => {
    let url = `${formatString(baseUrl,locale)}`
    return api.get(url)
  }

  const validateAddressApi = ({baseUrl, data}) => {
    let url = `${baseUrl}`
    return api.post(url, data )
  }

  const changePassword = ({casUrl, email, oldPwd, newPwd}) => {
    let url=`${casUrl}/v1/reset?email=${email}&oldpwd=${oldPwd}&newpwd=${newPwd}&callback=grepStatus`
    return api.get(url)
  }

  const vipPackApi = ({baseUrl,data}) => {
    let url = `${baseUrl}`
    return api.post(url,data)
  }

  return {
    getConfig,
    getUserAvailable,
    getSignUp,
    addProfile,
    getTimeSlices,
    addBabyName,
    uploadBabyPic,
    getMyBabies,
    getMyProfile,
    getBabyImage,
    trackingApi,
    getTrackingData,
    getMotherTrackingData,
    exportTrackingApi,
    getBreastfeedingConfidenceApi,
    breastfeedingConfidenceApi,
    bcaQuestionnaires,
    getContentPersonalizationApi,
    contentPersonalizationApi,
    deleteBaby,
    deleteBabyImage,
    getLoginAPI,
    getLoginToken,
    forgotPasswordAPI,
    switchBabyClientId,
    deleteTrackingApi,
    deleteMotherTrackingApi,
    signOut,
    sendFeedback,
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
    optedApi,
    getOptedApi,
    pumpQuestion,
    getPromoBannerApi,
    createBottleApi,
    getFreezerInventoryApi,
    deleteFreezerInventoryApi,
    validateAddressApi,
    changePassword,
    vipPackApi
  }
}

export default {
  create
}
