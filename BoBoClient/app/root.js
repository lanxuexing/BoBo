/**
 * Created by Administrator on 2016/11/6.
 */

import React, { Component } from 'react';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import BoBoTabBar from './components/BoBoTabBar';
import Video from './pages/Video';
import Record from './pages/Record';
import Picture from './pages/Picture';
import Me from './pages/Me';

export default class Root extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            tabNames: ['视频', '录制', '图片', '我的'],
            tabIconNames: ['ios-videocam', 'ios-recording', 'ios-camera', 'ios-contact']
        };
      }

    render() {
        let tabNames = this.state.tabNames;
        let tabIconNames = this.state.tabIconNames;
        return (
            <ScrollableTabView
                renderTabBar={
                    () => <BoBoTabBar tabNames={tabNames} tabIconNames={tabIconNames}/>
                }
                tabBarPosition={'bottom'}
                onChangeTab={
                    (obj) => {
                        console.log('被选中的tab下标：' + obj.i);
                    }
                }
                onScroll={
                    (position) => {
                        console.log('滑动时的位置：' + position);
                    }
                }
                locked={false}
                initialPage={0}
                prerenderingSiblingsNumber={1}
            >
                <Video tabLabel="video" />
                <Record tabLabel="record" />
                <Picture tabLabel="Picture" />
                <Me tabLabel="me" />
            </ScrollableTabView>
        );
    }
}
