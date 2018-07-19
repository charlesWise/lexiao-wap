'use strict'
import React from 'react';
import map from './../../../controllers/map';

var selfDefine = {

}
function init() {
    function StartMaker(center, length, color) {
        this._center = center;
        this._length = length;
        this._color = color;
    }
    StartMaker.prototype = new BMap.Overlay();
    StartMaker.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;
        // 创建div元素，作为自定义覆盖物的容器
        var div = document.createElement("div");
        var icon1 = document.createElement("img");
        var icon2 = document.createElement("img");
        icon1.src = '/images/map/icon_start.png';
        icon1.style = 'height:1.25rem;width:1.05rem;display:block';
        icon2.src = '/images/map/icon_current.png';
        icon2.style = 'height:0.8rem;width:0.8rem;display:block;margin:0 auto';
        div.appendChild(icon1);
        div.appendChild(icon2)
        div.style.position = "absolute";

        // 将div添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(div);
        // 保存div实例
        this._div = div;
        // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
        // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return div;
    }
    StartMaker.prototype.draw = function () {
        // 根据地理坐标转换为像素坐标，并设置给容器    
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._div.clientWidth / 2 + "px";
        this._div.style.top = position.y - this._div.clientHeight + "px";
    }
    StartMaker.prototype.show = function () {
        if (this._div) {
            this._div.style.display = "block";
        }
    }
    // 实现隐藏方法  
    StartMaker.prototype.hide = function () {
        if (this._div) {
            this._div.style.display = "none";
        }
    }

    // 添加自定义方法   
    StartMaker.prototype.toggle = function () {
        if (this._div) {
            if (this._div.style.display == "block") {
                this.hide();
            }
            else {
                this.show();
            }
        }
    }

    function EndMaker(center, length, color) {
        this._center = center;
        this._length = length;
        this._color = color;
    }
    EndMaker.prototype = new BMap.Overlay();
    EndMaker.prototype.initialize = function (map) {
        // 保存map对象实例
        this._map = map;
        // 创建div元素，作为自定义覆盖物的容器
        var icon1 = document.createElement("img");
        icon1.src = '/images/map/icon_end.png';
        icon1.style = 'height:1.25rem;width:1.05rem;display:block;position:absolute';

        // 将div添加到覆盖物容器中
        map.getPanes().markerPane.appendChild(icon1);
        // 保存div实例
        this._icon = icon1;
        // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
        // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
        return icon1;
    }
    EndMaker.prototype.draw = function () {
        // 根据地理坐标转换为像素坐标，并设置给容器    
        var position = this._map.pointToOverlayPixel(this._center);
        this._icon.style.left = position.x - this._icon.clientWidth / 2 + "px";
        this._icon.style.top = position.y - this._icon.clientHeight + "px";
    }
    EndMaker.prototype.show = function () {
        if (this._icon) {
            this._icon.style.display = "block";
        }
    }
    // 实现隐藏方法  
    EndMaker.prototype.hide = function () {
        if (this._icon) {
            this._icon.style.display = "none";
        }
    }

    // 添加自定义方法   
    EndMaker.prototype.toggle = function () {
        if (this._icon) {
            if (this._icon.style.display == "block") {
                this.hide();
            }
            else {
                this.show();
            }
        }
    }
    selfDefine.StartMaker = StartMaker;
    selfDefine.EndMaker = EndMaker;
}

class Map extends React.Component {
    constructor(...props) {
        super(...props);
        this.mp;
        this._pathShow = false;
        this.start;
        this.end;
    }
    componentDidMount() {
        var mp = new BMap.Map("map_placeholder");
        if (!selfDefine.StartMaker) {
            init();
        }
        mp.centerAndZoom(new BMap.Point(116.3964, 39.9093), 8);
        var { address, city } = this.props;
        // city = '杭州市';
        // address = '莫干山路545号-3室';
        map.getPointByAddress(address, city, (point) => {
            // console.log('point',point)
            if (point) {
                mp.setCenter(point);
                this.end = point;
                this.locate();

                // var marker = new selfDefine.EndMaker(point, '', '');
                // mp.addOverlay(marker);

            }
        })
        mp.setCurrentCity(city)
        this.mp = mp;
    }
    setPointByGPS(x, y) {

    }
    setPointByAddress(address, city) {

    }
    locate() {
        map.locate((r) => {
            this.start = r.point;
            this.mp.setCenter(this.start);
            if (this._pathShow) {
                this.hidePath();
            } else {
                this.showPath();
            }
            // var marker = new selfDefine.StartMaker(r.point, '', '');
            // if (this._startMaker) {
            //     this.mp.removeOverlay(this._startMaker);
            // }
            // this.mp.addOverlay(marker);
            // this._startMaker = marker;
        })
    }
    togglePath() {
        this.locate();
    }
    hidePath() {

    }
    showPath() {
        var { address, city } = this.props;
        // city = '杭州市';
        // address = '莫干山路545号';
        if (!this.driving) {
            this.driving = new BMap.WalkingRoute(city, {
                renderOptions: {
                    map: this.mp,
                    autoViewport: true
                },
                onSearchComplete:(result)=>{
                    if(this._isPointSearch ){
                        return;
                    }
                    if(!result.city){
                        this._isPointSearch = true;
                        driving.search(this.start,this.end);
                    }
                }
            });
        }
        var driving = this.driving;
        this._isPointSearch = false;
        driving.search(this.start,city+address);
        this._pathShow = true;
    }
    render() {
        var style = {
            ...styles.wrapper,
            ...this.props.style
        }
        return (
            <div
                id='map_placeholder'
                style={style}>

            </div>
        )
    }
}

const styles = {
    wrapper: {
        height: '100%',
        width: '100%'
    },

}

export default Map;