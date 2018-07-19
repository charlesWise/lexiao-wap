"use strict";
import React, { Component } from "react";

class Coordinate extends Component {
  constructor(...props) {
    super(...props);

    this._option = {
      //距离容器距离
      grid: {
        left: 54,
        right: 134,
        bottom: 39,
        top: 19
      },
      xAxis: {
        //刻度样式
        label: {
          color: "#aaaaaa",
          font: "18px PingFangSC-Regular",
          offset: 14
        },
        splitNumber: 4,
        data: []
      },
      yAxis: {
        //刻度样式
        label: {
          color: "#aaaaaa",
          font: "20px PingFangSC-Regular",
          offset: 18
        },
        min: 0,
        max: 500,
        splitNumber: 5,
        data: []
      },
      series: [],
      dot: {
        outerArc: 10,
        innerArc: 6
      },
      tip: {
        width: 60,
        height: 40,
        font: "22px PingFangSC-Regular",
        backgroundColor: "#FF810C",
        color: "#fff",
        offset: 9,
        icon: 11
      }
    };
    this._dataSource = [];
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
  }

  componentDidMount() {
    this.canvas.addEventListener("touchstart", this._onTouchStart, false);
    this.canvas.addEventListener("touchend", this._onTouchEnd, false);
  }

  componentDidUpdate() {
    this._dataSource =
      (this.props.dataSource && this.props.dataSource.list) || [];
    this.next_page =
      (this.props.dataSource && this.props.dataSource.next_page) || 0;
    this.curren_page =
      (this.props.dataSource && this.props.dataSource.curren_page) || 1;
    this._initCanvas();
  }

  _initCanvas() {
    this.context = this.canvas.getContext("2d");
    this.parentElement = this.canvas.parentElement;
    this.canvas.width = this.parentElement.clientWidth * 2;
    this.canvas.height = this.parentElement.clientHeight * 2;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this._initDataSource();
    this._drawAxis();
  }

  _initDataSource() {
    this._option.xAxis.data = [];
    this._option.yAxis.data = [];
    this._option.series = [];
    this._dataSource.forEach((item, index) => {
      this._option.xAxis.data.push(item);
      if (item.data === "") {
        this._option.yAxis.data.push("undefined");
      } else {
        this._option.yAxis.data.push(item.data);
      }
    });
  }

  _drawAxis() {
    this._drawColumn();
    this._drawRow();
    this._drawPoint();
    this._drawLine();
    this._drawDot();
    this._drawTip();
  }

  _drawColumn() {
    //设置虚线
    this.context.setLineDash([5, 5]);

    this.context.strokeStyle = "#979797";
    let dx =
      (this.canvas.width - this._option.grid.left - this._option.grid.right) /
      (this._option.xAxis.splitNumber - 1);
    this._option.xAxis.data.forEach((item, index) => {
      let offset = dx * index;
      let startY = 0;
      let startX = this._option.grid.left + offset;
      this.context.beginPath();
      this.context.moveTo(startX, startY);
      this.context.lineTo(
        startX,
        this.canvas.height - this._option.grid.bottom
      );
      this.context.stroke();

      this.context.font = this._option.xAxis.label.font;
      this.context.textAlign = "center";
      this.context.textBaseline = "top";
      this.context.fillStyle = this._option.xAxis.label.color;
      this.context.fillText(
        item.time,
        startX - 5,
        this.canvas.height -
          this._option.grid.bottom +
          this._option.xAxis.label.offset
      );
      if (this._option.yAxis.data[index] === "undefined") {
        this._option.series.push([
          startX,
          this.canvas.height -
            this._option.grid.top -
            this._option.grid.bottom +
            this._option.grid.top
        ]);
      } else {
        this._option.series.push([
          startX,
          (this.canvas.height -
            this._option.grid.top -
            this._option.grid.bottom) *
            (this._option.yAxis.max - this._option.yAxis.data[index]) /
            this._option.yAxis.max +
            this._option.grid.top
        ]);
      }
    });
  }

  _drawRow() {
    //设置虚线
    this.context.setLineDash([5, 5]);

    this.context.strokeStyle = "#979797";
    this.context.globalAlpha = 1;
    let dy =
      (this.canvas.height - this._option.grid.top - this._option.grid.bottom) /
      this._option.yAxis.splitNumber;
    let scaleY = this._option.yAxis.max;
    let scaleDy =
      (this._option.yAxis.max - this._option.yAxis.min) /
      this._option.yAxis.splitNumber;
    for (let i = 0; i < this._option.yAxis.splitNumber + 1; i++) {
      let offset = dy * i;
      let startX = this._option.grid.left;
      let startY = this._option.grid.top + offset;
      this.context.beginPath();
      this.context.moveTo(startX, startY);
      this.context.lineTo(this.canvas.width, startY);
      this.context.stroke();

      //label文字
      this.context.font = this._option.yAxis.label.font;
      this.context.textAlign = "start";
      this.context.textBaseline = "middle";
      this.context.fillStyle = this._option.xAxis.label.color;
      this.context.fillText(scaleY - scaleDy * i, 0, startY);
    }
  }

