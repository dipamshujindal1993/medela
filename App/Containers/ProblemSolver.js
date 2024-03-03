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

class ProblemSolver extends Component{
  constructor(props) {
    super(props)
    this.state = {
      articlesList: [],
      articlePageDetails: {},
      loading: true,
      page: 1,
      perPage: 10,
      onEndLoading: false
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const{problemSolver}=this.props
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
      if (_local!=null){
         problemSolver(_local, this.state.page, this.state.perPage)
      }else {
         problemSolver(locale().replace("-", "_"), this.state.page, this.state.perPage)
      }
    })
    await analytics.logScreenView('problem_solver_screen')
  }

  componentDidUpdate(prevProps, prevState) {
    const { problemSolverSuccess, problemSolverFailure } = this.props;
    if(prevProps.problemSolverSuccess != problemSolverSuccess && problemSolverSuccess) {
      this.setState({
        articlesList: this.state.articlesList.concat(this.props.problemSolverSuccess.items),
        articlePageDetails: this.props.problemSolverSuccess._meta,
        loading: false,
        onEndLoading: false
      })
    }
    if(prevProps.problemSolverFailure != problemSolverFailure && problemSolverFailure) {
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
          <Text maxFontSizeMultiplier={1.7} style={[styles.articleTitleStyles,{color:Colors.white}]}>{item.title}</Text>
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
        this.props.problemSolver(_local, pageNo, perPage)
      }else {
        this.props.problemSolver(locale().replace("-", "_"), pageNo, perPage)
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
    const { articlePageDetails} = this.state;
    if (articlePageDetails.currentPage < articlePageDetails.pageCount) {
      this.loadArticles(articlePageDetails.currentPage+1)
      this.setState({onEndLoading: true})
    }
  }

  renderListEmptyView = () => {
    return (
      <View style={styles.listEmptyView}>
        <EmptyTrackingTypeIcon width={110} height={100}/>
        <Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:this.textColor}]}>{I18n.t('help.empty_list_message')}</Text>
      </View>
    )
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
  problemSolverSuccess: state.home.problemSolverSuccess,
  problemSolverFailure: state.home.problemSolverFailure,
  themeSelected: state.app.themeSelected,
});

const mapDispatchToProps = (dispatch) => ({
    problemSolver: (locale, page, perPage) => dispatch(HomeActions.problemSolver(locale, page, perPage)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProblemSolver);
