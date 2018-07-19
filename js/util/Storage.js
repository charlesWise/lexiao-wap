'use strict';

function isObject(value) {
  return value !== null && typeof value === 'object';
}

// 设置类型
function setType(key, val) {
  if(!key) return;
  if(isObject(key)) {
    key.forEach(function(v, k) {
      parse(k, v)
    });
    return;
  }
  parse(key, val);

  function parse(k, v) {
    v = v || false; // 默认值设置为 false
    v = isObject(v) ? JSON.stringify(v) : v;
    window.localStorage.setItem(k, v);
  }
}

// 取值
function getType(k, isObj) {
  if(!k) return;
  var val = '',
      locStr = window.localStorage.getItem(k);
  if(locStr) {
    if(isObj) {
      val = JSON.parse(locStr);
    } else {
      val = (locStr == 'undefined' || locStr == 'false') ? val : locStr;
    }
  }
  return val;
}

// 清除localStorage  支持字符串和数组
function remove(key) {
  if(!key) return;
  var isArray = Array.isArray(key);
  if(isArray) {
    key.forEach(function(v) {
      window.localStorage.removeItem(v);
    });
    return;
  }
  window.localStorage.removeItem(key);
}

// 获取localStorage中 支持k,v  和 {k:v}
function getObj(key) {
  return getType(key, true);
}

// 保存到localStorage中 支持k,v  和 {k:v}
function setObj(key, val) {
  setType(key, val);
}

// 设置成字符串 同时支持{}
function set(key, val) {
  setType(key, val);
}

// 获取值，返回字符串
function get(key) {
  return getType(key);
}

export default {
    getObj,
    setObj,
    set,
    get,
    remove
}