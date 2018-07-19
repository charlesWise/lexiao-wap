import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";

//商户状态 1：草稿，2：待BD确认(自主申请)，3：待商户确认(商户确认)，4：商户拒绝确认(商户确认)，5:待平台审核(平台审核),6:审核成功(服务中),7:审核驳回(平台审核)
export default class SearchResult extends ScreenComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="submerchant-list" style={{ margin: "0.45rem 0" }}>
        {this.props.dataSource.map((item, index) => {
          return (
            <div
              key={index}
              className="submerchant-item"
              onClick={e => this.props.onClick(e, "item_review", item)}
            >
              <h3 className="name">
                {item.name}{" "}
                <em>{this.props.status[parseInt(item.status) - 1]}</em>
              </h3>
              <p className="props">
                <span>
                  累计邀请：<em>{item.invitations}</em>人
                </span>
                <span>
                  累计获利：<em>{item.profits}</em>元
                </span>
                {["3", "5"].indexOf(item.status) === -1 && (
                  <a
                    style={{ zIndex: 1 }}
                    onClick={e => this.props.onClick(e, "item_edit", item)}
                  >
                    编辑
                  </a>
                )}
                {this.props.isAuth == 1 &&
                  item.status == "5" && (
                    <a
                      style={{ zIndex: 1 }}
                      onClick={e => this.props.onClick(e, "item_audit", item)}
                    >
                      审核
                    </a>
                  )}
              </p>
            </div>
          );
        })}
        {this.props.dataSource.length === 0 && (
          <div className="search-no">无搜索结果</div>
        )}
      </div>
    );
  }
}
