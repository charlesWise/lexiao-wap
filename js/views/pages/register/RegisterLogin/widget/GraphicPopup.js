"use strict";
import React from "react";
import ScreenComponent from "./../../../../components/ScreenComponent";
import TextInput from "./TextInput";
import ValidateImg from "./ValidateImg";
import api from "./../../../../../controllers/api";

export default class GraphicPopup extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.state = {
      code: ""
    };
  }
  _stopPropagation = e => {
    e.stopPropagation();
  };
  _onChange = (value, inputType, status) => {
    if (status && status == "FOCUS") {
      this.PWD && this.PWD.onNoDel();
    }
    if (inputType == "GRAPHIC") {
      this.setState({ code: value });
    }
  };
  _onConfirm = () => {
    const { code } = this.state;
    api.checkVerify({
        code
      }).success(res => {
        this.props.onConfirm && this.props.onConfirm();
      }).error(res => {
        this.VALIDATEIMG && this.VALIDATEIMG._refreshCode();
        this.setState({ code: "" });
        this.getScreen().toast(res.message);
      });
  };
  _onCancel = () => {
    this.props.onCancel && this.props.onCancel();
  };
  render() {
    return (
      <div className="fast-graphic-popup" onClick={this._stopPropagation}>
        <div className="popup-content">
          <div className="title">
            <p>安全验证</p>
            <p>请完成以下操作</p>
          </div>
          <div className="graphic-box">
            <div className="graphic">
              <TextInput
                type={"text"}
                autofocus={true}
                placeholder={"请输入右侧验证码"}
                className={"graphic-input"}
                value={this.state.code}
                inputType={"GRAPHIC"}
                onChange={this._onChange}
              />
              <ValidateImg ref={v => (this.VALIDATEIMG = v)} />
            </div>
          </div>
          <div className="hand-button">
            <span onClick={this._onCancel}>取消</span>
            <span onClick={this._onConfirm}>确定</span>
          </div>
        </div>
      </div>
    );
  }
}
