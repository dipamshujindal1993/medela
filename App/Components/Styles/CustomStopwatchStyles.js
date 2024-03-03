import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '@resources';

export default StyleSheet.create({
  StopwatchWrapper: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  StopwatchBtnStyle: {
    alignItems: 'center',
    justifyContent:'center',
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  StopwatchBtntext: {
    ...Fonts.style.bold_16,
    display: 'flex',
    alignSelf: 'center',
  },
});
export const options = {
  container: {
    height: 35,
    width: 106,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.rgb_f5f5f5,
    marginVertical: 15,
    borderRadius: 5,
  },
  text: {
    ...Fonts.style.regular_16,
    color: Colors.rgb_898d8d,
  },
};
