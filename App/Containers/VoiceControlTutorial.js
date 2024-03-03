import React from 'react'
import {View, Dimensions, ScrollView, Text } from 'react-native';
import I18n from '@i18n';
import Colors from '@resources/Colors';
import styles from './Styles/VipPackScreenStyles';
import Button from '@components/Button';
import { connect } from 'react-redux';
import UserActions from '@redux/UserRedux';
const {width, height} = Dimensions.get('window');
import VipTutorial1 from '@svg/ic_vip_tutorial1';
import VipTutorial2 from '@svg/ic_vip_tutorial2';
import VipTutorial4 from '@svg/ic_vip_tutorial4';
import VipTutorial5 from '@svg/ic_vip_tutorial5';
import VipTutorial6 from '@svg/ic_vip_tutorial6';
import VipTutorial7 from '@svg/ic_vip_tutorial7';
import HeaderTitle from '@components/HeaderTitle';
import CustomViewPager from '@components/CustomViewPager'
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

const tutorial_data = [
  {
    image: <VipTutorial1 style={styles.image} fill = {Colors.rgb_000000}/>,
    heading: I18n.t('vip_pack.tutorial_title1'),
    title:  I18n.t('vip_pack.tutorial_instruction1')
  },
  {
    image: <VipTutorial2 style={styles.image} fill = {Colors.rgb_000000} />,
    title: I18n.t('vip_pack.tutorial_instruction2'),
  },
  {
    image: require('../Images/png/voice_control_instruction3.png'),
    renderImage: true,
    title: I18n.t('vip_pack.tutorial_instruction3'),
  },
  {
    image: <VipTutorial4 style={styles.image} fill = {Colors.rgb_000000} />,
    title: I18n.t('vip_pack.tutorial_instruction4'),
  },
  {
    image: <VipTutorial5 style={styles.image} fill = {Colors.rgb_000000} />,
    title: I18n.t('vip_pack.tutorial_instruction5'),
  },
  {
    image: require('../Images/png/ic_vip_tutorial6.png'),
    renderImage: true,
    title: I18n.t('vip_pack.tutorial_instruction6'),
  },
  {
    image: <VipTutorial7 style={styles.image} fill = {Colors.rgb_000000}                                                           />,
    title: I18n.t('vip_pack.tutorial_instruction7'),
  },
]

class VoiceControlTutorial extends React.Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  async componentDidMount(){
    await analytics.logScreenView('voice_control_tutorial_screen')
  }

	render(){
    return(
      <ScrollView showsVerticalScrollIndicator={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}>
        <View style={{flex:1}}>
          <View style={styles.headerTitleView}>
            <Text maxFontSizeMultiplier={1.7} style={styles.headerTextStyle}> {I18n.t('vip_pack.voice_control')}</Text>
          </View>
          <CustomViewPager
            data={tutorial_data}
            loop={false}
            autoscroll={false}
            indicatorActiveColor={Colors.rgb_ffcd00}
            indicatorStyle={{marginVertical: 24}}
            local={true}
            localSVG={true}
          />
          <View style={styles.bottonContainer}>
            <Button
              title={I18n.t('generic.close').toUpperCase()}
              onPress={()=> this.props.navigation.goBack()}
              style={{ height: 40, borderRadius: 16, backgroundColor:'white'}}
              textStyle={styles.vipClosetextStyles}
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,
  userProfile: state.user.userProfile,
  userProfileSuccess: state.user.userProfileSuccess,
  userProfileFailure: state.user.userProfileFailure,
  remoteConfig: state.remoteConfig
});

const mapDispatchToProps = (dispatch) => ({
  getUserProfile: () => dispatch(UserActions.getUserProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(VoiceControlTutorial);
