import React from 'react';
import {FlatList, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import styles from './Styles/VirtualSwiperListStyles';
import Colors from "../Resources/Colors";
import I18n from '@i18n';
import Dialog from '@components/Dialog';
import HomeActions from '@redux/HomeRedux';
import {deleteFreezerFromDb, saveVirtualFreezerDatabase} from "../Database/VirtualFreezerDatabase";
import EmptyTrackingTypeIcon from '@svg/ic_empty_export_list';
import AsyncStorage from "@react-native-community/async-storage";
import { SwipeRow} from "react-native-swipe-list-view";
import {connect} from "react-redux";
import KeyUtils from "@utils/KeyUtils";
import VirtualInventoryItem from "./VirtualInventoryItem";
import {getVolumeMaxValue, getVolumeUnits} from "../Utils/locale";
import LoadingSpinner from "./LoadingSpinner";
import PushNotification from "react-native-push-notification";
import { getRealmDb } from '../Database/AddBabyDatabase';

const freezerList = [{
  title: 'Bottle',
  id: '1',
}, {
  title: 'Bag',
  id: '2',
}, {
  title: 'Bottle',
  id: '3',
}/*, {
  title: 'Bottle',
  id: '4',
}, {
  title: 'Bottle',
  id: '5',
}, {
  title: 'Bottle',
  id: '6',
}*/];


class VirtualSwiperList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canNotEditBagAndFreezerAlert: false,
      deleteId: '',
      freezerItems: [],
      volumeCount: 0,
      isLoading: false
    }
    this.inventoryUUID = ''
    this.userName = ''
    this.pageNumber = 1
    this.rows = {};
    this.listRefs = {} //
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected 
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    Promise.all([getVolumeUnits(), getVolumeMaxValue()]).then((values) => {
      this.setState({unit: values[0], maxVolumeValue: values[1]})
    });
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL})
      }
    })
    this.userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)

    const {realmDb} = this.state
    if (realmDb == null) {
      let realmDb = await getRealmDb()
      this.setState({realmDb})
    }

    this.focusListener = this.props.navigation.addListener('didFocus', async () => {
      this.setState({isCheckInventory: this.props.navigation.state.params !== undefined ? this.props.navigation.state.params.isCheckInventory : false})
      this.callApi(this.pageNumber, 10)

    })
    this.setState({isLoading: true,});
    this.callApi(this.pageNumber, 10)

  }

  callApi(page, perPage) {
    const {isInternetAvailable, getFreezerInventoryApi} = this.props
    if (isInternetAvailable) {
      const {freezerItems} = this.state
      this.setState({isLoading: true,});
      console.log('page---',page,perPage)
      if (freezerItems.length === 0) {

      }
      getFreezerInventoryApi(page, perPage)
    } else {
      this.setState({refreshing: false, isLoading: false});
      const {realmDb} = this.state
      let myItems = realmDb.objects('VirtualFreezerSchema');
      let arr = JSON.parse(JSON.stringify(myItems))
      arr = arr.filter((e) => {
        return !e.isDeleted && this.userName === e.userId
      })
      arr.sort(function (a, b) {
        return new Date(b.trackAt) - new Date(a.trackAt);
      });
      this.setState({freezerItems: arr})
    }
  }


  onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    if (value < -85 &&
      !this.animationIsRunning
    ) {
      this.animationIsRunning = true;
    }
  };


  canNotEditBagAndFreezerDialog() {
    const {canNotEditBagAndFreezerAlert} = this.state
    return (
      <Dialog
        visible={canNotEditBagAndFreezerAlert}
        title={I18n.t('can_not_edit_bag.title')}
        positive={I18n.t('can_not_edit_bag.ok')}
        isIcon={false}
        positiveOnPress={() => {
          this.setState({canNotEditBagAndFreezerAlert: false})
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  componentWillUnmount() {
    this.focusListener && this.focusListener.remove();
  }

  saveVirtualListInDB(data) {
    const {realmDb} = this.state
    data.forEach((e) => {
      let dbObj = {
        ...e,
        userId: this.userName,
        isSync: true,
        isDeleted: false
      };
      saveVirtualFreezerDatabase(realmDb, dbObj).then((r) => {
      })
    })
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {
      getFreezerInventoryApiResponse,
      getFreezerInventoryApiSuccess,
      createBottleData,
      createBottleApiSuccess,
      createBottleApiFailure,
      deleteFreezerInventoryApiResponse,
      getFreezerInventoryApiFailure,
      deleteFreezerInventoryApiFailure,
      inventoryData
    } = this.props
    const {freezerItems, realmDb} = this.state

    if (deleteFreezerInventoryApiFailure != prevProps.deleteFreezerInventoryApiFailure &&  deleteFreezerInventoryApiFailure && prevState.isLoading) {
     this.setState({isLoading: false, refreshing: false})
    }

    if (deleteFreezerInventoryApiResponse != prevProps.deleteFreezerInventoryApiResponse && prevState.isLoading) {
      this.setState({isLoading: false})
      if (freezerItems.length > 0) {
        let index = freezerItems.findIndex((e) => {
          return e.id === this.state.deleteId
        })
        AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, (err, result) => {
          let records = result !== null ? JSON.parse(result) : []
          let result1 = records.filter((e) => {
            if(e.recordId === this.state.deleteId){
              PushNotification.cancelLocalNotifications({ id: e.notifId });
            }
            return e.recordId !== this.state.deleteId
          })
          AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, JSON.stringify(result1))
        })
        AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, (err, result) => {
          let records = result !== null ? JSON.parse(result) : []
          let result1 = records.filter((e) => {
            if(e.recordId === this.state.deleteId){
              PushNotification.cancelLocalNotifications({ id: e.notifId });
            }
            return e.recordId !== this.state.deleteId
          })
          AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, JSON.stringify(result1))
        })
        let inventoryItems = JSON.parse(JSON.stringify(freezerItems))
        inventoryItems.splice(index, 1)
        this.setState({isLoading: false, refreshing: false, freezerItems: inventoryItems}, () => {
          inventoryData && inventoryData(this.state.freezerItems)
        })
      }
      deleteFreezerFromDb(this.state.deleteId).then((result) => {

      })
    }

    if (getFreezerInventoryApiSuccess != prevProps.getFreezerInventoryApiSuccess && getFreezerInventoryApiSuccess && (prevState.isLoading || prevState.refreshing)) {
      console.log('Inventory APi Success---->>>', JSON.stringify(getFreezerInventoryApiResponse))
      this.setState({
        isLoading: false,
        refreshing: false,
        freezerItems: this.pageNumber === 1 ? getFreezerInventoryApiResponse : prevState.freezerItems.concat(getFreezerInventoryApiResponse)
      }, () => {
        inventoryData && inventoryData(this.state.freezerItems)
      })
      if(getFreezerInventoryApiResponse.length > 0) {
        AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER_CONGRTS, 'true')
      }
      this.saveVirtualListInDB(getFreezerInventoryApiResponse)
    }

    if (createBottleApiSuccess != prevProps.createBottleApiSuccess && createBottleApiSuccess && createBottleData != prevProps.createBottleData) {
      console.log('VirtualSwiperList Create Inventory ---', createBottleApiSuccess, createBottleData.length)
      if (createBottleData.length > 0) {
        //if (freezerItems)
        let inventoryItems = JSON.parse(JSON.stringify(freezerItems))
        createBottleData.forEach((element) => {
          let index = inventoryItems.findIndex((e) => {
            return e.id === element.id
          })
          if (index > -1) {
            inventoryItems.splice(index, 1, element)
            this.saveEditFreezerDataInDB(element)

          } else {
            this.saveEditFreezerDataInDB(element)
            inventoryItems = inventoryItems.concat(element)
          }
        })
        this.setState({freezerItems: inventoryItems}, () => {
          inventoryData && inventoryData(this.state.freezerItems)
        })
      }
    }

    if ((prevProps.getFreezerInventoryApiFailure != getFreezerInventoryApiFailure) && getFreezerInventoryApiFailure && prevState.isLoading) {
      this.setState({isLoading: false, refreshing: false, noMoreFound: true});
    }

    if ((prevProps.createBottleApiFailure != createBottleApiFailure) && createBottleApiFailure && prevState.isLoading) {
      this.setState({
        isLoading: false, refreshing: false, noMoreFound: true
      });
    }
  }

  saveEditFreezerDataInDB(item) {
    const {realmDb} = this.state
    let dbObj = {
      ...item,
      userId: this.userName,
      isSync: true,
      isDeleted: false
    };
    console.log('dbObj----',dbObj)
    saveVirtualFreezerDatabase(realmDb, dbObj).then((r) => {
      console.log('modified---')
    })

  }


  renderListEmptyView = () => {
    return (
      <View style={styles.listEmptyView}>
        <EmptyTrackingTypeIcon width={110} height={100}/>
        <Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:this.textColor}]}>{I18n.t('stats_screen.empty_list_today_message')}</Text>
      </View>
    )
  }

  saveDeletedFreezerDataInDB(item) {
    let dbObj = {
      ...item,
      userId: this.userName,
      isSync: false,
      isDeleted: true
    };
    const {realmDb} = this.state
    saveVirtualFreezerDatabase(realmDb, dbObj).then((r) => {
    })
  }

  renderListView = ({item, index}) => {
    const {ListFooterComponent, style, isLoading, isMoving, checkBoxSelectedIndex, selectedIndex, isFrom} = this.props
    const {freezerItems, isImperial, isCheckInventory} = this.state
    const {deleteFreezerInventoryApi, isInternetAvailable, isBottleTracking, themeSelected} = this.props
    let itemBackgroundColor = Colors.white
    themeSelected === 'dark' && (itemBackgroundColor = Colors.rgb_000000)
    return <SwipeRow
      ref={ref => {
        this.listRefs[index] = ref
      }}
      rightOpenValue={-75}
      disableLeftSwipe={false}
      disableRightSwipe={true}
      key={index.toString()}
      closeOnRowPress={true}>
      <View style={styles.standaloneRowBack}>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => {
            if(this.listRefs[index] && this.listRefs[index] !== null && this.listRefs[index] !== undefined){
            this.listRefs[index].closeRow()
              this.setState({deleteId: item.id})
              if (isInternetAvailable) {
                this.setState({isLoading: true})
                deleteFreezerInventoryApi(item.id)
              } else {
                this.saveDeletedFreezerDataInDB(item)
              }
            }     
        }}>
          <Text maxFontSizeMultiplier={1.7} style={styles.deleteTextStyle}>{I18n.t('generic.delete')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.standaloneRowFront, {backgroundColor: itemBackgroundColor}]}>
        <VirtualInventoryItem
          ref={ref => {
            this.listRefs[index] = ref
          }}
          index={index} isMoving={isMoving}
          selectedIndex={selectedIndex}
          isBottleTracking={isBottleTracking}
          isFrom={isFrom}
          checkBoxSelectedIndex={checkBoxSelectedIndex && checkBoxSelectedIndex()}
          item={item} isImperial={isImperial} isCheckInventory={isCheckInventory}
          textColor={this.textColor}
        />
      </View>
    </SwipeRow>
  }

  render() {
    const {ListFooterComponent, style, isLoading, isMoving, checkBoxSelectedIndex, selectedIndex, isFrom} = this.props
    const {freezerItems, isImperial, isCheckInventory} = this.state
    const {
      bottleSelected,
      fridgeSelected,
      isBottleTracking,
      inventoryData,
      trayNumber,
      defaultFridgeSelected,
      isClearFilter
    } = this.props
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

    //console.log('items---',items)
    return (<View style={[style, {flex: 1}]}>
      {this.state.isLoading && <LoadingSpinner/>}

      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          disableRightSwipe
          disableLeftSwipe={false}
          data={items}
          /*renderHiddenItem={(data, rowMap) => (
            <TouchableOpacity style={styles.deleteListStyle} onPress={async () => {
              console.log('data--', data.index, rowMap)
              this.setState({deleteId: data.item.id})
              this.listRefs.current[data.index].closeRow()
              if (this.props.isInternetAvailable) {
                this.setState({isLoading: true})
                this.props.deleteFreezerInventoryApi(data.item.id)
              } else {
                await this.saveDeletedFreezerDataInDB(data.item)
                this.props.onOfflineItemDeleted();
              }
            }}>
              <View>
                <Text maxFontSizeMultiplier={1.7} style={styles.deleteTextStyle}>{I18n.t('generic.delete')}</Text>
              </View>
            </TouchableOpacity>
          )}*/
          renderItem={this.renderListView}
          /* renderItem={({item,index})=>
             <VirtualInventoryItem
               ref={ref => {this.listRefs.current[index] = ref}}
               index={index} isMoving={isMoving}
               selectedIndex={selectedIndex}
               isBottleTracking={isBottleTracking}
               isFrom={isFrom}
               checkBoxSelectedIndex={checkBoxSelectedIndex && checkBoxSelectedIndex()}
               item={item} isImperial={isImperial}  isCheckInventory={isCheckInventory}
             />
           }*/
          //rightOpenValue={-85}
          ListFooterComponent={ListFooterComponent ? ListFooterComponent : null}
          onSwipeValueChange={this.onSwipeValueChange}
          ListEmptyComponent={!isLoading && this.renderListEmptyView}
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
      {this.canNotEditBagAndFreezerDialog()}

    </View>)
  }
}

