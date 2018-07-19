'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Swiper from './../../../components/Swiper';
import api from './../../../../controllers/api';
import {StoreManager} from 'mlux';
import EMap from './EMap';
class BannerIndicator extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            page: 0
        }
    }
    onPageSelected(event) {
        this.setState({
            page: event.nativeEvent.position
        })
    }
    render() {
        return (
            <span className="img-count">
                {this.state.page + 1}/
                <em>{this.props.count}</em>
            </span>
        )
    }
}
class MerchantDetail extends ScreenComponent {
    static pageConfig = {
        path: '/merchantdetail',
    }
    constructor(...props) {
        super(...props);
        this.state = {
            showMore: false,
            info: null
        }
        this.navigationOptions = {
            title: ''
        }
    }
    componentDidMount() {
        this._getData();
    }
    _getData() {
        var navigation = this.getScreen().getNavigation();
        let { params } = navigation.state;
        api.Info({ merchant_id: params.id }).success((content, next, abort) => {
            this.setState({
                info: content.data
            })
            next();
        })
    }
    _call = () => {
        this.getScreen().alert({
            message: <span style={{padding: '.3rem 0', display: 'block', fontSize: '.8rem'}}>{this.state.info.tel}</span>,
            buttons: [
                {
                    text: <span style={{color: 'rgba(153,153,153,1)'}}>取消</span>
                },
                {
                    text: '呼叫',
                    onPress: this._doCall
                }
            ]
        })
    }
    _doCall = () => {
        location.href = 'tel:' + this.state.info.tel
    }
    _getTicketName(type, name) {
        if (type == 2) {
            return '满减券';
        } else {
            return '代金券';
        }
    }
    _toggleShowMore = () => {
        let { showMore } = this.state;
        this.setState({
            showMore: !showMore
        })
    }
    _renderCoupons() {
        
        let { info, showMore } = this.state;
        let { coupon, merchant_name } = info;
        if (!coupon || coupon.length < 1) {
            return (
                <div
                    style={{textAlign:'center',height:'4.575rem',lineHeight:'4.575rem'}}>
                    <img 
                        style={{
                            display:'inlineBlock',
                            marginRight:'9.3px',
                            height:'28px',
                            width:'32px'
                        }}
                        src="images/index/1524712521969.png" alt=""/>
                    <span
                        style={{
                            display:'inlineBlock',
                            color:'#999999',
                            fontSize:'15px'
                        }}>暂无福利</span>
                </div>
            )
        }
        return coupon.map((item, i) => {
            let type = item.type;
            if (!showMore && i >= 2) {
                return null;
            }
            return (
                <div
                    key={i}
                    onClick={()=>{
                        this.getScreen().getNavigation().navigate('WelfareDetail',{id:item.coupon_id,source_type:'index',mid:info.mid,stype:'m'})
                    }}
                    className="group_list">
                    <div className="biz_detail">
                        <a href="javascript:" className="detail_info">
                            <h5>{this._getTicketName(type, merchant_name)}</h5>
                            <h6>{item.need_week} | 全场通用</h6>
                            <div className="dist">
                                ￥<em>{item.discount_amount}</em>
                                {type == 2 && <span>满{item.need_amount}元可用</span>}
                            </div>
                        </a>
                    </div>
                    <div className="biz_call">
                        <a
                            href='javascript:'
                            className="phone">
                            已领{item.sell_num}张
                            <i className="icon_more" />
                        </a>
                    </div>
                </div>
            )
        })
    }
    _renderBanner() {
        let { img: imgs } = this.state.info;
        if (!imgs || imgs.length < 1) {
            return null;
        }
        return imgs.map((item, key) => {
            return (
                <p
                    key={key}>
                    <img
                        style={{height:'100%',width:'100%'}}
                        src={item}/>
                </p>
            )
        });
    }
    _showMap=()=>{
        let { info } = this.state;
        this._mapid = this.getScreen().showPopup({
            content:<EMap 
                        onClose={()=>this.getScreen().hidePopup(this._mapid)}
                        {...info}/>,
            onBackdropPress:()=>true
        })
    }
    _hideMap(){

    }
    render() {
        let { info } = this.state;
        if (!info) {
            return null;
        }
        let coupon = info.coupon||[];
        return (
            <div className="Lx_merchant">
                <Swiper
                    className="headimg"
                    autoPlay={true}
                    loop={true}
                    indicator={BannerIndicator}>
                    {this._renderBanner()}
                </Swiper>
                <div className="shopInfo">
                    <div className="info_mode">
                        <div className="preview_img">
                            <img src={info.logo} />
                        </div>
                        <div className="describe">
                            <p className="desc_name">{info.merchant_name}</p>
                            <p className="desc_distance">{info.distance < 0.1 ? '<100m' : `${info.distance}km`}</p>
                            {
                                Boolean(!window.LEXIAO_APP)&&<a
                                    href={"#/purchase:merchant_id="+info.id}
                                className="desc_btn">买单</a>
                            }
                        </div>
                    </div>

                    <div className="info_address">
                        <i className="icon_locate" />
                        <a
                            className="info_text"
                            onClick={this._showMap}
                            href="javascript:void(0)">
                            {`${info.city} ${info.area}${info.address}`}</a>
                        <a
                            onClick={this._call}
                            href="javascript:void(0)"
                            className="icon_phone">
                            <i />
                        </a>
                    </div>
                </div>
                <div className="shop_list_group">
                    <h3 className="group_title"><em className="title_left"></em> 商家福利 </h3>
                    {this._renderCoupons()}
                    {coupon.length>2&&!this.state.showMore&&<a
                        href='javascript:void(0)'
                        onClick={this._toggleShowMore}
                        className="group-more">
                        更多福利
                        <i />
                    </a>}
                </div>
                <div className="shop_list_group">
                    <h3 className="group_title"><em className="title_left"></em> 商家介绍 </h3>
                    <div className="group_text">
                        {info.desc}
                    </div>
                </div>
            </div>
        );
    }
}

export default MerchantDetail;