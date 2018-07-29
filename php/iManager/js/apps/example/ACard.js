/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title 用户名片
 */

// //window.test = 'window.test';
// Object.test = 'object.test';
// Object.prototype.test = 'Object.prototype.test';
// //var test = 'test';
// (function f() {
//     alert(test);
// })();
 
 GD.App( 'apps/example/ACard', [ 'core/card/CardFactory' ] ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' ),
        CardFactory = require( 'core/card/CardFactory' );

    return {
    container: '#mainContent',
    events: {
    },
    main: function(){
                this._build();
                this._init();
            },
            _build: function(){
                var ele = $([
                        '<link rel="stylesheet" href="http://s.kaixin001.com.cn/css/user_card-0014cb0ff.css" />',
                        '<a href data-uid="92927070" data-sigil="usercard">胡汝坤</a>'
                    ].join('') );
                ele.appendTo( this.container );
            },
            _init: function(){
                var factory = CardFactory.get( {
                    url: Util.parseAPI( '/interface/aj_usercard.php' )
                } );
                factory.bindCard( '[data-sigil="usercard"]', 'mouseover' );
                this._bindEvents( factory );
            },
            _bindEvents: function( factory){
                factory.on( 'card_build', function( data ){
                    var card = data.card;
                    card.delegate( '#uc_add_friend', 'click', function( evt ){
                        window.alert( 'Want to add friend? Just find me.' );
                    } );
                } );
            }
    };

} );