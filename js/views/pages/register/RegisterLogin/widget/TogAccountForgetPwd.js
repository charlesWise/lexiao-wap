'use strict'
import React from 'react';
import ScreenComponent from './../../../../components/ScreenComponent';

export default class TogAccountForgetPwd extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    _onForgetPwd = () => {
        let navigation = this.getScreen().getNavigation();
        navigation.navigate('ForgetPwd', { mobile: this.props.mobile });
    }
    _onSwitchAccount = () => {
        let navigation = this.getScreen().getNavigation();
        navigation.navigate('RegisterLogin');
    }
    render() {
        return (
            <div className="tog-acc-forget-pwd">
                <a href="javascript:;" onClick={this._onSwitchAccount}>切换账号</a>
                <a href="javascript:;" onClick={this._onForgetPwd}>忘记密码</a>
            </div>
        )
    }
}
