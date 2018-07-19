'use strict'

import keyGenerator from './KeyGenerator';

class ShakeEvent {
    constructor() {
        this._handlers = [];
        this._lastAcceleration;
        this._lastTime;
        this._sharked = false;
        this._timeout;
        try {
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', this._onDeviceMotion, false)
            } else {
                alert('not support mobile event');
            }
        } catch (e) {

        }
    }
    _onDeviceMotion = (e:Event) => {
        e.preventDefault();
        if (!this._lastTime) {
            this._lastTime = Date.now();
            this._lastAcceleration = e.accelerationIncludingGravity;
            return;
        }
   
        let curTime = Date.now();
        let diffTime = curTime - this._lastTime;
        if (diffTime > 100) {
            // if (this._sharked) {
            //     this._emit();
            //     return;
            // }
            let {
                x, y, z
            } = e.accelerationIncludingGravity;
            let {
                x:last_x,
                y:last_y,
                z:last_z
            } = this._lastAcceleration;
            let speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
            if (speed > 2000) {
                this._sharked = true;
                this._emit();
                return;
            }
            this._lastAcceleration = e.accelerationIncludingGravity;
            this._lastTime = curTime;
        }
    }
    _emit() {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(() => {
            this._sharked = false;
            this._lastAcceleration = undefined;
            this._lastTime = undefined;
            this._handlers.forEach((eventHandler) => {
                eventHandler.call();
            })
        }, 200)
    }
    on(eventHandler) {
        this._handlers.push(eventHandler);
    }
    remove(eventHandler) {
        for (let i = 0, l = this._handlers.length, handlers = this._handlers; i < l; i++) {
            if (handlers[i] === eventHandler) {
                handlers.splice(i, 1);
                break;
            }
        }
    }
}

var shakeEvent = new ShakeEvent();
export default shakeEvent;

