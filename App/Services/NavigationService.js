import { NavigationActions, StackActions } from 'react-navigation'

var _navigator

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(routeName, params) {
  _navigator && _navigator != null && _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  )
}

function reset(routeName, params) {
  _navigator.dispatch(StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({
      routeName,
      params
    })],
  })
  )
}

function replace(routeName, params) {
  _navigator.dispatch(
    StackActions.replace({
      routeName,
      params,
    })
  )
}

function getNavigator(){
  return _navigator
}

function getCurrentRoute(nav){
  if(Array.isArray(nav.routes)&&nav.routes.length>0){
      return getCurrentRoute(nav.routes[nav.index])
  }else {
      return nav.routeName
  }
}

function popToTopStack() {
  _navigator.dispatch(StackActions.popToTop())
}

export default {
  setTopLevelNavigator,
  navigate,
  reset,
  replace,
  getNavigator,
  getCurrentRoute,
  popToTopStack
}