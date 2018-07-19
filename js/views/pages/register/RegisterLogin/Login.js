"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import TextInput from "./widget/TextInput";
import GoLogin from "./widget/GoLogin";
import TogAccountForgetPwd from "./widget/TogAccountForgetPwd";

class Login extends ScreenComponent {
  static pageConfig = {
    path: "/login"
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: ""
    };
    this.state = {
      mobile: "",
      password: ""
    };
  }
  componentDidMount() {
    this._initInfo();
  }
  _initInfo() {
    let navigation = this.getScreen().getNavigation(),
      { mobile } = navigation.state.params;
    this.setState({ mobile });
  }
  _onChange = (value, inputType, status) => {
    if (status && status == "FOCUS") {
      this.state.password && this.PWD && this.PWD.onNoDel();
    }
    if (inputType == "PWD") {
      this.setState({ password: value });
    }
  };
  _onRegisterLogin = () => {
    this.PWD && this.PWD.onDel();
  };
  render() {
    const { mobile, password } = this.state;
    return (
      <section
        className="register-login-wrapper"
        onClick={this._onRegisterLogin}
      >
        <div className="log-on-head">
          <p className="title">登录</p>
          <p className="tip">输入以下手机号的登录密码</p>
          <p className="tel-number">
            {mobile && mobile.slice(0, 3)}
            <span>{mobile && mobile.slice(3, 7)}</span>
            {mobile && mobile.slice(7, 11)}
          </p>
        </div>
        <TextInput
          ref={v => (this.PWD = v)}
          type={"password"}
          isEyes={true}
          placeholder={"请输入登录密码"}
          className={"register-login-box"}
          inputType={"PWD"}
          onChange={this._onChange}
        />
        <GoLogin {...this.state} />
        <TogAccountForgetPwd mobile={this.state.mobile} />
      </section>
    );
  }
}

export default Login;
