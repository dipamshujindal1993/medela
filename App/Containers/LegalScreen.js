import React, { Component } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, FlatList, I18nManager} from 'react-native';
import BackIcon from '@svg/arrow_back';
import I18n from '@i18n';
import {Colors, Metrics} from '@resources';
import styles from './Styles/LegalScreenStyles';
import ForwardIcon from '@svg/arrow_right';
import PrivacyTermsConditionIcon from '@svg/ic_privacy_policy_terms_condition';
import LicenseIcon from '@svg/ic_license';
import ImprintIcon from '@svg/ic_imprint';
import LoadingSpinner from "@components/LoadingSpinner";
import KeyUtils from "@utils/KeyUtils";
import { verticalScale, moderateScale } from "@resources/Metrics";
import {connect} from 'react-redux'
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class LegalScreen extends Component{
	constructor(props){
		super(props)
		this.state={
			data:[],
			isLoading: true
		}
		this.themeSelected=this.props.themeSelected  && this.props.themeSelected
		this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
	}

	async componentDidMount(){
		this.setState({data: I18n.t('LegalList').LegalListData, isLoading: false})
    await analytics.logScreenView('legal_screen')
	}

	getIcons=(item)=>{
		const{selectedImage}=item
		switch (selectedImage) {
			case KeyUtils.LEGAL_TYPE_PRIVACY_TERMS_AND_CONDITION: {
				return <PrivacyTermsConditionIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
			}
			case KeyUtils.LEGAL_TYPE_LICENSES: {
				return <LicenseIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
			}
			case KeyUtils.LEGAL_TYPE_IMPRINT: {
				return <ImprintIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
			}
		}
	}

	itemOnClick=(item)=>{
		const{navigation}=this.props;
		item.selectedImage === KeyUtils.LEGAL_TYPE_PRIVACY_TERMS_AND_CONDITION &&
			navigation.navigate('LegalTermsConditions')

		item.selectedImage === KeyUtils.LEGAL_TYPE_LICENSES &&
			navigation.navigate('LicensesScreen')

		item.selectedImage === KeyUtils.LEGAL_TYPE_IMPRINT &&
			navigation.navigate('ImprintScreen')
	}

	renderListItem=({item})=>{
		return(
			<TouchableOpacity
			 onPress={()=> this.itemOnClick(item)}
			>
				<View style={styles.listItemViewStyle}>
					<View style={styles.imageContentView}>
						{this.getIcons(item)}
						<View style={styles.itemTextViewStyle}>
							<Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{item.title}</Text>
						</View>
					</View>
					<View style={styles.iconWrapper}>
							<ForwardIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_898d8d}/>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

    render(){
		const{navigation}=this.props
		const{isLoading, data}=this.state
        return(
			<SafeAreaView style={styles.container}>
				<View style={styles.headerView}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}> {I18n.t('legal.header_title')}</Text>
          <TouchableOpacity
						accessibilityLabel={I18n.t("accessibility_labels.back_label")}
						accessible={true}
						onPress={() => navigation.goBack()}>
						<BackIcon
							fill={Colors.rgb_fecd00}
							width={48}
							height={48}
							style={{ transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} />
					</TouchableOpacity>
					{/*<Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}> {I18n.t('legal.header_title')}</Text>*/}
				</View>
				{isLoading && <LoadingSpinner/>}
				<View style={styles.contentView}>
					<FlatList
						contentContainerStyle={styles.verticalListStyle}
						keyExtractor={(item, index) => index.toString()}
						showsVerticalScrollIndicator={false}
						data={data}
						renderItem={this.renderListItem}
					/>
				</View>
			</SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
	themeSelected: state.app.themeSelected,

  })

  export default connect(mapStateToProps)(LegalScreen);
