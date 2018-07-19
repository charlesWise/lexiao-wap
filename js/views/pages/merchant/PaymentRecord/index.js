'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Picker from './../../../components/Picker';
import DatePicker from './../../../components/DatePicker';
import SourceStore from './SourceItem';

import api from './../../../../controllers/api';
import SearchRecord from './SearchRecord';


export default class PaymentRecord extends ScreenComponent {
    static pageConfig = {
        path: '/merchant/order/record',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '买单记录'
        }
        this.state = {
            list: [],
            sourceData: {},
            isMaskTabOne: false,
            // isMaskTabTwo: false,
            isMaskTabThree: false,
            isMask: false,
            isRuleTip: false,
            isWelfareDetail: false,
            welfareDetail: {},
            storeId: '',
            rewardType: 0,
            startTime: '',
            endTime: '',
            rewardListData: [],
            storeName: '消费门店',
            rewardTypeName: '福利券类型',
            areaName: '消费时间',
            data: {},
            detail: {},
            isSearched: false, //搜索
            isFocused: false,
            isClickItem: false,
            searchList: [],
            mobile: ''
        }
        this.storeParams = []
    }

    componentDidMount() {
        this._getStores();
        this._getList();
    }

    _getStores() {
        api.sourceList().success((content, next, abort) => {
            if (content.boolen == 1) {
                let sourceData = content.data;
                this.setState({
                    sourceData
                })
            }
        })
    }

    _getList() {
        let params = {
            mobile: this.state.mobile,
            pmid: this.state.storeId || "",
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate()
        }
        api.userOrderList(params).success((content) => {
            let data = content.data || {}
            this.setState({
                data: data
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _getLabel(data) {
        if (data.type == 1) {
            return '代金券';
        } else {
            return '满减券';
        }
    }
    _defaultDate() {
        let date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
        }
        return `${year}/${month}/${strDate}`;
    }
    _hideMaskPopup() {
        this.setState({
            isMaskTabOne: false,
            // isMaskTabTwo: false,
            isMaskTabThree: false
        });
    }
    getStoreInfo(id, storeName, sourceData) {
        this.setState({
            storeId: id,
            storeName,
            sourceData
        });
    }
    openLowerLevel(sourceData) {
        this.setState({ sourceData })
    }
    _confirmChoiceMerchant() {
        if (this.storeParams.length > 0) {
            this.storeParams = [];
        }
        this.setState({
            isMaskTabOne: !this.state.isMaskTabOne,
            // isMaskTabTwo: false,
            isMaskTabThree: false
        });
        this._getList();
    }
    _resetChoice(sourceData) {
        if (sourceData.isSelect) {
            sourceData.isSelect = !sourceData.isSelect;
        }
        if (sourceData['sub'] && sourceData['sub'].length > 0) {
            for (let i = 0; i < sourceData['sub'].length; i++) {
                this._resetChoice(sourceData['sub'][i]);
            }
        }
    }
    _resetChoiceMerchant() {
        this._resetChoice(this.state.sourceData);
        this.setState({
            storeName: '来源',
            storeId: '',
            sourceData: this.state.sourceData
        });
    }
    _sourceSearch() {
        return (
            <div>
                <SourceStore
                    ref={v => this.SourceStore = v}
                    sourceData={this.state.sourceData}
                    openLowerLevel={(sourceData) => this.openLowerLevel(sourceData)}
                    getStoreInfo={(id, storeName, sourceData) => this.getStoreInfo(id, storeName, sourceData)} />
                <div className="statist-btn">
                    <span onClick={() => this._resetChoiceMerchant()}><em>重置</em></span>
                    <span onClick={() => this._confirmChoiceMerchant()}><em>确定</em></span>
                </div>
            </div>
        )
    }

    _rewardType(type, name) {
        this.setState({
            rewardType: type,
            isMaskTabOne: false,
            // isMaskTabTwo: false,
            isMaskTabThree: false,
            rewardTypeName: name
        }, () => {
            this._getList()
        });
    }

    _switchBonusData(type) {
        if (type == 1) {
            if (Object.keys(this.state.sourceData).length == 0) {
                api.sourceList().success((content, next, abort) => {
                    if (content.boolen == 1) {
                        let sourceData = content.data;
                        this.setState({
                            sourceData,
                            bonusTab: type,
                            isMaskTabOne: !this.state.isMaskTabOne,
                            // isMaskTabTwo: false,
                            isMaskTabThree: false
                        })
                    }
                })
            } else {
                this.setState({
                    bonusTab: type,
                    isMaskTabOne: !this.state.isMaskTabOne,
                    // isMaskTabTwo: false,
                    isMaskTabThree: false
                })
            }
        } else if (type == 2) {
            this.setState({
                bonusTab: type,
                // isMaskTabTwo: !this.state.isMaskTabTwo,
                isMaskTabOne: false,
                isMaskTabThree: false
            })
        } else if (type == 3) {
            this.setState({
                bonusTab: type,
                isMaskTabThree: !this.state.isMaskTabThree,
                isMaskTabOne: false,
                // isMaskTabTwo: false
            })
        }
    }

    _statisticalSearch() {
        return (
            <div className="statistical-content">
                <div className="statistical">
                    <span onClick={() => this._showDate(1)}><em>{this.state.startTime ? this.state.startTime : this._defaultDate()}</em></span>
                    <span>至</span>
                    <span onClick={() => this._showDate(2)}><em>{this.state.endTime ? this.state.endTime : this._defaultDate()}</em></span>
                </div>
                <div className="statist-btn">
                    <span onClick={() => {
                        this.setState({
                            startTime: '',
                            endTime: ''
                        })
                    }}><em>重置</em></span>
                    <span onClick={() => this._confirmSection()}><em>确定</em></span>
                </div>
            </div>
        )
    }

    _showDate(type) {
        let PICKER_ID = this.getScreen().showPopup({
            content: <DatePicker
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID);
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID);
                    let date = data.year + '/' + data.month + '/' + data.day;
                    if (type == 1) {  //开始时间
                        this.setState({ startTime: date });
                    } else if (type == 2) {  //结束时间
                        this.setState({ endTime: date });
                    }
                }}
            />
        })
    }

    _confirmSection() {
        this.setState({
            isMaskTabThree: !this.state.isMaskTabThree,
            isMaskTabOne: false,
            // isMaskTabTwo: false,
            areaName: `${this.state.startTime ? this.state.startTime : this._defaultDate()}-${this.state.endTime ? this.state.endTime : this._defaultDate()}`
        }, () => {
            this._getList();
        })
    }

    _renderSelectArea() {
        return (
            <div className="bonus-select-area">
                <ul className="select-area">
                    <li>
                        <a style={{ width: '7.5rem' }} href="javascript:;"
                            className={`${this.state.bonusTab == 1 && 'active'}`}
                            onClick={() => this._switchBonusData(1)}>
                            {this.state.storeName && this.state.storeName.length > 5 ? `${this.state.storeName.slice(0, 5)}...` : `${this.state.storeName}`}
                            <i></i></a>
                    </li>
                    <li>
                        <a style={{ width: '7.5rem' }} href="javascript:;"
                            className={`${this.state.bonusTab == 3 && 'active'}`}
                            onClick={() => this._switchBonusData(3)}>
                            {this.state.areaName && this.state.areaName.length > 8 ? `${this.state.areaName.slice(0, 8)}...` : `${this.state.areaName}`}
                            <i></i></a>
                    </li>
                </ul>
                <div className="drop-down-list">
                    {this.state.bonusTab == 1 && this.state.isMaskTabOne && this._sourceSearch()}
                    {this.state.bonusTab == 3 && this.state.isMaskTabThree && this._statisticalSearch()}
                </div>
            </div>
        )
    }

    _renderList(data) {
        let list = data.list || [];
        return (
            <div className="bonus-list" style={{ marginTop: '1rem' }}>
                <div className="total-count">
                    <p className="total"><span>消费人数：{data.pay_num}人</span><span>消费总额：{data.pay_all_money}元</span></p>
                </div>
                <div className="reward-content">
                    <ul className="list-table">
                        <li className="title-li">
                            <span>用户手机号</span>
                            <span>消费门店</span>
                            <span>消费日期</span>
                            <span>消费金额</span>
                        </li>

                        {
                            list && list.length > 0 && list.map((item, index) => {
                                return (
                                    <li key={'reward' + index} onClick={this._getDetail.bind(this, item)}>
                                        <span>{item.mobile}</span>
                                        <span>{item.merchant_name}</span>
                                        <span>{item.mtime}</span>
                                        <span>{item.money}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                {
                    list.length == 0 && this._notRecord()
                }
            </div>
        )
    }

    _getDetail(item) {
        api.orderInfo({
            order_id: item.order_id
        }).success((res) => {
            this.setState({
                isWelfareDetail: true,
                isMask: true,
                detail: res.data
            })
        })
    }

    _handerMoble(mobile) {
        if (mobile.length === 11) {
            let head = mobile.substr(0, 3);
            let tail = mobile.substr(mobile.length - 4, 4);
            return head + "****" + tail;
        }
    }

    _onClick(e, type, data) {
        if (type === "input_clear") {
            this.input_search_ref.value = "";
            this.setState({ isSearched: false, mobile: "" });
        } else if (type === "input_cancel") {
            this.input_search_ref.value = "";
            this.setState({ isFocused: false, isSearched: false, isClickItem: false, mobile: "" });
            this._getList();
        } else if (type === "select_mobile") {
            this.input_search_ref.value = this._handerMoble(data);
            this.setState({ isSearched: false, isFocused: false, isClickItem: true, mobile: data }, () => {
                this._getList();
            });
        }
    }

    _renderSearchBox() {
        return (
            <header className="base-search-bar">
                <span className={(this.state.isFocused || this.state.isClickItem) ? "base-search-text" : "base-search-text base-search-text-fill"}>
                    <i className="base-search-input-icon_search"></i>
                    {((this.state.isSearched || this.state.isClickItem) && this.state.isFocused) && (
                        <i
                            className="base-search-input-icon_del"
                            onClick={e => this._onClick(e, "input_clear")}
                        />
                    )}
                    <input type="tel" placeholder="搜索用户手机号"
                        ref={ref => (this.input_search_ref = ref)}
                        onFocus={() => {
                            this.setState({ isFocused: true })
                        }}
                        onChange={e => this._onChangeMobile(e)} />
                </span>
                {(this.state.isFocused || this.state.isClickItem) && (
                    <a
                        className="head_cancel"
                        onClick={e => this._onClick(e, "input_cancel")}
                    >
                        取消
                    </a>
                )}
            </header>
        )
    }

    //手机号模糊查询
    _userOrderListSearch(data) {
        api.userOrderListSearch(data).success((content) => {
            let data = content.data || [];
            this.setState({
                searchList: data
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _onChangeMobile(e) {
        // let mobile = e.target.value.replace(/[^\d]/g, '');
        // if (mobile.length > 11) return;
        // this.setState({ mobile }, () => {
        //     this._getList();
        // })
        let mobile = e.target.value.replace(/[^\d]/g, '');
        if (mobile) {
            this.setState({ isSearched: true });
            this._userOrderListSearch({ mobile: mobile });
        } else {
            this.setState({ isSearched: false, searchList: [] });
        }
    }

    _getCouponDetail(detail) {
        if (!detail.coupon_type) {
            return '无'
        }
        if (detail.coupon_type == 1) {
            return '代金券' + detail.discount_amount + '元'
        } else {
            return '满减券' + detail.discount_amount + '元（满' + detail.need_amount + '可用）'
        }
    }

    _welfareDetailPopup() {
        let detail = this.state.detail || {}
        return (
            <div className="bottom-popup">
                <div className="popup-title"><i className="icon-close" onClick={() => {
                    this.setState({
                        isWelfareDetail: false,
                        isMask: false
                    })
                }}></i>{'买单记录详情'}</div>
                <div className="content">
                    <ul className="consumer-ul">
                        <li><span>消费时间</span><span>{detail.mtime}</span></li>
                        <li><span>消费金额</span><span>{detail.money}</span></li>
                        <li><span>优惠券</span><span>{
                            this._getCouponDetail(detail)
                        }</span></li>
                        <li><span>实付金额</span><span>{detail.pay_money}</span></li>
                        <li><span>用户手机号</span><span>{detail.mobile}</span></li>
                        <li><span>消费门店</span><span>{detail.merchant_name}</span></li>
                    </ul>
                </div>
            </div>
        )
    }
    _notRecord() {
        return (
            <div className='not-record' style={{ paddingTop: '7rem' }}>
                <img src='/icon/icon_not_record.png' /><span>暂无买单记录</span>
            </div>
        )
    }
    render() {
        let data = this.state.data
        return (
            <div className='bonus-detail-wrapper'>
                {
                    this._renderSearchBox()
                }
                {(!this.state.isSearched || this.state.searchList == 0) && this._renderSelectArea()}
                {!this.state.isSearched && this._renderList(data)}
                {
                    !this.state.isSearched && (this.state.isMaskTabOne || this.state.isMaskTabThree) &&
                    <div className="mask mask-zindex" onClick={() => this._hideMaskPopup()}></div>
                }
                {this.state.isWelfareDetail && this._welfareDetailPopup()}
                {this.state.isMask && <div className="mask"></div>}
                {this.state.isFocused && !this.state.isSearched && <div className="mask search-zindex"></div>}
                {this.state.isSearched && <SearchRecord dataSource={this.state.searchList} onClick={(e, type, data) => { this._onClick(e, type, data) }} />}
            </div>
        )
    }
}
