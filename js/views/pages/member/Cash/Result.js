'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

class CashResult extends ScreenComponent {
    static pageConfig = {
        path: '/member/cash/result',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '提现'
        }
        this.state = {
            result: true,
            cashInfo: {}
        }
    }

    componentDidMount() {
        let navigation = this.getScreen().getNavigation();
        let { money } = navigation.state.params;
        this._getMerchantCashOut(money);
    }
    _getMerchantCashOut(money) {
        api.merchantCashoutPage({
        }).success((res) => {
            const { 
                bank_code,
                sub_bank_name,
                card_holder,
                card_no } = res.data;
            let params = {
                bank_code,
                sub_bank_name,
                money,
                card_holder,
                card_no
            }
            api.merchantCashOut(params).success((conent) => {
                console.log('onsuccess>>>>', conent)
                this.setState({cashInfo: conent.data})
            }).error((conent) => {
                this.getScreen().toast(conent.message)
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _CashResultSuccess(){
        let now = new Date();
        let t = '今';
        if(now.getHours()>=15){
            t = '明'
        }
        return(
            <div className='cash-result -success'>
                <div className='head'>
                    <img src='/icon/icon_success_120.png' />
                    <h3>申请提现成功</h3>
                    {/* <button className='btn-close'>关闭</button> */}
                </div>
                <div className='body'>
                    <dl>
                        <dt>到账时间</dt>
                        {/* <dd>资金将于{this.state.day}，24点前到账，如遇节假日顺延</dd> */}
                        <dd>资金将于{t}天24点前到账，如遇节假日顺延</dd>
                    </dl>
                    <button className='btn-primary' onClick={()=>{
                        window.location.href = '#/member/merchant'
                    }}>完成</button>
                </div>
            </div>
        )
    }

    _CashResultError(){
        return(
            <div className='cash-result -error'>
                <div className='head'>
                    <img src='/icon/icon_error_120.png' />
                    <h3>申请提现失败</h3>
                    {/* <button className='btn-close'>关闭</button> */}
                </div>
                <div className='body'>
                    <dl>
                        <dd>失败原因，由后台设置返回</dd>
                    </dl>
                    <button className='btn-primary'>重新提现</button>
                </div>
            </div>
        )
    }
    _cashSuccess() {
        // let now = new Date();
        // let t = '今';
        // if(now.getHours()>=16|| (now.getHours()>15&&now.getMinutes()>50)){
        //     t = '明'
        // }

        let now = new Date();
        let t = '今';
        if(now.getHours()>=15){
            t = '明'
        }
        const { account_no, amount, bank_name, day, fee } = this.state.cashInfo;
        return (
            <div className="cash-success">
                <ul>
                    <li>
                        <i className="icon-cash-check"></i>
                        <em>
                            <span className="bottom"></span>
                            <span className="top"></span>
                            <span className="down"></span>
                        </em>
                        <i className="icon-cash-horn"></i>
                    </li>
                    <li>
                        <p className="name">申请提现成功</p>
                        <p className="bank">{bank_name}({account_no&&account_no.slice(-4)})</p>
                        <p className="charge"><em>{amount}元</em>(已扣除手续费{fee}元)</p>
                        <p className="tip">预计{t}天24点前到账，如遇节假日顺延</p>
                    </li>
                </ul>
                <div className="cash-btn-wrap">
                    <a  
                        href='#/member/cash/cashoutlist'
                        className="active">查看进度</a>
                    <a  
                        href='#/member/merchant'>完成</a>
                </div>
            </div>
        )
    }
    _cashError() {
        return (
            <div className="cash-error">
                <div className="error-top">
                    <i className="icon-error-120"></i>
                    <p>申请提现失败</p>
                </div>
                <div className="cash-btn-wrap error-btn">
                    <p className="tips">失败原因，由后台设置返回</p>
                    <a  
                        href='javascript:'
                        className="active">重新提现</a>
                </div>
            </div>
        )
    }
    render() {
        return (
            <div className="cash-wrapper">
                {/*this.state.result ? this._CashResultSuccess() : this._CashResultError()*/}
                {this.state.result ? this._cashSuccess() : this._cashError()}
            </div>
        )
    }
}

export default CashResult;