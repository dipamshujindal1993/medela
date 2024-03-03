import React from 'react';
import {
  Text,
  View,
  processColor,
} from 'react-native';
import { Colors } from '@resources'
import { BarChart } from 'react-native-charts-wrapper';
import styles from './Styles/ChartStyles'
import KeyUtils from "@utils/KeyUtils";
import { capitalizeFirstLetter, convertOZIntoML, convertMLIntoOZ, getTimeFormat,convertSecToMinutes } from '@utils/TextUtils'
import moment from 'moment';
import I18n from '@i18n';

class GroupedBarChart extends React.Component {

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
          enabled: props.type===KeyUtils.TRACKING_TYPE_BREASTFEEDING ? false: true,
          textColor: processColor(Colors.rgb_898d8d),
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
  }

  componentDidMount() {
    getTimeFormat(true).then((e) => this.setState({ formattedTime: e}))
  }

  static getDerivedStateFromProps(props, state){
    const { datas, type, isTodaySelected,volumeUnit } = props
    let unit = volumeUnit
    let leftArrayData=[],rightArrayData=[],xAxisArray =[]
    datas && datas.map((item, index) => {
      const {trackAt}=item
      if (index>5){
        return
      }
      if(type===KeyUtils.TRACKING_TYPE_BREASTFEEDING){
        leftArrayData[index] = isTodaySelected?parseInt(convertSecToMinutes(item.durationLeft)):parseInt(convertSecToMinutes(item.total_left_key))
        rightArrayData[index] = isTodaySelected?parseInt(convertSecToMinutes(item.durationRight)):parseInt(convertSecToMinutes(item.total_right_key))
      }
      else{
        let amountData = item.amountTotal
        const {amountTotalUnit}=item
        let value = isTodaySelected ? amountData : item.total_volume_key
        if(amountTotalUnit !== unit){
          value = amountTotalUnit =="oz" ? convertOZIntoML(value) : convertMLIntoOZ(value)
        }
        leftArrayData[index] = value
        rightArrayData[index] = isTodaySelected ? parseInt(convertSecToMinutes(item.durationTotal)) :parseInt(item.total_duration_key)
      }
      xAxisArray[index] = isTodaySelected ? moment(trackAt).format(state.formattedTime ? 'HH:mm' : 'hh:mm') : moment(trackAt).format('ddd')
    })

    return {
      data: {
        dataSets: [
          {
            values: leftArrayData,
            label: type===KeyUtils.TRACKING_TYPE_BREASTFEEDING ? I18n.t('stats_breastfeeding.left_key') : I18n.t('stats_pumping.vol_key'),
            config: {
              drawValues: false,
              colors: [processColor(props.colorSet[0])],
              valueTextColor: processColor(props.textColor)
            },
          },
          {
            values: rightArrayData,
            label: type===KeyUtils.TRACKING_TYPE_BREASTFEEDING ? I18n.t('stats_breastfeeding.right_key'): I18n.t('breastfeeding_pump.duration'),
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
          axisMinimum: 0,
          enabled: props.type===KeyUtils.TRACKING_TYPE_BREASTFEEDING ? false: true,
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
  }

  render() {
    const { type,volumeUnit,textColor}  = this.props
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.unitLeft,{color:textColor}]}>
            {type ===KeyUtils.TRACKING_TYPE_PUMPING ? I18n.t(`units.${volumeUnit.toLowerCase()}`) : I18n.t('time.min')}
          </Text>
          <View style={styles.container}>
            <BarChart
              style={styles.chart}
              xAxis={this.state.xAxis}
              yAxis={this.state.yAxis}
              data={this.state.data}
              legend={this.state.legend}
              onChange={(event) => console.log(event.nativeEvent)}
              animation={{durationX:1000, durationY: 1000}}
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
          </View>
          {type ===KeyUtils.TRACKING_TYPE_PUMPING &&
          <Text maxFontSizeMultiplier={1.7} style={[styles.unitRight,{color:textColor}]}>
            {I18n.t('time.min')}
          </Text>
          }
        </View>
        <View style={styles.titleContainer}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:textColor}]}> {capitalizeFirstLetter(type)}</Text>
        </View>
      </View>
    );
  }
}

export default GroupedBarChart;
