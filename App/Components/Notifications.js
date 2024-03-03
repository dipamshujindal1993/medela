import React, { Component } from 'react';
import PushNotification from "react-native-push-notification";
import moment from 'moment';
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import I18n from '@i18n';
import { calculateWeeksBetween, convertPoundIntoGram } from "@utils/TextUtils";
import whoData from '../StaticData/charts/whoData'
import { getRealmDb } from '../Database/AddBabyDatabase';

export const ScheduleLocalNotification = (fireTime, title, message, id, screenName, repeatType) => {
    PushNotification.checkPermissions(permissions => {
        if (permissions.alert === true) {
            PushNotification.localNotificationSchedule({
                date: fireTime,
                channelId: 'myMedela',
                showWhen: true,
                id: id,
                title: title,
                message: message,
                userInfo: { id: id, screen: screenName },
                playSound: true,
                soundName: 'default',
                // repeatTime: moment.duration(1, 'd').asMilliseconds(),
                repeatType: repeatType,
                allowWhileIdle: true,
            })
        }

    })
}

export const scheduleBdayNotification =(scheduleId) =>{
    AsyncStorage.removeItem(KeyUtils.NEVER_SHOW_BABY_BIRTHDAY_NOTIFICATION)
    AsyncStorage.setItem(KeyUtils.SCHEDULED_NOTIFICATIONS, JSON.stringify(scheduleId));
}

export const cancelBdayNotifications =  (babyId) => {
    AsyncStorage.getItem(KeyUtils.SCHEDULED_NOTIFICATIONS, (err, result) => {
        let result1 = JSON.parse(result) || []
        if(result1.length > 0) {
            let ids = result1.filter((e) => {
                return e.id !== babyId
            })
            AsyncStorage.setItem(KeyUtils.SCHEDULED_NOTIFICATIONS, JSON.stringify(ids));
        } else {
            AsyncStorage.removeItem(KeyUtils.SCHEDULED_NOTIFICATIONS)
        }
    })
}

export const cancelBCANotifications =  (babyId, bca) => {
    if(bca === 'preBca') {
        AsyncStorage.getItem(KeyUtils.BCA_BEFORE_BIRTH_NOTIFICATION, (err, result) => {
            let result1 = JSON.parse(result) || []
            let index = result1.findIndex((e) => {
                return e.id === babyId
            })
            if(index !== -1) {
                result1[index].completed = "true"
                AsyncStorage.setItem(KeyUtils.BCA_BEFORE_BIRTH_NOTIFICATION, JSON.stringify(result1))
            }
        })
    } else {
        AsyncStorage.getItem(KeyUtils.BCA_AFTER_BIRTH_NOTIFICATION, (err, result) => {
            let result1 = JSON.parse(result) || []
            let index = result1.findIndex((e) => {
                return e.id === babyId
            })
            if(index !== -1) {
                result1[index].completed = "true"
                AsyncStorage.setItem(KeyUtils.BCA_AFTER_BIRTH_NOTIFICATION, JSON.stringify(result1))
            }
        })
    }
}

export const checkDaysDiff = (endDate) => {
    var todayDate = moment(new Date()).format("YYYY-MM-DD");
    var dueDate = moment(endDate, "YYYY-MM-DD");
    return (dueDate.diff(todayDate, 'days') > 0 && dueDate.diff(todayDate, 'days') <= 14)
}

export const checkDays = (endDate) => {
    var todayDate = moment(new Date()).format("YYYY-MM-DD");
    var dueDate = moment(endDate, "YYYY-MM-DD");
    return dueDate.diff(todayDate, 'days')
}

export const diffInSecs = (endDate, dueTime=" 12:30 PM", withTime=false, startDate=moment(new Date()).format("YYYY-MM-DD HH:mm:ss")) => {
    var todayDate = startDate;
    let endDate1 = withTime ? endDate : (endDate + dueTime)
    var dueDate = moment(endDate1, "YYYY-MM-DD HH:mm A");
    return dueDate.diff(todayDate, 'minutes')*60
}


export const firstDayNappyNotification = (babies) => {
    AsyncStorage.getItem(KeyUtils.DIAPER_NOTIF, (err, diaperNotif) => {
        if(diaperNotif !== "false") {
            AsyncStorage.getItem(KeyUtils.NAPPY_NOTIFICATIONS, (err, notifs) => {
                let notifications = notifs !== null ? JSON.parse(notifs) : []
                babies && babies.length > 0 && babies.map( async(baby) => {
                    let days = checkDays(baby.birthday)
                    let username = await AsyncStorage.getItem(KeyUtils.USER_NAME)
                    if(days >= 0 && username === baby.username) {
                        AsyncStorage.getItem(KeyUtils.FIRSTDAY_NAPPY_NOTIFICATION, (err, result) => {
                            let result1 = JSON.parse(result) || []
                            let ids = result1.findIndex((e) => {
                                return e === baby.babyId
                            })
                            if(result1 === null || ids === -1){
                                let result = result1 !== null ? result1 : []
                                var dueFireTime = " 12:15 PM"
                                if(days >= 0) {
                                    let firstNappyFireTime = diffInSecs(moment(baby.birthday).format('YYYY-MM-DD'), dueFireTime)
                                    AsyncStorage.setItem(KeyUtils.FIRSTDAY_NAPPY_NOTIFICATION, JSON.stringify(result.concat(baby.babyId)))
                                    AsyncStorage.setItem(KeyUtils.NAPPY_NOTIFICATIONS, JSON.stringify(notifications.concat(parseInt(baby.babyId)+1)))
                                    ScheduleLocalNotification(new Date(Date.now() + (firstNappyFireTime > 0 ? firstNappyFireTime : 5) * 1000), I18n.t('tracking.nappy_notification_title'), I18n.t('tracking.firstday_nappy_notification_text'), parseInt(baby.babyId)+1, { screen: "NappyTrackingScreen", notif: baby, batchType: 'both' })
                                    thirdDayNappyNotification(baby, dueFireTime)
                                    fourthDayNappyNotification(baby, dueFireTime)
                                } else if(days >= -2) {
                                    AsyncStorage.setItem(KeyUtils.FIRSTDAY_NAPPY_NOTIFICATION, JSON.stringify(result.concat(baby.babyId)))
                                    AsyncStorage.setItem(KeyUtils.NAPPY_NOTIFICATIONS, JSON.stringify(notifications.concat([parseInt(baby.babyId)+3, parseInt(baby.babyId)+4])))
                                    thirdDayNappyNotification(baby, dueFireTime)
                                    fourthDayNappyNotification(baby, dueFireTime)
                                } else if(days == -3) {
                                    AsyncStorage.setItem(KeyUtils.NAPPY_NOTIFICATIONS, JSON.stringify(notifications.concat(parseInt(baby.babyId)+4)))
                                    AsyncStorage.setItem(KeyUtils.FIRSTDAY_NAPPY_NOTIFICATION, JSON.stringify(result.concat(baby.babyId)))
                                    fourthDayNappyNotification(baby, dueFireTime)
                                }
                            }
                        })
                    }
                })
            })
        }
    })
}

