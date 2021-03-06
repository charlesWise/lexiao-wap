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

var scope_arr = [{
    id: "1",
    name: "全场适用"
}, {
    id: "2",
    name: "部分商品可用"
}];

var free_arr = [{
    id: "0",
    name: "是"
}, {
    id: "1",
    name: "否"
}];

var week = ['', '一', '二', '三', '四', '五', '六', '日'];

class CouponAdd extends ScreenComponent {
    static pageConfig = {
        path: '/bd/coupon/add',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '福利券管理'
        }
        this.state = {
            type: 2,
            scope: '1',
            scope_name: '全场适用',
            is_free: '0',
            free_name: '是',
            stores: {},
            store_name: '',
            mer_arr: [],
            merchant_id: '',
            mer_name: '',
            mids: '',
            refresh: false
        }
    }

    componentDidMount() {
        this._getBDMerchants();
        // this._getStores();
    }

    contribute() {
        return {
            refresh: this.state.refresh
        };
    }

    _getBDMerchants() {
        api.getBDMerchants({

        }).success((res) => {
            this.setState({
                mer_arr: res.data || []
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _showMer() {
        PICKER_ID = this.getScreen().showPopup({
            content: <Picker
                valueName='mid'
                dataSource={this.state.mer_arr}
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this._getStores(data.mid);
                    this.setState({
                        merchant_id: data.mid,
                        mer_name: data.name,
                        mer_logo: data.merchant_logo
                    })
                }}
            />
        })
    }

    _showScope() {
        PICKER_ID = this.getScreen().showPopup({
            content: <Picker
                dataSource={scope_arr}
                defaultValue={this.state.scope}
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this.setState({
                        scope: data.id,
                        scope_name: data.name
                    })
                }}
            />
        })
    }

    _showFree() {
        PICKER_ID = this.getScreen().showPopup({
            content: <Picker
                dataSource={free_arr}
                defaultValue={this.state.is_free}
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this.setState({
                        is_free: data.id,
                        free_name: data.name
                    })
                }}
            />
        })
    }

    _getStores(mid) {
        api.applicationStore({
            merchant_id: mid || ''
        }).success((res) => {
            this.setState({
                stores: res.data || []
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _showStores() {
        PICKER_ID = this.getScreen().showPopup({
            content: <StorePicker
                dataSource={this.state.stores}
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this.setState({
                        mids: data.ids,
                        store_name: data.names
                    })
                }}
            />
        })
    }

    _showWeek() {
        PICKER_ID = this.getScreen().showPopup({
            content: <WeekRange
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this.setState({
                        start: data.start,
                        end: data.end
                    })
                }}
            />
        })
    }

    _getWeekLabel(start, end) {
        if (!start || !end) return null;
        return '周' + week[start] + '至' + '周' + week[end]
    }

    _getWeek() {
        var arr = [];
        for (let i = this.state.start; i <= this.state.end; i++) {
            arr.push(i)
        }
        return arr.join(',')
    }

    _showDate(type) {
        PICKER_ID = this.getScreen().showPopup({
            content: <DatePicker
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    let date = data.year + '-' + data.month + '-' + data.day;
                    if (type == 1) {
                        this.setState({
                            use_time_end: date
                        })
                    } else {
                        this.setState({
                            show_time_end: date
                        })
                    }
                }}
            />
        })
    }

    _getTimeLabel(start, end) {
        if (!start || !end) return null;
        return start + ' 至 ' + end;
    }

    _showTime() {
        PICKER_ID = this.getScreen().showPopup({
            content: <TimePicker
                onCancel={() => {
                    this.getScreen().hidePopup(PICKER_ID)
                }}
                onSelected={(data) => {
                    this.getScreen().hidePopup(PICKER_ID)
                    this.setState({
                        need_time_start: data.start,//使用开始时段
                        need_time_end: data.end,//使用开始时段
                    })
                }}
            />
        })
    }

    _doSubmit(status) {
        let need_amount = this.refs.need_amount && this.refs.need_amount.value || '';
        let discount_amount = this.refs.discount_amount && this.refs.discount_amount.value || '';
        let publish_num = this.refs.publish_num && this.refs.publish_num.value || '';
        let scope = this.state.scope;
        let need_week = this._getWeek();
        let need_time_start = this.state.need_time_start || '';
        let need_time_end = this.state.need_time_end || '';
        let off_time = this.state.use_time_end || '';
        let show_time = this.state.show_time_end || '';
        let is_free = this.state.is_free;
        let merchant_id = this.state.merchant_id//商户id
        let merchant_ids = this.state.mids//适用门店 id
        let use_rule = this.refs.use_rule && this.refs.use_rule.value
        
        if(status == 2){
            if (this.state.type == 2) {
                if (!need_amount) {
                    this.getScreen().toast('请输入消费金额')
                    return;
                }
                if (!parseFloat(need_amount) || parseFloat(need_amount) <= 0) {
                    this.getScreen().toast('请输入正确的消费金额')
                    return;
                }
            }
            if (!discount_amount) {
                this.getScreen().toast('请输入优惠金额')
                return;
            }
            if (!parseFloat(discount_amount) || parseFloat(discount_amount) <= 0) {
                this.getScreen().toast('请输入正确的优惠金额')
                return;
            }
            if (!publish_num) {
                this.getScreen().toast('请输入发行数量')
                return;
            }
            if (!parseFloat(publish_num) || parseFloat(publish_num) <= 0) {
                this.getScreen().toast('请输入正确的发行数量')
                return;
            }
            if (!scope) {
                this.getScreen().toast('请选择适用范围')
                return;
            }
            if (!need_week) {
                this.getScreen().toast('请选择使用时间')
                return;
            }
            if (!need_time_start) {
                this.getScreen().toast('请选择使用时段')
                return;
            }
            if (!need_time_end) {
                this.getScreen().toast('请选择使用时段')
                return;
            }
            if (!off_time) {
                this.getScreen().toast('请选择有效期')
                return;
            }
            if (!show_time) {
                this.getScreen().toast('请选择平台展示期')
                return;
            }
            if (new Date(off_time) < new Date(show_time)) {
                this.getScreen().toast('有效期不能小于平台展示期')
                return;
            }
            if (!merchant_ids) {
                this.getScreen().toast('请选择适用门店')
                return;
            }
            if (!use_rule) {
                this.getScreen().toast('请输入使用规则')
                return;
            }
        }

        let param = {
            save_type: status, //保存类型
            type: this.state.type,//优惠卷类型            
            need_amount: this.refs.need_amount && this.refs.need_amount.value || '',//消费金额
            discount_amount: this.refs.discount_amount && this.refs.discount_amount.value || '',//减免金额
            publish_num: this.refs.publish_num && this.refs.publish_num.value,//发行数量
            scope: this.state.scope,//使用范围
            need_week: this._getWeek(),//使用时间（周）
            need_time_start: this.state.need_time_start || '',//使用开始时段
            need_time_end: this.state.need_time_end || '',//使用结束时段
            off_time: this.state.use_time_end,//有效期至
            show_time: this.state.show_time_end,//展示期
            is_free: this.state.is_free,//是否免费推广：1-是；2-不是
            merchant_id: this.state.merchant_id,//商户id
            merchant_ids: this.state.mids,//适用门店 id
            use_rule: this.refs.use_rule && this.refs.use_rule.value,//使用说明
            coupon_id: '',//优惠卷id
        }
        api.addCouponForMerchant(param).success((res) => {
            console.log('onsuccess>>>>', res)
            this.getScreen().alert({
                title: < span style={{ display: 'inline-block', fontSize: '0.9rem', marginTop: '1rem' }}>信息已提交</span >,
                message: status == 1 ? "福利券信息已保存为草稿" : "福利券信息已提交，等待审核",
                buttons: [
                    {
                        text: "我知道了",
                        onPress: () => {
                            // window.location.href = '#/bd/coupon'
                            this.state.refresh = true;
                            this.getScreen().getNavigation().goBack();
                        }
                    }
                ]
            });
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _Steps() {
        return (
            <div className='steps'>
                <div className='steps-item -current -active'>
                    <i className='icon'>1</i>
                    <span className='name'>提交</span>
                </div>
                <div className='steps-item'>
                    <i className='icon'>2</i>
                    <span className='name'>平台审核</span>
                </div>
                <div className='steps-item'>
                    <i className='icon'>3</i>
                    <span className='name'>发布</span>
                </div>
            </div>
        )
    }

    _AddCouponForm() {
        return (
            <div className='cell -right-line coupon-wrap'>
                <div className='cell-item time-area'>
                    <div className='-label'>选择商户</div>
                    <div className='-value' onClick={this._showMer.bind(this)}>
                        <a herf="javascript:;" style={this.state.mer_name ? { color: '#000' } : {}}>{this.state.mer_name || '选择商户'}</a>
                    </div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>优惠券类型</div>
                    <div className='-value coupon-select'>
                        <span onClick={() => { this.setState({ type: 2 }) }}><i className={this.state.type == 2 ? "icon-cell-act" : "icon-cell"}></i> 满减券</span>
                        <span onClick={() => { this.setState({ type: 1 }) }}><i className={this.state.type == 1 ? "icon-cell-act" : "icon-cell"}></i> 代金券</span>
                    </div>
                </div>
                {
                    this.state.type == 2 &&
                    <div className='cell-item'>
                        <div className='-label'>消费要求-满</div>
                        <div className='-value'><input ref='need_amount' type='text' placeholder='输入金额' /></div>
                    </div>
                }
                {
                    // this.state.type == 1 &&
                    <div className='cell-item'>
                        <div className='-label'>优惠金额-减</div>
                        <div className='-value'><input ref='discount_amount' type='text' placeholder='输入金额' /></div>
                    </div>
                }
                <div className='cell-item'>
                    <div className='-label'>发行数量</div>
                    <div className='-value'><input ref='publish_num' type='text' placeholder='输入发行数量' /></div>
                </div>
                <div className='cell-item time-area'>
                    <div className='-label'>适用范围</div>
                    <div className='-value' onClick={this._showScope.bind(this)}>
                        <a herf="javascript:;" style={this.state.scope_name ? { color: '#000' } : {}}>{this.state.scope_name}</a>
                    </div>
                </div>
                <div className='cell-item time-area'>
                    <div className='-label'>使用时间</div>
                    <div className='-value' onClick={this._showWeek.bind(this)}>
                        <a herf="javascript:;" style={this.state.start ? { color: '#000' } : {}}>{this._getWeekLabel(this.state.start, this.state.end) || '选择时间'}</a>
                    </div>
                </div>
                <div className='cell-item time-area'>
                    <div className='-label'>使用时段</div>
                    <div className='-value' onClick={this._showTime.bind(this)}>
                        <a herf="javascript:;" style={this.state.need_time_start ? { color: '#000' } : {}}>{this._getTimeLabel(this.state.need_time_start, this.state.need_time_end) || '选择时段'}</a>
                    </div>
                </div>
                <div className='cell-item  time-area'>
                    <div className='-label'>有效期至</div>
                    <div className='-value' onClick={this._showDate.bind(this, 1)}>
                        <a herf="javascript:;" style={this.state.use_time_end ? { color: '#000' } : {}}>{this.state.use_time_end || '选择日期'}</a>
                    </div>
                </div>
                <div className='cell-item time-area'>
                    <div className='-label'>平台展示期至</div>
                    <div className='-value' onClick={this._showDate.bind(this, 2)}>
                        <a herf="javascript:;" style={this.state.show_time_end ? { color: '#000' } : {}}>{this.state.show_time_end || '选择日期'}</a>
                    </div>
                </div>
                <div className='cell-item time-area'>
                    <div className='-label'>与平台结算</div>
                    <div className='-value' onClick={this._showFree.bind(this)}>
                        <a herf="javascript:;" style={this.state.free_name ? { color: '#000' } : {}}>{this.state.free_name}</a>
                    </div>
                </div>
                <div className='cell-item time-area'>
                    <div className='-label'>适用门店</div>
                    <div className='-value' onClick={this._showStores.bind(this)}>
                        <a herf="javascript:;" style={this.state.store_name ? { color: '#000' } : {}}>{this.state.store_name || '选择门店'}</a>
                    </div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>使用规则</div>
                    <div className='-value'><input ref='use_rule' type='text' placeholder='输入使用规则' /></div>
                </div>
            </div>
        )
    }

    _FixedBottomControl() {
        return (
            <div className='fixed-bottom-control'>
                <button onClick={this._doSubmit.bind(this,1)} className='btn-primary-hollow -gray'>保存草稿</button>
                <button onClick={()=>{ this.setState({ show: true }) }} className='btn-primary-hollow'>预览</button>
                <button onClick={this._doSubmit.bind(this,2)} className='btn-primary'>提交审核</button>
            </div>
        )
    }

    _previewCoupons() {
        return (
            <div className="coupons-preview-wrap" onClick={() => { this.setState({ show: false }) }}>
                <div className="coupons-preview">
                    <div className="title"><i className="icon-close"></i><p>优惠券预览</p></div>
                    <div className="coupons-list">
                        <ul>
                            <li>
                                <div className="coupons-info">
                                    <p><img src={this.state.mer_logo} /></p>
                                    <p>{this.state.store_name}{this.state.type == 2 ? '满减券' : '代金券'}</p>
                                    <p>
                                        <span>￥<i>{this.refs.discount_amount && this.refs.discount_amount.value}</i></span>
                                        {
                                            this.state.type == 2 &&
                                            <span>满{this.refs.need_amount && this.refs.need_amount.value}可用</span>
                                        }
                                    </p>
                                </div>
                                <div className="valid-term"><p>有效期至：{this.state.use_time_end} 00:00:00</p></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className='coupon-add'>
                <div className='addcoupon-form'>
                    {this._Steps()}
                    {this._AddCouponForm()}
                </div>
                {this._FixedBottomControl()}
                {
                    this.state.show &&
                    this._previewCoupons()
                }
            </div>
        )
    }
}

export default CouponAdd;