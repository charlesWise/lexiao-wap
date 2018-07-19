'use strict'
import React,{Component} from 'react';

class Title extends Component{
    constructor(...props){
        super(...props);
    }
    render(){
        return <h1 className='title'>{this.props.title}</h1>
    }
}
export default Title;