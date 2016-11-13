/**
 * Created by Administrator on 2016/11/12.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class VideoDetail extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            videoData: this.props.videoData
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to 视频详情页面 ---- {this.state.videoData.title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});