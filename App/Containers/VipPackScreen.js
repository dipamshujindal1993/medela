import React from 'react'
import {View, Text, SafeAreaView, FlatList, TouchableOpacity, ImageBackground, Linking, AppState, Alert, Platform, I18nManager } from 'react-native';
import BackIcon from '@svg/arrow_back';
import I18n from '@i18n';
import Colors from '@resources/Colors';
import styles from './Styles/VipPackScreenStyles';
import DiamondPackImage from '@svg/diamond_pack_image';
import { verticalScale, moderateScale } from '@resources/Metrics';
import VoiceControlIcon from '@svg/ic_voice_control';
import Freezer from '@svg/freezer';
import KeyUtils from "@utils/KeyUtils";
import Button from '@components/Button';
import Dialog from '@components/Dialog';
import { connect } from 'react-redux';
import UserActions from '@redux/UserRedux';
import HomeActions from '@redux/HomeRedux';
import AsyncStorage from "@react-native-community/async-storage";
import {marketData} from '@utils/locale';
import GetterSetter from "../Components/GetterSetter";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class VipPackScreen extends React.Component {
    constructor(props){
        super(props)
        this.state={
            data:[],
            isLoading: true,
            showUnlockBtnPopup: false,
            vipStatus: false,
            registrationType: 3,
            usMarketUser: false,
            showCongratsPopup: false
        }
        this.themeSelected=this.props.themeSelected  && this.props.themeSelected
        this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    }

    async componentDidMount(){
        const{remoteConfig}=this.props
        this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
        let _local=await AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE)
        let updatedMarketData = marketData(remoteConfig.markets,_local==null?locale().replace("-", "_"):_local)
        const{market}=updatedMarketData
        this.currentMarket=market
        if (market===KeyUtils.US_MARKET){
            this.setState({ usMarketUser: true })
        } else {
            this.setState({ usMarketUser: false })
        }
		this.setState({
            data: I18n.t('VipPackList').VipPackListData,
            isLoading: false,
            vipStatus: this.props.userProfile.mother.vipStatus,
            registrationType: this.props.userProfile.registrationType
        })
      await analytics.logScreenView('vip_pack_screen')
    }

    getIcons=(index)=>{
		switch (index) {
			case 0: {
				return <VoiceControlIcon width={70} height={70}/>
			}
			case 1: {
				return <Freezer width={70} height={70}/>
			}
		}
	}

    renderListItem=({item, index})=>{
        return(
            (index === 0 && Platform.OS === 'android') ? null :
			<TouchableOpacity
			 onPress={()=> this.itemOnClick(item, index)}
			>
				<View style={styles.listItemViewStyle}>
					<View style={styles.imageContentView}>
						{this.getIcons(index)}
						<View style={styles.itemTextViewStyle}>
							<Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{item.title}</Text>
                            <Text maxFontSizeMultiplier={1.7} style={[styles.itemContentTextStyle,{color:this.textColor}]}>{item.content}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
    }

    itemOnClick(item, index) {
       console.log('item---',index)
        if(index === 0) {
            this.props.navigation.navigate("VoiceControlTutorial")
        }
        else if (index===1){
          this.state.vipStatus &&this.props.navigation.navigate("FreezerTrackingScreen")
        }
    }

    unlockBtnPopup=()=>{
        const {showUnlockBtnPopup} = this.state
        return (
        <Dialog
            visible={showUnlockBtnPopup}
            title={I18n.t('vip_pack.welcome')}
            message={I18n.t('vip_pack.popup_message')}
            positive={I18n.t('vip_pack.connect_pump_btn')}
            negative={I18n.t('new_pregnancy_popup.cancel')}
            isIcon={false}
            negativeOnPress={() => {
            this.setState({showUnlockBtnPopup: false})
            }}
            positiveOnPress={() => {
                this.setState({showUnlockBtnPopup: false})
            }}
            onDismiss={() => {
            }}
        />
        )
    }


    unlockBtnClick=()=>{
        this.setState({showUnlockBtnPopup: true})
    }

    renderHeader=()=>{
        return(
            <View style={styles.contentHeaderView}>
                <View style={styles.contentHeaderTextView}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.contentHeaderTextStyle,{color:this.textColor}]}>{I18n.t('vip_pack.vip_pack_text')}</Text>
                </View>
                <View style={styles.diamondImageView}>
                    <DiamondPackImage height={verticalScale(100)} width={verticalScale(90)} />
                </View>
            </View>
        )
    }

    onRegisterClick() {
        let link = I18n.t('vip_pack.register_vip_link')
        Linking.openURL(link).catch((err) => console.error('An error occurred', err));
    }

    componentDidUpdate(prevProps,prevState) {
        const {userProfileSuccess, userProfileFailure, appState, vipPackApi,vipPackSuccess,vipPackFailure,userProfile} = this.props
        if (appState && appState != prevProps.appState && appState === 'active') {
          this.props.getUserProfile()
          this.setState({isLoading: true})
        }
        if (userProfileSuccess != prevProps.userProfileSuccess && userProfileSuccess && prevState.isLoading) {
          if(userProfile.mother.registrationType === 4 || userProfile.mother.registrationType === 5) {
              let value = {"vipStatus": true}
              vipPackApi(value)
          }
        }

        if (userProfileFailure != prevProps.userProfileFailure && userProfileFailure && prevState.isLoading) {
            this.setState({isLoading: false})
        }
      if (vipPackSuccess != prevProps.vipPackSuccess && vipPackSuccess && prevState.isLoading) {
        console.log('Vip success')
        AsyncStorage.getItem(KeyUtils.VIP_STATUS, (err, result) => {
          if(result === null || result === "false") {
            AsyncStorage.setItem(KeyUtils.VIP_STATUS, 'true')
            this.setState({ vipStatus: true, showCongratsPopup: true,isLoading: false })
          }
        })
      }
      if (vipPackFailure != prevProps.vipPackSuccess && vipPackFailure && prevState.isLoading) {
        console.log('Vip fail')
      }

    }

  onPumpConnectClick(){
    GetterSetter.setParentScreen('vip')
    const{navigation}=this.props;
    navigation.navigate('BleSetupScreen');
  }

	render(){
        const{navigation, themeSelected}=this.props;
        const{data, showUnlockBtnPopup, vipStatus}=this.state;
        let backgroundImageSrc = require('../Images/png/vip_pack_background.png')
        themeSelected==="dark" && (backgroundImageSrc = require('../Images/png/vip_pack_dark_background.png'))
        return(
            <SafeAreaView style={styles.container}>
                <ImageBackground source={backgroundImageSrc} style={{flex: 1}} >
                    <View style={styles.headerView}>
                        <TouchableOpacity
                            accessibilityLabel={I18n.t("accessibility_labels.back_label")}
                            accessible={true}
                            onPress={() => navigation.goBack()}
                            style={{padding: 10}}>
                            <BackIcon fill={Colors.rgb_fecd00} width={30} height={30} style={{transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }} />
                        </TouchableOpacity>
                        <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}> {I18n.t('vip_pack.header_title')}</Text>
                        <Text maxFontSizeMultiplier={1.7} style={[styles.vipStatusStyles,{color:themeSelected === 'dark' ? Colors.rgb_fecd00 : Colors.rgb_000000}]}>
                          {vipStatus ? I18n.t('vip_pack.vip_active') : I18n.t('vip_pack.vip_inactive')}
                        </Text>
                    </View>
                    <View style={styles.contentWrapper}>
                        <FlatList
                            ListHeaderComponent={this.renderHeader}
                            contentContainerStyle={styles.verticalListStyle}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            data={data}
                            renderItem={this.renderListItem}
                        />
                        {!vipStatus &&
                            <View style={styles.btnWrapper}>
                                <Text maxFontSizeMultiplier={1.7} style={[styles.unlockNowBtnStyles, { color: themeSelected==="dark" ? Colors.white : Colors.rgb_000000 }]}>{I18n.t('vip_pack.unlock_now_btn')}</Text>
                                <Button title={I18n.t('vip_pack.connect_to_pump_btn')}
                                    style={styles.connectPumpStyles}
                                    textStyle={styles.pumpBtnTextStyles}
                                    onPress={() => this.onPumpConnectClick()}
                                />
                                {this.state.usMarketUser &&
                                    <Button title={I18n.t('vip_pack.register_pump_btn')}
                                        style={styles.registerPumpStyles}
                                        textStyle={styles.registerBtnTextStyles}
                                        onPress={() => this.onRegisterClick()}
                                    />
                                }
                            </View>
                        }
                    </View>
                </ImageBackground>
                <Dialog
                    visible={this.state.showCongratsPopup}
                    title={I18n.t('vip_pack.congrats_title')}
                    message={I18n.t('vip_pack.congrats_message')}
                    positive={I18n.t('login.ok')}
                    isIcon={false}
                    positiveOnPress={() => {
                        this.setState({ showCongratsPopup: false})
                    }}
                    onDismiss={() => {
                    }}
                />
                {showUnlockBtnPopup && this.unlockBtnPopup()}
            </SafeAreaView>
        )
    }
}

const mapStateToProps = (state) => ({
    themeSelected: state.app.themeSelected,
    userProfile: state.user.userProfile,
    userProfileSuccess: state.user.userProfileSuccess,
    userProfileFailure: state.user.userProfileFailure,
    remoteConfig: state.remoteConfig,
    vipPackSuccess: state.home.vipPackSuccess,
    vipPackFailure: state.home.vipPackFailure,
    appState: state.app.appState,
});

const mapDispatchToProps = (dispatch) => ({
    getUserProfile: () => dispatch(UserActions.getUserProfile()),
    vipPackApi:(value)=>dispatch(HomeActions.vipPackApi(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VipPackScreen);
