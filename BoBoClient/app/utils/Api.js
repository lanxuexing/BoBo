/**
 * Created by Administrator on 2016/11/8.
 */

import {getServerHost} from './Host';

//首页视频列表
export const videoList = ()=> {
    return getServerHost() + 'bobo/video';
};

//首页视频点赞
export const videoLove = ()=> {
    return getServerHost() + 'bobo/love';
};

//首页视频详情评论列表
export const videoComments = ()=> {
    return getServerHost() + 'bobo/comments';
};

//视频详情也用户评论视频
export const videoComment = ()=> {
    return getServerHost() + 'bobo/comment';
};

//获取手机验证码
export const authCode = ()=> {
    return getServerHost() + 'bobo/authcode';
};

//用户登录
export const login = ()=> {
    return getServerHost() + 'bobo/login';
};
