import React, { Component } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, FlatList, Image, Alert, Linking } from 'react-native';
import styles from './Styles/LicensesScreenStyles';
import HeaderTitle from '@components/HeaderTitle';
import I18n from '@i18n';
import LicensesData from "../StaticData/licenses/LicensesData";
import {connect} from 'react-redux'
import {Colors} from '@resources';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class LicensesScreen extends Component{
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  async componentDidMount(){
    this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
		this.setState({ data: LicensesData.data })
    await analytics.logScreenView('licenses_screen')
  }

  renderListItem=({item})=>{
    return(
			<View style={{ marginVertical: 10 }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <View>
              <Text allowFontScaling={false} style={[styles.authorNameStyles,{color:this.textColor}]}>{item.libraryName}</Text>
              <View  style={{ flexDirection: 'row' }}>
                {item.authorName !='' && <Text maxFontSizeMultiplier={1.7} style={[styles.versionNameStyles,{color:this.textColor}]}>{item.authorName}  |  </Text>}
                <Text maxFontSizeMultiplier={1.7} style={[styles.versionNameStyles,{color:this.textColor}]}>{item.version}</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.knowMoreStyles} onPress={()=> Linking.openURL(item.link)} accessibilityLabel={I18n.t('legal.know_more')+`${item.libraryName}`}>
                <Text allowFontScaling={false} style={styles.knowmoreTextStyles}>{I18n.t('legal.know_more')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        <View>
          <Text maxFontSizeMultiplier={1.7} style={[styles.descriptionStyles,{color:this.textColor}]}>{item.description}</Text>
        </View>
        </View>
        </View>
		)
  }

  render(){
    const{navigation}=this.props;
    return(
      <SafeAreaView style={styles.container}>
        <HeaderTitle title={I18n.t('legal.licences')} onBackPress={()=>navigation.goBack()} />
        <View style={styles.contentViewStyles}>
        <FlatList
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          	data={this.state.data}
          	renderItem={this.renderListItem}
        	/>
        </View>
      </SafeAreaView>
    )
  }
}
const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected,

})

export default connect(mapStateToProps)(LicensesScreen);
