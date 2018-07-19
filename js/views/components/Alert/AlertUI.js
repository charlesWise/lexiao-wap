'use strict'
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Title from './Title';
import Message from './Message';
import Button from './Button';
class AlertUI extends Component{
    constructor(...props){
        super(...props);
    }
    componentDidMount(){
        var ui = ReactDOM.findDOMNode(this.refs.ALERT_UI);
        var clientHeight = document&&document.body.clientHeight;
        ui.style.bottom = (clientHeight-ui.clientHeight)/2+'px';

    }
    render(){
        return <div 
                ref = 'ALERT_UI'
                className = 'screenui-alertui'>
                <Title text={this.props.title}/>
                <Message text={this.props.message}/>
                <Button buttons={this.props.buttons}/>
            </div>
    }
}

export default AlertUI;