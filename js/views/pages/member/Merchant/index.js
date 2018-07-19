'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Coordinate from "../../../components/Coordinate";

import { StoreManager } from 'mlux';

import api from './../../../../controllers/api';

import _ from 'lodash';

//商户状态 1.草稿，2.待BD确认 3.待商户确认，4.商户拒绝确认，5.待平台审核6.审核成功7.审核驳回'
class MyMerchant extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchant',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我是商户'
        }
        this.state = {
            coordType: 1, // 1 按日,2 按周,3 按月
            data: {},
            coordinateData: []
        }
    }

    componentDidMount() {
        this._getData();

        this._fetchStaticData("click", {
            statis_way: this.state.coordType,
            statis_item: this.state.selectType
        });
    }

    _getData() {
        api.indexPage({

        }).success((content) => {
            console.log('onsuccess>>>>', content)
            let data = content.data || {};
            StoreManager.user.set('info', data || []);
            StoreManager.user.set('auth', data.auth||[]);
            this.setState({
                data: data
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _unbindConfirm(data, user){
        this.getScreen().alert({
            message: data.is_employee ? '确定要解除与商户的绑定？' : '确定要解除与上级商户的绑定？',
            buttons: [
                {
                    text: "取消",
                    onPress: () => {
                    }
                },
                {
                    text: "确认",
                    onPress: () => {
                        this._onUnbind(data,user)
                    }
                }
            ]
        });
    }

    _onUnbind(data,user){
        if (data.is_employee){
            this._employUnbind(data,user)
        }
        if (data.is_merchant) {
            this._merchantUnbind(data, user)
        }
    }

    _employUnbind(data, user) {//职员解绑
        api.applyStaffMerUnbind({
        }).success((res) => {
            this.setState({
                isUnbind: true
            })
            console.log('onsuccess>>>>', res)
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _merchantUnbind(data, user){//子商户解绑
        api.applyMerUnbind({
            mid_level: 1,//子商户发起解绑
        }).success((res) => {
            this.setState({
                isUnbind: true
            })
            console.log('onsuccess>>>>', res)
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _fetchStaticData(type, data) {
        let tempData = data;
        if (type === "scroll") {
            tempData = {
                ...tempData,
                statis_way: this.state.coordType
            };
        } else if (type === "click") {
            tempData = { ...tempData, page: 1 };
        }
        api.statisticMerchantData(tempData).success((content, next, abort) => {
            if (content.boolen == 1) {
                this.setState({ coordinateData: content.data });
            } else {
                this.getScreen().toast(content.message, 3000);
            }
        });
    }

    _MerchantName(data) {
        let user = JSON.parse(localStorage.getItem('MLUX_STORAGE_user')) || {};
        let info = user.info || {};
        // MERCHANT_INFO_EDIT
        let auth = data.auth;
        let index1 = _.findIndex(auth, function (o) { return o['code'] == 'MERCHANT_INFO_EDIT'; });//查看详情

        let statusText= "";
        if(data.status == 7){
            statusText = "被驳回";
        }if(data.status == 5){
            statusText = "审核中";
        }

        return (
            <div className='-merchant-name' onClick={() => {
                if (index1 != -1){
                    this.props.navigation.navigate("MerchantInformation", {
                        merchant_id: data.merchant_id
                    });
                }
            }}>
                <div className='picture'><img src={data.logo} /></div>
                {/* <h2>{data.merchant_name}</h2> */}
                <div className="account-info">
                    <p className="account-name">{data.merchant_name}</p>
                    {
                        data.is_employee == 1 && 
                        <p className="account-info-cont"><em>{data.name}</em>  <em>{data.mobile}</em>  <em>{data.post || ''}</em> </p>
                    } {
                        ((data.is_merchant == 1 && data.pmid > 0) || data.is_employee == 1) && 
                        <p onClick={(event)=>{
                            event.stopPropagation();
                            this._unbindConfirm(data, info)
                        }} className="account-orange">解除绑定</p>
                    }
                </div>
                {data.audit_type == 2 && statusText && <span className="account-status">信息修改{statusText}</span>}
                {
                    index1 != -1 &&
                    <i className="icon-arrow"></i>
                }
            </div>
        )
    }

    _MerchantBalance(data) {
        let auth = data.auth || [];
        let index = _.findIndex(auth, function (o) { return o['code'] == 'CASHOUT'; });//提现
        let index1 = _.findIndex(auth, function (o) { return o['code'] == 'MONEY_MANAGEMENT'; });//提现
        return (
            <div className='-merchant-balance'>
                <dl className='-balance-module'>
                    <dt>账户余额(元)</dt>
                    <dd>{data.money}</dd>
                </dl>
                <div className='-handle'>
                    <a href='#/member/merchant/fundrecord'>资金记录</a>
                    {
                        //二期改判断条件
                        (((data.is_merchant == 1 && data.pmid > 0) && index1 == -1) || ((data.is_employee == 1 || (data.is_merchant == 1 && data.pmid == 0)) && index != -1)) &&
                        <a href='#/member/cash'>提现</a>
                    }
                </div>
            </div>
        )
    }
    
    _MerchantMenu(data) {
        let user = JSON.parse(localStorage.getItem('MLUX_STORAGE_user')) || {};
        let info = user.info || {};
        let auth = data.auth;
        let index1 = _.findIndex(auth, function (o) { return o['code'] == 'MERCHANT_ORDER'; });//买单记录
        let index2 = _.findIndex(auth, function (o) { return o['code'] == 'SUB_MERCHANT'; });//子商户管理
        let index3 = _.findIndex(auth, function (o) { return o['code'] == 'MERCHANT_EMPLOYEE'; });//职员管理
        let index4 = _.findIndex(auth, function (o) { return o['code'] == 'MERCHANT_COUPON_ADD'; });//发布福利券
        let index5 = _.findIndex(auth, function (o) { return o['code'] == 'MERCHANT_COUPON_CHECK'; });//福利券审核
        console.log(index1,index2,index3,index4)
        if (index1 == -1 && index2 == -1 && index3 == -1 && index4 == -1) return null;
        return (
            <div className='-merchant-menu'>
                {
                    index1 != -1 &&
                    <dl onClick={() => { window.location.href = '#/merchant/order/record' }}>
                        <dd></dd>
                        <dt>买单记录</dt>
                    </dl>
                    
                }
                {
                    (index2 != -1) &&
                    <dl onClick={() => { window.location.href = '#/member/submerchant' }}>
                        <dd></dd>
                        <dt>子商户管理</dt>
                    </dl>
                }
                {
                    index3 != -1 &&
                    <dl onClick={() => { window.location.href = '#/member/staffmanage' }}>
                        <dd></dd>
                        <dt>职员管理</dt>
                    </dl>
                    
                }
                {
                    (index4 != -1 || index5 != -1) &&
                    <dl onClick={() => { window.location.href = '#/member/coupon' }}>
                        <dd></dd>
                        <dt>福利券管理</dt>
                    </dl>
                }
            </div>
        )
    }

    _chartClick(type){
        if (this.state.coordType !== type) {
            this.setState({ coordType: type });
            this._fetchStaticData("click", {
                statis_way: type
            });
        }
    }

    _MerchantAward(data) {
        // MERCHANT_PRIZE
        let auth = data.auth;
        let index1 = _.findIndex(auth, function (o) { return o['code'] == 'MERCHANT_PRIZE'; });//查看详情
        return (
            <div className='-merchant-award' style={index1 != -1 ? {} : { display: 'none' }}>
                <div className='head'>
                    <h3>累计奖励(元)<span>{data.prize_money}</span></h3>
                    {
                        index1 != -1 &&
                        <a href='#/merchant/bonusdetail'>查看详情</a>
                    }
                </div>
                <div style={{ height: "10.9rem", width: "100%",background: "#fff",padding: "0 .75rem" }}>
                    <Coordinate
                        dataSource={this.state.coordinateData}
                        fetchStaticData={(type, data) => {
                            this._fetchStaticData(type, data)
                        }}
                    />
                </div>
                <div className="deiagram-btn" style={{background: "#fff"}}>
                    <a
                        onClick={this._chartClick.bind(this,1)}
                        className={this.state.coordType === 1 ? "active" : ""}
                    >
                        按日
                    </a>
                    <a
                        onClick={this._chartClick.bind(this, 2)}
                        className={this.state.coordType === 2 ? "active" : ""}
                    >
                        按周
                    </a>
                    <a
                        onClick={this._chartClick.bind(this, 3)}
                        className={this.state.coordType === 3 ? "active" : ""}
                    >
                        按月
                    </a>
                </div>
            </div>
        )
    }
    render() {
        let data = this.state.data || {};
        return (
            <div className='my-merchant'>
                {
                    // data.coupon_check_power > 0 &&
                    // < div className='rollnotice'>
                    //     <ul className='rollnotice-box'>
                    //         <li className='rollnotice-item'>您有{data.coupon_check_power || 0}个新的福利券待审核</li>
                    //     </ul>
                    //     <i className='btn-close'></i>
                    // </div>
                }
                {this._MerchantName(data)}
                {this._MerchantBalance(data)}
                {this._MerchantMenu(data)}
                {this._MerchantAward(data)}
                <div onClick={() => { window.location.href = '#/member/invite-user' }} className='-merchant-invite'>邀请用户</div>
            </div>
        )
    }
}

export default MyMerchant;   