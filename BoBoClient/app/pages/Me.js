/**
 * Created by Administrator on 2016/11/6.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';

import p from '../utils/TransForm';
import Icon from 'react-native-vector-icons/Ionicons';
import {getLogin, postLogin} from '../utils/Request';
import * as urlType from '../utils/Api';

const {width, height} = Dimensions.get('window');
//正则表达式
let regEx = {
    mobile: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
};
// 缓存数据
let cacheData = {
    authCodeServer: '',
    loginToken: ''
};

export default class Me extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isFirstLogin: false,
            phoneNumber: '',
            authCode: '',
            remainingTime: 60,
            isGetAutoCode: false,
            isAgainGetAutoCode: false
        };
    }

    //组件被卸载的时候卸载掉定时器
    componentWillUnmount(){
        this.interval && clearInterval(this.interval);
    }

    render() {
        return (
            <View style={styles.container}>
                {/** 顶部的TitleBar **/}
                <View style={styles.titleBarStyle}>
                    <Text style={styles.titleBarTextStyle}>我</Text>
                </View>
                {/** 个人信息部分 **/}
                {
                    this.state.isFirstLogin &&
                    <View style={styles.userBoxStyle}>
                        <Image source={{uri: 'http://dummyimage.com/640x640/dbe20f)'}} style={styles.userAvatarStyle}/>
                        <View style={styles.userInnerBoxStyle}>
                            <Text style={styles.userNickNameStyle}>我的名字</Text>
                            <Text style={styles.userIntroStyle} numberOfLines={2}>简介：努力使每一天开心而有意义</Text>
                        </View>
                    </View>
                }
                {/** 登录页信息  **/}
                {
                    !this.state.isFirstLogin &&
                    <View style={styles.loginBoxStyle}>
                        <View style={styles.numBoxStyle}>
                            <Icon
                                name={'ios-contact'}
                                size={p(50)}
                                style={styles.numIconStyle}
                            />
                            <TextInput
                                style={styles.numInputStyle}
                                placeholder={'请输入手机号码'}
                                placeholderTextColor={'#b9b9b9'}
                                underlineColorAndroid={'transparent'}
                                keyboardType={'numeric'}
                                onChangeText={(text) => this.setState({phoneNumber: text})}
                            />
                        </View>
                        <View style={[styles.codeBoxStyle, {marginTop: p(-2)}]}>
                            <Icon
                                name={'ios-unlock'}
                                size={p(50)}
                                style={styles.codeIconStyle}
                            />
                            <TextInput
                                style={styles.codeInputStyle}
                                placeholder={'请输入手机验证码'}
                                placeholderTextColor={'#b9b9b9'}
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                keyboardType={'numeric'}
                                onChangeText={(text) => this.setState({authCode: text})}
                            />
                        </View>
                        {!this.state.isGetAutoCode ?
                            <TouchableOpacity onPress={this.getAuthCode.bind(this)}>
                                <View style={styles.codeTextBoxStyle}>
                                    <Text style={styles.codeTextStyle}>获取手机验证码</Text>
                                </View>
                            </TouchableOpacity> : this.state.remainingTime == 0 ?
                                <TouchableOpacity onPress={this.getAuthCode.bind(this)}>
                                    <View style={styles.codeTextBoxStyle}>
                                        <Text style={styles.codeTextStyle}>重新获取手机验证码</Text>
                                    </View>
                                </TouchableOpacity> :
                                <View style={styles.codeTextBoxStyle}>
                                    <Text style={styles.codeTextStyle}>剩余{this.state.remainingTime}秒</Text>
                                </View>
                        }
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={this.onLoginClient.bind(this)}
                        >
                            <View style={styles.loginBtnBoxStyle}>
                                <Text style={styles.loginTextStyle}>登&nbsp;&nbsp;录</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }

    //获取手机验证码
    getAuthCode() {
        let phoneNumber = this.state.phoneNumber;
        if(!phoneNumber) {
            Alert.alert('手机号码不能为空');
        }else if(!(regEx.mobile).test(phoneNumber)) {
            Alert.alert('您输入手机号码有误，请重新输入');
        }else {
            //获取手机验证码操作
            getLogin(urlType.authCode(), {phoneNumber: phoneNumber}).then((result)=> {
                ToastAndroid.show('服务器返回手机验证码: '+JSON.stringify(result.data.authCode), ToastAndroid.LONG);
                if(result && result.code == '0'){
                    cacheData.authCodeServer = String(result.data.authCode);
                    this.setState({
                        isGetAutoCode: true,
                        remainingTime: 60
                    });
                    //手机验证码定时器
                    this.interval = setInterval(()=>{
                        if(this.state.remainingTime == 0){
                            return clearInterval(this.interval);
                        }
                        this.setState({
                            remainingTime: this.state.remainingTime - 1
                        })
                    }, 1000);
                }
            }).catch((error)=> {
                console.log('获取验证码失败' + error);
            });
        }
    }

    //登录按钮点击事件
    onLoginClient() {
        let phoneNumber = this.state.phoneNumber;
        let authCode = this.state.authCode;
        if(!phoneNumber) {
            Alert.alert('手机号码不能为空');
        }else if(!(regEx.mobile).test(phoneNumber)) {
            Alert.alert('您输入手机号码有误，请重新输入');
        }else if(!authCode){
            Alert.alert('验证码不能为空');
        }else if(authCode != cacheData.authCodeServer) {
            Alert.alert('您输入验证码有误，请重新输入');
        }else {
            //登录操作
            postLogin(urlType.login(), {photoNumber: phoneNumber, authCode: authCode}).then((result)=> {
                if(result && result.code == '0'){
                    cacheData.loginToken = result.data.token;
                    ToastAndroid.show('登录成功！服务器返回token: '+cacheData.loginToken, ToastAndroid.SHORT);
                    this.setState({
                        isFirstLogin: true,
                        isGetAutoCode: false
                    });
                }else{
                    console.log('获取验证码失败');
                }
            }).catch((error)=> {
                console.log('用户登录失败' + error);
            })
        }
    }
}

