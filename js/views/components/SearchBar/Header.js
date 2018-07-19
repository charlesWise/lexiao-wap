import React from 'react';
import ScreenComponent from './../ScreenComponent';

class Header extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    _goBack = () => {
        let onBack = this.props.onBack;
        if (!onBack || !onBack()) {
            this.getScreen().getNavigation().goBack();
        }

    }
    _renderCity() {
        if (this.props.needCity) {
            return (
                <a
                    className="base-search-city"
                    href="#/search/cityselect">
                    {this.props.city}
                </a>
            );
        }else{
            return null;
        }
    }
    render() {
        let props = this.props;
        let className = 'base-search-text';
        if(!props.needCity){
            className+= ' base-search-text-fill';
        }
        let href = this.props.href||"#/search/merchant";
        return (
            <header 
                style = {this.props.style}
                className="base-search-bar">
                {this._renderCity()}
                <a
                    className={className}
                    href = {href}
                    >
                    {props.placeholder || '输入商户名、地点'}
                </a>
            </header>
        );

    }
}

export default Header;