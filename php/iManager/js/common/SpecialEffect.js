/**
 * �߼���Ч ���: ��¼һЩ��������Ч
 */

K = GD;
define( 'common/SpecialEffect', [ 'jQuery' ], function( require ){
	var $ = require( 'jQuery' ),
		__Stack__ = {};

	var SpecialEffect = function(){

	};

	K.mix( SpecialEffect, {
		register: function( name, def ){
			__Stack__[ name ] = def;
		},
		get: function( name, options ){
			return new __Stack__[ name ]( options );
		}
	} );

	/******************************************
		��ʼ��	��״����
	 ******************************************/
	var Shape = function(){

	}

	K.mix( Shape, {
		toTwoSidePanel: function( ele ){
			if( !ele || ele.length === 0 ){
				return;
			}
			/* ���� */
			var canvas = $( '<div class="canvas"/>' ),
				/* ��״���� */
				container = $( '<div class="shape-wrapper"/>' ),
				/* ��Ԫ�� */
				cloneEle = ele.clone();
			canvas.css( 'margin-top', ele.css( 'margin-top' ) );
			canvas.css( 'margin-right', ele.css( 'margin-right' ) );
			canvas.css( 'margin-bottom', ele.css( 'margin-bottom' ) );
			canvas.css( 'margin-left', ele.css( 'margin-left' ) );
			canvas.css( 'position', ele.css( 'position' ) !== 'static' ? ele.css( 'position' ) : 'relative' );
			canvas.css( 'left', ele.position().left + 'px' );
			canvas.css( 'top', ele.position().top + 'px' );
			canvas.css( 'width', ele.width() + 'px' );
			canvas.css( 'height', ele.height() + 'px' );

			cloneEle.css( 'margin', 0 );
			cloneEle.css( 'position', ele.css( 'position' ) !== 'static' ? ele.css( 'position' ) : 'relative'  );
			cloneEle.css( 'left', 0 );
			cloneEle.css( 'top', 0 );

			cloneEle.removeAttr( 'id' );
			cloneEle.css( '-webkit-transform', 'rotateX(180deg) translateZ(1px)' );
			container.append( cloneEle );
			cloneEle = cloneEle.clone();
			cloneEle.css( '-webkit-transform', 'rotateX(0deg) translateZ(1px)' );
			container.append( cloneEle );

			canvas.append( container );

			ele.replaceWith( canvas );

			return container;
		},
		toCube: function( ele ){
		}
	} )

	/******************************************
		��ʼ��	�Զ��� ��Ч��
	 ******************************************/
	/**
	 * Flip:��תЧ��
	 * @param{ object } options �����
	 *	nextEle: { function } ��ȡ��һ����ʾ����Ԫ�أ�������ʾ��Ԫ��
	 *  prevEle: { function } ��ȡǰһ����ʾ����Ԫ�أ�������ʾ��Ԫ��
	 */
	var Flip = function( options ){
		this._options = options;
		this._init();
	};
	K.mix( Flip.prototype, {
		_init: function(){
			this.container = this._build( this._options.ele );
			this._deg = 0;
			this.container.css( '-webkit-transition', 'linear 1s' );
		},
		/**
		 *  ����������ص� DOM
		 */
		_build: function( ele ){
			return Shape.toTwoSidePanel( ele );
		},
		prev: function(){
			this._deg -= 180;
			this.container.css( '-webkit-transform', 'rotateX( ' + this._deg + 'deg )' );
		},
		next: function(){
			this._deg += 180;
			this.container.css( '-webkit-transform', 'rotateX( ' + this._deg + 'deg )' );
		}
	} );


	/******************************************
		������	�Զ��� ��Ч��
	 ******************************************/

	SpecialEffect.register( 'flip', Flip );

	return SpecialEffect;
	
} );