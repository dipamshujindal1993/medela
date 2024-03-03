import React, { Component } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, FlatList, Linking, Share, Platform, I18nManager} from 'react-native'
import styles from './Styles/MoreScreenStyles';
import KeyUtils from "@utils/KeyUtils";
import I18n from '@i18n';
import {Colors, Metrics} from '@resources';
import HeaderLogo from '@svg/ic_logo';
import MomDefaultIcon from '@svg/ic_mom_more';
import BabyDefaultIcon from '@svg/ic_baby_more';
import PumpSettingsIcon from '@svg/ic_pump_settings';
import StoreLocatorIcon from '@svg/ic_store_locator';
import ShareAppIcon from '@svg/ic_share_app';
import FeedbackIcon from '@svg/ic_feedback';
import HelpIcon from '@svg/ic_help';
import SettingsIcon from '@svg/ic_settings';
import LegalIcon from '@svg/ic_legal';
import ForwardIcon from '@svg/arrow_right';
import VipPackICon from '@svg/ic_vip_pack';
import OnlineShopIcon from '@svg/ic_online_shop';
import {connect} from 'react-redux';
import {marketData} from '@utils/locale';
import AsyncStorage from "@react-native-community/async-storage";
import {getRealmDb, readMotherProfile} from "../Database/AddBabyDatabase";
import {hasPumpSupport} from "@utils/locale";
import Dialog from "@components/Dialog";
import NavigationService from "@services/NavigationService";
import {Constants} from "../Resources";
import { Analytics } from '@services/Firebase';
import {storeReviewDialog} from "@utils/InAppReview";

let analytics = new Analytics()

class MoreScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      firstListData: [],
      secondListData: [],
      getMarketData: {},
      showViewAlert: false,
      showInAppViewAlert: false,
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
	}
	async componentDidMount(){
    const{remoteConfig, navigation}=this.props
    this.focusListener = navigation.addListener('didFocus', async () => {
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      let _local=await AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE)
      let updatedMarketData = marketData(remoteConfig.markets,_local)

      let realmDb=await getRealmDb()
      let profile = realmDb.objects('UserMotherProfile');
      var pumpSupport=false;
      if (profile.length>0) {
        let motherProfileObj = JSON.parse(JSON.stringify(profile))
        const {market} = motherProfileObj[0].mother
        pumpSupport = hasPumpSupport(remoteConfig && remoteConfig.markets, market)
      }
      let moreFirstListData=JSON.parse(JSON.stringify(I18n.t('MoreList').moreFirstListData))
      let moreSecondListData=JSON.parse(JSON.stringify(I18n.t('MoreList').moreSecondListData))
      // hide when no key in market object.
      if(!updatedMarketData.hasOwnProperty('shopLink')){
        moreSecondListData.forEach((el, index)=>{
          if(el.selectedImage === KeyUtils.MORE_TYPE_ONLINE_SHOP){
            moreSecondListData.splice(index,1)
          }
        })
      }
      if (!pumpSupport){
        moreSecondListData.splice(0,1)
        moreFirstListData.splice(2,1)
      }
      this.setState({
        firstListData: moreFirstListData,
        getMarketData: updatedMarketData,
        secondListData: moreSecondListData
      })
    })
    await analytics.logScreenView('more_screen')
	}


  getFirstListIcons=(item)=>{
    const{selectedImage}=item
    switch (selectedImage) {
      case KeyUtils.MORE_TYPE_MOTHER_INFO: {
        return <MomDefaultIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
      }
      case KeyUtils.MORE_TYPE_BABY_INFO: {
        return <BabyDefaultIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
      }
      case KeyUtils.MORE_TYPE_PUMP_SETTINGS: {
        return <PumpSettingsIcon width={Metrics.moderateScale._70} height={Metrics.moderateScale._70}/>
      }
      case KeyUtils.MORE_TYPE_VIP_PACK: {
        return <VipPackICon width={Metrics.moderateScale._40} height={Metrics.moderateScale._40} />
      }
      case KeyUtils.MORE_TYPE_ONLINE_SHOP: {
        return <OnlineShopIcon width={Metrics.moderateScale._40} height={Metrics.moderateScale._40}/>
      }
      case KeyUtils.MORE_TYPE_STORE_LOCATOR: {
        return <StoreLocatorIcon width={Metrics.moderateScale._40} height={Metrics.moderateScale._40}/>
      }
      case KeyUtils.MORE_TYPE_SHARE_APP: {
        return <ShareAppIcon width={Metrics.moderateScale._40} height={Metrics.moderateScale._40}/>
      }
      case KeyUtils.MORE_TYPE_FEEDBACK: {
        return <FeedbackIcon width={Metrics.moderateScale._40} height={Metrics.moderateScale._40}/>
      }
      case KeyUtils.MORE_TYPE_HELP: {
        return <HelpIcon width={Metrics.moderateScale._40} height={Metrics.moderateScale._40}/>
      }
      case KeyUtils.MORE_TYPE_SETTINGS: {
        return <SettingsIcon width={Metrics.moderateScale._40} height={Metrics.moderateScale._40}/>
      }
      case KeyUtils.MORE_TYPE_LEGAL: {
        return <LegalIcon width={Metrics.moderateScale._40} height={Metrics.moderateScale._40}/>
      }
    }
  }

  onShare = async () => {
    let param = {'app_shared': 'successful'}
    await analytics.logEvent(Constants.SHARE, param);

    let message = `${I18n.t('share_app.message')} \n ${I18n.t('share_app.download_now')} \n ${I18n.t('share_app.app_store')}   https://apps.apple.com/us/app/mymedela-baby-tracker/id909275386 \n ${I18n.t('share_app.google_play')}   https://play.google.com/store/apps/details?id=com.medela.mymedela.live&hl=en_IN&gl=US`
    try {
      const result = await Share.share({
        title: I18n.t('share_app.title'),
        subject: I18n.t('share_app.title'),
        message: message
      });
    } catch (error) {
      alert(error.message);
    }
  };

  onFeedbackClick = () => {
    this.setState({showViewAlert:true})
  }

  showFeedbackDialog=()=>{
    return (
      <Dialog
        visible={this.state.showViewAlert}
        feedbackTitle={I18n.t('feedback_popup.title')}
        positive={I18n.t('feedback_popup.yes')}
        negative={I18n.t('feedback_popup.no')}
        isAppIcon={true}
        negativeOnPress={async () => {
          this.setState({ showViewAlert: false })
          this.onInAppFeedbackClick()
          let param = {
            'button': 'do_you_love_our_app_no'
          }
          await analytics.logEvent(Constants.FEEDBACK, param);
        }}
        positiveOnPress={async () => {
          this.setState({ showViewAlert: false })
          storeReviewDialog()
          let param = {
            'button': 'do_you_love_our_app_yes'
          }
          await analytics.logEvent(Constants.FEEDBACK, param);
        }}
        onDismiss={() => {
        }}
        buttonStyle={true}
      />
    )
  }

  onInAppFeedbackClick = () => {
    this.setState({showInAppViewAlert:true})
  }

  showInAppFeedbackDialog=()=>{
    return (
      <Dialog
        visible={this.state.showInAppViewAlert}
        feedbackTitle={I18n.t('feedback_popup.title1')}
        positive={I18n.t('feedback_popup.yes')}
        negative={I18n.t('feedback_popup.no')}
        isAppIcon={true}
        negativeOnPress={() => {
          this.setState({ showInAppViewAlert: false })
        }}
        positiveOnPress={() => {
          this.setState({ showInAppViewAlert: false })
          NavigationService.navigate('Feedback',{isFrom:'MoreScreen'})
        }}
        onDismiss={() => {
        }}
        buttonStyle={true}
      />
    )
  }

  itemOnClick= async (item)=>{
    const{navigation}=this.props
    const{getMarketData}=this.state
    switch(item.selectedImage){
      case KeyUtils.MORE_TYPE_MOTHER_INFO : navigation.navigate('MotherInfoScreen')
        break
      case KeyUtils.MORE_TYPE_BABY_INFO : navigation.navigate('BabiesScreen')
        break
      case KeyUtils.MORE_TYPE_PUMP_SETTINGS : navigation.navigate('MorePumpListScreen')
        break
      case KeyUtils.MORE_TYPE_VIP_PACK : navigation.navigate('VipPackScreen')
        break
      case KeyUtils.MORE_TYPE_HELP : navigation.navigate('HelpScreen')
        break
      case KeyUtils.MORE_TYPE_SETTINGS : navigation.navigate('SettingScreen')
        break
      case KeyUtils.MORE_TYPE_LEGAL : navigation.navigate('LegalScreen')
        break
      case KeyUtils.MORE_TYPE_SHARE_APP : this.onShare()
        break
      case KeyUtils.MORE_TYPE_FEEDBACK : this.onFeedbackClick()
      // case KeyUtils.MORE_TYPE_FEEDBACK : navigation.navigate('Feedback')
        break
      case KeyUtils.MORE_TYPE_STORE_LOCATOR : {
        let param = {'store_locator_accessed': 'successful'}
        await analytics.logEvent(Constants.STORE_LOCATOR, param);
        Linking.openURL(getMarketData.storeLocator).catch((err) => console.error('An error occurred', err));
      }
        break
      case KeyUtils.MORE_TYPE_ONLINE_SHOP : {
        Linking.openURL(getMarketData.shopLink).catch((err) => console.error('An error occurred', err));
      }
        break
    }
  }

  renderListItem=({item})=>{
    const{title}=item
    return(
      <TouchableOpacity onPress={()=> this.itemOnClick(item)}>
        <View style={styles.listItemViewStyle}>
          <View style={styles.imageContentView}>
            <View style={{width: Metrics.moderateScale._48}}>
              {this.getFirstListIcons(item)}
            </View>
            <View style={{flex:1,flexDirection:'row'}}>
            <View style={styles.itemTextViewStyle}>
              <Text maxFontSizeMultiplier={1.7}  style={[styles.itemTitleTextStyle,{color:this.textColor
}]}>{title}</Text>
            </View>
          </View>
          <View style={styles.iconWrapper}>
            <ForwardIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_898d8d}/>
          </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderHeader=()=>{
    const{firstListData}=this.state;
    return(
      firstListData.map((item, index)=>{
        return(
          <TouchableOpacity key={index} onPress={()=> this.itemOnClick(item)}>
            <View style={styles.listItemViewStyle}>
              <View style={styles.imageContentView}>
                <View style={{width: Metrics.moderateScale._80}}>
                  {this.getFirstListIcons(item)}
                </View>
              <View style={styles.itemTextViewStyle}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{item.title}</Text>
                {item.content &&
                  <Text maxFontSizeMultiplier={1.7} ellipsizeMode='tail' style={[styles.itemContentTextStyle,{color:this.textColor
                  }]}>{item.content}</Text>
                }
              </View>
              </View>
              <View style={styles.iconWrapper}>
                <ForwardIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_898d8d}/>
              </View>
            </View>
            </TouchableOpacity>
        )
      })
    )
  }


  componentWillUnmount() {
    this.focusListener && this.focusListener.remove();
  }

  render(){
    const{navigation}=this.props
    const{secondListData, showViewAlert, showInAppViewAlert}=this.state
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerTitleView}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}> {I18n.t('more.header_title')}</Text>
        </View>
        <FlatList
          contentContainerStyle={styles.contentView}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          data={secondListData}
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderListItem}
        />
        {showViewAlert  && this.showFeedbackDialog()}
        {showInAppViewAlert  && this.showInAppFeedbackDialog()}
      </SafeAreaView>
    )
  }

}
const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,
  remoteConfig: state.remoteConfig,
  babies: state.home.babies,
	userProfile: state.user.userProfile,
})

export default connect(mapStateToProps)(MoreScreen);
