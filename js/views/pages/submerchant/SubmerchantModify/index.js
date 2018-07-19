"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import AreaPicker from "./../../../components/AreaPicker";
import api from "./../../../../controllers/api";
import Validate from "./../../../../util/Validate";
import TextareaPopup from "./../../../components/TextareaPopup";

//1-待审核 2-审核未通过 3-待确认 4-拒绝确认 5-已确认 6-已绑定

class SubmerchantModify extends ScreenComponent {
  static pageConfig = {
    path: "/submerchant/modify",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "BD子账户详情"
    };
    this.state = {
      merchant: {},
      authList: []
    };
  }

  componentDidMount() {
    const { state } = this.props.navigation;
    let bd_id = state.params.bd_id;
    api.merchantAuthList({ type: 3 }).success((content, next, abort) => {
      if (content.boolen == 1) {
        let authList = [];
        content.data && content.data.list;
        content.data.list.forEach((item, index) => {
          authList.push({ ...item, selected: false });
        });
        this.setState({ authList });
      }
    });
    api.subBDInfo({ bd_id }).success((content, next, abort) => {
      if (content.boolen == 1) {
        let areas = [];
        let data = content.data;
        data &&
          data.areas.forEach((item, index) => {
            let temp = [];
            temp.push({ name: item.province_name, code: item.province_code });
            temp.push({ name: item.city_name, code: item.city_code });
            temp.push({ name: item.district_name, code: item.district_code });
            areas.push(temp);
          });
        data.areas = areas;
        if (data.card_no) {
          let value = data.card_no;
          let array = [];
          for (let i = 0; i < value.length; i++) {
            array.push(value[i]);
            if ((i + 1) % 4 === 0 && i + 1 !== value.length) {
              array.push(" ");
            }
          }
          value = array.join("");
          data.card_no = value;
        }
        this.setState({ merchant: data });
      }
    });
  }

  _onClick(type, data) {
    if (type === "click_auth") {
      let merchant = this.state.merchant;
      let auth_ids = merchant.auth_ids;
      if (auth_ids.indexOf(data) !== -1) {
        auth_ids.splice(auth_ids.indexOf(data), 1);
      } else {
        auth_ids.push(data);
      }
      merchant.auth_ids = auth_ids;
      this.setState({ merchant });
    } else if (type === "submit_audit") {
      this._submitData();
    } else if (type === "submit_remove") {
      this.getScreen().alert({
        message: "确定要解除与该BD的绑定吗？",
        buttons: [
          { text: "取消" },
          {
            text: "确定",
            onPress: () => {
              const { state } = this.props.navigation;
              let bd_id = state.params.bd_id;
              api
                .unbindSubAccount({ bd_id })
                .success((content, next, abort) => {
                  if (content.boolen == 1) {
                    this.props.navigation.goBack();
                  } else {
                    this.getScreen().toast(content.message, 3000);
                  }
                });
            }
          }
        ]
      });
    } else if (type === "submit_save") {
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
    } else if (type === "audit_reject") {
      this._showTextareaPopup();
    } else if (type === "audit_resolve") {
      this._auditMerchant(1);
    }
  }

  //审核
  _auditMerchant(type, reason) {
    const { state } = this.props.navigation;
    let id = state.params.merchant_id;
    //type:1审核 0拒绝
    if (type == 1) {
      this.getScreen().alert({
        message: "确认该BD通过平台审核？",
        buttons: [
          { text: "取消" },
          {
            text: "确定",
            onPress: () => {
              api.checkBD({ id, type }).success((content, next, abort) => {
                state.params &&
                  state.params.callback &&
                  state.params.callback({
                    tab: 3
                  });
                this.props.navigation.goBack();
              });
            }
          }
        ]
      });
    } else if (type == 0) {
      api.checkBD({ id, type, reason }).success((content, next, abort) => {
        state.params &&
          state.params.callback &&
          state.params.callback({
            tab: 3
          });
        this.props.navigation.goBack();
      });
    }
  }

  _showTextareaPopup() {
    let popup = this.getScreen().showPopup({
      content: (
        <TextareaPopup
          placeholder="请输入驳回理由"
          onSubmit={data => {
            this.getScreen().hidePopup(popup);
            if (data) {
              this._auditMerchant(0, data);
            } else {
              this.getScreen().toast("请输入驳回理由", 2800);
            }
          }}
        />
      )
    });
  }

  _setState(type, value) {
    let merchant = this.state.merchant;
    merchant[type] = value;
    this.setState({ merchant });
  }

  _submitData() {
    let merchant = this.state.merchant;
    let auth_ids = "";
    let areas = [];
    auth_ids = merchant.auth_ids.join();
    merchant.areas.forEach((item, index) => {
      let province_code = (item[0] && item[0].code) || "";
      let city_code = (item[1] && item[1].code) || "";
      let district_code = (item[2] && item[2].code) || "";
      areas.push({ province_code, city_code, district_code });
    });
    areas = areas.length === 0 ? "" : JSON.stringify(areas);

    const { state } = this.props.navigation;
    let bd_id = state.params.bd_id;
    let data = { bd_id, areas, auth_ids };
    console.log(data);
    if (this._judgeData(data)) {
      api.editSubBDInfo({ ...data }).success((content, next, abort) => {
        if (content.boolen == 1) {
          if (content.data.status == 1) {
            this.getScreen().alert({
              message: "提交成功",
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
          }
        } else {
          this.getScreen().toast(content.message, 3000);
        }
      });
    }
  }

  _judgeData(data) {
    if (!data.areas) {
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
    let auth_ids = this.state.merchant.auth_ids;
    let status = this.state.merchant.status;
    let text = "";
    let style = {};
    if (status == 1) {
      text = "待审核";
      style = { background: "#5294FF", color: "#FFF" };
    } else if (status == 2) {
      if (this.state.merchant.reject_reason) {
        text = this.state.merchant.reject_reason;
      }
      style = { background: "#FCDBBE", color: "#FF810C" };
    }
    if (status == 3) {
      text = "待确认";
      style = { background: "#5294FF", color: "#FFF" };
    }
    if (status == 4) {
      text = "已拒绝";
      style = { background: "#FCDBBE", color: "#FF810C" };
    }
    if (status == 6) {
      text = "已绑定";
      style = { background: "#E8F2FF", color: "#4382CD" };
    }

    let array = [];
    let card_of_deposit = this.state.merchant.card_of_deposit || "";
    for (let i = 0; i < card_of_deposit.length; i++) {
      array.push(card_of_deposit[i]);
      if ((i + 1) % 12 === 0 && i + 1 !== card_of_deposit.length) {
        array.push("<br>");
      }
    }
    card_of_deposit = array.join("");
    const { state } = this.props.navigation;
    return (
      <div className="sub-business-warp">
        <div className="reason-text" style={style}>
          <p>{text}</p>
        </div>
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
            <span
              className="-value"
              style={{ opacity: 0.5 }}
              dangerouslySetInnerHTML={{ __html: card_of_deposit }}
            />
          </div>
          <div className="cell-item-add">
            <div className="cell-line">
              {this.state.merchant.areas &&
                this.state.merchant.areas.map((item, index) => {
                  return (
                    <div className="sub-cell-item" key={index}>
                      <label className="-label">负责区域</label>
                      <span className="-value">
                        <input
                          type="text"
                          placeholder={
                            (status == 1 || status == 3) && item.length === 3
                              ? item[0].name + item[1].name + item[2].name
                              : ""
                          }
                          value={
                            status != 1 && status != 3 && item.length === 3
                              ? item[0].name + item[1].name + item[2].name
                              : ""
                          }
                          readOnly
                          onClick={() =>
                            status != 1 &&
                            status != 3 &&
                            this._onClick("areas_select", index)
                          }
                        />
                        {status != 1 &&
                          status != 3 && <i className="icon_more" />}
                        {status != 1 &&
                          status != 3 &&
                          this.state.merchant.areas.length > 1 && (
                            <i
                              className="icon_delete"
                              onClick={() =>
                                this._onClick("areas_delete", index)
                              }
                            />
                          )}
                      </span>
                    </div>
                  );
                })}
            </div>
            {status != 1 &&
              status != 3 && (
                <div
                  className="add-reward"
                  onClick={() => this._onClick("areas_add")}
                >
                  <i className="icon_add" />新增负责区域
                </div>
              )}
          </div>
          <div className="permission">
            <div className="title">拥有权限</div>
            <div className="content">
              <ul className="permission-group">
                {this.state.authList.map((item, index) => {
                  let className = "";
                  if (auth_ids && auth_ids.indexOf(item.auth_id) !== -1) {
                    if (status != 1 && status != 3) {
                      className = "-selected";
                    } else {
                      className = "-disabled";
                    }
                  } else {
                    if (status == 1 || status == 3) {
                      className = "-unselect-disabled";
                    }
                  }
                  return (
                    <li
                      key={index}
                      className={className}
                      onClick={() => {
                        status != 1 &&
                          status != 3 &&
                          this._onClick("click_auth", item.auth_id);
                      }}
                    >
                      {item.auth_name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div
            className={["1", "6"].indexOf(status) != -1 ? "cell-control" : ""}
          >
            {(status == 2 || status == 4) && (
              <button
                className="btn-primary"
                onClick={() => this._onClick("submit_audit")}
              >
                提交审核
              </button>
            )}
            {status == 6 && (
              <div className="bound-btn">
                <a
                  className="bound-btn-fl"
                  onClick={() => this._onClick("submit_remove")}
                >
                  解绑子账户
                </a>
                <a
                  className="bound-btn-fr"
                  onClick={() => this._onClick("submit_save")}
                >
                  保存
                </a>
              </div>
            )}
          </div>
          {state.params.callback &&
            status == 1 && (
              <div className="-m-add">
                <div className="add-btn" style={{ position: "unset" }}>
                  <a
                    className="add-btn-fl"
                    onClick={() => this._onClick("audit_reject")}
                  >
                    审核驳回
                  </a>
                  <a
                    className="add-btn-fr"
                    onClick={() => this._onClick("audit_resolve")}
                  >
                    审核通过
                  </a>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default SubmerchantModify;
