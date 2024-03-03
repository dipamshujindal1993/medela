import {I18nManager, Platform, StyleSheet,Dimensions} from 'react-native'
import {
  Colors,
  Fonts,
  Metrics
} from '@resources';
const { width } = Dimensions.get("window");
import {moderateScale} from '@resources/Metrics'
import DeviceInfo from 'react-native-device-info'
export default StyleSheet.create({
    container: {
      width: '100%',
      height: 48,
      alignItems:'center',
      justifyContent:'center',
      flexDirection: 'row',
    },
    headerTextStyle: {
      color: Colors.rgb_888B8D,
      ...Fonts.style.bold_17,
      alignItems:'center',
      marginRight:2,
      justifyContent:'center',
      writingDirection:I18nManager.isRTL?'rtl':'ltr',
      ...width<350 &&{fontSize:moderateScale(14)},
      width: DeviceInfo.getFontScale()>1.3?'70%':'auto',
    },
    mainHeaderTextStyle:{
      color: Colors.rgb_888B8D,
      ...Fonts.style.bold_22,
      alignItems:'center',
      justifyContent:'center',
      marginHorizontal : Metrics.moderateScale._15,
      writingDirection:I18nManager.isRTL?'rtl':'ltr'
    },
    headerRightView: {
      flexDirection: 'row',
      position:'absolute',
      right:2,
      bottom:0,
      top:0,
      alignItems:'center'
    },
    baby:{
        width:30,
        height:30,
        alignSelf:'center',
        marginLeft:5,
        borderRadius: 50
    },
    backIconViewStyle:{
      position:'absolute',
      left:10,
      bottom:0,
      top:0,
      justifyContent:'center',
      height: 48,
      width: 48,
    },
    shareIconStyle:{
      height: 48,
      width: 48,
      justifyContent:'center',
      paddingLeft: 15
    },
    calenderIconStyle:{
      height: 48,
      width: 48,
      justifyContent:'center',
      alignItems: 'center'
    },
    babyIconStyle:{
      height: 48,
      width: 48,
      justifyContent:'center',
      paddingRight: 25,
    },
    iconStyle:{
      marginHorizontal: 5,
      justifyContent:'center',
      minHeight: 48,
      minWidth: 48
    },
    addBabyStyle:{
      backgroundColor:'white',
      width:'100%',
      marginTop:50,
      shadowOffset: { width: 2, height: 2, },
      shadowColor: 'gray',
      shadowOpacity: 0.3,
      ...Platform.select({
        android: {
          elevation: 8,
        },
      }),
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
    padding:10
    },
    addBabyItemStyle:{
      flexDirection:'row',
      marginVertical:10,
      marginHorizontal:10,
      alignItems:'center',
    },
    addBabyBottomViewStyle:{
      flexDirection:'row',
      marginVertical:10,
      marginHorizontal:10,
      alignItems:'center'
    },
    babyNameTextStyle:{
      ...Fonts.style.bold_16,
      color:Colors.rgb_898d8d,
      marginHorizontal:15,
    },
    babyImage:{
      width: 44,
      height: 44,
      borderRadius:50
    },
    ctaView: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      marginTop: 4,
    },
    cta: {
      ...Fonts.style.bold_14,
      textAlign: 'center',
      letterSpacing: 0.5,
      color: Colors.rgb_ffcd00,
    },
    touchStyle: {
      minWidth: 48,
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15
    }
})
