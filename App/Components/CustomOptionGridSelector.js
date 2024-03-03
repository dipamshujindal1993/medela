import React from 'react'
import {Text, TouchableOpacity, View, FlatList} from 'react-native'
import styles from "./Styles/CustomOptionSelectorStyles";


export default class CustomOptionGridSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      selectedIndex: props.defaultSelectedIndex,
    };
  }

  renderItem = ({item, index}) => {
    const {label} = item
    const {selectedIndex} = this.state
    const {buttonContainerStyle,
      buttonContainerActiveStyle,
      buttonContainerInactiveStyle,
      buttonTextActiveStyle,
      buttonTextInactiveStyle,
      data,
      onChange,
      defaultSelectedIndex} = this.props
    const activeContainerStyles = index === selectedIndex ? [styles.btnContainer, styles.btnActive, buttonContainerStyle, buttonContainerActiveStyle] : [styles.btnContainer, styles.btnInactive, buttonContainerStyle, buttonContainerInactiveStyle];
    const activeTextStyles = index === selectedIndex ? [styles.btnTextActive, buttonTextActiveStyle] : [styles.btnTextInactive, buttonTextInactiveStyle];

    return <TouchableOpacity activeOpacity={1} onPress={() => {
      this.setState({selectedIndex:index})
      onChange({item, index})
    }} style={activeContainerStyles}>

      <Text maxFontSizeMultiplier={1.7} style={activeTextStyles}>{label}</Text>

    </TouchableOpacity>
  }

  render() {
    const {
      data
    } = this.props
    return <View>
      {/*{list.map((e, index) => renderItem(e, index))}*/}

      <FlatList
        data={data}
        numColumns={3}
        renderItem={this.renderItem}
        keyExtractor={item => item.value}
      />
    </View>
  }


}

