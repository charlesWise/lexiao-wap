"use strict";
import React from "react";
import ScreenComponent from "./../../../../components/ScreenComponent";

export default class RegAgreement extends ScreenComponent {
  constructor(...props) {
    super(...props);
  }
  _onCheck = () => {
    this.props.onCheck && this.props.onCheck();
  };
  _onProtocolPopup = e => {
    e.stopPropagation();
    let navigation = this.getScreen().getNavigation();
    navigation.navigate('LxProtocol');
  };
  render() {
    return (
      <div className="reg-agreement">
        <span onClick={this._onCheck}>
          <i
            className={`${
              this.props.isCheck ? "icon-selected" : "icon-no-selected"
            }`}
          />
          注册即表示你已同意
          <a href="javascript:;" onClick={this._onProtocolPopup}>
            《乐消注册服务协议》
          </a>
        </span>
      </div>
    );
  }
}
