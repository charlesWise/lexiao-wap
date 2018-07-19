import React from 'react';
import ScreenComponent from './../ScreenComponent';
import Header from './Header';
import Input from './Input';
class SearchBar extends ScreenComponent {
    constructor(...props) {
        super(...props);
    }
    setInputValue(value){
        if(this.props.type==='input'&&this.refs.input){
            this.refs.input.setValue(value);
        }
    }
    render() {
        let props = this.props;
        let { type } = props;
        switch (type) {
            case 'header':
                return <Header {...props}/>;
            case 'input':
                return <Input ref='input' {...props}/>;
            default:
                return null;
        }
    }
}
export default SearchBar;