'use strict'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ScreenComponent from './../../../components/ScreenComponent';
import ImageLoader from './../../../../util/ImageLoader';

const CANVAS_REF = 'CANVAS_REF';
class StatusView extends ScreenComponent {
    constructor(...props) {
        super(...props)
    }
    componentDidMount() {
        var {
            status,
            type,
            tipText,
            shingIMG,
            statusIMG
        } = this.props;
        ImageLoader.load([
            shingIMG,
            statusIMG,
            "/images/promotion/yaoyiyao_bg.png",
            "/images/promotion/yaoyiyao_bg_inner.png"
        ],
            this._draw
        );
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.tipText !== this.props.tipText) {
            var {
                status,
                type,
                tipText,
                shingIMG,
                statusIMG
            } = this.props;
            ImageLoader.load([
                shingIMG,
                statusIMG,
                "/images/promotion/yaoyiyao_bg.png",
                "/images/promotion/yaoyiyao_bg_inner.png",
            ],
                this._draw
            );
        }
    }
    

    _draw = (images) => {
        var [
            shingIMG,
            statusIMG,
            bg,
            bgInner
        ] = images;
        var {
            tipText
        } = this.props;

        var canvas = ReactDOM.findDOMNode(this.refs[CANVAS_REF]);

        var context: CanvasRenderingContext2D = canvas.getContext('2d');
        let {
            height,
            width
        } = canvas;
        canvas.height=height;
        let shingIMGRect = [0, 0, width, height];
        context.clearRect(0, 0, width, height);

        let {
            height: bgHeight,
            width: bgWidth
        } = bg;
        let {
            height: statusHeight,
            width: statusWidth
        } = statusIMG;
        let {
            height: bgInnerHeight,
            width: bgInnerWidth
        } = bgInner;
        let statusIMGRect = [(width - statusWidth) / 2, (height - statusHeight) / 2 - 20, statusWidth, statusHeight];
        let bgRect = [(width - bgWidth) / 2, (height - bgHeight) / 2, bgWidth, bgHeight];
        let bgInnerRect = [(width - bgInnerWidth) / 2, (height - bgInnerHeight) / 2, bgInnerWidth, bgInnerHeight];
        let innerH = 84;

        let r = 501;
        let ox = width / 2;
        let oy = height + 300
        context.drawImage(shingIMG, 0, 0);
        context.drawImage(bg, bgRect[0], bgRect[1]);
        context.drawImage(statusIMG, statusIMGRect[0], statusIMGRect[1]);
        context.drawImage(bgInner, bgInnerRect[0], bgInnerRect[1]);
        context.save();
        context.font = "800 40px Arial";
        context.translate(ox, oy);
        // context.beginPath();
        // context.arc(0,0,r,0,Math.PI*2,true);
        // context.closePath();

        context.stroke();
        context.fillStyle = '#EA4146';
        let dText = '';
        let codes = [];
        let sWitdh = context.measureText(' ').width;
        let baseAngle = 0;

        tipText.split('').forEach((c,i)=>{
            let angle;
            // if(/\d/.test(c)){
            //     dText+=c;
            // }else if(dText!==''){
            //     angle = (context.measureText(dText).width+sWitdh)/r;
            //     codes.push({
            //         code:dText,
            //         angle:baseAngle
            //     });
            //     baseAngle += angle;
            //     angle = (context.measureText(c).width+sWitdh)/r;
            //     codes.push({
            //         code:c,
            //         angle:baseAngle
            //     });
            //     baseAngle += angle;
            //     dText = '';
            // }else{
                angle = tipText.length-1?context.measureText(c).width/r:(context.measureText(c).width+sWitdh)/r;
                codes.push({
                    code:c,
                    angle:baseAngle
                });
                baseAngle += angle;

            // }

        });


        context.save();
        // let tw = context.measureText(tipText).width + (l - 1) * context.measureText(' ').width;


        context.textBaseline = 'middle';
        context.rotate(-baseAngle / 2);
        codes.forEach(function (c, i) {
            context.save();
            context.rotate(c.angle);
            // let cw = context.measureText(c.code).width;
            context.fillText(c.code, 0, (140 - 40) / 2 - r);
            context.restore();
           
        })
        context.restore();



    }

    render() {
        return (
            <canvas
                height='648'
                width='660'
                ref={CANVAS_REF}
                className="shake_prize">
            </canvas>
        );
    }
}
export default StatusView;
