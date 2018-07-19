'use strict'
import React from 'react';
import ScreenComponent from './../../../../components/ScreenComponent';
import api from "./../../../../../controllers/api";

export default class RegLoginStep extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    _onRegisterLogin = () => {
        const { mobile, password, dynamicCode, isCheck } = this.props;
        const regPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]+$/;
        if(!password) {
            this.getScreen().toast('请设置密码');
            return;
        }else {
            if(password.length < 6) {
                this.getScreen().toast('密码须为6位以上数字及字母的组合，请重设', null, null, {fontSize: '.6rem'});
                return;
            }
            if(!regPwd.test(password)) {
                this.getScreen().toast('密码须为6位以上数字及字母的组合，请重设', null, null, {fontSize: '.6rem'});
                return;
            }
        }
        if(!isCheck) {
            this.getScreen().toast('请阅读并同意《乐消注册服务协议》', null, null, {fontSize: '.75rem'});
            return;
        }
        api.lxregister({
            mobile, 
            passwd: password,
            smscode: dynamicCode
        }).success((res) => {
            this.getScreen().toast(res.message);
            this._checkTrjAuthorize();
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    _checkTrjAuthorize() {
        api.checkTrjAuthorize({}) //检查有没有积分授权，没有授权去授权页面
        .success(content => {
            let navigation = this.getScreen().getNavigation();
            if(content.data&&content.data.is_trj_authorize != 1) {
            navigation.navigate('Integral');
            }else {
            navigation.navigate('Main');
            }
        }).error(content => {
            this.getScreen().toast(content.message);
            return;
        });
      }
    render() {
        const { dynamicCode, password, isCheck } = this.props;
        return (
            <div className="reg-login-btn reg-go-login">
                <a href="javascript:;" 
                    className={`${dynamicCode&&password&&isCheck&&'active'}`}
                    onClick={this._onRegisterLogin}
                    >注册并登录</a>
            </div>
        )
    }
}
