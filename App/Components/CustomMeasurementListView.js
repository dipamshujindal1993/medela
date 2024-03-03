import React from 'react'
import { Text, View, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import styles from "./Styles/CustomMeasurementListStyle";
import {useSelector} from 'react-redux';
import Colors from '@resources/Colors';
import Close from '@svg/close.svg';
import { Metrics } from '@resources'
import { verticalScale } from "@resources/Metrics";

const CustomMeasurementListView = ({ headerText, data, selectedValue, units, getItem, close}) => {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  let themeTextColor = selectedTheme === 'dark' ? Colors.white: Colors.rgb_000000
  let containerColor = Colors.white
  selectedTheme === "dark" && (containerColor = Colors.rgb_373838)

  return (
    <SafeAreaView style={[styles.viewContainerStyle, {backgroundColor: containerColor}]}>
      <View style={styles.headerViewStyle}>
        <View style={styles.titleViewStyles}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}>
            {headerText}
          </Text>
        </View>
        <View style={styles.iconViewStyles}>
          {close &&
            <Close
              onPress={() => close()}
              fill={Colors.rgb_888B8D}
              width={Metrics.moderateScale._30} 
              height={verticalScale(30)}
            />
          }
          </View>
      </View>
      <FlatList
        data={data}
        renderItem={({item, index}) =>{ 
          return(
            <TouchableOpacity 
              onPress={()=> getItem(item)}
              style={styles.measurementsListViewStyles}
            >
              <Text maxFontSizeMultiplier={1.7}
                maxFontSizeMultiplier={1.7} style={(selectedValue == item.id) ? styles.selectedMeasumentTextValueStyles : [styles.measurementsTextStyles,{color: selectedTheme === 'dark' ?(Colors.white):(Colors.rgb_000000)}]}
              >
                {item.value} {units}
              </Text>
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  )
}
export default CustomMeasurementListView;
