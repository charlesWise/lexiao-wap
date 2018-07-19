'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class Unbundling extends ScreenComponent {
    static pageConfig = {
        path: '/submerchant/unbundling',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我是BD'
        }
    }

    render() {
        return (
            <div className="mybusiness">
                <div className="mybusiness-name">
                    <div className="picture">
                        <img src="images/index/kendeji.png"/>
                    </div>
                    <div className="pic-text">
                        <h2>BD毛某某</h2>
                        <p>15823415689</p>
                    </div>
                </div>
                <div className="unbundling">
                    <h3>BD毛某某申请与您解除绑定关系</h3>
                    <div className="unbundling-btn"><a className="unbundling-btn-fl">保存草稿</a><a className="unbundling-btn-fr">提交审核</a></div>
                </div>
            </div>
        )
    }
}

	
export default Unbundling;