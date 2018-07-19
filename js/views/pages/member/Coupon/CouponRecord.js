'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Picker from './../../../components/Picker';
import DatePicker from './../../../components/DatePicker';
import SourceStore from './SourceItem';

import api from './../../../../controllers/api';

export default class CouponRecord extends ScreenComponent {
    static pageConfig = {
        path: '/member/coupon/record',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '福利券消费记录'
        }
        this.state = {
            data: {},
            sourceData: {},
            isMaskTabOne: false,
            isMaskTabTwo: false,
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
            detail: {}
        }
        this.storeParams = []
    }

    componentDidMount() {
        this._getStores();
        this._getList();
    }

    _getStores(){
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
            mobile: this.state.mobile || '',//手机号
            merchant_id: this.state.storeId,//商户id
            coupon_type: this.state.rewardType,//福利券类型  枚举值: 1-代金券  2-满减券 0-全部
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),//开始时间
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate()//结束时间
        }
        api.couponUseList(params).success((content) => {
            this.setState({
                data: content.data || {}
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _getLabel(data){
        if(data.type == 1){
            return '代金券';
        }else{
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
            isMaskTabTwo: false,
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
            isMaskTabTwo: false,
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
            isMaskTabTwo: false,
            isMaskTabThree: false,
            rewardTypeName: name
        }, () => {
            this._getList()
        });
    }
    
    _rewardTypeSearch() {
        return (
            <ul className="reward-ul">
                <li onClick={() => this._rewardType(0, '全部')} className={`${this.state.rewardType == 0 && 'active'}`}>
                    <p>
                        <span>全部</span>
                        <span>
                            {
                                this.state.rewardType == 0 && <i className="icon-right-check"></i>
                            }
                        </span>
                    </p>
                </li>
                <li onClick={() => this._rewardType(2, '满减券')} className={`${this.state.rewardType == 2 && 'active'}`}>
                    <p>
                        <span>满减券</span>
                        <span>
                            {
                                this.state.rewardType == 2 && <i className="icon-right-check"></i>
                            }
                        </span>
                    </p>
                </li>
                <li onClick={() => this._rewardType(1, '代金券')} className={`${this.state.rewardType == 1 && 'active'}`}>
                    <p>
                        <span>代金券</span>
                        <span>
                            {
                                this.state.rewardType == 1 && <i className="icon-right-check"></i>
                            }
                        </span>
                    </p>
                </li>
            </ul>
        )
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
                            isMaskTabTwo: false,
                            isMaskTabThree: false
                        })
                    }
                })
            } else {
                this.setState({
                    bonusTab: type,
                    isMaskTabOne: !this.state.isMaskTabOne,
                    isMaskTabTwo: false,
                    isMaskTabThree: false
                })
            }
        } else if (type == 2) {
            this.setState({
                bonusTab: type,
                isMaskTabTwo: !this.state.isMaskTabTwo,
                isMaskTabOne: false,
                isMaskTabThree: false
            })
        } else if (type == 3) {
            this.setState({
                bonusTab: type,
                isMaskTabThree: !this.state.isMaskTabThree,
                isMaskTabOne: false,
                isMaskTabTwo: false
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
            isMaskTabTwo: false,
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
                        <a href="javascript:;"
                            className={`${this.state.bonusTab == 1 && 'active'}`}
                            onClick={() => this._switchBonusData(1)}>
                            {this.state.storeName && this.state.storeName.length > 5 ? `${this.state.storeName.slice(0, 5)}...` : `${this.state.storeName}`}
                            <i></i></a>
                    </li>
                    <li>
                        <a href="javascript:;"
                            className={`${this.state.bonusTab == 3 && 'active'}`}
                            onClick={() => this._switchBonusData(3)}>
                            {this.state.areaName && this.state.areaName.length > 8 ? `${this.state.areaName.slice(0, 8)}...` : `${this.state.areaName}`}
                            <i></i></a>
                    </li>
                    <li>
                        <a href="javascript:;"
                            className={`${this.state.bonusTab == 2 && 'active'}`}
                            onClick={() => this._switchBonusData(2)}>{this.state.rewardTypeName}<i></i></a>
                    </li>
                </ul>
                <div className="drop-down-list">
                    {this.state.bonusTab == 1 && this.state.isMaskTabOne && this._sourceSearch()}
                    {this.state.bonusTab == 2 && this.state.isMaskTabTwo && this._rewardTypeSearch()}
                    {this.state.bonusTab == 3 && this.state.isMaskTabThree && this._statisticalSearch()}
                </div>
            </div>
        )
    }

    _renderList(data){
        let list = data.list || [];
        return (
            <div className="bonus-list" style={{marginTop: '1rem'}}>
                <div className="total-count">
                    <p className="total"><span>消费人数：{data.total}人</span><span>优惠总额：{data.total_discount || 0}元</span></p>
                </div>
                <div className="reward-content">
                    <ul className="list-table">
                        <li className="title-li">
                            <span>用户手机号</span>
                            <span>消费门店</span>
                            <span>消费日期</span>
                            <span>优惠券</span>
                        </li>
                         {
                            list && list.length > 0 && list.map((item, index) => {
                                 return (
                                     <li key={'reward' + index} onClick={this._getDetail.bind(this, item)}>
                                         <span>{item.user_mobile}</span>
                                         <span>{item.merchant_name}</span>
                                         <span>{item.mtime}</span>
                                         <span>{this._getLabel(item)}{item.discount_amount}</span>
                                     </li>
                                 )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }

    _getDetail(item){
        this.setState({
            isWelfareDetail: true,
            isMask: true,
            detail: item
        })
    }

    _renderSearchBox() {
        return (
            <header className="base-search-bar">
                <span className="base-search-text base-search-text-fill">
                    <input type="tel" placeholder="搜索用户手机号"
                        value={this.state.mobile}
                        onBlur={() => {
                            this.setState({ isSearchMask: false })
                        }}
                        onFocus={() => {
                            this.setState({ isSearchMask: true })
                        }}
                        onChange={e => this._onChangeMobile(e)} />
                </span>
            </header>
        )
    }

    _welfareDetailPopup() {
        let detail = this.state.detail
        return (
            <div className="bottom-popup">
                <div className="popup-title"><i className="icon-close" onClick={() => {
                    this.setState({
                        isWelfareDetail: false,
                        isMask: false
                    })
                }}></i>{'福利券消费详情'}</div>
                <div className="content">
                    <ul className="consumer-ul">
                        <li><span>用户手机号</span><span>{detail.user_mobile}</span></li>
                        <li><span>消费金额</span><span>{detail.money}元</span></li>
                        <li><span>优惠券</span><span>{detail.type_name}{detail.discount_amount}元</span></li>
                        <li><span>实付金额</span><span>{detail.pay_money}元</span></li>
                        <li><span>消费时间</span><span>{detail.mtime}</span></li>
                        <li><span>消费门店</span><span>{detail.merchant_name}</span></li>
                    </ul>
                </div>
            </div>
        )
    }

    render() {
        let data = this.state.data || {}
        return (
            <div className='bonus-detail-wrapper'>
                {
                    this._renderSearchBox()
                }
                {this._renderSelectArea()}
                {this._renderList(data)}
                {
                    (this.state.isMaskTabOne || this.state.isMaskTabTwo || this.state.isMaskTabThree) &&
                    <div className="mask mask-zindex" onClick={() => this._hideMaskPopup()}></div>
                }
                {this.state.isWelfareDetail && this._welfareDetailPopup()}
                {this.state.isMask && <div className="mask"></div>}
                {this.state.isSearchMask && <div className="mask search-zindex"></div>}
            </div>
        )
    }
}
