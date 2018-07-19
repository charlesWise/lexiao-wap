'use strict'
import React, { Component } from 'react';
import api from './../../../../controllers/api';
import Picker from './../../../components/Picker';
import DatePicker from './../../../components/DatePicker';
import ScreenComponent from './../../../components/ScreenComponent';
import SourceStore from './SourceItem';

class BonusDetail extends ScreenComponent {
    static pageConfig = {
        path: '/merchant/bonusdetail',
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '奖励详情'
        }
        this.state = {
            sourceData: {},
            isMaskTabOne: false,
            isMaskTabTwo: false,
            isMaskTabThree: false,
            isMask: false,
            isSearchMask: false,
            isRuleTip: false,
            isWelfareDetail: false,
            welfareDetail: {},
            mobile: '',
            storeId: '',
            rewardType: 0,
            startTime: '',
            endTime: '',
            mid: '',
            eid: '',
            rewardListData: {},
            storeName: '来源',
            rewardTypeName: '奖励类型',
            areaName: '统计区间'
        }
        this.storeParams = []
    }
    componentDidMount() {
        this._getRewardList();
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
    // 奖励列表
    _getRewardList() {
        let params = {
            mobile: this.state.mobile,
            source: this.state.storeId,
            reward_type: this.state.rewardType,
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate()
        }
        api.rewardList(params).success((content, next, abort) => {
            if (content.boolen == 1) {
                this.setState({
                    rewardListData: content.data
                })
            }
        })
    }
    // 奖励列表-查看商户/员工
    _getRewardMeList() {
        let params = {
            source: this.state.storeId,
            reward_type: this.state.rewardType,
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate(),
            mid: this.state.mid,
            eid: this.state.eid
        }
        api.rewardMeList(params).success((content, next, abort) => {
            if (content.boolen == 1) {
                this.setState({
                    rewardListData: content.data
                })
            }
        })
    }
    // 商户详情奖励列表
    _getEmpRewardList() {
        let params = {
            source: this.state.storeId,
            reward_type: this.state.rewardType,
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate(),
            mid: this.state.mid,
            eid: this.state.eid
        }
        api.empRewardList(params).success((content, next, abort) => {
            if (content.boolen == 1) {
                this.setState({
                    rewardListData: content.data
                })
            }
        })
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
        if(this.storeParams.length>0) {
            this.storeParams = [];
        }
        this.setState({
            isMaskTabOne: !this.state.isMaskTabOne,
            isMaskTabTwo: false,
            isMaskTabThree: false
        });
        this._getRewardList();
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
            this._getRewardList();
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
                <li onClick={() => this._rewardType(1, '福利券')} className={`${this.state.rewardType == 1 && 'active'}`}>
                    <p>
                        <span>福利券</span>
                        <span>
                            {
                                this.state.rewardType == 1 && <i className="icon-right-check"></i>
                            }
                        </span>
                    </p>
                </li>
                <li onClick={() => this._rewardType(2, '用户注册')} className={`${this.state.rewardType == 2 && 'active'}`}>
                    <p>
                        <span>用户注册</span>
                        <span>
                            {
                                this.state.rewardType == 2 && <i className="icon-right-check"></i>
                            }
                        </span>
                    </p>
                </li>
                <li onClick={() => this._rewardType(3, '用户投资')} className={`${this.state.rewardType == 3 && 'active'}`}>
                    <p>
                        <span>用户投资</span>
                        <span>
                            {
                                this.state.rewardType == 3 && <i className="icon-right-check"></i>
                            }
                        </span>
                    </p>
                </li>
            </ul>
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
            this._getRewardList();
        })
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
                            className={`${this.state.bonusTab == 2 && 'active'}`}
                            onClick={() => this._switchBonusData(2)}>{this.state.rewardTypeName}<i></i></a>
                    </li>
                    <li>
                        <a href="javascript:;"
                            className={`${this.state.bonusTab == 3 && 'active'}`}
                            onClick={() => this._switchBonusData(3)}>
                            {this.state.areaName && this.state.areaName.length > 8 ? `${this.state.areaName.slice(0, 8)}...` : `${this.state.areaName}`}
                            <i></i></a>
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
    _ruleTip() {
        this.setState({
            isRuleTip: !this.state.isRuleTip,
            isMask: !this.state.isMask
        })
    }
    _renderRuleTip() {
        return (
            <div className="rule-tip">
                <span onClick={() => this._ruleTip()}><i className="icon-tip"></i>奖励规则</span></div>
        )
    }
    // 最后级别详情
    _seeWelfareDetail(item) {
        if (item && item.id) {
            api.rewardInfo({ id: item.id }).success((content, next, abort) => {
                if (content.boolen == 1) {
                    let welfareDetail = content.data;
                    this.setState({
                        welfareDetail,
                        isWelfareDetail: !this.state.isWelfareDetail,
                        isMask: !this.state.isMask
                    })
                }
            })
        }
    }
    // 下级列表
    _nextRewardList(item) {
        if (!item.have_sub) {
            if (!!item.eid) {
                this.setState({
                    storeId: item.id,
                    mid: !item.mid?'':item.mid,
                    eid: !item.eid?'':item.eid
                }, () => {
                    this._getEmpRewardList();
                })
            } else {
                if (!!item.go_flag) {
                    this.setState({
                        storeId: item.id,
                        mid: !item.mid?'':item.mid,
                        eid: !item.eid?'':item.eid
                    }, () => {
                        this._getEmpRewardList();
                    })
                } else {
                    this.setState({
                        storeId: item.id,
                        mid: !item.mid?'':item.mid,
                    }, () => {
                        this._getRewardMeList();
                    })
                }
            }
        } else {
            this.setState({
                storeId: item.id,
                mid: !item.mid?'':item.mid,
            }, () => {
                this._getRewardList();
            })
        }
        this.storeParams.push({
            have_sub: !item.have_sub?'':item.have_sub,
            go_flag: !item.go_flag?'':item.go_flag,
            storeId: item.id,
            mid: !item.mid?'':item.mid,
            eid: !item.eid?'':item.eid
        })
    }
    // 返回操作
    _backRewardList() {
        if (this.storeParams && this.storeParams.length > 0) {
            let lastObj = this.storeParams[this.storeParams.length - 2];
            this.storeParams.pop();
            if (lastObj&&Object.keys(lastObj).length > 0) {
                if (!lastObj.have_sub) {
                    if (!!lastObj.eid) {
                        this.setState({
                            storeId: lastObj.storeId,
                            mid: lastObj.mid,
                            eid: lastObj.eid
                        }, () => {
                            this._getEmpRewardList();
                        })
                    } else {
                        if (!!lastObj.go_flag) {
                            this.setState({
                                storeId: lastObj.storeId,
                                mid: lastObj.mid,
                                eid: lastObj.eid
                            }, () => {
                                this._getEmpRewardList();
                            })
                        } else {
                            this.setState({
                                storeId: lastObj.storeId,
                                mid: lastObj.mid,
                                eid: lastObj.eid
                            }, () => {
                                this._getRewardMeList();
                            })
                        }
                    }
                }
            } else {
                this._getRewardList();
            }
        }
    }
    _renderRewardList() {
        let rewardListData = this.state.rewardListData,
            rewardList = rewardListData.list,
            isEnd = false;
        if (rewardList && rewardList.length > 0) {
            for (let i = 0; i < rewardList.length; i++) {
                if (rewardList[i]['is_end'] == 1) {
                    isEnd = true;
                }
            }
        }
        return (
            <div className="bonus-list">
                {
                    this.storeParams.length>0&&isEnd&&<div className="overlay level-two"></div>
                }
                {
                    this.storeParams.length>0&&<div className="overlay level-one"></div>
                }
                {
                    this.storeParams.length > 0&&<div className="classify overlay-dowm"
                        onClick={() => this._backRewardList()}>
                        <span><i></i>{rewardListData.m_name}</span>
                    </div>
                }
                <div className="total-count">
                    <p className="total"><span>用户总数：{rewardListData.user_num}人</span><span>奖励总额：{rewardListData.reward_money}元</span></p>
                </div>
                <div className="reward-content">
                    <ul className="list-table">
                        <li className="title-li">
                            <span>来源</span>
                            {
                                !isEnd && <span>统计区间</span>
                            }
                            {
                                !isEnd && <span>用户总数</span>
                            }
                            {
                                isEnd && <span>用户手机</span>
                            }
                            {
                                isEnd && <span>日期</span>
                            }
                            {
                                isEnd && <span>奖励类型</span>
                            }
                            {
                                !isEnd && <span>奖励金额(元)</span>
                            }
                            {
                                isEnd && <span></span>
                            }
                            {
                                !isEnd && <span></span>
                            }
                        </li>
                        {
                            rewardList && rewardList.length > 0 && rewardList.map((item, i) => {
                                return (
                                    <li key={'reward' + i}>
                                        <span className={`${i == 0 && 'active'}`}>{item.name}</span>
                                        {
                                            item.is_end != 1 && <span>{item.data}</span>
                                        }
                                        {
                                            item.is_end != 1 && <span>{item.user_count}</span>
                                        }
                                        {
                                            item.is_end == 1 && <span>{item.mobile}</span>
                                        }
                                        {
                                            item.is_end == 1 && <span>{item.data}</span>
                                        }
                                        {
                                            item.is_end != 1 && <span>{item.money}</span>
                                        }
                                        {
                                            item.is_end == 1 && <span>{this._rewardTypeWriting(item.reward_type)}</span>
                                        }
                                        {
                                            item.is_end != 1 && <span onClick={() => this._nextRewardList(item)}>查看明细</span>
                                        }
                                        {
                                            item.is_end == 1 && <span onClick={() => this._seeWelfareDetail(item)}>查看详情</span>
                                        }
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
    _ruleTipPopup() {
        return (
            <div className="bottom-popup">
                <div className="popup-title">
                    <i className="icon-close" onClick={() => this._ruleTip()}></i>奖励规则
                </div>
                <div className="content">
                    <div className="rule">
                        <p>1.商户推荐新用户注册投融家，用户可获得该商户的福利券，用户将此福利券消费后，商户将获得奖励。</p>
                        <p>2.每推荐一个新用户注册投融家，商户将获得奖励。</p>
                        <p>3.商户推荐注册投融家的新用户，在投融家首次投资后，商户将获得奖励，投资金额越多奖励越多。</p>
                    </div>
                </div>
            </div>
        )
    }
    _welfareDetailPopup() {
        let welfareDetail = this.state.welfareDetail;
        return (
            <div className="bottom-popup">
                <div className="popup-title"><i className="icon-close" onClick={() => {
                    this.setState({
                        welfareDetail,
                        isWelfareDetail: !this.state.isWelfareDetail,
                        isMask: !this.state.isMask
                    })
                }}></i>{this._rewardTypeWriting(welfareDetail.reward_type)}</div>
                <div className="content">
                    <ul className="consumer-ul">
                        <li><span>用户手机</span><span>{welfareDetail.mobile}</span></li>
                        <li><span>奖励类型</span><span>{this._rewardTypeText(welfareDetail.coupon_type, welfareDetail.reward_type, welfareDetail.coupon_amount, welfareDetail.need_amount)}</span></li>
                        
                        {
                            !!welfareDetail.amount&&<li><span>{welfareDetail.reward_type == 1?'消费金额':'投资金额'}</span><span>{welfareDetail.amount}元</span></li>
                        }
                        
                        <li><span>奖励金额</span><span>{welfareDetail.discount_amount}元</span></li>
                        <li><span>消费时间</span><span>{welfareDetail.ctime}</span></li>
                        <li><span>消费门店</span><span>{welfareDetail.name}</span></li>
                    </ul>
                </div>
            </div>
        )
    }
    _rewardTypeWriting(reward_type) {
        if (reward_type == 1) { //福利券奖励
            return '福利券奖励';
        } else if (reward_type == 2) { //注册奖励
            return '注册奖励';
        } else if (reward_type == 3) { //投资奖励
            return '投资奖励';
        }
    }
    _rewardTypeText(coupon_type, reward_type, coupon_amount, need_amount) {
        if (reward_type == 1) { //福利券奖励
            if(coupon_type == 1) {
                return `代金券 ${coupon_amount}元`;
            }else if(coupon_type == 2) {
                return `满减券 ${coupon_amount}元（满${need_amount}可用）`;
            }
        } else if (reward_type == 2) { //注册奖励
            return '注册奖励';
        } else if (reward_type == 3) { //投资奖励
            return '投资奖励';
        }
    }
    _onChangeMobile(e) {
        let mobile = e.target.value.replace(/[^\d]/g,'');
        if(mobile.length > 11) return;
        this.setState({mobile}, () => {
            this._getRewardList();
        })
    }
    _renderSearchBox() {
        return (
            <header className="base-search-bar">
                <span className="base-search-text base-search-text-fill">
                    <input type="tel" placeholder="搜索用户手机号" 
                        value={this.state.mobile}
                        onBlur={() => {
                            this.setState({isSearchMask: false})
                        }}
                        onFocus={() => {
                            this.setState({isSearchMask: true})
                        }}
                        onChange={e => this._onChangeMobile(e)}/>
                </span>
            </header>
        )
    }
    render() {
        return (
            <div className="bonus-detail-wrapper">
                {this._renderSearchBox()}
                {this._renderSelectArea()}
                {this._renderRuleTip()}
                {this._renderRewardList()}
                {
                    (this.state.isMaskTabOne || this.state.isMaskTabTwo || this.state.isMaskTabThree) &&
                    <div className="mask mask-zindex" onClick={() => this._hideMaskPopup()}></div>
                }
                {this.state.isRuleTip && this._ruleTipPopup()}
                {this.state.isWelfareDetail && this._welfareDetailPopup()}
                {this.state.isMask && <div className="mask"></div>}
                {this.state.isSearchMask && <div className="mask search-zindex"></div>}
            </div>
        );
    }
}

export default BonusDetail;