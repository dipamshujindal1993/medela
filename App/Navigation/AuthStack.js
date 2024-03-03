import React from 'react'
import {I18nManager, View,Platform} from 'react-native'
import {createStackNavigator} from 'react-navigation-stack'

import StartScreen from '@containers/StartScreen'
import LoginScreen2 from '@containers/LoginScreen2'
import SignUpScreen from '@containers/SignUpScreen'
import ProfileSetupScreen from '@containers/ProfileSetupScreen'
import PumpSetupScreen from '@containers/PumpSetupScreen'
import WelcomeScreen from '@containers/WelcomeScreen'
import TermsConditionsScreen from "@containers/TermsConditionsScreen"
import OptedSetupScreen from "@containers/OptedSetupScreen"
import LoginScreen1 from "@containers/LoginScreen1"
import NewWelcomeScreen from "@containers/NewWelcomeScreen"
import HeaderLogin from '@components/HeaderLogin'
import BackIcon from '@svg/arrow_back'

import {
  Colors,
} from '@resources'
import {ApplicationStyles} from '@resources'
import { useSelector } from 'react-redux'

export function createAuthStack(hideHeader,initialRouteName,initialRouteParams) {
  const selectedTheme = useSelector(state=>state.app.themeSelected)

  const defaultNavigationOptions = Object.assign(hideHeader ? {header: null} : {}, {
    headerBackImage: <BackIcon width={48} height={48} style={{...ApplicationStyles.backIcon,...{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}} fill={Colors.rgb_fecd00}/>,
    headerStyle: [ApplicationStyles.noShadowHeaderStyle, {backgroundColor: selectedTheme==="dark" ? Colors.rgb_000000: Colors.white}],
    headerTitle: <HeaderLogin/>,
    ...Platform.OS=='ios'&&{gesturesEnabled: false},

  })

  return createStackNavigator({
    StartScreen: {
      screen: StartScreen,
      navigationOptions: {
        //headerTitle: <HeaderMedelaLogo/>,
        header: null,
      }
    },
    LoginScreen2: {
      screen: LoginScreen2,
      navigationOptions: {
        headerRight: <View/>
      },
    },
    SignUpScreen: {
      screen: SignUpScreen,
      navigationOptions: {
        headerRight: <View/>
      }
    },
    ProfileSetupScreen: {
      screen: ProfileSetupScreen,
      navigationOptions: {
        // headerRight: <View/>,
        headerLeft: null,
        gesturesEnabled: false,
      }
    },
      OptedSetupScreen: {
      screen: OptedSetupScreen,
      navigationOptions: {
        // headerRight: <View/>,
        headerLeft: null,
        gesturesEnabled: false,
      }
    },
    PumpSetupScreen: {
      screen: PumpSetupScreen,
      navigationOptions: {
        header: null,
      }
    },
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
         header: null,
      }
    },
      TermsConditionsScreen: {
        screen: TermsConditionsScreen,
        navigationOptions: {
          headerRight: <View/>
        }
  },
      LoginScreen1: {
        screen: LoginScreen1,
        navigationOptions: {
          headerRight: <View/>
        },
      },
      NewWelcomeScreen: {
        screen: NewWelcomeScreen,
        navigationOptions: {
           header: null,
        }
      },
  },
  {
    headerBackTitleVisible: false,
    defaultNavigationOptions,
    ...initialRouteName&&{initialRouteName},
    ...initialRouteParams&&{initialRouteParams}

  }
)
}
