'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

class Title extends ScreenComponent{
    constructor(...props){
        super(...props);
    }
    render(){
        return <h3 
                className="search_section_title"
                children={this.props.title} />
    }
}
export default Title;