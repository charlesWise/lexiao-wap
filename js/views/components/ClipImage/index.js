"use strict";
import React, { Component } from "react";

const TIME_INTERVAL = 15;

class ClipImage extends Component {
  constructor(...props) {
    super(...props);
    this.multiple =
      typeof this.props.multiple == "undefined" || this.props.multiple == true
        ? true
        : false;
    this.boundRate = this.multiple ? 32 / 75 : 1; //剪切框宽高比率
    this.dataSource = this.props.dataSource || [];
    this.displayNum = this.props.displayNum || 1;

    let { list, num } = this._getselectList();
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this.state = {
      clickedIndex: 0,
      selectList: list,
      selectedNum: num
    };
  }

  componentDidMount() {
    this._initCanvas();
  }

  componentDidUpdate() {
    this._initCanvas();
  }
  componentWillUnmount(){
    this.imageObject = null;
    this.canvas.removeEventListener("touchstart", this._onTouchStart, false);
    this.canvas.removeEventListener("touchmove", this._onTouchMove, false);
    this.canvas.removeEventListener("touchend", this._onTouchEnd, false);
  }

  _getselectList() {
    let list = [];
    let num = 0;
    this.dataSource.forEach((item, index) => {
      this.dataSource[index] = {
        url: item.url,
        isProcessed: index === 0 ? true : false,//true:图像使用canvas画出来
        type: item.type,
        name: item.name
      };
      list.push(index < this.displayNum ? true : false);//true:选中的图片
      if (index < this.displayNum) {
        num++;
      }
    });
    return { list, num };
  }

  _initCanvas() {
    this.context = this.canvas.getContext("2d");
    this.parentElement = this.canvas.parentElement;
    this.canvas.width = this.parentElement.clientWidth * 2;
    this.canvas.height = this.parentElement.clientHeight * 2;
    this.imgScale = 1; //放大系数
    this.offsetImageX = 0;
    this.offsetImageY = 0;
    this.finger = false; //触摸手指的状态 false：单手指 true：多手指

    this.rectHeight = Math.round(this.canvas.width * this.boundRate); //剪切框高度
    this.rectWidth = this.canvas.width; //剪切框宽度
    this.rectStartY = Math.round((this.canvas.height - this.rectHeight) / 2); //剪切框起始点Y坐标
    this.isDrawing = false;

    this.canvas.addEventListener("touchstart", this._onTouchStart, false);
    this.canvas.addEventListener("touchmove", this._onTouchMove, false);
    this.canvas.addEventListener("touchend", this._onTouchEnd, false);
    this._drawImage(true);
  }

  _drawImage(init) {
    this.imageObject = new Image();
    this.imageObject.src = this.dataSource[this.state.clickedIndex].url;
    this.imageObject.onload = () => {
      this._doDraw(init)
    }
  }
  _doDraw(init) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.globalAlpha = 1;
    if (init) {
      this.orgImageWidth = this.imageObject.width;
      this.orgImageHeight = this.imageObject.height;

      this.imgScale = 1;
      this.nowImageWidth = this.canvas.width * this.imgScale;
      this.nowImageHeight = this.orgImageHeight * this.imgScale;
      if (this.nowImageHeight < this.rectHeight) {
        this.nowImageHeight = this.rectHeight;
        this.offsetImageY = this.rectStartY;
      } else if (this.nowImageHeight < this.rectHeight * 2) {
        this.offsetImageY = this.rectStartY - (this.nowImageHeight - this.rectHeight) / 2;
      }
    }

