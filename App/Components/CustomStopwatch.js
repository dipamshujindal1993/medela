import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import I18n from '@i18n';
import {Colors} from '@resources';
import styles, {options} from './Styles/CustomStopwatchStyles';
import {Stopwatch} from 'react-native-stopwatch-timer';
import moment from 'moment';

class CustomStopwatch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startTimer: 0,
      isTimerRunning: false,
    }
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
  }

  toggleStopwatch() {
    const {stopwatchStartStatus} = this.props;

    let updatedObj = {stopwatchSelected: !stopwatchStartStatus};
    if (!stopwatchStartStatus) {
      let getCurrentTime = moment();
      this.props.changeValue({
        ...updatedObj,
        stopwatchSelectedTimer: this.currentTime,
        getStartTimeValue: getCurrentTime,
      });
    } else {
      let getEndTime = moment();
      this.props.changeValue({
        ...updatedObj,
        stopwatchSelectedTimer: this.currentTime,
        getEndTimeValue: getEndTime,
      });
    }
  }

  getFormattedTime = (time) => {
    this.currentTime = time;
    !this.props.stopwatchStartStatus && this.toggleStopwatch;
  };

  render() {
    const {stopwatchStartStatus,startTimer,icon} = this.props;

    return (
      <View style={styles.StopwatchWrapper}>
        <TouchableOpacity onPress={this.toggleStopwatch}>
          <View
            style={[
              styles.StopwatchBtnStyle,
              stopwatchStartStatus
                ? {backgroundColor: Colors.rgb_fd0807}
                : {backgroundColor: Colors.rgb_d8d8d8},
            ]}>
            {icon? !stopwatchStartStatus?icon:<Text maxFontSizeMultiplier={1.7} 
            style={[
              styles.StopwatchBtntext,
              stopwatchStartStatus
                ? {color: Colors.white}
                : {color: Colors.rgb_3E3E3E},
            ]}>{I18n.t('sleep.stop').toUpperCase()}</Text>:icon}
            {!icon && <Text maxFontSizeMultiplier={1.7}
              style={[
                styles.StopwatchBtntext,
                stopwatchStartStatus
                  ? {color: Colors.white}
                  : {color: Colors.rgb_3E3E3E},
              ]}>
              {!stopwatchStartStatus
                ?I18n.t('sleep.start').toUpperCase()
                : I18n.t('sleep.stop').toUpperCase()}
            </Text>}
          </View>
        </TouchableOpacity>
        <Stopwatch
         start={stopwatchStartStatus}
          startTime={startTimer}
          options={options}
          getTime={this.getFormattedTime}
        />
      </View>
    );
  }
}

export default CustomStopwatch;
