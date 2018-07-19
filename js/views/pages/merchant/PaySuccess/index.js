'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import pay from './../../../../controllers/pay';
import api from './../../../../controllers/api';
import Bridge from './../../../../util/bridge';

class PaySuccess extends ScreenComponent {
    static pageConfig = {
        path: '/merchant/paysuccess',
        permission: true
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title: '支付成功'
        }
        this.state = {
            
        }
    }
    componentDidMount() {
        this._getOrderInfo();
    }
    
    _renderPrice(price){
        if(!price){
            return null;
        }
        price =price.toString().split('\.');
        var intP = price[0];
        var decP = price[1]||'00';
        return (
            <span className='-orange'>
                <em>{intP}.</em>
                {decP}
            </span>
        );
    }
    _getOrderInfo(){
        try{
            var params = this.getScreen().getNavigation().state.params;
            api.checkPay({order_id:params.order_id});
            api.getUserOrderInfo({order_id:params.order_id}).success((content,next,abort)=>{
                this.setState({info:content.data});
                next();
            });
        }catch(e){
            return null;
        }
    }
    _goHome=()=>{
        APPContext.resetNavigator();
    }
    _onDownloadPopup=()=> {
        const DOWNLOADPOPUP = this.getScreen().showPopup({
            content: <div className="download-app-content" onClick={e => e.stopPropagation()}>
                <div className="popup-content">
                    <p>下载说明</p>
                    <p>下载投融家APP使用手机号和密码登录(密码已通过短信形式发送到您的手机)</p>
                    <p className="download">
                        <a href="javascript:;"
                            onClick={this._goDownLoad}>下载投融家APP</a>
                    </p>
                </div>
                <p className="close">
                    <a className="icon-white-close"
                        onClick={() => this.getScreen().hidePopup(DOWNLOADPOPUP)}
                        ></a>
                </p>
            </div>
        })
    }
    _goDownLoad=()=> {
        if(Bridge.clientType == 'android') {
            window.location.href = 'https://www.tourongjia.com/install/android/trj.apk';
        }else if(Bridge.clientType == 'ios') {
            window.location.href = 'https://itunes.apple.com/cn/app/tou-rong-jia-li-cai-zheng/id1071745715?mt=8';
        }else if(Bridge.clientType == 'browser') {
            let ua = window.navigator.userAgent.toLowerCase();
            if (ua.indexOf('android') > -1 || ua.indexOf('linux') > -1) {
                window.location.href = 'https://www.tourongjia.com/install/android/trj.apk';
            } else if (ua.indexOf('iphone') > -1) {
                window.location.href = 'https://itunes.apple.com/cn/app/tou-rong-jia-li-cai-zheng/id1071745715?mt=8';
            }
        }
    }
    render() {
        var params = this.getScreen().getNavigation().state.params;
        var {info} = this.state;
        if(!info){
            return null;
        }
        return (
            <div className='payment-success'>
                <dl className='pay-success'>
                    <dd><i className='icon-success'></i></dd>
                    <dt className="pay-scs">支付成功</dt>
                    <dt className="pay-scs-name">{info.merchant_name}</dt>
                    <dt className="pay-scs-money">￥{this._renderPrice(info.pay_money)}</dt>
                </dl>
                <div className='-success-body'>
                    <ul>
                        <li><label>订单号</label><span>{info.order_no}</span></li>
                        <li style={{color:'#FF810C'}}><label>消费总额</label>￥{info.money}</li>
                        <li><label>优惠</label>-￥{info.discount_amount}</li>
                        <li><label>消费时间</label>{info.ctime}</li>
                        <li><label>手机号</label><span>{info.mobile}</span></li>
                    </ul>
                </div>
                <div className="pay-wrap">
                    <a  
                        href='javascript:'
                        onClick={this._goHome}
                        className="btn-pay active">完成</a>
                    {
                        // !Bridge.isAppClient && <a  
                        //     href='javascript:'
                        //     onClick={this._onDownloadPopup}
                        //     className="btn-pay frame">下载投融家App，百元红包等你领</a>
                    }
                </div>
            </div>
        )
    }
}

export default PaySuccess;   