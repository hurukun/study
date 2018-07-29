/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**/

GD.App( 'apps/home/AHome', [ 'core/switch/Scroll' ] ).define( function( require ){
    var $ =require( 'jQuery' ),
        Switcher = require( 'core/switch/Scroll' );

    return {
        events: {

        },
        main: function(){
            this._initPages();
        },
        _initPages: function(){
            new Switcher({
                prev: '#mainPagePrev',
                next: '#mainPageNext',
                host: '#appList',
                contents: '#appList>li',
                behavior: Switcher.Behavior.Scroll,
                PREV_DISABLED_CLASS: 'dn',
                NEXT_DISABLED_CLASS: 'dn'
            });
        }
    }
} );