import React, {Component} from 'react'
import {BackHandler,Modal, Platform,Text, View} from 'react-native'
import styles from './Styles/FreezerTrackingStyles'
import {connect} from "react-redux";
import HeaderTrackings from "@components/HeaderTrackings";
import VirtualInventory from "@components/VirtualInventory";
import Button from "@components/Button";
import CustomVolumeSlider from "@components/CustomVolumeSlider";
import CustomMeasurementView from "@components/CustomMeasurementView";
import I18n from "react-native-i18n";
import VirtualFreezer from "../Components/VirtualFreezer";
import AddIcon from '@svg/ic_quick_add';
import RightArrowIcon from '@svg/ic_right_arrow';
import BottleIcon from '@svg/ic_bottle';
import ActivePumpingIcon from '@svg/pumping';
import {BlurView} from "@react-native-community/blur";
import Colors from "@resources/Colors";
import { saveVirtualFreezerDatabase} from "@database/VirtualFreezerDatabase";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {uuidV4,validateSpecialChracter} from "@utils/TextUtils";
import moment from "moment";
import NavigationService from "@services/NavigationService";
import {getVolumeMaxValue, getVolumeUnits} from "@utils/locale";
import HomeActions from '@redux/HomeRedux';
import Dialog from '@components/Dialog';
import { milkExpiredNotification } from '@components/Notifications';
import { Analytics } from '@services/Firebase';
import StartEndTimers from '@components/StartEndTimers';
import { getTimeFormat } from '@utils/TextUtils';
import CustomCalendar from '@components/CustomCalendar'
import { getRealmDb } from '../Database/AddBabyDatabase';
import {Constants} from "@resources";

