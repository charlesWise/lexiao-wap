'use strict'
import React from 'react';
import BuildConfig from 'build-config';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import Input from './../../../components/Input';
import ValidateCode from './ValidateCode';

var baseUrl = '';
if (BuildConfig.ENV === 'dev') {
    baseUrl = 'https://wapescrow.tourongjia.com/';
} else if (BuildConfig.ENV === 'ft') {
    baseUrl = 'https://wapescrow.tourongjia.com/';
}else if(BuildConfig.ENV ==='prod'){
    baseUrl = 'https://m.tourongjia.com/';
}
var autoLoginUrl = 'api/Track/Lexiao/trjRegisterAutoLogin?';

class EnterInput extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            mobile: '',
            verifyCode: '',
            isNextPage: false,
            code: '',
            openid: ''
        }
    }
    componentDidMount() {
        let navigation = this.getScreen().getNavigation(),
        { code, openid } = navigation.state.params;
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
    _onNext = () => {
        api.loginOrRegister({
            mobile: this.state.mobile
        }).success((res) => {
            if(!res.data.status) {
                let navigation = this.getScreen().getNavigation();
                navigation.navigate('QrCodeReg', {
                    mobile: this.state.mobile, 
                    code: this.state.code, 
                    openid: this.state.openid
                });
            }else {
                this.setState({isNextPage: true})
            }
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    _onValidateCode = () => {
        api.getMobileCodeLogin({
            mobile: this.state.mobile
        }).success((res) => {
            this.VALIDATECODE && this.VALIDATECODE.countDown && this.VALIDATECODE.countDown();
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    _onGoRegister = () => {
        api.checkMobileLogCode({
            mobile: this.state.mobile,
            code: this.state.verifyCode
        }).success((res) => {
            this._goToTrj();
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    _goToTrj() {
        api.loginWx({
            mobile: this.state.mobile,
            openid: this.state.openid
        }).success((res) => {
            // 去跳投融家wap首页并登录投融家
            let trjRegInfo = res.data,
                redirect_url = `${baseUrl}${autoLoginUrl}plat_id=${trjRegInfo.plat_id}&sign_type=${trjRegInfo.sign_type}&sign=${trjRegInfo.sign}&pf_uid=${trjRegInfo.pf_uid}&app_request=${trjRegInfo.app_request}&timestamp=${trjRegInfo.timestamp}&data=${trjRegInfo.data}&lxUser=${trjRegInfo.lx_user}`;
                window.location.href = redirect_url;
        }).error((res) => {
            this.getScreen().toast(res.message);
        })
    }
    render() {
        return (
            <div className="er-code-input-info">
                {
                    !this.state.isNextPage&&<div className="wx-bill-log-input">
                        <i className="icon-mobile"></i>
                        <Input
                            type= {'tel'}
                            autofocus= {true}
                            placeholder= {'请输入手机号'}
                            value= {this.state.mobile}
                            inputType= {'MOBILE'}
                            onChange= {this._onChange}
                            />
                    </div>
                }
                {
                    this.state.isNextPage&&<div className="wx-bill-log-input wx-bill-verify">
                        <i className="icon-verify"></i>
                        <Input
                            type= {'tel'}
                            placeholder= {'请输入短信验证码'}
                            inputType= {'VERIFYCODE'}
                            onChange= {this._onChange}
                            />
                        <ValidateCode
                            ref= {v => this.VALIDATECODE = v}
                            mobile= {this.state.mobile}
                            onValidateCode= {this._onValidateCode}
                            />
                    </div>
                }
                <div className="register-btn">
                    {
                        !this.state.isNextPage&&<a href="javascript:;" onClick={this._onNext}>下一步</a>
                    }
                    {
                        this.state.isNextPage&&<a href="javascript:;" onClick={this._onGoRegister}>立即登录</a>
                    }
                </div>
            </div>
        );
    }
}

export default EnterInput;