
'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import BuildConfig from 'build-config';

var baseUrl = '';
if (BuildConfig.ENV === 'dev') {
    baseUrl = 'https://wapescrow.tourongjia.com/';
} else if (BuildConfig.ENV === 'ft') {
    baseUrl = 'https://wapescrow.tourongjia.com/';
}else if(BuildConfig.ENV ==='prod'){
    baseUrl = 'https://m.tourongjia.com/';
}
var autoLoginUrl = 'api/Track/Lexiao/trjRegisterAutoLogin?';

class ConfirmLogin extends ScreenComponent {
    static pageConfig = {
        path: '/register/middletranslated/confirmlogin'
    }
    constructor(...props) {
        super(...props);
        this.state = {
        }
        this.navigationOptions = {
            title: '确认登录'
        }
    }
    _confirmLogin = () => {
        let navigation = this.getScreen().getNavigation(),
        { openid } = navigation.state.params;
        api.loginWx({openid}).success((res) => {
            api.trjAuthorizeTwo({openid}).success((content) => {
                let trjRegInfo = res.data,
                    redirect_url = `${baseUrl}${autoLoginUrl}plat_id=${trjRegInfo.plat_id}&sign_type=${trjRegInfo.sign_type}&sign=${trjRegInfo.sign}&pf_uid=${trjRegInfo.pf_uid}&app_request=${trjRegInfo.app_request}&timestamp=${trjRegInfo.timestamp}&data=${trjRegInfo.data}&lxUser=${trjRegInfo.lx_user}`;
                    window.location.href = redirect_url;
            }).error((content) => {
                this.getScreen().toast(content.message);
            })
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    render() {
        return (
            <section className="authorized-login-wrapper">
                <div className="authorized-logo">
                    <i className="icon-trj-logo"></i>
                    <p>投融家</p>
                </div>
                <div className="info" style={{padding: '1rem 0 0 0'}}>
                    <p style={{textAlign: 'center', fontSize: '.8rem', color: 'rgba(51,51,51,1)'}}>请确认使用乐消账号登录投融家</p>
                </div>
                <div className="buy-bill">
                    <a href="javascript:;" onClick={this._confirmLogin} style={{fontSize: '.8rem'}}>确认登录</a>
                </div>
            </section>
        );
    }
}

export default ConfirmLogin;