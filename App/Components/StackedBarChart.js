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
import { capitalizeFirstLetter, convertOZIntoML, convertMLIntoOZ, getTimeFormat } from '@utils/TextUtils'
import moment from 'moment';
import I18n from '@i18n';

class StackedBarChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      legend: {
        enabled: true,
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
      formattedTime: '',
      xAxis: {
        valueFormatter: ['10:15', '12:15', '03:45', '07:20', '09:45'],
        granularityEnabled: true,
        granularity: 1,
        axisMaximum: 5,
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
          textColor: processColor(this.props.textColor),
          drawLabels: true,
          drawAxisLine: false,
          drawGridLines: true,
          gridDashedLine:{lineLength: 2,
            spaceLength: 3,},
          zeroLine: {
            enabled: true,
            lineWidth: 0.5,
            lineColor: processColor(Colors.rgb_000000r)
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

  componentDidMount() {
    getTimeFormat(true).then((e) => this.setState({ formattedTime: e})) 
  }

  static getDerivedStateFromProps(props, state){
    const { datas, isTodaySelected, type,volumeUnit } = props
    let data=[], xAxisArray = []
    let unit = volumeUnit
    datas && datas.map((item, index) => {
      if (!isTodaySelected) {
        if (type ==KeyUtils.TRACKING_TYPE_BOTTLE){
          let amountData = item.amountTotal
          let milkValue = item.milk_volume_count
          let formulaValue = item.formula_volume_count
          let mixValue = item.mix_volume_count
          if(item.amountTotalUnit !== unit){
            if(item.amountTotalUnit =="oz"){
              milkValue = convertOZIntoML(milkValue)
              formulaValue = convertOZIntoML(formulaValue)
              mixValue = convertOZIntoML(mixValue)
            }
            else{
              milkValue = convertMLIntoOZ(milkValue)
              formulaValue = convertMLIntoOZ(formulaValue)
              mixValue = convertMLIntoOZ(mixValue)
            }
          }
          data[index] = [milkValue, formulaValue, mixValue]
        }
        else{
          data[index] = [item.pee_key==null?0:item.pee_key, item.poo_key==null?0:item.poo_key, item.both_key==null?0:item.both_key]
        }
      } else {
      let bottleArr = []
      let diaperArr = []
      if (type === KeyUtils.TRACKING_TYPE_BOTTLE) {
        const {feedType} = item

        let amountData = item.amountTotal
        let value = isTodaySelected ? amountData : item.total_volume_key
        if(item.amountTotalUnit !== unit){
          value = item.amountTotalUnit =="oz" ? convertOZIntoML(value) : convertMLIntoOZ(value)
        }

        if (feedType === 1 || feedType === 4) {
          bottleArr = [value, 0, 0]
        } else if (feedType == 2) {
          bottleArr = [0, value, 0]
        } else {
          bottleArr = [0, 0, value]
        }

      } else {
        const {batchType} = item
        if (batchType === 1) {
          diaperArr = [1, 0, 0]
        } else if (batchType == 2) {
          diaperArr = [0, 1, 0]
        } else {
          diaperArr = [0, 0, 1]
        }

      }
      data[index] = type === KeyUtils.TRACKING_TYPE_BOTTLE ? bottleArr : diaperArr
    }
      xAxisArray[index] = isTodaySelected ? moment(item.trackAt).format(state.formattedTime ? 'HH:mm' : 'hh:mm') : moment(item.trackAt).format('ddd')
    })

    const stackLable = type===KeyUtils.TRACKING_TYPE_BOTTLE ? [I18n.t('bottle_tracking.breastmilk'), I18n.t('bottle_tracking.formula'), I18n.t('bottle_tracking.mix')] : [I18n.t('stats_nappy.pee_key'), I18n.t('stats_nappy.poo_key'), I18n.t('stats_nappy.both_key')]

    return {
      data: {
        dataSets: [
        {
          values: data,
          label: '',
          config: {
            stackLabels: stackLable,
            drawValues: false,
            colors: [processColor(props.colorSet[0]), processColor(props.colorSet[1]), processColor(props.colorSet[2])],
            valueTextColor: processColor(Colors.rgb_646363)
          }
        }],
        config: {
          barWidth: 0.3,
          // group: {
          //   fromX: 0,
          //   groupSpace: 0.38,
          //   barSpace: 0.01,
          // }
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
          granularityEnabled: type === KeyUtils.TRACKING_TYPE_DIAPER ? true : false,
          granularity: 1,
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
    }
  }

  render() {
    const { type,volumeUnit,textColor } = this.props
    // let unitText = I18n.t(`units.${volumeUnit.toLowerCase()}`)
    let unitText=''
    unitText = volumeUnit && volumeUnit !='undefined' && I18n.t(`units.${volumeUnit.toLowerCase()}`)
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}>
            { type ===KeyUtils.TRACKING_TYPE_BOTTLE &&
            <Text maxFontSizeMultiplier={1.7} style={[styles.unitLeft,{color:textColor}]}>
              {unitText}
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
          <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:textColor}]}> {type=="diaper" ? "Nappy" : capitalizeFirstLetter(type)}</Text>
         </View>
      </View>
    );
  }
}

export default StackedBarChart;
