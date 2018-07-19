"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import Essential from "./Essential";
import Regist from "./Regist";
import Admission from "./Admission";
import index from "./../../../components/ScreenComponent";
import Picker from "./../../../components/Picker";
import AreaPicker from "./../../../components/AreaPicker";
import api from "./../../../../controllers/api";
import AREACODE from './../../../../constants/AREA_CODE';
import { StoreManager } from 'mlux';
import ClipImage from "./../../../components/ClipImage";
var EXIF = require('../../../../util/Exif');
let Orientation = null;

const LOGO_PIC = "/images/business/logo-pic.png";
const CARD_PIC = "/images/business/idcard-pic.png";
const PERSON_PIC = "/images/business/idcard-pic.png";
const IMAGE_PIC = "/images/business/pub-pic.png";
const TEXT_NUM = 150;

//商户状态 1：草稿，2：待BD确认(自主申请)，3：待商户确认(商户确认)，4：商户拒绝确认(商户确认)，5:待平台审核(平台审核),6:审核成功(服务中),7:审核驳回(平台审核)

class BusinessModify extends ScreenComponent {
  static pageConfig = {
    path: "/business/modify",
    permission: true
  };
  constructor(...props) {
    super(...props);
    this.navigationOptions = {
      title: "商户信息",
      onBack: navigation => {
        this.getScreen().alert({
          message: "修改的商户信息还未提交，确认离开？",
          buttons: [
            { text: "取消" },
            {
              text: "确定",
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        });
      }
    };
    this.state = {
      merchant: {},
      cascaderData: [],
      textNum: TEXT_NUM, //字数
      assortList: [], //所属分类
      rewardList: [], //奖励类型
      selectType: 0, //0 基本信息,1 注册信息, 2奖励设置,
      areaCode: ''
    };
    this._onScroll = this._onScroll.bind(this);
  }

  componentDidMount() {
    this._fetchData();
    this.container.addEventListener("scroll", this._onScroll, false);
  }

  componentWillUnmount() {
    this.container.removeEventListener("scroll", this._onScroll, false);
  }
  _getCityCode() {
    const locationCity = StoreManager['location'].get('city');
    for (let cityItem of AREACODE.values()) {
      if (cityItem['city'] == locationCity) {
        this._setState({ areaCode: cityItem['code'] })
      }
    }
  }
  _fetchData() {
    const { state } = this.props.navigation;
    let merchant_id = state.params.merchant_id;

    api.merchantInfo({ merchant_id }).success((content, next, abort) => {
      if (content.boolen == 1) {
        let merchant = content.data;
        if (merchant.logo) {
          merchant.logo = JSON.parse(merchant.logo);
        } else {
          merchant.logo = {};
        }
        if (merchant.assort) {
          merchant.assort = JSON.parse(merchant.assort);
        } else {
          merchant.assort = {};
        }
        if (merchant.province) {
          merchant.province = JSON.parse(merchant.province);
        } else {
          merchant.province = {};
        }
        if (merchant.city) {
          merchant.city = JSON.parse(merchant.city);
        } else {
          merchant.city = {};
        }
        if (merchant.area) {
          merchant.area = JSON.parse(merchant.area);
        } else {
          merchant.area = {};
        }
        if (merchant.person_id_img_back) {
          merchant.person_id_img_back = JSON.parse(merchant.person_id_img_back);
        } else {
          merchant.person_id_img_back = {};
        }
        if (merchant.person_id_img_front) {
          merchant.person_id_img_front = JSON.parse(
            merchant.person_id_img_front
          );
        } else {
          merchant.person_id_img_front = {};
        }
        if (merchant.licence_img) {
          merchant.licence_img = JSON.parse(merchant.licence_img);
        } else {
          merchant.licence_img = {};
        }
        if (merchant.card_no) {
          let value = merchant.card_no;
          let array = [];
          for (let i = 0; i < value.length; i++) {
            array.push(value[i]);
            if ((i + 1) % 4 === 0 && i + 1 !== value.length) {
              array.push(" ");
            }
          }
          value = array.join("");
          merchant.card_no = value;
        }
        merchant.images = merchant.images || [];
        let textNum = this.state.textNum;
        if (merchant.introduction) {
          textNum = textNum - merchant.introduction.length;
        }
        let reward_config = [];
        merchant.reward_config &&
          merchant.reward_config.forEach((item, index) => {
            reward_config.push({
              type: item.reward_type,
              name: item.reward_name,
              input: item.reward_standard
            });
          });
        merchant.reward = reward_config;
        api.merchantRewardTemplate({}).success((content, next, abort) => {
          if (content.boolen == 1) {
            let data = content.data;
            data.forEach((item, index) => {
              item.name = item.title;
            });
            let cascaderData = [];
            if (reward_config.length === 0) {
              merchant.reward.push(data[0]);
              cascaderData.push(data);
            } else {
              let reward = reward_config;
              let diff = this._arrayDiff(data, reward, "name");
              reward.map((item, index) => {
                let temp_item = [];
                temp_item.push(item);
                temp_item = temp_item.concat(diff);
                cascaderData.push(temp_item);
              });
            }
            this.setState({
              merchant,
              cascaderData,
              textNum,
              rewardList: data
            });
          } else {
            this.getScreen().toast(content.message, 3000);
          }
        });
      } else {
        this.getScreen().toast(content.message, 3000);
      }
    });

    api.getCategory({}).success((content, next, abort) => {
      if (content.boolen == 1) {
        console.log(content.data);
        this.setState({ assortList: content.data.list });
      } else {
        this.getScreen().toast(content.message, 3000);
      }
    });
  }

  _onClick(type, index) {
    if (type === "select_info") {
      if (this.state.selectType !== 0) {
        this.setState({ selectType: 0 });
        this.container.scrollTo(0, 0);
      }
    } else if (type === "select_regist") {
      if (this.state.selectType !== 1) {
        this.setState({ selectType: 1 });
        let regist = ReactDOM.findDOMNode(this.refs.regist);
        regist.scrollIntoView();
      }
    } else if (type === "select_reward") {
      if (this.state.selectType !== 2) {
        this.setState({ selectType: 2 });
        let reward = ReactDOM.findDOMNode(this.refs.reward);
        reward.scrollIntoView();
      }
    } else if (type === "del_input_image_logo") {
      let merchant = { ...this.state.merchant, logo: {} };
      this.setState({ merchant: merchant });
    } else if (type === "del_input_image_images") {
      let merchant = this.state.merchant;
      merchant.images.splice(index, 1);
      this.setState({ merchant: merchant });
    } else if (type === "input_assort") {
      this._showPicker("assort");
    } else if (type === "input_area") {
      this._showAreaPicker();
    } else if (type === "button_cancel") {
      this.getScreen().alert({
        message: "修改的商户信息还未提交，确认离开？",
        buttons: [
          { text: "取消" },
          {
            text: "确定",
            onPress: () => {
              this.props.navigation.goBack();
            }
          }
        ]
      });
    } else if (type === "button_submit") {
      this._submitData("modify");
    } else if (type === "del_input_image_person_front") {
      let merchant = { ...this.state.merchant, person_id_img_front: {} };
      this.setState({ merchant: merchant });
    } else if (type === "del_input_image_person_back") {
      let merchant = { ...this.state.merchant, person_id_img_back: {} };
      this.setState({ merchant: merchant });
    } else if (type === "del_input_image_licence") {
      let merchant = { ...this.state.merchant, licence_img: {} };
      this.setState({ merchant: merchant });
    } else if (type === "reward_add") {
      let cascaderData = this.state.cascaderData;
      let merchant = this.state.merchant;
      let reward = merchant.reward;
      let diff = this._arrayDiff(this.state.rewardList, reward, "name");
      diff[0].input = "";
      let temp = [];
      cascaderData.forEach((item, index) => {
        let tempArray = item;
        tempArray = this._arrayDiff(tempArray, [].concat(diff[0]), "name");
        temp.push(tempArray);
      });

      temp.push(diff);
      reward.push(diff[0]);
      this.setState({
        cascaderData: temp,
        merchant: merchant
      });
    } else if (type === "reward_delete") {
      let cascaderData = this.state.cascaderData;
      let merchant = this.state.merchant;
      let reward = merchant.reward;

      let temp = [];
      cascaderData.splice(index, 1);
      cascaderData.forEach((item, sindex) => {
        temp.push(item.concat(reward[index]));
      });
      reward.splice(index, 1);
      this.setState({
        cascaderData: temp,
        merchant: merchant
      });
    } else if (type === "click_reward") {
      this._showPicker("reward", index);
    } else if (type === "input_open_card") {
      this.props.navigation.navigate("OpenCard", {
        callback: data => {
          console.log("open_card------->", data);
          let open_name = [];
          data &&
            data.open_card &&
            data.open_card.forEach((item, index) => {
              if (index === 0) {
                item.province_name = item.name;
                open_name.push(item);
              } else if (index === 1) {
                item.city_name = item.name;
                open_name.push(item);
              } else if (index === 3) {
                item.sub_bank_name = item.bank_name;
                item.code = item.bank_no;
                open_name.push(item);
              }
            });
          this._setState({ open_name: open_name });
        }
      });
    } else if (type === "submit_draft") {
      this._submitData("draft");
    } else if (type === "submit_audit") {
      this._submitData("audit");
    }
  }

  _onChange(e, type, index) {
    if (type === "input_image_logo") {
      //this._setImage(e.target, "logo");
      if (e.target.files.length > 0) {
        let file = e.target.files[0];
        EXIF.getData(file, function () {
          Orientation = EXIF.getTag(file, 'Orientation');
        });
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          var img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            var base64 = null;
            var width = img.naturalWidth;
            var height = img.naturalHeight;
            if (Orientation != "" && Orientation != 1 && Orientation != undefined) {
              switch (Orientation) {
                case 6://需要顺时针90度旋转
                  canvas.width = height;
                  canvas.height = width;
                  ctx.rotate(90 * Math.PI / 180);
                  ctx.drawImage(img, 0, -height);
                  break;
                case 8://需要逆时针90度旋转
                  canvas.width = height;
                  canvas.height = width;
                  ctx.rotate(-90 * Math.PI / 180);
                  ctx.drawImage(this, -width, 0);
                  break;
                case 3://需要180度旋转
                  ctx.rotate(180 * Math.PI / 180);
                  ctx.drawImage(this, -width, -height);
                  break;
              }
            }
            base64 = canvas.toDataURL(file.type);
            let data = { url: base64, type: file.type, name: file.name };
            let PICKER_ID = this.getScreen().showPopup({
              content: (
                <ClipImage
                  source="logo"
                  multiple={false}
                  dataSource={[data]}
                  getData={(list, source) => { this.getScreen().hidePopup(PICKER_ID); this._getData(list, source) }}
                />
              )
            });
          }
        }
      }
    } else if (type === "input_merchant_name") {
      this._setState({ merchant_name: e.target.value });
      console.log(e.target.value);
    } else if (type === "input_tel") {
      let value = e.target.value;
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
      this._setState({ tel: value });
    }
    else if (type === "area_code") {
      let areaCode = e.target.value;
      if (this.refs.essential && this.refs.essential.seatNumberInput) {
        this._setState({ tel: `${areaCode}-${this.refs.essential.seatNumberInput.value}` });
      }
      if (areaCode && areaCode.length >= 4) {
        this.refs.essential.seatNumberInput && this.refs.essential.seatNumberInput.focus();
      }
    } else if (type === "seat_number") {
      let seatNumber = e.target.value;
      if (seatNumber.length > 8) {
        seatNumber = seatNumber.slice(0, 8);
      }
      if (this.refs.essential && this.refs.essential.areaCodeInput) {
        this._setState({ tel: `${this.refs.essential.areaCodeInput.value}-${seatNumber}` });
      }
    }
    else if (type === "input_address") {
      this._setState({ address: e.target.value });
      console.log(e.target.value);
    } else if (type === "input_shop_area") {
      this._setState({ shop_area: e.target.value });
      console.log(e.target.value);
    } else if (type === "input_staff_num") {
      this._setState({ staff_num: e.target.value });
      console.log(e.target.value);
    } else if (type === "input_introduction") {
      let value = e.target.value;
      let merchant = this.state.merchant;
      merchant.introduction = value;
      if (value) {
        if (value.length > TEXT_NUM) {
          merchant.introduction = value.slice(0, TEXT_NUM);
          this.setState({ merchant: merchant });
        } else {
          this.setState({
            textNum: TEXT_NUM - value.length,
            merchant: merchant
          });
        }
      } else {
        this.setState({ textNum: TEXT_NUM, merchant: merchant });
      }
      console.log(value);
    } else if (type === "input_image_images") {
      // if (e.target.files.length > 0) {
      //   let images = this.state.merchant.images || [];
      //   let reader = new FileReader();
      //   reader.readAsDataURL(e.target.files[0]);
      //   reader.onload = function(event) {
      //     images.push({ url: event.target.result });
      //     this.refs.essential.refs.input_image_images.value = "";
      //     this._setState({ images: images });
      //   }.bind(this);

      //   let data = new FormData();
      //   data.append("is_thumb", e.target.files[0]);
      //   api
      //     .uploadImg(data)
      //     .success((content, next, abort) => {
      //       if (content.boolen == 1) {
      //         images[images.length - 1].id = content.attach.id;
      //         this._setState({ images: images });
      //       }
      //     })
      //     .error((content, next, abort) => {
      //       images.pop();
      //       this._setState({ images: images });
      //     });
      // }
      if (e.target.files.length > 0) {
        let files = Array.from(e.target.files);
        let promiseAll = [];
        files.forEach((item, index) => {
          let reader = new FileReader();
          promiseAll[index] = new Promise((resolve, reject) => {
            reader.readAsDataURL(item);
            reader.onload = (event) => {
              var img = new Image();
              img.src = event.target.result;
              img.onload = () => {
                var canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
                var base64 = null;
                var width = img.naturalWidth;
                var height = img.naturalHeight;
                if (Orientation != "" && Orientation != 1 && Orientation != undefined) {
                  switch (Orientation) {
                    case 6://需要顺时针90度旋转
                      canvas.width = height;
                      canvas.height = width;
                      ctx.rotate(90 * Math.PI / 180);
                      ctx.drawImage(img, 0, -height);
                      break;
                    case 8://需要逆时针90度旋转
                      canvas.width = height;
                      canvas.height = width;
                      ctx.rotate(-90 * Math.PI / 180);
                      ctx.drawImage(this, -width, 0);
                      break;
                    case 3://需要180度旋转
                      ctx.rotate(180 * Math.PI / 180);
                      ctx.drawImage(this, -width, -height);
                      break;
                  }
                }
                base64 = canvas.toDataURL(item.type);
                resolve({ url: base64, type: item.type, name: item.name });
              }
            }
          });
        });
        Promise.all(promiseAll).then((list) => {
          this.refs.essential.refs.input_image_images.value = "";
          let PICKER_ID = this.getScreen().showPopup({
            content: (
              <ClipImage
                source="images"
                displayNum={5 - this.state.merchant.images.length}
                multiple={true}
                getScreen={this.getScreen()}
                dataSource={list}
                getData={(list, source) => { this.getScreen().hidePopup(PICKER_ID); this._getData(list, source) }}
              />
            )
          });
        });
      }
    } else if (type === "input_phone") {
      this._setState({ mobile: e.target.value });
      let value = e.target.value;
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
      this._setState({ mobile: value });
      if (value.length === 11) {
        api
          .checkMobileRegister({ mobile: value })
          .success((content, next, abort) => {
            if (content.boolen == 1) {
              if (content.data.is_register == 0) {
                this.getScreen().alert({
                  message: "该手机号还未注册，请注册后再添加",
                  buttons: [{ text: "确认" }]
                });
              }
            }
          });
      }
      console.log(e.target.value);
    } else if (type === "input_person") {
      this._setState({ person: e.target.value });
      console.log(e.target.value);
    } else if (type === "input_person_tel") {
      let value = e.target.value;
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
      this._setState({ person_tel: value });
      console.log(e.target.value);
    } else if (type === "input_name") {
      this._setState({ name: e.target.value });
      console.log(e.target.value);
    } else if (type === "input_card_no") {
      let value = e.target.value;
      value = value.replace(/\s/g, "");
      let array = [];
      for (let i = 0; i < value.length; i++) {
        array.push(value[i]);
        if ((i + 1) % 4 === 0 && i + 1 !== value.length) {
          array.push(" ");
        }
      }
      value = array.join("");
      this._setState({ card_no: value });
      console.log(e.target.value);
    } else if (type === "input_licences") {
      let data = e.target.value.toLocaleUpperCase();
      if (data.length > 18) {
        data = data.slice(0, 18);
      }
      this._setState({ licences: data });
      console.log(e.target.value);
    } else if (type === "input_image_person_front") {
      this._setImage(e.target, "person_id_img_front");
    } else if (type === "input_image_person_back") {
      this._setImage(e.target, "person_id_img_back");
    } else if (type === "input_image_licence") {
      this._setImage(e.target, "licence_img");
    } else if (type === "input_reward") {
      let reward = this.state.merchant.reward;
      let value = e.target.value;
      if (value.indexOf(".") !== -1) {
        let end = value.indexOf(".") + 3;
        value = value.slice(0, end);
      }
      reward[index].input = value;
      this._setState({ reward: reward });
    }
  }

  //获取canvas图片并上传
  _getData(list, source) {
    if (Array.isArray(list)) {//多图片
      let imageList = this.state.merchant.images.concat(list) || [];
      //this._setState({ [source]: imageList });

      list.forEach((item, index) => {
        let data = new FormData();
        var fileBin = this._dataURLtoFile(item.url, item.name);
        data.append("is_thumb", fileBin);
        api
          .uploadImg(data)
          .success((content, next, abort) => {
            if (content.boolen == 1) {
              imageList[imageList.length - list.length + index].id = content.attach.id;
              imageList[imageList.length - list.length + index].url = content.attach.url;
              this._setState({ [source]: imageList });
            }
          })
          .error((content, next, abort) => {
            imageList.splice(imageList.length - list.length + index, 1);
            this._setState({ [source]: imageList });
          });
      });
    } else {
      //this._setState({ [source]: list });
      let data = new FormData();
      var fileBin = this._dataURLtoFile(list.url, list.name);
      data.append("is_thumb", fileBin);
      api
        .uploadImg(data)
        .success((content, next, abort) => {
          if (content.boolen == 1) {
            let imageData = this.state.merchant[source] || {};
            imageData.id = content.attach.id;
            imageData.url = content.attach.url;
            this._setState({ [source]: imageData });
          }
        })
        .error((content, next, abort) => {
          this._setState({ [source]: {} });
        });
    }
  }

  //base64 to file
  _dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  _setImage(target, state) {
    // let reader = new FileReader();
    // reader.readAsDataURL(target.files[0]);
    // reader.onload = function (e) {
    //   target.value = "";
    //   this._setState({ [state]: { url: e.target.result } });
    // }.bind(this);

    this._uploadImg(target.files[0], state);
  }

  _uploadImg(file, state) {
    let data = new FormData();
    data.append("is_thumb", file);
    api
      .uploadImg(data)
      .success((content, next, abort) => {
        if (content.boolen == 1) {
          let imageData = this.state.merchant[state] || {};
          imageData.id = content.attach.id;
          imageData.url = content.attach.url;
          this._setState({ [state]: imageData });
        }
      })
      .error((content, next, abort) => {
        this._setState({ [state]: {} });
      });
  }

  _setState(object) {
    let merchant = this.state.merchant;
    this.setState({ merchant: Object.assign(merchant, object) });
  }

  _submitData(type) {
    let proto = Object.getPrototypeOf(this.state.merchant);
    let merchant = Object.assign({}, Object.create(proto), this.state.merchant);

    merchant.province = merchant.province.code || "";
    merchant.city = merchant.city.code || "";
    merchant.area = merchant.area.code || "";
    merchant.assort = (merchant.assort.name && merchant.assort.id) || "";
    merchant.logo = (merchant.logo.url && merchant.logo.id) || "";
    merchant.card_no = merchant.card_no.replace(/\s/g, "");
    let temp_images = [];
    merchant.images &&
      merchant.images.forEach((item, index) => {
        temp_images.push(item.id);
      });
    merchant.images = temp_images;
    merchant.person_id_img_front =
      (merchant.person_id_img_front.url && merchant.person_id_img_front.id) ||
      "";
    merchant.person_id_img_back =
      (merchant.person_id_img_back.url && merchant.person_id_img_back.id) || "";
    merchant.licence_img =
      (merchant.licence_img.url && merchant.licence_img.id) || "";
    let open_name = [];
    merchant.open_name.forEach((item, index) => {
      open_name.push(item.code);
    });
    merchant.open_name = open_name.join();
    merchant.advertise_images = merchant.images.join();
    let reward_config = [];
    merchant.reward.forEach((item, index) => {
      reward_config.push({
        reward_type: item.type,
        reward_standard: item.input || ""
      });
    });
    merchant.reward_config = JSON.stringify(reward_config);
    delete merchant.images;
    delete merchant.reward;
    console.log(merchant);

    if (
      (type === "audit" || type === "modify") &&
      this._judgeData(type, merchant)
    ) {
      api
        .addMerchant({ ...merchant, saveType: 2 })
        .success((content, next, abort) => {
          if (content.boolen == 1) {
            this.getScreen().alert({
              message:
                type === "modify"
                  ? "信息变更申请已提交，等待平台审核"
                  : "添加申请已提交，等待对方确认",
              buttons: [
                {
                  text: "确定",
                  onPress: () => {
                    this.props.navigation.state.params &&
                      this.props.navigation.state.params.callback &&
                      this.props.navigation.state.params.callback({
                        tab: type === "modify" ? 3 : 2
                      });
                    if (type === "modify") {
                      let routes = this.props.navigation.routerState.routes;
                      let key = routes[routes.length - 2].key;
                      this.props.navigation.goBack(key);
                    } else {
                      this.props.navigation.goBack();
                    }
                  }
                }
              ]
            });
          } else {
            this.getScreen().toast(content.message, 3000);
          }
        });
    } else if (type === "draft" && this._judgeData(type, merchant)) {
      api.addMerchant({ ...merchant }).success((content, next, abort) => {
        if (content.boolen == 1) {
          this.getScreen().toast("已保存", 2800, () => {
            this.props.navigation.goBack();
          });
        } else {
          this.getScreen().toast(content.message, 3000);
        }
      });
    }
  }

  _judgeData(type, data) {
    if (type === "audit") {
      if (!data.logo) {
        this.getScreen().toast("请选择商户logo", 2800);
        return false;
      } else if (!data.merchant_name) {
        this.getScreen().toast("请输入商户名", 2800);
        return false;
      } else if (!data.tel) {
        this.getScreen().toast("请输入客服电话", 2800);
        return false;
      } else if (
        data.tel.indexOf("-") != -1 &&
        !/^0\d{2}-\d{8}$/.test(data.tel) &&
        !/^0\d{3}-(\d{7}|\d{8})$/.test(data.tel)
      ) {
        this.getScreen().toast("客服电话格式有误,请核实", 2800);
        return false;
      } else if (
        data.tel.indexOf("-") === -1 &&
        !/^[1|0]\d{10}$/.test(data.tel)
      ) {
        this.getScreen().toast("客服电话格式有误,请核实", 2800);
        return false;
      } else if (!data.province || !data.city || !data.area) {
        this.getScreen().toast("请选择商户地址", 2800);
        return false;
      } else if (!data.address) {
        this.getScreen().toast("请填写详细地址", 2800);
        return false;
      } else if (!data.assort) {
        this.getScreen().toast("请选择所属分类", 2800);
        return false;
      } else if (!data.shop_area) {
        this.getScreen().toast("请输入商户面积", 2800);
        return false;
      } else if (!data.staff_num) {
        this.getScreen().toast("请输入人数", 2800);
        return false;
      } else if (!/^\d+$/.test(data.staff_num)) {
        this.getScreen().toast("人数格式有误,请核实", 2800);
        return false;
      } else if (!data.advertise_images) {
        this.getScreen().toast("请选择宣传图片", 2800);
        return false;
      } else if (!data.introduction) {
        this.getScreen().toast("请输入商户介绍", 2800);
        return false;
      } else if (!data.mobile) {
        this.getScreen().toast("请输入手机号", 2800);
        return false;
      } else if (!/^1\d{10}$/.test(data.mobile)) {
        this.getScreen().toast("手机号格式有误,请核实", 2800);
        return false;
      } else if (!data.person) {
        this.getScreen().toast("请输入姓名", 2800);
        return false;
      } else if (!data.person_tel) {
        this.getScreen().toast("输入法人手机号", 2800);
        return false;
      } else if (!/^1\d{10}$/.test(data.person_tel)) {
        this.getScreen().toast("法人手机号格式有误,请核实", 2800);
        return false;
      } else if (!data.person_id_img_front) {
        this.getScreen().toast("请选择身份证正面", 2800);
        return false;
      } else if (!data.person_id_img_back) {
        this.getScreen().toast("请选择身份证反面", 2800);
        return false;
      } else if (!data.name) {
        this.getScreen().toast("请输入持卡人姓名", 2800);
        return false;
      } else if (!data.card_no) {
        this.getScreen().toast("请输入银行卡号", 2800);
        return false;
      } else if (!/^\d{1,27}$/.test(data.card_no)) {
        this.getScreen().toast("银行卡号格式有误,请核实", 2800);
        return false;
      } else if (!data.open_name) {
        this.getScreen().toast("请选择开户行", 2800);
        return false;
      } else if (!data.licences) {
        this.getScreen().toast("请输入营业执照", 2800);
        return false;
      } else if (!/([0-9]|[A-Z]){18}$/.test(data.licences)) {
        this.getScreen().toast("营业执照格式有误,请核实", 2800);
        return false;
      } else if (!data.licence_img) {
        this.getScreen().toast("请选择营业执照", 2800);
        return false;
      } else if (data.reward_config) {
        let reward = JSON.parse(data.reward_config);
        let flag1 = true;
        let flag2 = true;
        reward.forEach(item => {
          if (!item.reward_standard) {
            flag1 = false;
          } else if (!/^\d+$|^\d+\.\d{1,2}$/.test(item.reward_standard)) {
            flag2 = false;
          } else if (item.reward_type == 3 && item.reward_standard > 100) {
            flag2 = false;
          }
        });
        if (!flag1) {
          this.getScreen().toast("请输入奖励标准", 2800);
        } else if (!flag2) {
          this.getScreen().toast("奖励标准格式有误,请核实", 2800);
        }
        return flag1 && flag2;
      }
    } else if (type === "draft") {
      let reward = JSON.parse(data.reward_config);
      let flag1 = true;
      let flag2 = true;
      reward.forEach(item => {
        if (!item.reward_standard) {
          flag1 = false;
        } else if (!/^\d+$|^\d+\.\d{1,2}$/.test(item.reward_standard)) {
          flag2 = false;
        } else if (item.reward_type == 3 && item.reward_standard > 100) {
          flag2 = false;
        }
      });
      if (
        !flag1 &&
        !data.logo &&
        !data.merchant_name &&
        !data.tel &&
        !data.province &&
        !data.city &&
        !data.area &&
        !data.address &&
        !data.assort &&
        !data.shop_area &&
        !data.staff_num &&
        !data.advertise_images &&
        !data.introduction &&
        !data.mobile &&
        !data.person &&
        !data.person_tel &&
        !data.person_id_img_front &&
        !data.person_id_img_back &&
        !data.name &&
        !data.card_no &&
        !data.open_name &&
        !data.licences &&
        !data.licence_img
      ) {
        this.getScreen().toast("内容为空，无法保存为草稿", 2800);
        return false;
      } else if (
        data.tel &&
        data.tel.indexOf("-") != -1 &&
        !/^0\d{2}-\d{8}$/.test(data.tel) &&
        !/^0\d{3}-(\d{7}|\d{8})$/.test(data.tel)
      ) {
        this.getScreen().toast("客服电话格式有误,请核实", 2800);
        return false;
      } else if (
        data.tel &&
        data.tel.indexOf("-") === -1 &&
        !/^[1|0]\d{10}$/.test(data.tel)
      ) {
        this.getScreen().toast("客服电话格式有误,请核实", 2800);
        return false;
      } else if (data.mobile && !/^1\d{10}$/.test(data.mobile)) {
        this.getScreen().toast("手机号格式有误,请核实", 2800);
        return false;
      } else if (data.person_tel && !/^1\d{10}$/.test(data.person_tel)) {
        this.getScreen().toast("法人手机号格式有误,请核实", 2800);
        return false;
      } else if (data.card_no && !/^\d{1,27}$/.test(data.card_no)) {
        this.getScreen().toast("银行卡号格式有误,请核实", 2800);
        return false;
      } else if (data.licences && !/([0-9]|[A-Z]){18}$/.test(data.licences)) {
        this.getScreen().toast("营业执照格式有误,请核实", 2800);
        return false;
      }
    } else if (type === "modify") {
      if (!data.logo) {
        this.getScreen().toast("请选择商户logo", 2800);
        return false;
      } else if (!data.merchant_name) {
        this.getScreen().toast("请输入商户名", 2800);
        return false;
      } else if (!data.tel) {
        this.getScreen().toast("请输入客服电话", 2800);
        return false;
      } else if (
        data.tel.indexOf("-") != -1 &&
        !/^0\d{2}-\d{8}$/.test(data.tel) &&
        !/^0\d{3}-(\d{7}|\d{8})$/.test(data.tel)
      ) {
        this.getScreen().toast("客服电话格式有误,请核实", 2800);
        return false;
      } else if (
        data.tel.indexOf("-") === -1 &&
        !/^[1|0]\d{10}$/.test(data.tel)
      ) {
        this.getScreen().toast("客服电话格式有误,请核实", 2800);
        return false;
      } else if (!data.province || !data.city || !data.area) {
        this.getScreen().toast("请选择商户地址", 2800);
        return false;
      } else if (!data.address) {
        this.getScreen().toast("请填写详细地址", 2800);
        return false;
      } else if (!data.assort) {
        this.getScreen().toast("请选择所属分类", 2800);
        return false;
      } else if (!data.shop_area) {
        this.getScreen().toast("请输入商户面积", 2800);
        return false;
      } else if (!data.staff_num) {
        this.getScreen().toast("请输入人数", 2800);
        return false;
      } else if (!/^\d+$/.test(data.staff_num)) {
        this.getScreen().toast("人数格式有误,请核实", 2800);
        return false;
      } else if (!data.advertise_images) {
        this.getScreen().toast("请选择宣传图片", 2800);
        return false;
      } else if (!data.introduction) {
        this.getScreen().toast("请输入商户介绍", 2800);
        return false;
      }
    }
    return true;
  }

  _showPicker(type, index) {
    let dataSource = this.state.assortList;
    let defaultValue = this.state.merchant.assort.id;
    if (type === "reward") {
      dataSource = this.state.cascaderData[index];
      defaultValue = this.state.merchant.reward[index].type;
    }
    let PICKER_ID = this.getScreen().showPopup({
      content: (
        <Picker
          valueName={type === "reward" ? "type" : "id"}
          defaultValue={defaultValue}
          dataSource={dataSource}
          onCancel={() => {
            this.getScreen().hidePopup(PICKER_ID);
          }}
          onSelected={data => {
            this.getScreen().hidePopup(PICKER_ID);
            this._pickerSelected(type, data, index);
          }}
        />
      )
    });
  }

  _pickerSelected(type, data, index) {
    if (type === "assort") {
      let merchant = this.state.merchant;
      merchant.assort = data;
      this.setState({ merchant: merchant });
    } else if (type === "reward") {
      let merchant = this.state.merchant;
      let reward = merchant.reward;
      let temp_select = reward[index];
      reward[index] = data;
      if (temp_select.name !== data.name) {
        reward[index].input = "";
      }

      let temp = [];
      let cascaderData = this.state.cascaderData;
      if (this.state.rewardList.length === cascaderData.length) {
        temp = cascaderData;
      } else {
        let diff = this._arrayDiff(this.state.rewardList, reward, "name");
        cascaderData.forEach((item, index1) => {
          let temp_item = item;
          if (index1 !== index) {
            item.forEach((sitem, index2) => {
              if (sitem.name === data.name) {
                temp_item[index2] = temp_select;
              }
            });
            temp.push(temp_item);
          } else {
            temp.push(item);
          }
        });
      }
      this.setState({
        merchant: merchant,
        cascaderData: temp
      });
    }
  }

  _arrayDiff(arr1, arr2, type) {
    let temp = [];
    let temp_arr1 = arr1;
    if (arr1.length < arr2.length) {
      arr1 = arr2;
      arr2 = temp_arr1;
    }
    for (let i = 0; i < arr1.length; i++) {
      let obj = arr1[i];
      let name = obj[type];
      let isExist = false;
      for (let j = 0; j < arr2.length; j++) {
        let aj = arr2[j];
        let n = aj[type];
        if (n == name) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        temp.push(obj);
      }
    }
    return temp;
  }

  _showAreaPicker() {
    let PICKER_ID = this.getScreen().showPopup({
      content: (
        <AreaPicker
          pcode={this.state.merchant.province.code}
          ccode={this.state.merchant.city.code}
          acode={this.state.merchant.area.code}
          onCancel={() => {
            this.getScreen().hidePopup(PICKER_ID);
          }}
          onSelected={data => {
            this.getScreen().hidePopup(PICKER_ID);
            console.log(data);
            let merchant = this.state.merchant;
            merchant.province = data.province || {};
            merchant.city = data.city || {};
            merchant.area = data.area || {};
            this.setState({ merchant });
          }}
        />
      )
    });
  }

  _onScroll(e) {
    let { state } = this.props.navigation;
    if (state.params.type !== "servicing") {
      let { scrollTop, scrollHeight, offsetHeight } = e.target;
      let offsetTop = ReactDOM.findDOMNode(this.refs.regist).offsetTop;
      if (offsetHeight + scrollTop === scrollHeight) {
        this.state.selectType != 2 && this.setState({ selectType: 2 });
      } else if (scrollTop >= offsetTop) {
        this.state.selectType != 1 && this.setState({ selectType: 1 });
      } else {
        this.state.selectType != 0 && this.setState({ selectType: 0 });
      }
    }
  }

  render() {
    const { state } = this.props.navigation;
    let statusText = "";
    if (this.state.merchant.status == 4) {
      statusText = "已拒绝";
    } else if (this.state.merchant.status == 7) {
      statusText = this.state.merchant.reject_reason;
    }
    return (
      <div>
        {state.params.type !== "servicing" &&
          statusText && (
            <div className="reason-text">
              <p>{statusText}</p>
            </div>
          )}
        {state.params.type !== "servicing" && (
          <div className="-m-add">
            <div
              className="-m-add-tabs -new-add-tabs"
              ref={ref => (this.tabContainer = ref)}
            >
              <ul className="-m-add-nav">
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
                  onClick={() => this._onClick("select_regist")}
                >
                  注册信息
                </li>
                <li
                  className={
                    this.state.selectType === 2
                      ? "tab-nav-item -active"
                      : "tab-nav-item"
                  }
                  onClick={() => this._onClick("select_reward")}
                >
                  入驻奖励
                </li>
              </ul>
            </div>

            <div
              className="tab-panel -new-tab-panel"
              ref={ref => (this.container = ref)}
            >
              {/* 基本信息 */}
              <Essential
                ref="essential"
                dataSource={this.state.merchant}
                logoPic={LOGO_PIC}
                onSetAreaCode={() => this._getCityCode()}
                onClick={(type, data) => this._onClick(type, data)}
                onChange={(e, type) => {
                  this._onChange(e, type);
                }}
                textNum={this.state.textNum}
                imagePic={IMAGE_PIC}
              />
              {/* 注册信息 */}
              <Regist
                ref="regist"
                dataSource={this.state.merchant}
                onChange={(e, type) => {
                  this._onChange(e, type);
                }}
                personPic={PERSON_PIC}
                onClick={(type, data) => this._onClick(type, data)}
              />
              {/* 入驻奖励 */}
              <Admission
                ref="reward"
                onClick={(type, index) => this._onClick(type, index)}
                onChange={(e, type, index) => {
                  this._onChange(e, type, index);
                }}
                dataSource={this.state.merchant}
              />
            </div>
            <div className="add-btn">
              <a
                className="add-btn-fl"
                onClick={() => this._onClick("submit_draft")}
              >
                保存
              </a>
              <a
                className="add-btn-fr"
                onClick={() => this._onClick("submit_audit")}
              >
                提交审核
              </a>
            </div>
          </div>
        )}
        {state.params.type === "servicing" && (
          <div className="-m-add" style={{ position: "relative" }}>
            <div
              className="tab-panel -new-tab-panel"
              style={{ top: "2.25rem", bottom: "3.15rem" }}
              ref={ref => (this.container = ref)}
            >
              {/* 基本信息 */}
              <Essential
                ref="essential"
                dataSource={this.state.merchant}
                logoPic={LOGO_PIC}
                onSetAreaCode={() => this._getCityCode()}
                onClick={(type, data) => this._onClick(type, data)}
                onChange={(e, type) => {
                  this._onChange(e, type);
                }}
                textNum={this.state.textNum}
                imagePic={IMAGE_PIC}
              />
            </div>
            <div className="add-btn" ref={ref => (this.bottomButton = ref)}>
              <a
                className="add-btn-fl"
                onClick={() => this._onClick("button_cancel")}
              >
                取消
              </a>
              <a
                className="add-btn-fr"
                onClick={() => this._onClick("button_submit")}
              >
                提交审核
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default BusinessModify;
