'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class PaymentAwait extends ScreenComponent {
    static pageConfig = {
        path: '/member/payment/await',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '订单详情'
        }
    }
    render() {
        return (
            <div className='payment-await'>
                <div className='-avait-info'>
                    <dl className='time'>
                        <dt>支付剩余时间</dt>
                        <dd className='countdown'><i>0</i><i>1</i><em>:</em><i>4</i><i>6</i><em>:</em><i>5</i><i>6</i></dd>
                    </dl>
                    <div className='picture'><img src="//gw1.alicdn.com/bao/uploaded/i3/51609912/TB2cl8AgwRkpuFjy1zeXXc.6FXa_!!51609912.jpg_210x210.jpg" /></div>
                    <h3 className='title'>肯德基（大关路店）</h3>
                    <p className='price'>￥<span>900</span>.00</p>
                </div>
                <div className='payment-channel'>
                    <div className='-channel-item -selected'><i className='icon-payment'><img src='/icon/icon_alipay.png'/></i><span className='title'>支付宝支付</span></div>
                    <div className='-channel-item'><i className='icon-payment'><img src='/icon/icon_wechat.png'/></i><span className='title'>微信支付</span></div>
                </div>
                <div className='btn-wrap'><button className='btn-primary'>确认买单 ￥900.00</button></div>
                
            </div>
        )
    }
}

export default PaymentAwait;   