export const thirdDayNappyNotification = (baby, dueFireTime) => {
    let thirdNappyFireTime = diffInSecs(moment(baby.birthday).add(2, 'days').format('YYYY-MM-DD'), dueFireTime)
    ScheduleLocalNotification(new Date(Date.now() + (thirdNappyFireTime > 0 ? thirdNappyFireTime : 5) * 1000), I18n.t('tracking.nappy_notification_title'), I18n.t('tracking.thirdday_nappy_notification_text'), parseInt(baby.babyId)+3, { screen: "NappyTrackingScreen", notif: baby, batchType: 'both' })
}

export const fourthDayNappyNotification = (baby, dueFireTime) => {
    let fourthNappyFireTime = diffInSecs(moment(baby.birthday).add(3, 'days').format('YYYY-MM-DD'), dueFireTime)
    ScheduleLocalNotification(new Date(Date.now() + (fourthNappyFireTime > 0 ? fourthNappyFireTime : 5) * 1000), I18n.t('tracking.nappy_notification_title'), I18n.t('tracking.fourthday_nappy_notification_text'), parseInt(baby.babyId)+4, { screen: "NappyTrackingScreen", notif: baby, batchType: 'both' })
}

export const saveWetNappyTrack = (trackingData, baby) => {
    AsyncStorage.getItem(KeyUtils.DIAPER_NOTIF, (err, diaperNotif) => {
        if(diaperNotif !== "false") {
            AsyncStorage.getItem(KeyUtils.WET_NAPPY_NOTIFICATION, (result) => {
                let result2 = result !== null ? JSON.parse(result) : []
                let result1 = result2.filter((e) => {
                    return e.id === baby.babyId
                })
                let dueTime = diffInSecs(moment(trackingData.trackAt).add(1,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
                let fromTime = moment(trackingData.trackAt).format('YYYY-MM-DD HH:mm:ss')
                let notifId = parseInt(Math.random()*1000000000, 10).toString()
                ScheduleLocalNotification(new Date(Date.now() + dueTime * 1000), I18n.t('tracking.wet_diapers'), I18n.t('tracking.wet_diapers_notification_text'), notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'pee'}, "day")
                if(result1.length === 1 && result1[0] && result1[0].tracking === false) {
                    PushNotification.cancelLocalNotifications({ id: result1[0].notifId });
                    result1 = []
                }
                AsyncStorage.setItem(KeyUtils.WET_NAPPY_NOTIFICATION, JSON.stringify(result2.concat({ id: baby.babyId, notifId: notifId,  fromTime: fromTime, toTime:moment(fromTime).add(1,'days').format('YYYY-MM-DD HH:mm:ss') })) )
            })
        }
    })
}

export const wetNappyNotification = (babies, arr) => {
    AsyncStorage.getItem(KeyUtils.DIAPER_NOTIF, async(err, diaperNotif) => {
        if(diaperNotif !== "false") {
            let result1 = []
            await AsyncStorage.getItem(KeyUtils.WET_NAPPY_NOTIFICATION, (err, result) => {
                result1 = result !== null ? JSON.parse(result) : []
            })
            babies.map((baby) => {
                if(checkDays(baby.birthday) <= -3 && checkDays(baby.birthday) >= -40) {
                    let records = result1.filter((e) => {
                        return e.id === baby.babyId
                    })
                    if(records.length > 0) {
                        let updateArr = result1
                        records.map((record, index) => {
                            let fromTime = moment(record.fromTime).format('YYYY-MM-DD HH:mm:ss')
                            let toTime1 = moment(record.fromTime).add(1,'days').format('YYYY-MM-DD HH:mm:ss')
                            let timeNow = moment().format('YYYY-MM-DD HH:mm:ss')
                            let toTime = moment().isSameOrAfter(toTime1) ? timeNow : toTime1
                            let count = arr.filter((e) => {
                                let trackAT = moment(e.trackAt).format('YYYY-MM-DD HH:mm:ss')
                                return e.babyId === baby.babyId && e.trackingType === KeyUtils.TRACKING_TYPE_DIAPER && e.batchType === 1 && moment(trackAT).isBetween(fromTime, toTime, undefined, '[]')
                            })
                            if(count.length >= 5){
                                // records.slice(0, index+1).map((id) => {
                                    PushNotification.cancelLocalNotifications({ id: record.notifId });
                                // })
                                updateArr = result1.filter((e) => {
                                    return e.notifId !== record.notifId
                                })
                            }
                        })
                        AsyncStorage.setItem(KeyUtils.WET_NAPPY_NOTIFICATION, JSON.stringify(updateArr))
                    } else {
                        let today = moment().format('YYYY-MM-DD')
                        let count = arr.filter((e) => {
                            let trackAT = moment(e.trackAt).format('YYYY-MM-DD')
                            return e.babyId === baby.babyId && e.trackingType === KeyUtils.TRACKING_TYPE_DIAPER && e.batchType === 1 && trackAT === today
                        })
                        let notifId = parseInt(Math.random()*1000000000, 10).toString()
                        if(count.length > 0){
                            let storeArr = result1
                            count.map((item) =>{
                                let dueTime = diffInSecs(moment(item.trackAt).add(1,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
                                storeArr.push({ id: baby.babyId, fromTime: moment(item.trackAt).format('YYYY-MM-DD HH:mm:ss'), toTime: moment(item.trackAt).add(1,'days').format('YYYY-MM-DD HH:mm:ss'), notifId: notifId })
                                ScheduleLocalNotification(new Date(Date.now() + dueTime * 1000), I18n.t('tracking.wet_diapers'), I18n.t('tracking.wet_diapers_notification_text'), notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'pee' }, "day")
                            })
                            AsyncStorage.setItem(KeyUtils.WET_NAPPY_NOTIFICATION, JSON.stringify(storeArr))
                        } else {
                            let duetime = diffInSecs(moment().add(1,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
                            let today = moment().format('YYYY-MM-DD HH:mm:ss')
                            let tomorrow = moment(today).add(1,'days').format('YYYY-MM-DD HH:mm:ss');
                            AsyncStorage.setItem(KeyUtils.WET_NAPPY_NOTIFICATION, JSON.stringify(result1.concat({ id: baby.babyId, fromTime: today, toTime: tomorrow, notifId: notifId, tracking: false })))
                            ScheduleLocalNotification(new Date(Date.now() + duetime * 1000), I18n.t('tracking.wet_diapers'), I18n.t('tracking.wet_diapers_notification_text'), notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'pee' }, "day")
                        }
                    }
                } else {
                    if(checkDays(baby.birthday) > -3) {
                        let records = result1.filter((e) => {
                            return e.id === baby.babyId
                        })
                        if(records.length === 0) {
                            let today = moment(baby.birthday).format('YYYY-MM-DD HH:mm:ss A')
                            let tomorrow = moment(baby.birthday).add(4,'days').format('YYYY-MM-DD HH:mm:ss A')
                            let duetime = diffInSecs(moment(baby.birthday).add(4,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
                            let notifId = parseInt(Math.random()*1000000000, 10).toString()
                            AsyncStorage.setItem(KeyUtils.WET_NAPPY_NOTIFICATION, JSON.stringify(result1.concat({ id: baby.babyId, fromTime: today, toTime: tomorrow, notifId: notifId, tracking: false })))
                            ScheduleLocalNotification(new Date(Date.now() + duetime * 1000), I18n.t('tracking.wet_diapers'), I18n.t('tracking.wet_diapers_notification_text'), notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'pee' }, "day")
                        }
                    }
                }
            })
        }
    })
}

export const wetNappyWeek6Notif = (babies) => {
    AsyncStorage.getItem(KeyUtils.DIAPER_NOTIF, async(err, diaperNotif) => {
        if(diaperNotif !== "false") {
            let result2 = []
            await AsyncStorage.getItem(KeyUtils.WET_NAPPY_WEEK6_NOTIFICATION, async(err, result) => {
                result2 = result !== null ? JSON.parse(result) : []
            })
            babies.map((baby) => {
                let result1 = result2.filter((e) => {
                    return e.id === baby.babyId
                })
                if(calculateWeeksBetween(new Date(), new Date(baby.birthday)) <= 6) {
                    if(result1.length > 0) {
                        // let dueDate = moment(baby.birthday).add(42, 'days').format("YYYY-MM-DD")
                        // let dueTime = diffInSecs(dueDate, " 12:15 PM");
                        // ScheduleLocalNotification(new Date(Date.now() + (dueTime > 0 ? dueTime : 300) * 1000), I18n.t('tracking.wet_diapers'), I18n.t('tracking.wet_diapers_notification_text2'), baby.birthday+7, { screen: "NappyTrackingScreen", notif: baby, batchType: 'week6'})
                        // AsyncStorage.setItem(KeyUtils.NAPPY_NOTIFICATIONS, JSON.stringify(notifications.concat(baby.birthday+7)))
                        // AsyncStorage.setItem(KeyUtils.WET_NAPPY_WEEK6_NOTIFICATION, JSON.stringify(JSON.parse(result).concat(baby.babyId)))
                    } else {
                        let notifId = parseInt(Math.random()*1000000000, 10).toString()
                        let fireTime = diffInSecs(moment(baby.birthday).add(42, 'days').format("YYYY-MM-DD"), " 12:15 PM")
                        AsyncStorage.setItem(KeyUtils.WET_NAPPY_WEEK6_NOTIFICATION, JSON.stringify(result2.concat({ id: baby.babyId, notifId: notifId })))
                        ScheduleLocalNotification(new Date(Date.now() + fireTime * 1000), I18n.t('tracking.wet_diapers'), I18n.t('tracking.wet_diapers_notification_text2'), notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'poo'})
                    }
                } else {
                    if(result1.length > 0) {
                        let result3 = result2.filter((e) => {
                            if(e.id === baby.babyId) {
                                PushNotification.cancelLocalNotifications({ id: e.notifId });
                            }
                            return e.id !== baby.babyId
                        })
                        AsyncStorage.setItem(KeyUtils.WET_NAPPY_WEEK6_NOTIFICATION, JSON.stringify(result3))
                    }
                }
            })
        }
    })
}

export const savebreastFeedingPumpingTrack = (trackingData, baby) => {
    AsyncStorage.getItem(KeyUtils.BREASTFEEDING_PUMPING_NOTIF, (err, pumpingNotif) => {
        if(pumpingNotif !== "false") {
            AsyncStorage.getItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS, (err, notifs) => {
                let notifications = notifs !== null ? JSON.parse(notifs) : []
                AsyncStorage.getItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION, (err, result) => {
                    let result2 = result !== null ? JSON.parse(result) : []
                    let result1 = result2.filter((e) => {
                        return e.id === baby.babyId
                    })
                    if(result1.length ===1 && result1[0].tracking === false){
                        PushNotification.cancelLocalNotifications({ id: result1[0].notifId });
                        let today = moment().set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss')
                        let tomorrow = moment(today).add(1,'days').set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss');
                        let duetime =  diffInSecs(moment().add(1,'days').set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss'), "", true, moment().format('YYYY-MM-DD HH:mm:ss'))
                        let notifId = parseInt(Math.random()*1000000000, 10).toString()
                        AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION, JSON.stringify(result2.concat({ id: baby.babyId, fromTime: today, toTime: tomorrow, notifId: notifId,  alterText: false })))
                        AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS, JSON.stringify(notifications.concat(notifId)))
                        ScheduleLocalNotification(new Date(Date.now() + duetime * 1000), I18n.t('tracking.Breastfeeding_and_Pumping_title'), I18n.t('tracking.Breastfeeding_and_Pumping1'), notifId, { screen: "BreastFeedingPumpingScreen", notif: baby }, "day")
                    }
                })
                AsyncStorage.getItem(KeyUtils.FEEDING_PUMPING_5HRS_NOTIFICATION, (err, result) => {
                    const result2 = JSON.parse(result) || []
                    let notifId1 = parseInt(Math.random()*1000000000, 10).toString()
                    let result1 = result2.filter((e) => {
                        return e.id === baby.babyId
                    })
                    if(result1.length === 0) {
                        AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_5HRS_NOTIFICATION, JSON.stringify(result2.concat({ id: baby.babyId, notifId: notifId1, alterText: true })))
                        ScheduleLocalNotification(new Date(Date.now() + 18000 * 1000), I18n.t('tracking.Breastfeeding_and_Pumping_title'), I18n.t('tracking.Breastfeeding_and_Pumping_5hrs'), notifId1, { screen: "BreastFeedingPumpingScreen", notif: baby})
                    } else {
                        let notifMsg1 = !result1[0].alterText ? I18n.t('tracking.Breastfeeding_and_Pumping_5hrs') : I18n.t('tracking.Breastfeeding_and_Pumping_5hrs2')
                        PushNotification.cancelLocalNotifications({ id: result1[0].notifId });
                        let result = result2.filter((e) => {
                            return e.notifId !== result1[0].notifId
                        })
                        AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_5HRS_NOTIFICATION, JSON.stringify(result.concat({ id: baby.babyId, notifId: notifId1, alterText: !result1[0].alterText })))
                        AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS, JSON.stringify(notifications.concat(notifId1)))
                        ScheduleLocalNotification(new Date(Date.now() + 18000 * 1000), I18n.t('tracking.Breastfeeding_and_Pumping_title'), notifMsg1, notifId1, { screen: "BreastFeedingPumpingScreen", notif: baby})
                    }
                })
            })
        }
    })
}

