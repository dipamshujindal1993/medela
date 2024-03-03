import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')
const APP_SCHEME = 'medelafamily://'
const TAB_IDS = {
  TAB_MY_BABY: 1,
  TAB_STATS:2,
  TAB_MY_LIST: 3,
  TAB_CHAT: 4,
  TAB_MORE: 5,
}

const constants = Object.assign(TAB_IDS, {
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  // BASE_URL:'https://dev-mymedela-api.medela.com/5f8d5917c2f956012329d022/',//2.0
  BASE_URL:'https://dev-mymedela-api.medela.com/5dd73d254b8dd0280539e3f2/',// 1.0
  // BASE_URL:'https://quality-mymedela-api.medela.com/5eaa86d304e3ed0ab0052092/',// Stage URL
  //BASE_URL:'https://mymedela-api.medela.com/5ee0b9233307797f494b6432/', // production_URL
  VALIDATE_ADDRESS_URL:'https://review.medela.us/mbus/services/address/validate', //DEV
  //VALIDATE_ADDRESS_URL:'https://stage.medela.us/mbus/services/address/validate', // STAGE
  //VALIDATE_ADDRESS_URL:'https://medela.us/mbus/services/address/validate', //PRODUCTION
  PACIFY_DEV : "9e11edf553284484bb63fb96e6f54fbc",
  PACIFY_QA : "9e11edf553284484bb63fb96e6f54fbc"  ,
  PACIFY_STAGE: "95e62d70b0fc432d850a040bf070f084",
  PACIFY_PROD : "428e4251f4064cd39b956f66e878200f",
  APPS_FLYER_TOKEN:'Rx3ukzQ7H5WP5BUVCzYJxR',  // same for all insatances
  APP_ID_IOS:'id969481530', // debug,qa
  //APP_ID_IOS:'id997674995', // stage
  //APP_ID_IOS:'id909275386', // production
  APP_ID_ANDROID:'com.medela.mymedela.v.debug',  // debug
  //APP_ID_ANDROID:'com.medela.mymedela.qa',  // QA
  //APP_ID_ANDROID:'com.medela.mymedela.stage',  // stage
  //APP_ID_ANDROID:'com.medela.mymedela.live', // production
  DEFAULT_HOME_TABS: [
    {
      id: TAB_IDS.TAB_MY_BABY,
      title: 'MY BABY',
    },
    {
      id: TAB_IDS.TAB_STATS,
      title: 'STATS',
    },
    {
      id: TAB_IDS.TAB_MY_LIST,
      title: '  ',
    },
    {
      id: TAB_IDS.TAB_CHAT,
      title: 'CHAT',
    },
    {
      id: TAB_IDS.TAB_MORE,
      title: 'MORE',
    },
  ],
  CALLBACK_GRAP_TICKET: 'grepTicket',
  MOM_NAME:'Mom',
  BABY_NAME:'Baby 1',
  PUMP_PHASE: [
    "Stimulation",
    "Expression"
  ],
  PUMP_RHYTHEM: [
    "Signature",
    "Lifestyle"
  ],
  OPEN_EXTERNAL: `${APP_SCHEME}openexternal`,
  OPEN_WEBVIEW: `${APP_SCHEME}openwebview`,
  OPEN_SCREEN: `${APP_SCHEME}open`,

  //Firebase analytics
  //Screen view:-
  //Registration and Login:
  START_SCREEN : 'StartScreen',
  SIGN_UP_SCREEN : 'SignUpScreen',
  LOGIN_1_SCREEN : 'LoginScreen1',
  PROFILE_SETUP_SCREEN : 'ProfileSetupScreen',
  OPTED_SCREEN : 'OptedSetupScreen',
  WELCOME_SCREEN : 'WelcomeScreen',
  //My Baby:
  MY_BABY_SCREEN : 'MyBabyScreen',
  //Stats:
  STATS_SCREEN : 'StatsScreen',
  STATS_EXPORT_LIST_SCREEN : 'StatsExportListScreen',
  CHAT_SCREEN : 'ChatScreen',
  //MoreScreen:
  PUMP_SETUP_SCREEN : 'PumpSetupScreen',
  HELP_SCREEN : 'HelpScreen',
  PROBLEM_SOLVER_SCREEN : 'ProblemSolver',
  MOTHER_INFO_SCREEN : 'MotherInfoScreen',
  MORE_PUMP_LIST_SCREEN : 'MorePumpListScreen',
  FEEDBACK_SCREEN : 'Feedback',


  //Events:-
  //Registration and Login:
  SIGN_UP_PRESS : 'sign_up',
  LOGIN_SUCCESS : 'Users successfully logging in',
  SIGN_UP_SUCCESS : 'Users successfully creating an account by market',
  PROFILE_DATA_ADDED : 'Users successfully entering name and birth/due date',
  ALREADY_HAVE_ACCOUNT_PRESS : 'login',

  //Last tracked:
  LAST_TRACKED_PRESS : 'last_tracked_sessions',
  //Connectivity:
  START_PUMP_PAIRING_FROM_MY_BABY : 'connect_pump_from_my_baby_screen',
  START_PUMP_PAIRING_FROM_SETTING : 'connect_pump_from_pump_tracking',
  START_PUMP_PAIRING_FROM_PUMPING_SCREEN : 'connect_pump_from_tracking_screen',
  PAIR_SUCCESSFULLY : 'successful_pairing',
  CONNECT_SUCCESSFULLY : 'successful_connection',
  SESSION_COMPLETE_WITH_SONATA : 'Users successfully finishing a connectivity pump session with Sonata',
  SESSION_COMPLETE_WITH_FLEX : 'Users successfully finishing a connectivity pump session with Freestyle Flex',
  SESSION_COMPLETE_WITH_MAXI : 'Users successfully finishing a connectivity pump session with Swing Maxi',
  //Tracking:
  SAVE_DIAPERS_TRACKING : 'diapers',
  SAVE_BOTTLE_TRACKING : 'bottle',
  SAVE_SLEEP_TRACKING : 'sleep',
  SAVE_LENGTH_TRACKING : 'length',
  SAVE_WEIGHT_TRACKING : 'weight',
  SAVE_BREASTFEEDING_TRACKING : 'breastfeeding',
  SAVE_PUMPING_TRACKING : 'pumping',
  SAVE_CONTRACTION_TRACKING : 'contractions',
  //Virtual Freezer:
  SAVE_MILK_TO_VMS_IN_PUMPING_SESSION : 'Users saving successfully milk in Pumping session to Virtual Milk Storage',
  USING_MILK_FROM_VMS_IN_BOTTLE_FEEDING_SESSION : 'Users using milk from Virtual Milk Storage in Bottle feeding session',
  //Questionnaires:
  COMPLETING_BREASTFEEDING_CONFIDENCE_TEST : 'Users completing Breastfeeding Confidence test',
  COMPLETING_CONTENT_PERSONALIZATION_TEST : 'Users completing Content Personalization test',
  //Checklists:
  COMPLETING_CHECKLIST_ITEM : 'Users completing checklist item',
  ADDING_CUSTOM_CHECKLIST_ITEM : 'Users adding custom checklist item',
  //Chat bot:
  SENDING_MESSAGE_TO_CHATBOT : 'Users sending a message to Chatbot',
  CHATBOT_AVATAR_SELECTED : 'Chatbot avatar selected',
  //Pacify:
  COMPLETED_PACIFY_CALL : 'User completed a Pacify 24/7 call',
  //Stats:
  EXPORTING_DATA_IN_STATS : 'Users successfully exporting data in the stats',
  FILTER_APPLIED : 'Filter applied',
  //More:
  APP_SHARING_FROM_MORE_SCREEN : 'Users sharing the app in the more page',
  PRESSED_STORE_LOCATOR_IN_MORE_SCREEN : 'Users using the store locator button in the more page',
  NEW_BABY_CREATED : 'New baby created',

  TRACKINGS : 'tracking',
  TRACKING_TYPE : 'tracking_type',
  PUMP_TYPE : 'pump_type',
  PUMP_TRACKING : 'pump_tracking',
  QUESTIONNAIRE_INTERACTION : 'questionnaire_interaction',
  CHECKLIST_MANAGEMENT : 'checklist_management',
  CONTENT_INTERACTION : 'content_interaction',
  PACIFY: 'pacify',
  CHAT: 'chatbot_interaction',
  SHARE: 'share',
  STORE_LOCATOR: 'store_locator',
  USER_TYPE: 'user_type',
  SUCCESSFUL_CONNECTION: 'successful_connection',
  PUMP_USER: 'pump_user',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  FEEDBACK: 'button_click',
  VIRTUAL_FREEZER: 'virtual_freezer'
})

export default constants
