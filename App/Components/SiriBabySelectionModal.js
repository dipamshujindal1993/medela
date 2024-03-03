import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {FlatList, Image, Modal, Text, TouchableOpacity, View} from 'react-native'
import styles from './Styles/HeaderTrackingStyles'
import I18n from '@i18n';
import AddIcon from '@svg/ic_add_baby_plus'
import {BlurView} from "@react-native-community/blur";
import SelectedIcon from '@svg/ic_selected'
import HomeActions from '@redux/HomeRedux';
import UserActions from '@redux/UserRedux';
import {getRealmDb} from "../Database/AddBabyDatabase";
import {Constants} from "../Resources";
import {Colors} from '@resources';

function SiriBabySelectionModal(props) {
  const[babyModalVisible, setBabyModalVisible]=useState(false)
  const [babySelectedIndex,SetBabySelectedIndex]=useState(0)
  const [realmDB,SetRealmDB]=useState(null)
  const [babiesList,SetBabiesList]=useState([])
  const [babyId,SetBabyId]=useState('')
  const [imageLoading,setImageLoading]=useState(false)
  const [imageLoadingList, setImageLoadingList]=useState([])
  const dispatch = useDispatch();
  const currentSelectedBaby = useSelector(state=>state.home.selected_baby)
  const selectedTheme = useSelector(state=>state.app.themeSelected)

  useEffect(  ()=>{
      let realmDb = getRealmDb()
      SetRealmDB(realmDb)
      let babyArr = realmDb.objects('AddBaby');
      let profile = realmDb.objects('UserMotherProfile');
      let motherProfileObj = JSON.parse(JSON.stringify(profile))
      let babiesList = JSON.parse(JSON.stringify(babyArr))

      if (motherProfileObj.length>0){
        babiesList=babiesList.filter((e)=>{
          return  !e.isDeleted && e.username===motherProfileObj[0].username
        })
      } else {
        babiesList=babiesList.filter((e)=>{
          return  !e.isDeleted
        })
      }

      babiesList=babiesList.map((e)=>({...e,imageRender:false}))

      SetBabiesList(babiesList)
      let arr=[]
      babiesList.forEach((e,i)=>{
        arr[i]=false
      })
      setImageLoadingList(arr)
      SetBabyId(currentSelectedBaby.babyId)
      setBabyModalVisible(showBabySelectionModal)


    return function cleanup() {
      if (realmDB!=null && !realmDB.isClosed){
      }
    };
  },[])

  useEffect(()=>{
  },[imageLoadingList])

  const {
    navigation,
    onBabyListPress,
    cancelBabyPress,
    showBabySelectionModal
  } = props

  const renderBabyListItem = ({ item,index }) => {
    return <TouchableOpacity onPress={()=>{
      dispatch(HomeActions.setSelectedBaby(item))
      dispatch(UserActions.switchBaby(item.babyId));
      onBabyListPress(item)
      setBabyModalVisible(false)
      SetBabySelectedIndex(index)
      SetBabyId(item.babyId)
      cancelBabyPress(false)
    }}>
      <View style={styles.addBabyItemStyle}>
        <Image
          style={styles.babyImage}
          defaultSource={require('../Images/png/ic_baby_default.png')}
          source={(!imageLoadingList[index]) ? {uri: `${Constants.BASE_URL}rest/baby/picture/${item.babyId}`} : require('../Images/png/my_baby.png')}
          /*source={!item.imageRender ? {uri: `file:///${item.imagePath}`} : require('../Images/png/ic_baby_default.png')}*/
          onError={()=>onListImageLoading_Error(index)}
        />
        <Text maxFontSizeMultiplier={1.7} style={styles.babyNameTextStyle}>{item.name}</Text>
        {babyId === item.babyId ? <SelectedIcon style={{position:'absolute', right:0}}/> : null}
      </View>
    </TouchableOpacity>
  }

  const renderBabyListModal=()=>{
    let updatedBackgroundcolor = Colors.white
    selectedTheme === "dark" && (updatedBackgroundcolor= Colors.rgb_000000)
    return <Modal
      visible={babyModalVisible}
      animationType={'fade'}
      transparent={true}>
      <BlurView
        blurType='light'
        style={{flex: 1}}>
        <View style={{ flex: 1,
          backgroundColor:'rgba(255,255,255,0)'}}>
          <View style={[styles.addBabyStyle, {backgroundColor: updatedBackgroundcolor}]}>

          <Text maxFontSizeMultiplier={1.7} style={styles.babyNameTextStyle}>Siri was not able to find match for baby name, you have entered. Please select appropriate name from the list</Text>

            <FlatList
              data={babiesList}
              extraData={imageLoading}
              renderItem={renderBabyListItem}
              keyExtractor={item => item.babyId}
              ListFooterComponent={() =>  <TouchableOpacity onPress={()=>openAddBaby()}>
                <View style={styles.addBabyBottomViewStyle}>
                  <AddIcon/>
                  <Text maxFontSizeMultiplier={1.7} style={styles.babyNameTextStyle}>{I18n.t('generic.add_new_baby')}</Text>
                </View>
              </TouchableOpacity>}
            />
            <View style={styles.ctaView}>
              <TouchableOpacity onPress={() => {
                setBabyModalVisible(false)
                cancelBabyPress(false)
              }}>
                <Text maxFontSizeMultiplier={1.7} style={styles.cta}>{I18n.t('login.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  }

  const openAddBaby=()=>{
    setBabyModalVisible(false)
    cancelBabyPress(false)
    navigation.navigate('AddBabyScreen')
  }
  const onListImageLoading_Error=(index)=>{
    imageLoadingList[index]= true
    babiesList[index].imageRender=true
    SetBabiesList(babiesList)
    setImageLoadingList(imageLoadingList)
    setImageLoading(!imageLoading)
  }
  return (
    renderBabyListModal()
  )

}


export default SiriBabySelectionModal
