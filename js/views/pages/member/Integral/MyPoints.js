"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import api from './../../../../controllers/api';

class MyPoints extends ScreenComponent {
  static pageConfig = {
    path: "/member/mypoints",
    permission: true
  };

  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "我的积分"
    };
    this.state = {
      point: 0
    };
  }
  componentDidMount() {
    this._getPoints();
  }
  _getPoints() {
    api.getUserPoint({
    }).success(res => {
      this.setState({point: res.data.point})
    }).error(res => {
        this.getScreen().toast(res.message);
    });
  }
  render() {
    return (
      <div className="integral-wrap">
        <div className="integral">
          <div className="integral-cont">
            <div>
              <img src="./images/integral/logo_trj.png" />
            </div>
            <p className="integral-cont-p1">我的投融家积分</p>
            <p className="integral-cont-p2">{this.state.point}</p>
          </div>
          <p className="integral-text">— 更多精彩内容请敬期待 —</p>
        </div>
      </div>
    );
  }
}

export default MyPoints;
