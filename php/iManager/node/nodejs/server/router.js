/**
 * 路由请求
 */
var route = function( pathname, handle, postData, response ){
    console.log( 'route a request for: ' + pathname );
    /**
     * 页面存在
     */
    if( typeof handle[ pathname ] === 'function'  ){
        handle[pathname]( response, postData );
    }
    /**
     * 页面不存在
     */
    else{
        response.writeHead( 404, {'Content-Type': 'text/plain'} );
        response.write( '404 Not Found'  );
        response.end();
    }
}


exports.route = route;