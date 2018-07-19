'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import Share from './../../../../util/Share';
import ScreenComponent from './../../../components/ScreenComponent';
import WxPopup from './WxPopup';

class InviteUser extends ScreenComponent {
    static pageConfig = {
        path: '/member/invite-user',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '邀请用户'
        }
        this.state = {
            inviteData: {}
        }
    }
    componentDidMount() {
        this._getQrCodde();
    }
    _getQrCodde() {
        api.qrCodde({}).success((content, next, abort) => {
            if(content.boolen == 1) {
                this.setState({inviteData: content.data})
            }
        })
    }
    _wxPopup = () => { // 针对微信分享引导用户
        const WXPOPUP = this.getScreen().showPopup({
            content: <WxPopup onClose = {() => {
                        this.getScreen().hidePopup(WXPOPUP);
                    }}
                />
        })
    }
    _shareInfo(){
        let title = '分享标题',
            content = '我是描述描述描述描述描述描述描述描述描述描述描述描述',
            imgurl = window.location.origin + '/images/index/kendeji.png',
            shareurl = window.location.href,
            params = { title, content, imgurl, shareurl };
        Share.goToShare(params, this._wxPopup);
    }
    render() {
        let inviteData = this.state.inviteData;
        return (
            <div className='invite-user'>
                <div className='banner'><img src='/images/invite/invite_banner.png'/></div>
                <div className='invite-code'>
                    <img className='qr-code' src={inviteData.or_code}/>
                    <p className='title'>推荐码：<span>{inviteData.lx_code}</span></p>
                </div>
                <div className='invite-share'>
                    <div className='invite-share-item' onClick={() => this._shareInfo()}>
                        <i className='icon -wechat'></i>
                        <p className='name'>微信</p>
                    </div>
                    <div className='invite-share-item' onClick={() => this._shareInfo()}>
                        <i className='icon -moments'></i>
                        <p className='name'>微信朋友圈</p>
                    </div>
                    <div className='invite-share-item' onClick={() => this._shareInfo()}>
                        <i className='icon -qq'></i>
                        <p className='name'>QQ好友</p>
                    </div>
                    <div className='invite-share-item' onClick={() => this._shareInfo()}>
                        <i className='icon -weibo'></i>
                        <p className='name'>微博</p>
                    </div>
                </div>

                <a href="#/member/my-invite-user" className='link-my-invite'>我的邀请</a>
            </div>
        )
    }
}

export default InviteUser;