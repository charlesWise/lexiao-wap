"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import api from "./../../../../controllers/api";

class CeoManageDetail extends ScreenComponent {
  static pageConfig = {
    path: "/business/ceomanagedetail",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "BD详情"
    };
    this.state = {
      merchant: {},
      authList: []
    };
  }

  componentDidMount() {
    const { state } = this.props.navigation;
    let bd_id = state.params.bd_id;
    api.checkBDInfo({ bd_id }).success((content, next, abort) => {
      this.setState({merchant: content.data, authList: content.data.auth})
    });
  }

  render() {
    return (
      <div className="sub-business-warp">
        <div className="sub-cell">
          <div className="sub-cell-item">
            <label className="-label">手机号</label>
            <span className="-value">
              <input
                type="text"
                placeholder={this.state.merchant.mobile || ""}
                readOnly
              />
            </span>
          </div>
          <div className="sub-cell-item">
            <label className="-label">姓名</label>
            <span className="-value">
              <input
                type="text"
                placeholder={this.state.merchant.name || ""}
                readOnly
              />
            </span>
          </div>
          <div className="sub-cell-item">
            <label className="-label">身份证号</label>
            <span className="-value">
              <input
                type="number"
                placeholder={this.state.merchant.identity_id || ""}
                readOnly
              />
            </span>
          </div>
          <div className="sub-cell-item">
            <label className="-label">银行卡号</label>
            <span className="-value">
              <input
                type="tel"
                placeholder={this.state.merchant.card_no || ""}
                readOnly
              />
            </span>
          </div>
          <div className="sub-cell-item">
            <label className="-label">开户行</label>
            <span className="-value" style={{color: '#999'}}>
                {this.state.merchant.card_of_deposit || ""}
              {/*<input
                type="tel"
                placeholder={this.state.merchant.card_of_deposit || ""}
                readOnly
              />*/}
            </span>
          </div>
        {
            this.state.merchant.areas&&this.state.merchant.areas.length>0&&this.state.merchant.areas.map((item, i) => {
                return (
                    <div key={i}
                    className="sub-cell-item">
                        <label className="-label">负责区域</label>
                        <span className="-value">
                        <input
                            type="tel"
                            placeholder={`${item.province_name}${item.city_name}${item.district_name}`}
                            readOnly
                        />
                        </span>
                    </div>
                )
            })
        }
        </div>
        {
            this.state.authList&&this.state.authList.length>0&&<div className="permission" style={{marginTop: '.5rem'}}>
                <div className="title">拥有权限</div>
                <div className="content">
                <ul className="permission-group">
                    {this.state.authList.map((item, index) => {
                    return (
                        <li
                        key={index}
                        className="-selected -disabled -unselect-disabled"
                        >
                        {item.name}
                        </li>
                    );
                    })}
                </ul>
                </div>
            </div>
        }
      </div>
    );
  }
}

export default CeoManageDetail;
