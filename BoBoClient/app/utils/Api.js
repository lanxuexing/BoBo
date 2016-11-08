/**
 * Created by Administrator on 2016/11/8.
 */

import {getServerHost} from './Host';

//首页视频列表
export const videoList = ()=> {
    return getServerHost() + 'bobo/video';
};
