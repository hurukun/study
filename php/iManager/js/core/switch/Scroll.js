/*define:false*/
/**
 * 幻灯片效果封装
 * 构造函数参数参考：
 * <pre><code>
    {Mixed}             prev                前一个按钮（选择符或jQuery对象）
    {Mixed}             next                后一个按钮（选择符或jQuery对象）
    {Mixed}             keys                与内容块一一对应的按钮（选择符或jQuery对象）
    {Mixed}             contents            滚动的内容（滚动内容数组或选择符）
    {HTMLElement}       host                内容所在的容器
    {Integer}           width               每个块的宽度，默认取第一个块的宽度（水平滚动时需要）
    {Integer}           height              每个块的高度,默认取第一个块的高度（垂直滚动时需要）
    {Scroll.Behavior}   behavior            具体进行Scroll切换的策略类(默认为ShowHide)
    {Array}             events              触发切换的事件类型(默认为click)
    {Array}             keyEvents           Keys按钮触发切换的事件类型(默认为click)
    {Boolean}           vertical            是否垂直滚动(默认为水平)
    {String}            PREV_DISABLED_CLASS 前一个按钮Disabled的Class Name
    {String}            NEXT_DISABLED_CLASS 下一个按钮Disabled的Class Name
    {String}            CUR_KEY_CLASS       当前选中Key按钮的Class Name
 * 
 * </code></pre>
 * @module switch
 * @class Scroll 
 */
