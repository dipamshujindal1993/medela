
import React, { Component, Fragment, } from "react";
import { connect } from 'react-redux';
import HomeActions from '@redux/HomeRedux';
import { View, Image, ScrollView, Text, BackHandler, Platform, TouchableOpacity, Modal, TouchableWithoutFeedback, Share, StatusBar, PixelRatio, Linking ,Alert } from "react-native";
import I18n from '@i18n';
import { NavigationActions } from 'react-navigation';
import { BlurView } from "@react-native-community/blur";
import LoadingSpinner from "@components/LoadingSpinner";
import Colors from '@resources/Colors';
import AutoHeightWebView from 'react-native-autoheight-webview';
import BackIcon from '@svg/arrow_back';
import FavoriteIcon from '@svg/fav_unselected';
import FavoriteIcon1 from '@svg/ic_favourite';
import ShareAppIcon from '@svg/ic_share_article';
import styles from "./Styles/ArticleDetailsScreenStyles";
import { verticalScale, moderateScale } from "@resources/Metrics";
import { locale } from '@utils/locale';
import Button from '@components/Button';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import WebView from 'react-native-webview'
import { open } from './LinkHandler'
import { I18nManager } from "react-native";
import { Analytics } from '@services/Firebase';
import {Constants} from "@resources";

let analytics = new Analytics()

