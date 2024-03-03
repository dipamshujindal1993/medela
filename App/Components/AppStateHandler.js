import React, {Component} from 'react';
import {
  AppState,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {connect} from 'react-redux';
import LoadingSpinner from '@components/LoadingSpinner';
import AppActions from '@redux/AppRedux';
import HomeActions from '@redux/HomeRedux';
import UserActions from '@redux/UserRedux';
import ReduxPersist from '@config/ReduxPersist';
import StartupActions from '@redux/StartupRedux';
import {
  updateTrackingItem,
} from '@database/TrackingDatabase';
import {
  deleteBabyFromDb,
  openRealmDb,
  saveAllBabies,
  saveMotherProfile,
  updateBaby,
} from '@database/AddBabyDatabase';
import {saveVirtualFreezerDatabase, deleteFreezerFromDb } from "../Database/VirtualFreezerDatabase";
import {DarkModeContext} from 'react-native-dark-mode';
import AsyncStorage from '@react-native-community/async-storage';
import KeyUtils from '@utils/KeyUtils';
import BleDManager from "../Containers/BleDManager";
import { getRealmDb } from '../Database/AddBabyDatabase';


class AppStateHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      realmTracking: null,
      offlineTrackingItems: [],
      offlineBabies: [],
      isDataSyncing: false,
      deleteBabiesArr: [],
      autoLoginLoading:false
    };
    this.isFreezerInventoryDataSyncing = false
    this.isDataSyncing = false;
    this.isMotherTrackingDataSyncing = false;
    this.babyDataSyncing = false;
    this.deleteBabiesSyncing = false;
    this.motherInfoUpdateSycning = false;
    this.babyEditedSyncing = false;
    this.internetConnectionListener();
    this.deletedBabiesCount = 0;

  }

  static contextType = DarkModeContext;

  internetConnectionListener() {

    AppState.addEventListener('change', this._handleAppStateChange);
    this.unsubscribe = NetInfo.addEventListener(state => {
      const {isInternetAvailable, checkInternetConnection} = this.props;
      //  console.log('componentDidMount Change--' ,state)
      // if (isInternetAvailable != state.isInternetReachable) {
      if (isInternetAvailable != state.isInternetReachable) {
        //console.log('call--', state.isInternetReachable)
        // checkInternetConnection(state.isInternetReachable);
        checkInternetConnection(state.isInternetReachable);

      }
    });
  }

  async getRealmData() {
    let realmTracking = await openRealmDb();
    const {signedIn}=this.props
    this.setState({realmTracking,isLogin:signedIn});
  }

  componentDidMount() {
    this.getRealmData();
  }

  async syncWithServer() {
    //console.log('syncWIthserver-----------------------------------')
    const {localTrackingApi, motherTrackingApi, createBottleApi} = this.props;
    const {realmTracking, isLogin} = this.state;
    //console.log('syncWIthserver-----------------------------------',isLogin)
    if (!isLogin) {
      return;
    }

    this.syncBabyWithServer();
    this.updateMotherInfo();
    let myItems = realmTracking.objects('Tracking');

    let arr = JSON.parse(JSON.stringify(myItems));
    arr = arr.filter((e) => {
      return !e.isSync;
    });

    let contractionItems = arr.filter((e) => {
      return e.isMother;
    });
    let childTrackingItems = arr.filter((e) => {
      return !e.isMother;
    });

    contractionItems = contractionItems.map((e) => ({
      id: e.id,
      trackingType: e.trackingType,
      trackAt: e.trackAt,
      quickTracking: e.quickTracking,
      remark: e.remark,
      confirmed: e.confirmed,
      durationTotal: e.durationTotal,
      frequency: e.frequency,
      painLevel: e.painLevel,
    }));
    if (contractionItems.length > 0) {
      this.isMotherTrackingDataSyncing = true;
      let motherContraction = {
        trackings: contractionItems,
      };

      motherTrackingApi(motherContraction);
    }


    for (let i = 0; i < childTrackingItems.length; i++) {
      let currentItem = childTrackingItems[i];
      delete currentItem.isSync;
      delete currentItem.userId;
      delete currentItem.statusFlags;
      if (currentItem.inventory!=null){
        delete currentItem.inventory.isSync
        delete currentItem.inventory.userId
        delete currentItem.inventory.isDeleted
        //isDeleted
      }
      Object.keys(currentItem).forEach(key => {
        if (currentItem[key] == '' && key != 'remark' && key != 'isBadSession' && key != 'quickTracking') {
          delete currentItem[key]; // delete
        }
      });
    }

    if(childTrackingItems.length>0){
      this.isDataSyncing = true;
      let json = {
        trackings: childTrackingItems,
      };
      localTrackingApi('', json);
    }


    let myFreezerItems = realmTracking.objects('VirtualFreezerSchema');
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)

    let freezerarr = JSON.parse(JSON.stringify(myFreezerItems))
    freezerarr = freezerarr.filter((e) => {
      return userName === e.userId && !e.isSync
    })

    let deletearr = JSON.parse(JSON.stringify(myFreezerItems))
    deletearr = deletearr.filter((d) => {
      return d.isDeleted && !d.isSync
    })
    console.log('to delete arr', JSON.stringify(deletearr))
    if (deletearr.length > 0) {
      for (let i = 0; i < deletearr.length; i++) {
        let idToDelete = deletearr[i].id
        await this.props.deleteFreezerInventoryApi(idToDelete)
      }
    }

    freezerarr = freezerarr.map((e) => ({
      id: e.id,
      trackingMethod: e.trackingMethod,
      trackAt: e.trackAt,
      location: e.location,
      tray: e.tray,
      containerType: e.containerType,
      number: e.number,
      amount: e.amount,
      unit: e.unit,
      createdFrom: e.createdFrom,
      consumedAt: e.consumedAt,
      isConsumed: e.isConsumed,
      consumedBy: e.consumedBy,
      isExpired: e.isExpired,
      expireAt: e.expireAt,
      movedAt: e.movedAt
    }))

    this.isFreezerDataSync=false
    if (freezerarr.length > 0) {
        let bottleDataItems = Object.assign({milkInventories: freezerarr});
        this.isFreezerDataSync=true
        this.bottleDataItems = bottleDataItems
        if (childTrackingItems.length === 0) {
          this.isFreezerInventoryDataSyncing = true
         await createBottleApi(bottleDataItems)
        }
      }

    }

    syncVirtualFreezerData(){
    if (this.isFreezerDataSync){
      this.isFreezerInventoryDataSyncing = true
      this.props.createBottleApi(this.bottleDataItems)
    }
  }

  updateMotherInfo() {
    const {realmTracking} = this.state;
    const {addProfile, userProfile} = this.props;
    let profile = realmTracking.objects('UserMotherProfile');

    let uerProfile = JSON.parse(JSON.stringify(profile));
    let data = uerProfile.filter((e) => {
      return !e.isSync;
    });
    if (data.length > 0 && !this.motherInfoUpdateSycning) {
      this.motherInfoUpdateSycning = true;
      const {mother, client} = data[0];
      const {
        timezone,
        name,
        country,
        backToWorkStatus,
        backToWorkDate,
        analyticsOptout,
        units,
        isOptedInForEmail,
        isOptedInForSms,
        isOptedInForMail,
        isOptedInForTesting,
      } = mother;

      let obj = {
        timezone,
        name,
        country,
        backToWorkStatus,
        backToWorkDate,
        analyticsOptout,
        units,
        isOptedInForEmail,
        isOptedInForSms,
        isOptedInForMail,
        isOptedInForTesting,
      };

      let profile = {
        client,
        mother: obj,
      };
      addProfile({profile});


    }

  }

  syncBabyWithServer() {
    const {realmTracking} = this.state;
    const {syncBabyName, userProfile, deleteBaby} = this.props;

    if (userProfile && userProfile.mother) {
      let myItems = realmTracking.objects('AddBaby');


      let arr = JSON.parse(JSON.stringify(myItems));
      let deleteBabiesArr = arr.filter((e) => {
        return e.username === userProfile.mother.username && e.isDeleted;
      });

      if (deleteBabiesArr.length > 0) {
        this.deletedBabiesCount = 0;
        deleteBabiesArr.forEach((e, i) => {
          let babyId = e.babyId;
          this.deleteBabiesSyncing = true;
          deleteBaby(babyId);

        });
      }
      arr = arr.filter((e) => {
        return !e.isSync && e.username === userProfile.mother.username && !e.isDeleted;
      });


      this.setState({offlineBabies: arr, deleteBabiesArr});
      let babiesArr = [];
      let imagesArr = [];
      arr.forEach((e, i) => {

        let currentItem = JSON.parse(JSON.stringify(e));

        const {name, babyId, birthHeight, birthWeight, image, gender, birthday} = currentItem;
        let imageObj = {};
        let obj = {
          name,
          babyId,
          birthday,
        };
        if (birthHeight != null) {
          obj['birthHeight'] = birthHeight;
        }
        if (birthWeight != null) {
          obj['birthWeight'] = birthWeight;
        }
        if (gender != 0) {
          obj['gender'] = gender;
        }
        babiesArr.push(obj);
        if (image != null) {
          imagesArr.push(currentItem);
        }

      });

      console.log('babySync Gender-----',babiesArr.length,this.babyDataSyncing,babiesArr)
      if (babiesArr.length > 0 && !this.babyDataSyncing) {
        let babies = {'babies': babiesArr};
        this.babyDataSyncing = true;
        syncBabyName({babies, imagesArr});
      }

    }
  }

  findBabiesIndex(offlineBabies, babyId) {
    let matchIndex = offlineBabies.findIndex((E) => {
      return E.babyId === babyId;
    });
    return matchIndex;
  }

  async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {
      trackingData,
      localTrackingApiSuccess,
      motherTrackingResponse,
      motherTrackingApiFailure,
      motherTrackingApiSuccess,
      trackingId,
      deleteBabySuccess,
      deletedBabyId,
      deleteBabyFailure,
      localTrackingApiFailure,
      isProfile,
      isProfileError,
      isInternetAvailable,
      signedIn,
      createBottleResponse,
      deleteFreezerInventoryApiResponse,
      remoteConfig,
      getArticlesSuccess,
      getArticlesFailure
    } = this.props;
    const {isLogin, offlineBabies, realmTracking} = this.state;
    const {
      syncBabySuccess,
      syncBabyFailure,
      isPicUploaded,
      babyId,
      isPicUploadedError,
      picUploadedBabyId,
      uploadBabyPic,
      getMyBabies,
      babiesSuccess,
      babiesFailure,
      navigation,
      userProfileSuccess,
      autoLogin
    } = this.props;
    const {showBabySection, babyName} = this.state;
    if ((prevProps.deleteBabySuccess != deleteBabySuccess) && deleteBabySuccess && this.deleteBabiesSyncing) {

      let deletedBabiesCount = this.state.deleteBabiesArr.length;
      this.deletedBabiesCount++;
      if (deletedBabiesCount === this.deletedBabiesCount) {
        this.deleteBabiesSyncing = false;
      }
      deleteBabyFromDb(deletedBabyId).then((r) => {

      });

    }
    if ((prevProps.deleteBabyFailure != deleteBabyFailure) && deleteBabyFailure && this.deleteBabiesSyncing) {
      let deletedBabiesCount = this.state.deleteBabiesArr.length;
      this.deletedBabiesCount++;
      if (deletedBabiesCount === this.deletedBabiesCount) {
        this.deleteBabiesSyncing = false;
      }
    }

    if ((prevProps.isProfile != isProfile) && isProfile && this.motherInfoUpdateSycning) {
      //this.setState({isLoading: false})
      this.motherInfoUpdateSycning = false;
      const {realmTracking} = this.state;
      const {addProfile, userProfile} = this.props;

      let profile = realmTracking.objects('UserMotherProfile');

      let motherProObj = JSON.parse(JSON.stringify(profile));
      motherProObj[0].isSync = true;
      motherProObj[0].isSync = true;
      saveMotherProfile(realmTracking, motherProObj[0]).then((s) => {

      });

    }
    if ((prevProps.isProfileError != isProfileError) && isProfileError && this.motherInfoUpdateSycning) {
      this.motherInfoUpdateSycning = false;

    }

    if (prevProps.syncBabySuccess != syncBabySuccess && syncBabySuccess && this.babyDataSyncing) {
      this.babyDataSyncing = false;
      getMyBabies();
      if (offlineBabies && offlineBabies.length > 0) {

        let modifiedBabies = offlineBabies.map(baby => ({...baby, isSync: true}));
        saveAllBabies(realmTracking, modifiedBabies).then((r) => {

        });
        /*   if (matchIndex>-1){
             let imgFile=offlineBabies[matchIndex].image
             if (imgFile!=null) {
               console.log('Call PicUpload APiS babyId',babyId)
               uploadBabyPic(babyId, imgFile);
             } else {
               let item=JSON.parse(JSON.stringify(offlineBabies))
               item.isSync=true
               console.log('update babays')

             }
           }*/
      }

    }
    if ((prevProps.syncBabyFailure != syncBabyFailure) && syncBabyFailure && this.babyDataSyncing) {
      this.setState({isLoading: false, showErrorMessage: true});
    }
    if (prevProps.isPicUploaded != isPicUploaded && isPicUploaded && this.babyDataSyncing) {
      // this.props.getMyBabies();
      // console.log('picUploadedBabyId', picUploadedBabyId)
      let matchIndex = this.findBabiesIndex(offlineBabies, picUploadedBabyId);
      if (matchIndex > -1) {
        let item = JSON.parse(JSON.stringify(offlineBabies[matchIndex]));
        item.isSync = true;
        updateBaby(realmTracking, item).then((r) => {
          //console.log('picUploadedSuccess ---', r)
        });
      }
    }
    if ((prevProps.isPicUploadedError != isPicUploadedError) && isPicUploadedError && this.babyDataSyncing) {
      this.setState({ isLoading: false, showErrorMessage: true });
    }
    if ((prevProps.babiesFailure != babiesFailure) && babiesFailure && this.babyDataSyncing) {
      this.setState({ isLoading: false, showErrorMessage: true });
    }

    if (prevProps.signedIn != signedIn && signedIn) {
      this.setState({isLogin: true});

    }

    if ((getArticlesSuccess != prevProps.getArticlesSuccess && getArticlesSuccess) || (prevProps.isInternetAvailable != isInternetAvailable && isInternetAvailable && isLogin && getArticlesSuccess)) {
      this.syncWithServer();
    }

    if ((prevProps.localTrackingApiSuccess != localTrackingApiSuccess && localTrackingApiSuccess) && this.isDataSyncing) {
      this.isDataSyncing = false;
      console.log('localTrackingAPiSuccess----')
      const {realmTracking} = this.state;
      let successfulTrackingArray=localTrackingApiSuccess.successIds
      let myItems = realmTracking.objects('Tracking');
      let arr = JSON.parse(JSON.stringify(myItems));
      for (let i = 0; i < successfulTrackingArray.length; i++) {
     let  filtredArray = arr.filter((e) => {
        return e.id === successfulTrackingArray[i];
      });
      if (filtredArray.length > 0) {
        let selectedItem = filtredArray[0];
        selectedItem.isSync = true;
        await updateTrackingItem(selectedItem);
      }
    }
      this.syncVirtualFreezerData()
    }
    if (prevProps.localTrackingApiFailure != localTrackingApiFailure && localTrackingApiFailure) {
      //this.syncWithServer();
      //TODO
    }
    if ((prevProps.motherTrackingApiSuccess != motherTrackingApiSuccess && motherTrackingApiSuccess) && this.isMotherTrackingDataSyncing) {
      const {realmTracking} = this.state;
      let myItems = realmTracking.objects('Tracking');
      let arr = JSON.parse(JSON.stringify(myItems));
      this.isMotherTrackingDataSyncing = false;

      arr = arr.filter((e) => {
        return !e.isSync && e.isMother;
      });

      if (arr.length > 0 && motherTrackingResponse.length > 0) {

        motherTrackingResponse.forEach((e) => {
          let item = arr.find((_i) => {
            return e === _i.id;
          });

          if (item != undefined) {
            item.isSync = true;
            updateTrackingItem(item);
          }

        });
      }

    }

    if ((prevProps.createBottleResponse != createBottleResponse && createBottleResponse.length > 0) && this.isFreezerInventoryDataSyncing) {
      let realmDb = await getRealmDb()
      let myItems = realmDb.objects('VirtualFreezerSchema');
      let arr = JSON.parse(JSON.stringify(myItems))

      this.isFreezerInventoryDataSyncing = false

      arr = arr.filter((e) => {
        return !e.isSync
      })



      if (arr.length > 0 && createBottleResponse.successIds.length > 0) {
        createBottleResponse.successIds.forEach((e) => {
          let item = arr.find((_i) => {
            return e === _i.id
          })
          console.log(' freezer itemUpdated--', item)
          if (item != undefined) {
            item.isSync = true
            saveVirtualFreezerDatabase(realmDb, item)
          }

        })
      }


      /*
            arr = arr.filter((e) => {
              return e.id === trackingId
            })

            if (arr.length > 0) {
              let selectedItem = arr[0]
              selectedItem.isSync = true
              await updateTrackingItem(selectedItem)
            }*/
    }

    if (deleteFreezerInventoryApiResponse != prevProps.deleteFreezerInventoryApiResponse && Object.keys(deleteFreezerInventoryApiResponse).length !== 0) {
      //TODO
      //deleteFreezerFromDb(deleteFreezerInventoryApiResponse.successIds[0])
    }

    if (prevProps.motherTrackingApiFailure != motherTrackingApiFailure && motherTrackingApiFailure) {
      //TODO
    }
    if(prevProps.remoteConfig != remoteConfig && this.state.autoLoginLoading){
      this._callAPi();
    }

    if(prevProps.autoLogin != autoLogin && autoLogin){
      this.props.getToken()
    }

    if(prevProps.userProfileSuccess != userProfileSuccess && this.state.autoLoginLoading){
      this.setState({autoLoginLoading:false});
    }
  }


  componentWillUnmount() {
    console.log('willUnMount---AppState')
    AppState.removeEventListener('change', this._handleAppStateChange);
    if (this.unsubscribe) {
      this.isDataSyncing = false;
      this.unsubscribe();
    }
    const { realmTracking } = this.state;
    if (realmTracking != null && !realmTracking.isClosed) {
      realmTracking.close();
    }
  }

  _callAPi() {
    const {isInternetAvailable, checkInternetConnection,opted,optedState} = this.props;
    AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP).then(startTime => {
      let st = parseInt(startTime);
      let difference = Date.now() - st;
      let secondsDifference = Math.floor(difference / 1000);
      let dd = isNaN(parseInt(secondsDifference)) ? 0 : parseInt(secondsDifference)
      console.log('AppIn active time in seconds-----', dd);
      if (dd >= 300) {
        if(opted.state=='first'&&opted.value==false&&opted.market!=null){
          optedState({state:'background'});
        }
        const { getUserProfile } = this.props;
        if(this.state.autoLoginLoading){
          getUserProfile();
        }
        else this.setState({autoLoginLoading:true},()=>{
          getUserProfile();
        })
      }else{
        if(this.state.autoLoginLoading){
          this.setState({autoLoginLoading:false});
        }
      }
    });
    NetInfo.fetch().then(state => {
      console.log('handleApppStateChange--', state.isInternetReachable);
      if (isInternetAvailable != state.isInternetReachable) {
        console.log('AppState Change--', state.isInternetReachable);
        checkInternetConnection(state.isInternetReachable);
      }
    });
  }

  _handleAppStateChange = nextAppState => {
    const {isInternetAvailable, checkInternetConnection, checkAppState} = this.props;
    const themeModeSelected = this.context;
    this.props.darkMode(themeModeSelected);

    if (nextAppState === 'background') {
      console.log('AppIn BackgroundState----', nextAppState);
      this.props.isPumpRunning(false)
      this.disconnectDevice()
      checkAppState(nextAppState);
      AsyncStorage.setItem(KeyUtils.BACKGROUND_TIME_STAMP, Date.now().toString());
      // this.props.enterBackground()
    } else if (nextAppState == 'active') {
      console.log('AppIn active----', nextAppState);
      checkAppState(nextAppState);
      /*AsyncStorage.getItem(KeyUtils.BACKGROUND_TIME_STAMP).then(startTime => {
        let st = parseInt(startTime);
        let difference = Date.now() - st;
        let secondsDifference = Math.floor(difference / 1000);
        let dd = parseInt(secondsDifference);
        console.log('AppIn active time in seconds-----', dd);
        /!*if (dd >= 300) {
          const {getUserProfile} = this.props;
          getUserProfile();
        }*!/
      });*/
    /*  NetInfo.fetch().then(state => {
        console.log('handleApppStateChange--', state.isInternetReachable);
        if (isInternetAvailable != state.isInternetReachable) {
          console.log('AppState Change--', state.isInternetReachable);
          checkInternetConnection(state.isInternetReachable);
        }
      });*/
      if (!this.props.remoteConfig.interfaceUrls) {
        this.props.startup();
        this.setState({autoLoginLoading:true});
      } else {
        this._callAPi();
      }
    }
  };

  async disconnectDevice() {
    const {bleDeviceId} = this.props
    this.manager = BleDManager.getBleManagerInstance();
    console.log('bleDeviceId *************************', bleDeviceId)
    try {

      if (bleDeviceId) {
        try {
          this.manager && this.manager.stopDeviceScan()
          this.manager.cancelDeviceConnection(bleDeviceId).then((device) => {
            console.log('disconnedSuccesfully----', device.id)
          })
          //this.manager && this.manager.stopDeviceScan()
        } catch (e) {
          console.log('ERROR back --- ', e)
        }

        /*this.manager.isDeviceConnected(bleDeviceId).then((connection) => {
          if (connection) {
            try {
              this.manager.cancelDeviceConnection(bleDeviceId).then((device) => {
                console.log('disconnedSuccesfully----', device.id)
              })
            } catch (e) {
              console.log('ERROR back --- ', e)
            }
          }
        })*/
      }
    } catch (e) {}
  }

  render() {
    if (this.props.isLoading||this.state.autoLoginLoading) {
      return <LoadingSpinner/>;
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  trackingId: state.home.trackingId,
  localTrackingApiSuccess: state.home.localTrackingApiSuccess,
  localTrackingApiFailure: state.home.localTrackingApiFailure,
  isInternetAvailable: state.app.isInternetAvailable,
  trackingData: state.home.trackingData,
  signedIn: state.app.signedIn,
  message: state.user.message,
  syncBabySuccess: state.user.syncBabySuccess,
  syncBabyFailure: state.user.syncBabyFailure,
  isPicUploaded: state.user.isPicUploaded,
  isPicUploadedError: state.user.isPicUploadedError,
  babyId: state.user.babyId,
  picUploadedBabyId: state.user.picUploadedBabyId,
  babiesSuccess: state.home.babiesSuccess,
  babiesFailure: state.home.babiesFailure,
  userProfile: state.user.userProfile,
  isProfile: state.user.isProfile,
  isProfileError: state.user.isProfileError,
  deleteBabySuccess: state.user.deleteBabySuccess,
  deleteBabyFailure: state.user.deleteBabyFailure,
  deletedBabyId: state.user.deletedBabyId,
  motherTrackingResponse: state.home.motherTrackingResponse,
  motherTrackingApiSuccess: state.home.motherTrackingApiSuccess,
  motherTrackingApiFailure: state.home.motherTrackingApiFailure,
  remoteConfigs: state.remoteConfig,
  createBottleResponse: state.home.createBottleResponse,
  deleteFreezerInventoryApiResponse: state.home.deleteFreezerInventoryApiResponse,
  remoteConfig:state.remoteConfig,
  bleDeviceId: state.app.bleDeviceId,
  userProfileSuccess:state.user.userProfileSuccess,
  autoLogin: state.user.autoLogin,
  opted: state.app.opted,
  getArticlesSuccess: state.home.getArticlesSuccess,
  getArticlesFailure: state.home.getArticlesFailure,
});

