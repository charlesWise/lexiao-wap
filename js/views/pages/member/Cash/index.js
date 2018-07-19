'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import Picker from './../../../components/Picker';
import PayBox from "./PayBox";
import SetPayPwdBox from "./SetPayPwdBox";
var PICKER_ID;

class UserCash extends ScreenComponent {
    static pageConfig = {
        path: '/member/cash',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '提现'
        }
        this.state = {
            data: {},
            fee_id: '',
            fee_name: '',
            fee_arr: [],
            money: 0,
            maxMoney: 0,
            isShowTip: true
        };
    }

    componentDidMount() {
        this._getData();
        this._getFee('');
    }

    _showPicker() {
        PICKER_ID = this.getScreen().showPopup({
            content: <Picker
                dataSource={this.state.fee_arr}
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this.setState({
                        fee_id: data.id,
                        fee_name: data.name
                    })
                }}
            />
        })
    }

    _getFee(money) {
        this.setState({money})
        if(this.state.data) {
            if(money > this.state.data.maxMoney) {
                this.setState({isShowTip: false})
            }else {
                this.setState({isShowTip: true})
            }
        }
        api.getFeeSelect({
            money: money || ''
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            let list = res.data && res.data.list || [];
            let arr = []
            for(let i = 0;i < list.length;i++){
                arr.push({
                    id: list[i]['id'],
                    name: list[i]['cash_tip'] + '日到账（手续费' + parseFloat(list[i]['cash_ratio'])*100 +'%)'
                })
            }
            this.setState({
                fee_arr: arr,
                fee_id: '',
                fee_name: '',
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _getData() {
        api.merchantCashoutPage({
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            this.setState({
                data: res.data || {},
                has_pay_pass: res.data && res.data.has_pay_pass
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _doCheck(){
        if(this.state.data) {
            let fee = this.state.data.fee || 2;
            if(this.state.money<fee) {
                this.getScreen().toast(`提现金额不低于手续费${fee}元`);
                return;
            }else if(this.state.money> this.state.data.maxMoney) {
                return;
            }else {
                if (!this.state.has_pay_pass) {
                    this._setPaypwd()
                }else{
                    this._showPwdInput()
                }
            }
        }
    }

    _setPaypwd() {//设置
        PICKER_ID = this.getScreen().showPopup({
            content: <SetPayPwdBox
                type='SET_PWD'
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onEnd={(pwd) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this._doSetPwd(pwd)
                }}
            />
        })
    }

    _doSetPwd(pwd) {
        api.setPayPass({
            password: pwd
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            this.getScreen().toast('设置成功')
            this.setState({
                has_pay_pass: 1//密码设置成功后
            })
            this._checkPwd(pwd);
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _showPwdInput() {//输入
        PICKER_ID = this.getScreen().showPopup({
            content: <PayBox
                type='INPUT_PWD'
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onEnd={(pwd) => {
                    this._checkPwd(pwd)
                    this.getScreen().hidePopup(PICKER_ID)
                }}
            />
        })
    }

    _checkPwd(pwd) {
        api.CheckPayPass({
            password: pwd
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            this.getScreen().getNavigation().navigate('CashResult', {money: this.state.money})
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _doCashout() {
        api.merchantCashOut({
            bank_code: this.state.data.bank_code,
            sub_bank_name: this.state.data.sub_bank_name,
            money: this.state.money || 0,
            fee_id: this.state.fee_id,
            card_holder: this.state.data.card_holder,
            card_no: this.state.data.card_no
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            this.getScreen().getNavigation().navigate('CashResult', {
                day: res.data && res.data.day, money: this.state.money
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    render() {
        let data = this.state.data || {};
        return (
            <div className='user-cash'>
                <div className='bank-card'>
                    <div className='bank-logo'><img src={data.logo} /></div>
                    <h3 className='bank-name'>{data.bank_name}(尾号{data.card_no && data.card_no.substr(-4)})</h3>
                    {/*<p className='bank-desc'>单笔限额<span>万</span></p>*/}
                </div>
                <div className='cash-amount'>
                    <div className='cash-sum'>
                        <input type='tel' value={this.state.money} placeholder='0.00' onChange={(event)=>{
                            this._getFee(event.target.value)
                        }}/>
                        {
                            !!this.state.money&&<i className="icon-del" onClick={() => {
                                this.setState({
                                    money: '', 
                                    isShowTip: true
                                })
                            }} />
                        }
                    </div>
                    {
                        this.state.isShowTip ? <div className='user-balance'>
                            <label>账户余额 <i>{data.maxMoney}</i> 元</label>
                            <button onClick={()=>{
                                this.setState({money: data.maxMoney})
                            }} className='btn-cashall'>全部提现</button>
                        </div>
                        :
                        <div className='user-balance'>金额已超过可提现金额</div>
                    }
                </div>
                {/* <div className='cash-limit'>单笔{data.minCashMoney}元起提</div> */}
                <div className='cash-limit'>手续费{data.fee||2}元/笔</div>
                <div className='arrive-time' style={{display: 'none'}} onClick={this._showPicker.bind(this)}>
                    <label>选择到账时间</label>
                    <div className='select'>
                        <div>{this.state.fee_name}</div>
                    </div>
                </div>
                <div className='btn-control'>
                    <button onClick={this._doCheck.bind(this)} className={`btn-default ${this.state.money>0&&this.state.money<=data.maxMoney&&'btn-red'}`}>提现</button>
                </div>
                <div className="withdraw-detail"><a href='#/member/cash/cashoutlist'>提现明细</a></div>
            </div>
        )
    }
}

export default UserCash;