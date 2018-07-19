'use strict'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
class Rule extends Component {
    constructor(...props) {
        super(...props);
    }
    componentDidMount() {
        if (this.refs['p']) ReactDOM.findDOMNode(this.refs['p']).innerHTML = this.props.rule;
    }
    componentDidUpdate(){
        if (this.refs['p']) ReactDOM.findDOMNode(this.refs['p']).innerHTML = this.props.rule;
    }
    
    render() {
        if (!this.props.display) {
            return null;
        }
        return (
            <div className="win_sucess">
                <h1>活动规则
                    <i
                        onClick={this.props.onClose}
                        className="icon_del" />
                </h1>
                <p 
                    ref='p'
                    className="win_rule">
                    
                </p>
            </div>
        );
    }
}

export default Rule;