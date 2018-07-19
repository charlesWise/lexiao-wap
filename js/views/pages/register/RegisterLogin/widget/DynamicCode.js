'use strict'
import React from 'react';
import ScreenComponent from './../../../../components/ScreenComponent';

const COUNT_TIME = 60;
export default class DynamicCode extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            dynamicText: '获取验证码'
        }
        this.timer = null;
        this.countTime = COUNT_TIME;
        this.isContinue = false;
    }
    componentWillUnmount() {
        this._clearInterval();
    }
    _getVerifyCode = () => {
        this.props.onGraphicPopup&&this.props.onGraphicPopup();
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
            dynamicText: '重新获取'
        })
    }
    onCountDown = () => {
        if(this.isContinue) return;
        this.isContinue = true;
        this.setState({dynamicText: `重新获取(${this.countTime}s)`})
        this.timer = setInterval(() => {
            if (this.countTime <= 1 ) {
                this._resetInterval();
            } else {
                this.setState({dynamicText: `重新获取(${--this.countTime}s)`})
            }
        }, 1000)
    }
    render() {
        return (
            <em className={`dynamic ${!this.isContinue&&'active'}`}
                onClick={() => {
                    !this.isContinue&&this._getVerifyCode()
                }}>{this.state.dynamicText}</em>
        );
    }
}