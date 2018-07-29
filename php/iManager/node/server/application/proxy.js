var url = require('url'),
    http = require('http'),
    querystring = require('querystring');

exports.class = function( req, res ){
    this._req = req, this._res = res;
};

exports.class.prototype = {
    /**
     * proxy GET request；
     */
    get: function( options ){
        var opt = iUtil.extend( {
            host: options.host,
            port: options.port || 80,
            path: (options.path || "") + (options.search || "") + (options.hash || ""),
            headers:{
                Cookie: this._req.headers[ 'cookie' ]
            }
        }, options );
        /**
         * 向其它服务器请求
         */
        var me = this;
        var proxyReq = http.get(opt, function( proxyRes) { // 请求被代理 URL 的内容
            me._res.statusCode = proxyRes.statusCode;
            var headers = proxyRes.headers;
            for (var key in headers) {
                me._res.setHeader(key, headers[key]);
            }

            proxyRes.on("data", function(chunk) {
                if( options.onData ){
                    options.onData.call( null, chunk );
                }
                else{
                    me._res.write( chunk ); 
                }
            });

            proxyRes.on("end", function() {
                if( options.onEnd ){
                    options.onEnd.call( null );
                }
                me._res.end();
            });
        });
    },
    /**
     * proxy POST request；
     */
    post: function( options ){
        /**
         * 请求参数
         * @type {Object}
         */
        var opt = iUtil.extend( {
                host: options.host,
                path: options.path,
                port: options.port || 80,
                method: 'POST',
                headers: {
                    'Content-Length': this._req.headers[ 'content-length' ],
                    'Content-Type': options.headers && options.headers[ 'content-type' ] || 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie':this._req.headers[ 'cookie' ]
                }
            }, options ) ;
        /**
         * 创建请求
         */
        var me = this;
        var proxyReq = http.request(opt, function( proxyResp ){
            me._res.statusCode = proxyResp.statusCode;
            var headers = proxyResp.headers;
            for (var key in headers) {
                me._res.setHeader(key, headers[key]);
            }
            proxyResp.on('data', function (chunk) {
                if( options.onData ){
                    options.onData( chunk );
                }
                else{
                    me._res.write( chunk );
                }
            });
            proxyResp.on( 'end', function(){
                if( options.onEnd ){
                    options.onEnd();
                }
                me._res.end();
            } );
        });
        /**
         * 设置 post数据
         */
        proxyReq.write(  querystring.stringify( this._req.post ) + '\n' );
        /**
         * 发送请求
         */
        proxyReq.end();
    },
    /**
     * dispatch reqest based on the method
     */
    index: function( options ){
        if( this._req.method === 'GET' ){ 
            var urlObject = url.parse( this._req.url );
            options = iUtil.extend( url.parse( querystring.parse( urlObject.query ).url ), options || {} ); 
            this.get( options );
        }
        else if( this._req.method === 'POST' ){
            options = iUtil.extend( url.parse( this._req.url ), options || {} ); 
            this.post( options );
        }
    }
}