import remoteConfig from '@react-native-firebase/remote-config';
import React,{ Component } from 'react';
import {Linking,Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Dialog from '@components/Dialog';
import I18n from 'react-native-i18n';
import {
    Colors,
  } from '@resources';
import AsyncStorage from '@react-native-community/async-storage';
import KeyUtils from '../Utils/KeyUtils';
import moment from 'moment';
import { updatePopupService } from '../Services/Firebase';

export default class RemoteConfig extends React.PureComponent{
    constructor(){
        super();
        this.init();
        this.state={
            showForceUpdate:false,
            showOptionalUpdate:false
        }
        //US-2780
    }
    init=async()=>{
        let timestamp=await AsyncStorage.getItem(KeyUtils.Last_Remind_Timestamp);
        if(timestamp==null||timestamp==''){
            this.checkStatus()
        }else{
            let curntTimestamp=moment()
            let prevTimestamp=moment(timestamp);
            let diffInDays=curntTimestamp.diff(prevTimestamp,'days')
            if(diffInDays>=7){
                this.checkStatus();
            }else {
                this.checkForOnlyForce();
            }
        }
        updatePopupService.getData().subscribe(message => {
            this.checkStatus()
        });
    }
    checkStatus=async()=>{
        await remoteConfig().fetch(300);
        let setAppVersion=await this.setDefaultAppVersion();
        if(setAppVersion.status){
            let fetchedRemotely=await this.fetchAndActivateAppVersion();
            //https://github.com/invertase/react-native-firebase/issues/2767
            if(fetchedRemotely.status===true||(Platform.OS==='android'&&fetchedRemotely.status===false)){
                console.log(fetchedRemotely,Platform.OS);
                let remoteAppVersionOptinal=remoteConfig().getValue('min_app_version_info');
                let remoteAppVersion=remoteConfig().getValue('min_app_version');
                let [force,optional] = [false,false];
                if(remoteAppVersion.asString()){
                    let remoteVersion=remoteAppVersion.asString();
                    if(this.isRemoteAppVersionGreaterThanLocal(remoteVersion,this.getDeviceVersion(DeviceInfo.getVersion()))){
                        force=true;
                    }
                }
                if(remoteAppVersionOptinal.asString()){
                    let remoteVersionOptional=remoteAppVersionOptinal.asString();
                    if(this.isRemoteAppVersionGreaterThanLocal(remoteVersionOptional,this.getDeviceVersion(DeviceInfo.getVersion()))){
                        optional=true;
                    }
                }
                if((force===true&&optional===true)||force ===true){
                    this.setState({showForceUpdate:true});
                }else if (optional===true){
                    this.setState({showOptionalUpdate:true})
                }
            }
            // else{
            //     console.log(fetchedRemotely,Platform.OS);
            //     //https://github.com/invertase/react-native-firebase/issues/2767
            //     if(Platform.OS=='android'){
            //         let remoteAppVersion=remoteConfig().getValue('min_app_version');
            //         console.log('remoteAppVersion',remoteAppVersion)
            //         if(remoteAppVersion.asString()){
            //             let remoteVersion=remoteAppVersion.asString();
            //             if(this.isRemoteAppVersionGreaterThanLocal(remoteVersion,this.getDeviceVersion(DeviceInfo.getVersion()))){
            //                 this.setState({showForceUpdate:true});
            //             }
            //         }
            //     }
            // }
        }
    }
    checkForOnlyForce=async()=>{
        await remoteConfig().fetch(300);
        let setAppVersion=await this.setDefaultAppVersion();
        if(setAppVersion.status){
            let fetchedRemotely=await this.fetchAndActivateAppVersion();
            //https://github.com/invertase/react-native-firebase/issues/2767
            if(fetchedRemotely.status===true||(Platform.OS==='android'&&fetchedRemotely.status===false)){
                let remoteAppVersion=remoteConfig().getValue('min_app_version');
                if(remoteAppVersion.asString()){
                    let remoteVersion=remoteAppVersion.asString();
                    if(this.isRemoteAppVersionGreaterThanLocal(remoteVersion,this.getDeviceVersion(DeviceInfo.getVersion()))){
                        this.setState({showForceUpdate:true});
                    }
                }
            }
        }
    }
      setDefaultAppVersion=async ()=>{
        try{
             await remoteConfig().setDefaults({
                 min_app_version: this.getDeviceVersion(DeviceInfo.getVersion()),
                 min_app_version_info: this.getDeviceVersion(DeviceInfo.getVersion())
                })
            return {status:true}
        }catch(e){
            return {status:false}
        }
      }
      fetchAndActivateAppVersion=async()=>{
          try{
            let resp= await remoteConfig().fetchAndActivate();
            return {status:resp}
          }catch(e){
            return {status:false,error:e}
          }
      }
      isRemoteAppVersionGreaterThanLocal=(remoteVersion,localVersion)=>{
        if(remoteVersion&&localVersion){
            let remoteVersionArray=remoteVersion.split('.');
            let localVersionArray=localVersion.split('-')[0].split('.');
            if(remoteVersionArray.length==localVersionArray.length){
                for(let index=0;index<remoteVersionArray.length;index++){
                    let local=parseInt(localVersionArray[index]);
                    let remote=parseInt(remoteVersionArray[index]);
                    if(local<remote){
                        return true;
                    }else if(local>remote){
                        return false;
                    }
                }
                return false;
            }else{
                return false;
            }
        }else{
            return false;
        }
      }
      getDeviceVersion=(deviceVersion)=>{
        if(deviceVersion!=undefined&&deviceVersion!=''){
            let temp=deviceVersion.split('.');
            let last=temp[2].toString().split('').filter(v=>!isNaN(v)).join('');
            return temp[0]+'.'+temp[1]+'.'+last
        }
        return deviceVersion
      }
      gotoStorePage=()=>{
          let link=Platform.OS=='android'?'https://play.google.com/store/apps/details?id=com.medela.mymedela.live':'https://apps.apple.com/us/app/mymedela-baby-tracker/id909275386';
            Linking.canOpenURL(link).then(supported => {
                supported && Linking.openURL(link);
            }, (err) => console.log(err));
      }
      render(){
          const {showForceUpdate,showOptionalUpdate}=this.state;
          if(showForceUpdate===true||showOptionalUpdate===true){
            return (
                <Dialog
                    visible={true}
                    title={(showForceUpdate===true)?I18n.t('force_update_popup.new_update'):I18n.t('update_popup.new_update')}
                    message={(showForceUpdate===true)?I18n.t('force_update_popup.download_message'):I18n.t('update_popup.download_message')}
                    {...(showForceUpdate==false&&showOptionalUpdate===true)?{
                        negative:I18n.t('update_popup.remind_later'),
                        negativeOnPress:() => {
                            this.setState({ showOptionalUpdate: false },async()=>{
                                await AsyncStorage.setItem(KeyUtils.Last_Remind_Timestamp,moment().format());
                            })
                        },
                        nagativeButtonStyles:{marginVertical:16,borderRadius:12,backgroundColor:Colors.rgb_898d8d99}
                    }:{}}
                    cancelable={false}
                    positive={(showForceUpdate===true)?I18n.t('force_update_popup.update_now'):I18n.t('update_popup.update_now')}
                    positiveOnPress={this.gotoStorePage}
                />
            )

          }else{
            return (<></>)
          }
      }
}
