'use strict'
import React from 'react';

import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import animation from 'js-core-animation';
const INDICATOR_REF = 'INDICATOR_REF';
var touch = "ontouchstart" in document;
var TOUCH_START = touch ? 'touchstart' : 'mousedown';
var TOUCH_MOVE = touch ? 'touchmove' : 'mousemove';
var TOUCH_END = touch ? 'touchend' : 'mouseup';
function bindEvent() {

}
function removeEvent() {

}
function Item(props) {
    var style = {
        ...styles.item,
        ...props.style
    }
    return (
        <li
            style={style}>
            {props.children}
        </li>
    )
}
var requestAnimaton = typeof window.requestAnimationFrame != 'undefined' ? window.requestAnimationFrame : function (callback) {
    return setTimeout(function () {
        callback(Date.now());
    }, 25);
}

var cancelAnimation = typeof window.requestAnimationFrame != 'undefined' ? window.cancelAnimationFrame : function (token) {
    return clearTimeout(token);
}

const ViewPagerScrollState = {
    idle: 'idle',
    dragging: 'dragging',
    settling: 'settling',
};
const VIEWPAGER_REF = 'VIEWPAGER_REF';
const PAGES_REF = 'PAGES_REF';


function translateTo(element,x){
    element.style.transform = `translate3d(${-x}px,0,0)`;
    element.style.WebKitTransform = `translate3d(${-x}px,0,0)`;
    return x;
}
function timing(){

}
class Swiper extends React.Component {
    static propTypes = {
        scrollEnabled: PropTypes.bool,
        initialPage: PropTypes.number,
        /** 
        * (event: NativeSyntheticEvent<ViewPagerAndroidOnPageScrollEventData>) => void;
        */
        onPageScroll: PropTypes.func,
        /**
         * (event: NativeSyntheticEvent<ViewPagerAndroidOnPageSelectedEventData>) => void;
         */
        onPageSelected: PropTypes.func,
        /*
        * (state: "Idle" | "Dragging" | "Settling") => void;
        */
        onPageScrollStateChanged: PropTypes.func,
        keyboardDismissMode: PropTypes.oneOf(["none", "on-drag"]),
        pageMargin: PropTypes.number,
        interval: PropTypes.number,
        duration: PropTypes.number,
        autoPlay: PropTypes.bool,
        loop: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string
    }
    static defaultProps = {
        interval: 2000,
        duration: 500,
        autoPlay: false,
        loop: false,
        initialPage: 0,
        keyboardDismissMode: 'none'
    }
    constructor(...props) {
        super(...props);
        this.state = {
        }
        this._lastTouchPoint;
        this._currentTouchPoint;
        this._timeToken = null;
        this._pageCount;
        this._scrollState = ViewPagerScrollState.idle;
        this._selected = 0;
        this._clientWidth;
        // this._translateX = 0;
        var _translateX = 0;
        Object.defineProperty(this,'_translateX',{
            get:function(){
                return _translateX;
            },
            set:(value)=>{
                _translateX = value;
                this._onScroll({
                    nativeEvent:{
                        target:ReactDOM.findDOMNode(this.refs[VIEWPAGER_REF])
                    }
                });
            }
        })
    }
    setPage(selectedPage: number): void {
        var viewPagerNode = ReactDOM.findDOMNode(this.refs[VIEWPAGER_REF]);
        // console.log(selectedPage)

        selectedPage = this._position(selectedPage);
        // var {
        //     clientWidth
        // } = viewPagerNode;
        var clientWidth = this._clientWidth;
        var destination = selectedPage * clientWidth;
        var s = destination - this._translateX;
        var translateX = this._translateX;
        if (s == 0) {
            return;
        } else {
            let count = Math.abs(s) / clientWidth;
            count = Math.abs(count);
            animation.timing({
                duration: this.props.duration * count,
                onProgress: (progress) => {
                    this._translateX = this._translateTo(viewPagerNode.firstElementChild,translateX+s * progress);
                    // viewPagerNode.scrollLeft = scrollLeft + s * progress;
                }
            }).start();
        }

    }
    setPageWithoutAnimation(selectedPage: number): void {
        var viewPagerNode = ReactDOM.findDOMNode(this.refs[VIEWPAGER_REF]);
        selectedPage = this._position(selectedPage);
        // var {
        //     // scrollLeft,
        //     clientWidth
        // } = viewPagerNode;
        var clientWidth = this._clientWidth;
        var destination = selectedPage * clientWidth;
        var s = destination - this._translateX;

        if (s == 0) {
            return;
        } else {
            this._translateX = this._translateTo(viewPagerNode.firstElementChild,destination);
            // viewPagerNode.scrollLeft = destination;

        }
    }
    _translateTo(node,translateX){
        if(translateX<0||translateX>(this._contentWidth-this._clientWidth)){
            return this._translateX;
        }
        this._translateX = translateTo(node,translateX);
        return this._translateX;
    }
    _position(page: number): number {
        if (this.props.loop && this._pageCount > 1) {
            page++;
        }
        return page;
    }
    _page(position: number): number {
        if (this.props.loop && this._pageCount > 1) {
            if (position == 0) {
                position = this._pageCount - 1;
            } else if (position == this._pageCount + 1) {
                position = 0;
            } else {
                position--;
            }
        }
        return position;
    }
    _play() {
        this._timeToken = setTimeout(() => {
            clearTimeout(this._timeToken);
            var page = this._page(this._selected) + 1;
            this.setPage(page);
        }, this.props.interval);
    }
    _stop() {
        clearTimeout(this._timeToken);
    }
    _onScroll = (e) => {
        var { target } = e.nativeEvent;
        var x = this._translateX;
        var width = this._clientWidth;
        var position = Math.floor(x / width);
        var offset = x / width - position;
        if (this._selected != position && x % width == 0) {
            this._selected = position;
            this._onPageSelected(position);
            this._onPageScrollStateChanged(ViewPagerScrollState.idle);
            if (this.props.autoPlay) {
                this._play();
            }
        }
        this._onPageScroll(position, offset);
    }
    _onPageSelected(position: number) {
        var page = this._page(position);
        this._selected = position;

        var event = {
            nativeEvent: {
                position: page
            }
        }
        if (this.props.loop && this._pageCount > 1) {
            if (position == 0) {
                this.setPageWithoutAnimation(this._pageCount - 1)
            } else if (position == this._pageCount + 1) {
                this.setPageWithoutAnimation(0)
            }
        }
        this.props.onPageSelected && this.props.onPageSelected(event);
        this.refs[INDICATOR_REF] && this.refs[INDICATOR_REF].onPageSelected(event);
    }
    _onPageScroll(position: number, offset: number) {
        var page = this._page(position);
        var event = {
            nativeEvent: {
                position: page,
                offset
            }
        }
        this.props.onPageScroll && this.props.onPageScroll(event);
    }
    _onPageScrollStateChanged(scrollState: string) {
        if (scrollState == this._scrollState) {
            return;
        }
        this._scrollState = scrollState;
        if (scrollState !== 'idle') {
            this._stop();
        } else if (this.props.autoplay) {
            this._play();
        }
        this.props.onPageScrollStateChanged && this.props.onPageScrollStateChanged(scrollState);
    }
    _onTouchStart = (e) => {
        this._stop();
        e.stopPropagation();
        // e.preventDefault();
        var { target } = e.nativeEvent;
        var point = e.nativeEvent.touches[0];
        point.timestamps = Date.now();
        this._currentTouchPoint = point;
    }
    _onTouchMove = (e) => {
        e.stopPropagation();
        // e.preventDefault();
        var now = Date.now();
        if(now - this._currentTouchPoint.timestamps<50){
            return;
        }
        var touches = e.nativeEvent.changedTouches;
        var point = touches[0];
        this._lastTouchPoint = this._currentTouchPoint;
        point.timestamps = now;
        this._moveByTouch(this._lastTouchPoint, point);
        this._currentTouchPoint = point;
        this._onPageScrollStateChanged(ViewPagerScrollState.dragging);
    }
    _onTouchEnd = (e:Event) => {
        e.stopPropagation();
        // e.preventDefault();
        var {
            _lastTouchPoint: lastTouchPoint,
            _currentTouchPoint: currentTouchPoint
        } = this;
        var isLeft = currentTouchPoint.screenX - lastTouchPoint.screenX < 0;
        if (currentTouchPoint.timestamps - lastTouchPoint.timestamps < 100) {
            this._onEnd(isLeft, true);
        } else {
            this._onEnd(isLeft);
        }
        this._lastTouchPoint = void (0);
        this._currentTouchPoint = void (0)
        this._onPageScrollStateChanged(ViewPagerScrollState.settling);
    }
    _onEnd(isLeft, forceToNext) {
        var {
            duration
        } = this.props;
        var viewPagerNode = ReactDOM.findDOMNode(this.refs[VIEWPAGER_REF]);
        var clientWidth = this._clientWidth;
        var translateX = this._translateX;
        let offset = (translateX % clientWidth) / clientWidth;
        if (!forceToNext) {
            if (offset > 0.5) {
                animation.timing({
                    duration: (1 - offset) * duration,
                    onProgress: (progress) => {
                        this._translateX = this._translateTo(viewPagerNode.firstElementChild,translateX+ progress * (1 - offset) * clientWidth);
                        // viewPagerNode.scrollLeft = scrollLeft + progress * ((1 - offset) * clientWidth)
                    }
                }).start();
            } else {
                animation.timing({
                    duration: offset * duration,
                    onProgress: (progress) => {
                        this._translateX = this._translateTo(viewPagerNode.firstElementChild,translateX-progress * (offset * clientWidth));
                        // viewPagerNode.scrollLeft = scrollLeft - progress * (offset * clientWidth)
                    }
                }).start();
            }
        }else{
            if(isLeft){
                animation.timing({
                    duration: (1 - offset) * duration,
                    onProgress: (progress) => {
                        this._translateX = this._translateTo(viewPagerNode.firstElementChild,translateX+ progress * (1 - offset) * clientWidth);
                        // viewPagerNode.scrollLeft = scrollLeft + progress * ((1 - offset) * clientWidth)
                    }
                }).start();
            }else{
                animation.timing({
                    duration: offset * duration,
                    onProgress: (progress) => {
                        this._translateX = this._translateTo(viewPagerNode.firstElementChild,translateX-progress * (offset * clientWidth));
                        // viewPagerNode.scrollLeft = scrollLeft - progress * (offset * clientWidth)
                    }
                }).start();
            }
        }
    }
    _moveByTouch(start, end) {
        var viewPagerNode = ReactDOM.findDOMNode(this.refs[VIEWPAGER_REF]);
        var translateX = this._translateX+start.screenX - end.screenX;
        this._translateX = this._translateTo(viewPagerNode.firstElementChild,translateX);
       // viewPagerNode.scrollLeft += (start.screenX - end.screenX);
    }
    _findViewPagerNode() {
        return ReactDOM.findDOMNode(this.refs[VIEWPAGER_REF]);
    }
    componentDidMount() {
        var viewPagerNode = ReactDOM.findDOMNode(this.refs[VIEWPAGER_REF]);
        var {
            initialPage
        } = this.props;
        if (this.props.loop && this._pageCount > 1) {
            initialPage++;
        }
        this._selected = initialPage;
        //可能会有bug
        this._clientWidth = viewPagerNode.clientWidth;
        this._contentWidth = viewPagerNode.scrollWidth;
        this._translateX = this._translateTo(viewPagerNode.firstElementChild,initialPage * this._clientWidth);
        if (this.props.autoPlay) {
            this._play();
        }
    }
    componentWillReceiveProps(nextProps) {
        if(React.Children.count(nextProps.children)!==React.Children.count(this.props.children)){
            this._contentWidth = this._clientWidth*React.Children.count(nextProps.children);
        }
    }

