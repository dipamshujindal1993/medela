import React, { Component } from 'react'
import { View, SafeAreaView, TouchableOpacity, Text, FlatList, Linking, I18nManager} from 'react-native'
import LoadingSpinner from "@components/LoadingSpinner";
import BackIcon from '@svg/arrow_back';
import I18n from '@i18n';
import {Colors, Metrics} from '@resources';
import styles from './Styles/HelpScreenStyles';
import KeyUtils from "@utils/KeyUtils";
import ForwardIcon from '@svg/arrow_right';
import ProblemSolverIcon from '@svg/ic_problem_solver';
import FaqIcon from '@svg/ic_faq';
import AppTechnicalSupportIcon from '@svg/ic_app_technical_support';
import CustomerServiceIcon from '@svg/ic_customer_service';
import {marketData} from '@utils/locale';
import {connect} from 'react-redux';
import LactationConsultantIcon from '@svg/ic_lactation_consultant';
import DeviceInfo from 'react-native-device-info';
import { getPackageVersion } from '@utils/VersionUtils';
import AsyncStorage from "@react-native-community/async-storage";
import {locale} from "@utils/locale";
import { verticalScale, moderateScale } from "@resources/Metrics";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class HelpScreen extends Component{
  constructor(props) {
  	super(props)
    this.state = {
			isLoading: true,
			data:[],
			getMarketData:{}
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.currentMarket=KeyUtils.INT_MARKET
	}

	async componentDidMount(){
		const{remoteConfig, navigation}=this.props
		this.focusListener = navigation.addListener('didFocus', async () => {
			this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
			let helpList= I18n.t('HelpList').helpListData
			let _local=await AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE)
			let updatedMarketData = marketData(remoteConfig.markets,_local==null?locale().replace("-", "_"):_local)
			const{market}=updatedMarketData
			this.currentMarket=market
			if (market!==KeyUtils.INT_MARKET &&  market!==KeyUtils.CANADA_MARKET && market!==KeyUtils.US_MARKET && market!==KeyUtils.MEXICO_MARKET){
            let index=helpList.findIndex((e)=>{
               return e.selectedImage === KeyUtils.HELP_TYPE_APP_TECHNICAL_SUPPORT
            })
			if (index>-1 && helpList.length>0){
					helpList.splice(index,1)
				}
			}
			//INT_B2C
				// hide when no key in market object.
			if(!updatedMarketData.hasOwnProperty('contactLactationConsultant')){
            let index=helpList.findIndex((e)=>{
              return e.selectedImage === KeyUtils.HELP_TYPE_LACTATION_CONSULTANT
            })
			if (index>-1){
				helpList.splice(index,1)
			}
			}
			this.setState({
				data: helpList,
				isLoading: false,
				getMarketData: updatedMarketData
			})
		})
    await analytics.logScreenView('help_screen')
	}

	getIcons=(item)=>{
    const{selectedImage}=item
		switch (selectedImage) {
      case KeyUtils.HELP_TYPE_PROBLEM_SOLVER: {
				return <ProblemSolverIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
			}
      case KeyUtils.HELP_TYPE_APP_TECHNICAL_SUPPORT: {
				return <AppTechnicalSupportIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
			}
      case KeyUtils.HELP_TYPE_CUSTOMER_SERVICE: {
				return <CustomerServiceIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
			}
      case KeyUtils.HELP_TYPE_LACTATION_CONSULTANT: {
				return <LactationConsultantIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
			}
		}
	}

  itemOnClick=(item)=>{
    const{navigation}=this.props;
    const{getMarketData}=this.state;

    item.selectedImage === KeyUtils.HELP_TYPE_PROBLEM_SOLVER &&
    navigation.navigate('ProblemSolver')

    item.selectedImage === KeyUtils.HELP_TYPE_CUSTOMER_SERVICE &&
    Linking.openURL(getMarketData.contactMarket).catch((err) => console.error('An error occurred', err));

    item.selectedImage === KeyUtils.HELP_TYPE_APP_TECHNICAL_SUPPORT &&
    Linking.openURL(`mailto:${(this.currentMarket===KeyUtils.US_MARKET || this.currentMarket===KeyUtils.CANADA_MARKET || this.currentMarket===KeyUtils.MEXICO_MARKET)?'medelafamily@medela.com':'intappsupport@medela.com'}?subject=${I18n.t('help.mail_subject')}&body=${I18n.t('help.medela_family') + ' ' + getPackageVersion()}
			${DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion()}
			${DeviceInfo.getModel()}`
    ).catch((err) => console.error('An error occurred', err));

    {getMarketData.hasOwnProperty('contactLactationConsultant') &&
    item.selectedImage === KeyUtils.HELP_TYPE_LACTATION_CONSULTANT &&
    Linking.openURL(getMarketData.contactLactationConsultant).catch((err) => console.error('An error occurred', err));
    }
  }

	renderListItem=({item, index})=>{
		const{themeSelected}=this.props
		let themeTextColor = themeSelected === 'dark' ? Colors.white: Colors.rgb_000000
		return(
			<TouchableOpacity onPress={()=> this.itemOnClick(item)}>
				<View style={styles.listItemViewStyle}>
					<View style={styles.imageContentView}>
						{this.getIcons(item)}
						<View style={styles.itemTextViewStyle}>
							<Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:themeTextColor}]}>{item.title}</Text>
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
		const{navigation,themeSelected}=this.props
		const{data, isLoading}=this.state
		let themeTextColor = themeSelected === 'dark' ? Colors.white: Colors.rgb_000000
        return(
			<SafeAreaView style={styles.container}>
				<View style={styles.headerView}>
					<TouchableOpacity
						accessibilityLabel={I18n.t("accessibility_labels.back_label")}
						accessible={true}
						onPress={() => navigation.goBack()}>
						<BackIcon
							fill={Colors.rgb_fecd00}
							width={48}
							height={48}
							style={{ marginLeft: 5, transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }} />
					</TouchableOpacity>
					<Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:themeTextColor}]}> {I18n.t('help.header_title')}</Text>
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
  remoteConfig: state.remoteConfig,
  themeSelected: state.app.themeSelected,
})

export default connect(mapStateToProps)(HelpScreen);
