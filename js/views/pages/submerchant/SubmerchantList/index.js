"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import List from "./List";
import SearchResult from "./SearchResult";
import api from "./../../../../controllers/api";

//1-待审核 2-审核未通过 3-待确认 4-拒绝确认 5-已确认 6-已绑定
const TABS = ["已绑定", "待确认", "待审核", "未成功"];
const STATUS = ["待审核", "审核驳回", "待确认", "已拒绝", "已确认", "已绑定"];

class SubmerchantList extends ScreenComponent {
  static pageConfig = {
    path: "/submerchant/list",
    permission: true
  };

  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "BD团队管理"
    };
    this.state = {
      selectType: 0, //0 已绑定,1 待确认,2 待审核,3 未成功
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
    api.querySubAccount(data).success((content, next, abort) => {
      if (content.boolen == 1) {
        console.log(content.data);
        if (data.hasOwnProperty("status")) {
          this.setState({
            dataList: content.data.list || [],
            isAuth: content.data.is_auth
          });
        } else if (data.hasOwnProperty("name")) {
          this.setState({
            searchList: content.data.list || [],
            isAuth: content.data.is_auth
          });
        }
      }
    });
  }

  _onClick(e, type, data) {
    if (type === "tab") {
      this.setState({ selectType: data });
      this._fetchData({ status: data + 1 });
    } else if (type === "add_merchant") {
      this.props.navigation.navigate("SubmerchantAdd");
    } else if (type === "input_clear") {
      this.input_search_ref.value = "";
      this.setState({ isSearched: false });
    } else if (type === "input_cancel") {
      this.input_search_ref.value = "";
      this.setState({ isFocused: false, isSearched: false });
    } else if (type === "item_edit") {
      console.log(type);
      e.stopPropagation();
      this.props.navigation.navigate("SubmerchantModify", {
        bd_id: data.bid
      });
    } else if (type === "item_audit") {
      e.stopPropagation();
      this.props.navigation.navigate("SubmerchantModify", {
        bd_id: data.bid,
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
      this._fetchData({ name: value });
    } else {
      this.setState({ isSearched: false, searchList: [] });
    }
  }

  render() {
    return (
      <div className="sub-merchant">
        <header className="base-search-bar">
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
              placeholder="搜索BD姓名"
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
        </header>
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
                    onClick={e => this._onClick(e, "tab", index)}
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
              <List
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
                onClick={(e, type, data) => this._onClick(e, type, data)}
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
            <a>添加BD子账户</a>
          </div>
        )}
      </div>
    );
  }
}

export default SubmerchantList;
