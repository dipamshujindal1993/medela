import React, {useLayoutEffect, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { Platform, View, TouchableOpacity, Text, I18nManager, requireNativeComponent } from 'react-native'
import LoadingSpinner from "@components/LoadingSpinner";
import { WebView } from 'react-native-webview';
import { languageCode } from '@utils/locale';
import styles from './Styles/ImprintScreenStyles';
import BackIcon from '@svg/arrow_back';
import I18n from '@i18n';
import Colors from '@resources/Colors';
import MedelaFamilyImage from '@svg/medela_family';
import { getPackageVersion } from '@utils/VersionUtils';
import { verticalScale, moderateScale } from '@resources/Metrics';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
const ImprintWebviewController = requireNativeComponent("ImprintWebviewController")
const ImprintScreen=(props)=>{
    const [iosUrl,SetIosUrl]=useState()
    const [loading,SetLoading]=useState(false)
    const [androidUrl,SetAndroidUrl]=useState()
    const selectedTheme = useSelector(state=>state.app.themeSelected)

    let themeTextColor = selectedTheme === 'dark' ? Colors.white: Colors.rgb_000000
  useEffect(()=>{
    (async ()=>{
        await analytics.logScreenView('imprint_screen')
    })()
  },[])


    useLayoutEffect(()=>{
        SetLoading(true)
        let addValueToPath = selectedTheme === "dark" ? 'dark_': ''
        switch (languageCode()) {
            case 'ar':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ?'dark_about_ar': 'about_ar'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_ar.html`)
                break
            case 'da':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_da': 'about_da'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_da.html`)
                break
            case 'de':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_de': 'about_de'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_de.html`)
                break
            case 'en':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_en': 'about_en'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_en.html`)
                break
            case 'fr':
              Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_fr': 'about_fr'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_fr.html`)
                break
            case 'it':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_it': 'about_it'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_it.html`)
                break
            case 'nb':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_nb':'about_nb'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_nb.html`)
                break
            case 'no':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_nb':'about_nb'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_nb.html`)
                break
            case 'nl':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_nl': 'about_nl'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_nl.html`)
                break
            case 'pt':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ?'dark_about_pt': 'about_pt'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_pt.html`)
                break
            case 'ru':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ?'dark_about_ru':'about_ru'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_ru.html`)
                break
            case 'sv':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_sv': 'about_sv'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_sv.html`)
                break
            case 'es':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_es':'about_es'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_es.html`)
                break
            case 'pl':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_pl':'about_pl'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_pl.html`)
                break
            // case 'he':
            //     Platform.OS === 'ios'?
            //     SetIosUrl(selectedTheme === "dark" ? 'dark_about_he': 'about_he'):
            //     SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_he.html`)
            //     break
            default:
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_about_en': 'about_en'):
                SetAndroidUrl(`file:///android_asset/imprint/${addValueToPath}about_en.html`)
                break
        }

    },[])
    return(
        <View style={{flex:1}}>
            <View style={styles.headerView}>
                <TouchableOpacity
                    accessibilityLabel={I18n.t("accessibility_labels.back_label")}
                    accessible={true}
                    onPress={()=> props.navigation.goBack()}>
                    <BackIcon fill={Colors.rgb_fecd00} width={48} height={48}
                              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}], justifyContent: 'center', alignItems: 'center'}} />
                </TouchableOpacity>
                <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:themeTextColor}]}>{I18n.t('legal.imprint')}</Text>
            </View>
            {/* {loading && <LoadingSpinner/>} */}
            <View style={styles.contentView}>
                <View style={styles.contentHeaderView}>
                    <MedelaFamilyImage width={verticalScale(180)} height={verticalScale(35)} fill={selectedTheme === "dark" ? Colors.white :Colors.rgb_000000} />
                    <Text maxFontSizeMultiplier={1.7} style={[styles.versionTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{I18n.t('legal.imprint_version') + ' : ' + getPackageVersion()}</Text>
                </View>
                {Platform.OS === 'android' ?
                <WebView
                originWhitelist={['*']}
                source={Platform.OS === 'ios' ? iosUrl: {uri: androidUrl}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                style={{backgroundColor: selectedTheme === "dark" ? Colors.rgb_000000: Colors.white}}
                onLoad={()=>{
                SetLoading(false)
                }}
            />
             : iosUrl != ''?  <ImprintWebviewController imprinthtmlstring={iosUrl}
              style={{flex: 1,alignItems: "center",justifyContent: "center",}} />:null}
            </View>
        </View>
		)
}

export default ImprintScreen
