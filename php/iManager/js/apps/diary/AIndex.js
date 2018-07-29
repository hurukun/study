/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * 首页 js
 */
GD.App('ABlogIndex', [ 'common/PopupPage', 'common/PageTurner']).define(function(require) {
    var $ = require('jQuery'),
        PopupPage = require('common/PopupPage'),
        PageTurner = require( 'common/PageTurner' ),
        Util = require('Util'),
        Env = require('Env');

    return {
        container: '#main',
        events: {
            'click [data-tid]': '_onShowAbsList',
            'click a[data-type="absDetail"]': '_onShowDetail',
            'click a[data-type="absEdit"]': '_onShowEditor'
        },

        main: function() {
            this._itemPerPage = 6;
            this._pageTabName = 5;
            this._numRecorder = $('[data-total]');
            this.container.data( 'absType', 'time' );

            var absNum = this._numRecorder.data( 'total' ) || 0;
            if( absNum > this._itemPerPage ){
                this._initPageTurner( absNum );
            }
        },
        _initPageTurner: function( itemNumber ){
            var me = this,
                pageNumber = Math.ceil( itemNumber / this._itemPerPage );
            if( this._pageTurner ){
                this._pageTurner.update( pageNumber );
            }
            else{
                this._pageTurner = new PageTurner( {
                        container: '[data-type="pageTurner"]',
                        pageNumber: pageNumber,
                        pageTabName: this._pageTabName
                   } );
                this._pageTurner.show();
                //翻页事件
                this._pageTurner.on( 'after_turn', function( data ){
                    var start = ( data.index - 1 ) * me._itemPerPage;

                    me._fetchAbsList( me.container.data( 'absType'), start, me.container.data( 'absClass') );
                } );
            }
        },
        /**
         * 显示一类 摘要列表
         * @param  {[type]} evt [description]
         * @return {[type]}     [description]
         */
        _onShowAbsList: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            this._fetchAbsList( 'class', 0, $(evt.currentTarget).attr('data-tid') );
            return false;
        },
        /**
         * 显示 文章详细内容
         * @param  {[type]} evt [description]
         * @return {[type]}     [description]
         */
        _onShowDetail: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var page = new PopupPage({
                url: '/blog/apps/article.php?id=' + $(evt.currentTarget).closest('li').data('id')
            }),
            me = this;
            page.on( 'absList:change', function( data ){
                me._fetchAbsList( data.type,data.start,data.id );
            } )
            return false;
        },
        /**
         * 显示 编辑文章内容
         * @param  {[type]} evt [description]
         * @return {[type]}     [description]
         */
        _onShowEditor: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            new PopupPage({
                url: '/diary/apps/article.php?edit=true&id=' + $(evt.currentTarget).closest('li').data('id')
            });
            return false;
        },

        //获取 摘要列表
        _fetchAbsList: function( type, start, id ) {
            var me = this;
            Util.ajax({
                url: '/diary/ajax/aj_abs_list.php',
                data: {
                    id: id,
                    start: start,
                    type: type,
                    num: this._itemPerPage
                },
                success: function(resp) {
                    if(resp.suc == true) {
                        var oldType = me.container.data( 'absType' ),
                            oldClass = me.container.data( 'absClass' );
                        if( oldType !== type || oldClass !== id ){
                            //标记当前 列表类别
                            me.container.data( 'absType', type );
                            //当前记录 数据类别
                            me.container.data( 'absClass', id );
                            me._initPageTurner( resp.total );
                        }
                        
                        //更新内容
                        me.container.find('.r-p ul').html(resp.html);
                    }
                }
            });
        }
    };

});