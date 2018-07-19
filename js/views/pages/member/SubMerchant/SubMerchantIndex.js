'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

class SubMerchantIndex extends ScreenComponent {
    static pageConfig = {
        path: '/submerchant/index',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我是商户'
        }
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        this._getData();
    }

    _getData() {
        api.indexPage({

        }).success((content) => {
            console.log('onsuccess>>>>', content)
            this.setState({
                data: content.data || {}
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _MerchantName(data) {
        return (
            <div className='-merchant-name'>
                <div className='picture'><img src={data.logo} /></div>
                <div className="account-info">
                    <p className="account-name">商户王宝和大酒店</p>
                    <p className="account-info-cont"><em>张三</em>  <em>13234699900</em>  <em>财务</em> </p>
                    <p className="account-orange">解除绑定</p>
                </div>
                <i className="icon-arrow"></i>
            </div>
        )
    }
    _MerchantBalance(data) {
        return (
            <div className='-merchant-balance'>
                <dl className='-balance-module'>
                    <dt>账户余额(元)</dt>
                    <dd>{data.money}</dd>
                </dl>
                <div className='-handle'><a href='javascript:;'>资金记录</a><a href='javascript:;'>提现</a></div>
            </div>
        )
    }
    _MerchantMenu(data) {
        return (
            <div className='-merchant-menu'>
                <dl>
                    <dd></dd>
                    <dt>买单记录</dt>
                </dl>
                <dl>
                    <dd></dd>
                    <dt>子商户管理</dt>
                </dl>
                <dl>
                    <dd></dd>
                    <dt>职员管理</dt>
                </dl>
                <dl>
                    <dd></dd>
                    <dt>福利券管理</dt>
                </dl>
            </div>
        )
    }
    _MerchantAward(data) {
        return (
            <div className='-merchant-award'>
                <div className='sub-merchant-head'>
                    <div className="sub-div">
                        <p className="head-tit">累计奖励(元)</p>
                        <p className="head-money">{data.prize_money}</p>
                    </div>
                    <a href=''>查看详情</a>
                </div>
                <div className='body'></div>
            </div>
        )
    }
    render() {
        let data = this.state.data || {};
        return (
            <div className='my-merchant'>
                {this._MerchantName(data)}
                {this._MerchantBalance(data)}
                {this._MerchantMenu(data)}
                {this._MerchantAward(data)}
                <div className='-merchant-invite'>邀请用户</div>
            </div>
        )
    }
}

export default SubMerchantIndex;   