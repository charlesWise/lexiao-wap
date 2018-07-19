"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import AreaPicker from "./../../../components/AreaPicker";
import api from "./../../../../controllers/api";
import Validate from "./../../../../util/Validate";

class SubmerchantAdd extends ScreenComponent {
  static pageConfig = {
    path: "/submerchant/add",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "添加子BD"
    };
    this.state = {
      merchant: {
        mobile: "",
        name: "",
        identity_id: "",
        card_no: "",
        card_of_deposit: [],
        areas: [[]],
        auth_ids: []
      },
      authList: []
    };
  }

  componentDidMount() {
    api.merchantAuthList({ type: 3 }).success((content, next, abort) => {
      if (content.boolen == 1) {
        let authList = [];
        content.data &&
          content.data.list &&
          content.data.list.forEach((item, index) => {
            authList.push({ ...item, selected: true });
          });
        this.setState({ authList });
      } else {
        this.getScreen().toast(content.message, 3000);
      }
    });
  }

  _onChange(e, type) {
    let value = e.target.value;
    if (type === "input_mobile") {
      let value = e.target.value;
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
      this._setState("mobile", value);
    } else if (type === "input_name") {
      this._setState("name", value);
    } else if (type === "input_identity_id") {
      this._setState("identity_id", value);
    } else if (type === "input_card_no") {
      value = value.replace(/\s/g, "");
      let array = [];
      for (let i = 0; i < value.length; i++) {
        array.push(value[i]);
        if ((i + 1) % 4 === 0 && i + 1 !== value.length) {
          array.push(" ");
        }
      }
      value = array.join("");
      this._setState("card_no", value);
    }
  }

  _onClick(type, data) {
    if (type === "click_card") {
      this.props.navigation.navigate("OpenCard", {
        callback: data => {
          console.log("open_card------->", data);
          let card_of_deposit = [];
          data &&
            data.open_card &&
            data.open_card.forEach((item, index) => {
              if (index === 0) {
                item.province_name = item.name;
                card_of_deposit.push(item);
              } else if (index === 1) {
                item.city_name = item.name;
                card_of_deposit.push(item);
              } else if (index === 3) {
                item.sub_bank_name = item.bank_name;
                item.code = item.bank_no;
                card_of_deposit.push(item);
              }
            });
          this._setState("card_of_deposit", card_of_deposit);
        }
      });
    } else if (type === "click_auth") {
      let authList = this.state.authList;
      authList[data].selected = !authList[data].selected;
      this.setState({ authList });
    } else if (type === "submit_add") {
      this._submitData();
    } else if (type === "areas_add") {
      let areas = this.state.merchant.areas;
      areas.push([]);
      this._setState("areas", areas);
    } else if (type === "areas_delete") {
      let areas = this.state.merchant.areas;
      areas.splice(data, 1);
      this._setState("areas", areas);
    } else if (type === "areas_select") {
      this._showAreaPicker(data);
    }
  }

  _setState(type, value) {
    let merchant = this.state.merchant;
    merchant[type] = value;
    this.setState({ merchant });
  }

  _submitData() {
    let proto = Object.getPrototypeOf(this.state.merchant);
    let merchant = Object.assign({}, Object.create(proto), this.state.merchant);
    merchant.card_no = merchant.card_no.replace(/\s/g, "");
    let card_of_deposit = [];
    merchant.card_of_deposit.forEach((item, index) => {
      card_of_deposit.push(item.code);
    });
    merchant.card_of_deposit = card_of_deposit.join();
    let auth_ids = [];
    this.state.authList.forEach((item, index) => {
      if (item.selected) {
        auth_ids.push(item.auth_id);
      }
    });
    merchant.auth_ids = auth_ids.join();
    let areas = [];
    merchant.areas.forEach((item, index) => {
      let province_code = (item[0] && item[0].code) || "";
      let city_code = (item[1] && item[1].code) || "";
      let district_code = (item[2] && item[2].code) || "";
      areas.push({ province_code, city_code, district_code });
    });
    merchant.areas = areas.length === 0 ? "" : JSON.stringify(areas);
    console.log(merchant);
    if (this._judgeData(merchant)) {
      api.addSubBD({ ...merchant }).success((content, next, abort) => {
        if (content.boolen == 1) {
          this.getScreen().alert({
            message: "添加申请已提交，等待对方确认",
            buttons: [
              {
                text: "我知道了",
                onPress: () => {
                  this.props.navigation.goBack();
                }
              }
            ]
          });
        } else {
          this.getScreen().toast(content.message, 3000);
        }
      });
    }
  }

  _judgeData(data) {
    if (!data.mobile) {
      this.getScreen().toast("请输入子商户手机号", 2800);
      return false;
    } else if (!/^1\d{10}$/.test(data.mobile)) {
      this.getScreen().toast("手机号格式有误,请核实", 2800);
      return false;
    } else if (!data.name) {
      this.getScreen().toast("请输入姓名", 2800);
      return false;
    } else if (!data.identity_id) {
      this.getScreen().toast("请输入身份证", 2800);
      return false;
    } else if (!Validate.IdCardValidate(data.identity_id)) {
      this.getScreen().toast("身份证格式有误,请核实", 2800);
      return false;
    } else if (!data.card_no) {
      this.getScreen().toast("请输入银行卡号", 2800);
      return false;
    } else if (!/^\d{1,27}$/.test(data.card_no)) {
      this.getScreen().toast("银行卡号格式有误,请核实", 2800);
      return false;
    } else if (!data.card_of_deposit) {
      this.getScreen().toast("请选择开户行", 2800);
      return false;
    } else if (!data.areas) {
      this.getScreen().toast("请选择负责区域", 2800);
      return false;
    } else if (data.areas) {
      let areas = JSON.parse(data.areas);
      let flag = true;
      areas.forEach(item => {
        if (!item.province_code || !item.city_code || !item.district_code) {
          flag = false;
        }
      });
      if (!flag) {
        this.getScreen().toast("请选择负责区域", 2800);
      }
      if (flag && !data.auth_ids) {
        this.getScreen().toast("请选择拥有权限", 2800);
        flag = false;
      }
      return flag;
    }
    return true;
  }

  _showAreaPicker(index) {
    let pcode = "";
    let ccode = "";
    let acode = "";
    if (
      this.state.merchant.areas[index] &&
      this.state.merchant.areas[index].length === 3
    ) {
      pcode = this.state.merchant.areas[index][0].code;
      ccode = this.state.merchant.areas[index][1].code;
      acode = this.state.merchant.areas[index][2].code;
    }
    let PICKER_ID = this.getScreen().showPopup({
      content: (
        <AreaPicker
          pcode={pcode}
          ccode={ccode}
          acode={acode}
          onCancel={() => {
            this.getScreen().hidePopup(PICKER_ID);
          }}
          onSelected={data => {
            this.getScreen().hidePopup(PICKER_ID);
            console.log(data);
            let areas = this.state.merchant.areas;
            areas[index][0] = data.province;
            areas[index][1] = data.city;
            areas[index][2] = data.area;
            this._setState("areas", areas);
          }}
        />
      )
    });
  }

  render() {
    let card_of_deposit = "选择开户行";
    if (
      this.state.merchant.card_of_deposit &&
      this.state.merchant.card_of_deposit.length === 3
    ) {
      card_of_deposit =
        this.state.merchant.card_of_deposit[0].province_name +
        this.state.merchant.card_of_deposit[1].city_name +
        this.state.merchant.card_of_deposit[2].sub_bank_name;

      let array = [];
      for (let i = 0; i < card_of_deposit.length; i++) {
        array.push(card_of_deposit[i]);
        if ((i + 1) % 12 === 0 && i + 1 !== card_of_deposit.length) {
          array.push("<br>");
        }
      }
      card_of_deposit = array.join("");
    }
    return (
      <div className="sub-business-warp">
        <div className="sub-cell">
          <div className="sub-cell-item">
            <label className="-label">手机号</label>
            <span className="-value">
              <input
                type="tel"
                placeholder="输入子BD手机号"
                value={this.state.merchant.mobile || ""}
                onChange={e => this._onChange(e, "input_mobile")}
              />
            </span>
          </div>
          <div className="sub-cell-item">
            <label className="-label">姓名</label>
            <span className="-value">
              <input
                type="text"
                placeholder="输入姓名"
                value={this.state.merchant.name || ""}
                onChange={e => this._onChange(e, "input_name")}
              />
            </span>
          </div>
          <div className="sub-cell-item">
            <label className="-label">身份证号</label>
            <span className="-value">
              <input
                type="text"
                placeholder="输入身份证"
                value={this.state.merchant.identity_id || ""}
                onChange={e => this._onChange(e, "input_identity_id")}
              />
            </span>
          </div>
          <div className="sub-cell-item">
            <label className="-label">银行卡号</label>
            <span className="-value">
              <input
                type="tel"
                placeholder="输入银行卡号"
                value={this.state.merchant.card_no || ""}
                onChange={e => this._onChange(e, "input_card_no")}
              />
            </span>
          </div>
          <div className="sub-cell-item">
            <label className="-label">开户行</label>
            <span
              className="-value"
              style={{ opacity: card_of_deposit === "选择开户行" ? 0.5 : 1 }}
              onClick={() => this._onClick("click_card")}
              dangerouslySetInnerHTML={{ __html: card_of_deposit }}
            />
            <i className="icon_more" />
          </div>
          <div className="cell-item-add">
            <div className="cell-line">
              {this.state.merchant.areas.map((item, index) => {
                return (
                  <div className="sub-cell-item" key={index}>
                    <label className="-label">负责区域</label>
                    <span className="-value">
                      <input
                        type="text"
                        placeholder="选择区域"
                        readOnly
                        value={
                          item.length === 3
                            ? item[0].name + item[1].name + item[2].name
                            : ""
                        }
                        onClick={() => this._onClick("areas_select", index)}
                      />
                    </span>
                    <i className="icon_more" />
                    {this.state.merchant.areas.length > 1 && (
                      <i
                        className="icon_delete"
                        onClick={() => this._onClick("areas_delete", index)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div
              className="add-reward"
              onClick={() => this._onClick("areas_add")}
            >
              <i className="icon_add" />新增负责区域
            </div>
          </div>
          <div className="permission">
            <div className="title">拥有权限</div>
            <div className="content">
              <ul className="permission-group">
                {this.state.authList.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={item.selected ? "-selected" : ""}
                      onClick={() => this._onClick("click_auth", index)}
                    >
                      {item.auth_name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="cell-control">
            <button
              className="btn-primary"
              onClick={() => this._onClick("submit_add")}
            >
              添加
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SubmerchantAdd;
