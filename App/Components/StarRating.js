import React, {useState, useEffect} from 'react'
import {View, TouchableOpacity} from "react-native";
import {Colors} from '@resources';
import StarImage from '../Images/svg/star.svg'

const StarRating = (props) => {
  const {defaultValue, getSelected, style}=props;
  const maxRating = [1, 2, 3, 4, 5]
  const [defaultRating, setDefaultRating] = useState(defaultValue)

  const getRatings=(value)=>{
    setDefaultRating(value)
    getSelected(value)
  }

  return (
    <View style={{flexDirection: 'row'}}>
    {maxRating && maxRating.map((item, key) => {

        return(
            <TouchableOpacity
                accessible={true}
                accessibilityLabel={item && item==1 ? item + ' Star' : item + ' Stars'}
                key={item}
                onPress={() => getRatings(item)}
                style={style}>
                {item <= defaultRating ?
                <StarImage height= {75} width= {48} fill= {Colors.rgb_ECB910}/> :
                <StarImage height= {75} width= {48} fill= {Colors.rgb_C3C3C3}/>
            }
            </TouchableOpacity>
            )}
        )}
    </View>
  )

}
export default StarRating
