import React, { useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/StatsBreastfeedingListStyles';
import ActiveBreastFeedingIcon from '@svg/ic_stats_breastfeedingactive';
import ActivePumpingIcon from '@svg/pumping';
import ContractionActiveIcon from '@svg/ic_contraction_stats';
import ActiveNappyIcon from '@svg/ic_nappy_stats';
import ActiveBottleIcon from '@svg/ic_bottle_stats';
import ActiveWeightIcon from '@svg/ic_stats_weight';
import ActiveGrowthIcon from '@svg/ic_stats_growth';
import ActiveSleepIcon from '@svg/ic_sleep';
import BadExpIcon from '@svg/ic_bad_exp';
import NoteIcon from '@svg/ic_note';
import RightArrow from '@svg/arrow_back'
import {Colors} from '@resources'
import KeyUtils from "@utils/KeyUtils";
import moment from "moment";
import Bluetooth from '@svg/ic_bluetooth_stats.svg';
import {convertSecToMinutes,diffInDaysFromNow} from "@utils/TextUtils";
import {convertSecToHourMin, getTrackingType,convertSecondsToMinHours, getDateTimeFormatAccToLocale} from "@utils/TextUtils";
import Freezer from '@svg/stats_freezer.svg';
import {heightConversionHandler,weightConversionHandler,volumeConversionHandler} from '@utils/locale';
import I18n from '@i18n';

const StatsListItem = (props) => {
  const[formattedTime, setformattedTime]=useState('')
  const {typeSelected,item,editData , isImperial, units,isOfflineSession,themeSelected}=props
  const {isMother,trackingType, remark, trackAt,batchType,feedType, isBadSession,pumpId,amountTotal,amountTotalUnit,durationTotal,durationLeft,durationRight,painLevel,frequency, session,weight,weightUnit,height, lastBreast, heightUnit,savedMilk} = item
  let icon;
  let text1,text2,text3,text4,text5=''
  let today=new Date()
  let textColor = props.themeSelected  && props.themeSelected === 'dark' ?(Colors.white):(Colors.rgb_000000)
  text2=diffInDaysFromNow(trackAt)
  let newTime = getDateTimeFormatAccToLocale(false, moment(trackAt)).then((e) => setformattedTime(e))
  // let translatedText = trackingType===KeyUtils.TRACKING_TYPE_BREASTFEEDING?I18n.t(`tracking.breastfeed`):I18n.t(`tracking.${getTrackingType(trackingType).toLowerCase()}`)
  // text1=typeSelected===KeyUtils.TRACKING_TYPE_SELECT_ALL?translatedText:formattedTime
  text1=formattedTime
  if (isMother){
    //text1=I18n.t('stats_contraction.title')
    icon=<ContractionActiveIcon width={70} height={70} style={{marginHorizontal: 5}}  fill={themeSelected=='dark'?Colors.rgb_c2c5c6:Colors.rgb_e0e4e5}/>
    text3=convertSecondsToMinHours(parseInt(durationTotal))

    switch (painLevel){
      case 0:
        text5=I18n.t('stats_contraction.none')
        break;
      case 1:
        text5 = I18n.t('stats_contraction.very_mild')
        break;
      case 2:
        text5 = I18n.t('stats_contraction.mild')
        break;
      case 3:
        text5 = I18n.t('stats_contraction.medium')
        break;
      case 4:
        text5 = I18n.t('stats_contraction.strong')
        break;
      case 5:
        text5 = I18n.t('stats_contraction.very_strong')
        break;
    }
  }
  else if (trackingType === KeyUtils.TRACKING_TYPE_BREASTFEEDING) {
    icon = <ActiveBreastFeedingIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected=='dark'? Colors.rgb_ffe0d3: Colors.rgb_fae7dd}/>
    if (lastBreast===1){
      text5= I18n.t('breastfeeding_pump.left')
    }else if (lastBreast===2){
      text5= I18n.t('breastfeeding_pump.right')
    }
    // text3=convertSecToMinutes(parseInt(durationLeft))+convertSecToMinutes(parseInt(durationRight))+` ${I18n.t('stats_breastfeeding.mins')}`
    text3=convertSecToHourMin(durationTotal)
  } else if (trackingType === KeyUtils.TRACKING_TYPE_PUMPING) {
    icon = <ActivePumpingIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected=='dark'? Colors.rgb_eecad7:Colors.rgb_efdae3}/>
    if (lastBreast===1){
      text5= I18n.t('breastfeeding_pump.left')
    }else if (lastBreast===2){
      text5= I18n.t('breastfeeding_pump.right')
    }else {
      text5= I18n.t('breastfeeding_pump.both')
    }
    const {convertedVolume , convertedVolumeUnit} = volumeConversionHandler( isImperial,amountTotalUnit,amountTotal);
    text3 = `${convertedVolume} ${convertedVolumeUnit}`;
    text4=convertSecToHourMin(parseInt(item.durationTotal))
      //item.pumpId!=="" && item.pumpId!==undefined?convertSecToMinutes(parseInt(item.durationTotal))+` ${I18n.t('stats_breastfeeding.mins')}`:convertSecToMinutes(parseInt(durationLeft))+convertSecToMinutes(parseInt(durationRight))+` ${I18n.t('stats_breastfeeding.mins')}`
  } else if (trackingType === KeyUtils.TRACKING_TYPE_DIAPER) {
    icon = <ActiveNappyIcon width={70} height={70} style={{marginHorizontal: 5}} fill= {themeSelected=='dark'?Colors.rgb_baf4f5:Colors.rgb_cdf6f7}/>
    if (batchType===1){
      text3=I18n.t('nappy_tracking.pee')
    }else if (batchType===2){
      text3=I18n.t('nappy_tracking.poo')
    }else{
      text3=I18n.t('nappy_tracking.both')
    }
  } else if (trackingType === KeyUtils.TRACKING_TYPE_SLEEP) {
    icon = <ActiveSleepIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected=='dark'?Colors.rgb_bce9fd:Colors.rgb_daeffa}/>
    text3=convertSecToHourMin(parseInt(durationTotal))
  } else if (trackingType === KeyUtils.TRACKING_TYPE_WEIGHT) {
    icon = <ActiveWeightIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected=='dark'?Colors.rgb_d0b4cd:Colors.rgb_eddced}/>
    const{convertedWeight , convertedWeightUnit} = weightConversionHandler(isImperial,weightUnit,weight);
    text3 = `${convertedWeight} ${convertedWeightUnit}`;
  } else if (trackingType === KeyUtils.TRACKING_TYPE_GROWTH) {
    icon = <ActiveGrowthIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected=='dark'?Colors.rgb_fbe7c2:Colors.rgb_fdf1d2}/>
    const {convertedHeight,convertedHeightUnit}=heightConversionHandler(isImperial,heightUnit,height)
    text3 = `${convertedHeight} ${convertedHeightUnit}`;
  } else if (trackingType === KeyUtils.TRACKING_TYPE_BOTTLE) {
    if (feedType===1){
      text4=I18n.t('stats_bottle.breastmilk_key')
    }else if(feedType===3){
      text4=I18n.t('stats_bottle.mix_key')
    }
    else if(feedType===2){
      text4=I18n.t('stats_bottle.formula_key')
    }
    else if(feedType===4){
      text4=I18n.t('stats_bottle.saved_milk')

    }
    text3=`${amountTotal} ${amountTotalUnit}`
    const {convertedVolume , convertedVolumeUnit} = volumeConversionHandler( isImperial,amountTotalUnit,amountTotal);
    text3 = `${convertedVolume} ${convertedVolumeUnit}`;
    icon = <ActiveBottleIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected=='dark'?Colors.rgb_eoedcd:Colors.rgb_eaf2de}/>
  } else {
    icon = <ActiveBottleIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected=='dark'?Colors.rgb_eoedcd:Colors.rgb_eaf2de}/>
  }

  const handleNavigation=(item)=>{
    const {trackingType,isMother} = item
    const {navigation}=props;
    console.log(item);
    if (isMother){
      navigation.navigate('EditContractionScreen',{
        item,
        _onSave:editData
      })
    }
    else if (trackingType === KeyUtils.TRACKING_TYPE_BREASTFEEDING) {
      navigation.navigate('EditBreastfeedingScreen',{
        item,
        _onSave:editData
      })
    } else if (trackingType === KeyUtils.TRACKING_TYPE_PUMPING) {
      navigation.navigate('EditPumpingScreen',{
        item,
        _onSave:editData
      })
    } else if (trackingType === KeyUtils.TRACKING_TYPE_DIAPER) {

      navigation.navigate('EditNappyTrackingScreen',{
        item,
        _onSave:editData
      })

    } else if (trackingType === KeyUtils.TRACKING_TYPE_SLEEP) {
      navigation.navigate('EditSleepScreen',{
        item,
        _onSave:editData
      })
    } else if (trackingType === KeyUtils.TRACKING_TYPE_WEIGHT) {
      navigation.navigate('EditWeightScreen',{
        item,
        _onSave:editData
      })
    } else if (trackingType === KeyUtils.TRACKING_TYPE_GROWTH) {

      navigation.navigate('EditGrowthScreen',{
        item,
        _onSave:editData
      })

    } else if (trackingType === KeyUtils.TRACKING_TYPE_BOTTLE) {
      navigation.navigate('EditBottleTrackingScreen',{
        item,
        _onSave:editData
      })
    }

  }
