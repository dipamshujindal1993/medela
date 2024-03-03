import I18n from '@i18n';

let LicensesData = {
  "data":[
    {
      id: 1,
      libraryName: "redux",
      authorName: "Dan Abramov",
      version: "4.0.5",
      description: "Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. On top of that, it provides a great developer experience, such as live code editing combined with a time traveling debugger.",
      link: "https://www.npmjs.com/package/redux"
    },
    {
      id: 2,
      libraryName: "realm",
      authorName: "kraenhansen",
      version: "10.1.2",
      description: "Realm is a mobile database that runs directly inside phones, tablets or wearables.\n Realm is the first database built from the ground up to run directly inside phones, tablets and wearables. Realm is faster than even raw SQLite on common operations, while maintaining an extremely rich feature set.",
      link: "https://www.npmjs.com/package/realm"
    },
    {
      id: 3,
      libraryName: "apisauce",
      authorName: "Gant Laborde",
      version: "2.0.0",
      description: "Talking to APIs doesn't have to be awkward anymore. \n low-fat wrapper for the amazing axios http client library, all responses follow the same flow: success and failure alike responses have a problem property to help guide exception flow. Attach functions that get called each request. Attach functions that change all request or response data detects connection issues (on React Native) ",
      link: "https://www.npmjs.com/package/apisauce"
    },
    {
      id: 4,
      libraryName: "react-navigation",
      authorName: "Satyajit Sahoo",
      version: "4.4.3",
      description: "React Navigation is born from the React Native community's need for an extensible yet easy-to-use navigation solution based on JavaScript.",
      link: "https://www.npmjs.com/package/react-navigation"
    },
    {
      id: 5,
      libraryName: "react-redux",
      authorName: "Dan Abramov",
      version: "7.2",
      description: "React Redux is the official React binding for Redux. It lets your React components read data from a Redux store, and dispatch actions to the store to update data.",
      link: "https://react-redux.js.org/"
    },
    {
      id: 6,
      libraryName: "redux-saga",
      authorName: "Andarist",
      version: "1.1.3",
      description: "Redux Saga is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to execute, easy to test, and better at handling failures.",
      link: "https://redux-saga.js.org/"
    },
    {
      id: 7,
      libraryName: "react-native-svg",
      authorName: "Brent Vatne",
      version: "12.1.0",
      description: "react-native-svg provides SVG support to React Native on iOS and Android, and a compatibility layer for the web.",
      link: "https://www.npmjs.com/package/react-native-svg"
    },
    {
      id: 8,
      libraryName: "async-storage",
      authorName: "Brent Vatne",
      version: "1.12.1",
      description: "An asynchronous, unencrypted, persistent, key-value storage system for React Native.",
      link: "https://www.npmjs.com/package/@react-native-community/async-storage"
    },
    {
      id: 9,
      libraryName: "moment",
      authorName: "Iskren Ivov Chernev",
      version: "2.29.1",
      description: "Parse, validate, manipulate, and display dates and times in JavaScript.",
      link: "https://momentjs.com/"
    },
    {
      id: 10,
      libraryName: "react-native-i18n",
      authorName: "Matteo Mazzarolo",
      version: "2.0.15",
      description: "Uses the user preferred locale as default.",
      link: "https://www.npmjs.com/package/react-native-i18n"
    },
    {
      id: 11,
      libraryName: "react-native-video",
      authorName: "",
      version: "5.1.0-alpha8",
      description: "A <Video /> component for react-native",
      link: "https://www.npmjs.com/package/react-native-video"
    },
    {
      id: 12,
      libraryName: "react-native-webview",
      authorName: "Mike Diarmid",
      version: "11.0.2",
      description: "React Native WebView is a modern, well-supported, and cross-platform WebView for React Native. It is intended to be a replacement for the built-in WebView",
      link: "https://www.npmjs.com/package/react-native-webview"
    },
    {
      id: 13,
      libraryName: "reduxsauce",
      authorName: "Gant Laborde",
      version: "1.2.0",
      description: "Provides a few tools for working with Redux-based codebases.",
      link: "https://www.npmjs.com/package/reduxsauce"
    },
    {
      id: 14,
      libraryName: "react-native-ble-plx",
      authorName: "Polidea",
      version: "2.0.2",
      description: "This is React Native Bluetooth Low Energy library wrapping Multiplatform Ble Adapter.",
      link: "https://www.npmjs.com/package/react-native-ble-plx"
    },
    {
      id: 15,
      libraryName: "blur",
      authorName: "Alexey Kureev",
      version: "3.6.0",
      description: "A component for UIVisualEffectView's blur and vibrancy effect on iOS, and BlurView on Android.",
      link: "https://www.npmjs.com/package/@react-native-community/blur"
    },
    {
      id: 16,
      libraryName: "cameraroll",
      authorName: "Bartol Karuza",
      version: "4.0.2",
      description: "CameraRoll provides access to the local camera roll or photo library.",
      link: "https://www.npmjs.com/package/@react-native-community/cameraroll"
    },
    {
      id: 17,
      libraryName: "cookies",
      authorName: "Jason Safaiyeh",
      version: "5.0.1",
      description: "Cookie Manager for React Native.",
      link: "https://www.npmjs.com/package/@react-native-community/cookies"
    },
    {
      id: 18,
      libraryName: "geolocation",
      authorName: "React Native Community",
      version: "2.0.2",
      description: "React Native Geolocation Module for iOS and Android",
      link: "https://www.npmjs.com/package/@react-native-community/geolocation"
    },
    {
      id: 19,
      libraryName: "masked-view",
      authorName: "Mike Nedosekin",
      version: "0.1.10",
      description: "React Native MaskedView for iOS and Android",
      link: "https://www.npmjs.com/package/@react-native-community/masked-view"
    },
    {
      id: 20,
      libraryName: "netinfo",
      authorName: "Matt Oakes",
      version: "5.9.7",
      description: "React Native Network Info API for iOS & Android",
      link: "https://www.npmjs.com/package/@react-native-community/netinfo"
    },
    {
      id: 21,
      libraryName: "push-notification-ios",
      authorName: "Rafael Lincoln",
      version: "1.8.0",
      description: "React Native Push Notification API for iOS.",
      link: "https://www.npmjs.com/package/@react-native-community/push-notification-ios"
    },
    {
      id: 22,
      libraryName: "slider",
      authorName: "",
      version: "4.0.0-rc.1",
      description: "React Native component used to select a single value from a range of values.",
      link: "https://www.npmjs.com/package/@react-native-community/slider"
    },
    {
      id: 23,
      libraryName: "analytics",
      authorName: "Invertase",
      version: "11.3.2",
      description: "Analytics integrates across Firebase features and provides you with unlimited reporting for up to 500 distinct events that you can define using the Firebase SDK. Analytics reports help you understand clearly how your users behave, which enables you to make informed decisions regarding app marketing and performance optimizations.",
      link: "https://www.npmjs.com/package/@react-native-firebase/analytics"
    },
    {
      id: 24,
      libraryName: "react-native-firebase/app",
      authorName: "Invertase",
      version: "11.3.2",
      description: "React Native Firebase is a collection of official React Native modules connecting you to Firebase services; each module is a light-weight JavaScript layer connecting you to the native Firebase SDKs for both iOS and Android.",
      link: "https://www.npmjs.com/package/@react-native-firebase/app"
    },
    {
      id: 25,
      libraryName: "crashlytics",
      authorName: "Invertase",
      version: "11.3.2",
      description: "Firebase Crashlytics helps you track, prioritize, and fix stability issues that erode app quality, in realtime. Spend less time triaging and troubleshooting crashes and more time building app features that delight users.",
      link: "https://www.npmjs.com/package/@react-native-firebase/crashlytics"
    },
    {
      id: 26,
      libraryName: "remote-config",
      authorName: "Invertase",
      version: "11.3.2",
      description: "With Firebase Remote Config, you can change the behavior and appearance of your app on the fly from the Firebase console, and then track performance in Google Analytics for Firebase. Customize by audience segment, release new content, and split test to validate improvements, all without waiting for app store approval.",
      link: "https://www.npmjs.com/package/@react-native-firebase/remote-config"
    },
    {
      id: 27,
      libraryName: "buffer",
      authorName: "Feross Aboukhadijeh",
      version: "6.0.3",
      description: "The buffer module from node.js, for the browser.",
      link: "https://www.npmjs.com/package/buffer"
    },
    {
      id: 28,
      libraryName: "fbjs",
      authorName: "",
      version: "6.0.3",
      description: "To make it easier for Facebook to share and consume our own JavaScript.",
      link: "https://www.npmjs.com/package/fbjs"
    },
    {
      id: 29 ,
      libraryName: "moment-timezone",
      authorName: "Tim Wood",
      version: "0.5.32",
      description: "Parse and display moments in any timezone.",
      link: "https://www.npmjs.com/package/moment-timezone"
    },
    {
      id: 30 ,
      libraryName: "patch-package",
      authorName: "David Sheldrick",
      version: "6.2.2",
      description: "patch-package lets app authors instantly make and keep fixes to npm dependencies. It's a vital band-aid for those of us living on the bleeding edge.",
      link: "https://www.npmjs.com/package/patch-package"
    },
    {
      id: 31,
      libraryName: "querystringify",
      authorName: "Arnout Kazemier",
      version: "2.1.1",
      description: "Querystringify - Small, simple but powerful query string parser.",
      link: "https://www.npmjs.com/package/querystringify"
    },
    {
      id: 32,
      libraryName: "ramda",
      authorName: "Scott Sauyet",
      version: "0.27.1",
      description: "A practical functional library for JavaScript programmers.",
      link: "https://www.npmjs.com/package/ramda"
    },
    {
      id: 33,
      libraryName: "react",
      authorName: "",
      version: "16.13.1",
      description: "React is a JavaScript library for creating user interfaces.",
      link: "https://www.npmjs.com/package/react"
    },
    {
      id: 34,
      libraryName: "react-native",
      authorName: "",
      version: "0.63.0",
      description: "React Native brings React's declarative UI framework to iOS and Android. With React Native, you use native UI controls and have full access to the native platform.",
      link: "https://www.npmjs.com/package/react-native"
    },
    {
      id: 35,
      libraryName: "android-keyboard-adjust",
      authorName: "Marc Zubricky",
      version: "1.2.0",
      description: "Change the input mode for the Android keyboard in a React Native app.",
      link: "https://www.npmjs.com/package/react-native-android-keyboard-adjust"
    },
    {
      id: 36,
      libraryName: "android-location-enabler",
      authorName: "Richou",
      version: "1.2.2",
      description: "Allow to display a GoogleMap like android popup to ask for user to enable location services if disabled",
      link: "https://www.npmjs.com/package/react-native-android-location-enabler"
    },
    {
      id: 37,
      libraryName: "react-native-animatable",
      authorName: "Joel Arvidsson",
      version: "1.3.3",
      description: "Declarative transitions and animations for React Native",
      link: "https://www.npmjs.com/package/react-native-animatable"
    },
    {
      id: 38,
      libraryName: "autoheight-webview",
      authorName: "iou90",
      version: "1.5.7",
      description: "An auto height webview for React Native, even auto width for inline html.",
      link: "https://www.npmjs.com/package/react-native-autoheight-webview"
    },
    {
      id: 39,
      libraryName: "react-native-base64",
      authorName: "eranbo",
      version: "0.1.0",
      description: "Base64 encoding and decoding helping util (does not support some Unicode characters).Created for React Native but can be used anywhere.",
      link: "https://www.npmjs.com/package/react-native-base64"
    },  
    {
      id: 40,
      libraryName: "calendar-picker",
      authorName: "Stephani Alves",
      version: "7.0.1",
      description: "This is a Calendar Picker Component for React Native",
      link: "https://www.npmjs.com/package/react-native-calendar-picker"
    },  
    {
      id: 41,
      libraryName: "charts-wrapper",
      authorName: "wuxudong",
      version: "0.5.7",
      description: "A react-native charts support both android and iOS.",
      link: "https://www.npmjs.com/package/react-native-charts-wrapper"
    },  
    {
      id: 42,
      libraryName: "react-native-config",
      authorName: "Pedro Belo",
      version: "0.12.0",
      description: "Module to expose config variables to your javascript code in React Native, supporting iOS, Android and Windows.",
      link: "https://www.npmjs.com/package/react-native-config"
    },      
    {
      id: 43,
      libraryName: "custom-radio-group",
      authorName: "Ayushi Nigam",
      version: "1.0.1",
      description: "A react native radio group component with custom radio button. The component enables single select radio button behaviour with default select option and customization of the button styles.",
      link: "https://www.npmjs.com/package/react-native-custom-radio-group"
    },  
    {
      id: 44,
      libraryName: "react-native-dark-mode",
      authorName: "",
      version: "0.2.2",
      description: "Provides dark mode support.",
      link: "https://www.npmjs.com/package/react-native-dark-mode"
    },  
    {
      id: 45,
      libraryName: "react-native-datepicker",
      authorName: "xgfe",
      version: "1.7.2",
      description: "React Native DatePicker component for both Android and iOS, using DatePickerAndroid, TimePickerAndroid and DatePickerIOS",
      link: "https://www.npmjs.com/package/react-native-datepicker"
    },  
    {
      id: 46,
      libraryName: "react-native-device-info",
      authorName: "Rebecca Hughes",
      version: "1.6.1",
      description: "Get device information using react-native",
      link: "https://www.npmjs.com/package/react-native-device-info"
    },  
    {
      id: 47,
      libraryName: "device-time-format",
      authorName: "Steffen Agger",
      version: "2.3.0",
      description: "Get device setting for time format in react-native",
      link: "https://www.npmjs.com/package/react-native-device-time-format"
    },  
    {
      id: 48,
      libraryName: "react-native-dialogflow",
      authorName: "Anton Spöck",
      version: "3.2.2",
      description: "A React-Native Bridge for the Google Dialogflow AI SDK.",
      link: "https://www.npmjs.com/package/react-native-dialogflow"
    },  
    {
      id: 49,
      libraryName: "react-native-gesture-handler",
      authorName: "Krzysztof Magiera",
      version: "1.8.0",
      description: "Declarative API exposing platform native touch and gesture system to React Native.",
      link: "https://www.npmjs.com/package/react-native-gesture-handler"
    },  
    {
      id: 50,
      libraryName: "react-native-gifted-chat",
      authorName: "Farid Safi",
      version: "0.16.3",
      description: "The most complete chat UI for React Native",
      link: "https://www.npmjs.com/package/react-native-gifted-chat"
    },  
    {
      id: 51,
      libraryName: "react-native-image-picker",
      authorName: "Johan du Toit",
      version: "2.3.4",
      description: "A React Native module that allows you to select a photo/video from the device library or camera.",
      link: "https://www.npmjs.com/package/react-native-image-picker"
    },  
    {
      id: 52,
      libraryName: "react-native-indicators",
      authorName: "Alexander Nazarov",
      version: "0.17.0",
      description: "Activity indicator collection for React Native",
      link: "https://www.npmjs.com/package/react-native-indicators"
    },  
    {
      id: 53,
      libraryName: "keyboard-aware-scroll-view",
      authorName: "Alvaro Medina Ballester",
      version: "0.9.3",
      description: "A ScrollView component that handles keyboard appearance and automatically scrolls to focused TextInput",
      link: "https://www.npmjs.com/package/react-native-keyboard-aware-scroll-view"
    },  
    {
      id: 54,
      libraryName: "react-native-linear-gradient",
      authorName: "Brent Vatne",
      version: "2.5.6",
      description: "A <LinearGradient> element for React Native",
      link: "https://www.npmjs.com/package/react-native-linear-gradient"
    },  
    {
      id: 55,
      libraryName: "react-native-list-slider",
      authorName: "Grzegorz Mandziak",
      version: "1.2.1",
      description: "ReactNative List Slider",
      link: "https://www.npmjs.com/package/react-native-list-slider"
    },  
    {
      id: 56,
      libraryName: "react-native-local-resource",
      authorName: "Igor Belyayev",
      version: "0.1.6",
      description: "This library allows you to include resources of any type in your javascript source folders and load them without having to do anything special. It supports iOS and Android, including Android release mode.",
      link: "https://www.npmjs.com/package/react-native-local-resource"
    },  
    {
      id: 57,
      libraryName: "react-native-paper",
      authorName: "",
      version: "4.0.1",
      description: "Material design for React Native.",
      link: "https://www.npmjs.com/package/react-native-paper"
    },  
    {
      id: 58,
      libraryName: "react-native-permissions",
      authorName: "Mathieu Acthernoene",
      version: "3.0.4",
      description: "A unified permissions API for React Native on iOS, Android and Windows.",
      link: "https://www.npmjs.com/package/react-native-permissions"
    },  
    {
      id: 59,
      libraryName: "react-native-picker-select",
      authorName: "Michael Lefkowitz",
      version: "7.0.0",
      description: "A Picker component for React Native which emulates the native <select> interfaces for iOS and Android",
      link: "https://www.npmjs.com/package/react-native-picker-select"
    },  
    {
      id: 60,
      libraryName: "react-native-progress",
      authorName: "Joel Arvidsson",
      version: "4.1.2",
      description: "Progress indicators and spinners for React Native using ReactART.",
      link: "https://www.npmjs.com/package/react-native-progress"
    },  
    {
      id: 61,
      libraryName: "react-native-push-notification",
      authorName: "zo0r",
      version: "7.2.0",
      description: "React Native Local and Remote Notifications for iOS and Android",
      link: "https://www.npmjs.com/package/react-native-push-notification"
    },  
    {
      id: 62,
      libraryName: "radio-buttons-group",
      authorName: "Thakur Ballary",
      version: "2.1.0",
      description: "Simple and Best. An easy to use radio buttons for react native apps.",
      link: "https://www.npmjs.com/package/react-native-radio-buttons-group"
    },  
    {
      id: 63,
      libraryName: "react-native-ratings",
      authorName: "Monte Thakkar",
      version: "7.3.0",
      description: "Ratings component for React Native with tap and swipe enabled.",
      link: "https://www.npmjs.com/package/react-native-ratings"
    },
    {
      id: 64,
      libraryName: "react-native-reanimated",
      authorName: "Krzysztof Magiera",
      version: "1.13.1",
      description: "React Native Reanimated provides a more comprehensive, low level abstraction for the Animated library API to be built on top of and hence allow for much greater flexibility especially when it comes to gesture based interactions.",
      link: "https://www.npmjs.com/package/react-native-reanimated"
    },  
    {
      id: 65,
      libraryName: "react-native-render-html",
      authorName: "Meliorence",
      version: "^5.1.0",
      description: "An iOS/Android pure javascript react-native component that renders your HTML into 100% native views. It's made to be extremely customizable and easy to use and aims at being able to render anything you throw at it.",
      link: "https://www.npmjs.com/package/react-native-render-html"
    },
    {
      id: 66,
      libraryName: "react-native-restart",
      authorName: "Avishay Bar",
      version: "0.0.22",
      description: "Sometimes you want to reload your app bundle during app runtime. This package will allow you to do it.",
      link: "https://www.npmjs.com/package/react-native-restart"
    },
    {
      id: 67,
      libraryName: "react-native-root-siblings",
      authorName: "magicismight",
      version: "4.0.6",
      description: "Add sibling elements after your app root element. The created sibling elements are above the rest of your app elements. This can be used to create a Modal component or something should be over your app.",
      link: "https://www.npmjs.com/package/react-native-root-siblings"
    },
    {
      id: 68,
      libraryName: "react-native-root-toast",
      authorName: "magicismight",
      version: "3.2.1",
      description: "React native toast like component, pure javascript solution",
      link: "https://www.npmjs.com/package/react-native-root-toast"
    },
    {
      id: 69,
      libraryName: "safe-area-context",
      authorName: "Janic Duplessis",
      version: "3.1.8",
      description: "A flexible way to handle safe area, also works on Android and Web!",
      link: "https://www.npmjs.com/package/react-native-safe-area-context"
    },
    {
      id: 70,
      libraryName: "react-native-safe-area-view",
      authorName: "Dave Pack",
      version: "1.1.1",
      description: "This library provides automatic padding when a view intersects with a safe area (notch, status bar, home indicator).",
      link: "https://www.npmjs.com/package/react-native-safe-area-view"
    },
    {
      id: 71,
      libraryName: "react-native-screens",
      authorName: "Krzysztof Magiera",
      version: "2.11.0",
      description: "This project aims to expose native navigation container components to React Native. It is not designed to be used as a standalone library but rather as a dependency of a full-featured navigation library.",
      link: "https://www.npmjs.com/package/react-native-screens"
    },
    {
      id: 72,
      libraryName: "react-native-simple-toast",
      authorName: "Vojtech Novak",
      version: "1.1.3",
      description: "React Native Toast component for both Android and iOS. It just lets iOS users have the same toast experience as on Android.",
      link: "https://www.npmjs.com/package/react-native-simple-toast"
    },
    {
      id: 73,
      libraryName: "react-native-splash-screen",
      authorName: "crazycodeboy",
      version: "3.2.0",
      description: "A splash screen API for react-native which can programatically hide and show the splash screen. Works on iOS and Android.",
      link: "https://www.npmjs.com/package/react-native-splash-screen"
    },
    {
      id: 74,
      libraryName: "react-native-stopwatch-timer",
      authorName: "Michael Stevens",
      version: "0.0.21",
      description: "A React Native component that provides a stopwatch and timer.",
      link: "https://www.npmjs.com/package/react-native-stopwatch-timer"
    },
    {
      id: 75,
      libraryName: "react-native-svg-transformer",
      authorName: "Krister Kari",
      version: "0.14.3",
      description: "React Native SVG transformer allows you to import SVG files in your React Native project the same way that you would in a Web application when using a library like SVGR to transform your imported SVG images into React components.",
      link: "https://www.npmjs.com/package/react-native-svg-transformer"
    },
    {
      id: 76,
      libraryName: "react-native-swipe-gestures",
      authorName: "Goran Lepur",
      version: "1.0.5",
      description: "React Native component for handling swipe gestures in up, down, left and right direction.",
      link: "https://www.npmjs.com/package/react-native-swipe-gestures"
    },
    {
      id: 77,
      libraryName: "react-native-swipe-list-view",
      authorName: "Jesse Sessler",
      version: "3.2.5",
      description: "<SwipeListView> is a vertical ListView with rows that swipe open and closed. Handles default native behavior such as closing rows when ListView is scrolled or when other rows are opened.",
      link: "https://www.npmjs.com/package/react-native-swipe-list-view"
    },
    {
      id: 78,
      libraryName: "react-native-swiper",
      authorName: "",
      version: "1.6.0",
      description: "Swiper component for React Native.",
      link: "https://www.npmjs.com/package/react-native-swiper"
    },
    {
      id: 79,
      libraryName: "react-native-swiper-flatlist",
      authorName: "Gustavo Gard",
      version: "3.0.14",
      description: "React native swiper flatlist component",
      link: "https://www.npmjs.com/package/react-native-swiper-flatlist"
    },
    {
      id: 80,
      libraryName: "react-native-vector-icons",
      authorName: "Joel Arvidsson",
      version: "6.1.0",
      description: "Perfect for buttons, logos and nav/tab bars. Easy to extend, style and integrate into your project.",
      link: "https://www.npmjs.com/package/react-native-vector-icons"
    },
    {
      id: 81,
      libraryName: "react-native-video",
      authorName: "Brent Vatne",
      version: "5.1.0-alpha8",
      description: "A <Video /> element for react-native",
      link: "https://www.npmjs.com/package/react-native-video"
    },
    {
      id: 82,
      libraryName: "react-native-voice",
      authorName: "Sam Wenke",
      version: "0.3.0",
      description: "A speech-to-text library for React Native.",
      link: "https://www.npmjs.com/package/react-native-voice"
    },
    {
      id: 83,
      libraryName: "material-bottom-tabs",
      authorName: "Satyajit Sahoo",
      version: "2.3.0",
      description: "Material Bottom Tab Navigation component for React Navigation",
      link: "https://www.npmjs.com/package/react-navigation-material-bottom-tabs"
    },  
    {
      id: 84,
      libraryName: "react-navigation-stack",
      authorName: "",
      version: "1.10.3",
      description: "Stack navigator for use on iOS and Android.",
      link: "https://www.npmjs.com/package/react-navigation-stack"
    },  
    {
      id: 85,
      libraryName: "react-navigation-tabs",
      authorName: "Satyajit Sahoo",
      version: "2.5.6",
      description: "Tab navigators for React Navigation.",
      link: "https://www.npmjs.com/package/react-navigation-tabs"
    },  
    {
      id: 86,
      libraryName: "react-navigation-transitions",
      authorName: "Phil Mok",
      version: "1.0.12",
      description: "Custom transitions for react-navigation",
      link: "https://www.npmjs.com/package/react-navigation-transitions"
    },  
    {
      id: 87,
      libraryName: "redux-persist",
      authorName: "",
      version: "5.10.0",
      description: "Persist and rehydrate a redux store.",
      link: "https://www.npmjs.com/package/redux-persist"
    },  
    {
      id: 88,
      libraryName: "rn-fetch-blob",
      authorName: "Joltup",
      version: "0.12.0",
      description: "A project committed to making file access and data transfer easier and more efficient for React Native developers.",
      link: "https://www.npmjs.com/package/rn-fetch-blob"
    },  
    {
      id: 89,
      libraryName: "rn-user-defaults",
      authorName: "djorkaeffalexandre",
      version: "1.8.2",
      description: "Use UserDefaults (iOS) with React Native and SharedPreferences on AndroidOS.",
      link: "https://www.npmjs.com/package/rn-user-defaults"
    },
    {
      id: 90,
      libraryName: "seamless-immutable",
      authorName: "Richard Feldman",
      version: "7.1.4",
      description: "Immutable JS data structures which are backwards-compatible with normal Arrays and Objects.",
      link: "https://www.npmjs.com/package/seamless-immutable"
    },
    {
      id: 91,
      libraryName: "redux-persist-seamless-immutable",
      authorName: "hilkeheremans",
      version: "2.0.0",
      description: "This package lets you use seamless-immutable on a per-reducer basis along with redux-persist v5.",
      link: "https://www.npmjs.com/package/redux-persist-seamless-immutable"
    },
  ]
}
export default LicensesData;