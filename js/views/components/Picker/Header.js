import React, { Component } from 'react';

export default class Header extends Component {
    constructor(...props) {
        super(...props);
        this.state = {}
    }

    render() {
        return (
            <div className='picker-header'>
                <a className='cancel' onClick={()=>{
                    this.props.onCancel && this.props.onCancel()
                }}>取消</a>
                <a className='sure' onClick={() => {
                    this.props.onSelected && this.props.onSelected()
                }}>确定</a>
            </div>
        )
    }
}