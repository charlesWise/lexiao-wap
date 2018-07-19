'use strict';
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import NotGetFocus from './widget/NotGetFocus';
import GetFocus from './widget/GetFocus';
import TextInput from './widget/TextInput';
import NextStep from './widget/NextStep';

class RegisterLogin extends ScreenComponent {
  static pageConfig = {
    path: "/registerlogin"
  };
  constructor(...props) {
    super(...props);
    this.state = {
      mobile: '',
      isFocus: false
    };
  }
  _onChange = (value, inputType, status) => {
    if (status && status == 'FOCUS') {
        this.state.mobile && this.MOBILE && this.MOBILE.onNoDel();
    }
    if (status && status == 'CLEAR') {
      this.setState({ isFocus: !this.state.isFocus });
    }
    if (!this.state.isFocus) {
      this.setState({ isFocus: !this.state.isFocus });
    }
    if (inputType == 'MOBILE') {
      let mobile = value.replace(/[^\d]/g, '');
      if (mobile.length > 11) return;
      this.setState({ mobile });
    }
  };
  _onRegisterLogin = () => {
    this.MOBILE && this.MOBILE.onDel();
    if (!this.state.mobile) {
      this.setState({ isFocus: false });
    }
  };
  render() {
    return (
      <section
        className="register-login-wrapper"
        onClick={this._onRegisterLogin}
      >
        {this.state.isFocus ? <GetFocus /> : <NotGetFocus />}
        <TextInput
          ref={v => (this.MOBILE = v)}
          type={'tel'}
          placeholder={'请输入手机号'}
          className={"register-login-box"}
          value={this.state.mobile}
          inputType={'MOBILE'}
          onChange={this._onChange}
        />
        <NextStep mobile={this.state.mobile} />
      </section>
    );
  }
}

export default RegisterLogin;
