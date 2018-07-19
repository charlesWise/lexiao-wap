import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class BuyBar extends ScreenComponent {
    constructor(...props){
        super(...props);
    }
    _buy=()=>{
        let {
            user_point,
            need_amount,
            coupon_point,
            coupon_id,
            make_times,
            mid
        } = this.props;
        if(make_times<1){
            this.getScreen().alert({
                title:'温馨提示',
                message:'您的积分已不足，请获取更多积分再来继续兑换',
                buttons:[
                    {text:'确定'},
                    //{text:'前去获取积分',onPress:this._getPoint},
                ]
            })
        }else{
            this.getScreen().getNavigation().navigate('Exchange',{
                id:coupon_id,
                source_type:'index'
            });
        }
    }  
    _yaoyiyao(type){
        let {
            user_point,
            need_amount,
            coupon_point,
            coupon_id,
            make_times,
            mid,
            id,
            extra_money
        } = this.props;
        if(type==='jp'){
            if(make_times<1){
                this.getScreen().alert({
                    message:<span>您今天的免费摇一摇次数已用完<br/>投资每满{extra_money}元既可获得一次摇一摇机会</span>,
                    buttons:[
                        {text:'确定'},
                        //{text:'前去获取积分',onPress:this._getPoint},
                    ]
                })
            }else{
                this.getScreen().getNavigation().navigate('Shake',{
                    id:coupon_id,
                    type,
                    mid,
                    shake_id:id,
                    source_type:'index',
                });
            }
        }else if(type==='jf'){
            if(make_times<1){
                this.getScreen().alert({
                    message:<span>您的积分已不足<br/>请获取更多积分再来继续摇一摇</span>,
                    buttons:[
                        {text:'确定'},
                        //{text:'前去获取积分',onPress:this._getPoint},
                    ]
                })
            }else{
                this.getScreen().getNavigation().navigate('Shake',{
                    id:coupon_id,
                    type,
                    mid,
                    source_type:'index',
                });
            }
        }   
        
    } 
    _getPoint(){

    }
    render() {
        let {
            user_point,
            need_point,
            is_free,
            fromIndex,
            coupon_id,
            id,
            mid
        } = this.props
        if (!fromIndex) {
            return null;
        }
        if (is_free=='1') {
            return (
                <div className='s-luck-draw'>
                    <p>
                        <a
                            href='javascript:void(0)'
                            onClick={()=>this._yaoyiyao('jp')}
                            className="draw_btn">
                            摇一摇领福利</a>
                    </p>
                </div>
            );
        } else {
            return (
                <div className='s-luck-draw'>
                    <p className="points">我的积分 : {user_point}</p>
                    <p>
                        <a 
                            href='javascript:void(0)'
                            onClick={()=>this._yaoyiyao('jf')}
                            className="draw_btn_l">
                            {need_point}积分抽一次
                        </a>
                        <a  
                            onClick = {this._buy}
                            href='javascript:void(0)'
                            className="draw_btn_r">
                            全额兑换
                        </a>
                    </p>
                </div>
            )
        }

    }
}
export default BuyBar;