"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import api from "./../../../../controllers/api";

class CapitalRecord extends ScreenComponent {
  static pageConfig = {
    path: "/business/capitalrecord",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "资金记录"
    };
    this.state = {
      selectType: 0, //0 全部,1 提现,2 首投奖励
      dataList: [],
      page: 0,
      isLoading: false,
      totalPage: 0
    };
    this._onScroll = this._onScroll.bind(this);
  }

  componentDidMount() {
    this._fetchData({ page: 1 });

    this.container.addEventListener("scroll", this._onScroll, false);
  }

  componentWillUnmount() {
    this.container.removeEventListener("scroll", this._onScroll, false);
  }

  _fetchData(data) {
    this.setState({ isLoading: true });
    api.capitalRecordList(data).success((content, next, abort) => {
      if (content.boolen == 1) {
        this.setState({
          dataList: this.state.dataList.concat(content.data.list||[]),
          totalPage: content.data.total_page,
          page: parseInt(content.data.current_page),
          isLoading: false
        });
      } else {
        this.getScreen().toast(content.message, 3000);
        this.setState({ isLoading: false });
      }
    });
  }

  _onClick(type) {
    if (type === "all") {
      if (this.state.selectType !== 0) {
        this.setState({ selectType: 0, dataList: [], page: 0 });
        this._fetchData({ page: 1 });
      }
    } else if (type === "with_draw") {
      if (this.state.selectType !== 1) {
        this.setState({ selectType: 1, dataList: [], page: 0 });
        this._fetchData({ page: 1, type: 1 });
      }
    } else if (type === "invest") {
      if (this.state.selectType !== 2) {
        this.setState({ selectType: 2, dataList: [], page: 0 });
        this._fetchData({ page: 1, type: 3 });
      }
    }
  }

  _onScroll() {
    let scrollTop = this.container.scrollTop;
    let scrollHeight = this.container.scrollHeight;
    let clientHeight = this.container.clientHeight;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !this.state.isLoading &&
      this.state.totalPage > this.state.page
    ) {
      if (this.state.selectType === 0) {
        this._fetchData({ page: this.state.page + 1 });
      } else if (this.state.selectType === 1) {
        this._fetchData({ page: this.state.page + 1, type: 1 });
      } else if (this.state.selectType === 2) {
        this._fetchData({ page: this.state.page + 1, type: 3 });
      }
    }
  }

  render() {
    return (
      <div className="capitalrecord" ref={ref => (this.container = ref)}>
        <div className="tabs">
          <ul className="tab-nav">
            <li
              className={
                this.state.selectType === 0
                  ? "tab-nav-item -active"
                  : "tab-nav-item"
              }
              onClick={() => this._onClick("all")}
            >
              全部
            </li>
            <li
              className={
                this.state.selectType === 1
                  ? "tab-nav-item -active"
                  : "tab-nav-item"
              }
              onClick={() => this._onClick("with_draw")}
            >
              提现
            </li>
            <li
              className={
                this.state.selectType === 2
                  ? "tab-nav-item -active"
                  : "tab-nav-item"
              }
              onClick={() => this._onClick("invest")}
            >
              邀请首投奖励
            </li>
          </ul>
          <div className="record-item">
            <ul>
              {this.state.dataList.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={
                      item.type === "cash"
                        ? "record-item-li"
                        : "record-item-li income"
                    }
                  >
                    <div className="record-item-line">
                      <i />
                    </div>
                    <h5>{item.name}</h5>
                    <h6>{item.time}</h6>
                    <span>
                      {item.in_or_out === "1" ? "+" : "-"}
                      {item.money}元
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default CapitalRecord;
