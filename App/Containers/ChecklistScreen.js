import React, { useState} from 'react'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {connect, useSelector} from "react-redux";
import CommonHeader from "@components/CommonHeader";
import I18n from '@i18n';
import NavigationActions from '@redux/NavigationRedux'
import Colors from "@resources/Colors";
import RightArrow from '@svg/arrow_back'
import HospitalIcon from '@svg/ic_hospitalcheklist'
import BreastFeedingIcon from '@svg/ic_breastfeedingactive'
import BackToWorkIcon from '@svg/ic_backtowork'
import EquipmentIcon from '@svg/ic_equipment_life_newborn'
import {readMyItems} from "@database/ChecklistDatabase";
import styles from './Styles/ChecklistScreenStyles';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {countryCode, languageCode, locale} from "@utils/locale";
import { verticalScale, moderateScale } from "@resources/Metrics";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
import { getRealmDb } from '../Database/AddBabyDatabase';

const ChecklistScreen = (props) => {
  const [checkList, SetCheckList] = useState([])
  const [allItemsArray, SetAllItemsArray] = useState([])
  const [realm, SetRealm] = useState(null)
  const _countryCode = useSelector(state => state.user.countryCode)
  const langcode = useSelector(state => state.user.languageCode)
  const userMother = useSelector(state => state.user.userProfile)
  const selectedTheme = useSelector(state=>state.app.themeSelected)



  React.useEffect( async () => {
    await analytics.logScreenView('checklist_screen')
    _callBack()
    return function cleanup() {
      if (realm!=null&& !realm.isClosed){
      }
    };
  }, [ ]);


  const getLocalDb = async (data, i,deletedItemRealm,enableItems,myItem) => {
    let myItems = myItem
    myItems = myItems.filter((e) => e.selectedItemUuid == data.uuid && e.currentUserUuid == userMother.mother.username)
    const {checkListItems} = data
    let checkListItem = [...JSON.parse(JSON.stringify(checkListItems))]
    let item = {
      "title": "My Items",
      "orderNumber": 1555,
      "uuid": props.userProfile.mother.username,
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
    calculateReamingItemsCount(data, newArr, i,isFound)
  }

  const calculateReamingItemsCount = (data, checkList, i,isFound) => {
    let arr = checkList

    let itemsLeft = 0;
    for (let i = 0; i < arr.length; i++) {
      itemsLeft = itemsLeft + arr[i].checkListItems.filter(((e) => !e.isEnabled)).length
    }
    if (isFound){
      data.count = itemsLeft
    }else {
      data.count=0
    }

    SetAllItemsArray(checkList)
  }

  const _callBack=async () => {
    let data;
    // let result=await AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE)
    // let result = locale()
    // let  langCode=languageCode()
    // let cc=countryCode()
    // if (result!==null){
    //   langCode=result.substr(0, 2)
    //   cc=result.substr(3, 5)
    // }
    let langCode=languageCode()
    let cc=countryCode()
    console.log(langCode,cc)
    if (!langCode){
      let result = locale()
      langCode=result.substr(0, 2)
      cc=result.substr(3, 5)
    }
    if (langCode == 'en') {
      if (cc == 'AU') {
        data = require('../StaticData/checklist/Checklists_en_AU.json')
      } else if (cc == 'CA') {
        data = require('../StaticData/checklist/Checklists_en_CA.json')
      } else if (cc == 'GB') {
        data = require('../StaticData/checklist/Checklists_en_GB.json')
      } else if (cc == 'IN') {
        data = require('../StaticData/checklist/Checklists_en_IN.json')
      } else {
        data = require('../StaticData/checklist/Checklists_en_US.json')
      }
    } else if (langCode == 'de') {
      if (cc == 'CH') {
        data = require('../StaticData/checklist/Checklists_de_CH.json')
      } else if (cc == 'DE') {
        data = require('../StaticData/checklist/Checklists_de_DE.json')
      } else {
        data = require('../StaticData/checklist/Checklists_de_LU.json')
      }
    } else if (langCode == 'fr') {
      if (cc == 'BE') {
        data = require('../StaticData/checklist/Checklists_fr_BE.json')
      } else if (cc == 'CA') {
        data = require('../StaticData/checklist/Checklists_fr_CA.json')
      } else if (cc == 'CH') {
        data = require('../StaticData/checklist/Checklists_fr_CH.json')
      } else if (cc == 'FR') {
        data = require('../StaticData/checklist/Checklists_fr_FR.json')
      } else {
        data = require('../StaticData/checklist/Checklists_fr_LU.json')
      }
    } else {
      switch (langCode) {
        case 'da':
          data = require('../StaticData/checklist/Checklists_da.json')
          break
        case 'es':
          data = require('../StaticData/checklist/Checklists_es_ES.json')
          break
        case 'it':
          data = require('../StaticData/checklist/Checklists_it_IT.json')
          break
        case 'nb':
          data = require('../StaticData/checklist/Checklists_nb.json')
          break
        case 'no':
          data = require('../StaticData/checklist/Checklists_nb.json')
          break
        case 'nl':
          data = require('../StaticData/checklist/Checklists_nl_NL.json')
          break
        case 'pt':
          data = require('../StaticData/checklist/Checklists_pt_PT.json')
          break
        case 'ru':
          data = require('../StaticData/checklist/Checklists_ru.json')
          break
        case 'sv':
          data = require('../StaticData/checklist/Checklists_sv.json')
          break
        case 'pl':
          data = require('../StaticData/checklist/Checklists_pl.json')
          break
      }
    }
    SetCheckList(data.checkListItems)
    let myItemsRealmObj =   await getRealmDb()
    SetRealm(myItemsRealmObj)
   // let schema = await readSelectionSchema()
/*    let schema = await readSelectionSchema()
    let deletedItemsSchema = await readDeletedItemsSchema()*/

    const deletedItemRealm = myItemsRealmObj.objects('ChecklistDeletedItems');
    let enableItems = myItemsRealmObj.objects('CheckListSelection');
    enableItems=enableItems.filter((e)=>{
      return e.currentUserId===userMother.mother.username
    })
    console.log('enableItems---',enableItems,)
    let myItems = myItemsRealmObj.objects('MyItems');
    for (let i = 0; i < data.checkListItems.length; i++) {
     getLocalDb(data.checkListItems[i], i,deletedItemRealm,enableItems,myItems)
    }


  }

  const renderItem = ({item}) => {
    const {image, count} = item
    let Icon
    if (image == "hospital_suitcase") {
      Icon = <HospitalIcon width={60} height={60}/>
    } else if (image == "equipment_life_newborn") {
      Icon = <EquipmentIcon width={60} height={60}/>
    } else if (image == "breastfeeding") {
      Icon = <BreastFeedingIcon width={60} height={60}/>
    } else if (image == "back_to_work") {
      Icon = <BackToWorkIcon width={60} height={60}/>
    }

    return <TouchableOpacity style={styles.itemStyle} onPress={() => {
      props.navigation.navigate('ChecklistDetailScreen', {
        item,changes:_callBack
      })
    }}>
      <View style={styles.imageViewStyle}>
        {Icon}
        <View style={{justifyContent: 'center'}}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.titleStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{item.title}</Text>
          {count > 0 && <Text maxFontSizeMultiplier={1.7} style={styles.itemsLeftTextStyle}>{`${count} ${I18n.t('checklist.items_left')}`}</Text>}
        </View>
      </View>
      <View style={{flex: 0.5, justifyContent: 'center'}}>
        <RightArrow width={moderateScale(20)} height={verticalScale(20)} fill={Colors.rgb_fecd00} style={styles.rightArrowStyle}/>

      </View>

    </TouchableOpacity>
  }

  return <View style={styles.container}>
    <CommonHeader backPress={() => props.navigation.goBack()} title={I18n.t('checklist.checklist_title')}
                  style={styles.headerTextStyle} titleStyle={styles.headerTextStyle} titleTextColor ={selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}/>

    <FlatList
      data={checkList}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  </View>

}


const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(NavigationActions.signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChecklistScreen);


