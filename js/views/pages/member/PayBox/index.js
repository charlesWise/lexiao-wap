'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class PayBox extends ScreenComponent {
    static pageConfig = {
        path: '/member/paybox',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '支付密码'
        }
    }

    render() {
        return (
            <div className="paybox">
                <div className="inner-box">
                    <span className="close"></span>
                    <h1 className="title">设置支付密码</h1>
                    <div className="tips">为了确保账户资金安全，请设置<br/>您的支付密码</div>
                    <div className="input-box">
                        <input/><input/><input/><input/><input/><input/>
                    </div>
                    <div className="notice">忘记密码?</div>
                    <div className="flexable-box">
                        <div className="flexable">
                            <div className="input-key">1</div>
                            <div className="input-key">2</div>
                            <div className="input-key">3</div>
                        </div>
                        <div className="flexable">
                            <div className="input-key">4</div>
                            <div className="input-key">5</div>
                            <div className="input-key">6</div>
                        </div>
                        <div className="flexable">
                            <div className="input-key">7</div>
                            <div className="input-key">8</div>
                            <div className="input-key">9</div>
                        </div>
                        <div className="flexable">
                            <div></div>
                            <div className="input-key">0</div>
                            <div className="key-del"><i></i></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

	
export default PayBox;