import React from 'react';
import {I18nManager, Platform, Text, View,Pressable} from 'react-native';
import {connect} from 'react-redux';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import BackIcon from '@svg/arrow_back';
import BabyIcon from '@svg/ic_baby';
import BabyIconSelected from '@svg/ic_baby_selected';
import StatsIcon from '@svg/ic_stats';
import ChatIcon from '@svg/ic_chat';
import ChatIconSelected from '@svg/ic_chat_selected';
import MoreIcon from '@svg/ic_more';
import MoreIconSelected from '@svg/ic_more_selected';
import AddIcon from '@svg/ic_tab_add';
import StatsIconSelected from '@svg/ic_stats_selected';
import {Colors, ApplicationStyles} from '@resources';
import NavActions from '@redux/NavigationRedux';
import NavigationService from '@services/NavigationService';
import BreastFeedingPumpingScreen from '@containers/BreastFeedingPumpingScreen';
import BreastFeedingScreen from '@containers/BreastFeedingScreen';
import ChecklistScreen from "@containers/ChecklistScreen";
import ChecklistDetailScreen from "@containers/ChecklistDetailScreen";
import MoveMilkInventory from "@containers/MoveMilkInventory"
import MyBabyScreen from '@containers/MyBabyScreen';
import StatsScreen from '@containers/StatsScreen';
import TrackingScreen from '@containers/TrackingScreen';
import AddBabyScreen from '@containers/AddBabyScreen';
import ChatScreen from '@containers/ChatScreen';
import MoreScreen from '@containers/MoreScreen';
import SleepScreen from '@containers/SleepScreen';
import ContractionScreen from '@containers/ContractionScreen';
import NappyTrackingScreen from '@containers/NappyTrackingScreen';
import BottleTrackingScreen from '@containers/BottleTrackingScreen';
import GrowthScreen from '@containers/GrowthScreen';
import WeightScreen from '@containers/WeightScreen';
import BleSetupScreen from '@containers/BleSetupScreen';
import BleDevicesListScreen from '@containers/BleDevicesListScreen';
import BleSelectedDeviceScreen from '@containers/BleSelectedDeviceScreen';
import BlePairingScreen from '@containers/BlePairingScreen';
import BleConnectionCompleteScreen from '@containers/BleConnectionCompleteScreen';
import BlePumpDetailScreen from '@containers/BlePumpDetailScreen';
import BleConfirmationScreen from '@containers/BleConfirmationScreen';
import BleScannedDevicesList from '@containers/BleScannedDevicesList'
import StatsExportListScreen from '@containers/StatsExportListScreen';
import TestsScreen from '@containers/TestsScreen';
import BreastfeedingConfidenceScreen from '@containers/BreastfeedingConfidenceScreen';
import ContentPersonalizationScreen from '@containers/ContentPersonalizationScreen';
import BabyInfoScreen from '@containers/BabyInfoScreen';
import HelpScreen from '@containers/HelpScreen';
import MotherInfoScreen from '@containers/MotherInfoScreen';
import SettingScreen from '@containers/SettingScreen';
import FaqScreen from '@containers/FaqScreen';
import LegalScreen from '@containers/LegalScreen';
import LegalTermsConditions from "@containers/LegalTermsConditions";
import LicensesScreen from "@containers/LicensesScreen";
import ImprintScreen from "@containers/ImprintScreen";
import VipPackScreen from "@containers/VipPackScreen";
import VoiceControlTutorial from "@containers/VoiceControlTutorial";
import Measurements from '@containers/Measurements';
import Notifications from '@containers/Notifications';
import Feedback from '@containers/Feedback';
import Languages from '@containers/Languages';
import ChatAvatar from '@containers/ChatAvatar';
import ChatBot from '@containers/ChatBot';
import ContentPersonalizationSuccess from '@containers/ContentPersonalizationSuccess';
import BreastfeedingConfidenceSuccess from '@containers/BreastfeedingConfidenceSuccess';
import BabiesScreen from '@containers/BabiesScreen';
import MorePumpListScreen from '@containers/MorePumpListScreen'
import ArticleDetailsScreen from '@containers/ArticleDetailsScreen';
import FavouriteArticles from '@containers/FavouriteArticles';
import ProblemSolver from '@containers/ProblemSolver';
import BadSessionArticles from '@containers/BadSessionArticles';
import ChangePassword from '@containers/ChangePassword';
import EditVirtualFreezerInventory from '@components/EditVirtualFreezerInventory'
import styles from './Styles/NavigationStyles';
//import I18n from '@i18n';
import I18n from 'react-native-i18n';
import EditBreastfeedingScreen from "@containers/EditBreastFeedingScreen";
import EditPumpingScreen from "@containers/EditPumpingScreen";
import EditSleepScreen from "@containers/EditSleepScreen";
import EditWeightScreen from "@containers/EditWeightScreen";
import EditGrowthScreen from "@containers/EditGrowthScreen";
import EditBottleTrackingScreen from "@containers/EditBottleTrackingScreen";
import EditNappyTrackingScreen from "@containers/EditNappyTrackingScreen";
import BleQuickStartScreen from "@containers/BleQuickStartScreen";
import BleFrontPanelScreen from "@containers/BleFrontPanelScreen";
import PairedPumpListScreen from "@containers/PairedPumpListScreen";
import EditContractionScreen from "@containers/EditContractionScreen";
import AsyncStorage from "@react-native-community/async-storage";
import KeyUtils from "@utils/KeyUtils";
import {fromBottom, fromRight} from "react-navigation-transitions";
import FreezerTrackingScreen from "@containers/FreezerTrackingScreen";
import CheckAvailableInventory from "@containers/CheckAvailableInventory";
import OfflineSessionScreen from '../Containers/OfflineSessionScreen';
import BottomBanner from "@components/BottomBanner";
import { Analytics } from '@services/Firebase';

