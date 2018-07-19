'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import Swiper from './../../../components/Swiper';
import Banner from './Banner';
import WelfareInfo from './WelfareInfo';
import Merchant from './Merchant';
import BuyBar from './BuyBar';
class WelfareDetail extends ScreenComponent {
    static pageConfig = {
        path: '/merchant/welfaredetail',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '福利券'
        }
        this.state = {
            info: {}
        }
    }

    componentDidMount() {
        this._getData();
    }
    _getData() {
        let { id: coupon_id, source_type = 'index',uc_id='',stype } = this.getScreen().getNavigation().state.params;
        if (!coupon_id) {
            this.getScreen().alert('无此优惠券信息')
        }
        api.couponInfo({ coupon_id, source_type,uc_id,stype:stype||'' }).success((content, next, abort) => {
            if (!content.data) {
                this.getScreen().alert({
                    message: '无此优惠券信息'
                })
            }
            this.setState({
                info: content.data
            })
            next();
        })
    }

    render() {
        let { id: coupon_id, source_type = 'index',mid,shake_id} = this.getScreen().getNavigation().state.params;
        let fromIndex = source_type == 'index';
        let { info } = this.state;
        if (!info) {
            return <div></div>;
        }
        return (
            <div className='welfare-detail'>
                <Banner
                    dataSource={info.img} />
                <WelfareInfo
                    fromIndex={fromIndex}
                    info={info} />
                <Merchant 
                    merchantList={info.merchant||[]}/>
                {
                    Boolean(!window.LEXIAO_APP)&&source_type != 'list' &&
                    <BuyBar
                        fromIndex={fromIndex}
                        mid={mid}
                        id={shake_id}
                        {...info} />
                }
                {
                    Boolean(window.LEXIAO_APP)&&<div className="go-to-store"><p>请前往实体店领取</p></div>
                }
            </div>
        )
    }
}

export default WelfareDetail;