import React, { Component } from 'react'
import { connect } from "react-redux";
import HeaderTrackings from "@components/HeaderTrackings";
import LoadingSpinner from '@components/LoadingSpinner'
import I18n from "react-native-i18n";
import { saveVirtualFreezerDatabase} from "@database/VirtualFreezerDatabase";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import VirtualInventory from "../Components/VirtualInventory";
import { Analytics } from '@services/Firebase';
import { getRealmDb } from '../Database/AddBabyDatabase';

let analytics = new Analytics()

class CheckAvailableInventory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      freezerItems: [],
      containerType: -1, // 1: Bottle 2: Bag
      location: -1, //  1: Fridge 2: Freezer
      fridgeSelected: -1,
      bottleSelected: 0,
      number: '',
      tray: '',
      bottleBagNumber: -1,
      trayNumber: '',
      inventoryExist: false,
      isLoading: false,
      unit:'',
      maxVolumeValue:0,
      isClearFilter:false,
      defaultFridgeSelected:-1,
      defaultBottleSelectedIndex:0,
      isCheckInventory:false,
      refreshing: false,
      noMoreFound: false,
    }
    this.inventoryUUID = ''
    this.userName = ''
    this.pageNumber = 1

  }

  async saveVirtualListInDB(data){
    let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)

    for (let i = 0; i < data.length; i++) {

      let dbObj = {
        id: data[i].id,
        trackingMethod: data[i].trackingMethod, //Quick Add
        trackAt: data[i].trackAt,
        location: data[i].location,
        tray: data[i].tray,
        containerType: data[i].containerType,         // 1: Bottle, 2: Bag
        number: data[i].number,         // container number
        amount: data[i].amount,
        unit: data[i].unit,      // oz, ml
        createdFrom: data[i].createdFrom,      // optional: UUID of the pump tracking if Pump Added inventory
        isConsumed: data[i].isConsumed,
        consumedBy: data[i].consumedBy,
        consumedAt: data[i].consumedAt,
        isExpired: data[i].isExpired,
        expireAt: data[i].expireAt,
        isMoved: data[i].isMoved,
        movedAt: data[i].movedAt,
        userId: userName,
        isSync: true,
        isDeleted: false
      };

      let realmDb = await getRealmDb()
      saveVirtualFreezerDatabase(realmDb, dbObj).then((r) => {
      })

    }
  }

  async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const { getFreezerInventoryApiResponse, getFreezerInventoryApiSuccess,createBottleApiSuccess,createBottleApiFailure ,deleteFreezerInventoryApiResponse, getFreezerInventoryApiFailure} = this.props
    if (getFreezerInventoryApiSuccess != prevProps.getFreezerInventoryApiSuccess && getFreezerInventoryApiSuccess && prevState.isLoading) {
      console.log('get freezer inventory', JSON.stringify(getFreezerInventoryApiResponse))
      this.setState({ isLoading: false, refreshing: false });
      this.setState({freezerItems: this.pageNumber === 1 ? getFreezerInventoryApiResponse : prevState.freezerItems.concat(getFreezerInventoryApiResponse)})
      this.saveVirtualListInDB(getFreezerInventoryApiResponse)
    }

    if ((prevProps.getFreezerInventoryApiFailure != getFreezerInventoryApiFailure) && getFreezerInventoryApiFailure && prevState.isLoading) {
      this.setState({
        isLoading: false, refreshing: false, noMoreFound: true
      });
    }
    await analytics.logScreenView('check_available_inventory_screen')
  }

  _handleBack=()=>{
    const {navigation}=this.props
    navigation.goBack()
  }

  renderHeader() {
    const { navigation } = this.props
    return <HeaderTrackings
      title={I18n.t('bottle_tracking.virtual_freezer')}
      hideCalendarNBaby={true}
      onBackPress={() => this._handleBack()}
      onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
      navigation={navigation}
      getSelectedDate={(value) => this.setState({ selectedDate: value })} />
  }
  render() {
    return (
      <>
        {this.renderHeader()}
        {this.state.isLoading && <LoadingSpinner />}
        <VirtualInventory {...this.props} parentStyle={{marginHorizontal: 20}} isBottleTracking={false} isCheckAvailableInventory={true}
                          inventoryData={(inventoryItems) => {
                            this.setState({inventoryItems})
                          }}/>

      </>
    )
  }
}


const mapStateToProps = (state) => ({
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  themeSelected: state.app.themeSelected,
  getFreezerInventoryApiResponse: state.home.getFreezerInventoryApiResponse,
  getFreezerInventoryApiFailure: state.home.getFreezerInventoryApiFailure,
  getFreezerInventoryApiSuccess: state.home.getFreezerInventoryApiSuccess,
  isInternetAvailable: state.app.isInternetAvailable,
  createBottleApiFailure: state.home.createBottleApiFailure,
});

export default connect(mapStateToProps, null)(CheckAvailableInventory);
