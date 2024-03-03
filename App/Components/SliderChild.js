import React from 'react';
import {View, Image, Text} from 'react-native';
import {Colors} from '@resources';

import styles from './Styles/SliderChildStyles'

export default (SliderChild = ({
  item,
  style,
  onPress,
  index,
  imageKey,
  local,
  localSVG,
  height,
  textColor
}) => {
  return (
    <View style={{justifyContent:'flex-end'}}>
      {localSVG ? item.image :
        <Image
          style={[styles.image, style, {height: height}]}
          source={local ? item[imageKey] : {uri: item[imageKey]}}
        />
      }
      <View style={styles.container}>
      {item.title && <Text maxFontSizeMultiplier={1.7} style={[styles.title,textColor && {color:Colors.rgb_000000}]}>{item.title}</Text>}
      {item.desc && <Text maxFontSizeMultiplier={1.7} style={[styles.desc,textColor && {color:Colors.rgb_000000}]}>{item.desc}</Text>}
      </View>
    </View>
  );
});
