import React from 'react';
import {View,Text,Platform} from 'react-native';
import {Styles} from './styles';
const isAndroid=Platform.OS=='android';
/**
 * Header and Footer.
 *
 * @visibleName  Header footer component for slider
 */
class HeaderFooter extends React.PureComponent{
    render(){
        return(
            <View style={{width:Styles.screenWidth/2}}/>
        )
    }
}
/**
 * Position indicator Component.
 *
 * @visibleName  Marker
 */
class Marker extends React.PureComponent{
    render(){
        const {markerHeight,circle}=this.props;
        return (
            <View style={[Styles.markerCont,isAndroid?{left:'50%'}:{},{height:markerHeight}]}>
                <View style={[Styles.circle,circle]}></View>
            </View>
        )
    }
}
/**
 * Component for Seprator between each bars.
 *
 * @visibleName  Seprator Component
 */
class ItemSeparator extends React.PureComponent{
    render(){
        const {sepratorWidth}=this.props;
        return(
            <View style={{width:sepratorWidth}}></View>
        )
    }
}
/**
 * Item of scrollbar slider.
 *
 * @visibleName  Bar JSX
 */
class ScrollBarItem extends React.PureComponent{
    render(){
        const {
            fullBarHeight,
            barMainHeight,
            miniBarHeight,
            fullBarwidth,
            miniBarwidth,
            totalBars,
            sepratorWidth,
            item,
            index,
            handleOnLayout,
            numberColor
        }=this.props;
        const isLastItem=!(index<totalBars-1)    
        if(item.isFullBar){
            return(
                <View>
                    <View onLayout={(event)=>{handleOnLayout(event,item,index)}} style={[Styles.barMain,{height:barMainHeight}]}>
                        <View style={[Styles.fullBar,{height:fullBarHeight,width:fullBarwidth,backgroundColor:numberColor}]}/>
                        <View style={[Styles.textCont,isLastItem?{width:sepratorWidth*2}:{right:`${(sepratorWidth/4)-10}%`,width:sepratorWidth*2}]}>
                            <Text adjustsFontSizeToFit={true} minimumFontScale={0.6} maxFontSizeMultiplier={1.7} style={[Styles.text , numberColor &&{color:numberColor}]}>{item.value}</Text>
                        </View>
                    </View>
                    {!isLastItem?<ItemSeparator sepratorWidth={sepratorWidth} />:null}
                </View>
            )
        }else{
            return (
                <View >
                    <View onLayout={(event)=>{handleOnLayout(event,item,index)}} style={[Styles.barMain,{height:barMainHeight,width:miniBarwidth}]}>
                        <View style={[Styles.miniBar,{height:miniBarHeight,backgroundColor:numberColor}]}/>
                    </View>
                    {!isLastItem?<ItemSeparator sepratorWidth={sepratorWidth} />:null}
                </View>
            )
        }
    }
}
/**
 * Item of flatlist slider.
 *
 * @visibleName  Bar JSX
 */
class FlatListItem extends React.Component{
    // shouldComponentUpdate(){
    //     return false;
    // }
    render(){
        const {
            barMainHeight,
            fullBarHeight,
            fullBarwidth,
            miniBarHeight,
            miniBarwidth,
            item,
            sepratorWidth,
            numberColor
        }=this.props;
        if(item.isFullBar){
            return(
                <View style={[Styles.barMain,{height:barMainHeight}]}>
                    <View style={[Styles.fullBar,{height:fullBarHeight,width:fullBarwidth,backgroundColor:numberColor}]}/>
                    <View style={[Styles.textCont,{width:sepratorWidth*((item.value+'').length>3?2.5:2)}]}>
                        <Text adjustsFontSizeToFit={true} minimumFontScale={0.6}  maxFontSizeMultiplier={1.7} style={[Styles.text,numberColor &&{color:numberColor}]}>{item.value}</Text>
                    </View>
                </View>
            )
        }else{
            return (
                <View  style={[Styles.barMain,{height:barMainHeight,width:miniBarwidth}]}>
                    <View style={[Styles.miniBar,{height:miniBarHeight,backgroundColor:numberColor}]}/>
                </View>
            )
        }
    }
}
export {
    HeaderFooter,
    Marker,
    ItemSeparator,
    ScrollBarItem,
    FlatListItem
};