const styles = StyleSheet.create({
    container: { //容器View
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    titleBarStyle: { //顶部TitleBar的View
        justifyContent: 'center',
        alignItems: 'center',
        height: p(100),
        backgroundColor: '#E35852'
    },
    titleBarTextStyle: { //顶部TitleBar的文字
        fontSize: p(32),
        color: 'white'
    },
    userBoxStyle: { //个人信息容器
        flexDirection: 'row',
        paddingVertical: p(15),
        paddingHorizontal: p(12),
        backgroundColor: 'white'
    },
    userInnerBoxStyle: { //个人信息内部容器
        paddingLeft: p(20),
        justifyContent: 'center',
        width: width - p(144)
    },
    userAvatarStyle: { //个人信息用户的头像
        width: p(100),
        height: p(100),
        borderRadius: p(50)
    },
    userNickNameStyle: { //用户昵称
        fontSize: p(24),
        color: '#2e2e2e',
        fontWeight: 'bold'
    },
    userIntroStyle: { //个人简介
        fontSize: p(21),
        color: '#333'
    },
    loginBoxStyle: { //登录页容器
        width: width,
        paddingHorizontal: p(20),
        paddingVertical: p(12)
    },
    numBoxStyle: { //手机号容器
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#d0d0d0',
        borderWidth: p(2),
        borderTopLeftRadius: p(20),
        borderTopRightRadius: p(20)
    },
    numIconStyle: { //用户手机号图标
        width: p(80),
        paddingHorizontal: p(20)
    },
    numInputStyle: { //手机验证码输入框
        width: width - p(104),
        color: '#2e2e2e'
    },
    codeBoxStyle: { //验证码容器
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#d0d0d0',
        borderWidth: p(2),
        borderBottomLeftRadius: p(20),
        borderBottomRightRadius: p(20)
    },
    codeIconStyle: { //验证码图标
        width: p(80),
        paddingHorizontal: p(20)
    },
    codeInputStyle: { //验证码输入框
        width: width - p(104),
        color: '#2e2e2e'
    },
    codeTextBoxStyle: { //获取验证码文字容器
        alignItems: 'flex-end',
        marginTop: p(20)
    },
    codeTextStyle: { //获取验证码文字
        fontSize: p(26),
        color: '#b9b9b9'
    },
    loginBtnBoxStyle: { //登录按钮容器
        marginTop: p(20),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#d0d0d0',
        borderWidth: p(2),
        borderRadius: p(18),
        paddingVertical: p(22),
        backgroundColor: '#ff3333'
    },
    loginTextStyle: { //登录文字
        fontSize: p(32),
        color: 'white'
    }
});