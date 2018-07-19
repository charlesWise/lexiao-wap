"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";

class RegistInfo extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "注册信息"
    };
  }
  render() {
    let open_name = "";
    if (
      this.props.dataSource.open_name &&
      this.props.dataSource.open_name.length === 3
    ) {
      open_name =
        this.props.dataSource.open_name[0].province_name +
        this.props.dataSource.open_name[1].city_name +
        this.props.dataSource.open_name[2].sub_bank_name;
    }
    return (
      <div className="-reg">
        <div className="cell -m-information -notborder -notborder-item" style={{ height: '100%', paddingBottom: '2.5rem' }}>
          <div className="cell-item">
            <div className="-label">账号</div>
            <div className="-value">{this.props.dataSource.mobile}</div>
          </div>
          <div className="cell-item">
            <div className="-label">二维码</div>
            <div className="-value -merchant-logo">
              <img src={this.props.dataSource.qrcode} 
                onClick={() => this.props.showBigPic("qrcode", this.props.dataSource.qrcode, 0, 0)}
               />
            </div>
          </div>
          <div className="cell-item">
            <div className="-label">法人</div>
            <div className="-value">{this.props.dataSource.person}</div>
          </div>
          <div className="cell-item">
            <div className="-label">法人手机</div>
            <div className="-value">{this.props.dataSource.person_tel}</div>
          </div>
          <div className="cell-item -gallery">
            <div className="-label">法人身份证</div>
            <div className="-value" />
            <div className="-gallery-box-card">
              <ul>
                <li>
                  <img
                    src={
                      this.props.dataSource.person_id_img_front &&
                      this.props.dataSource.person_id_img_front.url
                    }
                    onClick={() => this.props.showBigPic("person_id_img_front", this.props.dataSource.person_id_img_front.url, 0, 0)}
                  />
                  <p>身份证正面</p>
                </li>
                <li>
                  <img
                    src={
                      this.props.dataSource.person_id_img_back &&
                      this.props.dataSource.person_id_img_back.url
                    }
                    onClick={() => this.props.showBigPic("person_id_img_back", this.props.dataSource.person_id_img_back.url, 0, 0)}
                  />
                  <p>身份证反面</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="cell-item">
            <div className="-label">持卡人</div>
            <div className="-value">{this.props.dataSource.name}</div>
          </div>
          <div className="cell-item">
            <div className="-label">银行卡号</div>
            <div className="-value">{this.props.dataSource.card_no}</div>
          </div>
          <div className="cell-item">
            <div className="-label">开户行</div>
            <div className="-value">{open_name}</div>
          </div>
          <div className="cell-item -gallery">
            <div className="-label">营业执照</div>
            <div className="-value">{this.props.dataSource.licences}</div>
          </div>
          <div className="cell-item">
            <div className="-label">营业执照</div>
            <div className="-value -merchant-pic">
              <img
                src={
                  this.props.dataSource.licence_img &&
                  this.props.dataSource.licence_img.url
                }
                onClick={() => this.props.showBigPic("licence_img", this.props.dataSource.licence_img.url, 0, 0)}
              />
            </div>
          </div>
        </div>
        {this.props.type === "servicing" && (
          <div className="modify-tips">
            注册信息无法修改，有疑问请联系投融家客服
          </div>
        )}
      </div>
    );
  }
}

export default RegistInfo;
