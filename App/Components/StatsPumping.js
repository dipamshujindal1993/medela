import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/StatsBreastfeedingStyles';
import ActivePumpingIcon from '@svg/pumping';
import I18n from '@i18n';
import moment from 'moment';
import {diffInHoursMinutes,convertMinToHours} from "@utils/TextUtils";
import KeyUtils from "@utils/KeyUtils";
import {Colors} from '@resources'

const StatsPumping =(props)=>{
  const {trackingType, avg_time_key, session, total_volume_key, avg_vol_key, trackAt ,amountTotalUnit,total_volume_unit,total_duration_key} = props.item
  const {themeSelected, textColor} =props
  let itemTitle = trackingType === KeyUtils.TRACKING_TYPE_PUMPING && I18n.t('stats_pumping.title')
  let translatedItemTitle =I18n.t(`days.${moment(trackAt).format('dddd').toLowerCase()}`)
  let today=new Date()
  let timeFormat = diffInHoursMinutes(today,new Date(trackAt))
  !props.isTodaySelected && (timeFormat = moment(trackAt).format('MM.DD.YY'))
  !props.isTodaySelected && (itemTitle = translatedItemTitle)
  return(
    <>
      <TouchableOpacity style={styles.itemWrapper} onPress={()=>props.onItemPress(trackingType)}>
        <ActivePumpingIcon width={70} height={70} style={{marginHorizontal:5}} fill={themeSelected? Colors.rgb_eecad7:Colors.rgb_efdae3}/>
        <View style={styles.itemTextWrapperStyle}>
          <View style={styles.itemHeader}>
            <Text maxFontSizeMultiplier={1.5} style={[styles.itemTitleStyle,{color:textColor}]}>{itemTitle}</Text>
            <Text maxFontSizeMultiplier={1.5} style={[styles.itemDateTimeStyle,{color:textColor}]}>
              {timeFormat}
            </Text>
          </View>
          <View style={styles.itemContentStyle}>
          <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_pumping.session_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {session}
              </Text>
            </View>
            <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('calendar.time')}
              </Text>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {convertMinToHours(total_duration_key)}
              </Text>
            </View>
            <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_pumping.vol_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {(parseFloat(total_volume_key)).toFixed(2)+ ' ' + total_volume_unit}

              </Text>
            </View>
            <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_pumping.avg_vol_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {avg_vol_key  + ' ' + total_volume_unit}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default StatsPumping
