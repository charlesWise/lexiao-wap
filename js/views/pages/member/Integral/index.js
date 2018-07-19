"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import api from "./../../../../controllers/api";

class Integral extends ScreenComponent {
  static pageConfig = {
    path: "/member/integral",
    permission: true
  };

  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "积分使用授权",
      isBackButton: true
    };
    this.state = {};
  }
  _authorize = () => {
    api.checkTrjAuthorize({})
      .success(content => {
        let resData = content.data,
        isTrjAuthorize = +resData['is_trj_authorize'];
        if(isTrjAuthorize != 1) {
          api.trjRegisterTwo({
            mobile: content.data.mobile,
            password: content.data.pwd
          }).success(res => {
            if(typeof notifyLogin == 'function' && notifyLogin) {
              notifyLogin(JSON.stringify(content.data.mobile));
            }else {
              let navigation = this.getScreen().getNavigation();
              navigation.navigate('Main');
            }
          }).error(res => {
            this.getScreen().toast(res.message);
            return;
          });
        }
      }).error(content => {
        this.getScreen().toast(content.message);
        return;
      });
  }
  render() {
    return (
      <div className="integral-wrap">
        <div className="authorization">
          <img
            src="./images/integral/authorization.png"
            className="authorization-bg"
          />
          <div className="integral-text">
            <h3>请授权【乐消】访问并使用你的投融家积分</h3>
            <h4>*登录投融家即可完成此授权</h4>
            <button onClick={this._authorize}>登录并授权</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Integral;
