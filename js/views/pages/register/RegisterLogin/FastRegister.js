"use strict";
import React, { Component } from "react";
import { StoreManager } from 'mlux';
import ScreenComponent from "./../../../components/ScreenComponent";
import VerifyTips from "./widget/VerifyTips";
import TextInput from "./widget/TextInput";
import RegLoginStep from "./widget/RegLoginStep";
import RegAgreement from "./widget/RegAgreement";
import GraphicPopup from "./widget/GraphicPopup";
import api from "./../../../../controllers/api";

var GRAPHICPOPUP = null;
class RegisterLogin extends ScreenComponent {
  static pageConfig = {
    path: "/fastregister"
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "快速注册"
    };
    this.state = {
      dynamicCode: "",
      mobile: "",
      password: "",
      isFirstReg: false,
      isCheck: true
    };
    this.curType = "";
  }
  componentDidMount() {
    this._initInfo();
  }
  componentWillUnmount() {
    StoreManager.regInfo.set('mobile', this.state.mobile);
  }
  _initInfo() {
    let navigation = this.getScreen().getNavigation(),
      { mobile } = navigation.state.params;
    this.setState({ mobile }, () => {
        this._firstRegEntry();
    });
  }
  _isFirstReg() {
    const regMobile = StoreManager.regInfo.get('mobile');
    if(regMobile&&regMobile == this.state.mobile) { // 不是第一次注册
        return false;
    }
    return true;
  }
  _firstRegEntry() {
    if (this._isFirstReg()) {
      this.setState({ isFirstReg: !this.state.isFirstReg });
      this._sendDynamicCode();
    } else {
      this._onGraphicPopup();
    }
  }
  _onGraphicPopup = () => {
    GRAPHICPOPUP = this.getScreen().showPopup({
      content: (
        <GraphicPopup
          onCancel={() => {
            this.getScreen().hidePopup(GRAPHICPOPUP);
          }}
          onConfirm={this._onConfirm}
        />
      )
    });
  };
  _onConfirm = () => {
    this._sendDynamicCode();
  };
  _sendDynamicCode() {
    api.regGetMobileCode({ //  获取注册动态码
        mobile: this.state.mobile,
        type: 2 //注册
      }).success(res => {
        this.DYNAMICCODE&&this.DYNAMICCODE.DYNAMICCODE&&this.DYNAMICCODE.DYNAMICCODE.onCountDown&&this.DYNAMICCODE.DYNAMICCODE.onCountDown();
        if(GRAPHICPOPUP != null) {
            this.getScreen().hidePopup(GRAPHICPOPUP);
        }
      }).error(res => {
        this.getScreen().toast(res.message);
      });
  }
  _onChange = (value, inputType, status) => {
    if (!this.curType) {
      this.curType = inputType;
    } else if (this.curType != inputType) {
      this[this.curType] && this[this.curType].onDel();
      this.curType = inputType;
    }
    if (status && status == "FOCUS") {
      (this.state.dynamicCode || this.state.password) &&
        this[this.curType] &&
        this[this.curType].onNoDel();
    }
    if (inputType == "DYNAMICCODE") {
      this.setState({ dynamicCode: value });
    }
    if (inputType == "PWD") {
      this.setState({ password: value });
    }
  };
  _onRegisterLogin = () => {
    this.DYNAMICCODE && this.DYNAMICCODE.onDel();
    this.PWD && this.PWD.onDel();
  };
  render() {
    const { dynamicCode, mobile, password, isCheck } = this.state;
    return (
      <section
        className="fast-register-wrapper"
        onClick={this._onRegisterLogin}
      >
        {this.state.isFirstReg && <VerifyTips mobile={mobile} />}
        <TextInput
          ref={v => (this.DYNAMICCODE = v)}
          type={"tel"}
          isDynamic={true}
          placeholder={"请输入短信验证码"}
          className={"register-login-box"}
          inputType={"DYNAMICCODE"}
          onChange={this._onChange}
          onGraphicPopup={this._onGraphicPopup}
        />
        <TextInput
          ref={v => (this.PWD = v)}
          type={"password"}
          isEyes={true}
          placeholder={"设置6位以上数字字母组合密码"}
          className={"register-login-box"}
          inputType={"PWD"}
          onChange={this._onChange}
        />
        <RegLoginStep {...this.state} />
        <RegAgreement
          isCheck={isCheck}
          onCheck={() => {
            this.setState({ isCheck: !isCheck });
          }}
        />
      </section>
    );
  }
}

export default RegisterLogin;
