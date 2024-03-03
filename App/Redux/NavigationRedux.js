import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadHomeScreen: null,
  loadHomeScreenSuccess: null,
  signOut: null,
  signInSuccess: null,
  sessionNavigation: ['routeName','trackingId'],
})

export const NavigationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({})

/* ------------- Selectors ------------- */

export const NavigationSelectors = {}


/* ------------- Reducers ------------- */

export const loadHomeScreen = (state) =>
  state.merge({ loadHomeScreenSuccess: false })

export const loadHomeScreenSuccess = (state) =>
  state.merge({ loadHomeScreenSuccess: true })

export const signOut = (state) =>
  state.merge(INITIAL_STATE)

export const sessionNavigation=(state,action)=>{
  const {routeName,trackingId} = action;
  return state.merge({routeName,trackingId})
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_HOME_SCREEN]: loadHomeScreen,
  [Types.LOAD_HOME_SCREEN_SUCCESS]: loadHomeScreenSuccess,
  [Types.SIGN_OUT]: signOut,
  [Types.SESSION_NAVIGATION]:sessionNavigation
})
