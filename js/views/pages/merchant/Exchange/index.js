'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import coupon from './../../../../util/coupon';
import api from './../../../../controllers/api'
class Exchange extends ScreenComponent {
    static pageConfig = {
        path: '/exchange',
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title:'兑换福利券',
        }
        this.state={
            value:1,
            info:null
        }
    }
    componentDidMount() {
        this._getData();
    }
    
    _getData(){
        let {
            id,
            source_type='index'
        }=this.getScreen().getNavigation().state.params;
        api.couponInfo({ coupon_id:id, source_type }).success((content, next, abort) => {
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
    _doExchange=()=>{
        let info = this.state.info;
       this.getScreen().alert({
           title:'积分兑换',
           message:`兑换${info.merchant_name}${coupon.nameByType(info.type)}${info.discount_amount}元，共${this.state.value}张，花费${info.coupon_point*this.state.value}积分`,
           buttons:[
               {
                   text:'取消'
               },
               {
                   text:'确认兑换',
                   onPress:this._exchange
               }
           ]
       })

    }
    _exchange=()=>{
        let {
            id,
        }=this.getScreen().getNavigation().state.params;
        api.exchangeCoupon({
            coupon_id:id,
            num:this.state.value
        }).success((content,next,abort)=>{
            this.state.mid = content.data.mid;
            this.getScreen().alert({
                title:'兑换成功',
                message:this._successMessage(),
                buttons:[
                    {
                        text:'去查看',
                        onPress:this._gotoCheck
                    },
                    {
                        text:'去使用',
                        onPress:this._gotoUse
                    }
                ]
            })
        })
    }
    _successMessage(){
        let info = this.state;
        return (
            <span className='exchange_success_message'>
                请进入
                <span>"账户"-->"我的福利"</span>
                中查看已领取的福利
            </span>
        ); 
    }
    _gotoCheck=()=>{
        this.getScreen().getNavigation().navigate('Welfare')
    }
    _gotoUse=()=>{
        // this.getScreen().getNavigation().navigate('MerchantDetail',{
        //     id:this.state.mid
        // })
        var { params } = this.getScreen().getNavigation().state;
        this.getScreen().getNavigation().navigate('SelectMerchant',{
            coupon_id:params.id
        });
    }
    _onInpuChange=(e)=>{
        let {nativeEvent} = e;
        let value = nativeEvent.target.value;
        this.setState({value});
    }
    _divi=()=>{
        let {value}=this.state;
        value = parseInt(value);
        value--;
        if(value<1){
            value=1;
        }
        this.setState({value});
    }
    _add=()=>{
        let {value}=this.state;
        value = parseInt(value);
        value++;
        this.setState({value});
    }
    _couponName(merchant,type){
        return merchant+' '+coupon.nameByType(type);
    }
    _DealDetails(info){
        return(
            <div className='deal-item'>
                <div className='picture'><img src={info.logo} /></div>
                <div className='right'>
                    <div className='amount'><i>¥</i>{info.discount_amount}</div>
                </div>
                <p className="deal-name">{this._couponName(info.merchant_name,info.type)}</p>
                {info.type!='1'&&<p className="deal-moeny">满{info.need_amount}可用</p>}
                <p className="deal-time">有效期至：{info.end_time}</p>
            </div>
        )
    }
  
    //购买
    _DealInfo(info){
        return(
            <div className="deal-content-wrapper">
                <div className="content-info-line">
                    购买数量
                    <div className="operate">
                        <button 
                            type="button" 
                            className="btn minus"
                            onClick={this._divi}
                            >
                            -
                        </button>
                        <input 
                            type="text" 
                            className="number" 
                            onChange={this._onInpuChange}
                            value={this.state.value}/>
                        <button 
                            type="button" 
                            className="btn add"
                            onClick={this._add}
                            >
                            +
                        </button>
                    </div>
                </div>
                <div className="content-info-line">
                    我的积分
                    <span className="deal-price">{info.user_point}</span>
                </div>
                <div className="content-info-line">支付积分
                    <span className="amount">{info.coupon_point*this.state.value}</span>
                </div>
            </div>
        )
    }
    _DealBtn(info){
        return(
            <div className="pay-wrap">
                <a 
                    onClick={this._doExchange}
                    href='javascript:void(0)'
                    className="button">确认兑换</a>
            </div>
        )
    }
    render() {
        let {info}=this.state;
        if(!info){
            return null;
        }
        return (
            <div>
                {this._DealDetails(info)}
                {this._DealInfo(info)}
                {this._DealBtn(info)}
            </div>
            
        );
    }
}

export default Exchange;