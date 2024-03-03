import React from 'react'
import { connect } from 'react-redux'
import { createAppContainer } from 'react-navigation'
import NavigationService from '@services/NavigationService'

import { createAuthStack } from './AuthStack'
import AppStack from './AppStack'
import SplashScreen from '@containers/SplashScreen'
import MaintenanceScreen from '../Containers/MaintenanceScreen'
const prefix = 'https://';
import KeyUtils from "@utils/KeyUtils";
import GetterSetter from "../Components/GetterSetter";
import { Analytics } from '@services/Firebase'
// const prefix = 'myMedela://';
const getActiveRouteName=(navigationState)=> {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // Dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}
const screensToAvoid=['OptedSetupScreen','PumpSetupScreen','StartScreen'];
const AppNavigation= React.memo(function (props) {
  const {
    rehydrated,
    signedIn,
    themeSelected,
    remoteConfig,
    opted,
    optedState
  } = props
  if(remoteConfig && remoteConfig.maintenance && remoteConfig.maintenance.show){
      return <MaintenanceScreen maintenance = {remoteConfig.maintenance} themeSelected={themeSelected} signedIn={signedIn} />
  }
  console.log('appnavigation',signedIn,rehydrated,opted);
  if (rehydrated) {
    var AppContainer = undefined
    if (signedIn) {
      if((opted.state=='first'||opted.state=='background')&&opted.value==false&&opted.market===KeyUtils.US_MARKET){
        AppContainer = createAppContainer(createAuthStack(undefined,'OptedSetupScreen',{market:opted.market,isSignUp:false,loadUserProfile:true}))
      }else if((opted.state=='first'||opted.state=='background')&&opted.value==false&&opted.market!==KeyUtils.US_MARKET){
        AppContainer = createAppContainer(createAuthStack(undefined,'PumpSetupScreen',{market:opted.market,isSignUp:false,loadUserProfile:true}))
      }else{
        return <AppStack uriPrefix={prefix}  />
      }
    } else {
      AppContainer = createAppContainer(createAuthStack())
    }
    if (AppContainer) {
      return (
        <AppContainer
          ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
          enableURLHandling={false}
          theme={themeSelected}
          uriPrefix={prefix}
          onNavigationStateChange={async (prevState, currentState,action) => {
            const currentScreen = getActiveRouteName(currentState);
            const prevScreen = getActiveRouteName(prevState);
            if (prevScreen !== currentScreen&&!screensToAvoid.includes(currentScreen)) {
              // let analytics=new Analytics()
              // await analytics.logScreenView(currentScreen)
            }
          }}
        />
      )
    }
  }

  return (
    <SplashScreen />
  )
},(prevProps,nextProps)=>{
  if(prevProps.rehydrated==null||nextProps.rehydrated==null||prevProps.rehydrated==false||nextProps.rehydrated==false){
    return false;
  }
  if(GetterSetter.getUserChangedWithoutCompletedItsProfile()===true){
    GetterSetter.setUserChangedWithoutCompletedItsProfile(false)
    return true;
  }
  if(prevProps.opted.state!==nextProps.opted.state&&(prevProps.opted.state==='initial'&&nextProps.opted.state!=='background'&&nextProps.signedIn!==false)){
    return true;
  }
  return false;
})
const mapStateToProps = (state) => ({
  rehydrated: state.app.rehydrated,
  signedIn: state.app.signedIn,
  themeSelected: state.app.themeSelected,
  remoteConfig:state.remoteConfig,
  opted: state.app.opted,
})

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(AppNavigation)
