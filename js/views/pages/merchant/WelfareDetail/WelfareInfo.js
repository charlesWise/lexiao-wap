import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import coupon from './../../../../util/coupon';
import ReactDOM from 'react-dom';


class WelfareInfo extends ScreenComponent {
    componentDidMount() {
        let { fromIndex, info } = this.props;
        ReactDOM.findDOMNode(this.refs['inh']).innerHTML = info.use_rule;
    }
    componentDidUpdate () {
        let { fromIndex, info } = this.props
        ReactDOM.findDOMNode(this.refs['inh']).innerHTML = info.use_rule;
    }
    
    
    _renderStatusButton(fromIndex, info) {
        if (fromIndex) {
            return (
                <p className='allowance'>
                    已领{info.sell_num}张／剩余
                    <em className="org_em">{info.publish_num}张</em>
                    {
                        Boolean(!window.LEXIAO_APP)&&info.is_free!='1'&&<span>
                            所需积分:
                            <em className="red_em">{info.coupon_point}分</em>
                        </span>
                    }
                </p>

            );
        }
        switch (info.use_status) {
            case '1':
                return (
                    <p className='btn-wrap' onClick={() => {
                        this.getScreen().getNavigation().navigate('SelectMerchant', {
                            coupon_id: info.coupon_id,
                            type: 2
                        })
                    }}>
                        <button className='btn-primary'>立即使用</button>
                    </p >
                )
            case '2':
                return (
                    <p className='btn-wrap'>
                        <button className='btn-primary -disabled'>已使用</button>
                    </p>

                );
            case '3':
                return (
                    <p className='btn-wrap'>
                        <button className='btn-primary -disabled'>已过期</button>
                    </p>
                )
            default:
                return null;
        }
    }
    _renderMerchantName(merchantList=[]){
        return merchantList.map(function(item){
            return item.merchant_name
        }).join(',')
    }
    _couponName(merchant,type){
        return merchant+' '+coupon.nameByType(type);
    }
    render() {
        let { fromIndex, info } = this.props
        return (
            <div className={fromIndex?'welfare-info coudet_info':'welfare-info'}>
                <h3 className='title'>{this._couponName(info.merchant_name,info.type)}<span>{info.discount_amount}元</span></h3>
                {info.type!='1'&&<p className='condition'>（满{info.need_amount}可用）</p>}
                {this._renderStatusButton(fromIndex, info)}
                <dl>
                    <dt>使用须知：</dt>
                    <dd>适用范围：全场通用</dd>
                    <dd>使用时间：{info.need_week}</dd>
                    <dd>有效期至：{info.use_time_end}</dd>
                    <dd>适用商家：{this._renderMerchantName(info.merchant||[])}</dd>
                </dl>
                <dl>
                    <dt>使用规则：</dt>
                    <dd ref='inh'>
                    </dd>
                </dl>
            </div>
        )
    }
}
export default WelfareInfo;