export const breastFeedingPumpingNotification = (babies, arr) => {
    AsyncStorage.getItem(KeyUtils.BREASTFEEDING_PUMPING_NOTIF, (err, pumpingNotif) => {
        if(pumpingNotif !== "false") {
            AsyncStorage.getItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS, async(err, notifs) => {
                let notifications = notifs !== null ? JSON.parse(notifs) : []
                let result2 = []
                await AsyncStorage.getItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION, async(err, result) => {
                    result2 = result !== null ? JSON.parse(result) : []
                })

                babies.map((baby) => {
                    if(checkDays(baby.birthday) <= 0 && checkDays(baby.birthday) >= -26) {
                        let result1 = result2.filter((e) => {
                            return e.id === baby.babyId
                        })
                        if(result1.length > 0) {
                            let pumpingCount = arr.filter((e) => {
                                let trackAT = moment(e.trackAt).format('YYYY-MM-DD HH:mm:ss')
                                let fromTime = moment(result1[0].fromTime).format('YYYY-MM-DD HH:mm:ss')
                                let toTime = moment(result1[0].toTime).format('YYYY-MM-DD HH:mm:ss')
                                return e.babyId === baby.babyId && (e.trackingType === KeyUtils.TRACKING_TYPE_PUMPING || e.trackingType === KeyUtils.TRACKING_TYPE_BREASTFEEDING) && e.batchType === 0 && moment(trackAT).isBetween(fromTime, toTime, undefined, '[]')
                            })
                            if(pumpingCount.length >= 8) {
                                PushNotification.cancelLocalNotifications({ id: result1[0].notifId });
                                let fromTime = moment().add(1,'days').set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss')
                                let toTime = moment().add(2,'days').set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss');
                                let duetime =  diffInSecs(toTime, "", true, moment().format('YYYY-MM-DD HH:mm:ss'))
                                let notifId = parseInt(Math.random()*1000000000, 10).toString()
                                let notifMsg = !result1[0].alterText ? I18n.t('tracking.Breastfeeding_and_Pumping') : I18n.t('tracking.Breastfeeding_and_Pumping1')
                                let result = result2.filter((e) => {
                                    return e.notifId !== result1[0].notifId
                                })
                                AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION, JSON.stringify(result.concat({ id: baby.babyId, fromTime: fromTime, toTime: toTime, notifId: notifId,  alterText: !result1[0].alterText })))
                                AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS, JSON.stringify(notifications.concat(notifId)))
                                ScheduleLocalNotification(new Date(Date.now() + duetime * 1000), I18n.t('tracking.Breastfeeding_and_Pumping_title'), notifMsg, notifId, { screen: "BreastFeedingPumpingScreen", notif: baby }, "day")
                            }
                        } else {
                            let today = moment().set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss')
                            let tomorrow = moment(today).add(1,'days').set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss');
                            let duetime =  diffInSecs(moment().add(1,'days').set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss'), "", true, moment().format('YYYY-MM-DD HH:mm:ss'))
                            let notifId = parseInt(Math.random()*1000000000, 10).toString()
                            AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION, JSON.stringify(result2.concat({ id: baby.babyId, track: false, fromTime: today, toTime: tomorrow, notifId: notifId,  alterText: true })))
                            AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS, JSON.stringify(notifications.concat(notifId)))
                            ScheduleLocalNotification(new Date(Date.now() + duetime * 1000), I18n.t('tracking.Breastfeeding_and_Pumping_title'), I18n.t('tracking.Breastfeeding_and_Pumping'), notifId, { screen: "BreastFeedingPumpingScreen", notif: baby }, "day")
                        }
                    } else if(checkDays(baby.birthday) > 0){
                        let result1 = result2.filter((e) => {
                            return e.id === baby.babyId
                        })
                        if(result1.length === 0) {
                            let today = moment(baby.birthday).set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss')
                            let tomorrow = moment(baby.birthday).add(1,'days').set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss');
                            let duetime =  diffInSecs(moment(baby.birthday).add(1,'days').set({ "hour": 9, "minute": 0, "second": 0 }).format('YYYY-MM-DD HH:mm:ss'), "", true, moment().format('YYYY-MM-DD HH:mm:ss'))
                            let notifId = parseInt(Math.random()*1000000000, 10).toString()
                            AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION, JSON.stringify(result2.concat({ id: baby.babyId, track: false, fromTime: today, toTime: tomorrow, notifId: notifId,  alterText: true })))
                            AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATIONS, JSON.stringify(notifications.concat(notifId)))
                            ScheduleLocalNotification(new Date(Date.now() + duetime * 1000), I18n.t('tracking.Breastfeeding_and_Pumping_title'), I18n.t('tracking.Breastfeeding_and_Pumping'), notifId, { screen: "BreastFeedingPumpingScreen", notif: baby }, "day")
                        }
                    }
                })
            })
        }
    })
}

