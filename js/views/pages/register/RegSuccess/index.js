'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import { StoreManager } from 'mlux';
import api from './../../../../controllers/api';
import UseNotePopup from './UseNotePopup';
import CoopMorePopup from './CoopMorePopup';
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

class RegSuccess extends ScreenComponent {
    static pageConfig = {
        path: '/register/regsuccess'
    }
    constructor(...props) {
        super(...props);
        this.state = {
            couponData: {}
        }
        this.navigationOptions = {
            title: '乐消派发礼包，速来领取！'
        }
    }
    componentDidMount() {
        this._getSuccessData();
    }
    _getSuccessData() {
        let navigation = this.getScreen().getNavigation();
        const { uid, merchant_id } = navigation.state.params;
        api.showCoupon({
            uid,
            merchant_id
        }).success((res) => {
            this.setState({
                couponData: res.data
            })
            if(res.data && (res.data.discount_amount == 0 || res.data.discount_amount == '')) {
                this._trjPayBill();
            }
        }).error((res) => {
            this.getScreen().toast(res.message)
            return;
        })
    }
    _useNotePopup = () => {
        const { mobile, password } = StoreManager['trjAuthUser'].get('info');
        const USENOTEPOPUP = this.getScreen().showPopup({
            content: <UseNotePopup 
                mobile={mobile} 
                password={password}
                onClose = {() => {
                    this.getScreen().hidePopup(USENOTEPOPUP);
                }} />
        })
    }
    _trjPayBill = () => {
        let navigation = this.getScreen().getNavigation();
        const { trj } = navigation.state.params;    // 1 已经注册投融家 2没有注册
        if(trj == 2) {
            let navigation = this.getScreen().getNavigation();
            navigation.navigate('AuthorizedLogin');
        }else {
            const { mobile, password } = StoreManager['trjAuthUser'].get('info');
            api.trjRegister({
                mobile, password
            }).success((res) => {
                // 去跳投融家wap首页并登录投融家
                let trjRegInfo = res.data,
                    redirect_url = `${baseUrl}${autoLoginUrl}plat_id=${trjRegInfo.plat_id}&sign_type=${trjRegInfo.sign_type}&sign=${trjRegInfo.sign}&pf_uid=${trjRegInfo.pf_uid}&app_request=${trjRegInfo.app_request}&timestamp=${trjRegInfo.timestamp}&data=${trjRegInfo.data}`;
                window.location.href = redirect_url;
            }).error((res) => {
                this.getScreen().toast(res.message)
                return;
            })
        }
    }
    _coopMorePopup = () => {
        const COOPMOREPOPUP = this.getScreen().showPopup({
            content: <CoopMorePopup 
                onClose = {() => {
                    this.getScreen().hidePopup(COOPMOREPOPUP);
                }} />
        })
    }
    render() {
        if(Object.keys(this.state.couponData).length <=0) return null;
        const { logo, merchant_name, discount_amount, show_time, type} = this.state.couponData;
        let navigation = this.getScreen().getNavigation();
        const { trj } = navigation.state.params;    // 1 已经注册投融家 2没有注册
        return (
            <section className="reg-success-wrapper">
                <div className="success-head">
                    <p><i className="icon-auth-logo"></i></p>
                    <p><i className="icon-hook"></i></p>
                    <p>成功注册乐消</p>
                </div>
                <div className="vouchers">
                    <p className="title"><i className="icon-left-gradient"></i><span>恭喜获得{type == 1 ? '代金券': '满减券'}</span><i className="icon-right-gradient"></i></p>
                    <ul>
                        <li>
                            <div className="info">
                                <span><img src={logo} /></span>
                                <span>{merchant_name} {type == 1 ? '代金券': '满减券'}</span>
                                <span><i>￥</i>{discount_amount}</span>
                            </div>
                            <p className="effect-time">有效期至：{show_time}</p>
                        </li>
                    </ul>
                </div>
                <div className="buy-bill">
                    <a href="javascript:;" onClick={this._trjPayBill}>进入投融家，买单使用</a>
                    {
                        // trj == 2&&<a href="javascript:;" onClick={this._useNotePopup}>下载投融家App，买单使用</a>
                    }
                </div>
                <div className="cooperation">
                    <p>投融家 - 乐消合作伙伴，专注服务于新中产家庭的互联网金融服务平台 - <a href="javascript:;" onClick={this._coopMorePopup}>了解更多»</a></p>
                </div>
            </section>
        );
    }
}

export default RegSuccess;