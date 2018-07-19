'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Input from '../../../components/SearchBar/Input';

import api from './../../../../controllers/api';
import PayBox from "./SetPayPwdBox";
var PICKER_ID;

export default class ResetPayPassword extends ScreenComponent {
    static pageConfig = {
        path: '/member/resetpaypassword',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '重置支付密码'
        }
        this.state = {}
    }

    _sendSms() {
        let mobile = this.refs.mobile.value;
        if(!mobile) return;
        return api.getMobileCode({
            mobile: mobile
        })
    }

    _onSendSuccess(){
        this.setState({
            mobile: this.refs.mobile.value
        },()=>{
            this.refs.tip.show()
            setTimeout(() => {
                this.refs.tip.hide()
            }, 3000)
        })
    }

    _checkMobile() {
        let mobile = this.refs.mobile.value;
        let code = this.refs.code.value;
        if (!mobile || !code) return;
        api.checkForgtMobile({
            mobile: mobile,
            code: code
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            this._setPaypwd()
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _setPaypwd() {//设置
        PICKER_ID = this.getScreen().showPopup({
            content: <PayBox
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onEnd={(pwd) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this._resetPwd(pwd)
                }}
            />
        })
    }

    _resetPwd(pwd){
        console.log('pwd>>>>>', pwd)
        api.setPassword({
            password: pwd,
            password_repeat: pwd
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            this.getScreen().getNavigation().goBack();
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    render() {
        return (
            <div className='reset-pay-password'>
                <Tip ref='tip' mobile={this.state.mobile} />
                <div className='cell -notborder'>
                    <div className='cell-item'>
                        <div className='-value'><input ref='mobile' type='text' placeholder='请输入手机号' maxLength={11}/></div>
                    </div>
                    <div className='cell-item'>
                        <div className='-value'>
                            <input ref='code' type='text' placeholder='输入短信验证码' />
                            <SmsBtn onClick={this._sendSms.bind(this)} onSuccess={this._onSendSuccess.bind(this)} />
                        </div>
                    </div>
                    <div className='cell-control'>
                        {/* <button className='btn-primary -disabled'>下一步</button> */}
                        <button onClick={this._checkMobile.bind(this)} className='btn-primary'>下一步</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Tip extends Component {
    constructor(...props) {
        super(...props);
        this.state = {}
    }

    hide() {
        this.setState({
            show: false
        })
    }

    show() {
        this.setState({
            show: true
        })
    }

    render(){
        if(!this.state.show) return null;
        return (
            <div className='-message'>短信验证码已发送至{this.props.mobile}，请查收</div>
        )
    }
}


const COUNT_TIME = 60;
class SmsBtn extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            text: '获取验证码',
            isInvertal: false
        }
        this.timer = null;
        this.countTime = COUNT_TIME;
    }

    _onClick() {
        if (this.state.isInvertal) return;
        this._send();
    }

    _send() {
        let result = this.props.onClick && this.props.onClick() || {};
        result.success && result.success((res) => {
            console.log('onsuccess>>>>', res)
            this._countDown();
            this.props.onSuccess && this.props.onSuccess()
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _countDown() {
        this.state.isInvertal = true;
        this.timer = setInterval(() => {
            if (this.countTime < 1) {
                this._reset();
            } else {
                this.setState({
                    text: this.countTime--
                })
            }
        }, 1000)
    }

    _clearInterval() {
        if (this.timer)
            clearInterval(this.timer);
    }

    _reset() {
        this._clearInterval();
        this.timer = null;
        this.countTime = COUNT_TIME;
        this.state.isInvertal = false;
        this.state.text = '获取验证码';
        this.forceUpdate();
    }

    render() {
        return (
            <button onClick={this._onClick.bind(this)} className={this.state.isInvertal ? 'btn-captcha -disabled' : 'btn-captcha'}>{this.state.text}</button>
        )
    }
}