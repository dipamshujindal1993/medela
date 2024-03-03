import React, {Component} from 'react'
import {Image, Platform, FlatList, ScrollView, BackHandler, Text, TouchableOpacity, View, Modal} from 'react-native'
import {connect} from "react-redux";
import LoadingSpinner from '@components/LoadingSpinner'
import HomeActions from '@redux/HomeRedux';
import UserActions from '@redux/UserRedux';
import Button from "@components/Button";
import CustomTextInput from "@components/CustomTextInput";
import PeeIcon from '@svg/ic_pee.svg'
import PeeActiveIcon from '@svg/ic_pee_active.svg'
import PooIcon from '@svg/ic_poo.svg'
import PooActiveIcon from '@svg/ic_poo_active.svg'
import BothIcon from '@svg/ic_peepooboth.svg'
import BothActiveIcon from '@svg/ic_peepooboth_active.svg'
import I18n from '@i18n';
import Colors from "../Resources/Colors";
import styles from './Styles/NappyTrackingScreenStyles';
import HeaderTrackings from "@components/HeaderTrackings";
import moment from "moment";
import {uuidV4,appendTimeZone} from "@utils/TextUtils";
import BottomButtonsView from "@components/BottomButtonsView";
import {createTrackedItem} from "@database/TrackingDatabase";
import KeyUtils from "@utils/KeyUtils";
import Toast from 'react-native-simple-toast';
// import { checkDays,saveWetNappyTrack, saveDryNappyTrack } from '@components/Notifications';
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "@services/NavigationService";
import SiriBabySelectionModal from "@components/SiriBabySelectionModal";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class NappyTrackingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      milkItemSelectedIndex: -1,
      isLoading: false,
      isPeeSelected: true,
      isPooSelected: false,
      isBothSelected: false,
      noteTextInput: '',
      showBabyList: false,
      selectedDate:moment().format(),
      notifBatchType: '',
      showSiriBabySelectionModal:this.props.navigation.state.params!= undefined?this.props.navigation.state.params.isSiriNameReturned:undefined,
      initialCalenderValue:undefined,
      isCalenderValueDetained:false,
      disableButton:false,
      isDateChanged:false,
      timeCalendarDate:moment()
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.badSessionIndex = -1
    this.lastBreastIndex = -1
  }

  async componentDidMount() {
    const {navigation,themeSelected}=this.props;
    // this.setState({})
    this.focusListener = navigation.addListener('willFocus', () => {
      this.themeSelected=themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    })
    if(navigation && navigation.state.params){
      this.onNappyNotifClick()
    }
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
    {this.state.showSiriBabySelectionModal? setTimeout(() => {this.handleValidations()}, 500):null}
    await analytics.logScreenView('diaper_tracking_screen')
  }

  onNappyNotifClick() {
    const {selected_baby, navigation, setSelectedBaby, switchBaby}=this.props;
    console.log(navigation.state.params.baby, 'navigation.state.params.babynavigation.state.params.baby')
    this.setState({ notifBatchType: navigation.state.params.diaper })
    if(navigation.state.params.type === 'both') {
      this.setState({ isBothSelected: true, isPeeSelected: false, isPooSelected: false })
    } else if(navigation.state.params.type === 'poo') {
      this.setState({ isPooSelected: true, isPeeSelected: false, isBothSelected: false })
    } else {
      this.setState({ isPeeSelected: true, isBothSelected: false, isPooSelected: false })
    }
    if(navigation.state.params.baby!=undefined && navigation.state.params.baby.babyId !== selected_baby.babyId) {
      setSelectedBaby(navigation.state.params.baby)
      switchBaby(navigation.state.params.baby.babyId)
    }
  }

  _handleBack=()=>{
    const {navigation}=this.props
    this.setState({disableButton:false})
    navigation.goBack()
    AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
      if (tabName!=null){
        NavigationService.navigate(tabName)
      }else{
        NavigationService.navigate('Baby')
      }
    })
  }

  onAndroidBackPress = () => {
      this._handleBack()
      return true;
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
    this.focusListener && this.focusListener.remove();
  }
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {

    const {trackingApiSuccess,trackingApiFailure,navigation}=this.props
    if (trackingApiSuccess!=prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading){
      this.saveTrackingInDb(true)
    }

    if (trackingApiFailure!=prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading){
    //  this.saveTrackingInDb(false)
      this.setState({isLoading:false})
    }

    if(navigation && navigation.state.params && navigation.state.params.diaper !== this.state.notifBatchType) {
      console.log('innnnnnninnnnnnninnnnnnninnnnnnninnnnnnninnnnnnninnnnnnninnnnnnninnnnnnninnnnnnninnnnnnn')
      this.onNappyNotifClick()
    }

  }

  planToReturnWork = (value) => {
    if (value === 'yes') {
      this.setState({showWorkDateSection: true});
    } else {
      this.setState({showWorkDateSection: false, chooseBackWorkDate: ''});
    }
  };

  renderType() {
    const {isPeeSelected, isPooSelected, isBothSelected} = this.state
console.log('this.textColor',this.textColor)
    return <View style={styles.sessionTypeView}>
      <View style={{flex: 0.5,}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('nappy_tracking.type')}</Text>
      </View>

      <View style={[styles.sessionRightView, {flex: 1.5}]}>
        <View style={{width:0,flexGrow:1,flex:1}}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={I18n.t("accessibility_labels.pee_icon")}
            onPress={() => this.setState({isPeeSelected: true, isPooSelected: false, isBothSelected: false})}
            style={styles.breastFeedingViewStyle}>
            {isPeeSelected ? <PeeActiveIcon width={70} height={70}/> :
              <PeeIcon width={70} height={70}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.typeTextStyle,{color:this.textColor}]}>{I18n.t('nappy_tracking.pee')}</Text>
        </View>
        <View style={{width:0,flexGrow:1,flex:1}}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={I18n.t("accessibility_labels.poo_icon")}
            onPress={() => this.setState({isPeeSelected: false, isPooSelected: true, isBothSelected: false})}
            style={[styles.breastFeedingViewStyle]}>
            {isPooSelected ? <PooActiveIcon width={70} height={70}/> : <PooIcon width={70} height={70}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.typeTextStyle,{color:this.textColor}]}>{I18n.t('nappy_tracking.poo')}</Text>
        </View>
        <View style={{width:0,flexGrow:1,flex:1}}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={I18n.t("accessibility_labels.both_icon")}
            onPress={() => this.setState({isPeeSelected: false, isPooSelected: false, isBothSelected: true})}
            style={[styles.breastFeedingViewStyle]}>
            {isBothSelected ? <BothActiveIcon width={70} height={70}/> : <BothIcon width={70} height={70}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.typeTextStyle,{color:this.textColor}]}>{I18n.t('nappy_tracking.both')}</Text>
        </View>
      </View>
    </View>
  }

  getSelectedBabyDetails(item) {
 //   this.setState({babyId: item.babyId})
  }

  renderNoteView() {
    return <CustomTextInput
      maxLength={1000}
      textContentType="familyName"
      onChangeText={(index, value) => this.setState({noteTextInput: value})}
      placeholder={I18n.t('nappy_tracking.add_note')}
      placeholderTextColor={this.textColor}
      textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
      multiline={true}
      maxHeight={200}
      enableDoneButton={true}/>
  }

  render() {
    const {isMilkSelected, isLoading, isMixSelected, isFormulaSelected,isCalenderValueDetained,initialCalenderValue,timeCalendarDate} = this.state
    const {navigation} = this.props
    console.log('this.props.themeSelected',this.props.themeSelected)
    return <View style={{width:'100%', height:'100%'}}>
      <HeaderTrackings
        hideCalendarIcon={true}
        timeCalendarDate={timeCalendarDate}
        updateTimeCalendarUIPress={(date,duration)=>{
          this.setState({
            isDateChanged:true,
            timeCalendarDate:date
          })
        }}
        updateValidation={(val)=>{
          this.setState({disableButton:val})
        }}
        title={I18n.t('nappy_tracking.nappy')}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => this._handleBack()}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        getSelectedDate={(value)=>this.setState({selectedDate:value,isCalenderValueDetained:true}) }
        selectedDate={isCalenderValueDetained==false?initialCalenderValue :undefined}
        calenderIconPressed={()=>{
          if(isCalenderValueDetained===false){
            this.setState({initialCalenderValue: moment().format()});
          }
        }}
        />
      <ScrollView>
        {isLoading && <LoadingSpinner/>}
        {(this.state.showSiriBabySelectionModal!= undefined && !this.state.showSiriBabySelectionModal) && <SiriBabySelectionModal
        showBabySelectionModal={!this.state.showSiriBabySelectionModal}
        cancelBabyPress={(visible)=>{
          this.setState({showSiriBabySelectionModal:false})
          this.handleValidations()

        }}
        onBabyListPress={(item) => {
          this.setState({showSiriBabySelectionModal:false})
          this.handleValidations()
        }}
        navigation={navigation}
      />}
        <View style={styles.container}>
          {this.renderType()}
          {this.renderNoteView()}
        </View>
      </ScrollView>
      <BottomButtonsView
        positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
        negativeButtonTitle={I18n.t('generic.cancel').toUpperCase()}
        onNegativePress={() => this._handleBack()}
        onPositivePress={() => this.handleValidations()}
        disable={isLoading || this.state.disableButton}
      />
    </View>
  }
  async handleValidations() {
    const {noteTextInput, isPeeSelected, isPooSelected, isBothSelected, selectedDate,isCalenderValueDetained,timeCalendarDate} = this.state
    const {babies,selected_baby}=this.props
    const {babyId}=selected_baby
    this.setState({disableButton:true})
    if (babies && babies.length > 0) {
      //let formattedDate=await appendTimeZone(isCalenderValueDetained===true?selectedDate:new Date())
      let formattedDate = await appendTimeZone(timeCalendarDate)
      let obj = {
        "babyId": babyId,
        "batchType": 1,
        "confirmed": true,
        "remark": noteTextInput,
        "quickTracking": false,
        "trackAt": formattedDate,
        "id": uuidV4(),
        "trackingType": KeyUtils.TRACKING_TYPE_DIAPER
      }
      console.log('selectedDate--',selectedDate)

      if (isPeeSelected) {
        obj.batchType = 1
      }
      if (isPooSelected) {
        obj.batchType = 2
      }
      if (isBothSelected) {
        obj.batchType = 3
      }
      this.trackingObj=obj
      let json = {
        trackings: [this.trackingObj],
      };
      // this.saveTrackInNotif(this.trackingObj, selected_baby)
      const {isInternetAvailable,trackingApi}=this.props
      if (isInternetAvailable){
        this.setState({isLoading: true});
        trackingApi(json);
      }else {
        this.saveTrackingInDb(false)
      }
    }
  }

  saveTrackInNotif(trackingData, baby) {
    if(checkDays(baby.birthday) <= 0 && checkDays(baby.birthday) >= -40 && this.state.isPooSelected) {
      saveDryNappyTrack(trackingData, baby)
    }
    if(checkDays(baby.birthday) <= -4 && checkDays(baby.birthday) >= -40 && this.state.isPeeSelected) {
      saveWetNappyTrack(trackingData, baby)
    }
  }

  saveTrackingInDb(isSync){
    this.trackingObj.isSync= isSync
    this.trackingObj.userId= this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r)=>{
      console.log('result--',r)
      // alert("Success")
      Toast.show(I18n.t("tracking.tracking_toaster_text"), Toast.SHORT);
       this._handleBack()
    })
  }

}


const mapStateToProps = (state) => ({
  isInternetAvailable:state.app.isInternetAvailable,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  selected_baby: state.home.selected_baby,
  themeSelected: state.app.themeSelected,
})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  setSelectedBaby: (item) => dispatch(HomeActions.setSelectedBaby(item)),
  switchBaby: (babyId) => dispatch(UserActions.switchBaby(babyId)),
});


export default connect(mapStateToProps, mapDispatchToProps)(NappyTrackingScreen);
