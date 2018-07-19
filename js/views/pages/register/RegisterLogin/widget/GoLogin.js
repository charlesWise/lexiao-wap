"use strict";
import React from "react";
import { StoreManager } from 'mlux';
import ScreenComponent from "./../../../../components/ScreenComponent";
import api from './../../../../../controllers/api';

export default class GoLogin extends ScreenComponent {
  constructor(...props) {
    super(...props);
  }
  componentDidMount() {}
  _onGoLogin = () => {
    const { mobile, password } = this.props;
    api.doLogin({
        mobile,
        passwd: password
    }).success((res) => {
        this.getScreen().toast(res.message);
        this._checkTrjAuthorize();
    }).error((res) => {
        this.getScreen().toast(res.message);
    })
  }
  _checkTrjAuthorize() {
    let navigation = this.getScreen().getNavigation();
      api.checkTrjAuthorize({}) //检查有没有积分授权，没有授权去授权页面
      .success(content => {
        let navigation = this.getScreen().getNavigation();
        if(content.data&&content.data.is_trj_authorize != 1) {
          navigation.navigate('Integral');
        }else {
          if(typeof notifyLogin == 'function' && notifyLogin) {
            notifyLogin(JSON.stringify(content.data.mobile));
          }else {
            let navigation = this.getScreen().getNavigation();
            navigation.navigate('Main');
          }
        }
      }).error(content => {
        this.getScreen().toast(content.message);
        return;
      });
  }
  render() {
    return (
      <div className="login-btn">
        <a
          href="javascript:;"
          className={`${this.props.password && "active"}`}
          onClick={this._onGoLogin}
        >
          登录
        </a>
      </div>
    );
  }
}
