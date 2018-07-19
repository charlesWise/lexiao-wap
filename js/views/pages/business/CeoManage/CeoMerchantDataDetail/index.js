'use strict'
import React, { Component } from 'react';
import api from './../../../../../controllers/api';
import DatePicker from './../../../../components/DatePicker';
import ScreenComponent from './../../../../components/ScreenComponent';
import SourceStore from './SourceItem';

export default class CeoMerchantDataDetail extends ScreenComponent {
    static pageConfig = {
        path: '/merchant/ceomerchantdatadetail',
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '商户数据详情'
        }
        this.state = {
            sourceData: {},
            isMaskTabOne: false,
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
            areaName: '统计区间',
            level: 1
        }
        this.storeParams = []
    }
    componentDidMount() {
        this._getBDSource();
        // this._getMerchantDetails();
        this._getBFMerchantList();
    }

    _getBDSource() {
        api.getBDSourceCeo({
        }).success((res) => {
            this.setState({
                sourceData: res.data
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _getMerDetail() {
        api.bdGetMerchantDetails({
            mobile: this.state.mobile || '',
            month: this.state.month || ''
        }).success((res) => {
            this.setState({
                rewardListData: res.data
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
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
                            isMaskTabThree: false
                        })
                    }
                })
            } else {
                this.setState({
                    bonusTab: type,
                    isMaskTabOne: !this.state.isMaskTabOne,
                    isMaskTabThree: false
                })
            }
        } else if (type == 3) {
            this.setState({
                bonusTab: type,
                isMaskTabThree: !this.state.isMaskTabThree,
                isMaskTabOne: false
            })
        }
    }
    _hideMaskPopup() {
        this.setState({
            isMaskTabOne: false,
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
        this.setState({
            isMaskTabOne: !this.state.isMaskTabOne,
            isMaskTabThree: false
        });
        this._getMerchantsByBDInfo();
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
            areaName: `${this.state.startTime ? this.state.startTime : this._defaultDate()}-${this.state.endTime ? this.state.endTime : this._defaultDate()}`,
            type: 1,
        }, () => {
            console.log('confirm date')
            this._getMerchantsByBDInfo();
            // this._getBFMerchantList();
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
                        <a style={{ width: '6.5rem'}} href="javascript:;"
                            className={`${this.state.bonusTab == 1 && 'active'}`}
                            onClick={() => this._switchBonusData(1)}>
                            {this.state.storeName && this.state.storeName.length > 5 ? `${this.state.storeName.slice(0, 5)}...` : `${this.state.storeName}`}
                            <i></i></a>
                    </li>
                    <li>
                        <a style={{ width: '6.5rem' }} href="javascript:;"
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

    // 返回操作
    _backRewardList() {
        this.setState({
            level: --this.state.level
        })
        if (this.storeParams && this.storeParams.length > 0) {
            let lastObj = this.storeParams[this.storeParams.length - 2];
            this.storeParams.pop();
            if (!!lastObj && Object.keys(lastObj).length > 0) {
                if (!lastObj.have_sub) {
                    if (!!lastObj.eid) {
                        this.setState({
                            storeId: lastObj.id,
                            mid: lastObj.mid,
                            eid: lastObj.eid
                        }, () => {
                            this._getEmpRewardList();
                        })
                    } else {
                        if (!!lastObj.go_flag) {
                            this.setState({
                                storeId: lastObj.id,
                                mid: lastObj.mid,
                                eid: lastObj.eid
                            }, () => {
                                this._getEmpRewardList();
                            })
                        } else {
                            this.setState({
                                storeId: lastObj.id,
                                mid: lastObj.mid
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

    _renderRewardContent() {
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
            <div className="bonus-list" style={{ padding: '.5rem .3rem 0'}}>
                {
                    this.storeParams.length>0&&isEnd&&
                    <div className="overlay level-two"></div>
                }
                {
                    this.storeParams.length>0&&
                    <div className="overlay level-one"></div>
                }
                {
                    this.storeParams.length > 0&&<div className="classify overlay-dowm"
                        onClick={() => this._backRewardList()}>
                        <span><i></i>{rewardListData.m_name}</span>
                    </div>
                }
                <div className="total-count">
                    <p className="total"><span>商家总数：{this.state.sum1}家</span><span>注册用户总数：{this.state.sum2}人</span><span>投资用户总数：{this.state.sum3}人</span></p>
                </div>
                <div className="reward-content">
                {
                    this._renderRewardList(rewardList)
                }
                </div>
            </div>
        )
    }

    _renderRewardList() {
        return (
            <ul className="list-table">
                {
                    this._renderTableHead()
                }
                {
                    this._renderTableBody()
                }
            </ul>
        )
    }

    _renderTableHead(){
        let level = this.state.level;
        if (level == 1 || level == 2) {
            return (
                <li className="title-li">
                    <span>来源</span>
                    <span>邀请商家</span>
                    <span>邀请注册人数</span>
                    <span>邀请投资人数</span>
                    <span></span>
                </li>
            )
        }
        if (level == 4) {
            return (
                <li className="title-li">
                    <span style={{width : '25%'}}>来源</span>
                    <span style={{width : '25%'}}>邀请注册人数</span>
                    <span style={{width : '25%'}}>邀请投资人数</span>
                    <span style={{width : '25%'}}></span>
                </li>
            )
        }
        if (level == 3) {
            return (
                <li className="title-li">
                    <span style={{width : '25%'}}>来源</span>
                    <span style={{width : '25%'}}>用户手机</span>
                    <span style={{width : '25%'}}>注册日期</span>
                    <span style={{ width: '25%' }}>首投金额(元)</span>
                </li>
            )
        }
    }
    _getMerchantsByBDInfo() {
        let params = {
            bd_id: this.state.storeId,
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate()
        }
        api.getMerchantsByBDInfo(params).success((res) => {
            let data = res.data || {}
            this.setState({
                list: data.details || [],
                sum1: data.sum_merchants || 0,
                sum2: data.sum_registers || 0,
                sum3: data.sum_invites || 0,
                level: data.type
            })
        })
    }
    _getBDMerchantBdInfoList(uid) {
        let params = {
            mobile: this.state.mobile,
            uid,
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate(),
        }
        api.merchantBdInfo(params).success((res) => {
            let data = res.data || {}
            this.setState({
                list: data.details || [],
                // sum1: data.sum_merchants || 0,
                // sum2: data.sum_registers || 0,
                // sum3: data.sum_invites || 0,
                level: data.type
            })
        })
    }

    _getBDMerchantList(bd_id, type) {
        let params = {
            mobile: this.state.mobile,
            bd_id,
            type,
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate(),
        }
        api.getMerchantDetailssByBD(params).success((res) => {
            let data = res.data || {}
            this.setState({
                list: data.details || [],
                // sum1: data.sum_merchants || 0,
                // sum2: data.sum_registers || 0,
                // sum3: data.sum_invites || 0,
                level: data.type
            })
        })
    }
    _getBDMerchantDetails(name) {
        api.getBDMerchantDetails({name}).success((res) => {
            let data = res.data || {}
            this.setState({
                list: data.details || [],
                sum1: data.sum_merchants || 0,
                sum2: data.sum_registers || 0,
                sum3: data.sum_invites || 0,
                level: data.type
            })
        })
    }
    // 一级、二级
    _getBFMerchantList(bx_id) {
        let params = {
            mobile: this.state.mobile,
            bx_id: (bx_id || this.state.bx_id) || '',
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate(),
        }
        api.bdGetMerchantDetails(params).success((res) => {
            let data = res.data || {}
            this.setState({
                list: data.details || [],
                sum1: data.sum_merchants || 0,
                sum2: data.sum_registers || 0,
                sum3: data.sum_invites || 0,
                level: data.type
            })
        })
    }

    // 三级
    _getMerchantDetails(bx_id) {
        let params = {
            mobile: this.state.mobile,
            bx_id: (bx_id || this.state.bx_id) || '',
            type: this.state.type,
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate(),
        }
        api.getMerchantDetailssByBD(params).success((res) => {
            let data = res.data || {}
            this.setState({
                list: data.details || [],
                // sum1: data.sum_merchants || 0,
                // sum2: data.sum_registers || 0,
                // sum3: data.sum_invites || 0,
                level: data.type
            })
        })
    }

    // 四级
    _getMerchantUserDetails(merchant_id) {
        let params = {
            mobile: this.state.mobile,
            merchant_id: (merchant_id || this.state.merchant_id) || '',
            start_date: this.state.startTime ? this.state.startTime : this._defaultDate(),
            end_date: this.state.endTime ? this.state.endTime : this._defaultDate(),
        }
        api.getBDMerchantDetails(params).success((res) => {
            let data = res.data || {}
            this.setState({
                list: data.details || [],
                // sum1: data.sum_merchants || 0,
                // sum2: data.sum_registers || 0,
                // sum3: data.sum_invites || 0,
                level: data.type
            })
        })
    }

    _renderTableBody() {
        let list = this.state.list;
        let level = this.state.level;
        let type = this.state.type;
        console.log(level, type)
        if (level == 1 || level == 2) {
            return list && list.length > 0 && list.map((item, i) => {
                return (
                    <li key={'reward' + i}>
                        <span className={`${i == 0 && 'active'}`}>{item.name}</span>
                        <span className={`${i == 0 && 'active'}`}>{item.invite_merchants}</span>
                        <span className={`${i == 0 && 'active'}`}>{item.invite_registers}</span>
                        <span className={`${i == 0 && 'active'}`}>{item.invite_invites}</span>
                        <span className={`${i == 0 && 'active'}`} onClick={()=>{
                            // if (item.type == 1) {
                            //     this.setState({ type: 2 }, () => {
                            //         this._getBFMerchantList(item.id)//一级到二级
                            //     })
                            // } else {
                            //     this.setState({ type: 3 }, () => {
                            //         this._getMerchantDetails(item.id)//二级到三级
                            //     })
                            // }
                            if(this.state.level == 1) {
                                this._getBDMerchantList(item.id, item.type)//一级到二级
                            }else if(this.state.level == 2) {
                                this._getBDMerchantBdInfoList(item.uid)
                            }
                        }}>查看明细</span>
                    </li>
                )
            })
        }
        if (level == 4) {
            return list && list.length > 0 && list.map((item, i) => {
                return (
                    <li key={'reward' + i}>
                        <span className={`${i == 0 && 'active'}`} style={{ width: '25%' }}>{item.name}</span>
                        <span className={`${i == 0 && 'active'}`} style={{ width: '25%' }}>{item.invite_registers}</span>
                        <span className={`${i == 0 && 'active'}`} style={{ width: '25%' }}>{item.invite_invites}</span>
                        <span className={`${i == 0 && 'active'}`} style={{ width: '25%' }} onClick={() => {
                            console.log(item)
                            this.setState({ type: 4 }, () => {
                                this._getMerchantUserDetails(item.id)//三级到四级
                            })
                        }}>查看明细</span>
                    </li>
                )
            })
        }
        if (level == 3) {
            return list && list.length > 0 && list.map((item, i) => {
                    return (
                        <li key={'reward' + i}>
                            <span style={{width : '25%'}} className={`${i == 0 && 'active'}`}>{item.name}</span>
                            <span style={{ width: '25%' }}>{item.mobile}</span>
                            <span style={{ width: '25%' }}>{item.time}</span>
                            <span style={{ width: '25%' }}>{item.money}</span>
                        </li>
                )
            })
        }
        return null;
    }

    _onChangeMobile(e) {
        let mobile = e.target.value;
        // if(mobile.length > 11) return;
        this.setState({mobile}, () => {
            this._getBDMerchantDetails(mobile);
        })
    }

    _renderSearchBox() {
        return (
            <header className="base-search-bar">
                <span className="base-search-text base-search-text-fill">
                    <input type="text" placeholder="搜索商户名称" 
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
                {this._renderRewardContent()}
                {
                    (this.state.isMaskTabOne || this.state.isMaskTabThree) &&
                    <div className="mask mask-zindex" onClick={() => this._hideMaskPopup()}></div>
                }
                {this.state.isMask && <div className="mask"></div>}
                {this.state.isSearchMask && <div className="mask search-zindex"></div>}
            </div>
        );
    }
}
