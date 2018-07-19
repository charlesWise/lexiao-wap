'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';

const COUNT_TIME = 60;
export default class ValidateCode extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            verifyText: '获取验证码'
        }
        this.timer = null;
        this.countTime = COUNT_TIME;
        this.isContinue = false;
    }
    componentWillUnmount() {
        this._clearInterval();
    }
    _getVerifyCode = () => {
        const { mobile } = this.props;
        if(!mobile) {
            this.getScreen().toast('请输入手机号');
            return;
        }else {
            const reg = /^[1][3,4,5,7,6,8,9][0-9]{9}$/;
            if(!reg.test(mobile)) {
                this.getScreen().toast('手机号格式错误，请核对');
                return;
            }
            this._whetherReg(mobile)
        }
    }
    _whetherReg(mobile) {
        api.checkRegister({ // boolean 1 表示未注册乐消帐号
            mobile
        }).success((res) => {
            this.props.onGraphicPopup&&this.props.onGraphicPopup();
        }).error((res) => {
            this.props.onTipsPopup&&this.props.onTipsPopup();
            return;
        })
    }
    _clearInterval = () => {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    _resetInterval = () => {
        this._clearInterval();
        this.isContinue = false;
        this.timer = null;
        this.countTime = COUNT_TIME;
        this.setState({
            verifyText: '重新获取验证码'
        })
    }
    countDown = () => {
        if(this.isContinue) return;
        this.isContinue = true;
        this.setState({verifyText: `${this.countTime}秒重新获取`})
        this.timer = setInterval(() => {
            if (this.countTime <= 1 ) {
                this._resetInterval();
            } else {
                let verifyText = `${--this.countTime}秒重新获取`;
                this.setState({verifyText})
            }
        }, 1000)
    }
    render() {
        return (
            <span className="verify-btn"
                onClick={() => {
                    !this.isContinue&&this._getVerifyCode()
                }}>{this.state.verifyText}</span>
        );
    }
}