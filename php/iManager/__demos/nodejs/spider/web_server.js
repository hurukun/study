var http = require('http'),
    url = require( 'url' ),
    querystring = require( 'querystring' ),
    Proxy = require('../../../nodejs/server/proxy_server.js');


var jsdom = require("jsdom");

function parseWeb(url) {
    // console.log("正在访问：" + url + "，请稍候....");
    // jsdom.env(url, ["http://code.jquery.com/jquery.js"],

    // function(errors, window) {
    //     var $ = window.jQuery;
    //     console.log($("title").text());

    //     var img = $('.chaxunhsp img');
    //     console.log('rcode.src=' + img.attr('src'));
    //     console.log( 'cookie=' + window.document.cookie );
    // });
}


http.createServer(function(request, response) {
    var urlObject = url.parse(request.url, true),
        proxyObject = {};

    if( urlObject.pathname === '/login.php' ){
        login( request, response );
    }
    else if( urlObject.pathname === '/proxy.php' ){
        proxyObject = url.parse( urlObject.query.url );
        Proxy.proxy( request, response, {
            host: proxyObject.host,
            path: proxyObject.pathname,
            onData: function( chunk ){
                var content = String( chunk );
                    content = content.replace( /<script.*?<\/script>/ig, '' );
                response.write( content );
            },
            onEnd: function(){
                
            }
        } );
    }
    else if( urlObject.pathname === '/code.php' ){
        proxyObject = url.parse( 'http://www.bjguahao.gov.cn/comm/code.php' );
        Proxy.get( request, response, {
            host: proxyObject.host,
            path: proxyObject.pathname,
            onData: function( chunk ){
                response.write( chunk );
            }
        });
    }
    else{
        response.end();
    }
    
}).listen(8889);

/**
 * 显示登录界面
 */
var login = function( request,  response ){
    response.write([
        '<!doctype html>\n',
        '<html>\n',
            '<head>\n',
                '<meta http-equiv="Content-Type" content="text/html; charset=gb2312"/>\n',
                '<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>\n',
            '</head>\n',
            '<body>\n',
                '<label>name</label><input type="text" id="name"/>\n',
                '<label>id</label><input type="text" id="id" value="510131198603111532"/>\n',
                '<label>rcode</label><input type="text" id="rcode"/><img id="yzmdl" src="/code.php" width="50" height="19" align="absmiddle" class="register_yzm">\n',
                '<button id="submit"> login </button>\n',
                '<button id="checkAuth">checkAuth</button>\n',
                '<a href="/proxy.php?url=http%3A%2F%2Fwww.bjguahao.gov.cn%2Fcomm%2Fcontent.php%3Fhpid%3D142%26keid%3D1010101%7C0000019">Detail</a>\n',
                '<script type="text/javascript" src="http://localhost/js/logon.js"></script>\n',
            '</body>\n',
        '</html>'].join(''));
    response.end();
}