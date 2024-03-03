const KeyUtils = {
  BABY_ID: 'baby_id',

  PACIFY_TOKEN:'pacify_token',

  ENTER_TIMESTAMP: 'enter_time',

  //-- Keys for sleep screen
  START_TIMESTAMP_SLEEP: 'start_time_sleep',
  IS_TIME_ACTIVE_SLEEP: 'is_time_active_sleep',
  TOTAL_TIME_OF_TIMER_SLEEP:'total_time_of_timer_sleep',
  SAVED_SLEEP_TIMER: 'is_sleep_saved',
  DETAINED_CALENDAR_VALUE_SLEEP:'detained_calendar_value_sleep',


  //-- Keys for BreastFeeding screen for left timer
  IS_LEFT_TIMER_STARTED: 'left_timer_started',
  TOTAL_TIME_OF_TIMER_BFnP_LEFT:'total_time_of_timer_bf_left',
  START_TIMESTAMP_BFnP_LEFT: 'start_time_left',
  IS_TIME_ACTIVE_BFnP_LEFT: 'is_time_active_left',


  //-- Keys for BreastFeeding screen for left timer
  IS_P_TIMER_STARTED: 'p_timer_started',
  START_TIMESTAMP_P: 'start_time_p',
  IS_TIME_ACTIVE_P: 'is_time_active_p',

/*  //-- Keys for BreastFeeding screen for left & Right timer
  START_TIMESTAMP_BF_LEFT: 'start_bf_time_left',
  IS_TIME_ACTIVE_BF_LEFT: 'is_bf_time_active_left',
  START_TIMESTAMP_BF_RIGHT: 'start_bf_time_right',
  IS_TIME_ACTIVE_BF_RIGHT: 'is_time_bf_active_right',
  LEFT_BF_TIMER_VALUE: 'left_bf_timer_value',
  RIGHT_BF_TIMER_VALUE: 'right_bf_timer_value',

  //-- Keys for pumping screen for left & Right timer
  START_TIMESTAMP_P_LEFT: 'start_p_time_left',
  IS_TIME_ACTIVE_P_LEFT: 'is_p_time_active_left',
  START_TIMESTAMP_P_RIGHT: 'start_p_time_right',
  IS_TIME_ACTIVE_P_RIGHT: 'is_time_p_active_right',
  LEFT_P_TIMER_VALUE: 'left_p_timer_value',
  RIGHT_P_TIMER_VALUE: 'right_p_timer_value',*/


  //-- Keys for BreastFeeding screen for right timer
  IS_RIGHT_TIMER_STARTED: 'right_timer_started',
  TOTAL_TIME_OF_TIMER_BFnP_RIGHT:'total_time_of_timer_bf_right',
  START_TIMESTAMP_BFnP_RIGHT: 'start_time_right',
  IS_TIME_ACTIVE_BFnP_RIGHT: 'is_time_active_right',

  PAUSE_LEFT_TIMER: 'pause_timer_left',
  PAUSE_RIGHT_TIMER: 'pause_timer_right',
  PAUSE_SLEEP_TIMER: 'pause_timer_sleep',

  LEFT_TIMER_VALUE: 'left_timer_value',
  RIGHT_TIMER_VALUE: 'right_timer_value',
  SLEEP_TIMER_VALUE: 'sleep_timer_value',
  PUMPING_TIMER_VALUE:'p_timer_value',

  RESET_TIMER: 'reset_timer',
  P_RESET_TIMER: 'p_reset_timer',
  USER_LAST_EMAIL: 'user_last_email',
  USER_LAST_PASSWORD: 'user_last_password',
  SLEEP: 'sleep',
  BFnP_LEFT: 'bf_left',
  BFnP_RIGHT: 'bf_right',
  CONTRACTIONS: 'contractions',
  PUMPING: 'pumping',

  BF_SESSION_TYPE: 'bf_session_type',
  VOLUME_NEVER_SHOW_AGAIN:'never_show_again',
  PUMP_COMPLETE_NEVER_SHOW_AGAIN:'pump_complete_never_show_again',
  BOTH_TIMER_ACTIVE:'both_timer_active',

  //Tracking keys
  TRACKING_TYPE_BREASTFEEDING:1,
  TRACKING_TYPE_PUMPING:2,
  TRACKING_TYPE_BOTTLE:3,
  TRACKING_TYPE_DIAPER:4,
  TRACKING_TYPE_SLEEP:5,
  TRACKING_TYPE_WEIGHT:6,
  TRACKING_TYPE_GROWTH:7,
  TRACKING_TYPE_CONTRACTION:8,
  TRACKING_TYPE_SELECT_ALL:'select_all',
  // FIRSTDAY_NAPPY_NOTIFICATION: 'firstday_nappy_notification',
  // THIRDDAY_NAPPY_NOTIFICATION: 'thirdday_nappy_notification',
  // FOURTHDAY_NAPPY_NOTIFICATION: 'fourthday_nappy_notification',
  // FOURWEEKS_NAPPY_NOTIFICATION: 'fourweeks_nappy_notification',
  // SIXWEEKS_NAPPY_NOTIFICATION: 'sixweeks_nappy_notification',
  // WET_NAPPY_NOTIFICATION: 'wet_nappy_notification',
  // WET_NAPPY_WEEK6_NOTIFICATION : 'wet_nappy_week6_notification',
  // FEEDING_PUMPING_NOTIFICATION: "breastfeeding_pumping_notification",
  // FEEDING_PUMPING_NOTIFICATIONS: "breastfeeding_pumping_notifications",
  // NAPPY_NOTIFICATIONS: "nappy_notifications",
  // FEEDING_PUMPING_5HRS_NOTIFICATION: "breastfeeding_pumping_5hrs_notification",
  // FEEDING_PUMPING_7HRS_NOTIFICATION: "breastfeeding_pumping_7hrs_notification",
  SCHEDULED_NOTIFICATIONS: 'scheduled_notifications',
  NEVER_SHOW_BABY_BIRTHDAY_NOTIFICATION: 'never_show_notification',
  BCA_BEFORE_BIRTH_NOTIFICATION: "bca_before_birth_notification",
  BCA_AFTER_BIRTH_NOTIFICATION: "bca_after_birth_notification",
  CP_NOTIFICATION_FIREDATE: "cp_notification_firedate",
  BCA_POPUP_FIRETIME: "bca_popup_firetime",
  // WEIGHT_NOTIFICATION: "weight_notification",
  // HEIGHT_NOTIFICATION: "height_notification",
  // DIAPER_NOTIF: "diaper_notif",
  // BREASTFEEDING_PUMPING_NOTIF: "breastfeeding_pumping_notif",
  BCA_POPUP_NOTIF: "bca_popup_notif",
  CP_POPUP_NOTIF: "cp_popup_notif",
  BIRTHDAY_POPUP_NOTIF: "birthday_popup_notif",
  VIRTUAL_FREEZER_CONGRTS: "virtual_freezer_popup",
  VIRTUAL_FREEZER_CONGRTS_NOTIF: 'virtual_freezer_popup_notif',
  VIRTUAL_FREEZER1_NOTIFS: 'virtual_freezer1_notifs',
  VIRTUAL_FREEZER2_NOTIFS: 'virtual_freezer2_notifs',
  MILK_ABOUT_TO_EXPIRE_NOTIF: 'milk_about_to_expire',
  MILK_EXPIRE_NOTIF: 'milk_expire_notif',
  //Only medela pump will scan
  MEDELA_PUMP_SERVICE_UUID : "0000fee7-0000-1000-8000-00805f9b34fb",
  MEDELA_PUMP_SERVICE_UUID_OLD : "2e0f0000-1893-474e-b1de-00001ade3e00",
  //Battery Info UUIDs
  BATTERY_SERVICE_UUID : "0000180f-0000-1000-8000-00805f9b34fb",
  BATTERY_LEVEL_UUID : "00002a19-0000-1000-8000-00805f9b34fb",
  NOTIF_PERMISSIONS: 'notification_permissions',
  //Device Info UUIDs
  DEVICE_INFORMATION_SERVICE_UUID : "0000180a-0000-1000-8000-00805f9b34fb",
  MODEL_NUMBER_UUID  : "00002a24-0000-1000-8000-00805f9b34fb",// Sonata - modelNumber
  SERIAL_NUMBER_UUID : "00002a25-0000-1000-8000-00805f9b34fb",// P1914188470 - serialNumber
  FIRMWARE_REVISION_UUID  : "00002a26-0000-1000-8000-00805f9b34fb",// 1.4.5.5973 - firmwareRevision
  HARDWARE_REVISION_UUID : "00002a27-0000-1000-8000-00805f9b34fb",// 1.4.5.5973 - hardwareRevision
  SOFTWARE_REVISION_UUID : "00002a28-0000-1000-8000-00805f9b34fb",// 1.6 - softwareRevision
  MANUFACTURER_NAME_UUID : "00002a29-0000-1000-8000-00805f9b34fb", // medela
  SYSTEM_ID_UUID : "00002a23-0000-1000-8000-00805f9b34fb", // D43639R1DCAC - pumpId
  REGULATORY_CERTIFICATION_DATA_LIST_UUID  : "00002a2a-0000-1000-8000-00805f9b34fb",
  PNP_ID_UUID  : "00002a50-0000-1000-8000-00805f9b34fb",

  //Active session info
  // ACTIVE_SESSION_SERVICE_UUID : "6b180000-9faf-4449-b99b-00001ade3e00",
  ACTIVE_SESSION_CURRENT_TIMER_CHARACTERISTIC_UUID : "6b180100-9faf-4449-b99b-00001ade3e00",
  ACTIVE_SESSION_PUMP_LEVEL_CHARACTERISTIC_UUID : "6b180200-9faf-4449-b99b-00001ade3e00",
  ACTIVE_SESSION_RHYTHEM_LEVEL_CHARACTERISTIC_UUID : "6b180300-9faf-4449-b99b-00001ade3e00",
  ACTIVE_SESSION_PHASE_LEVEL_CHARACTERISTIC_UUID : "6b180400-9faf-4449-b99b-00001ade3e00",
  ACTIVE_SESSION_GOAL_TIME_CHARACTERISTIC_UUID : "6b180600-9faf-4449-b99b-00001ade3e00",

  //Device state and alert info
  DEVICE_STATE_SERVICE_UUID : "90700000-9faf-4449-b99b-00001ade3e00",
  DEVICE_SESSION_STATE_CHARACTERISTIC_UUID : "90700200-9faf-4449-b99b-00001ade3e00",
  DEVICE_ALERT_STATE_CHARACTERISTIC_UUID : "90700300-9faf-4449-b99b-00001ade3e00",

  //Power into
  POWER_SERVICE_UUID : "7ee20000-9faf-4449-b99b-00001ade3e00",
  POWER_CONNECTED_CHARACTERISTIC_UUID : "7ee20200-9faf-4449-b99b-00001ade3e00",
  BATTERY_CHARGING_CHARACTERISTIC_UUID : "7ee20100-9faf-4449-b99b-00001ade3e00",

  //Ble device ackowledge
  MEDELA_MIDIAS_SERICE_UUID : "2e0f0000-1893-474e-b1de-00001ade3e00",
  MEDELA_MIDIAS_SERICE_UUID_SONATA : "2e0f0000-1893-474e-b1de-00001ade3e00",
  MEDELA_MIDIAS_CHARACTERISTIC_UUID : "f6710100-9faf-4449-b99b-00001ade3e00",
  SONATA_PAIRING_CONFIRMATION_MAGIC_NUMBER : "A5",
  MEDELA_MIDIAS_SERICE_UUID_FLEX : "ca710000-12e9-48cb-80d7-00001ade3e00",

  //BLE device session
  SESSION_HISTORY_SERVICE_UUID: "4ed10000-9faf-4449-b99b-00001ade3e00",
  RACP_CHARACTERISTIC_UUID: "4ed10100-9faf-4449-b99b-00001ade3e00", //Read access
  SESSION_HISTORY_RECORDS_CHARACTERISTIC_UUID: "4ed10200-9faf-4449-b99b-00001ade3e00",
  OP_CODE_REPORT_STORED_RECORDS: "31",
  PUMP_OPERATOR_LAST_RECORD: [1, 6],
  PUMP_OPERATOR_ALL_RECORD: [1, 1],
  ACTIVE_SESSION_SERVICE_UUID: "6B180000-9FAF-4449-B99B-00001ADE3E00",
  ACTIVE_SESSION_RECORD_INDEX_UUID: "6B180800-9FAF-4449-B99B-00001ADE3E00",

  //Time stamp
  TIME_SERVICE_UUID: "BCD30000-9FAF-4449-B99B-00001ADE3E00",
  TIME_CHARACTERISTICS_UUID: "BCD30100-9FAF-4449-B99B-00001ADE3E00",

  //Flex pump charactertics
  CLIENT_CHARACTERISTIC_CONFIG : "00002902-0000-1000-8000-00805f9b34fb",
  SERVICE_MEDELA_DEVICE_COMMUNICATION : "00000000-ad0f-4013-9374-00001ade3e00",
  CHARACTERISTIC_MDC_DOWNSTREAM : "00000002-ad0f-4013-9374-00001ade3e00",
  CHARACTERISTIC_MDC_UPSTREAM : "00000003-ad0f-4013-9374-00001ade3e00",
  PUMP_OPERATOR_LAST_RECORD_FLEX: [131, 16, 1, 6, 0, 0],
  PUMP_OPERATOR_ALL_RECORD_FLEX: [131, 16, 1, 1, 0, 0],

  TEST_TYPE_BREASTFEEDING_CONFIDENCE: 'breastfeedingConfidence',
  TEST_TYPE_CONTENT_PERSONALISATION: 'contentPersonalization',

  MORE_TYPE_MOTHER_INFO: 'motherInformation',
  MORE_TYPE_BABY_INFO: 'babyInformation',
  MORE_TYPE_PUMP_SETTINGS: 'pumpSettings',
  MORE_TYPE_STORE_LOCATOR: 'storeLocator',
  MORE_TYPE_SHARE_APP: 'shareApp',
  MORE_TYPE_FEEDBACK: 'giveUsFeedback',
  MORE_TYPE_HELP: 'help',
  MORE_TYPE_SETTINGS: 'settings',
  MORE_TYPE_LEGAL: 'legal',
  MORE_TYPE_ONLINE_SHOP: 'onlineShop',
  MORE_TYPE_VIP_PACK: 'vipPack',
  VIP_STATUS: 'vip_status',

  HELP_TYPE_PROBLEM_SOLVER: "problemSolver",
  HELP_TYPE_FAQ: "frequentlyAskedQuestions",
  HELP_TYPE_APP_TECHNICAL_SUPPORT: "appTechnicalSupport",
  HELP_TYPE_CUSTOMER_SERVICE: "customerService",
  HELP_TYPE_LACTATION_CONSULTANT: "lactationConsultant",

  LEGAL_TYPE_PRIVACY_TERMS_AND_CONDITION: "privacyPolicyTermsAndCondition",
  LEGAL_TYPE_LICENSES: "licenses",
  LEGAL_TYPE_IMPRINT: "Imprint",

  PACK_TYPE_VOICE_CONTROL: "voiceControl",
  PACK_TYPE_DARK_MODE: "darkMode",

  SETTINGS_LANGUAGE: 'Language',
  SETTINGS_NOTIFICATION: 'Notification',
  SETTINGS_MEASUREMENTS: 'Measurements',

  SELECTED_AVATAR: 'selected_avatar',
  SAMIRA: 'samira',
  ZOE: 'zoe',
  MEI: 'mei',
  AURORA: 'aurora',
  FARRAH: 'farrah',
  LUNA: 'luna',
  JULIA: 'julia',
  JAHMELIA: 'jahmelia',

  SELECTED_LANGUAGE: "selected_language",

  // If SELECTED_LANGUAGE_LOCALE,DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP updated then it needs to be updated in appdelegate.m and mainApplication.java file as well
  SELECTED_LANGUAGE_LOCALE: "selected_language_locale",
  DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP:"device_lang_when_changed_from_app",
  APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN:'app_visibility_changed_at_the_time_of_signup_or_login',
  ENGLISH: "english",
  DANSK_DENMARK: "Dansk_Denmark",
  DEUTSCHE_NETHERLANDS: "Deutsche_Netherlands",
  DEUTSCHE_SWITZERLAND: "Deutsche_Switzerland",
  DEYTSCHE_GERMANY: "Deytsche_germany",
  DUTCH_NETHERLANDS: "Dutch",
  ENGLISH_AUSTRALIA: "English_Australia",
  ENGLISH_INDIA: "English_India",
  ENGLISH_IRELAND: "English_Ireland",
  ENGLISH_ISRAEL: "English_Israel",
  ENGLISH_MALAYSIA: "English_Malaysia",
  ENGLISH_NEWZEALAND: "English_Newzealand",
  ENGLISH_SINGAPORE: "English_singapore",
  ENGLISH_SOUTHAFRICA: "English_Southafrica",
  ENGLISH_UK: "English_uk",
  ENGLISH_UNITEDSTATES: "English_unitedstates",
  ESPANOL_SPAIN: "Espanol_spain",
  FRANCAIS_CANADA: "Francais_canada",
  FRANCAIS_FRANCE: "Francais_france",
  FRANCAIS_NETHERLANDS: "Francais_netherlands",
  FRANCAIS_SWITZERLAND: "Francais_switzerland",
  ITALIANO_SWITZERLAND: "Italiano_switzerland",
  ITANIAN_ITALY: "Itaniana_italy",
  NORSK_NORWAY: "Norsk_norway",
  PORTUGAL: "portugal",
  RUSSIA: "Russia",
  SVENSKA_SWEDEN: "Svenska_sweden",
  POLISH: "Polish",

  CONNECTED_DEVICE: "device",
  CONNECTED_DEVICE_ID: "device_id",


  //-- Keys for Contractions
  IS_FREQUENCY_TIMER_STARTED: 'frequency_started',
  FREQUENCY_TIMER_VALUE:'frequency_timer_value',
  IS_DURATION_TIMER_STARTED: 'duration_started',
  DURATION_TIMER_VALUE:'duration_timer_value',
  START_TIMESTAMP_DURATION: 'start_time_duration',
  IS_TIME_ACTIVE_DURATION: 'is_time_active_duration',
  START_TIMESTAMP_FREQUENCY: 'start_time_frequency',
  IS_TIME_ACTIVE_FREQUENCY: 'is_time_active_frequency',
  IS_THIS_FIRST_SESSION: 'first_session',

  PUMP_RECORD_ID: 'pump_record_id',
  SAVED_MARKET:'saved_market',
  SELECTED_LOCALE:'selected_locale',
  SELECTED_TIME_ZONE:'selected_timezone',
  USER_NAME:'user_name',
  SELECTED_TAB_NAME:'selected_tab_name',

  //markets
  CANADA_MARKET:'MCAN_B2C',
  US_MARKET:'MINC_B2C',
  MEXICO_MARKET:'INT_B2C',
  INT_MARKET:'INT_B2C',
  //
  BACKGROUND_TIME_STAMP: 'background_time',

  DONE_BUTTON_ID: "done_button",

  //Measurements
  UNITS:'units',
  UNIT_IMPERIAL:'imperial',  // standard US
  UNIT_METRICAL:'metrical',
  UNIT_KG:'Kg',
  UNIT_GRAM:'gram',
  UNIT_CM:'cm',
  UNIT_MM:'mm',
  UNIT_INCH:'inch',
  UNIT_LB:'lb',

  // Bottle Tracking
  IS_VIRTUAL_FREEZER:'is_virtual_freezer',
  // BreastFeeding & Pumping Screen
  PUMPING_IS_VIRTUAL_FREEZER:'pumping_is_virtual_freezer',
  DETAINED_CALENDAR_VALUE_BREASTFEEDING:'detained_calendar_value_breastfeeding',
  DETAINED_CALENDAR_VALUE_WITHOUT_PUMPING:'detained_calendar_value_without_pumping',
  NEVER_SHOW_BAD_ARTICLES:'never_show_bad_articles',
  //Siri Last Session
  LAST_SIRI_SESSION:'last_session',

  //
  IS_CUSTOM_POPUP_SHOWN:'false',
  // Pump Name Key
  FLEX_PUMP:'flex_pump',
  SONATA_PUMP:'sonata_name',

  //First Login
  IS_FIRST_LOGIN_COMPLETED:'first_login',

  //Firebase
  On_Press:'button_click',

  //Update PopUp
  Last_Remind_Timestamp:'last_reminded_timestamp',
  //Tracking
  IS_BOTH_BF_SELECTED:'is_both_bf_selected'
};

export default KeyUtils;
