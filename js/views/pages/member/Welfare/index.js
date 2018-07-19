
'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

import api from './../../../../controllers/api';
import coupon from './../../../../util/coupon'

class Welfare extends ScreenComponent {
    static pageConfig = {
        path: '/member/welfare',
        permission: true
    }

    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '我的福利'
        }
        this.state = {
            status: 1, // 优惠卷分类 1 未使用 2 已使用 3 过期
            list: [],
            page: 0,
            isLoading: false,
            totalPage: 0
        }
        this._onScroll = this._onScroll.bind(this);
    }

    componentDidMount() {
        this._getList(1, 1);
        this.container.addEventListener("scroll", this._onScroll, false);
    }

    componentWillUnmount() {
        this.container.removeEventListener("scroll", this._onScroll, false);
    }

    _getList(page, status){
        this.setState({
            status: status || 1,
            isLoading: true
        });
        api.CouponList({
            page: 1,
            coupon_status: status || 1
        }).success((content) => {
            let list = content.data && content.data.list;
            let pageObj = content.data && content.data.page;
            this.setState({
                list: list || [],
                totalPage: pageObj.total_page,
                page: parseInt(pageObj.curent_page),
                isLoading: false
            })
        }).error((content) => {
            console.log('onerror>>>>', content)
            this.getScreen().toast(content.message, 3000);
            this.setState({ isLoading: false });
        })
    }

    _onScroll() {
        console.log('scroll')
        let scrollTop = this.container.scrollTop;
        let scrollHeight = this.container.scrollHeight;
        let clientHeight = this.container.clientHeight;
        if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            !this.state.isLoading &&
            this.state.totalPage > this.state.page
        ) {
            this._getList(++this.state.page, this.state.status);
        }
    }

    _NotRecord() {
        return (
            <div className='not-record'><img src='/icon/icon_not_record.png' /><span>暂无福利记录</span></div>
        )
    }

    _getLabels(status){
        switch (status) {
            case '1':
                return {
                    time: '有效期至',
                    type: ''
                }
                break;
            case '2':
                return {
                    time: '消费时间',
                    type: '已消费'
                }
                break;
            case '3':
                return {
                    time: '过期时间',
                    type: '已过期'
                }
                break;
            default:
                return {}
                break;
        }
    }

    _goDetail(data){
        this.getScreen().getNavigation().navigate('WelfareDetail',{
            id: data.coupon_temp_id,
            source_type: 'list',
            uc_id: data.id
        })
    }
    _gotoUse(item){
        this.getScreen().getNavigation().navigate('SelectMerchant', {
            coupon_id: item.coupon_temp_id,
            type: 2
        })        
    }
    _couponName(merchant,type){
        return merchant+' '+coupon.nameByType(type);
    }
    _WelfareList(list) {
        return (
            <div className='welfare-list'>
                {
                    list.map((item, index)=>{
                        return (
                            <div 
                                style={{position:'relative'}}
                                onClick={this._goDetail.bind(this, item)} key={index} className={item.status == 1 ? 'welfare-item' : 'welfare-item -disabled'}>
                                <div style={{position:'relative',height: '2.5rem',marginBottom:'1.1rem'}}>
                                    <div className='picture'>
                                        <img src={item.merchant_logo} />
                                    </div>
                                    <div
                                        style={{position:'relative',height:'100%',display: 'inline-block',width:'8rem',marginLeft:'0.3rem'}}>
                                        <h3 
                                            style={{position:'absolute',top:0,paddingTop:0}}
                                            className='title'
                                            >{this._couponName(item.merchant_name,item.coupon_type)}</h3>
                                        <div style={{position:'absolute',bottom:'-2px'}}>
                                        <div className='amount'><i>¥</i>{item.money}
                                            {
                                                item.coupon_type == 2 &&
                                                <p className='condition'>（满{item.man}可用）</p>
                                            }
                                        </div>
                                        </div>
                                    </div>
                                    {item.status == 1?<div 
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            this._gotoUse(item);
                                        }}
                                        className="welfare_btn">去使用</div>:null}
                                </div>
                                <div className='describe'>
                                    <span className='time'>{this._getLabels(item.status).time}：{item.end_time}</span>
                                    <span className='status'>{this._getLabels(item.status).type}</span>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    (this.state.totalPage <= this.state.page) && this.state.list.length < 1 &&
                    <div className='done-tips'>没有更多了~</div>
                }
            </div>
        )
    }

    render() {
        let list = this.state.list;
        return (
            <div style={{overflow: 'scroll'}} className='tabs'>
                <ul className='tab-nav'>
                    <li onClick={this._getList.bind(this, 1, 1)} className={this.state.status == 1 ? 'tab-nav-item -active' : 'tab-nav-item'}>未消费</li>
                    <li onClick={this._getList.bind(this, 1, 2)} className={this.state.status == 2 ? 'tab-nav-item -active' : 'tab-nav-item'}>已消费</li>
                    <li onClick={this._getList.bind(this, 1, 3)} className={this.state.status == 3 ? 'tab-nav-item -active' : 'tab-nav-item'}>已过期</li>
                </ul>
                <div className='tab-panel' ref={ref => (this.container = ref)}>
                    {
                        list && list.length > 0 ?
                            this._WelfareList(list)
                            :
                            this._NotRecord()
                    }
                </div>
            </div>
        )
    }
}

export default Welfare;   