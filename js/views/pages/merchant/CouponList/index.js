'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api'
import coupon from './../../../../util/coupon';
import SelectIcon  from './SelectIcon';
class CouponList extends ScreenComponent {
    static pageConfig = {
        path: '/merchant/couponlist',
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title:'选择福利券'
        }
        this.state = {
            list:[]
        }
    }
    componentDidMount() {
        let navigation = this.getScreen().getNavigation();
        let {params} = navigation.state;
        if(params.isSelectMode&&params.selectedId){
            this.state.selected = {
                coupon_id:params.selectedId
            }
        }
        this._getCoupon();
    }
    _name(merchantName,type){
        return merchantName+coupon.nameByType(type);
    }
    _getCoupon(){
        let navigation = this.getScreen().getNavigation();
        let {params} = navigation.state;
        //查看过期
        if(params.type=='3'){
           return api.CouponList({coupon_status:3}).success((content,next,abort)=>{
                let list = content.data.list||[];
                if(list&&list.length>0&&this.state.selected){
                    list.forEach(item=>{
                        if(item.coupon_id === this.state.selected.coupon_id){
                            this.state.selected = item;
                        }
                    })
                }
                this.setState({
                    list:list
                });
            });
        }
        
        api.getMerchantCouponByMoney({
            merchant_id:params.merchant_id,
            money:params.money,
            status:1
        }).success((content,next,abort)=>{
            let list = content.data.list||[];
            this.setState({
                list:list
            });
        })
    }
    contribute(){
        return this.state.selected;
    }
    _selected(item){
        this.state.selected = item;
        this.getScreen().getNavigation().goBack();
    }
    _checkOver=()=>{
        this.getScreen().getNavigation().navigate('CouponList',{type:3,title:'过期券'})
    }
    _renderItem(list,isSelectMode){
        let {selected} = this.state;
        if(!list||list.length<1){
            return (
                <div style={{
                    textAlign:'center',
                    marginTop:'6rem',
                    marginBottom:'2rem'
                }}>
                    <img 
                        style={{height:'80px',width:'80px',marginBottom:'0.5rem'}}
                        src="/images/welfare/empty.png" />
                    <p style={{fontSize:'.8rem',color:' #333'}}>暂时没有福利券哦</p>
                </div>
            );
        }
        return list.map((item,i)=>{
            let className = item.status?'welfare-item -disabled':'welfare-item';
            return (
                <div 
                    key ={i}
                    onClick={()=>this._selected(item)}
                    style={{position:'relative'}}
                    className={className}>
                        <div style={{position:'relative',height: '2.5rem',marginBottom:'1.1rem'}}>
                            <div className='picture'>
                                <img src={item.merchant_logo} />
                            </div>
                            <div
                                style={{position:'relative',height:'100%',display: 'inline-block',width:'8rem',marginLeft:'0.3rem'}}>
                                <h3 
                                    style={{position:'absolute',top:0,paddingTop:0}}
                                    className='title'
                                    >{this._name(item.merchant_name,item.coupon_type)}</h3>
                                <div style={{position:'absolute',bottom:'-2px'}}>
                                    <div className='amount'>
                                        <i>¥</i>{item.discount_amount}
                                        {item.coupon_type!=1&& <p className='condition'>(满{item.need_amount}可用）</p>}
                                    </div>
                                    
                                </div>
                            </div>
                            {isSelectMode&&<SelectIcon selected={selected&&selected.coupon_id == item.coupon_id} />}
                        </div>
                       
                        
                        <div className='describe'>
                            <span className='time'>有效期至：{item.use_end_time}</span>
                            <span className='status'>已消费</span>
                        </div>
                    </div>
            );
        })
    }
    render() {
        let navigation = this.getScreen().getNavigation();
        let {params} = navigation.state;
        let list = this.state.list;
        let isEmpty = !(list&&list.length>0);
        let isSelectMode = params.isSelectMode;
        return (
            <div className="cpuponlist">
                <div className='welfare-list'>
                    {this._renderItem(this.state.list,isSelectMode)}
                    {params.type!=3&&
                    <div 
                        style={isEmpty?{position:'absolute',bottom:'2rem',left:0,right:0}:undefined}
                        className='done-tips'>
                        {!isEmpty&&'没有更多了 | '}
                        <em onClick={this._checkOver}>查看过期券</em></div>
                    }
                </div>
            </div>
            
        );
    }
}

export default CouponList;