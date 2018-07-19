
var fs = require('fs');
var http = require('http');
var URL = require('url');
function mkfile(filename, data) {
    var stream = fs.createWriteStream(filename);
    stream.write(data, function () {
        stream.end();
    });
}
function commet(data) {

}
function parseDescription(description) {
    return description && description.slice(3, -4) || '';
}
function parsePermission(permission) {
    return permission && permission[0].name || 'none';
}
function parseParameter(parameters) {
    return parameters.map(function (parameter) {
        return {
            name: parameter.field,
            description: parseDescription(parameter.description)
        }
    })
}
function parseSuccessResponse(data) {

}
function parseErrorResponse(data) {

}
function mergeData(){

}
function serialize(apis,old) {
    var string = 'export default [';
    var apiMap = {}
    var apinames=[];
    apis.forEach(function(api){
        apiMap[api.name]=api;
        apinames.push(api.name);
    })
    Object.values(apiMap).map(function (api) {
        var name = api.name;
        var url = api.url;
        var method = api.type;
        var version = api.version;
        var permission = api.permission;
        var description = api.description;
        var parameter = api.parameter && api.parameter.fields.Parameter || [];
        return {
            name,
            url,
            method,
            version,
            parameter: parseParameter(parameter),
            description: parseDescription(description),
            permission: parsePermission(permission)
        }
    }).forEach(function (api) {
        if (!api.name) {
            return;
        }
        var s = '  /**\r\n';
        s += '   *@name ' + api.name + '\r\n';
        s += '   *@version ' + api.version + '\r\n';
        s += '   *@description ' + api.description + '\r\n';
        s += '   *@permisstion ' + api.permission + '\r\n';
        s += '   *@method ' + api.method + '\r\n';
        api.parameter.forEach(function (parameter) {
            s += '   *@param ' + parameter.name + ':' + parameter.description + '\r\n';
        })
        s += '   */\r\n';
        s += '   {\r\n'
        s += '       name:\'' + api.name + '\',\r\n'
        s += '       url:\'' + api.url + '\',\r\n'
        s += '       method:\'' + api.method + '\',\r\n'
        s += '   },\r\n'
        string += '\r\n' + s;
    });
    if(old){
        [].reduce
        string+=old.reduce(function(pre,cur){
            if(apinames.indexOf(cur.name)==-1){
                pre = '  /**\r\n';
                pre += '   *@name ' + cur.name + '\r\n';
                pre += '   */\r\n';
                pre += '  {\r\n';
                pre += '       name:\'' + cur.name + '\',\r\n'
                pre += '       url:\'' + cur.url + '\',\r\n'
                pre += '       method:\'' + cur.method + '\',\r\n'
                pre += '   },\r\n'
            }
            return pre;
        },'');
    }
    string += '\r\n]';
    return string;
}
function getAPIData() {
    return new Promise(function (resolve, reject) {
        var path = 'http://testlxpc.tourongjia.com/api_doc/doc/api_data.json';
        var client = http.request(URL.parse(path), function (comingMessaage) {
            var data = '';
            comingMessaage.on('data', function (chunk) {
                data += chunk.toString('utf8');
            })
            comingMessaage.on('end', function () {
                resolve(JSON.parse(data));
            })
        });
        client.end();
    })

}
function start() {
    var argv = process.argv.slice(2);
    var filename = argv[0];
    filename='./js/constants/API_LIST.js';
    let old = fs.readFileSync(filename).toString('utf-8').replace('export default','');
    old = eval(old);
    getAPIData().then(function(data){
        mkfile(filename,serialize(data,old));
    });
}
start();