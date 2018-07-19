"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";

class EssentialInfo extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "基本信息"
    };
    this.state = {
      switchNumber: false
    }
  }
  componentWillReceiveProps(nextProps) {
    let propTel = nextProps.dataSource.tel;
    if(propTel&&propTel.indexOf('-') != -1) {
      this.setState({switchNumber: true})
    }
  }
  render() {
    let address = "", propTel = this.props.dataSource.tel, areaCode = '', seatNumber = '', tel = '';
    if (this.props.dataSource.province) {
      address = address + this.props.dataSource.province.name;
    }
    if (this.props.dataSource.city) {
      address = address + this.props.dataSource.city.name;
    }
    if (this.props.dataSource.area) {
      address = address + this.props.dataSource.area.name;
    }
    if(propTel&&propTel.indexOf('-') != -1) {
      areaCode = propTel.split('-')[0];
      seatNumber = propTel.split('-')[1];
    }else {
      tel = propTel;
    }
    return (
      <div className="add">
        <div className="add-item">
          <div className="-label">商户logo</div>
          <div className="-merchant-logo">
            {this.props.dataSource.logo &&
              this.props.dataSource.logo.url && (
                <i
                  className="icon_del"
                  onClick={() => this.props.onClick("del_input_image_logo")}
                />
              )}
            <input
              type="file"
              accept="image/*"
              style={{
                position: "absolute",
                opacity: 0,
                width: "3rem",
                height: "3rem",
                visibility:
                  this.props.dataSource.logo && this.props.dataSource.logo.url
                    ? "hidden"
                    : "visible"
              }}
              onChange={e => this.props.onChange(e, "input_image_logo")}
            />
            <img
              src={
                (this.props.dataSource.logo &&
                  this.props.dataSource.logo.url) ||
                this.props.logoPic
              }
              ref="image_logo"
            />
          </div>
        </div>
        <div className="add-item">
          <div className="-label">商户名</div>
          <div className="-value">
            <input
              type="text"
              placeholder="输入商户名"
              value={this.props.dataSource.merchant_name || ""}
              onChange={e => this.props.onChange(e, "input_merchant_name")}
            />{" "}
          </div>
        </div>
        <div className="add-item">
          <div className="-label">客服电话</div>
          {
            !this.state.switchNumber&&<div className="-value">
              <input
                type="tel"
                placeholder="输入手机号"
                value={tel || ""}
                onChange={e => this.props.onChange(e, "input_tel")}
              />
              <span className="switch"
                onClick={() => {
                  this.setState({
                    switchNumber: !this.state.switchNumber
                  })
                  this.props.onSetAreaCode&&this.props.onSetAreaCode();
                }}
              >切为座机号</span>
            </div>
          }
          {
            this.state.switchNumber&&<div className="-value">
              <input
                ref={v => this.areaCodeInput = v}
                className="area-code"
                type="tel"
                placeholder="区号"
                value={areaCode || this.props.dataSource.areaCode || ""}
                onChange={e => this.props.onChange(e, "area_code")}
              />
              <i className="division">-</i>
              <input
                ref={v => this.seatNumberInput = v}
                className="seat-number"
                type="tel"
                placeholder="座机号"
                value={seatNumber || ""}
                onChange={e => this.props.onChange(e, "seat_number")}
              />
              <span className="switch"
                onClick={() => {
                  this.setState({
                    switchNumber: !this.state.switchNumber
                  })
                }}
              >切为手机号</span>
            </div>
          }
        </div>
        <div className="add-item" style={{border:'0'}}>
          <div className="-label">商户地址</div>
          <div className="-value">
            <input
              onClick={() => this.props.onClick("input_area")}
              type="text"
              readOnly="readonly"
              value={address}
            />
          </div>
          <i className="icon_more"></i>
          </div>
          <div className="add-item">
          
          <div className="-full-add">
            <input
              type="text"
              placeholder="请填写详细地址"
              value={this.props.dataSource.address || ""}
              onChange={e => this.props.onChange(e, "input_address")}
            />
          </div>
        </div>
        <div className="add-item">
          <div className="-label">所属分类</div>
          <div className="-value">
            <input
              onClick={() => this.props.onClick("input_assort")}
              type="text"
              placeholder="请选择"
              readOnly="readonly"
              value={
                (this.props.dataSource.assort &&
                  this.props.dataSource.assort.name) ||
                ""
              }
            />
          </div>
          <i className="icon_more"></i>
        </div>
        <div className="add-item">
          <div className="-label">商户面积</div>
          <div className="-value">
            <input
              type="number"
              placeholder="输入商户面积"
              value={this.props.dataSource.shop_area || ""}
              onChange={e => this.props.onChange(e, "input_shop_area")}
            />{" "}
          </div>
          <em className="i-add-fr">㎡</em>
        </div>
        <div className="add-item">
          <div className="-label">员工人数</div>
          <div className="-value">
            <input
              type="tel"
              placeholder="输入人数"
              value={this.props.dataSource.staff_num || ""}
              onChange={e => this.props.onChange(e, "input_staff_num")}
            />{" "}
          </div>
          <em className="i-add-fr">人</em>
        </div>
        <div className="add-item -gallery">
          <div className="-label">宣传图片</div>
          <div className="-value colorbd">最多可上传5张</div>
          <div className="-gallery-box-pic">
            <ul>
              {this.props.dataSource.images &&
                this.props.dataSource.images.map((item, index) => {
                  return (
                    <li key={index}>
                      <i
                        className="icon_del"
                        onClick={() =>
                          this.props.onClick("del_input_image_images", index)
                        }
                      />
                      <img src={item.url} />
                    </li>
                  );
                })}
              {(!this.props.dataSource.images ||
                this.props.dataSource.images.length < 5) && (
                <li>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "5.25rem",
                      height: "3.4rem",
                      zIndex: 1
                    }}
                    ref="input_image_images"
                    onChange={e => this.props.onChange(e, "input_image_images")}
                  />
                  <img src={this.props.imagePic} />
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="add-item -gallery">
          <div className="-label">商户介绍</div>
          <div className="-value" />
          <div className="-textarea ">
            <textarea
              type="text"
              placeholder="请输入"
              value={this.props.dataSource.introduction || ""}
              onChange={e => this.props.onChange(e, "input_introduction")}
            />
            <em>{this.props.textNum}</em>
          </div>
        </div>
      </div>
    );
  }
}

export default EssentialInfo;
