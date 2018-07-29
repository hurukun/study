/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title 时差动画
 */
/**
 * 漂浮于当前页面上方（z-index）的舞台，用于各种场景的显示与其切换；
 * @module FloatStage
 * @author rukun rukun@corp.kaixin001.com
 */
/**
 * 首页 js
 */
GD.App( 'apps/example/AFloatStage', ['apps/widgets/TimeMachine'] ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        TimeMachine = require( 'apps/widgets/TimeMachine' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    return {
        container: '#mainContent',
        events: {
            'click #start' :'onStart'
        },
        main: function(){
                $('head').append( '<link rel="stylesheet" type="text/css" href="/css/apps/widgets/5thanni_tmachine.css">' );
                this._build();
                this.tm = null;
        },
        _build: function(){
            var ele = $([
                    '<div style="margin:15px;">',
                        '<button id="start" style="width:100px;height:25px;">开始</button>',
                    '</div>'
                ].join('') );
            ele.appendTo( this.container );
        },
        onStart: function(){
            if( !this.tm ){
                this.tm = new TimeMachine();
            }
            this.tm.run( 0 );
        }
    };

} );