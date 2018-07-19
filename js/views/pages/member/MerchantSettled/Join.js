'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import Popup from './../../../components/Popup';
import AreaPicker from './../../../components/AreaPicker';
import AREACODE from './../../../../constants/AREA_CODE';
import { StoreManager } from 'mlux';

var PICKER_ID;
let areaCode = "";

export default class MerchantJoin extends ScreenComponent {
    static pageConfig = {
        path: '/member/merchantsettled/join',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '入驻申请',
            onBack: navigation => {
                this.getScreen().alert({
                    message: "您的入驻申请还未提交，确认离开？",
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
        }
        this.state = {
            provice: '',
            city: '',
            area: '',
            provice_id: '',
            city_id: '',
            area_id: '',
            text_num: 150,
            switchTel: false,
            areaCode: '',
            seatNumber: '',
            tel: '',
            licences: ''
        }
        this.hasAreaCode = false;
    }

    componentDidMount() {
        this._getCityCode();
    }

    _getCityCode() {
        let location = StoreManager['location'];
        let city = location.get("city");
        for (let cityItem of AREACODE.values()) {
            if (cityItem['city'] == city) {
                areaCode = cityItem['code'];
                this.hasAreaCode = true;
                this.setState({ areaCode: cityItem['code'] })
            }
        }
    }

    _doApply = () => {
        this._isEnable();
        if (!this.state.isEnable) return;
        let params = {
            merchant_name: this.refs.mname.value,
            licences: this.refs.licences.value,
            person: this.refs.person.value,
            tel: this.state.tel,
            address: this.refs.address.value,
            introduction: this.refs.introduction.value,
            provice: this.state.provice || '',
            city: this.state.city || '',
            area: this.state.area || '',
            provice_id: this.state.provice_id || '',
            city_id: this.state.city_id || '',
            area_id: this.state.area_id || '',
        }
        if (!/([0-9]|[A-Z]){18}$/.test(params.licences)) {
            this.getScreen().toast("营业执照格式有误,请核实", 2800);
            return false;
        }
        if (!params.tel) {
            this.getScreen().toast("请输入客服电话", 2800);
            return false;
        } else if (
            params.tel.indexOf("-") != -1 &&
            !/^0\d{2}-\d{8}$/.test(params.tel) &&
            !/^0\d{3}-\d{7}$/.test(params.tel) &&
            !/^0\d{3}-\d{8}$/.test(params.tel)
        ) {
            this.getScreen().toast("客服电话格式有误,请核实", 2800);
            return false;
        } else if (
            params.tel.indexOf("-") === -1 &&
            !/^[1|0]\d{10}$/.test(params.tel)
        ) {
            this.getScreen().toast("客服电话格式有误,请核实", 2800);
            return false;
        }
        api.Apply(params).success((res) => {
            console.log('onsuccess>>>>', res)
            this.getScreen().alert({
                title: '申请已提交',
                message: "商户入驻申请已提交，商务人员将在两个工作日内与您取得联系！",
                buttons: [
                    {
                        text: "我知道了",
                        onPress: () => {
                            this.getScreen().getNavigation().goBack();
                        }
                    }
                ]
            });
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    contribute() {
        return true;
    }

    _isEnable() {
        if (this.refs.mname.value && this.refs.licences.value && this.refs.person.value && this.state.tel && this.refs.address.value && this.refs.introduction.value
            && this.state.provice && this.state.city && this.state.area && this.state.provice_id && this.state.city_id && this.state.area_id) {
            this.state.isEnable = true;
        } else {
            this.state.isEnable = false;
        }
        this.forceUpdate()
    }

    _showAreaPicker() {
        PICKER_ID = this.getScreen().showPopup({
            content: <AreaPicker
                pid={this.state.provice_id}
                cid={this.state.city_id}
                aid={this.state.area_id}
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this.setState({
                        provice: data.province.name || '',
                        city: data.city.name || '',
                        area: data.area.name || '',
                        provice_id: data.province.code || '',
                        city_id: data.city.code || '',
                        area_id: data.area.code || ''
                    })
                }}
            />
        })
    }

    _onChange(e, type) {
        if (type === "input_tel") {
            let value = e.target.value;
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            this.setState({ tel: value });
        }
        else if (type === "area_code") {
            let areaCode = e.target.value;
            this.setState({ areaCode });
            if (areaCode && areaCode.length >= 4) {
                this.seatNumberInput && this.seatNumberInput.focus();
            }
        } else if (type === "seat_number") {
            let seatNumber = e.target.value;
            if (seatNumber.length > 8) {
                seatNumber = seatNumber.slice(0, 8);
            }
            this.setState({ seatNumber });
            if (this.state.areaCode) {
                this.setState({ tel: `${this.state.areaCode}-${seatNumber}` });
            }
        }
    }

    render() {
        return (
            <div className='merchant-settled'>
                <div className='join-apply'>
                    <h3 className='head'>商户信息<span>（请填写真实信息）</span></h3>
                    <div className='cell body -notborder'>
                        <div className='cell-item'>
                            <div className='-label -required'>商户名</div>
                            <div className='-value'><input ref='mname' type='text' placeholder='输入商户名' onChange={this._isEnable.bind(this)} /></div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label -required'>法人</div>
                            <div className='-value'><input ref='person' type='text' placeholder='输入法人姓名' onChange={this._isEnable.bind(this)} /></div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label -required'>营业执照</div>
                            <div className='-value'>
                                <input ref='licences' type='text' placeholder='输入营业执照编号' onChange={(e) => {
                                    this._isEnable()
                                    let data = e.target.value.toLocaleUpperCase();
                                    if (data.length > 18) {
                                        data = data.slice(0, 18);
                                    }
                                    this.setState({ licences: data });
                                }} value={this.state.licences} />
                            </div>
                        </div>
                        {
                            !this.state.switchNumber && <div className='cell-item'>
                                <div className='-label -required'>客服电话</div>
                                <div className='-value'>
                                    <input
                                        type="tel"
                                        placeholder="输入客服电话"
                                        value={this.state.tel}
                                        onChange={e => this._onChange(e, "input_tel")}
                                    />
                                    <span className='switch' onClick={() => {
                                        this.setState({
                                            switchNumber: !this.state.switchNumber,
                                            seatNumber: '',
                                            areaCode: this.hasAreaCode ? areaCode : ''
                                        })
                                    }}>切为座机号</span>
                                </div>
                            </div>
                        }
                        {
                            this.state.switchNumber && <div className='cell-item'>
                                <div className='-label -required'>客服电话</div>
                                <div className='-value'>
                                    <input
                                        className='area-code'
                                        type='tel'
                                        value={this.state.areaCode}
                                        onChange={e => this._onChange(e, "area_code")}
                                        placeholder='区号' />
                                    <i className='division'>-</i>
                                    <input className='seat-number'
                                        ref={v => this.seatNumberInput = v}
                                        type='tel'
                                        value={this.state.seatNumber}
                                        onChange={e => this._onChange(e, "seat_number")}
                                        placeholder='座机号'
                                    />
                                    <span className='switch' onClick={() => {
                                        this.setState({
                                            switchNumber: !this.state.switchNumber,
                                            tel: ''
                                        })
                                    }}>切为手机号</span>
                                </div>
                            </div>
                        }
                        <div className='cell-item' style={{ border: '0' }}>
                            <div className='-label -required'>商户地址</div>
                            <div className='-value'>
                                <input onClick={this._showAreaPicker.bind(this)} onChange={this._isEnable.bind(this)} type='text' placeholder='请选地区' readOnly='readonly' value={this.state.provice + this.state.city + this.state.area} />
                            </div>
                            <i className="icon_more"></i>
                        </div>
                        <div className='cell-item'>
                            <div className="-full-add"><input ref='address' type='text' placeholder='请输入详细地址' onChange={this._isEnable.bind(this)} /></div>
                        </div>
                        <div className='cell-item'>
                            <div className='-label -required'>商户介绍</div>
                            <div className='-value'>
                                <div className='-textarea'>
                                    <textarea ref='introduction' placeholder="请输入（150字以内）" onChange={(e) => {
                                        this._isEnable();
                                        let data = e.target.value;
                                        if (data.length > 150) {
                                            data = data.slice(0, 150);
                                        }
                                        this.setState({
                                            desc: data,
                                            text_num: 150 - data.length
                                        });
                                    }} value={this.state.desc}></textarea>
                                    <p className='-counter'>{this.state.text_num}</p>
                                </div>
                            </div>
                        </div>
                        <div className='cell-control'>
                            <button className={this.state.isEnable ? 'btn-primary' : 'btn-primary -disabled'} onClick={this._doApply}>提交</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
