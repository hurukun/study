/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * 漂浮于当前页面上方（z-index）的舞台，用于各种场景的显示与其切换；
 * @module FloatStage
 * @author rukun rukun@corp.kaixin001.com
 * @e.g.   js/apps/activity/timemachine/TimeMachine.js
 */
define( 'core/stage/FloatStage', [ 'jQuery' ], function( require ){
    var $ = require( 'jQuery' ),
        ZIndex = 90000,
        Util = require( 'Util' );

    /**
     * 管理 场景 及元素 的切换效果
     */
    var Switcher = function(){
        this.idleTimer = null;
    };

    Util.mix( Switcher, {
        Type:{
            Show: 'sw_show',
            Hide: 'sw_hide',
            FadeIn: 'sw_fadein',
            FadeOut:'sw_fadeout',
            HScroll: 'sw_hscroll',
            VScroll: 'sw_vscroll'
        },
        Status:{
            Idle: 'sw_idle',
            Busy: 'sw_Busy'
        }
    } );

    /**
     * 舞台DOM结构
     * <div data-sigil="stage">
     *     <div data-sigil="scenes">
     *         <div data-scene="0"></div>
     *         <div data-scene="1"></div>
     *          ......
     *     </div>
     *     <div data-sigil="widgets">
     *         <div></div>
     *         ......
     *     </div>
     *     <div data-sigil="statics">
     *          ......
     *     </div>
     * </div>
     */


    /**
     * 默认场景配置信息
     * @type {Object}
     */
    var defaultStage = {
            /**
             * 初始显示的 场景编号 [默认，可选]
             * @type {Number}
             */
            initScene: 0,
            /**
             * 用于包含所有场景的容器模板，用于动画切换，用 [data-type="stage"] 指定 [默认，可选]
             * @type {String}
             */
            wrapper: '<div data-sigil="stage" style="position:absolute"/>',
            /**
             * 默认场景元素容器
             * @type {String}
             */
            sceneContainer: '<div data-sigil="scenes"></div>',
            /**
             * 独立元素容器
             * @type {String}
             */
            widgetContainer: '<div data-sigil="widgets"></div>',
            /**
             * 场景中的静态元素，不会自动随场景变化
             * @type {String}
             */
            staticElement: '<div data-sigil="statics" style="display:none">',
            /**
             * 对舞台的初始化，[可选]
             * @type {Function}
             * @param  {jQuery Object} eleFront 舞台前景容器(观看窗口)
             * @param  {jQuery Object} eleEnd 舞台背景容器
             */
            stage: function( eleFront, eleEnd ){
                /**
                 * 默认 背景为半透明的蒙板
                 */
                eleFront.css( {
                    'position':'fixed',
                    'top': '0px',
                    'left': '0px',
                    'overflow':'hidden',
                    'width':'100px',
                    'height':'90px'
                } );
                /**
                 * 默认 背景为半透明的蒙板
                 */
                eleEnd.css( {
                    'position':'fixed',
                    'top': '0px',
                    'left': '0px',
                    'width': $( window ).width() + 'px',
                    'height': $( window ).height() + 'px',
                    'background': 'rgba( 0,0,0,.5 )'
                } );
            },
            /**
             * 绑定在容器上的 公共事件，[可选]
             * @type {Object}
             */
            events: {},
            /**
             * 公共事件 消息处理函数，[可选]
             * @param  {Event Object} evt 消息对象
             * @return {[type]}     [description]
             */
            eventHandler: function( stage, evt ){},
            /**
             * 场景相关定义，[必须]
             * @type {Array}
             */
            scenes:[
                /**
                 * 一个场景
                 * @type { Object }
                 */
                {
                    /**
                     * 场景切换方式，[可选]
                     * @type {string}
                     */
                    switcher: {
                        /**
                         * 切入
                         * @type {Object}
                         */
                        swin: {
                            /**
                             * 动态效果阶段队列
                             * @type {Array}
                             */
                            type: [ Switcher.Type.Show, Switcher.Type.HScroll ],
                            /**
                             * 相对于场景容器的偏移( x, y)
                             */
                            pos: [  [ 0, 0 ] ],
                            /**
                             * 各个动画阶段时间队列
                             * @type {Array}
                             */
                            time: [ 0, 500 ],
                            /**
                             * 各个动画阶段延迟
                             * @type {Array}
                             */
                            delay: [0, 0 ]
                        },
                        /**
                         * 切出， 默认项同切入
                         * @type {Object}
                         */
                        swout:{
                        }
                    },
                    /**
                     * 对舞台的修改，若未修改，则沿用旧舞台，[可选]
                     * @type {Function}
                     * @param  {jQuery Object} eleFront 舞台前景容器(观看窗口)
                     * @param  {jQuery Object} eleEnd 舞台背景容器
                     */
                    stage: function( eleFront, eleEnd ){},
                    /**
                     * 场景中元素的模板，[可选]
                     * @type {String}
                     */
                    content: '<div/>',
                    /**
                     * 初始化 场景对象
                     */
                    prepare: function( container ){},
                    /**
                     * 显示前调整 场景
                     */
                    ready: function(){},
                    /**
                     * 场景中相关事件，[可选]
                     * @type {Object}
                     */
                    events: {},
                    /**
                     * 场景 消息处理函数，[可选]
                     * @param  {Event Object} evt 消息对象
                     * @return {[type]}     [description]
                     */
                    eventHandler: function( stage, evt ){}
                    
                }
            ],
            /**
             * 在场景中出现，但动画不同步的元素
             * @type {Object}
             */
            widgets:[
                /**
                 * 将要放置到对应index的舞台上的元素模块, 支持如下两个格式.
                 * @type {Array}
                 */
                [
                    {   
                        /**
                         * 元素 html [必须]
                         * @type {string}
                         */
                        content: '<div/>',
                        /**
                         * 元素切换的方式
                         * @type {string}
                         */
                        switcher: {
                            swin: {
                                type: [ Switcher.Type.Hide, Switcher.Type.FadeIn ],
                                pos: [ [ 0, 100], [ 0, 100 ] ],
                                time: [ 0, 500],
                                delay: [ 0, 0 ]
                            },
                            swout:{
                                type: [ Switcher.Type.FadeOut ],
                                time: [ 100 ]
                            }
                        }
                    },
                    {
                        /**
                         * 元素 html [必须]
                         * @type {string}
                         */
                        content: function( container, callback){
                            var ele = $( '<div/>' );
                            container.append(  );
                            callback && callback.call(null, ele );
                        },
                        switcher: {
                            swin: {
                                type: [ Switcher.Type.Hide, Switcher.Type.FadeIn ],
                                pos: [ [ 0, 100], [ 0, 100 ] ],
                                time: [ 0, 500],
                                delay: [ 0, 0 ]
                            }
                        }
                    }
                ],
                [
                ]
            ]

        };

    /**
     * 浮动舞台用于场景切换，一个场景包括：背景和前景；
     * @class  FloatStage
     * @constructor
     * @param {Object} options 场景配置信息
     */
    var FloatStage = function( options ){
        /**
         * 缓存元素
         * @type {Object}
         */
        this._cache = {};
        /**
         * @property {Object} _stage 合并 舞台及场景配置
         * @private
         * @final
         */
        this._stage = defaultStage;
        Util.mix( this._stage, options );
        /**
         * 场景切换管理器
         */
        this._switcher = null;
        /**
         * @property {Number}  _sceneIndex 当前显示的 场景 编号
         * @private
         * @final
         */
        this._sceneIndex = -1;
        /**
         * @property {Number} _sceneCount 场景数
         * @private
         * @final
         */
        this._sceneCount = 0;
        
        /**
         * 初始化
         */
        this._init();
    };

    Util.mix( FloatStage.prototype, {
        /**
         * 舞台初始化
         * @method _init
         * @private
         */
        _init: function(){
            var i = 0;

            this._switcher = new Switcher();
            /**
             * 创建舞台
             */
            this._build();
            /**
             * 绑定与容器的 公共事件
             */
            if( this._stage.events ){
                this._bindSceneEvents( this.sigil( 'stage' ), this._stage );
            }
            /**
             * 调整舞台
             */
            this._stage.stage.call( null, this.sigil('foreground' ), this.sigil( 'background' ) );
            /**
             * 场景数
             */
            this._sceneCount = this._stage.scenes.length;

            /**
             * 初始化第一个场景
             */
            this.to( this._stage.initScene );

            this._bindEvent();
            /**
             * 预加载 引导资源
             */
            if( this._stage.scenes ){
                for( i = 0; i < this._stage.scenes.length; i++ ){
                    this._prepareScene( this._stage.scenes[ i ],  this._stage.widgets[ i ], i );
                }
            }
        },
        /**
         * 创建舞台
         * @method _build
         * @private
         */
        _build: function(){
            /**
             * 创建舞台框架
             */
            /**
             * 背景前景容器
             * @type {jqObject}
             */
            var stageBkg = $( '<div data-role="stageBkg" style="z-index:'+ ( ZIndex++ ) +';"/>' ),
            /**
             * 场景前景容器
             * @type {jqObject}
             */
                stageFrg = $( '<div data-role="stageFrg" style="z-index:'+ ( ZIndex++ ) +';"/>' );
            $( document.body ).append( stageBkg );
            $( document.body ).append( stageFrg );
            /**
             * 缓存
             */
            this.sigil( 'background', stageBkg );
            this.sigil( 'foreground', stageFrg );

            stageFrg.append( this._stage.wrapper );

            /**
             * 舞台容器
             */
            var wrapper = this.sigil( 'stage' );
            
            /**
             * 场景容器
             */
            wrapper.append( this._stage.sceneContainer );
            /**
             * 场景相关的独立元素容器
             */
            wrapper.append( this._stage.widgetContainer );
            /**
             * 舞台静态元素
             */
            wrapper.append( this._stage.staticElement );
           
            /**
             * 场景容器
             */
            this.sigil( 'scenes' );
            /**
             * 场景相关独立元素容器
             */
            this.sigil( 'widgets' );
            /**
             * 舞台相关静态元素容器
             */
            this.sigil( 'staitcs' );
        },
        /**
         * 绑定相关事件
         */
        _bindEvent: function(){
            var me = this,
                timer = null;
            /**
             * 为了适应 absolute 定位时的滚动事件
             */
            $(window).bind( 'scroll.floatStage', function( evt ){
                var bkg = me.sigil( 'background' );

                if( bkg.css( 'position' )  === 'absolute' ){
                    clearTimeout( timer );
                    timer = setTimeout( function() {
                            bkg.css( 'height', $(document.body).height()+ 'px' );
                        }, 250 );
                }

                evt.preventDefault();
                evt.stopPropagation();
                return false;
            } );
            /**
             * 点击静态元素
             */
            this.sigil( 'statics' ).bind( 'click', function( evt ){
                me.fire( 'click:staticComponents', evt );
            } );
        },
        /**
         * 绑定场景内部事件
         * @method _bindSceneEvents
         * @private
         * @param {jQuery Object}   container 场景容器
         * @param {scene} scene 场景相关数据
         * @example
         *     events:{
         *         'click a.counter' : 'clickHandler'
         *     }
         */
        _bindSceneEvents: function( container, scene ){
            var me = this,
                eventSpliter = /^([\w\.]+)(?:\s+(.*))?$/,
                events = scene.events;
                
            Util.map( events, function( handler, evtStr ) {
                var match = evtStr.match( eventSpliter ),
                    evtName = match[ 1 ],
                    selector = match[ 2 ],
                    method = Util.bind( scene[ handler ], scene, me );
                
                if ( !selector ) {
                    container.bind( evtName, method );  
                }
                else {
                    container.delegate( selector, evtName, method );    
                }
            } );
        },
        /**
         * 创建 场景相关DOM，并绑定相关事件
         * @method _prepareScene
         * @private
         * @param  {Object} scene 场景相关数据
         * @param {int} index 场景编号
         */
        _prepareScene: function( scene, widgets, index ){
            var me = this,
                ii = 0,
                /**
                 * 舞台容器
                 */
                stage = this.sigil( 'stage' ),
                /**
                 * 场景容器
                 * @type {jqObject}
                 */
                sceneContainer = this.sigil( 'scenes' ),
                /**
                 * 场景相关，独立元素容器
                 * @type {jqObject}
                 */
                widgetContainer = this.sigil( 'widgets' ),
                /**
                 * 场景元素
                 * @type {jqObject}
                 */
                sceneEle = null,
                ele = null,
                /**
                 * 场景相关独立元素长度
                 * @type {number}
                 */
                widgetsLen = widgets? widgets.length: 0,
                /**
                 * 用于异步加载
                 */
                waiting = -1;

            /**
             * 创建场景容器
             */
            sceneEle = sceneContainer.find( '[data-scene=' + index + ']' );
            /**
             * 场景未创建
             */
            if( sceneEle.length === 0 ){
                /**
                 * 创建场景容器, 默认隐藏
                 */
                sceneEle = $( scene.content ).attr( 'data-scene', index );
                sceneContainer.append( sceneEle );
                scene.container = sceneEle;

                /**
                 * 创建场景元素
                 */
                for( ii = 0; ii < widgetsLen; ii++ ){
                    /**
                     * 元素为函数，用户自己添加入 widgetContainer
                     */
                    if( Util.isFunction( widgets[ ii ].content ) ){
                        if( waiting < 0 ){
                            waiting = 1;
                        }
                        else{
                            waiting ++;
                        }
                        widgets[ ii ].content.call( scene, widgetContainer, function( ele ){
                            widgets[ ii ].content = ele;
                            waiting -=1;
                            /**
                             * 该元素已装载完成，但还有未装载的元素
                             */
                            if( ii < widgetsLen ){
                                waiting = -1;
                            }
                            else if( waiting === 0 ){
                                this.prepare &&  this.prepare( sceneContainer );
                                this.events && me._bindSceneEvents( sceneContainer, this );
                            }
                        } );
                    }
                    /**
                     * 元素为 字符串，直接添加入 DOM
                     */
                    else{
                        ele = $( widgets[ ii ].content );
                        widgetContainer.append( ele );
                        widgets[ ii ].content = ele;
                    }
                }

                if( waiting < 0 && scene.prepare ){
                    /**
                     * 自定义处理函数
                     */
                    scene.prepare &&scene.prepare( sceneContainer );
                    /**
                     * 添加事件
                     */
                    scene.events && this._bindSceneEvents( sceneContainer, scene );
                }
            }
        },
        /**
         * 到达最后
         */
        atEnd: function(){
            return ( this._sceneIndex === this._sceneCount - 1 ); 
        },
        /**
         * 到达最前
         */
        atStart: function(){
            return ( this._sceneIndex === 0 );
        },
        /**
         * 隐藏并删除相关DOM
         * @method  close
         */
        close: function(){
             this._switcher.flush();
            this.sigil( 'background' ).remove();
            this.sigil( 'foreground' ).remove();
             $(window).unbind( '.floatStage' );
             this._cache = {};
             this._stage = {};
             this._switcher.status = Switcher.Status.Idle;
        },
        /**
         * 隐藏
         */
        hide: function(){
            this.sigil( 'foreground' ).hide();
             this.sigil( 'background' ).hide();
        },
        /**
         * 显示
         */
        show: function( time ){
            this.sigil( 'foreground' ).fadeIn( time );
             this.sigil( 'background' ).show();
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
            return this.fire( type, {fromIndex: from, toIndex: to} );
        },
        /**
         * 是否正在转换中
         * @return {Boolean} [description]
         */
        isBusy: function(){
            return this._switcher.status === Switcher.Status.Busy;
        },
        /**
         * 切换到下一个场景
         * @method next
         */
        next: function(){
            this.to( this._sceneIndex + 1 );
        },
        /**
         * 切换到先一个场景
         * @method prev
         */
        prev: function(){
            this.to( this._sceneIndex - 1 );
        },
        /**
         * 场景切换，包含： (1)、构建DOM；(2)、调整场景内部位置；(3)、添加场景内事件；(4)、检测切换方式；(5)、切换场景
         * @method to
         * @param  {int} index 场景编号
         */
        to: function( index ){
            if( this.isBusy() ){
                return;
            }
            var scene = this._stage.scenes[ index ];
            /**
             * 无效场景
             */
            if( !scene ){
                return;
            }
            /**
             * 调整舞台
             */
            if( Util.isFunction( scene.stage ) ){
                scene.stage.call( null, this.sigil( 'foreground' ), this.sigil( 'background' ) );
            }
            /**
             * 创建 场景相关DOM，并绑定相关事件
             */
            this._prepareScene( scene, this._stage.widgets[ index ], index );

            /**
             * 新场景 调整
             */
            if( index >= 0 && scene.container ){
                scene.ready();
            }

            /**
             * 切换 场景
             */
            this._dispatch( 'beforeswitch', this._sceneIndex, index );
            this._switcher.start({
                ctx: this,
                scenes: this._stage.scenes,
                widgets: this._stage.widgets,
                from: this._sceneIndex,
                to: index
            } );

            this._sceneIndex = index;
        },
        /**
         * 用于缓存、获取舞台上的元素
         * @param  {string} name    名称
         * @param  {jqObject} element 对应的元素
         */
        sigil: function( name, element ){
            /**
             * 添加缓存
             */
            if( element && element.length > 0 ){
                this._cache[ name ] = element;
            }
            /**
             * 有缓存
             */
            else if( this._cache[ name ] ){
                return this._cache[ name ]; 
            }
            /**
             * 在容器中查找
             */
            else{
                var container = this.sigil( 'foreground' ),
                    ele = container.find( '[data-sigil="'+name+'"]' );
                if( ele && ele.length > 0 ){
                    this._cache[ name ] = ele;
                }
                return ele;
            }
        }
    } );


    Util.mix( Switcher.prototype, {
        aniQueue:{},
        /**
         * 播放动画
         */
        start: function( data ){
            var fScene = data.scenes[ data.from ],
                tScene = data.scenes[ data.to ],
                aniData = [];
                this.ctx = data.ctx;

            /**
             * 为了保证连续性，对于滚动，操作其父元素；
             */
            if( tScene.switcher.swin.type[ 1 ] ===  Switcher.Type.VScroll ||
                tScene.switcher.swin.type[ 1 ] ===  Switcher.Type.HScroll ){

                var parent = tScene.container.parent(),
                    ppos = parent.position(),
                    toTop = ppos.top,
                    toLeft = ppos.left,
                    step = 0;

                if( !this.ppos ){
                    this.ppos = ppos;
                    this.sceneSize = {
                        width: tScene.container.width(),
                        height: tScene.container.height()
                    };
                }
                /**
                 * 滚动后位置
                 */
                if( tScene.switcher.swin.type[ 1 ] ===  Switcher.Type.HScroll ){
                    if( data.to === 0 ){
                        toLeft = 0;
                    }
                    else{
                        toLeft =  this.ppos.left - data.to * this.sceneSize.width;
                    }
                }
                else{
                    toTop =  this.ppos.top -  data.to * this.sceneSize.height;
                }
                /**
                 * 父容器动画参数
                 */
                aniData.push( {content: parent, switcher:{
                    type: [ Switcher.Type.Show, tScene.switcher.swin.type[ 1 ] ],
                    pos: [ [ ppos.left , ppos.top], [ toLeft, toTop ] ],
                    time: [ 0, tScene.switcher.swin.time[ 1 ] ],
                    delay: [ 0, tScene.switcher.swin.delay[ 1 ]  ],
                    group: tScene.switcher.swin.group 
                }} );
                /**
                 * 旧场景 widgets 动画
                 */
                if( fScene ) {
                    Util.forEach(  data.widgets[ data.from ] , function( item, key ){
                        if( item.switcher.swout.type[ 1 ] ===  Switcher.Type.VScroll ||
                            item.switcher.swout.type[ 1 ] ===  Switcher.Type.HScroll ){
                            if( data.to < data.from ){
                                item.switcher.swout.pos = item.switcher.swout.posH || item.switcher.swout.pos;
                            }
                            else{
                                item.switcher.swout.pos = item.switcher.swout.posL ||item.switcher.swout.pos;
                            }
                        }
                        aniData.push( {
                            content:item.content,
                            switcher:item.switcher.swout
                        });
                    });
                }
                /**
                 * 新场景 widgets 动画
                 */
                Util.forEach(  data.widgets[ data.to ] , function( item, key ){
                    aniData.push( {
                        content:item.content,
                        switcher:item.switcher.swin
                    });
                });

                this.animate( aniData, data.from, data.to );
            }
            else if( tScene.switcher.swin.type[ 1 ] ===  Switcher.Type.FadeIn ){
                /**
                 * 换出场景
                 */
                if( fScene ) {
                    Util.forEach(  data.widgets[ data.from ] , function( item, key ){
                        aniData.push( {
                            content:item.content,
                            switcher:item.switcher.swout
                        });
                    });
                    if( data.from !== data.to ){
                        aniData.push( {content:fScene.container,switcher: fScene.switcher.swout} );
                    }
                }
                /**
                 * 换入场景
                 */
                if( data.from !== data.to ){
                    aniData.push( {content:tScene.container,switcher: tScene.switcher.swin} );
                }
                Util.forEach(  data.widgets[ data.to ] , function( item, key ){
                    aniData.push( {
                        content:item.content,
                        switcher:item.switcher.swin
                    });
                });

                this.animate( aniData, data.from, data.to );
            }
        },
        /**
         * 播放动画
         */
        animate: function( data, from, to  ){
            this.groupAnimation( data, from, to );
        },
        /**
         * 将元素的动画放入 队列中 等待
         */
        queueAnimation: function( ele, options ){
            var len = options.type.length,
                config = {
                    type: options.type.slice(),
                    pos: ( options.pos || [] ).slice(),
                    time: ( options.time || [] ).slice(),
                    delay: ( options.delay || [] ).slice(),
                    group: options.group
                },
                me = this;
            
            /**
             * 处理元素各个阶段的动画
             */
            while( len-- ){
                ele.queue('custom', function( next ){
                    var type = config.type.shift(),
                    pos = config.pos.shift() || [0,0],
                    time = config.time.shift()|| 10,
                    delay = config.delay.shift() || 0;

                    /**
                     * 初始化元素的显示
                     */
                    if( type === Switcher.Type.Show ){
                        /**
                         * 元素动画初始新位置，没有表示位置不变
                         */
                        if( pos.length ){
                            ele.css({ 'left': pos[0], 'top':pos[1] });
                        }
                        ele.delay( delay ).fadeIn(time,function(){
                            if( $( this ).queue( 'fx' ).length === 1 ){
                                me.ctx.fire( 'ani:over', options.group );
                            }
                        });
                    }
                    else if( type === Switcher.Type.Hide ){
                        if( pos.length ){
                            ele.css({ 'left': pos[0], 'top':pos[1] });
                        }
                        ele.delay( delay ).fadeOut(time,function(){
                            if( $( this ).queue( 'fx' ).length === 1 ){
                                me.ctx.fire( 'ani:over', options.group );
                            }
                        });
                    }
                    /**
                     * 淡入动画
                     */
                    else if( type ===  Switcher.Type.FadeIn ){
                        ele.delay( delay ).fadeIn( time , function(){
                            if( $( this ).queue( 'fx' ).length === 1 ){
                                me.ctx.fire( 'ani:over', options.group );
                            }
                        });
                    }
                    /**
                     * 淡出动画
                     */
                    else if( type ===  Switcher.Type.FadeOut ){
                        ele.delay( delay ).fadeOut( time, function(){
                            if( $( this ).queue( 'fx' ).length === 1 ){
                                me.ctx.fire( 'ani:over', options.group );
                            }
                        });
                    }
                    /**
                     * 滚动动画
                     */
                    else if( type === Switcher.Type.HScroll || type === Switcher.Type.VScroll){
                        ele.delay( delay ).animate( {left: pos[0], top: pos[1]},time, function(){
                            if( $( this ).queue( 'fx' ).length === 1 ){
                                me.ctx.fire( 'ani:over', options.group );
                            }
                        } ); 
                    }
                    
                    next();
                });/*queue*/
            }/*while*/
            /**
             * 附带了动画的元素及其分组
             */
            return {
                ele: ele,
                group: options.group
            };
        },
        /**
         * 将元素按动画播放阶段分组，并开始播放动画
         */
        groupAnimation: function( components, from, to ){
            var me = this,
                aniQueue = {},
                groupCount = 0,
                startedGroup = [];

            me.aniQueue = {};
            /**
             * 处理元素动画，将动画放入队列
             */
            Util.forEach( components, function( item, key ){
                var eleAni = me.queueAnimation( item.content, item.switcher );
                me.aniQueue[ eleAni.group ] = me.aniQueue[ eleAni.group ] || [];
                me.aniQueue[ eleAni.group ].push( eleAni );
            } );

            var groups = Util.keys( me.aniQueue ).sort(),
                gStart = groups[ 0 ];
            me.aniQueue.count = groups.length;
            /**
             * 前一组动画结束，开始下一组动画
             */
            this.ctx.un( 'ani:over' );
            this.ctx.on( 'ani:over', function( group ){
                group = group>>0;
                /**
                 * 防止重复开始
                 */
                if( startedGroup.indexOf(group ) >= 0 ){
                    return;
                }
                startedGroup.push( group );

                delete me.aniQueue[ group ];
                /**
                 * 开始新一组的动画
                 */
                Util.forEach( me.aniQueue[ ++group ], function( item ){
                    item.ele.dequeue( 'custom' );
                } ) ;

                if( --me.aniQueue.count === 0 ){
                    me.status = Switcher.Status.Idle;
                    me.ctx._dispatch( 'afterswitch' , from, to);
                }

            } );
            /**
             * 开始播放动画
             */
            Util.forEach( me.aniQueue[ gStart ], function( item ){
                item.ele.dequeue( 'custom' );
                me.status = Switcher.Status.Busy;
            } ) ;
            clearTimeout( this.idleTimer );
            this.idleTimer = window.setTimeout( function(){ 
                    me.status = Switcher.Status.Idle;
                 }, 3000 );
        },
        /**
         * 清除动画
         */
        flush: function(){
            var me = this;
            this.ctx.un( 'ani:over' );
            clearTimeout( this.idleTimer );
            Util.forEach( me.aniQueue, function( group ){
                Util.forEach( group, function( item ){
                    item.ele.stop();
                } ) ;
            } ) ;

            this.status = Switcher.Status.Idle;
        }
    } );

    FloatStage.Switcher = Switcher;

    return FloatStage;
} );

