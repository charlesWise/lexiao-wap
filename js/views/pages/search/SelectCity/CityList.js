import React from 'react';
import ScreenComponent from './../../../components/ScreenComponent';
import api from './../../../../controllers/api';
import localLocation from './../../../../controllers/localLocation'
import alphabet from './../../../../constants/ALPHABET';
import animation from 'js-core-animation';
class CityList extends ScreenComponent {
    constructor(...props) {
        super(...props);
        this.state = {
            data: {}
        }
        this._scrollAnimation;
    }
    componentDidMount() {
        this._getData();
    }
    componentWillUnmount(){
        if(this._scrollAnimation){
            this._scrollAnimation.finish();
        }
    }
    scrollTo(sectionName) {
        let section = this.refs['section-' + sectionName];
        let wrapper = document.getElementsByClassName('city_list');
        
        if(section&&wrapper){
            let s = section.offsetTop-wrapper[0].scrollTop;
            let src=wrapper[0].scrollTop;
            if(this._scrollAnimation){
                this._scrollAnimation.finish();
            }
            this._scrollAnimation=animation.ease({
                duration:Math.abs(s/40),
                onProgress:function(progress){
                    wrapper[0].scrollTop=s*progress+src;
                }
            });
            this._scrollAnimation.start();
            
        }
        
    }
    _getData() {
        api.getCityList().success((content, next) => {
            this.setState({
                data: content.data
            });
            next();
        })
    }
    _setCity(city,code) {
        localLocation.setCurrentCity(city,code);
        this.getScreen().getNavigation().goBack();
    }
    _renderCityList() {
        let { data } = this.state;
        if (!data) {
            return null;
        }
        return alphabet.map((code, i) => {
            let items = data[code];
            if (!items || items.length == 0) {
                return null;
            }
            return (
                <dl
                    ref={'section-' + code}
                    key={code}>
                    <dt>
                        {code}
                    </dt>
                    {this._renderSection(items)}
                </dl>
            );
        })
    }
    _renderSection(items) {
        return items.map((item, i) => {
            return (
                <dd
                    onClick={() => this._setCity(item.name,item.code)}
                    key={i}>
                    {item.name}
                </dd>
            );
        });

    }
    render() {
        return (
            <section
                ref='wrapper' 
                className="city-place-list">
                {this._renderCityList()}
            </section>
        );
    }
}

export default CityList;