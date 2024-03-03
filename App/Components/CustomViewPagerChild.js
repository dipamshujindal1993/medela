import React from 'react';
import {View, Image, Text} from 'react-native';

import styles from './Styles/CustomViewPagerChildStyles'
import {useSelector} from 'react-redux'
import {
  Colors
} from '@resources'

export default (CustomViewPagerChild = ({
  item,
  style,
  onPress,
  index,
  imageKey,
  local,
  localSVG,
  height
}) => {
  const selectedTheme = useSelector(state=>state.app.themeSelected)
  return (
    <>
      <View style={styles.container}>
        {item.heading && <Text maxFontSizeMultiplier={1.7} style={[styles.title, { marginHorizontal: 10, marginBottom: 20 ,color:selectedTheme=='dark'?Colors.white:Colors.rgb_000000 }]}>{item.heading}</Text>}
        {(localSVG && !item.renderImage)? <Text maxFontSizeMultiplier={1.7}>{item.image}</Text> :
          <Image
            style={styles.image}
            source={local ? item[imageKey] : {uri: item[imageKey]}}
          />
        }
      {item.title && <Text maxFontSizeMultiplier={1.7} style={[styles.title,{color:selectedTheme=='dark'?Colors.white:Colors.rgb_000000 }]}>{item.title}</Text>}
      {item.desc && <Text maxFontSizeMultiplier={1.7} style={[styles.desc,{color:selectedTheme=='dark'?Colors.white:Colors.rgb_000000 }]}>{item.desc}</Text>}
      </View>
    </>
  );
});
