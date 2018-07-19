"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";

class Admission extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "入驻奖励"
    };
  }
  render() {
    return (
      <div className="add">
        {this.props.dataSource.reward.map((item, index) => {
          return (
            <div className="add-line" key={index}>
              <div key={index}>
                <div className="add-item">
                  <div className="-label -i-address-fr">奖励类型</div>
                  <div
                    className="-value"
                    onClick={() => this.props.onClick("click_reward", index)}
                  >
                    {item.name}
                  </div>
                </div>
                <div className="add-item">
                  <div className="-label">奖励标准</div>
                  <div className="-value">
                    <input
                      type="number"
                      placeholder="输入奖励标准"
                      value={item.input || ""}
                      onChange={e =>
                        this.props.onChange(e, "input_reward", index)
                      }
                      ref={"reward_" + index}
                    />{" "}
                    <em className="sign">
                      {item.type === "3" ? "%" : "元/人"}
                    </em>
                  </div>
                </div>
                {this.props.dataSource.reward.length > 1 && (
                  <div
                    className="icon_delete"
                    onClick={() => this.props.onClick("reward_delete", index)}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div
          className="add-reward"
          onClick={() => {
            this.props.dataSource.reward.length < 3 &&
              this.props.onClick("reward_add");
          }}
        >
          {this.props.dataSource.reward.length < 3 && (
            <i className="icon_add" />
          )}
          {this.props.dataSource.reward.length < 3 && "添加奖励"}
        </div>
      </div>
    );
  }
}

export default Admission;
