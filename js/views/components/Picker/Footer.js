import React, { Component } from 'react';

export default class Footer extends Component {
    constructor(...props) {
        super(...props);
        this.state = {}
    }

    render() {
        return (
            <div className="picker-footer">
                <ul>
                    <li><span onClick={()=>{
                        this.props.onReset && this.props.onReset()
                    }}>重置</span></li>
                    <li><span onClick={() => {
                        this.props.onSelected && this.props.onSelected()
                    }}>确定</span></li>
                </ul>
            </div>
        )
    }
}