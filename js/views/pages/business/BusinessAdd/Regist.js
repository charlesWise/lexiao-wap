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
    let open_name = "添加";
    if (
      this.props.dataSource.open_name &&
      this.props.dataSource.open_name.length === 3
    ) {
      open_name =
        this.props.dataSource.open_name[0].province_name +
        this.props.dataSource.open_name[1].city_name +
        this.props.dataSource.open_name[2].sub_bank_name;
      let array = [];
      for (let i = 0; i < open_name.length; i++) {
        array.push(open_name[i]);
        if ((i + 1) % 12 === 0 && i + 1 !== open_name.length) {
          array.push("<br>");
        }
      }
      open_name = array.join("");
    }

    return (
      <div>
        <div className="add-gary">账号信息</div>
        <div className="add" style={{padding: '0 0 0 .75rem'}}>
          <div className="add-item">
            <div className="-label">账号</div>
            <div className="-value">
              <input
                type="tel"
                placeholder="输入手机号"
                value={this.props.dataSource.mobile || ""}
                onChange={e => this.props.onChange(e, "input_mobile")}
              />
            </div>
          </div>
        </div>

        <div className="add-gary">法人信息</div>
        <div className="add">
          <div className="add-item">
            <div className="-label">法人</div>
            <div className="-value">
              <input
                type="text"
                placeholder="输入姓名"
                value={this.props.dataSource.person || ""}
                onChange={e => this.props.onChange(e, "input_person")}
              />
            </div>
          </div>
          <div className="add-item">
            <div className="-label">法人手机</div>
            <div className="-value">
              <input
                type="tel"
                placeholder="输入法人手机号"
                value={this.props.dataSource.person_tel || ""}
                onChange={e => this.props.onChange(e, "input_person_tel")}
              />
            </div>
          </div>
          <div className="add-item -gallery">
            <div className="-label">法人身份证</div>
            <div className="-value" />
            <div className="-gallery-box-card">
              <ul>
                <li>
                  {this.props.dataSource.person_id_img_front &&
                    this.props.dataSource.person_id_img_front.url && (
                      <i
                        className="icon_del"
                        onClick={() =>
                          this.props.onClick("del_input_image_person_front")
                        }
                      />
                    )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "6.5rem",
                      height: "4.25rem",
                      visibility:
                        this.props.dataSource.person_id_img_front &&
                        this.props.dataSource.person_id_img_front.url
                          ? "hidden"
                          : "visible"
                    }}
                    onChange={e =>
                      this.props.onChange(e, "input_image_person_front")
                    }
                    ref="input_image_person_front"
                  />
                  <img
                    src={
                      (this.props.dataSource.person_id_img_front &&
                        this.props.dataSource.person_id_img_front.url) ||
                      this.props.personPic
                    }
                    ref="image_person_front"
                  />
                  <p>身份证正面</p>
                </li>
                <li>
                  {this.props.dataSource.person_id_img_back &&
                    this.props.dataSource.person_id_img_back.url && (
                      <i
                        className="icon_del"
                        onClick={() =>
                          this.props.onClick("del_input_image_person_back")
                        }
                      />
                    )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "6.5rem",
                      height: "4.25rem",
                      visibility:
                        this.props.dataSource.person_id_img_back &&
                        this.props.dataSource.person_id_img_back.url
                          ? "hidden"
                          : "visible"
                    }}
                    onChange={e =>
                      this.props.onChange(e, "input_image_person_back")
                    }
                    ref="input_image_person_back"
                  />
                  <img
                    src={
                      (this.props.dataSource.person_id_img_back &&
                        this.props.dataSource.person_id_img_back.url) ||
                      this.props.personPic
                    }
                    ref="image_person_back"
                  />
                  <p>身份证反面</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
          
        <div className="add-gary">银行卡信息</div>
        <div className="add">
          <div className="add-item">
            <div className="-label">持卡人</div>
            <div className="-value">
              <input
                type="text"
                placeholder="输入持卡人姓名"
                value={this.props.dataSource.name || ""}
                onChange={e => this.props.onChange(e, "input_name")}
              />
            </div>
          </div>
          <div className="add-item">
            <div className="-label">银行卡号</div>
            <div className="-value">
              <input
                type="tel"
                placeholder="添加"
                value={this.props.dataSource.card_no || ""}
                onChange={e => this.props.onChange(e, "input_card_no")}
              />
            </div>
          </div>
          <div className="add-item">
            <div className="-label">开户行</div>
            <div
              className="-value"
              style={{ opacity: open_name === "添加" ? 0.4 : 1 }}
              onClick={() => this.props.onClick("input_open_card")}
              dangerouslySetInnerHTML={{ __html: open_name }}
            />
            <i className="icon_more" />
          </div>
        </div>

        <div className="add-gary">营业执照信息</div>
        <div className="add">
          <div className="add-item" style={{border:  '0'}}>
            <div className="-label">营业执照</div>
            <div className="-value">
              <input
                type="text"
                placeholder="输入营业执照编码"
                value={this.props.dataSource.licences || ""}
                onChange={e => this.props.onChange(e, "input_licences")}
              />
            </div>
          </div>
          <div className="add-item -gallery">
            <div className="-label">上传照片</div>
            <div className="-full-add">
              <div className="-gallery-box-yz">
                {this.props.dataSource.licence_img &&
                  this.props.dataSource.licence_img.url && (
                    <i
                      className="icon_del"
                      onClick={() => this.props.onClick("del_input_image_licence")}
                    />
                  )}
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: "6.5rem",
                    height: "4.25rem",
                    visibility:
                      this.props.dataSource.licence_img &&
                      this.props.dataSource.licence_img.url
                        ? "hidden"
                        : "visible"
                  }}
                  onChange={e => this.props.onChange(e, "input_image_licence")}
                  ref="input_image_licence"
                />
                <img
                  src={
                    (this.props.dataSource.licence_img &&
                      this.props.dataSource.licence_img.url) ||
                    this.props.personPic
                  }
                  ref="image_licence"
                />
              </div>
            </div>
            
          </div>
        </div>
        <div className="add-gary">奖励设置</div>
      </div>
      
    );
  }
}

export default RegistInfo;
