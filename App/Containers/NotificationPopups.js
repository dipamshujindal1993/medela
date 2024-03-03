import React, { Component } from 'react'
import { View } from 'react-native';
import styles from './Styles/MyBabyScreenStyles';
import I18n from '@i18n';
import { scheduleBdayNotification, checkDaysDiff, cancelBdayNotifications, checkDays, cancelBCANotifications } from '@components/Notifications';
import { NotificationPopup } from '@components/NotificationPopup';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import moment from "moment";
import NavigationService from "@services/NavigationService";
import {connect} from 'react-redux'

class NotificationPopups extends Component{
  constructor(props) {
    super(props)
    this.state = {
      showBirthdayPopup: false,
      preBCA: false,
      postBCA: false,
      babyId: '',
      selectedBabyData: {},
      scheduledNotifications: [],
      cp: false,
      preBcaList: [],
      postBcaList: [],
      selectedPreBca: null,
      selectedPostBca: null
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.checkCPPopup()
      this.checkBCAPopup()
      this.checkBirthdayPopup()
    }, 60000)
  }

  checkCPPopup() {
    AsyncStorage.getItem(KeyUtils.CP_POPUP_NOTIF, (err, result1) => {
      if(result1 !== "false") {
        AsyncStorage.getItem(KeyUtils.CP_NOTIFICATION_FIREDATE, (err, result) => {
          if(result !== null && moment(moment().format('YYYY-MM-DD')).isSameOrAfter(result)){
            this.setState({ cp: true })
          }
        })
      }
    })
  }

  checkBirthdayPopup() {
    AsyncStorage.getItem(KeyUtils.BIRTHDAY_POPUP_NOTIF, (err, result) => {
      if(result !== "false") {
        AsyncStorage.getItem(KeyUtils.SCHEDULED_NOTIFICATIONS, (err, result1) => {
          this.setState({ scheduledNotifications: result1 !== null ? JSON.parse(result1) : []}, this.checkBdayNotification)
        })
      }
    })
  }

  checkBCAPopup() {
    AsyncStorage.getItem(KeyUtils.BCA_POPUP_NOTIF, (err, result1) => {
      if(result1 !== "false") {
        this.props.babies && this.props.babies.map((baby) => {
          let days = checkDays(baby.birthday)
          if(days >= 14){
            AsyncStorage.getItem(KeyUtils.BCA_BEFORE_BIRTH_NOTIFICATION, (err, result) => {
              this.setState({ preBcaList: JSON.parse(result) || []})
              let result1 = JSON.parse(result) || []
              let index = result1.findIndex((e) => {return e.id === baby.babyId })
              if(index !== -1 && days === 14) {
                if(result1[index].completed === "false") {
                  this.setState({ selectedPreBca: index })
                  if(moment().isSameOrAfter(moment(result1[index].time, "YYYY-MM-DD hh:mm A"))){
                    this.setState({ preBCA: true, babyId: baby.babyId })
                  }
                }
              } else {
                if(days === 14) {
                  let bcaItem = { id: baby.babyId, completed: "false", time: moment() }
                  AsyncStorage.setItem(KeyUtils.BCA_BEFORE_BIRTH_NOTIFICATION, JSON.stringify(this.state.preBcaList.concat(bcaItem)))
                  this.setState({ preBCA: true, selectedPreBca: this.state.preBcaList.length, preBcaList: this.state.preBcaList.concat(bcaItem) })
                }
              }
            })
          } else if(Math.abs((days)) <= 14) {
            this.scheduleBcaAfterBirth(baby, Math.abs((days)))
          } else {
            cancelBCANotifications(baby.babyId, 'preBca')
            cancelBCANotifications(baby.babyId, 'postBca')
          }
        })
      }
    })
  }

  scheduleBcaAfterBirth(baby, days) {
    AsyncStorage.getItem(KeyUtils.BCA_AFTER_BIRTH_NOTIFICATION, (err, result) => {
      let result1 = JSON.parse(result) || []
      this.setState({ postBcaList: result1})
      let index = result1.findIndex((e) => {return e.id === baby.babyId })
      if(index !== -1 && days === 14) {
        if(result1[index].completed === "false") {
          this.setState({ selectedPostBca: index })
          if(moment().isSameOrAfter(moment(result1[index].time, "YYYY-MM-DD hh:mm A"))){
            this.setState({ postBCA: true, babyId: baby.babyId })
          }
        }
      } else {
        if(days === 14) {
          let bcaItem = { id: baby.babyId, completed: "false", time: moment() }
          AsyncStorage.setItem(KeyUtils.BCA_AFTER_BIRTH_NOTIFICATION, JSON.stringify(this.state.postBcaList.concat(bcaItem)))
          this.setState({ postBCA: true, selectedPostBca: this.state.postBcaList.length, postBcaList: this.state.postBcaList.concat(bcaItem) })
        }
      }
    })
  }

  checkBdayNotification() {
    if (this.props.babies && this.props.babies.length>0){
      let index = this.props.babies.findIndex((e) => {
        return checkDaysDiff(e.birthday)
      })
      if(index !== -1 && Array.isArray(this.state.scheduledNotifications)){
        let notifIndex = this.state.scheduledNotifications.findIndex((e) => {
          return e.id === this.props.babies[index].babyId
        })
        if(notifIndex !== -1) {
          if(moment().isSameOrAfter(moment(this.state.scheduledNotifications[notifIndex].time, "YYYY-MM-DD hh:mm:ss"))){
            this.setState({ showBirthdayPopup: true, selectedBabyData: this.props.babies[index] })
          } else {
            this.setState({ showBirthdayPopup: false })
          }
        } else {
          scheduleBdayNotification(this.state.scheduledNotifications.concat({id: this.props.babies[index].babyId, time: moment().format("YYYY-MM-DD hh:mm:ss")}))
          AsyncStorage.getItem(KeyUtils.SCHEDULED_NOTIFICATIONS, (err, result) => {
            this.setState({ scheduledNotifications: result !== null ? JSON.parse(result) : [], showBirthdayPopup: true, selectedBabyData: this.props.babies[index] })
          })
        }
      }
    }
  }

  onPressYes(){
    this.setState({ showBirthdayPopup: false }, () => NavigationService.navigate('BabyInfoScreen', { selectedBabyData: this.state.selectedBabyData }))
  }

  onNeverShow() {
    AsyncStorage.setItem(KeyUtils.NEVER_SHOW_BABY_BIRTHDAY_NOTIFICATION, this.state.selectedBabyData.babyId)
    AsyncStorage.setItem(KeyUtils.BIRTHDAY_POPUP_NOTIF, "false")
    this.setState({ showBirthdayPopup: false })
    cancelBdayNotifications(this.state.selectedBabyData.babyId)
  }

  bcaReminder(bca) {
    if(bca === "pre") {
      this.state.preBcaList[this.state.selectedPreBca].time = moment().add(2, 'hours').format('YYYY-MM-DD hh:mm A')
      AsyncStorage.setItem(KeyUtils.BCA_BEFORE_BIRTH_NOTIFICATION, JSON.stringify(this.state.preBcaList))
      this.setState({ preBCA: false })
    } else {
      if(this.state.postBcaList.length > 0) {
        this.state.postBcaList[this.state.selectedPostBca].time = moment().add(2, 'hours').format('YYYY-MM-DD hh:mm A')
        AsyncStorage.setItem(KeyUtils.BCA_AFTER_BIRTH_NOTIFICATION, JSON.stringify(this.state.postBcaList))
      }
      this.setState({ postBCA: false })
    }
  }

  cpReminder() {
    AsyncStorage.setItem(KeyUtils.CP_NOTIFICATION_FIREDATE, moment().add(2, 'days').format('YYYY-MM-DD'))
    this.setState({ cp: false })
  }

  birthdayReminder() {
  if (this.props.babies && this.props.babies.length>0){
      let index = this.props.babies.findIndex((e) => {
        return checkDaysDiff(e.birthday)
      })
      let scheduleBdayNotif = this.state.scheduledNotifications
      if(index != -1){
      let notifIndex = scheduleBdayNotif.length > 0 && scheduleBdayNotif.findIndex((e) => {
        if(this.props.babies[index] && this.props.babies[index]!= undefined && this.props.babies[index].babyId && this.props.babies[index].babyId!= undefined){
          return e.id === this.props.babies[index].babyId
        }
      })
      scheduleBdayNotif[notifIndex].time = moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss')
      this.setState({ scheduledNotifications: scheduleBdayNotif}, () => {scheduleBdayNotification(this.state.scheduledNotifications) })
      // this.setState({ showBirthdayPopup: false })
    }
  }
    this.setState({ showBirthdayPopup: false })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render(){
    return(
      <View>
        <NotificationPopup
          showPopup={this.state.showBirthdayPopup}
          onClose={ (value)=> this.birthdayReminder()}
          title={I18n.t("my_baby.birth_confirmation_notification_title")}
          message={I18n.t("my_baby.birthday_popup_yes")}
          remindMessage={I18n.t("my_baby.birthday_popup_remind")}
          neverShow={I18n.t("my_baby.birthday_popup_never_show")}
          onNeverShow={this.onNeverShow.bind(this)}
          onPressYes={this.onPressYes.bind(this)}
        />
        <NotificationPopup
          showPopup={this.state.preBCA}
          onClose={ (value)=> this.bcaReminder('pre')}
          title={I18n.t("tests.bca_notification_message1")}
          message={I18n.t("tests.bca_notification_popup")}
          remindMessage={I18n.t("tests.bca_notification_remind")}
          onPressYes={() => this.setState({ preBCA: false }, () => NavigationService.navigate("BreastfeedingConfidenceScreen", { babyId: this.state.babyId, bca:'preBca' ,isNotificationPopup:true}))}
        />
        <NotificationPopup
          showPopup={this.state.postBCA}
          onClose={ (value)=> this.bcaReminder('post')}
          title={I18n.t("tests.bca_notification_message2")}
          message={I18n.t("tests.bca_notification_popup")}
          remindMessage={I18n.t("tests.bca_notification_remind")}
          onPressYes={() => this.setState({ postBCA: false }, () => NavigationService.navigate("BreastfeedingConfidenceScreen", { babyId: this.state.babyId, bca:'postBca',isNotificationPopup:true }))}
        />
        <NotificationPopup
          showPopup={this.state.cp}
          onClose={ (value)=> this.cpReminder()}
          title={I18n.t("tests.cp_notification_message")}
          message={I18n.t("tests.cp_notification_popup")}
          remindMessage={I18n.t("tests.cp_notification_remind")}
          onPressYes={() => this.setState({ cp: false }, () => NavigationService.navigate("ContentPersonalizationScreen",{isNotificationPopup:true}))}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  babies: state.home.babies
})

export default connect(mapStateToProps, null)(NotificationPopups);
