"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import api from "./../../../../controllers/api";

class CeoManageList extends ScreenComponent {
  static pageConfig = {
    path: "/business/ceomanagelist",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "BD团队管理"
    };
    this.state = {
      type: 1,
      queryBdList: [],
      name: ''
    };
  }
  componentDidMount() {
    this._getQueryBdAccount(this.state.type, this.state.name);
  }
  _getQueryBdAccount(type, name) {
    api.queryBdAccount({type, name}).success((res) => {
      this.setState({queryBdList: res.data})
    }).error((res) => {
        this.getScreen().toast(res.message);
    })
  }
  _onQueryBd(type) {
    this.setState({type}, () => this._getQueryBdAccount(type, this.state.name))
  }
  _onChangeName(e) {
    let name = e.target.value;
    this.setState({name}, () => this._getQueryBdAccount(this.state.type, name))
  }
  _noData() {
    return(
        <div className='no-available-data'>
            <p><img src='/images/index/no_data.png'/></p>
            <p>无数据</p>
        </div>
    )
  }
  _onCeoManageDetail(bd_id) {
    let navigation = this.getScreen().getNavigation();
         navigation.navigate('CeoManageDetail', {bd_id});
  }
  render() {
    return (
      <div className="ceo-manage-list">
        <div className="search-name">
          <div className="search-bar">
              <i className="icon-search" />
              <input
                  type="text"
                  className="search-input"
                  placeholder="搜索BD姓名"
                  value={this.state.name} 
                  onChange={e => this._onChangeName(e)}
                  />
          </div>
        </div>
        <div className="ceo-nav">
          <ul>
            <li
              onClick={() => this._onQueryBd(1)}
              className={`${this.state.type == 1&&'active'}`}
              ><span>一级BD</span></li>
            <li
              onClick={() => this._onQueryBd(2)}
              className={`${this.state.type == 2&&'active'}`}
              ><span>二级BD</span></li>
            <li
              onClick={() => this._onQueryBd(3)}
              className={`${this.state.type == 3&&'active'}`}
              ><span>三级BD</span></li>
          </ul>
        </div>
        {
          (this.state.queryBdList&&this.state.queryBdList.length>0)?
          <div className="ceo-list">
            <ul>
            {
              this.state.queryBdList.map((item, index) => {
                return (
                  <li key={index} 
                    onClick={() => this._onCeoManageDetail(item.bid)}
                    >
                    <p><span>{item.name}</span><span>{item.mobile}</span></p>
                    <p><span>累计邀请：<em>{item.invitations}</em>人</span><span>累计获利：<em>{item.profits}</em>元</span></p>
                  </li>
                );
              })
            }
            </ul>
          </div>
          :
          this._noData()
        }
      </div>
    );
  }
}

export default CeoManageList;
