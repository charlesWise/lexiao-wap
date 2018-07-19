'use strict'
import http from 'web-http';
import Screen from './../views/components/Screen';


function emptyHandler(data,next,abort){
    next(data);
}
function error(data,next,abort){
    var httpLine = HttpLine.getCurrent(this);
    var screen = httpLine.getScreen();
    if(screen){
        screen.toast(data.message||'404');
    }
    next(data);
}
function fail(data,next,abort){
    var httpLine = HttpLine.getCurrent(this);
    var screen = httpLine.getScreen();
    if(screen){
        screen.toast(data.message||'404');
    }
    next(data);
}
function permissionError(data,next,abort){
    next(data);
}
function success(data,next,abort){
    next(data);
}
function beforeHandler(data,next,abort){
    var httpLine = HttpLine.getCurrent(this);
    httpLine.httpEntity.onsuccess = function(content){
        if(content.boolen=='0'){
            httpLine.errorProcess.start(content)
        }else{
            httpLine.successProcess.start(content)
        }   
    };
    httpLine.httpEntity.onerror = function(){
        httpLine.failProcess.start({status:'error',message:'网络错误'})
    };
    httpLine.httpEntity.send();
}
class Process{
    constructor(first,end){
        this._last = end || emptyHandler;
        this._first = first ||emptyHandler;;
        this._handlers = [];
        this.onend;
        this._data;
    }
    _doProcess(data){
        var index = -1;
        var data = data||null;
        var handlers = this._handlers.slice();
        if(this._last){
            handlers.push(this._last);
        }
        if(this._first){
            handlers.unshift(this._first);
        }
        var next = (_data)=>{
            index++;
            data = _data||data;
            var handler = handlers[index];
            if(handler){
                handler.call(this,data,next,abort);        
            }else{
                this.onend&&this.onend(data); 
            }
             
        }
        var abort = (_data)=>{
            this.onend&&this.onend(data);
        } 
        next();
    }
    addHandler(handler){
        this._handlers.push(handler)
    }
    start(data){
        this._doProcess(data);
    }
}
class HttpEntity{
    constructor(url,params,method,headers){
        this.url = url;
        this.params = params;
        this.method = method;
        this.headers = headers;
        this.onsuccess;
        this.onerror;
    }
    send(){
        http.http({
            url:this.url,
            method:this.method,
            headers:this.headers,
            body:this.params,
            onsuccess:this.onsuccess,
            onerror:this.onerror
        });
    }
}
const __HTTPLINECONT__ = '__HTTPLINEPARAMS__'
class HttpLine{
    static getCurrent(process):HttpLine{
        return process[__HTTPLINECONT__];
    }
    static setCurrent(process,httpLine){
        process[__HTTPLINECONT__] = httpLine;
    }
    httpEntity:HttpEntity;
    _screen:any;
    constructor(httpEntity:HttpEntity){

        this.httpEntity = httpEntity;
        this._screen = Screen.getCurrentScreen();
        this.beforeProcess = new Process(emptyHandler,beforeHandler);
        this.successProcess = new Process(emptyHandler,emptyHandler);
        this.permissionErrorProcess = new Process(emptyHandler,permissionError);
        this.errorProcess = new Process(emptyHandler,error);
        this.failProcess = new Process(emptyHandler,fail);

        HttpLine.setCurrent(this.beforeProcess,this);
        HttpLine.setCurrent(this.successProcess,this);
        HttpLine.setCurrent(this.permissionErrorProcess,this);
        HttpLine.setCurrent(this.errorProcess,this);
        HttpLine.setCurrent(this.failProcess,this);
    }
    getScreen(){
        return this._screen;
    }
    send(){
       setTimeout(()=>this.beforeProcess.start(this),10);
        return this;
    }
    before(handler){
        this.beforeProcess.addHandler(handler);
        return this;
    }
    success(handler){
        this.successProcess.addHandler(handler);
        return this;
    }
    error(handler){
        this.errorProcess.addHandler(handler);
        return this;
    }
    permissionError(handler){
        this.permissionErrorProcess.addHandler(handler);
        return this;
    }
    fail(handler){
        this.errorProcess.addHandler(handler);
        return this;
    }
}

function sendRequest(url,params,method,headers) {
    var httpEntity = new HttpEntity(url,params,method,headers);
    var httpLine = new HttpLine(httpEntity);
    httpLine.send();
    return httpLine;
}
function fake(data){
    var line =  new HttpLine({
        send:function(){
            this.onsuccess(data)
        }
    });
    line.send();
    return line;
}
export default {
    sendRequest,
    HttpEntity,
    HttpLine,
    fake
};