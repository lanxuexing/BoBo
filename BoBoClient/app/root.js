/**
 * Created by Administrator on 2016/11/6.
 */

import React, {Component} from 'react';
import {
    Navigator,
    Platform,
    BackAndroid
} from 'react-native';

import Main from './pages/Main';

export default class Root extends Component {

    constructor(props) {
        super(props);
        this.onBackAndroid = this.onBackAndroid.bind(this);
    }

    // 组件即将挂载的时候注册Android物理返回键的监听器
    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    // 组件即将卸载的时候移除Android物理返回键的监听器
    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    // Android物理返回键的的处理
    onBackAndroid() {
        const navigator = this.refs.navigator;
        const routers = navigator.getCurrentRoutes();
        console.log('当前路由长度：' + routers.length);
        if (routers.length > 1) {
            navigator.pop();
            return true;
        }
        return false;
    };

    render() {
        let defaultName = 'Main';
        let defaultComponent = Main;
        return (
            <Navigator
                // 初始化路由
                initialRoute={{ name: defaultName, component: defaultComponent }}
                ref='navigator'
                // 配置路由场景
                configureScene={
                    (route) => {
                        return Navigator.SceneConfigs.PushFromRight;
                    }
                }
                // 渲染路由
                renderScene={
                    (route, navigator) => {
                        let Component = route.component;
                        return <Component {...route.params} navigator={navigator} />
                    }
                }
            />
        );
    }
}
