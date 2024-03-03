import React from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {connect} from "react-redux";
import LoadingSpinner from '@components/LoadingSpinner'
import HomeActions from '@redux/HomeRedux';
import Dialog from '@components/Dialog';
import CustomTextInput from "@components/CustomTextInput";
import TrackingDateTime from "@components/TrackingDateTime";
import PeeIcon from '@svg/ic_pee.svg'
import PeeActiveIcon from '@svg/ic_pee_active.svg'
import PooIcon from '@svg/ic_poo.svg'
import PooActiveIcon from '@svg/ic_poo_active.svg'
import BothIcon from '@svg/ic_peepooboth.svg'
import BothActiveIcon from '@svg/ic_peepooboth_active.svg'
import I18n from '@i18n';
import { Colors } from '@resources'
import styles from './Styles/NappyTrackingScreenStyles';
import HeaderTrackings from "@components/HeaderTrackings";
import moment from "moment";
import BottomButtonsView from "@components/BottomButtonsView";
import {createTrackedItem, deleteTrackingItem} from "@database/TrackingDatabase";
import KeyUtils from "@utils/KeyUtils";
import Toast from "react-native-simple-toast";
import {appendTimeZone} from "@utils/TextUtils";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class EditNappyTrackingScreen extends React.Component {
  constructor(props) {
    super(props);
    let remark=this.props.navigation.state.params&&this.props.navigation.state.params.item&&this.props.navigation.state.params.item.remark?this.props.navigation.state.params.item.remark:'';
    this.state = {
      milkItemSelectedIndex: -1,
      isLoading: false,
      isPeeSelected: false,
      isPooSelected: false,
      showDeleteTrackingAlert:false,
      isBothSelected: false,
      noteTextInput: remark,
      showBabyList: false,
      selectedDate:moment(this.props.navigation.state.params.item.trackAt).format(),
      babyId: '',
      disableButton:false,
      isDateChanged:false
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)

  }

  async componentDidMount() {
    const {navigation}=this.props
    const {babyId,trackAt,batchType,remark} = navigation.state.params.item
    console.log('Item--',navigation.state.params.item)
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    switch (batchType){
      case 1:
        this.setState({babyId,selectedDate:trackAt,isPeeSelected:true})
        break;
      case 2:
        this.setState({babyId,selectedDate:trackAt,isPooSelected:true})
        break;
      case 3:
        this.setState({babyId,selectedDate:trackAt,isBothSelected:true})
        break;
    }
    await analytics.logScreenView('edit_nappy_tracking_screen')
  }
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {trackingApiSuccess, trackingApiFailure, navigation,deleteTrackingId,deleteTrackingSuccess, deleteTrackingFailure} = this.props;
    if (deleteTrackingSuccess != prevProps.deleteTrackingSuccess && deleteTrackingSuccess && prevState.isLoading) {
      deleteTrackingItem(deleteTrackingId)
      this.setState({isLoading: false})
      this.props.navigation.goBack()
    }

    if (deleteTrackingFailure != prevProps.deleteTrackingFailure && deleteTrackingFailure && prevState.isLoading) {
      this.setState({isLoading: false})
    }
    if (trackingApiSuccess!=prevProps.trackingApiSuccess && trackingApiSuccess && prevState.isLoading){
      this.saveTrackingInDb(true)
      Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
      navigation.goBack()
      this.setState({isLoading:false})
    }

    if (trackingApiFailure!=prevProps.trackingApiFailure && trackingApiFailure && prevState.isLoading){
      this.saveTrackingInDb(false)
      this.setState({isLoading:false})
    }

  }

  renderType() {
    const {isPeeSelected, isPooSelected, isBothSelected} = this.state

    return <View style={styles.sessionTypeView}>
      <View style={{flex: 0.5,}}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sessionTypeTextStyle,{color:this.textColor}]}>{I18n.t('nappy_tracking.type')}</Text>
      </View>

      <View style={[styles.sessionRightView, {flex: 1.5}]}>
        <View>
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
        <View>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={I18n.t("accessibility_labels.poo_icon")}
            onPress={() => this.setState({isPeeSelected: false, isPooSelected: true, isBothSelected: false})}
            style={[styles.breastFeedingViewStyle]}>
            {isPooSelected ? <PooActiveIcon width={70} height={70}/> : <PooIcon width={70} height={70}/>}
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.typeTextStyle,{color:this.textColor}]}>{I18n.t('nappy_tracking.poo')}</Text>
        </View>
        <View>
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
    this.setState({babyId: item.babyId})
  }

  renderNoteView() {
    const {noteTextInput}=this.state
    return <CustomTextInput
      maxLength={1000}
      maxHeight={100}
      textContentType="familyName"
      value={noteTextInput}
      onChangeText={(index, value) => this.setState({noteTextInput: value})}
      placeholder={I18n.t('nappy_tracking.add_note')}
      placeholderTextColor={this.textColor}
      textStyles={[styles.addNoteTextInput,{color:this.textColor}]}
      multiline={true}
      enableDoneButton={true}/>
  }
  showDeleteTrackingPopup() {
    const {showDeleteTrackingAlert} = this.state
    return (
      <Dialog
        visible={showDeleteTrackingAlert}
        title={I18n.t('tracking.title')}
        message={I18n.t('tracking.delete_tracking_message')}
        positive={I18n.t('generic.yes')}
        negative={I18n.t('generic.no')}
        isIcon={false}
        negativeOnPress={() => {
          this.setState({showDeleteTrackingAlert: false})

        }}
        positiveOnPress={() => {
          const {deleteTrackingApi,navigation}=this.props
          const {babyId,id} = navigation.state.params.item
          this.setState({showDeleteTrackingAlert: false,isLoading:true})
          deleteTrackingApi(id,babyId)
        }}
        onDismiss={() => {
        }}
      />
    )
  };

  render() {
    const {navigation} = this.props
    const {showDeleteTrackingAlert, isLoading, selectedDate,isMixSelected, isFormulaSelected} = this.state

    return <View style={{width:'100%', height:'100%'}}>
      <HeaderTrackings
        hideCalendarIcon={true}
        timeCalendarDate={selectedDate}
        updateTimeCalendarUIPress={(date,duration)=>{
          this.setState({
            isDateChanged:true,
            selectedDate:date
          })
        }}
        updateValidation={(val)=>{
          this.setState({disableButton:val})
        }}
        isEditable={true}
        title={I18n.t('nappy_tracking.nappy')}
        onPressBaby={() => this.setState({showBabyList: true})}
        onBackPress={() => navigation.goBack()}
        onBabyListPress={(item) => this.getSelectedBabyDetails(item)}
        navigation={navigation}
        selectedDate={selectedDate}
        getSelectedDate={(value)=>this.setState({selectedDate:value}) }/>
      {/* <TrackingDateTime date={selectedDate} time={selectedDate}/> */}
      <ScrollView>
        {isLoading && <LoadingSpinner/>}
        {showDeleteTrackingAlert && this.showDeleteTrackingPopup()}
        <View style={styles.container}>
          {this.renderType()}
          {this.renderNoteView()}
        </View>
      </ScrollView>
      <BottomButtonsView
        positiveButtonTitle={I18n.t('generic.save').toUpperCase()}
        negativeButtonTitle={I18n.t('generic.delete').toUpperCase()}
        onNegativePress={() => this.setState({showDeleteTrackingAlert:true})}
        onPositivePress={() => this.handleValidations()}
        disable={isLoading || this.state.disableButton}
      />
    </View>
  }
  async handleValidations() {
    const {noteTextInput, isPeeSelected, isPooSelected, isBothSelected, selectedDate, babyId} = this.state
    const {babies,navigation} = this.props
    const {id} = navigation.state.params.item
    if (babies && babies.length > 0) {
      let formattedDate=await appendTimeZone(selectedDate)
      let obj = {
        "babyId": babyId,
        "batchType": 1,
        "confirmed": true,
        "remark": noteTextInput,
        "quickTracking": false,
        "trackAt": formattedDate,
        "id": id,
        "trackingType": KeyUtils.TRACKING_TYPE_DIAPER
      }

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
      const {isInternetAvailable,trackingApi}=this.props
      if (isInternetAvailable){
        this.setState({isLoading: true});
        trackingApi(json);
      }else {
        this.saveTrackingInDb(false)
      }
    }
  }

  saveTrackingInDb(isSync){
    this.trackingObj.isSync= isSync
    this.trackingObj.userId= this.props.userProfile.mother.username
    createTrackedItem(this.trackingObj).then((r)=>{
      if (!isSync) {
        Toast.show(I18n.t("tracking.tracking_toaster_update_text"), Toast.SHORT);
        this.props.navigation.goBack()
      }
    })
  }

}


const mapStateToProps = (state) => ({
  isInternetAvailable:state.app.isInternetAvailable,
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  trackingApiSuccess: state.home.trackingApiSuccess,
  trackingApiFailure: state.home.trackingApiFailure,
  deleteTrackingSuccess:state.home.deleteTrackingSuccess,
  deleteTrackingFailure:state.home.deleteTrackingFailure,
  deleteTrackingId:state.home.deleteTrackingId,
  themeSelected: state.app.themeSelected
})

const mapDispatchToProps = (dispatch) => ({
  trackingApi: (trackingData) => dispatch(HomeActions.trackingApi(trackingData)),
  deleteTrackingApi: (trackingId,babyId) => dispatch(HomeActions.deleteTrackingApi(trackingId,babyId)),
});


export default connect(mapStateToProps, mapDispatchToProps)(EditNappyTrackingScreen);


