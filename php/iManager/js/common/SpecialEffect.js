/**
 * 高级特效 相关: 收录一些见到的特效
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
		开始：	形状管理
	 ******************************************/
	var Shape = function(){

	}

	K.mix( Shape, {
		toTwoSidePanel: function( ele ){
			if( !ele || ele.length === 0 ){
				return;
			}
			/* 画布 */
			var canvas = $( '<div class="canvas"/>' ),
				/* 形状容器 */
				container = $( '<div class="shape-wrapper"/>' ),
				/* 面元素 */
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
		开始：	自定义 特效区
	 ******************************************/
	/**
	 * Flip:翻转效果
	 * @param{ object } options 相关项
	 *	nextEle: { function } 获取下一个显示的新元素，无则显示旧元素
	 *  prevEle: { function } 获取前一个显示的新元素，无则显示旧元素
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
		 *  创建动画相关的 DOM
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
		结束：	自定义 特效区
	 ******************************************/

	SpecialEffect.register( 'flip', Flip );

	return SpecialEffect;
	
} );