const mapDispatchToProps = (dispatch) => ({
  getToken: () => dispatch(HomeActions.getToken()),
  startup: () => dispatch(StartupActions.startup()),
  checkInternetConnection: (status) => dispatch(AppActions.checkInternetConnection(status)),
  localTrackingApi: (trackingId, trackingData) => dispatch(HomeActions.localTrackingApi(trackingId, trackingData)),
  syncBabyName: (syncBabies, imagesArr) => dispatch(UserActions.syncBabyName(syncBabies, imagesArr)),
  uploadBabyPic: (babyId, imgFile) => dispatch(UserActions.uploadBabyPic(babyId, imgFile)),
  getMyBabies: () => dispatch(HomeActions.getMyBabies()),
  addProfile: (profile) => dispatch(UserActions.addProfile(profile.profile)),
  deleteBaby: (babyId) => dispatch(UserActions.deleteBaby(babyId)),
  darkMode: (themeModeSelected) => dispatch(AppActions.darkMode(themeModeSelected)),
  motherTrackingApi: (trackingData) => dispatch(HomeActions.motherTrackingApi(trackingData)),
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  checkAppState: (status) => dispatch(AppActions.checkAppState(status)),
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
  deleteFreezerInventoryApi: (id) => dispatch(HomeActions.deleteFreezerInventoryApi('/inventoryId/' + id)),
  isPumpRunning: (pumpState) => dispatch(HomeActions.isPumpRunning(pumpState)),
  optedState: (keys) => dispatch(AppActions.optedState(keys)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppStateHandler);
