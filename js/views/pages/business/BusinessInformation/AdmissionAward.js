"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";

class AdmissionAward extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "入驻奖励"
    };
  }
  render() {
    return (
      <div className="business-award" style={{minHeight:'99%'}}>
        <table className="business-award-table">
          <thead>
            <tr>
              <th>奖励类型</th>
              <th>奖励标准</th>
            </tr>
          </thead>
          <tbody>
            {this.props.dataSource.reward_config &&
              this.props.dataSource.reward_config.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.reward_name}</td>
                    <td>
                      {item.reward_standard}
                      {item.reward_type === "3" ? "%" : "元/人"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default AdmissionAward;
