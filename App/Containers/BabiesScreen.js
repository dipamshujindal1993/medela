import React, {Component} from 'react';
import {FlatList, I18nManager, Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import styles from './Styles/BabiesScreenStyles';
import BackIcon from '@svg/arrow_back';
import I18n from '@i18n';
import Colors from '@resources/Colors';
import {connect} from 'react-redux';
import ForwardIcon from '@svg/arrow_right';
import {Constants} from "@resources";
import AddIcon from '@svg/ic_add_baby_plus';
import HomeActions from '@redux/HomeRedux';
import {getRealmDb} from "../Database/AddBabyDatabase";
import { verticalScale, moderateScale } from "@resources/Metrics";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BabiesScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      babiesList: [],
      isLoading: false,
      realmDb: null
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount() {
    const {isInternetAvailable, navigation} = this.props
    this.focusListener = navigation.addListener('willFocus',async () => {
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
      const {realmDb} = this.state
      if (realmDb == null || realmDb.isClosed) {
          let realmDb=await getRealmDb()
          this.setState({realmDb: realmDb}, () => {
            this.init()
          })
      } else {
        setTimeout(()=>{
          this.setState({babiesList:[]})
          this.init()
        },500)

      }
    })
    await analytics.logScreenView('babies_screen')
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  init = () => {
    const {realmDb} = this.state
    const {getMyBabies, isInternetAvailable} = this.props;
    let babyArr = realmDb.objects('AddBaby');
    let babies = JSON.parse(JSON.stringify(babyArr))
    let userMotherProfile = realmDb.objects('UserMotherProfile')
    console.log('userProfile--', JSON.stringify(userMotherProfile))
    if (babies.length>0){
      babies = babies.filter((e) => {
        if(userMotherProfile[0] && userMotherProfile[0] != undefined && userMotherProfile[0].username && userMotherProfile[0].username != undefined){
          return e.username===userMotherProfile[0].username &&  !e.isDeleted
        }else {
          return false
        }
      })
    }else {
      babies = babies.filter((e) => {
        return !e.isDeleted
      })
    }

    babies = babies.map((e) => ({...e, imageRender: false,imageLoadingError:null}))
    this.setState({babiesList: babies})
    if (isInternetAvailable) {
      getMyBabies()
    }else{
      //this.setState({babiesList: babies})
    }

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {babiesSuccess, babiesFailure, babies} = this.props;
    const {realmDb,babiesList} = this.state;
    if (babiesSuccess != prevProps.babiesSuccess && babiesSuccess) {

      let bb=JSON.parse(JSON.stringify(babies));
      let babyArr = realmDb.objects('AddBaby');
      let localBabies = JSON.parse(JSON.stringify(babyArr));
      //for smooth rendering
      let sortingBabySuccessBabiesAccordingToLocalDb=[];
      babiesList.forEach((val)=>{
        let babyItemFromBabiesSuccess=bb.find((serverBaby)=>val.babyId==serverBaby.babyId);
        if(babyItemFromBabiesSuccess!=undefined){
          sortingBabySuccessBabiesAccordingToLocalDb.push({
            ...babyItemFromBabiesSuccess,
            imageRender:false,
            imageLoadingError:null,
            imagePath:val.imagePath!=null&&val.imagePath!=''?val.imagePath:null
          })
        }
      })
      this.setState({babiesList:sortingBabySuccessBabiesAccordingToLocalDb})
    }

  }

  getImageUrl = (item,index) => {
    const {imagePath,babyId,imageLoadingError}=item;
    if(imagePath!=null&&imagePath!=''&& imagePath.length>0){
      return {uri:imagePath}
    }
    else if(babyId&&imagePath==null&&imageLoadingError==null){
      return  {uri:`${Constants.BASE_URL}rest/baby/picture/${babyId}`}
    }
    else return require('../Images/png/ic_baby_default.png')
  }
  itemOnClick = (item) => {
    const {navigation} = this.props
    navigation.navigate('BabyInfoScreen', {selectedBabyData: item})
  }

  onListImageLoading_Error(index,item) {
    console.log('render Error',index)
    const {babiesList} = this.state
    babiesList[index].imageRender = true
    babiesList[index].imageLoadingError = true
    //setTimeout(()=>{
    this.setState({babies: babiesList})
    //},100)

  }

  renderListItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => this.itemOnClick(item)}>
        <View style={styles.listItemViewStyle}>
          <View style={styles.imageContentView}>
            <Image
              defaultSource={require('../Images/png/ic_baby_default.png')}
              //source={item.imageLoadingError==false||item.imageLoadingError==undefined||item.imageLoadingError==null?{uri: `${Constants.BASE_URL}rest/baby/picture/${item.babyId}`}:require('../Images/png/ic_baby_default.png')}
              onError={(err) => {
                this.onListImageLoading_Error(index,item)
              }}
              style={{width: 70, height: 70, borderRadius: 35}}
              source={this.getImageUrl(item,index)}
            />
            <View style={styles.itemTextViewStyle}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{item.name}</Text>
            </View>
          </View>
          <View style={styles.iconWrapper}>
            <ForwardIcon style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}} fill={Colors.rgb_898d8d}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  addBabyItem = () => {
    const {navigation} = this.props
    return (
      <TouchableOpacity onPress={() => navigation.navigate('AddBabyScreen')}>
        <View style={styles.listItemViewStyle}>
          <View style={styles.imageContentView}>
            <AddIcon width={70} height={70}/>
            <View style={styles.itemTextViewStyle}>
              <Text maxFontSizeMultiplier={1.7} style={[styles.itemTitleTextStyle,{color:this.textColor}]}>{I18n.t('generic.add_new_baby')}</Text>
            </View>
          </View>
          <View style={styles.iconWrapper}>

          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {navigation} = this.props;
    let {babiesList} = this.state;
    let filteredData = JSON.parse(JSON.stringify(babiesList))
    filteredData && filteredData.length > 0 && filteredData.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.birthday) - new Date(a.birthday);
    });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerView}>
          <TouchableOpacity
            accessibilityLabel={I18n.t("accessibility_labels.back_label")}
            accessible={true}
            onPress={() => navigation.goBack()}
            style={{padding: 10}}>
            <BackIcon fill={Colors.rgb_fecd00} width={moderateScale(30)} height={verticalScale(30)} style={{marginLeft: 10,transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}/>
          </TouchableOpacity>
          <Text maxFontSizeMultiplier={1.7} style={[styles.headerTextStyle,{color:this.textColor}]}> {I18n.t('more.baby_profile')}</Text>
        </View>
        <View style={styles.contentView}>
          <FlatList
            contentContainerStyle={styles.verticalListStyle}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            data={filteredData}
            renderItem={this.renderListItem}
            ListFooterComponent={this.addBabyItem}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  babies: state.home.babies,
  babiesSuccess: state.home.babiesSuccess,
  babiesFailure: state.home.babiesFailure,
  themeSelected: state.app.themeSelected,
  isInternetAvailable: state.app.isInternetAvailable,
})

const mapDispatchToProps = (dispatch) => ({
  getMyBabies: () => dispatch(HomeActions.getMyBabies()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BabiesScreen);
