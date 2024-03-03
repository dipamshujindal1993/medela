import React, { Component } from 'react';
import {View, Text,SafeAreaView,SectionList} from 'react-native';
import KeyUtils from "@utils/KeyUtils";
import EmptyTrackingTypeIcon from '@svg/ic_empty_export_list';
import I18n from '@i18n';
import styles from './Styles/OfflineSessionScreenStyles';
import HeaderTitle from '@components/HeaderTitle';
import { readTrackingSchemaItems } from "@database/TrackingDatabase";
import AsyncStorage from '@react-native-community/async-storage';
import StatsListItem from "@components/StatsListItem";
import Colors from '@resources/Colors';
import {connect} from 'react-redux';
import moment from 'moment';
import { Analytics } from '@services/Firebase';
import { getRealmDb } from '../Database/AddBabyDatabase';

let analytics = new Analytics()

class OfflineSessionScreen extends Component{
    constructor(props) {
      super(props)
      this.state = {
         dataArr:[],
         isImperial:true,
         isloading:true,
         units:KeyUtils.UNIT_IMPERIAL,
      }
      this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    }

    async componentDidMount(){
        AsyncStorage.getItem(KeyUtils.UNITS).then((_units)=>{
            if (_units!=null){
              this.setState({isImperial:_units===KeyUtils.UNIT_IMPERIAL,units:_units})
            }
          })
        let realmTracking = await getRealmDb()
        console.log('realmDB',realmTracking)
        let myItems = realmTracking.objects('Tracking');
        let arr = JSON.parse(JSON.stringify(myItems))
        arr=arr.filter((e)=>{
          return  !e.isMother && e.trackingType==KeyUtils.TRACKING_TYPE_PUMPING
        })
        let trackingObject=this.props.navigation.state.params.trackingIds
        let offlineArray= arr.filter(function(e) {
          return trackingObject.includes(e.id);
        });
        // Create title param for each object
        let singleObjData = offlineArray.map((item) => {
            // item.title = moment((item.trackAt)).format("D MMMM YYYY")
            item.title = I18n.locale == 'en-US' ? moment((item.trackAt)).format("MM/DD/YYYY") : moment((item.trackAt)).format('DD/MM/YYYY')
            return item
          });
          // Sort data by date
          singleObjData.sort((a,b) => {
            return moment(b.trackAt) - moment(a.trackAt)
          })
          // Reduce data for SectionList
          const groupedData = singleObjData.reduce((accumulator, currentValue, currentIndex, array, title = currentValue.title) => {
              const keyObjectPosition = accumulator.findIndex((item) => item.title == title)
              if (keyObjectPosition >= 0) {
                accumulator[keyObjectPosition].data.push(currentValue)
                return accumulator
              } else {
                return accumulator.concat({ data: [currentValue], title: title })
              }
          }, [])
       this.setState({dataArr:groupedData ,isloading:false})
      await analytics.logScreenView('offline_session_screen')
    }

    renderListEmptyView = () => {
        return (
          <View style={styles.listEmptyView}>
            <EmptyTrackingTypeIcon width={110} height={100}/>
            <Text style={styles.emptyListTextStyle}>{I18n.t('stats_screen.empty_list_today_message')}</Text>
          </View>
        )
      }
    renderListItem=({item,index})=>{
    const {themeSelected} = this.props
    let itemBackgroundColor = Colors.white
    themeSelected === 'dark' && (itemBackgroundColor = Colors.rgb_000000)
      return(
        <View style={[styles.standaloneRowFront, {backgroundColor: itemBackgroundColor}]}>
            <StatsListItem item={item} typeSelected={KeyUtils.TRACKING_TYPE_PUMPING} isImperial={this.state.isImperial} units={this.state.units} {...this.props} isOfflineSession={true} editData={() => {}}/>
        </View>
        )
    }

    render(){
    const {navigation,themeSelected} = this.props;
    let itemBackgroundColor = Colors.white
    themeSelected === 'dark' && (itemBackgroundColor = Colors.rgb_000000)
      return(
        <SafeAreaView style={styles.container}>
          <HeaderTitle title={I18n.t('tracking.offline_session' )} onBackPress={()=>navigation.goBack()}/>
            <SectionList
                sections={this.state.dataArr}
                stickySectionHeadersEnabled={true}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => item + index}
                renderItem={this.renderListItem}
                ListEmptyComponent={(this.state.dataArr).length==0 && !this.state.isloading && this.renderListEmptyView}
                renderSectionHeader={({ section: { title , data} }) => (
                <View style={[styles.headerList, {backgroundColor: itemBackgroundColor}]}>
                <Text style={[styles.title,{color:this.textColor}]}>{title }</Text>
                <Text style={[styles.counter,{color:this.textColor}]}>{`${I18n.t('tracking.total_Pumping' )} : ${data.length}`}</Text>
                </View>
                )}
              />
        </SafeAreaView>
      )
    }
  }
const mapStateToProps = (state) => ({
    themeSelected: state.app.themeSelected,
  });

export default connect(mapStateToProps)(OfflineSessionScreen);
