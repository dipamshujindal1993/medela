import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getRemoteConfigSuccess: ['remoteConfigs'],
})

export const RemoteConfigTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  remoteConfigs: {},
})

/* ------------- Selectors ------------- */

export const RemoteConfigSelectors = {
  remoteConfigs: state => state.remoteConfig
}

/* ------------- Reducers ------------- */

export const getRemoteConfigSuccess = (state, action) => {
  const { remoteConfigs } = action
  return state.merge(remoteConfigs)
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_REMOTE_CONFIG_SUCCESS]: getRemoteConfigSuccess,
})
