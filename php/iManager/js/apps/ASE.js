
GD.App( 'ASE', ['common/SpecialEffect'] ).define( function ( require ){
    var $ = require( 'jQuery' ),
        SE = require( 'common/SpecialEffect' );

	return {
		main: function(){           
            this._bindEvents();
		},
        _initFlip:function(){
            this._flip = SE.get( 'flip' ,{ ele: $('#se_ele') } );
        },
        _bindEvents: function(){
            var me = this;
            $('#nav').delegate( '.p-prev', 'click', function( evt ){
                evt.preventDefault();
                evt.stopPropagation();
                if( !me._flip ){
                    me._initFlip();
                }
                me._flip.prev();
                return false;
            } );
            $('#nav').delegate( '.p-next', 'click', function( evt ){
                evt.preventDefault();
                evt.stopPropagation();
                if( !me._flip ){
                    me._initFlip();
                }
                me._flip.next();
                return false;
            } )
        }
	};

} );