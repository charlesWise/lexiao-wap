"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";

class EssentialInfo extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "基本信息"
    };
  }
  render() {
    let address = "";
    if (this.props.dataSource.province) {
      address = this.props.dataSource.province.name + address;
    }
    if (this.props.dataSource.city) {
      address = address + this.props.dataSource.city.name;
    }
    if (this.props.dataSource.area) {
      address = address + this.props.dataSource.area.name;
    }
    if (this.props.dataSource.address) {
      address = address + this.props.dataSource.address;
    }
    let data = this.props.dataSource;
    console.log(data)
    return (
      <div style={{ position: 'absolute', width: '100%', top: 0, bottom: 0 }}>
        <div className="cell -m-information -notborder -notborder-item" style={{ height: '100%', paddingBottom: '2.5rem' }}>
          <div className="cell-item">
            <div className={`-label ${data.edit&&data.edit.log=='1'&&'act-red'}`}>商户logo</div>
            <div className="-value -merchant-logo">
              <img
                src={
                  this.props.dataSource.logo && this.props.dataSource.logo.url
                }
                onClick={() => this.props.showBigPic("logo", this.props.dataSource.logo.url, 0, 0)}
              />
            </div>
          </div>
          <div className="cell-item">
            <div className={`-label ${data.edit&&data.edit.merchant_name=='1'&&'act-red'}`}>商户名</div>
            <div className={`-value -c-gray ${data.edit&&data.edit.merchant_name=='1'&&'act-red'}`}>{this.props.dataSource.merchant_name}</div>
          </div>
          <div className="cell-item">
            <div className={`-label ${data.edit&&data.edit.tel=='1'&&'act-red'}`}>客服电话</div>
            <div className={`-value -c-gray ${data.edit&&data.edit.tel=='1'&&'act-red'}`}>{this.props.dataSource.tel}</div>
          </div>
          <div className="cell-item">
            <div className={`-label ${data.edit&&data.edit.address=='1'&&'act-red'}`}>商户地址</div>
            <div className={`-value -c-gray ${data.edit&&data.edit.address=='1'&&'act-red'}`}>{address}</div>
          </div>
          <div className="cell-item">
            <div className={`-label ${data.edit&&data.edit.assort=='1'&&'act-red'}`}>所属分类</div>
            <div className={`-value -c-gray ${data.edit&&data.edit.assort=='1'&&'act-red'}`}>
              {this.props.dataSource.assort &&
                this.props.dataSource.assort.name}
            </div>
          </div>
          <div className="cell-item">
            <div className={`-label ${data.edit&&data.edit.shop_area=='1'&&'act-red'}`}>商户面积</div>
            <div className={`-value -c-gray ${data.edit&&data.edit.shop_area=='1'&&'act-red'}`}>{this.props.dataSource.shop_area}m²</div>
          </div>
          <div className="cell-item">
            <div className={`-label ${data.edit&&data.edit.staff_num=='1'&&'act-red'}`}>员工人数</div>
            <div className={`-value -c-gray ${data.edit&&data.edit.staff_num=='1'&&'act-red'}`}>{this.props.dataSource.staff_num}人</div>
          </div>
          <div className="cell-item -gallery">
            <div className={`-label ${data.edit&&data.edit.images=='1'&&'act-red'}`}>宣传图片</div>
            <div className="-value" />
            <div className="-gallery-box-pic">
              <ul>
                {this.props.dataSource.images &&
                  this.props.dataSource.images.map((item, index) => {
                    return (
                      <li key={index} onClick={() => this.props.showBigPic("images", item.url, index, this.props.dataSource.images.length)}>
                        <img src={item.url} />
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="cell-item">
            <div className={`-label ${data.edit&&data.edit.introduction=='1'&&'act-red'}`}>商户介绍</div>
            <div className={`-value -c-gray ${data.edit&&data.edit.introduction=='1'&&'act-red'}`}>{this.props.dataSource.introduction}</div>
          </div>
        </div>
        {this.props.type === "servicing" && (
          <div
            className="modify-tips active"
            onClick={() => this.props.onClick("modify_info")}
          >
            修改商户基本信息
          </div>
        )}
      </div>
    );
  }
}

export default EssentialInfo;
