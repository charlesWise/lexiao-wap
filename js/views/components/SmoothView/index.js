import React from 'react';

function tWidth(itemWidth,count){
    var unit = '';
    if(/([a-z]+$)/i.test(itemWidth)){
        unit = RegExp.$1;
    }
    return parseFloat(itemWidth)*count+unit;
}
function SmoothView(props){
    var {
        children,
        itemWidth,
        className,
        style
    } =props;
    var count = React.Children.count(children);

    var ulstyle = {
        width:tWidth(itemWidth,count),
        overflowX:'auto'
    }
    return (
        <div
            className={className}
            style={style}
            >
            <ul style={ulstyle}>
                {children}
            </ul>
        </div>
    );
}
export default SmoothView;