return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>handleNavigation(item)} disabled={isOfflineSession?true:false}>
        <View style={styles.itemWrapper}>
          <View>
            {icon}
            {isBadSession && <BadExpIcon width={20} height={20} style={styles.expViewStyle}/>}
            {pumpId!=="" && pumpId!==undefined && trackingType===KeyUtils.TRACKING_TYPE_PUMPING && <Bluetooth width={20} height={20}  style={styles.bluetoothViewStyle}/>}
          </View>
          <View style={styles.itemTextWrapperStyle}>
            <View style={styles.parentView}>
              <View style={{flexDirection: 'row'}}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.timeTextStyle,{color:textColor}]}>{text1}</Text>
                {remark && remark!=undefined && remark.toString().length>0 ? <NoteIcon width={20} height={20} style={styles.noteStyle}/> : null}
                {feedType === 4 && <Freezer width={20} height={20} style={styles.noteStyle}/>}
                {savedMilk  && <Freezer width={20} height={20} style={styles.noteStyle}/>}

              </View>
              <Text maxFontSizeMultiplier={1.7} style={[styles.hoursAgoTextStyle,{color:textColor}]}>{text2}</Text>
            </View>

            <View style={[styles.parentView, {marginBottom: 10}]}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.durationTextStyle,{color:textColor}]}>{text3}</Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemsLeftRightTextStyle,{color:textColor}]}>{text4}</Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemsLeftRightTextStyle,{color:textColor}]}>{text5}</Text>
            </View>

          </View>
          <View style={{alignSelf: 'center'}}>
           {!isOfflineSession && <RightArrow width={20} height={20} fill={Colors.rgb_fecd00} style={styles.rightArrowStyle}/>}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default StatsListItem
