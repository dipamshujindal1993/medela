import { Dimensions,StyleSheet } from 'react-native';

const Styles=StyleSheet.create({
    screenWidth:Dimensions.get('screen').width,
    screenHeight:Dimensions.get('screen').height,
    parentCont:{
        justifyContent:'center',
        flexDirection:'row',
        flex:1
    },textCont:{
        //width:40,
        position:'absolute',
        //height:25,
        bottom:0,
        alignSelf:'center',
        //backgroundColor:'red',
        height:22
    },text:{
        color:'#898d8d',
        textAlign:'center',
        marginTop:'auto'
        //alignSelf:'baseline'
        //fontSize:16
    },list:{
        alignItems:'center',
        flexGrow:1
    },barMain:{
        justifyContent:'center',
    },fullBar:{
        backgroundColor:'#979797'
    },miniBar:{
        backgroundColor:'#979797'
    },markerCont:{
        width:2,
        left:'50%',
        //right:0,
        backgroundColor:'#FFCD00',
        position:'absolute',
        alignSelf:'center',
        zIndex:1
    },circle:{
        alignSelf:'center',
        position: 'absolute',
        borderWidth: 3,
        borderColor: '#FFCD00',
        backgroundColor: 'white'
    }
})
export  {Styles};