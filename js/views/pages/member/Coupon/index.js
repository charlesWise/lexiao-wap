'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';

export default class CouponIndex extends ScreenComponent {
    static pageConfig = {
        path: '/member/coupon',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '福利券管理'
        }
        this.state = {
            status: 1, //请求 status 枚举值 1、发布中 2、待审核 3、已结束  4、草稿 //响应 status 枚举值1-草稿；2-待平台审核；3-待商户审核 ; 4-下发修改；5-发布中；6-已结束'
            list: []
        }
    }

    componentDidMount() {
        this._getList();
    }

    receive(from,data) {
        // console.log(from,data)
        // if (!data.refresh) return;
        // if (from == 'CouponDetail') {
        //     this._getList(3);
        // } else {
            this._getList(this.state.status);
        // }
    }

    _getList(status) {
        // if (status == this.state.status) return;
        this.setState({
            status: status || 1
        });
        api.couponList({
            status: status || 1
        }).success((content) => {
            console.log('onsuccess>>>>', content)
            let list = content.data;
            this.setState({
                list: list || []
            })
        }).error((data) => {
            this.getScreen().toast(data.message)
        })
    }

    _NotRecord() {
        return (
            <div className='not-record'><img src='/icon/icon_not_record.png' /><span>暂无福利券记录</span></div>
        )
    }

    _CouponList(list){
        return(
            <div className='coupon-list'>

                {
                    list.map((item, index) => {
                        return <ListItem key={index} data={item}/>
                    })
                }
            </div>
        )
    }

    render() {
        let list = this.state.list;
        let user = JSON.parse(localStorage.getItem('MLUX_STORAGE_user')) || {};
        let auth = user.auth || [];
        let index = _.findIndex(auth, function (o) { return o['code'] == 'MERCHANT_COUPON_ADD'; });//发布福利券
        return (
            <div className='coupon tabs -notborder -fixed'>
                <ul className='tab-nav'>
                    <li onClick={this._getList.bind(this,1)} className={this.state.status == 1 ? 'tab-nav-item -active' : 'tab-nav-item'}>发布中</li>
                    <li onClick={this._getList.bind(this,2)} className={this.state.status == 2 ? 'tab-nav-item -active' : 'tab-nav-item'}>待审核</li>
                    <li onClick={this._getList.bind(this,3)} className={this.state.status == 3 ? 'tab-nav-item -active' : 'tab-nav-item'}>已结束</li>
                    <li onClick={this._getList.bind(this,4)} className={this.state.status == 4 ? 'tab-nav-item -active' : 'tab-nav-item'}>草稿</li>
                </ul>
                <div className='tab-panel'>
                    {
                        list && list.length > 0 ?
                            this._CouponList(list)
                            :
                            this._NotRecord()
                    }
                </div>
                <div className='fixed-bottom'>
                    <a href="#/member/coupon/record">福利券消费记录</a>
                    {index != -1 && <a href="#/member/coupon/add">添加福利券</a>}
                </div>
            </div>
        )
    }
}

class ListItem extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {}//响应 status 枚举值1-草稿；2-待平台审核；3-待商户审核 ; 4-下发修改；5-发布中；6-已结束'
    }

    _getBgClass(data){
        if(data.status == 6){
            return 'coupon-list-item -disabled';
        }else{
            if (data.coupon_type == 2){
                return 'coupon-list-item';
            }else{
                return 'coupon-list-item -red';
            }
        }
    }

    _getLabel(status) {
        if (status == 2) {
            return '待平台审核'
        }
        if (status == 3) {
            return '待商户审核'
        }
        if(status == 4){
            return '审核驳回'
        }
    }

    _goDetail(data){
        this.getScreen().getNavigation().navigate('CouponDetail', {
            coupon_id: data.coupon_id
        })
    }

    _goEdit(data) {
        this.getScreen().getNavigation().navigate('CouponEdit', {
            coupon_id: data.coupon_id
        })
    }

    _goCheck(data) {
        this.getScreen().getNavigation().navigate('CouponCheck', {
            coupon_id: data.coupon_id
        })
    }

    render() {
        let data = this.props.data || {}
        let user = JSON.parse(localStorage.getItem('MLUX_STORAGE_user')) || {};
        let info = user.info || {};
        let auth = user.auth || [];
        let index = _.findIndex(auth, function (o) { return o['code'] == 'MERCHANT_COUPON_CHECK'; });//福利卷审核
        return (
            <div className={this._getBgClass(data)} onClick={(e) => { 
                e.stopPropagation();
                this._goDetail(data)
            }}>
                <div className='main'>
                    <h3 className='title'>{data.merchant_name}</h3>
                    <p className='time'>有效期至：{data.end_time}</p>
                    <dl className='sum'>
                        <dt>¥<span>{data.coupon_money}</span></dt>
                        <dd>{
                            data.coupon_type == 1 ? '' : `满${data.man}可用`
                        }</dd>
                    </dl>
                </div>
                <div className='prop'>
                    <div className='prop-item'>发行量：<span>{data.total_num || 0}</span>张</div>
                    <div className='prop-item'>已领取：<span>{data.send_num || 0}</span>张</div>
                    <div className='prop-item'>已消费：<span>{data.used_num || 0}</span>张</div>
                </div>
                {
                    data.status == 5 &&
                    <div className='control'>
                        <span></span>
                        <span>
                            <button onClick={this._goDetail.bind(this,data)} className='btn-control'>下架</button>
                        </span>
                    </div>
                }
                {
                    data.status == 6 &&
                    <div className='control'>
                        <span></span>
                        <span>
                            <button onClick={this._goDetail.bind(this, data)} className='btn-control'>已结束</button>
                        </span>
                    </div>
                }
                {
                    (data.status == 1 || data.status == 2 || data.status == 3 || data.status == 4) &&
                    <div className='control'>
                        <span
                            style={data.status == 4 ? {
                                color: 'rgb(255, 0, 0)'
                            } : {}}
                        >{this._getLabel(data.status)}</span>
                        <span>
                            {
                                data.status != 2 &&
                                <button className='btn-control' onClick={(e)=>{
                                    e.stopPropagation()
                                    this._goEdit(data)
                                }}>编辑</button>
                            }
                            {
                                (data.status == 3 && index != -1) &&
                                <button onClick={(e) => {
                                    e.stopPropagation()
                                    this._goCheck(data)
                                }} style={{ marginLeft: '0.5rem' }} className='btn-control'>审核</button>
                            }
                        </span>
                    </div>
                }
            </div>
        )
    }
}