const mapStateToProps = (state) => ({
  isInternetAvailable: state.app.isInternetAvailable,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  selected_baby: state.home.selected_baby,
  themeSelected: state.app.themeSelected,
  deleteFreezerInventoryApiResponse: state.home.deleteFreezerInventoryApiResponse,
  deleteFreezerInventoryApiFailure: state.home.deleteFreezerInventoryApiFailure,
  getFreezerInventoryApiResponse: state.home.getFreezerInventoryApiResponse,
  getFreezerInventoryApiFailure: state.home.getFreezerInventoryApiFailure,
  getFreezerInventoryApiSuccess: state.home.getFreezerInventoryApiSuccess,
  createBottleResponse: state.home.createBottleResponse,
  createBottleData: state.home.createBottleData,
  createBottleApiSuccess: state.home.createBottleApiSuccess,
  createBottleApiFailure: state.home.createBottleApiFailure,
})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  deleteFreezerInventoryApi: (id) => dispatch(HomeActions.deleteFreezerInventoryApi('/inventoryId/' + id)),
  getTrackingApi: (startDate, endDate, babyId, page, perPage) => dispatch(HomeActions.getTrackingApi(startDate, endDate, babyId, page, perPage)),
  deleteTrackingApi: (trackingId, babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId, babyId)),
  deleteMotherTrackingApi: (trackingId) => dispatch(HomeActions.deleteMotherTrackingApi(trackingId)),
  createBottleApi: (milkInventories) => dispatch(HomeActions.createBottleApi(milkInventories)),
  getFreezerInventoryApi: (page, perPage) => dispatch(HomeActions.getFreezerInventoryApi(page, perPage))
});

export default connect(mapStateToProps, mapDispatchToProps)(VirtualSwiperList);

