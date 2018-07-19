"use strict";
import React from "react";
import ScreenComponent from "./../../../../components/ScreenComponent";

const COUNT_TIME = 60;
export default class VerifyTips extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.state = {
      isShowVerifyTips: false
    };
    this.timer = null;
    this.countTime = COUNT_TIME;
  }
  componentDidMount() {
    this._countDown();
  }
  componentWillUnmount() {
    this._clearInterval();
  }
  _clearInterval = () => {
    if (this.timer) {
      this.setState({ isShowVerifyTips: !this.state.isShowVerifyTips });
      clearInterval(this.timer);
    }
  };
  _countDown = () => {
    this.setState({ isShowVerifyTips: !this.state.isShowVerifyTips });
    this.timer = setInterval(() => {
      if (this.countTime <= 1) {
        this._clearInterval();
      } else {
        --this.countTime;
      }
    }, 1000);
  };
  render() {
    if (this.state.isShowVerifyTips) {
      return (
        <div className="verify-success-tips">
          <p>短信验证码已发送至{this.props.mobile}，请查收</p>
        </div>
      );
    } else {
      return null;
    }
  }
}