    componentWillUnmount() {
        this._stop();
    }

    _childrenWithOverridenStyle(children): Array {
        var count = children.length;
        var width = 100 / count + '%',
            children = children.map(function (child, i) {
                if (!child) {
                    return null;
                }
                var style = child.props.style || {};
                var newProps = {
                    ...child.props,
                    key: i,
                    style: {
                        ...style,
                        ...styles.item,
                        width
                    }
                }
                return React.cloneElement(child, newProps);
            });
        return children;
    }
    render() {
        var wrapperStyle = this.props.style ? Object.assign({}, styles.wrapper, this.props.style) : styles.wrapper;
        var swiperStyle = styles.swiper;
        var sceneStyle = styles.scene;
        var children = React.Children.toArray(this.props.children);
        var count = children.length;
        this._pageCount = count;
        if (this.props.loop && count > 1) {
            children.push(children[0]);
            children.unshift(children[count - 1]);
            count = count + 2;
        }
        var Indicator = this.props.indicator;
        return <div
            style={wrapperStyle}
            className={this.props.className}>
            <section
                style={styles.swiper}
                ref={VIEWPAGER_REF}
                onTouchStart={this._onTouchStart}
                onTouchMove={this._onTouchMove}
                onTouchEnd={this._onTouchEnd}
                onScroll={this._onScroll}>
                <div
                    ref={PAGES_REF}
                    style={{ ...sceneStyle, width: 100 * count + '%' }}>
                    {this._childrenWithOverridenStyle(children)}
                </div>
            </section>
            {
                Indicator && <Indicator
                    ref={INDICATOR_REF}
                    initialPage={this.props.initialPage}
                    closeScreen={()=>this.props.closeScreen()}
                    count={this._pageCount} />
            }
        </div>
    }
}

var styles = {
    wrapper: {
        position: 'relative'
    },
    swiper: {
        height: '100%',
        width: '100%',
        overflow: 'hidden'
    },
    scene: {
        height: '100%',
    },
    item: {
        overflow: 'hidden',
        height: '100%',
        display: 'inline-block',
    }
}

export default Swiper;