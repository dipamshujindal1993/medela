import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Text, TouchableOpacity,
  View, Image, I18nManager
} from 'react-native'
import {
  Colors
} from '@resources'
import styles from './Styles/HeaderTrackingStyles'
import CrossIcon from '@svg/close'
import ListLogo from '@svg/ic_list'
import ShareIcon from '@svg/ic_share'
import {Constants} from "@resources";
import BackIcon from '@svg/arrow_back';
import BabySelectionModal from "./BabySelectionModal";
import DarkListLogo from '@svg/ic_dark_list';
import DarkShareIcon from '@svg/ic_dark_share';
import {getRealmDb} from "../Database/AddBabyDatabase";
import CalendarLogo from '@svg/ic_calendar';
import I18n from '@i18n';

function HeaderStats(props) {
  const[babyModalVisible, setBabyModalVisible]=useState(false)
  const [babyId,SetBabyId]=useState('')
  const [imagePath,setImagePath]=useState('');
  const [imageLoading,setImageLoading]=useState(false)
  const currentSelectedBaby = useSelector(state=>state.home.selected_baby)
  const themeSelected = useSelector(state=>state.app.themeSelected)
  const [realmDB,SetRealmDB]=useState(null)
  const[showCalendarPicker, setShowCalendarPicker]=useState(false)
  const selectedTheme = useSelector(state=>state.app.themeSelected)

  const babies = useSelector(state=>state.home.babies)
  const dispatch = useDispatch()
  useEffect(()=>{
      let realmDb= getRealmDb()
      SetRealmDB(realmDb);
      if (currentSelectedBaby) {
        let babyArr = realmDb.objects('AddBaby');
        let babiesList = JSON.parse(JSON.stringify(babyArr));
        let currentSelectedBabyLocal=babiesList.find((e)=>{
          return  e.babyId==currentSelectedBaby.babyId
        })
        setImagePath(currentSelectedBabyLocal.imagePath);
        SetBabyId(currentSelectedBaby.babyId);
      }
    return ()=> {
      if (realmDB!=null && !realmDB.isClosed){
      }
    };
  },[currentSelectedBaby])


  const {
    isListViewSelected,
    onBackPress,
    title,
    onListViewPress,
    navigation,
    onExportIconPress,
    onCustomCalendarIconPress,
    showCalendarIcon=true
  } = props
  const ImageLoading_Error=()=>{
    setImageLoading(true)
  }

  const renderBabyPic=()=>{
    let babyPic = {}
    if(imagePath!=''&&imagePath!=null&&imagePath!=undefined){
      babyPic ={uri:imagePath}
    }else if(babies && babies.length>0){
      babyPic = {uri: `${Constants.BASE_URL}rest/baby/picture/${babyId}`}
    }
    return <Image
      style={styles.baby}
      defaultSource={require('../Images/png/ic_baby_default.png')}
      source={!imageLoading ? babyPic : require('../Images/png/ic_baby_default.png')}
      onError={()=>ImageLoading_Error()}
    />
  }
  return (
    <View style={styles.container}>
      {(props.noListView || props.statsExport) ?
        <TouchableOpacity
          accessibilityLabel={I18n.t("accessibility_labels.back_label")}
          accessible={true}
          style={styles.backIconViewStyle}
          activeOpacity={1}
          onPress={onBackPress}>
          <BackIcon fill={Colors.rgb_fecd00} width={30} height={30} style={{marginLeft: props.statsExport ? 0 :10,transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}/>
        </TouchableOpacity>:
        <TouchableOpacity accessible={true} accessibilityLabel={"   "} style={styles.backIconViewStyle} activeOpacity={1} onPress={onBackPress}>
          {/* {isListViewSelected?<CrossIcon fill={Colors.rgb_888B8D} width={30} height={30}/>: null} */}
        </TouchableOpacity>
      }

      {(props.noListView || props.statsExport)?
        <View>
          <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{title}</Text>
        </View>:
        <View style={{flex: 1,}}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.mainHeaderTextStyle,{color:selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{title}</Text>
        </View>
      }
      <View style={styles.headerRightView}>
        {!props.statsExport ? (!props.noListView) && themeSelected === "dark" ?
          <View style={styles.shareIconStyle}>
            {isListViewSelected?
              <DarkShareIcon onPress={()=> onExportIconPress()}/> :
              null}
          </View>:
          <View style={styles.shareIconStyle}>
            {isListViewSelected?
              <ShareIcon onPress={()=> onExportIconPress()}/> :null}
          </View> : null
        }
         {isListViewSelected && showCalendarIcon && <View >
        <TouchableOpacity
          accessibilityLabel={I18n.t("accessibility_labels.calendar_label")}
          accessible={true}
          style={styles.calenderIconStyle}
          activeOpacity={1}
          onPress={() => onCustomCalendarIconPress(true)}>
       <CalendarLogo fill={Colors.rgb_898d8d} />
        </TouchableOpacity>
      </View>}
        <TouchableOpacity
          accessibilityLabel={I18n.t("accessibility_labels.baby_label")}
          accessible={true}
          style={styles.babyIconStyle}
          activeOpacity={1}
          onPress={()=>setBabyModalVisible(true)} >
          {renderBabyPic()}
        </TouchableOpacity>
      </View>
      {babyModalVisible && <BabySelectionModal
        showBabySelectionModal={babyModalVisible}
        cancelBabyPress={(visible)=>{
          setBabyModalVisible(false)
        }}
        onBabyListPress={(item) => {
          setBabyModalVisible(false)
          //this.getSelectedBabyDetails(item)
        }}
        navigation={navigation}
      />}
      {showCalendarPicker && showCustomCalendar()}

    </View>
  )

}


export default HeaderStats
