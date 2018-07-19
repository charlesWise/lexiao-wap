'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import TimeUtil from './../../../../util/time';

class Payment extends ScreenComponent {
    static pageConfig = {
        path: '/member/payment',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我的买单'
        }
        this.state = {
            status: 0, // 订单状态 0 全部 1 待付款 2 已完成
            list: []
        }
    }

    componentDidMount() {
        this._getList();
    }

    _getList(status) {
        if (status == this.state.status) return;
        this.setState({
            status: status || 0
        });
        api.orderList({
            status: status || 0
        }).success((content) => {
            console.log('onsuccess>>>>', content)
            let list = content.data && content.data.list;
            this.setState({
                list: list || []
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _NotRecord() {
        return (
            <div className='not-record'><img src='/icon/icon_not_record.png' /><span>暂无买单记录</span></div>
        )
    }

    _WelfareList(list) {
        return (
            <div className='pay-list'>
                {
                    list.map((item, index) => {
                        return (
                            <ListItem key={item.order_id} data={item}/>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        let list = this.state.list;
        return (
            <div className='tabs'>
                <ul className='tab-nav'>
                    <li onClick={this._getList.bind(this,0)} className={this.state.status == 0 ? 'tab-nav-item -active' : 'tab-nav-item'}>全部</li>
                    <li onClick={this._getList.bind(this,1)} className={this.state.status == 1 ? 'tab-nav-item -active' : 'tab-nav-item'}>待付款</li>
                    <li onClick={this._getList.bind(this,2)} className={this.state.status == 2 ? 'tab-nav-item -active' : 'tab-nav-item'}>已完成</li>
                </ul>
                <div className='tab-panel'>
                    {
                        list && list.length > 0 ?
                            this._WelfareList(list)
                            :
                            this._NotRecord()
                    }
                </div>
            </div>
        )
    }
}

export default Payment;

class ListItem extends ScreenComponent {

    constructor(...props) {
        super(...props);
        this.state = {
            leftTime: '',
            canPay: true,
            isCanceled: false
        }
        this.timeInterval = null
    }

    componentDidMount() {
        let data = this.props.data || {};
        if(data.status == 1){
            // this._countDown(data.expire_time)
            this._countDown(data.left_time * 1000)
        }
    }

    componentWillUnmount() {
        if (this.timeInterval) {
            clearInterval(this.timeInterval)
        }
    }

    _countDown(time) {
        this.timeInterval = setTimeout(() => {
            // let rest = new Date(time).getTime() - Date.now();
            let rest = time;
            if (rest < 0) rest = 0;
            if (rest > 0) {
                this._countDown(rest - 1000);
            }else{
                this.setState({
                    canPay: false
                })
            }
            this.setState({
                leftTime: TimeUtil.formatLeftTime(rest)
            })
        }, 1000);
    }

    _goDetail(data){
        if (data.status == 1) return;
        let navigation = this.getScreen().getNavigation();
        navigation.navigate('PaymentSuccess', { order_id: data.order_id })
    }

    _removeConfirm(data){
        this.getScreen().alert({
            message: "取消该笔订单？",
            buttons: [
                { text: "放弃" },
                {
                    text: "确认",
                    onPress: () => {
                        this._removeOrder(data)
                    }
                }
            ]
        });
    }

    _removeOrder(data){
        api.removeOrderList({
            order_id: data.order_id
        }).success((content) => {
            this.setState({
                isCanceled: true
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _payOrder(data) {
        let navigation = this.getScreen().getNavigation();
        navigation.navigate('PaymentOrder', { order_id: data.order_id })
    }
    _goMerchantDetail(mid) {
        let navigation = this.getScreen().getNavigation();
        navigation.navigate('MerchantDetail',{
            id: mid
        });
    }
    render() {
        let data = this.props.data || {};
        if(this.state.isCanceled) return null;
        return (
            <div className="pay-item">
                <div className="head">
                    <h3 onClick={this._goMerchantDetail.bind(this, data.mid)}>{data.merchant_name}</h3>
                    <span>{data.status == 1 ? '等待支付' : '支付成功'}</span>
                </div>
                <div onClick={this._goDetail.bind(this, data)}>
                    <div className="body">
                        <div className="picture"><img src={data.logo} /></div>
                        <dl>
                            <dt>消费:￥{data.money}</dt>
                            <dd className={data.status == 1 ? "paid-time" : "pay-time"}>{data.status == 1 ? '支付剩余时间' : '支付时间'}：{data.status == 1 ? this.state.leftTime : data.mtime}</dd>
                        </dl>
                    </div>
                    <div className="total">实付:<span>￥<i>{data.pay_money}</i></span></div>
                    {
                        data.status == 1 &&
                        <div className="control">
                            <button className="" onClick={(e)=>{
                                e.stopPropagation();
                                this._removeConfirm(data)
                            }}>取消订单</button>
                            <button className="" onClick={(e) => {
                                e.stopPropagation();
                                this._payOrder(data)
                            }}>立即付款</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}