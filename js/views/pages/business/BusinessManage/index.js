"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import BusinessManageList from "./BusinessManageList";
import SearchResult from "./SearchResult";
import api from "./../../../../controllers/api";

//商户状态 1：草稿，2：待BD确认(自主申请)，3：待商户确认(商户确认)，4：商户拒绝确认(商户确认)，5:待平台审核(平台审核),6:审核成功(服务中),7:审核驳回(平台审核)
const STATUS = [
  "草稿",
  "自主申请",
  "待确认",
  "已拒绝",
  "待平台审核",
  "服务中",
  "审核驳回"
];
const TABS = ["服务中", "商户确认", "平台审核", "自主申请", "草稿"];

class BusinessManage extends ScreenComponent {
  static pageConfig = {
    path: "/business/businessmanage",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "商户管理"
    };
    const { state } = this.props.navigation;

    let index = 0;
    if (state.params) {
      index = parseInt(state.params.tab) - 1;
    }
    this.state = {
      selectType: index, //0 服务中,1 商户确认,2 平台审核,3 自主申请,4 草稿,
      isSearched: false, //搜索
      isFocused: false,
      isOnComposition: false, //中文输入
      dataList: [],
      searchList: [],
      isAuth: 0 //0没有审核权限,1有审核权限
    };
  }

  componentDidMount() {
    this._fetchData({ status: this.state.selectType + 1 });
  }

  _fetchData(data) {
    api.queryMerchant(data).success((content, next, abort) => {
      if (data.hasOwnProperty("status")) {
        this.setState({
          dataList: content.data.list || [],
          isAuth: content.data.is_auth
        });
      } else if (data.hasOwnProperty("merchant_name")) {
        this.setState({
          searchList: content.data.list || [],
          isAuth: content.data.is_auth
        });
      }
    });
  }

  _onClick(e, type, data) {
    if (type === "click_tab") {
      this.setState({ selectType: data });
      this._fetchData({ status: data + 1 });
    } else if (type === "add_merchant") {
      this.props.navigation.navigate("BusinessAdd", {
        callback: data => {
          let tab = data.tab && parseInt(data.tab);
          this.setState({ selectType: tab - 1 });
          this._fetchData({ status: tab });
        }
      });
    } else if (type === "input_clear") {
      this.input_search_ref.value = "";
      this.setState({ isSearched: false });
    } else if (type === "input_cancel") {
      this.input_search_ref.value = "";
      this.setState({ isFocused: false, isSearched: false });
    } else if (type === "item_edit") {
      console.log(type);
      e.stopPropagation();
      if (data.status == 6) {
        this.props.navigation.navigate("BusinessInformation", {
          merchant_id: data.mid,
          type: "servicing",
          callback: data => {
            let tab = data.tab && parseInt(data.tab);
            this.setState({ selectType: tab - 1 });
            this._fetchData({ status: tab });
          }
        });
      } else {
        if(this.state.selectType == 0&&data.status == 7) {
          this.props.navigation.navigate("BusinessInformation", {
            merchant_id: data.mid,
            type: "servicing",
            callback: data => {
              let tab = data.tab && parseInt(data.tab);
              this.setState({ selectType: tab - 1 });
              this._fetchData({ status: tab });
            }
          });
        }else {
          this.props.navigation.navigate("BusinessModify", {
            merchant_id: data.mid,
            callback: data => {
              let tab = data.tab && parseInt(data.tab);
              this.setState({ selectType: tab - 1 });
              this._fetchData({ status: tab });
            }
          });
        }
      }
    } else if (type === "item_review") {
      console.log(type);
      if (["6", "3", "5","7"].indexOf(data.status) !== -1) {
        this.props.navigation.navigate("BusinessInformation", {
          merchant_id: data.mid
        });
      } else {
        this.props.navigation.navigate("BusinessModify", {
          merchant_id: data.mid,
          callback: data => {
            let tab = data.tab && parseInt(data.tab);
            this.setState({ selectType: tab - 1 });
            this._fetchData({ status: tab });
          }
        });
      }
    } else if (type === "item_audit") {
      e.stopPropagation();
      this.props.navigation.navigate("BusinessInformation", {
        merchant_id: data.mid,
        type: "audit",
        callback: data => {
          let tab = data.tab && parseInt(data.tab);
          this.setState({ selectType: tab - 1 });
          this._fetchData({ status: tab });
        }
      });
    }
  }

  _onInputSearch(e) {
    let value = e.target.value;
    if (value) {
      this.setState({ isSearched: true });
      this._fetchData({ merchant_name: value });
    } else {
      this.setState({ isSearched: false, searchList: [] });
    }
    console.log(e.target.value);
  }

  render() {
    return (
      <div className="sub-merchant">
        <div className="base-search-bar ">
          <div className="base-search-input">
            <i
              className="base-search-input-icon_search"
              style={{ left: "0.6rem" }}
            />
            {this.state.isSearched && (
              <i
                className="base-search-input-icon_del"
                onClick={e => this._onClick(e, "input_clear")}
              />
            )}
            <input
              type="text"
              className="search_input"
              placeholder="搜索商户名称"
              style={
                this.state.isFocused
                  ? { height: "1.45rem", marginLeft: 0 }
                  : { height: "1.45rem", marginLeft: 0, width: "16rem" }
              }
              onChange={e =>
                !this.state.isOnComposition && this._onInputSearch(e)
              }
              onFocus={() => this.setState({ isFocused: true })}
              onCompositionStart={() =>
                this.setState({ isOnComposition: true })
              }
              onCompositionEnd={e => {
                this.setState({ isOnComposition: false });
                this._onInputSearch(e);
              }}
              ref={ref => (this.input_search_ref = ref)}
            />
          </div>
          {this.state.isFocused && (
            <a
              className="head_cancel"
              onClick={e => this._onClick(e, "input_cancel")}
            >
              取消
            </a>
          )}
        </div>
        <div className="tabs -notborder">
          {!this.state.isSearched && (
            <ul className="tab-nav" style={{ marginBottom: "0" }}>
              {TABS.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={
                      this.state.selectType === index
                        ? "tab-nav-item -active"
                        : "tab-nav-item"
                    }
                    onClick={e => this._onClick(e, "click_tab", index)}
                  >
                    {item}
                    {/*<i className="badge">2</i>*/}
                  </li>
                );
              })}
            </ul>
          )}
          <div className="tab-panel">
            {!this.state.isSearched && (
              <BusinessManageList
                dataSource={this.state.dataList}
                isAuth={this.state.isAuth}
                status={STATUS}
                onClick={(e, type, data) => this._onClick(e, type, data)}
              />
            )}
            {this.state.isSearched && (
              <SearchResult
                dataSource={this.state.searchList}
                isAuth={this.state.isAuth}
                status={STATUS}
                onClick={(e, type) => this._onClick(e, type)}
              />
            )}
          </div>
        </div>
        {this.state.isFocused &&
          !this.state.isSearched && <div className="float-layer" />}
        {!this.state.isSearched && (
          <div
            className="fixed-bottom"
            onClick={e => this._onClick(e, "add_merchant")}
          >
            <a>添加商户</a>
          </div>
        )}
      </div>
    );
  }
}

export default BusinessManage;