  _drawPoint() {
    this.context.globalAlpha = 0.2;
    this._option.series.forEach((item, index) => {
      this.context.beginPath();
      this.context.moveTo(item[0], item[1]);
      if (
        index + 1 !== this._option.series.length &&
        (this._option.yAxis.data[index + 1] != "undefined" &&
          this._option.yAxis.data[index] != "undefined")
      ) {
        this.context.lineTo(
          this._option.series[index + 1][0],
          this._option.series[index + 1][1]
        );
        this.context.lineTo(
          this._option.series[index + 1][0],
          this.canvas.height - this._option.grid.bottom
        );
        this.context.lineTo(
          item[0],
          this.canvas.height - this._option.grid.bottom
        );
        this.context.fillStyle = "red";
        this.context.fill();
      }
    });
  }

  _drawLine() {
    this.context.globalAlpha = 1;
    this.context.beginPath();
    //去掉虚线
    this.context.setLineDash([]);

    this.context.lineWidth = 4;
    let flag = false;
    this._option.series.forEach((item, index) => {
      if (this._option.yAxis.data[index] != "undefined" && flag) {
        flag = true;
        this.context.moveTo(item[0], item[1]);
      } else {
        if (this._option.yAxis.data[index] != "undefined") {
          this.context.lineTo(item[0], item[1]);
        }
      }
      this.context.strokeStyle = "#FF7E39";
      this.context.stroke();
    });
  }

  _drawDot() {
    this._option.series.forEach((item, index) => {
      if (this._option.yAxis.data[index] != "undefined") {
        this.context.beginPath();
        this.context.arc(
          item[0],
          item[1],
          this._option.dot.outerArc,
          0,
          2 * Math.PI
        );
        this.context.fillStyle = "#FF7E39";
        this.context.fill();
        this.context.beginPath();
        this.context.arc(
          item[0],
          item[1],
          this._option.dot.innerArc,
          0,
          2 * Math.PI
        );
        this.context.fillStyle = "#fff";
        this.context.fill();
      }
    });
  }

  _drawTip() {
    if (this._option.series.length !== 0) {
      let index_temp = "-1";
      let textData = "";
      this._option.xAxis.data.forEach((item, index) => {
        if (item.is_now == 1) {
          index_temp = index;
          textData = item.data;
        }
      });
      if (index_temp != "-1"  && textData != "") {
        let last = this._option.series[index_temp];
        let data = this._option.yAxis.data[index_temp];
        //矩形
        this.context.beginPath();
        this.context.fillStyle = this._option.tip.backgroundColor;
        this.context.fillRect(
          last[0] - this._option.tip.width / 2,
          last[1] -
            this._option.dot.outerArc -
            this._option.tip.offset -
            this._option.tip.icon -
            this._option.tip.height,
          this._option.tip.width,
          this._option.tip.height
        );

        //三角形
        this.context.beginPath();
        this.context.moveTo(
          last[0],
          last[1] - this._option.dot.outerArc - this._option.tip.offset
        );
        this.context.lineTo(
          last[0] - this._option.tip.icon / 2,
          last[1] -
            this._option.dot.outerArc -
            this._option.tip.offset -
            this._option.tip.icon
        );
        this.context.lineTo(
          last[0] + this._option.tip.icon / 2,
          last[1] -
            this._option.dot.outerArc -
            this._option.tip.offset -
            this._option.tip.icon
        );
        this.context.fill();

        //文字
        this.context.beginPath();
        this.context.font = this._option.tip.font;
        this.context.fillStyle = this._option.tip.color;
        this.context.textAlign = "center";
        this.context.fillText(
          data,
          last[0],
          last[1] -
            this._option.dot.outerArc -
            this._option.tip.offset -
            this._option.tip.icon -
            this._option.tip.height / 2
        );
      }
    }
  }

  _onTouchStart(e) {
    e.preventDefault();
    this.touchStartPositionX = e.targetTouches[0].pageX;
    this.touchStartPositionY = e.targetTouches[0].pageY;
  }

  _onTouchEnd(e) {
    e.preventDefault();
    let touchEndPositionX = e.changedTouches[0].pageX;
    let touchEndPositionY = e.changedTouches[0].pageY;

    let dX = touchEndPositionX - this.touchStartPositionX;
    let dY = touchEndPositionY - this.touchStartPositionY;
    if (Math.abs(dX) > Math.abs(dY)) {
      if (dX > 0) {
        if (this.curren_page > 1) {
          this._fetchData({ page: --this.curren_page });
        }
      } else {
        if (this.next_page != 0) {
          this._fetchData({ page: ++this.curren_page });
        }
      }
    }
  }

  _fetchData(data) {
    this.props.fetchStaticData && this.props.fetchStaticData("scroll", data);
  }

  render() {
    return <canvas ref={name => (this.canvas = name)} style={{ zoom: 0.5 }} />;
  }
}

export default Coordinate;
