import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Keyboard} from 'react-native';
import styles from './Styles/VirtualInventoryItemStyles';
import Colors from "../Resources/Colors";
import I18n from '@i18n';
import {getMilkAge,getDateFormat} from "@utils/TextUtils";
import {useSelector} from "react-redux";
import NavigationService from "@services/NavigationService";
 import BottleIcon from '@svg/ic_bottle'
import BagIcon from '@svg/ic_bag'
import Expired from '@svg/expired'
import EditIcon from '@svg/grey_edit'
import Active from '@svg/check';
import Inactive from '@svg/uncheck';
import {connect} from "react-redux";
import KeyUtils from "@utils/KeyUtils";
import {volumeConversionHandler} from "@utils/locale";
import moment from "moment";

const VirtualInventoryItem = React.forwardRef((props,ref) => {
  const {item, isImperial, isCheckInventory,isMoving,index,checkBoxSelectedIndex,selectedIndex,isBottleTracking,isEditVirtualInventory,editStyle,textColor} = props
  const {containerType, location, amount, unit, number, tray, expireAt,trackAt} = item
  const [formattedTrackAt,setFormattedTrackAt]=useState('');
  const [formattedExpireAt,setFormattedExpireAt]=useState('');
  getDateFormat(trackAt).then((e)=>{
    setFormattedTrackAt(e)
  })
  getDateFormat(expireAt).then((e)=>{
    setFormattedExpireAt(e)
  })
  const themeSelected = useSelector(state => state.app.themeSelected)
  let isBottleExpired = new Date(expireAt) < new Date()
  const {convertedVolume, convertedVolumeUnit} = volumeConversionHandler(isImperial, unit, amount);
  let listBackgroundColor = Colors.white
  themeSelected === 'dark' && (listBackgroundColor = "black")
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  return (
    <View style={{backgroundColor: listBackgroundColor}}>
      <TouchableOpacity
        style={styles.milkItemView}
        disabled={isCheckInventory}
        onPress={() => {
          if (isMoving){
            checkBoxSelectedIndex(index)
          }else {
            !isBottleExpired ? NavigationService.navigate('EditVirtualFreezerInventory', {
              data: item,
              isFrom: isBottleTracking?'bottleTracking':'virtualFreezer'
            }):null
          }
        }
        }>
        {isMoving && <View style={{ flexDirection: 'row', alignItems: 'center' }} >
          {index === selectedIndex ? <Active style={{ marginRight: 10 }} width={20} height={20}/> : <Inactive style={{ marginRight: 10 }} width={20} height={20} />}
        </View>
        }

        <View style={[styles.breastFeedingViewStyle,editStyle]}>
          {isBottleExpired ? <Expired width={70} height={70}/> : containerType === 1 ?
            <BottleIcon width={70} height={70}/> : <BagIcon width={70} height={70}/>}
        </View>
        <View style={styles.bottleBagView}>
          <View style={styles.bottleBagTopView}>
            <View style={styles.bottleBagTopViewChild}>
              <Text maxFontSizeMultiplier={1.7}
                style={!isBottleExpired?[styles.itemTitleStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]:styles.itemExpiredTitleStyle}>{`${containerType === 1 ? I18n.t('breastfeeding_pump.bottle') : I18n.t('breastfeeding_pump.bag')} ${number}`}</Text>
              {!isBottleExpired && location === 1 && containerType === 1 && !isEditVirtualInventory && !isBottleTracking &&
              <EditIcon style={{marginLeft: 5}} width={15} height={15}/>}
            </View>
            <Text maxFontSizeMultiplier={1.7} style={!isBottleExpired?[styles.itemDateTimeStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]:styles.itemExpiredDateTimeStyle}>{getMilkAge(new Date(), new Date(item.trackAt))}</Text>
          </View>
          <View style={styles.fridgeFreezerView}>
          <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemSavedTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('virtual_freezer.saved_in')}</Text>
              <Text maxFontSizeMultiplier={1.7}
                style={[styles.itemFreezerTextStyle,{textAlign:'left',color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{`${location === 1 ? I18n.t('breastfeeding_pump.fridge') : I18n.t('breastfeeding_pump.freezer')}, ${I18n.t('virtual_freezer.tray')} ${tray}`}</Text>
            </View>
            <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemSavedTextStyle,{textAlign:'right',color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('virtual_freezer.net_volume')}</Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemFreezerTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{`${convertedVolume} ${I18n.t(`units.${convertedVolumeUnit.toLowerCase()}`)}`}</Text>
            </View>
          </View>
          {isEditVirtualInventory &&
            <View style={styles.createdExpireView}>
              <View>
                <Text maxFontSizeMultiplier={1.7} style={[styles.itemSavedTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('virtual_freezer.created_on')}</Text>
                <Text maxFontSizeMultiplier={1.7} style={[styles.itemFreezerTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{formattedTrackAt}</Text>
              </View>
              <View style={styles.textItemContainer}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.itemSavedTextStyle, {textAlign: 'right',color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('virtual_freezer.expire_at')}</Text>
                <Text maxFontSizeMultiplier={1.7} style={[styles.itemFreezerTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{formattedExpireAt}</Text>
              </View>
            </View>
          }
        </View>
      </TouchableOpacity>
    </View>
  )
})

export default VirtualInventoryItem
