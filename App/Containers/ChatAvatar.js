import React, { Component, Fragment } from 'react';
import { Image, Text, TouchableWithoutFeedback, View, Modal, TouchableOpacity, FlatList } from 'react-native';
import I18n from '@i18n';
import styles from './Styles/ChatAvatarStyles';
import SelectedIcon from '@svg/ic_selected_round';
import Colors from '@resources/Colors';
import {BlurView} from "@react-native-community/blur";
import KeyUtils from "@utils/KeyUtils";
import AsyncStorage from "@react-native-community/async-storage";
import Avatars from "../StaticData/chat/Avatars";
import Aurora from '@svg/aurora';
import Farrah from '@svg/farrah';
import Jahmelia from '@svg/jahmelia';
import Julia from '@svg/julia';
import Luna from '@svg/luna';
import Mei from '@svg/mei';
import Samira from '@svg/samira';
import Zoe from '@svg/zoe';
import {connect} from 'react-redux';
import {Constants} from "../Resources";
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class ChatAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      selectedAvtar: ''
    };
    this.themeSelected=this.props.themeSelected  && this.props.themeSelected
    this.props.themeSelected  && this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
  }

  componentDidMount() {
    const{ navigation }=this.props
      this.themeSelected=this.props.themeSelected === 'dark' ?(this.textColor = Colors.white):(this.textColor = Colors.rgb_000000)
    this.setState({ data: Avatars.avatarsData })
    AsyncStorage.getItem(KeyUtils.SELECTED_AVATAR).then(value => {
      if(value != null) {
        this.setState({ selectedAvtar: value })
      }
    });
  }

  async onClosemodal(avatar){
    AsyncStorage.setItem(KeyUtils.SELECTED_AVATAR, avatar)
    this.props.onClose(false, avatar)
    let param = {'avatar_selected':avatar}
    await analytics.logEvent(Constants.CHAT, param);
  }

  renderListItem = ({item}) => {
    return(
      <TouchableOpacity
        onPress={() => this.onClosemodal(item.title)}
        style={styles.containerStyle}>
        <View>
          {item.selectedImage === KeyUtils.SAMIRA &&
            <Fragment>
              {item.title === this.state.selectedAvtar &&
                <SelectedIcon fill={Colors.rgb_898d8d} height={16} width={16} style={styles.selectedIconStyles} />
              }
              <Samira fill={Colors.rgb_888B8D}/>
            </Fragment>
          }
          {item.selectedImage === KeyUtils.ZOE &&
            <Fragment>
              {item.title === this.state.selectedAvtar &&
                <SelectedIcon fill={Colors.rgb_898d8d} height={16} width={16} style={styles.selectedIconStyles} />
              }
              <Zoe fill={Colors.rgb_888B8D}/>
            </Fragment>
          }
          {item.selectedImage === KeyUtils.MEI &&
            <Fragment>
              {item.title === this.state.selectedAvtar &&
                <SelectedIcon fill={Colors.rgb_898d8d} height={16} width={16} style={styles.selectedIconStyles} />
              }
              <Mei fill={Colors.rgb_888B8D}/>
            </Fragment>
          }
          {item.selectedImage === KeyUtils.AURORA &&
           <Fragment>
              {item.title === this.state.selectedAvtar &&
                <SelectedIcon fill={Colors.rgb_898d8d} height={16} width={16} style={styles.selectedIconStyles} />
              }
              <Aurora fill={Colors.rgb_888B8D}/>
            </Fragment>
          }
          {item.selectedImage === KeyUtils.FARRAH &&
           <Fragment>
              {item.title === this.state.selectedAvtar &&
                <SelectedIcon fill={Colors.rgb_898d8d} height={16} width={16} style={styles.selectedIconStyles} />
              }
              <Farrah fill={Colors.rgb_888B8D}/>
            </Fragment>
          }
          {item.selectedImage === KeyUtils.LUNA &&
           <Fragment>
              {item.title === this.state.selectedAvtar &&
                <SelectedIcon fill={Colors.rgb_898d8d} height={16} width={16} style={styles.selectedIconStyles} />
              }
              <Luna fill={Colors.rgb_888B8D}/>
            </Fragment>
          }
          {item.selectedImage === KeyUtils.JULIA &&
           <Fragment>
              {item.title === this.state.selectedAvtar &&
                <SelectedIcon fill={Colors.rgb_898d8d} height={16} width={16} style={styles.selectedIconStyles} />
              }
              <Julia fill={Colors.rgb_888B8D}/>
            </Fragment>
          }
          {item.selectedImage === KeyUtils.JAHMELIA &&
           <Fragment>
              {item.title === this.state.selectedAvtar &&
                <SelectedIcon fill={Colors.rgb_898d8d} height={16} width={16} style={styles.selectedIconStyles} />
              }
              <Jahmelia fill={Colors.rgb_888B8D}/>
            </Fragment>
          }
        </View>
        <Text maxFontSizeMultiplier={1.7} style={[styles.avatarTextStyles,{color:this.textColor}]}> {item.title} </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const{themeSelected}=this.props
    let dialogViewColor = Colors.white
    themeSelected==="dark"&&(dialogViewColor= Colors.rgb_000000)
    return (
      <Modal
        transparent
        hardwareAccelerated
        visible={this.props.visible}
        onRequestClose={() => this.props.onDismis ? this.props.onClose(false) : null}
      >
        <BlurView
          blurType='dark'
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.background}>
              <Fragment>
                <View style={[styles.dialogView, {backgroundColor: dialogViewColor}]}>
                  <Text maxFontSizeMultiplier={1.7} style={[styles.titleStyles,{color:this.textColor}]}>{I18n.t('chat.choose_avatar')}</Text>
                  <FlatList
                    contentContainerStyle={styles.verticalListStyle}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    data={this.state.data}
                    renderItem={this.renderListItem}
                    numColumns={2}
                  />
                </View>
              </Fragment>
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  themeSelected: state.app.themeSelected
});

export default connect(mapStateToProps, null)(ChatAvatar);
