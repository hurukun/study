/*global K:false,define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/

/**
 * 翻页控件
 * 1、
 * rukun@corp.kaixin001.com
 */

define( 'core/switch/AjaxPageTurner', [ 'jQuery' ], function( require ){
    var $ = require( 'jQuery' ),
        Util = require( 'Util' );

    /**
     * 按钮样式集合
     * @type {Object}
     */
    var TurnerStyle = {
        use: function( style, user ){
            var proxy = this[ style] || this['default'];

            Util.mix( user, proxy );
        }
    };
    /**
     * 翻页控件
     * @module AjaxPageTurner
     */
    var AjaxPageTurner = function( opt ){
        /**
         * 外容器
         */
        this.jqContainer = $( opt.container );
        /**
         * 总页数
         */
        this.pageNum = opt.pageNum;
        /**
         * 总 tab 数
         */
        this.tabNum = Math.min( opt.tabNum, opt.pageNum);
        /**
         * 无效参数
         */
        if( this.pageNum < 2 || this.tabNum < 2 || this.jqContainer.length === 0 ){
            return;
        }
        /**
         * 当前选中Tab
         */
        this.CLASS_ACTIVE = opt.CLASS_ACTIVE;
        /**
         * 鼠标移过Tab
         */
        this.clsHover = opt.CLASS_HOVER;
        /**
         * 翻页按钮样式
         * @type {string}
         */
        this.style = opt.style;

        /**
         * 数字按钮 容器
         */
        this.jqNumContainer = null;
        /**
         * 显示的起始按钮 index, 结束按钮对应于 ：this.start + this.tabNum - 1
         */
        this.start = 1;
        /**
         * 判段按钮位置移动的距离阈值
         * @type {number}
         */
        this.threshold = Math.ceil( this.tabNum / 2 );

        /**
         * 当前按钮 index
         * @type {Number}
         */
        this.index = 1;

        /**
         * 初始化
         */
        this.init();
    };

    Util.mix( AjaxPageTurner.prototype, {
        /**
         * 初始化
         */
        init: function(){
            /**
             * 导入代理方法
             */
            TurnerStyle.use( this.style, this );
            /**
             * 创建元素
             */
            this.createElements();

            this.jqNumContainer = this.jqContainer.find( '[data-type="pageNumber"]' );
            /**
             * 绑定事件
             */
            this.bindElements();
        },
        /**
         * 绑定事件
         */
        bindElements: function(){
            /**
             * 点击翻页按钮
             */
            this.jqContainer.delegate( '[data-index]', 'click', $.proxy( this.onClickTab, this) );
        },
        /**
         * 点击 tab
         */
        onClickTab: function( evt ){
            evt.preventDefault();
            evt.stopPropagation();
            var target = $( evt.currentTarget ),
                toIndex = target.attr( 'data-index' );
            /**
             * 上一页 按钮
             */
            if( toIndex === 'p' ){
                toIndex = Math.max( this.index - 1, 1 );
            }
            /**
             * 下一页按钮
             */
            else if( toIndex === 'n' ){
                toIndex = Math.min( this.pageNum, this.index + 1 );
            }
            /**
             * 首页 按钮
             */
            else if( toIndex === 'f' ){
                toIndex = 1;
            }
            /**
             * 末页 按钮
             */
            else if( toIndex === 'e' ){
                toIndex = this.pageNum;
            }

            toIndex = window.parseInt( toIndex, 10 );

            if( toIndex === this.index ){
                return;
            }

            /**
             * 翻页
             */
            this.turn( toIndex );
        },
        /**
         * 翻页（更新控件）
         */
        turn: function( toIndex ){
            this.fire( 'before_turn',{from:this.index,to:toIndex} );
            this._turn( toIndex ); 
            this.fire( 'after_turn',{from:this.index,to:toIndex} );
        },
        /**
         * 更改页面总数，更新；
         * @param {number} pageNum 新页面总数
         */
        refresh: function( pageNum ){
            this.pageNum = pageNum;
            /**
             * 删除控件
             */
            if( pageNum < 2  ){
                this.jqContainer.hide();
            }
            /**
             * 调整最后一个按钮为当前页；
             */
            else if( pageNum < this.index ){
                this.index = pageNum;
                this.turn( pageNum );
            }
            /**
             * 调整最后一个按钮为最后一页；
             */
            else if( pageNum < ( this.start + this.tabNum - 1 ) ){
            }

            
        }
    } );

    /**
     * 定义翻页按钮样式类
     * 必须实现：
     *     a、元素的创建与添加：createElements();
     *     b、翻页与更新：_turn( toIndex )
     */
    
    TurnerStyle[ 'default' ] = {
        /**
         * 创建元素并添加到DOM
         */
        createElements: function(){
            var createBtns =function(){
                var html = [],
                    i = 1;
                for(  i = 1; i <= this.tabNum; i++ ){
                    html.push( '<a href="#" data-index="'+ i +'" class="'+(i==1?this.CLASS_ACTIVE:'')+'">'+i+'</a>' );
                }
                return html.join('');
            };
                
            this.jqContainer.empty().append( this.tmpl( createBtns ) );
        },
        /**
         * 翻页
         */
        _turn: function( toIndex ){
            /**
             * 更新 首页、上一页 按钮
             * @type {[type]}
             */
            this.jqContainer.find( '[data-index="f"]' ).toggle( toIndex !== 1 );
            this.jqContainer.find( '[data-index="p"]' ).toggle( toIndex !== 1 );
            /**
             * 更新 末页、下一页 按钮
             * @type {[type]}
             */
            this.jqContainer.find( '[data-index="e"]' ).toggle( toIndex !== this.pageNum );
            this.jqContainer.find( '[data-index="n"]' ).toggle( toIndex !== this.pageNum );
            /**
             * 更新按钮 活动状态
             */
            this.jqContainer.find( '[data-index="'+ this.index +'"]' ).removeClass( this.CLASS_ACTIVE ); 
            this.jqContainer.find( '[data-index="'+ toIndex +'"]' ).addClass( this.CLASS_ACTIVE );
            /**
             * 更新 当前页 索引
             */
            this.index = toIndex;

            this.update();
        },
        /**
         * 如果总页数大于翻页按钮数，则需要更新显示的按钮
         * 规则：如果当前页码到显示的最小页码的距离大于显示页码距离的1/2，去掉前面的按钮，显示后边按钮，在保证最后一个页码小于最大页面的前提下，尽量使当前页面对应按钮居中；
         *             反之亦然；
         */
        update: function(){
            var start = Math.max( 1, this.index - this.threshold + 1 );
            start = Math.min( start, this.pageNum - this.tabNum + 1 );
            /**
             * 更新按钮代表的页面
             */
            if( this.start !== start ){
                var jqNumBtn = this.jqNumContainer.find( 'a' ),
                index = start,
                me = this;
                jqNumBtn.each( function( key, item){
                    $( item ).attr( 'data-index', index ).removeClass( me.CLASS_ACTIVE ).addClass( index === me.index? me.CLASS_ACTIVE: '' ).html( index++ );
                } );
                /**
                 * 更新起始位置
                 */
                this.start = start;
            }
        },
        /**
         * 按钮 html
         */
        tmpl: function( fnCreateBtns ){
            return [
                    '<div class="turner_pages">',
                        '<a href="#" data-index="f" style="display:none;">\u9996\u9875</a>',
                        '<a href="#" data-index="p" style="display:none;">\u4E0A\u4E00\u9875</a>',
                        '<span class="num" data-type="pageNumber">',
                            fnCreateBtns.call( this ),
                        '</span>',
                        '<a href="#" data-index="n">\u4E0B\u4E00\u9875</a>',
                        '<a href="#" data-index="e">\u672B\u9875</a>',
                    '</div>'
            ].join('');
        }
    };

    return AjaxPageTurner;
} );