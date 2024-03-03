import React from 'react'
import {View, Text, TouchableOpacity, SafeAreaView, FlatList, Platform, BackHandler, I18nManager} from 'react-native';
import BackIcon from '@svg/arrow_back';
import Colors from '@resources/Colors';
import styles from './Styles/TestsScreenStyles';
import BreastFeedingConfidence from '@svg/ic_breastfeeding_confidence';
import ContentPersonalizationIcon from '@svg/ic_content_personalization';
import ForwardIcon from '@svg/arrow_right';
import KeyUtils from "@utils/KeyUtils";
import TestsItemData from "../StaticData/tests/TestsItemData";
import { verticalScale, moderateScale } from '@resources/Metrics';
import I18n from '@i18n';
import AsyncStorage from "@react-native-community/async-storage";
import NavigationService from "@services/NavigationService";
import {connect} from 'react-redux';

class TestsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state={
			dataArr: [],
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
	}

  componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.setState({dataArr: TestsItemData.itemData})
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  _handleBack=()=>{
    const {navigation}=this.props
    navigation.goBack()
    // setTimeout(()=>{
    AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
      if (tabName!=null){
        NavigationService.navigate(tabName)
      }else{
        NavigationService.navigate('Baby')
      }
    })
  }

  onAndroidBackPress = () => {
    this._handleBack()
    return true;
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

	itemOnClick=(item)=>{
		item.image === KeyUtils.TEST_TYPE_BREASTFEEDING_CONFIDENCE?
			this.props.navigation.navigate('BreastfeedingConfidenceScreen'):
			this.props.navigation.navigate('ContentPersonalizationScreen')
	}

	renderListItem = ({item}) => {
    let translatedTitle = ''
    let translatedContent = ''
    if(item.title == "Breastfeeding Confidence"){
      translatedTitle = I18n.t('tests.test_bca_title')
      translatedContent = I18n.t('tests.test_bca_content')
    }else{
      translatedTitle = I18n.t('tests.test_cp_title')
      translatedContent = I18n.t('tests.test_cp_content')
    }
		return(
			<TouchableOpacity onPress={()=> this.itemOnClick(item)}>
				<View style={styles.listItemViewStyle}>
					<View style={styles.imageContentView}>
						{item.image === KeyUtils.TEST_TYPE_BREASTFEEDING_CONFIDENCE ?
							<BreastFeedingConfidence width={verticalScale(60)} height={verticalScale(60)} style={{marginLeft: verticalScale(10)}}/>:
							<ContentPersonalizationIcon width={verticalScale(60)} height={verticalScale(60)} style={{marginLeft: verticalScale(10)}}/>
						}
					<View style={styles.itemTextViewStyle}>
						<Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{translatedTitle}</Text>
						<Text maxFontSizeMultiplier={1.7} style={[styles.itemContentTextStyle,{color:this.textColor}]}>{translatedContent}</Text>
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
			const{navigation}= this.props;
			const{dataArr}=this.state
        return(
          <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
              <TouchableOpacity
                accessibilityLabel={I18n.t("accessibility_labels.back_label")}
                accessible={true}
                onPress={()=> this._handleBack()}
                style={{padding: 10}}>
              	<BackIcon
                  fill={Colors.rgb_fecd00}
                  style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
                  height={verticalScale(30)}
                  width={moderateScale(30)}
                />
							</TouchableOpacity>
              <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}> {I18n.t('tests.test_header_title')}</Text>
            </View>
            <View style={styles.contentView}>
							<FlatList
          			keyExtractor={(item, index) => index.toString()}
          			data={dataArr}
          			renderItem={this.renderListItem}
        			/>
            </View>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected
})

export default connect(mapStateToProps,null)(TestsScreen);
