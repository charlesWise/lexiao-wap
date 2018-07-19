"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import Coordinate from "../../../components/Coordinate";
import api from "./../../../../controllers/api";

import { StoreManager } from 'mlux';

function MerchantName(props) {
  return (
    <div className="mybusiness-name">
      <div className="picture">
        <img src="/images/business/default-image.png" />
      </div>
      <div className="pic-text">
        <h2>{props.dataSource.name}
          {
            props.dataSource.is_ceo&&props.dataSource.is_ceo==1&&<i className="icon-ceo"></i>
          }
        </h2>
        <p>{props.dataSource.mobile}</p>
      </div>
    </div>
  );
}

function MerchantBalance(props) {
  let amount = "0.00";
  if (props.dataSource.amount) {
    if (props.dataSource.amount.indexOf(".") !== -1) {
      amount = props.dataSource.amount;
    } else {
      amount = props.dataSource.amount + ".00";
    }
  }
  return (
    <div className="mybusiness-balance">
      <div className="handle">
        账户余额(元) <em>{amount}</em>
        {props.userAuth.list &&
          props.userAuth.list.map((item, index) => {
            if (item.code === "CASHOUT") {
              return (
                <a key={index} onClick={() => props.onClick("with_draw")}>
                  提现
                </a>
              );
            }
          })}
      </div>
      <a onClick={() => props.onClick("m_record")} className="a_btn">
        资金记录
      </a>
    </div>
  );
}

// 商户管理	MERCHANT_MANAGE
// 审核商户	MERCHANT_AUDIT
// 提现	CASHOUT
// 发布商户福利(福利券管理)	MERCHANT_WEAL_PUBLISH
// 审核商户福利	MERCHANT_WEAL_AUDIT

function MerchantMenu(props) {
  return (
    <div className="mybusiness-menu menu-three">
      {props.userAuth.list &&
        props.userAuth.list.map((item, index) => {
          if (item.code === "MERCHANT_MANAGE") {
            return (
              <dl key={index}>
                <dd>
                  {/*<i>2</i>*/}
                  <img
                    src="/images/mymerchant/icon_menu3.png"
                    onClick={() => props.onClick("business_m")}
                  />
                </dd>
                <dt>商户管理</dt>
              </dl>
            );
          }
        })}
      {props.userAuth.bd_manage_flag == 1 && (
        <dl>
          <dd>
            <img
              src="/images/mymerchant/icon_menu2.png"
              onClick={() => props.onClick("bd_m")}
            />
          </dd>
          <dt>BD团队管理</dt>
        </dl>
      )}
      {props.userAuth.list &&
        props.userAuth.list.map((item, index) => {
          if (item.code === "MERCHANT_WEAL_PUBLISH") {
            return (
              <dl key={index}>
                <dd>
                  <img
                    src="/images/mymerchant/icon_menu4.png"
                    onClick={() => props.onClick("welfare_m")}
                  />
                </dd>
                <dt>福利券管理</dt>
              </dl>
            );
          }
        })}
    </div>
  );
}

function MerchantManage(props) {
  return (
    <div className="mybusiness-menu menu-three">
      <dl onClick={() => props.onClick("ceo_manage")}>
        <dd>
          {/*<i>2</i>*/}
          <img src="/images/mymerchant/icon_menu2.png" />
        </dd>
        <dt>BD团队管理</dt>
      </dl>
    </div>
  )
}

function MerchantAward(props) {
  return (
    <div className="mybusiness-cumulative">
      <ul className="cumulative">
        <li>
          累计邀请商户入驻 <span>{props.dataSource.invite_merchants}家</span>
        </li>
        <li>
          邀请注册用户数 <span>{props.dataSource.invite_registers}人</span>
        </li>
        <li>
          邀请投资用户数 <span>{props.dataSource.invite_invests}人</span>
        </li>
      </ul>
    </div>
  );
}

function MerDiagram(props) {
  return (
    <div className="tabs mybusiness-deiagram">
      <ul className="tab-nav">
        <li
          className={
            props.selectType === 1 ? "tab-nav-item -active" : "tab-nav-item"
          }
          onClick={() => props.onClick("select_merchant")}
        >
          新增有效入驻商户
        </li>
        <li
          className={
            props.selectType === 2 ? "tab-nav-item -active" : "tab-nav-item"
          }
          onClick={() => props.onClick("select_register")}
        >
          新增有效投资用户
        </li>
        <li
          className={
            props.selectType === 3 ? "tab-nav-item -active" : "tab-nav-item"
          }
          onClick={() => props.onClick("select_invest")}
        >
          新增有效注册用户
        </li>
      </ul>
      <div className="deiagram">
        <p
          className="deiagram-fr"
          onClick={() => props.onClick("detail_review")}
        >
          查看详情 >{" "}
        </p>
        <div style={{ height: "10.9rem", width: "100%" }}>
          <Coordinate
            dataSource={props.coordinateData}
            fetchStaticData={(type, data) => props.fetchStaticData(type, data)}
          />
        </div>
        <div className="deiagram-btn">
          <a
            onClick={() => props.onClick("coord_day")}
            className={props.coordType === 1 ? "active" : ""}
          >
            按日
          </a>
          <a
            onClick={() => props.onClick("coord_week")}
            className={props.coordType === 2 ? "active" : ""}
          >
            按周
          </a>
          <a
            onClick={() => props.onClick("coord_month")}
            className={props.coordType === 3 ? "active" : ""}
          >
            按月
          </a>
        </div>
      </div>
    </div>
  );
}

