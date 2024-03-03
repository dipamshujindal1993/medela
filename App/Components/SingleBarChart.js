import React from 'react';
import {
  Text,
  View,
  processColor,
  I18nManager,
} from 'react-native';
import { Colors } from '@resources'
import { BarChart, LineChart } from 'react-native-charts-wrapper';
import styles from './Styles/ChartStyles'
import KeyUtils from "@utils/KeyUtils";
import { getTimeFormat,
  convertInchToMM,
  convertMMToInch,
  convertPoundIntoGram,
  convertGramIntoPound ,
  diffInDays} from '@utils/TextUtils'
import SwitchButton from "@components/SwitchButton";
import I18n from '@i18n';
import whoData from '../StaticData/charts/whoData'
import moment from 'moment';
import Dialog from '@components/Dialog';
import {gramToKg,lbsToKg} from "@utils/locale";
import {heightConversionHandler, weightConversionHandler} from "../Utils/locale";
import {connect} from 'react-redux';
import UserActions from '@redux/UserRedux';
import HomeActions from '@redux/HomeRedux';
import LoadingSpinner from "@components/LoadingSpinner";
import {getRealmDb, updateBaby} from "../Database/AddBabyDatabase";
import DeviceInfo from 'react-native-device-info'
import EmptyTrackingTypeIcon from '@svg/ic_empty_export_list';

