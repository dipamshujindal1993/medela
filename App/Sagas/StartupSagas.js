import { call, put, select } from 'redux-saga/effects'
import RemoteConfigActions from '@redux/RemoteConfigRedux'
import AppActions, { AppSelectors } from '@redux/AppRedux'
import NavigationActions from '@redux/NavigationRedux'

// process STARTUP actions
export function* startup (api, action) {
  const remoteConfigs = yield call(api.getConfig);
  if (remoteConfigs.ok) {
    yield put(RemoteConfigActions.getRemoteConfigSuccess(remoteConfigs.data))
  }

  const isSignedIn = yield select(AppSelectors.isSignedIn)
  if (isSignedIn) {
    yield put(NavigationActions.loadHomeScreen())
  } else {
    yield put(AppActions.rehydrationComplete())
  }
}
