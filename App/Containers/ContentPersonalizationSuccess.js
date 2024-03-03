import React from 'react'
import {View, Text, SafeAreaView} from 'react-native';
import styles from './Styles/ContentPersonalizationSuccessStyles';
import I18n from '@i18n';
import TestSuccessIcon from '@svg/ic_tests_success';
import Button from '@components/Button';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {useSelector} from 'react-redux'
import {Colors} from '@resources';

const ContentPersonalizationSuccess=(props)=>{
    const{navigate}=props.navigation
    const selectedTheme = useSelector(state=>state.app.themeSelected)
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.headerView}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('content_personalization.header_title')}</Text>
            </View>
            <View style={styles.contentView}>
                <TestSuccessIcon width={60} height={60} />
                <Text maxFontSizeMultiplier={1.7} style={[styles.congratsTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('content_personalization.congratulations')}</Text>
                <Text maxFontSizeMultiplier={1.7} style={[styles.congratsSubTitleStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('content_personalization.congrats_message')}</Text>
                <View style={styles.contentSeparatorLine} />
                <View style={styles.updateMessageWrapper}>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.updateMessageText,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('content_personalization.congrats_update_message')}</Text>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.updateSubMessageText,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('content_personalization.congrats_update_submessage')}</Text>
                </View>
            </View>
            <View style={styles.btnWrapper}>
                <Button title={I18n.t('content_personalization.get_started')}
                    style={styles.getStartedBtnStyles}
                    onPress={() => {
                      const { navigation }=props
                      navigation.popToTop()
                      AsyncStorage.getItem(KeyUtils.SELECTED_TAB_NAME).then((tabName)=>{
                        if (tabName!=null){
                          navigate(tabName)
                        }else{
                          navigate('Baby')
                        }
                      })
                    }}
                />
            </View>
        </SafeAreaView>
    )
}
export default ContentPersonalizationSuccess
