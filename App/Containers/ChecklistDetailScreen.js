import React from 'react'
import {FlatList, Text,BackHandler, TouchableOpacity, View} from 'react-native'
import Dialog from '@components/Dialog';
import styles from './Styles/ChecklistDetailScreenStyles';
import {connect} from "react-redux";
import AddIcon from '@svg/ic_add'
import I18n from 'react-native-i18n';
import {Colors} from '@resources';
import NavigationActions from '@redux/NavigationRedux'
import CommonHeader from "@components/CommonHeader";

import {addItem, readMyItems,clearAllEnabledItems} from "@database/ChecklistDatabase";
import {uuidV4} from "@utils/TextUtils";
import SwiperCheckList from "./SwiperChecklist";
import { Analytics } from '@services/Firebase';
import {Constants} from "../Resources";
import { getRealmDb } from '../Database/AddBabyDatabase';

let analytics = new Analytics()

let userId = '00111A-0010-0100-010000'

class ChecklistDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkList: [],
      isEnabled: false,
      addItemDialog: false,
      itemsLeft: '0',
      extraData: false,
      showClearAlerts:false,
      headerRight: '',
      userId:'',
      realm:null
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  backAction = () => {
    this.props.navigation.state.params.changes();
    this.props.navigation.goBack()
    return true;
  };

  async componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    let myItemsRealmObj = await getRealmDb()

    this.setState({userId: this.props.userProfile.mother.username,realm:myItemsRealmObj})

    this.getLocalDb()
    await analytics.logScreenView('checklist_details_screen')
  }

  async getLocalDb() {
    let data = this.props.navigation.state.params.item
    const {realm}=this.state
  /*  let schema = await readSelectionSchema()
    let deletedItemsSchema = await readDeletedItemsSchema()*/
    const deletedItemRealm = realm.objects('ChecklistDeletedItems');
    let enableItems = realm.objects('CheckListSelection');
    enableItems=enableItems.filter((e)=>{
      return e.currentUserId===this.props.userProfile.mother.username
    })
    let myItems = realm.objects('MyItems');

    myItems = myItems.filter((e) => e.selectedItemUuid == data.uuid && e.currentUserUuid == this.state.userId)

    const {checkListItems} = data
    let checkListItem = [...checkListItems]
    let item = {
      "title": "My Items",
      "orderNumber": 1555,
      "uuid": this.state.userId,
      "checkListItems": myItems
    }
    if (myItems.length > 0) {
      checkListItem.splice(0, 0, item)
    }
    let newArr = []
    let isFound;
    for (let i = 0; i < checkListItem.length; i++) {
      let {checkListItems} = checkListItem[i]
      const getUpdatedValue = obj => {
        obj.isEnabled = (enableItems.some(d => d.uuid == obj.uuid));
        return obj;
      }
      const deletedItems = obj => {
        obj.isDeleted = (deletedItemRealm.some(d => {
          return (d.uuid == obj.uuid)
        }));
        return obj;
      }

      checkListItems = checkListItems.map(getUpdatedValue)
      checkListItems = checkListItems.map(deletedItems)
      checkListItems = checkListItems.filter((e) => !e.isDeleted)
      let enabledItem = checkListItems.filter((E) => E.isEnabled)
      if (enabledItem.length > 0) {
        isFound = true
      }
      checkListItem[i].checkListItems = checkListItems
      if (checkListItems.length > 0) {
        let oo = checkListItem[i]
        newArr.push(oo)
      }
    }
    this.setState({
      checkList: newArr,
      extraData: this.state.extraData,
      headerRight: isFound ? I18n.t('checklist.clear_all').toUpperCase() : ' '
    })
    this.calculateReamingItemsCount()
  }

  calculateReamingItemsCount() {
    const {checkList} = this.state
    let arr = checkList
    let itemsLeft = 0;
    for (let i = 0; i < arr.length; i++) {
      itemsLeft = itemsLeft + arr[i].checkListItems.filter(((e) => !e.isEnabled)).length
    }
    this.setState({itemsLeft, checkList: arr,})
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }


  showClearAllConfirmationPopup() {
    const {showClearAlerts} = this.state
    const {uuid} =this.props.navigation.state.params.item
    return (
      <Dialog
        visible={showClearAlerts}
        title={I18n.t('checklist.clear_checklist')}
        message={I18n.t('checklist.clear_checklist_message')}
        positive={I18n.t('generic.yes')}
        negative={I18n.t('generic.cancel')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showClearAlerts: false})

        }}
        positiveOnPress={() => {
          this.setState({showClearAlerts: false})
          clearAllEnabledItems(this.state.realm,uuid).then((r)=>{
            this.getLocalDb()
          })

        }}
        onDismiss={() => {
        }}
      />
    )
  };

  renderHeader = () => {
    const {itemsLeft} = this.state
    let data = this.props.navigation.state.params.item
     return (<View>
      <View style={styles.headerView} accessible={true}>
        <TouchableOpacity style={styles.addViewStyle} onPress={() => this.setState({addItemDialog: true})} accessibilityLabel={I18n.t('checklist.add_item')}>
          <AddIcon width={30} height={30} fill={'white'}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerTextView} onPress={() => this.setState({addItemDialog: true})} accessibilityLabel={I18n.t('checklist.add_item')+'2'}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.addItemTextStyle,{color:this.textColor}]}>{I18n.t('checklist.add_item')}</Text>
          <View style={styles.headerDivider}/>
        </TouchableOpacity>
      </View>
      <View style={styles.headerLabelItemsView}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.titleTextStyle,{color:this.textColor}]}>{`${data.title}`}</Text>
        <Text maxFontSizeMultiplier={1.7} style={[styles.itemsLeftTextStyle,{color:this.textColor}]}>{`${itemsLeft} ${I18n.t('checklist.items_left')}`}</Text>
      </View>

    </View>)
  }


  addItemPopup() {
    const {addItemDialog, textInput} = this.state
    return (
      <Dialog
        visible={addItemDialog}
        title={I18n.t('checklist.add_item_list')}
        textInput={textInput}
        onChangeText={(textInput) => {
          this.setState({textInput})
        }}
        placeholder={I18n.t('checklist.add_item')}
        positive={I18n.t('checklist.add_item').toUpperCase()}
        positiveOnPress={async () => {
          const {textInput,realm} = this.state
          if (textInput && textInput.toString().trim().length>0){
            let data = this.props.navigation.state.params.item
            let item = {
              currentUserUuid: this.state.userId,
              selectedItemUuid: data.uuid,
              uuid: uuidV4(),
              title: textInput
            }
            addItem(realm,item).then((result)=>{
              this.getLocalDb()
            })

            let param = {
              'checklist_item_add':textInput.toString()
            }
            await analytics.logEvent(Constants.CHECKLIST_MANAGEMENT, param);

            this.setState({textInput: '', addItemDialog: false})
          }
        }}
        onDismiss={() => {
          this.setState({addItemDialog: false, textInput: ''})
        }}
      />
    )
  };

  renderItem = ({item, index}) => {
    const {uuid} =this.props.navigation.state.params.item

    /*item.checkListItems.sort(function (a, b) {
      return a.isEnabled - b.isEnabled
    });
*/
    return <View style={styles.itemStyle} key={index.toString()}>
      <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:this.textColor}]}>{item.title}</Text>
      <SwiperCheckList
        realm={this.state.realm}
        textColor={this.textColor}
        currentUserId={this.state.userId}
        selectedItemUuid={uuid}
        extraData={this.state.extraData} itemsList={item.checkListItems}
                       deleteCallback={(uuid) => this.getLocalDb()}
                       enableDisable={(isEnabled, uuid) => this.getLocalDb()}/>
    </View>
  }


  render() {
    const {addItemDialog,showClearAlerts, checkList, headerRight} = this.state
    let rightTextColor=this.props.themeSelected === 'dark' ?(this.rightTextColor = Colors.rgb_fecd00):(this.rightTextColor = Colors.rgb_000000) 
    return <View style={styles.container}>
      <CommonHeader
        backPress={() => {
          this.props.navigation.state.params.changes();
          this.props.navigation.goBack()


        }}
      title={I18n.t('checklist.checklist_title')}
                    style={[styles.headerTextStyle,{color:this.textColor}]} titleStyle={[styles.headerTextStyle,{color:this.textColor}]} headerRight={headerRight}
                    rightTextColor={rightTextColor}
                    headerRightPress={() => {
                      this.setState({showClearAlerts:true})

                    }}
      titleTextColor ={this.textColor}/>

                    <FlatList              />
      <FlatList
        style={styles.checkListStyle}
        data={checkList}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader}
        keyExtractor={(item, index) => index.toString()}
      />
      {addItemDialog && this.addItemPopup()}
      {showClearAlerts && this.showClearAllConfirmationPopup()}
    </View>
  }

}


const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(NavigationActions.signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChecklistDetailScreen);


