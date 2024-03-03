import { Component } from 'react';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

export default class PushController extends Component {

  componentDidMount() {
    PushNotification.configure({
      onNotification: this.onNotif.bind(this),
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  }

  onNotif(notification) {
    if(notification.data.screen) {
      if(notification.data.screen.screen === 'FreezerTrackingScreen') {
        this.props.navigation.navigate("FreezerTrackingScreen")
      }
      if(notification.data.screen.notif) {
        if(notification.data.screen.screen === 'GrowthScreen') {
          this.props.navigation.navigate("GrowthScreen", { baby: notification.data.screen.notif })
        }
        if(notification.data.screen.screen === 'WeightScreen') {
          this.props.navigation.navigate("WeightScreen", { baby: notification.data.screen.notif })
        }
        if(notification.data.screen.screen === 'NappyTrackingScreen') {
          this.props.navigation.navigate("NappyTrackingScreen", { baby: notification.data.screen.notif, diaper: notification.data.screen.batchType })
        }
        if(notification.data.screen.screen === 'BreastFeedingPumpingScreen') {
          this.props.navigation.navigate("BreastFeedingPumpingScreen", { isLeftPress: false })
        }
      }
    }
    if(Platform.OS === "ios"){
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  }
  
  render() {
    return null;
  }
}