import React, {Component, Fragment} from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import HomeActions from '@redux/HomeRedux';
import UserActions from '@redux/UserRedux';
import Slider from '@react-native-community/slider';
import moment from "moment";
import styles from './Styles/MyBabyScreenStyles'
import LoadingSpinner from "@components/LoadingSpinner";
import I18n from '@i18n';
import Colors from "@resources/Colors";
import ContractionActiveIcon from '@svg/ic_contraction_stats.svg';
import FavoriteIcon from '@svg/ic_heart'
import CherryIcon from '@svg/ic_cherry'
import LemonIcon from '@svg/ic_lemon'
import ApricotIcon from '@svg/ic_apricot'
import WalnutIcon from '@svg/ic_walnut'
import BackToWorkIcon from '@svg/ic_back_work'
import BackToWorkInActiveIcon from '@svg/ic_back2work_grey'
import BirthInActiveIcon from '@svg/ic_baby_grey'
import BirthIcon from '@svg/ic_birth'
import {calculateWeeksBetween, diffInDays, isDateGreater,convertSecToHourMin, diffInHoursAndMinutes,diffInDaysFromNow} from "@utils/TextUtils";
import Dialog from '@components/Dialog';
import FeedbackDialog from '@components/FeedbackDialog';
import BottomBanner from "@components/BottomBanner";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {Constants, Metrics} from "@resources";
import ActiveBreastFeedingIcon from '@svg/ic_breastfeedingactive';
import ActivePumpingIcon from '@svg/ic_stats_pumpactive';
import ActiveNappyIcon from '@svg/ic_nappy';
import ActiveBottleIcon from '@svg/ic_bottle';
import ActiveWeightIcon from '@svg/ic_weight';
import ActiveGrowthIcon from '@svg/ic_growth';
import ActiveSleepIcon from '@svg/ic_sleep';
import OfflineIcon from '@svg/ic_offline.svg'
import BabySelectionModal from "@components/BabySelectionModal";
import {createAllTrackedItems} from "@database/TrackingDatabase";
import {getRealmDb, saveAllBabies, saveMotherProfile, saveTimeLine,updateBaby} from "../Database/AddBabyDatabase";
import RNFetchBlob from "rn-fetch-blob";
import {getLocalFromMarket, locale} from "@utils/locale";
import Swiper from "react-native-swiper";
import {heightConversionHandler,weightConversionHandler,volumeConversionHandler} from '@utils/locale';
import PumpInactive from '@svg/ic_pump_inactive.svg';
import PumpActive from '@svg/ic_pump_active.svg';
import CreditCardIcon from '@svg/ic_credit_card.svg'
import ChiaSeedIcon from '@svg/ic_chia_seed.svg'
import SunFlowerFeedIcon from '@svg/ic_sunflower_seed.svg'
import SnowCrystalIcon from '@svg/ic_snow_crystal.svg'
import HandCreamIcon from '@svg/ic_hand_cream.svg'
import PopsicleIcon from '@svg/ic_popsicle.svg'
import RiceIcon from '@svg/ic_rice.svg'
import LadyBugIcon from '@svg/ic_ladybug.svg'
import FingerNailIcon from '@svg/ic_finger_nail.svg'
import ButtonIcon from '@svg/ic_button.svg'
import EarPhonesIcon from '@svg/ic_earphones.svg'
import HairpinIcon from '@svg/ic_hairpin.svg'
import LipStickIcon from '@svg/ic_ladybug.svg'
import NailPolishIcon from '@svg/ic_nail_polish.svg'
import HighlighterIcon from '@svg/ic_highlighter.svg'
import PencilIcon from '@svg/ic_pencil.svg'
import SmartPhoneIcon from '@svg/ic_smartphone.svg'
import KitchenPaperIcon from '@svg/ic_kitchen_paper.svg'
import SpaghettiIcon from '@svg/ic_spaghetti.svg'
import MagazineIcon from '@svg/ic_magazine.svg'
import LaptopIcon from '@svg/ic_laptop.svg'
import SoftDrinkIcon from '@svg/ic_soft_drink.svg'
import ChairIcon from '@svg/ic_chair.svg'
import CatIcon from '@svg/ic_cat.svg'
import FullTermSizeIcon from '@svg/ic_full_term_baby.svg'
import { scheduleFreezer1Notifications, scheduleFreezer2Notifications } from '@components/Notifications';
import GetterSetter from "@components/GetterSetter";
import PushController from './PushController';
import DeviceInfo from 'react-native-device-info'
import {hasPumpSupport} from "@utils/locale";
import { languageCode } from '@utils/locale';
import NavigationService from "@services/NavigationService";
import {isEmpty} from "@utils/TextUtils";
import { Analytics } from '@services/Firebase';
import {storeReviewDialog} from "@utils/InAppReview";

let analytics = new Analytics()
let negativeFeedbackCount = 0;
let feedbackDate = '';
let showFeedback = '';
class MyBabyScreen extends Component {
  BabySize = {
    "timeSlice": [
      {
        "icon": <FullTermSizeIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.full_term_baby_size')
      },
      {
        "icon": <FullTermSizeIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.full_term_baby_size')
      },
      {
        "icon": <FullTermSizeIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.full_term_baby_size')
      },
      {

        "icon": <FullTermSizeIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.full_term_baby_size')
      },
      {
        "icon": <CatIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.cat')
      },
      {
        "icon": <CatIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.cat')
      },
      {
        "icon": <CatIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.cat')
      },
      {
        "icon": <CatIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.cat')
      },
      {
        "icon": <ChairIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.seat_height_of_a_chair')
      },
      {
        "icon": <ChairIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.seat_height_of_a_chair')
      },
      {
        "icon": <ChairIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.seat_height_of_a_chair')
      },
      {
        "icon": <ChairIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.seat_height_of_a_chair')
      },
      {
        "icon": <SoftDrinkIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.2L/')
      },
      {
        "icon": <SoftDrinkIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.2L/')
      },
      {
        "icon": <LaptopIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.laptop')
      },
      {
        "icon": <LaptopIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.laptop')
      },
      {
        "icon": <MagazineIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.magayine')
      },
      {
        "icon": <MagazineIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.magayine')
      },
      {
        "icon": <SpaghettiIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.spaghetti')
      },
      {
        "icon": <SpaghettiIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.spaghetti')
      },
      {
        "icon": <KitchenPaperIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.kitchen_paper')
      },
      {
        "icon": <SmartPhoneIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.smartphone')
      },
      {
        "icon": <PencilIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.pen')
      },
      {
        "icon": <HandCreamIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.hand_cream')
      },
      {
        "icon": <PopsicleIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.popsicle')
      },
      {
        "icon": <HighlighterIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.highlighter')
      },
      {
        "icon": <CreditCardIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.credit_card')
      },
      {
        "icon": <NailPolishIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.nail_polish')
      },
      {
        "icon": <LipStickIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.lipstick')
      },
      {
        "icon": <HairpinIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.hairpin')
      },
      {
        "icon": <EarPhonesIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.earphone')
      },
      {
        "icon": <ButtonIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.button')
      },
      {
        "icon": <FingerNailIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.finger_nail')
      },
      {
        "icon": <LadyBugIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.lady_bug')
      },
      {
        "icon": <RiceIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.rice')
      },
      {
        "icon": <SunFlowerFeedIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.linen_seed')
      },
      {
        "icon": <ChiaSeedIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.chia_seed')
      },
      {
        "icon": <SnowCrystalIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.snow_crystal')
      },
      {
        "icon": <SnowCrystalIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>,
        "good_ones": I18n.t('my_baby.snow_crystal')
      },
    ]
  }
  constructor(props) {
    super(props);
    let {themeSelected} = props;
    this.state = {
      pumpSupport:false,
      timeSlices: [],
      isLoading: false,
      birthDate: '',
      showAddBabyDialog: false,
      selectedDate: new Date(),
      showBanner: true,
      isImageError: false,
      trackingArr: [],
      currentBabyClientId: '',
      showSwitchBabyModal: false,
      articlesList: [],
      articlePageDetails: {},
      page: 1,
      perPage: 10,
      isArticlesLoading: false,
      realmDb: null,
      babies: [],
      imagePath:null,
      isUiLoading:false,
      isBabySwitch:false,
      promoBanners: [],
      showPromoBanner: false,
      isImperial:true,
      units:KeyUtils.UNIT_IMPERIAL,
      showVipPopup: false,
      handleMultipleCallingForOffileImageFlag:false,
      notifPermissions: false,
      articleOfflinePopup: false,
      showFeedbackAlert: false,
      showInAppViewAlert: false,
    }
    this._isMounted = false;
    this._initialPhotoCheck=true;
    this._themeTextColor = themeSelected === 'dark' ? Colors.white: Colors.rgb_000000
  }


  getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  handleDownload = async (babyId) => {
    // if device is android you have to ensure you have permission
    if (Platform.OS === 'android') {
      const granted = await this.getPermissionAndroid();
      if (!granted) {
        return;
      }
    }
    //let dirs = RNFetchBlob.fs.dirs;
    return RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
      //path: dirs.DownloadDir + '/medela.png',
    }).fetch('GET', `${Constants.BASE_URL}rest/baby/picture/${babyId}`).then(res => {
      return Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path()
    }).catch(error => {
      return null;
    })
  };

  async componentDidMount() {
    await analytics.logScreenView('my_baby_screen');
    AsyncStorage.getItem(KeyUtils.NOTIF_PERMISSIONS).then((permission)=>{
      this.setState({ notifPermissions: permission === 'true' ? true : false })
    })
    const { userProfile , vipPackApi} = this.props;
    this._isMounted = true;
    AsyncStorage.getItem(KeyUtils.VIP_STATUS, (err, result) => {
      if(result === null || result === "false") {
        if(userProfile && userProfile!==undefined && userProfile.mother!==undefined && (userProfile.mother.registrationType === 4 || userProfile.mother.registrationType === 5)) {
          let value = {"vipStatus": true}
          vipPackApi(value)
        }
      }
    })
    // AsyncStorage.getItem(KeyUtils.SELECTED_LANGUAGE_LOCALE, (err, result) => {
    //   if(result === null) {
    //     AsyncStorage.setItem(KeyUtils.SELECTED_LANGUAGE_LOCALE, I18n.locale.substr(0, 2))
    //   } else {
    //     setLocale(result,'mybabyscreen')
    //     getLanguage(result)
    //   }
    // })
    AsyncStorage.setItem(KeyUtils.SELECTED_TAB_NAME,'MyBabyScreen')
    const {navigation,getUserProfile,getTrackingApi,getMotherTrackingApi} = this.props
    let realmDb=await getRealmDb()
    this.realmDb=realmDb;
    this.setState({realmDb:realmDb,isUiLoading:true})
    // this.notificationHandler()
    this.focusListener = navigation.addListener('didFocus',async () => {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      await analytics.logScreenView('my_baby_screen')
      AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
        if (_units!=null){
          this.setState({isImperial:_units===KeyUtils.UNIT_IMPERIAL,units:_units})
        }else{
          this.setState({isImperial:true,units:KeyUtils.UNIT_IMPERIAL})
        }
      })

      const {realmDb}=this.state
      if (realmDb==null){
          let realmDb=await getRealmDb()
          this.setState({realmDb:realmDb},()=>{
            this.init()
            this.callTrackingApi()
          })
      }else{
        this.init()
        this.callTrackingApi()
      }
    })
    Linking.getInitialURL()
      .then(url => {
        url && this.props.navigation.navigate("ArticleDetailsScreen", {articleId: url.split("/").pop() })
      })
      .catch((error) => console.log(error, 'errpr'))
    Linking.addEventListener('url', this.handleOpenURL.bind(this));

    this.setState({isLoading: true})
    getUserProfile()
  }

  viewFeedback = async () => {
    const {selected_baby} = this.props
    let realmDb=await getRealmDb()
    let myItems = realmDb.objects('Tracking');
    const tempArr = myItems.filter(item => item.babyId == selected_baby.babyId && item.isSync == true);
    AsyncStorage.getItem('negativeFeedbackCount').then((count)=>{
      if(count==null){
        negativeFeedbackCount = 0
      } else {
        negativeFeedbackCount = count
      }
    })
    feedbackDate= await AsyncStorage.getItem('FeedbackDate')
    let today = new Date();
    let duedate = feedbackDate!=null? new Date(feedbackDate):new Date();
    duedate.setDate(today.getDate() + 122);
    let nextFeedbackDate = moment(duedate).format('YYYY-MM-DD');
    showFeedback = await AsyncStorage.getItem('ShowFeedback')
  
    setTimeout(() => {
    if (
      tempArr && tempArr.length>=50 && negativeFeedbackCount<3 && showFeedback != 'false' 
      ||
      tempArr && tempArr.length>=50 &&  negativeFeedbackCount<3 &&  showFeedback == 'false' && moment(today).format('YYYY-MM-DD') && moment(today).format('YYYY-MM-DD') == nextFeedbackDate
      ){
      this.setState({ showFeedbackAlert: true }) 
    }
    }, 100);
  }

  handleOpenURL = (event) => {
    let articleId = event.url.split("/").pop()
    this.props.navigation.navigate("ArticleDetailsScreen", {articleId: articleId })
  }

  async callTrackingApi() {
    const {getTrackingApi, isInternetAvailable} = this.props
    /*  if (isInternetAvailable) {
        let date = moment().subtract(6, 'd').format('YYYY-MM-DD')
        getTrackingApi(date, moment().add(1, 'days').format('YYYY-MM-DD'))
      } else {*/
    scheduleFreezer1Notifications()
    scheduleFreezer2Notifications()
    // this.notificationHandler(arr)
    AsyncStorage.getItem(KeyUtils.USER_LAST_EMAIL).then((userId)=>{
      const {realmDb} = this.state
      let myItems = realmDb.objects('Tracking');
      let arr = JSON.parse(JSON.stringify(myItems))
      arr=arr.filter((e)=>{
        return e.userId==userId
      })
      this.setState({trackingArr: []},()=>{
        this.saveTrackingInDb(arr)
      })
    })

    //   }
  }

  async notificationHandler(arr=[]) {
    const {realmDb, babies, userProfile} = this.state
    let updateBabies = []
    let userMotherProfile = await realmDb.objects('UserMotherProfile')
    if (babies.length>0){
      updateBabies = babies.filter((e) => {
        return e.username===userMotherProfile[0].username
      })
    }else {
      updateBabies = babies.filter((e) => {
        return !e.isDeleted
      })
    }
    fourWeeksNappyNotification(updateBabies, arr)
    breastFeedingPumpingNotification(updateBabies, arr)
    wetNappyNotification(updateBabies, arr)
    firstDayNappyNotification(updateBabies)
    wetNappyWeek6Notif(updateBabies)
    cancelNotifications(updateBabies)
  }

  refreshView = () => {
    // this.init()
  }

  init = async () => {
    const {getUserProfile, isInternetAvailable, remoteConfig,userProfile,selected_baby} = this.props;

    /* if (isInternetAvailable) {
       getTimeSlices()
     } else {*/
    const {realmDb} = this.state

    if (realmDb != null && !realmDb.isClosed) {
      let myItems = realmDb.objects('Timeline');
      let arr = JSON.parse(JSON.stringify(myItems))
      let babyArr = realmDb.objects('AddBaby');
      let babies = JSON.parse(JSON.stringify(babyArr))

      arr=arr.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.startDate) - new Date(b.startDate);
      })
      let sliderValue=this.getMinimumValue(new Date(), arr)

      let profile = realmDb.objects('UserMotherProfile');
      if (profile.length>0){
        let motherProfileObj = JSON.parse(JSON.stringify(profile))
        const {birthDate, backToWorkState, backToWorkDate, currentBabyClientId,market} = motherProfileObj[0].mother
        let index = babies.findIndex((e) => {
          return e.babyId === currentBabyClientId
        })
        let img=babies[index].imagePath!=null&&babies[index].imagePath!=''?babies[index].imagePath:null;
        if(!isInternetAvailable){
          let index = babies.findIndex((e) => {
            return e.babyId === selected_baby.babyId;
          })
          img=babies[index].imagePath!=null&&babies[index].imagePath!=''?babies[index].imagePath:null;
        }
        let pumpSupport = hasPumpSupport(remoteConfig && remoteConfig.markets, market)
        this.setState({
          pumpSupport,
          birthDate: index > -1 ? babies[index].birthday : birthDate,
          currentBabyClientId,
          backToWorkState,
          backToWorkDate,
          timeSlices: arr,
          babies,
          imagePath:img
        })
      }
    } else {

    }

  }
  async ifLocallyImageStillExists(realmDb){
    let babyArr = realmDb.objects('AddBaby');
    let babies = JSON.parse(JSON.stringify(babyArr));
    let profile = realmDb.objects('UserMotherProfile');
    if(profile.length>0){
      let motherProfileObj = JSON.parse(JSON.stringify(profile));
      const {currentBabyClientId} = motherProfileObj[0].mother;
      let currentBaby = babies.find((e) => {
        return e.babyId === currentBabyClientId
      })
      this._initialPhotoCheck=false;
      const {imagePath,isImageError}=this.state
      if(babies!=undefined&&babies.length>0){
        babies.forEach(async (baby)=>{
          RNFetchBlob.fs.exists(baby.imagePath).then(async(exist) => {
            if (exist) {
              if(currentBaby.babyId==baby.babyId){
                this.setState({imagePath:baby.imagePath,isImageError:false})
              }
            } else {
              RNFetchBlob.config({
                fileCache : true,
                appendExt : 'png',
              }).fetch('GET', encodeURI(`${Constants.BASE_URL}rest/baby/picture/${baby.babyId}`)).then((res) => {
                if(currentBaby.babyId==baby.babyId){
                  this.setState({imagePath:res.path(),isImageError:false})
                }
                baby['imagePath']=res.path();
                updateBaby(realmDb,baby).then((e)=>{
                })
              }).catch((e)=>{
                console.log('ifLocallyImageStillExists',e)
              })
            }
          })
        })
      }
    }
  }
  

  componentWillUnmount() {
    this._isMounted = false;
    Linking.removeEventListener('url', this.handleOpenURL);
    this.focusListener && this.focusListener.remove();
  }

  handleTimeSliceApiResponse(prevProps,prevState){
    const { timeSlicesFailure, timeSlicesSuccess, selected_baby, timeSlices,getArticles} = this.props
    const {realmDb,perPage} = this.state

    if (timeSlicesSuccess !== prevProps.timeSlicesSuccess && timeSlicesSuccess) {
      if (timeSlices && timeSlices.length > 0) {
        saveTimeLine(realmDb, timeSlices).then(r => {
        })
      }
      this.setState({timeSlices})
      let index = timeSlices.findIndex((e) => {
        return moment(new Date()).isBetween(new Date(e.startDate), new Date(e.endDate))
      })
      if (index > -1) {
        //if (this.state.articlesList.length===0){
          this.loadArticles(timeSlices[index].url, this.state.page, perPage)
        //}
      }else {
        if (selected_baby && selected_baby.birthday) {
          let babyBirthDate = new Date(selected_baby.birthday)
          let today = new Date()
          if (isDateGreater(today, babyBirthDate)) {  // post-natal
            this.loadArticles(timeSlices[timeSlices.length-1].url, this.state.page, perPage)
          }else{
            this.setState({isLoading:false,isUiLoading:false,isBabySwitch:false,articlesList:[]})
          }
        }else{
          this.setState({isLoading:false,isUiLoading:false,isBabySwitch:false,articlesList:[]})
        }
      }
      this.setState({isBabySwitch:false})
    }
    if (timeSlicesFailure != prevProps.timeSlicesFailure && timeSlicesFailure) {
      this.setState({isLoading:false,isUiLoading:false,isBabySwitch:false})
    }
  }

  loadArticles(url,page,perPage){
    const {getArticles} = this.props
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
      if (_local!=null){
        getArticles(_local, url, page,perPage)
      }else{
        getArticles(locale().replace("-", "_"), url, page,perPage)
      }
      this.setState({isArticlesLoading: true})
    })

  }
  loadPromoBanner(){
    const {getPromoBannerApi} = this.props
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
      if (_local!=null){
        getPromoBannerApi(_local)
      }else{
        getPromoBannerApi(locale().replace("-", "_"))
      }
    })

  }
  checkImageURL=async(babyId)=>{
    try{
      let resp=await fetch(`${Constants.BASE_URL}rest/baby/picture/${babyId}`);
      if(resp.status==200){
        return true;
      }else{
         return false
      }
    }catch(e){
      return false
    }
  }
  checkIfImageLocallySavedOrNot=async()=>{
    const {realmDb} = this.state;
    let babyArr = realmDb.objects('AddBaby');
    let flag=false;
    let babiesList = JSON.parse(JSON.stringify(babyArr));
    for(let index =0;index<babiesList.length;index++){
      if((babiesList[index].imagePath==null||babiesList[index].imagePath==''||babiesList[index].imagePath==undefined)){
        flag=true;
        babiesList[index].imagePath=null;
        this.checkImageURL(babiesList[index].babyId).then(async(response)=>{
          if(response===true){
            babiesList[index].imagePath=await this.handleDownload(babiesList[index].babyId)
            updateBaby(realmDb,babiesList[index]).then((e)=>{
              this.setState({handleMultipleCallingForOffileImageFlag:false});
            })
          }
        },err=>{
          console.log('check image url error');
          this.setState({handleMultipleCallingForOffileImageFlag:false});
        })
      }
    }
    if(!flag){
      this.setState({handleMultipleCallingForOffileImageFlag:false});
    }
    setTimeout(() => {
      const {handleMultipleCallingForOffileImageFlag}=this.state
      if(handleMultipleCallingForOffileImageFlag===true){
        this.setState({handleMultipleCallingForOffileImageFlag:false});
      }
    }, 5000);
  }
  async handleMyBabiesApiResponse(prevProps,prevState){


    const {setSelectedBaby, selected_baby, babiesSuccess, babiesFailure, babies, getTimeSlices, userProfile,remoteConfig,isPicUploaded} = this.props
    const {realmDb,handleMultipleCallingForOffileImageFlag} = this.state

    if (babiesSuccess !== prevProps.babiesSuccess && babiesSuccess) {

      if (userProfile && userProfile.mother) {
      
        // this.handleMotherProfile(prevProps,prevState)
        const {birthDate, backToWorkState, backToWorkDate, username,timezone, currentBabyClientId, market} = userProfile.mother
       
        let modifiedBabies = babies.map(baby => ({...baby, isSync: true, username}));
        let shallowBabies = JSON.parse(JSON.stringify(modifiedBabies))
        for (let i = 0; i < shallowBabies.length; i++) {
          let babyId = shallowBabies[i].babyId

        }
        //console.log(JSON.stringify(shallowBabies),'shallow babies');
        saveAllBabies(realmDb, shallowBabies).then((success) => {
          if(handleMultipleCallingForOffileImageFlag===false){
            this.setState({handleMultipleCallingForOffileImageFlag:true},()=>{
              this.checkIfImageLocallySavedOrNot();
            });
          }
        })
        let index = babies.findIndex((e) => {
          return e.babyId === currentBabyClientId
        })
        if(index>-1){
          setSelectedBaby(babies[index]);
        }
        this.setState({
          babies: shallowBabies,
          birthDate: index > -1 ? babies[index].birthday : birthDate,
          currentBabyClientId,
          backToWorkState,
          backToWorkDate
        })
        getTimeSlices()
      }

    }

    if (babiesFailure !== prevProps.babiesFailure && babiesFailure ) {
      this.setState({isUiLoading:false})
    }

  }
  async handleUserProfileApiResponse(prevProps,prevState){
    const {getMyBabies, userProfileSuccess, userProfileFailure, userProfile ,remoteConfig,getTrackingApi,getMotherTrackingApi,vipPackApi} = this.props

    const {realmDb} = this.state

    if (userProfileSuccess != prevProps.userProfileSuccess && userProfileSuccess && prevState.isLoading) {
      if(this._initialPhotoCheck){
        this.ifLocallyImageStillExists(this.realmDb||realmDb)
      }
      const {realmDb} = this.state
      const {birthDate, backToWorkState, backToWorkDate, units,username,timezone, vipStatus, market, registrationType} = userProfile.mother
      let localeAccordingToMarket = getLocalFromMarket(remoteConfig && remoteConfig.markets, market)
      let pumpSupport = hasPumpSupport(remoteConfig && remoteConfig.markets, market)
      this.setState({pumpSupport})
      AsyncStorage.setItem(KeyUtils.SELECTED_LOCALE, localeAccordingToMarket)
      AsyncStorage.setItem(KeyUtils.SELECTED_TIME_ZONE, timezone)
      AsyncStorage.setItem(KeyUtils.USER_NAME, username)
      AsyncStorage.setItem(KeyUtils.UNITS, units)

      let mP = JSON.parse(JSON.stringify(userProfile))
      mP['username'] = username
      mP.isSync = true
      saveMotherProfile(realmDb, mP).then(r => {
      })
      getMyBabies()
      let date = moment().subtract(6, 'd').format('YYYY-MM-DD')
      getTrackingApi()
      getMotherTrackingApi(date, moment().add(1, 'days').format('YYYY-MM-DD'))
      if(registrationType==null || registrationType==1 || registrationType==3 || registrationType==5 || registrationType=='') {
        this.loadPromoBanner()
      }
      if((registrationType==5 || registrationType==4) && !vipStatus) {
        let value = {"vipStatus": true}
        vipPackApi(value)
      }


    }
    if (userProfileFailure !== prevProps.userProfileFailure && userProfileFailure && prevState.isLoading) {
      this.setState({isLoading: false,isUiLoading:false})
    }
  }


  async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const { selected_baby, getTimeSlices,getTrackingApiSuccess, getTrackingApiFailure,getTrackingResponse,vipPackSuccess,vipPackFailure, getArticlesSuccess,getArticlesFailure,getMotherTrackingApiSuccess,getMotherTrackingResponse,getMotherTrackingApiFailure,
      syncBabySuccess,switchBabySuccess,getUserProfile,isInternetAvailable,selectedBabyClientId, bannerApiSuccess,bannerApiFailure,response,switchBabyFailure,trackingId} = this.props
      const {babies,timeSlices,realmDb,imagePath, trackingArr} = this.state
      if(isInternetAvailable !== prevProps.isInternetAvailable && isInternetAvailable){
        this.setState({isLoading: true, isUiLoading: true})
        getUserProfile()
      }

    if (vipPackFailure != prevProps.vipPackFailure && vipPackFailure) {
      console.log('Vip fail')
    }

    if (trackingId && trackingId!==prevProps.trackingId){
       const {realmDb,trackingArr} = this.state
      let myItems = realmDb.objects('Tracking');
      let arr = JSON.parse(JSON.stringify(myItems))
       let item=arr.find((e)=>{
         return e.id==trackingId
       })
      if (item!=undefined){
        trackingArr.unshift(item)
        this.setState({trackingArr})
      }
    }

    if (switchBabyFailure!=prevProps.switchBabyFailure && switchBabyFailure){
      this.setState({isBabySwitch:false});
      if(!isInternetAvailable){
        let babyArr = realmDb.objects('AddBaby');
        let localBabies = JSON.parse(JSON.stringify(babyArr));
        let currentLocalBaby = localBabies.find((e) => {
          return e.babyId === selected_baby.babyId;
        })
        if(currentLocalBaby!=undefined){
          let img=currentLocalBaby.imagePath!=null&&currentLocalBaby.imagePath!=''?currentLocalBaby.imagePath:null;
          if(img!=imagePath){
            this.setState({imagePath:img});
          }
        }
      }
    }

    if (switchBabySuccess!=prevProps.switchBabySuccess && switchBabySuccess){
      getTimeSlices()
      let currentBaby=babies.find((e)=>{
        return e.babyId===selectedBabyClientId
      })
      let babyArr = realmDb.objects('AddBaby');
      let localBabies = JSON.parse(JSON.stringify(babyArr))
      let currentLocalBaby = localBabies.find((e) => {
        return e.babyId === selectedBabyClientId;
      })
      if(currentLocalBaby!=undefined){
        let img=currentLocalBaby.imagePath!=null&&currentLocalBaby.imagePath!=''?currentLocalBaby.imagePath:null;
        this.setState({imagePath:img});
      }
      if (currentBaby!=undefined){
        let profile = realmDb.objects('UserMotherProfile');
        let modified=JSON.parse(JSON.stringify(profile))
        if (modified.length>0){
          modified[0].mother.currentBabyClientId=selectedBabyClientId
          saveMotherProfile(realmDb,modified[0]).then((e)=>{

          })
        }
      }
    }

    await this.handleUserProfileApiResponse(prevProps, prevState)
    await this.handleMyBabiesApiResponse(prevProps, prevState)
    this.handleTimeSliceApiResponse(prevProps,prevState)


    if (selected_baby!=prevProps.selected_baby){

    }


    if (syncBabySuccess != prevProps.syncBabySuccess && syncBabySuccess ) {
      //   getMyBabies()
    }

    if (getTrackingApiSuccess != prevProps.getTrackingApiSuccess && getTrackingApiSuccess) {
      let currentScreenName= NavigationService.getCurrentRoute(NavigationService.getNavigator().state.nav)
      currentScreenName=='MyBabyScreen' ? this.saveTrackingInDb(getTrackingResponse):null
      this.viewFeedback()
    }
    if (getTrackingApiFailure != prevProps.getTrackingApiFailure && getTrackingApiFailure) {

    }
    if (getMotherTrackingApiSuccess != prevProps.getMotherTrackingApiSuccess && getMotherTrackingApiSuccess ) {
      this.saveTrackingInDb(getMotherTrackingResponse)
    }
    if (getMotherTrackingApiFailure != prevProps.getMotherTrackingApiFailure && getMotherTrackingApiFailure ) {

    }

    if (getArticlesSuccess != prevProps.getArticlesSuccess && getArticlesSuccess && this.state.articlesList !== this.props.getArticlesSuccess) {
      const {_meta}=this.props.getArticlesSuccess
      this.setState({
        isLoading: false,
        isUiLoading:false,
        articlesList: _meta.currentPage==1?this.props.getArticlesSuccess.items:this.state.articlesList.concat(this.props.getArticlesSuccess.items),
        articlePageDetails: this.props.getArticlesSuccess._meta,
        isArticlesLoading: false
      })
    }

    if (getArticlesFailure != prevProps.getArticlesFailure && getArticlesFailure) {
      this.setState({
        isLoading: false,
        isUiLoading:false,
        isArticlesLoading: false
      })
    }
    if (bannerApiSuccess != prevProps.bannerApiSuccess && bannerApiSuccess) {
      this.setState({
        isLoading: false,
        promoBanners: response.articles,
        showPromoBanner:response.articles.length>0
      })
    }
    if (bannerApiFailure != prevProps.bannerApiFailure && bannerApiFailure) {
      this.setState({
        isLoading: false,
        promoBanners: [],
        showPromoBanner:false
      })
    }
  }

  saveTrackingInDb = (data) => {
    const {userProfile} = this.props
    const {realmDb} = this.state
    if (userProfile && userProfile.mother) {
      let userId = userProfile.mother.username
      let trackingData = JSON.parse(JSON.stringify(data))
      trackingData.sort(function (a, b) {
        let keyA = new Date(a.trackAt),
          keyB = new Date(b.trackAt);
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

      const {trackingArr}=this.state

      const {isInternetAvailable} = this.props
      for (let i = 0; i < trackingData.length; i++) {
        if(trackingData[i].inventory!=undefined){
          trackingData[i].inventory.userId = userId
          trackingData[i].inventory.isSync = true
        }
        trackingData[i].userId = userId
        trackingData[i].isSync = true
        delete trackingData[i].statusFlags
        //   if (i < 3) {
        let j = trackingArr.findIndex(x => x.id == trackingData[i].id);
        if(j <= -1){
          trackingArr.push(trackingData[i]);
        }
        // trackingArr.push(trackingData[i])
        //}
      }

      trackingArr.sort(function (a, b) {
        let keyA = new Date(a.trackAt),
          keyB = new Date(b.trackAt);
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      if (isInternetAvailable) {
        createAllTrackedItems(realmDb, trackingData).then((r) => {
        })
      }

      this.setState({trackingArr: trackingArr})
    }
  }

  dateOfBirth(searchDate, data) {
    let index = data.findIndex((e) => {
      let dd=moment(searchDate).isBetween(new Date(e.startDate), new Date(e.endDate))
      if (dd){

      }
      return dd
    })
    if (index > -1) {
      return index
    } else {
      return 0
    }

  }

  getMinimumValue(searchDate, data) {
    let arr=JSON.parse(JSON.stringify(data))
    arr=arr.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.startDate) - new Date(b.startDate);
    })
    let index = arr.findIndex((e,i) => {
      return moment(searchDate).isBetween(new Date(e.startDate), new Date(e.endDate))
    })
    if (index > -1) {
      return index++
    } else {
      return 0
    }

  }

  renderHeader() {
    const { themeSelected } = this.props
    const window = Dimensions.get('window')
    const width = window.width
    const {pumpSupport} = this.state
    // let themeTextColor = themeSelected === 'dark' ? Colors.rgb_000000: Colors.white
    return <View style={styles.header}>
      <View style={[styles.headerView, {flexDirection: "row", justifyContent: "flex-start"}]}>
        <Text maxFontSizeMultiplier={1.1} style={[styles.headerTextStyle, {color:this._themeTextColor}]}>{I18n.t('addBaby.my_baby')}</Text>

      </View>
      {pumpSupport &&  <View style={[styles.headerView, {flexDirection: 'row', justifyContent: 'flex-end', alignItems:'center'}]}>
        <TouchableOpacity 
          activeOpacity={1} 
          accessibilityLabel={I18n.t("accessibility_labels.connect_pump")} 
          accessible={true}
          onPress={async () => {
          await analytics.logOnPress(Constants.START_PUMP_PAIRING_FROM_MY_BABY);
          this.getPairedDevices()
        }} style={[styles.headerRightView,{marginLeft:Platform.OS == 'android' && DeviceInfo.getFontScale()>1.3 ? I18n.t('pump_list_setting.connect_pump').length >20 ||I18n.t('pump_list_setting.connect_pump').length >20 ? width*0.20 :  width*0.10: null}]}>
          <View style={{flexDirection:'row', alignItems:'center',}}>
            {!this.props.isConnected ? <Text maxFontSizeMultiplier={1.1} style={[styles.articleHeaderTextStyles,{marginEnd:10, color:this._themeTextColor}]}>{I18n.t('pump_list_setting.connect_pump')}</Text> :

              <Text maxFontSizeMultiplier={1.1} style={[styles.articleHeaderTextStyles,{color:Colors.rgb_0770E9, marginEnd:10}]}>{I18n.t('pump_list_setting.pump_now')}</Text>}
            {this.props.isConnected ? <PumpActive width={Metrics.moderateScale._24} height={Metrics.moderateScale._24}/> :
              <PumpInactive width={Metrics.moderateScale._24} height={Metrics.moderateScale._24} fill={Colors.rgb_00b0eb}/>}
          </View>
        </TouchableOpacity>
      </View>}

    </View>
  }

  getPairedDevices(){
    const {isConnected, pumps}=this.props
    const {navigation}=this.props
    let isPumpFound = false
    let pumpL = [];
    if(pumps && pumps.pumps && pumps.pumps.length>0) {
      for (let item of pumps.pumps) {
        !item.deleteFlag && pumpL.push({...item, device: {}, isOnline: false})
      }
      if (pumpL.length > 0) {
        isPumpFound = true
      }
    }
    if(isConnected) {
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')
      navigation.navigate('BreastFeedingPumpingScreen', {
        isFrom: 'bluetooth',
        routeName:'MyBaby',
        isSiriNameReturned:true,
      })
    }else {
      if(isPumpFound) {
        GetterSetter.setParentScreen('home')
        navigation.navigate('PairedPumpListScreen')
      }else {
        GetterSetter.setParentScreen('home')
        navigation.navigate('BleSetupScreen')
      }
    }
  }

  calculateDaysDiff(startDate) {
    let start = moment(startDate);
    let end = moment();

    let difference = end.diff(start, "days")
    if (difference < 0) {
      let df = start.diff(end, "weeks")
      df += 1
      return `${df} ${df === 1 ? I18n.t('my_baby.week_old') : I18n.t('my_baby.weeks')} ${I18n.t('my_baby.before_birth')}`
    } else if (difference > 7) {
      if(difference >= 61){
      var years = end.diff(start, 'year');
      start.add(years, 'years');
      var months = end.diff(start, 'months');
      let monthText = months > 0 ? `${months} ${months === 1 ? I18n.t('my_baby.month') : I18n.t(((months) > 4 && (languageCode() === 'pl' || languageCode() === 'ru')) ? 'my_baby.5_months' : 'my_baby.months')}` : ''
      let yearsText = years > 0 ? `${years} ${years === 1 ? I18n.t('my_baby.year') : I18n.t(((years) > 4 && (languageCode() === 'pl' || languageCode() === 'ru')) ? 'my_baby.5_years' : 'my_baby.years')} ${!isEmpty(monthText)?',':''} ` : ''
      return `${yearsText}${monthText}`
      } else {
        let df = end.diff(start, "weeks")
        if(df===1) {
          return `${df} ${I18n.t('my_baby.week_old')}`
        }else {
          return `${df} ${I18n.t(((df) > 4 && (languageCode() === 'pl' || languageCode() === 'ru')) ? 'my_baby.5_weeks_old' : 'my_baby.weeks_old')}`
        }
      }
    } else {
      if (difference === 0) {
        let endDate=moment().format('YYYY-MM-DD')
        return endDate.toString().split('T')[0]==startDate?I18n.t('my_baby.same_day_born_message'):`1 ${I18n.t('my_baby.week')} ${I18n.t('my_baby.before_birth')}`
      } else if (difference === 1) {
        return `1 ${I18n.t('my_baby.day_old')}`
      } else {
        return `${difference} ${I18n.t(((difference) > 4 && (languageCode() === 'pl' || languageCode() === 'ru')) ? 'my_baby.5_days_old' : 'my_baby.days_old')}`
      }
    }

  }
  getBabyImage(babyId,selected_baby,imagePath,isImageError){
    //const {isImageError,imagePath}=this.state;
    let img;
    if(imagePath!=''&&imagePath!=null&&imagePath!=undefined){
       img= {uri:imagePath}
    }
    else if(babyId && !isImageError){
      img= {uri: `${Constants.BASE_URL}rest/baby/picture/${babyId}`}
    }
    else img= require('../Images/png/my_baby.png')
    return img
  }
  renderBabyView() {
    let birthDatePer, backToStateWorkPer = -1
    const {isImageError, babies, timeSlices, backToWorkDate,isBabySwitch} = this.state
    const {selected_baby,userProfile, navigation, themeSelected} = this.props
    // let themeTextColor = themeSelected === 'dark' ? Colors.rgb_000000: Colors.white
    let babyId
    if (selected_baby && babies && babies.length > 0) {
      babyId = selected_baby.babyId
    }
    if (selected_baby && selected_baby.birthday) {
      const {babyId,birthday}=selected_baby
      let index = this.getMinimumValue(new Date(birthday), timeSlices)

      if (Platform.OS=='ios'){
        index=isDateGreater(new Date(), new Date(selected_baby.birthday))?index-3:index+3
      }else {
        index=isDateGreater(new Date(), new Date(selected_baby.birthday))?index-6:index
      }

      birthDatePer = `${(index / timeSlices.length) * 70}%`
    }
    if (backToWorkDate) {
      let today = new Date()
      let backWorkDate = new Date(backToWorkDate)
      let index = this.getMinimumValue(new Date(backToWorkDate), timeSlices)
      backToStateWorkPer = `${(index / timeSlices.length) * 70}%`
    }
    let babyBirthDate = new Date(selected_baby.birthday)
    let today = new Date()
    let sliderValue=this.getMinimumValue(new Date(), timeSlices)
    if (sliderValue===0 && isDateGreater(today,babyBirthDate)){
      sliderValue=timeSlices.length
    }
    //console.log('sliderValue-----',sliderValue,isDateGreater(today,babyBirthDate))

    return <ImageBackground defaultSource={require('../Images/png/my_baby.png')}
                            onError={(error) => {
                              this.setState({isImageError: true,imagePath:null})
                            }}
                            source={this.getBabyImage(babyId,selected_baby,this.state.imagePath,this.state.isImageError)}
                            style={styles.babyImageView}>

      <ImageBackground source={require('../Images/png/overlay_white.png')} style={styles.overlayStyle}>

        {isBabySwitch &&  <LoadingSpinner /> }
        <TouchableOpacity style={styles.babyImageInnerContainer} activeOpacity={1} onPress={() => navigation.navigate('BabyInfoScreen', {selectedBabyData: selected_baby})}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.babyNameTextView,{color:Colors.rgb_000000}]} >{babies && babies.length > 0 && selected_baby.name}</Text>
          <Text maxFontSizeMultiplier={1.7}
            style={[styles.babyAgeTextView,{color:Colors.rgb_000000}]}>{selected_baby && selected_baby.birthday && selected_baby.birthday.length > 0 && (this.calculateDaysDiff(selected_baby.birthday))}</Text>

          <TouchableOpacity style={styles.switchView} onPress={() => {
            let allBabies;
            const {realmDb}=this.state
            if(userProfile&&userProfile.mother&&userProfile.mother.username){
              allBabies=babies.filter(v=>(!v.isDeleted&&v.username===userProfile.mother.username));
            }else if(realmDb!=null){
              let userProfile = realmDb.objects('UserMotherProfile');
              userProfile = JSON.parse(JSON.stringify(userProfile));
              allBabies=babies.filter((v)=>{
                return  !v.isDeleted && v.username===userProfile[0].username
              })
            }
            if (allBabies && allBabies.length > 1) {
              this.setState({showSwitchBabyModal: true})
            } else {
              this.setState({showAddBabyDialog: true})
            }
          }}>
            <Text  maxFontSizeMultiplier={1.7} style={[styles.switchTextView,{color:Colors.rgb_000000}]}>{I18n.t('my_baby.switch')}</Text>
          </TouchableOpacity>


          <View style={styles.relativeStyle}>
            {!isBabySwitch && <View pointerEvents="none">
              <Slider
                accessibilityLabel={I18n.t("accessibility_labels.baby_timeline")} 
                accessible={true}
                style={styles.sliderStyle}
                value={sliderValue}
                thumbTintColor={'transparent'}
                maximumValue={timeSlices.length}
                minimumTrackTintColor={Colors.rgb_979797}
                maximumTrackTintColor={Colors.white}
                trackImage={null}
              />
            </View>}

            {!isBabySwitch && selected_baby && selected_baby.birthday && birthDatePer !== -1 && (
              isDateGreater(new Date(), new Date(selected_baby.birthday)) ?
                <BirthIcon style={[styles.babyBirthStaticView, {left: birthDatePer}]} width={20} height={30}/> :
                <BirthInActiveIcon style={[styles.babyBirthStaticView, {left: birthDatePer}]} width={20} height={30}/>
            )}
            {!isBabySwitch && selected_baby && selected_baby.birthday && backToStateWorkPer !== -1 && (
              isDateGreater(new Date(), new Date(backToWorkDate)) ?
                <BackToWorkIcon style={[styles.babyBirthStaticView, {left: backToStateWorkPer}]} width={20}
                                height={30}/> :
                <BackToWorkInActiveIcon style={[styles.babyBirthStaticView, {left: backToStateWorkPer}]} width={20}
                                        height={30}/>
            )}
          </View>
        </TouchableOpacity>
      </ImageBackground>
      {this.renderBabyBottomView()}
    </ImageBackground>
  }

  renderBabyBottomView() {
    const {birthDate} = this.state
    const {babies, selected_baby} = this.props
    if (selected_baby && selected_baby.birthday) {
      let babyBirthDate = new Date(selected_baby.birthday)
      let today = new Date()
      if (isDateGreater(today, babyBirthDate)) {  // post needal
        let text = '';
        let volumeText = ''
        let icon;
        today.setHours(24, 0, 0, 0)
        babyBirthDate.setHours(24, 0, 0, 0)

        let mStartDate = moment([today.getFullYear(), today.getMonth(), today.getDate()]);
        let mTermDate = moment([babyBirthDate.getFullYear(), babyBirthDate.getMonth(), babyBirthDate.getDate()]);
        let monthsDiff = mStartDate.diff(mTermDate, 'months', true);
        if (monthsDiff > 6) {
          return null
        }
        let diffInDay = parseInt(diffInDays(babyBirthDate, today))
        if (diffInDay <= 2) {
          text = I18n.t('my_baby.size_of_cherry')
          volumeText = I18n.t('my_baby.volume1')
          icon = <CherryIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>
        } else if (diffInDay > 2 && diffInDay <= 6) {
          text = I18n.t('my_baby.size_of_walnut')
          volumeText = I18n.t('my_baby.volume2')
          icon = <WalnutIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>
        } else if (diffInDay > 6 && diffInDay <= 9) {
          text = I18n.t('my_baby.size_of_apricot')
          volumeText = I18n.t('my_baby.volume3')
          icon = <ApricotIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>
        } else if (diffInDay > 9 && diffInDay <= 14) {
          text = I18n.t('my_baby.size_of_lemon')
          volumeText = I18n.t('my_baby.volume4')
          icon = <LemonIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>
        } else if (diffInDay > 14 && diffInDay <= 29) {
          text = I18n.t('my_baby.size_of_lemon')
          volumeText = I18n.t('my_baby.volume5')
          icon = <LemonIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>
        } else {
          text = I18n.t('my_baby.size_of_lemon')
          volumeText = I18n.t('my_baby.volume6')
          icon = <LemonIcon style={styles.eggStyle} fill={Colors.rgb_fecd00}/>
        }
        return <View style={styles.babyBottomView}>
          <View style={styles.birthView1}>
            {icon}
          </View>
          <View style={[styles.birthView2, {paddingVertical: 10}]}>
            {/* <Text maxFontSizeMultiplier={1.7} style={styles.rubberTextView}>{`${I18n.t('my_baby.actual_tummy_size')}${text}`}</Text> */}
            <View style={{flexDirection: 'column'}}>
              <Text adjustsFontSizeToFit={true} numberOfLines={1} maxFontSizeMultiplier={1.7} style={[styles.rubberTextView,{color:Colors.rgb_000000}]}>{I18n.t('my_baby.actual_baby_stomach_size')}</Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.volumeTextView,{color:Colors.rgb_000000}]}>{text}</Text>
            </View>

            {/*<View style={{flexDirection: 'row'}}>
            <Text maxFontSizeMultiplier={1.7} style={styles.rubberTextView}>{volumeText && I18n.t('my_baby.volume')}</Text>
            <Text maxFontSizeMultiplier={1.7} style={styles.volumeTextView}>{volumeText}</Text>
          </View>*/}
          </View>
        </View>
      } else {
        let diffInWeeks = calculateWeeksBetween(today, babyBirthDate)

        if (isNaN(diffInWeeks) || diffInWeeks == undefined ||   diffInWeeks > 38) {
          return null
        }

        let timeSliceJson = this.BabySize.timeSlice[diffInWeeks]

        return <View style={styles.babyBottomView}>
          <View style={styles.birthView1}>
            {timeSliceJson.icon}
          </View>
          <View style={styles.birthView2}>
            <View style={{flexDirection: 'column'}}>
              <Text maxFontSizeMultiplier={1.1} style={[styles.rubberTextView,{color:Colors.rgb_000000}]}>{I18n.t('my_baby.actual_baby_size')}</Text>
              <Text maxFontSizeMultiplier={1.1} style={[styles.volumeTextView,{color:Colors.rgb_000000}]}>{timeSliceJson.good_ones}</Text>
            </View>
          </View>
        </View>
      }
    }
  }

  addNewBaby() {
    const {showAddBabyDialog} = this.state
    const {navigation} = this.props
    return (
      <Dialog
        visible={showAddBabyDialog}
        title={I18n.t('my_baby.no_child')}
        message={I18n.t('my_baby.no_child_message')}
        positive={I18n.t('my_baby.add_baby')}
        negative={I18n.t('my_baby.cancel')}
        isIcon={true}
        negativeOnPress={() => {
          this.setState({showAddBabyDialog: false})
        }}
        positiveOnPress={() => {
          this.setState({showAddBabyDialog: false})
          navigation.navigate('AddBabyScreen')
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  openScreen(item) {
    const {navigation} = this.props
    if (item.type === KeyUtils.SLEEP) {
      navigation.navigate('SleepScreen', {
        refresh: this.refreshView
      })
    }
    else if (item.type === KeyUtils.BFnP_LEFT) {
      navigation.navigate('BreastFeedingPumpingScreen', {
        refresh: this.refreshView,
        isLeftPress: true,
        isRightPress: false,
        isSiriNameReturned: true
      })
    }
    else if(item.type===KeyUtils.BFnP_RIGHT) {
      navigation.navigate('BreastFeedingPumpingScreen', {
        refresh: this.refreshView,
        isLeftPress: false,
        isRightPress: true,
        isSiriNameReturned: true
      })
    }
    else if(item.type===KeyUtils.CONTRACTIONS) {
      navigation.navigate('ContractionScreen', {
        refresh: this.refreshView
      })
    }
    else if(item.type===KeyUtils.BOTH) {
      navigation.navigate('ContractionScreen', {
        refresh: this.refreshView
      })
    }
    else if(item.type===KeyUtils.BOTH_TIMER_ACTIVE) {
      GetterSetter.setParentScreen('pumping')
      AsyncStorage.setItem(KeyUtils.BF_SESSION_TYPE, 'false')
      navigation.navigate('BreastFeedingPumpingScreen', {
        isFrom: 'bluetooth',
        isSiriNameReturned: true,
      })
    }

  }

  renderLastTracked(item) {
    const {
      trackingType,
      babyId,
      trackAt,
      batchType,
      amountTotal,
      durationTotal,
      session,
      weight,
      weightUnit,
      height,
      heightUnit,
      lastBreast,
      amountTotalUnit,
      right_timing,
      isMother
    } = item
    const { themeSelected, navigation } = this.props
    // let trackedText = Colors.rgb_898d8d
    let trackedText = Colors.rgb_000000
    if(themeSelected === 'dark'){
      trackedText = Colors.white
    }
    let icon;
    let text1, text2, text3, text4, text5 = ''
    let today = new Date()
    text2 = diffInDaysFromNow(trackAt)
    if (isMother){
      icon= <ContractionActiveIcon width={70} height={70} fill={Colors.rgb_e0e4e5}/>
      text3 = I18n.t('tracking.cont') + convertSecToHourMin(parseInt(durationTotal))
    } else if (trackingType === KeyUtils.TRACKING_TYPE_BREASTFEEDING) {
      icon = <ActiveBreastFeedingIcon width={70} height={70} style={{marginHorizontal: 5}}/>
      text3 = `${lastBreast===1?I18n.t('tracking.left') :I18n.t('tracking.right')}`+ convertSecToHourMin(parseInt(durationTotal))
    } else if (trackingType === KeyUtils.TRACKING_TYPE_PUMPING) {
      icon = <ActivePumpingIcon width={70} height={70} style={{marginHorizontal: 5}}/>
      const {convertedVolume , convertedVolumeUnit} = volumeConversionHandler(this.state.isImperial,amountTotalUnit,amountTotal);
      text3 = `${lastBreast===3?I18n.t('tracking.breast'):lastBreast===1?I18n.t('tracking.left'):I18n.t('tracking.right')}${convertedVolume} ${convertedVolumeUnit}`
    } else if (trackingType === KeyUtils.TRACKING_TYPE_DIAPER) {

      icon = <ActiveNappyIcon width={70} height={70} style={{marginHorizontal: 5}}/>

      if (batchType === 1) {
        text3 = I18n.t('nappy_tracking.pee')
      } else if (batchType === 2) {
        text3 = I18n.t('nappy_tracking.poo')
      } else {
        text3 = I18n.t('nappy_tracking.both')
      }
      //text3=batchType.toString().charAt(0).toUpperCase()+batchType.slice(1)

    } else if (trackingType === KeyUtils.TRACKING_TYPE_SLEEP) {
      icon = <ActiveSleepIcon width={70} height={70} style={{marginHorizontal: 5}} fill={Colors.rgb_daeffa}/>
      text3 = convertSecToHourMin(parseInt(durationTotal))
    } else if (trackingType === KeyUtils.TRACKING_TYPE_WEIGHT) {

      icon = <ActiveWeightIcon width={70} height={70} style={{marginHorizontal: 5}}/>
      // text3 = `${weight} ${weightUnit}`
      const{convertedWeight , convertedWeightUnit} = weightConversionHandler(this.state.isImperial,weightUnit,weight);
      text3 = `${convertedWeight} ${convertedWeightUnit}`;

    } else if (trackingType === KeyUtils.TRACKING_TYPE_GROWTH) {

      icon = <ActiveGrowthIcon width={70} height={70} style={{marginHorizontal: 5}}/>
      // text3 = `${height} ${heightUnit}`
      const {convertedHeight,convertedHeightUnit}=heightConversionHandler(this.state.isImperial,heightUnit,height)
      text3 = `${convertedHeight} ${convertedHeightUnit}`;

    } else if (trackingType === KeyUtils.TRACKING_TYPE_BOTTLE) {
      // text3 = `${amountTotal} ${amountTotalUnit}`
      const {convertedVolume , convertedVolumeUnit} = volumeConversionHandler(this.state.isImperial,amountTotalUnit,amountTotal);
      text3 = `${convertedVolume} ${convertedVolumeUnit}`;
      icon = <ActiveBottleIcon width={70} height={70} style={{marginHorizontal: 5}}/>
    } else {
      icon = <ActiveBottleIcon width={70} height={70} style={{marginHorizontal: 5}}/>
    }
    return <TouchableOpacity onPress={async () => {
      await analytics.logOnPress(Constants.LAST_TRACKED_PRESS);
      this.editScreenRedirection(item)
      } } style={styles.lastTrackedItemStyle}>
      {icon}
      <Text maxFontSizeMultiplier={1.5} style={[styles.lastTrackedItemDateTextStyle, { color:this.textColor }]}>{text2}</Text>
      <Text maxFontSizeMultiplier={1.5} style={[styles.lastTrackedItemTextStyle, { color:this.textColor }]}>{text3}</Text>
    </TouchableOpacity>

  }

  editScreenRedirection(item){
    const {trackingType,isMother} = item
    const {navigation}=this.props;
    if (isMother){
      navigation.navigate('EditContractionScreen',{
        item,
        _onSave:() => {}
      })
    }
    else if (trackingType === KeyUtils.TRACKING_TYPE_BREASTFEEDING) {
      navigation.navigate('EditBreastfeedingScreen',{
        item,
        _onSave:() => {}
      })
    } else if (trackingType === KeyUtils.TRACKING_TYPE_PUMPING) {
      navigation.navigate('EditPumpingScreen',{
        item,
        _onSave:()=> {}
      })
    } else if (trackingType === KeyUtils.TRACKING_TYPE_DIAPER) {

      navigation.navigate('EditNappyTrackingScreen',{
        item,
        _onSave:() => {}
      })

    } else if (trackingType === KeyUtils.TRACKING_TYPE_SLEEP) {
      navigation.navigate('EditSleepScreen',{
        item,
        _onSave:() => {}
      })
    } else if (trackingType === KeyUtils.TRACKING_TYPE_WEIGHT) {
      navigation.navigate('EditWeightScreen',{
        item,
        _onSave:() => {}
      })
    } else if (trackingType === KeyUtils.TRACKING_TYPE_GROWTH) {

      navigation.navigate('EditGrowthScreen',{
        item,
        _onSave:() => {}
      })

    } else if (trackingType === KeyUtils.TRACKING_TYPE_BOTTLE) {
      navigation.navigate('EditBottleTrackingScreen',{
        item,
        _onSave:() => {}
      })
    }
  }

  getSelectedBabyDetails(item) {
    this.setState({babyId: item.babyId})
  }

  async onArticleClick(id){
    const { isInternetAvailable } = this.props
    let param = {
      'article': 'opened'
    }
    await analytics.logEvent(Constants.CONTENT_INTERACTION, param);
    if(isInternetAvailable) {
      this.props.navigation.navigate("ArticleDetailsScreen", { articleId: id})
    } else {
      this.setState({ articleOfflinePopup: true })
    }
  }

  renderListItem = ({item}) => {
    return (
      <Fragment>
        <TouchableOpacity style={styles.articleView} onPress={() => this.onArticleClick(item.id)}>
          <ImageBackground
            source={{uri: item.cover}}
            style={styles.articleImageStyles}
            imageStyle={{borderRadius: 15}}
          >
            <View style={{flex: 1}}>
              <View style={{flex: 1}}/>
              <View style={styles.articleTitleViewStyles}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.articleTitleStyles,{color:Colors.white}]}>{item.title}</Text>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Fragment>
    )
  }

  renderFooter() {
    return (
      (this.state.isArticlesLoading ?
        <View style={styles.loadMoreStyles}>
          <LoadingSpinner />
        </View>
      :
        <View/>
      )
    )
  }

  onBottomReached() {
    const { articlePageDetails, timeSlices, perPage} = this.state;
    if (this.props.isInternetAvailable && articlePageDetails.currentPage < articlePageDetails.pageCount) {
      let index = timeSlices.findIndex((e) => {
        return moment(new Date()).isBetween(new Date(e.startDate), new Date(e.endDate))
      })
      if (index>-1){
        this.loadArticles(timeSlices[index].url, articlePageDetails.currentPage + 1, perPage)
      }
    }
  }

  promoBannerListItem(item, index){
    const {title,cover}=item
    return(
      <TouchableOpacity style={styles.promoBannerViewStyle} key={index.toString()} onPress={()=>{
        Linking.canOpenURL(item.videos[0].url).then(supported => {
          if (!supported) {
            console.log('Can\'t handle the url:', constants[0])
          } else {
            return Linking.openURL(item.videos[0].url)
              .catch(error => console.log('Error opening the url: ', error))
          }
        }).catch(err => console.log('An error occurred', err))
        //  open(item.videos[0].url, this.props.navigation)
      }}>
      {DeviceInfo.getFontScale()>1.3?
        <Text maxFontSizeMultiplier={1.7} numberOfLines={3} style={[styles.articleHeaderTextStyles,{flex:1, margin:10,alignSelf:'center',textAlign:'center',color: Colors.rgb_000000}]}>{title}</Text>
        :
        <Text maxFontSizeMultiplier={1.7} style={[styles.articleHeaderTextStyles,{flex:1, margin:10,alignSelf:'center',textAlign:'center',color: Colors.rgb_000000}]}>{title}</Text>}
        <View style={styles.imageContainer} >
          <View style={styles.imageBg} >
            <Image style={styles.imageRounded} source={{uri: cover}} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderListHeader(){
    const { themeSelected } = this.props
    let lastTrackedView = Colors.white
    if (themeSelected === 'dark') {
      lastTrackedView = Colors.rgb_000000
    }
    return <View style={{flex:1,backgroundColor:lastTrackedView}}>
       {this.renderListHeaderContent()}
    </View>
  }

  renderListHeaderScrollView(){
    const { themeSelected } = this.props
    let lastTrackedView = Colors.white
    if (themeSelected === 'dark') {
      lastTrackedView = Colors.rgb_000000
    }
     return <ScrollView style={{flex:1,backgroundColor:lastTrackedView}}>
    {this.renderListHeaderContent()}
    </ScrollView>
  }

  renderListHeaderContent() {
    const { trackingArr, showAddBabyDialog, articlesList, promoBanners, showPromoBanner } = this.state
    const { themeSelected } = this.props
    let articleBackgroundColor = Colors.rgb_e7e8e8
    let lastTrackedView = Colors.white
    // let articleHeaderText = Colors.rgb_898d8d
    let articleHeaderText = Colors.rgb_000000
    if (themeSelected === 'dark') {
      articleBackgroundColor = Colors.rgb_000000
      lastTrackedView = Colors.rgb_000000
      articleHeaderText = Colors.white
    }

    let lastTrackedArr = JSON.parse(JSON.stringify(trackingArr))
    const { selected_baby } = this.props
    if (selected_baby && selected_baby.babyId) {
      lastTrackedArr = lastTrackedArr.filter((e) => {
        return e.isMother || (e.babyId === selected_baby.babyId)
      })
    }
    if (lastTrackedArr && lastTrackedArr.length > 0) {
      lastTrackedArr.splice(3)
    }
    return <View>
      <View style={styles.relativeStyle}>
        {this.renderBabyView()}

        {showAddBabyDialog && this.addNewBaby()}

      </View>
      {lastTrackedArr.length > 0 &&
        <View style={styles.lastTrackedTextViewStyle}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.trackedBabyStyle, { color: this.textColor }]}>{I18n.t('my_baby.last_tracked')}</Text>
        </View>
      }

      {lastTrackedArr.length > 0 &&
        <View style={styles.lastTrackedViewStyle}>
          {lastTrackedArr.map((e, index) => {
            return <View key={index.toString()}>
              {this.renderLastTracked(e)}
            </View>
          })}
        </View>
      }

      {showPromoBanner && <View>

        <Swiper
          containerStyle={styles.promoBannerSliderStyle}
          showsPagination={false}
          dotColor={Colors.rgb_898d8d_6}
          activeDotColor={Colors.rgb_898d8d}
          horizontal={true}>
          {promoBanners.map((item, index) => {
            return this.promoBannerListItem(item, index)
          })}
        </Swiper>

      </View>}
      {articlesList.length > 0 &&

        <View style={[styles.articleHeaderStyles, { backgroundColor: articleBackgroundColor }]}>

          <Text maxFontSizeMultiplier={1.7} style={[styles.articleHeaderTextStyles, { color: this.textColor }]}>{I18n.t("articles.articles_header_text")}</Text>
          <View style={[styles.headerView, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
            <TouchableOpacity 
              accessibilityLabel={I18n.t("accessibility_labels.favorite_articles")} 
              accessible={true}
              activeOpacity={1} 
              onPress={() => {
              this.props.navigation.navigate('FavouriteArticles')
            }} style={styles.favViewStyle}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.favTextStyles, { color: this.textColor }]}>{I18n.t("articles.favourite_articles_header_text")}</Text>
              <FavoriteIcon fill={articleHeaderText} />
            </TouchableOpacity>
          </View>
        </View>

      }
    </View>
  }

  showFeedbackDialog=()=>{
    return (
      <FeedbackDialog
        feedbackTitle={I18n.t('feedback_popup.title')}
        positive={I18n.t('feedback_popup.yes')}
        negative={I18n.t('feedback_popup.no')}
        negativeOnPress={async () => {
          let today = moment().format('YYYY-MM-DD')
          this.setState({ showFeedbackAlert: false })
          this.onInAppFeedbackClick()
          negativeFeedbackCount++
          AsyncStorage.setItem('negativeFeedbackCount', negativeFeedbackCount.toString())
          AsyncStorage.setItem('FeedbackDate', today.toString())
          AsyncStorage.setItem('ShowFeedback', 'false')
          let param = {
            'button': 'do_you_love_our_app_no'
          }
          await analytics.logEvent(Constants.FEEDBACK, param);
        }}
        positiveOnPress={async () => {
          let today = moment().format('YYYY-MM-DD')
          this.setState({ showFeedbackAlert: false })
          storeReviewDialog()
          AsyncStorage.setItem('ShowFeedback', 'false')
          AsyncStorage.setItem('FeedbackDate', today.toString())
          let param = {
            'button': 'do_you_love_our_app_yes'
          }
          await analytics.logEvent(Constants.FEEDBACK, param);
        }}
        onDismiss={() => {
        }}
      />
    )
  }

  onInAppFeedbackClick = () => {
    this.setState({showInAppViewAlert:true})
  }

  showInAppFeedbackDialog=()=>{
    return (
      <FeedbackDialog
        feedbackTitle={I18n.t('feedback_popup.title1')}
        positive={I18n.t('feedback_popup.yes')}
        negative={I18n.t('feedback_popup.no')}
        negativeOnPress={() => {
          this.setState({ showInAppViewAlert: false })
        }}
        positiveOnPress={() => {
          this.setState({ showInAppViewAlert: false })
          NavigationService.navigate('Feedback',{isFrom:'MyBabyScreen'})
        }}
        onDismiss={() => {
        }}
      />
    )
  }

  render() {
    const {isUiLoading, isLoading, showSwitchBabyModal, articlesList, showFeedbackAlert, showInAppViewAlert} = this.state
    const{themeSelected, isInternetAvailable, navigation}=this.props
    let articleBackgroundColor = Colors.rgb_e7e8e8
    themeSelected === 'dark' && (articleBackgroundColor="black")

    if (isUiLoading) {
      return <LoadingSpinner/>
    } else {
      return (<View style={styles.container}>
          {this.renderHeader()}
          {showSwitchBabyModal && <BabySelectionModal
            showBabySelectionModal={showSwitchBabyModal}
            cancelBabyPress={(visible) => {
              this.setState({showSwitchBabyModal: false,})
            }}
            onBabyListPress={(item) => {
              this.setState({showSwitchBabyModal: false, isImageError: false,isBabySwitch:true})
              //this.getSelectedBabyDetails(item)
            }}
            navigation={this.props.navigation}
          />}
            <View style={styles.container}>
              {articlesList.length===0?this.renderListHeaderScrollView():<View style={[styles.articleViewStyles, {backgroundColor: articleBackgroundColor}]}>
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={this.state.articlesList}
                  renderItem={this.renderListItem}
                  onEndReachedThreshold={0.1}
                  ListHeaderComponent={()=>this.renderListHeader()}
                  ListFooterComponent={() => this.renderFooter()}
                  onEndReached={() => this.onBottomReached()}
                />

              </View>
              }
              {!isInternetAvailable &&  <View style={styles.offlineView}>
                <OfflineIcon width={32} height={32} style={styles.offlineIconStyles}/>
                <Text maxFontSizeMultiplier={1.7} style={[styles.articleOfflineTextStyles,{color:this.textColor}]}>{I18n.t("my_baby.articles_offline_text")}</Text>
              </View> }
            </View>
          {/* {!isLoading && <BottomBanner
            screen={'MyBabyScreen'}
               {...this.props}
            showBanner={this.state.showBanner}
            // onClosePress={(item) => this.onCloseBanner(item)}
            onSelected={(item) => this.openScreen(item)}/>} */}
          <View>
          </View>
          <Dialog
            visible={this.state.showVipPopup}
            title={I18n.t('vip_pack.congrats_title')}
            message={I18n.t('vip_pack.congrats_message')}
            positive={I18n.t('login.ok')}
            negative={I18n.t('vip_pack.findout_more')}
            isIcon={false}
            positiveOnPress={() => {
              this.setState({ showVipPopup: false})
            }}
            onDismiss={() => {
            }}
            negativeOnPress={() => {
              this.setState({ showVipPopup: false})
              navigation.navigate("VipPackScreen")
            }}
          />
           <Dialog
            visible={this.state.articleOfflinePopup}
            title={I18n.t('my_baby.article_details_offline_text')}
            positive={I18n.t('login.ok')}
            isIcon={false}
            positiveOnPress={() => {
              this.setState({ articleOfflinePopup: false})
            }}
            onDismiss={() => {
            }}
          />
          {(Platform.OS === 'android' || this.state.notifPermissions) &&
            <PushController navigation={this.props.navigation} />
          }
          {showFeedbackAlert && this.showFeedbackDialog()}
          {showInAppViewAlert && this.showInAppFeedbackDialog()}
        </View>
      )
    }

  }

}

const mapStateToProps = (state) => ({
  isPicUploaded: state.user.isPicUploaded,
  timeSlicesSuccess: state.home.timeSlicesSuccess,
  timeSlicesFailure: state.home.timeSlicesFailure,
  timeSlices: state.home.timeSlices,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  babyImage: state.home.babyImage,
  babiesSuccess: state.home.babiesSuccess,
  babiesFailure: state.home.babiesFailure,
  getTrackingResponse: state.home.getTrackingResponse,
  getTrackingApiSuccess: state.home.getTrackingApiSuccess,
  selected_baby: state.home.selected_baby,
  getTrackingApiFailure: state.home.getTrackingApiFailure,
  getArticles: state.home.getArticles,
  getArticlesSuccess: state.home.getArticlesSuccess,
  getArticlesFailure: state.home.getArticlesFailure,
  isInternetAvailable: state.app.isInternetAvailable,
  themeSelected: state.app.themeSelected,
  syncBabySuccess: state.user.syncBabySuccess,
  remoteConfig:state.remoteConfig,
  switchBabySuccess:state.user.switchBabySuccess,
  selectedBabyClientId:state.user.selectedBabyClientId,
  response:state.home.response,
  bannerApiSuccess: state.home.bannerApiSuccess,
  bannerApiFailure: state.home.getPromoBannerApiFailure,
  getMotherTrackingResponse: state.home.getMotherTrackingResponse,
  getMotherTrackingApiSuccess: state.home.getMotherTrackingApiSuccess,
  getMotherTrackingApiFailure: state.home.getMotherTrackingApiFailure,
  switchBabyFailure:state.user.switchBabyFailure,
  isConnected: state.home.isConnected,
  trackingId:state.nav.trackingId,
  pumps: state.home.pumps,
  vipPackSuccess: state.home.vipPackSuccess,
  vipPackFailure: state.home.vipPackFailure,
})

const mapDispatchToProps = (dispatch) => ({
  getTimeSlices: () => dispatch(HomeActions.getTimeSlices()),
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  getBabyImage: (babyId) => dispatch(HomeActions.getBabyImage(babyId)),
  getMyBabies: () => dispatch(HomeActions.getMyBabies()),
  getTrackingApi: (startDate, endDate, babyId, page, perPage) => dispatch(HomeActions.getTrackingApi(startDate, endDate, babyId, page, perPage)),
  switchBaby: (babyId) => dispatch(UserActions.switchBaby(babyId)),
  setSelectedBaby: (selectedBaby) => dispatch(HomeActions.setSelectedBaby(selectedBaby)),
  getArticles: (locale, articleId, page, perPage) => dispatch(HomeActions.getArticles(locale, articleId, page, perPage)),
  getPromoBannerApi: (locale) => dispatch(HomeActions.getPromoBannerApi(locale)),
  getMotherTrackingApi: (startDate, endDate, page, perPage) => dispatch(HomeActions.getMotherTrackingApi(startDate, endDate, page, perPage)),
  vipPackApi:(value)=>dispatch(HomeActions.vipPackApi(value)),
 });

export default connect(mapStateToProps, mapDispatchToProps)(MyBabyScreen);