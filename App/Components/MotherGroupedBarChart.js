import React from 'react';
import {
  Text,
  View,
  processColor,
  I18nManager,
} from 'react-native';
import { Colors } from '@resources'
import { BarChart } from 'react-native-charts-wrapper';
import styles from './Styles/ChartStyles'
import { capitalizeFirstLetter, convertOZIntoML, convertMLIntoOZ, getTimeFormat } from '@utils/TextUtils'
import moment from 'moment';
import { getVolumeUnits } from '@utils/locale';
import SwitchButton from "./SwitchButton";
import I18n from "react-native-i18n";
import {convertSecToMinutes} from "../Utils/TextUtils";
import Metrics from "../Resources/Metrics";
import DeviceInfo from 'react-native-device-info'

class MotherGroupedBarChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      legend: {
        enabled: true,
        textSize: 12,
        form: "CIRCLE",
        formSize: 14,
        xEntrySpace: 20,
        yEntrySpace: 5,
        wordWrapEnabled: true,
        verticalAlignment: "TOP",
        horizontalAlignment: "RIGHT",
        textColor: processColor(this.props.textColor),
        formattedTime: '',
      },
      data: null,
      isDurationSelected:false,
      xAxis: {
        valueFormatter: ['10:15', '12:15', '03:45', '07:20', '09:45'],
        granularityEnabled: true,
        granularity: 1,
        axisMaximum: 5,
        axisMinimum: 0,
        centerAxisLabels: true,
        drawGridLines: false,
        enabled: true,
        position: 'BOTTOM',
        textColor: processColor(this.props.textColor),
      },
      yAxis: {

        left: {
          axisMinimum: 0,
          textColor: processColor(this.props.textColor),
          drawLabels: true,
          drawAxisLine: false,
          drawGridLines: true,
          gridDashedLine:{lineLength: 2,
            spaceLength: 3,},
          zeroLine: {
            enabled: true,
            lineWidth: 0.5,
            lineColor: processColor(Colors.rgb_000000)
          }
        },
        right: {
          axisMinimum: 0,
          enabled:  false,
          textColor: processColor(this.props.textColor),
          drawLabels: true,
          drawAxisLine: false,
          drawGridLines: true,
          gridDashedLine:{lineLength: 2,
            spaceLength: 3,},
          zeroLine: {
            enabled: true,
            lineWidth: 0.5,
            lineColor: processColor(Colors.rgb_000000)
          }
        },
      },

      marker: {
        enabled: false,
        markerColor: processColor('black'),
        textColor: processColor('white'),
        markerFontSize: 14,
      },

      description: {
        text: '',
        textSize: 15,
        textColor: processColor('black'),
      }

    };
    console.log(props.type)

  }

  componentDidMount() {
    getTimeFormat(true).then((e) => this.setState({ formattedTime: e}))
  }

  static getDerivedStateFromProps(props, state){
    let { datas, motherGraphType, isTodaySelected } = props
    let unit = getVolumeUnits()
    let leftArrayData=[],rightArrayData=[],xAxisArray =[]
    if(motherGraphType=="duration"){

      datas && datas.map((item, index) => {
        const {trackAt}=item
        console.log('--->>',item.frequency==0,motherGraphType)
        leftArrayData[index] = isTodaySelected?item.durationTotal : item.total_duration_key
        rightArrayData[index] = isTodaySelected?item.frequency==0?0:convertSecToMinutes(item.frequency):convertSecToMinutes(item.total_frequency_key)
        xAxisArray[index] = isTodaySelected ? moment(trackAt).format(state.formattedTime ? 'HH:mm' : 'hh:mm') : moment(trackAt).format('ddd')
      })

    }else {
      console.log(datas)
      datas && datas.map((item, index) => {
        const {trackAt,painLevel}=item
        leftArrayData[index] = isTodaySelected?item.painLevel:item.painLevel
        xAxisArray[index] = isTodaySelected ? moment(trackAt).format(state.formattedTime ? 'HH:mm' : 'hh:mm') : moment(trackAt).format('ddd')
      })
    }

    let mergeArr=leftArrayData.concat(rightArrayData)
    let maxValue=Math.max.apply(null, mergeArr)

    if(motherGraphType=="duration"){
      //changes by @rahul for frequency whoes walue is 0 to be visible on graph
       rightArrayData=rightArrayData.map(_it=>{
        if (_it==0){
          return maxValue<50?0.2:0.5
        }
        else if(_it<1){
          return 1;
        }else{
          return  _it;
        }
       })
      return {
        data: {
          dataSets: [
            {
              values: leftArrayData,
              label: I18n.t('breastfeeding_pump.duration'),

              config: {
                drawValues: false,
                colors: [processColor(props.colorSet[0])],
                valueTextColor: processColor(props.textColor)
              },
            },
            {
              values: rightArrayData,
              label: I18n.t('contractions.frequency'),
              config: {
                drawValues: false,
                colors: [processColor(props.colorSet[1])],
                valueTextColor: processColor(props.textColor)
              }
            },
          ],
          config: {
            barWidth: 0.3,
            group: {
              fromX: 0,
              groupSpace: 0.38,
              barSpace: 0.01,
            }
          }
        },
        xAxis: {
          valueFormatter: xAxisArray,
          granularityEnabled: true,
          granularity: 1,
          axisMaximum: 5,
          axisMinimum: 0,
          centerAxisLabels: true,
          drawGridLines: false,
          enabled: true,
          position: 'BOTTOM',
          textColor: processColor(props.textColor),
        },
        yAxis: {
          left: {
            axisMaximum: maxValue,
            valueFormatter: '####' ,
            axisMinimum: 0,
            textColor: processColor(props.textColor),
            drawLabels: true,
            drawAxisLine: false,
            drawGridLines: true,
            gridDashedLine:{
              lineLength: 2,
              spaceLength: 3
            },
            zeroLine: {
              enabled: true,
              lineWidth: 0.5,
              lineColor: processColor(Colors.rgb_000000)
            }
          },
          right: {
            axisMaximum: maxValue,
            valueFormatter: '####' ,
            axisMinimum: 0,
            enabled: true,
            textColor: processColor(props.textColor),
            drawLabels: true,
            drawAxisLine: false,
            drawGridLines: true,
            gridDashedLine:{
              lineLength: 2,
              spaceLength: 3
            },
            zeroLine: {
              enabled: true,
              lineWidth: 0.5,
              lineColor: processColor(Colors.rgb_000000)
            }
          },
        }
      }
    }else{
      return {
        data: {
          dataSets: [
            {
              values: leftArrayData,
              label: I18n.t('stats_contraction.intensity'),
              config: {
                drawValues: false,
                colors: [processColor(Colors.rgb_bcffe0)],
                valueTextColor: processColor(props.textColor)
              },
            },
            {
              values: rightArrayData,
              label: I18n.t('stats_contraction.frequency'),
              config: {
                drawValues: false,
                colors: [processColor(props.colorSet[1])],
                valueTextColor: processColor(props.textColor)
              }
            },
          ],
          config: {
            barWidth: 0.3,
            group: {
              fromX: 0,
              groupSpace: 0.38,
              barSpace: 0.01,
            }
          }
        },
        xAxis: {
          valueFormatter: xAxisArray,
          granularityEnabled: true,
          granularity: 1,
          axisMaximum: 5,
          axisMinimum: -0.3,
          centerAxisLabels: false,
          drawGridLines: false,
          enabled: true,
          position: 'BOTTOM',
          textColor: processColor(props.textColor),
        },
        yAxis: {
          left: {
            axisMinimum: 0,
            axisMaximum: 6,
            valueFormatter: [I18n.t('stats_contraction.none'), I18n.t('stats_contraction.very_mild'),I18n.t('stats_contraction.mild'),I18n.t('stats_contraction.medium'),I18n.t('stats_contraction.strong'),I18n.t('stats_contraction.very_strong'),I18n.t('stats_contraction.Pain_intensity')],
            textColor: processColor(props.textColor),
            drawLabels: true,
            drawAxisLine: false,
            enabled: true,
            drawGridLines: true,
            gridDashedLine:{
              lineLength: 2,
              spaceLength: 3
            },
            zeroLine: {
              enabled: true,
              lineWidth: 0.5,
              lineColor: processColor(Colors.rgb_000000)
            }
          },
          right:{
            enabled: false,
            axisMinimum: 0,

          }

        }
      }
    }

  }

  onMotherGraphTypeChange = (val) => {
    const { onMotherGraphTypeChange } = this.props
    onMotherGraphTypeChange(val === 1 ? "duration" : "intensity")
  }

  renderToggleView=()=>{
    const {isDurationSelected}=this.state
    const { motherGraphType } = this.props
    return <View style={[styles.DurationContainer,{right: motherGraphType==="duration"?Metrics.moderateScale._50:Metrics.moderateScale._25}]}>
      <SwitchButton
        onValueChange={(val) => this.onMotherGraphTypeChange(val)}
        text1 = {I18n.t('stats_contraction.duration')}
        numberOfLines={1}
        text2 = {I18n.t('stats_contraction.intensity')}
        activeSwitch = {isDurationSelected}
        switchWidth = {DeviceInfo.getFontScale()>1.6?130*1.63:130}
        switchHeight = {DeviceInfo.getFontScale()>1.6?32*1.63:32}
        switchBorderRadius = {8}
        switchBorderColor = 'transparent'
        switchBackgroundColor = {Colors.rgb_898d8d33}
        btnBorderColor = 'transparent'
        btnBackgroundColor = {Colors.white}
        fontColor={this.props.textColor}
        activeFontColor={Colors.rgb_000000}
        switchdirection={I18nManager.isRTL?'rtl':'ltr'}
      />
    </View>
  }

  render() {
    const { type,motherGraphType ,textColor} = this.props
    console.log('motherGraphType--',motherGraphType)
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}>
          {motherGraphType=="duration" &&
          <Text maxFontSizeMultiplier={1.7} style={[styles.unitLeft,{color:textColor}]}>
           { I18n.t(`time.sec`)}
          </Text>
          }

          <View style={styles.container}>
            {motherGraphType == "duration" ?
              <BarChart
                style={styles.chart}
                xAxis={this.state.xAxis}
                yAxis={this.state.yAxis}
                data={this.state.data}
                legend={this.state.legend}
                onChange={(event) => console.log(event.nativeEvent)}
                animation={{durationX: 1000, durationY: 1000}}
                dragEnabled={true}
                pinchZoom={true}
                doubleTapToZoomEnabled={true}
                highlightPerDragEnabled={false}
                highlightPerTapEnabled={false}
                //visibleRange={{x: { min: 5, max: 15}}}
                //drawValueAboveBar={true}
                //touchEnabled={true}
                dragDecelerationEnabled={true}
                isDrawRoundedBarsEnabled={true}
                chartDescription={this.state.description}
                //highlights={this.state.highlights}
                marker={this.state.marker}
                //chartBackgroundColor={processColor('pink')}
                //drawBorders={true}
                //borderColor={processColor('pink')}
                //extraOffsets={{left: 50, top: 50, right: 50, bottom: 50}}
              /> :
              <BarChart
                style={styles.chart}
                xAxis={this.state.xAxis}
                yAxis={this.state.yAxis}
                data={this.state.data}
                legend={this.state.legend}
                onChange={(event) => console.log(event.nativeEvent)}
                animation={{durationX: 1000, durationY: 1000}}
                dragEnabled={true}
                pinchZoom={true}
                doubleTapToZoomEnabled={true}
                highlightPerDragEnabled={false}
                highlightPerTapEnabled={false}
                //visibleRange={{x: { min: 5, max: 15}}}
                //drawValueAboveBar={true}
                //touchEnabled={true}
                dragDecelerationEnabled={true}
                isDrawRoundedBarsEnabled={true}
                chartDescription={this.state.description}
                //highlights={this.state.highlights}
                marker={this.state.marker}
                //chartBackgroundColor={processColor('pink')}
                //drawBorders={true}
                //borderColor={processColor('pink')}
                //extraOffsets={{left: 50, top: 50, right: 50, bottom: 50}}
              />
            }
          </View>

          {motherGraphType=="duration" &&
          <Text maxFontSizeMultiplier={1.7} style={[styles.unitRight,{color:textColor}]}>
           { I18n.t(`time.min`) }
          </Text>
          }

        </View>
        <View style={styles.titleContainer}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:textColor}]}> {I18n.t('stats_contraction.title')}</Text>
        </View>
        {this.renderToggleView()}
      </View>
    );
  }
}

export default MotherGroupedBarChart;
