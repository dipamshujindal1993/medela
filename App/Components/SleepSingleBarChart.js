import React from 'react';
import {
  Text,
  View,
  processColor,
} from 'react-native';
import { Colors } from '@resources'
import { BarChart } from 'react-native-charts-wrapper';
import styles from './Styles/ChartStyles'
import { convertSecToMinutes ,getTimeFormat } from '@utils/TextUtils'
import moment from 'moment';
import I18n from '@i18n';

class SleepSingleBarChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isStatsSelected: true,
      legend: {
        enabled: false,
        textSize: 12,
        form: "CIRCLE",
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        wordWrapEnabled: true,
        verticalAlignment: "TOP",
        horizontalAlignment: "RIGHT",
        textColor: processColor(this.props.textColor),
      },
      data: null,
      lineData: null,
      xAxis: {
        valueFormatter: null,
        granularityEnabled: true,
        granularity: 1,
        //axisMaximum: 5,
        axisMinimum: -0.3,
        centerAxisLabels: false,
        drawGridLines: false,
        enabled: true,
        position: 'BOTTOM',
        textColor: processColor(this.props.textColor),
      },
      yAxis: {
        left: {
          axisMinimum: 0,
          granularityEnabled: true,
          granularity: 1,
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
          enabled: false
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

  static getDerivedStateFromProps(props, state){
    const { datas, isTodaySelected, type ,formattedTime} = props
    let data=[], xAxisArray = []
    datas && datas.map((item, index) => {
      //Dividing by 3600 to convert sec to hours
      data[index] = isTodaySelected? parseFloat(item.durationTotal/3600):parseFloat(item.total_duration_key/3600)
      // data[index] = isTodaySelected? convertSecToMinutes(item.durationTotal):convertSecToMinutes(item.total_duration_key)
      xAxisArray[index] = isTodaySelected ? moment(item.trackAt).format(formattedTime ? 'HH:mm' : 'hh:mm') : moment(item.trackAt).format('ddd')
    })
 //display graph data for duration < 4 minutes
    data=data.map(durationSec=>{
      if(durationSec<0.07){
        return 0.07;
      }else{
        return durationSec;
      }
     })
    return {
      data: {
        dataSets: [
        {
          values: data,
          label: '',
          config: {
            drawValues: false,
            colors: [processColor(props.colorSet[0])],
            valueTextColor: processColor(Colors.rgb_646363)
          }
        }],
        config: {
          barWidth: data.length == 1 ? 0.1 : data.length == 2 ? 0.2 : 0.3,
        }
      },
      xAxis: {
        valueFormatter: xAxisArray,
        granularityEnabled: true,
        granularity: 1,
        //axisMaximum: 5,
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
          granularityEnabled: true,
          granularity: 1,
          axisMaximum: Math.ceil(Math.max.apply(null, data)),
          textColor: processColor(props.textColor),
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
          enabled: false
        },
      },
      legend: {
        enabled: false,
      },
    }
  }

  render() {
    const { type,textColor } = this.props
    const { isStatsSelected } = this.state
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}>
            { isStatsSelected &&
            <Text maxFontSizeMultiplier={1.7} style={[styles.unitLeft,{color:textColor}]}>
              {I18n.t('time.hour')}
            </Text>
            }
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
                  drawValueAboveBar={true}
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
        </View>
        <View style={styles.titleContainer}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:textColor}]}> {I18n.t('tracking.sleep')}</Text>
         </View>
      </View>
    );
  }
}

export default SleepSingleBarChart;
