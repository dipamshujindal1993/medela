import React from 'react';
import PropTypes from 'prop-types'
import { Platform } from 'react-native';
const Slider=Platform.OS=='android'?require('./ScrollViewSlider').ScrollViewSlider:require('./FlatListSlider').FlatListSlider;
/**
 * The only true Slider.
 *
 * @visibleName  Slider with bars
 */
class CustomSlider extends React.PureComponent{
    static propTypes={
        multiplicity:PropTypes.number,
        maxValue:PropTypes.number,
        range:PropTypes.number,
        value:PropTypes.number,
        sliderHeight:PropTypes.number,
        onScroll:PropTypes.func,
        isLoadingComplete:PropTypes.func,
        accuracy:PropTypes.bool,
        //onMomentumScrollEnd:PropTypes.func,
        //onMomentumScrollBegin:PropTypes.func,
        onScrollEnd:PropTypes.func,
        onScrollBeginDrag:PropTypes.func,
        decimalPlaces:PropTypes.number,
        scrollEnabled:PropTypes.bool,
        sliderStyle:PropTypes.object,
        restrictPoint:PropTypes.number
    }
    static defaultProps = {
        multiplicity: 1,
        maxValue:100,
        sliderHeight:160,
        value:0,
        range:1,
        onScroll:()=>{},
        isLoadingComplete:()=>{},
        accuracy:false,
        //onMomentumScrollEnd:()=>{},
        //onMomentumScrollBegin:()=>{},
        onScrollEnd:()=>{},
        onScrollBeginDrag:()=>{},
        decimalPlaces:2,
        scrollEnabled:true,
        sliderStyle:null,
        restrictPoint:undefined
    }
    render(){
        return <Slider {...this.props}/>        
    }

}
 
export default CustomSlider;