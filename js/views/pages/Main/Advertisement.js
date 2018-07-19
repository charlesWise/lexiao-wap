'use strict'
//广告
import React from 'react';
import Swiper from './../../components/Swiper';

import api from './../../../controllers/api';
export default class Advertisement extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
            list: []
        }
    }
    componentDidMount() {
        this._getData();
    }
    componentWillUnmount() {
    }
    
    _renderData() {

    }
    _getData() {
        api.banner().success(this._onDataSuccess)
    }
    _onDataSuccess = (content, next, abort) => {
        this.setState({
            list: content.data
        })
        next();
    }
    _renderBanner(list) {
        return list.map(function (item: { href: string, img: string },i) {
            return (
                <a
                    key = {i}
                    target='_self'
                    href={item.href || 'javascript:void(0)'}>
                    <img 
                        style = {{height:'100%',width:'100%'}}
                        src={item.img} />
                </a>
            )
        })
    }
    render() {
        let { list } = this.state;
        if (!list || list.length < 1) {
            return null;
        }
        return (
            <Swiper
                loop={true}
                autoPlay={true}
                className='index_advert'>
                {this._renderBanner(list)}
            </Swiper>
        );
    }
}
