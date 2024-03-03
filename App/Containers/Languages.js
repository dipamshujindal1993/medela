import React, { Component } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import HeaderTitle from '@components/HeaderTitle'
import I18n, { getLanguages } from 'react-native-i18n'
import KeyUtils from "@utils/KeyUtils";
import English from '@svg/english_us';
import Colors from '@resources/Colors';
import styles from './Styles/MoreScreenStyles';
import SelectedIcon from '@svg/ic_selected';
import German from '@svg/german';
import French from '@svg/french';
import Arabic from '@svg/arabic';
import Polish from '@svg/polish';
import AsyncStorage from "@react-native-community/async-storage";
import { setLocale, getLanguage } from '@i18n/I18n';
import { ArabicLangConfirmingModal } from '../Components/ArabicLaguageConfirmation';
import {I18nManager} from "react-native";
import RNRestart from 'react-native-restart';
import { allAppSupportedLanguages, rtl_langs } from '../I18n/I18n';
import RNUserDefaults from 'rn-user-defaults';
import {connect} from 'react-redux'
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class Settings extends Component{
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedCountry: 'en',
      rtlLangConfirmationPopup:false
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount(){
    const { navigation } = this.props
    this.focusListener = navigation.addListener('didFocus', () => {
        this.setState({
          data: I18n.t('CountriesList').countriesListData.filter(v=>v.countryCode!='he'),
          selectedCountry:I18n.locale.substr(0,2) == 'nb'? 'no':allAppSupportedLanguages.includes(I18n.locale.substr(0,2))?I18n.locale.substr(0,2):'en',
          message:'This action will cause the app to reload for better user experience'
        })
    })
    await analytics.logScreenView('languages_screen')
  }

  getIcon(index){
    switch (index) {
      case 0: {
        return <English width={44} height={44} />
      }
      case 1: {
        return <Arabic width={44} height={44} />
      }
      case 2: {
        return <French width={44} height={44} />
      }
      case 3: {
        return <Image style={{ width: 44, height: 44 }} source = {require('../Images/png/Itaniana_italy.png')} />
      }
      case 4: {
        return <German width={44} height={44} fill = {'black'}/>
      }
      case 5: {
        return <Image style={{ width: 44, height: 44 }} source = {require('../Images/png/portugal.png')} />
      }
      case 6: {
        return <Image style={{ width: 44, height: 44 }} source = {require('../Images/png/Espanol_spain.png')} />
      }
      case 7: {
        return <Image style={{ width: 44, height: 44 }} source = {require('../Images/png/Deutsche_Netherlands.png')} />
      }
      case 8: {
        return <Image style={{ width: 44, height: 44 }} source = {require('../Images/png/Svenska_sweden.png')} />
      }
      case 9: {
        return <Image style={{ width: 44, height: 44 }} source = {require('../Images/png/Norsk_norway.png')} />
      }
      case 10: {
        return <Image style={{ width: 44, height: 44 }} source = {require('../Images/png/Dansk_Denmark.png')} />
      }
      case 11: {
        return <Image style={{ width: 44, height: 44 }} source = {require('../Images/png/Russia.png')} />
      }
      case 12: {
        return <Polish width={44} height={44} />
      }
    }
  }

  onClickCountry(item) {
    const {selectedCountry}=this.state;
    this.selected_lang_ref=item;
    if(rtl_langs.includes(item.countryCode)&&rtl_langs.includes(selectedCountry)){
      this.languageClickVerified(false);
      return;
    }
    if(rtl_langs.includes(item.countryCode)||rtl_langs.includes(selectedCountry)){
      this.showPopup();
    }else  this.languageClickVerified(false)
  }
  languageClickVerified(closeLangPopup){
    const select_lang_data=this.selected_lang_ref;
    const close=closeLangPopup;
    AsyncStorage.setItem(KeyUtils.SELECTED_LANGUAGE, select_lang_data.countryName)
    RNUserDefaults.set(KeyUtils.SELECTED_LANGUAGE_LOCALE,select_lang_data.countryCode).then((su)=>{
      getLanguages().then((languages)=>{
        RNUserDefaults.set(KeyUtils.DEVICE_LAN_AT_THE_TIME_WHEN_CHAG_FROM_APP,languages[0].substr(0,2)).then((val)=>{
          RNUserDefaults.clear(KeyUtils.APP_VISIBILITY_CHANGED_AT_THE_TIME_OF_SIGNUP_LOGIN);
          setLocale(select_lang_data.countryCode,'languages')
        })
      })
    }),err=>{
      console.log('language saved error')
    }
    getLanguage(select_lang_data.countryCode)
    this.setState({
      selectedCountry: select_lang_data.countryCode,
      //message:select_lang_data.countryCode=='ar'?'Changing from arabic language to other will cause the app to reload for better user experience':'Changing into arabic language will cause the app to reload for better user experience',
      ...close&&{rtlLangConfirmationPopup:false}
    },()=>{
      if(close){
        setTimeout(() => {
          this.popupCloseCallback();
        }, 200);
      }
    })
  }
  showPopup(){
    this.setState({rtlLangConfirmationPopup:true})
  }
  cancelArabic=()=>{
    this.setState({rtlLangConfirmationPopup:false})
  }
  reloadApp=()=>{
    this.languageClickVerified(true)
  }
  popupCloseCallback=async()=>{
    const {selectedCountry}=this.state;
    if (!rtl_langs.includes(selectedCountry)) {
      if (I18nManager.isRTL) {
        await I18nManager.forceRTL(false)
        RNRestart.Restart();
      }
    } else {
      if (!I18nManager.isRTL) {
        await I18nManager.forceRTL(true)
        RNRestart.Restart();
      }
    }
  }

  renderListItem=({item, index})=>{
    return(
      <TouchableOpacity onPress={()=> this.onClickCountry(item)} style={[styles.listItemViewStyle, {height: 48}]}>
        <View style={styles.imageContentView}>
          {this.getIcon(index)}
          <View style={[styles.itemTextViewStyle, { alignItems: 'center' }]}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{alignSelf:'flex-start',marginLeft:5,color:this.textColor}]}>{item.countryName}</Text>
          </View>
        </View>
        {this.state.selectedCountry === item.countryCode &&
          <SelectedIcon fill={Colors.rgb_898d8d}/>
        }
      </TouchableOpacity>
		)
  }

  componentWillUnmount() {
    this.focusListener && this.focusListener.remove();
  }

  render(){
    const{navigation}=this.props;
    const {rtlLangConfirmationPopup,message}=this.state;
    return(
      <SafeAreaView style={styles.container}>
        <HeaderTitle title={I18n.t('countries.header_title')} onBackPress={()=>navigation.goBack()}/>
        <View style={[styles.contentView, styles.listViewStyles]}>
          <FlatList
            contentContainerStyle={styles.verticalListStyle}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            renderItem={this.renderListItem}
          />
          {rtlLangConfirmationPopup&&<ArabicLangConfirmingModal message={message} cancel={this.cancelArabic} reload={this.reloadApp}/>}
        </View>
      </SafeAreaView>
    )
  }
}
const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected

})

export default connect(mapStateToProps)(Settings);

