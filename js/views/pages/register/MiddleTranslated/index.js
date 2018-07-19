'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';

class MiddleTranslated extends ScreenComponent {
    static pageConfig = {
        path: '/register/middletranslated'
    }
    constructor(...props) {
        super(...props);
    }
    componentDidMount() {
        this._initInfo();
    }
    _initInfo() {
        let navigation = this.getScreen().getNavigation(),
        { openid } = navigation.state.params;
        api.getMcode({openid}).success((res) => {
            let code = res.data;
            api.getCookieInfo({code}).success((content) => {}).error((content) => { //后台存code
                this.getScreen().toast(content.message);
            })
            api.checkWxBindLx({openid}).success((content) => {
                if(content.data.status == 1) {
                    this._goToTrj(openid);
                }else {
                    navigation.navigate('WxBillLog', {code, openid});
                }
            }).error((content) => {
                this.getScreen().toast(content.message);
            })
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    _goToTrj(openid) {
        let navigation = this.getScreen().getNavigation();
        api.loginWx({openid}).success((res) => {
            if(res.data&&res.data.lx_user == 1) {
                navigation.navigate('ConfirmLogin', {openid});
            }else {
                navigation.navigate('Auth', {openid});
            }
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    render() {
        return null;
    }
}

export default MiddleTranslated;