import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/StatsBreastfeedingStyles';
import ActiveGrowthIcon from '@svg/ic_stats_growth';
import I18n from '@i18n';
import moment from 'moment';
import {diffInHoursMinutes} from "@utils/TextUtils";
import KeyUtils from "@utils/KeyUtils";
import {heightConversionHandler} from '@utils/locale';
import Colors from '@resources/Colors';

	const StatsGrowth =(props)=>{
		const {isImperial} = props
		const {trackingType, trackAt,heightUnit, height} = props.item
		const {themeSelected,textColor} =props
		const{convertedHeight , convertedHeightUnit} = heightConversionHandler(isImperial,heightUnit,height);

		let itemTitle = (trackingType === KeyUtils.TRACKING_TYPE_GROWTH) && I18n.t('stats_growth.title')
		let today=new Date()
		let translatedItemTitle =I18n.t(`days.${moment(trackAt).format('dddd').toLowerCase()}`)
		let timeFormat = diffInHoursMinutes(today,new Date(trackAt))
		!props.isTodaySelected && (timeFormat = moment(trackAt).format('MM.DD.YY'))
		!props.isTodaySelected && (itemTitle = translatedItemTitle)
		return(
			<>
        <TouchableOpacity style={styles.itemWrapper} onPress={()=>props.onItemPress(trackingType)}>
        <ActiveGrowthIcon width={70} height={70} style={{marginHorizontal:5}} fill={themeSelected?Colors.rgb_fbe7c2:Colors.rgb_fdf1d2} />
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
			  {I18n.t('stats_growth.size_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {convertedHeight + ' ' + convertedHeightUnit}

              </Text>
            	</View>
          	</View>
				</View>
      </TouchableOpacity>
	  </>
		)
	}

export default StatsGrowth
