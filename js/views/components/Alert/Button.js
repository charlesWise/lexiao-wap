'use strict'
import React, { Component } from 'react';

class Button extends Component {
    constructor(...props) {
        super(...props);
    }
    _renderButton(buttons) {
        var l = buttons.length;
        var buttonClassName = l == 2 ? 'screenui-alertui-button-2' : 'screenui-alertui-button screenui-alertui-button-border';
        return buttons.map((button, i) => {
            return (
                <li
                    onClick={button.onPress}
                    children={button.text}
                    className={buttonClassName}
                    key = {i}
                    style={i == 1 && l == 2 && { borderLeft: '1px solid  rgba(0,0,0, 0.12)' }||null}
                />
            );
        })
    }
    render() {
        var { buttons } = this.props;
        if (!buttons || buttons.length == 0) {
            return null;
        }
        return (
            <ul className={buttons.length == 2 ? 'screenui-alertui-button-border' : ''}>
                {this._renderButton(buttons)}
            </ul>
        );
    }
}

export default Button;