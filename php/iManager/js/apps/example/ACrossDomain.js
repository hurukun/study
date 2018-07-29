/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title 跨域问题
 */
GD.App( 'apps/example/ACrossDomain' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    var Iframe = {
        create: function(url, onload, show){
            var ifrproxy = document.createElement('iframe');
            if( !show ){
                ifrproxy.style.display = 'none';
            }
            ifrproxy.src = url;  
            ifrproxy.onload = onload;

            document.body.appendChild(ifrproxy);
            return ifrproxy;
        },
         remove: function( dom ){
            dom.onload = null;
            document.body.removeChild(dom);
         }
    };
    /**
     * 跨域读取图片像素数据；
     */
    var DemoReadData = function( container ){
        this.container = container;
        this.init();
    };

    Util.mix( DemoReadData.prototype, {
        init: function(){
            var html = [
                '<p><span>利用hash跨域传递数据；</span><button id="hash">开始</button></p>',
                '<p><span>利用window.name跨域传递数据；</span><button id="wname">开始</button></p>',
                 '<p><span>利用HTML5的postMessage()函数跨域传递数据；</span><button id="postmsg">开始</button></p>',
            ].join('');
            this.container.append( html );
            this.bindEvents();
        },
        bindEvents: function(){
            var me = this;
            this.container.delegate( '#wname', 'click', function(){
                me.useWindowName();
            } );
            this.container.delegate( '#hash', 'click', function(){
                me.useHash();
            } );
            this.container.delegate( '#postmsg', 'click', function(){
                me.usePostMessage();
            } );
        },
        /**
         * 利用 hash
         */
        useHash: function(){
            var ifrproxy = Iframe.create( 'http://' + Env.IP + '/php/example/jscrossdomain/cdhash.html' ),
                timer = null,
                me = this;

            timer = setInterval( function(){
                var data = self.location.hash;
                if( data ){
                    alert( data );
                    Iframe.remove( ifrproxy );
                    clearInterval(timer );
                    ifrproxy = null
                    timer = null;
                }
            }, 500 );
        },
        /**
         * 利用 window.name 跨域传递数据；
         */
        useWindowName: function(){
            var state = 0,
                ifronload = function(){
                    if( state == 1 ){
                        var data = ifrproxy.contentWindow.name;
                        alert( data );
                        Iframe.remove( ifrproxy );
                        ifrproxy = null
                    }
                    else{
                        state = 1;
                        ifrproxy.contentWindow.location = 'http://' + Env.HOST + '/index.php';
                    }
                },
                ifrproxy = Iframe.create( 'http://' + Env.IP + '/php/example/jscrossdomain/cdwinname.html', ifronload );
        },
        /**
         * 利用 postMessage 
         */
        usePostMessage: function(){
            var ifrproxy = Iframe.create( 'http://' + Env.IP + '/php/example/jscrossdomain/cdpmsg.html', function(){
                ifrproxy.contentWindow.postMessage( 'this is data from original web', '*' );
                setTimeout( function(){
                    Iframe.remove( ifrproxy );
                    ifrproxy = null;
                }, 2000 );
            });
            window.addEventListener('message', function(event){
                // 通过origin属性判断消息来源地址
                if (event.origin ==  'http://' + Env.IP ) {
                    alert(event.data);    // 弹出"I was there!"
                    alert(event.source);  // 对a.com、index.html中window对象的引用
                                          // 但由于同源策略，这里event.source不可以访问window对象
                }
            }, false);
        }
    } );


    return {
    container: '#mainContent',
    events: {
    },
    main: function(){
                new DemoReadData( this.container );
            }
    };

} );