'use strict'
import React, { Component } from 'react';

export default class Banner extends Component {
    constructor(...props) {
        super(...props);
    }
    render() {
        return (
            <div className="er-code-banner">
                <img src="/images/register/banner_01.png" />
                <img src="/images/register/banner_02.png" />
                <img src="/images/register/banner_03.png" />
                <img src="/images/register/banner_04.png" />
                <img src="/images/register/banner_05.png" />
                <img src="/images/register/banner_06.png" />
            </div>
        )
    }
}
