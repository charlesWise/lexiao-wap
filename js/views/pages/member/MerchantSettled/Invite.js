'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import TextPopup from './../../../components/TextPopup';
var popup;

class MerchantSettledInvite extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchantsettled/invite',
        permission: true
    }
    
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '商户入驻'
        }
        this.state = {
            inviteData: {},
            isChecked: false,
            status: null //2.待BD确认 3.待商户确认，4.商户拒绝确认，5.待平台审核 6.审核成功 7.审核驳回
        }
    }

    componentDidMount() {
        this._getStatus();
    }
    receive(from, data) {
        console.log(from,data)
        this._getStatus();
    }
    _getStatus() {
        api.merchantApplyStatus({
        }).success((content) => {
            console.log('onsuccess>>>>', content)
            this.setState({
                inviteData: content.data || {},
                status: content.data && content.data.status
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _doAction(status) {
        if(status == 0){
            this.getScreen().alert({
                title: <img style={{ height: '2.75rem', width: '2.75rem', marginTop: '1.6rem' }} src="/icon/icon_waiting.png" />,
                message: "您确定拒绝入驻平台么？",
                buttons: [
                    { text: "再想想" },
                    {
                        text: "确认",
                        onPress: () => { this._checkDo(status) }
                    }
                ]
            });
        }else{
            this._checkDo(status)
        }
    }

    _checkDo(status){
        api.bdInviteMerCheckDo({
            status: status
        }).success((content) => {
            if(status == 1){
                this.setState({
                    isChecked: true
                })
                this.getScreen().alert({
                    title: <img style={{ height: '3.65rem', width: '3.65rem', marginTop: '1.6rem' }} src="/icon/icon_sucess.png" />,
                    message: "入驻申请提交平台审核中请耐心等待...",
                    buttons: [
                        {
                            text: "我知道了",
                            onPress: () => { this._getStatus() }
                        }
                    ]
                });
            }else{
                this._getStatus()
            }
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
    _doInviteData(status) {
        let navigation = this.getScreen().getNavigation();
            navigation.navigate('MerchantSettledInviteData', { status });
    }
    render() {
        let inviteData = this.state.inviteData;
        return (
            <div className='merchant-settled -invite'>
                <div className='focus-figure'>
                    <h2>乐消诚邀</h2>
                    <p>优质商户共同发展</p>
                </div>

                <dl className='invite-bd'>
                    <dt>乐消BD邀您的商户入驻平台！</dt>
                    <dd>BD姓名：{inviteData.bd_name}</dd>
                    <dd>BD联系方式：{inviteData.bd_mobile}</dd>
                </dl>

                {
                    (this.state.status == 3) && 
                    <div className='btn-wrap'>
                    {
                        // <p className='-join-data-link'><a href="javascript:;" onClick={this._doInviteData.bind(this, this.state.status)}>我的申请资料 ></a></p>
                    }
                        <button className='btn-primary' onClick={this._doInviteData.bind(this, this.state.status)}>核对申请资料</button>
                    {
                        // <button className='btn-primary' onClick={this._doAction.bind(this, 1)}>接受</button>
                        // <button className='btn-primary-hollow' onClick={this._doAction.bind(this, 0)}>拒绝</button>
                    }
                    </div>
                }

                {
                    (this.state.status == 2 || this.state.status == 5 || this.state.isChecked) && 
                    <div className='btn-wrap'>
                        <p className='-join-data-link'><a href="javascript:;" onClick={this._doInviteData.bind(this, this.state.status)}>我的申请资料 ></a></p>
                        <button className='btn-primary -disabled'>平台审核中</button>
                    </div>
                }
                
                <div className='-feedback'>
                    <span onClick={this._doFeedback.bind(this)}>投诉建议</span>
                </div>
            </div>
        )
    }
}

export default MerchantSettledInvite;