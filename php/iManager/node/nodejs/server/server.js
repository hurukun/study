var http = require("http"),
    url = require('url'),
    querystring = require('querystring'),
    Util = require( './frame' ),
    os = require('os'); 

/**
 * http 服务器
 * @param {function} route  请求分发
 * @param {object} handle 请求分发映射关系
 * @param {number} port   服务端口号
 */
var Http = function(route, handle, port) {
    this.route = route;
    this.handle = handle;
    this.port = port;
};
/**
 * 开启服务
 */
Http.prototype.start = function() {
    http.createServer( Util.bind( this.onRequest, this ) ).listen(this.port);
    console.log('Server on:' + this.port + ' has started.')
}
/**
 * 请求响应函数
 */
Http.prototype.onRequest = function(request, response) {
    var me = this,
        postData = '',
        urlObject = url.parse(request.url, true),
        url2Proxy = urlObject.query && urlObject.query.url || '';
    /**
     * 代理异地请求
     */
    if (url2Proxy) {
        this.proxy(url2Proxy, response);
    } 
    /**
     * 分发本地请求
     */
    else {
        console.log("request for:" + urlObject.pathname + ' received.');

        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Received POST data chunk '" + postDataChunk + "'.");
        });

        request.addListener("end", function() {
            me.route(urlObject.pathname, me.handle, postData, response);
        });
    }
};
/**
 * 服务器代理
 */
Http.prototype.proxy = function(urlToProxy, response) {
    var parsedUrl = url.parse(urlToProxy);
    var opt = {
        host: parsedUrl.hostname,
        port: parsedUrl.port || 80,
        path: (parsedUrl.pathname || "") + (parsedUrl.search || "") + (parsedUrl.hash || "")
    };
    /**
     * 向其它服务器请求
     */
    http.get(opt, function(pres) { // 请求被代理 URL 的内容
        response.statusCode = pres.statusCode;
        var headers = pres.headers;
        for (var key in headers) {
            response.setHeader(key, headers[key]);
        }
        pres.on("data", function(chunk) {
            response.write(chunk); // 写回数据
        });
        pres.on("end", function() {
            response.end();
        });
    });
};

exports.Http = Http;

/**
 * 开始服务器
 */
var socket = require('socket.io');

var Socket = function( route, handle, port ){
    this.route = route;
    this.handle = handle;
    this.port = port;
};

Socket.prototype.start = function(){
    var me = this,
        io = socket.listen( this.port ); 

     io.on("connection", function(client){ 
        client.send ( 'Now connected!' );
        client.on('message', function (msg) {
            client.send( 'received: ' + msg);
        }) ;
        client.on('disconnect', function () {
        });
     });
};

exports.Socket = Socket;


var net = require( 'net' );

var TCP = function( route, handle, port ){
    this.route = route;
    this.handle = handle;
    this.port = port;
};

TCP.prototype.start = function(){
        net.createServer( Util.bind( this.onConnected, this )).listen( this.port );
        console.log( 'TCP server on port: ' + this.port );
};
TCP.prototype.onConnected = function( socket ){
    console.log( 'on TCP connected' );
    socket.setEncoding("utf8"); 
    var buffer = [], len = 0; 
    socket.on("data", function(data) { // 接收到客户端数据
        console.log('TCP data:' + data );
        if (data.charCodeAt(0) == 13) { 
            var expr = buffer.join(""); 
            try { 
                var result = eval(expr); // 进行计算
                socket.write(result.toString()); // 写回结果
            } catch (e) { 
                socket.write("Wrong expression."); 
            } finally { 
                socket.write(" "); 
                buffer = []; 
            } 
        } 
        else { 
            buffer.push(data); 
        } 
    }); 
};

exports.TCP = TCP;

/**
 * websocket-server 版本与 nodejs 不匹配
 */
var websocketserver = require( 'websocket-server' );

var WebSocketServer = function( route, handle, port ){
    this.route = route;
    this.handle = handle;
    this.port = port;
};

WebSocketServer.prototype.start = function(){
    var server = websocketserver.createServer();
    console.log( 'websocket server on port: ' + this.port );

    server.on( 'connection', function( client ){
        client.send ( 'Now connected!' );
        client.on('message', function (msg) {
            client.send( 'received: ' + msg);
        }) ;
        client.on('disconnect', function () {
        });
    } );
    
    server.listen(this.port );
};

exports.WebSocketServer = WebSocketServer;