//商户状态 1：草稿，2：待BD确认(自主申请)，3：待商户确认(商户确认)，4：商户拒绝确认(商户确认)，5:待平台审核(平台审核),6:审核成功(服务中),7:审核驳回(平台审核)

class MyBusiness extends ScreenComponent {
  static pageConfig = {
    path: "/business/mybusiness",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "我是BD"
    };
    this.state = {
      coordType: 1, // 1 按日,2 按周,3 按月
      selectType: 1, //1 新增商户入驻数,2 新增注册用户,3 邀请首投奖励
      merchantData: {},
      coordinateData: [],
      noticeList: [],
      userAuth: {}
    };
  }

  componentDidMount() {
    api.BDUserAccount({}).success((content, next, abort) => {
      if (content.boolen == 1) {
        this.setState({ merchantData: content.data });
      } else {
        this.getScreen().toast(content.message, 3000);
      }
    });

    this._fetchUserAuth();

    this._fetchStaticData("click", {
      statis_way: this.state.coordType,
      statis_item: this.state.selectType
    });

    //this._fetchNotice();
  }

  componentWillUnmount() {
    this.timeID && clearInterval(this.timeID);
  }

  _fetchUserAuth() {
    api.getUserAllAuth({}).success((content, next, abort) => {
      let data = content.data || {}
      StoreManager.user.set('auth', data.list || []);

      if (content.boolen == 1) {
        this.setState({ userAuth: content.data || {} });
      } else {
        this.getScreen().toast(content.message, 3000);
      }
    });
  }

  _fetchStaticData(type, data) {
    let tempData = data;
    if (type === "scroll") {
      tempData = {
        ...tempData,
        statis_way: this.state.coordType,
        statis_item: this.state.selectType
      };
    } else if (type === "click") {
      tempData = { ...tempData, page: 1 };
    }
    api.statisticBDData(tempData).success((content, next, abort) => {
      if (content.boolen == 1) {
        this.setState({ coordinateData: content.data });
      } else {
        this.getScreen().toast(content.message, 3000);
      }
    });
  }

  //获取公告
  _fetchNotice() {
    //测试
    let data = [
      {
        text: "您有1个新的福利券待审核",
        type: 1
      },
      {
        text: "您有2个新的福利券待审核",
        type: 3 //3,4
      },
      {
        text: "您有3个新的福利券待审核",
        type: 5 //5,7
      },
      {
        text: "您有4个新的福利券待审核",
        type: 2
      },
      {
        text: "您有5个新的福利券待审核",
        type: 6
      }
    ];

    if (data.length > 1) {
      data.push(data[0]);
    }
    this._initNoticeData(data);
  }

  _onClick(type, index, e) {
    if (type === "coord_day") {
      if (this.state.coordType !== 1) {
        this.setState({ coordType: 1 });
        this._fetchStaticData("click", {
          statis_way: 1,
          statis_item: this.state.selectType
        });
      }
    } else if (type === "coord_week") {
      if (this.state.coordType !== 2) {
        this.setState({ coordType: 2 });
        this._fetchStaticData("click", {
          statis_way: 2,
          statis_item: this.state.selectType
        });
      }
    } else if (type === "coord_month") {
      if (this.state.coordType !== 3) {
        this.setState({ coordType: 3 });
        this._fetchStaticData("click", {
          statis_way: 3,
          statis_item: this.state.selectType
        });
      }
    } else if (type === "select_merchant") {
      if (this.state.selectType !== 1) {
        this.setState({ selectType: 1, coordType: 1 });
        this._fetchStaticData("click", { statis_way: 1, statis_item: 1 });
      }
    } else if (type === "select_register") {
      if (this.state.selectType !== 2) {
        this.setState({ selectType: 2, coordType: 1 });
        this._fetchStaticData("click", { statis_way: 1, statis_item: 2 });
      }
    } else if (type === "select_invest") {
      if (this.state.selectType !== 3) {
        this.setState({ selectType: 3, coordType: 1 });
        this._fetchStaticData("click", { statis_way: 1, statis_item: 3 });
      }
    } else if (type === "m_record") {
      this.props.navigation.navigate("CapitalRecord");
    } else if (type === "with_draw") {
      this.props.navigation.navigate("UserCash");
    } else if (type === "business_m") {
      this.props.navigation.navigate("BusinessManage");
    } else if (type === "bd_m") {
      this.props.navigation.navigate("SubmerchantList");
    } else if (type === "ceo_manage") {
      this.props.navigation.navigate("CeoManageList");
    } else if (type === "welfare_m") {
      this.props.navigation.navigate("BDCouponIndex");
      console.log(type);
    } else if (type === "user-invited") {
      this.props.navigation.navigate("InviteUser");
    } else if (type === "detail_review") {
      if(this.state.merchantData&&Boolean(this.state.merchantData.is_ceo)) {
        this.props.navigation.navigate("CeoMerchantDataDetail");
      }else {
        this.props.navigation.navigate("MerchantDataDetail");
      }
    } else if (type === "notice_delete") {
      e.stopPropagation();
      this.noticeUl.style.animation = "none";
      let noticeList = this.state.noticeList.slice(0);
      if (index === noticeList.length - 1) {
        noticeList.pop();
        noticeList.length !== 0 && noticeList.shift();
        noticeList.length > 1 && noticeList.push(noticeList[0]);
      } else {
        let temp = noticeList.splice(index, noticeList.length - 1);
        temp.shift();
        noticeList.shift();
        temp = temp.concat(noticeList);
        temp.length > 1 && temp.push(temp[0]);
        noticeList = temp;
      }
      this._initNoticeData(noticeList);
    } else if (type === "notice_click") {
      let type = this.state.noticeList[index].type;
      let tab = 1;
      if (type == 1) {
        tab = 5;
      } else if (type == 2) {
        tab = 4;
      } else if (type == 3 || type == 4) {
        tab = 2;
      } else if (type == 5 || type == 7) {
        tab = 3;
      }
      this.props.navigation.navigate("BusinessManage", {
        tab: tab
      });
    }
  }

  _initNoticeData(data) {
    this.setState({ noticeList: data }, () => {
      if (data.length !== 0) {
        this._setScroll();
      }
    });
  }

  //设置滚动
  _setScroll() {
    let style = document.getElementById("notice-transform");
    if (!style) {
      style = document.createElement("style");
    }
    let length = this.state.noticeList.length;
    let average = 100 / (length - 1);
    let width = this.noticeDiv.clientHeight;
    style.type = "text/css";
    style.id = "notice-transform";
    let transform = "";
    for (var i = 0; i < length; i++) {
      let percent = i * average;
      let num = `-${i * width}px`;
      transform += `${percent}%{
        transform: translateY(${num});
        -webkit-transform:translateY(${num});
      }`;
    }
    var keyFrames = `
      @keyframes noticeTransform {
          ${transform}
      }`;
    style.innerHTML = keyFrames;
    document.getElementsByTagName("head")[0].appendChild(style);
    this.noticeUl.style.animation = `noticeTransform ${length}s infinite cubic-bezier(1,0,0.5,0)`;
  }

  render() {
    return (
      <div className="mybusiness">
        {this.state.noticeList.length != 0 && (
          <div className="notice" ref={ref => (this.noticeDiv = ref)}>
            <ul className="notice-box" ref={ref => (this.noticeUl = ref)}>
              {this.state.noticeList.map((item, index) => {
                return (
                  <li
                    className="notice-item"
                    key={index}
                    onClick={() => this._onClick("notice_click", index)}
                  >
                    {item.text}
                    <i
                      className="btn-close"
                      onClick={e => this._onClick("notice_delete", index, e)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <MerchantName dataSource={this.state.merchantData} />
        {
          this.state.merchantData&&!Boolean(this.state.merchantData.is_ceo)&&<MerchantBalance
            dataSource={this.state.merchantData}
            userAuth={this.state.userAuth}
            onClick={type => this._onClick(type)}
          />
        }
        {
          this.state.merchantData&&Boolean(this.state.merchantData.is_ceo)&&<MerchantManage 
            onClick={type => this._onClick(type)}
          />
        }
        {
          this.state.userAuth&&this.state.userAuth.list&&this.state.userAuth.list.length>0&&<MerchantMenu
            onClick={type => this._onClick(type)}
            userAuth={this.state.userAuth}
          />
        }

        <MerchantAward dataSource={this.state.merchantData} />
        <MerDiagram
          coordType={this.state.coordType}
          selectType={this.state.selectType}
          coordinateData={this.state.coordinateData}
          fetchStaticData={(type, data) => this._fetchStaticData(type, data)}
          onClick={type => this._onClick(type)}
        />
        <div
          className="mybusiness-invite"
          onClick={() => this._onClick("user-invited")}
        >
          邀请用户
        </div>
      </div>
    );
  }
}

export default MyBusiness;
