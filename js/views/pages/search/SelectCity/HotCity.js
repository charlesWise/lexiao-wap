'use strict'
import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import localLocation from './../../../../controllers/localLocation'
import api from './../../../../controllers/api'
class HotCity extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            data: [{
                hot_word:'杭州'
            }]
        }
    }
    componentDidMount() {
        this._getData();
    }
    _setCity(city,citycode) {
        localLocation.setCurrentCity(city,citycode);
        this.getScreen().getNavigation().goBack();
    }
    _getData() {
        api.hotCity().success((content)=>{
            this.setState({
                data:content.data.list
            })
        })
    }
    _renderData() {
        var data = this.state.data;
        return data.map((item, i) => {
            return (
                <li
                    onClick={() => this._setCity(item.ctiy_name,item.city_code)}
                    key={i}>
                    {item.ctiy_name}
                </li>
            )
        })
    }
    render() {
        var data = this.state.data;
        if (!data || data.length < 1) {
            return null;
        }
        return (
            <section className="hot_city">
                <p className="hot-trade">热门城市</p>
                <ul className="city-place-name">
                    {this._renderData()}
                </ul>
            </section>
        );
    }
}

export default HotCity;