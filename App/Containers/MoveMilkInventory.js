import React, { Component } from 'react'
import {Modal, Text, View, TouchableOpacity } from 'react-native'
import styles from './Styles/MoveMilkInventoryStyles'
import { connect } from "react-redux";
import HeaderTrackings from "../Components/HeaderTrackings";
import I18n from "react-native-i18n";
import VirtualFreezer from "../Components/VirtualFreezer";
import AddIcon from '@svg/ic_quick_add';
import RightArrowIcon from '@svg/ic_right_arrow';
import ActivePumpingIcon from '@svg/pumping';
import { BlurView } from "@react-native-community/blur";
import Colors from "../Resources/Colors";
import Button from "@components/Button";
import { saveVirtualFreezerDatabase } from "../Database/VirtualFreezerDatabase";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "../Utils/KeyUtils";
import { uuidV4 } from "../Utils/TextUtils";
import moment from "moment";
import { SwipeListView } from "react-native-swipe-list-view";
import BottleIcon from '@svg/ic_btl'
import BagIcon from '@svg/ic_bag'
import Expired from '@svg/expired'
import CustomOptionSelector from "../Components/CustomOptionSelector";
import VirtualSwiperList from "../Components/VirtualSwiperList";
import CustomVolumeSlider from "../Components/CustomVolumeSlider";
import {getVolumeMaxValue, getVolumeUnits, volumeConversionHandler} from "@utils/locale";
import HomeActions from '@redux/HomeRedux';
import { getMilkAge } from "../Utils/TextUtils";
import EditIcon from '@svg/ic_edit_photo'
import Active from '@svg/check';
import Inactive from '@svg/uncheck';
import Dialog from '@components/Dialog';
import LoadingSpinner from '@components/LoadingSpinner'
import VirtualInventoryItem from "@components/VirtualInventoryItem";
import VirtualInventory from "../Components/VirtualInventory";
import EmptyTrackingTypeIcon from '@svg/ic_empty_export_list';
import { milkExpiredNotification } from '@components/Notifications';
import PushNotification from "react-native-push-notification";
import { Analytics } from '@services/Firebase';
import { getRealmDb } from '../Database/AddBabyDatabase';
import { Constants } from '../Resources';

let analytics = new Analytics()
const fridgeFreezerListOption = [{
  label: I18n.t('bottle_tracking.all'),
  value: 0,
}, {
  label: I18n.t('bottle_tracking.bottle'),
  value: 1,
}, {
  label: I18n.t('bottle_tracking.bag'),
  value: 2,
}];


class MoveMilkInventoryScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showQuickAdd: false,
      freezerItems: [],
      selectedIndex: -1,
      volumeCount: '',
      containerType: -1, // 1: Bottle 2: Bag
      location: -1, //  1: Fridge 2: Freezer
      fridgeSelected: 0,
      bottleSelected: 0,
      number: '',
      tray: '',
      bottleBagNumber: -1,
      trayNumber: '',
      isCheckInventory: false,
      moveToFreezerAlert: false,
      moveToFridgeAlert: false,
      moveToFreezerAgainAlert: false,
      isLoading: false,
      volumeUnit:'',


    }
    this.userName = ''
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    getVolumeUnits().then((unit)=>{
      this.setState({volumeUnit:unit})
    })
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL})
      }
    })
   this.callFreezerInventoryApi()
    await analytics.logScreenView('move_milk_inventory_screen')
  }

  async callFreezerInventoryApi() {
      let {inventoryItems}=this.props.navigation.state.params
      this.userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
      let realmDb = await getRealmDb()
      let myItems = realmDb.objects('VirtualFreezerSchema');
      console.log('freezerItems---', inventoryItems)
      let arr = JSON.parse(JSON.stringify(inventoryItems))
      arr = arr.filter((e) => {
        return new Date(e.expireAt) > new Date()
      })
      this.setState({ realmDb, freezerItems: arr })
  }


  renderHeader() {
    const { navigation } = this.props
    return <HeaderTrackings
      title={I18n.t('bottle_tracking.virtual_freezer')}
      hideCalendarNBaby={true}
      onBackPress={() => navigation.goBack()}
      onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
      navigation={navigation}
      getSelectedDate={(value) => this.setState({ selectedDate: value })} />
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

    const { createBottleResponse, getFreezerInventoryApiResponse, getFreezerInventoryApiFailure, createBottleApiSuccess,createBottleApiFailure } = this.props

    if ( prevProps.createBottleApiSuccess != createBottleApiSuccess && createBottleApiSuccess &&  prevState.isLoading) {
        this.setState({isLoading:false})
        this.saveFreezerPumpAddDataInDB(true)
        this.props.navigation.pop()
        try{
          AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, (err, result) => {
            let records = result !== null ? JSON.parse(result) : []
            let result1 = records.filter((e) => {
              if(e.recordId === this.state.freezerItems[this.state.selectedIndex].id){
                PushNotification.cancelLocalNotifications({ id: e.notifId });
              }
              return e.recordId !== this.state.freezerItems[this.state.selectedIndex].id
            })
            AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, JSON.stringify(result1))
          })
          AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, (err, result) => {
            let records = result !== null ? JSON.parse(result) : []
            let result1 = records.filter((e) => {
              if(e.recordId === this.state.freezerItems[this.state.selectedIndex].id){
                PushNotification.cancelLocalNotifications({ id: e.notifId });
              }
              return e.recordId !== this.state.freezerItems[this.state.selectedIndex].id
            })
            AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, JSON.stringify(result1))
          })
          milkExpiredNotification(this.state.freezerItems[this.state.selectedIndex])
        }catch (e) {

        }
  }
    if ((prevProps.createBottleApiFailure != createBottleApiFailure) && createBottleApiFailure && prevState.isLoading) {
      this.setState({
        isLoading: false, refreshing: false, noMoreFound: true
      });
    }

    if (getFreezerInventoryApiResponse != prevProps.getFreezerInventoryApiResponse && prevState.isLoading) {
      console.log('move freezer', JSON.stringify(getFreezerInventoryApiResponse))
     let arr = getFreezerInventoryApiResponse.filter((e) => {
        return new Date(e.expireAt) > new Date()
      })
      this.setState({ freezerItems: arr,isLoading:false })
    }
    if ((prevProps.getFreezerInventoryApiFailure != getFreezerInventoryApiFailure) && getFreezerInventoryApiFailure && prevState.isLoading) {
      this.setState({
        isLoading: false,
      });
    }

  }

  async saveFreezerPumpAddDataApi() {
    let item= this.state.freezerItems[this.state.selectedIndex]
    let newLocation= item.location == 1 ? 2 : 1
    let expireAt = newLocation == 1 ? moment().add(1, 'day').format() : moment().add(6, 'months').format()

    item.location=newLocation
    item.expireAt=expireAt
    item.movedAt=moment().format()

    this.movingObj=item

    this.saveFreezerPumpAddDataInDB(false)
    if(this.props.isInternetAvailable) {
      this.setState({isLoading:true})
      let bottleData = Object.assign({ milkInventories: [item] });
      this.props.createBottleApi(bottleData)
    }else{
      this.props.navigation.pop()
    }
  }

  async saveFreezerPumpAddDataInDB(isSync) {
    const item = this.movingObj
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
    item.isDeleted=false
    item.userId=userName
    item.isSync=isSync
    item.isMoved=true
    const  realmDb = await getRealmDb()
    saveVirtualFreezerDatabase(realmDb, item).then((r) => {
    })
  }


  MoveToFreezerDialog() {
    const { moveToFreezerAlert } = this.state
    return (
      <Dialog
        visible={moveToFreezerAlert}
        title={I18n.t('moveTo_freezer_popup.title')}
        positive={I18n.t('moveTo_freezer_popup.ok')}
        negative={I18n.t('moveTo_freezer_popup.cancel')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({ moveToFreezerAlert: false })
        }}
        positiveOnPress={async() => {
          let param = {
            'interaction':'move_from_fridge_to_freezer',
          }
          await analytics.logEvent(Constants.VIRTUAL_FREEZER, param); // Firebase event for Users moving milk from fridge to freezer
          this.setState({ moveToFreezerAlert: false })
          this.saveFreezerPumpAddDataApi()
        }}

        onDismiss={() => {
        }}
      />
    )
  };

  MoveToFridgeDialog() {
    const { moveToFridgeAlert } = this.state
    return (
      <Dialog
        visible={moveToFridgeAlert}
        title={I18n.t('moveTo_fridge_popup.title')}
        positive={I18n.t('moveTo_fridge_popup.ok')}
        negative={I18n.t('moveTo_fridge_popup.cancel')}

        isIcon={false}
        negativeOnPress={() => {
          this.setState({ moveToFridgeAlert: false })
        }}
        positiveOnPress={async() => {
          let param = {
            'interaction':'move_from_freezer_to_fridge',
          }
          await analytics.logEvent(Constants.VIRTUAL_FREEZER, param); // Firebase event for Users moving milk from freezer to fridge
          this.setState({ moveToFridgeAlert: false })
          this.saveFreezerPumpAddDataApi()
        }}

        onDismiss={() => {
        }}
      />
    )
  };

  MoveToFreezerAgainDialog() {
    const { moveToFreezerAgainAlert } = this.state
    return (
      <Dialog
        visible={moveToFreezerAgainAlert}
        title={I18n.t('moveTo_freezer_again.title')}
        positive={I18n.t('moveTo_freezer_again.ok')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({ moveToFreezerAgainAlert: false })
        }}
        positiveOnPress={() => {
          this.setState({ moveToFreezerAgainAlert: false })
        }}

        onDismiss={() => {
        }}
      />
    )
  };

  renderListEmptyView = () => {
    return (
      <View style={styles.listEmptyView}>
        <EmptyTrackingTypeIcon width={110} height={100}/>
        <Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:this.textColor}]}>{I18n.t('stats_screen.empty_list_today_message')}</Text>
      </View>
    )
  }

  render() {
    const { ListFooterComponent, style } = this.props
    const { fridgeSelected, freezerItems, selectedIndex, trayNumber } = this.state
    const movedAt =selectedIndex !== -1 ? freezerItems.length>0? freezerItems[selectedIndex].movedAt :"":''
    let items = freezerItems
    if (items.length>0) {
      items = items.sort(function (a, b) {
        return new Date(b.trackAt) - new Date(a.trackAt);
      });
    }
    let location = selectedIndex !== -1 ?freezerItems[selectedIndex].location === 1 ? I18n.t('breastfeeding_pump.freezer') : I18n.t('breastfeeding_pump.fridge') : null

    return (
      <>
        {this.renderHeader()}
        <View style={styles.container}>
           {/*<VirtualSwiperList
             {...this.props}
             inventoryData={(inventoryItems)=>{
               this.setState({freezerItems:inventoryItems})
             }}
             isMoving={true}
             selectedIndex={this.state.selectedIndex}
             checkBoxSelectedIndex={(index)=>this.setState({selectedIndex:index})}
            />*/}

          <SwipeListView
            showsVerticalScrollIndicator={false}
            disableRightSwipe
            disableLeftSwipe={true}
            data={items}
            ListEmptyComponent={this.renderListEmptyView}
            renderHiddenItem={(data, rowMap) => (
              <View >
                <Text maxFontSizeMultiplier={1.7}/>
              </View>
            )}
             renderItem={({item,index})=><VirtualInventoryItem
              item={item}  index={index} isMoving={true}
              selectedIndex={this.state.selectedIndex}
              checkBoxSelectedIndex={(index)=>this.setState({selectedIndex:index})}
              isImperial={this.state.isImperial}
              isCheckInventory={this.props.isCheckInventory}/>
            }
            ListFooterComponent={ListFooterComponent ? ListFooterComponent : null}
            onSwipeValueChange={this.onSwipeValueChange}
          />
          {this.state.selectedIndex !== -1 &&
            <View style={styles.cancelSaveView}>
              <Button title={I18n.t('generic.cancel').toUpperCase()} textStyle={styles.cancelTextStyle}
                onPress={() => this.setState({ selectedIndex: -1 })}
                style={styles.cancelButtonStyles} />
              <Button
                //disabled={containerType===-1 || location===-1 || tray==='' || number=='' || volumeCount=='' }
                title={`${I18n.t('breastfeeding_pump.move_to')} ${location}`} textStyle={styles.saveTextStyle} onPress={() => {
                  console.log(location,movedAt)

                  { location === I18n.t('breastfeeding_pump.fridge') ? this.setState({ moveToFridgeAlert: true }) : movedAt == "" ? this.setState({ moveToFreezerAlert: true }) : this.setState({ moveToFreezerAgainAlert: true }) }
                }}
                style={[styles.saveButtonStyles, { opacity: 1 }]} />
            </View>
          }
          {this.state.moveToFreezerAgainAlert && this.MoveToFreezerAgainDialog()}
          {this.state.moveToFridgeAlert && this.MoveToFridgeDialog()}
          {this.state.moveToFreezerAlert && this.MoveToFreezerDialog()}
          {this.state.isLoading && <LoadingSpinner />}
        </View>
      </>
    )
  }
}


