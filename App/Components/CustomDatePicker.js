import React from 'react'
import DatePicker from 'react-native-datepicker'

import styles from "./Styles/CustomDatePickerStyles";
import I18n from '@i18n';
import {Text, View} from "react-native";

const CustomDatePicker = (props) => {
  const {selectedDate, placeholder, onDateSelect, dateIconStyles, dateTextStyles, error, errorMessage, dateFormat} = props

  return (
    <View>
      <DatePicker
        {...props}
        date={selectedDate}
        mode="date"
        useNativeDriver={true}
        placeholder={placeholder}
        confirmBtnText={I18n.t('generic.confirm')}
        cancelBtnText={I18n.t('generic.cancel')}
        format={dateFormat}
        customStyles={{
          dateIcon: [styles.dateIconStyle, dateIconStyles],
          dateInput: [styles.dateInputStyles],
          placeholderText: [styles.placeholderStyle],
          dateText: [styles.dateText, dateTextStyles],
          btnTextConfirm:[styles.confirmBtnText]
        }
        }
        onDateChange={(date) => onDateSelect(date)}
      />
      {error && errorMessage && <Text maxFontSizeMultiplier={1.7} style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  )
}

export default CustomDatePicker
