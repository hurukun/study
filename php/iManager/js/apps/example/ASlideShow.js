/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title 跨域问题
 */
GD.App( 'apps/tester/ASlideShow' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    /**
     * 图片滚动；
     */
    var AImageSwitcher = function( container ){
        this.container = container;
        this.init();
    };

    Util.mix( AImageSwitcher.prototype, {
        init: function(){
            var html = [
                '<p>图片滚动切换效果</p>',
                '<iframe src="/tester/slider/index.html" width="1005px" height="320px">',
            ].join('');
            this.container.append( html );
        }
    } );


    return {
    container: '#mainContent',
    events: {
    },
    main: function(){
                new AImageSwitcher( this.container );
            }
    };

} );