let analytics = new Analytics()
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class FreezerTrackingScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showQuickAdd: false,
      inventoryItems: [],
      volumeCount: 0,
      isFocus:false,
      sliderValue:0,
      containerType: -1, // 1: Bottle 2: Bag
      location: -1, //  1: Fridge 2: Freezer
      fridgeSelected: -1,
      bottleSelected: 0,
      number: '',
      tray: '',
      bottleBagNumber: -1,
      trayNumber: '',
      showErrorPrompt: false,
      errorMessage:'',
      isLoading: false,
      unit: '',
      maxVolumeValue: 0,
      isClearFilter: false,

      isCheckInventory: false,
      refreshing: false,
      noMoreFound: false,
      showCongratsPopup: false,
      is24HourFormat:false,
      hour: '00',
      min:'00',
      isAmPm:'AM',
      startTimeAmPm:1,
      showCalendarPicker:false,
      selectedDate:moment().format()
    }
    this.inventoryUUID = ''
    this.userName = ''
    this.pageNumber = 1
    this.hour='00'
    this.min="00"
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      this.setState({isCheckInventory: this.props.navigation.state.params !== undefined ? this.props.navigation.state.params.isCheckInventory : false})
      Promise.all([getVolumeUnits(), getVolumeMaxValue()]).then((values) => {
        this.setState({unit: values[0], maxVolumeValue: values[1]})
      });
      AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
        if (_units != null) {
          this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL})
        }
      })
    })
    await analytics.logScreenView('freezer_tracking_screen')
    const timeArr = moment().format("hh:mm A").split(':')
    let is12Hour=await getTimeFormat(true)
    this.setState({is24HourFormat:is12Hour,
      isAmPm: timeArr[1].split(' ')[1],
      startTimeAmPm:timeArr[1].split(' ')[1]=="AM"?1:2
    })
  }
  onAndroidBackPress = () => {
    this._handleBack()
    return true;
  }
  componentWillUnmount() {
    const {freezerRealmDb} = this.state
    if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress');
    }
    this.focusListener && this.focusListener.remove();
  }

  async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {createBottleApiSuccess, createBottleApiFailure} = this.props

    if (createBottleApiSuccess != prevProps.createBottleApiSuccess && createBottleApiSuccess && prevState.isLoading) {
      this.saveEditFreezerDataInDB(true)
      this.setState({showErrorPrompt: false, volumeCount: 0, isLoading: false, tray: '',number:'',selectedDate:moment().format(),hour:this.hour,min:this.min})
      let realmDb = await getRealmDb()
      let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
      let myItems = realmDb.objects('VirtualFreezerSchema');
      let items=myItems.filter((e)=>{
        return e.userId==userName
      })
      milkExpiredNotification(this.quickAddObj)
      AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS).then(async (result)=>{
        if(result !== 'true')  {
          if(items.length === 1 ) {
            AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS_NOTIF).then((value)=>{
              if (value !== 'false'){
                AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS, 'true')
                this.setState({ showCongratsPopup: true })
              }
            })
          } else if(items.length > 0) {
            AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS, 'true')
          }
        }
      })
    }

    if ((prevProps.createBottleApiFailure != createBottleApiFailure) && createBottleApiFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
  }

  _handleBack = () => {
    const {navigation} = this.props
    navigation.goBack()
    AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName) => {
      if (tabName != null) {
        NavigationService.navigate(tabName)
      } else {
        NavigationService.navigate('Baby')
      }
    })
  }

  renderHeader() {
    const {navigation} = this.props
    return <HeaderTrackings
      title={I18n.t('bottle_tracking.virtual_freezer')}
      hideCalendarNBaby={true}
      onBackPress={() => this._handleBack()}
      onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
      navigation={navigation}
      getSelectedDate={(value) => this.setState({selectedDate: value})}/>
  }

  handleVolumeChangeValue = (value) => {
    this.setState({
      volumeCount: value,
    });
  };

  nearestMaxValue=(maxValue,multiplicity)=>{
    let temp=0;
    while (temp<maxValue) {
      temp+=multiplicity;
    }
    return temp;
  }
  _onDateChange = (date) => {
this.setState({selectedDate:date})  }

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
        selectedDate={this.state.selectedDate}
        minDate={updatedMinDate}
        maxDate={moment().format()}
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
  checkValidTime(value,type){
    const {hour,min,selectedDate,endMin,dateSelected,is24HourFormat,startTimeAmPm,endTimeAmPm}=this.state;
    if(type==='hour'){
      if((!is24HourFormat && value>12) || (is24HourFormat && value>23)){
        this.setState({showErrorPrompt: true,errorMessage:I18n.t('calendar.date_time_alert')})
        this.setState({hour:''})
      } else {
        this.setState({hour:value,showErrorPrompt: false})
        if(value.length>1 && !is24HourFormat){
        this.refStartLeftTimer.minInput.focus()
        }
        else if(value.length>1 && is24HourFormat){
          this.refStartLeftTimer.minInput.focus()
        }
      }
    } else {
      // min
      if((value>59)){
        this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.container_type_error')})
        this.setState({min:''})
      } else {
        this.setState({min:value,showErrorPrompt: false})
      }
    }
}
  renderQuickAddModal = () => {
    const {showQuickAdd, volumeCount, containerType, location, tray, number, maxVolumeValue, unit,sliderValue,isFocus,startTimeAmPm,isAmPm} = this.state
    const {themeSelected} = this.props

    const {showStartEndTime,dualTimer,showDateBar,defaultStartDate}=this.props;
    const {disableOkButton,validationMessage,hour,min,is12Hour,intialStartAmPm,dateSelected}=this.state;
    let updatedBackgroundcolor = Colors.white
    themeSelected === "dark" && (updatedBackgroundcolor = Colors.rgb_000000)
    let multiplicityValue = 10
    unit === 'oz' && (multiplicityValue = 1)
    return <Modal
      visible={showQuickAdd}
      animationType={'fade'}
      transparent={true}>
      <BlurView blurType='light' style={{flex: 1,}}>
        <View style={{flex: 1, backgroundColor: Colors.rgb_898d8d_4}}>
          <View style={{flex: 1, justifyContent: 'center', height: 600}}>
            <View style={{backgroundColor: 'white'}}>
            <KeyboardAwareScrollView ref={ref => {this.scrollView = ref}} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>             
             <VirtualFreezer
                style={{marginLeft: 10, marginHorizontal: 20,}}
                title={I18n.t('breastfeeding_pump.save_to_virtual_freezer')}
                titleTextColor = {Colors.rgb_000000}
                switchButton={false}
                trayNumber={tray}
                bottleNumber={number}
                onNumberChangedText={(number) => {
                  if (number>250){
                    this.setState({showErrorPrompt: true,errorMessage:I18n.t('virtual_freezer.number_limit_msg')})
                    this.setState({number:number>250?'':number})
                  }
                  else if(validateSpecialChracter(number.toString())){
                    this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.container_special_character_error')})
                    this.setState({number:validateSpecialChracter(number.toString())===true?'':number})
                  }
                  else{
                    this.setState({number:number})
                  }
                }}
                onTrayChangedText={(tray) => {
                  if (tray>250){
                    this.setState({showErrorPrompt: true,errorMessage:I18n.t('virtual_freezer.tray_limit_msg')})
                    this.setState({tray:tray>250?'':tray})
                  }
                  else if(validateSpecialChracter(tray.toString())){
                    this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_special_character_error')})
                    this.setState({tray:validateSpecialChracter(tray.toString())===true?'':tray})
                  }
                  else{
                    this.setState({tray:tray})
                  }
                }}
                onBottleBagChange={(containerType) => {
                  this.setState({containerType})
                }}
                onFridgeFreezerChange={(location) => this.setState({location})}
                bottle={true}/>
              <Text maxFontSizeMultiplier={1.7} style={[styles.volumeTextStyle,{ marginHorizontal: 20,color:Colors.rgb_000000}]}>{I18n.t('breastfeeding_pump.total_volume')}</Text>
              <View style={{height: 130,}}>
                <CustomVolumeSlider
                  multiplicity={multiplicityValue}
                  //maxSliderValue={this.state.maxVolumeValue}
                  maxSliderValue={this.nearestMaxValue(this.state.maxVolumeValue,multiplicityValue)}
                  restrictPoint={this.state.maxVolumeValue}
                  // value={volumeCount}
                  changeValue={this.handleVolumeChangeValue}
                  range={unit==='oz'?5:50}
                  onScrollBeginDrag={()=>{
                    if(this.nameRef.isFocused()){
                      this.nameRef.blur();
                    }
                  }}
                  value={sliderValue}
                  decimalPlaces={unit==='oz'?2:0}
                  accuracy={true}
                  numberColor={Colors.rgb_000000}
                />

              </View>
              {/* <View style={styles.volumeCountView}> */}
              <CustomMeasurementView
                //value={volumeCount}
                maxValue={this.state.maxVolumeValue}
                //textInputValue={(value) => this.setState({volumeCount: value})}
                units={I18n.t(`units.${unit.toLowerCase()}`)}
                textInputValue={(value)=>{
                  let temp=parseFloat(value==''||value==undefined?0:value)
                  this.setState({sliderValue:isNaN(temp)?0:temp})
                }}
                onBlur={()=>{
                  this.setState({isFocus:false})
                }}
                onFocus={()=>{
                  this.setState({isFocus:true,sliderValue:volumeCount})
                }}
                inputRef={(input)=>{ this.nameRef = input }}
                value={isFocus?sliderValue+'':volumeCount+''}
                editable={false}
                titleTextColor = {Colors.rgb_000000}
              />
<StartEndTimers
        showStartEndTime={true}
        disableOkButton={true}
        validationMessage={"validationMessage"}
        renderValidation={false}
        hour={hour}
        min={min}
        onChangeTextHour={(index,value)=>{
          this.checkValidTime(value,'hour')
         // this.onChangeTextValue(value,I18n.t('calendar.hours'),'hour','min',this.refStartLeftTimer.hoursInput,this.refStartLeftTimer.minInput,'default')
        }}
        onChangeTextMin={(index,value)=>{
          this.checkValidTime(value,"min")
         // this.onChangeTextValue(value,I18n.t('calendar.mins'),'hour','min',this.refStartLeftTimer.hoursInput,this.refStartLeftTimer.minInput,'default')
        }}
        // formValidationChange={()=>{
        //   console.log('forms',this.refStartLeftTimer.forms)
        // }}
        is12Hour={!this.state.is24HourFormat}
        onSwitchValueChange={(val) => {
          this.setState({
            isAmPm: (val === 1)? I18n.t('calendar.is_am'): I18n.t('calendar.is_pm'),
            startTimeAmPm:(val===1)?'AM':'PM'
          })
        }}
        initialAmPm={startTimeAmPm}
       // timebackgroundColor={this.getTimeBackgroundColor()}
        ref={instance=>{this.refStartLeftTimer=instance}}
        title={I18n.t(`calendar.Creation_date`)}
        showDateBar={true}
        dateSelected={this.state.selectedDate}
        showCalendar={()=>this.setState({showCalendarPicker:true})}
        type={'default'}
        textColor={this.props.textColor}
      />
              {this.state.showErrorPrompt && <Text maxFontSizeMultiplier={1.7} style={[styles.volumeCountTextStyles, {
                color: 'red',
                marginTop: 15,
                marginHorizontal: 20,
              }]}>{this.state.errorMessage}</Text>}

      {this.state.showCalendarPicker && this.showCalendar()}
              <View style={[styles.cancelSaveView,{ marginHorizontal: 20}]}>
                <Button title={I18n.t('generic.cancel').toUpperCase()} textStyle={styles.cancelTextStyle}
                        onPress={() => this.setState({
                          showQuickAdd: false,
                          showErrorPrompt: false,
                          volumeCount: 0,
                          location:-1,
                          containerType:-1,
                          tray: '',
                          selectedDate:moment().format(),
                          hour:this.hour,
                          min:this.min
                        })}
                        style={styles.cancelButtonStyles}/>
                <Button
                  //disabled={containerType === -1 || location === -1 || tray === '' || number == '' || volumeCount == ''}
                  title={I18n.t('generic.save').toUpperCase()} textStyle={styles.saveTextStyle} onPress={async () => {
                 if(this.handleFreezerValidations()){
                  let entryExist = await this.checkFreezerInventoryAlreadyExist();
                  entryExist ? this.setState({showErrorPrompt: true,errorMessage:I18n.t('freezer_popup.title')}) : this.saveFreezerData()
                 }
                }}
                  style={[styles.saveButtonStyles, {opacity: 1}]}/>
              </View>
</KeyboardAwareScrollView>
            </View>
          </View>

        </View>
      </BlurView>
    </Modal>
  }

  handleFreezerValidations() {
    if (this.state.containerType === -1) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.container_type_error')})
      return false
    }

    else if (this.state.location === -1) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.location_type_error')})
      return false
    }
    else if (this.state.number == '') {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.number_error')})
      return false
    }
    else if (this.state.tray === '') {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_error')})
      return false
    }else if (this.state.number == 0) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.number_zero_error')})
      return false
    }
    else if (this.state.tray == 0) {
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.tray_zero_error')})
      return false
    } else if (this.state.volumeCount<=0){
      this.setState({showErrorPrompt: true,errorMessage:I18n.t('breastfeeding_pump.volume_error_msg')})
      return false
    }
    else{
      return true
    }
  }
  async checkFreezerInventoryAlreadyExist() {
    let {freezerRealmDb} = this.state
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    if (freezerRealmDb == null) {
      let realmDb = await getRealmDb()
      freezerRealmDb = realmDb
      this.setState({freezerRealmDb: realmDb})
    }
    let myItems = freezerRealmDb.objects('VirtualFreezerSchema');
  /*  let inventoryName = myItems.filtered(
      `number = ${this.state.number} && containerType = ${this.state.containerType} && isConsumed=${false}`);*/
    let inventoryName=myItems.filter((e)=>{
      return e.userId==userName && e.number==this.state.number && e.containerType==this.state.containerType && e.isConsumed==false
    })
    //console.log('items---',inventoryName,userName)
    return inventoryName.length>0 ;
  }

  async saveFreezerData() {
    const {volumeCount, containerType, location, tray, number} = this.state
    let currentDate=(moment(this.state.selectedDate).format('MM-DD-yy'))
    let date= currentDate+' '+ this.state.hour+':'+ this.state.min +' '+ this.state.isAmPm
    let trackAt = moment(date, ["MM-DD-yy hh:mm A"]).format("yyyy-MM-DDTHH:mm:ssZ")
    let expireAt = location === 1 ? moment(trackAt).add(3, 'days').format() : moment(trackAt).add(6, 'months').format()
    let apiObj = {
      id: uuidV4(),
      trackingMethod: 2, //Quick Add
      trackAt: trackAt,
      location: location,
      tray: parseInt(tray),
      containerType: containerType,         // 1: Bottle, 2: Bag
      number: parseInt(number),         // container number
      amount: parseFloat(volumeCount),
      unit: this.state.unit,      // oz, ml
      createdFrom: "",      // optional: UUID of the pump tracking if Pump Added inventory
      isConsumed: false,
      consumedBy: '',
      consumedAt: "",
      isExpired: false,
      expireAt: expireAt,
      movedAt: "",
    };
    this.quickAddObj = {...apiObj}
    let bottleData = Object.assign({milkInventories: [apiObj]});
2
    let param = {
      'interaction':'milk_stored_from_quick_add',
    }
    await analytics.logEvent(Constants.VIRTUAL_FREEZER, param); // Firebase event for Users saving successfully milk through quick add to Virtual Milk Storage
    const {isInternetAvailable, createBottleApi} = this.props
    if (isInternetAvailable) {
      this.setState({isLoading: true})
      createBottleApi(bottleData)
    } else {
      this.saveEditFreezerDataInDB(false)
    }
    this.setState({showQuickAdd: false})
  }

  async saveEditFreezerDataInDB(isSync) {
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    let dbObj = {
      ...this.quickAddObj,
      userId: userName,
      isSync: isSync,
      isDeleted: false
    };
    const {freezerRealmDb} = this.state
    saveVirtualFreezerDatabase(freezerRealmDb, dbObj).then((r) => {

    })
  }

  renderMoveMilkView() {
    const {inventoryItems} = this.state
    return <View style={styles.moveMilkViewStyle}>
      <View>
        <Text allowFontScaling={false} style={[styles.moveMilkTextStyle,{color:this.textColor}]}>{I18n.t('virtual_freezer.move_milk')}</Text>
        <RightArrowIcon style={styles.rightArrowStyle} width={65} height={65} onPress={() => {
          this.props.navigation.navigate('MoveMilkInventory', {
            inventoryItems: inventoryItems
          })
        }}/>
        <Text allowFontScaling={false} style={styles.quickTextStyle}>{' '}</Text>
      </View>
    </View>
  }

   async showQuickAddModal(){ 
   let is12Hour=await getTimeFormat(true)
   const timeArr = moment().format("hh:mm A").split(':')
   {!is12Hour? this.setState({hour:moment().format('hh'), min:moment().format('mm')}):this.setState({hour:moment().format('HH'), min:moment().format('mm')})}
   if(!is12Hour) {
   this.hour=moment().format('hh')
   this.min=moment().format('mm')
    } else{
   this.hour=moment().format('HH')
   this.min=moment().format('mm')
    }
    this.setState({is24HourFormat:is12Hour,
      isAmPm: timeArr[1].split(' ')[1],
      startTimeAmPm:timeArr[1].split(' ')[1]=="AM"?1:2
    })
  
  this.setState({showQuickAdd: true})
  }  

  renderAddMilkView() {
    return <View style={[styles.addMilkViewStyle,{flexDirection:'row'}]}>
      <View>
        <Text allowFontScaling={false} style={[styles.addMilkTextStyle,{color:this.textColor}]}>{I18n.t('virtual_freezer.add_milk')}</Text>
        <View style={styles.quickAddViewStyle}>
          <View>
            <AddIcon width={65} height={65} onPress={() => {
             this.showQuickAddModal()
            }}/>
            <Text allowFontScaling={false} style={[styles.quickTextStyle,{color:this.textColor}]}>{I18n.t('virtual_freezer.quick')}</Text>
          </View>
          <View style={{marginLeft: 15}}>
            <ActivePumpingIcon width={65} height={65} onPress={() => {
              this.props.navigation.navigate('BreastFeedingPumpingScreen', {
                saveToVirtualStorage:true,
                isPumping:true,
                isSiriNameReturned:true
              })
            }} fill={Colors.rgb_efdae3}/>
            <Text allowFontScaling={false} style={[styles.quickTextStyle,{color:this.textColor}]}>{I18n.t('virtual_freezer.pumping')}</Text>
          </View>
        </View>
      </View>
      <View style={{marginLeft: 15}}>
        <View>
          <Text allowFontScaling={false} style={[styles.moveMilkTextStyle,{color:this.textColor}]}>{I18n.t('virtual_freezer.feed_milk')}</Text>
          <BottleIcon style={styles.quickTextStyle} width={65} height={65} onPress={() => {
            this.props.navigation.navigate('BottleTrackingScreen',{isFreezerTracking:true})
          }}/>
          <Text allowFontScaling={false} style={[styles.quickTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.bottle')}</Text>
        </View>
      </View>
    </View>
  }


  render() {
    const {isCheckInventory} = this.state
    return (
      <>
        {this.renderHeader()}
        <View style={styles.container}>
          <VirtualInventory {...this.props} parentStyle={{marginHorizontal: 20}} isBottleTracking={false} title={I18n.t('breastfeeding_pump.freezer_title')}
                            inventoryData={(inventoryItems) => {
                              this.setState({inventoryItems})
                            }}/>
          {!isCheckInventory && this.renderAddMilkView()}
          {!isCheckInventory && this.renderMoveMilkView()}
          {this.renderQuickAddModal()}
          <Dialog
            visible={this.state.showCongratsPopup}
            title={I18n.t('virtual_freezer.notification_title1')}
            message={I18n.t('virtual_freezer.notification_description1')}
            positive={I18n.t('login.ok')}
            isIcon={false}
            positiveOnPress={() => {
              this.setState({ showCongratsPopup: false})
            }}
            onDismiss={() => {
            }}
          />
        </View>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  themeSelected: state.app.themeSelected,
  isInternetAvailable: state.app.isInternetAvailable,
  createBottleResponse: state.home.createBottleResponse,
  createBottleApiSuccess: state.home.createBottleApiSuccess,
  createBottleApiFailure: state.home.createBottleApiFailure,
});

const mapDispatchToProps = (dispatch) => ({
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
});


export default connect(mapStateToProps, mapDispatchToProps)(FreezerTrackingScreen);
