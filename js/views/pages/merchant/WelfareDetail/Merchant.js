'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class Merchant extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            showMore: false
        }
    }
    _gotoMerchant(id){
        this.getScreen().getNavigation().navigate('MerchantDetail',{id})
    }
    _renderItem(merchantList, showMore) {
        let l = merchantList.length;

        return merchantList.map( (merchant,i)=> {
            if(!showMore&&i>=1){
                return null;
            }
            return (
                <div 
                    key={i}
                    className='s-merchant-item'>
                    <div className='picture'>
                        <img src={merchant.logo} />
                    </div>
                    <h3 className='title'>
                        {merchant.merchant_name}
                        <i className='distance'>
                            {merchant.distance}km
                        </i>
                    </h3>
                    <p className='area'>
                        {`${merchant.provice} ${merchant.city + merchant.area + merchant.address}`}
                    </p>
                    <p 
                        onClick={()=>this._gotoMerchant(merchant.mid)}
                        className='sell'>
                        <span>共{merchant.coupon_count}个福利</span>
                    </p>
                </div>
            );
        })
    }
    render() {
        let { merchantList } = this.props;
        let { showMore } = this.state;
        if (merchantList.length < 1) {
            return null;
        }
        let l = merchantList.length;
        return (
            <div className={`s-merchant-list ${Boolean(window.LEXIAO_APP)&&'s-merchant-app-list'}`}>
                <div className='s-merchant-header'>
                    <h2>适用商家</h2>
                </div>
                {this._renderItem(merchantList, showMore)}
                {
                    (!showMore && l > 1 && <div 
                                                onClick={()=>this.setState({showMore:true})}
                                                className='s-merchant-footer'>查看全部{l}家商户
                                                <i></i>
                                            </div>) || null
                }
            </div>
        );
    }
}

export default Merchant;