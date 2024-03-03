import React from 'react';
import {Text, View, SafeAreaView, ScrollView, Platform, BackHandler} from 'react-native';
import Button from '@components/Button';
import {connect} from 'react-redux';
import CustomTextInput from '@components/CustomTextInput';
import CustomVolumeSlider from '@components/CustomVolumeSlider';
import HeaderTitle from '@components/HeaderTitle';
import I18n from '@i18n';
import Colors from '@resources/Colors';
import moment from 'moment';
import styles from '@containers/Styles/GrowthScreenStyles';
import AsyncStorage from '@react-native-community/async-storage';
import KeyUtils from "@utils/KeyUtils";
import {getHeightUnits,getHeightMaxvalue, getWeightUnits, getWeightMaxvalue, weightConversionHandler, heightConversionHandler } from '@utils/locale';
class CustomMeasurementsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue:this.props.value && this.props.value != null && this.props.value.quantity && this.props.value.quantity != null ? (isNaN(parseInt(this.props.value.quantity)) ? 0: parseInt(this.props.value.quantity)) : 0,
      heightByInput: 0,
      unit:'',
      maxHeightValue:0,
      volumeRight: 8,
      isFocus:false
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected 
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    // unit=getHeightUnits()
  }
  componentDidMount() {
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    if(this.props.measurement === 'Height') {
      Promise.all([getHeightUnits(),getHeightMaxvalue()]).then((values) => {
        this.setState({unit:values[0],maxHeightValue:values[1]})
      });
    } else {
      Promise.all([getWeightUnits(),getWeightMaxvalue()]).then((values) => {
        this.setState({unit:values[0],maxHeightValue:values[1]})
      });
    }
    AsyncStorage.getItem(KeyUtils.UNITS).then((_units) => {
      if (_units != null) {
        this.setState({isImperial: _units === KeyUtils.UNIT_IMPERIAL}, () => {
          const {value} = this.props
          if(this.props.measurement === 'Height'){
            const { convertedHeight } = heightConversionHandler(this.state.isImperial, this.state.unit, value)
            this.setState({heightByInput: convertedHeight, sliderValue: convertedHeight});
          }else {
            const { convertedWeight } = weightConversionHandler(this.state.isImperial, this.state.unit, value)
            this.setState({heightByInput: convertedWeight, sliderValue: convertedWeight});
          }
        });
      }
    });
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  onAndroidBackPress = () => {
    return true;
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  handleChangeValue = (value) => {
    this.setState({
      sliderValue: value,
      heightByInput: value
    });
  };

  onChangeTextValue =(value)=>{
    const {maxHeightValue}=this.state
    if(this.props.measurement === 'Height') {
      value>maxHeightValue && (alert(`Maximum limit exceeded i.e ${maxHeightValue}`))
      let temp=(isNaN(parseFloat(value)) ? 0: parseFloat(value));
      this.setState({
        heightByInput: (isNaN(parseFloat(value)) ? 0: parseFloat(value)),
        ...temp==0&&value==0 && {sliderValue:0}
      })
    } else {
      if(this.state.unit == KeyUtils.UNIT_KG){
        var modifiedValue = parseFloat(value.replace(/,/g, '.'));
        modifiedValue>maxHeightValue && (alert(`${I18n.t('generic.maximum_limit')} ${maxHeightValue}`))
        let temp=isNaN(modifiedValue)?0:modifiedValue;
        this.setState({
          heightByInput:isNaN(modifiedValue)?0:modifiedValue,
          volumeRight: (value.length > 3) ? 2: 8,
          ...temp==0&&value==0 && {sliderValue:0}
        })
      }else{
        value>maxHeightValue && (alert(`${I18n.t('generic.maximum_limit')} ${maxHeightValue}`))
        let temp=isNaN(parseFloat(value)) ? 0: parseFloat(value);
        this.setState({
          heightByInput: isNaN(parseFloat(value)) ? 0: parseFloat(value),
          volumeRight: (value.length > 3) ? 2: 8,
          ...temp==0&&value==0 && {sliderValue:0}
        })
      }
    }
  }
  selectRangeAndDecimalPlaces=(unit)=>{
    const {measurement}=this.props;
    
    if(measurement==='Height'){
      if(unit==='inch'){
        return {range:1,decimal:1};
      }else{
        return {range:5,decimal:1};
      }
    }else{
      if(unit==='lb'){
        return {range:1,decimal:2};
      }else{
        return {range:0.25,decimal:3}
      }
    }
  }
  render() {
    const {sliderValue, heightByInput , maxHeightValue , unit, volumeRight,isFocus} = this.state;
    let heightInputValue = 0
    let multiplicityValue = 1
    let unitTextShown = I18n.t(`units.${unit.toLowerCase()}`)
    if(sliderValue> 0){
      heightInputValue= sliderValue
    }else{
      heightInputValue= heightByInput
    }
    if(this.props.measurement === 'Height'){
      unit === 'inch' && (multiplicityValue = 0.5)
    } else {
      //multiplicityValue = 0.1
      multiplicityValue = 0.05
      unit === 'lb' && (multiplicityValue = 0.25)
      unit === 'gram' && (unitTextShown = 'g')
    }
    let containerColor = this.props.themeSelected === "dark" ? Colors.rgb_000000 : Colors.white
    return (
      <SafeAreaView style={[styles.container, styles.modelStyles, { backgroundColor: containerColor}]}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <>
            <HeaderTitle title={this.props.headerText} onBackPress={() => this.props.getMeasurement(this.state.heightByInput)}/>
            <View style={styles.sleepView}>
              <CustomVolumeSlider
                multiplicity={multiplicityValue}
                maxSliderValue={maxHeightValue}
                // value={sliderValue}
                //value={heightByInput>0? heightByInput: sliderValue}
                //changeValue={this.handleChangeValue}
                accuracy={true}
                range={this.selectRangeAndDecimalPlaces(unit).range}
                decimalPlaces={this.selectRangeAndDecimalPlaces(unit).decimal}
                value={sliderValue}
                changeValue={(heightByInput)=>{this.setState({heightByInput})}}
                numberColor={this.textColor}
              />
              <View style={styles.textInputWrapperStyle}
                onStartShouldSetResponder={()=> this.nameRef.focus()}
              >
                <CustomTextInput
                  inputRef={(input)=>{ this.nameRef = input }}
                  maxLength={6}
                  //value={`${heightInputValue}`}
                  textContentType="familyName"
                  keyboardType={'numeric'}
                  placeholderTextColor={Colors.rgb_000000}
                  //onChangeText={(index, value) => this.onChangeTextValue(value) }
                  textStyles={[styles.heightInputStyle,{color:Colors.rgb_000000}]}
                  value={isFocus?sliderValue+'':heightByInput + ''}
                  onBlur={()=>{
                    this.setState({isFocus:false})
                  }}
                  onFocus={()=>{
                    this.setState({isFocus:true,sliderValue:heightByInput})
                  }}
                  onChangeText={(index, value) => {
                    //this.onChangeTextValue(value)
                    console.log(value,'value');
                    let temp=parseFloat(value==''||value==undefined?0:value)
                    this.setState({
                      volumeRight: ((value+'').length > 3) ? 2: 8, 
                      sliderValue:isNaN(temp)?0:temp,
                    })
                  }}
                />
                <Text maxFontSizeMultiplier={1.3} style ={[styles.textUnitsStyles, {position: "relative", right: volumeRight,color:Colors.rgb_000000}]}> {`${unitTextShown}`}</Text>
                </View>
            </View>
          </>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,
});

export default connect(mapStateToProps, null)(CustomMeasurementsView);
