import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import Swiper from './../../../components/Swiper';

class Banner extends ScreenComponent {
    _renderBanner(dataSource){
        if(!dataSource){
            return null;
        }
        return dataSource.map((url)=>{
            return (
                <img key={url} src={url} />
            )
        })
    }
    render() {
        let {dataSource} = this.props;
        return (
            <div className='focus-figure'>
                <i className='-mask' />
                <Swiper
                    className='focus-figure'>
                    {this._renderBanner(dataSource)}
                </Swiper>
            </div>
        )
    }
}

export default Banner;