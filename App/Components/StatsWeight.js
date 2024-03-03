import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/StatsBreastfeedingStyles';
import ActiveWeightIcon from '@svg/ic_stats_weight';
import I18n from '@i18n';
import moment from 'moment';
import {diffInHoursMinutes} from "@utils/TextUtils";
import KeyUtils from "@utils/KeyUtils";
import {weightConversionHandler} from '@utils/locale';
import Colors from '@resources/Colors';

	const StatsWeight =(props)=>{
		const {isImperial} = props
		const {trackingType, trackAt, weight,weightUnit} = props.item
		const {themeSelected,textColor} =props

		const{convertedWeight , convertedWeightUnit} = weightConversionHandler(isImperial,weightUnit,weight);
		let itemTitle = (trackingType === KeyUtils.TRACKING_TYPE_WEIGHT) && I18n.t('stats_weight.title')
    let today=new Date()
	let translatedItemTitle =I18n.t(`days.${moment(trackAt).format('dddd').toLowerCase()}`)
    let timeFormat = diffInHoursMinutes(today,new Date(trackAt))
		!props.isTodaySelected && (timeFormat = moment(trackAt).format('MM.DD.YY'))
		!props.isTodaySelected && (itemTitle = translatedItemTitle)
		return(
			<>
        <TouchableOpacity style={styles.itemWrapper} onPress={()=>props.onItemPress(trackingType)}>
        	<ActiveWeightIcon width={70} height={70} style={{marginHorizontal:5}} fill={themeSelected?Colors.rgb_d0b4cd:Colors.rgb_eddced} />
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
			  {I18n.t('stats_weight.title')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {/* {weight + ' ' + unitShownUS} */}
                {convertedWeight + ' ' + convertedWeightUnit}

              </Text>
            	</View>
          	</View>
				</View>
      </TouchableOpacity>
	  </>
		)
	}

export default StatsWeight
