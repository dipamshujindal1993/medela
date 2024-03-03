import React from 'react';
import {BackHandler, Platform, Text, View} from 'react-native';
import styles from './Styles/EditVirtualFreezerStyles';
import Colors from "../Resources/Colors";
import I18n from '@i18n';
import CustomTextInput from "./CustomTextInput";
import {getVolumeMaxValue, getVolumeUnits, volumeConversionHandler} from "@utils/locale";
import CustomVolumeSlider from "../Components/CustomVolumeSlider";
import Button from "@components/Button";
import HeaderTrackings from "../Components/HeaderTrackings";
import HomeActions from '@redux/HomeRedux';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "../Utils/KeyUtils";
import {deleteFreezerFromDb, saveVirtualFreezerDatabase} from "../Database/VirtualFreezerDatabase";
import {appendTimeZone, uuidV4} from "@utils/TextUtils";
import {createTrackedItem} from "@database/TrackingDatabase";
import Toast from 'react-native-simple-toast';
import NavigationService from "@services/NavigationService";
import {connect} from "react-redux";
import VirtualInventoryItem from "./VirtualInventoryItem";
import LoadingSpinner from "./LoadingSpinner";
import {getRealmDb} from "../Database/AddBabyDatabase";
import CustomMeasurementView from "./CustomMeasurementView";
import PushNotification from "react-native-push-notification";

class EditVirtualFreezerInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showeditInventory: false,
      showQuickAdd: false,
      freezerItems: this.props.navigation.state.params.data,
      volumeCount: 0,
      containerType: -1, // 1: Bottle 2: Bag
      location: -1, //  1: Fridge 2: Freezer
      fridgeSelected: 0,
      bottleSelected: 0,
      number: '',
      tray: '',
      bottleBagNumber: -1,
      noteTextInput: '',
      trayNumber: '',
      isFrom: this.props.navigation.state.params.isFrom,
      bottleviewstate: this.props.navigation.state.params.bottleviewstate != undefined ? this.props.navigation.state.params.bottleviewstate : [],
      volumeUnit: '',
      maxVolumeValue: 0,
      sliderMaxValue:0,
      isSliderLoadingDone:false,
      isFocus:false,
      sliderValue:0,
      disableButton:false
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected 
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.badSessionIndex = 0
  }

  componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    Promise.all([getVolumeUnits(), getVolumeMaxValue()]).then((values) => {
      this.setState({volumeUnit: values[0], maxVolumeValue: values[1]})
    });
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        const {amount, unit} = this.props.navigation.state.params.data
        const {
          convertedVolume,
          convertedVolumeUnit
        } = volumeConversionHandler(_units === KeyUtils.UNIT_IMPERIAL, unit, amount);
        let sliderMaxValue = this.state.isFrom === 'bottleTracking' ? convertedVolume : this.state.maxVolumeValue
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL, volumeCount: convertedVolume,sliderValue:convertedVolume,sliderMaxValue}, () => {
        })
      }
    })
  }


  _handleBack = () => {
    const {navigation} = this.props
    this.setState({disableButton:false})
    if (this.state.isFrom === 'bottleTracking') {
      navigation.popToTop()
      setTimeout(() => {
        AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName) => {
          if (tabName != null) {
            NavigationService.navigate(tabName)
          } else {
            NavigationService.navigate('Baby')
          }
        })
      })
    } else {
      navigation.goBack()
    }
  }

  onAndroidBackPress = () => {
    this._handleBack()
    return true;
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {
      trackingApiSuccess,
      trackingApiFailure,
      createBottleResponse,
      getFreezerInventoryApiResponse,
      trackingResponse,
      createBottleApiSuccess,
      deleteFreezerInventoryApiSuccess
    } = this.props
    if (this.state.isFrom === 'bottleTracking') {

      if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
        this.props.deleteFreezerInventoryApi(this.state.freezerItems.id)
      }
      if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
        this.setState({isLoading: false})
      }
      if (deleteFreezerInventoryApiSuccess != prevProps.deleteFreezerInventoryApiSuccess && deleteFreezerInventoryApiSuccess  &&  prevState.isLoading) {
        AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, (err, result) => {
          let records = result !== null ? JSON.parse(result) : []
          let result1 = records.filter((e) => {
            if(e.recordId === this.state.freezerItems.id){
              console.log('notification id',e.recordId)
              PushNotification.cancelLocalNotifications({ id: e.notifId });
            }
            return e.recordId !== this.state.freezerItems.id
          })
          AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, JSON.stringify(result1))
        })
        AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, (err, result) => {
          let records = result !== null ? JSON.parse(result) : []
          let result1 = records.filter((e) => {
            if(e.recordId === this.state.freezerItems.id){
              console.log('notification id 1',e.recordId)
              PushNotification.cancelLocalNotifications({ id: e.notifId });
            }
            return e.recordId !== this.state.freezerItems.id
          })
          AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, JSON.stringify(result1))
        })
        this.useBottleTrackingDataApi(this.trackingObj.id)
        this.setState({isLoading:false})
        deleteFreezerFromDb(this.state.freezerItems.id).then((result) => {
        })
        setTimeout(() => {this._handleBack()}, 1000)      
      }

      if (createBottleResponse != prevProps.createBottleResponse && prevState.isLoading) {
        console.log('delete Inventory---->>>>>>',this.state.freezerItems.id,createBottleResponse)
        //this.props.deleteFreezerInventoryApi(this.state.freezerItems.id)
        //this.saveEditFreezerDataInDB(true, false)
      }
      if (getFreezerInventoryApiResponse != prevProps.getFreezerInventoryApiResponse) {
        this.setState({isLoading:false})
      }

    } else {
      if (createBottleApiSuccess != prevProps.createBottleApiSuccess && createBottleApiSuccess  && prevState.isLoading) {
        this.saveEditFreezerDataInDB(true, false)
        this.callTrackingApi()
      }
      if (trackingApiSuccess != prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading) {
        this.saveTrackingInDb(true)
        this.props.navigation.pop()

      }
      if (trackingApiFailure != prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading) {
        this.setState({isLoading: false})
        this.props.navigation.pop()
      }
    }
  }

  handleVolumeChangeValue = (value) => {
    this.setState({
      volumeCount: value,
    });
  };

  renderHeader() {
    const {navigation} = this.props
    return <HeaderTrackings
      hideCalendarNBaby={this.state.isFrom === 'virtualFreezer'}
      title={I18n.t('bottle_tracking.virtual_freezer')}
      onPressBaby={() => this.setState({showBabyList: true})}
      onBackPress={() => navigation.goBack()}
      onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
      navigation={navigation}
      getSelectedDate={(value) => this.setState({selectedDate: value})}/>
  }

  async editFreezerDataApi(isSync) {
    const {isInternetAvailable,navigation,createBottleApi}=this.props
    const {data} = navigation.state.params
    let volumeTotal=parseFloat(this.state.volumeCount)
    let apiObj = {...data}
    apiObj.amount = volumeTotal
    apiObj.unit = this.state.volumeUnit
    this.setState({disableButton:true})
    this.saveEditFreezerDataInDB(isSync, false)
    //TODO
    let bottleData = Object.assign({milkInventories: [apiObj]});
    this.setState({isLoading:true})
    createBottleApi(bottleData)
  }

  async  callTrackingApi(){
    const {data} = this.props.navigation.state.params
    let volumeTotal=parseFloat(this.state.volumeCount)
    let realmDb=await getRealmDb()
    let myItems = realmDb.objects('Tracking');
    let arr = JSON.parse(JSON.stringify(myItems))

    let items=arr.find((e)=>{
      return e.id==data.createdFrom
    })
    if (items!=undefined){
      const{id,babyId,trackingType,trackAt,quickTracking,confirmed,isBadSession,lastBreast,durationTotal,
        durationLeft,durationRight,savedMilk,pumpRecordId,inventory}=items
      inventory.amount=volumeTotal
      inventory.unit=this.state.volumeUnit
      this.trackingObj={
        id,
        babyId,
        trackingType,
        trackAt,
        quickTracking,
        confirmed,
        isBadSession,
        lastBreast,
        durationTotal,
        durationLeft,
        durationRight,
        amountTotal:volumeTotal,
        amountTotalUnit:this.state.volumeUnit,
        amountLeft:volumeTotal/2,
        amountLeftUnit:this.state.volumeUnit,
        amountRight:volumeTotal/2,
        amountRightUnit:this.state.volumeUnit,
        savedMilk,

      }
      let inventoryObj=JSON.parse(JSON.stringify(inventory))
      if (inventoryObj.hasOwnProperty('isDeleted')){
        delete inventoryObj.isDeleted
      }
      if (inventoryObj.hasOwnProperty('userId')){
        delete inventoryObj.userId
      }
      if (inventoryObj.hasOwnProperty('isSync')){
        delete inventoryObj.isSync
      }
      this.trackingObj.inventory=inventoryObj
      if (pumpRecordId!=-1){
        const {deviceLevel,devicePattern,devicePhase,pumpId, goalTime,statusFlags}=items

        this.trackingObj.deviceLevel=deviceLevel
        this.trackingObj.devicePattern=devicePattern
        this.trackingObj.devicePhase=devicePhase
        this.trackingObj.goalTime=goalTime
        this.trackingObj.statusFlags=statusFlags
        this.trackingObj.pumpId=pumpId
      }
      let json = {
        trackings: [JSON.parse(JSON.stringify(this.trackingObj))],
      };
      console.log('json--------',json)

      const {isInternetAvailable, trackingApi} = this.props
      if (isInternetAvailable) {
        this.setState({isLoading: true});
        trackingApi(json);
      }else{
        this.saveTrackingInDb(false)
      }
    }
    else{
      this.props.navigation.pop()
    }
  }
  async saveEditFreezerDataInDB(isSync, isPop) {
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    const {isInternetAvailable,navigation,createBottleApi}=this.props
    const {data} = navigation.state.params
    let apiObj = {...data}
    apiObj.amount = parseFloat(this.state.volumeCount)
    apiObj.unit = this.state.volumeUnit
    apiObj.isSync=isSync
    apiObj.isDeleted=false
    apiObj.userId=userName
    console.log('bottleData db', JSON.stringify(apiObj))
    let realmDb = await getRealmDb()
    saveVirtualFreezerDatabase(realmDb, apiObj).then((r) => {
      if (isPop) {
        this.props.navigation.pop()
      }
    })
  }

  async useBottleTrackingDataApi(uuid) {
    const {
      movedAt,
      containerType,
      location,
      number,
      tray,
      createdFrom,
      expireAt,
      trackingMethod,
      trackAt,
      id
    } = this.state.freezerItems
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    let isDeleted = this.state.isFrom === 'bottleTracking' ? true : false

    let apiObj = {
      id: id,
      trackingMethod: trackingMethod,
      trackAt: trackAt,
      location: location,
      tray: parseInt(tray),
      containerType: containerType,         // 1: Bottle, 2: Bag
      number: parseInt(number),         // container number
      amount: parseFloat(this.state.volumeCount),
      unit: this.state.volumeUnit,      // oz, ml
      createdFrom: createdFrom,      // optional: UUID of the pump tracking if Pump Added inventory
      isConsumed: true,
      consumedBy: uuid,
      consumedAt: this.trackingObj.trackAt,
      isExpired: false,
      expireAt: expireAt,
      movedAt: movedAt,
    };

    let obj=JSON.parse(JSON.stringify(apiObj))
    obj.userId=userName
    obj.isSync=false
    obj.isDeleted=isDeleted

    this.trackingObj.inventory = obj
    this.saveTrackingInDb(true)
    let bottleData = Object.assign({milkInventories: [apiObj]});
    const{createBottleApi}=this.props
    let realmDb = await getRealmDb()
    saveVirtualFreezerDatabase(realmDb, obj).then((r) => {
    //  let bottleData = Object.assign({milkInventories: [apiObj]});
     // createBottleApi(bottleData)
    })
  }


  async handleValidations() {
    const {babies, selected_baby} = this.props
    const {noteTextInput, volumeUnit,selectedDate} = this.state
    const {babyId} = selected_baby
    this.setState({disableButton:true})
    if (babies && babies.length > 0) {
      let formattedDate = await appendTimeZone(selectedDate)
      this.trackingObj = {
        "amountTotal": parseFloat(this.state.volumeCount),
        "amountTotalUnit": volumeUnit,
        "babyId": babyId,
        "isBadSession": false,
        "confirmed": true,
        "feedType": 4,
        "remark": noteTextInput.toString().trim(),
        "quickTracking": false,
        "trackAt": formattedDate,
        "id": uuidV4(),
        "savedMilk":true,
        "trackingType": KeyUtils.TRACKING_TYPE_BOTTLE
      }
      console.log('tracking api object', JSON.stringify(this.trackingObj))
      let json = {
        trackings: [this.trackingObj],
      };
      const {isInternetAvailable, trackingApi} = this.props
      if (isInternetAvailable) {
        this.setState({isLoading: true});
        trackingApi(json);
      } else {
        this.saveTrackingInDb(false)
      }
    }
  }

  saveTrackingInDb(isSync) {
    this.trackingObj.isSync = isSync
    this.trackingObj.userId = this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r) => {
      Toast.show(I18n.t("tracking.tracking_toaster_text"), Toast.SHORT);
      if (this.state.isFrom === 'bottleTracking'){
        this._handleBack()
      }

    })
  }


  renderNoteView() {
    const {noteTextInput} = this.state
    return <CustomTextInput
      maxLength={1000}
      maxHeight={50}
      textContentType="familyName"
      onChangeText={(index, value) => this.setState({noteTextInput: value})}
      value={noteTextInput}
      placeholder={I18n.t('bottle_tracking.add_note')}
      placeholderTextColor={this.textColor}
      textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
      multiline={true}
      enableDoneButton={true}/>
  }



  renderBottomView() {
    const {containerType, location, tray, number} = this.props.navigation.state.params.data
    return <View style={styles.cancelSaveView}>
      <Button
        title={I18n.t('generic.cancel').toUpperCase()}
        textStyle={styles.cancelTextStyle}
        onPress={() => this.props.navigation.pop()}
        style={styles.cancelButtonStyles}/>
      <Button
        disabled={containerType === -1 || location === -1 || tray === '' || number == '' || this.state.volumeCount == ''|| this.state.disableButton}
        title={I18n.t('generic.save').toUpperCase()}
        textStyle={styles.saveTextStyle}
        style={styles.saveButtonStyles}
        onPress={() => {
          if (this.props.isInternetAvailable) {
            this.state.isFrom === 'bottleTracking' ? this.handleValidations() : this.editFreezerDataApi(false)
          } else {
            this.state.isFrom === 'bottleTracking' ? this.handleValidations() : this.saveEditFreezerDataInDB(false, true)
          }
        }}
      />
    </View>
  }
  nearestMaxValue=(maxValue,multiplicity)=>{
    let temp=0;
    while (temp<maxValue) {
      temp+=multiplicity;
    }
    return temp;
  }
  render() {
    const {unit, containerType, location, amount} = this.props.navigation.state.params.data
    const {isFrom, isLoading,isImperial,maxVolumeValue,volumeCount,sliderMaxValue,volumeUnit,isFocus,isSliderLoadingDone,sliderValue} = this.state
    const {
      convertedVolume,
      convertedVolumeUnit
    } = volumeConversionHandler(isImperial, unit, amount);

    let multiplicityValue = 10
    convertedVolumeUnit==='oz' && (multiplicityValue = 1)
    return <View style={{flex: 1}}>
      {this.renderHeader()}
      {isLoading && <LoadingSpinner/>}

      <View style={{marginHorizontal: 10}}>
        <VirtualInventoryItem
          item={this.props.navigation.state.params.data}
          isEditVirtualInventory={true}
          isImperial={isImperial}
          editStyle={{alignSelf: 'center'}}/>
      </View>

      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.volumeTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_pump.total_volume')}</Text>
          {((location === 1 && containerType === 1) || this.state.isFrom === 'bottleTracking') &&
          <View style={{height: 130}}>
            <CustomVolumeSlider
              multiplicity={multiplicityValue}
              maxSliderValue={this.nearestMaxValue(sliderMaxValue,multiplicityValue)}
              restrictPoint={sliderMaxValue}
              changeValue={this.handleVolumeChangeValue}
              range={unit==='oz'?5:50}
              onScrollBeginDrag={()=>{
                if(this.nameRef.isFocused()){
                  this.nameRef.blur();
                }
              }}
              value={isSliderLoadingDone?sliderValue:0}
              decimalPlaces={unit==='oz'?2:0}
              accuracy={true}
              isLoadingComplete={(isSliderLoadingDone)=>{this.setState({isSliderLoadingDone})}}
              numberColor={this.textColor}
            />
          </View>
          }

          {((location === 1 && containerType === 1) || this.state.isFrom === 'bottleTracking') ?
            <View style={styles.volumeEditableViewStyle}>
              <CustomMeasurementView
                //value={volumeCount}
                maxValue={sliderMaxValue}
                editable={true}
                // textInputValue={(value) =>{
                //   let val=parseFloat(value==''?0:value);
                //   this.setState({volumeCount: val>sliderMaxValue?sliderMaxValue:val})
                // }}
                units={I18n.t(`units.${volumeUnit.toLowerCase()}`)}
                textInputValue={(value)=>{
                  let temp=parseFloat(value==''||value==undefined?0:value);
                  //this.setState({sliderValue: val>sliderMaxValue?isNaN(sliderMaxValue)?0:sliderMaxValue:isNaN(val)?0:val})
                  this.setState({sliderValue:isNaN(temp)?0:temp})
                }}
                onBlur={()=>{
                  this.setState({isFocus:false})
                }}
                onFocus={()=>{
                  this.setState({isFocus:true,sliderValue:volumeCount})
                }}
                inputRef={(input)=>{ this.nameRef = input }}
                value={!isSliderLoadingDone?'0':isFocus?sliderValue+'':volumeCount+''}
              />
            </View>:

            <View style={styles.volumeCountView}>
              <Text maxFontSizeMultiplier={1.7}
                    style={[styles.volumeCountTextStyles,{color:this.textColor}]}>{`${this.state.volumeCount} ${volumeUnit}`}</Text>
            </View>
          }
          <View style={styles.expNoteView}>
            {isFrom !== 'virtualFreezer' && this.renderNoteView()}
          </View>
        </View>
        {((location === 1 && containerType === 1) || isFrom === 'bottleTracking') && this.renderBottomView()}
      </View>

    </View>
  }

}

const mapStateToProps = (state) => ({
  isInternetAvailable: state.app.isInternetAvailable,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  trackingResponse: state.home.trackingResponse,
  selected_baby: state.home.selected_baby,
  themeSelected: state.app.themeSelected,
  createBottleResponse: state.home.createBottleResponse,
  createBottleApiSuccess:state.home.createBottleApiSuccess,
  deleteFreezerInventoryApiSuccess: state.home.deleteFreezerInventoryApiSuccess

})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
  deleteFreezerInventoryApi: (id) => dispatch(HomeActions.deleteFreezerInventoryApi('/inventoryId/' + id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditVirtualFreezerInventory);

