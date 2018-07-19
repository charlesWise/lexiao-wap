'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import _ from 'lodash';

import api from './../../../../controllers/api';
import TextPopup from './../../../components/TextPopup';
var popup;
export default class Invitation extends ScreenComponent {
    static pageConfig = {
        path: '/business/invitation',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我是BD'
        }
        this.state = {
            data: {},
            isChecked: false
        }
    }

    componentWillMount() {
        this._bind();
    }

    _bind() {
        api.getBDinvitedInfo({

        }).success((res) => {
            console.log('onsuccess>>>>', res)
            let data = res.data;
            if (!_.isEmpty(data)) {
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
                this.getScreen().getNavigation().navigate('RemoveBD')
            } else {
                this.getScreen().getNavigation().navigate('MyBusiness')
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _bindDo(status) {
        api.setBDinvited({
            id: this.state.data.id,
            status: status
        }).success((res) => {
            if(status == 0){
                // this._bind();
            } else {
                // window.location.href = '#/business/mybusiness'
                this.setState({
                    isChecked: true
                })
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _confuseConfirm(status) {
        this.getScreen().alert({
            title: < span style={{ display: 'inline-block', fontSize: '0.8rem', marginTop: '1rem' }}>拒绝绑定</span >,
            message: '您确定拒绝入职成为他的下级BD吗？',
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
        return (
            <div className='merchant-settled -invite'>
                <div className='focus-figure'>
                    <h2>乐消诚邀</h2>
                    <p>优质商户共同发展</p>
                </div>

                <div className="unbundling">
                    <h3
                        style={{
                            textAlign: 'left',
                            marginLeft: '0.75rem',
                            fontSize: '0.8rem',
                            color: '#333'
                        }}
                    >{data.name}邀请您成为他的下级BD</h3>
                    <p
                        style={{
                            textAlign: 'left',
                            marginLeft: '0.75rem',
                            marginTop: '0.75rem',
                            fontSize: '0.7rem',
                            color: '#666'
                        }}>联系方式：{data.mobile}</p>
                    <p
                        style={{
                            textAlign: 'left',
                            marginLeft: '0.75rem',
                            marginTop: '1.9rem',
                            fontSize: '0.7rem',
                            color: '#5294FF'
                        }}><a href='#/business/entry'>入职申请资料 ></a></p>
                        {
                            (data.bind_status == 1 && !this.state.isChecked) &&
                            <div className="unbundling-btn">
                                <a href='javascript:;' onClick={this._confuseConfirm.bind(this, 0)} className="unbundling-btn-fl">拒绝</a>
                                <a href='javascript:;' onClick={this._bindDo.bind(this, 1)} className="unbundling-btn-fr">接受</a>
                            </div>
                        }
                        {
                            (data.bind_status == 3 || this.state.isChecked) &&
                            <div className="unbundling-btn">
                                <a href='javascript:;' className="unbundling-btn-fl" style={{ border: 0, color: '#fff', backgroundColor: '#ccc', width: '13.75rem', margin: '0 auto' }}>平台审核中</a>
                            </div>
                        }
                </div>

                <div className='-feedback'>
                    <span onClick={this._doFeedback.bind(this)}>投诉建议</span>
                </div>
            </div>
        )
    }
}
