import React, { Component, Fragment } from 'react'
import { View, TouchableOpacity, Text, FlatList, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import HeaderTitle from '@components/HeaderTitle';
import LoadingSpinner from "@components/LoadingSpinner";
import styles from './Styles/MyBabyScreenStyles';
import styles1 from './Styles/FavouriteArticleStyles';
import HomeActions from '@redux/HomeRedux';
import { locale } from '@utils/locale';
import NoArticle from '@svg/no_articles_ic';
import DarkNoArticle from '@svg/ic_no_articles';
import Colors from '@resources/Colors';
import I18n from '@i18n';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class FavouriteArticles extends Component{
  constructor(props) {
    super(props)
    this.state = {
      articlesList: [],
      articlePageDetails: {},
      loading: true,
      pageNo: 1,
      perPage: 10,
      onEndLoading: false
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    this.loadArticles(this.state.pageNo)
    this.willFocusSubscription = this.props.navigation.addListener('willFocus',
      () => {
        this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
        this.setState({ articlesList: [], loading: true }, () => this.loadArticles(this.state.pageNo))
      }
    );
    await analytics.logScreenView('favourite_articles_screen')
  }

  componentDidUpdate(prevProps, prevState) {
    const { favoriteArticlesSuccess, favoriteArticlesFailure } = this.props;
    if(prevProps.favoriteArticlesSuccess !== favoriteArticlesSuccess && favoriteArticlesSuccess) {
      this.setState({
        articlesList: this.state.articlesList.concat(this.props.favoriteArticlesSuccess.items),
        articlePageDetails: this.props.favoriteArticlesSuccess._meta,
        loading: false,
        onEndLoading: false
      })
    }
    if(prevProps.favoriteArticlesFailure != favoriteArticlesFailure && favoriteArticlesFailure) {
      this.setState({
        loading: false,
        onEndLoading: false
      })
    }
  }

  renderListItem=({item})=>{
    return(
      <TouchableOpacity style={styles.articleView} onPress={() => this.props.navigation.navigate("ArticleDetailsScreen", { articleId: item.id})}>
        <ImageBackground
        source={{uri: item.cover}}
        style={styles.articleImageStyles}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}></View>
          <View style={styles.articleTitleViewStyles}>
            <Text maxFontSizeMultiplier={1.7} style={[styles.articleTitleStyles,{color:this.textColor}]}>{item.title}</Text>
          </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
		)
  }

  loadArticles(pageNo){
    const { perPage } = this.state;
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
      if (_local!=null){
        this.props.getFavouriteArticles(_local, pageNo, perPage)
      }else {
        this.props.getFavouriteArticles(locale().replace("-", "_"), pageNo, perPage)
      }
    })
  }

  renderFooter() {
    return (
      (this.state.onEndLoading ?
        <View style={styles.loadMoreStyles}>
          <LoadingSpinner />
        </View>
      :
        <View/>
      )
    )
  }

  onBottomReached() {
    const { articlePageDetails } = this.state
    if (articlePageDetails.currentPage < articlePageDetails.pageCount) {
      this.loadArticles(articlePageDetails.currentPage+1)
      this.setState({onEndLoading: true})
    }
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  render(){
    const{loading, articlesList}=this.state;
    const{themeSelected}=this.props
      return(
        <View style={styles.container}>
          <HeaderTitle title={I18n.t("articles.favourite_articles_header_text")} onBackPress={()=> this.props.navigation.goBack()}/>
          {loading ?
            <LoadingSpinner/>
          :
            <Fragment>
            {(this.state.articlesList.length === 0 && !this.state.loading) ?
              <View style={styles1.noArticleViewStyle}>
                {themeSelected === "dark"?
                  <DarkNoArticle fill={Colors.rgb_898d8d} style={styles1.noArticleSvgStyles} />:
                  <NoArticle fill={Colors.rgb_898d8d} style={styles1.noArticleSvgStyles} />
                }
                <Text maxFontSizeMultiplier={1.7} style={[styles1.noArticleTitle,{color:this.textColor}]}>{I18n.t('articles.no_article_title')}</Text>
                <Text maxFontSizeMultiplier={1.7} style={[styles1.noArticleDescription,{color:this.textColor}]}>{I18n.t('articles.no_article_description')}</Text>
              </View>
            :
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={articlesList}
                renderItem={this.renderListItem}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() => this.renderFooter()}
                onEndReached={() => this.onBottomReached()}
              />
            }
            </Fragment>
          }
        </View>
      )
  }
}

const mapStateToProps = (state) => ({
  favoriteArticlesSuccess: state.home.favoriteArticlesSuccess,
  favoriteArticlesFailure: state.home.favoriteArticlesFailure,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
  getFavouriteArticles: (locale, page, perPage) => dispatch(HomeActions.getFavouriteArticles(locale, page, perPage))
});

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteArticles);