export const saveDryNappyTrack = (trackingData, baby) => {
    AsyncStorage.getItem(KeyUtils.DIAPER_NOTIF, (err, diaperNotif) => {
        if(diaperNotif !== "false") {
            AsyncStorage.getItem(KeyUtils.NAPPY_NOTIFICATIONS, async(err, notifs) => {
                let notifications = notifs !== null ? JSON.parse(notifs) : []
                let dueTime = diffInSecs(moment(trackingData.trackAt).add(1,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
                let fromTime = moment(trackingData.trackAt).format('YYYY-MM-DD HH:mm:ss')
                let notifId = parseInt(Math.random()*1000000000, 10).toString()
                let notifMsg = ''
                let result2 = []
                let updatedResult = []
                if(checkDays(baby.birthday) >= -26){
                    await AsyncStorage.getItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, (err, result) => {
                        result2 = result !== null ? JSON.parse(result) : []
                        let result1 = result2.filter((e) => {
                            return e.id === baby.babyId
                        })
                        let alterText1 = result1.length > 0 ? !result1[0].alterText : false
                        notifMsg = alterText1 ? I18n.t('tracking.four_weeks_nappy_notification_text') : I18n.t('tracking.four_weeks_nappy_notification_text2')
                        if(result1.length === 1 && result1[0] && result1[0].tracking === false) {
                            PushNotification.cancelLocalNotifications({ id: result1[0].notifId });
                            updatedResult = result2.filter((e) => {
                                return e.notifId !== result1[0].notifId
                            })
                        } else {
                            updatedResult = result2
                        }
                        AsyncStorage.setItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, JSON.stringify(updatedResult.concat({ id: baby.babyId, notifId: notifId, fromTime: fromTime, toTime:moment(fromTime).add(1,'days').format('YYYY-MM-DD HH:mm:ss'), alterText: alterText1 })) )
                    })
                } else {
                    await AsyncStorage.getItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION, (err, result) => {
                        let result2 = result !== null ? JSON.parse(result) : []
                        let result1 = result2.filter((e) => {
                            return e.id === baby.babyId
                        })
                        if(result1.length === 1 && result1[0] && result1[0].tracking === false) {
                            PushNotification.cancelLocalNotifications({ id: result1[0].notifId });
                            updatedResult = result2.filter((e) => {
                                return e.notifId !== result1[0].notifId
                            })
                        } else {
                            updatedResult = result2
                        }
                        notifMsg = I18n.t('tracking.four_weeks_nappy_notification_text3')
                        AsyncStorage.setItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION, JSON.stringify(updatedResult.concat({ id: baby.babyId, notifId: notifId, fromTime: fromTime, toTime:moment(fromTime).add(1,'days').format('YYYY-MM-DD HH:mm:ss') })) )
                    })
                }
                ScheduleLocalNotification(new Date(Date.now() + dueTime * 1000), I18n.t('tracking.nappy_notification_title2'), notifMsg, notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'poo'}, "day")
                AsyncStorage.setItem(KeyUtils.NAPPY_NOTIFICATIONS, JSON.stringify(notifications.concat(notifId)))
            })
        }
    })
}

