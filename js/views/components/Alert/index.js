'use strict'
import React, { Component } from 'react';
import AlertUI from './AlertUI';
class Alert extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            show: false,
            config: undefined
        }
        this._timeout;
    }
    componentWillUnmount() {
        this._clear();
    }

    _clear() {
        clearTimeout(this._timeout);
    }
    show(config) {
        clearTimeout(this._timeout);
        if (config.buttons && config.buttons.length > 0) {
            config.buttons.forEach((button) => {
                var onPress = button.onPress;
                button.onPress = () => {
                    onPress && onPress();
                    this._close();
                }
            })
        } else {
            this._timeout = setTimeout(this._close, config.duration || 2000);
        }
        this.setState({
            show: true,
            config
        });
    }
    _close = () => {
        this.setState({
            show: false,
            config: undefined
        });
    }
    render() {
        if (this.state.show) {
            return (
                <div
                    className='screenui-alertui-bg'>
                    <AlertUI {...this.state.config} />
                </div>
            )

        }
        return null;
    }
}

export default Alert;