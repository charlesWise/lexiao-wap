'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import CountDown from './CountDown';
import api from './../../../../controllers/api';
import pay from './../../../../controllers/pay';

class PaymentOrder extends ScreenComponent {
    static pageConfig = {
        path: '/merchant/pay',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '支付订单'
        }
        this.state = {
            pay_way:'alipay'
        }
    }
    componentDidMount() {
        this._getOrderInfo();
    }
    _setPayWay(pay_way){
        this.setState({pay_way});
    }
    _getOrderInfo(){
        let navigation = this.getScreen().getNavigation();
        let {params} = navigation.state;
        api.getUserOrderInfo({
            order_id:params.order_id,
        }).success((content,next,abort)=>{
            this.setState(content.data)
        })
    }
    _pay=()=>{
        let navigation = this.getScreen().getNavigation();
        let {params} = navigation.state;
        let source = pay.getPaySourceByURL('/merchantdetail',params.merchant_id);
        pay.payDo(params.order_id,this.state.pay_way,source);
    }
    _renderMoney(money){
        money = money.toString().split('.');
        return (
            <p className='price'>
                ￥
                <span>
                    {money[0]}
                </span>
                {money[1]?'.'+money[1]:'.00'}
            </p>
        );
    }
    _isWeixin() {  
        var ua = navigator.userAgent.toLowerCase();  
        if(ua.match(/MicroMessenger/i)=="micromessenger") {  
            this.state.pay_way = 'weixin';
            return true;
        } else {  
            return false;  
        }  
    }
    render() {
        let {
            logo,
            merchant_name='肯德基',
            left_time,
            pay_money=0,
            pay_way
        }=this.state;
        let isWeixin = this._isWeixin();
        return (
            <div className='payment-await'>
                <div className='-avait-info'>
                    <dl className='time'>
                        <dt>支付剩余时间</dt>
                        <CountDown 
                            endTime={left_time}/>
                    </dl>
                    <div className='picture'>
                        <img src={logo} />
                    </div>
                    <h3 className='title'>
                        {merchant_name}
                    </h3>
                    {this._renderMoney(pay_money)}
                </div>
                <div className='payment-channel'>
                {
                    !isWeixin&&<div 
                        onClick={()=>this._setPayWay('alipay')}
                        className={pay_way==='alipay'?'-channel-item -selected':'-channel-item'}>
                        <i className='icon-payment'>
                            <img src='/icon/icon_alipay.png' />
                        </i>
                        <span className='title'>支付宝支付</span>
                    </div>
                }
                {
                    isWeixin&&<div 
                        onClick={()=>this._setPayWay('weixin')}
                        className={pay_way==='weixin'?'-channel-item -selected':'-channel-item'}>
                        <i className='icon-payment'>
                            <img src='/icon/icon_wechat.png' />
                        </i>
                        <span className='title'>微信支付</span>
                    </div>
                }
                </div>
                <div 
                    className='btn-wrap'
                    onClick={this._pay}>
                    <button className='btn-primary'>确认买单 ￥{Number(pay_money).toFixed(2)}</button>
                </div>

            </div>
        )
    }
}

export default PaymentOrder;   