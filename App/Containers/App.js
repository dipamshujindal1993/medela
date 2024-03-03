import '@config'
import { LogBox } from "react-native";
import DebugConfig from '@config/DebugConfig'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from '@containers/RootContainer'
import createStore from '@redux';
import SplashScreen from 'react-native-splash-screen';
import { RootSiblingParent } from 'react-native-root-siblings'
import {DarkModeProvider} from 'react-native-dark-mode';
import {  setI18nConfig } from '../I18n/I18n'
// import PushNotification from "react-native-push-notification";
import PushNotification from "react-native-push-notification";
import {setDeviceLanguage} from "../Utils/locale";
// create our store
const store = createStore()
import appsFlyer from 'react-native-appsflyer';
import { Platform} from "react-native";
import {Constants} from "@resources";

appsFlyer.initSdk(
  {
    devKey: Constants.APPS_FLYER_TOKEN,
    isDebug: true, // set to true if you want to see data in the logs
    appId: Platform.OS === 'ios' ? Constants.APP_ID_IOS : Constants.APP_ID_ANDROID, // Need to change according to instance
  },
  (result) => {
    console.log('appsFlyer result === ',result);
  },
  (error) => {
    console.error(error);
  }
);

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  constructor(){
    super()
    setDeviceLanguage();
    this.state={
      isLocaleSet:false
    }
    //Ignoring known to logs
    LogBox.ignoreLogs(['Setting a timer','source.uri should']);
  }
  async componentDidMount() {
    await setI18nConfig();
    const {navigation} = this.props
    console.log('setConfig Done')
    this.setState({isLocaleSet:true});
    SplashScreen.hide();
    PushNotification.channelExists("myMedela", function (exists) {
      if(!exists) {
        PushNotification.createChannel(
          {
            channelId: "myMedela",
            channelName: "myMedela",
            playSound: false,
            soundName: "default",
            importance: 4,
            vibrate: true,
          },
          (created) => console.log(`createChannel returned '${created}'`)
        );
      }
    });
  }
  render () {
    const {isLocaleSet}=this.state;
    if(isLocaleSet){
      return (
        <Provider store={store}>
          <RootSiblingParent>
            <DarkModeProvider>
              <RootContainer />
            </DarkModeProvider>
          </RootSiblingParent>
        </Provider>
      )
    }else{
      return <></>
    }
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App
