
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

class Auth extends ScreenComponent {
    static pageConfig = {
        path: '/register/middletranslated/auth'
    }
    constructor(...props) {
        super(...props);
        this.state = {
            isCheck: true
        }
        this.navigationOptions = {
            title: '乐消派发礼包，速来领取！'
        }
    }
    _authorize() {
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
    _authorizeLogin = () => {
        if(!this.state.isCheck) {
            this.getScreen().toast('请先阅读并同意《投融家注册协议》', null, null, {fontSize: '.75rem'});
            return;
        }
        this._authorize();
    }
    _goProtocol = () => {
        let navigation = this.getScreen().getNavigation();
            navigation.navigate('TrjProtocol');
    }
    render() {
        return (
            <section className="authorized-login-wrapper">
                <div className="authorized-logo">
                    <i className="icon-trj-logo"></i>
                    <p>投融家</p>
                </div>
                <div className="info">
                    <p>请确认授权使用乐消账号登录投融家</p>
                    <p>*同时将为你开通投融家平台账号</p>
                    <p>
                        <i onClick={(e) => {
                            this.setState({
                                isCheck: !this.state.isCheck
                            })
                        }}
                        className={`${this.state.isCheck?'icon-agree-protocol':'icon-no-agree-protocol'}`}></i>
                        我已阅读并同意
                        <a href="javascript:;" onClick={this._goProtocol}>《投融家注册协议》</a>
                    </p>
                </div>
                <div className="buy-bill">
                    <a href="javascript:;" onClick={this._authorizeLogin}>授权并登录</a>
                </div>
            </section>
        );
    }
}

export default Auth;