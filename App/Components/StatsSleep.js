import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/StatsBreastfeedingStyles';
import ActiveSleepIcon from '@svg/ic_sleep';
import I18n from '@i18n';
import moment from 'moment';
import Colors from '@resources/Colors';
import {convertSecToHourMin,diffInHoursMinutes} from "@utils/TextUtils";
import KeyUtils from "@utils/KeyUtils";

	const StatsSleep =(props)=>{
		const {trackingType, trackAt, session, total_duration_key} = props.item
		const {themeSelected,textColor} =props
		let itemTitle = trackingType === KeyUtils.TRACKING_TYPE_SLEEP && I18n.t('stats_sleep.title')
    let today=new Date()
	  let translatedItemTitle =I18n.t(`days.${moment(trackAt).format('dddd').toLowerCase()}`)
    let timeFormat = diffInHoursMinutes(today,new Date(trackAt))
		!props.isTodaySelected && (timeFormat = moment(trackAt).format('MM.DD.YY'))
		!props.isTodaySelected && (itemTitle = translatedItemTitle)
		return(
			<>
        <TouchableOpacity style={styles.itemWrapper} onPress={()=>props.onItemPress(trackingType)}>
        <ActiveSleepIcon width={70} height={70} fill={themeSelected?Colors.rgb_bce9fd:Colors.rgb_daeffa} style={{marginHorizontal:5}}/>
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
				{I18n.t('stats_sleep.session_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.5} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {session}
              </Text>
            	</View>
				<View style={styles.textItemContainer}>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
					{I18n.t('stats_sleep.total_sleep_key')}
              	</Text>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                	{convertSecToHourMin(total_duration_key)}
              	</Text>
            	</View>
          	</View>
				</View>
      </TouchableOpacity>
	  </>
		)
	}

export default StatsSleep
