import React from 'react';
import ReactDOM from 'react-dom';

const TIME_INTERVAL = 15;

function getS(points) {
    let [point1, point2] = points;
    return Math.sqrt(Math.pow((point1.clientX - point2.clientX), 2) + Math.pow((point1.clientY - point2.clientY), 2));
}

function cssText(style) {
    let r = '';
    for (let o in style) {
        r = r + o + ':' + style[o] + ';';
    }
    return r;
}

const MAP = new Map();
let KEY = 1;
class ResizeImage extends React.Component {
    static reset(){
        MAP.forEach((item)=>{
            item.reset();
        })
    }
    constructor(...props) {
        super(...props);
        this.state = {
            src: ''
        };
        this.matcher = 1;
        this.om = 1;
        this.ow;
        this.oh;
        this.height;
        this.width;
        this.translateX = 0;
        this.translateY = 0;
        this.key = KEY++;
        MAP.set(this.key,this);

        
    }
    componentWillUnmount(){
        MAP.delete(this.key);
    }
    _renderImage() {
        if (this.props.src !== this.state.src) {
            this._measure();
            return null;
        } else {
            return this.state.image;
        }
    }
    reset() {
        this.matcher = this.om;
        this.translateX = 0;
        this.translateY = 0;
        this._setStyle();
    }
    _setStyle() {
        let image = ReactDOM.findDOMNode(this.refs['p']).firstElementChild;
        let style = this._style();
        image.style.cssText = cssText(style);

    }
    _style() {
        let position = 'absolute';
        let {
            ow,
            oh,
            matcher,
            translateX,
            translateY,
        } = this;

        const SCREEN_WIDTH = document.body.clientWidth;
        const SCREEN_HEIGHT = document.body.clientHeight;

        this.width = ow * matcher;
        this.height = oh * matcher;

        let top = (SCREEN_HEIGHT - this.height) / 2;
        let left = (SCREEN_WIDTH - this.width) / 2;


        top += translateY;
        left += translateX;

        if (left > 0) {
            if(this.width == this.height) {
                left = (SCREEN_WIDTH - this.width) / 2;
            }else {
                left = 0;
            }
        } else if (this.width + left < SCREEN_WIDTH) {
            left = SCREEN_WIDTH - this.width;
        }
        this.top = top;
        this.left = left;
        this.SCREEN_WIDTH = SCREEN_WIDTH;
        this.SCREEN_HEIGHT = SCREEN_HEIGHT;

        return {
            top: Math.round(top) + 'px',
            left: Math.round(left) + 'px',
            position,
            height: this.height + 'px',
            width: this.width + 'px'
        };
    }
    _measure() {
        let src = this.props.src;
        let image = new Image();
        image.onload = () => {

            let {
                width,
                height
            } = image;

            const SCREEN_WIDTH = document.body.clientWidth;
            const SCREEN_HEIGHT = document.body.clientHeight;


            this.ow = width;
            this.oh = height;
            this.width = width;
            this.height = height;
            let rw = width / SCREEN_WIDTH;
            let rh = height / SCREEN_HEIGHT;

            if (rw > rh) {
                this.matcher = Math.min(width, SCREEN_WIDTH) / width;
            } else {
                this.matcher = Math.min(height, SCREEN_HEIGHT) / height;
            }


            this.om = this.matcher;
            let style = this._style();
            let _image = <img
                onTouchStart={this._onTouchStart}
                onTouchMove={this._onTouchMove}
                onTouchEnd={this._onTouchEnd}
                src={src}
                style={style} />

            this.setState({
                src: this.props.src,
                image: _image
            });
        }
        image.src = src;

    }
    _zoom(e) {
        e.stopPropagation();

        let start = this._startTouches;
        let end = e.targetTouches;

        let s0 = getS(start);
        let s1 = getS(end);
        let matcher = this.matcher;



        this._startTouches = end;
        this.matcher = matcher * s1 / s0;

        if (this.matcher >= 8) {
            this.matcher = 8;
        }
        if (this.matcher < this.om / 2) {
            this.matcher = this.om / 2;
        }
        this._setStyle();

    }
    _move(e) {
        let start = this._startTouches;
        let end = e.changedTouches || e.targetTouches;

        let sx = end[0].clientX - start[0].clientX;
        let sy = end[0].clientY - start[0].clientY;

        this._startTouches = end;

        this.translateX += sx;
        this.translateY += sy;

        this._setStyle();

        if (this._canMove()) {
            e.stopPropagation();
        }
    }
    _canMove() {
        let {
            translateX,
            translateY,
            width,
            left,
            SCREEN_WIDTH
        } = this;
        if (left == 0) {
            return false;
        } else if (width + left <= SCREEN_WIDTH) {
            return false
        }
        return true;

    }
    _canZoom() {
        return this.matcher <= 8 || this.matcher >= this.om / 2;
    }
    _onTouchStart = (e) => {
        let touches = e.targetTouches;
        this._startTouches = touches;
        if (touches.length > 1) {
            this._zoomMode = true;
        } else {
            this._zoomMode = false;
        }
    }
    _onTouchMove = (e) => {
        if (this._zoomMode) {
            this._zoom(e)
        } else {
            this._move(e);
        }
    }
    _onTouchEnd = (e) => {
        if (this._zoomMode) {
            this._zoom(e)
        } else {
            this._move(e);
        }
        this._zoomMode = false;

        this._endTouch();
    }
    _endTouch() {
        if (this.matcher < this.om) {
            this.matcher = this.om;
            this._setStyle();
        }
    }
    render() {
        return (
            <p
                ref="p"
                style={{
                    position: 'relative',
                    ...this.props.style
                }}>
                {this._renderImage()}
            </p>
        );
    }
}

export default ResizeImage;