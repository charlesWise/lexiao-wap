'use strict'
//附近福利
import React from 'react';
import NotOpen from './NotOpen';
import ScreenComponent from './../../components/ScreenComponent'
import WelfareList from './../../components/WelfareList';
import api from './../../../controllers/api'
export default class NearbyWelfare extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            data: [],
            page:{},
            loading:false
        }
    }
    componentDidMount() {
        this._fetchData();
    }
    _fetchData(page) {
        if(this.state.loading){
            return;
        }
        this.setState({loading:true})
        api.nearest({page:page||1}).success((content, next, abort) => {
            var data = this.state.data||[];
            var list = content.data.list||[];
            data = data.concat(list);
            this.setState({
                data,
                page:content.data.page,
                loading:false
            });
           
        })
    }
    _onItemClick=(item)=>{
        console.log(item)
        let navigation = this.getScreen().getNavigation();
        navigation.navigate('MerchantDetail',{
            id:item.merchant_id
        });
    }
    _onLoadMore=()=>{

    }
    loadMore(){
        var page = this.state.page;
        var {
            total_count,
            curent_page,
            total_page
        } = page;

        if(curent_page&&curent_page<total_page){
            this._fetchData(1+parseInt(curent_page))
        }
    }
    render() {
        var data = this.state.data;
        if (!data || data.length < 1) {
            return (
                <NotOpen />
            );
        }
        return (
            <div className="index_sale_block">
                <h3 className="index_title"><em className="title_left"></em> 附近福利 </h3>
                <WelfareList
                    onItemClick={this._onItemClick}
                    onLoadMore={this._onLoadMore}
                    loading={this.state.loaing}
                    data={this.state.data}
                    total_count={this.state.data.length}/>
            </div>);
    }
}
