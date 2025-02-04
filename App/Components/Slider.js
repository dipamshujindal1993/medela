
import React, {Component, createRef} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';
import Indicator from '@components/SliderIndicator';
import ChildItem from '@components/SliderChild';
import { Colors } from '@resources'

import styles from './Styles/SliderStyles'

export default class Slider extends Component {
  slider = createRef();

  static defaultProps = {
    data: [],
    imageKey: 'image',
    local: false,
    localSVG: false,
    width: Math.round(Dimensions.get('window').width),
    height: 30,
    separatorWidth: 0,
    loop: true,
    indicator: true,
    indicatorStyle: {},
    indicatorContainerStyle: {},
    indicatorActiveColor: Colors.rgb_3498db,
    indicatorInActiveColor: Colors.rgb_bdc3c7,
    indicatorActiveWidth: 6,
    animation: true,
    autoscroll: true,
    timer: 4000,
    onPress: {},
    contentContainerStyle: {},
    component: <ChildItem/>,
  };

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      data: this.props.data,
      textColor: this.props.textColor
    };
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    if (this.props.autoscroll) {
      this.startAutoPlay();
    }
  }

  componentWillUnmount() {
    if (this.props.autoscroll) {
      this.stopAutoPlay();
    }
  }

  render() {
    const itemWidth = this.props.width;
    const separatorWidth = this.props.separatorWidth;
    const totalItemWidth = itemWidth + separatorWidth;

    return (
      <View style={styles.container}>
        <FlatList
          ref={this.slider}
          horizontal
          pagingEnabled={true}
          snapToInterval={totalItemWidth}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={this.props.contentContainerStyle}
          data={this.state.data}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) =>
            React.cloneElement(this.props.component, {
              style: {width: this.props.width},
              item: item,
              imageKey: this.props.imageKey,
              onPress: this.props.onPress,
              index: this.state.index % this.props.data.length,
              active: index === this.state.index,
              local: this.props.local,
              localSVG: this.props.localSVG,
              height: this.props.height,
              textColor: this.state.textColor
            })
          }
          ItemSeparatorComponent={() => (
            <View style={{width: this.props.separatorWidth}} />
          )}
          keyExtractor={(item, index) => item.toString() + index}
          onViewableItemsChanged={this.onViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: totalItemWidth,
            offset: totalItemWidth * index,
            index,
          })}
          windowSize={1}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          removeClippedSubviews={true}
        />
        {this.props.indicator && (
          <Indicator
            itemCount={this.props.data.length}
            currentIndex={this.state.index % this.props.data.length}
            indicatorStyle={this.props.indicatorStyle}
            indicatorContainerStyle={[
              styles.indicatorContainerStyle,
              this.props.indicatorContainerStyle,
            ]}
            indicatorActiveColor={this.props.indicatorActiveColor}
            indicatorInActiveColor={this.props.indicatorInActiveColor}
            indicatorActiveWidth={this.props.indicatorActiveWidth}
            style={{...styles.indicator, ...this.props.indicatorStyle}}
          />
        )}
      </View>
    );
  };

  onViewableItemsChanged = ({viewableItems, changed}) => {
    if (viewableItems.length > 0) {
      let currentIndex = viewableItems[0].index;
      if (
        currentIndex % this.props.data.length === this.props.data.length - 1 &&
        this.props.loop
      ) {
        this.setState({
          index: currentIndex,
          data: [...this.state.data, ...this.props.data],
        });
      } else {
        this.setState({index: currentIndex});
      }

      if (this.props.currentIndexCallback) {
        this.props.currentIndexCallback(currentIndex);
      }
    }
  };

  viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 50,
  };

  changeSliderListIndex = () => {
    if (this.props.animation) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeIn);
    }
    let {data,index}=this.state
    if (data.length -1 > index) {
       this.setState({index: this.state.index + 1});
     }
     this.slider.current.scrollToIndex({
      index: this.state.index,
      animated: true,
    });
  };

  startAutoPlay = () => {
    this.sliderTimer = setInterval(
      this.changeSliderListIndex,
      this.props.timer,
    );
  };

  stopAutoPlay = () => {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
      this.sliderTimer = null;
    }
  };
}