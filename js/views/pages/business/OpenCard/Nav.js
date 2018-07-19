'use strict'
import React  from 'react';
import ScreenComponent from './../../../components/ScreenComponent';

export default class Nav extends ScreenComponent{
    constructor(...props){
        super(...props);
        this.state = {}
    }
    componentDidMount(){
    }
    _renderSections(sections){
       return sections.map((section,i)=>{
            return (
                <a 
                    onClick={()=>this.props.onItemClick&&this.props.onItemClick(section)}
                    href="javascript:void(0)"
                    key = {i}
                    className = {this.props.navIndex === section?"active":""}
                    >
                    {section}
                </a>
            );
        })
    }
    render(){
        let sections = this.props.alphabet;
        if(sections&&sections.length>0) {
            return (
                <div className="letter_list">
                    {this._renderSections(sections)}
                </div>
            )
        }else {
            return null;
        }
    }
}