'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Title from './Title';
import api from './../../../../controllers/api';
class Popular extends ScreenComponent{
    constructor(...props){
        super(...props);
        this.state = {
            data:[
                '王宝合',
                '肯德基',
                '森秋铁板烧',
                '德克士',
                '谭记茶餐厅'
            ]
        }
    }
    componentDidMount() {
        this._getData();
    }
    _onSelect=(hot_word)=>{
        this.props.onSelect&&this.props.onSelect(hot_word);
    }
    _getData(){
        api.hotSearchWord().success((content)=>{
            this.setState({
                data:content.data
            })
        })
    }
    _renderData(){
        let {data} = this.state
        if(!data||data.length<1){
            return null
        }
        return this.state.data.map((item,i)=>{
            return <li 
                    onClick={()=>this._onSelect(item.hot_word)}
                    key = {i}>{item.hot_word}</li>
        })
    }
    render(){
        if(this.props.hidden){
            return null
        }
        let {data} = this.state;
        return (
            <section
                className = 'search_section'>
                <Title 
                    title = '热门搜索'/>
                <ul className = 'search_popular_section'>
                    {this._renderData()}
                </ul> 
            </section>
        );
    }
}
export default Popular;