const mapStateToProps = (state) => ({
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  themeSelected: state.app.themeSelected,
  createbottleResponse: state.home.createbottleResponse,
  createBottleApiResponse: state.home.createBottleApiResponse,
  getFreezerInventoryApiResponse: state.home.getFreezerInventoryApiResponse,
  getFreezerInventoryApiFailure: state.home.getFreezerInventoryApiFailure,
  isInternetAvailable: state.app.isInternetAvailable,
  createBottleApiFailure:state.home.createBottleApiFailure,
  createBottleApiSuccess:state.home.createBottleApiSuccess


});

const mapDispatchToProps = (dispatch) => ({
  getTrackingApi: (startDate, endDate, babyId, page, perPage) => dispatch(HomeActions.getTrackingApi(startDate, endDate, babyId, page, perPage)),
  getMotherTrackingApi: (startDate, endDate, page, perPage) => dispatch(HomeActions.getMotherTrackingApi(startDate, endDate, page, perPage)),
  deleteTrackingApi: (trackingId, babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId, babyId)),
  deleteMotherTrackingApi: (trackingId) => dispatch(HomeActions.deleteMotherTrackingApi(trackingId)),
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
  getFreezerInventoryApi: () => dispatch(HomeActions.getFreezerInventoryApi(1, 10))
});

export default connect(mapStateToProps, mapDispatchToProps)(MoveMilkInventoryScreen);