export const fourWeeksNappyNotification =  (babies, arr) => {
    AsyncStorage.getItem(KeyUtils.DIAPER_NOTIF, (err, diaperNotif) => {
        if(diaperNotif !== "false") {
            AsyncStorage.getItem(KeyUtils.NAPPY_NOTIFICATIONS, (err, notifs) => {
                let notifications = notifs !== null ? JSON.parse(notifs) : []
                babies.map(async(baby) => {
                    if(checkDays(baby.birthday) <= 0 && checkDays(baby.birthday) >= -40) {
                        let records1 = []
                        if(checkDays(baby.birthday) >= -26) {
                            await AsyncStorage.getItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, (err, result) => {
                                records1 = result !== null ? JSON.parse(result) : []
                            })
                        } else {
                            await AsyncStorage.getItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION, (err, result) => {
                                records1 = result !== null ? JSON.parse(result) : []
                            })
                        }
                        let records = records1.filter((e) => {
                            return e.id === baby.babyId
                        })
                        if(records.length > 0) {
                            records.map(async(record, index) => {
                                let getTrackRecord = []
                                let username = await AsyncStorage.getItem(KeyUtils.USER_NAME)
                                getTrackRecord = arr.filter((e) => {
                                    let trackAT = moment(e.trackAt).format('YYYY-MM-DD HH:mm:ss')
                                    let fromTime = moment(record.fromTime).format('YYYY-MM-DD HH:mm:ss')
                                    let toTime1 = moment(record.fromTime).add(1,'days').format('YYYY-MM-DD HH:mm:ss')
                                    let timeNow = moment().format('YYYY-MM-DD HH:mm:ss')
                                    let toTime = moment().isSameOrAfter(toTime1) ? timeNow : toTime1
                                    return e.babyId === baby.babyId && e.userId === username && e.trackingType === KeyUtils.TRACKING_TYPE_DIAPER && e.batchType === 2 && moment(trackAT).isBetween(fromTime, toTime, undefined, '[]')
                                })
                                if(getTrackRecord.length >= 2){
                                    let nappyRecords = []
                                    PushNotification.cancelLocalNotifications({ id: record.notifId });
                                    nappyRecords = notifications.filter((e) => {
                                        return e !== record.notifId
                                    })
                                    let updatedRecords = records1.filter((e) => {
                                        return e.notifId !== record.notifId
                                    })
                                    if(checkDays(baby.birthday) >= -26) {
                                        AsyncStorage.setItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, JSON.stringify(updatedRecords))
                                    } else {
                                        AsyncStorage.setItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION, JSON.stringify(updatedRecords))
                                    }
                                    AsyncStorage.setItem(KeyUtils.NAPPY_NOTIFICATIONS, JSON.stringify(nappyRecords))
                                }
                            })
                        } else {
                            let today = moment().format('YYYY-MM-DD')
                            let getRecord = arr.filter((e) => {
                                let trackAT = moment(e.trackAt).format('YYYY-MM-DD')
                                return e.babyId === baby.babyId && e.trackingType === KeyUtils.TRACKING_TYPE_DIAPER && e.batchType === 2 && trackAT === today
                            })
                            if(getRecord.length > 0){
                               let dueTime = diffInSecs(moment(getRecord[0].trackAt).add(1,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
                               let fromTime = moment(getRecord[0].trackAt).format('YYYY-MM-DD HH:mm:ss')
                               let toTime = moment(fromTime).add(1,'days').format('YYYY-MM-DD HH:mm:ss')
                               let notifId = parseInt(Math.random()*1000000000, 10).toString()
                               let notifMsg = ''
                               if(checkDays(baby.birthday) >= -26) {
                                    notifMsg = I18n.t('tracking.four_weeks_nappy_notification_text')
                                    AsyncStorage.setItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, JSON.stringify(records1.concat({ id: baby.babyId, tracking: false, fromTime: fromTime, toTime: toTime, notifId: notifId,  alterText: true })))
                                } else {
                                    notifMsg = I18n.t('tracking.four_weeks_nappy_notification_text3')
                                    AsyncStorage.setItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION, JSON.stringify(records1.concat({ id: baby.babyId, tracking: false, fromTime: fromTime, toTime: toTime, notifId: notifId })))
                                }
                               ScheduleLocalNotification(new Date(Date.now() + dueTime * 1000), I18n.t('tracking.nappy_notification_title2'), notifMsg, notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'poo'}, "day")
                            } else {
                                let today = moment().format('YYYY-MM-DD HH:mm:ss')
                                let tomorrow = moment(today).add(1,'days').format('YYYY-MM-DD HH:mm:ss');
                                let duetime = diffInSecs(tomorrow, "", true)
                                let notifId = parseInt(Math.random()*1000000000, 10).toString()
                                let notifMsg = ''
                                if(checkDays(baby.birthday) >= -26) {
                                    notifMsg = I18n.t('tracking.four_weeks_nappy_notification_text')
                                    AsyncStorage.setItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, JSON.stringify(records1.concat({ id: baby.babyId, tracking: false, fromTime: today, toTime: tomorrow, notifId: notifId,  alterText: true })))
                                } else {
                                    notifMsg = I18n.t('tracking.four_weeks_nappy_notification_text3')
                                    AsyncStorage.setItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION, JSON.stringify(records1.concat({ id: baby.babyId, tracking: false, fromTime: today, toTime: tomorrow, notifId: notifId })))
                                }
                                ScheduleLocalNotification(new Date(Date.now() + duetime * 1000), I18n.t('tracking.nappy_notification_title2'), notifMsg, notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'poo'}, "day")
                            }
                        }
                    } else {
                        if(checkDays(baby.birthday) > 0) {
                            AsyncStorage.getItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, (err, result) => {
                                let records1 = result !== null ? JSON.parse(result) : []
                                let records = records1.filter((e) => {
                                    return e.id === baby.babyId
                                })
                                if(records.length === 0) {
                                    let today = moment(baby.birthday).format('YYYY-MM-DD HH:mm:ss A')
                                    let tomorrow = moment(baby.birthday).add(1,'days').format('YYYY-MM-DD HH:mm:ss A')
                                    let duetime = diffInSecs(moment(baby.birthday).add(1,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
                                    let notifId = parseInt(Math.random()*1000000000, 10).toString()
                                    AsyncStorage.setItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, JSON.stringify(records1.concat({ id: baby.babyId, tracking: false, fromTime: today, toTime: tomorrow, notifId: notifId,  alterText: true })))
                                    ScheduleLocalNotification(new Date(Date.now() + duetime * 1000), I18n.t('tracking.nappy_notification_title2'), I18n.t('tracking.four_weeks_nappy_notification_text'), notifId, { screen: "NappyTrackingScreen", notif: baby, batchType: 'poo'}, "day")
                                }
                            })
                        }
                    }
                })
            })
        }
    })
}

