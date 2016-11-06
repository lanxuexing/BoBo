/**
 * Created by Administrator on 2016/11/6.
 */


import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * 自定义的TabBar
 */
export default class BoBoTabBar extends Component {

    //默认属性值
    static get defaultProps() {
        return {
            goToPage: React.PropTypes.func, // 跳转到对应tab的方法
            activeTab: React.PropTypes.number, // 当前被选中的tab下标
            tabs: React.PropTypes.array, // 所有tabs集合
            tabNames: React.PropTypes.array, // 保存Tab名称
            tabIconNames: React.PropTypes.array, // 保存Tab图标
        };
    }


    //Animated.Value监听范围 [0, tab数量-1]
    componentDidMount() {
        this.listener = this.props.scrollValue.addListener(this.setAnimationValue);
    }

    //卸载动画监听
    componentWillUnmount() {
        this.props.scrollValue.removeListener(this.listener);
    }

    //设置值动画
    setAnimationValue({value}) {
        console.log('动画值：'+value);
    }

    render(){
        return(
            <View style={[styles.tabs, this.props.tabBarStyle]}>
                {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
            </View>
        );
    }

    //配置TabBar的一些属性和样式
    renderTabOption(tab, i) {
        // 判断i是否是当前选中的tab，设置不同的颜色
        let color = this.props.activeTab == i ? "#FF3333" : "#ADADAD";
        return (
            <TouchableOpacity onPress={()=>this.props.goToPage(i)} style={styles.tab} key={tab}>
                <View style={styles.tabItem}>
                    <Icon
                        name={this.props.tabIconNames[i]} // 图标
                        size={30}
                        color={color}
                    />
                    <Text style={{color: color}}>
                        {/** 底部文字 **/}
                        {this.props.tabNames[i]}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

}


//样式
const styles = StyleSheet.create({
    tabs: { //总体样式
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#3B3B3B'
    },
    tab: { //外层每个TabBar的样式
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabItem: { //内层每个TabBar的样式
        flexDirection: 'column',
        alignItems: 'center',
    }
});