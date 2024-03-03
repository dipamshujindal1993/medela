import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/StatsBreastfeedingStyles';
import ActiveBottleIcon from '@svg/ic_bottle_stats';
import I18n from '@i18n';
import moment from 'moment';
import {diffInHoursMinutes} from "../Utils/TextUtils";
import KeyUtils from "@utils/KeyUtils";
import {volumeConversionHandler} from '@utils/locale';
import {Colors} from '@resources'

	const StatsBottle =(props)=>{
		const {isImperial} = props
		const {trackingType, trackAt, session, avg_vol_key, formula_key, breastmilk_key, mix_key, amountTotalUnit, total_volume_unit,total_volume_key} = props.item
		const {themeSelected,textColor} =props
		// const{convertedVolume, convertedVolumeUnit} = volumeConversionHandler(isImperial,amountTotalUnit,parseFloat(avg_vol_key));
		let itemTitle = trackingType === KeyUtils.TRACKING_TYPE_BOTTLE && I18n.t('stats_bottle.title')
    let today=new Date()
    let translatedItemTitle =I18n.t(`days.${moment(trackAt).format('dddd').toLowerCase()}`)
    let timeFormat = diffInHoursMinutes(today,new Date(trackAt))
		!props.isTodaySelected && (timeFormat = moment(trackAt).format('MM.DD.YY'))
		!props.isTodaySelected && (itemTitle = translatedItemTitle)
		return(
			<>
				<TouchableOpacity style={styles.itemWrapper} onPress={()=>props.onItemPress(trackingType)}>
        	<ActiveBottleIcon width={70} height={70} style={{marginHorizontal:5}} fill={themeSelected?Colors.rgb_eoedcd:Colors.rgb_eaf2de}/>
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
				  {I18n.t('stats_breastfeeding.session_key')}
              	</Text>
              	<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                	{session}
              	</Text>
            		</View>
								<View>
              		<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
					  {I18n.t('breastfeeding_pump.total_volume')}
              		</Text>
              		<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                		{/* {convertedVolume? convertedVolume + ' ' + convertedVolumeUnit: 0 + ' ' + convertedVolumeUnit} */}
                		{/* {avg_vol_key? avg_vol_key + ' ' + total_volume_unit: 0 + ' ' + total_volume_unit} */}
                		{total_volume_key? Math.round(total_volume_key *100)/100 + ' ' + total_volume_unit: 0 + ' ' + total_volume_unit}

              		</Text>
            		</View>
								<View>
              		<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
					  {I18n.t('stats_bottle.breastmilk_key')}
              		</Text>
              		<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                		{breastmilk_key? breastmilk_key: 0}

              		</Text>
            		</View>
								<View>
              		<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
					  {I18n.t('stats_bottle.formula_key')}
              		</Text>
              		<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                		{formula_key? formula_key: 0}

              		</Text>
            		</View>
								<View>
              		<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusKeyStyle,{color:textColor}]}>
					  {I18n.t('stats_bottle.mix_key')}
              		</Text>
              		<Text maxFontSizeMultiplier={1.7} style={[styles.itemStatusValueStyle,{color:textColor}]}>
                		{mix_key? mix_key: 0}
              		</Text>
            		</View>
          		</View>
					</View>
      	</TouchableOpacity>
	  	</>
		)
	}

export default StatsBottle
