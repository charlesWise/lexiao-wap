'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

class PaymentSuccess extends ScreenComponent {
    static pageConfig = {
        path: '/member/payment/success',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '订单详情'
        }
        this.state = {
            detail: {}
        }
    }

    componentDidMount() {
        const {
            params
        } = this.getScreen().getNavigation().state;
        this._getDetail(params.order_id);
    }

    _getDetail(order_id) {
        api.orderInfo({
            order_id: order_id
        }).success((content) => {
            console.log('onsuccess>>>>', content)
            this.setState({
                detail: content.data || {}
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    render() {
        let detail = this.state.detail;
        return (
            <div className='payment-success'>
                <dl className='-success-head'>
                    <dd><i className='icon-success'></i></dd>
                    <dt>支付成功</dt>
                </dl>
                <div className='-success-body'>
                    <h3>{detail.merchant_name}</h3>
                    <ul>
                        <li><label>总价</label><span>￥{detail.money}</span></li>
                        {/*<li><label>优惠</label><span>-￥{detail.money - detail.pay_money}</span></li>*/}
                        <li><label>优惠</label><span>-￥{detail.discount_amount}</span></li>
                        <li><label>实付</label><span className='-orange'>￥{detail.pay_money}</span></li>
                        <li><label>订单编号</label><span>{detail.order_no}</span></li>
                        <li><label>消费时间</label><span>{detail.mtime}</span></li>
                        <li><label>手机号</label><span>{detail.mobile}</span></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default PaymentSuccess;   