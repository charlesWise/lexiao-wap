'use strict'
import React from 'react';
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

export default class UseNotePopup extends ScreenComponent {
    constructor(...props){
        super(...props);
        this.state = {
            isCheck: true
        }
    }
    _stopPropagation = (e) => {
        e.stopPropagation();
    }
    _onClose = () => {
        this.props.onClose&&this.props.onClose();
    }
    _authorize() {
        const { mobile, password } = this.props;
        api.trjRegister({
            mobile, password
        }).success((res) => {
            // 去跳投融家对应下载页
            let trjRegInfo = res.data,
                appDownType = 1,  //区分投融家是否app下载服务端跳对应页面
                redirect_url = `${baseUrl}${autoLoginUrl}plat_id=${trjRegInfo.plat_id}&sign_type=${trjRegInfo.sign_type}&sign=${trjRegInfo.sign}&pf_uid=${trjRegInfo.pf_uid}&app_request=${trjRegInfo.app_request}&timestamp=${trjRegInfo.timestamp}&data=${trjRegInfo.data}&appDownType=${appDownType}`;
            window.location.href = redirect_url;
        }).error((res) => {
            this.getScreen().toast(res.message)
            return;
        })
    }
    _goDownLoad = () => {
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
    render(){
        return <div className="use-note-popup-content" onClick={this._stopPropagation}>
            <div className="popup-content">
                <p>代金券使用说明</p>
                <p>1.请先确认授权使用乐消账号注册投融家。</p>
                <p>2.授权后下载投融家App，并使用你的乐消账号及密码登录。</p>
                <p>
                    <i  onClick={(e) => {
                            this.setState({
                                isCheck: !this.state.isCheck
                            })
                            e.stopPropagation();
                        }}
                    className={`${this.state.isCheck?'icon-agree-protocol':'icon-no-agree-protocol'}`}></i>
                    我已阅读并同意
                    <a href="javascript:;" onClick={this._goProtocol}>《投融家注册协议》</a>
                </p>
                <p className="download">
                    <a href="javascript:;"
                        onClick={this._goDownLoad}>授权并下载投融家APP</a>
                </p>
            </div>
            <p className="close">
                <a className="icon-white-close"
                    onClick={this._onClose}
                    ></a>
            </p>
        </div>
    }
}
