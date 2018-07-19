'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

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
            this.props.onValidateCode&&this.props.onValidateCode();
        }
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
        this.setState({verifyText: `重新发送 ${this.countTime}s`})
        this.timer = setInterval(() => {
            if (this.countTime <= 1 ) {
                this._resetInterval();
            } else {
                let verifyText = `重新发送 ${--this.countTime}s`;
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