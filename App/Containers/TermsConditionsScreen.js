import React, {useLayoutEffect, useState, useEffect} from 'react';
import {useSelector} from 'react-redux'
import { Platform, View,requireNativeComponent } from 'react-native'
import LoadingSpinner from "@components/LoadingSpinner";
import { WebView } from 'react-native-webview';
import { languageCode } from '@utils/locale';
import Colors from '@resources/Colors';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
const TermsWebviewController = requireNativeComponent("TermsWebviewController")

const  TermsConditionsScreen=()=>{
    const [iosUrl,SetIosUrl]=useState()
    const [loading,SetLoading]=useState(false)
    const [androidUrl,SetAndroidUrl]=useState()
    const selectedTheme = useSelector(state=>state.app.themeSelected)

    useEffect(()=>{
        (async ()=>{
            await analytics.logScreenView('terms_and_conditions_screen')
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
    console.log(iosUrl)
    return(
        <View style={{flex:1}}>
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
                    :iosUrl != ''? <TermsWebviewController termshtmlstring={iosUrl}
                    style={{flex: 1,alignItems: "center",justifyContent: "center",marginTop:20}} />:null}
        </View>
		)
}

export default TermsConditionsScreen
