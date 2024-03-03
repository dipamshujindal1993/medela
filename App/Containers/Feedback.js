import React, { Component, Fragment } from 'react'
import { View, Text, Modal, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import {connect} from 'react-redux';
import {BlurView} from "@react-native-community/blur";
import HeaderTitle from '@components/HeaderTitle'
import I18n from 'react-native-i18n';
import Colors from '@resources/Colors';
import styles from './Styles/FeedbackStyles';
import CustomTextInput from '@components/CustomTextInput';
import Button from '@components/Button';
import HomeActions from '@redux/HomeRedux';
import DeviceInfo from 'react-native-device-info';
import { AirbnbRating } from 'react-native-ratings';
import moment from "moment";
import { locale } from '@utils/locale';
import { getPackageVersion } from '@utils/VersionUtils';
import { Analytics } from '@services/Firebase';
import StarRating from '../Components/StarRating';
let analytics = new Analytics()

class Feedback extends Component{
  constructor(props) {
    super(props)
    this.state = {
      feedbackText: '',
      rating: 0,
      showAlert: false,
      isFrom:''
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }
  async componentDidMount() {
    const{ navigation }=this.props
    this.focusListener = navigation.addListener('didFocus', () => {
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    })
    await analytics.logScreenView('feedback_screen')
    this.setState({isFrom:navigation.state.params.isFrom})
  }
  componentWillUnmount() {
    this.focusListener && this.focusListener.remove();
  }
  onClickFeedbackText(value) {
    this.setState({ feedbackText: value })
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  onClickSend() {
    let feedbackData = {
      "locale": locale().replace("-", "_"),
      "text": this.state.feedbackText,
      "rating": this.state.rating,
      "appVersion": getPackageVersion(),
      "os": DeviceInfo.getSystemName(),
      "osVersion": DeviceInfo.getSystemVersion(),
      "device": DeviceInfo.getModel(),
      "timeStamp": moment().format()
    }
    this.props.sendFeedback(feedbackData);
  }

  ratingCompleted(rating) {
    this.setState({ rating })
  }

  componentDidUpdate(prevProps, prevState) {
    const {getFeedbackSuccess} = this.props
    if(prevProps.getFeedbackSuccess != getFeedbackSuccess && getFeedbackSuccess) {
      this.setState({ showAlert: true })
    }
  }

  onClose() {
    const {navigation}= this.props
    this.setState({ showAlert: false })
    navigation.popToTop()
    this.state.isFrom==='MyBabyScreen'?this.props.navigation.navigate('MyBabyScreen') :this.props.navigation.navigate('MoreScreen')
  }

  render(){
    const{navigation, themeSelected, isInternetAvailable}=this.props;
    let dialogBackgroundColor = Colors.white
    themeSelected ==="dark" && (dialogBackgroundColor= Colors.rgb_000000)
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    return(
      <View style={styles.container} accessible={true}>
        <HeaderTitle title={I18n.t('feedback.header_title')} onBackPress={()=>navigation.goBack()}  />
        <View style={styles.ratingViewStyle}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.ratingTextStyle,{color:this.textColor}]}>{I18n.t('feedback.rating_text')}</Text>
          <View style={styles.starsViewStyle}>
            <StarRating
              defaultValue={0}
              getSelected={(v)=>this.setState({rating:v})}
              style={{marginHorizontal: 3}}/>
          </View>
        </View>
        <View style={styles.feedbackTextViewStyles}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.feedbackTextStyle,{color:this.textColor}]}>{I18n.t('feedback.feedback_text')}</Text>
          <CustomTextInput
            placeholder={I18n.t('feedback.input_placeholder')}
            placeholderTextColor={this.textColor}
            textStyles={[styles.textInput,{color:this.textColor}]}
            editable={true}
            value={this.state.feedbackText}
            onChangeText={(index, value) => this.onClickFeedbackText(value)}
            multiline={true}
            maxHeight={200}
            maxLength={1000}
            enableDoneButton={true}
            returnKeyType={"next"}
            inputStyle={{ height:48 }}
          />
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={" "}
            onPress={()=>Keyboard.dismiss()} style={{width: '100%', height: 200}} />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={I18n.t('feedback.button_text').toUpperCase()}
            style={[styles.sendButtonStyles, { backgroundColor: (this.state.rating > 0 && isInternetAvailable) ? Colors.rgb_fecd00 : Colors.rgb_898d8dcc}]}
            textStyle={[styles.deleteTextStyle,{color: (this.state.rating > 0 && isInternetAvailable) ? Colors.rgb_000000: this.textColor}]}
            onPress={() => { this.onClickSend() }}
            disabled={!this.state.rating > 0 && !isInternetAvailable}
          />
        </View>
        <Modal
          transparent
          hardwareAccelerated
          visible={this.state.showAlert}
          onRequestClose={() => this.setState({ showAlert: false })}
        >
          <BlurView
            blurType='light'
            style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.background}>
                <Fragment>
                  <View style={[styles.dialogView, {backgroundColor: dialogBackgroundColor}]}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.popupHeaderTextStyles,{color:this.textColor}]}>{I18n.t('feedback.success_feedback_text')}</Text>
                    <Button title={I18n.t('feedback.button_title')}
                      textStyle={styles.noBtnTextStyle}
                      style={styles.noBtnStyles}
                      onPress={() => this.onClose()}
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
  getFeedbackSuccess: state.home.getFeedbackSuccess,
  getFeedbackFailure: state.home.getFeedbackFailure,
  themeSelected: state.app.themeSelected,
  isInternetAvailable: state.app.isInternetAvailable,
});

const mapDispatchToProps = (dispatch) => ({
  sendFeedback: (feedback) => dispatch(HomeActions.addFeedback(feedback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);