export const weightTrackNotification = (weightObj, baby) => {
    let getWeek = calculateWeeksBetween(new Date(), new Date(baby.birthday))
    let arr = whoData.tracking_weight_boys_p3
    let getWeight = 0
    let whoMinWeight = 0
    let whoMaxWeight = 0
    if(baby.gender === 1) {
        whoMinWeight = whoData.tracking_weight_boys_p3
        whoMaxWeight = whoData.tracking_weight_boys_p97
        getWeight = weightObj.weightUnit === 'lb' ? convertPoundIntoGram(weightObj.weight)/1000 : weightObj.weight/1000
    } else {
        whoMinWeight = whoData.tracking_weight_girls_p3
        whoMaxWeight = whoData.tracking_weight_girls_p97
        getWeight = weightObj.weightUnit === 'lb' ? convertPoundIntoGram(weightObj.weight)/1000 : weightObj.weight/1000
    }
    if(getWeight <= whoMinWeight[getWeek] || getWeight >= whoMaxWeight[getWeek]) {
        AsyncStorage.getItem(KeyUtils.WEIGHT_NOTIFICATION, (err, result) => {
            if(result !== "false") {
                ScheduleLocalNotification(new Date(Date.now()+ 1 * 1000), I18n.t('tracking.weight_tracking_notification_title'), I18n.t("tracking.weight_tracking_notification_text"), parseInt(getWeight), { screen: "WeightScreen", notif: baby })
            }
        })
    }
}

export const growthTrackNotification = (heightObj, baby) => {
    let getWeek = calculateWeeksBetween(new Date(), new Date(baby.birthday))
    let arr = whoData.tracking_height_boys_p3
    let getHeight = 0
    let whoMinheight = 0
    let whoMaxheight = 0
    if(baby.gender === 1) {
        whoMinheight = whoData.tracking_height_boys_p3
        whoMaxheight = whoData.tracking_height_boys_p97
        getHeight = heightObj.heightUnit === 'inch' ? heightObj.height*2.54 : heightObj.height
    } else {
        whoMinheight = whoData.tracking_height_girls_p3
        whoMaxheight = whoData.tracking_height_girls_p97
        getHeight = heightObj.heightUnit === 'inch' ?  heightObj.height*2.54 : heightObj.height
    }
    if(getHeight <= whoMinheight[getWeek] || getHeight >= whoMaxheight[getWeek]) {
        AsyncStorage.getItem(KeyUtils.HEIGHT_NOTIFICATION, (err, result) => {
            if(result !== "false") {
                ScheduleLocalNotification(new Date(Date.now()+ 1 * 1000), I18n.t('tracking.height_tracking_notification_title'), I18n.t("tracking.height_tracking_notification_text"), parseInt(getHeight), { screen: "GrowthScreen", notif: baby })
            }
        })
    }
}

export const milkExpiredNotification = (milkObj, expireAt=true) => {
    AsyncStorage.getItem(KeyUtils.MILK_EXPIRE_NOTIF, (err, result) => {
        if(result !== "false") {
            let data = []
            let notifId1 = parseInt(Math.random()*1000000000, 10).toString()
            let expireAtValue = ''
            if(expireAt) {
                expireAtValue = milkObj.expireAt
            } else {
                expireAtValue = milkObj.location === 1 ? moment().add(3, 'days').format() : moment().add(6, 'months').format()
            }
            let fireTime1 =  diffInSecs(moment(expireAtValue), "", true)
            data.push({ recordId: milkObj.id, notifId: notifId1, fireTime: moment(expireAtValue).format('YYYY-MM-DD HH:mm:ss')})
            let message = `The ${milkObj.containerType === 1 ? 'bottle' : 'bag'} no.${milkObj.number} stored in the ${milkObj.location === 1 ? 'fridge' : 'freezer'} just expired. Please don't use it anymore for feeding. Dispose of or repurpose it.`
            ScheduleLocalNotification(new Date(Date.now() + fireTime1 * 1000), I18n.t('virtual_freezer.notification_title2'), message, notifId1, { screen: "FreezerTrackingScreen" })
            AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, (err, result) => {
                let records = result !== null ? JSON.parse(result) : []
                let storeArr = records.concat(data)
                AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, JSON.stringify(storeArr))
            })
        }
    })
    AsyncStorage.getItem(KeyUtils.MILK_ABOUT_TO_EXPIRE_NOTIF, (err, result) => {
        if(result !== "false") {
            let data = []
            let expireAtValue = ''
            if(expireAt) {
                expireAtValue = milkObj.expireAt
            } else {
                expireAtValue = milkObj.location === 1 ? moment().add(3, 'days').format() : moment().add(6, 'months').format()
            }
            let fireTime2 =  diffInSecs(moment(expireAtValue).subtract(1,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
            let notifId2 = parseInt(Math.random()*1000000000, 10).toString()
            data.push({ recordId: milkObj.id, notifId: notifId2, fireTime: moment(expireAtValue).subtract(1,'days').format('YYYY-MM-DD HH:mm:ss')})
            let message = `The ${milkObj.containerType === 1 ? 'bottle' : 'bag'} no.${milkObj.number} stored in the ${milkObj.location === 1 ? 'fridge' : 'freezer'} is about to expire tomorrow. Make sure to use it today to avoid wasting it!`
            ScheduleLocalNotification(new Date(Date.now() + fireTime2 * 1000), I18n.t('virtual_freezer.notification_title3'), message, notifId2, { screen: "FreezerTrackingScreen" })
            AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, (err, result) => {
                let records = result !== null ? JSON.parse(result) : []
                let storeArr = records.concat(data)
                AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, JSON.stringify(storeArr))
            })
        }
    })

}

