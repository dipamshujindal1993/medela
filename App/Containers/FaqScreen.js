import React, { Component } from 'react'
import { View, Platform, SafeAreaView, TouchableOpacity, Text, I18nManager} from 'react-native'
import { WebView } from 'react-native-webview';
import LoadingSpinner from "@components/LoadingSpinner";
import BackIcon from '@svg/arrow_back';
import I18n from '@i18n';
import Colors from '@resources/Colors';
import styles from './Styles/FaqScreenStyles';
import { verticalScale, moderateScale } from "@resources/Metrics";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class FaqScreen extends Component{
    constructor(props) {
        super(props)
        this.state={
          loading: true
        }
    }
    async componentDidMount() {
      await analytics.logScreenView('faq_screen')
    }

  render(){
		const{navigation}=this.props;
			const{loading}=this.state;
        return(
            <View style={styles.container}>
							<View style={styles.headerView}>
								<TouchableOpacity onPress={()=> navigation.goBack()}>
									<BackIcon fill={Colors.rgb_fecd00} width={moderateScale(30)} height={verticalScale(30)} style={{marginLeft: 15,transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} />
								</TouchableOpacity>
								<Text maxFontSizeMultiplier={1.7} style={styles.headerTextStyle}> {I18n.t('help.frequently_asked_questions')}</Text>
							</View>
                {loading && <LoadingSpinner/>}
								<View style={styles.contentView}>
                	<WebView
                    originWhitelist={['*']}
                    source ={Platform.OS === 'ios' ? require('../StaticData/help/faq_en.html') : {uri: 'file:///android_asset/help/faq_en.html'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowFileAccess= {true}
                    onLoad={()=>{
                    this.setState({loading: false})
                    }}
                	/>
								</View>
           </View>
        )
    }
}
export default FaqScreen
