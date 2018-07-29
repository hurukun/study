/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title IE6，IE7(Q)，IE8(Q) 动画导致overflow=hidden
 */
GD.App( 'apps/tester/ATestIESlidedown' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
    	Util = require( 'Util' ),
    	Env = require( 'Env' );

    return {
	container: '#mainContent',
	main: function(){
                this._sdid = 'ie_slidedown';
                this._build();
                this._bindEvents();
            },
            _build: function(){
                var ele = $(  ['<div id="',this._sdid,'" style="display:none;height:100px;">',
                                            '<div style="height:200px;width:100%;background:#ccc;">',
                                            'IE6, IE7(Q), IE8(Q)中动画会使该元素的 overflow 属性变为 hidden，因为 jQuery.support.shrinkWrapBlocks == true',
                                            '</div>',
                                     '</div>',
                                     '<div style="height:100px;background:red;"></div>'].join('') );
                ele.appendTo( this.container );

                alert( 'before:$("#'+this._sdid+'").css("overflow") = ' + ele.css( 'overflow' ) );
                var me = this;
                ele.slideDown( 1000, function(){
                    if( $(this).attr('id') == me._sdid ){
                        alert( 'after: $("#'+me._sdid+'").css("overflow") = ' + ele.css( 'overflow' ) );
                    }
                } );
            },
            _bindEvents: function(){
        	}
    };

} );