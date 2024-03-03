import React from 'react';
import {View, Text, processColor} from 'react-native';
import styles from './Styles/StatsContractionStyles';
import ContractionActiveIcon from '@svg/ic_contraction_stats';
import moment from 'moment';
import I18n from '@i18n';
import { diffInHoursMinutes} from "@utils/TextUtils";
import {Colors} from '@resources'
import {convertSecondsToMinHours} from "@utils/TextUtils";

const StatsContraction = (props) => {
  const {session,  trackAt, avg_time_key, avg_frequency_key} = props.item
  let itemTitle = I18n.t('stats_contraction.title')
  // let timeFormat = moment(timeStamp).fromNow()
  let today = new Date()
  const {themeSelected,textColor} =props
  let translatedItemTitle =I18n.t(`days.${moment(trackAt).format('dddd').toLowerCase()}`)
  let timeFormat = diffInHoursMinutes(today, new Date(trackAt))
  !props.isTodaySelected && (timeFormat = moment(trackAt).format('MM.DD.YY'))
  !props.isTodaySelected && (itemTitle = translatedItemTitle)


  return (
    <>
      <View style={styles.itemWrapper}>
        <ContractionActiveIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected?Colors.rgb_c2c5c6:Colors.rgb_e0e4e5}/>
        <View style={styles.itemTextWrapperStyle}>
          <View style={styles.itemHeader}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleStyle,{color:textColor}]}>{itemTitle}</Text>
            <Text maxFontSizeMultiplier={1.7} style={[styles.itemDateTimeStyle,{color:textColor}]}>
              {timeFormat}
            </Text>
          </View>
          <View style={styles.itemContentStyle}>
            <View>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_pumping.session_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {session}
              </Text>
            </View>
            <View>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_contraction.avg_time_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {`${convertSecondsToMinHours(avg_time_key)}`}
              </Text>
            </View>
            <View>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_contraction.avg_frequency')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {`${convertSecondsToMinHours(avg_frequency_key)}`}
              </Text>
            </View>
            <View>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {' '}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {' '}
              </Text>
            </View>

          </View>
        </View>
      </View>
    </>
  )
}

export default StatsContraction
