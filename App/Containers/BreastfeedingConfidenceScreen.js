import React from 'react'
import {View, Text, TouchableOpacity, SafeAreaView, FlatList, Platform, I18nManager} from 'react-native';
import BackIcon from '@svg/arrow_back';
import Colors from '@resources/Colors';
import styles from './Styles/BreastfeedingConfidenceScreenStyles';
import I18n from '@i18n';
import Slider from '@react-native-community/slider';
import SliderThumbImage from '../Images/png/Knob.png';
import HomeActions from '@redux/HomeRedux';
import {connect} from 'react-redux';
import {locale} from '@utils/locale';
import LoadingSpinner from "@components/LoadingSpinner";
import moment from 'moment';
import Button from '@components/Button';
import SliderStepImage from '@svg/slider_step_image';
import Dialog from '@components/Dialog';
import { cancelBCANotifications } from '@components/Notifications';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BreastfeedingConfidenceScreen extends React.Component {
	constructor(props){
		super(props)
		this.state={
			getData:{},
			isLoading: false,
			questionsList: [],
			startTime: moment(),
			showNoDataPopUp: false,
			showOfflinePopUp: false
		}
    this.locale=locale().replace("-", "_")
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
	}
	async componentDidMount(){
		const{babies, isInternetAvailable, navigation }= this.props
		this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
		if(navigation.state.params && navigation.state.params.babyId) {
			let index = babies && babies.length>0 && babies.findIndex((e) => {
				return e.babyId === navigation.state.params.babyId
			})
			this.setState({babyId: babies[index].babyId})
		} else {
			babies && babies.length>0 && (this.setState({babyId: babies[0].babyId}))
		}
		if(isInternetAvailable){

      AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
        if (_local!=null){
          this.locale=_local
        }
        console.log(this.locale)
        this.getBcaApi()
      })

		}else{
			this.setState({showOfflinePopUp: true})
		}
    await analytics.logScreenView('breastfeeding_confidence_screen')
	}

	getBcaApi(){
		const {getBreastfeedingConfidenceApi}=this.props
		this.setState({isLoading:true})
		getBreastfeedingConfidenceApi(this.locale)
  }

	componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
		const {getBreastfeedingConfidenceApiFailure, getBreastfeedingConfidenceApiSuccess,getBcaResponse, breastfeedingConfidenceApiSuccess, breastfeedingConfidenceApiFailure, navigation}=this.props
		if (getBreastfeedingConfidenceApiSuccess!=prevProps.getBreastfeedingConfidenceApiSuccess &&  getBreastfeedingConfidenceApiSuccess  && prevState.isLoading){
			this.setState({isLoading:false, getData:getBcaResponse, questionsList: getBcaResponse.questions})
		}
		if (getBreastfeedingConfidenceApiFailure!=prevProps.getBreastfeedingConfidenceApiFailure && getBreastfeedingConfidenceApiFailure && prevState.isLoading){
			this.setState({isLoading:false, getData:getBcaResponse, showNoDataPopUp: true})
		}

		if (breastfeedingConfidenceApiSuccess!=prevProps.breastfeedingConfidenceApiSuccess &&  breastfeedingConfidenceApiSuccess  && prevState.isLoading){
			this.setState({isLoading:false})
			if(navigation.state.params && navigation.state.params.bca) {
			cancelBCANotifications(this.state.babyId, this.props.navigation.state.params.bca)
			}
			navigation.navigate('BreastfeedingConfidenceSuccess', { 'questionnaireId': this.state.getData.id, isUserFromNotification:this.props.navigation.state.params!==undefined})
		}
		if (breastfeedingConfidenceApiFailure!=prevProps.breastfeedingConfidenceApiFailure && breastfeedingConfidenceApiFailure && prevState.isLoading){
			alert("Failure")
		}
  }

	getValueFormat=(val)=>{
		let formattedValue= I18n.t('breastfeeding_confidence.one_star')
		val === 1 && (formattedValue = I18n.t('breastfeeding_confidence.one_star'))
		val === 2 && (formattedValue = I18n.t('breastfeeding_confidence.two_star'))
		val === 3 && (formattedValue = I18n.t('breastfeeding_confidence.three_star'))
		val === 4 && (formattedValue = I18n.t('breastfeeding_confidence.four_star'))
		val === 5 && (formattedValue = I18n.t('breastfeeding_confidence.five_star'))
		return formattedValue
	}

	getSliderValue=(val, item)=>{
		const{questionsList}=this.state

		questionsList.forEach((i, index)=>{
      if(i.id === item.id){
        this.setState(previousState => {
					const questionsList = [...previousState.questionsList];
          questionsList[index] = {...questionsList[index], value: this.getValueFormat(val) };
          return { questionsList };
        });
      }
    })
	}

	getSliderView=(item)=>{
		const{sliderValue, thumbIcon}=this.state
		return(
			  <View style={styles.itemViewStyle}>
         	<View style={styles.itemQuesView}>
           	<View style={styles.itemIndexViewStyle}>
             	<Text maxFontSizeMultiplier={1.7} style={[styles.itemIndexTextStyle,{color:Colors.rgb_000000}]}>{item.order + 1}</Text>
           	</View>
          	<Text maxFontSizeMultiplier={1.7} style={[styles.itemQuesTextStyle,{color:this.textColor}]}>
				<Text maxFontSizeMultiplier={1.7} style={{color:this.textColor}}>
				{`${item.localizedTitle}.`}
				</Text>
				{item.isRequired &&
					<Text maxFontSizeMultiplier={1.7} style={{color: Colors.rgb_ffcd00}}>*</Text>
				}
			</Text>
         	</View>
       		<View style={styles.sliderWrapper}>
         		<Slider
				accessible={true}
				accessibilityLabel={I18n.t("accessibility_labels.confidence_test_slider") + `${item.order + 1}`}
            	style={[styles.sliderViewStyle, Platform.OS == 'android' ? {width: '105%'} : {}]}
            	value={sliderValue}
				inverted={I18nManager.isRTL?true:false}
           		step={1}
              	tapToSeek={true}
            	minimumValue={1}
           		maximumValue={5}
				minimumTrackTintColor={'transparent'}
				maximumTrackTintColor={'transparent'}
				thumbImage={!item.hasOwnProperty('value')? false: SliderThumbImage}
				thumbTintColor={'transparent'}
				onSlidingComplete={(val)=> {
					this.getSliderValue(val, item)
				}}
          	/>

			<View style={styles.stepViewStyle}>
			<View style={styles.stepStyle}/>
				{item.options.map((obj, index)=>{
	            return(
						<SliderStepImage 
							key={index} width={item.value !== obj.localizedDescription?12:0} height={12} style={{zIndex: item.value !== obj.localizedDescription? 0 : -1}}/>
					)
				})}
			</View>
       		</View>
       		<View style={styles.sliderTextValues}>
				{item.options.map((obj, index)=>{
					return(
						<Text maxFontSizeMultiplier={1.7} key={index} style={[styles.sliderTextStyle, {color: item.value == obj.localizedDescription ? Colors.rgb_ffcd00 : this.textColor}]}>
							{obj.localizedDescription}
						</Text>
					)
				})}
       		</View>
      </View>
		)
	}

	renderListItem=({item})=>{
		return(
			<View>
				{this.getSliderView(item)}
			</View>
		)
	}

	handleValidations() {
		const{babies}=this.props
		const {getData, questionsList, locale, startTime} = this.state;

		let answersList = JSON.parse(JSON.stringify(questionsList))
    if (babies && babies.length > 0) {
			answersList.forEach(obj =>{
				obj.questionId = obj.id
				obj.title = obj.localizedTitle
				delete obj.id
				delete obj.options
				delete obj.order
				delete obj.pageGroup
				delete obj.questionTitles
				delete obj.localizedTitle
			})
      this.trackingObj = {
				questionnaireId: getData.id,
				answerDuration: moment().diff(startTime, 'milliseconds'),
				answers: answersList,
				properties: [],
				tags: []
      };
			this.setState({isLoading:true})
			this.props.breastfeedingConfidenceApi(this.locale, this.trackingObj)
    }
	}

	noDataPopUp(){
		const {showNoDataPopUp} = this.state
		const{navigation}=this.props
		return (
		<Dialog
			visible={showNoDataPopUp}
			title={I18n.t('breastfeeding_confidence.no_data_popup_title')}
			positive={I18n.t('mom_information.ok')}
			positiveOnPress={() => {
				this.setState({showNoDataPopUp: false})
				navigation.goBack()
			}}
			onDismiss={() => {
			}}
		/>
		)
	}

	offlinePopUp(){
		const {showOfflinePopUp} = this.state
		const{navigation}=this.props
		return (
		<Dialog
			visible={showOfflinePopUp}
			title={I18n.t('breastfeeding_confidence.offline_popup_title')}
			message={I18n.t('breastfeeding_confidence.offline_popup_message')}
			positive={I18n.t('mom_information.ok')}
			isOffine={true}
			positiveOnPress={() => {
				this.setState({showOfflinePopUp: false})
				navigation.goBack()
			}}
			onDismiss={() => {
			}}
		/>
		)
	}

 render(){
	const{navigation}= this.props;
	const{isLoading, questionsList, showNoDataPopUp, showOfflinePopUp}=this.state
	let buttonDisabled= true
	let count= 0
	questionsList.forEach(obj=> obj.hasOwnProperty('value') && (count +=1))
	questionsList.length === count && questionsList.length? buttonDisabled = false: true
    return(
		<SafeAreaView style={styles.container}>
			<View style={styles.headerView}>
				<TouchableOpacity 
					accessible={true}
					accessibilityLabel={I18n.t("accessibility_labels.back_label")} 
					onPress={()=> navigation.goBack()}
					style={styles.backIconStyle}>
					<BackIcon fill={Colors.rgb_fecd00} 
						width={32} height={32}
						style={{marginLeft: 10,transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} 
					/>
				</TouchableOpacity>
			<Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_confidence.header_title')}</Text>
			</View>
			{isLoading && <LoadingSpinner/>}
			<View style={styles.contentViewStyle}>
				<View style={styles.motivationTextViewStyle}>
					<Text maxFontSizeMultiplier={1.7} style={[styles.motivationTextStyle,{color:this.textColor}]} >{I18n.t('breastfeeding_confidence.motivation_text1')}</Text>
					<Text maxFontSizeMultiplier={1.7} style={[styles.motivationTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_confidence.motivation_text2')}</Text>
				</View>
			</View>
			<View style={styles.contentListView}>
				<FlatList
					keyExtractor={(item, index) => index.toString()}
					data={questionsList}
					showsVerticalScrollIndicator ={false}
					renderItem={this.renderListItem}
				/>
			</View>
			<View>
				<Button
					disabled={buttonDisabled}
					title={I18n.t('generic.submit').toUpperCase()}
					style={[styles.submitButtonStyles, buttonDisabled?{opacity:0.5}:{opacity: 1}]}
					textStyle={styles.submitTextStyle}
					onPress={() => {
					this.handleValidations()
					}}
				/>
			</View>
			{showNoDataPopUp && this.noDataPopUp()}
			{showOfflinePopUp && this.offlinePopUp()}
      	</SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  	babies: state.home.babies,
	userProfile: state.user.userProfile,
	getBcaResponse:state.home.getBcaResponse,
  	getBreastfeedingConfidenceApiSuccess: state.home.getBreastfeedingConfidenceApiSuccess,
	getBreastfeedingConfidenceApiFailure: state.home.getBreastfeedingConfidenceApiFailure,
	breastfeedingConfidenceApiSuccess: state.home.breastfeedingConfidenceApiSuccess,
	breastfeedingConfidenceApiFailure: state.home.breastfeedingConfidenceApiFailure,
	isInternetAvailable: state.app.isInternetAvailable,
	themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
	getBreastfeedingConfidenceApi: (locale) => dispatch(HomeActions.getBreastfeedingConfidenceApi(locale)),

	breastfeedingConfidenceApi: (locale, trackingData) =>
    dispatch(HomeActions.breastfeedingConfidenceApi(locale, trackingData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BreastfeedingConfidenceScreen);

