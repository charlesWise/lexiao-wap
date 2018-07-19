"use strict";
import React, { Component } from "react";
import ScreenComponent from "./../../../components/ScreenComponent";
import Essential from "./Essential";
import index from "./../../../components/ScreenComponent";
import Picker from "./../../../components/Picker";
import AreaPicker from "./../../../components/AreaPicker";
import api from "./../../../../controllers/api";

const LOGO_PIC = "/images/business/logo-pic.png";
const CARD_PIC = "/images/business/idcard-pic.png";
const PERSON_PIC = "/images/business/idcard-pic.png";
const IMAGE_PIC = "/images/business/pub-pic.png";
const TEXT_NUM = 150;

//商户状态 1：草稿，2：待BD确认(自主申请)，3：待商户确认(商户确认)，4：商户拒绝确认(商户确认)，5:待平台审核(平台审核),6:审核成功(服务中),7:审核驳回(平台审核)

export default class Modify extends ScreenComponent {
    static pageConfig = {
        path: "/merchant/modify",
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
            isScrollBottom: false,
            isScroll: false,
            merchant: {},
            cascaderData: [],
            textNum: TEXT_NUM, //字数
            assortList: [], //所属分类
            rewardList: [] //奖励类型
        };
    }

    componentWillMount() {
        let { state } = this.props.navigation;
        let merchant_id = state.params.merchant_id;
        this._fetchData(merchant_id)
    }

    _fetchData(merchant_id) {
        api.merchantInfo({ merchant_id }).success((content) => {
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
            let textNum = this.state.textNum;
            if (merchant.introduction) {
                textNum = textNum - merchant.introduction.length;
            }

            this.setState({
                merchant,
                textNum,
            });
        }).error((content) => {
            this.getScreen().toast(content.message, 3000);
        })

        api.getCategory({}).success((content) => {
            console.log(content.data);
            this.setState({ assortList: content.data.list });
        }).error((content) => {
            this.getScreen().toast(content.message, 3000);
        })
    }

    _onClick(type, index) {
        if (type === "select_regist") {
            let regist = ReactDOM.findDOMNode(this.refs.regist);
            regist.scrollIntoView();
        } else if (type === "select_reward") {
            let reward = ReactDOM.findDOMNode(this.refs.reward);
            reward.scrollIntoView();
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
        } else if (type === "submit_audit") {
            this._submitData("audit");
        }
    }

    _onChange(e, type, index) {
        if (type === "input_image_logo") {
            this._setImage(e.target, "logo");
        } else if (type === "input_merchant_name") {
            this._setState({ merchant_name: e.target.value });
            console.log(e.target.value);
        } else if (type === "input_tel") {
            this._setState({ tel: e.target.value });
            console.log(e.target.value);
        } else if (type === "input_address") {
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
            if (e.target.files.length > 0) {
                let images = this.state.merchant.images || [];
                let reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = function (event) {
                    images.push({ url: event.target.result });
                    this.refs.essential.refs.input_image_images.value = "";
                    this._setState({ images: images });
                }.bind(this);

                let data = new FormData();
                data.append("is_thumb", e.target.files[0]);
                api.uploadImg(data).success((content, next, abort) => {
                    images[images.length - 1].id = content.attach.id;
                    this._setState({ images: images });
                }).error((content) => {
                    images.pop();
                    this._setState({ images: images });
                    this.getScreen().toast(content.message, 3000);
                })
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

    _setImage(target, state) {
        let reader = new FileReader();
        reader.readAsDataURL(target.files[0]);
        reader.onload = function (e) {
            target.value = "";
            this._setState({ [state]: { url: e.target.result } });
        }.bind(this);

        this._uploadImg(target.files[0], state);
    }

    _uploadImg(file, state) {
        let data = new FormData();
        data.append("is_thumb", file);
        api.uploadImg(data).success((content) => {
            let imageData = this.state.merchant[state];
            imageData.id = content.attach.id;
            this._setState({ [state]: imageData });
        }).error((content) => {
            this._setState({ [state]: {} });
            this.getScreen().toast(content.message, 3000);
        })
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
        
        delete merchant.images;
        delete merchant.reward;
        delete merchant.reward_config;
        console.log(merchant);

        if ( this._judgeData(merchant) ) {
            api
                .editBaseInfo({ ...merchant })
                .success((content, next, abort) => {
                    this.getScreen().alert({
                        message: "信息变更申请已提交，等待平台审核",
                        buttons: [
                            {
                                text: "确定",
                                onPress: () => {
                                    let navigation = this.getScreen().getNavigation();
                                    navigation.navigate('MyMerchant');
                                }
                            }
                        ]
                    });
                }).error((content)=>{
                    this.getScreen().toast(content.message, 3000);                    
                })
        }
    }

    _judgeData(data) {
        if (!data.logo) {
            this.getScreen().toast("请选择商户logo", 2800);
            return false;
        } else if (!data.merchant_name) {
            this.getScreen().toast("请输入商户名", 2800);
            return false;
        } else if (!data.tel) {
            this.getScreen().toast("请输入商户电话", 2800);
            return false;
        } else if (
            data.tel.indexOf("-") != -1 &&
            !/^0\d{2}-\d{8}$/.test(data.tel) &&
            !/^0\d{3}-\d{7}$/.test(data.tel)
        ) {
            this.getScreen().toast("商户电话格式有误,请核实", 2800);
            return false;
        } else if (
            data.tel.indexOf("-") === -1 &&
            !/^[1|0]\d{10}$/.test(data.tel)
        ) {
            this.getScreen().toast("商户电话格式有误,请核实", 2800);
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

    render() {
        return (
            <div ref={ref => (this.container = ref)}>
                <div className="-m-add">
                    <div className="tab-panel">
                        {/* 基本信息 */}
                        <Essential
                            ref="essential"
                            dataSource={this.state.merchant}
                            logoPic={LOGO_PIC}
                            onClick={(type, data) => this._onClick(type, data)}
                            onChange={(e, type) => {
                                this._onChange(e, type);
                            }}
                            textNum={this.state.textNum}
                            imagePic={IMAGE_PIC}
                        />
                    </div>
                    <div className="add-btn">
                        <a
                            className="add-btn-fl"
                            onClick={() => {
                                this.getScreen().alert({
                                    message: "修改的商户信息还未提交，确认离开？",
                                    buttons: [
                                        { text: "取消" },
                                        {
                                            text: "确定",
                                            onPress: () => {
                                                this.getScreen().getNavigation().goBack();
                                            }
                                        }
                                    ]
                                });
                            }}
                        >
                            取消
                        </a>
                        <a
                            className="add-btn-fr"
                            onClick={() => this._onClick("submit_audit")}
                        >
                            提交审核
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

