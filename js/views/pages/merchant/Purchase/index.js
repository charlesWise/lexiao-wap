'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Coupon from './Coupon';
import math from './../../../../util/math';
import api from './../../../../controllers/api';
import pay from './../../../../controllers/pay';


function moveEnd(target) {
    let l = target.value.length;
    let type = target.type;
    // target.selectionStart = target.selectionEnd = l;
    setTimeout(()=>{
        target.type = 'text';
        target.setSelectionRange(l,l);
        target.type = type;

    });
}
class Purchase extends ScreenComponent {
    static pageConfig = {
        path: '/purchase',
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '买单'
        }
        this.state = {
            value: '',
            amount: undefined,
            num: undefined,
            coupon: undefined,
            money: undefined
        }
    }
    componentWillUpdate(nextProps, nextState) {
    }

    componentDidMount() {
        this._getUseCouponCount();
    }
    receive(from, item) {
        if (from === 'CouponList' && item) {
            if(item.money){
                this.setState({
                    coupon: item
                })
            }
        }
    }
    _getCoupon(money) {
        let navigation = this.getScreen().getNavigation();
        let { params } = navigation.state;

        api.getMerchantCouponByMoney({
            merchant_id: params.merchant_id,
            status: 1,
            money: money || 0
        }).success((content, next, abort) => {
            let list = content.data.list || [];
            let coupon = this.state.coupon || {};
            let clearCoupon = true;
            for (let i = 0, l = list.length; i < l; i++) {
                let c = list[i];
                if (coupon.coupon_id === c.coupon_id) {
                    clearCoupon = false;
                }
            }
            if (clearCoupon) {
                coupon = undefined;
            }
            this.setState({
                num: list.length || undefined,
                coupon
            });
        })
    }
    _getUseCouponCount() {
        let navigation = this.getScreen().getNavigation();
        let { params } = navigation.state;
        api.getUseCouponCount({
            merchant_id: params.merchant_id
        }).success((content, next, abort) => {
            this.setState({
                num: content.data.count,
            });
        });
    }
    _getDefCoupon(money) {
        let navigation = this.getScreen().getNavigation();
        let { params } = navigation.state;
        api.getDefCoupon({
            merchant_id: params.merchant_id,
            money: money || 0
        }).success((content, next, abort) => {
            let coupon =  content.data;
            let clearCoupon = false;
            if (clearCoupon) {
                coupon = undefined;
            }
            if(Array.isArray(coupon)){
                coupon = undefined;
            }
            this.setState({
                coupon
            });
        })
    }
    _onSelectCoupon = () => {
        let navigation = this.getScreen().getNavigation();
        let { params } = navigation.state;
        this.getScreen().getNavigation().navigate('CouponList', { merchant_id: params.merchant_id, money: this.state.money,isSelectMode:true,selectedId:this.state.coupon&&this.state.coupon.coupon_id||'' })
    }
    _alertFar() {
        this.getScreen().alert({
            title: '温馨提示',
            message: <span>您可能不在本店内请到店<br />
                与服务员确认金额后再付款</span>,
            buttons: [
                {
                    text: '取消'
                },
                {
                    text: '确认支付',
                    onPress: this._doPay
                }
            ]
        })
    }
    _onInputChange = (e) => {
        let { target } = e.nativeEvent;
        let value = target.value;
        if (/\.[\d]{3,}/.test(value)) {
            value = Number(value).toFixed(2);
        }
        this.setState({
            money: value,
            value
        });
        this._getDefCoupon(value);
    }
    _money(money, coupon) {
        let realMoney = money || 0;
        if (coupon && coupon.money) {
            realMoney = math.minus(realMoney, coupon.money);
        }
        if (realMoney < 0) {
            realMoney = 0;
        }
        return realMoney;
    }
    _doPay = () => {

    }
    _pay = () => {
        let { coupon = {}, money } = this.state;
        let active = money !== '' && money !== undefined;
        if (active) {
            this._checkOrder();
        }
    }
    _renderMoney(money, coupon) {
        if(!money){
            return '';
        }

        return '￥' + this._money(money, coupon);
    }
    _checkOrder() {
        let { coupon = {}, money } = this.state;
        let navigation = this.getScreen().getNavigation();
        let { params } = navigation.state;
        let coupon_id = coupon.coupon_id;
        // if(coupon_id){
        //     coupon_id = '';
        // }
        api.checkOrder({
            coupon_id: coupon.coupon_id || '',
            money,
            merchant_id: params.merchant_id
        }).success((content, next, abort) => {
            var state = {
                money,
                merchant_id: params.merchant_id
            }
            if (coupon.coupon_id) {
                state.coupon_id = coupon.coupon_id;
            }
            api.makeOrder({
                coupon_id: coupon.coupon_id || '',
                merchant_id: params.merchant_id,
                money
            }).success((content, next, abort) => {
                this.getScreen().getNavigation().navigate('PaymentOrder', {
                    order_id: content.data.order_id,
                    merchant_id: params.merchant_id
                });
                next();
            })
            next();
        })
    }
    render() {
        let { coupon = {}, money ,num} = this.state;
        let active = money !== '' && money !== undefined;
        if(!active){
            coupon = {};
        }
        if(money && !coupon.money){
            num = undefined;
        }
        num = num == '0'?undefined:num;
        return (
            <div className="cashier-container">
                <div className="purchase">
                    <div className="amount-total">
                        <div className="label">消费总额：</div>
                        <input
                            type="number"
                            className="amount"
                            maxLength="7"
                            value={this.state.value}
                            onFocus={({ nativeEvent: { target } }) => moveEnd(target)}
                            onChange={this._onInputChange}
                            placeholder="询问服务员后输入" />
                    </div>
                </div>
                <div className="more-pay">
                    <Coupon
                        num={num}
                        amount={coupon.money}
                        type={coupon.coupon_type}
                        onSelect={this._onSelectCoupon}
                    />
                    <div className="more-pay-price">
                        <label>实付金额</label>
                        <span className="">{this._renderMoney(money, coupon)}</span>
                    </div>

                </div>
                <div
                    className="pay-wrap">
                    <a
                        href='javascript:'
                        onClick={active ? this._pay : undefined}
                        className={active ? "btn-pay active" : "btn-pay"}>确认买单</a>
                </div>
            </div>
        );
    }
}

export default Purchase;