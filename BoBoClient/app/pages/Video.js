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
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';

import p from '../utils/TransForm';
import Icon from 'react-native-vector-icons/Ionicons';
import {get} from '../utils/Request';
import * as urlType from '../utils/Api';

// 屏幕宽高
const {width, height} = Dimensions.get('window');
// 缓存数据
let cacheData = {
    dataTotal: 0,
    videoListData: [],
    nextPage: 1
};

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
            }),
            isLoadingMore: false,
            isRefreshing: false
        };
    }


    /** 组件加载完成的时候调用 **/
    componentDidMount() {
        this.fetchNetData(1);
    }


    //从网络加载数据
    fetchNetData(page) {
        if (page !== 0) {
            //上拉加载更多
            this.setState({
                isLoadingMore: true
            });
        }else {
            //下拉刷新
            this.setState({
                isRefreshing: true
            });
        }
        get(urlType.videoList(), {page: page}).then(result=> {
            //把数据存入缓存,先取出原有的数据
            let listData = cacheData.videoListData.slice();
            //将原有的数据和新的数据拼接
            if (page !== 0) {
                //上拉加载更多
                cacheData.videoListData = listData.concat(result.data);
            }else {
                //下拉刷新
                cacheData.videoListData = result.data.concat(listData);
            }
            //存入数据总长度
            cacheData.dataTotal = result.total;
            //下一页
            cacheData.nextPage += 1;
            console.log('总个数据的长度是：' + cacheData.dataTotal);
            console.log('当前的listView数据的总长度是：' + cacheData.videoListData.length);
            if (page !== 0) {
                //上拉加载更多
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(cacheData.videoListData),
                    isLoadingMore: false
                })
            }else {
                //下拉刷新
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(cacheData.videoListData),
                    isRefreshing: false
                })
            }
        }).catch((result)=> {
            if (page !== 0) {
                this.setState({
                    isLoadingMore: false
                });
            }else {
                this.setState({
                    isRefreshing: false
                });
            }
            console.log('网络请求失败' + result)
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
                onEndReachedThreshold={20}
                onEndReached={()=>this.fetchMoreData()}
                renderFooter={()=>this.renderFooterView()}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={()=>this.onRefresh()}
                        title={"正在更新..."}
                        titleColor={"#2E2E2E"}
                        tintColor={"#FF3333"}
                        colors={['#FF3333', '#E35852']}
                        progressBackgroundColor={"white"}
                    />
                }
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


    /** 下拉刷新 **/
    onRefresh() {
        if (!this.isHasMore || this.state.isRefreshing) {
            return null;
        }
        //从服务获取最新的数据
        this.fetchNetData(0);
    }


    /** 上拉加载更多 **/
    fetchMoreData() {
        console.log('加载更多...');
        if (!this.isHasMore || this.state.isLoadingMore) {
            return null;
        }
        //加载更多
        let page = cacheData.nextPage;
        this.fetchNetData(page);
    };


    /** 判断是否有更多数据 **/
    isHasMore() {
        return cacheData.videoListData.length !== cacheData.dataTotal;
    }

    /** 加载更多进度 **/
    renderFooterView() {
        // 数据加载完毕
        if(!this.isHasMore && cacheData.dataTotal !== 0){
            return (
                <View style={styles.loadingMoreViewStyle}>
                    <Text style={styles.loadingMoreTextStyle}>没有更多数据啦...</Text>
                </View>
            );
        }
        // 不是正在加载更多
        if(!this.state.isLoadingMore){
            return <View style={styles.loadingMoreViewStyle}/>
        }
        // 不是正在加载更多
        return (
            <View style={styles.loadingMoreViewStyle}>
                <ActivityIndicator size="small" color="#ff3333"/>
                    <Text style={styles.loadingMoreTitleStyle}>
                    数据加载中……
                </Text>
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
    },
    loadingMoreViewStyle: { //加载更多View
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: p(40)
    },
    loadingMoreTextStyle: { //加载完更多文字
        fontSize: p(22)
    },
    loadingMoreProgressStyle: { //加载进度
        marginVertical: p(40)
    },
    loadingMoreTitleStyle: { //正在加载更多文字
        textAlign: 'center',
        fontSize: p(22),
        marginLeft: p(20),
        color: '#979797'
    }
});