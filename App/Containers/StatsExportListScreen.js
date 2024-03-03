import React from 'react'
import {View, Text, TouchableOpacity, FlatList, SafeAreaView, ScrollView, I18nManager} from 'react-native';
import BackIcon from '@svg/arrow_back';
import Colors from '@resources/Colors';
import styles from './Styles/StatsExportListScreenStyles';
import I18n from 'react-native-i18n';
import SwitchOnIcon from '@svg/ic_switch_on';
import SwitchOffIcon from '@svg/ic_switch_off';
import CalendarLogo from '@svg/ic_calendar';
import StatsTrackingHeader from "../StaticData/stats/StatsTrackingHeader";
import ActiveSelectAllIcon from '@svg/ic_avatar_selected_all';
import ActiveBreastFeedingIcon from '@svg/ic_breastfeedingactive';
import ActivePumpingIcon from '@svg/ic_stats_pumpactive';
import ActiveBottleIcon from '@svg/ic_bottle';
import ActiveNappyIcon from '@svg/ic_nappy';
import ActiveWeightIcon from '@svg/ic_weight';
import ActiveGrowthIcon from '@svg/ic_growth';
import ActiveSleepIcon from '@svg/ic_sleep';
import KeyUtils from "@utils/KeyUtils";
import Button from '@components/Button';
import {connect} from 'react-redux';
import HomeActions from '@redux/HomeRedux';
import LoadingSpinner from '@components/LoadingSpinner';
import {locale,engToArabicNumber,monthsArab,monthsEng} from '@utils/locale';
import CustomCalendar from '@components/CustomCalendar'
import moment from 'moment';
import EmptyExportListItem from '@svg/ic_empty_export_list';
import {Metrics} from "@resources";
import Dialog from "@components/Dialog";
import { verticalScale, moderateScale } from "@resources/Metrics";
import { getDateFormat } from "@utils/TextUtils";
import HeaderStats from "@components/HeaderStats";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class StatsExportListScreen extends React.Component {
  constructor(props) {
		super(props)
		this.state = {
			babyId: '',
      		showSuccessFailurePopup:false,
			isLoading: false,
			showCalendarPicker: false,
			selectedDate: moment().format(),
			startDate: moment().format('YYYY-MM-DD'),
			endDate: moment().format('YYYY-MM-DD'),
			dateRangeSwitchSelected: true,
			getData:[],
			selectedTrackingArr:[],
			btnSelected: I18n.t('calendar.period'),
			switchObj:{
				[KeyUtils.TRACKING_TYPE_SELECT_ALL]: true,
				[KeyUtils.TRACKING_TYPE_BREASTFEEDING]: true,
				[KeyUtils.TRACKING_TYPE_PUMPING]: true,
				[KeyUtils.TRACKING_TYPE_BOTTLE]: true,
				[KeyUtils.TRACKING_TYPE_DIAPER]: true,
				[KeyUtils.TRACKING_TYPE_SLEEP]: true,
				[KeyUtils.TRACKING_TYPE_GROWTH]: true,
				[KeyUtils.TRACKING_TYPE_WEIGHT]: true
			}
		}
		this.isSuccess=true
		this.themeSelected=this.props.themeSelected  && this.props.themeSelected
		this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
	}

	async componentDidMount() {
		const{babies, userProfile, getTrackingResponse, selected_baby}=this.props
		let getTrackings = []
		this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
		this.setState({
			startDate:selected_baby.birthday,
			babyId: selected_baby.babyId,
			getData: StatsTrackingHeader.statsHeader,
			formattedStartDate: await getDateFormat(selected_baby.birthday),
			formattedEndDate: await getDateFormat(this.state.endDate),
		})

		// if(getTrackingResponse.length){
		// 	getTrackingResponse.forEach(obj=>{
		// 		getTrackings.push(obj.trackingType)
		// 	})
		// 	getTrackings.push(KeyUtils.TRACKING_TYPE_SELECT_ALL)
		// }

		// let filterData = StatsTrackingHeader.statsHeader.filter(obj=>{
		// 	if(getTrackings.includes(obj.trackingType)){
		// 		return obj
		// 	}
		// })
		// if (babies && babies.length>0){
		// 	this.setState({
		// 		babyId: babies[0].babyId,
		// 	})
		// }
		// this.setState({
		// 	getData: filterData,
		// 	selectedTrackingArr: getTrackings
		// })
		// if (userProfile && userProfile){
		// 	this.setState({
		// 		startDate: userProfile.mother.birthDate,
		// 	})
    	// }
    await analytics.logScreenView('stats_export_screen')
	}

	async componentDidUpdate(prevProps, prevState, snapshot){
    const {exportTrackingApiSuccess, exportTrackingApiFailure, selected_baby} = this.props;
    if (
      exportTrackingApiSuccess != prevProps.exportTrackingApiSuccess &&
      exportTrackingApiSuccess &&
      prevState.isLoading
    ) {
      this.isSuccess=true
	   this.setState({isLoading: false,showSuccessFailurePopup:true});
    }

    if (
      exportTrackingApiFailure != prevProps.exportTrackingApiFailure &&
      exportTrackingApiFailure &&
      prevState.isLoading
    ) {
	  // this.saveTrackingInDb()
      this.isSuccess=false
      this.setState({isLoading: false,showSuccessFailurePopup:true});
    }
	if(selected_baby != prevProps.selected_baby){
		this.setState({
			startDate:selected_baby.birthday,
			babyId: selected_baby.babyId,
			endDate: moment().format('YYYY-MM-DD'),
			formattedStartDate: await getDateFormat(selected_baby.birthday),
			formattedEndDate: await getDateFormat(moment().format('YYYY-MM-DD')),
		})
	}
  }

	switchHandler=(typeSelected)=>{
		const{switchObj} = this.state
		if(typeSelected === KeyUtils.TRACKING_TYPE_SELECT_ALL){
			const allVal = !switchObj[KeyUtils.TRACKING_TYPE_SELECT_ALL];
			const newObj = {
				[KeyUtils.TRACKING_TYPE_SELECT_ALL]: allVal,
			}
			for (const key in switchObj) {
				if (switchObj.hasOwnProperty(key)) {
					if (key !== KeyUtils.TRACKING_TYPE_SELECT_ALL) {
						newObj[key] = allVal;
					}
				}
			}
			this.setState(({switchObj: newObj}))
		}else{
		const tempVal = !switchObj[typeSelected]
		let count = 1
		for (const key in switchObj) {
			if (switchObj.hasOwnProperty(key) && key !== KeyUtils.TRACKING_TYPE_SELECT_ALL) {
				const elem = switchObj[key];
				elem === tempVal && (count += 1)
			}
		}
		if(count === Object.keys(switchObj).length -1){
			this.setState(prevState =>({
				switchObj: {                   									// object that we want to update
					...prevState.switchObj,											  // keep all other key-value pairs
					[typeSelected]: !switchObj[typeSelected],      // update the value of specific key
					select_all: tempVal
				}
			}))
		}else{
			this.setState(prevState =>({
				switchObj: {
					...prevState.switchObj,
					[typeSelected]: !switchObj[typeSelected],
					select_all: false
				}
			}))
		}
		}
	}

	switchFunc(typeSelected){
		const {switchObj} = this.state
    let label = ''
    switch (typeSelected) {
      case KeyUtils.TRACKING_TYPE_SELECT_ALL:
        label = I18n.t('accessibility_labels.checkbox_export_all')
        break;
      case KeyUtils.TRACKING_TYPE_BREASTFEEDING :
		label = I18n.t('accessibility_labels.checkbox_export_breastfeeding')
        break;
      case KeyUtils.TRACKING_TYPE_PUMPING :
		label = I18n.t('accessibility_labels.checkbox_export_pumping')
        break;
      case KeyUtils.TRACKING_TYPE_BOTTLE :
		label = I18n.t('accessibility_labels.checkbox_export_bottle_feeding')
        break;
      case KeyUtils.TRACKING_TYPE_DIAPER :
		label = I18n.t('accessibility_labels.checkbox_export_diaper')
        break;
      case KeyUtils.TRACKING_TYPE_SLEEP :
		label = I18n.t('accessibility_labels.checkbox_export_sleep')
        break;
      case KeyUtils.TRACKING_TYPE_GROWTH :
		label = I18n.t('accessibility_labels.checkbox_export_length')
        break;
      case KeyUtils.TRACKING_TYPE_WEIGHT :
		label = I18n.t('accessibility_labels.checkbox_export_weight')
        break;
    }
    return(
      <TouchableOpacity
        accessibilityLabel={label}
        accessible={true}
        style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],width:48,height:48}}
        onPress={()=> this.switchHandler(typeSelected)}
      >
        {switchObj[typeSelected] ? <SwitchOnIcon width={44} height={44}/> :
          <SwitchOffIcon width={44} height={44}/>}
      </TouchableOpacity>
    )
	}
	dateRangeSwitchClick=async()=>{
		const{dateRangeSwitchSelected}=this.state
		if(dateRangeSwitchSelected){
			this.setState({
				dateRangeSwitchSelected: !dateRangeSwitchSelected,
				startDate: this.props.selected_baby.birthday,
				formattedStartDate: await getDateFormat(this.props.selected_baby.birthday),
				btnSelected: I18n.t('calendar.period'),
				endDate: moment().format('YYYY-MM-DD'),
				formattedEndDate: await getDateFormat(moment().format())
			})
		}else{
			this.setState({
				dateRangeSwitchSelected: !dateRangeSwitchSelected,
			})
		}
	}

	dateRangeSwitch(){
		const{dateRangeSwitchSelected}=this.state
		return(
			<TouchableOpacity
        accessibilityLabel={I18n.t("accessibility_labels.checkbox_data_range_all")}
        accessible={true}
        style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],width:48,height:48}} onPress={()=> this.dateRangeSwitchClick()}>
				{dateRangeSwitchSelected ? <SwitchOnIcon width={48} height={48}/> :
        		<SwitchOffIcon width={44} height={44}/>}
			</TouchableOpacity>
		)
	}

	capitalizeFirstLetter(string) {
		// return string.charAt(0).toUpperCase() + string.slice(1);
		if(string === KeyUtils.TRACKING_TYPE_BREASTFEEDING){
			return I18n.t('stats_breastfeeding.title')
		}else if(string === KeyUtils.TRACKING_TYPE_PUMPING){
			return I18n.t('stats_pumping.title')
		}else if(string === KeyUtils.TRACKING_TYPE_BOTTLE){
			return I18n.t('stats_bottle.title')
		}else if(string === KeyUtils.TRACKING_TYPE_DIAPER){
			return I18n.t('stats_nappy.title')
		}else if(string === KeyUtils.TRACKING_TYPE_SLEEP){
			return I18n.t('stats_sleep.title')
		}else if(string === KeyUtils.TRACKING_TYPE_WEIGHT){
			return I18n.t('stats_weight.title')
		}else if(string === KeyUtils.TRACKING_TYPE_GROWTH){
			return I18n.t('stats_growth.title')
		}else{
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

	}

	getItemData = (item) => {
    const{typeSelected} = this.state
    const {trackingType}=item

    switch (trackingType) {
      case KeyUtils.TRACKING_TYPE_SELECT_ALL: {
        return (
			<View style={styles.itemWrapper}>
				<View style={styles.imageTextWrapper}>
					<ActiveSelectAllIcon width={32} height={32} />
					<Text maxFontSizeMultiplier={1.7} style={[styles.itemTextStyle,{color:this.textColor}]}>{I18n.t('stats_list_export.select_all_text')}</Text>
				</View>
				{this.switchFunc(KeyUtils.TRACKING_TYPE_SELECT_ALL)}
			</View>

        );
      }
      case KeyUtils.TRACKING_TYPE_BREASTFEEDING: {
        return (
			<View style={styles.itemWrapper}>
				<View style={styles.imageTextWrapper}>
					<ActiveBreastFeedingIcon width={32} height={32}/>
					<Text maxFontSizeMultiplier={1.7} style={[styles.itemTextStyle,{color:this.textColor}]}>{this.capitalizeFirstLetter(KeyUtils.TRACKING_TYPE_BREASTFEEDING)}</Text>
				</View>
				{this.switchFunc(KeyUtils.TRACKING_TYPE_BREASTFEEDING)}
			</View>
        );
      }
      case KeyUtils.TRACKING_TYPE_PUMPING: {
        return (
			<View style={styles.itemWrapper}>
				<View style={styles.imageTextWrapper}>
					<ActivePumpingIcon width={32} height={32}/>
					<Text maxFontSizeMultiplier={1.7} style={[styles.itemTextStyle,{color:this.textColor}]}>{this.capitalizeFirstLetter(KeyUtils.TRACKING_TYPE_PUMPING)}</Text>
				</View>
				{this.switchFunc(KeyUtils.TRACKING_TYPE_PUMPING)}
			</View>
        );
      }
      case KeyUtils.TRACKING_TYPE_BOTTLE: {
        return (
			<View style={styles.itemWrapper}>
				<View style={styles.imageTextWrapper}>
					<ActiveBottleIcon width={32} height={32} />
					<Text maxFontSizeMultiplier={1.7} style={[styles.itemTextStyle,{color:this.textColor}]}>{this.capitalizeFirstLetter(KeyUtils.TRACKING_TYPE_BOTTLE)}</Text>
				</View>
				{this.switchFunc(KeyUtils.TRACKING_TYPE_BOTTLE)}
			</View>
        );
      }
      case KeyUtils.TRACKING_TYPE_DIAPER: {
        return (
			<View style={styles.itemWrapper}>
				<View style={styles.imageTextWrapper}>
					<ActiveNappyIcon width={32} height={32} />
					<Text maxFontSizeMultiplier={1.7} style={[styles.itemTextStyle,{color:this.textColor}]}>{this.capitalizeFirstLetter(KeyUtils.TRACKING_TYPE_DIAPER)}</Text>
				</View>
				{this.switchFunc(KeyUtils.TRACKING_TYPE_DIAPER)}
			</View>
        );
      }
      case KeyUtils.TRACKING_TYPE_WEIGHT: {
        return (
			<View style={styles.itemWrapper}>
				<View style={styles.imageTextWrapper}>
					<ActiveWeightIcon width={32} height={32} />
					<Text maxFontSizeMultiplier={1.7} style={[styles.itemTextStyle,{color:this.textColor}]}>{this.capitalizeFirstLetter(KeyUtils.TRACKING_TYPE_WEIGHT)}</Text>
				</View>
				{this.switchFunc(KeyUtils.TRACKING_TYPE_WEIGHT)}
			</View>
        );
      }
      case KeyUtils.TRACKING_TYPE_GROWTH: {
        return (
			<View style={styles.itemWrapper}>
				<View style={styles.imageTextWrapper}>
					<ActiveGrowthIcon width={32} height={32} />
					<Text maxFontSizeMultiplier={1.7} style={[styles.itemTextStyle,{color:this.textColor}]}>{this.capitalizeFirstLetter(this.capitalizeFirstLetter(KeyUtils.TRACKING_TYPE_GROWTH))}</Text>
				</View>
				{this.switchFunc(KeyUtils.TRACKING_TYPE_GROWTH)}
			</View>
        );
      }
      case KeyUtils.TRACKING_TYPE_SLEEP: {
        return (
			<View style={styles.itemWrapper}>
				<View style={styles.imageTextWrapper}>
					<ActiveSleepIcon width={32} height={32} fill={Colors.rgb_daeffa}/>
					<Text maxFontSizeMultiplier={1.7} style={[styles.itemTextStyle,{color:this.textColor}]}>{this.capitalizeFirstLetter(KeyUtils.TRACKING_TYPE_SLEEP)}</Text>
				</View>
				{this.switchFunc(KeyUtils.TRACKING_TYPE_SLEEP)}
			</View>
        );
      }
    }
	};

	emptyView=()=>{
		return(
			<View style={styles.emptyListView}>
				<View style={styles.emptyListIconView}>
					<EmptyExportListItem width={120} height={100} style={{alignSelf: 'center'}}/>
				</View>
				<View>
					<Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:this.textColor}]}>{I18n.t('stats_list_export.no_data_title')}</Text>
				</View>
			</View>
		)
	}

	renderListItem = ({item,index}) => {
    return (
      <View style={index===this.state.getData.length-1?styles.list1ItemView:styles.listItemView}>
        {this.getItemData(item)}
      </View>
    );
	};

	onClickExport =()=>{
		const {babyId, switchObj, startDate, endDate, selectedTrackingArr} = this.state
		const {babies, exportTrackingApi, str, selected_baby} = this.props
		let trackingTypeArr = []
		let updatedTrackingArr =[]
		if (babies && babies.length > 0) {
			for (const key in switchObj) {
				if (switchObj.hasOwnProperty(key)) {
					const element = switchObj[key];
					element === true && key !== KeyUtils.TRACKING_TYPE_SELECT_ALL  && trackingTypeArr.push(key)
				}
			}
			// updatedTrackingArr = trackingTypeArr.filter(val => selectedTrackingArr.includes(val))
			if(trackingTypeArr.length > 0){
				trackingTypeArr.forEach(el=>{
				  updatedTrackingArr.push(el)
			/*		el === "1" && updatedTrackingArr.push("breastfeeding")
					el === "2" && updatedTrackingArr.push("pumping")
					el === "3" && updatedTrackingArr.push("bottle")
					el === "4" && updatedTrackingArr.push("diaper")
					el === "5" && updatedTrackingArr.push("sleep")
					el === "6" && updatedTrackingArr.push("weight")
					el === "7" && updatedTrackingArr.push("height")*/
				})
				this.trackingObj = {
					"babyClientId": selected_baby.babyId,
					"startDate": moment(startDate).format('YYYY-MM-DD'),
					"endDate": moment(endDate).format('YYYY-MM-DD'),
					"trackingTypes": updatedTrackingArr,
					"exportType": I18n.t('stats_list_export.export_type'),
					"exportLanguage": locale().replace("-", "_")
				}

				this.setState({isLoading: true })
				exportTrackingApi(this.trackingObj)
			}else{
				alert(I18n.t('stats_list_export.plz_select_data'))
			}
		}
	}

	negativeOnPress = () => {
		this.setState({
			selectedDate: moment().format(),
			showCalendarPicker: false
		})
	}
	positiveOnPress = async (startDate, endDate, btnSelected) => {
		this.setState({
			startDate,
			endDate: endDate != 'Invalid date' ? endDate : startDate,
			formattedStartDate: await getDateFormat(startDate),
			formattedEndDate: await getDateFormat(endDate),
			showCalendarPicker: false,
			btnSelected	,
			selectedDate: startDate
		})
	}

	showCustomCalendar = () =>{
		const{showCalendarPicker, selectedDate, btnSelected, startDate, endDate}= this.state
		return (
			<CustomCalendar
				visible={showCalendarPicker}
				title={I18n.t('login.forgot_password_title')}
				message={I18n.t('login.forgot_password_message')}
				positive={I18n.t('login.ok')}
				negative={I18n.t('login.cancel')}
				selectedDate={selectedDate}
				maxDate={new Date()}
				minDate={new Date().getDate()-5}
				negativeOnPress={() => this.negativeOnPress()}
				positiveOnPress={(startDate, endDate, btnSelected)=> this.positiveOnPress(startDate, endDate, btnSelected)}
				onDismiss={() => {
				}}
				onDateChange={(date) => this.setState({selectedDate: moment(date).format()})}
				showHeader={true}
				notShowTime={true}
				showStatsBtn={true}
				btnSelected={btnSelected}
				selectedCustomDates={[startDate, endDate]}
			/>
		)
	}
	calendarLogoOnclick =()=>{
		const{dateRangeSwitchSelected}=this.state
		if(!dateRangeSwitchSelected){
			this.setState({showCalendarPicker: true})
		}
	}

  noDataPopUp(){
    const {showSuccessFailurePopup} = this.state
    const{navigation}=this.props
    return (
      <Dialog
        visible={showSuccessFailurePopup}
        title={this.isSuccess?I18n.t('stats_list_export.export_succeeded'):I18n.t('stats_list_export.export_failed')}
        message={this.isSuccess?I18n.t('stats_list_export.export_success_message'):I18n.t('stats_list_export.export_fail_message')}
        positive={this.isSuccess?I18n.t('bluetooth.ok'):I18n.t('generic.close')}
        positiveOnPress={() => {
          this.setState({showSuccessFailurePopup: false})
          this.isSuccess && navigation.goBack()
          //this.isSuccess
        }}
        onDismiss={() => {
        }}
      />
    )
  }

  formatDateInArabic=(date)=>{
    let year =  moment(date).format("YYYY")
    year=I18n.locale.includes('ar')?engToArabicNumber(year): year
    let dayName = moment(date).format('DD')
    dayName=I18n.locale.includes('ar')?engToArabicNumber(dayName.split('').filter(v=>!isNaN(parseInt(v))).join('')):dayName;
    let monthName = moment(date).format('MMMM')
    monthName=I18n.locale.includes('ar')?monthsArab[monthsEng.findIndex(val=>val.includes(monthName))] :monthName;
    return `${dayName} ${monthName} ${year}`;
  }
  render(){
		const{isLoading, showCalendarPicker, startDate, endDate, formattedStartDate, formattedEndDate, dateRangeSwitchSelected, getData,showSuccessFailurePopup}= this.state
		const{navigation, themeSelected}=this.props
		let calendarDisabledColor = Colors.rgb_898d8d33
		let calendarActiveColor = Colors.rgb_898d8d
		themeSelected === "dark" && (calendarDisabledColor = Colors.rgb_898d8d) && (calendarActiveColor =  Colors.rgb_898d8d33)
	return(
    	<SafeAreaView style={styles.container}>
			<HeaderStats
				navigation={navigation}
				title={I18n.t('stats_list_export.header_title')}
				onBackPress={() => {navigation.goBack()}}
				isListViewSelected={true}
				onBabyListPress={(item) => {}}
				statsExport={true}
				showCalendarIcon={false}
			/>


			<View style={styles.contentView}>
				<View>
					<Text maxFontSizeMultiplier={1.7} style={[styles.titleTextStyle,{color:this.textColor}]}>{I18n.t('stats_list_export.date_range_text')}</Text>
				</View>
				<View style={styles.selectAllView}>
					<Text
            accessibilityLabel={I18n.t("accessibility_labels.data_range_all")}
            accessible={true}
            maxFontSizeMultiplier={1.7} style={[styles.allTextStyle,{color:this.textColor}]}>{I18n.t('stats_list_export.select_all_text')}</Text>
					{this.dateRangeSwitch()}
				</View>
				<View style={styles.selectDateView}>
					<Text maxFontSizeMultiplier={1.7} style={[styles.allTextStyle,{color:this.textColor,alignSelf:'center'}]}>{I18n.t('stats_list_export.select_date_text')}</Text>
					<View style={styles.calendarTextWraper}>
						{ !dateRangeSwitchSelected &&
							<Text maxFontSizeMultiplier={1.7} style={[styles.startEndDateStyle,{color:this.textColor}]}>{(formattedStartDate) + ' - ' + (formattedEndDate)}</Text>
						}
						<TouchableOpacity
              accessibilityLabel={I18n.t("accessibility_labels.calendar")}
              accessible={true}
              style={{width:48,height:48,justifyContent:'center',alignItems:'flex-end'}} activeOpacity={1} onPress={()=>this.calendarLogoOnclick()} >
							{dateRangeSwitchSelected ?<CalendarLogo fill={calendarDisabledColor}/>:<CalendarLogo fill={calendarActiveColor}/>}
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.itemContentView}>
					<Text maxFontSizeMultiplier={1.7} style={[styles.titleTextStyle, {marginVertical: 10,color:this.textColor}]}>{I18n.t('stats_list_export.item_header_title')}</Text>
					<FlatList
            style={{marginBottom:350}}
            showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) => index.toString()}
						data={getData}
						ListEmptyComponent={this.emptyView()}
						renderItem={this.renderListItem}
					/>
				</View>
			</View>
			<View style={styles.exportDataBtnView}>
				<Button title={I18n.t('stats_list_export.export_button_title')}
					disabled={getData.length>0?false:true}
					textStyle={styles.exportBtnTextStyle}
					style={styles.exportButtonStyles}
					onPress={() => this.onClickExport()}
				/>
			</View>
			{showCalendarPicker && this.showCustomCalendar()}
			{isLoading && <LoadingSpinner/>}
			{showSuccessFailurePopup && this.noDataPopUp()}
    	</SafeAreaView>
  	)
  }
}

const mapStateToProps = (state) => ({
	babies: state.home.babies,
	userProfile: state.user.userProfile,
	exportTrackingApiSuccess: state.home.exportTrackingApiSuccess,
	exportTrackingApiFailure: state.home.exportTrackingApiFailure,
	getTrackingResponse: state.home.getTrackingResponse,
	selected_baby: state.home.selected_baby,
	themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
	exportTrackingApi: (trackingData) =>
    dispatch(HomeActions.exportTrackingApi(trackingData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatsExportListScreen);
