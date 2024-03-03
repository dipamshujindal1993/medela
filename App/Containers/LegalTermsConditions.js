import React, {useLayoutEffect, useState, useEffect} from 'react';
import {useSelector} from 'react-redux'
import { Platform, View, TouchableOpacity, Text, I18nManager,PixelRatio,requireNativeComponent } from 'react-native'
import LoadingSpinner from "@components/LoadingSpinner";
import { WebView } from 'react-native-webview';
import { languageCode } from '@utils/locale';
import styles from './Styles/LegalTermsConditionsStyles';
import BackIcon from '@svg/arrow_back';
import I18n from '@i18n';
import Colors from '@resources/Colors';
import { verticalScale, moderateScale} from "@resources/Metrics";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
const WebViewController = requireNativeComponent("WebViewController")

const LegalTermsConditions=(props)=>{
    const [iosUrl,SetIosUrl]=useState()
    const [loading,SetLoading]=useState(false)
    const [androidUrl,SetAndroidUrl]=useState()
    const selectedTheme = useSelector(state=>state.app.themeSelected)

    useEffect(()=>{
        (async ()=>{
            await analytics.logScreenView('legal_terms_conditions_screen')
        })()
    },[])

    useLayoutEffect(()=>{
        SetLoading(true)
        let addValueToPath = selectedTheme === "dark" ? 'dark_': ''
        switch (languageCode()) {
            case 'ar':
                Platform.OS === 'ios'?
                    SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_eng_AR': 'tnc_eng_AR'):
                    SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_eng_AR.html`)
                break
            case 'da':
                Platform.OS === 'ios'?
                    SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_da': 'tnc_da'):
                    SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_da.html`)
                break
            case 'de':
                Platform.OS === 'ios'?
                    SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_de': 'tnc_de'):
                    SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_de.html`)
                break
            case 'en':
                Platform.OS === 'ios'?
                    SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_eng': 'tnc_eng'):
                    SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_eng.html`)
                break
            case 'fr':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_fr':'tnc_fr'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_fr.html`)
            break
            case 'it':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_it': 'tnc_it'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_it.html`)
            break
            case 'no':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_nb': 'tnc_nb'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_nb.html`)
            break
            case 'nb':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc': 'tnc_nb'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_nb.html`)
            break
            case 'nl':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_nl': 'tnc_nl'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_nl.html`)
            break
            case 'pt':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_pt': 'tnc_pt'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_pt.html`)
            break
            case 'ru':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_ru': 'tnc_ru'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_ru.html`)
            break
            case 'sv':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_sv':'tnc_sv'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_sv.html`)
            break
            case 'es':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_es': 'tnc_es'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_es.html`)
            break
            case 'pl':
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_pl': 'tnc_pl'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_pl.html`)
            break
            default:
                Platform.OS === 'ios'?
                SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_eng': 'tnc_eng'):
                SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_eng.html`)
                break
            // case 'he':
            //     Platform.OS === 'ios'?
            //         SetIosUrl(selectedTheme === "dark" ? 'dark_tnc_eng_AR': 'tnc_eng_AR'):
            //         SetAndroidUrl(`file:///android_asset/legal/${addValueToPath}tnc_eng_AR.html`)
            //     break

        }

    },[])
    return(
        <View style={{flex:1}}>
            <View style={styles.headerView}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}> {I18n.t('legal.privacy_terms_conditions')}</Text>
              <TouchableOpacity 
                accessibilityLabel={I18n.t("accessibility_labels.back_label")} 
                accessible={true}
                style={styles.backArrowViewStyle} 
                onPress={()=> props.navigation.goBack()}>
                <BackIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_fecd00} width={48} height={48} />
              </TouchableOpacity>
            </View>
      	{/* {loading && <LoadingSpinner/>} */}
            <View style={styles.contentView}>
                {Platform.OS === 'android' ?
                    <WebView
                        originWhitelist={['*']}
                        source={Platform.OS === 'ios' ? iosUrl : { uri: androidUrl }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        style={{ backgroundColor: selectedTheme === "dark" ? Colors.rgb_000000 : Colors.white }}
                        onLoad={() => {
                            SetLoading(false)
                        }}

                    />
                    :iosUrl != ''? <WebViewController htmlstring={iosUrl}
                    style={{flex: 1,alignItems: "center",justifyContent: "center",}} />:null}
        </View>
    </View>
		)
}

export default LegalTermsConditions
