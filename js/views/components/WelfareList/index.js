'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../ScreenComponent';

class WelfareList extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    _renderList() {
        var { data } = this.props;
        if (!data) {
            return null;
        }
        return data.map((item, i) => {
            return (
                <li
                    onClick = {()=>this.props.onItemClick&&this.props.onItemClick(item)}
                    className="welfare_list_item"
                    key={i}>
                    <img
                        className = 'welfare_list_item_left' 
                        src={item.logo} />
                    <div className="welfare_list_item_right">
                        <div className="welfare_list_item_shop_name_main">
                            <p className="welfare_list_item_shop_name">{item.merchant_name}</p>
                            <p className="welfare_list_item_shop_tags">{item.distacne < 0.1 ? '<100m' : `${item.distacne}km`}</p>
                        </div>
                        <div className="welfare_list_item_shop_name_sub">{item.category} | {item.area_name}</div>
                        {/* <div className="welfare_list_item_shop_name_sub">{item.desc}</div> */}
                        <div className="welfare_list_item_item_price">
                            <p className="welfare_list_item_price_related">已领{item.sell_num}张</p>
                            <p className="welfare_list_item_sale_desc">共{item.coupon_count}个福利 <i className="welfare_list_item_arrowent"/></p>
                        </div>
                    </div>
                </li>
            );
        })
    }
    _renderLoading() {
        return (
            <div className="load-wrap">
                <div className="loading-img"></div>
                <span>正在加载...</span>
            </div>
        );
    }
    render() {
        var className = this.props.className ? 'welfare_list_section ' + this.props.className : 'welfare_list_section';
        var {loading,total_count,data} = this.props;
        length =data&& data.length||0;
        total_count=total_count||length;
        return (
            <section
                className={className}>
                <ul
                    className='welfare_list'>
                    {this._renderList()}
                </ul>
                {loading&&this._renderLoading()}
                {
                    total_count>data.length&&<a 
                        className="load-more" 
                        href='javascript:void(0)'
                        onClick={this.props.onLoadMore}>
                        查看更多
                    </a>||null
                }
            </section>
        );
    }
}

export default WelfareList;