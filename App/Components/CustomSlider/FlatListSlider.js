import React from 'react';
import {FlatList,View,Platform} from 'react-native';
import {Styles} from './styles';
import LoadingSpinner from '@components/LoadingSpinner';
import { Marker,ItemSeparator,HeaderFooter,FlatListItem } from './Components';
/**
 * The only true Slider with FlatList.
 *
 * @visibleName  Slider with bars using FlatList
 */
class FlatListSlider extends React.Component{
    constructor(props){
        super(props);
        this.state={
            bars:this.configTotalBars(),
            isLoading:true
        }
        this.scrollStarts=false;
        this.timeout=[];
        this.scrollEventThrottle=16;
    }
    shouldComponentUpdate(nextProps, nextState){
        const {value}=this.props;
        const {isLoading}=this.state;
        if(nextProps.value!==value||nextState.isLoading!==isLoading){
            return true;
        }else{
            return false;
        }
    }
    componentDidMount(){
        const {value,isLoadingComplete,accuracy}=this.props;
        if(value!=undefined&&value!=0){
            let accurateOffset=0;
            let offset=this.calculateOffsetByValue(value);
            if(accuracy){
                accurateOffset=this.calculateAccurateOffset(value,offset);
            }
            this.setValueInSlider(offset+accurateOffset);
            this.setState({isLoading:false});
            isLoadingComplete(true);
        }else{
            isLoadingComplete(true);
            this.setState({isLoading:false});
        }
        
    }
    componentDidUpdate(prevProps,prevState){
        const {value,accuracy}=this.props;
        if(value!=prevProps.value){
            //console.log('update success called');
            let accurateOffset=0;
            let offset=this.calculateOffsetByValue(value);
            if(accuracy){
                accurateOffset=this.calculateAccurateOffset(value,offset);
            }
            this.setValueInSlider(offset+accurateOffset,false,true);
        }
    }
    componentWillUnmount(){

    }
    /**
     * 
     * @param {=offset - pass the offset and it will scroll the slider upto that offset}  
     * @param {=withTimeOut -  whther a delay should be applied or not while scrolling default is false}  
     * @param {=animated -  slide with animation or not default is false}  
     */
    setValueInSlider=(offset,withTimeOut=false,animated=false)=>{
        const {maxValue}=this.props;
        setTimeout(()=>{
            this.flatlist.scrollToOffset({
                offset,
                animated
            })
        },withTimeOut?100:0)
    }
    /**
     * 
     * @param {=calculateOffsetUpto - pass the value of slider and it will count the offset upto that value }  
     * @returns 
     */
    calculateOffsetByValue=(calculateOffsetUpto)=>{
        const {sepratorWidth,fullBarwidth,miniBarwidth}=this.getAllOtherHeights();
        const {bars}=this.state;
        const {decimalPlaces}=this.props;
        let offset=0;
        for(let index=1;index<bars.length;index++){
            let item=bars[index];
            if(item.value<=calculateOffsetUpto){
                let temp=item.isFullBar?(fullBarwidth+sepratorWidth).toFixed(decimalPlaces):(miniBarwidth+sepratorWidth).toFixed(decimalPlaces)
                offset+=parseFloat(temp);
            }else{
                break;
            }
        }
        return offset;
    }
    /**
     * 
     * @param {*} value value for which it will calculate the exact offset
     * @param {*} offset nearest floor offset
     * @returns will return extra offset
     */
    calculateAccurateOffset=(value,offset)=>{
        const {multiplicity}=this.props;
        const {sepratorWidth}=this.getAllOtherHeights();
        let itemValue=this.calculateValueByOffset(offset);
        let diffrenceInValue=value-itemValue;
        //console.log(value,offset,itemValue,diffrenceInValue);
        //console.log((diffrenceInValue * sepratorWidth)/multiplicity)
        return (diffrenceInValue * sepratorWidth)/multiplicity;
    }
    /**
     * 
     * @param {=offset - pass the offset and get value of slider}  
     */
    calculateValueByOffset=(offset=0)=>{
        const {bars}=this.state;
        let value=0;
        for(let index=0;index<bars.length;index++){
            let currentItem=bars[index];
            let nextItem=bars[index+1];
            if(nextItem!=undefined){
                let offsetForCurrentValue=this.calculateOffsetByValue(currentItem.value);
                let offsetForNextValue=this.calculateOffsetByValue(nextItem.value);
                if((offsetForCurrentValue<offset)&&(offsetForNextValue>offset)){
                    value=currentItem.value;
                    break;
                }else if(offsetForCurrentValue==offset){
                    value=currentItem.value;
                    break;
                }else if(offsetForNextValue==offset){
                    value=nextItem.value;
                    break;
                }
            }else{
                value=offset>0?currentItem.value:0;
                break;
            }

        }
        return value;
    }
    /**
     * 
     * @param {*} value nearest floor value 
     * @param {*} offset offset for which it will calculate the exact value
     * @returns will return extra value
     */
    calculateAccurateValue=(value,offset)=>{
        const {multiplicity,maxValue,decimalPlaces}=this.props;
        const {sepratorWidth}=this.getAllOtherHeights();
        const isLast= value==maxValue;
        const isSecondLast=value==(parseFloat((maxValue-multiplicity)))
        let itemOffset=this.calculateOffsetByValue(value);
        let diffrenceInOffset=offset - itemOffset;
        if(isLast) return 0;
         //if(isSecondLast){
            if(diffrenceInOffset>sepratorWidth){
                return  multiplicity
            }
            else{
                return parseFloat(((diffrenceInOffset/sepratorWidth)*multiplicity).toFixed(decimalPlaces));
            }
        //}
        //return parseFloat(((diffrenceInOffset/sepratorWidth)*multiplicity).toFixed(decimalPlaces));
    }
    /**
     * Scroll handling
     */
    handleOnScroll=({nativeEvent})=>{
        const {x}=nativeEvent.contentOffset;
        const {onScroll,accuracy,decimalPlaces,restrictPoint,multiplicity}=this.props;
        
        //if(x<3539.5){
            let value=this.calculateValueByOffset(x);
            let accurateValue=0;
            if(accuracy){
                accurateValue=this.calculateAccurateValue(value,x);
            }
            //console.log(x,value,accurateValue,value+accurateValue)
            let val=parseFloat((value+accurateValue).toFixed(decimalPlaces));
            if(restrictPoint!=undefined&&restrictPoint!=0&&val>restrictPoint){
                onScroll(restrictPoint);
                let OffsetForRestrictionPoint=this.calculateOffsetByValue(restrictPoint);
                let accurateOffsetForRestrictionPoint=0;
                if(accuracy){
                    let nextNumber=this.findNextPossibleValue(restrictPoint);
                    if(parseInt(nextNumber/multiplicity)===nextNumber/multiplicity){
                        nextNumber=restrictPoint;
                    }
                    accurateOffsetForRestrictionPoint=this.calculateAccurateOffset(restrictPoint,this.calculateOffsetByValue(nextNumber))
                }
                let offsetForRestriction=parseFloat((OffsetForRestrictionPoint+accurateOffsetForRestrictionPoint).toFixed(decimalPlaces));
                //console.log(accurateOffsetForRestrictionPoint)
                //console.log(this.findNextPossibleValue(restrictPoint),this.calculateOffsetByValue(this.findNextPossibleValue(restrictPoint)))
                //console.log(OffsetForRestrictionPoint,accurateOffsetForRestrictionPoint,offsetForRestriction,val,x,'restriction',Platform.OS);
                this.setValueInSlider(offsetForRestriction);
                //this.setValueInSlider()
            }else{
                //console.log(val,'without restriction',Platform.OS);
                onScroll(val);
            }
            this.handleScrollEnd(); 
        // }else{
        //     onScroll(restrictPoint)
        //     this.setValueInSlider(3539.5,false,false)
        // }
        // if(restrictPoint!=undefined&&restrictPoint!=0&&val>restrictPoint){
        //     let accurateOffset=0;
        //     let off=this.calculateOffsetByValue(val);
        //     if(accuracy){
        //         accurateOffset=this.calculateAccurateOffset(val,x);
        //     }
        //     let offset=parseFloat((off+accurateOffset).toFixed(decimalPlaces));
        //     let OffsetForRestrictionPoint=this.calculateOffsetByValue(restrictPoint);
        //     let accurateOffsetForRestrictionPoint=0;
        //     if(accuracy){
        //         accurateOffsetForRestrictionPoint=this.calculateAccurateOffset(restrictPoint,this.calculateOffsetByValue(this.findNextPossibleValue(restrictPoint)))
        //     }
        //     let offsetForRestriction=parseFloat((OffsetForRestrictionPoint+accurateOffsetForRestrictionPoint).toFixed(decimalPlaces));
        //     this.setValueInSlider(offsetForRestriction);
        // }
    }
    /**
     * 
     * @param {*} prevValue pass the previous value
     * @returns it will return the next possible value in slider
     */
    findNextPossibleValue=(prevValue)=>{
        const {decimalPlaces}=this.props;
        if(decimalPlaces==0){
            return prevValue+1
        }else{
            let deciamlValue=(prevValue+'').split('.')[1];
            let nextDecimalValue=parseInt(deciamlValue)+1;
            return parseFloat((prevValue+'').split('.')[0]+'.'+nextDecimalValue)
        }
    }
    /**
     * will handle onScrollEnd
     */
    handleScrollEnd=()=>{
        const {onScrollEnd}=this.props;
        if(this.scrollStarts==true){
            this.timeout.push(setTimeout(()=>{
                this.timeout.pop();
                if(this.timeout.length==0){
                    setTimeout(()=>{
                        if(this.timeout.length==0){
                            onScrollEnd();
                            this.scrollStarts=false;
                        }    
                    },this.scrollEventThrottle)
                }
            },this.scrollEventThrottle))
        }
    }
    /**
     * will call when slider onScrollBeginDrag gets triggered
     */
    handleOnScrollBeginDrag=()=>{
        const {onScrollBeginDrag}=this.props;
        this.scrollStarts=true;
        onScrollBeginDrag();
    }
    // /**
    //  * will call when slider OnMomentumScrollEnd gets triggered
    //  */
    // handleOnMomentumScrollEnd=()=>{
    //     const {onMomentumScrollEnd}=this.props;
    //     onMomentumScrollEnd()
    // }
    // /**
    //  * will call when slider OnMomentumScrollBegin gets triggered
    //  */
    // handleOnMomentumScrollBegin=()=>{
    //     const {onMomentumScrollBegin}=this.props;
    //     onMomentumScrollBegin();
    // }
    /**
     * 
     * @returns it will return the initial total bars 
     */
    configTotalBars(){
        const {multiplicity,range,decimalPlaces}=this.props;
        const {totalBars}=this.getAllOtherHeights();
        return new Array(totalBars).fill().map((v,index)=>{
            let val=(index*multiplicity).toFixed(decimalPlaces);
            return {
                value:parseFloat(val),
                isFullBar:parseFloat(val)%range==0
            };
        })
    }
    /**
     * 
     * @returns it will return all the dynamic heights of the slider based on prop slierHeight
     */
    getAllOtherHeights(){
        let {sliderHeight,multiplicity,maxValue}=this.props;
        return {
            fullBarHeight:sliderHeight/2,
            fullBarwidth:3,
            miniBarwidth:1,
            //miniBarHeight:(sliderHeight * 37.5) / 100,
            miniBarHeight:sliderHeight/4,
            barMainHeight:sliderHeight * (3/4),
            markerHeight:(sliderHeight /2),
            circle:{height:sliderHeight/10,width:sliderHeight/10,borderRadius:sliderHeight/4,top:sliderHeight/5},
            sepratorWidth:sliderHeight/10,
            totalBars:parseInt(((1/multiplicity)*maxValue) + 1)
        }
    }
    render(){
        const {bars,isLoading,maxScrollPosition} =this.state;
        const {scrollEnabled,sliderStyle}=this.props;
        const {
            sepratorWidth,
            totalBars,
            miniBarwidth,
            fullBarwidth,
            markerHeight,
            circle,
            fullBarHeight,
            barMainHeight,
            miniBarHeight
        }=this.getAllOtherHeights();
        return(
            <View style={[Styles.parentCont]}>
                {isLoading?<LoadingSpinner/>:null}
                <Marker markerHeight={markerHeight} circle={circle} />
                <FlatList
                    ref={(ref) => { this.flatlist = ref; }}
                    //legacyImplementation={true}
                    style={sliderStyle}
                    ListHeaderComponent={()=>{return <HeaderFooter/>}}
                    ItemSeparatorComponent={()=>{return <ItemSeparator sepratorWidth={sepratorWidth}/>}}
                    data={bars}
                    scrollEnabled={scrollEnabled}
                    bounces={false}
                    horizontal={true}
                    //scrollIndicatorInsets={{top:0,bottom:0,left:100,right:500}}
                    // snapToOffsets={[3000]}
                    // snapToStart={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={Styles.list}
                    //removeClippedSubviews={true}
                    renderItem={({item,index})=>{
                        // if(index==totalBars-1){
                        //     console.log('initial renderin in flatList',item)
                        // }
                        return (
                            <FlatListItem
                                fullBarHeight={fullBarHeight}
                                barMainHeight={barMainHeight}
                                miniBarHeight={miniBarHeight}
                                fullBarwidth={fullBarwidth}
                                miniBarwidth={miniBarwidth}
                                item={item}
                                sepratorWidth={sepratorWidth}
                                numberColor={this.props.numberColor}
                                // isRenderingComplete={(val)=>{
                                //     console.log('initial renderin in flatList',val)
                                // }}
                                //totalBars={totalBars}
                            />
                        )
                    }}
                    onScrollBeginDrag={this.handleOnScrollBeginDrag}
                    initialNumToRender={totalBars}
                    maxToRenderPerBatch={totalBars}
                    //updateCellsBatchingPeriod={50}
                    getItemLayout={(data, index) => {
                        let fullbar=data[index].isFullBar;
                        let height=fullbar?(fullBarwidth+sepratorWidth):(miniBarwidth+sepratorWidth);
                        return {length:fullbar?fullBarwidth:miniBarwidth, offset: height * index, index}
                    }}
                    onScroll={this.handleOnScroll}
                    scrollEventThrottle={this.scrollEventThrottle}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={()=>{return <HeaderFooter/>}}
                />
            </View>
        )
    }
}
 
export {FlatListSlider};