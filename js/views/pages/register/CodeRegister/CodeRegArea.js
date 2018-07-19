'use strict'
import React from 'react';
import { StoreManager } from 'mlux';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import Input from './../../../components/Input';
import ValidateCode from './ValidateCode';
import Agreement from './../QrCodeReg/Agreement';

class CodeRegArea extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            mobile: '',
            password: 'm123456',
            verifyCode: '',
            code: '',
            openid: '',
            isReg: false, // 默认未注册乐消
            isCheck: true
        }
    }
    componentDidMount() {
        // let navigation = this.getScreen().getNavigation(),
        // { code, openid } = navigation.state.params;
        let code = '1864271', openid = 'oqL8o0ubaYGGbUjK8Jv3ZFwKltRo';
        this.setState({code, openid})
    }
    _onChange = (value, inputType) => {
        if(inputType == 'MOBILE') {
            let mobile = value.replace(/[^\d]/g,'');
            if(mobile.length > 11) return;
            this.setState({mobile})
        }
        if(inputType == 'VERIFYCODE') {
            this.setState({verifyCode: value})
        }
    }
    _onValidateCode = () => {
        let mobile = this.state.mobile;
        api.checkRegister({ // boolean 是否乐消 1 未注册 0 注册
            mobile
        }).success((res) => { //未注册
            api.getMobileCodeRegister({ // 发送注册验证码
                mobile
            }).success((content) => {
                this.VALIDATECODE && this.VALIDATECODE.countDown && this.VALIDATECODE.countDown();
            }).error((content) => {
                this.getScreen().toast(content.message);
            })
        }).error((res) => { // 注册
            this.setState({isReg: !this.state.isReg})
            api.getMobileCodeLogin({ // 发送登录验证码
                mobile
            }).success((content) => {
                this.VALIDATECODE && this.VALIDATECODE.countDown && this.VALIDATECODE.countDown();
            }).error((content) => {
                this.getScreen().toast(content.message);
            })
        })
    }
    _onGoRegister = () => {
        const { mobile, verifyCode, isReg, isCheck } = this.state;
        if(!verifyCode) {
            this.getScreen().toast('请输入验证码');
            return;
        }else {
            if(isReg) { //注册乐消
                api.checkMobileLogCode({ // 验证登录验证码
                    mobile,
                    code: verifyCode
                }).success((content) => {
                    this._checkAgreement(isCheck);
                    this._goToTrj();
                }).error((content) => {
                    this.getScreen().toast(content.message);
                })
            }else { //未注册乐消
                api.checkMobileRegCode({ // 验证注册验证码
                    mobile,
                    code: verifyCode
                }).success((content) => {
                    this._checkAgreement(isCheck);
                    this._goRegister();
                }).error((content) => {
                    this.getScreen().toast(content.message);
                })
            }
        }
    }
    _goToTrj() {
        let navigation = this.getScreen().getNavigation(), 
            openid = this.state.openid;
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
    _goRegister() {
        const { mobile, password, code, openid } = this.state;
        api.inviteRegister({
            mobile,
            password,
            code,
            openid
        }).success((res) => {
            // res.data: {uid: "81", trj: "2", merchant_id: 22} 1 已经注册投融家 2没有注册
            let navigation = this.getScreen().getNavigation();
            StoreManager['trjAuthUser'].set('info', this.state);
            navigation.navigate('CodeSuccess', {...res.data});
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    _checkAgreement(isCheck) {
        if(!isCheck) {
            this.getScreen().toast('请先阅读并同意《乐消注册服务协议》', null, null, {fontSize: '.75rem'});
            return;
        }
    }
    render() {
        return (
            <div className="er-code-input-info">
                <div className="code-reg-row">
                    <i className="icon icon-mobile"></i>
                    <Input
                        ref= {v => this.MOBILEINPUT = v}
                        isReadOnly={this.state.isReadOnly}
                        type= {'tel'}
                        autofocus= {true}
                        placeholder= {'请输入手机号'}
                        value= {this.state.mobile}
                        inputType= {'MOBILE'}
                        onChange= {this._onChange}
                        />
                </div>
                <div className="code-reg-row">
                    <i className="icon icon-verify"></i>
                    <div className="verify-code">
                        <Input
                            type= {'tel'}
                            placeholder= {'请输入验证码'}
                            inputType= {'VERIFYCODE'}
                            onChange= {this._onChange}
                            />
                        <ValidateCode
                            ref= {v => this.VALIDATECODE = v}
                            mobile= {this.state.mobile}
                            onValidateCode= {this._onValidateCode}
                            />
                    </div>
                </div>
                <Agreement
                    isCheck={this.state.isCheck}
                    onCheck={() => {
                        this.setState({isCheck: !this.state.isCheck})
                    }}
                    />
                <div className="register-btn">
                    <a href="javascript:;" onClick={this._onGoRegister}>注册并登录</a>
                </div>
            </div>
        );
    }
}

export default CodeRegArea;