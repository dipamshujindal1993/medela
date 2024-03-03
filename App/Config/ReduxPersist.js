import immutablePersistenceTransform from '@services/ImmutablePersistenceTransform'
import AsyncStorage from '@react-native-community/async-storage'
import { createMigrate } from 'redux-persist'
import { seamlessImmutableReconciler, seamlessImmutableTransformCreator } from 'redux-persist-seamless-immutable'

const migrations = {  
  0: (state)=>{
    const {app}=state;
    const myNewStructure={...app,opted:{state:'initial',value:false,market:null}}
    state.app = myNewStructure;
    return state
  }
}
const REDUX_PERSIST = {
  active: true,
  reducerVersion: '1.0',
  storeConfig: {
    key: 'primary',
    storage: AsyncStorage,
    // Reducer keys that you do NOT want stored to persistence here.
    blacklist: ['login', 'search', 'nav'],
    // Optionally, just specify the keys you DO want stored to persistence.
    // An empty array means 'don't store any reducers' -> infinitered/ignite#409
    // whitelist: [],
    transforms: [immutablePersistenceTransform],
    version:0,
    stateReconciler:seamlessImmutableReconciler,
    migrate:createMigrate(migrations,{debug:true}),
    debug:true
  }
}
export default REDUX_PERSIST
