'use strict'
//LocationCity
import React from 'react';
import localLocation from './../../../../controllers/localLocation';
import { StoreManager } from 'mlux';
export default class LocationCity extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
            city: ''
        }
    }
    componentDidMount() {
        this._getCity();
        this._listener = StoreManager.location.addListener('change', this._updateCity);

    }
    componentWillUnmount() {
        this._listener.remove();
    }

    _updateCity = () => {
        var city = localLocation.getCurrentCity() || '定位失败';
        this.setState({ city })
    }
    _getCity() {
        var city = localLocation.getCurrentCity() || '定位失败';
        this.setState({ city })
    }
    _locate = () => {
        localLocation.locate();
    }
    render() {
        return (
            <div className="locate">
                <span className="text">
                    <i />
                    {this.state.city}
                </span>
                <a
                    href='javascript:void(0)'
                    onClick={this._locate}
                    className="redirect">
                    重新定位
                </a>
            </div>
        );
    }
}
