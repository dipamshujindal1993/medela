import React, { Component } from 'react'
import { View, TouchableOpacity, Text, FlatList, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import HeaderTitle from '@components/HeaderTitle';
import LoadingSpinner from "@components/LoadingSpinner";
import styles from './Styles/MyBabyScreenStyles';
import styles1 from './Styles/FavouriteArticleStyles';
import HomeActions from '@redux/HomeRedux';
import { locale } from '@utils/locale';
import EmptyTrackingTypeIcon from '@svg/ic_empty_export_list';
import I18n from '@i18n';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {Colors} from '@resources';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BadSessionArticles extends Component{
  constructor(props) {
    super(props)
    this.state = {
      articlesList: [],
      articlePageDetails: {},
      loading: true,
      page: 1,
      perPage: 10
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const{badSessionArticles}=this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
      if (_local!=null){
         badSessionArticles(_local, this.state.page, this.state.perPage)
      }else {
         badSessionArticles(locale().replace("-", "_"), this.state.page, this.state.perPage)
      }
    })
    await analytics.logScreenView('bad_session_articles_screen')
  }

  componentDidUpdate(prevProps, prevState) {
    const { badSessionArticlesSuccess, badSessionArticlesFailure } = this.props;
    if(prevProps.badSessionArticlesSuccess != badSessionArticlesSuccess && badSessionArticlesSuccess) {
      this.setState({
        articlesList: this.state.articlesList.concat(this.props.badSessionArticlesSuccess.items),
        articlePageDetails: this.props.badSessionArticlesSuccess._meta,
        loading: false,
        onEndLoading: false
      })
    }
    if(prevProps.badSessionArticlesFailure != badSessionArticlesFailure && badSessionArticlesFailure) {
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
          <View style={{ flex: 1 }}/>
          <View style={styles.articleTitleViewStyles}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.articleTitleStyles,{color:this.textColor}]}>{item.title}</Text>
        </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
		)
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

  renderListEmptyView = () => {
    return (
      <View style={styles.listEmptyView}>
        <EmptyTrackingTypeIcon width={110} height={100}/>
        <Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:this.textColor}]}>{I18n.t('help.empty_list_message')}</Text>
      </View>
    )
  }

  loadArticles(pageNo){
    const { perPage } = this.state;
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
      if (_local!=null){
        this.props.badSessionArticles(_local, pageNo, perPage)
      }else {
        this.props.badSessionArticles(locale().replace("-", "_"), pageNo, perPage)
      }
    })
  }

  onBottomReached() {
    const { articlePageDetails} = this.state;
    if (articlePageDetails.currentPage < articlePageDetails.pageCount) {
      this.loadArticles(articlePageDetails.currentPage+1)
      this.setState({onEndLoading: true})
    }
  }

  render(){
    const{loading, articlesList}=this.state;
    return(
      <View style={styles.container}>
        <HeaderTitle title={I18n.t("help.problem_solver")} onBackPress={()=> this.props.navigation.goBack()}/>
        {loading ?
          <LoadingSpinner/>
        :
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(item, index) => index.toString()}
            data={articlesList}
            renderItem={this.renderListItem}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => this.renderFooter()}
            ListEmptyComponent={!loading && this.renderListEmptyView}
            onEndReached={() => this.onBottomReached()}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  badSessionArticlesSuccess: state.home.badSessionArticlesSuccess,
  badSessionArticlesFailure: state.home.badSessionArticlesFailure,
  themeSelected: state.app.themeSelected
});

const mapDispatchToProps = (dispatch) => ({
    badSessionArticles: (locale, page, perPage) => dispatch(HomeActions.badSessionArticles(locale, page, perPage)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BadSessionArticles);
