"use strict";
import React from "react";

export default class TextareaPopup extends React.Component {
  constructor(...props) {
    super(...props);
    this.placeholder = this.props.placeholder || "";
    this.wordNum = (this.props.wordNum && parseInt(this.props.wordNum)) || 0;
    this.state = {
      text: "",
      textNum: this.wordNum
    };
  }

  _onSubmit() {
    this.props.onSubmit && this.props.onSubmit(this.state.text);
  }

  render() {
    return (
      <div
        className="popup"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className="TextPopup" style={{ bottom: "0rem" }}>
          <textarea
            type="text"
            autoFocus
            placeholder={this.placeholder}
            onChange={e => {
              let data = e.target.value;

              if (!this.wordNum) {
                this.setState({
                  text: data
                });
              } else {
                if (data.length > this.wordNum) {
                  data = data.slice(0, this.wordNum);
                }
                this.setState({
                  text: data,
                  textNum: this.wordNum - data.length
                });
              }
            }}
            value={this.state.text}
          />
          <i
            className="icon_del"
            onClick={() => {
              this.setState({ text: "", textNum: this.wordNum });
            }}
          />
          {!!this.wordNum && <em>{this.state.textNum}</em>}
          <a
            className="popup_btn"
            onClick={e => {
              this._onSubmit();
            }}
          >
            提交
          </a>
        </div>
      </div>
    );
  }
}
