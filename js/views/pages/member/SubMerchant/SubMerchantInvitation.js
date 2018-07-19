'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import TextPopup from './../../../components/TextPopup';
var popup;

class SubMerchantInvitation extends ScreenComponent {
    static pageConfig = {
        path: '/submerchant/invitation',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '商户入驻'
        }
        this.state = {
            status: null
        }
    }

    componentDidMount() {
        this._getStatus();
    }

    _getStatus() {
        api.merchantApplyStatus({

        }).success((content) => {
            console.log('onsuccess>>>>', content)
            this.setState({
                status: content.data && content.data.status
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _doFeedback() {
        popup = this.getScreen().showPopup({
            content: <TextPopup
                onClose={
                    () => {
                        this.getScreen().hidePopup(popup);
                    }
                }
            />
        })
    }

    render() {
        return (
            <div className='merchant-settled -invite'>
                <div className='focus-figure'>
                    <h2>乐消诚邀</h2>
                    <p>优质商户共同发展</p>
                </div>

                <div className="invitation">
                    <div className="invite-pic"><img src="./images/index/kendeji.png"/></div>
                    <dl className='invite-bd'>
                        <dt>商户王宝和大酒店</dt>
                        <dd>商户地址：上海市黄浦区南京西路100号</dd>
                        <dd>商户账户：138 0057 0571</dd>
                    </dl>
                </div>

                <div className="unbundling">
                    <h3>王宝和大酒店邀请您成为他的职员</h3>
                    <p>并授权主账户统一支配管理您的资金账户</p>
                    <div className="unbundling-btn"><a className="unbundling-btn-fl">拒绝</a><a className="unbundling-btn-fr">接受</a></div>
                </div>

                <div className='-feedback'>
                    <span onClick={this._doFeedback.bind(this)}>投诉建议</span>
                </div>
            </div>
        )
    }
}

export default SubMerchantInvitation;