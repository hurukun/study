#!/usr/bin/env node
/**
 * @module socket.io
 * @module formidable
 */
var Server = require("./server/server"),
    MemUsage = require(  './socket/memusage' ),
    /**
     * 路由器
     */
    Router = require( './server/router' ),
    /**
     * 页面请求处理映射关系
     */
    RequestHandler = require( './server/requestHandler' );

/**
 * http 服务器
 * @type {Server}
 */
var http = new Server.Http( Router.route, RequestHandler.handle, 8888 );
http.start();

/**
 * socket 服务器
 * @type {Server}
 */
var socket = new Server.Socket( Router.route, RequestHandler.handle, 8889 );
socket.start();

/**
 * tcp 服务器
 * @type {Server}
 */
var tcp = new Server.TCP( Router.route, RequestHandler.handle, 8890 );
tcp.start();
/**
 * websocket 服务器
 * @type {Server}
 */
var websocketserver = new Server.WebSocketServer( Router.route, RequestHandler.handle, 8891 );
websocketserver.start();