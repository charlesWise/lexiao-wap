'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

export default class CouponDetail extends ScreenComponent {
    static pageConfig = {
        path: '/bd/coupon/detail',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '福利券详情'
        }
        this.state = {
            detail: {},//响应 status 枚举值1-草稿；2-待平台审核；3-待商户审核 ; 4-下发修改；5-发布中；6-已结束
            refresh: false
        }
    }

    componentDidMount() {
        this._getDetail();
    }
    
    _getDetail() {
        let navigation = this.getScreen().getNavigation();
        let { params } = navigation.state;
        api.bdCouponInfo({
            id: params.coupon_id
        }).success((res) => {
            console.log('onsuccess>>>>', res)
            this.setState({
                detail: res.data || {}
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _confirmUnpublish(id) {
        this.getScreen().alert({
            message: '确认下架该福利吗？',
            buttons: [
                {
                    text: '取消'
                },
                {
                    text: "确认",
                    onPress: () => {
                        this._unPublish(id);
                    }
                }
            ]
        });
    }

    contribute() {
        return {
            refresh: this.state.refresh
        };
    }

    _unPublish(id) {
        api.shelvesMerchant({
            coupon_id: id
        }).success((res) => {
            this.state.refresh = true;
            this.getScreen().toast('操作成功',2800,()=>{
                this.getScreen().getNavigation().goBack();
            })
        }).error((res) => {
            this.getScreen().toast(res.message)
        })
    }

    _CouponProps(detail){
        return(
            <div className='cell -right-line'
                style={detail.status == 6 ? { marginBottom: 0 } : {}}
            >
                <div className='cell-item'>
                    <div className='-label'>商家</div>
                    <div className='-value'>{detail.merchant_name}</div>
                </div>
                <div className='cell-item'>
                    <div className='-label'>优惠券类型</div>
                    <div className='-value'>{detail.type == 2 ? '满减券' : '代金券'}</div>
                </div>
                {
                    detail.type != 1 &&
                    <div className='cell-item'>
                        <div className='-label'>消费要求-满</div>
                        <div className='-value'>{detail.need_amount}</div>
                    </div>
                }
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
                {
                    detail.status == 5 &&
                    <div className='cell-control'>
                        <button onClick={this._confirmUnpublish.bind(this,detail.id)} className='btn-primary'>下架</button>
                    </div>
                }
            </div>
        )
    }
    render() {
        let detail = this.state.detail || {}
        return (
            <div className='coupon-detail'>
                {
                    !_.isEmpty(detail.reason) &&
                    <div className='coupon-msg -orange -tal'>驳回原因：{detail.reason}</div>
                }
                {
                    detail.status == 5 &&
                    <div className='coupon-msg'>发布中</div>
                }
                {
                    detail.status == 6 &&
                    <div className='coupon-msg -orange'>已结束</div>
                }
                {this._CouponProps(detail)}
            </div>
        )
    }
}
