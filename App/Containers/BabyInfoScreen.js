import React from 'react'
import {Alert, ImageBackground,PermissionsAndroid, SafeAreaView, Text, TouchableOpacity, View, Keyboard, Platform} from 'react-native';
import I18n from '@i18n';
import Colors from '@resources/Colors';
import styles from './Styles/BabyInfoScreenStyles';
import {connect} from 'react-redux';
import {Constants} from "@resources";
import CustomTextInput from '@components/CustomTextInput';
import Button from '@components/Button';
import moment from 'moment';
import CustomCalendar from '@components/CustomCalendar'
import ImagePicker from 'react-native-image-picker';
import EditPhotoIcon from '@svg/ic_edit_photo';
import UserActions from '@redux/UserRedux';
import LoadingSpinner from '@components/LoadingSpinner';
import HomeActions from '@redux/HomeRedux';
import Dialog from '@components/Dialog';
import {getHeightUnits, getWeightUnits,weightConversionHandler,heightConversionHandler,kgToGram,cmToMm} from '@utils/locale';
import CustomMeasurementsView from '@components/CustomMeasurementsView';
import BackIcon from '@svg/arrow_back';
import AsyncStorage from "@react-native-community/async-storage";
import { scheduleBdayNotification, cancelBCANotifications, checkDaysDiff, checkDays, cancelBdayNotifications, cancelNotifications } from '@components/Notifications';
import KeyUtils from "@utils/KeyUtils";
import {deleteBabyFromDb, saveAllBabies, updateBaby,saveMotherProfile, getRealmDb} from "../Database/AddBabyDatabase";
import RNFetchBlob from "rn-fetch-blob";
import HeaderTitle from '@components/HeaderTitle';
import { getDateFormat } from "@utils/TextUtils";
import { verticalScale, moderateScale } from "@resources/Metrics";
// import PushNotification from "react-native-push-notification";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BabyInfoScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      babiesData: [],
      babyId: '',
      babyName: '',
      genderSelected: 0,
      babyWeight: {},
      babyHeight: {},
      baby_name_error: false,
      showCalendar: false,
      babyPicture: '',
      isLoading: false,
      imageRes: {},
      updateData: false,
      showDelBabySuccessPopUp: false,
      weightArray: [],
      heightArray: [],
      showWeightListView: false,
      showHeightListView: false,
      birthday: '',
      selectedBabyData: {},
      avatarUrl: '',
      isDeleted: false,
      changeImagePopup: false,
      isImageLoadingError: false,
      realmDb:null,
      username:null,
      imagePath:'',
      showNoInternetPopup:false,
      weightUnits:'',
      heightUnits:'',
      isImperial:'',
      showDeletePopup: false,
      formattedDate: '',
      selectedDate: moment().format()
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    let minDate = moment();
    this.minDate = minDate.subtract(3, "years");
    this.minDate = this.minDate.format("YYYY/MM/DD");

    let maxDate = moment()
    this.maxDate = maxDate.add('38', 'weeks')
    this.maxDate = this.maxDate.format("YYYY/MM/DD");
  }

  getWeight(weightUnits) {

    let arr = []
    let x = 0.25
    for (let i = 1; weightUnits == KeyUtils.UNIT_LB ? i <= 180 : i <= 82; i++) {
      let vv = (0.25 * i)
      let obj = {
        id: i,
        label: (vv) + ' ' + weightUnits,
        value: (vv).toString(),
        color: Colors.rgb_898d8d
      }
      arr.push(obj)
    }
    this.setState({weightArray: arr})

  }

  getHeight(heightUnits) {

    let arr = []
    let heightStart = 21
    if(heightUnits == KeyUtils.UNIT_INCH){
      heightStart = 1
    }
    for (let i = heightStart; heightUnits == KeyUtils.UNIT_INCH ? i <= 35 : i <= 90; i++) {
      let obj = {
        id: i,
        label: (i) + ' ' + heightUnits,
        value: (i).toString(),
        color: Colors.rgb_898d8d,
      }
      arr.push(obj)
    }
    this.setState({heightArray: arr})
  }

  async componentDidMount() {
    const {navigation} = this.props;
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    let realmDb=await getRealmDb()
    this.setState({realmDb})
    let babyArr = realmDb.objects('AddBaby');
    let babiesList = JSON.parse(JSON.stringify(babyArr))
    let userMotherProfile = realmDb.objects('UserMotherProfile')
    babiesList=babiesList.filter((e)=>{
      return  !e.isDeleted && e.username===userMotherProfile[0].username
    })
    console.log('babies--*************',babiesList.length)

    this.setState({babiesList:babiesList})

    let babyData = navigation.getParam('selectedBabyData')
    const {babyId}=babyData
    let obj=babiesList.find((e)=>{
      return e.babyId===babyId
    })
    console.log('obj--',obj)
    if (obj!==undefined){
      this.setState({username:obj.username})
    }
    Promise.all([getWeightUnits(),getHeightUnits()]).then((values)=>{
      this.setState({weightUnits:values[0]===KeyUtils.UNIT_KG?KeyUtils.UNIT_GRAM:values[0],heightUnits:values[1]===KeyUtils.UNIT_CM?KeyUtils.UNIT_MM:values[1]})
      this.getWeight(values[0])
      this.getHeight(values[1])
    })

    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        const {convertedWeight , convertedWeightUnit} = weightConversionHandler(_units=== KeyUtils.UNIT_IMPERIAL,babyData.birthWeight.unit,babyData.birthWeight.quantity)
        const {convertedHeight , convertedHeightUnit} = heightConversionHandler(_units=== KeyUtils.UNIT_IMPERIAL,babyData.birthHeight.unit,babyData.birthHeight.quantity)
        this.setState({babyWeight:{quantity:convertedWeight , unit:convertedWeightUnit} ,
          babyHeight: {quantity:convertedHeight , unit:convertedHeightUnit}});
      }
    });

    let newDate = await getDateFormat(babyData.birthday)
    this.setState({
      babiesData: babiesList,
      selectedBabyData: babyData,
      imagePath:obj.imagePath,
      babyName: babyData.name,
      babyId: babyData.babyId,
      genderSelected: babyData.gender,
      // babyWeight: babyData.birthWeight,
      // babyHeight: babyData.birthHeight,
      birthday: babyData.birthday,
      selectedDate: babyData.birthday,
      formattedDate: newDate
    })
    await analytics.logScreenView('baby_info_screen')
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
    return RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
    })
      .fetch('GET', `${Constants.BASE_URL}rest/baby/picture/${babyId}`)
      .then(res => {
        return Platform.OS=='android'?`file://${res.data}`:res.data
      })
      .catch(error => {
        console.log(error)
      })
  };
  saveBabyImageOffline(){
    const {realmDb}=this.state;
    const {babyId,babiesData}=this.state
    this.setState({isLoading: false});
    this.handleDownload(babyId).then((response)=>{
      let item=babiesData.find((e)=>{
        return e.babyId===babyId
      })
      if (item!=undefined){
        item.imagePath=response
        updateBaby(realmDb,item).then((e)=>{
          this.setState({isLoading: false});
        })
      }else{
        this.setState({isLoading: false});
      }
    }).catch((E)=>{
      this.setState({isLoading: false});
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    const {
      isBabyNameAddError, isPicUploaded, isPicUploadedError, babiesSuccess, deleteBabySuccess, deleteBabyFailure,deleteBabyImageSuccess, deleteBabyImageFailure,
      getBabyImageSuccess, imageResponse, getMyBabies, navigation, isBabyNameAdd,babies,getUserProfile,userProfileSuccess,userProfile,setSelectedBaby
    } = this.props;
    const {babyId, isDeleted,realmDb,username,babiesData} = this.state
    if ((prevProps.deleteBabyImageSuccess != deleteBabyImageSuccess) && deleteBabyImageSuccess && prevState.isLoading) {
      let item=babiesData.find((e)=>{
        return e.babyId===babyId
      })
      this.setState({babyPicture:'',isImageLoadingError:true})
      if (item!=undefined){
        item.imagePath=''
        updateBaby(realmDb,item).then((e)=>{

        })
      }
      this.setState({isLoading:false})

    }

    if ((prevProps.deleteBabyImageFailure != deleteBabyImageFailure) && deleteBabyImageFailure && prevState.isLoading) {
      this.setState({isLoading: false})

    }
    if ((prevProps.deleteBabySuccess != deleteBabySuccess) && deleteBabySuccess && prevState.isLoading) {
      this.setState({isDeleted: true})
      cancelBdayNotifications(babyId);
      getUserProfile()
      //AsyncStorage.getItem(KeyUtils.FIRSTDAY_NAPPY_NOTIFICATION, (err, result) => {
      // let result1 = JSON.parse(result) || []
      // let ids = result1.filter((e) => {
      //  return e === babyId
      // })
      // AsyncStorage.setItem(KeyUtils.FIRSTDAY_NAPPY_NOTIFICATION, JSON.stringify(ids))
      //})
      //PushNotification.cancelLocalNotifications({ id: babyId+1 });
      //PushNotification.cancelLocalNotifications({ id: babyId+3 });
      //PushNotification.cancelLocalNotifications({ id: babyId+4 });
      AsyncStorage.removeItem(KeyUtils.NEVER_SHOW_BABY_BIRTHDAY_NOTIFICATION)
      // cancelNotifications([this.state.selectedBabyData], true)
      deleteBabyFromDb(babyId).then((r) => {
        getMyBabies()
      })

    }
    if(userProfileSuccess!=prevProps.userProfileSuccess&&userProfileSuccess&& prevState.isLoading){
      if(babies.length>0){
        this.setState({isLoading:false},()=>{
          let currentSelectedBaby=babies.find((e)=>{
            return e.babyId==userProfile.mother.currentBabyClientId
          });
          if(currentSelectedBaby!=undefined){
            setSelectedBaby(currentSelectedBaby);
            navigation.goBack()
          }
        });
      }
    }
    if ((prevProps.deleteBabyFailure != deleteBabyFailure) && deleteBabyFailure && prevState.isLoading) {
      this.setState({isLoading: false});
      this.callBack1()
    }

    if (babiesSuccess != prevProps.babiesSuccess && babiesSuccess && prevState.isLoading && !isDeleted) {
      this.setState({isLoading:false});
      let updatedBabies=JSON.parse(JSON.stringify(babies))
      navigation.goBack()
      let modifiedBabies = updatedBabies.map(baby => ({...baby, isSync: true,username}));
      saveAllBabies(realmDb,modifiedBabies).then((r)=>{
        navigation.goBack()
        //getUserProfile()
      })

    }

    if (babiesSuccess != prevProps.babiesSuccess && babiesSuccess && prevState.isLoading && isDeleted) {
      this.setState({isLoading: false, showDelBabySuccessPopUp: true})
    }

    if ((prevProps.isBabyNameAdd != isBabyNameAdd) && isBabyNameAdd && prevState.isLoading) {
      getMyBabies()
    }

    if ((prevProps.isBabyNameAddError != isBabyNameAddError) && isBabyNameAddError && prevState.isLoading) {
      this.setState({isLoading: false, showErrorMessage: true, alert_message: I18n.t('generic.error_message')});
      this.callBack1()
    }
    if (prevProps.isPicUploaded != isPicUploaded && isPicUploaded && prevState.isLoading) {
      this.saveBabyImageOffline()
    }
    if ((prevProps.isPicUploadedError != isPicUploadedError) && isPicUploadedError && prevState.isLoading) {
      this.setState({isLoading: false, showErrorMessage: true, alert_message: I18n.t('generic.error_message')});
      this.callBack1()
    }
    if ((prevProps.getBabyImageSuccess != getBabyImageSuccess) && getBabyImageSuccess) {
      this.setState({imageRes: imageResponse, isLoading: false})
    }
  }

   callBack1=()=>{
     Alert.alert(
       I18n.t('generic.alert_title'),
       I18n.t('generic.error_message'),
       [
         { text:  I18n.t('freezer_popup.ok'), onPress: () => this.props.navigation.goBack() }
       ]
     );
   }

  updateBabyName = (value) => {
    this.setState({babyName: value})
  }

  updateWeight = (item) => {
    this.setState(prevState => ({
      showWeightListView: false,
      babyWeight: {
        ...prevState.babyWeight,
        quantity: parseFloat(item)
      }
    }))
  }

  updateHeight = (value) => {
    this.setState(prevState => ({
      showHeightListView: false,
      babyHeight: {
        ...prevState.babyHeight,
        quantity: parseFloat(value)
      }
    }))
  }

  positiveOnPress = async(updatedDate) => {
    let newDate = await getDateFormat(this.state.selectedDate)
    this.setState({
      showCalendar: false,
      birthday: this.state.selectedDate,
      formattedDate: newDate
    })

  }

  _onDateChange = (date) => {
    this.setState({
      selectedDate: date
    })
  }

  negativeOnPress = () => {
    this.setState({
      showCalendar: false,
    })
  }

  showCustomCalendar = () => {
    const {showCalendar, selectedDate} = this.state;
    return (
      <CustomCalendar
        visible={showCalendar}
        title={I18n.t('login.forgot_password_title')}
        message={I18n.t('login.forgot_password_message')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        selectedDate={selectedDate}
        minDate={this.minDate}
        maxDate={this.maxDate}
        negativeOnPress={() => this.negativeOnPress()}
        positiveOnPress={(updatedDate) => this.positiveOnPress(updatedDate)}
        onDismiss={() => {
        }}
        onDateChange={(date) => this._onDateChange(date)}
        showHeader={true}
        notShowTime={true}
      />
    )
  }

  showImageUploadPopup() {
    const {changeImagePopup, isImageLoadingError,selectedBabyData} = this.state
    console.log(selectedBabyData)
    return (
      <Dialog
        visible={changeImagePopup}
        title={I18n.t('baby_information.edit_image')}
        positive={isImageLoadingError ? I18n.t('baby_information.add_image') : I18n.t('baby_information.change_image')}
        negative={I18n.t('baby_information.delete_image')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({changeImagePopup: false})
          const {babyId}=this.state
          const {deleteBabyImage}=this.props
          this.setState({isLoading:true})
          deleteBabyImage(babyId)
        }}
        positiveOnPress={() => {
          this.setState({changeImagePopup: false})
          setTimeout(()=>{
            this.selectBabyPicture()
          },200)

        }}
        neutral={I18n.t('login.cancel')}
        neutralPress={() => {
          this.setState({changeImagePopup: false})

        }}
        onDismiss={() => {
        }}
      />
    )
  };

  showNoInternetPopup() {
    const {showNoInternetPopup,} = this.state
    return (
      <Dialog
        visible={showNoInternetPopup}
        title={I18n.t('baby_information.image_edit_offline_button')}
        isIcon={false}
        positive={ I18n.t('login.cancel') }
        negativeOnPress={() => {
          this.setState({showNoInternetPopup: false})

        }}
        positiveOnPress={() => {
          this.setState({showNoInternetPopup: false})
        }}

      />
    )
  };

  selectBabyPicture() {
    const {babyId} = this.state
    const options = {
      title: I18n.t("baby_information.select_photo"),
      cancelButtonTitle: I18n.t("baby_information.cancel"),
      takePhotoButtonTitle: I18n.t("baby_information.take_photo"),
      chooseFromLibraryButtonTitle: I18n.t("baby_information.choose_from_library"),
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        // Toast(I18n.t('generic.cancelled_picker'));
      } else if (response.error) {
        // Toast(I18n.t('generic.image_error'), response.error);
      } else if (response.customButton) {
        // Toast(I18n.t('generic.tap_custom_btn'), response.customButton);
      } else {
        let source = {uri: response.uri};
        let arr = null
        let fileName = null
        if (response.uri.includes('/')) {
          arr = response.uri.split('/')
          fileName = arr[arr.length - 1]
        }

        let photo = {
          uri: response.uri,
          type: 'image/jpeg',
          name: fileName,
        };

        let imgFile = photo

        this.setState({
          babyPicture: source,
          isLoading: true,
          isImageLoadingError:false,
          isImageLoading:false,
          imagePath:''
        });
        if (Object.keys(imgFile).length > 0) {
          this.props.uploadBabyPic(babyId, imgFile);
        }
      }
    });
  }
  getBabyImageUrl = () => {
    const {babyId, babyPicture, selectedBabyData,imagePath} = this.state;
    if(imagePath!=null&&imagePath!=''&& imagePath.length>0){
      return {uri:imagePath}
    }
    else if(typeof babyPicture ==='object' && babyPicture.hasOwnProperty('uri')){
      return babyPicture;
    }else if(babyId){
      return  {uri:`${Constants.BASE_URL}rest/baby/picture/${babyId}`}
    }else return require('../Images/png/my_baby.png')
    // const {babyId, babyPicture, selectedBabyData,imagePath} = this.state
    // if (babyId && Object.keys(babyPicture).length) {
    //   return babyPicture
    // }
    // if (babyId && !Object.keys(babyPicture).length) {
    //   return  {uri:`${Constants.BASE_URL}rest/baby/picture/${babyId}`}

    // }
    // if (!selectedBabyData.hasOwnProperty('avatar')) {
    //   return require('../Images/png/my_baby.png')
    // }
  }

  getGender = (val) => {
    this.setState({genderSelected: val})
  }

  saveBabyData = () => {
    const {babyId, babyName, realmDb,username,babyWeight, babyHeight, genderSelected, birthday, avatarUrl, selectedBabyData} = this.state
    const {addBabyName, navigation,isInternetAvailable} = this.props

    if(isInternetAvailable){
      if (selectedBabyData.name !== babyName ||
        selectedBabyData.gender !== genderSelected ||
        selectedBabyData.birthday !== birthday ||
        selectedBabyData.birthWeight !== babyWeight ||
        selectedBabyData.birthHeight !== babyHeight
      ) {
        let convertedBabyWeight ={quantity: babyWeight.unit === KeyUtils.UNIT_KG ? kgToGram(babyWeight.quantity) : babyWeight.quantity,
          unit:babyWeight.unit === KeyUtils.UNIT_KG ? KeyUtils.UNIT_GRAM : babyWeight.unit}
        let convertedBabyHeight ={quantity: babyHeight.unit === KeyUtils.UNIT_CM ? cmToMm(babyHeight.quantity) : babyHeight.quantity,
          unit:babyHeight.unit === KeyUtils.UNIT_CM ? KeyUtils.UNIT_MM : babyHeight.unit}
        let updatedBabyWeight = babyWeight.quantity === '' ? {...babyWeight, quantity: 0} : convertedBabyWeight
        let updatedBabyHeight = babyHeight.quantity === '' ? {...babyHeight, quantity: 0} : convertedBabyHeight

        // let updatedBabyWeight = babyWeight.quantity === '' ? {...babyWeight, quantity: 0} : babyWeight
        // let updatedBabyHeight = babyHeight.quantity === '' ? {...babyHeight, quantity: 0} : babyHeight


        let babies = {
          "babies": [{
            "babyId": babyId,
            "birthWeight": updatedBabyWeight,
            "birthHeight": updatedBabyHeight,
            "gender": genderSelected,
            "name": babyName,
            "birthday": moment(birthday).format('YYYY-MM-DD'),
          }]
        }
        if (babyName===''){
          alert(I18n.t('my_baby.baby_name_error'))
          return
        }

        this.setState({updateData: true, isLoading: true})
        if(selectedBabyData.birthday !== birthday) {
          cancelBCANotifications(selectedBabyData.babyId, 'preBca')
          cancelBCANotifications(selectedBabyData.babyId, 'postBca')
          cancelBCANotifications([selectedBabyData.babyId])
          if(checkDays(birthday) <= 0) {
            cancelBdayNotifications(selectedBabyData.babyId);
          } else {
            if(checkDaysDiff(birthday)) {
              AsyncStorage.getItem(KeyUtils.SCHEDULED_NOTIFICATIONS, (err, result) => {
                const id = [selectedBabyData.babyId];
                let scheduleId = ''
                if (result !== null) {
                  if(!JSON.parse(result).includes(id)) {
                    scheduleId = JSON.parse(result).concat(id);
                  }
                } else {
                  scheduleId = id
                }
                scheduleBdayNotification(scheduleId)
              });
            } else {
              AsyncStorage.getItem(KeyUtils.SCHEDULED_NOTIFICATIONS, (err, result) => {
                if (result !== null && JSON.parse(result).includes(selectedBabyData.babyId)) {
                  cancelBdayNotifications(selectedBabyData.babyId);
                }
              });
            }
            // if(checkDays(birthday) >= -3) {
            //   AsyncStorage.getItem(KeyUtils.FIRSTDAY_NAPPY_NOTIFICATION, (err, result) => {
            //     let result1 = JSON.parse(result) || []
            //     if(result1.includes(selectedBabyData.babyId)) {
            //       let nappyResult = result1.filter((e)=>{
            //         return e !== selectedBabyData.babyId
            //       })
            //       AsyncStorage.setItem(KeyUtils.NAPPY_NOTIFICATIONS, JSON.stringify(nappyResult))
            //       PushNotification.cancelLocalNotifications({ id: String(selectedBabyData.babyId+1) });
            //       PushNotification.cancelLocalNotifications({ id: String(selectedBabyData.babyId+3) });
            //       PushNotification.cancelLocalNotifications({ id: String(selectedBabyData.babyId+4) });
            //     }
            //   })
            // }
          }
        }
        addBabyName({babies});
      } else {
        selectedBabyData.birthday === moment().format('YYYY-MM-DD') ? cancelBdayNotifications(selectedBabyData.babyId) : ''
        navigation.goBack()
      }
    } else {
      if (selectedBabyData.name !== babyName ||
        selectedBabyData.gender !== genderSelected ||
        selectedBabyData.birthday !== birthday ||
        selectedBabyData.birthWeight !== babyWeight ||
        selectedBabyData.birthHeight !== babyHeight
      ) {
        // let updatedBabyWeight = babyWeight.quantity === '' ? {...babyWeight, quantity: 0} : babyWeight
        // let updatedBabyHeight = babyHeight.quantity === '' ? {...babyHeight, quantity: 0} : babyHeight
        let convertedBabyWeight ={quantity: babyWeight.unit === KeyUtils.UNIT_KG ? kgToGram(babyWeight.quantity) : babyWeight.quantity,
          unit:babyWeight.unit === KeyUtils.UNIT_KG ? KeyUtils.UNIT_GRAM : babyWeight.unit}
        let convertedBabyHeight ={quantity: babyHeight.unit === KeyUtils.UNIT_CM ? cmToMm(babyHeight.quantity) : babyHeight.quantity,
          unit:babyHeight.unit === KeyUtils.UNIT_CM ? KeyUtils.UNIT_MM : babyHeight.unit}
        let updatedBabyWeight = babyWeight.quantity === '' ? {...babyWeight, quantity: 0} : convertedBabyWeight
        let updatedBabyHeight = babyHeight.quantity === '' ? {...babyHeight, quantity: 0} : convertedBabyHeight
        let item={
          "babyId": babyId,
          "birthWeight": updatedBabyWeight,
          "birthHeight": updatedBabyHeight,
          "gender": genderSelected,
          "name": babyName,
          "birthday": moment(birthday).format('YYYY-MM-DD'),
        }
        if (babyName===''){
          alert(I18n.t('my_baby.baby_name_error'))
          return
        }
        navigation.goBack()
        item.isSync=false
        item.username=username
        updateBaby(realmDb,item).then((r)=>{
          navigation.goBack()
        })
      } else {
        selectedBabyData.birthday === moment().format('YYYY-MM-DD') ? cancelBdayNotifications(selectedBabyData.babyId) : ''
        navigation.goBack()
      }
    }

  }

  isBabyInformationUpdated(){
    const {babyId, babyName, babyWeight, babyHeight, genderSelected, birthday, avatarUrl, selectedBabyData} = this.state
    const {addBabyName, navigation,isInternetAvailable} = this.props
    let isUpdated
    let babyObj={}
    if (selectedBabyData.name !== babyName ||
      selectedBabyData.gender !== genderSelected ||
      selectedBabyData.birthday !== birthday ||
      selectedBabyData.birthWeight !== babyWeight ||
      selectedBabyData.birthHeight !== babyHeight
    ) {

      // let updatedBabyWeight = babyWeight.quantity === '' ? {...babyWeight, quantity: "0"} : babyWeight
      // let updatedBabyHeight = babyHeight.quantity === '' ? {...babyHeight, quantity: "0"} : babyHeight
      let convertedBabyWeight ={quantity: babyWeight.unit === KeyUtils.UNIT_KG ? kgToGram(babyWeight.quantity) : babyWeight.quantity,
        unit:babyWeight.unit === KeyUtils.UNIT_KG ? KeyUtils.UNIT_GRAM : babyWeight.unit}
      let convertedBabyHeight ={quantity: babyHeight.unit === KeyUtils.UNIT_CM ? cmToMm(babyHeight.quantity) : babyHeight.quantity,
        unit:babyHeight.unit === KeyUtils.UNIT_CM ? KeyUtils.UNIT_MM : babyHeight.unit}
      let updatedBabyWeight = babyWeight.quantity === '' ? {...babyWeight, quantity: 0} : convertedBabyWeight
      let updatedBabyHeight = babyHeight.quantity === '' ? {...babyHeight, quantity: 0} : convertedBabyHeight
      babyObj={
        "babyId": babyId,
        "birthWeight": updatedBabyWeight,
        "birthHeight": updatedBabyHeight,
        "gender": genderSelected,
        "name": babyName,
        "birthday": moment(birthday).format('YYYY-MM-DD'),
      }
      /*let babies = {
        "babies": [babyObj]
      }*/

      isUpdated=true
      return {isUpdated,babyObj }
      /*this.setState({updateData: true, isLoading: true})
      addBabyName({babies});*/
    }else {
      isUpdated=false
      return {isUpdated,babyObj}
    }
  }

  onClickBirthDate = () => {
    this.setState({showCalendar: true})
  }

  deleteOnClick = async () => {
    const {isInternetAvailable, deleteBaby, navigation,setSelectedBaby} = this.props
    const {babyId} = this.state
    if (isInternetAvailable) {
      this.setState({isLoading: true})
      deleteBaby(babyId)
    } else {
      let realmDb=await getRealmDb()
      let babyArr = realmDb.objects('AddBaby');
      let babies = JSON.parse(JSON.stringify(babyArr))
      let item = babies.find((E) => {
        return E.babyId === babyId
      })
      if (item != undefined) {
        item.isDeleted = true
        updateBaby(realmDb, item).then(() => {
          console.log('updateBaby--')
          let profile = realmDb.objects('UserMotherProfile');
          let modified=JSON.parse(JSON.stringify(profile))
          if (modified.length>0){
            let babiesAfterDeletingFromLocal=babies.filter((v)=>{
              return v.babyId!=babyId
            });
            if(babiesAfterDeletingFromLocal.length>0){
              babiesAfterDeletingFromLocal=babiesAfterDeletingFromLocal.sort(function(a,b){
                return new Date(b.birthday) - new Date(a.birthday);
              });
              modified[0].mother.currentBabyClientId=babiesAfterDeletingFromLocal[babiesAfterDeletingFromLocal.length-1].babyId;
              saveMotherProfile(realmDb,modified[0]).then((e)=>{
                setSelectedBaby(babiesAfterDeletingFromLocal[babiesAfterDeletingFromLocal.length-1]);
                navigation.goBack();
              })
            }else{
              navigation.goBack();
            }
          }else{
            setTimeout(()=>{
              navigation.goBack()
            },200)
          }
        })
      }

    }

  }

  getSelectedBabyDetails(item) {
    this.setState({
      babyId: item.babyId,
      babyName: item.name,
      genderSelected: item.gender,
      babyWeight: item.birthWeight,
      babyHeight: item.birthHeight,
    })
  }

  delBabySuccessPopUp() {
    const {showDelBabySuccessPopUp} = this.state
    const {navigation,getUserProfile} = this.props
    return (
      <Dialog
        visible={showDelBabySuccessPopUp}
        title={I18n.t('baby_information.delete_baby_success_title')}
        positive={I18n.t('baby_information.ok_btn')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({showDelBabySuccessPopUp: false,isLoading:true},()=>{
            getUserProfile();
          })
          //navigation.goBack()
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  weightListView = () => {
    const {babyWeight,weightUnits} = this.state
    return (
      <View style={styles.weightListView}>
        <CustomMeasurementsView
          getMeasurement={(item)=> this.updateWeight(item)}
          measurement='Weight'
          value={babyWeight.quantity}
          headerText={I18n.t('my_baby.weight')}
          units={weightUnits == KeyUtils.UNIT_GRAM ? KeyUtils.UNIT_KG : weightUnits}
        />
      </View>
    )
  }

  heightListView = () => {
    const {babyHeight,heightUnits} = this.state
    return (
      <View style={styles.weightListView}>
        <CustomMeasurementsView
          getMeasurement={(value)=> this.updateHeight(value)}
          measurement="Height"
          value={babyHeight.quantity}
          headerText={I18n.t('my_baby.length')}
          units={heightUnits == KeyUtils.UNIT_MM ? KeyUtils.UNIT_CM : heightUnits}
        />
      </View>
    )
  }

  render() {
    const {babiesData, genderSelected, babyWeight, babyHeight, babyName, baby_name_error, showCalendar, changeImagePopup,showNoInternetPopup,
      isLoading, showDelBabySuccessPopUp, showWeightListView, showHeightListView, birthday,isImageLoadingError, formattedDate
    } = this.state
    let updatedBabyWeight = (babiesData.length) ? ((babyWeight && babyWeight.quantity > 0) ? babyWeight.quantity + '  ' + babyWeight.unit:'') : ''
    let updatedBabyHeight = (babiesData.length) ? (babyHeight && babyHeight.quantity > 0) ? babyHeight.quantity + '  ' + babyHeight.unit:'' : ''
    return (
      <View style={styles.container}>
        <View style={{position: 'absolute', height: '100%', zIndex: 1}}>
          <HeaderTitle 
            title={I18n.t("accessibility_labels.baby_data")}
            onBackPress={()=> this.saveBabyData()}/>
          {isLoading && <LoadingSpinner/>}
          <View style={styles.imageWrapper}>
            <ImageBackground
              style={styles.imageStyle}
              defaultSource={require('../Images/png/my_baby.png')}
              onError={() => {
                this.setState({isImageLoadingError: true})
              }}
              source={!isImageLoadingError?this.getBabyImageUrl():require('../Images/png/my_baby.png')}
            >
              <TouchableOpacity onPress={() => {
                const {isInternetAvailable}=this.props
                if(isInternetAvailable){
                  this.setState({changeImagePopup: true})
                }else {
                  this.setState({showNoInternetPopup: true})
                }

                //this.selectBabyPicture
              }}>
                <View 
                  accessible={true}
                  accessibilityLabel={I18n.t("accessibility_labels.change_image")} 
                  style={styles.editPhotoIconView}>
                  <EditPhotoIcon fill={Colors.rgb_888B8D} style={styles.editPhotoIconStyle}/>
                </View>
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.contentWrapper}>
            <View style={styles.textInputStyle}>
              <CustomTextInput
                placeholder={I18n.t('profileSetup.babyDob')}
                placeholderTextColor={this.props.themeSelected === 'dark' ?(Colors.white):(Colors.rgb_000000)}
                textStyles={[styles.textInput,{color:this.textColor}]}
                errorMessage={I18n.t('profileSetup.back_to_work_date')}
                editable={false}
                ableToOpen={true}
                value={this.state.selectedDate ? formattedDate: ''}
                onPress={() => this.onClickBirthDate()}
              />
              <CustomTextInput
                placeholder={I18n.t('baby_information.baby_name')}
                placeholderTextColor={this.props.themeSelected === 'dark' ?(Colors.white):(Colors.rgb_000000)}
                textStyles={[styles.textInput,{color:this.textColor}]}
                value={babyName ? babyName : ''}
                error={baby_name_error}
                onChangeText={(index, value) => this.updateBabyName(value)}
                returnKeyType={"done"}
                onSubmitEditing={Keyboard.dismiss}
              />

              <CustomTextInput
                placeholder={I18n.t('baby_information.baby_birth_weight')}
                placeholderTextColor={this.props.themeSelected === 'dark' ?(Colors.white):(Colors.rgb_000000)}
                textStyles={[styles.textInput,{color:this.textColor}]}
                keyboardType={'number-pad'}
                value={updatedBabyWeight}
                editable={false}
                ableToOpen={true}
                onPress={() => this.setState({showWeightListView: true})}
              />
              <CustomTextInput
                placeholder={I18n.t('baby_information.baby_birth_height')}
                placeholderTextColor={this.props.themeSelected === 'dark' ?(Colors.white):(Colors.rgb_000000)}
                textStyles={[styles.textInput,{color:this.textColor}]}
                keyboardType={'number-pad'}
                value={updatedBabyHeight}
                editable={false}
                ableToOpen={true}
                onPress={() => this.setState({showHeightListView: true})}
              />
            </View>
            <View style={styles.genderView}>
              <View style={styles.genderTitleView}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.genderTitleTextStyle,{color:this.textColor}]}>{I18n.t('baby_information.gender')}</Text>
              </View>
              <View style={styles.genderBtnView}>
                <TouchableOpacity onPress={() => this.getGender(1)}>
                  <View style={[styles.buttonStyle, genderSelected === 1 && {backgroundColor: Colors.rgb_767676}]}>
                    <Text maxFontSizeMultiplier={1.7}
                      style={[styles.buttonTextStyle, genderSelected === 1 && {color: Colors.white},genderSelected !== 1 &&{color:Colors.rgb_000000}]}>{I18n.t('baby_information.baby_boy')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.getGender(2)}>
                  <View style={[styles.buttonStyle, genderSelected === 2 && {backgroundColor: Colors.rgb_767676}]}>
                    <Text maxFontSizeMultiplier={1.7}
                      style={[styles.buttonTextStyle, genderSelected === 2 && {color: Colors.white},genderSelected !== 2 &&{color:Colors.rgb_000000}]}>{I18n.t('baby_information.baby_girl')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {babiesData.length > 1 &&
            <View style={styles.deleteBtnWrapper}>
              <Button
                title={I18n.t('baby_information.delete_baby').toUpperCase()}
                style={styles.deleteButtonStyles}
                textStyle={[styles.deleteTextStyle,{color:Colors.rgb_000000}]}
                onPress={() => {this.setState({ showDeletePopup: true })}}
              />
            </View>
            }
          </View>
        </View>
        <Dialog
          visible={this.state.showDeletePopup}
          title={I18n.t('my_baby.delete_popup_title')}
          positive={I18n.t('my_baby.ok')}
          negative={I18n.t('my_baby.cancel')}
          isIcon={false}
          positiveOnPress={() => {
            this.deleteOnClick()
            this.setState({ showDeletePopup: false })
          }}
          negativeOnPress={() => this.setState({ showDeletePopup: false })}
        />
        {changeImagePopup && this.showImageUploadPopup()}
        {showCalendar && this.showCustomCalendar()}
        {showNoInternetPopup && this.showNoInternetPopup() }
        {showDelBabySuccessPopUp && this.delBabySuccessPopUp()}
        {showWeightListView && this.weightListView()}
        {showHeightListView && this.heightListView()}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  babies: state.home.babies,
  isBabyNameAdd: state.user.isBabyNameAdd,
  isBabyNameAddError: state.user.isBabyNameAddError,
  isPicUploaded: state.user.isPicUploaded,
  isPicUploadedError: state.user.isPicUploadedError,
  babyId: state.user.babyId,
  babiesSuccess: state.home.babiesSuccess,
  babiesFailure: state.home.babiesFailure,
  message: state.user.message,
  deleteBabySuccess: state.user.deleteBabySuccess,
  deleteBabyFailure: state.user.deleteBabyFailure,
  deleteBabyImageSuccess:state.user.deleteBabyImageSuccess,
  deleteBabyImageFailure:state.user.deleteBabyImageFailure,
  getBabyImageSuccess: state.home.getBabyImageSuccess,
  getBabyImageFailure: state.home.getBabyImageFailure,
  isInternetAvailable: state.app.isInternetAvailable,
  userProfile:state.user.userProfile,
  userProfileSuccess:state.user.userProfileSuccess,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  addBabyName: (babies) => dispatch(UserActions.addBabyName(babies)),
  uploadBabyPic: (babyId, imgFile) => dispatch(UserActions.uploadBabyPic(babyId, imgFile)),
  deleteBaby: (babyId) => dispatch(UserActions.deleteBaby(babyId)),
  deleteBabyImage: (babyId) => dispatch(UserActions.deleteBabyImage(babyId)),
  getBabyImage: (babyId) => dispatch(HomeActions.getBabyImage(babyId)),
  getMyBabies: () => dispatch(HomeActions.getMyBabies()),
  addProfile: (profile) => dispatch(UserActions.addProfile(profile.profile)),
  getUserProfile: () => dispatch(UserActions.getUserProfile()),
  setSelectedBaby: (item) => dispatch(HomeActions.setSelectedBaby(item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BabyInfoScreen);
