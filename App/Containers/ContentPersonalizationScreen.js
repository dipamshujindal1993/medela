import React from 'react'
import {View, Text, TouchableOpacity, SafeAreaView, FlatList, Platform, I18nManager} from 'react-native';
import BackIcon from '@svg/arrow_back';
import Colors from '@resources/Colors';
import styles from './Styles/ContentPersonalizationScreenStyles';
import I18n from '@i18n';
import HomeActions from '@redux/HomeRedux';
import {connect} from 'react-redux';
import {locale} from '@utils/locale';
import Button from '@components/Button';
import LoadingSpinner from "@components/LoadingSpinner";
import moment from 'moment';
import CustomTextInput from '@components/CustomTextInput';
import CustomCalendar from '@components/CustomCalendar';
import Dialog from '@components/Dialog';
import KeyUtils from "@utils/KeyUtils";
import AsyncStorage from "@react-native-community/async-storage";
import { getDateFormat } from "@utils/TextUtils";
import { Analytics } from '@services/Firebase';
import {Constants} from "../Resources";
import {verticalScale} from "@resources/Metrics";

let analytics = new Analytics()

class ContentPersonalizationScreen extends React.Component {
  constructor(props){
    super(props)
    this.state={
      getData:{},
      questionsList:[],
      isLoading: false,
      startTime: moment(),
      showCalendar: false,
      selectedDate: moment().format(),
      updatedDate: '',
      calendarId:'',
      updatedList:[],
      showNoDataPopUp: false,
      showOfflinePopUp: false,
      formattedDate: ''
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.locale=locale().replace("-", "_")
  }
  async componentDidMount(){
    const{babies, isInternetAvailable}= this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    babies && babies.length>0 && (this.setState({babyId: babies[0].babyId}))
    if(isInternetAvailable){
      AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
        if (_local!=null){
          this.locale=_local
        }
        console.log(this.locale)
        this.getCpApi()
      })

    }else{
      this.setState({showOfflinePopUp: true})
    }
    await analytics.logScreenView('content_personalization_screen')
  }

  getCpApi(){
    const {getContentPersonalizationApi}=this.props
    this.setState({isLoading:true})
    getContentPersonalizationApi(this.locale)
  }

  async componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
    const {getContentPersonalizationApiFailure, getContentPersonalizationApiSuccess, getCPResponse, contentPersonalizationApiSuccess, contentPersonalizationApiFailure, navigation}=this.props
    if (getContentPersonalizationApiSuccess!=prevProps.getContentPersonalizationApiSuccess &&  getContentPersonalizationApiSuccess  && prevState.isLoading){
      let arr=JSON.parse(JSON.stringify(getCPResponse))
      for(let i=0;i<arr.questions.length;i++){
        let ele=arr.questions[i]
        for(let j=ele.options.length-1;j>=0;j--){
          if(arr.questions[i].options[j].localizedContent=='<NoShow>'){
            arr.questions[i].options.splice(j,1)
          }
        }
      }
      this.setState({isLoading:false, getData:arr, questionsList: arr.questions, updatedList: [arr.questions[0]]})
    }
    if (getContentPersonalizationApiFailure!=prevProps.getContentPersonalizationApiFailure && getContentPersonalizationApiFailure && prevState.isLoading){
    if (getCPResponse){
      let arr=JSON.parse(JSON.stringify(getCPResponse))
      for(let i=0;i<arr.questions.length;i++){
        let ele=arr.questions[i]
        for(let j=ele.options.length-1;j>=0;j--){
          if(arr.questions[i].options[j].localizedContent=='<NoShow>'){
            arr.questions[i].options.splice(j,1)
          }
        }
      }
      this.setState({isLoading:false, getData:arr, showNoDataPopUp: true})
    }else{
       this.setState({isLoading:false, getData:[], showNoDataPopUp: true})
     }
    }

    if (contentPersonalizationApiSuccess!=prevProps.contentPersonalizationApiSuccess &&  contentPersonalizationApiSuccess  && prevState.isLoading){
      let param = {
        'completed':'content_personalization'
      }
      await analytics.logEvent(Constants.QUESTIONNAIRE_INTERACTION, param);
      AsyncStorage.removeItem(KeyUtils.CP_NOTIFICATION_FIREDATE)
      navigation.navigate('ContentPersonalizationSuccess',{isUserFromNotification:this.props.navigation.state.params!==undefined})
    }
    if (contentPersonalizationApiFailure!=prevProps.contentPersonalizationApiFailure && contentPersonalizationApiFailure && prevState.isLoading){
      alert("Failure")
      this.setState({isLoading:false})
    }
  }

  selectAnswer=(item, obj)=>{
    const{id, type}=item
    const{questionsList, updatedList, updatedDate}=this.state
    let nextQuestionId = obj.jumpLogic
    // this.addPreviousValue(item, obj)
    updatedList.forEach((element, index) => {
      if(id === element.id){
        if(type === 'radio'){
          this.setState(previousState => {
            const updatedList = [...previousState.updatedList];
            updatedList[index] = {...updatedList[index], value: obj.localizedContent };
            return { updatedList };
          });
        }else{
          let tempValueArr =[]
          if(item.hasOwnProperty('value') && item.value.length){
            tempValueArr = item.value
            if(!item.value.includes(obj.localizedContent)){
              tempValueArr.push(obj.localizedContent)
            }else{
              let contentIndex = item.value.indexOf(obj.localizedContent)
              tempValueArr.splice(contentIndex, 1)
            }
          }
          else{
            tempValueArr.push(obj.localizedContent)
          }
          this.setState(previousState => {
            const updatedList = [...previousState.updatedList];
            updatedList[index] = {...updatedList[index], value: tempValueArr };
            return { updatedList };
          });
        }
      }
    });
    const lastIndex = updatedList.findIndex(ele => ele.id === nextQuestionId);
    const startIndex = updatedList.findIndex(ele => ele.id === item.id);
      if (lastIndex < 0) {
        questionsList.forEach((element, index)=>{
          if(element.id === id){
            let updatedIndex = index
            updatedList.splice(updatedIndex+1)
          }
          if(element.id === nextQuestionId){
            if(item.hasOwnProperty('value') && item.value.length) {
              //Value already selected for this question then always replace
              updatedList[startIndex+1] = element
            } else {
              updatedList.push(element)
            }
          }
        })
      }
      else if(lastIndex && lastIndex > startIndex) {
        updatedList.splice(startIndex+1, lastIndex - startIndex -1);
      }

      let dateEntries = updatedList.filter(obj => obj.type === 'date');
      if(dateEntries.length == 0) {
        this.setState({updatedDate: ''})
      }
  }

  buttonsView=(item)=>{
    const{themeSelected}=this.props
    return(
      <View>
        { item.options.map((obj, index)=>{
          let defaultBackgroundColor= themeSelected==="dark" ? Colors.rgb_373838: Colors.white
          let defaultTextColor= themeSelected==="dark" ?  Colors.white : Colors.rgb_000000
          item.hasOwnProperty('value') && item.value === obj.localizedContent &&
          (defaultBackgroundColor= themeSelected==="dark" ? Colors.white: Colors.rgb_707070) &&
          (defaultTextColor = themeSelected==="dark" ? Colors.rgb_000000: Colors.white)
          item.hasOwnProperty('value') && Array.isArray(item.value) && item.value.includes(obj.localizedContent) &&
          (defaultBackgroundColor=themeSelected==="dark" ? Colors.rgb_767676: Colors.rgb_707070) &&
          (defaultTextColor = themeSelected==="dark" ? Colors.rgb_000000: Colors.white)
          return(
            <TouchableOpacity
              key={index}
              onPress={()=> this.selectAnswer(item, obj)}
              style={[styles.buttonView, {backgroundColor: defaultBackgroundColor,minHeight: 48}]}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.btnTextStyle, {color:defaultTextColor}]}>{obj.localizedContent}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  dateBtnView=(item)=>{
    const{updatedDate, formattedDate}=this.state
    return(
      <View style={styles.dateTextInputStyle}>
        <CustomTextInput
          placeholder={I18n.t('profileSetup.chooseDate')}
          placeholderTextColor={this.textColor}
          textStyles={[styles.textInput,{color:this.textColor,height:48}]}
          // error={back_to_work_error}
          errorMessage={I18n.t('profileSetup.back_to_work_date')}
          editable={false}
          ableToOpen={true}
          value={updatedDate ? formattedDate: ''}
          onPress={() => this.setState({showCalendar: true, calendarId: item.id})}
          inputStyle={{height:48}}
        />
      </View>
    )
  }


  itemView =(item, index)=>{
    const{localizedTitle, type}=item
    const{themeSelected}=this.props

    let indexBackgroundColor = Colors.rgb_f5f5f5
    if(themeSelected==="dark"){
      indexBackgroundColor = Colors.rgb_373838
    }

    return(
      <View style={styles.itemViewStyle}>
        <View style={styles.itemQuesView}>
          <View style={[styles.itemIndexViewStyle, {backgroundColor: indexBackgroundColor}]}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.itemIndexTextStyle,{color:this.textColor}]}>{index + 1}</Text>
          </View>
          <Text maxFontSizeMultiplier={1.7} style={[styles.itemQuesTextStyle,{color:this.textColor}]}>{localizedTitle}</Text>
        </View>
        {type !== 'date' ?
          this.buttonsView(item):
          this.dateBtnView(item)
        }
      </View>
    )
  }

  renderListItem=({item, index})=>{
    return(
      <View>
        {this.itemView(item, index)}
      </View>
    )
  }

  positiveOnPress = async(updatedDate) => {
    const{updatedList, calendarId, questionsList}=this.state
    let updatedListLastObj = updatedList[updatedList.length-1]
    let newDate = await getDateFormat(updatedDate)
    this.setState({
      updatedDate: updatedDate,
      showCalendar: false,
      formattedDate: newDate,
      selectedDate: updatedDate
    })
    questionsList.forEach((obj, index)=>{
      // if(obj.id === calendarId){
      // 	this.setState(previousState => {
      // 		const showCalendar = false
      // 		const updatedList = [...previousState.updatedList];
      // 		updatedList[index] = {...updatedList[index], value: moment(updatedDate).unix()+''};
      // 		return { updatedList, showCalendar };
      // 	});
      // }

      if(updatedListLastObj.order === 3 && obj.order === 4){
        updatedList.push(obj)
        this.setState({})
      }
    })

  }

  _onDateChange = (date) => {
    this.setState({
      // updatedDate: date
    })
  }

  negativeOnPress = () => {
    this.setState({
      // updatedDate: moment(),
      showCalendar: false
    })
  }

  showCustomCalendar = () =>{
    const{showCalendar, selectedDate}= this.state
    return (
      <CustomCalendar
        visible={showCalendar}
        title={I18n.t('login.forgot_password_title')}
        message={I18n.t('login.forgot_password_message')}
        positive={I18n.t('login.ok')}
        negative={I18n.t('login.cancel')}
        selectedDate={selectedDate}
        minDate={new Date()}
        negativeOnPress={() => this.negativeOnPress()}
        positiveOnPress={(updatedDate) => this.positiveOnPress(updatedDate)}
        onDismiss={() => {
        }}
        onDateChange={(date) => this._onDateChange(date)}
        showHeader={true}
        notShowTime={true}
      />
    )
  }

  handleValidations=()=>{
    const{babies, contentPersonalizationApi}=this.props
    const {getData, startTime, updatedList, updatedDate} = this.state;

    let answersList = JSON.parse(JSON.stringify(updatedList))
    if (babies && babies.length > 0) {
      answersList.forEach(obj=>{
        obj.questionId = obj.id
        obj.title = obj.localizedTitle
        obj.type === 'date' && (obj.value = moment(updatedDate).unix()+'')
        delete obj.id
        delete obj.options
        delete obj.order
        delete obj.pageGroup
        delete obj.questionTitles
        delete obj.localizedTitle
        delete obj.minLimit
      })
      this.trackingObj = {
        questionnaireId: getData.id,
        answerDuration: moment().diff(startTime, 'milliseconds'),
        answers: answersList,
        properties: [],
        tags: []
      };
      console.log('contenetPeros--------',JSON.stringify(this.trackingObj))
      this.setState({isLoading:true})
      contentPersonalizationApi(this.locale, this.trackingObj)
    }
  }

  noDataPopUp(){
    const {showNoDataPopUp} = this.state
    const{navigation}=this.props
    return (
      <Dialog
        visible={showNoDataPopUp}
        title={I18n.t('content_personalization.no_data_popup_title')}
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
    const{navigation}=this.props
    const{isLoading, showCalendar, updatedList, showNoDataPopUp, showOfflinePopUp, updatedDate}=this.state
    let buttonDisabled= true
    let count= 0
    updatedList.forEach(obj=>{
      if(obj.hasOwnProperty('value') || (obj.type === 'date' && updatedDate != '')){
        if(obj.type !== 'checkbox'){
          count +=1
        }else if(Array.isArray(obj.value) && obj.value.length >= 3){
          count +=1
        }
      }
    })
    buttonDisabled = updatedList.length === count && updatedList.length? false: true
    return(
      <SafeAreaView style={styles.container}>
        <View style={[styles.headerView,{height:48}]}>
          <TouchableOpacity 
            onPress={()=> navigation.goBack()}
            accessible={true}
            accessibilityLabel={I18n.t('accessibility_labels.back_label')}
            style={{padding: verticalScale(13)}}>
            <BackIcon fill={Colors.rgb_fecd00} style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} width={32} height={32}/>
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}>{I18n.t('content_personalization.header_title')}</Text>
        </View>
        <View style={styles.contentListView}>
          <FlatList
            contentContainerStyle={styles.verticalListStyle}
            keyExtractor={(item, index) => index.toString()}
            data={updatedList}
            showsVerticalScrollIndicator ={false}
            ref = "flatList"
            getItemLayout={(data, index) => { return { length: 2, offset: Platform.OS === 'android' ? 300 * index : 320 * index, index } }}            onContentSizeChange={()=>{
              if(updatedList && updatedList.length){
                this.refs.flatList.scrollToIndex({animated: true, index: updatedList.length-1})
              }
            }}
            renderItem={this.renderListItem}
          />
        </View>
        <View>
          <Button
            disabled={buttonDisabled}
            title={I18n.t('generic.submit').toUpperCase()}
            textStyle={[styles.submitTextStyle,{color:Colors.rgb_000000}]}
            onPress={() => {
              this.handleValidations()
            }}
            style={[styles.submitButtonStyles, buttonDisabled?{opacity:0.5}:{opacity: 1},{height:48}]}
          />
        </View>
        {showCalendar && this.showCustomCalendar()}
        {isLoading && <LoadingSpinner/>}
        {showNoDataPopUp && this.noDataPopUp()}
        {showOfflinePopUp && this.offlinePopUp()}
      </SafeAreaView>
    )
  }
}


const mapStateToProps = (state) => ({
  babies: state.home.babies,
  userProfile: state.user.userProfile,
  getCPResponse:state.home.getCPResponse,
  getContentPersonalizationApiSuccess: state.home.getContentPersonalizationApiSuccess,
  getContentPersonalizationApiFailure: state.home.getContentPersonalizationApiFailure,
  contentPersonalizationApiSuccess: state.home.contentPersonalizationApiSuccess,
  contentPersonalizationApiFailure: state.home.contentPersonalizationApiFailure,
  isInternetAvailable: state.app.isInternetAvailable,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  getContentPersonalizationApi: (locale) => dispatch(HomeActions.getContentPersonalizationApi(locale)),
  contentPersonalizationApi: (locale, trackingData) =>
    dispatch(HomeActions.contentPersonalizationApi(locale, trackingData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContentPersonalizationScreen);
