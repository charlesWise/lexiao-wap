'use strict'
import React  from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import alphabet from './../../../../constants/ALPHABET'
class CityNav extends ScreenComponent{
    constructor(...props){
        super(...props);
        this.state = {
            sections:alphabet
        }
    }
    componentDidMount(){
    }
    _renderSections(){
       return this.state.sections.map((section,i)=>{
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
        return (
            <nav className="letter_list">
                {this._renderSections()}
            </nav>
        )
    }
}
export default CityNav;