define( 'core/switch/Scroll', [ 'jQuery' ], function( require ) {
    var $ = require( 'jQuery' ),
        Util = require( 'Util' );

    function Scroll( opts ) {
        /**
         * 具体Scroll的内容，可以是元素集合或选择符集合。
         * @property contents 
         * @type Array
         */
        this.contents = [ ];

        /**
         * 内容所在的容器
         * @property host 
         * @type HTMLElement
         */
        this.host = null;

        /**
         * 前一个按钮
         * @property prev 
         * @type String|jQuery
         */
        this.prev = null;

        /**
         * 后一个按钮
         * @property next 
         * @type String|jQuery
         */
        this.next = null;

        /**
         * 是否垂直滚动
         * @property vertical 
         * @type Boolean
         * @default false
         */
        this.vertical = false;

        /**
         * 是否循环切换
         * @property cycle 
         * @type Boolean
         * @default false
         */
        this.cycle = false;

        /**
         * 当前所处位置
         * @property index 
         * @type Integer
         * @default 0
         */
        this.index = 0;

        /**
         * 前一次所处位置
         * @property lastIndex 
         * @type Integer
         * @default 0
         */
        this.lastIndex = 0;

        /**
         * 触发切换的事件
         * @property events 
         * @type Array
         * @default [ 'click' ]
         */
        this.events = [ 'click' ];

        /**
         * Keys按钮触发切换的事件
         * @property keyEvents  
         * @type Array
         * @default [ 'click' ]
         */
        this.keyEvents = [ 'click' ];

        /**
         * 前一个按钮Disabled的Class Name
         * @property PREV_DISABLED_CLASS    
         * @type String
         * @final
         * @default 'prev-btn-disabled'
         */
        this.PREV_DISABLED_CLASS = 'prev-btn-disabled';

        /**
         * 后一个按钮Disabled的Class Name
         * @property NEXT_DISABLED_CLASS    
         * @type String
         * @final
         * @default 'next-btn-disabled'
         */
        this.NEXT_DISABLED_CLASS = 'next-btn-disabled';

        /**
         * 当前选中Key按钮的Class Name
         * @property CUR_KEY_CLASS    
         * @type String
         * @final
         * @default 'cur'
         */
        this.CUR_KEY_CLASS = 'cur';

        /**
         * 是否正在切换内容
         * @property inSwitching
         * @type Boolean
         * @default false
         */
        this.inSwitching = false;

        this.init( opts );
    };

    Util.mix( Scroll.prototype, {
        init: function( opts ) {
            /**
             * 切换前
             * @event beforeswitch  
             * @param   {CustEvent} evt 事件实例
             * <ul>
             *  <li>evt.from            切换前元素</li>
             *  <li>evt.to          切换后元素</li>
             * </ul>
             */

            /**
             * 切换后
             * @event afterswitch   
             * @param   {CustEvent} evt 事件实例
             * <ul>
             *  <li>evt.from            切换前元素</li>
             *  <li>evt.to          切换后元素</li>
             * </ul>
             */

            /**
             * 到达头部
             * @event arrivefirst   
             * @param   {CustEvent} evt 事件实例<br>
             * <ul>
             *  <li>evt.from            切换前元素</li>
             *  <li>evt.to          切换后元素</li>
             * </ul>
             */
            /**
             * 到达尾部
             * @event arrivelast    
             * @param   {CustEvent} evt 事件实例<br>
             * <ul>
             *  <li>evt.from            切换前元素</li>
             *  <li>evt.to          切换后元素</li>
             * </ul>
             */
            //( this, 'beforeswitch,afterswitch,arrivefirst,arrivelast' );

            Util.mix( this, opts );

            if ( !this.behavior ) {
                this.behavior = Scroll.Behavior.ShowHide;
            }

            this.prev = $( this.prev );
            this.next = $( this.next );
            this.host = $( this.host );

            if ( Util.isString( this.contents ) ) {
                this._contents_selector = this.contents;
                this.contents = $( this.contents );
            }

            if ( Util.isString( this.keys ) ) {
                this._keys_selector = this.keys;
                this.keys = $( this.keys );
            }

            //设置内容块的高度和宽度
            if( !this.width && this.contents.length ) {
                this.width = this.contents.eq( 0 ).outerWidth( true );
            }
            if( !this.height && this.contents.length ) {
                this.height = this.contents.eq( 0 ).outerHeight( true );
            }

            this.updateBtn( );

            this._addEvents( );
        },
        _addEvents: function( ) {
            var evts = this.events,
                me = this,
                kevts = this.keyEvents;

            Util.forEach( evts, function( evt, idx ) {
                me.prev.bind( evt, $.proxy( me._prevTriggerHandler, me ) );
                me.next.bind( evt, $.proxy( me._nextTriggerHandler, me ) );
            } );

            if ( this.keys ) {
                Util.forEach( this.keys, function( key ) {
                    Util.forEach( kevts, function( e ) {
                        $( key ).bind( e, function( evt ) {
                            evt.preventDefault();

                            //由于key可能被动态删除，因此需要获取其index
                            var idx = $( this ).index( me._keys_selector );
                            me.to( idx );
                        } );
                    } );
                } );
            }
        },
        _prevTriggerHandler: function( e ) {
            e.preventDefault( );
            this.toPrev( );
        },
        _nextTriggerHandler: function( e ) {
            e.preventDefault( );
            this.toNext( );
        },
        /**
         * 设置切换的内容
         * @method  setContents 
         * @param   {String} selector 内容selector，如果无则用初始化时的selector重新设置
         */
        setContents: function( selector ) {
            var sel = selector || this._contents_selector;
            if( !sel || !Util.isString( sel ) ) {
                return 
            }

            this.contents = $( sel );

            if( selector ) {
                this._contents_selector = selector;
            }
        },
        /**
         * 设置切换的对应按钮
         * @method  setKeys 
         * @param   {String} selector 按钮selector，如果无则用初始化时的selector重新设置
         */
        setKeys: function( selector ) {
            var sel = selector || this._keys_selector;
            if( !sel || !Util.isString( sel ) ) {
                return 
            }

            this.keys = $( sel );

            if( selector ) {
                this._keys_selector = selector;
            }
        },
        /**
         * 切换到某个内容块
         * @method  to 
         * @param   {Integer} index 下标
         * @param   {Integer} [dir] 切换方向(如果切换到下一个为1，否则为-1。循环切换需用。)
         */
        to: function( index, dir ) {
            if ( !( ( this.contents.length 
                && index < this.contents.length 
                && index >= 0 
                && !this.inSwitching
                && !this.cycle )
                || (
                this.cycle 
                && this.contents.length
                && !this.inSwitching
                ) ) ) {
                return;
            }

            index = Math.abs( ( index + this.contents.length ) % this.contents.length );

            this.dispatchBeforeSwitch( this.index, index );

            var prev = this.lastIndex = this.index;
            this.index = index;

            this.inSwitching = true;
            //真正的切换行为交给具体的策略类来处理
            this.behavior.trigger( {
                from: prev,
                to: index,
                dir: dir,
                context: this
            } );

            this.updateBtn( );
        },
        /**
         * 切换到前一个内容块
         * @method  toPrev 
         */
        toPrev: function( ) {
            this.to( this.index - 1, -1 );
        },
        /**
         * 切换到后一个内容块
         * @method  toPrev 
         */
        toNext: function( ) {
            this.to( this.index + 1, 1 );
        },
        /**
         * 设置按钮状态
         * @method  updateBtn 
         */
        updateBtn: function( ) {
            if( !this.cycle
                && this.prev 
                && this.prev.length 
                && this.next 
                && this.next.length ) {
                if ( this.index === 0 ) {
                    this.prev.addClass( this.PREV_DISABLED_CLASS );
                }
                else if ( this.index == ( this.contents.length - 1 ) ) {
                    this.next.addClass( this.NEXT_DISABLED_CLASS );
                }

                if ( this.prev.hasClass( this.PREV_DISABLED_CLASS ) 
                    && ( this.index > 0 ) ) {
                    this.prev.removeClass( this.PREV_DISABLED_CLASS );
                }

                if ( this.next.hasClass( this.NEXT_DISABLED_CLASS ) 
                    && ( this.index < ( this.contents.length - 1 ) ) ) {
                    this.next.removeClass( this.NEXT_DISABLED_CLASS );
                }
            }

            if ( this.keys && this.keys.length ) {
                this.keys.eq( this.index ).addClass( this.CUR_KEY_CLASS );

                if( this.lastIndex != this.index ) {
                    this.keys.eq( this.lastIndex ).removeClass( this.CUR_KEY_CLASS );
                }
            }
        },
        /**
         * 根据下标找到元素
         * @method item 
         * @param   {Integer} index 下标
         * @return  jQuery
         */
        item: function( index ) {
            if ( this.contents.length === 0 || index < 0 ) {
                return null;
            }

            return this.contents.eq( index % this.contents.length ) || null;
        },
        /**
         * 派发事件
         * @method _dispatch 
         * @private
         * @param   {String}    type    事件名
         * @param   {Integer}   from    上次选中的下标
         * @param   {Integer}   to      当前下标
         * @return  {Boolean}   事件执行结果
         */
        _dispatch: function( type, from, to ) {
            var _e = {};

            Util.mix( _e, {
                from: this.item( from ),
                to: this.item( to ),
                fromIndex: from,
                toIndex: to
            } );

            return this.fire( _e );
        },

        /**
         * 派发切换前事件
         * @method dispatchBeforeSwitch 
         * @param   {Integer}   from        上次选中的下标
         * @param   {Integer}   to          当前下标
         * @return  {Boolean}   事件执行结果
         */
        dispatchBeforeSwitch: function( from, to ) {
            return this._dispatch( 'beforeswitch', from, to );
        },

        /**
         * 派发切换后事件
         * @method dispatchAfterSwitch 
         * @param   {Integer}   from        上次选中的下标
         * @param   {Integer}   to          当前下标
         */
        dispatchAfterSwitch: function( from, to ) {
            this._dispatch( 'afterswitch', from, to );

            if ( this.index === 0 ) {
                this.dispatchArriveFirst( from, to );
            }
            else if ( this.index == ( this.contents.length - 1 ) ) {
                this.dispatchArriveLast( from, to );
            }
        },
        dispatchArriveFirst: function( from, to ) {
            return this._dispatch( 'arrivefirst', from, to );
        },
        dispatchArriveLast: function( from, to ) {
            return this._dispatch( 'arrivelast', from, to );
        }
    } );

    /**
     * Scroll切换效果的策略类
     * @module switch
     * @class Behavior
     * @static
     * @namespace Scroll
     */
    Scroll.Behavior = {};

    /**
     * Scroll切换效果的策略类之显示隐藏
     * @module switch
     * @class ShowHide
     * @static
     * @namespace Scroll.Behavior
     */
    var ShowHide = {
        /*
         *  @param {Object} data 数据
            {
                from:       prev,
                to:         index,
                context:    this,
                type:       evtType
            }
         */
        trigger: function( data ) {
            var from = data.from,
                to = data.to,
                ctx = data.context,
                host = ctx.host,
                disIndex = to - from,
                disWidth = disIndex * ctx.width,
                disHeight = disIndex * ctx.height;

            if ( !ctx.vertical ) {
                var left = parseInt( host.css( 'left' ), 10 );
                if ( isNaN( left ) ) {
                    left = 0;
                }

                host.css( {
                    'left': left - disWidth
                } );
            }
            else {
                var top = parseInt( host.css( 'top' ), 10 );
                if ( isNaN( top ) ) {
                    top = 0;
                }

                host.css( {
                    'top': top - disHeight
                } );
            }           

            ctx.dispatchAfterSwitch( from, to );

            ctx.inSwitching = false;
        }
    };

    Scroll.Behavior.ShowHide = ShowHide;

    /**
     * Scroll切换效果的策略类之渐隐渐现
     * @module switch
     * @class FadeInOut
     * @static
     * @namespace Scroll.Behavior
     */
    var FadeInOut = {
        /*
         *  @param {Object} data 数据
            {
                from:       prev,
                to:         index,
                context:    this,
                type:       evtType
            }
         */
        trigger: function( data ) {
            var to = data.to,
                from = data.from,
                ctx = data.context,
                host = ctx.host;

            host.css( {
                'left': 0,
                'top': 0
            } );
            ctx.contents.hide( );
            ctx.item( to ).fadeIn( );
            ctx.dispatchAfterSwitch( from, to );
            ctx.inSwitching = false;
        }
    };

    Scroll.Behavior.FadeInOut = FadeInOut;

    /**
     * Scroll切换效果的策略类之水平或垂直滚动
     * @module switch
     * @class BScroll
     * @static
     * @namespace Scroll.Behavior
     */
    var BScroll = {
        duration: 500,
        /*
         *  @param {Object} data 数据
            {
                from:       prev,
                to:         index,
                dir:        dir,
                context:    this,
                type:       evtType
            }
         */
        trigger: function( data ) {
            var from = data.from,
                to = data.to,
                dir = data.dir,
                ctx = data.context,
                host = ctx.host,
                disIndex = to - from,
                disWidth = disIndex * ctx.width,
                disHeight = disIndex * ctx.height;

            if ( !ctx.vertical ) {
                var left = parseInt( host.css( 'left' ), 10 );
                if ( isNaN( left ) ) {
                    left = 0;
                }

                /*循环切换处理(只允许单步切换)*/
                if( ctx.cycle ) {
                    //原顺序内容
                    var originalContents = ctx.contents,
                        length = ctx.contents.length,
                    //当前顺序内容
                        curContents = $( ctx._contents_selector ),
                    //当前可见的元素
                        curItem = originalContents.eq( from ),
                    //当前可见元素的真实位置
                        curIndex = curContents.index( curItem.get( 0 ) ),
                        nextItem = null;

                    //如果当前元素已是最后一个并且继续往下切换时需将前面的元素补充到最后
                    if( curIndex === length - 1 && dir === 1 ) {
                        nextItem = originalContents.eq( to );
                        curItem.parent().append( nextItem );
                        left = left + ctx.width;
                        host.css( 'left', left );
                        disWidth = ctx.width;
                    }
                    //如果当前元素已是第一个并且继续往前切换时需要将后面的元素补充到前面
                    else if( curIndex === 0 && dir === -1 ) {
                        nextItem = originalContents.eq( to );
                        curItem.parent().prepend( nextItem );
                        left = left - ctx.width;
                        host.css( 'left', left );
                        disWidth = -ctx.width;
                    }
                    else if( dir === 1 ) {
                        disWidth = ctx.width;
                    }
                    else if( dir === -1 ) {
                        disWidth = -ctx.width;
                    }
                }

                //时差动画元素
                if( from !== to && ctx.widgets && ctx.widgets.length > 0 ){
                    this._arrangeWidgets( ctx, to, disWidth, disWidth > 0 );
                    this._toCur( ctx.widgets[ to ] , ctx.vertical );
                    this[ '_to' + (( disWidth < 0 )? 'Next' : 'Prev' ) ]( ctx.widgets[ from ] , ctx.vertical );
                }

                host.animate( {
                    left: left - disWidth
                }, this.duration, function( ) {
                    ctx.dispatchAfterSwitch( from, to );
                    ctx.inSwitching = false;
                } );
            }
            else {
                var top = parseInt( host.css( 'top' ), 10 );
                if ( isNaN( top ) ) {
                    top = 0;
                }
                
                /*循环切换处理(只允许单步切换)*/
                if( ctx.cycle ) {
                    //原顺序内容
                    var originalContents = ctx.contents,
                        length = ctx.contents.length,
                    //当前顺序内容
                        curContents = $( ctx._contents_selector ),
                    //当前可见的元素
                        curItem = originalContents.eq( from ),
                    //当前可见元素的真实位置
                        curIndex = curContents.index( curItem.get( 0 ) );

                    //如果当前元素已是最后一个并且继续往下切换时需将前面的元素补充到最后
                    if( curIndex == length - 1 && dir == 1 ) {
                        var nextItem = originalContents.eq( to );
                        curItem.parent().append( nextItem );
                        top = top + ctx.height;
                        host.css( 'top', top );
                        disHeight = ctx.height;
                    }
                    //如果当前元素已是第一个并且继续往前切换时需要将后面的元素补充到前面
                    else if( curIndex == 0 && dir == -1 ) {
                        var nextItem = originalContents.eq( to );
                        curItem.parent().prepend( nextItem );
                        top = top - ctx.height;
                        host.css( 'top', top );
                        disHeight = -ctx.height;
                    }
                    else if( dir == 1 ) {
                        disHeight = ctx.height;
                    }
                    else if( dir == -1 ) {
                        disHeight = -ctx.height;
                    }
                }

                //时差动画元素
                if( from !== to && ctx.widgets && ctx.widgets.length > 0 ){
                    this._arrangeWidgets( ctx, to, disHeight, disHeight > 0 );
                    this._toCur( ctx.widgets[ to ] , ctx.vertical );
                    this[ '_to' + (( disHeight < 0 )? 'Next' : 'Prev' ) ]( ctx.widgets[ from ] , ctx.vertical );
                }

                host.animate( {
                    top: top - disHeight
                }, this.duration, function( ) {
                    ctx.dispatchAfterSwitch( from, to );
                    ctx.inSwitching = false;
                } );
            }
        },
        /**
         * 放置将要出现的元素
         * @param  {Object} context Scroll 对象
         * @param  {int} to      将要显示页的 index
         * @param  {int} dist    动画中元素移动的距离
         * @param  {boolean} toNext  动画方向
         */
        _arrangeWidgets: function( context,to, dist, isToNext ){
            if( isToNext ){
                this._arrangeToNext( context.widgets[ to ], dist, context.vertical );
            }
            else{
                this._arrangeToPrev( context.widgets[ to ], dist, context.vertical );
            }
        },
        /**
         * 将场景元素放到 前一个 位置
         * @param  {array} eles 场景元素
         * @param  {int} dist 元素的准备位置
         */
        _arrangeToPrev: function( eles, dist, isVertical ){
            var me = this,
                target = null;
            Util.forEach( eles, function( item,sel ){
                target = $( sel );
                if( isVertical ){
                    target.css({
                        'position' : 'absolute',
                        'top' : ( item.top + dist ) + 'px'
                    });
                }
                else{
                    target.css({
                        'position' : 'absolute',
                        'left' : ( item.left + dist ) + 'px'
                    });
                }
            } );
        },
        /**
         * 将场景元素放到 后一个 位置
         * @param  {array} eles 场景元素
         */
        _arrangeToNext:function( eles,dist,isVertical ){
            var me = this,
                target = null;
            Util.forEach( eles, function( item,sel ){
                target = $( sel );
                if( isVertical ){
                    target.css({
                        'position' : 'absolute',
                        'top' : ( item.top +dist  ) + 'px'
                    });
                }
                else{
                    target.css({
                        'position' : 'absolute',
                        'left' : ( item.left +dist  ) + 'px'
                    });
                }
            } );
        },
        /**
         * 转至 显示位置
         * @param  {Object} eles 包含的元素选择器 集合
         */
        _toCur: function( eles,isVertical ){
            var me = this;
            Util.forEach( eles, function( item, sel ){
                if( isVertical ){
                    $( sel ).show().animate({
                        'top' : item.top
                    }, item.time);
                }
                else{
                    $( sel ).show().animate({
                        'left' : item.left
                    }, item.time);
                }
            } );
        },
         /**
         * 转至 显示 前一个位置
         * @param  {Object} eles 包含的元素选择器 集合
         * @param {Function} callback 动画完后的回调函数
         */
        _toPrev: function( eles,isVertical, callback ){
            var me = this,
                target = null;
            Util.forEach( eles, function( item,sel ){
                target = $( sel );
                if( isVertical ){
                    target.animate({
                        'top' : item.top  - $(window).height()
                    }, item.time,  function(){ 
                        callback&&callback.call();
                    } );
                }
                else{
                    target.animate({
                        'left' : item.left  - $(window).width()
                    }, item.time,  function(){ 
                        callback&&callback.call();
                    } );
                }
            } );
        },
         /**
         * 转至 显示 后一个位置
         * @param  {Object} eles 包含的元素选择器 集合
         * @param {Function} callback 动画完后的回调函数
         */
        _toNext: function( eles, isVertical, callback ){
            var me = this,
                target = null;
            Util.forEach( eles, function( item,sel ){
                target = $( sel );
                if( isVertical ){
                    target.animate({
                        'top' :  item.top + $(window).height()
                    }, item.time, function(){ 
                        callback&&callback.call();
                    });
                }
                else{
                    target.animate({
                        'left' :  item.left + $(window).width()
                    }, item.time, function(){ 
                        callback&&callback.call();
                    });

                }
            } );
        }
    };

    Scroll.Behavior.Scroll = BScroll;

    return Scroll;
} );
