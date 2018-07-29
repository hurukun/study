/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title WebSocket 使用实例
 */
GD.App( 'apps/tester/AWebSocket' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    return {
    container: '#mainContent',
    events: {
        'click #ws_send' : 'onSend'
    },
    main: function(){
                this._build();
            },
            _build: function(){
                var ele = $([
                        '<p>使用WebSocket</p>',
                        '<div style="margin:15px;">',
                            '<input data-type="ws_input" type="text"/>',
                            '<button id="ws_send" style="width:100px;height:25px;">发送</button>',
                            '<p data-id="ws_content"><p>',
                        '</div>'
                    ].join('') );
                ele.appendTo( this.container );
            },
            initSocket: function( content ){
                var me = this;
                // 创建一个Socket实例
                this.socket = new WebSocket('ws://192.168.10.33:8891'); 

                // 打开Socket 
                this.socket.onopen = function(event) { 
                    // 发送一个初始化消息
                    me.socket.send( content ); 
                    // 监听消息
                    me.socket.onmessage = function(event) { 
                        me.container.find( '[data-id="ws_content"]' ).append( obj );
                    }; 

                    // 监听Socket的关闭
                    me.socket.onclose = function(event) { 
                        console.log('Client notified socket has closed',event); 
                    }; 

                  // 关闭Socket.... 
                  //socket.close() 
                };
            },
            onSend: function(){
                var input = this.container.find( '[data-type="ws_input"]' ),
                    content = input.val();
                if( content ){
                    if( !this.socket ){
                        this.initSocket( content );
                    }
                    else{
                        this.socket.send( content );
                    }
                }
            }
    };

} );

/**
 * SocketIO
 */
GD.App( 'apps/tester/ASocketIO' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    return {
    container: '#mainContent',
    events: {
        'click #sio_send' : 'onSend'
    },
    main: function(){
                this._build();
            },
            _build: function(){
                var ele = $([
                        '<script src="http://192.168.10.33:8889/socket.io/socket.io.js"></script> ',
                        '<p>使用Socket.io</p>',
                        '<div style="margin:15px;">',
                            '<input data-type="sio_input" type="text"/>',
                            '<button id="sio_send" style="width:100px;height:25px;">发送</button>',
                            '<p data-id="sio_content"><p>',
                        '</div>'
                    ].join('') );
                ele.appendTo( this.container );
            },
            initSocket: function(){
                var me = this;
                this.socket = io.connect( 'http://192.168.10.33:8889' )// 连接到服务器
                this.socket.on("message", function(obj){ // 接收到消息时的处理方法
                    me.container.find( '[data-id="sio_content"]' ).append( obj );
                }); 
            },
            onSend: function( evt ){
                var input = this.container.find( '[data-type="sio_input"]' ),
                    content = input.val();
                if( content ){
                    if( !this.socket ){
                        this.initSocket();
                    }
                    this.socket.send( content );
                }
            }
    };

} );