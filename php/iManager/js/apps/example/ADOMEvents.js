/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title DOM 事件的绑定与响应
 */
GD.App( 'apps/tester/ADOMEvents' ).define(function( require){
    var $ = require( 'jQuery' ),
        Util = require( 'Util' );

    return {
        container: '#mainContent',
        events: {

        },
        main: function(){
            this.tryAddListener();
            this.tryAttachEvent();
            this.tryOnProperty();
        },
        /**
         * 用addListener()添加消息处理函数
         */
        tryAddListener: function(){
            var needAction = true,
                count = 0;
            if( !document.addEventListener ){
                needAction = false;
            }

            /**
             * 添加 DOM 元素
             * @type {Array}
             */
            var html = [
                '<p>',
                    '<div>',
                        '<span>addEventListener()为同一事件绑定相同定义的函数函数，会重复；</span>',
                        needAction?'<button id="evtBtnAlike" style="margin-left:10px;height:25px;width:60px;">click</button>':'',
                    '</div>',
                    '<div>',
                        '<span>addEventListener()为同一事件绑定同一函数，不会重复；</span>',
                        needAction?'<button id="evtBtnSame" style="margin-left:10px;height:25px;width:60px;">click</button>':'',
                    '</div>',
                    needAction?'':'<div>该浏览器不支持 addEventListener() 函数；</div>',
                '</p>'
            ].join('');

            this.container.append( html );
            if( !needAction ){
                return;
            }
            /**
             * 绑定相同定义的函数
             */
            var button  = document.getElementById( 'evtBtnAlike' );
            button.addEventListener( 'click', function( evt ){
                window.alert( 'button clicked and capture. ' );
            }, true );
            button.addEventListener( 'click', function( evt ){
                window.alert( 'button clicked: ' + count++ );
            }, false );
            button.addEventListener( 'click', function( evt ){
                window.alert( 'button clicked:' + count-- );
            }, false );
            /**
             * 绑定同一函数
             */
            var button  = document.getElementById( 'evtBtnSame' ),
                handler = function( evt ){
                    window.alert( 'button clicked.' );
                };
            button.addEventListener( 'click', handler, false );
            button.addEventListener( 'click', handler, false );
        },
        /**
         * attachEvent()添加消息处理函数
         */
        tryAttachEvent: function(){
            var needAction = true,
                count = 0;
            if( !document.attachEvent ){
                needAction = false;
            }
            /**
             * 添加 DOM 元素
             * @type {Array}
             */
            var html = [
                '<p>',
                    '<div>',
                        '<span>attachEvent()为同一事件绑定相同定义的函数函数，会重复；</span>',
                        needAction?'<button id="evtBtnAlike" style="margin-left:10px;height:25px;width:60px;">click</button>':'',
                    '</div>',
                    '<div>',
                        '<span>attachEvent()为同一事件绑定同一函数，会重复；</span>',
                        needAction?'<button id="evtBtnSame" style="margin-left:10px;height:25px;width:60px;">click</button>':'',
                    '</div>',
                    needAction?'': '<div>该浏览器不支持 attachEvent() 函数；</div>',
                '</p>'
            ].join('');

            this.container.append( html );
            if( !needAction){
                return;
            }
            /**
             * 绑定相同定义的函数
             */
            var button  = document.getElementById( 'evtBtnAlike' );
            button.attachEvent( 'onclick', function( evt ){
                window.alert( 'button clicked: ' + count++ );
            }, false );
            button.attachEvent( 'onclick', function( evt ){
                window.alert( 'button clicked: ' + count-- );
            }, false );
            /**
             * 绑定同一函数
             */
            var button  = document.getElementById( 'evtBtnSame' ),
                handler = function( evt ){
                    window.alert( 'button clicked.' );
                };
            button.attachEvent( 'onclick', handler, false );
            button.attachEvent( 'onclick', handler, false );
        },
        /**
         * 通过设置 on[ event ] 属性设置
         * @return {[type]} [description]
         */
        tryOnProperty: function(){
            var html = [
                '<p>',
                    '<div>',
                        '<span>点击按钮，为以上按钮用 on[event] 属性设定handler, 与原有函数设置的handler无关；</span>',
                        '<button id="evtBtnProp" style="margin-left:10px;height:25px;width:60px;">click</button>',
                    '</div>',
                '</p>'
                ].join('');

            this.container.append( html );

            var button  = document.getElementById( 'evtBtnProp' );
            button.onclick = function(){
                var btn = document.getElementById( 'evtBtnAlike' );
                btn.onclick = function(){
                    window.alert( '原有handler未被覆盖！' );
                }

                btn = document.getElementById( 'evtBtnSame' );
                btn.onclick = function(){
                    window.alert( '原有handler未被覆盖！' );
                }
            }
        }
    };
});

GD.App( 'apps/tester/ALoopEvents' ).define(function( require){
    var $ = require( 'jQuery' ),
        Util = require( 'Util' );

    return {
        container: '#mainContent',
        events: {
        },
        main: function(){
            this.build();
            this.bindLocalEvents();
        },
        build: function(){
            var html = [
                    '<p>事件死锁：导致一个事件自动重复触发；</p>',
                    '<textarea data-type="leta" style="width:500px;height:50px;"></textarea>'
                ].join('');
            this.container.append( html );
        },
        bindLocalEvents: function(){
            var me = this,
                textarea = me.container.find( '[data-type="leta"]' ) ;

            textarea.focus( function(){
                setTimeout( function(){
                    $('#evtBtnProp').focus();
                    textarea[0].focus();
                    console.log('focus');
                }, 100 );
            });
        }
    };
} );