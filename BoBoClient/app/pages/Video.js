/**
 * Created by Administrator on 2016/11/6.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Dimensions,
    Image
} from 'react-native';

import p from '../utils/TransForm';
import Icon from 'react-native-vector-icons/Ionicons';
import {get} from '../utils/Request';
import * as urlType from '../utils/Api';

const {width, height} = Dimensions.get('window');

/**
 * 视频列表界面
 */
export default class Video extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (oldRow, newRow) => oldRow !== newRow
            })
        };
    }


    /** 组件加载完成的时候调用 **/
    componentDidMount() {
        this.fetchNetData();
    }


    //从网络加载数据
    fetchNetData() {
        get(urlType.videoList()).then(result=>{
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(result.data)
            })
        })
    }


    render() {
        return (
            <View style={styles.container}>
                {/** 顶部的TitleBar **/}
                <View style={styles.titleBarStyle}>
                    <Text style={styles.titleBarTextStyle}>视频列表</Text>
                </View>
                {/** 下半部分视频列表 **/}
                {this.renderVideoView()}
            </View>
        );
    }

    /** 下半部分视频列表 **/
    renderVideoView() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderVideoList}
                enableEmptySections={true}
                style={styles.listViewStyle}
            />
        );
    }


    /** 视频列表 **/
    renderVideoList(rowData) {
        return (
            <View style={styles.videoListViewStyle}>
                {/** 视频标题 **/}
                <View style={styles.titleViewStyle}>
                    <Text style={styles.titleTextStyle}>{rowData.title}</Text>
                </View>
                {/** 视频缩略图 **/}
                <Image source={{uri: rowData.thumb}} style={styles.imageStyle}>
                    {/** 播放按钮 **/}
                    <Icon
                        name={'ios-play'}
                        size={p(56)}
                        style={styles.videoPlayStyle}
                    />
                </Image>
                {/** 点赞和评论 **/}
                <View style={styles.bottomViewStyle}>
                    <View style={styles.loveViewStyle}>
                        <Icon
                            name={'ios-heart-outline'}
                            size={p(56)}
                            style={styles.loveIconStyle}
                        />
                        <Text style={styles.loveTextStyle}>点赞</Text>
                    </View>
                    <View style={styles.commentsViewStyle}>
                        <Icon
                            name={'ios-chatbubbles'}
                            size={p(56)}
                            style={styles.commentsIconStyle}
                        />
                        <Text style={styles.commentsTextStyle}>评论</Text>
                    </View>
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
    },
    listViewStyle: { //列表ListView
        backgroundColor: 'white',
        marginTop: p(20)
    },
    videoListViewStyle: { //视频列表外层View
        borderBottomColor: '#F2F2F2',
        borderBottomWidth: p(15)
    },
    titleViewStyle: { // 视频标题外层View
        padding: p(10)
    },
    titleTextStyle: { //视频标题
        fontSize: p(30),
        color: '#2E2E2E'
    },
    imageStyle: { //视频缩略图
        width: width,
        height: width * 0.56,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    videoPlayStyle: { //视频播放按钮
        width: p(92),
        height: p(92),
        paddingTop: p(18),
        paddingLeft: p(36),
        backgroundColor: 'transparent',
        borderColor: '#E8E8E8',
        borderRadius: p(46),
        borderWidth: p(2),
        color: 'white'
    },
    bottomViewStyle: { //底部点赞评论外层View
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    loveViewStyle: { //左边点赞外层View
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width / 2,
        height: p(80),
        backgroundColor: 'purple'
    },
    loveIconStyle: { //点赞图标
        height: p(50),
        width: p(50)
    },
    loveTextStyle: { //点赞文字
        fontSize: p(28),
        marginLeft: p(20),
        color: '#333333'
    },
    commentsViewStyle: { //右边评论外层View
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width / 2,
        height: p(80),
        backgroundColor: 'green'
    },
    commentsIconStyle: { //评论图标
        height: p(50),
        width: p(50)
    },
    commentsTextStyle: { //评论文字
        fontSize: p(28),
        marginLeft: p(20),
        color: '#333333'
    }
});