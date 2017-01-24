/**
 * Created by Administrator on 2016/11/6.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import p from '../utils/TransForm';

export default class Picture extends Component {
    render() {
        return (
            <View style={styles.container}>
                {/** 顶部的TitleBar **/}
                <View style={styles.titleBarStyle}>
                    <Text style={styles.titleBarTextStyle}>图片</Text>
                </View>
            </View>
        );
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
    }
});