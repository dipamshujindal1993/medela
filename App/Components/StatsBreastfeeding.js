import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/StatsBreastfeedingStyles';
import ActiveBreastFeedingIcon from '@svg/ic_stats_breastfeedingactive';
import moment from 'moment';
import I18n from '@i18n';
import {diffInHoursMinutes, convertSecToHourMin} from "@utils/TextUtils";
import KeyUtils from "@utils/KeyUtils";
import {Colors} from '@resources'

const StatsBreastfeeding = (props) => {
  const {trackingType, trackAt, session, avg_time_key, total_left_key, total_right_key ,total_duration_key} = props.item
  const {themeSelected,textColor} =props
  let itemTitle = (trackingType === KeyUtils.TRACKING_TYPE_BREASTFEEDING) && I18n.t('stats_breastfeeding.title')
  let today = new Date()
  let translatedItemTitle = I18n.t(`days.${moment(trackAt).format('dddd').toLowerCase()}`)
  let timeFormat = diffInHoursMinutes(today, new Date(trackAt))
  !props.isTodaySelected && (timeFormat = moment(trackAt).format('MM.DD.YY'))
  !props.isTodaySelected && (itemTitle = translatedItemTitle)

  return (
    <>
      <TouchableOpacity style={styles.itemWrapper} onPress={() => props.onItemPress(trackingType)}>
        <ActiveBreastFeedingIcon width={70} height={70} style={{marginHorizontal: 5}} fill={themeSelected? Colors.rgb_ffe0d3: Colors.rgb_fae7dd}/>
        <View style={styles.itemTextWrapperStyle}>
          <View style={styles.itemHeader}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleStyle,{color:textColor}]}>{itemTitle}</Text>
            <Text maxFontSizeMultiplier={1.7} style={[styles.itemDateTimeStyle,{color:textColor}]}>
              {timeFormat}
            </Text>
          </View>
          <View style={styles.itemContentStyle}>
            <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_breastfeeding.session_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {session}
              </Text>
            </View>
            <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('calendar.time')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {`${parseInt(total_duration_key)} ${I18n.t('stats_breastfeeding.mins')}`}
              </Text>
            </View>
            <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_breastfeeding.left_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {`${convertSecToHourMin(total_left_key)}`}
              </Text>
            </View>
            <View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
                {I18n.t('stats_breastfeeding.right_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {`${convertSecToHourMin(total_right_key)}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default StatsBreastfeeding
