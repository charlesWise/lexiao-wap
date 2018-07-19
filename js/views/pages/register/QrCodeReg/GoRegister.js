'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import { StoreManager } from 'mlux';
import api from './../../../../controllers/api';

export default class GoRegister extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    componentDidMount() {
        
    }
    _onGoRegister = () => {
        const { mobile, verifyCode, password, isCheck } = this.props;
        const regMobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/, regPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]+$/;
        if(!mobile) {
            this.getScreen().toast('请输入手机号');
            return;
        }else {
            if(!regMobile.test(mobile)) {
                this.getScreen().toast('手机号格式错误，请核对');
                return;
            }
        }
        api.checkRegister({ // boolean 1 表示未注册乐消帐号
            mobile
        }).success((res) => {
            if(!verifyCode) {
                this.getScreen().toast('请输入验证码');
                return;
            }else {
                api.checkMobileRegCode({ // 检测手机注册短信动态码
                    mobile,
                    code: verifyCode
                }).success((res) => {
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
                        this.getScreen().toast('请先阅读并同意《乐消注册服务协议》', null, null, {fontSize: '.75rem'});
                        return;
                    }
                    this._goRegister();
                }).error((res) => {
                    this.getScreen().toast(res.message)
                    return;
                })
            }
        }).error((res) => {
            this.props.onTipsPopup&&this.props.onTipsPopup();
            return;
        })
    }
    _goRegister() {
        const { code, openid } = this.getScreen().getNavigation().state.params;
        const { mobile, password } = this.props;
        api.inviteRegister({
            mobile,
            password,
            code,
            openid
        }).success((res) => {
            // res.data: {uid: "81", trj: "2", merchant_id: 22} 1 已经注册投融家 2没有注册
            let navigation = this.getScreen().getNavigation();
            StoreManager['trjAuthUser'].set('info', {mobile, password});
            navigation.navigate('RegSuccess', {...res.data});
        }).error((res) => {
            this.getScreen().toast(res.message);
            return;
        })
    }
    render() {
        return (
            <div className="register-btn">
                <a href="javascript:;" onClick={this._onGoRegister}>立即注册</a>
            </div>
        )
    }
}
