/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * blog 详细页  js
 */
GD.App( 'apps/blog/AArticle', [ 'apps/blog/Publisher' ] ).define( function ( require ){
    var $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Publisher = require( 'apps/blog/Publisher' );
        Env = require( 'Env' );

    return {
        container: '#main',
        api: {
            aj_article: Util.parseAPI( '/blog/ajax/aj_article.php' )
        },
        main: function(){
            this._bindEvents();
            new Publisher( {
                container:  $( document.body ),
                title:      '#com_edt_tit',
                content:    '#com_edt_cnt',
                appendix:   '#com_edt_apd',
                keyword: '#com_edt_keyword',
                submit:     '#com_edt_submit',
                url :  this.api.aj_article
            } );
        },
        _bindEvents: function(){
            var me = this;
            // 获得新 摘要列表
            this.container.delegate( 'a[data-tid]', 'click', function( evt ){
                evt.preventDefault();
                evt.stopPropagation();
                
                me._backToFetchAbsList( $( evt.currentTarget ).attr( 'data-tid' ) );

                window.dialog.hide( );
                return false;
            });
        },
        //获取 摘要列表
        _backToFetchAbsList: function( id ){
            window.dialog.fire( 'absList:change', { 
                id: id,
                start: 0,
                type: 'class',
            } );
            window.dialog.close();
        }
    };

} );