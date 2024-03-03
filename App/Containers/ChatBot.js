import React, { Component, Fragment } from 'react';
import { Image, Text, TouchableOpacity, View, Dimensions, Platform, I18nManager } from 'react-native';
import I18n from '@i18n';
import AsyncStorage from "@react-native-community/async-storage";
import HeaderTitle from "@components/HeaderTitle";
import Colors from '@resources/Colors';
import LoadingSpinner from '@components/LoadingSpinner';
import styles from './Styles/ChatbotStyles';
import {connect} from 'react-redux';
import { GiftedChat, Send, InputToolbar, Bubble, MessageText, Message, Day } from 'react-native-gifted-chat';
import ChatErrors from "../StaticData/chat/ChatErrors";
import ChatLanguages from "../StaticData/chat/ChatLanguages";
import { locale } from '@utils/locale';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { dialogflowConfig } from '../../env';
import { readChatbotSchema, createChatbotSchema } from "../Database/ChatBotDatabase";
import {getRealmDb } from "../Database/AddBabyDatabase";
import KeyUtils from "@utils/KeyUtils";
import Aurora from '@svg/aurora';
import Farrah from '@svg/farrah';
import Jahmelia from '@svg/jahmelia';
import Julia from '@svg/julia';
import Luna from '@svg/luna';
import Mei from '@svg/mei';
import Samira from '@svg/samira';
import Zoe from '@svg/zoe';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { getTimeFormat } from '@utils/TextUtils'
import {verticalScale} from "@resources/Metrics";
import { Analytics } from '@services/Firebase';
import {Constants} from "../Resources";

let analytics = new Analytics()

class ChatBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BotUser: {
        _id: 2,
        name: this.props.navigation.state.params && this.props.navigation.state.params.avatarName && this.props.navigation.state.params.avatarName != undefined ? this.props.navigation.state.params.avatarName :'',
        avatar: "",
      },
      loading: true,
      messages: [],
      scrollToBottom: false,
      messagesList: [],
      relamChatbot:null,
      userProfile: null,
      welcomeText: 'Hi',
      offlineMessage: [{}],
      isDialogFlowAuthenticate: false
    };
    this.renderMessageText = this.renderMessageText.bind(this)
    this.selectedtheme
  }

  async dialogFlowAuthentication(){
    try{
    const{themeSelected}= this.props
     this.selectedtheme = themeSelected
     let readMessagesList = await readChatbotSchema()
     let realmDb =  await getRealmDb()
    
     let myItems = realmDb.objects('Chatbot');
     let arr = JSON.parse(JSON.stringify(myItems));

     
     let userMotherProfile = realmDb.objects('UserMotherProfile')
     this.setState({relamChatbot:readMessagesList, userProfile: userMotherProfile[0] })
     arr=arr.filter((e)=>{
      return e.username==userMotherProfile[0].mother.username
    })
    let lang_code = ''
    let enCode = ''
    // AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then(async(_local)=>{
    //   if (_local !== null){
    //     lang_code = _local.split('_')[0]
    //     enCode = _local
    //   }else{

        enCode = locale().replace("-", "_")
      // }
      let _local=await AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE)
      if (_local!=null){
        if (_local.toString().includes('en')){
          lang_code = _local.replace('_','-')
        }else {
          lang_code = _local.replace('_','-').split('-')[0]
        }

      }else{
        lang_code = locale().split('-')[0]
      }

      let dialogFlowLanguage = ChatLanguages.find(o => Object.keys(o)[0] === lang_code);
      let newLocale = ''
      if(dialogFlowLanguage) {
        if(Object.keys(dialogFlowLanguage)[0] === 'en_US') {
          newLocale = Dialogflow_V2.LANG_ENGLISH_US
        } else {
          if(Object.keys(dialogFlowLanguage)[0] === 'nb') {
            newLocale = 'no'
          } else {
            newLocale = Object.keys(dialogFlowLanguage)[0]
          }
          this.setState({ welcomeText: Object.values(dialogFlowLanguage)[0] })
        }
      } else {
        newLocale = Dialogflow_V2.LANG_ENGLISH
      }
      console.log(newLocale)
      await Dialogflow_V2.setConfiguration(
        dialogflowConfig.client_email,
        dialogflowConfig.private_key,
        newLocale,
        dialogflowConfig.project_id,
      );
      if(arr.length === 0) {
        Dialogflow_V2.requestQuery(
          this.state.welcomeText,
          result => this.handleGoogleResponse(result),
          error => this.setState({ loading: false })
        );
      } else {
        this.setState({ loading: false })
      }
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, arr.reverse()),
        isDialogFlowAuthenticate: this.props.isInternetAvailable ? true : false
      }));
    // })
  }catch (e){
    console.log('Error--',e)

   }
  }

  async componentDidMount(){
    this.setState({ is24Hour: await getTimeFormat(true) })
    if(Platform.OS==='android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }
    if(this.props.isInternetAvailable){
      this.dialogFlowAuthentication()
    } else {
      this.setState({ loading: false })
    }
  }

  handleGoogleResponse(result) {
    const{ navigation }= this.props
    const { userProfile } = this.state;
    let message = '';
    let quickReplies= {}
    let articles = []
    result.queryResult.fulfillmentMessages.length > 0 && result.queryResult.fulfillmentMessages.map((msg) => {
      if(msg.text && msg.text.text){
        if(msg.text.text[0].startsWith("Hi there!") && userProfile && userProfile.mother) {
          message = message + '\n' + msg.text.text[0].replace('Hi there! I am', `Hi ${userProfile.mother.name}, I am ${navigation.state.params.avatarName}`);
        } else if(msg.text.text[0] === 'Answer'){
          message = ChatErrors[Math.floor(Math.random()*ChatErrors.length)]
        } else {
          message = message + '\n' + msg.text.text[0]
        }
      }
      if(msg.quickReplies && msg.quickReplies.quickReplies && msg.quickReplies.quickReplies.length> 0){
        var values = []
        msg.quickReplies.quickReplies.map((replies) =>{
          values.push({ title: replies, value: replies})
        })
        quickReplies = {
          type: 'radio',
          keepIt: true,
          values: values
        }
      }
      if(msg.suggestions && msg.suggestions.suggestions){
        var values = []
        msg.suggestions.suggestions.map((replies) =>{
          values.push({ title: replies.title, value: replies.title })
        })
        quickReplies = {
          type: 'radio',
          keepIt: true,
          values: values
        }
      }
      if(msg.payload){
        articles.push({ 'buttonText': msg.payload.message, 'articleId': msg.payload.metadata.payload[0].articleId })
      }
      // if(msg.simpleResponses && msg.simpleResponses.simpleResponses){
      //   message = message + '\n' + msg.simpleResponses.simpleResponses[0].textToSpeech
      // }
    })
    this.sendBotResponse(message, quickReplies, articles);
  }

  sendBotResponse(text, quickReplies={}, articles=[]) {
    let msg = {
      _id: Math.round(Math.random() * 1000000),
      text,
      createdAt: new Date(),
      user: this.state.BotUser,
    };
    quickReplies.values ? msg['quickReplies'] = quickReplies : {};
    msg['articles'] = articles;
    this.setState(previousState => ({
      loading: false,
      messages: GiftedChat.append(previousState.messages, [msg]),
      scrollToBottom: false,
      messagesList: [...this.state.messagesList, msg],
      isDialogFlowAuthenticate: true
    }));
    this.giftedChatRef && this.giftedChatRef.scrollToBottom();
 }

  async onSend(messages = []) {
    const { isInternetAvailable } = this.props
    if(messages[0].text !== '' && isInternetAvailable) {
      let param = {'interaction': 'message_sent'}
      await analytics.logEvent(Constants.CHAT, param);
      if(!Number.isInteger(messages[0]._id)) {
        messages[0]['_id'] = Math.round(Math.random() * 1000000)
      }
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
        messagesList: [...this.state.messagesList, messages[0] ],
        scrollToBottom: true
      }));
      // messages[0]['quickReplies'] = {}
      let message = messages[0].text;
      Dialogflow_V2.requestQuery(
        message,
        result => this.handleGoogleResponse(result),
        error => console.log(error)
      );
    }
  }

  renderInputToolbar (props) {
   return <InputToolbar {...props} containerStyle={styles.inputToolbarStyles} />
 }