class ArticleDetailsScreen extends Component {
  webView = {
    canGoBack: false,
    ref: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      headerBackgroundColor: Colors.transparent,
      loading: true,
      articleDetails: [],
      showAlert: false,
      articleIds: [],
      articleId: '',
      locale: ''
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected 
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const{ getArticleDetail, navigation }=this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=> {
      if (_local!=null){
        this.setState({ locale: _local })
        getArticleDetail(_local, navigation.state.params.articleId);
      } else {
        this.setState({ locale: locale().replace("-", "_") })
        getArticleDetail(locale().replace("-", "_"), navigation.state.params.articleId);
      }
    })
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);

    await analytics.logScreenView('article_details_screen')
  }

  onAndroidBackPress = () => {
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { getArticleDetailSuccess, getArticleDetailFailure, markFavoriteArticleSuccess, getArticleDetail, navigation,response } = this.props;
    if (this.state.articleId !== navigation.state.params.articleId && this.state.articleId!=prevState.articleId) {
      getArticleDetail(this.state.locale, navigation.state.params.articleId);
    }
    if (prevProps.getArticleDetailSuccess != getArticleDetailSuccess && getArticleDetailSuccess) {
      if (!response){
        this.setState({loading:false})
        Alert.alert(
          I18n.t('generic.alert_title'),
          I18n.t('generic.error_message'),
          [
            { text:  I18n.t('freezer_popup.ok'), onPress: () => this.props.navigation.goBack() }
          ]
        );
      }else{
        this.setState({ articleDetails: response, loading: false, articleId: this.props.navigation.state.params.articleId })
        if(!this.state.articleIds.includes(getArticleDetailSuccess.id)) {
          this.setState({ articleIds: this.state.articleIds.concat(getArticleDetailSuccess.id) })
        }
      }
    }
    if (prevProps.getArticleDetailFailure != getArticleDetailFailure && getArticleDetailFailure) {
      this.setState({loading:false})
    }
    if (prevProps.markFavoriteArticleSuccess != markFavoriteArticleSuccess && markFavoriteArticleSuccess) {
      if (markFavoriteArticleSuccess.errorMessages && markFavoriteArticleSuccess.errorMessages.length === 0) {
       this.setState({ articleDetails: { ...this.state.articleDetails, hasAddedToFav: !this.state.articleDetails.hasAddedToFav }, showAlert: false })
      }else {
        // this.setState({ articleDetails: { ...this.state.articleDetails, hasAddedToFav: !this.state.articleDetails.hasAddedToFav }, showAlert: false })
      }
    }
  }

  async onFavoriteClick() {
    const { articleDetails, locale, showAlert } = this.state
    const { markFavoriteArticle, navigation } = this.props
    if (articleDetails.hasAddedToFav) {
      if (showAlert) {
        this.setState({ showAlert: false })
        markFavoriteArticle(locale, `${articleDetails.hasAddedToFav ? 'unmarkAsFav/' : 'markAsFav/'}${this.state.articleDetails.id}`);
      } else {
        this.setState({ showAlert: true })
      }
    } else {
      let param = {
        'article': 'favored'
      }
      await analytics.logEvent(Constants.CONTENT_INTERACTION, param);
      this.setState({ showAlert: false })
      markFavoriteArticle(locale, `${articleDetails.hasAddedToFav ? 'unmarkAsFav/' : 'markAsFav/'}${this.state.articleDetails.id}`);
    }
  }

  onShare = async (title) => {
    let url = `Please download Mymedela app from ${Platform.OS === 'ios' ? 'App store - https://apps.apple.com/us/app/mymedela-baby-tracker/id909275386' : 'Google play store - https://play.google.com/store/apps/details?id=com.medela.mymedela.live&hl=en_IN&gl=US'} \n\n ${title} Article - https://www.medela.com/baby/articleDetailsScreen/${this.props.navigation.state.params.articleId}`
    try {
      let param = {
        'article': 'shared'
      }
      await analytics.logEvent(Constants.CONTENT_INTERACTION, param);
      const result = await Share.share({
        subject: title,
        message: url,
        title: title
      }, {
        subject: title,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  onBackPress(){
    if(this.state.articleIds.length > 1) {
      let index = this.state.articleIds.findIndex((e) => {
        return e === this.state.articleDetails.id
      })
      this.props.getArticleDetail(locale(), this.state.articleIds[index-1]);
      this.props.navigation.setParams({articleId: this.state.articleIds[index-1] });
      this.setState({ articleId: this.state.articleIds.pop()})
    } else {
      if(this.props.navigation.state.params.screen) {
        this.props.navigation.reset([NavigationActions.navigate({ routeName: 'MyBabyScreen' })], 0);
        this.props.navigation.navigate('ChatBot')
      } else {
        this.props.navigation.goBack()
      }
    }
  }

  render() {
    const { articleDetails, loading } = this.state;
    const{themeSelected}=this.props
    let dialogBackgroundColor = Colors.white
    themeSelected ==="dark" && (dialogBackgroundColor = Colors.rgb_000000)

    if (Platform.OS === 'android') {
if (articleDetails.content != undefined) {
        const regEx = /((&nbsp;))*/gmi;
        const tempResult = articleDetails.content.replace(regEx, '');
        var css = `<head><style>a:link { color: #FFC332; } img {   width: 95%; }</style> <style type="text/css"> @font-face {font-family: 'BYekan'; src:url('file:///android_asset/fonts/FuturaSBMedela-Book.otf')}</style></head>`
        var HTML = css + `<html style='font-family:BYekan; color:${this.textColor}; font-size:${PixelRatio.get() * 5}'><body dir=${I18nManager.isRTL?'"rtl"':'"ltr"'} >${tempResult}</body></html>`

      }
    }
    else {
      if (articleDetails.content != undefined) {
        const regEx = /((&nbsp;))*/gmi;
        const tempResult = articleDetails.content.replace(regEx, '');
        var css = `<head><style>a:link { color: #FFC332; } img {   width: 95%; }</style> <style type="text/css"> @font-face {font-family: 'BYekan'; src:url('FuturaSBMedela-Book.otf')}</style></head>`
        var HTML = css + `<html style='font-family:BYekan; color:${this.textColor}; font-size:${PixelRatio.get() * 7}'><body dir=${I18nManager.isRTL?'"rtl"':'"ltr"'} >${tempResult}</body></html>`
        console.log('HTML content',HTML)
      }
    }
    return (
      <View style={{ flex: 1 }}>
        {/* <StatusBar translucent backgroundColor="transparent" /> */}
        <View style={[styles.headerIconsView, { backgroundColor: this.state.headerBackgroundColor }]}>
          <View style={styles.headerViewStyles}>
            <TouchableOpacity onPress={() => this.onBackPress()} accessibilityLabel={I18n.t("accessibility_labels.back_label")} accessible={true}>
              <BackIcon fill={Colors.rgb_fecd00} width={48} height={48} style={styles.backIconStyles} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.onShare(articleDetails.title)} accessibilityLabel={I18n.t("accessibility_labels.share_label")} accessible={true}>
                <ShareAppIcon fill={Colors.rgb_898d8d} height={48} width={48} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onFavoriteClick()} accessibilityLabel={I18n.t("accessibility_labels.favourite_label")} accessible={true}>
                {articleDetails.hasAddedToFav ?
                  <FavoriteIcon1 fill={Colors.rgb_898d8d} height={48} width={48}/>
                  :
                  <FavoriteIcon fill={Colors.rgb_898d8d} height={48} width={48}/>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {loading ?
          <LoadingSpinner />
          :
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={(event) => this.setState({ headerBackgroundColor: event.nativeEvent.contentOffset.y >= verticalScale(250) ? dialogBackgroundColor : Colors.transparent })}
          >
            {articleDetails.type === 'video' ?
              <WebView
                style={styles.articleImageView}
                useWebKit={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                allowsFullscreenVideo={true}
                source={{uri:`${articleDetails.videoUrl}?playsinline=1`}}
              />
            :
              <Image
                source={{ uri: articleDetails.cover }}
                resizeMode={"contain"}
                style={styles.articleImageView}
              >
              </Image>
            }
            <View style={styles.articleTitleViewStyles}><Text maxFontSizeMultiplier={1.7} style={[styles.articleTitleTextStyles,{color:this.textColor}]}>{articleDetails.title}</Text></View>
            <View style={styles.viewLineStyles}></View>
            <View style={styles.abstractStyles}><Text maxFontSizeMultiplier={1.7} style={[styles.articleTitleSubtitleTextStyles,{color:this.textColor}]}>{articleDetails.abstract}</Text></View>

            <AutoHeightWebView
              originWhitelist={['*']}
              style={[styles.webviewStyles]}
              source={{ baseUrl: '', html: HTML }}
              heightOffset={5}
              scalesPageToFit={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ref={(webView) => { this.webView.ref = webView; }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              injectedJavaScript={this.state.cookie}
              startInLoadingState={false}
              onShouldStartLoadWithRequest={event => {
                const isLink = Platform.OS === 'ios' ? event.navigationType === 'click' : true;
                if(event.url !== 'about:blank' && isLink) {
                  this.webView.ref.stopLoading();
                  open(event.url, this.props.navigation)
                  return false
                }
                return true
              }}         
            />
          </ScrollView>
        }
          <Modal
            transparent
            hardwareAccelerated
            visible={this.state.showAlert}
            onRequestClose={() => this.setState({ showAlert: false })}
          >
            <BlurView
              blurType='dark'
              style={{flex: 1}}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.background}>
                  <Fragment>
                    <View style={[styles.dialogView, {backgroundColor: dialogBackgroundColor}]}>
                      <Text maxFontSizeMultiplier={1.7} style={[styles.popupHeaderTextStyles,{color:this.textColor}]}>{I18n.t("articles.remove_favourite_article_text")}</Text>
                      <Text maxFontSizeMultiplier={1.7} style={[styles.popupTitleTextStyles,{color:this.textColor}]}>{I18n.t("articles.remove_favourite_article_description")}</Text>
                      <Button title={I18n.t("articles.no")}
                        textStyle={styles.noBtnTextStyle}
                        style={styles.noBtnStyles}
                        onPress={() => this.setState({ showAlert: false })}
                      />
                      <Button title={I18n.t("articles.yes")}
                        textStyle={styles.yesBtnTextStyles}
                        style={styles.yesBtnStyles}
                        onPress={() => this.onFavoriteClick()}
                      />
                    </View>
                  </Fragment>
                </View>
              </TouchableWithoutFeedback>
            </BlurView>
          </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  response:state.home.response,
  getArticleDetailSuccess: state.home.getArticleDetailSuccess,
  getArticleDetailFailure: state.home.getArticleDetailFailure,
  markFavoriteArticleSuccess: state.home.markFavoriteArticleSuccess,
  markFavoriteArticleFailure: state.home.markFavoriteArticleFailure,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  getArticleDetail: (locale, articleId) => dispatch(HomeActions.getArticleDetail(locale, articleId)),
  markFavoriteArticle: (locale, articleId) => dispatch(HomeActions.markFavoriteArticle(locale, articleId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleDetailsScreen);
