import React from 'react';
import {Animated, FlatList, Text, TouchableOpacity, View,} from 'react-native';
import styles from './Styles/ChecklistDetailScreenStyles'
import SwitchOnIcon from '@svg/ic_switch_on'
import SwitchOffIcon from '@svg/ic_switch_off'
import { SwipeRow} from 'react-native-swipe-list-view';
import {addDeletedItem, deleteItem, updateItems} from "@database/ChecklistDatabase";
import I18n from 'react-native-i18n'
import {connect} from 'react-redux';
import Colors from '@resources/Colors';
import {Constants} from "../Resources";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()
const rowTranslateAnimatedValues = {};

class SwiperCheckList extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      listData:[],
      closeOnPress:false
    }
    this.rows = {};
    this.textColor = this.props && this.props.textColor
  }

  onSwipeValueChange = swipeData => {
    const {itemsList, enableDisable, deleteCallback,extraData,realm} = this.props
    const {key, value} = swipeData;
    if (value < -85 &&
      !this.animationIsRunning
    ) {
      this.animationIsRunning = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
       /* const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === key);
        newData.splice(prevIndex, 1);*/
        //setListData(newData);

        let item = {
          uuid: key,
          currentUserUuid: this.props.currentUserId
        }
        addDeletedItem(realm,item).then((e) => {
          deleteCallback(key)

        })

        this.animationIsRunning = false;
      });
    }
  };

  renderItem = ({ item ,index}) => {
    const {isEnabled, uuid, key} = item
    const { enableDisable, deleteCallback,selectedItemUuid,currentUserId,realm, themeSelected} = this.props
    const {} = item;

    const {closeOnPress}=this.state
    let rowFrontColor = Colors.white
    themeSelected === "dark" && (rowFrontColor = Colors.rgb_000000)
    return    <SwipeRow
      ref={ref => { this.rows[key] = ref }}
      rightOpenValue={-75}
                        disableRightSwipe={true}
                        key={this.rows[key]} closeOnRowPress={true}>
      <View style={styles.standaloneRowBack}>
        <TouchableOpacity accessibilityLabel={I18n.t('accessibility_labels.delete_for')+item.title} style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={()=>{
          let item = {
            uuid: key,
            currentUserUuid: this.props.currentUserId
          }
          this.setState({closeOnPress:true})
          this.rows[key].closeRow()
          addDeletedItem(realm,item).then((e) => {

            deleteCallback(key)


          })
        }}>
          <Text maxFontSizeMultiplier={1.7} style={styles.backTextWhite}>{I18n.t('generic.delete')}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.standaloneRowFront, {backgroundColor: rowFrontColor}]}>
        <View style={[styles.itemDetailStyle, {backgroundColor: rowFrontColor}]}>
          <Text maxFontSizeMultiplier={1.7} accessibilityLabel={item.title} style={[styles.itemDetailTitleStyle,{color:this.props.textColor}]}>{item.title}</Text>
          <TouchableOpacity  accessibilityLabel={I18n.t('accessibility_labels.switch')+item.title} onPress={async() => {
            item.isEnabled = !isEnabled
            if(isEnabled){
              let param = {
                'checklist_item_complete': item.title
              }
              await analytics.logEvent(Constants.CHECKLIST_MANAGEMENT, param);
            }
            let obj = {
              selectedItemUuid,    // primary key
              uuid: uuid,
              isEnabled: !isEnabled,
              currentUserId
            }
            console.log('isEnabled,,',isEnabled,obj)
            isEnabled ? deleteItem(realm,obj).then((res)=>{
              enableDisable(isEnabled,uuid)
            }) : updateItems(realm,obj).then((e)=>{
              enableDisable(isEnabled,uuid)
            })
          }} style={styles.switchStyle}>
            {isEnabled ? <SwitchOnIcon width={50} height={50} style={styles.switchStyle}/> :
              <SwitchOffIcon width={50} height={50} style={styles.switchStyle}/>}
          </TouchableOpacity>
        </View>
      </View>
    </SwipeRow>
  }


  renderHiddenItem = (data,rowMap) => {

    const {item}=data
    const {index}=data

   // console.log('hiddenIndex--',index,rowMap)

    return  <View style={styles.rowBack}>
      <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={()=>{
        //alert(index)
      }}>
        <Text maxFontSizeMultiplier={1.7} style={styles.backTextWhite}>{I18n.t('generic.delete')}</Text>
      </TouchableOpacity>
    </View>
  };

  render(){
    const {itemsList,extraData} = this.props
     let arr = [...itemsList]
  arr.forEach((_, i) => {
    rowTranslateAnimatedValues[`${_.uuid}`] = new Animated.Value(1);
  });
  let arrList = itemsList.map((_, i) => ({..._, key: `${_.uuid}`, title: _.title, uuid: _.uuid}))
    let swiperList=arrList/*.sort(function (a, b) {
      return a.isEnabled - b.isEnabled
    });*/

    return (
      <View style={styles.container}>
        <FlatList
          data={swiperList}
          renderItem={this.renderItem}
          keyExtractor={(item,index) => item.id || index.toString()}
          extraData={extraData}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected
});

export default connect(mapStateToProps, null)(SwiperCheckList);
