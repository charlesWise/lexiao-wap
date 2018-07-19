'use strict'
import React from 'react';
var isRGBASupport = true;
try{
    var p = document.createElement('p');
    p.style.backgroundColor = 'rgba(0,0,0,0.23)';
}catch(e){
    isRGBASupport = false;
}
const DotColor = ['white', isRGBASupport?'rgba(0,0,0,0.23)':'rgb(0,0,0)'];

const DotStyle = {
    height: '8px',
    width: '8px',
    display: 'inline-block',
    borderRadius: '4px',
    margin: '0 6px'

}
const IndicatorStyle = {
    wrapper: {
        position: 'absolute',
        bottom: '16px',
        left: 0,
        right: 0,
        zIndex:20170412,
        textAlign: 'center',
        backgroundColor: 'transparent',
    }
}
function Dot(props) {
    var isCurrent = props.current;
    var isMouseOn = props.isMouseOn;
    var style = {};
    Object.assign(style, DotStyle);
    if (isMouseOn) {
        style.height = '16px';
        style.width = '16px';
        style.borderRadius = '8px';
    }
    if (isCurrent) {
        style.backgroundColor = DotColor[0];
    } else {
        style.backgroundColor = DotColor[1];
    }

    return <span onClick = {()=>props.onClick(props.index)} style={style}></span>
}
export default class Indicator extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
            currentPage: 0,
            isMouseOn: false
        }
        this.mouseTimeoutToken;
    }
    onPageSelected(currentPage) {
        this.setState({ currentPage })
    }
    _onMouseOut(e) {
        if (this.state.isMouseOn) {
            setTimeout(() => this.setState({ isMouseOn: false }), 200)
        }
        e.stopPropagation();

    }
    _onMouseOver(e) {
        clearTimeout(this.mouseTimeoutToken);
        if (!this.state.isMouseOn) {
            this.setState({
                isMouseOn: true
            });
        }
        e.stopPropagation();
    }
    componentWillUnmount() {
        clearTimeout(this.mouseTimeoutToken)
    }
    _onDotClick(index){
        this.props.onIndicatorClick&&this.props.onIndicatorClick(index);
    }
    render() {
        return <p
            onMouseEnter={(e) => {
                this._onMouseOver(e)
            }}
            onMouseLeave={(e) => {
                this._onMouseOut(e)
            }}
            style={IndicatorStyle.wrapper}
            children={(function (i, state,context) {
                var children = [];
                for (var j = 0; j < i; j++) {
                    children.push(<Dot index={j} onClick ={(i)=>context._onDotClick(i)} isMouseOn={state.isMouseOn} current={j == state.currentPage} />);
                }
                return children;
            })(this.props.count, this.state,this)} />
    }
}
