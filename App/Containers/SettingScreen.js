import React, { Component } from 'react'
import { View, SafeAreaView, TouchableOpacity, Text, FlatList, I18nManager } from 'react-native'
import HeaderTitle from '@components/HeaderTitle'
import KeyUtils from "@utils/KeyUtils";
import Measurements from '@svg/ic_growth';
import ForwardIcon from '@svg/arrow_right';
import Notifications from '@svg/notifications';
import Languages from '@svg/language';
import Colors from '@resources/Colors';
import styles from './Styles/MoreScreenStyles';
import AsyncStorage from "@react-native-community/async-storage";
import { allAppSupportedLanguages } from '../I18n/I18n';
import CountriesList from '../StaticData/more/CountriesList';
import I18n from 'react-native-i18n'
import {connect} from 'react-redux'
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class SettingScreen extends Component{
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount(){
    const{navigation}=this.props;
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.focusListener = navigation.addListener('didFocus', () => {
        let selectedLanguage;
          if(allAppSupportedLanguages.includes(I18n.locale.substr(0,2))){
            let locale = I18n.locale.substr(0,2) == 'nb' ?'no' : I18n.locale.substr(0,2)
            let countryNameFromOurDatabase=CountriesList.countriesListData.find((val)=>{return val.countryCode==locale});
            selectedLanguage=countryNameFromOurDatabase==undefined?I18n.locale.substr(0,2):countryNameFromOurDatabase.countryName
          }else{
            selectedLanguage='English'
          }
        this.setState({
          selectedLanguage,
          data: I18n.t('settings_screen')
        })
      })
    await analytics.logScreenView('settings_screen')
  }

  itemOnClick=(item,index)=>{
    const{navigation}=this.props
    switch (index){
      case 0:
        navigation.navigate('Languages')
        break;
      case 1:
        navigation.navigate('Notifications')
        break;
      case 2:
        navigation.navigate('Measurements')
        break;
    }
  }

  getIcons=(item,index)=>{
    const{ selectedImage }=item
    switch (index) {
      case 0: {
        return <Languages width={70} height={70}/>
      }
      case 1: {
        return <Notifications width={70} height={70}/>
      }
      case 2: {
        return <Measurements width={70} height={70}/>
      }
    }
  }

  renderListItem=({item,index})=>{
    return(
			<TouchableOpacity onPress={()=> this.itemOnClick(item,index)}>
				<View style={styles.listItemViewStyle}>
					<View style={styles.imageContentView}>
            {this.getIcons(item,index)}
					<View style={styles.itemTextViewStyle}>
						<Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{item.title}</Text>
						<Text maxFontSizeMultiplier={1.7} style={[styles.itemContentTextStyle,{color:this.textColor}]}>
              {index===0 ? this.state.selectedLanguage : item.content}</Text>
					</View>
					</View>
					<View style={styles.iconWrapper}>
						<ForwardIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_898d8d}/>
					</View>
				</View>
			</TouchableOpacity>
		)
  }

  render(){
    const{navigation}=this.props;
    return(
      <SafeAreaView style={styles.container}>
        <HeaderTitle title={I18n.t('more.settings_title')} onBackPress={() => navigation.goBack()} />
        <View style={styles.contentView}>
					<FlatList
            contentContainerStyle={styles.verticalListStyle}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          	data={this.state.data}
          	renderItem={this.renderListItem}
        	/>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,

})

export default connect(mapStateToProps)(SettingScreen);
