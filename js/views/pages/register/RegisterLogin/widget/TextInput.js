"use strict";
import React from "react";
import ScreenComponent from "./../../../../components/ScreenComponent";
import DynamicCode from "./DynamicCode";

class TextInput extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.state = {
      isDel: false,
      isShowEyes: false
    };
  }
  componentWillReceiveProps(nextProps) {
    const { inputType } = this.props;
    if (inputType == "GRAPHIC") {
      if (!nextProps.value) {
        this.setState({
          isDel: false
        });
      }
    }
  }
  onDel() {
    this.setState({
      isDel: false
    });
  }
  onNoDel() {
    this.setState({
      isDel: true
    });
  }
  _onInputChange = () => {
    const { inputType } = this.props;
    if (this.INPUT_REF && this.INPUT_REF.value) {
      if (inputType == "MOBILE") {
        let reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(this.INPUT_REF.value)) {
          if (!this.state.isDel) {
            this.setState({
              isDel: !this.state.isDel
            });
          }
        }
      } else {
        if (!this.state.isDel) {
          this.setState({
            isDel: !this.state.isDel
          });
        }
      }
    } else {
      this.setState({
        isDel: !this.state.isDel
      });
    }
    this._onChange();
  };
  _onChange(status) {
    const { inputType } = this.props;
    this.INPUT_REF &&
      this.props.onChange &&
      this.props.onChange(this.INPUT_REF.value, inputType, status);
  }
  _onFocus = () => {
    this._onChange("FOCUS");
  };
  _onBlur = () => {
    this._onChange();
  };
  _clearVal = () => {
    this.INPUT_REF.value = "";
    this.setState({
      isDel: !this.state.isDel
    });
    this._onChange("CLEAR");
  };
  _eyesSwitch = () => {
    if (this.INPUT_REF) {
      if (!this.state.isShowEyes) {
        this.INPUT_REF.type = "text";
        this.setState({
          isShowEyes: !this.state.isShowEyes
        });
      } else {
        this.INPUT_REF.type = "password";
        this.setState({
          isShowEyes: !this.state.isShowEyes
        });
      }
    }
  };
  _stopPropagation = e => {
    e.stopPropagation();
  };
  render() {
    const {
      type,
      value,
      autofocus,
      placeholder,
      isEyes,
      isDynamic,
      className
    } = this.props;
    return (
      <div
        className={`item-input-box ${className}`}
        onClick={this._stopPropagation}
      >
        <span className={`${this.state.isDel && "active"}`}>
          <input
            ref={v => (this.INPUT_REF = v)}
            type={type || "text"}
            value={value}
            autoFocus={autofocus || false}
            placeholder={placeholder || "请输入"}
            onChange={this._onInputChange}
            onFocus={this._onFocus}
            onBlur={this._onBlur}
          />
        </span>
        <span className={`${this.state.isDel && "active"}`}>
          {this.state.isDel && (
            <i className="icon-del" onClick={this._clearVal} />
          )}
          {isEyes && (
            <i
              className={`${
                this.state.isShowEyes ? "icon-open-eye" : "icon-close-eye"
              }`}
              onClick={this._eyesSwitch}
            />
          )}
          {isDynamic && (
            <DynamicCode
              ref={v => (this.DYNAMICCODE = v)}
              onGraphicPopup={() => {
                this.props.onGraphicPopup && this.props.onGraphicPopup();
              }}
            />
          )}
        </span>
      </div>
    );
  }
}

export default TextInput;