class SingleBarChart extends React.Component {

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
          textColor: processColor(this.props.textColor),
          drawLabels: true,
          drawAxisLine: false,
          drawGridLines: true,
          gridDashedLine:{lineLength: 2,
            spaceLength: 3,},
          zeroLine: {
            enabled: true,
            lineWidth: 0.5,
            lineColor: processColor(this.props.textColor)
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
      },
      showWhoAlert: false,
      isLoading: false,
      baby: {},
      realmDb:null,
      updateSwitch: false
    };
    addBabySuccessInitGraph = false
  }

  async componentDidMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      this.props.baby.gender==0? this.setState({showWhoAlert:true}):null
    })
    getTimeFormat(true).then((e) => this.setState({ formattedTime: e}))
    let realmDb=await getRealmDb()
    this.setState({ realmDb })
    let babyArr = realmDb.objects('AddBaby');
    let babies = JSON.parse(JSON.stringify(babyArr))
    let profile = realmDb.objects('UserMotherProfile');
    if (profile.length>0){
      let motherProfileObj = JSON.parse(JSON.stringify(profile))
      const { currentBabyClientId } = motherProfileObj[0].mother
      let index = babies.findIndex((e) => {
        return e.babyId === currentBabyClientId
      })
      this.setState({ baby: babies[index], username: babies[index].username })
    } else {
      this.setState({ baby: this.props.baby })
    }
    this.props.baby.gender==0? this.setState({showWhoAlert:true}):null
  }

  componentWillUnmount() {
    this.focusListener.remove();
   }

  componentDidUpdate(prevProps, prevState) {
    const { isBabyNameAdd, isBabyNameAddError, getMyBabies, babiesSuccess, babiesFailure,onGraphTypeChange} = this.props;
    const { isLoading } = this.state;
    if (isBabyNameAdd != prevProps.isBabyNameAdd && isBabyNameAdd && isLoading) {
      getMyBabies()
    }
    if (isBabyNameAdd != prevProps.isBabyNameAdd && isBabyNameAdd  ) {
      this.addBabySuccessInitGraph=!this.addBabySuccessInitGraph
      if(this.props.graphType=='who' &&  this.addBabySuccessInitGraph ){
      // this.setState({ updateSwitch: true },()=>{
      //   onGraphTypeChange('who')
      // })
    }
    }
    if ((prevProps.isBabyNameAddError != isBabyNameAddError) && isBabyNameAddError && isLoading) {
      this.setState({ isLoading: false, updateSwitch: true });
    }
    if (prevProps.babiesSuccess != babiesSuccess && babiesSuccess && isLoading) {
      this.setState({isLoading: false })
    }
    if ((prevProps.babiesFailure != babiesFailure) && babiesFailure && isLoading) {
      this.setState({ isLoading: false, updateSwitch: true })
    }
  }

  static getDerivedStateFromProps(props, state){
    const { datas, isTodaySelected, type, graphType, baby,heightUnit,weightUnit,isImperial, isInternetAvailable } = props
    let data=[]
    let  xAxisStat = []
    datas && datas.map((item, index) => {
      let weeks =diffInDays(new Date(baby.birthday), new Date(item.trackAt))
      weeks = Math.ceil(weeks/7)
      const {trackAt}=item
      if(type===KeyUtils.TRACKING_TYPE_GROWTH){
        const {convertedHeight,convertedHeightUnit }=heightConversionHandler(isImperial,item.heightUnit,item.height)
        datas[index].height = parseFloat(convertedHeight)
        data[index] = graphType == 'who'? {x:weeks-1,y:parseFloat(convertedHeight),trackAt} : parseFloat(convertedHeight)
        datas[index].heightUnit=convertedHeightUnit
      }
      else{
        const {convertedWeight,convertedWeightUnit}=weightConversionHandler(isImperial,item.weightUnit,item.weight)
        datas[index].weight = parseFloat(convertedWeight)
        // data[index] = parseFloat(convertedWeight)
        data[index] = graphType == 'who'?{x:weeks-1,y:parseFloat(convertedWeight),trackAt}:parseFloat(convertedWeight)
        datas[index].weightUnit=convertedWeightUnit
      }

      xAxisStat[index] = isTodaySelected ? moment(trackAt).format(state.formattedTime ? 'HH:mm' : 'hh:mm') : moment(trackAt).format('ddd')
    })

    let xAxisWHO = ['0','1', '2', '3', '4', '5', '6', '7', '8','9','10','11','12','13']

    let filteredArr = JSON.parse(JSON.stringify(data))
    filteredArr=filteredArr.filter((e)=>{
      let weeks =diffInDays(new Date(baby.birthday), new Date(e.trackAt))
      weeks = Math.ceil(weeks/7)
      weeks=weeks-1
      return  e.x>=0 && weeks<=13
    })
    let dataArray = []
    // dataArray[0] = data
    dataArray[0] = filteredArr
    let yAxisMinimum = 0
    let legends = null
    let xAxis = null
    let yAxix = null
    const gender = isInternetAvailable ? baby.gender : state.baby.gender
    if(graphType=="who" && baby && baby.hasOwnProperty("gender")){
      xAxis = xAxisWHO
      if(type===KeyUtils.TRACKING_TYPE_GROWTH){
        // yAxisMinimum = 0
        if(gender===1 && heightUnit===KeyUtils.UNIT_CM){
          dataArray[1] = whoData.tracking_height_boys_p3
          dataArray[2] = whoData.tracking_height_boys_p15
          dataArray[3] = whoData.tracking_height_boys_p50
          dataArray[4] = whoData.tracking_height_boys_p85
          dataArray[5] = whoData.tracking_height_boys_p97
        }
        else if(gender===2 && heightUnit===KeyUtils.UNIT_CM ){
          dataArray[1] = whoData.tracking_height_girls_p3
          dataArray[2] = whoData.tracking_height_girls_p15
          dataArray[3] = whoData.tracking_height_girls_p50
          dataArray[4] = whoData.tracking_height_girls_p85
          dataArray[5] = whoData.tracking_height_girls_p97
        }
        else if(gender===1 && heightUnit===KeyUtils.UNIT_INCH ){
          dataArray[1] = whoData.standard_tracking_height_boys_p3
          dataArray[2] = whoData.standard_tracking_height_boys_p15
          dataArray[3] = whoData.standard_tracking_height_boys_p50
          dataArray[4] = whoData.standard_tracking_height_boys_p85
          dataArray[5] = whoData.standard_tracking_height_boys_p97
        }
        else if(gender===2 && heightUnit===KeyUtils.UNIT_INCH ){
          dataArray[1] = whoData.standard_tracking_height_girls_p3
          dataArray[2] = whoData.standard_tracking_height_girls_p15
          dataArray[3] = whoData.standard_tracking_height_girls_p50
          dataArray[4] = whoData.standard_tracking_height_girls_p85
          dataArray[5] = whoData.standard_tracking_height_girls_p97
        }
        let resultGraphArray = dataArray[0].map(a => a.y);
        let mergeArr=resultGraphArray.concat(dataArray[1])
        let arrayMinValue=Math.min.apply(null, mergeArr)
        let min =arrayMinValue>6? arrayMinValue-5:0
        // yAxisMinimum = Math.round(min / 10) * 10
        yAxisMinimum = min

        console.log('resultGraphArray',resultGraphArray)
        console.log('mergeArr',mergeArr)
        console.log('arrayMinValue',arrayMinValue)
        console.log('min',min)
        console.log('yAxisMinimum',yAxisMinimum)

      }
      else if(type===KeyUtils.TRACKING_TYPE_WEIGHT){
        // yAxisMinimum = 1
        if(gender===1 && weightUnit===KeyUtils.UNIT_KG){
          dataArray[1] = whoData.tracking_weight_boys_p3
          dataArray[2] = whoData.tracking_weight_boys_p15
          dataArray[3] = whoData.tracking_weight_boys_p50
          dataArray[4] = whoData.tracking_weight_boys_p85
          dataArray[5] = whoData.tracking_weight_boys_p97
        }
        else if(gender===2 && weightUnit===KeyUtils.UNIT_KG){
          dataArray[1] = whoData.tracking_weight_girls_p3
          dataArray[2] = whoData.tracking_weight_girls_p15
          dataArray[3] = whoData.tracking_weight_girls_p50
          dataArray[4] = whoData.tracking_weight_girls_p85
          dataArray[5] = whoData.tracking_weight_girls_p97
        }
        else if(gender===1 && weightUnit===KeyUtils.UNIT_LB){
          dataArray[1] = whoData.standard_tracking_weight_boys_p3
          dataArray[2] = whoData.standard_tracking_weight_boys_p15
          dataArray[3] = whoData.standard_tracking_weight_boys_p50
          dataArray[4] = whoData.standard_tracking_weight_boys_p85
          dataArray[5] = whoData.standard_tracking_weight_boys_p97
        }else if(gender===2 && weightUnit===KeyUtils.UNIT_LB){
          dataArray[1] = whoData.standard_tracking_weight_girls_p3
          dataArray[2] = whoData.standard_tracking_weight_girls_p15
          dataArray[3] = whoData.standard_tracking_weight_girls_p50
          dataArray[4] = whoData.standard_tracking_weight_girls_p85
          dataArray[5] = whoData.standard_tracking_weight_girls_p97
        }
        let resultGraphArray = dataArray[0].map(a => a.y);
        let mergeArr=resultGraphArray.concat(dataArray[1])
        let arrayMinValue=Math.min.apply(null, mergeArr)
        let min =arrayMinValue>15? arrayMinValue-10:0
        yAxisMinimum = Math.round(min / 10) * 10
      }
      legends = {
        enabled: true,
        textSize: 10,
        form: "CIRCLE",
        formSize: 10,
        xEntrySpace: 5,
        yEntrySpace: 5,
        wordWrapEnabled: true,
        verticalAlignment: "TOP",
        horizontalAlignment: "RIGHT",
        textColor: processColor(props.textColor),
      }
      yAxix = {
        left: {
          axisMinimum: yAxisMinimum,
          // labelCount:12,
          granularityEnabled: true,
          granularity: 2,
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
      }
    }
    else{
      xAxis = xAxisStat
      legends = {
        enabled: false,
      }
      yAxix = {
        left: {
          axisMinimum: 0,
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
      }
    }

    return {
      data: {
        dataSets: [
        {
          values: data,
          label: '',
          config: {
            drawValues: false,
            colors: [processColor(props.colorSet[0])],
            valueTextColor: processColor(props.textColor)
          }
        }],
        config: {
          barWidth: data.length == 1 ? 0.1 : data.length == 2 ? 0.2 : 0.3,
        }
      },
      lineData: {
        dataSets: [{
          values: dataArray[0],
            label: 'baby',
            config: {
              lineWidth: 1,
              drawValues: false,
              drawCircles: true,
              circleRadius: 3,
              circleColor: processColor(Colors.rgb_fecd00),
              colors: [processColor(Colors.rgb_fecd00)],
              valueTextColor: processColor(props.textColor)
            }
        }, {
          values: gender==0?[]: dataArray[1],
          label: '3rd',
          config: {
            lineWidth: 1,
            drawValues: false,
            drawCircles: false,
            colors: [processColor(Colors.rgb_898d8d)],
            valueTextColor: processColor(props.textColor)
          }
        }, {
          values: gender==0?[]: dataArray[2],
          label: '15th',
          config: {
            lineWidth: 1,
            drawValues: false,
            drawCircles: false,
            colors: [processColor(Colors.rgb_898d8d_6)],
            valueTextColor: processColor(props.textColor)
          }
        }, {
          values: gender==0?[]: dataArray[3],
            label: '50th',
            config: {
              lineWidth: 1,
              drawValues: false,
              drawCircles: false,
              circleRadius: 3,
              circleColor: processColor(Colors.rgb_fecd00),
              colors: [processColor(Colors.rgb_898d8d33)],
              valueTextColor: processColor(props.textColor)
            }
        }, {
          values: gender==0?[]: dataArray[4],
            label: '85th',
            config: {
              lineWidth: 1,
              drawValues: false,
              drawCircles: false,
              circleRadius: 3,
              circleColor: processColor(Colors.rgb_fecd00),
              colors: [processColor(Colors.rgb_898d8d_6)],
              valueTextColor: processColor(props.textColor)
            }
        }, {
          values: gender==0?[]: dataArray[5],
            label: '97th',
            config: {
              lineWidth: 1,
              drawValues: false,
              drawCircles: false,
              circleRadius: 3,
              circleColor: processColor(Colors.rgb_fecd00),
              colors: [processColor(Colors.rgb_898d8d)],
              valueTextColor: processColor(props.textColor)
            }
        }],
      },
      xAxis: {
        valueFormatter: xAxis,
        granularityEnabled: true,
        granularity: 1,
        axisMinimum: -0.1,
        labelCount:13,
        centerAxisLabels: false,
        drawGridLines: false,
        enabled: true,
        position: 'BOTTOM',
        textColor: processColor(props.textColor),
      },
      legend: legends,
      yAxis: yAxix
    }
  }

  renderToggleView=()=>{
    const {graphType}=this.props
    return <View style={styles.WHOContainer}>
      <SwitchButton
        onValueChange={(val) => this.onGraphTypeChange(val)}
        text1 = {I18n.t('stats_growth.stats')}
        text2 = {I18n.t('stats_growth.who')}
        activeSwitch = {graphType=="stat"?1:2}
        switchWidth = {DeviceInfo.getFontScale()>1.6?130*1.63:130}
        switchHeight = {DeviceInfo.getFontScale()>1.6?32*1.63:32}
        switchBorderRadius = {8}
        switchBorderColor = 'transparent'
        switchBackgroundColor = {Colors.rgb_898d8d33}
        btnBorderColor = 'transparent'
        btnBackgroundColor = {Colors.white}
        fontColor={this.props.textColor}
        activeFontColor={Colors.rgb_000000}
        amPmStart
        updateSwitch={this.state.updateSwitch}
        switchdirection={I18nManager.isRTL?'rtl':'ltr'}
      />
    </View>
  }

  updateBabyGender(gender){
    this.setState({ isLoading: true, showWhoAlert: false })
    const { addBabyName, onGraphTypeChange, isInternetAvailable } = this.props;
    const { realmDb, username, baby } = this.state;
    onGraphTypeChange("who")
    let babies = {
      "babies": [{
        "babyId": this.props.baby.babyId,
        "birthWeight": this.props.baby.birthWeight,
        "birthHeight": this.props.baby.birthHeight,
        "gender": gender,
        "name": this.props.baby.name,
        "birthday": this.props.baby.birthday
      }]
    }
    if(isInternetAvailable){
      addBabyName({babies});
    } else {
      babies.babies[0].isSync=false
      babies.babies[0].username=username
      updateBaby(realmDb,babies.babies[0]).then((r)=>{
        this.setState({ baby: {...baby, gender} }, () => this.setState({ isLoading: false }))
      })
    }
  }

  updateSelection(){
    const { onGraphTypeChange } = this.props;
    this.setState({ updateSwitch: false, showWhoAlert: false }) 
    onGraphTypeChange("who")
  }

  onGraphTypeChange = (val) => {
    const { onGraphTypeChange, isInternetAvailable, updateSwitch } = this.props
    if(val === 2 && parseInt(isInternetAvailable ? this.props.baby.gender : this.state.baby.gender) === 0 && !updateSwitch){
      this.setState({ showWhoAlert: true })
    } else {
      onGraphTypeChange(val === 1 ? "stat" : "who")
    }
    this.setState({ updateSwitch: false })
  }

  render() {
    const { type, graphType,heightUnit,weightUnit, baby, isInternetAvailable ,textColor} = this.props
    return (
      <View style={{flex: 1}}>
        {this.state.isLoading && <LoadingSpinner/>}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}>
            {!this.state.isLoading &&  ((graphType=='who' && isInternetAvailable) || (this.props.datas.length>0 && graphType=='stat')) && <Text maxFontSizeMultiplier={1.7} style={[styles.unitLeft,{color:textColor}]}>
              {type===KeyUtils.TRACKING_TYPE_GROWTH ? I18n.t(`chart.${heightUnit.toLowerCase()}`) : I18n.t(`units.${weightUnit.toLowerCase()}`)}
            </Text>}
            <View style={styles.container}>
              {
                graphType=="stat" ?
                this.props.datas.length>0?
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
                  drawValueAboveBar={true}
                  dragDecelerationEnabled={true}
                  isDrawRoundedBarsEnabled={true}
                  chartDescription={this.state.description}
                  marker={this.state.marker}
                />
                :
                <View style={styles.listEmptyView}>
                  <EmptyTrackingTypeIcon width={110} height={100}/>
                    <Text maxFontSizeMultiplier={1.7} style={[styles.emptyListTextStyle,{color:textColor}]}>{I18n.t('stats_screen.empty_list_today_message')}</Text>
                </View>
                :(graphType=='who' && isInternetAvailable)?
                ((this.state.baby.gender !== undefined && isInternetAvailable) ? <LineChart
                style={styles.chart}
                data={this.state.lineData}
                legend={this.state.legend}
                marker={this.state.marker}
                xAxis={this.state.xAxis}
                yAxis={this.state.yAxis}
                autoScaleMinMaxEnabled={false}
                touchEnabled={true}
                dragEnabled={true}
                scaleEnabled={true}
                scaleXEnabled={true}
                scaleYEnabled={true}
                pinchZoom={true}
                doubleTapToZoomEnabled={true}
                highlightPerTapEnabled={true}
                highlightPerDragEnabled={false}
                dragDecelerationEnabled={true}
                dragDecelerationFrictionCoef={0.99}
                chartDescription={this.state.description}
                ref="chart"
                keepPositionOnRotation={false}
                onSelect={this.handleSelect}
                onChange={(event) => console.log(event.nativeEvent)}
              /> : <View />):<View style={styles.noInternetViewStyle}>
                <Text maxFontSizeMultiplier={1.7} style={[styles.noInternetTextStyle,{color:textColor}]}>{I18n.t('breastfeeding_confidence.offline_popup_message')}</Text></View>
            }
            {graphType=='who' && !this.state.isLoading && isInternetAvailable &&
            <Text maxFontSizeMultiplier={1.7} style={[styles.unitBottom,{color:textColor}]}>
                    {I18n.t('chart.age')}
            </Text>}
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:textColor}]}> {type===KeyUtils.TRACKING_TYPE_GROWTH ? I18n.t('stats_growth.title') :I18n.t('stats_weight.title')}</Text>
         </View>
         {this.renderToggleView()}
        <Dialog
          visible={this.state.showWhoAlert}
          title={I18n.t('tracking.who_popup_title')}
          message={I18n.t('tracking.who_popup_description')}
          positive={I18n.t('tracking.who_popup_option1')}
          negative={I18n.t('tracking.who_popup_option2')}
          neutral={I18n.t('tracking.who_popup_option3')}
          isIcon={false}
          positiveOnPress={() => this.updateBabyGender(2)}
          negativeOnPress={() => this.updateBabyGender(1)}
          neutralPress={() =>  this.updateSelection()}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  babies: state.home.babies,
  isBabyNameAdd: state.user.isBabyNameAdd,
  isBabyNameAddError: state.user.isBabyNameAddError,
  babiesSuccess: state.home.babiesSuccess,
  babiesFailure: state.home.babiesFailure,
  isInternetAvailable: state.app.isInternetAvailable,
});

const mapDispatchToProps = (dispatch) => ({
  getMyBabies: () => dispatch(HomeActions.getMyBabies()),
  addBabyName: (babies) => dispatch(UserActions.addBabyName(babies))
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleBarChart);
