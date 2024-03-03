import React, { Component, useState } from 'react';
import { Colors, Fonts } from '@resources'
import {
  View,
  Text,
  TouchableOpacity,
  Animated
} from 'react-native';
import moment from "moment";
import styles from './Styles/TrackingDateTime'
import { getDateFormat, getTimeFormat } from "@utils/TextUtils";
import {useSelector} from 'react-redux'

function TrackingDateTime(props) {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  const {date,time}=props
  const[formattedDate, setformattedDate]=useState('')
  const[formattedTime, setformattedTime]=useState('')
  let newDate = getDateFormat(date).then((e) => setformattedDate(e))
  let newTime = getTimeFormat(false, time).then((e) => setformattedTime(e)) 
  return (<View style={styles.container}>
    <Text maxFontSizeMultiplier={1.7} style={[styles.timeTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{formattedTime}</Text>
    <Text maxFontSizeMultiplier={1.7} style={[styles.dateTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>{formattedDate}</Text>
    </View>)
}

export default TrackingDateTime
