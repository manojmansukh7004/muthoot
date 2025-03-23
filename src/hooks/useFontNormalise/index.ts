import {Platform, PixelRatio, Dimensions} from 'react-native';
const {width} = Dimensions.get('window');
const scale = width / 320;

const useFontNormalise = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'android') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))-3;
  }
};
export default useFontNormalise;

// import { Platform, PixelRatio, Dimensions } from 'react-native';

// const { width } = Dimensions.get('window');
// const BASE_WIDTH = 375; // iPhone 6/7/8 standard width
// const scale = width / BASE_WIDTH;

// const normalizeFontSize = (size: number) => {
//   const newSize = size * scale;
//   return Platform.OS === 'android'
//     ? Math.max(12, Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1)
//     : Math.round(PixelRatio.roundToNearestPixel(newSize));
// };

// export default normalizeFontSize;
