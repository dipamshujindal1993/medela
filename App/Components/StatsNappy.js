import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/StatsBreastfeedingStyles';
import ActiveNappyIcon from '@svg/ic_nappy_stats';
import I18n from '@i18n';
import moment from 'moment';
import {diffInHoursMinutes} from "@utils/TextUtils";
import KeyUtils from "@utils/KeyUtils";
import {Colors} from '@resources'

	const StatsNappy =(props)=>{
		const {trackingType, trackAt, session, pee_key, poo_key, both_key} = props.item
		const {themeSelected,textColor} =props
		let itemTitle = (trackingType === KeyUtils.TRACKING_TYPE_DIAPER) && I18n.t('stats_nappy.title')
		// let timeFormat = moment(timeStamp).fromNow()
    let today=new Date()
    let translatedItemTitle =I18n.t(`days.${moment(trackAt).format('dddd').toLowerCase()}`)
    let timeFormat = diffInHoursMinutes(today,new Date(trackAt))
		!props.isTodaySelected && (timeFormat = moment(trackAt).format('MM.DD.YY'))
		!props.isTodaySelected && (itemTitle = translatedItemTitle)
		return(
			<>
        <TouchableOpacity style={styles.itemWrapper} onPress={()=>props.onItemPress(trackingType)}>
        <ActiveNappyIcon width={70} height={70} style={{marginHorizontal:5}} fill={themeSelected?Colors.rgb_baf4f5:Colors.rgb_cdf6f7}/>
				<View style={styles.itemTextWrapperStyle}>
					<View style={styles.itemHeader}>
          	<Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleStyle,{color:textColor}]}>{itemTitle}</Text>
            <Text maxFontSizeMultiplier={1.7} style={[styles.itemDateTimeStyle,{color:textColor}]}>
			{timeFormat}
						</Text>
					</View>
					<View style={styles.itemContentStyle}>
					<View style={styles.textItemContainer}>
              <Text maxFontSizeMultiplier={1.7} style={[[styles.itemStatusKeyStyle,{color:textColor}],{color:textColor}]}>
			  {I18n.t('stats_breastfeeding.session_key')}
              </Text>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                {session}
              </Text>
            	</View>
				<View style={styles.textItemContainer}>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
				  {I18n.t('stats_nappy.pee_key')}
              	</Text>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                	{pee_key? pee_key : 0}
              	</Text>
            	</View>
				<View style={styles.textItemContainer}>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
				  {I18n.t('stats_nappy.poo_key')}
              	</Text>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                	{poo_key? poo_key: 0}
              	</Text>
            	</View>
				<View style={styles.textItemContainer}>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
				  {I18n.t('stats_nappy.both_key')}
              	</Text>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                	{both_key? both_key: 0}
              	</Text>
            	</View>
          	</View>
				</View>
      </TouchableOpacity>
	  </>
		)
	}

export default StatsNappy
