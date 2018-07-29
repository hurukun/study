require('../global.js'); //关于全局的一些定义

var url = require('url'),
    path = require('path'),
    querystring = require( 'querystring' ),
    fs = require('fs'),
    util = require( 'util' );

/**
 * Application 类
 * 该类必须有接受(req, res)的构造函数
 */
exports.class = function(req, res) {
    this._req = req, this._res = res;
    this.dispatcher();
}
exports.class.prototype = {
    /**
     * 分发动态/静态请求
     */
    dispatcher: function() {
        //判断是否是需要重定向的请求
        if( Router.needRedirectRequest( this._req ) ){
         //   this.handleDynamic();
        }
        //判断是否请求静态文件
        else if( Router.isStaticRequest( this._req ) ) {
            this.handleStatic();
        } 
        else {
            this.handleDynamic();
        }
    },

    /**
     * 处理静态文件的请求
     */
    handleStatic: function() {
        var urlInfo = url.parse(this._req.url);
        var file = path.join(ROOT_PATH, urlInfo.pathname);
        var $this = this;
        path.exists(file, function(exists) {
            if (!exists) {
                $this.handle404();
                return;
            }
            fs.stat(file, function(err, stats) {
                if (err) {
                    $this.handle500(err);
                    return;
                }
                if (!stats.isFile()) {
                    $this.handle403( 'Not a file' );
                    return;
                }
                //输出数据
                fs.readFile(file, function(err, data) {
                    if (err) {
                        $this.handle500(err);
                        return;
                    } else {
                        var ext = path.extname(file).slice(1);
                        if (!ext) ext = 'html';
                        $this._res.writeHead(200, {'Content-Type': Config.mimes[ext]});
                        $this._res.end(data);
                    }
                });
            });
        });
    },

    /**
     * 处理动态请求
     */
    handleDynamic: function() {
        //分析Controller和Action
        var actionInfo = Router.getActionInfo(this._req);
        //获取执行脚本
        try {
            var classPath = path.join( APPLICATION_PATH, actionInfo.controller);
            var classRef = require(classPath).class; //类的一个引用
            var c = new classRef(this._req, this._res);
            if (typeof(c[actionInfo.action]) != 'function') {
                    this.handle403( 'API not found.' )
            }
            //执行该handler
            c[actionInfo.action]();
        } catch (e) {
            console.log(e);
            //util.inspect(e);
            this.handle404();
        }
    },
    /**
     * Redirect
     */
    handle301: function( redirectUrl ){
        this._res.writeHead(301, {
            'Content-Type': 'text/html',
            'Location': redirectUrl
        });
        this._res.write('<!doctype html>\n');
        this._res.write('<title>301 Moved Permanently</title>\n');
        this._res.write('<h1>Moved Permanently</h1>');
        this._res.write(
            '<p>The document has moved <a href="' + redirectUrl +
            '">here</a>.</p>');
        this._res.end();
        util.puts('301 Moved Permanently: ' + redirectUrl);
    },
    /**
     * Not Found
     */
    handle404: function() {
        this._res.writeHead(404, {'Content-Type': 'text/plain'});
        this._res.end('Page Not Found');
    },
    /**
     * Forbidden
     */
    handle403: function( msg ) {
        this._res.writeHead(403, {'Content-Type': 'text/plain'});
        this._res.end('Invalid request: ' + msg );
    },
    /**
     * Server Error
     */
    handle500: function(err) {
        this._res.writeHead(500, {'Content-Type': 'text/plain'});
        this._res.end(err);
    }
}