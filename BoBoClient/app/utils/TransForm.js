/**
 * Created by Administrator on 2016/11/6.
 */

import {
    PixelRatio,
    Dimensions
} from 'react-native';

/**
 * 将UI给的像素值，转化为当前设备需要的数值
 * @param n
 * @returns {number}
 */
export default function p(n) {
    const deviceWidth = Dimensions.get('window').width;
    return Math.round((n / 2) * (PixelRatio.getPixelSizeForLayoutSize(deviceWidth) / PixelRatio.get()) / 360);
}