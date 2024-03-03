import React from 'react'
import {Dimensions, FlatList, I18nManager, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
const windowWidth = Dimensions.get('window').width;
import {SwipeRow} from 'react-native-swipe-list-view';
import HeaderStats from "@components/HeaderStats";
import StatsBreastfeeding from "@components/StatsBreastfeeding";
import StatsPumping from "@components/StatsPumping";
import StatsBottle from '@components/StatsBottle';
import StatsNappy from '@components/StatsNappy';
import StatsWeight from '@components/StatsWeight';
import StatsGrowth from '@components/StatsGrowth';
import StatsSleep from '@components/StatsSleep';
import StatsListItem from "@components/StatsListItem";
import GroupedBarChart from '@components/GroupedBarChart'
import StackedBarChart from '@components/StackedBarChart'
import SingleBarChartTwoYears from '@components/SingleBarChartTwoYears'
import SingleBarChart from '@components/SingleBarChart'
import SleepSingleBarChart from '@components/SleepSingleBarChart'
import SwitchButton from "@components/SwitchButton";
import LoadingSpinner from "@components/LoadingSpinner";
import CustomCalendar from "@components/CustomCalendar";
import HomeActions from '@redux/HomeRedux';
import I18n from 'react-native-i18n';
import {connect} from 'react-redux';
import Colors from '@resources/Colors';
import ActiveBreastFeedingIcon from '@svg/ic_stats_breastfeedingactive';
import ActivePumpingIcon from '@svg/pumping';
import ActiveSelectAllIcon from '@svg/ic_avatar_selected_all';
import ContractionActiveIcon from '@svg/ic_contraction_stats.svg';
import SelectAllIcon from '@svg/ic_stats_selectedall';
import BottleIcon from '@svg/ic_avatar_bottle';
import WeightIcon from '@svg/ic_avatar_weight';
import GrowthIcon from '@svg/ic_avatar_growth';
import AvatarSleepIcon from '@svg/ic_avatar_sleep';
import BreastFeedingIcon from '@svg/ic_breastfeeding';
import NappyIcon from '@svg/ic_stats_nappy';
import LeftIcon from '@svg/arrow_left';
import ForwardIcon from '@svg/arrow_right';
import moment from 'moment';
import KeyUtils from "@utils/KeyUtils";
import styles from './Styles/StatsScreenStyles';
import StatsTrackingHeader from "../StaticData/stats/StatsTrackingHeader";
import EmptyTrackingTypeIcon from '@svg/ic_empty_export_list';
import {deleteTrackingItem, readTrackingSchemaItems} from "@database/TrackingDatabase";
import StatsContraction from "@components/StatsContraction";
import MotherGroupedBarChart from "@components/MotherGroupedBarChart";
import {createTrackedItem} from "../Database/TrackingDatabase";
import AsyncStorage from '@react-native-community/async-storage';
import { getHeightUnits, getVolumeUnits,monthsArab,monthsEng, getWeightUnits, engToArabicNumber, weekdaysEng, weekdaysArab, volumeConversionHandler } from '@utils/locale';
import { deleteFreezerFromDb } from "../Database/VirtualFreezerDatabase";
import { verticalScale, moderateScale } from "@resources/Metrics";
import {convertSecToMinutes,getTimeFormat} from "@utils/TextUtils";
import DeviceInfo from 'react-native-device-info'
import { Analytics } from '@services/Firebase';
import { getRealmDb } from '../Database/AddBabyDatabase';
import { TouchableHighlight } from 'react-native-gesture-handler';

let analytics = new Analytics()

class StatsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isListViewSelected: true,
      isTodaySelected: true,
      isLoading: false,
      babyId: '',
      trackingData: [],
      listTrackingData:[],
      WhoTrackingData: [],
      pastDaysTrackingData: [],
      motherPastDaysTrackingData: [],
      motherTrackingData: [],
      typeSelected: KeyUtils.TRACKING_TYPE_SELECT_ALL,
      barColorSet: [],
      last7Days: [],
      last7DaysSelectedIndex: 6,
      showCalendarPicker: false,
      selectedDate: moment().subtract(7, 'days'),
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      refreshing: false,
      noMoreFound: false,
      noMoreListFound: false,
      noMorePastDaysFound: false,
      noMoreMotherFound: false,
      noMoreMotherPastDaysFound: false,
      customCalendarDate: moment().format('YYYY-MM-DD'),
      realmTracking: null,
      motherGraphType:'duration',
      isImperial:true,
      units:KeyUtils.UNIT_IMPERIAL,
      weightUnit:'',
      heightUnit:'',
      volumeUnit:'',
      todayToggleSwitchState:true,
      graphType:'who',
      showExportCalendarPicker:false,
      listExportDate:moment().format('YYYY-MM-DD'),
      btnExportSelected:I18n.t('calendar.period'), 
      startListDate:moment().format('YYYY-MM-DD'), 
      endListDate:moment().format('YYYY-MM-DD'),
      userLocale: ''
    };
    this.pageNumber = 1
    this.listPageNumber = 1
    this.past7DaysPageNumber = 1
    this.motherTrackingPageNumber = 1
    this.motherTrackingPast7DaysPageNumber = 1
    this.isDateSelectedFromCalendar=false
    this.rows = {};
    this.themeSelected=''
    this.textColor=this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.whoLoadMore=true,
    this.whoPageNumber=1
  }
  sessionCallback=()=>{

  }

    async handleSessionNavigation(prevState,prevProps,trackingId) {
      let realmTracking = await getRealmDb()
      let myItems = realmTracking.objects('Tracking');
      let arr = JSON.parse(JSON.stringify(myItems))
      arr = arr.filter((e) => {
        return !e.isMother && e.id === trackingId
      })
      if (arr.length > 0) {
        this.setState({
          trackingData: prevState.trackingData.concat(arr),
          listTrackingData:prevState.listTrackingData.concat(arr),
          pastDaysTrackingData:prevState.trackingData.concat(arr),
        })
      }
  }


  async componentDidMount() {
    const {navigation, selected_baby, babies,themeSelected} = this.props;
    let today = moment().format('YYYY-MM-DD');
    getTimeFormat(true).then((e) => this.setState({ formattedTime: e}))
    this.themeSelected=themeSelected === 'dark' && (itemBackgroundColor = Colors.rgb_000000)
    this.setState({isLoading: true})
    this.focusListener = navigation.addListener('didFocus', async () => {
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      Promise.all([getWeightUnits(),getHeightUnits(),getVolumeUnits()]).then((values)=>{
        this.setState({weightUnit:values[0]===KeyUtils.UNIT_KG?KeyUtils.UNIT_GRAM:values[0],heightUnit:values[1]===KeyUtils.UNIT_CM?KeyUtils.UNIT_MM:values[1],volumeUnit:values[2]})
      })
      if (babies && babies.length > 0) {
        const {startDate}=this.state;
        let getSelectedDateConfig=this.setSelectedDateAndIndex(startDate);
        this.setState({
          babyId: selected_baby.babyId,
          last7Days: this.last7Days(),
          //last7DaysSelectedIndex: 6,
          last7DaysSelectedIndex: getSelectedDateConfig.index,
        })
        const {typeSelected}=this.state
        //this.selectedDate = moment().format('YYYY-MM-DD')

        if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
          this.motherTrackingPageNumber = 1
          this.motherTrackingPast7DaysPageNumber = 1
          this.callMotherTrackingApi()
        }else{
          this.pageNumber = 1
          this.past7DaysPageNumber = 1
          this.callWhoTrackingAPi()
          this.callTrackingAPi()
          }
      } else {
        this.setState({isLoading: false})
      }

     AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
       if (_units!=null){
         this.setState({isImperial:_units===KeyUtils.UNIT_IMPERIAL,units:_units})
       }
     })

    if (navigation.state.params && navigation.state.params.pumping) {
      this.setState({
        typeSelected: KeyUtils.TRACKING_TYPE_PUMPING,
        barColorSet: [Colors.rgb_efdae3, Colors.rgb_daeffa]
      })
    }

    if(navigation.state.params && navigation.state.params.statListView){
      this.setState({
        isListViewSelected: true,
        typeSelected: KeyUtils.TRACKING_TYPE_PUMPING,
        barColorSet: [Colors.rgb_efdae3, Colors.rgb_daeffa]
      })
    }
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((userLocale)=>{ 
      this.setState({ userLocale })
    })
    });
    await analytics.logScreenView('stats_screen')
  }

  componentWillUnmount() {
   this.focusListener.remove();
    const {realmTracking} = this.state
    if (realmTracking != null && !realmTracking.isClosed) {
    }
  }

  async callWhoTrackingAPi() {
    const {getWhoTrackingApi ,selected_baby, isInternetAvailable} = this.props
    const {typeSelected} = this.state
    if (isInternetAvailable && (typeSelected==KeyUtils.TRACKING_TYPE_GROWTH || typeSelected==KeyUtils.TRACKING_TYPE_WEIGHT) ) {
      getWhoTrackingApi(selected_baby.birthday, moment().format('YYYY-MM-DD'), selected_baby.babyId, this.whoPageNumber, 100,typeSelected)
    }
  }

  async callTrackingAPi() {
    const {getTrackingApi,getWhoTrackingApi ,selected_baby, isInternetAvailable} = this.props
    const {isTodaySelected, past7DaysStartDate, past7DaysEndDate} = this.state
    if (selected_baby && selected_baby.babyId) {
      const {isListViewSelected, startDate, endDate,startListDate,endListDate} = this.state
      this.setState({isLoading: true})
      if (isInternetAvailable) {
         if (isListViewSelected ) {
          if(this.isDateSelectedFromCalendar){
            getTrackingApi(startListDate, moment(endListDate).format('YYYY-MM-DD'), selected_baby.babyId, this.listPageNumber, 100)
          }
          else{
            getTrackingApi('', '', selected_baby.babyId, this.listPageNumber, 100)
          }
        }
       else if (isTodaySelected ) {
          getTrackingApi(startDate, moment(endDate).format('YYYY-MM-DD'), selected_baby.babyId, this.pageNumber, 100)
        } else {
          getTrackingApi(past7DaysStartDate, moment(past7DaysEndDate).add(0, 'days').format('YYYY-MM-DD'), selected_baby.babyId, this.past7DaysPageNumber, 100)
        }

      } else {
        let realmTracking = await getRealmDb()
        let myItems = realmTracking.objects('Tracking');
        let arr = JSON.parse(JSON.stringify(myItems))
        arr=arr.filter((e)=>{
          return !e.isMother
        })
        this.setState({
          isLoading: false,
          refreshing: false,
          trackingData: arr,
          listTrackingData:arr,
          pastDaysTrackingData: arr,
          realmTracking
        })
        console.log('offline data',arr)
      }
    }

  }

  last7Days(past7daysDate) {
    let daysArray = []
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return '6543210'.split('').map(function (n) {
      var d = new Date();
      if (past7daysDate !== undefined) {
        d = new Date(past7daysDate)
      }

      d.setDate(d.getDate() - n);
      let daysAgo = {}
      return (function (day, month, year, d) {
        daysAgo.dayName = days[d.getDay()]
        daysAgo.dateOfMonth = day < 10 ? '0' + day : day
        daysAgo.date = [year, month < 10 ? '0' + month : month, day < 10 ? '0' + day : day,].join('-')
        return daysAgo
      })(d.getDate(), d.getMonth() + 1, d.getFullYear(), d);
      daysArray.push(daysAgo)
    });
  }

  sevenDaysView() {
    const {selectedDate} = this.state
    let daysArray = []
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return '3210123'.split('').map(function (n, index) {
      var d = new Date(selectedDate);
      if (index > 3) {
        d.setDate(d.getDate() + parseInt(n));
      } else {
        d.setDate(d.getDate() - n);
      }
      let daysAgo = {}
      return (function (day, month, year, d) {
        daysAgo.dayName = days[d.getDay()]
        daysAgo.dateOfMonth = day < 10 ? '0' + day : day
        daysAgo.date = [year, month < 10 ? '0' + month : month, day < 10 ? '0' + day : day,].join('-')
        return daysAgo
      })(d.getDate(), d.getMonth() + 1, d.getFullYear(), d);
      daysArray.push(daysAgo)
    });
  }


  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {
      getTrackingApiFailure,
      getTrackingApiSuccess,
      getWhoTrackingApiSuccess,
      getWhoTrackingApiFailure,
      deleteTrackingId,
      getTrackingResponse,
      getWhoTrackingResponse,
      getMotherTrackingApiFailure,
      getMotherTrackingApiSuccess,
      getMotherTrackingResponse,
      deleteTrackingSuccess,
      deleteTrackingFailure,
      deleteMotherTrackingId,
      deleteMotherTrackingSuccess,
      deleteMotherTrackingFailure,
      selected_baby,
      trackingId,
      deleteFreezerInventoryApiResponse,
      appState
    } = this.props
    const {isTodaySelected, isListViewSelected, trackingData,motherTrackingData,typeSelected,listTrackingData} = this.state

    if (appState && appState != prevProps.appState) {
      if (appState === 'background' || (appState === 'active')) {
        getTimeFormat(true).then((e) => this.setState({ formattedTime: e}))
      }
    }
    if (trackingId && trackingId!==prevProps.trackingId){
      this.handleSessionNavigation(prevState,prevProps,trackingId)
    }
    if (selected_baby!=prevProps.selected_baby){
      if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
        this.callMotherTrackingApi()
      }else{
        this.callTrackingAPi()
        this.callWhoTrackingAPi()
      }
    }

    if (deleteTrackingSuccess != prevProps.deleteTrackingSuccess && deleteTrackingSuccess && prevState.isLoading) {
      deleteTrackingItem(deleteTrackingId)
      let data = trackingData.filter((e) => {
        return e.id !== deleteTrackingId
      })
      if(isListViewSelected){
        var listData = listTrackingData.filter((e) => {
          return e.id !== deleteTrackingId
        })
      }
      this.setState({isLoading: false, trackingData: data,...isListViewSelected&&{listTrackingData:listData}})
    }

    if (deleteTrackingFailure != prevProps.deleteTrackingFailure && deleteTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }

    if (deleteMotherTrackingSuccess != prevProps.deleteMotherTrackingSuccess && deleteMotherTrackingSuccess && prevState.isLoading) {
     // deleteTrackingItem(deleteMotherTrackingId)
      let data = motherTrackingData.filter((e) => {
        return e.id !== deleteMotherTrackingId
      })
      this.setState({isLoading: false, motherTrackingData: data})
    }

    if (deleteMotherTrackingFailure != prevProps.deleteMotherTrackingFailure && deleteMotherTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }

    if (getTrackingApiSuccess != prevProps.getTrackingApiSuccess && getTrackingApiSuccess && prevState.isLoading) {
      if(isListViewSelected){
        let data = JSON.parse(JSON.stringify(getTrackingResponse))
        this.setState({
          isLoading: false,
          listTrackingData: this.listPageNumber === 1 ? data.reverse() : prevState.listTrackingData.concat(data.reverse()),
          refreshing: false
        })
        console.log('getTrackingResponse',this.state.listTrackingData.length)
      }

     else if (isTodaySelected) {
        let data = JSON.parse(JSON.stringify(getTrackingResponse))
        this.setState({
          isLoading: false,
          trackingData: this.pageNumber === 1 ? data.reverse() : prevState.trackingData.concat(data.reverse()),
          refreshing: false
        })
      } else {
        let data = JSON.parse(JSON.stringify(getTrackingResponse))
        this.setState({
          isLoading: false,
          pastDaysTrackingData: this.past7DaysPageNumber === 1 ? data.reverse() : prevState.pastDaysTrackingData.concat(data.reverse()),
          refreshing: false
        })
      }
    }
    if (getTrackingApiFailure != prevProps.getTrackingApiFailure && getTrackingApiFailure && prevState.isLoading) {
     if(isListViewSelected){
      this.setState({isLoading: false, refreshing: false, noMoreListFound: true})
      if (this.listPageNumber === 1) {
      this.setState({listTrackingData: getTrackingResponse})
      }
     }

      else if (isTodaySelected) {
        this.setState({isLoading: false, refreshing: false, noMoreFound: true})
        if (this.pageNumber === 1) {
          // this.setState({trackingData: getTrackingResponse})
        }
      } else {
        this.setState({isLoading: false, refreshing: false, noMorePastDaysFound: true})
        if (this.past7DaysPageNumber === 1) {
          //this.setState({trackingData: getTrackingResponse})
        }
      }

    }

    if (getWhoTrackingApiSuccess != prevProps.getWhoTrackingApiSuccess && getWhoTrackingApiSuccess ) {
        let data = JSON.parse(JSON.stringify(getWhoTrackingResponse))
        this.setState({
          WhoTrackingData: this.whoPageNumber === 1 ? data.reverse() : prevState.WhoTrackingData.concat(data.reverse()),
          refreshing: false
        })
        if(data.length>0 && this.whoLoadMore ){
            this.whoPageNumber +=1
            this.callWhoTrackingAPi()
        }
        else{
          this.whoPageNumber = 1
        }
console.log('WhoTrackingData',this.state.WhoTrackingData)
    }
    if (getWhoTrackingApiFailure != prevProps.getWhoTrackingApiFailure && getWhoTrackingApiFailure && prevState.isLoading) {
        this.whoLoadMore = false
    }
    if (getMotherTrackingApiSuccess != prevProps.getMotherTrackingApiSuccess && getMotherTrackingApiSuccess && prevState.isLoading) {
      if (isTodaySelected || isListViewSelected) {
        let data = JSON.parse(JSON.stringify(getMotherTrackingResponse))
        this.setState({
          isLoading: false,
          motherTrackingData: this.motherTrackingPageNumber === 1 ? data.reverse() : prevState.motherTrackingData.concat(data.reverse()),
          refreshing: false
        })
      } else {
        let data = JSON.parse(JSON.stringify(getMotherTrackingResponse))
        this.setState({
          isLoading: false,
          motherPastDaysTrackingData: this.motherTrackingPast7DaysPageNumber === 1 ? data.reverse() : prevState.trackingData.concat(data.reverse()),
          refreshing: false
        })
      }
    }
    if (getMotherTrackingApiFailure != prevProps.getMotherTrackingApiFailure && getMotherTrackingApiFailure && prevState.isLoading) {
      if (isTodaySelected || isListViewSelected) {
        this.setState({isLoading: false, refreshing: false, noMoreMotherFound: true})
        if (this.motherTrackingPageNumber === 1) {
          this.setState({
            motherTrackingData:[]
          })
        }
      } else {
        this.setState({isLoading: false, refreshing: false, noMoreMotherPastDaysFound: true})
        if (this.motherTrackingPast7DaysPageNumber === 1) {
          this.setState({
            motherPastDaysTrackingData:[]
          })
        }
      }

    }

    if (deleteFreezerInventoryApiResponse != prevProps.deleteFreezerInventoryApiResponse && Object.keys(deleteFreezerInventoryApiResponse).length !== 0) {
      deleteFreezerFromDb(deleteFreezerInventoryApiResponse.successIds[0])
     }
  }

  async callMotherTrackingApi() {
    const {getMotherTrackingApi, selected_baby, isInternetAvailable} = this.props
    const {isTodaySelected, past7DaysStartDate, past7DaysEndDate} = this.state
    const {isListViewSelected, startDate, endDate} = this.state
    this.setState({isLoading: true})

    if (isInternetAvailable) {
      /*let startDate=isListViewSelected ? this.listViewSelectedDate : this.selectedDate*/
      //  let startDate=this.selectedDate
      if (isTodaySelected || isListViewSelected) {
        getMotherTrackingApi(startDate, moment(endDate).format('YYYY-MM-DD'), this.motherTrackingPageNumber, 50)
      } else {
        getMotherTrackingApi(past7DaysStartDate, moment(past7DaysEndDate).format('YYYY-MM-DD'), this.motherTrackingPast7DaysPageNumber, 50)
      }

    } else {
      let realmTracking = await getRealmDb()
      let myItems = realmTracking.objects('Tracking');
      let arr = JSON.parse(JSON.stringify(myItems))
      arr = arr.filter((e) => {
        return e.isMother
      })
      this.setState({
        isLoading: false,
        refreshing: false,
        motherTrackingData: arr,
        motherPastDaysTrackingData: arr,
        realmTracking
      })
    }
  }

  getAvatarImage = (item) => {
    const {typeSelected} = this.state
    const {trackingType} = item
    switch (trackingType) {
      case KeyUtils.TRACKING_TYPE_SELECT_ALL: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.all_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.setState({typeSelected: KeyUtils.TRACKING_TYPE_SELECT_ALL,isTodaySelected:true})
            }}>
            {typeSelected === trackingType ?
              <SelectAllIcon width={48} height={48}/>:
              <ActiveSelectAllIcon width={48} height={48} fill={this.themeSelected? Colors.rgb_ffe9c0: Colors.rgb_fdf1d2} />
            }

          </TouchableHighlight>
        );
      }
      case KeyUtils.TRACKING_TYPE_BREASTFEEDING: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.breastfeeding_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.setState({
                typeSelected: KeyUtils.TRACKING_TYPE_BREASTFEEDING,
                barColorSet:this.themeSelected? [Colors.rgb_ffe0d3, Colors.rgb_eddced]:[Colors.rgb_fae7dd, Colors.rgb_eddced]
              })
            }}>
            {typeSelected === trackingType ?
              <BreastFeedingIcon width={48} height={48} fill={Colors.white}/>:
              <ActiveBreastFeedingIcon width={48} height={48} fill={this.themeSelected? Colors.rgb_ffe0d3: Colors.rgb_fae7dd}/>
            }

          </TouchableHighlight>
        );
      }
      case KeyUtils.TRACKING_TYPE_PUMPING: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.pumping_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.setState({
                typeSelected: KeyUtils.TRACKING_TYPE_PUMPING,
                barColorSet: this.themeSelected? [Colors.rgb_eecad7,Colors.rgb_bce9fd]:[Colors.rgb_efdae3, Colors.rgb_daeffa]
              })
            }}>
            {typeSelected === trackingType ?
              <ActivePumpingIcon width={48} height={48} fill={Colors.white}/> :
              <ActivePumpingIcon width={48} height={48} fill={this.themeSelected?Colors.rgb_eecad7:Colors.rgb_efdae3}/>
            }
          </TouchableHighlight>
        );
      }
      case KeyUtils.TRACKING_TYPE_BOTTLE: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.bottle_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.setState({
                typeSelected: KeyUtils.TRACKING_TYPE_BOTTLE,
                barColorSet:this.themeSelected?[Colors.rgb_d9ddde,Colors.rgb_eoedcd,Colors.rgb_f9e3d7]:[Colors.rgb_e0e4e5, Colors.rgb_eaf2de, Colors.rgb_fae7dd]
              })
            }}>
            {typeSelected === trackingType ?
              <BottleIcon width={48} height={48} fill={Colors.white}/> :
              <BottleIcon width={48} height={48} fill={this.themeSelected?Colors.rgb_eoedcd:Colors.rgb_eaf2de}/>
            }
          </TouchableHighlight>
        );
      }
      case KeyUtils.TRACKING_TYPE_DIAPER: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.nappy_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.setState({
                typeSelected: KeyUtils.TRACKING_TYPE_DIAPER,
                barColorSet:this.themeSelected?[Colors.rgb_d1d6d7,Colors.rgb_baf4f5,Colors.rgb_f5e3b7]:[Colors.rgb_e0e4e5, Colors.rgb_cdf6f7, Colors.rgb_fdf1d2]
              })
            }}>
            {typeSelected === trackingType ?
              <NappyIcon width={48} height={48} fill={Colors.white}/> :
              <NappyIcon width={48} height={48} fill={this.themeSelected?Colors.rgb_baf4f5:Colors.rgb_cdf6f7} />
            }
          </TouchableHighlight>
        );
      }
      case KeyUtils.TRACKING_TYPE_WEIGHT: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.weight_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.setState({
                typeSelected: KeyUtils.TRACKING_TYPE_WEIGHT,
                barColorSet:this.themeSelected?[Colors.rgb_d0b4cd]:[Colors.rgb_eddced],
              }, () => {
                this.callWhoTrackingAPi()
              })
            }}>
            {typeSelected === trackingType ?
              <WeightIcon width={48} height={48} fill={Colors.white} /> :
              <WeightIcon width={48} height={48} fill={this.themeSelected?Colors.rgb_d0b4cd:Colors.rgb_eddced} />
            }
          </TouchableHighlight>
        );
      }
      case KeyUtils.TRACKING_TYPE_GROWTH: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.length_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.setState({
                typeSelected: KeyUtils.TRACKING_TYPE_GROWTH,
                barColorSet:this.themeSelected?[Colors.rgb_fbe7c2]: [Colors.rgb_fdf1d2],
              }, () => {
                this.callWhoTrackingAPi()
              })
            }}>
            {typeSelected === trackingType ?
              <GrowthIcon width={48} height={48} fill={Colors.white} /> :
              <GrowthIcon width={48} height={48} fill={this.themeSelected?Colors.rgb_fbe7c2: Colors.rgb_fdf1d2}/>
            }

          </TouchableHighlight>
        );
      }
      case KeyUtils.TRACKING_TYPE_SLEEP: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.sleep_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.setState({
                typeSelected: KeyUtils.TRACKING_TYPE_SLEEP,
                barColorSet: this.themeSelected?[Colors.rgb_bce9fd]:[Colors.rgb_daeffa]
              })
            }}>
            {typeSelected === trackingType ?
              <AvatarSleepIcon width={48} height={48} fill={Colors.white}/> :
              <AvatarSleepIcon width={48} height={48} fill={this.themeSelected?Colors.rgb_bce9fd:Colors.rgb_daeffa}/>
            }
          </TouchableHighlight>
        );
      }
      case KeyUtils.TRACKING_TYPE_CONTRACTION: {
        return (
          <TouchableHighlight accessible={true} accessibilityLabel={I18n.t('accessibility_labels.contraction_tracking_label')}
          style={[styles.avatarView,{borderColor:typeSelected === trackingType ?Colors.rgb_898d8d99:Colors.white}]}
            onPress={() => {
              this.callMotherTrackingApi()
              this.setState({
                typeSelected: KeyUtils.TRACKING_TYPE_CONTRACTION,
                barColorSet:this.themeSelected?[Colors.rgb_c2c5c6, Colors.rgb_cdf6f7]:[Colors.rgb_e0e4e5, Colors.rgb_cdf6f7]
              })
            }}>
            {typeSelected === trackingType ?
              <ContractionActiveIcon width={48} height={48} fill={Colors.white}/> :
              <ContractionActiveIcon width={48} height={48} fill={this.themeSelected?Colors.rgb_c2c5c6:Colors.rgb_e0e4e5}/>
            }
          </TouchableHighlight>
        );
      }
    }
  };

  renderItem = ({item}) => {
    return (
      <View style={styles.horizontalRenderItemView}>
        {this.getAvatarImage(item)}
      </View>
    );
  };

  onItemPress(trackingType){
    switch (trackingType) {
      case KeyUtils.TRACKING_TYPE_SELECT_ALL:
        this.setState({typeSelected: KeyUtils.TRACKING_TYPE_SELECT_ALL})
        break;
      case KeyUtils.TRACKING_TYPE_BREASTFEEDING:
        this.setState({typeSelected: KeyUtils.TRACKING_TYPE_BREASTFEEDING, barColorSet: this.themeSelected? [Colors.rgb_ffe0d3, Colors.rgb_eddced]:[Colors.rgb_fae7dd, Colors.rgb_eddced]})
        break;
      case KeyUtils.TRACKING_TYPE_PUMPING:
        this.setState({typeSelected: KeyUtils.TRACKING_TYPE_PUMPING, barColorSet: this.themeSelected? [Colors.rgb_eecad7,Colors.rgb_bce9fd]:[Colors.rgb_efdae3, Colors.rgb_daeffa]})
        break;
      case KeyUtils.TRACKING_TYPE_BOTTLE:
        this.setState({typeSelected: KeyUtils.TRACKING_TYPE_BOTTLE, barColorSet: this.themeSelected?[Colors.rgb_d9ddde,Colors.rgb_eoedcd,Colors.rgb_f9e3d7]:[Colors.rgb_e0e4e5, Colors.rgb_eaf2de, Colors.rgb_fae7dd]})
        break;
      case KeyUtils.TRACKING_TYPE_DIAPER:
        this.setState({typeSelected: KeyUtils.TRACKING_TYPE_DIAPER, barColorSet: this.themeSelected?[Colors.rgb_d1d6d7,Colors.rgb_baf4f5,Colors.rgb_f5e3b7]:[Colors.rgb_e0e4e5, Colors.rgb_cdf6f7, Colors.rgb_fdf1d2]})
      break;
      case KeyUtils.TRACKING_TYPE_WEIGHT:
        this.setState({typeSelected: KeyUtils.TRACKING_TYPE_WEIGHT, barColorSet: this.themeSelected?[Colors.rgb_d0b4cd]:[Colors.rgb_eddced],})
        break;
      case KeyUtils.TRACKING_TYPE_GROWTH:
        this.setState({typeSelected: KeyUtils.TRACKING_TYPE_GROWTH, barColorSet: this.themeSelected?[Colors.rgb_fbe7c2]: [Colors.rgb_fdf1d2],})
        break;
      case KeyUtils.TRACKING_TYPE_SLEEP:
        this.setState({typeSelected: KeyUtils.TRACKING_TYPE_SLEEP, barColorSet: this.themeSelected?[Colors.rgb_bce9fd]:[Colors.rgb_daeffa]})
        break;
    }
  }

  renderDayView = ({item}) => {
    const {trackingType, isMother} = item
    const {isTodaySelected, isImperial,units} = this.state
    let themeSelected=this.props.themeSelected === 'dark'
    if (!isMother) {
      return (
        <View style={{flex: 1, marginHorizontal: 5}}>
          {trackingType === KeyUtils.TRACKING_TYPE_BREASTFEEDING &&
          <StatsBreastfeeding themeSelected={themeSelected} textColor={this.textColor} isTodaySelected={isTodaySelected} item={item}  onItemPress={(trackingType)=>this.onItemPress(trackingType)}/>}
          {trackingType === KeyUtils.TRACKING_TYPE_PUMPING &&
          <StatsPumping themeSelected={themeSelected} textColor={this.textColor} isTodaySelected={isTodaySelected} item={item} isImperial={isImperial} units={units} onItemPress={(trackingType)=>this.onItemPress(trackingType)}/>}
          {trackingType === KeyUtils.TRACKING_TYPE_BOTTLE &&
          <StatsBottle themeSelected={themeSelected} textColor={this.textColor} isTodaySelected={isTodaySelected} item={item} isImperial={isImperial} units={units} onItemPress={(trackingType)=>this.onItemPress(trackingType)}/>}
          {trackingType === KeyUtils.TRACKING_TYPE_DIAPER &&
          <StatsNappy themeSelected={themeSelected} textColor={this.textColor} isTodaySelected={isTodaySelected} item={item} onItemPress={(trackingType)=>this.onItemPress(trackingType)}/>}
          {trackingType === KeyUtils.TRACKING_TYPE_SLEEP &&
          <StatsSleep themeSelected={themeSelected} textColor={this.textColor} isTodaySelected={isTodaySelected} item={item} onItemPress={(trackingType)=>this.onItemPress(trackingType)}/>}
          {trackingType === KeyUtils.TRACKING_TYPE_GROWTH &&
          <StatsGrowth themeSelected={themeSelected} textColor={this.textColor} isTodaySelected={isTodaySelected} item={item} isImperial={isImperial} units={units} onItemPress={(trackingType)=>this.onItemPress(trackingType)}/>}
          {trackingType === KeyUtils.TRACKING_TYPE_WEIGHT &&
          <StatsWeight themeSelected={themeSelected} textColor={this.textColor} isTodaySelected={isTodaySelected} item={item} isImperial={isImperial} units={units} onItemPress={(trackingType)=>this.onItemPress(trackingType)}/>}
        </View>
      );
    } else {
      return <View style={{flex: 1, marginHorizontal: 5}}>
        <StatsContraction themeSelected={themeSelected} textColor={this.textColor} isTodaySelected={isTodaySelected} item={item}/>
      </View>
    }

  };

  renderListView = ({item, index}) => {
    const {typeSelected} = this.state
    const {deleteTrackingApi, deleteMotherTrackingApi,isInternetAvailable,themeSelected} = this.props
     let itemBackgroundColor = Colors.white
    themeSelected === 'dark' && (itemBackgroundColor = Colors.rgb_000000)
    return <SwipeRow
      ref={ref => {
        this.rows[index] = ref
      }}
      rightOpenValue={-75}
      disableLeftSwipe={(item.trackingType===KeyUtils.TRACKING_TYPE_BOTTLE && item.feedType===4) || (item.trackingType===KeyUtils.TRACKING_TYPE_PUMPING && item.savedMilk && !item.inventory)}
      disableRightSwipe={true}
      key={index.toString()} closeOnRowPress={true}>
      <View style={styles.standaloneRowBack}>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => {

          this.rows[index].closeRow()
          const {id, babyId} = item
          if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
            if (isInternetAvailable){
              this.setState({isLoading: true})
              deleteMotherTrackingApi(id)
            }else {
              item.isDeleted=true
              createTrackedItem(item).then((r)=>{

              })
            }
          }else{
            if (isInternetAvailable){
              this.setState({isLoading: true})
              deleteTrackingApi(id, babyId)
              if(item && item.inventory && item.inventory!=undefined){
                this.props.deleteFreezerInventoryApi(item.inventory.id)
             }
            }else {
              item.isDeleted=true
              createTrackedItem(item).then((r)=>{

              })
            }
          }

          // alert(JSON.stringify(item))

        }}>
          <Text maxFontSizeMultiplier={1.7} style={styles.backTextWhite}>{I18n.t('generic.delete')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.standaloneRowFront, {backgroundColor: itemBackgroundColor}]}>
        <StatsListItem item={item} typeSelected={typeSelected} isImperial={this.state.isImperial} units={this.state.units} themeSelected={this.themeSelected} {...this.props} textColor={this.textColor} editData={() => {
          this.callTrackingAPi()

        }}/>
      </View>
    </SwipeRow>
  }
  renderListEmptyView = () => {
    const {isTodaySelected,typeSelected,isListViewSelected} = this.state;
    if((typeSelected === KeyUtils.TRACKING_TYPE_WEIGHT || typeSelected === KeyUtils.TRACKING_TYPE_GROWTH ) && !isListViewSelected){
      return null
    }else{
      return (
      <View style={styles.listEmptyView}>
        <EmptyTrackingTypeIcon width={110} height={100}/>
        {isTodaySelected ?
          <Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:this.textColor}]}>{I18n.t('stats_screen.empty_list_today_message')}</Text> :
          <Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:this.textColor}]}>{I18n.t('stats_screen.empty_list_past_7_days_message')}</Text>
        }
      </View>
    )
  }
  }

	showCustomExportCalendar = () =>{
		const{showExportCalendarPicker, listExportDate, btnExportSelected, startListDate, endListDate}= this.state
		return (
			<CustomCalendar
				visible={showExportCalendarPicker}
				title={I18n.t('login.forgot_password_title')}
				message={I18n.t('login.forgot_password_message')}
				positive={I18n.t('login.ok')}
				negative={I18n.t('login.cancel')}
				selectedDate={listExportDate}
				maxDate={new Date()}
				minDate={new Date().getDate()-5}
				negativeOnPress={() => this.negativeListOnPress()}
				positiveOnPress={(startListDate, endListDate, btnExportSelected)=> this.positiveListOnPress(startListDate, endListDate, btnExportSelected)}
				onDismiss={() => {
				}}
				onDateChange={(date) => this.setState({listExportDate: moment(date).format()})}
				showHeader={true}
				notShowTime={true}
				showStatsBtn={true}
				btnSelected={btnExportSelected}
				selectedCustomDates={[startListDate, endListDate]}
			/>
		)
	}

  negativeListOnPress = () => {
		this.setState({
			showExportCalendarPicker: false
		})
	}
	positiveListOnPress = async (startListDate, endListDate, btnExportSelected) => {
		this.setState({
			startListDate:startListDate,
			endListDate: endListDate != 'Invalid date' ? endListDate : startListDate,
			showExportCalendarPicker: false,
			btnExportSelected:btnExportSelected	,
			listExportDate: startListDate,
		}, () => {
      this.isDateSelectedFromCalendar=btnExportSelected!==I18n.t('calendar.all')
      this.callTrackingAPi()  })
	}

  negativeOnPress = () => {
    this.setState({
      customCalendarDate: this.state.startDate,
      selectedDate: moment().format(),
      showCalendarPicker: false
    })
  }
  setSelectedDateAndIndex=(startDate)=>{
    let diffrenceFromTodayDate=moment(moment()).diff(startDate,'d')
    return {
     date:diffrenceFromTodayDate>2?moment(startDate).format():moment(startDate).subtract((3-diffrenceFromTodayDate),'d').format(),
     index:diffrenceFromTodayDate>2?3:(6-diffrenceFromTodayDate)
    }

  }
  positiveOnPress = (startDate, endDate) => {
    const {isTodaySelected,typeSelected} = this.state;
    let selectedDateConfig=this.setSelectedDateAndIndex(startDate)
    if (isTodaySelected) {
      this.setState({
        startDate: startDate.toString().split('T')[0],
        endDate: startDate.toString().split('T')[0],
        customCalendarDate: startDate.toString().split('T')[0],
        selectedDate:selectedDateConfig.date,
        showCalendarPicker: false
      }, () => {
        this.setState({last7Days: this.sevenDaysView(), last7DaysSelectedIndex: selectedDateConfig.index})
        if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
          this.motherTrackingPageNumber = 1
          this.callMotherTrackingApi()
        }else{
          this.callTrackingAPi()
        }
      })
    } else {
      let sD = startDate.toString().split('T')[0]
      let past7DaysEndDate = sD
      let past7DaysStartDate = moment(sD).subtract(6, 'd').format('YYYY-MM-DD')
      this.setState({
        startDate: startDate.toString().split('T')[0],
        endDate: startDate.toString().split('T')[0],
        showCalendarPicker: false,
        //last7Days: this.sevenDaysView(), last7DaysSelectedIndex: 3,
        selectedDate:selectedDateConfig.date,
        past7DaysEndDate, past7DaysStartDate
      }, () => {
        this.setState({last7Days: this.sevenDaysView(), last7DaysSelectedIndex: selectedDateConfig.index})
        if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
          this.motherTrackingPageNumber = 1
          this.callMotherTrackingApi()
        }else{
          this.callTrackingAPi()
        }
      })
    }
  }

  showCustomCalendar = () => {
    const {showCalendarPicker, customCalendarDate, selectedDate} = this.state
    return (
      <CustomCalendar
        visible={showCalendarPicker}
        title={I18n.t('login.forgot_password_title')}
        message={I18n.t('login.forgot_password_message')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        selectedDate={customCalendarDate}
        maxDate={moment().subtract(0, 'days')}
        //minDate={new Date().getDate()-5}
        negativeOnPress={() => this.negativeOnPress()}
        positiveOnPress={(startDate, endDate) => this.positiveOnPress(startDate, endDate)}
        onDismiss={() => {
        }}
        onDateChange={(date) => this.setState({
          customCalendarDate: moment(date).format(),
          selectedDate: moment(date).format()
        })}
        showHeader={true}
        notShowTime
      />
    )
  }

  renderCalenderListItem = ({item, index}) => {
    const {dayName, dateOfMonth, date} = item
    const {last7DaysSelectedIndex, isTodaySelected,typeSelected} = this.state
    return (
        <View>
        <Text maxFontSizeMultiplier={1.7} style={[styles.currentDayName,{color:this.textColor}]}>{I18n.locale.includes('ar')?weekdaysArab[weekdaysEng.findIndex(index=>index.includes(dayName.toString().charAt(0)))]:dayName.toString().charAt(0)}</Text>
        <TouchableOpacity
          style={index === last7DaysSelectedIndex ? styles.currentDateSelectedItem : styles.last7DaysSelectedItem}
          onPress={() => {
            this.setState({last7DaysSelectedIndex: index, startDate: date,customCalendarDate:date, endDate: date}, () => {

              if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
                this.motherTrackingPageNumber = 1
                this.setState({motherTrackingData: [], motherPastDaysTrackingData: [],})
                this.callMotherTrackingApi()
              }else{
                this.callTrackingAPi()
              }
            })
            if (!isTodaySelected) {
              let sD = date
              let past7DaysEndDate = sD
              let past7DaysStartDate = moment(sD).subtract(6, 'd').format('YYYY-MM-DD')
              this.setState({past7DaysEndDate, past7DaysStartDate},)
            }
          }}>
          <Text maxFontSizeMultiplier={1.7}
            style={[index === last7DaysSelectedIndex ? styles.currentDateSelectedText : styles.last7DaysSelectedText,{color:this.textColor}]}>{I18n.locale.includes('ar')?engToArabicNumber(dateOfMonth) :dateOfMonth}</Text>
        </TouchableOpacity>
        {index === 3 && <TouchableOpacity style={{paddingHorizontal:2,paddingVertical:5,}} onPress={() => {
          this.setState({showCalendarPicker: true,})
        }
        }
        >
          <View style={styles.bottomLine}/>
        </TouchableOpacity>
        }
        </View>
    );
  };

  leftRightDateChange = (changeInDate) => {
    const {startDate, isTodaySelected, isListViewSelected,typeSelected} = this.state;
    let selectedDate = startDate
    selectedDate = changeInDate === -1 ? moment(startDate).subtract(1, 'd').format('YYYY-MM-DD') : moment(startDate).add(1, 'd').format('YYYY-MM-DD');
    // let selectedDate = isTodaySelected ? getCurrentDate : moment(getCurrentDate).subtract(6, 'd').format('YYYY-MM-DD')

    let sD = selectedDate
    let past7DaysEndDate = sD
    let past7DaysStartDate = moment(sD).subtract(6, 'd').format('YYYY-MM-DD')
    this.setState({startDate: selectedDate, endDate: selectedDate, past7DaysEndDate, past7DaysStartDate}, () => {
      if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
        if (isTodaySelected || isListViewSelected) {
          this.motherTrackingPageNumber = 1
        } else {
          this.motherTrackingPast7DaysPageNumber = 1
        }
        this.callMotherTrackingApi()
      }else {
        if (isTodaySelected || isListViewSelected) {
          this.pageNumber = 1
        } else {
          this.past7DaysPageNumber = 1
        }
        this.callTrackingAPi()
      }


    })
  }

  getSelectedBabyDetails(item) {
    this.callTrackingAPi()
  }

  renderTodayPastDaysView = () => {
    const {isTodaySelected} = this.state
    return <View style={{alignSelf: 'center', marginBottom: 10}}>
      <SwitchButton
        onValueChange={(val) => {
          const {typeSelected} = this.state

          if (val === 1) {

            this.setState({isTodaySelected: val === 1,todayToggleSwitchState:val === 1}, () => {

              if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
                this.motherTrackingPageNumber = 1
                this.callMotherTrackingApi()
              }else{
                this.pageNumber = 1
                this.callTrackingAPi()
              }

            })
          } else {
            let sD = this.state.startDate
            let past7DaysEndDate = sD
            let past7DaysStartDate = moment(sD).subtract(6, 'd').format('YYYY-MM-DD')
            this.setState({isTodaySelected: val === 1, past7DaysStartDate, past7DaysEndDate}, () => {
              if (typeSelected===KeyUtils.TRACKING_TYPE_CONTRACTION){
                this.motherTrackingPageNumber = 1
                this.callMotherTrackingApi()
              }else{
                this.pageNumber = 1
                this.callTrackingAPi()
              }
            })
          }
        }}
        text1={I18n.t('stats_screen.today')}
        text2={I18n.t('stats_screen.past_7_days')}
        activeSwitch={isTodaySelected ? 1 : 2}
        switchWidth={DeviceInfo.getFontScale()>1.6?180*1.63:180}
        switchHeight={48}
        switchBorderRadius={8}
        switchBorderColor='transparent'
        switchBackgroundColor={Colors.rgb_898d8d33}
        btnBorderColor='transparent'
        btnBackgroundColor={Colors.white}
        fontColor={this.textColor}
        activeFontColor={Colors.rgb_000000}
        amPmStart
        switchdirection={I18nManager.isRTL?'rtl':'ltr'}
      />
    </View>
  }
  getUniqueArrForMother = (refData) => {
    const {typeSelected} = this.state
    const uniqueTrackingObj = {};
    const uniqueTrackingArr = [];

    for (let i = 0; i < refData.length; i++) {
      const elem = refData[i];

      if (uniqueTrackingObj.hasOwnProperty(elem.trackingType)) {
        uniqueTrackingObj[elem.trackingType].push(elem);
      } else {
        uniqueTrackingObj[elem.trackingType] = [elem];
      }
    }


    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_BREASTFEEDING)) {
      const breastFeedingArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING] = [];
      const dateObj = {};
      breastFeedingArr.forEach(row => {
        row['day_key'] = moment(row['trackAt']).format('Do');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })
      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          element[0]['session'] = element.length;
          element[0]['total_duration_key'] = element[0]['total_frequency_key'] = 0;
          element.forEach((item) => {
            element[0]['total_duration_key'] += item['durationTotal'];
            element[0]['total_frequency_key'] += item['frequency'];

            let painLevel = item['painLevel']
            let painKey;
            switch (painLevel){
              case 0:
                painKey = I18n.t('stats_contraction.none')
                break;
              case 1:
                painKey = I18n.t('stats_contraction.very_mild')
                break;
              case 2:
                painKey = I18n.t('stats_contraction.mild')
                break;
              case 3:
                painKey = I18n.t('stats_contraction.medium')
                break;
              case 4:
                painKey = I18n.t('stats_contraction.strong')
                break;
              case 5:
                painKey = I18n.t('stats_contraction.very_strong')
                break;
            }
            const typeKey = `${painKey}_key`;
            if (element[0].hasOwnProperty(typeKey)) {
              element[0][typeKey]++;
            } else {
              element[0][typeKey] = 1;
            }

          })

          element[0]['avg_time_key'] = parseFloat(element[0]['total_duration_key'] / element[0]['session']).toFixed(2);
          element[0]['avg_frequency_key'] = parseFloat(element[0]['total_frequency_key'] / element[0]['session']).toFixed(2);
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING] = [element[0]]
          }
        }
      }
    }

    // if (typeSelected === KeyUtils.TRACKING_TYPE_SELECT_ALL) {
    for (const key in uniqueTrackingObj) {
      if (uniqueTrackingObj.hasOwnProperty(key)) {
        const element = uniqueTrackingObj[key];
        uniqueTrackingArr.push(element[0]);
      }
    }
    return uniqueTrackingArr
    /* } else {
       return uniqueTrackingObj[typeSelected];
     }*/
  }
  getUniqueArr = (refData) => {
    const {trackingData, pastDaysTrackingData, isTodaySelected, babyId, typeSelected} = this.state
    const uniqueTrackingObj = {};
    const uniqueTrackingArr = [];

    for (let i = 0; i < refData.length; i++) {
      const elem = refData[i];

      if (uniqueTrackingObj.hasOwnProperty(elem.trackingType)) {
        uniqueTrackingObj[elem.trackingType].push(elem);
      } else {
        uniqueTrackingObj[elem.trackingType] = [elem];
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_BREASTFEEDING)) {
      const breastFeedingArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING] = [];
      const dateObj = {};
      breastFeedingArr.forEach(row => {
        row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })
      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          element[0]['session'] = element.length;
          element[0]['total_duration_key'] = element[0]['total_left_key'] = element[0]['total_right_key'] = 0;
          element.forEach((item) => {
            let leftTime=convertSecToMinutes(parseInt(item['durationLeft']))
            let rightTime=convertSecToMinutes(parseInt(item['durationRight']))
            element[0]['total_duration_key'] += (leftTime+rightTime);
            element[0]['total_left_key'] += item['durationLeft'];
            element[0]['total_right_key'] += item['durationRight'];
          })
          element[0]['avg_time_key'] = parseInt(element[0]['total_duration_key'] / element[0]['session']).toFixed(2);
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BREASTFEEDING] = [element[0]]
          }
        }
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_PUMPING)) {
      const pumpingArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_PUMPING]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_PUMPING] = [];
      const dateObj = {};
      pumpingArr.forEach(row => {
        row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })

      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          element[0]['session'] = element.length;
          element[0]['total_volume_key'] = element[0]['total_duration_key'] = 0;
          element.forEach((item) => {
            const {convertedVolume , convertedVolumeUnit} = volumeConversionHandler(this.state.isImperial,item['amountTotalUnit'],item['amountTotal'])
            const total_vol = parseFloat(element[0]['total_volume_key']);
            let leftTime=convertSecToMinutes(parseInt(item['durationLeft']))
            let rightTime=convertSecToMinutes(parseInt(item['durationRight']))
            const total=convertSecToMinutes(parseInt(item.durationTotal))
              //item.pumpId!=="" && item.pumpId!==undefined?convertSecToMinutes(parseInt(item.durationTotal)):leftTime+rightTime
            element[0]['total_volume_key'] = total_vol + parseFloat(convertedVolume);
            element[0]['total_volume_unit'] = convertedVolumeUnit;
            element[0]['total_duration_key'] += (total);
          })
          element[0]['avg_vol_key'] = parseFloat(parseFloat(element[0]['total_volume_key']) / element[0]['session']).toFixed(2);
          element[0]['avg_time_key'] = parseFloat(element[0]['total_duration_key'] / element[0]['session']).toFixed(2);
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_PUMPING]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_PUMPING].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_PUMPING].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_PUMPING] = [element[0]]
          }
        }
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_DIAPER)) {
      const diaperArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_DIAPER]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_DIAPER] = [];
      const dateObj = {};
      diaperArr.forEach(row => {
        row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })
      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          element[0]['session'] = element.length;
          element.forEach((item) => {
            // element[0]['total_volume_key'] += item['amountTotal']['quantity'];
            let batchType = item['batchType']
            let batchKey;
            if (batchType === 1) {
              batchKey = 'pee'
            } else if (batchType === 2) {
              batchKey = 'poo'
            } else {
              batchKey = 'both'
            }
            const typeKey = `${batchKey}_key`;
            if (element[0].hasOwnProperty(typeKey)) {
              element[0][typeKey]++;
            } else {
              element[0][typeKey] = 1;
            }
          })
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_DIAPER]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_DIAPER].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_DIAPER].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_DIAPER] = [element[0]]
          }
        }
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_BOTTLE)) {
      const bottleArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BOTTLE]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BOTTLE] = [];
      const dateObj = {};
      bottleArr.forEach(row => {
        row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })
      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          element[0]['session'] = element.length;
          element[0]['total_volume_key'] = 0;
          element[0]['mix_volume_count'] = 0
          element[0]['milk_volume_count'] = 0
          element[0]['formula_volume_count'] = 0
          element.forEach((item, index) => {
            const {feedType} = item
            let feedKey;
            if (feedType === 3) {
              feedKey = 'mix'
            } else if (feedType === 2) {
              feedKey = 'formula'
            } else {
              feedKey ='breastmilk'
            }
            const typeKey = `${feedKey}_key`;
            const {convertedVolume , convertedVolumeUnit} = volumeConversionHandler(this.state.isImperial,item['amountTotalUnit'],item['amountTotal'])

            if (feedType===3) {
              element[0]['mix_volume_count'] += parseFloat(convertedVolume);
              element[0]['mix_volume_unit'] = convertedVolumeUnit;
            } else if (feedType===2) {
              element[0]['formula_volume_count'] += parseFloat(convertedVolume);
              element[0]['formula_volume_unit'] = convertedVolumeUnit;
            } else {
              element[0]['milk_volume_count'] += parseFloat(convertedVolume);
              element[0]['milk_volume_unit'] = convertedVolumeUnit;
            }
            const total_vol = parseFloat(element[0]['total_volume_key']);
            element[0]['total_volume_key'] = total_vol + parseFloat(convertedVolume);
            element[0]['total_volume_unit'] = convertedVolumeUnit;
            if (element[0].hasOwnProperty(typeKey)) {
              element[0][typeKey]++;
            } else {
              element[0][typeKey] = 1;
            }
          })
          element[0]['avg_vol_key'] = parseFloat(parseFloat(element[0]['total_volume_key']) / element[0]['session']).toFixed(2);
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BOTTLE]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BOTTLE].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BOTTLE].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_BOTTLE] = [element[0]]
          }
        }
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_SLEEP)) {
      const sleepArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_SLEEP]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_SLEEP] = [];
      const dateObj = {};
      sleepArr.forEach(row => {
       row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })
      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          element[0]['session'] = element.length;
          element[0]['total_duration_key'] = 0;
          element.forEach((item) => {
            element[0]['total_duration_key'] += item['durationTotal'];
          })
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_SLEEP]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_SLEEP].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_SLEEP].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_SLEEP] = [element[0]]
          }
        }
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_GROWTH)) {
      const growthArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH] = [];
      const dateObj = {};
      growthArr.forEach(row => {
        row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })
      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH] = [element[0]]
          }
        }
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_WEIGHT)) {
      const weightArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT] = [];
      const dateObj = {};
      weightArr.forEach(row => {
       row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })
      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT] = [element[0]]
          }
        }
      }
    }

    if (typeSelected === KeyUtils.TRACKING_TYPE_SELECT_ALL) {
      for (const key in uniqueTrackingObj) {
        if (uniqueTrackingObj.hasOwnProperty(key)) {
          const element = uniqueTrackingObj[key];
          uniqueTrackingArr.push(element[0]);
        }
      }
      return uniqueTrackingArr
    } else {
      return uniqueTrackingObj[typeSelected];
    }
  }

  getUniqueArrForWHO = (refData) => {
    const {typeSelected} = this.state
    const uniqueTrackingObj = {};

    for (let i = 0; i < refData.length; i++) {
      const elem = refData[i];

      if (uniqueTrackingObj.hasOwnProperty(elem.trackingType)) {
        uniqueTrackingObj[elem.trackingType].push(elem);
      } else {
        uniqueTrackingObj[elem.trackingType] = [elem];
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_GROWTH)) {
      const growthArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH] = [];
      const dateObj = {};
      growthArr.forEach(row => {
        row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do') + moment(row['trackAt'].split('T')[0]).format('MM');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })
      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_GROWTH] = [element[0]]
          }
        }
      }
    }

    if (uniqueTrackingObj.hasOwnProperty(KeyUtils.TRACKING_TYPE_WEIGHT)) {
      const weightArr = JSON.parse(JSON.stringify(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT]));
      uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT] = [];
      const dateObj = {};
      weightArr.forEach(row => {
        row['day_key'] = moment(row['trackAt'].split('T')[0]).format('Do') + moment(row['trackAt'].split('T')[0]).format('MM');
        if (Array.isArray(dateObj[row['day_key']]) && dateObj[row['day_key']].length) {
          dateObj[row['day_key']].push(row)
        } else {
          dateObj[row['day_key']] = [row];
        }
      })

      for (const key in dateObj) {
        if (dateObj.hasOwnProperty(key)) {
          const element = dateObj[key];
          if (Array.isArray(uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT]) && uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT].length) {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT].push(element[0])
          } else {
            uniqueTrackingObj[KeyUtils.TRACKING_TYPE_WEIGHT] = [element[0]]
          }
        }
      }
    }
    return uniqueTrackingObj[typeSelected];
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
  getCurrentDateInArabic=()=>{
    const {startDate, userLocale}=this.state;
    if(I18nManager.isRTL){
        return this.formatDateInArabic(startDate);
    }else{
      let dayName = moment(startDate).format(userLocale === 'en_US' ? "Do" : "DD")
      let monthName = moment(startDate).format("MMMM")
      let year =  moment(startDate).format("YYYY")
      return (userLocale === 'en_US') ? `${monthName} ${dayName} ${year}` :`${dayName} ${monthName} ${year}`
    }
  }
  getPast7DaysDateInArabic=()=>{
    const {past7DaysStartDate,past7DaysEndDate, userLocale}=this.state;
    if(I18nManager.isRTL){
        return `${this.formatDateInArabic(past7DaysStartDate)} - ${this.formatDateInArabic(past7DaysEndDate)}`
    }else{
      let startDay = moment(past7DaysStartDate).format(userLocale === 'en_US' ? "Do" : "DD")
      let startMonth = moment(past7DaysStartDate).format("MMMM")
      let startYear = moment(past7DaysStartDate).format("YYYY")
      let endDay = moment(past7DaysEndDate).format(userLocale === 'en_US' ? "Do" : "DD")
      let endMonth = moment(past7DaysEndDate).format("MMMM")
      let endYear = moment(past7DaysEndDate).format("YYYY")
      return (userLocale === 'en_US') ? `${startMonth} ${startDay} ${startYear} - ${endMonth} ${endDay} ${endYear}` :`${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear}`
    }
  }
  renderTimeView() {
    const {typeSelected, startDate, past7DaysStartDate, past7DaysEndDate, isTodaySelected} = this.state;
    let translatedCurrentDay =I18n.t(`days.${moment(startDate).format('dddd').toLowerCase()}`)
    let getCurrentDay = translatedCurrentDay
    let getCurrentDate =this.getCurrentDateInArabic();
    let getPast7Days= this.getPast7DaysDateInArabic() ||moment(past7DaysStartDate).format('DD') +' '+ I18n.t(`months.${moment(past7DaysStartDate).format('MMMM').toLowerCase()}`) +' '+ moment(past7DaysStartDate).format('YYYY') +' ' + '-' +' '+ moment(past7DaysEndDate).format('DD') +' '+ I18n.t(`months.${moment(past7DaysEndDate).format('MMMM').toLowerCase()}`) +' '+ moment(past7DaysEndDate).format('YYYY')
    const isAllSelected = typeSelected === KeyUtils.TRACKING_TYPE_SELECT_ALL
    return <View style={styles.dateAndTimeContainer}>
      <TouchableOpacity accessible={true} accessibilityLabel={I18n.t('accessibility_labels.previous_tracking_date_label')} onPress={() => this.leftRightDateChange(-1)}>
        <LeftIcon fill={Colors.rgb_898d8d} width={moderateScale(38)} height={verticalScale(48)} style={{marginLeft: 10,transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}/>
      </TouchableOpacity>
      <View style={styles.dateAndTimeTextWrapper}>
        <TouchableOpacity activeOpacity={1} onPress={() => {
          this.setState({showCalendarPicker: true})
        }
        }
                          style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',height:48}}>
          <View>
            <Text maxFontSizeMultiplier={1.7}
              style={[styles.dayText,{color:this.textColor}]}>{(isTodaySelected || isAllSelected) ? getCurrentDay : I18n.t('calendar.week')}</Text>
            {/* <Text maxFontSizeMultiplier={1.7}
              style={styles.dateText}>{(isTodaySelected || isAllSelected) ? getCurrentDate : `${moment(past7DaysStartDate).format('DD MMM YY')} - ${moment(past7DaysEndDate).format('DD MMM YY')}`}</Text> */}
              <Text maxFontSizeMultiplier={1.7}
              style={[styles.dateText,{color:this.textColor}]}>{(isTodaySelected || isAllSelected) ? getCurrentDate : getPast7Days }
              </Text>
          </View>
          {/* <TouchableOpacity style={styles.iconStyle} activeOpacity={1} onPress={() => {
            this.setState({showCalendarPicker: true})
          }
          }>
            {(isTodaySelected || isAllSelected) && <CalendarLogo width={25} height={25} fill={Colors.rgb_fecd00}/>}
          </TouchableOpacity>*/}
        </TouchableOpacity>

      </View>
      {startDate !== moment().format('YYYY-MM-DD') ?
      <TouchableOpacity accessible={true} accessibilityLabel={I18n.t('accessibility_labels.next_tracking_date_label')} onPress={() => this.leftRightDateChange(1)}>
        
          <ForwardIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],marginLeft: 10}} fill={Colors.rgb_898d8d} width={moderateScale(38)} height={verticalScale(48)}/> 
      </TouchableOpacity>
      : <Text accessible={true} accessibilityLabel={'   '} maxFontSizeMultiplier={1.7}>{'   '}</Text>}
    </View>
  }

  exportHandler =async () => {
    await analytics.logOnPress('export')
    this.props.navigation.navigate('StatsExportListScreen')
  }

  renderMotherTrackingChart(filteredData) {
    const {typeSelected, barColorSet, isTodaySelected, motherGraphType} = this.state;

     const {selected_baby} = this.props
    return <MotherGroupedBarChart type={typeSelected} colorSet={barColorSet} isTodaySelected={isTodaySelected}
                                  onMotherGraphTypeChange={(graph) => this.onMotherGraphTypeChange(graph)}
                                  motherGraphType={motherGraphType == undefined ? "duration" : motherGraphType}
                            datas={filteredData} textColor={this.textColor}/>
  }
  renderChart(filteredData) {
    const {typeSelected, barColorSet, isTodaySelected, graphType,volumeUnit,heightUnit,weightUnit,isImperial,formattedTime} = this.state;
    const {selected_baby} = this.props
    let weeksLength = 0;
    let babyBirth = moment(this.props.selected_baby.birthday, 'YYYY-MM-DD');
    let currentDate=moment()
    weeksLength = currentDate.diff(babyBirth, 'week');
    switch (typeSelected) {
      case KeyUtils.TRACKING_TYPE_BREASTFEEDING:
        return <GroupedBarChart type={typeSelected} textColor={this.textColor} colorSet={barColorSet} isTodaySelected={isTodaySelected}
                                datas={filteredData}/>
      case KeyUtils.TRACKING_TYPE_PUMPING:
        return <GroupedBarChart type={typeSelected} textColor={this.textColor} colorSet={barColorSet} isTodaySelected={isTodaySelected} volumeUnit={volumeUnit}
                                datas={filteredData}/>
      case KeyUtils.TRACKING_TYPE_BOTTLE:
        return <StackedBarChart type={typeSelected} textColor={this.textColor} colorSet={barColorSet} isTodaySelected={isTodaySelected} volumeUnit={volumeUnit}
                                datas={filteredData}/>
      case KeyUtils.TRACKING_TYPE_DIAPER:
        return <StackedBarChart type={typeSelected} textColor={this.textColor} colorSet={barColorSet} isTodaySelected={isTodaySelected}
                                datas={filteredData}/>
      case KeyUtils.TRACKING_TYPE_SLEEP:
        return <SleepSingleBarChart type={typeSelected} textColor={this.textColor} colorSet={barColorSet} isTodaySelected={isTodaySelected}
                                    datas={filteredData} formattedTime={formattedTime}/>
      case KeyUtils.TRACKING_TYPE_GROWTH:
        return weeksLength>13?<SingleBarChartTwoYears
          navigation={this.props.navigation}
          type={typeSelected}
          colorSet={barColorSet}
          isTodaySelected={isTodaySelected}
          datas={filteredData}
          baby={selected_baby}
          isImperial={isImperial}
          heightUnit={heightUnit===KeyUtils.UNIT_MM?KeyUtils.UNIT_CM:heightUnit}
          onGraphTypeChange={(graph) => this.onGraphTypeChange(graph)}
          textColor={this.textColor}
          graphType={graphType == undefined ? "who" : graphType}/>
          :
          <SingleBarChart
          navigation={this.props.navigation}
          type={typeSelected}
          colorSet={barColorSet}
          isTodaySelected={isTodaySelected}
          datas={filteredData}
          baby={selected_baby}
          isImperial={isImperial}
          heightUnit={heightUnit===KeyUtils.UNIT_MM?KeyUtils.UNIT_CM:heightUnit}
          onGraphTypeChange={(graph) => this.onGraphTypeChange(graph)}
          textColor={this.textColor}
          graphType={graphType == undefined ? "who" : graphType}/>
      case KeyUtils.TRACKING_TYPE_WEIGHT:
        return weeksLength>13? <SingleBarChartTwoYears
          navigation={this.props.navigation}
          type={typeSelected}
          colorSet={barColorSet}
          isTodaySelected={isTodaySelected}
          datas={filteredData}
          baby={selected_baby}
          isImperial={isImperial}
          weightUnit={weightUnit===KeyUtils.UNIT_GRAM?KeyUtils.UNIT_KG:weightUnit}
          onGraphTypeChange={(graph) => this.onGraphTypeChange(graph)}
          textColor={this.textColor}
          graphType={graphType == undefined ? "who" : graphType}/>
          :
          <SingleBarChart
          navigation={this.props.navigation}
          type={typeSelected}
          colorSet={barColorSet}
          isTodaySelected={isTodaySelected}
          datas={filteredData}
          baby={selected_baby}
          isImperial={isImperial}
          weightUnit={weightUnit===KeyUtils.UNIT_GRAM?KeyUtils.UNIT_KG:weightUnit}
          onGraphTypeChange={(graph) => this.onGraphTypeChange(graph)}
          textColor={this.textColor}
          graphType={graphType == undefined ? "who" : graphType}/>
    }
  }

  onGraphTypeChange = (graph) => {
    if(graph === 'who'){
      this.setState({graphType: graph, isTodaySelected:true})
    }else{
      this.setState({graphType: graph, isTodaySelected:this.state.todayToggleSwitchState})
    }
  }
  onMotherGraphTypeChange = (graph) => {
    this.setState({motherGraphType: graph,})
  }
  renderNoDataView() {
    const {typeSelected} = this.state;
    if(typeSelected === KeyUtils.TRACKING_TYPE_WEIGHT || typeSelected === KeyUtils.TRACKING_TYPE_GROWTH){
      return (
        <View style={styles.listEmptyView}>
          <EmptyTrackingTypeIcon width={110} height={100}/>
            <Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:this.textColor}]}>{I18n.t('stats_screen.empty_list_today_message')}</Text>
        </View>
      )
    }else{
    return <View style={styles.graphEmptyViewStyle}>
      <Text maxFontSizeMultiplier={1.7} style={[styles.graphEmptyStyle,{color:this.textColor}]}>{I18n.t('stats_screen.empty_list_today_message')}</Text>
    </View>
    }
  }

  filterData(statsData, startDate, isBabyAdded, babyId) {
    let list=[]
    if (statsData!=undefined && statsData.length>0) {
      list= statsData.filter((e) => {
        let obj = e
        if (isBabyAdded) {
          obj = e.babyId === babyId && startDate === e.trackAt.toString().split('T')[0]
        } else {
          obj = startDate === e.trackAt.toString().split('T')[0]
        }
        return obj
      })
    }
    return list
  }

  filterWhoData(statsData, startDate, isBabyAdded, babyId) {
    let list = []

    if (statsData != undefined && statsData.length > 0) {
      list = statsData.filter((e) => {
        let obj = e
        let selectedDate = moment(new Date(this.props.selected_baby.birthday), 'YYYY-MM-DD').add(13,'week');
        let  babyBirth = moment(this.props.selected_baby.birthday, 'YYYY-MM-DD');
        let weeks = selectedDate.diff(babyBirth, 'week');
        let trackDate = moment(e.trackAt.toString().split('T')[0], 'YYYY-MM-DD');
        if (isBabyAdded) {
          obj = e.babyId === babyId && (trackDate >= babyBirth && trackDate <= selectedDate) && weeks <= 13
        } else {
          obj = (trackDate >= babyBirth && trackDate <= selectedDate) && weeks <= 13
        }
        return obj
      })
    }

    return list
  }


  renderStatsHeader() {
    const {startDate, isListViewSelected} = this.state
    const {navigation} = this.props
    return <HeaderStats
      navigation={navigation}
      title={I18n.t('stats_screen.header_title')}
      onBackPress={() => {
        if (isListViewSelected) {
          this.setState({
            isListViewSelected: !isListViewSelected,
            last7Days: this.last7Days(),
          }, () => {
            // this.selectedDate = moment().format('YYYY-MM-DD')
            // this.callTrackingAPi()
          })
        } else {
          navigation.goBack()
        }
      }}
      isListViewSelected={isListViewSelected}
      onListViewPress={() => {
        const {last7Days, isTodaySelected, past7DaysEndDate,customCalendarDate,selectedDate} = this.state
        if (isTodaySelected) {
          //let getSelectedDateConfig=this.setSelectedDateAndIndex(startDate);
          let lastDays=this.last7Days()
          let ind = lastDays.findIndex((e) => {
            return moment(e.date).isSame(startDate)
          })
          // let lastDays=this.last7Days(getSelectedDateConfig.date);
          //  let ind = lastDays.findIndex((e) => {
          //   return getSelectedDateConfig.date
          // })
          //let ind=getSelectedDateConfig.index;
          if (ind === -1) {
            this.setState({selectedDate: startDate, last7Days: this.sevenDaysView(), last7DaysSelectedIndex: this.sevenDaysView().findIndex((e) => {
              return moment(e.date).isSame(startDate)
            }) || 3})
          } else {
            this.setState({last7Days:lastDays || this.last7Days(), last7DaysSelectedIndex: ind})
          }
          // last7Days: this.sevenDaysView(), last7DaysSelectedIndex: 3

        } else {
          //TODO
          this.setState({last7Days: this.last7Days(past7DaysEndDate), last7DaysSelectedIndex: 3})
        }
        this.setState({isListViewSelected: !isListViewSelected}, () => {
        })
      }}
      onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
      onExportIconPress={this.exportHandler}
      onCustomCalendarIconPress={(value)=>this.setState({showExportCalendarPicker:true})}
    />
  }

  renderFLatListChildrenTracking(filteredData) {
    const {
      isTodaySelected,
      refreshing,
      showCalendarPicker,
      last7Days,
      pastDaysTrackingData,
      motherTrackingData,
      trackingData,
      listTrackingData,
      typeSelected,
      isListViewSelected,
      isLoading,
      noMoreFound,
      noMorePastDaysFound,
      noMoreListFound,
      startDate,
      graphType,
      motherGraphType
    } = this.state;
    let mTrackingData = this.filterData(typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION ? motherTrackingData : filteredData, startDate, false)
    return (  isListViewSelected?
      <FlatList
      contentContainerStyle={styles.verticalListStyle}
      keyExtractor={(item, index) => index.toString()}
      data={filteredData}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          //refresh control used for the Pull to Refresh
          onRefresh={() => {
              this.listPageNumber = 1
              this.setState({refreshing: true, noMoreListFound: false})
              this.callTrackingAPi()
          }
          }
        />
      }
      onEndReachedThreshold={0.1}
      onEndReached={() => {
          if (!noMoreListFound) {
            let pgNo = parseInt(listTrackingData.length / 100)
            pgNo += 1
            if (this.listPageNumber != pgNo) {
              this.listPageNumber = pgNo
              this.callTrackingAPi()
            }
          }
      }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={!isListViewSelected && ((typeSelected !== KeyUtils.TRACKING_TYPE_SELECT_ALL && (typeSelected !== KeyUtils.TRACKING_TYPE_GROWTH) && (typeSelected !== KeyUtils.TRACKING_TYPE_WEIGHT)) || ((typeSelected === KeyUtils.TRACKING_TYPE_GROWTH || typeSelected === KeyUtils.TRACKING_TYPE_WEIGHT) && graphType == 'stat') || ((typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION) && motherGraphType == 'duration')) ? this.renderTodayPastDaysView : null}
      renderItem={isListViewSelected ? this.renderListView : this.renderDayView}
      ListEmptyComponent={!isLoading && this.renderListEmptyView}
    />
    :
    <FlatList
      contentContainerStyle={styles.verticalListStyle}
      keyExtractor={(item, index) => index.toString()}
      data={filteredData}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          //refresh control used for the Pull to Refresh
          onRefresh={() => {
            if (isTodaySelected || isListViewSelected) {
              this.pageNumber = 1
              this.setState({refreshing: true, noMoreFound: false})
            } else {
              this.past7DaysPageNumber = 1
              this.setState({refreshing: true, noMorePastDaysFound: false})
            }
            this.callTrackingAPi()
            this.whoPageNumber=1
            this.callWhoTrackingAPi()
          }
          }
        />
      }
      onEndReachedThreshold={0.1}
      onEndReached={() => {
        if (isTodaySelected || isListViewSelected) {
          if (!noMoreFound) {
            let pgNo = parseInt(trackingData.length / 100)
            pgNo += 1
            if (this.pageNumber != pgNo) {
              this.pageNumber = pgNo
              this.callTrackingAPi()
            }

          }
        } else {
          if (!noMorePastDaysFound) {
            let pgNo = parseInt(pastDaysTrackingData.length / 100)
            pgNo += 1
            if (this.past7DaysPageNumber != pgNo) {
              this.past7DaysPageNumber = pgNo
              this.callTrackingAPi()
            }

          }
        }

      }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={!isListViewSelected && ((typeSelected !== KeyUtils.TRACKING_TYPE_SELECT_ALL && (typeSelected !== KeyUtils.TRACKING_TYPE_GROWTH) && (typeSelected !== KeyUtils.TRACKING_TYPE_WEIGHT)) || ((typeSelected === KeyUtils.TRACKING_TYPE_GROWTH || typeSelected === KeyUtils.TRACKING_TYPE_WEIGHT) && graphType == 'stat') || ((typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION) && motherGraphType == 'duration')) ? this.renderTodayPastDaysView : null}
      renderItem={isListViewSelected ? this.renderListView : this.renderDayView}
      ListEmptyComponent={!isLoading && this.renderListEmptyView}
    />
     )
  }

  renderFLatListMotherTracking(filteredData) {
    const {
      isTodaySelected,
      refreshing,
      motherTrackingData,
      typeSelected,
      isListViewSelected,
      isLoading,
      noMoreMotherFound,
      noMoreMotherPastDaysFound,
      graphType,
      startDate
    } = this.state;
    let list=(typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION && isListViewSelected) ? motherTrackingData : filteredData
    if (isListViewSelected) {
      list = this.filterData(list, startDate, false, '')
    }
    list.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.trackAt) - new Date(a.trackAt);
    });

    return <FlatList
      contentContainerStyle={styles.verticalListStyle}
      keyExtractor={(item, index) => index.toString()}
      data={list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          //refresh control used for the Pull to Refresh
          onRefresh={() => {
            if (isTodaySelected || isListViewSelected) {
              this.motherTrackingPageNumber = 1
              this.setState({refreshing: true, noMoreMotherFound: false})
            } else {
              this.motherTrackingPast7DaysPageNumber = 1
              this.setState({refreshing: true, noMoreMotherPastDaysFound: false})
            }
            this.callMotherTrackingApi()
          }
          }
        />
      }
      onEndReachedThreshold={0.1}
      onEndReached={() => {
        if (isTodaySelected || isListViewSelected) {
          if (!noMoreMotherFound) {
            let data = typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION && isListViewSelected ? motherTrackingData : filteredData
            let pgNo = parseInt(data.length / 100)
            pgNo += 1
            if (this.motherTrackingPageNumber != pgNo) {
              this.motherTrackingPageNumber = pgNo
              this.callMotherTrackingApi()
            }

          }
        } else {
          if (!noMoreMotherPastDaysFound) {
            let data = typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION && isListViewSelected ? motherTrackingData : filteredData
            let pgNo = parseInt(data.length / 100)
            pgNo += 1
            if (this.motherTrackingPast7DaysPageNumber != pgNo) {
              this.motherTrackingPast7DaysPageNumber = pgNo
              this.callMotherTrackingApi()
            }

          }
        }

      }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={!isListViewSelected && ((typeSelected !== KeyUtils.TRACKING_TYPE_SELECT_ALL && (typeSelected !== KeyUtils.TRACKING_TYPE_GROWTH) && (typeSelected !== KeyUtils.TRACKING_TYPE_WEIGHT)) || ((typeSelected === KeyUtils.TRACKING_TYPE_GROWTH || typeSelected === KeyUtils.TRACKING_TYPE_WEIGHT) && graphType == 'stat')) ? this.renderTodayPastDaysView : null}
      renderItem={isListViewSelected ? this.renderListView : this.renderDayView}
      ListEmptyComponent={!isLoading && this.renderListEmptyView}
    />
  }

  render() {
    const {navigation} = this.props
    const {
      isTodaySelected,
      refreshing,
      showCalendarPicker,
      showExportCalendarPicker,
      last7Days,
      pastDaysTrackingData,
      motherTrackingData,
      motherPastDaysTrackingData,
      trackingData,
      listTrackingData,
      WhoTrackingData,
      typeSelected,
      isListViewSelected,
      isLoading,
      startDate,
    } = this.state;

    const {selected_baby} = this.props
    let babyId;
    if (selected_baby) {
      babyId = selected_baby.babyId
    }

    let unsortedData = trackingData
    let listUnsortedData=listTrackingData
    let graphData = trackingData
    const isAllSelected = typeSelected === KeyUtils.TRACKING_TYPE_SELECT_ALL
    let filteredData = []
    let listFilteredData = []
    if (typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION) {
      graphData = motherTrackingData
      unsortedData = motherTrackingData
      filteredData = JSON.parse(JSON.stringify(unsortedData))
      if (!isListViewSelected) {
        graphData = isTodaySelected ? motherTrackingData : motherPastDaysTrackingData
        filteredData=JSON.parse(JSON.stringify(graphData))
        if (isTodaySelected){
          graphData.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.trackAt) - new Date(a.trackAt);
          });
          filteredData.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.trackAt) - new Date(a.trackAt);
          });
          filteredData = this.filterData(filteredData, startDate, false, babyId)
        }
        filteredData = this.getUniqueArrForMother(filteredData)
    }

    }
    else if ((typeSelected === KeyUtils.TRACKING_TYPE_GROWTH  || typeSelected === KeyUtils.TRACKING_TYPE_WEIGHT) && this.state.graphType === 'who' && !isListViewSelected) {
      unsortedData = WhoTrackingData
      filteredData = JSON.parse(JSON.stringify(unsortedData))
      filteredData && filteredData.length > 0 && filteredData.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.trackAt) - new Date(a.trackAt);
      });
      if (!isAllSelected && filteredData !== undefined) {
        filteredData = filteredData.filter((e) => {
          return (e.trackingType === typeSelected)
        })
      }
      if (filteredData !== undefined && filteredData.length > 0) {
        if (!isTodaySelected) {    // past7Days Seleceted
            filteredData = filteredData.filter((e) => {
              return (e.babyId === babyId)
            })
        } else {
        //  filteredData = this.filterWhoData(filteredData, startDate, true, babyId)
          filteredData =  filteredData.length > 0 ?this.getUniqueArrForWHO(filteredData).reverse():[]
        }
      }
      graphData = filteredData
    }
    else if(isListViewSelected){
      listFilteredData = JSON.parse(JSON.stringify(listUnsortedData))
      listFilteredData && listFilteredData.length > 0 && listFilteredData.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.trackAt) - new Date(a.trackAt);
      });
      if (!isAllSelected && listFilteredData !== undefined) {
        listFilteredData = listFilteredData.filter((e) => {
          return (e.trackingType === typeSelected)
        })
      }
      if (listFilteredData !== undefined && listFilteredData.length > 0) {
            listFilteredData = listFilteredData.filter((e) => {
              let date = new Date(e.trackAt);
              date.setHours(24, 0, 0, 0)
              return (e.babyId === babyId /*&& date >= past7DaysStartDate && date <= past7DaysEndDate*/)
            })
      }
    }
    else {
      if (!isListViewSelected) {
        unsortedData = isTodaySelected ? trackingData : pastDaysTrackingData
      }
      filteredData = JSON.parse(JSON.stringify(unsortedData))
      filteredData && filteredData.length > 0 && filteredData.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.trackAt) - new Date(a.trackAt);
      });
      if (!isAllSelected && filteredData !== undefined) {
        filteredData = filteredData.filter((e) => {
          return (e.trackingType === typeSelected)
        })
      }
      if (filteredData !== undefined && filteredData.length > 0) {
        if (!isTodaySelected) {    // past7Days Seleceted
          //filteredData=this.filterData(filteredData,startDate,true,babyId)
          if (isAllSelected) {
            filteredData = this.filterData(filteredData, startDate, true, babyId)

          } else {
            filteredData = filteredData.filter((e) => {
              let date = new Date(e.trackAt);
              date.setHours(24, 0, 0, 0)
              return (e.babyId === babyId /*&& date >= past7DaysStartDate && date <= past7DaysEndDate*/)
            })
          }
        } else {
          filteredData = this.filterData(filteredData, startDate, true, babyId)
        }
      }
      graphData = filteredData
      if (!isListViewSelected) {
        filteredData = this.getUniqueArr(filteredData)
        filteredData && filteredData.length > 0 && filteredData.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.trackAt) - new Date(a.trackAt);
        });
      }
    }
    const config = {
      velocityThreshold: 0.001,
      directionalOffsetThreshold: 540
    };

    return (
      <SafeAreaView style={styles.container}>
        {isLoading && <LoadingSpinner/>}
        {this.renderStatsHeader()}
        <View style={{alignItems:'center'}}>
            <SwitchButton
        onValueChange={(val) => {
                const { startDate, isListViewSelected } = this.state

                if (val === 1) {
                  this.setState({ isListViewSelected: true },async()=>{
                    const {isListViewSelected}=this.state;
                    let analytics=new Analytics();
                    await analytics.logOnPress(isListViewSelected===true?'List':'Dashboard')
                  })

                } else {
                  this.setState({ isListViewSelected: false },async()=>{
                    const {isListViewSelected}=this.state;
                    let analytics=new Analytics();
                    await analytics.logOnPress(isListViewSelected===true?'List':'Dashboard')
                  })
                  this.callTrackingAPi()
                }
              }}
        text1={I18n.t('stats_screen.list')}
        text2={I18n.t('stats_screen.dashboard')}
        activeSwitch={isTodaySelected ? 1 : 2}
        switchWidth={windowWidth-20}
        switchHeight={48}
        switchBorderRadius={8}
        switchBorderColor='transparent'
        switchBackgroundColor={Colors.rgb_898d8d33}
        btnBorderColor='transparent'
        btnBackgroundColor={Colors.white}
        fontColor={this.textColor}
        activeFontColor={Colors.rgb_000000}
        amPmStart
        switchdirection={I18nManager.isRTL?'rtl':'ltr'}
      />
          <FlatList
            contentContainerStyle={styles.horizontalListStyle}
            keyExtractor={(item, index) => index.toString()}
            data={StatsTrackingHeader.statsHeader}
            horizontal={true}
            renderItem={this.renderItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={{flex: 1}}>
          {!isListViewSelected && this.renderTimeView()}
          {(!isListViewSelected && !isAllSelected) && <View style={styles.barContainer}>
            {(typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION )?isTodaySelected ? graphData.length > 0 ? this.renderMotherTrackingChart(graphData) : !isLoading && this.renderNoDataView() : (filteredData && filteredData.length > 0) ? this.renderMotherTrackingChart(filteredData) : !isLoading && this.renderNoDataView():
              (isTodaySelected ? (typeSelected === KeyUtils.TRACKING_TYPE_WEIGHT || typeSelected === KeyUtils.TRACKING_TYPE_GROWTH ? graphData : graphData.length > 0) ? this.renderChart(graphData) : !isLoading && this.renderNoDataView() : (filteredData && filteredData.length > 0) ? this.renderChart(filteredData) : !isLoading && this.renderNoDataView())}
          </View>}
          {(typeSelected === KeyUtils.TRACKING_TYPE_CONTRACTION) ?
            this.renderFLatListMotherTracking(filteredData) : (this.state.graphType === 'who' && !isListViewSelected && !this.props.isInternetAvailable) ?null :isListViewSelected? this.renderFLatListChildrenTracking(listFilteredData):this.renderFLatListChildrenTracking(filteredData)
          }

        </View>
        {showCalendarPicker && this.showCustomCalendar()}
        {showExportCalendarPicker && this.showCustomExportCalendar()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  getTrackingResponse: state.home.getTrackingResponse,
  getTrackingApiSuccess: state.home.getTrackingApiSuccess,
  getTrackingApiFailure: state.home.getTrackingApiFailure,
  getWhoTrackingResponse: state.home.getWhoTrackingResponse,
  getWhoTrackingApiSuccess: state.home.getWhoTrackingApiSuccess,
  getWhoTrackingApiFailure: state.home.getWhoTrackingApiFailure,
  getMotherTrackingResponse: state.home.getMotherTrackingResponse,
  getMotherTrackingApiSuccess: state.home.getMotherTrackingApiSuccess,
  getMotherTrackingApiFailure: state.home.getMotherTrackingApiFailure,
  selected_baby: state.home.selected_baby,
  isInternetAvailable: state.app.isInternetAvailable,
  deleteTrackingSuccess: state.home.deleteTrackingSuccess,
  deleteTrackingFailure: state.home.deleteTrackingFailure,
  deleteTrackingId: state.home.deleteTrackingId,
  deleteMotherTrackingSuccess: state.home.deleteMotherTrackingSuccess,
  deleteMotherTrackingFailure: state.home.deleteMotherTrackingFailure,
  deleteMotherTrackingId: state.home.deleteMotherTrackingId,
  themeSelected: state.app.themeSelected,
  routeName:state.nav.routeName,
  trackingId:state.nav.trackingId,
  deleteFreezerInventoryApiResponse: state.home.deleteFreezerInventoryApiResponse,
  appState: state.app.appState,

});

const mapDispatchToProps = (dispatch) => ({
  getTrackingApi: (startDate, endDate, babyId, page, perPage) => dispatch(HomeActions.getTrackingApi(startDate, endDate, babyId, page, perPage)),
  getWhoTrackingApi: (startDate, endDate, babyId, page, perPage,trackingType) => dispatch(HomeActions.getWhoTrackingApi(startDate, endDate, babyId, page, perPage,trackingType)),
  getMotherTrackingApi: (startDate, endDate, page, perPage) => dispatch(HomeActions.getMotherTrackingApi(startDate, endDate, page, perPage)),
  deleteTrackingApi: (trackingId, babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId, babyId)),
  deleteMotherTrackingApi:(trackingId) => dispatch(HomeActions.deleteMotherTrackingApi(trackingId)),
  deleteFreezerInventoryApi: (id) => dispatch(HomeActions.deleteFreezerInventoryApi('/inventoryId/' + id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StatsScreen);
