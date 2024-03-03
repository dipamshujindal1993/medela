import React from 'react';
import {View,ScrollView,I18nManager,Platform} from 'react-native';
import {Styles} from './styles';
import LoadingSpinner from '@components/LoadingSpinner';
import {Marker,HeaderFooter,ScrollBarItem} from './Components';
const isRTL=I18nManager.isRTL;
/**
 * The only true Slider with ScrollView.
 *
 * @visibleName  Slider with bars using ScrollView
 */
class ScrollViewSlider extends React.Component{
    constructor(props){
        super(props);
        const {value}=this.props;
        this.state={
            bars:this.configTotalBars(),
            //isLoading:value!=undefined&&value!=0,
            isLoading:true
        }
        this.barsOffset=[]
        this.firstItemOffset=0;
        this.lastItem;
        this.offsetCounter=0;
        this.scrollStarts=false;
        this.timeout=[];
        this.scrollEventThrottle=16;
        //console.log('constructor called');
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
        //console.log('componentDidMount called');
    }
    componentDidUpdate(prevProps,prevState){
        const {value,accuracy}=this.props;
        //const {isLoading}=this.state;
        if(value!==prevProps.value){
            let accurateOffset=0;
            let offset=this.calculateOffsetByValue(value);
            if(accuracy){
                accurateOffset=this.calculateAccurateOffset(value,offset);
            }
            //console.log('update called',offset+accurateOffset);
            this.setValueInSlider(offset+accurateOffset);
        }
    }
    componentWillUnmount(){
    }
    /**
     * will get call when slider gets rendered completely;
     */
    initConfigDone(){
        const {value,isLoadingComplete,accuracy}=this.props;
        if(value!=undefined&&value!=0){
            let accurateOffset=0;
            let offset=this.calculateOffsetByValue(value);
            if(accuracy){
                accurateOffset=this.calculateAccurateOffset(value,offset);
            }
            //console.log('initConfig',offset+accurateOffset)
            this.setValueInSlider(offset+accurateOffset);
            isLoadingComplete(true);
            this.setState({isLoading:false});
        }else{
            isLoadingComplete(true);
            this.setState({isLoading:false});
        }
    }
    /**
     * 
     * @param {*} x pass the x offset at which slider will scroll
     * @param {*} withTimeOut pass  boolean to whether to delay or not in setting the value 
     */
    setValueInSlider=(x,withTimeOut=false)=>{
        //console.log('setValueInSlider',x)
        setTimeout(()=>{
            this.scrollView && this.scrollView != null && this.scrollView.scrollTo({
                x,
                animated:false
            })
        },withTimeOut?100:0)
    }
    /**
     * 
     * @param {*} value pass the value for which value you want to calculate the offset
     * @returns it will return the offset for the received value
     */
    calculateOffsetByValue=(value=0)=>{
         const {barsOffset}=this;
        let offset=0;
        for(let index=0;index<barsOffset.length;index++){
            let currentItem=barsOffset[index];
            let nextItem=barsOffset[index+1];
            if(nextItem!=undefined){
                if((value>=currentItem.value)&&(value<nextItem.value)){
                    offset=currentItem.offset;
                    break;
                }
            }else{
                offset=currentItem.offset;
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
        return ((diffrenceInValue * sepratorWidth)/multiplicity)*(isRTL?-1:1);
    }
    /**
     * 
     * @param {=offset - pass the offset and get value of slider}  
     * @returns will return value for the recived offset
     */
    calculateValueByOffset=(offset=0)=>{
        const {barsOffset}=this;
        const {restrictPoint}=this.props;
        let value=0;
        for(let index=0;index<barsOffset.length;index++){
            let currentItem=barsOffset[index];
            let nextItem=barsOffset[index+1];
            if(nextItem!=undefined){
                if(!isRTL){
                    if((offset>currentItem.offset)&&(offset<nextItem.offset)){
                        value=currentItem.value;
                        break; 
                    }else if (currentItem.offset==offset){
                        value=currentItem.value;
                        break;
                    }else if(nextItem.offset==offset){
                        value=nextItem.value;
                        break;
                    }
                }else if (isRTL){
                    // if(restrictPoint==undefined||restrictPoint==0){
                    //     if((offset<=currentItem.offset)&&(offset>nextItem.offset)){
                    //         value=currentItem.value;
                    //         //console.log(value);
                    //         break;
                    //     }
                    // }else{
                    //     if(offset>=barsOffset[0].offset||(offset*-1==offset)){
                    //         value=0;
                    //         break;
                    //     }
                    // }
                    if((offset<=currentItem.offset)&&(offset>nextItem.offset)){
                        value=currentItem.value;
                        //console.log(value);
                        break;
                    }
                    //else if(restrictPoint!=undefined&&restrictPoint!=0){
                        else if(offset>=barsOffset[0].offset){
                            value=0;
                            break;
                        }
                        else if(restrictPoint!=undefined&&restrictPoint!=0){
                            if(offset*-1==offset){
                                value=0;
                                break;
                            }
                        }
                    //}
                }
            }else{
                value=currentItem.value;
                //console.log(currentItem,nextItem,value)
                break;
            }

        }
        //console.log(value,offset)
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
        //console.log(isLast,value,maxValue)
        const isSecondLast=value==(parseFloat((maxValue-multiplicity)))
        let itemOffset=this.calculateOffsetByValue(value);
        let diffrenceInOffset=offset - itemOffset;
        if(isLast) return 0;
         if(isSecondLast){
            if(isRTL){
                if((diffrenceInOffset*-1)>sepratorWidth){
                    return multiplicity;
                }
            }else{
                if(diffrenceInOffset>sepratorWidth){
                    return multiplicity;
                }
            }
        }
        return parseFloat(((((diffrenceInOffset/sepratorWidth)*multiplicity))*(isRTL?-1:1)).toFixed(decimalPlaces));
    }
    /**
     * 
     * @param {*} event will trigger when scrollbar onScroll gets called
     */
    handleOnScroll=({nativeEvent})=>{
        const {x}=nativeEvent.contentOffset;
        const {onScroll,accuracy,decimalPlaces,restrictPoint,multiplicity}=this.props;
        const {isLoading}=this.state;
        if(!isLoading){
            let accurateValue=0;
            let value=this.calculateValueByOffset(x);
            if(accuracy){
                accurateValue=this.calculateAccurateValue(value,x);
            }
            //console.log(x,value,accurateValue,value+accurateValue)
            //console.log('handleOnScroll called ',value,value+accurateValue,Platform.OS);
            let val=parseFloat((value+accurateValue).toFixed(decimalPlaces));
            //console.log(x,val)
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
                //console.log(restrictPoint,OffsetForRestrictionPoint,accurateOffsetForRestrictionPoint,offsetForRestriction,'restriction',Platform.OS);
                this.setValueInSlider(offsetForRestriction);
                //this.setValueInSlider()
            }else{
                //console.log(val,'without restriction',Platform.OS);
                onScroll(val);
            }
            this.handleScrollEnd(); 
            //onScroll(val>restrictPoint?restrictPoint:val)
            //this.handleScrollEnd();
        }
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
     * will call when slider onScrollBeginDrag gets triggered
     */
    handleOnScrollBeginDrag=()=>{
        const {onScrollBeginDrag}=this.props;
        //console.log('begin drag')
        this.scrollStarts=true;
        onScrollBeginDrag();
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
     * Save offset for every item while rendering
     */
    handleOnLayout=async(event,item,index)=>{
        const {bars}=this.state;
        const {maxValue,multiplicity,decimalPlaces}=this.props;
        const {totalBars,sepratorWidth,fullBarwidth}=this.getAllOtherHeights();
       await event.target.measure(
            (x, y, width, height, pageX, pageY) => {
                if(isRTL){
                    let initialBarValue=bars.find(v=>v.value==parseFloat((maxValue-item.value).toFixed(decimalPlaces)));
                    const isLast=initialBarValue.value==maxValue;
                    const isFirst=initialBarValue.value==0;
                    if(isLast){
                        this.lastItem=initialBarValue;
                    }
                    const secondLast=initialBarValue.value==(maxValue-multiplicity);
                    if(initialBarValue!=undefined){
                        let etxtraOffset=(secondLast&&this.lastItem.isFullBar)?3:(secondLast&&!this.lastItem.isFullBar)?1:0;
                        if(!isLast){
                            this.offsetCounter+=etxtraOffset+sepratorWidth;
                        }
                        this.barsOffset.unshift({
                            ...initialBarValue,
                            offset:isLast?0:this.offsetCounter
                        })
                    }else{
                        console.log('initialBarValue undefined',item);
                    }
                    if(isFirst){
                        this.offsetCounter=0;
                        this.lastItem=undefined;
                    }
                }else{
                    if(item.value==0){
                        this.barsOffset.push({...item,offset:0})
                        this.firstItemOffset=parseFloat((x+ pageX).toFixed(decimalPlaces))  
                    }else{
                        this.barsOffset.push({...item,offset:parseFloat((((x+ pageX)) - this.firstItemOffset).toFixed(decimalPlaces))})
                    }
                }
                // will called when last item measurement gets done
                if(!(index<totalBars-1)){
                    this.initConfigDone();
                }
            },
          );
    }
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
        const {bars,isLoading} =this.state;
        const {scrollEnabled,sliderStyle}=this.props;
        const {
            sepratorWidth,
            totalBars,
            miniBarwidth,
            miniBarHeight,
            fullBarwidth,
            fullBarHeight,
            markerHeight,
            circle,
            barMainHeight
        }=this.getAllOtherHeights();
        return(
            <View style={[Styles.parentCont]}>
                {isLoading?<LoadingSpinner/>:null}
                <Marker markerHeight={markerHeight} circle={circle}  />
                <ScrollView
                    ref={(ref) => { this.scrollView = ref; }}
                    horizontal={true}
                    bounces={false}
                    style={sliderStyle}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={Styles.list}
                    onScroll={this.handleOnScroll}
                    onScrollBeginDrag={this.handleOnScrollBeginDrag}
                    scrollEnabled={!isLoading&&scrollEnabled}
                    scrollEventThrottle={this.scrollEventThrottle}
                >
                    <HeaderFooter />
                    {bars.map((item,index)=>{
                        return (
                            <ScrollBarItem
                                key={index+''}
                                barMainHeight={barMainHeight}
                                fullBarHeight={fullBarHeight}
                                fullBarwidth={fullBarwidth}
                                miniBarHeight={miniBarHeight}
                                miniBarwidth={miniBarwidth}
                                totalBars={totalBars}
                                sepratorWidth={sepratorWidth}
                                handleOnLayout={this.handleOnLayout}
                                item={item}
                                index={index}
                                numberColor={this.props.numberColor}
                            />
                        )
                    })}
                    <HeaderFooter />
                </ScrollView>
            </View>
        )
    }
}
 
export {ScrollViewSlider};