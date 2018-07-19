'use strict'

function load(source,callback){
    if(typeof source=='string'){
        source =[source];
    }
    let total = source.length;
    let images = []
    let i = 0;
    source.forEach(function(url){
        let image = new Image();
        image.onload  = function(){
            i++;
            if(i===total){
                callback(images);
            }
        }
        image.onerror  = function(){
        }
        image.src = url;
        images.push(image)
    })
}

export default {
    load
}