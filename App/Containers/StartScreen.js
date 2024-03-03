 import React, {Component} from 'react'
 import {  StatusBar, View } from 'react-native'
 import I18n from '@i18n'
 import { Colors } from '@resources'
 import Button from '@components/Button'
 import Slider from '@components/Slider'
 import HeaderMedelaLogo from '@components/HeaderMedelaLogo'
 import Video from 'react-native-video';
 import SplashVideo from '../../splash_video.mp4'
 import styles from './Styles/StartScreenStyles'
 import {connect} from 'react-redux'
 import { Analytics } from '@services/Firebase';

 let analytics = new Analytics()

 class StartScreen extends Component{
  filteredData=[
    {
      title: I18n.t('startup.title1'),
      desc: I18n.t('startup.desc1'),
    },
    {
      title: I18n.t('startup.title3'),
      desc: I18n.t('startup.desc3'),
    },
    {
      title: I18n.t('startup.title4'),
      desc: I18n.t('startup.desc4'),
    },
    {
      title: I18n.t('startup.title5'),
      desc: I18n.t('startup.desc5'),
    }
]
  data = [
    {
      title: I18n.t('startup.title1'),
      desc: I18n.t('startup.desc1'),
    },
   {
     title: I18n.t('startup.title2'),
     desc: I18n.t('startup.desc2'),
   },
   {
     title: I18n.t('startup.title3'),
     desc: I18n.t('startup.desc3'),
   },
   {
     title: I18n.t('startup.title4'),
     desc: I18n.t('startup.desc4'),
   },
   {
     title: I18n.t('startup.title5'),
     desc: I18n.t('startup.desc5'),
   },
 ]

    constructor(props){
      super(props)
      this.state = {
        paused: false
      }
      this.player = null
      this.themeSelected=this.props.themeSelected  && this.props.themeSelected
      this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    }

     async componentDidMount () {
      await analytics.logScreenView('start_screen')
      this.blurSubscription =
        this.props.navigation.addListener(
          'willBlur',
          () => {
            if (this.player && !this.player.state.paused) {
              this.setState({paused : true})
            }
          }
        )
        this.focusSubscription = this.props.navigation.addListener(
          'willFocus',
          async() => {
            this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
            this.setState({paused : false})
          }
        )
    }

    componentWillUnmount () {
      this.blurSubscription.remove()
      this.focusSubscription.remove()
    }

     render(){
         return(
              <View style={{flex:1}}>
                <StatusBar hidden={true}/>
                <Video
                  source={SplashVideo}
                  resizeMode={"cover"}
                  style={styles.video}
                  paused={this.state.paused}
                  repeat={true}
                  playWhenInactive
                  ref={(ref) => {
                    this.player = ref
                  }}  />

                <HeaderMedelaLogo style={styles.logo}/>

                <View style={styles.sliderContainer}>
                  <Slider
                      data={I18n.locale == 'en-US'?this.data:this.filteredData}
                      // data={this.data}
                      loop={true}
                      autoscroll={true}
                      animation={false}
                      indicatorActiveColor={Colors.rgb_ffcd00}
                      indicatorStyle={styles.indicatorStyle}
                      timer={6000}
                      textColor={this.textColor}
                      //local
                      //localSVG
                  />
                </View>

                <View style={styles.bottonContainer}>
                  <Button
                      title={I18n.t('startup.sign_up_now')}
                      onPress={this.onSignUpPress}
                      style={styles.buttonSignUpContainer}
                  />
                  <Button
                      title={I18n.t('startup.already_have_account')}
                      onPress={this.onLoginPress}
                      style={styles.buttonLoginContainer}
                      textStyle={styles.loginTextStyle}
                  />
                </View>
              </View>
         )
     }

     onLoginPress = () => {
        this.props.navigation.navigate('LoginScreen1')
     }

     onSignUpPress = () => {
        this.props.navigation.navigate('SignUpScreen')
    }
 }

 const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,

})
export default connect(mapStateToProps)(StartScreen);
