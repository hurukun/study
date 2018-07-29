/*global K:false,Kx:false,define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/

/**
 * 名片基础模块，提供以下基础功能：
 *     1、触发显示；
 *     2、自动隐藏；
 *     3、默认定位；
 *     4、基础数据获取；
 */

/**
 * @usage:
 *     GD.App( '', [ 'apps/common/usercard/CardFactory' ] ).define( function( require ){
 *         var CardFactory = require( 'apps/common/usercard/CardFactory' );
 *         return {
 *             main: function(){
 *                 var factory = CardFactory.get();
 *
 *                 factory.bindCard( 'a.usercard' );
 *                 factory.on( 'card_build', function( data ){
 *                     var card = data.card,
 *                      card.delegate( 'button', 'click', function( evt ){
 *                      } );
 *                 } );
 *             }
 *         };
 *     } );
 */

define( 'core/card/CardFactory', [ 'jQuery' ], function( require ) {
    var $ = require( 'jQuery' ),
        Util  = require( 'Util' );
    /**
     * 名片基类
     */
    var Card = function( data ){
        this.data = data
        this.init();
    };
    
    Util.mix( Card.prototype, {
        /**
         * 初始化
         */
        init: function(){
            /**
             * 名片内容
             */
            this.container = $( this.data.outer );
            this.wrapper = this.container.find( '[data-sigil="wrapper"]' );
            this.wrapper.append(  this.data.inner );
            this.data.container.append( this.container );
            /**
             * 自动隐藏
             */
            this.autoHide = true;
            /**
             * 预设名片位置
             */
            this.presetPosition();
            this.bindEvents();
        },
        /**
         * 名片公共事件
         */
        bindEvents: function(){
            var me = this;
            /**
             * 自动隐藏
             */
            this.container.bind( 'mouseleave', function(){
                if( me.autoHide ){
                    me.close();
                }
            } );
        },
        /**
         * Card 的默认出现位置
         */
        presetPosition: function(){
            var trigger = this.data.trigger,
                offset = trigger.offset();

            this.wrapper.css( {
                left: offset.left + 'px',
                top: offset.top + 'px'
            } );
        },
        /**
         * 修正名片位置不被窗口遮挡
         */
        hotfixPosition: function(){

        },
        /**
         * 显示Card
         */
        show: function(){
            this.container.show();
        },
        /**
         * 隐藏并删除Card
         */
        close: function(){
            this.container.remove();
        },
        /**
         * 获得Card对应DOM
         */
        getPanel: function(){
            return this.container;
        },
        /**
         * 代理事件
         */
        delegate: function( sel, event, handler ){
            if( this.container ){
                this.container.delegate( sel, event, function( evt ){
                    handler.call( null, evt );
                } );
            } 
        },
        /**
         * 去除事件代理
         */
        undelegate: function( nm ){
            if( this.container ){
                this.cotainer.undelegate( nm );
            } 
        }
    } );

    /**
     * Card 相关模板，【 必须有 data-sigil="wrapper"】
     * @type {Object}
     */
    var CardTmpl = {
        'default' : [
            '<div id="kx_card" style="display: none;">',
                '<div class="usercard" data-sigil="wrapper" style="position: absolute;"></div>',
            '</div>'
        ].join('')
    };

    /**
     * Card 建造的工厂类
     *     1、名片触发绑定；
     *     2、名片数据的获取与管理；
     *  @param {object} options 工厂参数，参考Factory._defaultConfig
     */
    var Factory = function( options ){
        $.extend( this, options );
        this.init();
    };

    /**
     * 类方法： 包含工厂和数据的管理，两者皆为全局数据
     */
    Util.mix( Factory, {
        /**
         * 工厂的缓存
         * @type {Object}
         */
        _factoryClub: {},
        /**
         * 缓存卡片数据
         * @type {Object}
         */
        _cardCache: {},
        /**
         * 默认参数
         * @type {Object}
         */
        _defaultConfig: {
            /**
             * 工厂唯一标识
             * @type {String}
             */
            id: 'usercard',
            /**
             * 工厂对应的相关元素、事件对应的DOM容器
             * @type {[type]}
             */
            container: $( document.body ),
            /**
             * 触发显示 Card 的元素选择器
             * @type {String}
             */
            selTrigger: '[data-card="true"]', 
            /**
             * 触发显示 Card 的事件
             * @type {String}
             */
            evtShow: 'mouseenter',
            /**
             * 获取 Card 相关数据的接口
             * @type {String}
             */
            url: '/interface/usercard.php',
            /**
             * Card容器模板
             */
            tmpl: CardTmpl[ 'default' ],
            /**
             * Card数据是否缓存
             * @type {Boolean}
             */
            cache: true
        },
        /**
         * 创建一个工厂
         * @param {Object} options 工厂相关参数，参考Factory._defaultConfig
         */
        _build: function( options ){
            /**
             * 创建工厂
             * @type {Factory}
             */
            var factory = new Factory( $.extend( Factory._defaultConfig, options  ));
            /**
             * 缓存工厂
             */
            Factory._factoryClub[ factory.id ] = factory;

            return factory;
        },
        /**
         * 获取或创建一个工厂
         * @param {Object} options 工厂相关参数，参考Factory._defaultConfig
         */
        get: function( options ){
            /**
             * 参数有效性
             */
            options = options || {};
            options.id = options.id || Factory._defaultConfig.id;
            /**
             * 获取工厂实例
             */
            if( Factory._factoryClub[ options.id ]  ){
                return Factory._factoryClub[ options.id ];
            }
            else{
                return Factory._build( options );
            }
        },
        /**
         * 缓存数据
         * @param  {string} nm   工厂id
         * @param  {string} uid  用户id
         * @param  {Object} data 缓存数据
         */
        cache: function(nm, uid, data){
            /**
             * 有效性
             */
            Factory._cardCache[ nm ] =  Factory._cardCache[ nm ] || {};
            /**
             * 存数据
             */
             Factory._cardCache[ nm ][ uid ] = data;
        },
        /**
         * 获得缓存数据
         */
        getCache: function( nm, uid){
            /**
             * 有效性
             */
            Factory._cardCache[ nm ] =  Factory._cardCache[ nm ] || {};
            /**
             * 取数据
             */
            return Factory._cardCache[ nm ][ uid ];
        },
        /**
         * 清除缓存数据
         */
        flushCache: function( nm, uid){
            if( !nm ){
                Factory._cardCache = {};
            }
            else if( Factory._cardCache[ nm ] && ! uid ){
                Factory._cardCache[ nm ] = {};
            }
            else if( Factory._cardCache[ nm ] && Factory._cardCache[ nm ][ uid ]  ){
                Factory._cardCache[ nm ][uid] = {}; 
            }
        }
    } );

    Util.mix( Factory.prototype, {
        /**
         * 初始化
         */
        init: function(){
 //           Util.mix( this, new K.Pubsub() );
        },
        /**
         * 创建一个 Card 实例
         */
        bindCard: function( selTrigger, evtShow, container ){
            var me  = this;
            /**
             * 触发显示 Card
             */
            this.container.delegate( selTrigger || this.selTrigger, evtShow|| this.evtShow, function( evt ){
                var trigger = $( evt.currentTarget );
                if( ! me.validCardTrigger( trigger ) ){
                    return;
                }
                var uid = trigger.data( 'uid' ), 
                    data = Factory.getCache( me.id, uid );

                if( data ){
                    me.buildCard( data, trigger, container );
                }
                else{
                    $.ajax( {
                        url: me.url,
                        data: {
                            uid: uid
                        },
                        type: 'POST',
                        dataType: 'JSON',
                        success: function( resp ){
                            /**
                             * 数据缓存
                             */
                            if( me.cache ){
                                Factory.cache( me.id, uid, resp.data );
                            }
                            /**
                             * 创建并显示 Card
                             */
                            me.buildCard( resp.data, trigger, container );
                        }
                    } );
                }
            } );
        },
        /**
         * 创建并显示 Card
         * @param  {Object} data Card相关数据
         */
        buildCard: function( data, trigger, container ){
            var cardData = {
                container: container || $( document.body ),
                trigger: trigger,
                outer: this.tmpl,
                inner: data.html
            };
            var card = new Card( cardData );

            this.fire( 'card_build', { card: card });
            card.show();
        },
        /**
         * 判断是否显示 Card
         */
        validCardTrigger: function( jqTrigger ){
            var uid = jqTrigger.data( 'uid' );

            if( !uid ){
                return false;
            }

            return true;
        }
    } );

    return Factory;
});