'use strict'
import React, { Component } from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import SearchBar from './../../../components/SearchBar';
import LocationCity from './LocationCity';
import CityNav from './CityNav';
import HotCity from './HotCity';
import CityList from './CityList';
import alphabet from './../../../../constants/ALPHABET';

class SelectCity extends ScreenComponent {
    static pageConfig = {
        path: '/search/cityselect',
    }
    constructor(...props) {
        super(...props);
        this.navigationOptions = {
            title:'选择城市'
        }
        this.state = {
            navIndex:''
        }
        this.isScroll = false;
        this._onScroll = this._onScroll.bind(this);
    }

    componentDidMount(){
        this.listContainer.addEventListener("scroll",this._onScroll,false);
    }

    _onNavItemClick=(sectionName)=>{
        this.isScroll = true;
        this.setState({navIndex:sectionName});
        this.refs.CITYLIST_REF&&this.refs.CITYLIST_REF.scrollTo(sectionName);
        this.isScroll = false;
    }

    _onScroll(e){
        let scrollTop=this.listContainer.scrollTop;
        if(!this.isScroll){
            let alp = [].concat(alphabet);
            for(let item of alp.reverse()){
                let section = this.refs.CITYLIST_REF.refs['section-' + item];
                if(section){
                    let offsetTop = section.offsetTop;
                    if(scrollTop >= offsetTop){
                        this.setState({navIndex:item});
                        break;
                    }else if(item === "A" && scrollTop < offsetTop){
                        this.setState({navIndex:''});
                        break;
                    }
                }
            }
        }
    }

    render() {
        return (
            <div>
                <SearchBar
                    type='header'
                    href='#/search/citysearch'
                    placeholder='请选择城市' />
                <div className='base-search-bar-after'>
                    <div className = 'city_list' ref={(name)=>this.listContainer=name}>
                        <LocationCity />
                        <HotCity />
                        <CityList 
                            ref='CITYLIST_REF'/>
                    </div>
                    <CityNav 
                        onItemClick={this._onNavItemClick} navIndex={this.state.navIndex}/>
                </div>
            </div>
        );
    }
}

export default SelectCity;