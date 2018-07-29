/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title jQuery异步对象
 */
GD.App( 'apps/tester/ADeferredObject' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    return {
    container: '#mainContent',
    events: {
        'click #delay' : 'onDelay',
        'click #one2multi': 'onOne2Multi',
        'click #multi2one': 'onMulti2one',
         'click #norm2def': 'onNorm2Def'
    },
    main: function(){
                this._build();
            },
            /**
             * 页面元素
             */
            _build: function(){
                var ele = $([
                        '<div style="margin:15px;">',
                            '<button id="delay" style="width:150px;height:25px;">延迟注册</button>',
                            '<button id="one2multi" style="width:150px;height:25px;">同操作多处理函数</button>',
                            '<button id="multi2one" style="width:150px;height:25px;">多操作同处理函数</button>',
                            '<button id="norm2def" style="width:150px;height:25px;">封装普通函数</button>',
                        '</div>'
                    ].join('') );
                ele.appendTo( this.container );
            },
            /**
             * 发送请求
             */
            request: function(){
                return Util.ajax({
                    url:  Util.parseAPI( '/blog/ajax/aj_abstract.php' ),
                    data: {
                        start: 0,
                        type: 'time',
                        num: 2
                    },
                    success: function(){
                        alert( 'request succeed!' );
                    }
                });
            },
            /**
             * 延时注册
             */
            onDelay: function( evt ){
                var req = this.request();

                setTimeout(function(){
                    req.success( function(){ alert( 'delay success' ) } );
                }, 5000);
            },
            /**
             * 多处理函数
             */
            onOne2Multi: function( evt ){
                var req = this.request();
                req.done( function(){ alert( 'done 1') ;} ).done( function(){ alert('done 2') } );
            },
            /**
             * 多等待对象
             */
            onMulti2one: function( evt ){
                $.when( this.request(),this.request() ).done( function(){ alert( 'two requests are done!' );} )
            },
            /**
             * 普通函数到异步函数
             */
            onNorm2Def: function(){
        　　var wait = function(dtd){
                        var dtd = $.Deferred(); // 新建一个deferred对象
        　　　　var tasks = function(){
        　　　　　　alert("执行完毕！");
        　　　　　　dtd.resolve(); // 改变deferred对象的执行状态
        　　　　};
        　　　　setTimeout(tasks,5000);
        　　　　return dtd;
        　　};
                $.when(wait()).done(function(){ alert("哈哈，成功了！"); });
            }
    };

} );