function AppStack(props) {
  const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
    if (prevScene && (nextScene.route.routeName === 'NappyTrackingScreen' ||
       nextScene.route.routeName === 'WeightScreen' ||
       nextScene.route.routeName === 'GrowthScreen' ||
       nextScene.route.routeName === 'SleepScreen' ||
       nextScene.route.routeName === 'BreastFeedingPumpingScreen' ||
       nextScene.route.routeName === 'BreastFeedingScreen' ||
       nextScene.route.routeName === 'BottleTrackingScreen' ||
       nextScene.route.routeName === 'ContractionScreen' ||
       nextScene.route.routeName === 'ChecklistScreen' ||
       nextScene.route.routeName === 'TestsScreen') && (prevScene.route.routeName === 'TrackingScreen')) {
       return fromBottom(300);
     }
    return fromRight(300);
  }

  const createTrackingStack = (title, appStack) => {
    return createStackNavigator(
      {
        TrackingScreen: {
          screen: TrackingScreen,
          navigationOptions: {
            header: null,
          },
        },
        ...appStack,
      },
      {
        headerBackTitleVisible: false,
        defaultNavigationOptions: {
          ...Platform.OS=='ios'&&{gesturesEnabled: false},
          headerBackImage:
            Platform.OS === 'ios' ? (
              <BackIcon
                //style={ApplicationStyles.backIcon}
                style={{...ApplicationStyles.backIcon,...{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}}
                fill={Colors.rgb_fecd00}
              />
            ) : null,
          headerStyle: ApplicationStyles.noShadowHeaderStyle,
          headerTitleStyle: ApplicationStyles.titleStyle,
          headerTintColor: Colors.rgb_fecd00,
          header: null,
          // headerBackImage: Platform.OS === 'ios' ?
          //   <BackIcon style={ApplicationStyles.backIcon} fill={Colors.rgb_fecd00}/> : null,
          // headerStyle: ApplicationStyles.noShadowHeaderStyle,
          // headerTitleStyle: ApplicationStyles.titleStyle,
          // headerTintColor: Colors.rgb_fecd00
        },
        navigationOptions: ({navigation}) => {
          return {
            tabBarVisible: false,
          };
        },
        transitionConfig: (nav) => handleCustomTransition(nav)
      },
    );
  };
  const createMyBabyStack = (title, appStack) => {
    return createStackNavigator(
      {
        MyBabyScreen: {
          screen: MyBabyScreen,
          path: 'baby',
          navigationOptions: {
            header: null,
          },
        },
        ...appStack,
      },
      {
        headerBackTitleVisible: false,
        defaultNavigationOptions: {
          ...Platform.OS=='ios'&&{gesturesEnabled: false},
          header: null,
          // headerBackImage:
          //   Platform.OS === 'ios' ? (
          //     <BackIcon
          //       style={ApplicationStyles.backIcon}
          //       fill={Colors.rgb_fecd00}
          //     />
          //   ) : null,
          // headerStyle: ApplicationStyles.noShadowHeaderStyle,
          // headerTitleStyle: ApplicationStyles.titleStyle,
          // headerTintColor: Colors.rgb_fecd00,
          // headerTitle: (
          //   <HeaderTitle
          //     title={I18n.t('my_baby.add_baby')}
          //     style={styles.headerTitleStyle}
          //   />
          // ),
        },
        navigationOptions: ({navigation}) => {
          const showUpdatedtTabBar = navigation.state.routes.length > 1? false: true
          return {
            tabBarVisible: showUpdatedtTabBar,
          };
        },
      },
    );
  };
  const createStatsNavigator = (title, appStack) => {
    return createStackNavigator(
      {
        StatsScreen: {
          screen: StatsScreen,
          navigationOptions: {
            header: null,
          },
        },
        ...appStack,
      },
      {
        headerBackTitleVisible: false,
        defaultNavigationOptions: {
          ...Platform.OS=='ios'&&{gesturesEnabled: false},
          header: null,
          // headerBackImage:
          //   Platform.OS === 'ios' ? (
          //     <BackIcon
          //       style={ApplicationStyles.backIcon}
          //       fill={Colors.rgb_fecd00}
          //     />
          //   ) : null,
          // headerStyle: ApplicationStyles.noShadowHeaderStyle,
          // headerTitleStyle: ApplicationStyles.titleStyle,
          // headerTintColor: Colors.rgb_fecd00,
          // headerTitle: (
          //   <HeaderTitle
          //     title={I18n.t('my_baby.add_baby')}
          //     style={styles.headerTitleStyle}
          //   />
          // ),
        },
        navigationOptions: ({navigation}) => {
          const showUpdatedtTabBar = navigation.state.routes.length > 1? false: true
          return {
            tabBarVisible: showUpdatedtTabBar,
          };
        },
      },
    );
  };

  const createMoreStack = (title, appStack) => {
    return createStackNavigator(
      {
        MoreScreen: {
          screen: MoreScreen,
          navigationOptions: {
            header: null,
          },
        },
        ...appStack,
      },
      {
        headerBackTitleVisible: false,
        defaultNavigationOptions: {
          ...Platform.OS=='ios'&&{gesturesEnabled: false},
          header: null,
        },
        navigationOptions: ({navigation}) => {
          const showUpdatedtTabBar = navigation.state.routes.length > 1? false: true
          return {
            tabBarVisible: showUpdatedtTabBar,
          };
        },
      },
    );
  };

  const createChatStack = (appStack) => {
    return createStackNavigator(
      {
        ChatScreen: {
          screen: ChatScreen,
          navigationOptions: {
            header: null,
          },
        },
        ChatBot: {
          screen: ChatBot,
          navigationOptions: {
            header: null
          },
        },
        ...appStack
      },
      {
        defaultNavigationOptions: {
          ...Platform.OS=='ios'&&{gesturesEnabled: false},
        },
        navigationOptions: ({navigation}) => {
          return {
            tabBarVisible: navigation.state.routes[navigation.state.index].routeName === 'ChatBot' ? false : true,
          };
        },
      }
    );
  };

  const getAppStack = () => {
    return {
      // Add other child screens.
      AddBabyScreen,
      ChecklistScreen:{
        screen:ChecklistScreen,
        navigationOptions:{
          header:null
        }
      },
      ChecklistDetailScreen:{
        screen:ChecklistDetailScreen,
        navigationOptions:{
          header:null
        }
      },
      BreastFeedingPumpingScreen,
      BreastFeedingScreen,
      SleepScreen,
      NappyTrackingScreen,
      BottleTrackingScreen,
      GrowthScreen,
      WeightScreen,
      BleSetupScreen,
      BleDevicesListScreen,
      BleSelectedDeviceScreen,
      BlePairingScreen,
      BleConnectionCompleteScreen,
      BlePumpDetailScreen,
      BleConfirmationScreen,
      BleScannedDevicesList,
      MorePumpListScreen,
      EditGrowthScreen,
      EditWeightScreen,
      EditSleepScreen,
      EditPumpingScreen,
      StatsExportListScreen,
      EditBottleTrackingScreen,
      EditNappyTrackingScreen,
      TestsScreen,
      BreastfeedingConfidenceScreen,
      ContentPersonalizationScreen,
      BabyInfoScreen,
      HelpScreen,
      MotherInfoScreen,
      SettingScreen,
      FaqScreen,
      LegalScreen,
      LegalTermsConditions,
      LicensesScreen,
      ImprintScreen,
      VipPackScreen,
      VoiceControlTutorial,
      Measurements,
      Notifications,
      Feedback,
      Languages,
      ChatAvatar,
      ContractionScreen,
      EditContractionScreen,
      FreezerTrackingScreen,
      CheckAvailableInventory,
      MoveMilkInventory,
      ArticleDetailsScreen: {
        screen:ArticleDetailsScreen,
        path: 'articleDetailsScreen/:articleId',
        navigationOptions: {
          tabBarVisible:false,
          tabBarOptions:{
            tarBarVisible: false,
          }
        },
      },
      FavouriteArticles,
      ProblemSolver,
      BadSessionArticles,
      EditVirtualFreezerInventory,
      ContentPersonalizationSuccess,
      BreastfeedingConfidenceSuccess,
      BabiesScreen,
      EditBreastfeedingScreen:{
        screen:EditBreastfeedingScreen,
        navigationOptions: {
          tabBarVisible:false,
          tabBarOptions:{
            tarBarVisible: false,
          }
        },
      },
      BleQuickStartScreen,
      BleFrontPanelScreen,
      PairedPumpListScreen,
      ChangePassword,
      OfflineSessionScreen
    };
  };
  const renderNav = (routeName, tintColor, focused, Icon, IconSelected, navigation,routeNameKey,index) => {
    const {themeSelected}=props
    let lightModeFocusText = themeSelected === 'dark' ? Colors.rgb_ffcd00 : Colors.rgb_000000
    let lightModeTextSize = themeSelected === 'dark' ? 'normal' : 'bold'
    let Icon1 = focused ? themeSelected === 'dark' ? Icon : IconSelected : Icon
    return (
      <Pressable key={index+''} onPress={()=>{
          navigation.navigate(routeNameKey)
        }} style={styles.tabView}>
        {routeName !== 'Add' ? (
          <Icon1 height={21} width={21} fill={tintColor} />
        ) : (
          <Icon
            height={70}
            width={70}
            fill={tintColor}
            style={styles.bottomTabAddIconStyle}
          />
        )}
        <Text
          allowFontScaling={false}
          style={[
            styles.bottomTabLabelStyle,
            {color: focused ? lightModeFocusText : themeSelected === 'dark'? Colors.white : Colors.rgb_767676,textAlign:'center',  
            fontWeight: focused ? lightModeTextSize : 'normal'},

          ]}>
          {routeName !== 'Add' ? routeName : ''}
        </Text>
      </Pressable>
    );
  };

  // const customTabs = ({navigation}) => ({
  //   tabBarIcon: ({focused, horizontal, tintColor}) => {
  //     const {routeName} = navigation.state;
  //     if (routeName === 'Baby') {
  //       return renderNav(
  //         I18n.t('tab_bar.my_baby'),
  //         tintColor,
  //         focused,
  //         BabyIcon,
  //       );
  //     } else if (routeName === 'Stats') {
  //       return renderNav(
  //         I18n.t('tab_bar.stats'),
  //         tintColor,
  //         focused,
  //         StatsIcon,
  //       );
  //     } else if (routeName === 'Add') {
  //       return renderNav(routeName, tintColor, focused, AddIcon);
  //     } else if (routeName === 'Chat') {
  //       return renderNav(I18n.t('tab_bar.chat'), tintColor, focused, ChatIcon);
  //     } else if (routeName === 'More') {
  //       return renderNav(I18n.t('tab_bar.more'), tintColor, focused, MoreIcon);
  //     }
  //   },
  // });
  const customTabComponent=(props)=>{
    const {themeSelected}=props
     return(
       <View>
         <View style={{position:'relative'}}>
           <BottomBanner
             screen={'Tabs'}
             showBanner={true}
             // onClosePress={(item) => this.onCloseBanner(item)}
              onSelected={(item) => this.openScreen(item)}
           />
         </View>
         <View style={[{backgroundColor:themeSelected=='dark'?'#2A2A2A':'white'},styles.customTabStyles]} >
           {props.navigation.state.routes.map((item,index)=>{
             let routeName=item.routeName;
             let focused=props.navigation.isFocused(routeName);
             let tintColor= themeSelected === 'dark' && focused ? Colors.rgb_ffcd00 : focused ? Colors.rgb_000000 : Colors.rgb_888B8D;
             if (routeName === 'Baby') {
              return renderNav(
                I18n.t('tab_bar.my_baby'),
                tintColor,
                focused,
                BabyIcon,
                BabyIconSelected,
                props.navigation,
                routeName,
                index,themeSelected
              );
            } else if (routeName === 'Stats') {
              return renderNav(
                I18n.t('tab_bar.stats'),
                tintColor,
                focused,
                StatsIcon,
                StatsIconSelected,
                props.navigation,
                routeName,index,themeSelected
              );
            } else if (routeName === 'Add') {
              return renderNav(routeName, tintColor, focused, AddIcon,MoreIconSelected,props.navigation,routeName,index);
            } else if (routeName === 'Chat') {
              return renderNav(I18n.t('tab_bar.chat'), tintColor, focused, ChatIcon, ChatIconSelected, props.navigation,routeName,index,themeSelected);
            } else if (routeName === 'More') {
              return renderNav(I18n.t('tab_bar.more'), tintColor, focused, MoreIcon,MoreIconSelected,props.navigation,routeName,index,themeSelected);
            }
           })}
         </View>
       </View>
     )
   }
  const createTabBar = createBottomTabNavigator(
    {
      Baby: createMyBabyStack('', getAppStack()),
      Stats: createStatsNavigator('',getAppStack()),
      Add: createTrackingStack('', getAppStack()),
      Chat: createChatStack('', getAppStack()),
      More: createMoreStack('', getAppStack()),
    },
    {
      //defaultNavigationOptions: customTabs,
      animationEnabled: true,
      swipeEnabled: true,
      tabBarPosition: 'bottom',
      initialRouteName: 'Baby',
      tabBarComponent:connect(mapStateToProps)(customTabComponent),
      tabBarOptions: {
        activeTintColor: Colors.rgb_ffcd00,
        showLabel: false,
        style: styles.bottomTabBarStyle,
      },
    },
  );
  const getActiveRouteName=(navigationState)=> {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // Dive into nested navigators
    if (route.routes) {
      return getActiveRouteName(route);
    }
    return route.routeName;
  }

  const AppStack = createAppContainer(createTabBar);
  const screensToAvoid=['MyBabyScreen']
  const{themeSelected}=props;
  return (
    <AppStack
      onNavigationStateChange={async (prevState, currentState) => {
        const currentScreen = getActiveRouteName(currentState);
        const prevScreen = getActiveRouteName(prevState);
        const {previousRoute,tabRouteName}=props
        if (prevScreen !== currentScreen&&!screensToAvoid.includes(currentScreen)) {
          // let analytics=new Analytics()
          // await analytics.logScreenView(currentScreen);
        }
        if (currentScreen==='MyBabyScreen' || currentScreen==='MoreScreen' || currentScreen==='StatsScreen' || currentScreen==='ChatScreen') {
         AsyncStorage.setItem(KeyUtils.SELECTED_TAB_NAME,currentScreen+'')
        }
      }}
      ref={(navigatorRef) =>
        NavigationService.setTopLevelNavigator(navigatorRef)
      }
      theme={themeSelected}
      // enableURLHandling={false}
    />
  );
}

const mapStateToProps = (state) => ({
  rehydrated: state.app.rehydrated,
  signedIn: state.app.signedIn,
  themeSelected: state.app.themeSelected
});

export default connect(mapStateToProps)(AppStack);
