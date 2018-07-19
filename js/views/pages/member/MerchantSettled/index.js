'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

class MerchantSettled extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchantsettled',
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

    receive(){
        this._getStatus();
    }

    _getStatus() {
        api.merchantApplyStatus({

        }).success((content) => {
            console.log('onsuccess>>>>', content)
            this.setState({
                data: content.data || {},
                status: content.data && content.data.status
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    render() {
        let data = this.state.data || {}
        return (
            <div className='merchant-settled'>
                <div className='focus-figure'>
                    <h2>乐消诚邀</h2>
                    <p>优质商户共同发展</p>
                </div>
                <div className='join-condition'>
                    <dl className='-condition-item'>
                        <dt className='title'>入驻申请</dt>
                        <dd className='desc'>基本资料填写，发起入驻申请</dd>
                    </dl>
                    <dl className='-condition-item'>
                        <dt className='title'>工作人员联系</dt>
                        <dd className='desc'>商务工作人员将在两个工作日内与您取得联系</dd>
                        <dd className='-data'>
                            <dl>
                                <dt>需要提前准备好以下资料：</dt>
                                <dd>
                                    <figure>
                                        <img src="/images/apply/icon_apply_id.png" />
                                        <figcaption>身份证</figcaption>
                                    </figure>
                                    <figure>
                                        <img src="/images/apply/icon_apply_business.png" />
                                        <figcaption>营业执照</figcaption>
                                    </figure>
                                    <figure>
                                        <img src="/images/apply/icon_apply_bank.png" />
                                        <figcaption>银行卡</figcaption>
                                    </figure>
                                </dd>
                            </dl>
                        </dd>
                    </dl>
                    <dl className='-condition-item'>
                        <dt className='title'>平台审核</dt>
                        <dd className='desc'>审核通过后，即可成功入驻</dd>
                    </dl>
                </div>
                {
                    (!this.state.status || this.state.status == 4) && 
                    <div className='btn-wrap'><button onClick={()=>{
                        window.location.hash = '#/member/merchantsettled/join'
                    }} className='btn-primary'>我要入驻</button></div>
                }
                {
                    this.state.status == 7 && 
                    <div className='btn-wrap'>
                        <button className='btn-primary' onClick={() => {
                            window.location.hash = '#/member/merchantsettled/join'
                        }}>重新申请</button>
                        <div className='-apply-state'>
                            <p className='-msg'>您于{data.date}的商户入驻申请被审核驳回！</p>
                            <p className='-link'><a onClick={()=>{
                                this.getScreen().alert({
                                    title: <span style={{ display: 'inline-block', fontSize: '0.9rem', marginTop: '1rem' }}>申请被驳回</span>,
                                    message: data.reject_reason || '',
                                    buttons: [
                                        {
                                            text: "我知道了",
                                            onPress: () => {
                                            }
                                        }
                                    ]
                                });
                            }} href="javascript:void(0);">查看驳回原因</a>|<a href="#/member/merchantsettled/joindata">我的申请资料</a></p>
                        </div>
                    </div>
                }
                {
                    (this.state.status == 2 || this.state.status == 5) && 
                    <div className='btn-wrap'>
                        <button className='btn-primary -disabled'>申请已提交，等待工作人员联系</button>
                        <div className='-apply-state'>
                            <p className='-link'><a href='#/member/merchantsettled/joindata'>我的申请资料</a></p>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default MerchantSettled;