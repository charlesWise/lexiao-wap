'use strict'
function getPointIndex(n) {
    var ns = n.toString();
    var pointIndex = ns.indexOf('.') + 1;
    return pointIndex ? ns.length - pointIndex : pointIndex;
}

function add(a, b) {
    a = a || 0;
    b = b || 0;
    var ints = toInt(a,b);
    return (ints.a + ints.b) / Math.pow(10,ints.times);
}
function minus(a, b) {
    a = a || 0;
    b = b || 0;
    var ints = toInt(a,b);
    return (ints.a - ints.b) / Math.pow(10,ints.times);
}
function times(a, b) {
    a = a || 0;
    b = b || 0;
    var ints = toInt(a,b);
    return ints.a * ints.b / Math.pow(10,ints.times)/Math.pow(10,ints.times)
}
function divided(a, b) {
    a = a || 0;
    b = b || 0;
    var ints = toInt(a,b);
    return ints.a / ints.b;
}
function randInt(max,min){
    min = min||0;
    return Math.floor(Math.random() * (max - min) + min)
}
function toInt(a,b){
    var aIndex = getPointIndex(a);
    var bIndex = getPointIndex(b);
    a = parseInt(a.toString().replace('.',''));
    b = parseInt(b.toString().replace('.',''));
    var times;
    if(aIndex>bIndex){
        b = b* Math.pow(10, aIndex-bIndex);
        times = aIndex;
    }else{
        a = a* Math.pow(10, bIndex-aIndex);
        times = bIndex;
    }
    return {
        a,
        b,
        times
    }
}
export default {
    add: add,
    minus: minus,
    times: times,
    divided: divided,
    randInt:randInt
}