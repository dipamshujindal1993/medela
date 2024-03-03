import React, {Component} from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import I18n from '@i18n';
import {connect} from 'react-redux';
import styles from './Styles/BleFrontPanelScreenStyles';
import HeaderTitle from '@components/HeaderTitle';
import { languageCode } from '@utils/locale';
import {Colors} from '@resources';
import { Analytics } from '@services/Firebase';

let analytics = new Analytics()

class BleFrontPanelScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isBluetoothActive: false,
    };

  }

  async componentDidMount() {
    await analytics.logScreenView('ble_front_panel_screen')
  }


  renderImage() {
    const {navigation} = this.props
    switch (languageCode()) {
    case 'en':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png') :navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png'): require('../Images/png/flex_en.png')
        }/>  );

    case 'ar':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_ar.png')
        }/>  );

    case 'da':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png') :navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png'): require('../Images/png/flex_da.png')
        }/>  );

    case 'de':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_de.png')
        }/>  );

    case 'fr':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_fr.png') : require('../Images/png/flex_fr.png')
        }/>  );

    case 'it':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_it.png')
        }/>  );

    case 'no':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_no.png')
        }/>  );

    case 'nb':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_no.png')
        }/>  );

    case 'nl':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png') :navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png'): require('../Images/png/flex_nl.png')
        }/>  );

    case 'pt':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_pt.png')
        }/>  );

    case 'ru':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_ru.png')
        }/>  );

    case 'sv':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png') :navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png'): require('../Images/png/flex_se.png')
        }/>  );

    case 'es':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_es.png') : require('../Images/png/flex_es.png')
        }/>  );

    case 'he':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_en.png')
        }/>  );

    case 'tw':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png') :navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png'): require('../Images/png/flex_tw.png')
        }/>  );

    case 'zh':
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_zh.png')
        }/>  );

    default:
      return (<Image
        style={styles.imgStyle}
        source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png'):navigation.getParam('name', '').toLowerCase().includes('maxi') ?require('../Images/png/maxi_en.png') : require('../Images/png/flex_en.png')
        }/>  );
    }
  }
  render() {

    const {navigation} = this.props
    return (
      <View style={styles.mainContainer}>
        <HeaderTitle title={I18n.t('ble_front_panel.title')} onBackPress={() => navigation.goBack()} titleTextColor = {Colors.rgb_000000}/>
        <View style={styles.container}>
          {/* <Image
            style={styles.imgStyle}
            source = {navigation.getParam('name', '') === 'Sonata' ? require('../Images/png/sonata_fp.png') : require('../Images/png/flex_fp.png')}/> */}
             {this.renderImage()}
        </View>

      </View>
    );
  }

  onNextPress = () => {
    const {navigation} = this.props
    navigation.navigate('BlePairingScreen', {
      name: navigation.getParam('name', '')
    })
  };
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BleFrontPanelScreen);
