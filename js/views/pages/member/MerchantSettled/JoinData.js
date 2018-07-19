'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

class MerchantJoin extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchantsettled/joindata',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我的申请资料'
        }
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        this._getData();
    }

    _getData() {
        api.applyInfo({

        }).success((content) => {
            console.log('onsuccess>>>>', content)
            this.setState({
                data: content.data || {}
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    render() {
        let data = this.state.data || {}
        return (
            <div className='merchant-settled'>
                <div className='join-apply'>
                    <h3 className='head'>商户信息<span>（请填写真实信息）</span></h3>
                    <div className='cell body -notborder -notborder-item'>
                        <div className='cell-item'>
                            <div className='-label'>商户名</div>
                            <div className='-value'>{data.merchant_name}</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>法人</div>
                            <div className='-value'>{data.person}</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>营业执照</div>
                            <div className='-value'>{data.licences}</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>商户电话</div>
                            <div className='-value'>{data.tel}</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>商户地址</div>
                            <div className='-value'>{data.province}{data.city}{data.area}<br />{data.address}</div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label'>商户介绍</div>
                            <div className='-value'>{data.introduction}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MerchantJoin;