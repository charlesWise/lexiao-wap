import React, { Component } from 'react';
import _ from 'lodash';

import Wrapper from './../../components/Picker/Wrapper';
import Picker from './../../components/Picker/Picker';
import Header from './../../components/Picker/Header';

import api from './../../../controllers/api';

export default class AreaPicker extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            provinces: [],
            citys: [],
            areas: [],
            province: {},
            city: {},
            area: {}
        }
    }

    componentWillMount() {
        this._getProvinces()
    }

    _getProvinces() {
        api.getArea({
        }).success((res) => {
            this.setState({
                provinces: res.data
            })
            this._getCitys(this.props.pcode || res.data[0]['code'])
        }).error((res) => { })
    }

    _getCitys(area_code) {
        api.getArea({
            area_code: area_code
        }).success((res) => {
            this.setState({
                citys: res.data
            })
            let self = this;
            let i = _.findIndex(res.data, function (o) { return o['code'] == self.props.ccode; });
            this._getAreas(i < 0 ? res.data[0]['code'] : this.props.ccode)
        }).error((res) => { })
    }

    _getAreas(area_code) {
        api.getArea({
            area_code: area_code
        }).success((res) => {
            this.setState({
                areas: res.data
            })
        }).error((res) => { })
    }

    _onProvinceChange(province) {
        this.state.province = province;
        console.log('province', province)
        this._getCitys(province.code)
    }

    _onCityChange(city) {
        this.state.city = city;
        this._getAreas(city.code)
    }

    _onAreaChange(area) {
        this.state.area = area;
    }

    _onCancel() {
        this.props.onCancel && this.props.onCancel();
    }

    _onSelected() {
        this.props.onSelected && this.props.onSelected({
            province: this.state.province,
            city: this.state.city,
            area: this.state.area
        })
    }

    render() {
        return <Wrapper
            style={{
                position: 'absolute',
                width: '100%',
                bottom: 0
            }}
            header={
                <Header
                    onCancel={this._onCancel.bind(this)}
                    onSelected={this._onSelected.bind(this)}
                />
            }
        >
            <Picker
                dataSource={this.state.provinces}
                defaultValue={this.props.pcode}
                labelName={this.props.plabelName || 'name'}
                valueName={this.props.pvalueName || 'code'}
                onChange={this._onProvinceChange.bind(this)}
            />
            <Picker
                dataSource={this.state.citys}
                defaultValue={this.props.ccode}
                labelName={this.props.clabelName || 'name'}
                valueName={this.props.cvalueName || 'code'}
                onChange={this._onCityChange.bind(this)}
            />
            <Picker
                dataSource={this.state.areas}
                defaultValue={this.props.acode}
                labelName={this.props.alabelName || 'name'}
                valueName={this.props.avalueName || 'code'}
                onChange={this._onAreaChange.bind(this)}
            />
        </Wrapper>
    }
}