export const scheduleFreezer1Notifications = () => {
    AsyncStorage.getItem(KeyUtils.MILK_EXPIRE_NOTIF, (err, result) => {
        if(result !== "false") {
            AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, async(err, result) => {
                let records = result !== null ? JSON.parse(result) : []
                let realmDb = await getRealmDb()
                let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
                let myItems = realmDb.objects('VirtualFreezerSchema');
                let items=myItems.filter((e)=>{
                return e.userId==userName
                })
                if(records.length === 0) {
                    let data = []
                    items.map((item) => {
                        if(new Date(item.expireAt) > new Date()) {
                            let fireTime1 =  diffInSecs(moment(item.expireAt), "", true)
                            let notifId1 = parseInt(Math.random()*1000000000, 10).toString()
                            data.push({ recordId: item.id, notifId: notifId1, fireTime: moment(item.expireAt).format('YYYY-MM-DD HH:mm:ss') })
                            let message = `The ${item.containerType === 1 ? 'bottle' : 'bag'} no.${item.number} stored in the ${item.location === 1 ? 'fridge' : 'freezer'} just expired. Please don't use it anymore for feeding. Dispose of or repurpose it.`
                            if(!item.isConsumed){
                            ScheduleLocalNotification(new Date(Date.now() + fireTime1 * 1000), I18n.t('virtual_freezer.notification_title2'), message, notifId1, { screen: "FreezerTrackingScreen" })
                        }
                        }
                    })
                    AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, JSON.stringify(data))
                } else {
                    items.map((item) => {
                        if(item.isConsumed){
                            records = records.filter((e) => {
                                if(e.recordId === item.id) {
                                    PushNotification.cancelLocalNotifications({ id: records[index].notifId });
                                }
                                return e.recordId !== item.id
                            })
                        }
                    })
                    AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, JSON.stringify(records))
                }
            })
        }
    })
}

export const scheduleFreezer2Notifications = () => {
    AsyncStorage.getItem(KeyUtils.MILK_ABOUT_TO_EXPIRE_NOTIF, (err, result) => {
        if(result !== "false") {
            AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, async(err, result) => {
                let records = result !== null ? JSON.parse(result) : []
                let realmDb = await getRealmDb()
                let userName = await AsyncStorage.getItem(KeyUtils.USER_NAME)
                let myItems = realmDb.objects('VirtualFreezerSchema');
                let items=myItems.filter((e)=>{
                return e.userId==userName
                })
                if(records.length === 0) {
                    let data = []
                    items.map((item) => {
                        if(new Date(item.expireAt) > new Date()) {
                            let fireTime2 =  diffInSecs(moment(item.expireAt).subtract(1,'days').format('YYYY-MM-DD HH:mm:ss A'), "", true)
                            if(fireTime2 > 0){
                                let notifId2 = parseInt(Math.random()*1000000000, 10).toString()
                                data.push({ recordId: item.id, notifId: notifId2, fireTime: moment(item.expireAt).subtract(1,'days').format('YYYY-MM-DD HH:mm:ss') })
                                let message = `The ${item.containerType === 1 ? 'bottle' : 'bag'} no.${item.number} stored in the ${item.location === 1 ? 'fridge' : 'freezer'} is about to expire tomorrow. Make sure to use it today to avoid wasting it!`
                                if(!item.isConsumed){
                                ScheduleLocalNotification(new Date(Date.now() + fireTime2 * 1000), I18n.t('virtual_freezer.notification_title3'), message, notifId2, { screen: "FreezerTrackingScreen" })
                                }
                            }
                        }
                    })
                    AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, JSON.stringify(data))
                } else {
                    items.map((item) => {
                        if(item.isConsumed){
                            records = records.filter((e) => {
                                if(e.recordId === item.id) {
                                    PushNotification.cancelLocalNotifications({ id: records[index].notifId });
                                }
                                return e.recordId !== item.id
                            })
                        }
                    })
                    AsyncStorage.setItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, JSON.stringify(records))
                }
            })
        }
    })
}

