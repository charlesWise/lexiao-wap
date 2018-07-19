'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import SearchBar from './../../../components/SearchBar';
import Suggestion from './Suggestion';
import localLocation from './../../../../controllers/localLocation';

const SUGGESTION_REF = 'SUGGESTION_REF';

class SearchCity extends ScreenComponent {
    static pageConfig = {
        path:'/search/citysearch',
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title:'选择城市'
        }
        this.state={
            inputValue:''
        }
    }
    _inputOnChange=(e)=>{
        var value = e.target.value;
        this.state.inputValue = value;
        
        this.refs[SUGGESTION_REF] && this.refs[SUGGESTION_REF].suggest(this.state.inputValue);
    }
    _onSelected=(item)=>{
        localLocation.setCurrentCity(item.city_name,item.city_code);
        APPContext.resetNavigator();
    }
    render() {
        return <div className="search_container">
             <SearchBar 
                type = 'input'
                onChange={this._inputOnChange}
                placeholder='请输入'/>
             <div className="search_section base-search-bar-after">
                <Suggestion 
                    onSelected={this._onSelected}
                    ref={SUGGESTION_REF}/>
            </div>
        </div>
    }
}

export default SearchCity;