renderSend(props) {
  const {themeSelected}=this.props
  return (
    <Send {...props}>
      <View style={styles.sendStyles}>
        <Text maxFontSizeMultiplier={1.7} style={[styles.sendButtonStyles, { color: themeSelected==="dark" ? Colors.rgb_ffcd00 : Colors.rgb_000000}]}>{I18n.t('chat.chatbot_send_text')}</Text>
      </View>
    </Send>
  );
}

customtInputToolbar=(props)=>{
  const {themeSelected}=this.props
  let updatedBackgroundColor = Colors.white
  themeSelected==="dark" && (updatedBackgroundColor= Colors.rgb_000000)
    return (
      <InputToolbar
        {...props}
        containerStyle={[styles.customtInputToolbarStyle, {backgroundColor: updatedBackgroundColor}]}
      />
    );
  };

  renderBubble=(props)=>{
    const{themeSelected}=this.props
    let leftBubbleWrapperColorObj = {}
    let bubbleTextColorObj = {color: Colors.rgb_000000}
    let rightTextColor = Colors.white
    let rightBubbleWrapperColor = Colors.rgb_707070
    if(themeSelected === "dark"){
      leftBubbleWrapperColorObj={backgroundColor: Colors.rgb_373838}
      bubbleTextColorObj={color: Colors.white}
      rightTextColor = Colors.white
      rightBubbleWrapperColor = Colors.rgb_373838
    }
    return (
      <View>
        <Bubble
          {...props}
          textStyle={{
            left: [styles.leftBubbleTextStyles, bubbleTextColorObj],
            right: [styles.rightBubbleTextStyles, {color: rightTextColor}]
          }}
          wrapperStyle={{
            left: leftBubbleWrapperColorObj,
            right: [styles.leftBubbleStyles, {backgroundColor: rightBubbleWrapperColor}]
          }}
        />
        {/* <Text maxFontSizeMultiplier={1.7} style={styles.usernameStyles}>{props.currentMessage.user.name}</Text> */}
      </View>
    );
  }

  onQuickReply(quickReply) {
    let message = [{
      _id: Math.round(Math.random() * 1000000),
      text: quickReply[0].value,
      createdAt: new Date(),
      user: {_id: 1},
    }]
    this.onSend(message)
    this.setState({ scrollToBottom: true })
  }

  componentWillUnmount() {
    const {relamChatbot,messagesList}=this.state
    console.log('messagesList',relamChatbot)
    if(messagesList.length > 1){
      try{
        const{userProfile}= this.state

        createChatbotSchema(messagesList,userProfile.mother.username).then((r)=>{
        })

      } catch (e){
        console.log('exceptione--',e)
      }
    }else {
      if (relamChatbot!=null && !relamChatbot.isClosed){
      }

    }
    if(Platform.OS==='android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
  }

  renderAvtar(obj) {
    switch (this.props.navigation.state.params.avatarName.toLowerCase()) {
      case KeyUtils.SAMIRA: {
        return <Samira fill={Colors.rgb_888B8D} height={30} width={30}/>
      }
      case KeyUtils.ZOE: {
        return <Zoe fill={Colors.rgb_888B8D} height={30} width={30} />
      }
      case KeyUtils.MEI: {
        return <Mei fill={Colors.rgb_888B8D} height={30} width={30} />
      }
      case KeyUtils.AURORA: {
        return <Aurora fill={Colors.rgb_888B8D} height={30} width={30} />
      }
      case KeyUtils.FARRAH: {
        return <Farrah fill={Colors.rgb_888B8D} height={30} width={30} />
      }
      case KeyUtils.LUNA: {
        return <Luna fill={Colors.rgb_888B8D} height={30} width={30} />
      }
      case KeyUtils.JULIA: {
        return <Julia fill={Colors.rgb_888B8D} height={30} width={30} />
      }
      case KeyUtils.JAHMELIA: {
        return <Jahmelia fill={Colors.rgb_888B8D} height={30} width={30} />
      }
    }
  }

  renderMessageText(props) {
    const { currentMessage } = props;
    return(
      <View>
        <MessageText {...props} currentMessage={{ text: currentMessage.text.trim()}} textStyle={{
              left: {color: this.props.themeSelected =="dark" ? Colors.white : Colors.rgb_000000,fontSize: 15},
              right: {color: Colors.white,fontSize: 15}
            }}
            />
        {(currentMessage.articles && currentMessage.articles.length > 0) && currentMessage.articles.map((article) =>
          <TouchableOpacity
            key={article.articleId}
            style={styles.linkViewStyles}
            onPress={() => this.props.navigation.navigate("ArticleDetailsScreen", { articleId: article.articleId, screen: 'Chatbot' })}>
            <Text maxFontSizeMultiplier={1.7}
              style={[styles.linkTextStyles, {color: this.props.themeSelected =="dark" ? Colors.rgb_ffcd00 : Colors.rgb_000000}]}>{article.buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  renderMessageContainer(props) {
    if(this.props.isInternetAvailable && !this.state.isDialogFlowAuthenticate){
      this.setState({ loading: true }, this.dialogFlowAuthentication)
    }
    return (
      <>
      {this.props.isInternetAvailable ?
        <Message
          {...props}
        />
        :
        <View style={styles.offlineViewStyles}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.offlineMsgStyles,{color: this.props.themeSelected=='dark'? Colors.white:Colors.rgb_000000}]}>{I18n.t('chat.offline_text')}</Text>
        </View>
      }
      </>
    )
  }
  renderDay(props) {
    return <Day {...props} textStyle={{color:props.textInputStyle.color }}/>
  }
  render() {
    const { navigation, themeSelected, isInternetAvailable } = this.props;
    let inputTextColor = Colors.rgb_000000
    themeSelected==="dark" && (inputTextColor = Colors.rgb_767676)
    let themeTextColor = themeSelected === 'dark' ? Colors.white: Colors.rgb_000000
    return (
      <View style={{ flex: 1 }}>
        <HeaderTitle title={navigation.state.params.avatarName}
          onBackPress={()=>navigation.goBack()}
          style={{color: themeTextColor}}/>
        {this.state.loading ?
          <LoadingSpinner />
        :
          <GiftedChat
            ref={ref => this.giftedChatRef = ref}
            messages={isInternetAvailable ? this.state.messages : this.state.offlineMessage }
            onSend={messages => this.onSend(messages)}
            placeholder={I18n.t('chat.Chatbot_placeholder')}
            alwaysShowSend
            renderAvatar={isInternetAvailable ? obj => this.renderAvtar(obj) : null}
            renderSend={this.renderSend.bind(this)}
            onQuickReply={quickReply => this.onQuickReply(quickReply)}
            user={{ _id: 1 }}
            renderInputToolbar={this.customtInputToolbar}
            renderBubble={this.renderBubble}
            timeFormat={this.state.is24Hour ? 'HH:mm' : 'hh:mm A'}
            timeTextStyle={{
              left: {color: themeTextColor},
              right: {color: Colors.white }
            }}
            scrollToBottom={this.state.scrollToBottom}
            dateFormat={'dddd, DD MMM YYYY '}
            renderMessageText={this.renderMessageText}
            textInputStyle={{color: themeSelected==="dark" ? Colors.white : Colors.rgb_000000,writingDirection:I18nManager.isRTL?'rtl':'ltr'}}
            disableComposer = {isInternetAvailable ? false : true}
            renderMessage={this.renderMessageContainer.bind(this)}
            renderDay={this.renderDay}
            minComposerHeight={Platform.OS === 'ios' ? 30 : 48}
            placeholderTextColor={themeSelected==="dark" ? Colors.white : Colors.rgb_000000}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,
  isInternetAvailable: state.app.isInternetAvailable
});

export default connect(mapStateToProps, null)(ChatBot);