export const cancelNotifications = async(babies=[], deleteBaby=false, all=false) => {
    AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS, (err, records) => {
        let records1 = records !== null ? JSON.parse(records) : []
        if(records1.length > 0) {
            records1.map((notifs) => {
                PushNotification.cancelLocalNotifications({ id: notifs.notifId });
            })
        }
        AsyncStorage.removeItem(KeyUtils.VIRTUAL_FREEZER1_NOTIFS)
    })
    AsyncStorage.getItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS, (err, records) => {
        let records1 = records !== null ? JSON.parse(records) : []
        if(records1.length > 0) {
            records1.map((notifs) => {
                PushNotification.cancelLocalNotifications({ id: notifs.notifId });
            })
        }
        AsyncStorage.removeItem(KeyUtils.VIRTUAL_FREEZER2_NOTIFS)
    })
    // if(all) {
    //     PushNotification.cancelAllLocalNotifications()
    //     PushNotification.removeAllDeliveredNotifications();
    //     let keys = [
    //         KeyUtils.NAPPY_NOTIFICATIONS,
    //         KeyUtils.SCHEDULED_NOTIFICATIONS,
    //         KeyUtils.BCA_AFTER_BIRTH_NOTIFICATION,
    //         KeyUtils.BCA_BEFORE_BIRTH_NOTIFICATION,
    //         KeyUtils.FIRSTDAY_NAPPY_NOTIFICATION,
    //         KeyUtils.DIAPER_NOTIF,
    //         KeyUtils.HEIGHT_NOTIFICATION,
    //         KeyUtils.WEIGHT_NOTIFICATION,
    //         KeyUtils.BREASTFEEDING_PUMPING_NOTIF,
    //         KeyUtils.CP_NOTIFICATION_FIREDATE,
    //         KeyUtils.BCA_POPUP_FIRETIME,
    //         KeyUtils.BIRTHDAY_POPUP_NOTIF,
    //         KeyUtils.BCA_POPUP_NOTIF,
    //         KeyUtils.CP_POPUP_NOTIF,
    //         KeyUtils.BIRTHDAY_POPUP_NOTIF,
    //         KeyUtils.VOLUME_NEVER_SHOW_AGAIN,
    //         KeyUtils.NEVER_SHOW_BABY_BIRTHDAY_NOTIFICATION,
    //         KeyUtils.FEEDING_PUMPING_NOTIFICATION,
    //         KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION,
    //         KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION,
    //         KeyUtils.WET_NAPPY_NOTIFICATION,
    //         KeyUtils.WET_NAPPY_WEEK6_NOTIFICATION,
    //         KeyUtils.FEEDING_PUMPING_NOTIFICATIONS,
    //         KeyUtils.FEEDING_PUMPING_5HRS_NOTIFICATION,
    //     ];
    //     await AsyncStorage.multiRemove(keys, (err) => {
    //     });
    // } else{
    //     babies.map((baby) => {
    //         if(checkDays(baby.birthday) <= -27 || deleteBaby) {
    //             PushNotification.cancelLocalNotifications({ id: baby.babyId+1 });
    //             PushNotification.cancelLocalNotifications({ id: baby.babyId+3 });
    //             PushNotification.cancelLocalNotifications({ id: baby.babyId+4 });
    //             AsyncStorage.getItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION, (err, breastFeedNotifs) => {
    //                 let breastFeedNotifs1 = breastFeedNotifs !== null ? JSON.parse(breastFeedNotifs) : []
    //                 if(breastFeedNotifs1.length > 0) {
    //                     let getRecord = breastFeedNotifs1.filter((notifs) => {
    //                         if(notifs.id === baby.babyId) {
    //                             PushNotification.cancelLocalNotifications({ id: notifs.notifId });
    //                         }
    //                         return notifs.id !== baby.babyId
    //                     })
    //                     if(getRecord.length > 0) {
    //                         AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION, JSON.stringify(getRecord))
    //                     } else {
    //                         AsyncStorage.removeItem(KeyUtils.FEEDING_PUMPING_NOTIFICATION)
    //                     }
    //                 }
    //             })
    //             AsyncStorage.getItem(KeyUtils.FEEDING_PUMPING_5HRS_NOTIFICATION, (err, breastFeedNotifs) => {
    //                 let breastFeedNotifs1 = breastFeedNotifs !== null ? JSON.parse(breastFeedNotifs) : []
    //                 if(breastFeedNotifs1.length > 0) {
    //                     let getRecord = breastFeedNotifs1.filter((notifs) => {
    //                         if(notifs.id === baby.babyId) {
    //                             PushNotification.cancelLocalNotifications({ id: notifs.notifId });
    //                         }
    //                         return notifs.id !== baby.babyId
    //                     })
    //                     if(getRecord.length > 0) {
    //                         AsyncStorage.setItem(KeyUtils.FEEDING_PUMPING_5HRS_NOTIFICATION, JSON.stringify(getRecord))
    //                     } else {
    //                         AsyncStorage.removeItem(KeyUtils.FEEDING_PUMPING_5HRS_NOTIFICATION)
    //                     }
    //                 }
    //             })
    //             AsyncStorage.getItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, (err, nappyNotifs) => {
    //                 let nappyNotifs1 = nappyNotifs !== null ? JSON.parse(nappyNotifs) : []
    //                 if(nappyNotifs1.length > 0) {
    //                     let getRecord = nappyNotifs1.filter((notifs) => {
    //                         if(notifs.id === baby.babyId) {
    //                             PushNotification.cancelLocalNotifications({ id: notifs.notifId });
    //                         }
    //                         return notifs.id !== baby.babyId
    //                     })
    //                     if(getRecord.length > 0) {
    //                         AsyncStorage.setItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION, JSON.stringify(getRecord))
    //                     } else {
    //                         AsyncStorage.removeItem(KeyUtils.FOURWEEKS_NAPPY_NOTIFICATION)
    //                     }
    //                 }
    //             })
    //         }
    //         if(checkDays(baby.birthday) <= -41 || deleteBaby) {
    //             AsyncStorage.getItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION, (err, nappyNotifs) => {
    //                 let nappyNotifs1 = nappyNotifs !== null ? JSON.parse(nappyNotifs) : []
    //                 if(nappyNotifs1.length > 0) {
    //                     let getRecord = nappyNotifs1.filter((notifs) => {
    //                         if(notifs.id === baby.babyId) {
    //                             PushNotification.cancelLocalNotifications({ id: notifs.notifId });
    //                         }
    //                         return notifs.id !== baby.babyId
    //                     })
    //                     if(getRecord.length > 0) {
    //                         AsyncStorage.setItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION, JSON.stringify(getRecord))
    //                     } else {
    //                         AsyncStorage.removeItem(KeyUtils.SIXWEEKS_NAPPY_NOTIFICATION)
    //                     }
    //                 }
    //             })
    //             AsyncStorage.getItem(KeyUtils.WET_NAPPY_NOTIFICATION, (err, nappyNotifs) => {
    //                 let nappyNotifs1 = nappyNotifs !== null ? JSON.parse(nappyNotifs) : []
    //                 if(nappyNotifs1.length > 0) {
    //                     let getRecord = nappyNotifs1.filter((notifs) => {
    //                         if(notifs.id === baby.babyId) {
    //                             PushNotification.cancelLocalNotifications({ id: notifs.notifId });
    //                         }
    //                         return notifs.id !== baby.babyId
    //                     })
    //                     if(getRecord.length > 0) {
    //                         AsyncStorage.setItem(KeyUtils.WET_NAPPY_NOTIFICATION, JSON.stringify(getRecord))
    //                     } else {
    //                         AsyncStorage.removeItem(KeyUtils.WET_NAPPY_NOTIFICATION)
    //                     }
    //                 }
    //             })
    //             AsyncStorage.getItem(KeyUtils.NAPPY_NOTIFICATIONS, (err, nappyNotifs) => {
    //                 let nappyNotifs1 = nappyNotifs !== null ? JSON.parse(nappyNotifs) : []
    //                 if(nappyNotifs1.length > 0) {
    //                     let getRecord = nappyNotifs1.filter((notifs) => {
    //                         if(notifs === baby.babyId) {
    //                             PushNotification.cancelLocalNotifications({ id: notifs });
    //                         }
    //                         return notifs !== baby.babyId
    //                     })
    //                     if(getRecord.length > 0) {
    //                         AsyncStorage.setItem(KeyUtils.NAPPY_NOTIFICATIONS, JSON.stringify(getRecord))
    //                     } else {
    //                         AsyncStorage.removeItem(KeyUtils.NAPPY_NOTIFICATIONS)
    //                     }
    //                 }
    //             })
    //         }
    //         if(checkDays(baby.birthday) <= -50 || deleteBaby) {
    //             AsyncStorage.getItem(KeyUtils.WET_NAPPY_WEEK6_NOTIFICATION, (err, nappyNotifs) => {
    //                 let nappyNotifs1 = nappyNotifs !== null ? JSON.parse(nappyNotifs) : []
    //                 if(nappyNotifs1.length > 0) {
    //                     let getRecord = nappyNotifs1.filter((notifs) => {
    //                         if(notifs.id === baby.babyId) {
    //                             PushNotification.cancelLocalNotifications({ id: notifs.notifId });
    //                         }
    //                         return notifs.id !== baby.babyId
    //                     })
    //                     if(getRecord.length > 0) {
    //                         AsyncStorage.setItem(KeyUtils.WET_NAPPY_WEEK6_NOTIFICATION, JSON.stringify(getRecord))
    //                     } else {
    //                         AsyncStorage.removeItem(KeyUtils.WET_NAPPY_WEEK6_NOTIFICATION)
    //                     }
    //                 }
    //             })
    //         }
    //     })
    // }
}
