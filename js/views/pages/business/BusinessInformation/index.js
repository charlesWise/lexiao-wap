"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import EssentialInfo from "./EssentialInfo";
import RegistInfo from "./RegistInfo";
import AdmissionAward from "./AdmissionAward";
import api from "./../../../../controllers/api";
import TextareaPopup from "./../../../components/TextareaPopup";
import Swiper from "./../../../components/Swiper";
import ResizeImage from "./../../../components/ResizeImage";

class BannerIndicator extends ScreenComponent {
  constructor(...props) {
    super(...props);
    this.state = {
      page: this.props.initialPage || 0
    }
  }
  onPageSelected(event) {
    this.setState({
      page: event.nativeEvent.position
    })
  }
  render() {
    return (
      <span
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          color: '#fff',
          right: '10px'
        }}>
        <em>{this.state.page + 1}/
              {this.props.count}</em>
        <span style={{ position: 'absolute', right: 0 }} onClick={() => this.props.closeScreen()}>关闭</span>
      </span>
    )
  }
}

class BusinessInformation extends ScreenComponent {
  static pageConfig = {
    path: "/business/information",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "商户信息"
    };
    this.state = {
      selectType: 0, //0 基本信息,1 注册信息, 2奖励设置,
      merchant: {},
      isShowTextPopup: false
    };
  }

  componentWillMount() {
    this._fetchData();
  }

  _fetchData() {
    const { state } = this.props.navigation;
    let merchant_id = state.params.merchant_id;

    api.merchantInfo({ merchant_id }).success((content, next, abort) => {
      if (content.boolen == 1) {
        let data = content.data;
        if (data.logo) {
          data.logo = JSON.parse(data.logo);
        } else {
          data.logo = {};
        }
        if (data.assort) {
          data.assort = JSON.parse(data.assort);
        } else {
          data.assort = {};
        }
        if (data.province) {
          data.province = JSON.parse(data.province);
        } else {
          data.province = {};
        }
        if (data.city) {
          data.city = JSON.parse(data.city);
        } else {
          data.city = {};
        }
        if (data.area) {
          data.area = JSON.parse(data.area);
        } else {
          data.area = {};
        }
        if (data.person_id_img_back) {
          data.person_id_img_back = JSON.parse(data.person_id_img_back);
        } else {
          data.person_id_img_back = {};
        }
        if (data.person_id_img_front) {
          data.person_id_img_front = JSON.parse(data.person_id_img_front);
        } else {
          data.person_id_img_front = {};
        }
        if (data.licence_img) {
          data.licence_img = JSON.parse(data.licence_img);
        } else {
          data.licence_img = {};
        }
        this.setState({ merchant: data });
      }
    });
  }

  _onClick(type) {
    if (type === "select_info") {
      if (this.state.selectType !== 0) {
        this.setState({ selectType: 0 });
      }
    } else if (type === "select_register") {
      if (this.state.selectType !== 1) {
        this.setState({ selectType: 1 });
      }
    } else if (type === "select_reward") {
      if (this.state.selectType !== 2) {
        this.setState({ selectType: 2 });
      }
    } else if (type === "modify_info") {
      const { state } = this.props.navigation;
      let merchant_id = state.params.merchant_id;
      this.props.navigation.navigate("BusinessModify", {
        merchant_id: merchant_id,
        type: "servicing",
        callback: this.props.navigation.state.params.callback
      });
    } else if (type === "audit_reject") {
      this._showTextareaPopup();
    } else if (type === "audit_resolve") {
      this._auditMerchant(1);
    }
  }

  //审核
  _auditMerchant(type, reason) {
    const { state } = this.props.navigation;
    let id = state.params.merchant_id;
    //type:1审核 0拒绝
    if (type == 1) {
      this.getScreen().alert({
        message: "确认该商户通过平台审核？",
        buttons: [
          { text: "取消" },
          {
            text: "确定",
            onPress: () => {
              api
                .checkMerchant({ id, type })
                .success((content, next, abort) => {
                  state.params &&
                    state.params.callback &&
                    state.params.callback({
                      tab: 3
                    });
                  this.props.navigation.goBack();
                });
            }
          }
        ]
      });
    } else if (type == 0) {
      api
        .checkMerchant({ id, type, reason })
        .success((content, next, abort) => {
          state.params &&
            state.params.callback &&
            state.params.callback({
              tab: 3
            });
          this.props.navigation.goBack();
        });
    }
  }

  _showTextareaPopup() {
    let popup = this.getScreen().showPopup({
      content: (
        <TextareaPopup
          placeholder="请输入驳回理由"
          onSubmit={data => {
            this.getScreen().hidePopup(popup);
            if (data) {
              this._auditMerchant(0, data);
            } else {
              this.getScreen().toast("请输入驳回理由", 2800);
            }
          }}
        />
      )
    });
  }

  _onImageSelected = (e) => {
    ResizeImage.reset();
  }

  _showBigPic(key, bigUrl, currentIndex, totalIndex) {
    let screen = this.getScreen();
    this._imagePopupid = screen.showPopup({
      backgroundColor:'rgba(0, 0, 0, 0.8)',
      content: <Swiper
        autoPlay={false}
        style={{
          height: '100%',
          width: '100%'
        }}
        indicator={BannerIndicator}
        closeScreen={() => this._hideBigPic()}
        onPageSelected={this._onImageSelected}
        initialPage={currentIndex}
        loop={true}>
        {
          this._renderImages(key)
        }
      </Swiper>
    })
  }

  _hideBigPic() {
    let screen = this.getScreen();
    screen.hidePopup(this._imagePopupid);
  }

  _renderImages(key) {
    let data = this.state.merchant;
    let images = [];

    if (key === "logo") {
      images.push(data[key]);
    } else if (key === "images") {
      images = data[key];
    } else if(key === "person_id_img_front") {
      let person_id_imgs = [data[key], data['person_id_img_back']];
      images = person_id_imgs;
    } else if(key === "person_id_img_back") {
      let person_id_imgs = [data[key], data['person_id_img_front']];
      images = person_id_imgs;
    } else if(key === "licence_img") {
      images.push(data[key]);
    } else if(key === "qrcode") {
      images.push({url: data[key]});
    }
    if (!data || images.length == 0) {
      return null;
    }
    return images.map((item, index) => {
      return (
        <ResizeImage ref={(v) => this['image' + index] = v} src={item.url} key={index} />
      );
    })
  }

  render() {
    const { state } = this.props.navigation;
    return (
      <div className="">
        <div className="tabs">
          <ul className="tab-nav" style={{ position: 'fixed', top: '2.25rem', width: '100%' }}>
            <li
              className={
                this.state.selectType === 0
                  ? "tab-nav-item -active"
                  : "tab-nav-item"
              }
              onClick={() => this._onClick("select_info")}
            >
              基本信息
            </li>
            <li
              className={
                this.state.selectType === 1
                  ? "tab-nav-item -active"
                  : "tab-nav-item"
              }
              onClick={() => this._onClick("select_register")}
            >
              注册信息
            </li>
            {state.params.type !== "servicing" && (
              <li
                className={
                  this.state.selectType === 2
                    ? "tab-nav-item -active"
                    : "tab-nav-item"
                }
                onClick={() => this._onClick("select_reward")}
              >
                奖励设置
              </li>
            )}
          </ul>
          <div className="tab-panel" style={{ position: 'fixed', top: '5.2rem', width: '100%', overflow: 'auto', bottom: 0 }}>
            {/* 基本信息 */}
            {this.state.selectType === 0 && (
              <EssentialInfo
                onClick={type => this._onClick(type)}
                dataSource={this.state.merchant}
                type={state.params.type || ""}
                showBigPic={(key, bigUrl, currentIndex, totalIndex) => this._showBigPic(key, bigUrl, currentIndex, totalIndex)}
              />
            )}
            {/* 注册信息 */}
            {this.state.selectType === 1 && (
              <RegistInfo
                dataSource={this.state.merchant}
                type={state.params.type || ""}
                showBigPic={(key, bigUrl, currentIndex, totalIndex) => this._showBigPic(key, bigUrl, currentIndex, totalIndex)}
              />
            )}
            {/* 入驻奖励 */}
            {this.state.selectType === 2 && (
              <AdmissionAward dataSource={this.state.merchant} />
            )}
          </div>
          {state.params.type === "audit" && (
            <div className="-m-add">
              <div className="add-btn">
                <a
                  className="add-btn-fl"
                  onClick={() => this._onClick("audit_reject")}
                >
                  审核驳回
                </a>
                <a
                  className="add-btn-fr"
                  onClick={() => this._onClick("audit_resolve")}
                >
                  审核通过
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default BusinessInformation;
