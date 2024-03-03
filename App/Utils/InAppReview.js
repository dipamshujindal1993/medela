import moment from "moment-timezone";
import {getTimeZone} from "./locale";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "./KeyUtils";
import { is24HourFormat } from 'react-native-device-time-format';
import I18n from '@i18n';
import {Alert} from "react-native";
import {openSettings} from "react-native-permissions";
import InAppReview from "react-native-in-app-review";

export function storeReviewDialog() {
    // This package is only available on android version >= 21 and iOS >= 10.3

    // trigger UI InAppreview
    if( InAppReview.isAvailable())
    {

      InAppReview.RequestInAppReview()
        .then((hasFlowFinishedSuccessfully) => {
          // when return true in android it means user finished or close review flow
          console.log('InAppReview in android', hasFlowFinishedSuccessfully);

          // when return true in ios it means review flow lanuched to user.
          console.log(
            'InAppReview in ios has launched successfully',
            hasFlowFinishedSuccessfully,
          );

          // 1- you have option to do something ex: (navigate Home page) (in android).
          // 2- you have option to do something,
          // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

          // 3- another option:
          if (hasFlowFinishedSuccessfully) {
            // this.props.navigation.navigate('Baby')
            // do something for ios
            // do something for android
          }

          // for android:
          // The flow has finished. The API does not indicate whether the user
          // reviewed or not, or even whether the review dialog was shown. Thus, no
          // matter the result, we continue our app flow.

          // for ios
          // the flow lanuched successfully, The API does not indicate whether the user
          // reviewed or not, or he/she closed flow yet as android, Thus, no
          // matter the result, we continue our app flow.
        })
        .catch((error) => {
          //we continue our app flow.
          // we have some error could happen while lanuching InAppReview,
          // Check table for errors and code number that can return in catch.
          console.log(error);
        });
    }
  };