'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import coupon from './../../../../util/coupon';
class Coupon extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    render() {
        let {amount,type,num,onSelect}=this.props;
        let className=''
        let child='暂无可用';
        if(amount!==undefined){
            className='more-pay-coupon';
            child=[
                <em key='em'>{coupon.nameByType(type)}</em>,
                '-￥'+amount
            ];

        }else if(num!==undefined){
            className='active';
            child=num+'张可用';
        }
        return (
            <div
                onClick={onSelect}
                className="more-pay-ticket">
                <label>福利券</label>
                <span className={className}>
                    {child}
                </span>
            </div>
        );
    }
}
export default Coupon;