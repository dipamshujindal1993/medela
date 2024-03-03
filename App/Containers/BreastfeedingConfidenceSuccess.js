import React,{ Component } from 'react'
import {View, Text, SectionList, TouchableOpacity, ImageBackground } from 'react-native';
import styles from './Styles/BreastfeedingConfidenceSuccessStyles';
import articleStyles from './Styles/MyBabyScreenStyles';
import I18n from '@i18n';
import HomeActions from '@redux/HomeRedux';
import {connect} from 'react-redux';
import {locale} from '@utils/locale';
import TestSuccessIcon from '@svg/ic_tests_success';
import Button from '@components/Button';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import Colors from '@resources/Colors';
import { Analytics } from '@services/Firebase';
import {Constants} from "../Resources";

let analytics = new Analytics()

class BreastfeedingConfidenceSuccess extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showArticles: false,
        }
        this.themeSelected=this.props.themeSelected  && this.props.themeSelected
        this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    }

	async componentDidMount(){
        const { bcaQuestionnaires, navigation } = this.props
        this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      AsyncStorage.getItem(KeyUtils.SELECTED_LOCALE).then((_local)=>{
        if (_local!=null){
          bcaQuestionnaires(_local, navigation.state.params.questionnaireId)
        }else{
          bcaQuestionnaires(locale().replace("-", "_"), navigation.state.params.questionnaireId)
        }
      })
      await analytics.logScreenView('breastfeeding_confidence_success_screen')
    }

    async componentDidUpdate(prevProps, prevState) {
        const { bcaQuestionnairesSuccess, bcaQuestionnairesFailure }=this.props
		if (bcaQuestionnairesSuccess!=prevProps.bcaQuestionnairesSuccess &&  bcaQuestionnairesSuccess){
            let data = []
            bcaQuestionnairesSuccess.result.map((article)=>
                data.push({ title: article.question, data: article.articles })
            )
            this.setState({ showArticles: bcaQuestionnairesSuccess.hasLevel3, articlesData: data  })

      let param = {
        'completed':'breastfeeding_confidence_assessment'
      }
      await analytics.logEvent(Constants.QUESTIONNAIRE_INTERACTION, param);
		}
    }

    renderListItem=({item})=>{
        return(
          <TouchableOpacity style={articleStyles.articleView} onPress={() => this.props.navigation.navigate("ArticleDetailsScreen", { articleId: item.id})}>
            <ImageBackground
                source={{uri: item.cover}}
                style={articleStyles.articleImageStyles}
                imageStyle={{ borderRadius: 15 }}
            >
                <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}></View>
                <View style={articleStyles.articleTitleViewStyles}>
                    <Text maxFontSizeMultiplier={1.7} style={[articleStyles.articleTitleStyles,{color:Colors.white}]}>{item.title}</Text>
                </View>
                </View>
            </ImageBackground>
          </TouchableOpacity>
        )
    }

    render() {
        const { navigation }=this.props;
        const{ articlesData, showArticles } = this.state;
        return(
            <ScrollView style={styles.container}>
            <View style={styles.headerView}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_confidence.header_title')}</Text>
            </View>
            <View style={styles.contentView}>
                <TestSuccessIcon width={60} height={60} />
                <Text maxFontSizeMultiplier={1.7} style={[styles.congratsTextStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_confidence.congratulations')}</Text>
                <View style={styles.congratsSubTitleView}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.congratsSubTitleStyle,{color:this.textColor}]}>{I18n.t('breastfeeding_confidence.congrats_message')}</Text>
                </View>
                <View style={styles.contentSeparatorLine} />
                <View style={styles.updateMessageWrapper}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.updateMessageText,{color:this.textColor}]}>
                        {showArticles ?
                            I18n.t('breastfeeding_confidence.congrats_articles_update_message')
                        :
                            I18n.t('breastfeeding_confidence.congrats_update_message')
                        }
                    </Text>
                </View>
            </View>
            {showArticles &&
                <SectionList
                    sections={articlesData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={this.renderListItem}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.questionViewStyles}>
                            <Text maxFontSizeMultiplier={1.7} style={[styles.questionTitleStyle,{color:this.textColor}]}>{title}</Text>
                        </View>
                    )}
                />
            }
            <View style={styles.btnWrapper}>
                <Button
                    title={I18n.t('breastfeeding_confidence.finish')}
                    style={styles.getStartedBtnStyles}
                    onPress={() => {
                      navigation.popToTop()
                      AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
                        if (tabName!=null){
                          navigation.navigate(tabName)
                        }else{
                          navigation.navigate('Baby')
                        }
                      })

                    }}
                />
            </View>
        </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    bcaQuestionnairesSuccess: state.home.bcaQuestionnairesSuccess,
    bcaQuestionnairesFailure: state.home.bcaQuestionnairesFailure,
    themeSelected: state.app.themeSelected,


});

const mapDispatchToProps = (dispatch) => ({
    bcaQuestionnaires: (locale, questionId) => dispatch(HomeActions.bcaQuestionnaires(locale, questionId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BreastfeedingConfidenceSuccess);
