'use strict'
import React, { Component } from 'react';
import _ from 'lodash';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import Picker from './../../../components/Picker';
import WeekRange from './../../../components/WeekRange';
import DatePicker from './../../../components/DatePicker';
import TimePicker from './../../../components/TimePicker';
import StorePicker from './../../../components/StorePicker';

var PICKER_ID;
var popup;

var scope_arr = [{
    id: "1",
    name: "全场适用"
}, {
    id: "2",
    name: "部分商品可用"
}];

var free_arr = [{
    id: "1",
    name: "是"
}, {
    id: "0",
    name: "否"
}];

var week = ['', '一', '二', '三', '四', '五', '六', '日'];

export default class CouponCheck extends ScreenComponent {
    static pageConfig = {
        path: '/member/coupon/check',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '福利券管理',
            // onBack: navigation => {
            //     this.getScreen().alert({
            //         message: "您的驳回理由还未提交,确认离开",
            //         buttons: [
            //             { text: "取消" },
            //             {
            //                 text: "确定",
            //                 onPress: () => {
            //                     navigation.goBack();
            //                 }
            //             }
            //         ]
            //     });
            // }
        }
        this.state = {
            detail: {},//响应 status 枚举值1-草稿；2-待平台审核；3-待商户审核 ; 4-下发修改；5-发布中；6-已结束
            type: 2,
            scope: '1',
            scope_name: '全场适用',
            is_free: '0',
            free_name: '否',
            refresh: false
        }
    }

    componentDidMount() {
        this._getDetail();
    }

    contribute() {
        return {
            refresh: this.state.refresh
        };
    }

    _showReason() {
        popup = this.getScreen().showPopup({
            content: <Reason
                onClose={
                    (reason) => {
                        this._doCheck(0,reason)
                        this.getScreen().hidePopup(popup);
                    }
                }
            />
        })
    }

    _getDetail() {
        let navigation = this.getScreen().getNavigation();
        let { params } = navigation.state;
        api.viewCoupon({
            id: params.coupon_id
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            let data = res.data || {};
            this.setState({
                detail: data,
                coupon_id: data.id
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _doCheck(type,reason) {
        api.checkCoupon({
            type: type,
            id: this.state.coupon_id || '',//优惠卷id
            reason: reason || ''
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            // window.location.href = '#/member/coupon'
            this.state.refresh = true
            this.getScreen().getNavigation().goBack();
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _Steps(detail) {
        //响应 status 枚举值1-草稿；2-待平台审核；3-待商户审核 ; 4-下发修改；5-发布中；6-已结束
        return (
            <div className='steps'>
                <div className={['1', '2', '3', '4', '5', '6'].indexOf(detail.status) >= 0 ? 'steps-item -current -active' : 'steps-item'}>
                    <i className='icon'>1</i>
                    <span className='name'>提交</span>
                </div>
                <div className={['1','2','3','4'].indexOf(detail.status) >= 0 ? 'steps-item -current -active' : 'steps-item'}>
                    <i className='icon'>2</i>
                    <span className='name'>商户审核</span>
                </div>
                <div className={['2', '5', '6'].indexOf(detail.status) >= 0 ? 'steps-item -current -active' : 'steps-item'}>
                    <i className='icon'>3</i>
                    <span className='name'>平台审核</span>
                </div>
                <div className={['6'].indexOf(detail.status) >= 0 ? 'steps-item -current -active' : 'steps-item'}>
                    <i className='icon'>4</i>
                    <span className='name'>发布</span>
                </div>
            </div>
        )
    }

    _CouponProps(detail) {
        return (
            <div className='cell -right-line'>
                <div className='cell-item'>
                    <div className='-label'>优惠券类型</div>
                    <div className='-value'>{detail.type_name}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>消费要求-满</div>
                    <div className='-value'>{detail.need_amount}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>优惠金额-减</div>
                    <div className='-value'>{detail.discount_amount}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>发行数量</div>
                    <div className='-value'>{detail.publish_num}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>适用范围</div>
                    <div className='-value'>{detail.scope_name}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>使用时间</div>
                    <div className='-value'>{detail.week_need}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>有效期至</div>
                    <div className='-value'>{detail.use_time_end}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>平台展示期至</div>
                    <div className='-value'>{detail.show_time_end}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>与平台结算</div>
                    <div className='-value'>{detail.is_free == '0' ? '是' : '否'}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>适用门店</div>
                    <div className='-value'>{detail.store_name}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>使用规则</div>
                    <div className='-value'>{detail.use_rule}</div>
                </div>
            </div>
        )
    }

    _FixedBottomControl() {
        return (
            <div className='fixed-bottom-control'>
                <button onClick={this._showReason.bind(this)} className='btn-primary-hollow'>审核驳回</button>
                <button onClick={this._doCheck.bind(this, 1)} className='btn-primary'>审核通过</button>
            </div>
        )
    }

    render() {
        let detail = this.state.detail || {};
        return (
            <div className='coupon-add'>
                <div className='addcoupon-form'>
                    {this._Steps(detail)}
                    {this._CouponProps(detail) }
                </div>
                {this._FixedBottomControl()}
            </div>
        )
    }
}

class Reason extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
        }
    }

    _doSubmit() {
        let reason = this.refs.reason.value || '';
        if(!reason) return;
        this.props.onClose && this.props.onClose(reason)
    }

    render() {
        return <div className="popup" onClick={(e) => {
            e.stopPropagation();
        }}>
            <div className="TextPopup" style={{ bottom: '0rem' }}>
                <textarea ref='reason' type="text" placeholder="" onChange={(e) => {
                }}/>
                <a className="popup_btn" style={{ background: '#5294Ff'}} onClick={() => {
                    this._doSubmit()
                }}>提交</a>
            </div>
        </div>
    }
}
