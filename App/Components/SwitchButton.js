import React, { Component } from 'react';
import { Colors, Fonts } from '@resources'
import {
    View,
    Text,
    TouchableOpacity,
    Animated
} from 'react-native';
import PropTypes from 'prop-types';

import styles from './Styles/SwitchButtonStyles'
import I18n from 'react-native-i18n';

export default class SwitchButton extends Component {

    static propTypes = {
		onValueChange: PropTypes.func
	};

	static defaultProps = {
		onValueChange: () => null
	};

    constructor(props) {
        super(props);
        this.state = {
          activeSwitch: props.activeSwitch ? props.activeSwitch : 1,
          sbWidth: 100,
          sbHeight: 44,
          direction: 'ltr',
          offsetX: new Animated.Value(0)
        };
    }

    componentDidMount(){
      let actSwitch = this.props.activeSwitch ? this.props.activeSwitch : 1;
      this.setState({
        activeSwitch: actSwitch,
      });
      if (this.props.amPmStart) {
        this.setState({
            offsetX:
              //actSwitch == 1 ? new Animated.Value(0) : new Animated.Value(this.props.switchWidth/2-5),
              actSwitch == 1 ? new Animated.Value(0) : new Animated.Value((((this.props.switchWidth || this.state.sbWidth) / 2) - 6) * (this._directionSign(this.props.switchdirection||this.state.direction))),
              
          });
      }
    }

    componentDidUpdate(prevProps){
        if(this.props.activeSwitch !== prevProps.activeSwitch && this.props.activeSwitch){
            this.setState({ activeSwitch: this.props.activeSwitch, offsetX:
                this.props.activeSwitch == 1 ? new Animated.Value(0) : new Animated.Value((((this.props.switchWidth || this.state.sbWidth) / 2) - 6) * (this._directionSign(this.props.switchdirection||this.state.direction))),})
        }
    }

    _switchDirection(direction) {
        let dir = 'row';

        if (direction === 'rtl') {
            dir = 'row-reverse';
        }
        else {
            dir = 'row';
        }
        return 'row'//dir;
    }
    _directionSign(direction){
        let dirsign = 1;
        if (direction === 'rtl') {
            dirsign = -1;
        }
        else {
            dirsign = 1;
        }
        return dirsign
    }
    _switchThump(direction,force) {
        const { onValueChange, disabled } = this.props;
        let dirsign=this._directionSign(direction);
        // let dirsign = 1;
        // if (direction === 'rtl') {
        //     dirsign = -1;
        // }
        // else {
        //     dirsign = 1;
        // }

        if (this.state.activeSwitch === 1){
            this.setState({ activeSwitch: 2 }, () => (force!==true&&onValueChange(this.state.activeSwitch)));

            Animated.timing(
                this.state.offsetX,
                    {
                        toValue: (((this.props.switchWidth || this.state.sbWidth) / 2) - 6) * dirsign,
                        duration: this.props.switchSpeedChange || 100,
                        useNativeDriver: true
                    }
            ).start();
        }
        else {
            this.setState({ activeSwitch: 1 }, () => (force!==true&&onValueChange(this.state.activeSwitch)));
            Animated.timing(
                this.state.offsetX,
                    {
                        toValue: 0,
                        duration: this.props.switchSpeedChange || 100,
                        useNativeDriver: true
                    }
            ).start();
        }

    }

    render() {
        return (
            <>
                <TouchableOpacity activeOpacity={1}
                                  onPress={ () => { this._switchThump(this.props.switchdirection || this.state.direction) }}
                                  style={styles.mainContainer}
                                  accessible={true}
                                  disabled = {this.props.ableToOpen ? true : false}
                                  accessibilityLabel={this.props.accessibilityLabel}>
                    <View
                        style={[{
                                width: this.props.switchWidth || this.state.sbWidth,
                                height: this.props.switchHeight || this.state.sbHeight,
                                borderRadius: this.props.switchBorderRadius !== undefined ? this.props.switchBorderRadius : this.state.sbHeight / 2,
                                borderWidth: 1,
                                borderColor: this.props.switchBorderColor || "red",
                                backgroundColor: this.props.switchBackgroundColor || Colors.white,
                            }]}
                    >
                            <View style={[{ flexDirection: this._switchDirection(this.props.switchdirection || this.state.direction) }]} >

                                <Animated.View style={{ transform: [{translateX: this.state.offsetX }] }}>
                                    <View
                                        style={[styles.wayBtnActive,
                                                {
                                                    width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                                                    height: this.props.switchHeight - 8 || this.state.sbHeight - 8,
                                                    borderRadius: this.props.switchBorderRadius !== undefined ? this.props.switchBorderRadius : this.state.sbHeight / 2,
                                                    borderColor: this.props.btnBorderColor || "#00a4b9",
                                                    backgroundColor: this.props.btnBackgroundColor || "#00bcd4"
                                                }]}
                                    />
                                </Animated.View>

                                <View style={[styles.textPos,
                                                {
                                                    width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                                                    height: this.props.switchHeight - 6 || this.state.sbHeight - 6,
                                                    left: 0
                                                }]}
                                >
                                    <Text maxFontSizeMultiplier={1.7} numberOfLines={this.props.numberOfLines} style={[ styles.text, this.state.activeSwitch === 1 ? { color: this.props.activeFontColor || "#fff" } : { color: this.props.fontColor || "#b1b1b1" }  ]}>
                                        { this.props.text1 || 'ON' }
                                    </Text>
                                </View>

                                <View
                                    style={[styles.textPos,
                                            {
                                                width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                                                height: this.props.switchHeight - 6 || this.state.sbHeight - 6,
                                                right:0
                                            }]}
                                >
                                    <Text maxFontSizeMultiplier={1.7} style={[ styles.text, this.state.activeSwitch === 2 ? { color: this.props.activeFontColor || "#fff" } : { color: this.props.fontColor || "#b1b1b1" }  ]}>
                                    { this.props.text2 || 'OFF' }
                                    </Text>
                                </View>
                            </View>

                    </View>
                </TouchableOpacity>
                { this.props.children }
            </>

        );
    }

}
