/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title 跨域问题
 */
GD.App( 'apps/tester/ARichEditor' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    /**
     * 图片滚动；
     */
    var ATinyMCE = function( container ){
        this.container = container;
        this.init();
    };

    Util.mix( ATinyMCE.prototype, {
        init: function(){
            var html = [
                '<p>tinymce 富文本编辑器</p>',
                '<iframe src="/tester/tinymce/examples/index.html" width="1005px" height="480px">',
            ].join('');
            this.container.append( html );
        }
    } );


    return {
    container: '#mainContent',
    events: {
    },
    main: function(){
                new ATinyMCE( this.container );
            }
    };

} );