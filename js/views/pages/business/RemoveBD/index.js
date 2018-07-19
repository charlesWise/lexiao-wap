'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import TextPopup from './../../../components/TextPopup';
var popup;

export default class RemoveBD extends ScreenComponent {
    static pageConfig = {
        path: '/business/remove',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我是BD'
        }
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        this._unbind();
    }

    _unbind() {
        api.unbind({

        }).success((res) => {
            if (res.data) {
                this.setState({
                    data: res.data
                })
            }else{
                this.getScreen().getNavigation().navigate('MyMerchant')
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _unbindDo(status) {
        api.unbindDo({
            id: this.state.data.id,
            status: status
        }).success((res) => {
            this._unbind()
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _renderEmployee(data) {
        return (
            <div className="invitation">
                <dl className='invite-bd'>
                    <dt>姓名：{data.name}</dt>
                    <dd>手机号：{data.tel}</dd>
                </dl>
            </div>
        )
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
        let data = this.state.data || {}
        return (
            <div className='merchant-settled -invite'>
                <div className="removemerchant-text">
                    <p>{data.name}申请与您解除绑定关系</p>
                </div>
                {
                    this._renderEmployee(data)
                }

                <div className="unbundling-btn">
                    <a href='javascript:;' onClick={this._unbindDo.bind(this,0)} className="unbundling-btn-fl">拒绝</a>
                    <a href='javascript:;' onClick={this._unbindDo.bind(this,1)} className="unbundling-btn-fr">接受</a>
                </div>

                <div className='-feedback'>
                    <span onClick={this._doFeedback.bind(this)}>投诉建议</span>
                </div>
            </div>
        )
    }
}
	