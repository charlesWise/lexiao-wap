'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
class SelectMerchant extends ScreenComponent {
    static pageConfig = {
        path: '/member/welfare/selectmerchant',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '选择商户'
        }
        this.state = {
            data:[]
        }
    }
    componentDidMount() {
        this._getData();
    }
    
    _getData() {
        var params = this.getScreen().getNavigation().state.params || {};
        api.getMerchantByCoupon({
            coupon_id: params.coupon_id,
        }).success((content, next) => {
            this.setState({
                data:content.data||[]
            })
            next();
        });
    }
    _gotoPay(item){
        this.getScreen().getNavigation().navigate('Purchase',{merchant_id:item.mid})
    }
    _renderItems() {
        return this.state.data.map((item,index) => {
            return (
                <div 
                    key={index}
                    className='s-merchant-item'>
                    <div className='picture'>
                        <img src={item.logo} />
                    </div>
                    <h3 className='title'>
                        {item.merchant_name} 
                        <i className='distance'>
                            {item.distance}km
                        </i> 
                    </h3>
                    <p className='area'>
                        江浙菜 | {item.area}
                    </p>
                    <p className='sell'>
                        <button 
                            onClick={()=>this._gotoPay(item)}
                            className='btn-payment'>
                            去买单
                        </button>
                        已领{item.coupon_count}张
                    </p>
                </div>
            );
        })
    }
    render() {
        return (
            <div className='-bg-gray'>
                <div 
                    className='s-merchant-list'>
                    {this._renderItems()}
                    <div className="done-tips">没有更多了~</div>
                </div>
            </div>
        )
    }
}

export default SelectMerchant;   