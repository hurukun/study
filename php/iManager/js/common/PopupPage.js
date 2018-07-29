/**
 * 弹出页
 */

define( 'common/PopupPage', [ 'core/window/PanelUtil' ], function( require ){
	var $ = require( 'jQuery' ),
		PanelUtil = require( 'core/window/PanelUtil' ),
		Util = require( 'Util' ),
		Env = require( 'Env' );

	var PopupPage = function( options ){
		if( options ){
			this._wid = options.wid? options.wid: "popPageWrapper";
			this._url = options.url? options.url: "";
		}
		
		this._init();
	};

	Util.mix( PopupPage.prototype, {
		_init: function(){
			this._buildWrapper();
			this._bindPopupPageEvents();
		},
		/**
		 * 创建 弹出窗
		 * @return  {[type]} [description]
		 * @private
		 */
		_buildWrapper:function(){
			var container = null,
			      me = this;
			this._wrapper = $( "#" + this._wid );

			if( this._wrapper.length === 0 ){
				container = $( ['<div class="pop-page-wrapper" id="',this._wid,'" style="height:',$(window).height(),'px;">',
							'<a class="pop-page-close"></a>',
							'<div class="pop-page">',
								'<iframe src="'+ this._url+ '" width="100%" height="100%"></iframe>',
							'</div>',
						'</div>'].join( '' ) );
				$( document.body ).append( container );
				this._wrapper = $( '#' + this._wid );
			}

			this._panelUtil = new PanelUtil( {panel: this._wrapper } );

			this._wrapper.find( 'iframe' )[0].contentWindow.dialog = this._panelUtil;
		},
		/**
		 * 绑定 弹出窗相关事件
		 * @return  {[type]} [description]
		 * @private
		 */
		_bindPopupPageEvents: function(){
			var me = this;
			//点击 蒙板，关闭弹出页
			this._wrapper.bind( 'click', function( evt ){
				var target = $(evt.target );
				if(  target.attr( 'id' ) === me._wid ){
					me._close();
				}
			} )
		},
		/**
		 * 关闭弹出窗
		 * @return  {[type]} [description]
		 * @private
		 */
		_close: function(){
			this._panelUtil.fire( 'page:close' );
			this._wrapper.remove();
		},

		on: function( msg, callback ){
			this._panelUtil.on( msg, callback );
		}
	} );

	return PopupPage;
} );