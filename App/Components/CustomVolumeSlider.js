import React from 'react';
import {View} from 'react-native';
//import RNListSlider from 'react-native-list-slider';
import CustomSlider from './CustomSlider';
import styles from './Styles/CustomVolumeSliderStyles'

class CustomVolumeSlider extends React.Component {
  constructor(props) {
    super(props);
  }
  onValueChanged = (value) => {
    this.props.changeValue(value);
  };

  render() {
    const {multiplicity, value, maxSliderValue ,decimalPlaces,onScrollBeginDrag,accuracy,range} = this.props;
    return (
        <View style={styles.container}>
        {maxSliderValue>0 &&
        //  <RNListSlider
        //   multiplicity={multiplicity}
        //   maximumValue={maxSliderValue}
        //   itemStyle={styles.itemStyling}
        //   tenthItemStyle={styles.tenthItemStyles}
        //   value={value}
        //   decimalPlaces={decimalPlaces}
        //   ///scrollEnabled={true}
        //   onValueChange={this.onValueChanged}
        // />
        <CustomSlider
          multiplicity={multiplicity}
          maxValue={maxSliderValue}
          //itemStyle={styles.itemStyling}
          //tenthItemStyle={styles.tenthItemStyles}
          value={value}
          accuracy={accuracy}
          //sliderHeight={200}
          //decimalPlaces={decimalPlaces}
          ///scrollEnabled={true}
          range={range}
          onScrollBeginDrag={onScrollBeginDrag||(()=>{})}
          onScroll={this.onValueChanged}
          {...this.props}
        />
        }
      </View>
    );
  }
}

export default CustomVolumeSlider;