    this.context.drawImage(
      this.imageObject,
      0,
      0,
      this.orgImageWidth,
      this.orgImageHeight,
      this.offsetImageX,
      this.offsetImageY,
      this.nowImageWidth,
      this.nowImageHeight
    );
    this._drawRect();
  }
  //剪切框
  _drawRect() {
    this.context.lineWidth = 5;//剪切框线条宽度
    this.context.strokeStyle = "#fff";
    this.context.strokeRect(
      0,
      this.rectStartY,
      this.rectWidth,
      this.rectHeight
    );
    this._drawModal();

  }

  //画阴影
  _drawModal() {
    this.context.fillStyle = "#000";
    this.context.globalAlpha = 0.5;

    //顶部阴影
    this.context.fillRect(this.offsetImageX,
      this.offsetImageY, this.canvas.width - this.offsetImageX, this.rectStartY - this.offsetImageY);

    //底部阴影
    this.context.fillRect(this.offsetImageX,
      this.rectStartY + this.rectHeight, this.canvas.width - this.offsetImageX, this.rectStartY + this.rectHeight - this.offsetImageY);
  }

  _onTouchStart(event) {
    event.preventDefault();
    if (event.targetTouches.length === 1) {
      this.finger = false;
      this.startPosition = this._windowToCanvas(
        event.targetTouches[0].clientX,
        event.targetTouches[0].clientY
      );
    } else if (event.targetTouches.length >= 2) {
      this.finger = true;
      this.startFingerDist = this._getC(event.targetTouches);
    }
  }

  _onTouchMove(event) {
    event.preventDefault();
    if (!this.finger) {
      this._move(event);
    } else if (event.targetTouches.length >= 2) {
      this._zoom(event);
    }
  }

  _onTouchEnd(event) {
    event.preventDefault();
    if (this.finger) {
      // this._setImageZoom();
      this._zoom(event);
    } else {
      this._move(event);
      // this._dealImagebound();
      // this._drawImage(false);
    }

  }

  //移动
  _move(event) {
    let touches = event.changedTouches || event.targetTouches;
    let endPosition = this._windowToCanvas(
      touches[0].clientX,
      touches[0].clientY
    );
    let lastTime = this._lastTime || 0;
    let now = Date.now();

    let x = endPosition.x - this.startPosition.x;
    let y = endPosition.y - this.startPosition.y;

    if (now - lastTime < TIME_INTERVAL) {
      return;
    }
    this._lastTime = now;
    this.offsetImageX += x;
    this.offsetImageY += y;
    //this.startPosition = endPosition;


    this._dealImagebound();
    this._drawImage(false);
  }

  //缩放
  _zoom(event) {
    this.nowFingerDist = this._getC(event.targetTouches);
    let zoom = this.nowFingerDist / this.startFingerDist;
    this.imgScale *= zoom;
    this.finger = true;

    let lastTime = this._lastTime || 0;
    let now = Date.now();

    if (now - lastTime < TIME_INTERVAL) {
      return;
    }
    this._lastTime = now;
    this._setImageZoom();

    this._dealImagebound();
    this._drawImage(false);

  }

  //设置图片高宽
  _setImageZoom() {
    this.nowImageWidth = Math.round(this.canvas.width * this.imgScale);
    this.nowImageHeight = Math.round(this.orgImageHeight * this.imgScale);

    //最大放大倍数
    if (this.imgScale > 4) {
      this.imgScale = 4;
      this.nowImageWidth = this.canvas.width * this.imgScale;
      this.nowImageHeight = this.orgImageHeight * this.imgScale;
    } else if (this.nowImageHeight < this.rectHeight) {
      //最小放大倍数
      this.nowImageHeight = this.rectHeight;
      this.nowImageWidth = this.canvas.width;
      this.offsetImageX = 0;
      this.offsetImageY = this.rectStartY;
    }
    else if (this.imgScale < 1) {
      this.nowImageWidth = this.canvas.width;
      if (this.imgScale < 0.5) {
        this.nowImageHeight = this.rectHeight * 2;
      }
    }
  }

  //滑动时图片边界
  _dealImagebound() {
    //顶部边界
    this.offsetImageY =
      this.offsetImageY > this.rectStartY ? this.rectStartY : this.offsetImageY;
    let offsetY = this.nowImageHeight - this.rectStartY - this.rectHeight;
    //底部边界
    if (offsetY < 0 && Math.abs(offsetY) > this.offsetImageY) {
      this.offsetImageY = Math.abs(offsetY);
    } else if (this.offsetImageY < 0) {
      if (Math.abs(this.offsetImageY) >= offsetY) {
        this.offsetImageY = -Math.round(offsetY);
      }
    }

    //左边边界
    this.offsetImageX = this.offsetImageX > 0 ? 0 : this.offsetImageX;
    //右边边界
    if (this.offsetImageX < 0) {
      let offsetX = this.nowImageWidth - this.rectWidth;
      if (Math.abs(this.offsetImageX) > offsetX) {
        this.offsetImageX = -Math.round(offsetX);
      }
    }
  }

  //clien坐标点转换成canvas
  _windowToCanvas(x, y) {
    var bbox = this.canvas.getBoundingClientRect();
    return {
      x: Math.round((x - bbox.left) * (this.canvas.width / bbox.width)),
      y: Math.round((y - bbox.top) * (this.canvas.height / bbox.height))
    };
  }

  //获取三角形边长
  _getC(touchs) {
    this.finger = true;
    let x1 = this._windowToCanvas(touchs[0].clientX, touchs[0].clientY).x;
    let y1 = this._windowToCanvas(touchs[0].clientX, touchs[0].clientY).y;

    let x2 = this._windowToCanvas(touchs[1].clientX, touchs[1].clientY).x;
    let y2 = this._windowToCanvas(touchs[1].clientX, touchs[1].clientY).y;

    let a = x1 - x2;
    let b = y1 - y2;

    return Math.round(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
  }

  _onClick(e, type, index) {
    if (type === "submit") {
      let data = this._submitData();
    } else if (type === "image_click") {
      this.setState({ clickedIndex: index });
    } else if (type === "image_selected") {
      if (this.state.selectList[index]) {
        let list = this.state.selectList;
        list[index] = false;
        this.setState({ selectList: list, selectedNum: --this.state.selectedNum });
      } else {
        let num = 0;
        this.dataSource.forEach((item, index) => {
          if (this.state.selectList[index]) {
            num++;
          }
        });

        if (num >= this.displayNum) {
          this.props.getScreen.alert({
            message: "你本次最多只能选择" + this.displayNum + "张照片",
            buttons: [
              {
                text: "我知道了"
              }
            ]
          });
        } else {
          let list = this.state.selectList;
          list[index] = true;
          this.setState({ selectList: list, selectedNum: ++this.state.selectedNum });
        }
      }
    }
  }

  _submitData() {
    let context = this.newCanvas.getContext('2d');
    this.newCanvas.width = this.rectWidth - 2 * this.context.lineWidth;
    this.newCanvas.height = this.rectHeight - 2 * this.context.lineWidth;
    if (this.multiple) {
      this._bulkImage(context);
    } else {
      let data = this._getBase64(context, this.dataSource[this.state.clickedIndex].type);
      this.props.getData && this.props.getData({ url: data, name: this.dataSource[this.state.clickedIndex].name }, this.props.source);
    }
  }

  //从新的canvas获取图片base64
  _getBase64(context, type) {
    let imgData = this.context.getImageData(
      0 + this.context.lineWidth,
      this.rectStartY + this.context.lineWidth,
      this.rectWidth - 2 * this.context.lineWidth,
      this.rectHeight - 2 * this.context.lineWidth
    );
    context.putImageData(imgData, 0, 0);
    return this.newCanvas.toDataURL(type);
  }

  //处理没有使用canvas画的图片
  async _bulkImage(context) {
    this.context.globalAlpha = 1;
    let img = new Image();
    let list = [];
    let index = 0;
    let selectedImage = "";
    if (this.state.selectList[this.state.clickedIndex]) {
      selectedImage = this._getBase64(context, this.dataSource[this.state.clickedIndex].type);//选中的图片先处理
    }
    for (let item of this.dataSource) {
      if (this.state.selectList[index] && index !== this.state.clickedIndex) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        img.src = item.url;
        let data = await new Promise((resolve, reject) => {
          img.onload = () => {
            let offsetImageY = 0;
            let orgImageWidth = img.width;
            let orgImageHeight = img.height;

            let nowImageWidth = this.canvas.width;
            let nowImageHeight = orgImageHeight;
            if (nowImageHeight < this.rectHeight) {
              nowImageHeight = this.rectHeight;
              offsetImageY = this.rectStartY;
            } else if (nowImageHeight < this.rectHeight * 2) {
              offsetImageY = this.rectStartY - (nowImageHeight - this.rectHeight) / 2;
            }

            this.context.drawImage(
              img,
              0,
              0,
              orgImageWidth,
              orgImageHeight,
              0,
              offsetImageY,
              nowImageWidth,
              nowImageHeight
            );

            // this.context.drawImage(
            //   img, 0, 0,
            //   img.width,
            //   img.height,
            //   0,
            //   0,
            //   this.canvas.width,
            //   img.height
            // );
            this._drawRect();
            resolve(this._getBase64(context, item.type));
          }
        });
        list.push({ url: data, name: item.name });
      }
      index++;
    }
    selectedImage && list.push({ url: selectedImage, name: this.dataSource[this.state.clickedIndex].name });
    this.props.getData && this.props.getData(list, this.props.source);
  }

  render() {
    return (
      <div className="clip-container" onClick={(e) => { e.stopPropagation() }}>
        <div className="clip-image" style={{ height: this.multiple ? '83%' : '93%' }}>
          <canvas ref={name => (this.canvas = name)} style={{ zoom: 0.5 }} />
        </div>
        {this.multiple && (
          <ul className="image-thumb">
            {this.dataSource.map((item, index) => {
              return (
                <li key={index} className={this.state.selectList[index] ? "check_true" : "check_false"}>
                  <i onClick={(e) => { this._onClick(e, "image_selected", index) }}></i>
                  <img 
                    ref={'IMAGES_'+index}
                    src={item.url} onClick={(e) => { this._onClick(e, "image_click", index) }} style={this.state.clickedIndex == index ? { border: '.1rem solid #ff912b' } : { border: 'unset' }} />
                </li>
              )
            })}
          </ul>
        )}
        <div className="clip-bottom">
          {this.multiple && <span>已选择({this.state.selectedNum}/{this.displayNum})</span>}
          <button onClick={(e) => { this._onClick(e, "submit") }}>上传{this.state.selectedNum <= 1?"":`(${this.state.selectedNum})`}</button>
        </div>
        <canvas ref={name => (this.newCanvas = name)} style={{ display: 'none', zoom: 0.5 }} />;
      </div>
    );
  }
}

export default ClipImage;
