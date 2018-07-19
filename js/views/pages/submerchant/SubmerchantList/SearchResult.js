import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";

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
              onClick={e => this.props.onClick(e, "item_edit", item)}
            >
              <h3 className="name">
                {item.name} <span className="iphone">{item.mobile}</span>
                <em>{this.props.status[parseInt(item.status) - 1]}</em>
              </h3>
              <p className="props">
                <span>
                  累计邀请：<em>{item.invitations}</em>人
                </span>
                <span>
                  累计获利：<em>{item.profits}</em>元
                </span>
                {/*this.props.isAuth == 1 &&
                  item.status == "1" && (
                    <a
                      style={{ zIndex: 1 }}
                      onClick={e => this.props.onClick(e, "item_audit", item)}
                    >
                      审核
                    </a>
                  )*/}
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
