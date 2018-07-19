'use strict';
import React from 'react';
import ScreenComponent from './../../../../components/ScreenComponent';
import api from './../../../../../controllers/api';


export default class NextStep extends ScreenComponent {
  constructor(...props) {
    super(...props);
  }
  _onNextStep = () => {
    const { mobile } = this.props,
      regMobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!mobile) return;
    if (mobile.length == 11 && !regMobile.test(mobile)) {
      this.getScreen().toast('手机号格式错误，请核对');
      return;
    }
    api.loginOrRegister({
        mobile
    }).success((res) => {
        const { status } = res.data;
        let navigation = this.getScreen().getNavigation();
        if(status == 0) { // 未注册 0
            navigation.navigate('FastRegister', { mobile });
        }else if(status == 1) { // 已注册 1
            navigation.navigate('Login', { mobile });
        }
    }).error((res) => {
        this.getScreen().toast(res.message);
    })
  };
  render() {
    const { mobile } = this.props;
    return (
      <div className="reg-login-btn">
        <a
          href="javascript:;"
          className={`${mobile && mobile.length >= 11 && 'active'}`}
          onClick={this._onNextStep}
        >
          下一步
        </a>
      </div>
    );
  }
}
