/**
 * 封装 窗体相关基础公共操作；
 */

define( 'core/window/PanelUtil', ['jQuery'], function( require ){
	var $ = require( 'jQuery' ),
		Util = require( 'Util' ),
		Env = require( 'Env' );

	var PanelUtil = function( options ){
		if( !options || !options.panel ){
			return;
		}
		//指向panel 的jQue'ry 对象
		this._panel = Util.isString( options.panel ) ? $( options.panel ) : options.panel;
		//panel 的共生体 对象；同时显示，(同时删除的一些元素)
		this._commensal = options.commensal;
		//panel 的状态
		this._status = this._panel.is( ':visible' );
	};

	Util.mix( PanelUtil.prototype, {
		/**
		 * 显示 panel
		 * @return {[type]} [description]
		 */
		show: function(){
			this.fire( 'show:begin' );
			this._panel.show();
			Util.foreach( this._commensal, function( item ){
				item.show();
			} );
			this._status = true;
			this.fire( 'show:end' );
		},
		/**
		 * 隐藏 panel
		 * @return {[type]} [description]
		 */
		hide: function(){
			this.fire( 'hide:begin' );
			this._panel.show();
			Util.foreach( this._commensal, function( item ){
				item.show();
			} );
			this._status = false;
			this.fire( 'hide:end' );
		},
		/**
		 * toggle panel
		 * @return {[type]} [description]
		 */
		toggle: function(){
			if( this._status === true ){
				this.hide();
			}
			else{
				this.hide();
			}
		},
		/**
		 * 隐藏 panel 并释放相关 DOM 结构 
		 * @return {[type]} [description]
		 */
		close: function(){
			this.fire( 'destroy:begin' );
			this._panel.hide().remove();
			Util.foreach( this._commensal, function( item ){
				item.hide().remove();
			} );
			this.fire( 'destroy:end' );
		},
		/**
		 * 重设 Panel 大小
		 * @param  {[type]} width  [description]
		 * @param  {[type]} height [description]
		 * @return {[type]}        [description]
		 */
		resize: function( width, height ){
			this.fire( 'resize:begin' );
			
			if( Util.isNumber( width ) && width >= 0 ){
				this._panel.css( 'width', width );
			}
			if( Util.isNumber( height ) && height >= 0 ){
				this._panel.css( 'height', height );
			}

			this.fire( 'resize:end' );
		},
		/**
		 * 更改 Panel 位置
		 * @return {[type]} [description]
		 */
		relocate: function( x, y ){
			this.fire( 'relocate:begin' );
			
			if( Util.isNumber( x )  ){
				this._panel.css( 'left', x );
			}
			if( Util.isNumber( y ) ){
				this._panel.css( 'top', y );
			}

			this.fire( 'relocate:end' );
		}
	} );

	return PanelUtil;
} );