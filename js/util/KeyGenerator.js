'use strict'
function generator(){
    let key = ''
    let c = 0;
    for(let i=0;i<24;i++){
        c = Math.random()*16|0;
        c = i%4==0?c : (c&0x3|0x8);
        key+=c.toString(16);
    }
    return key;
}
export default generator;