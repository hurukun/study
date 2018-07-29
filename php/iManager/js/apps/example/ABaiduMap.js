/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title 百度地图应用
 */
 
 GD.App( 'apps/tester/ACanvas' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    return {
    container: '#mainContent',
    events: {
    },
    main: function(){
                this._build();
                this._init();
                this._bindEvents();
            },
            _build: function(){
                var ele = $([
                        '<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.5&ak=F489e4d951ec45146184e1fe6a639a60"></script>',
                        '<div id="baidumap">',
                        '</div>'
                    ].join('') );
                ele.appendTo( this.container );
            },
            _init: function(){
                var map = new BMap.Map("allmap");            // 创建Map实例
                var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
                map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
                map.enableScrollWheelZoom();                            //启用滚轮放大缩小
            },
            _bindEvents: function(){
            }
    };

} );