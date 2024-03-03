import React, { Component } from 'react';
import {
  Text, View, Image,
  TouchableOpacity,
  Keyboard,
  PermissionsAndroid,
  Alert,
  Platform
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RadioGroup from 'react-native-custom-radio-group';
import { connect } from 'react-redux';
import UserActions from '@redux/UserRedux';
import Button from '@components/Button';
import LoadingSpinner from '@components/LoadingSpinner';
import CustomCalendar from '@components/CustomCalendar'
import I18n from '@i18n';
import styles from './Styles/AddBabyScreenStyles';
import { Colors } from '@resources';
import moment from 'moment';
import { uuidV4, getDateFormat } from "@utils/TextUtils";
import BabyIcon from '@svg/ic_baby.svg'
import CustomTextInput from '@components/CustomTextInput';
import CustomMeasurementsView from '@components/CustomMeasurementsView';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {getHeightUnits, getWeightUnits } from '@utils/locale';
import HeaderTitle from '@components/HeaderTitle';
import HomeActions from '@redux/HomeRedux';
import { verticalScale } from '@resources/Metrics'
import Dialog from '@components/Dialog';
import NoInternetConnectionView from "@components/NoInternetConnectionView";
import {addBaby, getRealmDb, saveAllBabies, saveMotherProfile} from "../Database/AddBabyDatabase";
import AsyncStorage from "@react-native-community/async-storage";
import { scheduleBdayNotification, checkDaysDiff } from '@components/Notifications';
import KeyUtils from "@utils/KeyUtils";
import {cmToMm, kgToGram} from "@utils/locale";
import RNFetchBlob from 'rn-fetch-blob';

import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

// const firstBabyList = [{
//   label: I18n.t('addBaby.male'),
//   value: '1',
// }, {
//   label: I18n.t('addBaby.female'),
//   value: '2',
// }];

let imgFile = {}

class AddBabyScreen extends Component {
  firstBabyList = [{
    label: I18n.t('addBaby.male'),
    value: '1',
  }, {
    label: I18n.t('addBaby.female'),
    value: '2',
  }];
  constructor(props) {
    super(props);
    this.babyId = uuidV4();

    this.state = {
      isLoading: false,
      babyDob: '',
      babyName: '',
      babyPicture: '',
      babyWeight: '',
      babyHeight: '',
      babyDob_error:false,
      baby_name_error: false,
      openPicker: false,
      weightArray: [],
      heightArray: [],
      babyGender: 0,
      showBabySection: true,
      showErrorMessage: false,
      noInternet: false,
      showCalendarPicker: false,
      showHeightListView: false,
      showWeightListView: false,
      showAddBabySuccessPopUp: false,
      realmDb:null,
      weightUnits:'',
      heightUnits:'',
      formattedDate: ''
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.babies = {
      "babies": [{
        "babyId": this.babyId,
        "birthWeight": {"unit": '', "quantity": 0.0},
        "birthHeight": {"unit": '', "quantity": 0.0},
        "gender": 1,
        "name": ""
      }]
    }

    let minDate = moment();
    this.minDate = minDate.subtract(3, "years");
    this.minDate = this.minDate.format("YYYY/MM/DD");

    let maxDate = moment()
    //this.maxDate = maxDate.add('9', 'months')

    //this.maxDate = this.maxDate.format("YYYY/MM/DD");
    this.maxDate = maxDate.add('38', 'weeks').format("YYYY/MM/DD")

   }

  addMonths(date, months) {
    let d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  async componentDidMount() {
    const{navigation}=this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getWeightUnits(),getHeightUnits()]).then((values)=>{
      this.setState({weightUnits:values[0],heightUnits:values[1]})
      this.getWeight(values[0])
      this.getHeight(values[1])
    })
    let realmDb=await getRealmDb()
    if(navigation.getParam('newPregnancy')){
      this.setState({showBabySection: !navigation.getParam('newPregnancy'),realmDb})
    }else{
      this.setState({showBabySection: true,realmDb})
    }

    await analytics.logScreenView('add_baby_screen')
  }

  componentDidUpdate(prevProps, prevState) {
    const {isBabyNameAdd, switchBabySuccess, selectedBabyClientId, isBabyNameAddError, setSelectedBaby, switchBaby, isPicUploaded, babyId, isPicUploadedError, uploadBabyPic,getMyBabies,babies, babiesSuccess, userProfile,babiesFailure, navigation} = this.props;
    const {showBabySection, realmDb,babyName} = this.state

    if (prevProps.isBabyNameAdd != isBabyNameAdd && isBabyNameAdd && prevState.isLoading) {

      if (Object.keys(imgFile).length > 0) {
        uploadBabyPic(babyId, imgFile);
      } else {
        getMyBabies();

        navigation.getParam('newPregnancy') && navigation.goBack()
      }
    }
    if ((prevProps.isBabyNameAddError != isBabyNameAddError) && isBabyNameAddError && prevState.isLoading) {
      this.setState({isLoading: false, showErrorMessage:true});
    }
    if (prevProps.isPicUploaded != isPicUploaded && isPicUploaded && prevState.isLoading) {
      imgFile = {}
      getMyBabies();
    }
    if ((prevProps.isPicUploadedError != isPicUploadedError) && isPicUploadedError && prevState.isLoading) {
      this.setState({isLoading: false, showErrorMessage:true});
    }
    if (prevProps.babiesSuccess != babiesSuccess && babiesSuccess && prevState.isLoading) {
      switchBaby(this.babies.babies[0].babyId)
      // this.setState({isLoading: false, showAddBabySuccessPopUp: true});
      // alert('baby added successfully')
      this.setState({isLoading: false})
      navigation.goBack();
      console.log('userProfile--',userProfile)
      if (userProfile && userProfile.mother){
        let modifiedBabies = babies.map(baby => ({...baby, isSync: true,username:userProfile.mother.username}));
        //console.log('babiesSucces--', JSON.stringify(modifiedBabies))
        saveAllBabies(realmDb, modifiedBabies).then((success) => {

        })
      }
      this.scheduleBdayNotification()
    }

    if (switchBabySuccess!=prevProps.switchBabySuccess && switchBabySuccess){
      setSelectedBaby(this.babies.babies[0])
      // this.props.getUserProfile()
      let profile = realmDb.objects('UserMotherProfile');
      let modified=JSON.parse(JSON.stringify(profile))
      if (modified.length>0){
        modified[0].mother.currentBabyClientId=selectedBabyClientId
        saveMotherProfile(realmDb,modified[0]).then((e)=>{
          navigation.goBack();
        })
      }
    }

    if ((prevProps.babiesFailure != babiesFailure) && babiesFailure && prevState.isLoading) {
      this.setState({isLoading: false, showErrorMessage:true});
    }

  }

  selectBabyPicture = () => {
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
        let source = { uri: response.uri };
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

        imgFile = photo
        console.log('imageFile--',imgFile)
        this.setState({
          babyPicture: source,
        });
      }
    });
  }

  async addBabyDOB(date) {
    const{navigation}=this.props
    let selectedDate = moment(date).format('YYYY-MM-DD')
    let currentDate=moment().add(1,'days').format('YYYY-MM-DD')
    let tempShowBabySection = moment(selectedDate).isBefore(currentDate)
    navigation.getParam('newPregnancy') && (tempShowBabySection = false)
    let newDate = await getDateFormat(date)
    this.setState({babyDob: date, formattedDate: newDate, showBabySection: tempShowBabySection, babyDob_error:false})
  }

  getFormattedDate(selectDate) {
    let momentObj = moment(selectDate, 'YYYY/MM/DD')
    let newDate = moment(momentObj).format('YYYY-MM-DD')
    return newDate
  }

  scheduleBdayNotification() {
    if(checkDaysDiff(this.babies.babies[0].birthday)) {
      AsyncStorage.getItem(KeyUtils.SCHEDULED_NOTIFICATIONS, (err, result) => {
        let scheduleId = [];
        const id = [this.babies.babies[0].babyId];
        if (result !== null) {
          scheduleId = JSON.parse(result).concat({id: id, time: moment().format("YYYY-MM-DD hh:mm:ss")});
        } else {
          scheduleId = [{id: id, time: moment().format("YYYY-MM-DD hh:mm:ss")}]
        }
        scheduleBdayNotification(scheduleId)
      });
    }
  }

  onSavePress = async () => {
    const {babyName, babyGender, babyHeight, babyWeight, showBabySection,babyDob,weightUnits,heightUnits} = this.state
    const {isInternetAvailable,userProfile,addBabyName,navigation}=this.props
    let babies = this.babies
    this.babies.babies[0].birthHeight.unit = heightUnits===KeyUtils.UNIT_CM?KeyUtils.UNIT_MM:heightUnits
    this.babies.babies[0].birthWeight.unit = weightUnits===KeyUtils.UNIT_KG?KeyUtils.UNIT_GRAM:weightUnits

    if (babyName==='') this.babies.babies[0].name = 'Baby 1'
    else  this.babies.babies[0].name = babyName.toString().trim()

    this.babies.babies[0].gender = parseInt(babyGender)
    if(showBabySection) {
      this.babies.babies[0].birthday = this.getFormattedDate(babyDob)
      this.babies.babies[0].birthWeight.quantity = weightUnits===KeyUtils.UNIT_KG?kgToGram(babyWeight):parseFloat(babyWeight)
      this.babies.babies[0].birthHeight.quantity = heightUnits===KeyUtils.UNIT_CM?cmToMm(babyHeight):parseFloat(babyHeight)
    }else{
      this.babies.babies[0].birthday = this.getFormattedDate(babyDob)
    }

    if (isInternetAvailable){
      this.setState({isLoading:true})

      addBabyName({babies});
    }else {
      let obj=JSON.parse(JSON.stringify(this.babies.babies[0]))
      if (!babyWeight){
        delete obj.birthWeight
      }
      if (!babyHeight){
        delete obj.birthHeight
      }
      if (babyGender===0){
        delete obj.gender
      }
      if (Object.keys(imgFile).length > 0) {
        obj['image']=imgFile;
        try{
          let response=await this.handleDownload(imgFile.uri);
          if(response!=null&&response.length>0){
            obj['imagePath']=response
          }
        }catch{
        }

      }
      if (userProfile && userProfile.mother){
        obj['username']=userProfile.mother.username
        console.log('baby---',JSON.stringify(obj))
        //alert(babyWeight)
        addBaby(obj).then((r)=>{
          this.scheduleBdayNotification()
          navigation.goBack();
        })
      }
    }
  };
  handleDownload = async (url) => {
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
    }).fetch('GET', url).then(res => {
      return Platform.OS=='android'?`file://${res.data}`:res.data
    }).catch(error => {
      return null;
    })
  };
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

  weightListView=()=>{
		const{babyWeight}=this.state
		return(
			<View style={styles.weightListView}>
				<CustomMeasurementsView
          getMeasurement={(value)=> this.setState({ babyWeight: value, showWeightListView: false })}
          measurement='Weight'
          value={babyWeight || 0}
          headerText={I18n.t('my_baby.weight')}
				/>
			</View>
		)
	}

	heightListView=()=>{
    const{babyHeight}=this.state
		return(
			<View style={styles.weightListView}>
				<CustomMeasurementsView
					getMeasurement={(value)=> this.setState({ babyHeight: value, showHeightListView: false })}
          measurement="Height"
          value={babyHeight||0}
          headerText={I18n.t('my_baby.length')}
				/>
			</View>
		)
	}

  renderBabySection() {
    const { babyPicture, heightUnits, weightUnits, babyWeight, babyHeight} = this.state
    const {themeSelected}=this.props
    const pickerStyle = {
      inputIOS: styles.pickerInput,
      inputAndroid: styles.pickerInput,
      done:{color:Colors.rgb_fecd00},
      placeholder:{color:Colors.rgb_898d8d},
    };
    let sectionBackgroundColor = Colors.white
    let inactiveRadioButtonColor = Colors.rgb_f5f5f5
    let activeTextColor = Colors.white
    if(themeSelected==="dark"){
      sectionBackgroundColor = Colors.rgb_373838
      inactiveRadioButtonColor = Colors.rgb_373838
      activeTextColor = Colors.rgb_000000
    }

    return <View>
      <TouchableOpacity
        style={[styles.babyImageContainer, {backgroundColor: sectionBackgroundColor}]}
        onPress={this.selectBabyPicture}>
        {babyPicture == "" ? <View style={styles.babyPlaceHolder}>
        <BabyIcon fill={Colors.rgb_70898d8d} style={styles.babyIcon} />
          <Text maxFontSizeMultiplier={1.7} style={[styles.uploadText,{color:this.textColor}]}>{I18n.t('addBaby.upload')}</Text>
        </View> :
          <Image
            style={styles.babyImage}
            source={babyPicture}
          />}
      </TouchableOpacity>

      <View style={{width: '100%'}}>
        <CustomTextInput
          placeholder={I18n.t('addBaby.babyWeight')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          keyboardType={'number-pad'}
          value={babyWeight? babyWeight + '  ' + weightUnits: ''}
          editable={false}
          ableToOpen={true}
          onPress={()=> this.setState({showWeightListView: true})}
        />
      </View>

      <View style={{width: '100%'}}>
        <CustomTextInput
          placeholder={I18n.t('addBaby.babyHeight')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor}]}
          keyboardType={'number-pad'}
          value={babyHeight? babyHeight + '  ' + heightUnits: ''}
          editable={false}
          ableToOpen={true}
          onPress={()=> this.setState({showHeightListView: true})}
        />
      </View>

      <Text maxFontSizeMultiplier={1.7} style={[styles.subTitle,{color:this.textColor}]}>{I18n.t('addBaby.gender')}</Text>

      <RadioGroup
        buttonContainerInactiveStyle={[styles.radioBtnInactive, {backgroundColor: inactiveRadioButtonColor}]}
        buttonContainerActiveStyle={styles.radioBtnActive}
        buttonContainerStyle={styles.radioBtnContainer}
        buttonTextActiveStyle={[styles.radioBtnTextActive, {color: activeTextColor}]}
        buttonTextInactiveStyle={[styles.radioBtnTextInactive,{color:this.textColor}]}
        radioGroupList={this.firstBabyList}
        onChange={(value)=>this.setState({babyGender:value})}/>
    </View>
  }



  renderBottomView() {
    const { babyDob, babyName, babyWeight, babyHeight, showBabySection } = this.state
    return <View style={styles.bottomViewStyle}>
      <Button
        disabled={!babyDob || showBabySection && (!babyName || !babyWeight || !babyHeight)}
        title={I18n.t('addBaby.save')}
        onPress={this.onSavePress}
        style={styles.buttonContainer}
      />
    </View>
  }

  checkName(value) {
    this.setState({babyName: value})
    // if (value === '') {
    //   this.setState({baby_name_error: true})
    // } else {
    //   this.setState({baby_name_error: false})
    // }
  }

  getWeight(weightUnits){

    let arr=[]
    let x=0.25
    for (let i = 1; weightUnits == KeyUtils.UNIT_LB ? i <= 180 : i <= 82; i++) {
      let vv= (0.25*i)
      let obj={
        id: i,
        label: (vv)+' '+weightUnits,
        value:(vv).toString(),
        color:Colors.rgb_898d8d
      }
      arr.push(obj)
    }
    this.setState({weightArray:arr})

  }

  getHeight(heightUnits){

    let arr=[]
    let heightStart = 21
    if(heightUnits == KeyUtils.UNIT_INCH){
      heightStart = 1
    }
    for (let i = heightStart; heightUnits == KeyUtils.UNIT_INCH ? i <= 35 : i <= 90; i++) {
      let obj={
        id: i,
        label: (i)+' '+heightUnits,
        value:(i).toString(),
        color:Colors.rgb_898d8d,
      }
      arr.push(obj)
    }
    this.setState({heightArray:arr})
  }

  showStatusMessage() {
    const {showErrorMessage } = this.state
    return (
      <Dialog
        visible={showErrorMessage}
        title={I18n.t('generic.alert_title')}
        message={I18n.t('generic.error_message')}
        positive={I18n.t('login.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({showErrorMessage: false})
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  showInternetError(){
    const{noInternet}=this.state
    return <NoInternetConnectionView
      visible={noInternet}
      negativeOnPress={()=>this.setState({noInternet:false})}
      positiveOnPress={()=>this.onSavePress()}
    />
  }

  _onDateChange = (date) => {
    this.addBabyDOB(date)
  }

  positiveOnPress = () => {
    this.setState({
      showCalendarPicker: false
    });
  }

  negativeOnPress = () => {
    this.setState({
      babyDob: '',
      showCalendarPicker: false,
      showBabySection:true
    });
  }

  showCalendar() {
    const {showCalendarPicker, babyDob} = this.state
    const{navigation}=this.props
    let updatedMinDate= this.minDate
    navigation.getParam('newPregnancy') && (updatedMinDate = moment().format('YYYY/MM/DD'))
    return (
      <CustomCalendar
        visible={showCalendarPicker}
        title={I18n.t('login.forgot_password_title')}
        message={I18n.t('login.forgot_password_message')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        selectedDate={babyDob}
        minDate={updatedMinDate}
        maxDate={this.maxDate}
        negativeOnPress={() => this.negativeOnPress()}
        positiveOnPress={() => this.positiveOnPress()}
        isAddBaby={true}
        onDismiss={() => {
        }}
        onDateChange={(date) => this._onDateChange(date)}
        showHeader={true}
        notShowTime
      />
    )
  }

  onBabyDOBClick() {
    this.setState({babyDob: this.state.babyDob ? moment(this.state.babyDob).format() : moment().add(1, 'days'), showCalendarPicker: true})
  }

  addBabySuccessPopUp() {
		const {showAddBabySuccessPopUp} = this.state
		const{navigation}=this.props
		return (
		<Dialog
			visible={showAddBabySuccessPopUp}
			title={I18n.t('addBaby.add_baby_success_message')}
			positive={I18n.t('baby_information.ok_btn')}
			isIcon={false}
			positiveOnPress={() => {
				this.setState({showAddBabySuccessPopUp: false})
				navigation.goBack()
			}}
			onDismiss={() => {
			}}
		/>
		)
	};

  render() {
    const { babyName, babyDob, showCalendarPicker, babyDob_error,
      baby_name_error, isLoading, openPicker, showBabySection, formattedDate,
      showErrorMessage, noInternet, showHeightListView, showWeightListView, showAddBabySuccessPopUp } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{flex: 1}}>
        <View style={styles.homeContainer}>
          <HeaderTitle title={I18n.t('addBaby.add_baby_Title')} onBackPress={()=>navigation.goBack()}/>
          <KeyboardAwareScrollView keyboardShouldPersistTaps='always' contentContainerStyle={{flexGrow: 1, paddingBottom: showBabySection ? verticalScale(100) : 0}}>
            <View style={[styles.container]}>


              <CustomTextInput
                placeholder={I18n.t('addBaby.babyDob')}
                placeholderTextColor={this.textColor}
                textStyles={[styles.textInput,{color:this.textColor}]}
                error={babyDob_error}
                errorMessage={I18n.t('addBaby.baby_dob_error')}
                minDate={this.minDate}
                maxDate={this.maxDate}
                editable={false}
                ableToOpen={true}
                value={babyDob && formattedDate}
                onPress={() => this.onBabyDOBClick()}
              />

              <CustomTextInput
                maxLength={20}
                placeholder={I18n.t('addBaby.babyName')}
                placeholderTextColor={this.textColor}
                textStyles={[styles.textInput,{color:this.textColor}]}
                value={babyName}
                onChangeText={(index, value) => this.checkName(value)}
                returnKeyType={"done"}
                onSubmitEditing={Keyboard.dismiss}
              />



              {showCalendarPicker && this.showCalendar()}

              {showBabySection && this.renderBabySection()}



              {this.renderBottomView()}
            </View>
            {showErrorMessage && this.showStatusMessage()}
          </KeyboardAwareScrollView>
        </View>
        {isLoading && <LoadingSpinner />}
        {showHeightListView && this.heightListView()}
        {showWeightListView && this.weightListView()}
        {showAddBabySuccessPopUp && this.addBabySuccessPopUp()}
      </View>
    );
  }

}

const mapStateToProps = (state) => ({
  message: state.user.message,
  userProfile: state.user.userProfile,
  babies: state.home.babies,
  isBabyNameAdd: state.user.isBabyNameAdd,
  isBabyNameAddError: state.user.isBabyNameAddError,
  isPicUploaded: state.user.isPicUploaded,
  isPicUploadedError: state.user.isPicUploadedError,
  babyId: state.user.babyId,
  babiesSuccess: state.home.babiesSuccess,
  babiesFailure: state.home.babiesFailure,
  isInternetAvailable: state.app.isInternetAvailable,
  themeSelected: state.app.themeSelected,
  selectedBabyClientId:state.user.selectedBabyClientId,
  switchBabySuccess:state.user.switchBabySuccess,
});

const mapDispatchToProps = (dispatch) => ({
  addBabyName: (babies) => dispatch(UserActions.addBabyName(babies)),
  uploadBabyPic: (babyId, imgFile) => dispatch(UserActions.uploadBabyPic(babyId, imgFile)),
  getMyBabies: () => dispatch(HomeActions.getMyBabies()),
  setSelectedBaby: (item) => dispatch(HomeActions.setSelectedBaby(item)),
  switchBaby: (babyId) => dispatch(UserActions.switchBaby(babyId)),
  getUserProfile: () => dispatch(UserActions.getUserProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(AddBabyScreen);
