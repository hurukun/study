var util = require('util'),
    url = require('url'),
    http = require('http');

var proxyDelegate = function( request, response, options ){
    if( request.method === 'GET' ){
        proxyGet( request,response, options )
    }
    else if( request.method === 'POST' ){
        proxyPost( request, response, options );
    }
}
/**
 * 服务器代理
 */
var proxyGet = function( request, response, options ) {
    var opt = {
        host: options.host,
        port: options.port || 80,
        path: (options.path || "") + (options.search || "") + (options.hash || ""),
        headers:{
            Cookie: request.headers[ 'cookie' ]
        }
    };


    /**
     * 向其它服务器请求
     */
    var proxyReq = http.get(opt, function( proxyResponse) { // 请求被代理 URL 的内容
        response.statusCode = proxyResponse.statusCode;
        var headers = proxyResponse.headers;
        for (var key in headers) {
            response.setHeader(key, headers[key]);
        }

        proxyResponse.on("data", function(chunk) {
            if( options.onData ){
                options.onData.call( null, chunk );
            }
        });

        proxyResponse.on("end", function() {
            if( options.onEnd ){
                options.onEnd.call( null );
            }
            response.end();
        });
    });
};


/**
 * 代理post请求
 * @param  {Object} options  代理相关参数
 *                           host
 *                           path
 *                           port
 *                           onData
 *                           onEnd
 */
var proxyPost = function( request, response, options ){
    var proxyPostData = '';
    /**
     * 获取 post 数据
     */
    request.addListener('data', function(chunk){ 
        proxyPostData +=chunk;
    });
    /**
     * 转发请求
     */
    request.addListener('end', function(){
        /**
         * 请求参数
         * @type {Object}
         */
        var proxyOption = {
                host: options.host,
                path: options.path,
                port: options.port || 80,
                method: 'POST',
                headers: {
                    'Content-Length': request.headers[ 'content-length' ],
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie':request.headers[ 'cookie' ]
                }
            } ;
        /**
         * 创建请求
         */
        var proxyReq = http.request(proxyOption, function( proxyResp ){
            response.statusCode = proxyResp.statusCode;
            var headers = proxyResp.headers;
            for (var key in headers) {
                response.setHeader(key, headers[key]);
            }
            proxyResp.on('data', function (chunk) {
                if( options.onData ){
                    options.onData( chunk );
                }
            });
            proxyResp.on( 'end', function(){
                if( options.onEnd ){
                    options.onEnd();
                }
                response.end();
            } );
        });
        /**
         * 设置 post数据
         */
        proxyReq.write( proxyPostData + '\n' );
        /**
         * 发送请求
         */
        proxyReq.end();
        /**
         * 恢复现场
         * @type {String}
         */
        proxyPostData = '';
    } );
}

exports.proxy = proxyDelegate;
exports.get = proxyGet;
exports.post = proxyPost;