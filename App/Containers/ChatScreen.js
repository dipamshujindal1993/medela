import React, { Component, Fragment } from 'react';
import { I18nManager, Image, Text, TouchableOpacity, View,ScrollView } from 'react-native';
import HeaderTitle from '@components/HeaderTitle'
import I18n from '@i18n';
import Logo from '@svg/logo';
import Colors from '@resources/Colors';
import KeyUtils from "@utils/KeyUtils";
import ForwardIcon from '@svg/arrow_right';
import styles from './Styles/ChatScreenStyles';
import ChatAvatar from './ChatAvatar';
import AsyncStorage from "@react-native-community/async-storage";
import Aurora from '@svg/aurora';
import Farrah from '@svg/farrah';
import Jahmelia from '@svg/jahmelia';
import Julia from '@svg/julia';
import Luna from '@svg/luna';
import Mei from '@svg/mei';
import Samira from '@svg/samira';
import Zoe from '@svg/zoe';
import {connect} from 'react-redux';
import { languageCode } from '@utils/locale';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAvatarModal: false,
      selectedImage: '',
      selectedAvatarUrl: '',
      renderArabicChatView: false
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const{ navigation }=this.props
    this.focusListener = navigation.addListener('didFocus', () => {
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      if(languageCode() === 'ar'){
        this.setState({ selectedImage: KeyUtils.FARRAH, renderArabicChatView: true,showAvatarModal: false })
      } else {
        AsyncStorage.getItem(KeyUtils.SELECTED_AVATAR).then(value => {
          if(value === null) {
            this.setState({ showAvatarModal: true })
          } else {
            this.setState({ selectedImage: value })
          }
        });
       }
    })
    await analytics.logScreenView('chat_screen')
  }

  getAvatarIcon() {
    switch (this.state.selectedImage.toLowerCase()) {
      case KeyUtils.SAMIRA: {
        return <Samira fill={Colors.rgb_888B8D} height={49} width={49}/>
      }
      case KeyUtils.ZOE: {
        return <Zoe fill={Colors.rgb_888B8D} height={49} width={49} />
      }
      case KeyUtils.MEI: {
        return <Mei fill={Colors.rgb_888B8D} height={49} width={49} />
      }
      case KeyUtils.AURORA: {
        return <Aurora fill={Colors.rgb_888B8D} height={49} width={49} />
      }
      case KeyUtils.FARRAH: {
        return <Farrah fill={Colors.rgb_888B8D} height={49} width={49} />
      }
      case KeyUtils.LUNA: {
        return <Luna fill={Colors.rgb_888B8D} height={49} width={49} />
      }
      case KeyUtils.JULIA: {
        return <Julia fill={Colors.rgb_888B8D} height={49} width={49} />
      }
      case KeyUtils.JAHMELIA: {
        return <Jahmelia fill={Colors.rgb_888B8D} height={49} width={49} />
      }
    }
  }

  onClose(showAvatarModal,selectedImage){
    this.setState({ showAvatarModal })
    if(selectedImage) {
      this.setState({ selectedImage })
    }
  }

  componentWillUnmount() {
    this.focusListener && this.focusListener.remove();
  }

  render() {
    const { navigation, themeSelected } = this.props;
    let contentViewColor = Colors.rgb_f5f5f5
    themeSelected==="dark" && (contentViewColor= Colors.rgb_373838)
    let translatedImageText =I18n.t(`chat.${this.state.selectedImage.toLowerCase()}`)
    let themeTextColor = themeSelected === 'dark' ? Colors.white: Colors.rgb_000000
    return (
      <Fragment>
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.headerTitleView}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}> {I18n.t('chat.header_title')}</Text>
        </View>
        <View style={styles.chatHeading}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.chatHeadingTextStyle,{color:this.textColor}]}>{I18n.t('chat.heading_description').replace("Melissa", translatedImageText)}</Text>
        </View>
        <View style={styles.viewLineStyles}></View>
        <View style={styles.chatContentViewStyle}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.chatContentStyle,{color:this.textColor}]}>
            {I18n.t("chat.chat_content1").replace("Melissa", translatedImageText)}{'\n'}
          </Text>
          <Text maxFontSizeMultiplier={1.7} style={[styles.chatContentStyle,{color:this.textColor}]}>
            {I18n.t("chat.chat_content2").replace("Melissa", translatedImageText)}
          </Text>
          <TouchableOpacity
            style={[styles.contentView, {backgroundColor: contentViewColor,color:this.textColor}]}
            onPress={()=> navigation.navigate('ChatBot', {avatarName: this.state.selectedImage})}
          >
            <View style={styles.listItemViewStyle}>
              <View style={[styles.imageContentView,{flex:1}]}>
               <View style={{flex:.2}}>
                  {this.getAvatarIcon()}
                  </View>
                <View style={[styles.itemTextViewStyle,{flex:.8}]}>
                  <Text maxFontSizeMultiplier={1.4} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>  {translatedImageText}</Text>
                  <Text maxFontSizeMultiplier={1.4} style={[styles.itemContentTextStyle,{color:this.textColor}]}>  {I18n.t("chat.chat_screen_link_text")}</Text>
                </View>
                <View style={[styles.iconWrapper,{flex:.1}]}>
                <ForwardIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_898d8d}/>
              </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editAvatarViewStyles} onPress={() => this.setState({ showAvatarModal: true })}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.editAvatarStyles,{color:this.textColor}]}>{I18n.t("chat.edit_avatar")}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1.5 }}></View>
          <View style={styles.disclaimerViewStyles}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.disclaimerTextStyles,{color:this.textColor}]}>
            {I18n.t("chat.disclaimer_text")}
            </Text>
          </View>
      </ScrollView>
      {this.state.renderArabicChatView &&
        <View style={[styles.blurViewStyles, { backgroundColor: themeSelected==="dark" ? Colors.rgb_000000_4 : Colors.rgb_ffffff_4}]}>
          <Text style={[styles.arabicTextStyles,{color:themeTextColor}]}>قريبا!</Text>
        </View>
      }
      {this.state.showAvatarModal &&
        <ChatAvatar
          onDismis={this.state.selectedImage !== '' ? true : false}
          visible={this.state.showAvatarModal}
          onClose={this.onClose.bind(this)}
        />
      }
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected
});

export default connect(mapStateToProps, null)(ChatScreen);
