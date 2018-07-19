'use strict'
//精品福利
import React from 'react';
import ScreenComponent from './../../components/ScreenComponent';
import api from './../../../controllers/api';
import SmoothView from './../../components/SmoothView';
const styles = {
    //投融家
    welfareTypeTRJ:{
        backgroundImage:'url(/images/index/lx_home_image_trjcoupon.png)'
    },
    //商家
    welfareBgTypeOhter:{
        backgroundImage:'url(/images/index/lx_home_image_othercoupon.png)'
    }
}


export default class ExcellentWelfare extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            list: [],
            totalCount:0
        }
    }
    componentDidMount() {
        this._getData();
    }
    _getData(){
        api.welfare().success((content,next,abort)=>{
            let list = content.data.list;
            this.setState({
                list,
                totalCount:content.data.page.total_count
            })
        })
    }
    _renderList() {
        let {list} = this.state;
        if(!list||list.length<1){
            return (
                <li
                    style={{
                        height:'100%',
                        width:'100%',
                        textAlign:'center'
                    }}>
                    <img 
                        style={{
                            height:'3.625rem',
                            width:'4.425rem'
                        }}
                        src="images/index/fuliempty.png" alt=""/>
                        <span
                            style={{
                                marginLeft:'10px',
                                color:'#999999',
                                fontSize:'15px'
                            }}>
                            一大波福利正在赶来的路上~
                        </span>

                </li>
            )
        }
        return this.state.list&&this.state.list.length > 0&&this.state.list.map((item, i) => {
            let style = item.coupon_palnt_type=='2' ?styles.welfareBgTypeOhter:styles.welfareTypeTRJ;
            return (
                Boolean(window.LEXIAO_APP) ? 
                <li
                    key={i}
                    style={style}
                    className="index_jp_item"
                    onClick={() => {
                        this.getScreen().alert({
                            message: <span style={{padding: '.3rem 0', display: 'block', fontSize: '.75rem'}}>请前往实体店领取</span>,
                            buttons: [
                                {
                                    text: "确认"
                                }
                            ]
                        });
                    }}
                    >
                    <a href="javascript:;">
                        <section
                            className = 'index_jp_item_welfare_info'>
                            <p
                                className = 'index_jp_item_welfare_amount'>
                                {item.discount_amount}
                            </p>
                            <p
                                className = 'index_jp_item_welfare_plat'>
                                {item.name.length>=7?item.name.slice(0,7)+'...':item.name}
                            </p>
                        </section>
                        <p
                            className = 'index_jp_item_welfare_name'>
                            {item.type==1?'代金券':'满减券'}
                        </p>
                    </a>
                </li>
                :
                <li
                    key={i}
                    style={style}
                    className="index_jp_item">
                    <a href={`#/merchant/welfaredetail:id=${item.coupon_id}&source_type=index&shake_id=${item.id}`}>
                        <section
                            className = 'index_jp_item_welfare_info'>
                            <p
                                className = 'index_jp_item_welfare_amount'>
                                {item.discount_amount}
                            </p>
                            <p
                                className = 'index_jp_item_welfare_plat'>
                                {item.name.length>=7?item.name.slice(0,7)+'...':item.name}
                            </p>
                        </section>
                        <p
                            className = 'index_jp_item_welfare_name'>
                            {item.type==1?'代金券':'满减券'}
                        </p>
                    </a>
                </li>
            );
        });
    }

    render() {
        let {list} = this.state;
        return (
            <div className="index_sale_block">
                <h3
                    className="index_title">
                    <em className="title_left"></em> 今日抽券
                    {
                        Boolean(!window.LEXIAO_APP)&&<a
                            href="#/excellent"
                            className="more">
                            {this.state.totalCount}个福利
                            <i className="arrowent" />
                        </a>
                    }
                </h3>
                <SmoothView 
                    className="index_jp"
                    style={{padding:'0 0.75rem'}}
                    itemWidth={!list||list.length<1?'100%':'8.8rem'}
                    >
                    {this._renderList()}
                </SmoothView>
            </div>
        );
    }
}
