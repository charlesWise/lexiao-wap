'use strict'
import React, { Component } from 'react';

class Title extends Component {
    constructor(...props) {
        super(...props);
    }
    render() {
        if (!this.props.text) {
            return null;
        }
        return (
            <p
                className='screenui-alertui-title'
                children={this.props.text}
            />
        );
    }
}

export default Title;