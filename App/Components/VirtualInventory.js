import React, {Component} from 'react'
import {RefreshControl, Text, View} from 'react-native'
import styles from './Styles/VirtualInventoryStyles'
import {connect} from "react-redux";
import CustomOptionSelector from "@components/CustomOptionSelector";
import VirtualSwiperList from "@components/VirtualSwiperList";
import LoadingSpinner from '@components/LoadingSpinner'
import I18n from "react-native-i18n";
import VirtualFreezer from "../Components/VirtualFreezer";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {getVolumeMaxValue, getVolumeUnits} from "@utils/locale";
import HomeActions from '@redux/HomeRedux';
import {volumeConversionHandler} from "../Utils/locale";
import {Colors} from '@resources';
import { getRealmDb } from '../Database/AddBabyDatabase';

class VirtualInventory extends Component {
  fridgeFreezerListOption = [{
    label: I18n.t('bottle_tracking.all'),
    value: 0,
  }, {
    label: I18n.t('bottle_tracking.bottle'),
    value: 1,
  }, {
    label: I18n.t('bottle_tracking.bag'),
    value: 2,
  }];

  constructor(props) {
    super(props)
    this.state = {
      showQuickAdd: false,
      freezerItems: [],
      volumeCount: 0,
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
    this.themeSelected=''
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected 
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getVolumeUnits(),getVolumeMaxValue()]).then((values) => {
      this.setState({unit:values[0],maxVolumeValue:values[1]})
    });
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL})
      }
    })

  }

  async callApi(page,perPage) {
    if (this.props.isInternetAvailable) {
      this.setState({isLoading: true});
      this.props.getFreezerInventoryApi(page,perPage)
    }
    else {
      this.setState({refreshing:false});
      this.userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
      let realmDb = await getRealmDb()
      let myItems = realmDb.objects('VirtualFreezerSchema');
      let arr = JSON.parse(JSON.stringify(myItems))

      arr = arr.filter((e) => {
        return !e.isDeleted && this.userName === e.userId
      })
      arr.sort(function (a, b) {
        return new Date(b.trackAt) - new Date(a.trackAt);
      });
      if (this.props.isBottleTracking){
        arr=arr.filter((e)=>{
          return new Date(e.expireAt) > new Date()
        })
      }
      this.setState({realmDb, freezerItems: arr})

    }
  }

  componentWillUnmount() {
    this.focusListener && this.focusListener.remove();
  }

  renderVirtualFreezerList() {
    const {defaultBottleSelectedIndex,unit,isImperial,freezerItems,fridgeSelected,bottleSelected,trayNumber} = this.state
    const {isBottleTracking,inventoryItems,inventoryData} = this.props
    let items = JSON.parse(JSON.stringify(freezerItems))
    if (items.length > 0) {
      items.sort(function (a, b) {
        return new Date(b.trackAt) - new Date(a.trackAt);
      });
    }
    if (fridgeSelected > 0) {
      items = items.filter((e) => {
        return e.location === fridgeSelected
      })
    }
    if (bottleSelected !== 0 && bottleSelected !== undefined) {
      items = items.filter((e) => {
        return e.containerType === bottleSelected
      })
    }
    if (trayNumber !== '' && trayNumber !== undefined) {
      items = items.filter((e) => {
        return e.tray == trayNumber
      })
    }
    if (isBottleTracking){
      items=items.filter((e)=>{
        return new Date(e.expireAt) > new Date()
      })
    }
    let count = items && items.reduce(function (accumulator, currentValue) {
      const {convertedVolume} = volumeConversionHandler(isImperial, currentValue.unit, currentValue.amount);
      return accumulator + convertedVolume;
    }, 0)

    return <View style={styles.bottleBagFilterViewStyle}>
      {isBottleTracking ?
        <Text maxFontSizeMultiplier={1.3} style={[styles.totalCountTextStyle,{color:this.textColor}]}>{`${I18n.t('bottle_tracking.virtual_freezer')}`}</Text>
        : <Text maxFontSizeMultiplier={1.3} style={[styles.totalCountTextStyle,{color:this.textColor}]}>{`${I18n.t('bottle_tracking.total')}: ${count} ${I18n.t(`units.${unit.toLowerCase()}`)}`}</Text>}

      <View style={styles.bottleBagFilterSelectorView}>
        <CustomOptionSelector
          buttonContainerStyle={styles.btnContainer}
          buttonContainerInactiveStyle={styles.btnContainerInActiveStyle}
          buttonTextInactiveStyle={styles.btnContainerTextInactive}
          buttonTextActiveStyle={[styles.btnTextActiveStyle,{color:Colors.white}]}
          data={this.fridgeFreezerListOption}
          onChange={(item,index) => {
            if (item.value > 0) {
              this.setState({bottleSelected: item.value, isClearFilter: true, defaultBottleSelectedIndex: item.value})
            } else {
              this.setState({
                bottleSelected: item.value,
                isClearFilter: this.state.fridgeSelected > 0,
                defaultBottleSelectedIndex: item.value
              })
            }
          }}
          defaultSelectedIndex={defaultBottleSelectedIndex}/>
      </View>

    </View>
  }

  onOfflineItemDeleted = (result) => {
    this.callApi(1, 10)
  }

  render() {
    const {fridgeSelected, freezerItems, bottleSelected, trayNumber, isClearFilter} = this.state
    const {parentStyle, isBottleTracking,inventoryData,title,switchButton,isCheckAvailableInventory} = this.props

    return (
      <>
        {this.state.isLoading && <LoadingSpinner/>}
        <View style={[styles.container, parentStyle]}>
          <VirtualFreezer
            title={title?title:I18n.t('breastfeeding_pump.save_to_virtual_freezer')}
            switchButton={switchButton}
            filterswitchButton={true}
            isBottleTracking={isBottleTracking}
            bottle={false}
            clearAllFiltered={() => {
              this.setState({
                fridgeSelected: -1,
                trayNumber: '',
                bottleSelected: 0,
                isClearFilter: false,
                defaultBottleSelectedIndex: 0
              })
            }}
            defaultFridgeSelected={fridgeSelected<0? -1 : (fridgeSelected-1)}
            onTrayChangedText={(trayNumber) => {
              this.setState({trayNumber})
            }}
            trayNumber={trayNumber}
            //onSwitchVauleChanged={(value)=>this.setState({isClearFilter:value})}
            onFridgeFreezerChange={(vv) => {
              if (this.state.fridgeSelected===vv){
                this.setState({fridgeSelected: -1})
              }else{
                this.setState({fridgeSelected: vv})
              }
            }}
          />
          {this.renderVirtualFreezerList()}
          <VirtualSwiperList
            {...this.props}
            trayNumber={trayNumber}
            inventoryData={(inventoryItems)=>{
              inventoryData && inventoryData(inventoryItems)
              this.setState({freezerItems:inventoryItems})
            }}
            fridgeSelected={fridgeSelected}
            bottleSelected={bottleSelected}
            style={{marginBottom: (isBottleTracking || isCheckAvailableInventory)?0:150}}
            //isLoading={this.state.isLoading}
            //data={items}
            isImperial={this.state.isImperial}
            isCheckInventory={this.state.isCheckInventory}
            onOfflineItemDeleted={this.onOfflineItemDeleted.bind(this)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                //refresh control used for the Pull to Refresh
                onRefresh={() => {
                  this.pageNumber = 1
                  this.setState({refreshing: true, noMoreFound: false})
                  this.callApi(this.pageNumber, 10)
                }
                }
              />
            }
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              console.log('onEndReached----', 'onEndReached', this.pageNumber, this.state.noMoreFound)
              if (!this.state.noMoreFound) {
                let pgNo = parseInt(items.length / 10)
                pgNo += 1
                console.log('pageNumber---', pgNo)
                if (this.pageNumber != pgNo) {
                  this.pageNumber = pgNo
                  console.log('pageNU,ber---', this.pageNumber)
                  this.callApi(this.pageNumber, 10)
                }
              }
            }}
          />
        </View>
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
  createBottleResponse: state.home.createBottleResponse,
  createBottleData:state.home.createBottleData,
  createBottleApiSuccess: state.home.createBottleApiSuccess,
  createBottleApiFailure: state.home.createBottleApiFailure,
  deleteFreezerInventoryApiResponse: state.home.deleteFreezerInventoryApiResponse,

});

const mapDispatchToProps = (dispatch) => ({
  getTrackingApi: (startDate, endDate, babyId, page, perPage) => dispatch(HomeActions.getTrackingApi(startDate, endDate, babyId, page, perPage)),
  getMotherTrackingApi: (startDate, endDate, page, perPage) => dispatch(HomeActions.getMotherTrackingApi(startDate, endDate, page, perPage)),
  deleteTrackingApi: (trackingId, babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId, babyId)),
  deleteMotherTrackingApi: (trackingId) => dispatch(HomeActions.deleteMotherTrackingApi(trackingId)),
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
  getFreezerInventoryApi: (page, perPage) => dispatch(HomeActions.getFreezerInventoryApi(page, perPage))
});

export default connect(mapStateToProps, mapDispatchToProps)(VirtualInventory);
