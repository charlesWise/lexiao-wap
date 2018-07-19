'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import coupon from './../../../../util/coupon';

class ExcellentWelfare extends ScreenComponent {
    static pageConfig = {
        path: '/excellent',
    }
    constructor(...props) {
        super(...props);
        this.state = {
            data: []
        }
        this.navigationOptions = {
            title: '今日抽券'
        }
    }
    componentDidMount() {
        this._getData();
    }
    _getData() {
        api.welfare().success((content) => {
            let { data } = this.state;
            let { list } = content.data;
            if(list&&list.length>=1){
                data = data.concat(list);
                this.setState({ data });
            }
        })
    }
    _renderData() {
        let { data } = this.state;
        if (!data || data.length < 1) {
            return null
        }
        return data.map((item, i) => {
            return (
                <li
                    key={i}
                    onClick={()=>{
                        this.getScreen().getNavigation().navigate('WelfareDetail',{
                            id:item.coupon_id,
                            source_type:'index',
                            shake_id:item.id
                        })
                    }}
                    className="voucher_bg">
                    <div className="voucher_cont">
                        <img src={item.logo||'/images/welfare/coupon_icon_default.png'} />
                        <div className="voucher_fr">
                            <p className="vou_one">{item.name}{coupon.couponTypeName(item.type,item.coupon_palnt_type)}</p>
                            <p className="vou_red">￥ <em>{item.discount_amount}</em> {item.type!='1'&& <i>(满{item.need_amount}元可用)</i>}</p>
                            <p className="vou_hui">{
                                item.coupon_palnt_type!='1'?
                                item.category_name+' | '+item.distance+'km'
                                :'可投资'+item.time_limit+'天及以上项目'
                                }</p>
                            <p className="vou_bot">已领{item.sell_num}张／剩余 <em>{item.coupon_count}张</em></p>
                            <a
                                onClick={(e)=>e.stopPropagation()}
                                href={`#/shake:type=jp&id=${item.coupon_id}&source_type=index&shake_id=${item.id}`}
                                className="a_btn">立即领取
                            </a>
                        </div>
                    </div>
                </li>
            );
        })
    }
    render() {
        return (
            <div className="voucher">
                <ul>
                    {this._renderData()}
                </ul>
                <p className='done-tips'>没有更多了</p>
            </div>
        );
    }
}

export default ExcellentWelfare;