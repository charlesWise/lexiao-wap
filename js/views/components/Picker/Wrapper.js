import React, { Component } from 'react';
export default class Wrapper extends Component {

    static defaultProps = {
        itemHeight: 36,
        height: 216
    };

    constructor(...props) {
        super(...props);
        this.state = {}
    }

    render() {
        const style = {
            height: this.props.height
        };

        const { itemHeight } = this.props;
        const highlightStyle = {
            height: itemHeight,
            marginTop: -(itemHeight / 2)
        };

        return (
            <div className={this.props.className||''} style={this.props.style}>
                {this.props.header ? this.props.header : null}
                <div className="picker-container" style={style}>
                    <div className="picker-inner">
                        {this.props.children}
                        <div className="picker-highlight" style={highlightStyle}></div>
                    </div>
                </div>
                {this.props.footer ? this.props.footer : null}
            </div>
        );
    }

}