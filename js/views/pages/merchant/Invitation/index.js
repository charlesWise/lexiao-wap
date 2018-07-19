'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import TextPopup from './../../../components/TextPopup';

import _ from 'lodash';

var popup;
export default class Invitation extends ScreenComponent {
    static pageConfig = {
        path: '/merchant/invitation',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我是商户'
        }
        this.state = {
            data: {}
        }
    }

    componentWillMount() {
        this._bind();
    }

    _bind() {
        api.inviteMerStaffInfo({

        }).success((res) => {
            console.log('onsuccess>>>>', res)
            let data = res.data;
            if (data) {
                this.setState({
                    data: res.data
                })
            } else {
                this._unbind()
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _unbind() {
        api.unbind({

        }).success((res) => {
            let data = res.data;
            if (data) {
                this.getScreen().getNavigation().navigate('RemoveMerchant')
            } else {
                this.getScreen().getNavigation().navigate('MyMerchant')
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _bindDo(status) {
        api.bindMerStaff({
            id: this.state.data.id,
            status: status
        }).success((res) => {
            if(status == 0){
                // this._bind();
            }else{
                // this._unbind();
                this.getScreen().getNavigation().navigate('MyMerchant')//子商户跳转我是商户
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _getTypeName(type){
        if(type == 1){
            return '子商户'
        }else if(type == 2){
            return '职员'
        } else if (type == 3){
            return 'BD'
        }else{
            return ''
        }
    }

    _confuseConfirm(status){
        this.getScreen().alert({
            title: < span style={{ display: 'inline-block', fontSize: '0.8rem', marginTop: '1rem' }}>拒绝绑定</span >,
            message: '您确定拒绝该商户的绑定？',
            buttons: [
                {
                    text: "再想想",
                    onPress: () => {
                    }
                },
                {
                    text: "确认",
                    onPress: () => {
                        this._bindDo(0)
                        let data = this.state.data;
                        if (data.uid_type == 1) {
                            this.getScreen().getNavigation().navigate('MyMerchant')//子商户跳转我是商户
                        } else if (data.uid_type == 2) {
                            //职员
                        }
                    }
                }
            ]
        });
    }

    _doFeedback(){
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
        let data = this.state.data || {}

        let auth = data.auth || [];
        let index = _.findIndex(auth, function (o) { return o['code'] == 'MONEY_MANAGEMENT'; });

        return (
            <div className='merchant-settled -invite'>
                <div className='focus-figure'>
                    <h2>乐消诚邀</h2>
                    <p>优质商户共同发展</p>
                </div>

                <div className="invitation">
                    <div className="invite-pic"><img src={data.logo ? data.logo : "/images/business/default-image.png"} /></div>
                    <dl className='invite-bd'>
                        <dt>商户{data.name}</dt>
                        <dd>商户地址：{data.address}</dd>
                        <dd>商户账户：{data.tel}</dd>
                    </dl>
                </div>

                <div className="unbundling">
                    <h3>商户{data.name}邀请您成为他的{this._getTypeName(data.uid_type)}</h3>
                    {
                        (data.uid_type == 1 && index != -1) &&
                        <p>并授权主账户统一支配管理您的资金账户</p>
                    }
                    <div className="unbundling-btn">
                        <a href='javascript:;' onClick={this._confuseConfirm.bind(this, 0)} className="unbundling-btn-fl">拒绝</a>
                        <a href='javascript:;' onClick={this._bindDo.bind(this, 1)} className="unbundling-btn-fr">接受</a>
                    </div>
                </div>

                <div className='-feedback'>
                    <span onClick={this._doFeedback.bind(this)}>投诉建议</span>
                </div>
            </div>
        )
    }
}
