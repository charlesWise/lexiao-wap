'use strict'
import React from 'react';
import ScreenComponent from './../../../../components/ScreenComponent';
import api from "./../../../../../controllers/api";

export default class GoResetPwd extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    _onRegisterLogin = () => {
        const { mobile, password, dynamicCode } = this.props;
        api.modifyPasswordSave({
            mobile, 
            passwd: password,
            smscode: dynamicCode
        }).success((res) => {
            this.getScreen().toast(res.message);
            this.getScreen().getNavigation().goBack();
        }).error((res) => {
            this.getScreen().toast(res.message, null, null, {fontSize: '.7rem'});
        })
    }
    render() {
        const { dynamicCode, password } = this.props;
        return (
            <div className="reg-login-btn reg-go-login">
                <a href="javascript:;" 
                    className={`${dynamicCode&&password&&'active'}`}
                    onClick={this._onRegisterLogin}
                    >重置密码</a>
            </div>
        )
    }
}
