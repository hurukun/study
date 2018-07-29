/* 引入基础库文件, 需要 jQuery 支持 */
/*
 * 基础工具函数
 * hurukun@126.com
 */
( function( Global ){
    var SDFW = {
        'name'  : 'GD'
    };

    (function(Framework) {

        Framework.Env = {
            SCRIPT_HOST: document.location.href.match(/^[^\/]*?\/\/[^\/]*?\//)[0] + 'js/',
            IP: '192.168.5.54',
            HOST: 'localhost'
        };

        var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

        var slice           = ArrayProto.slice,
            hasOwnProperty  = ObjProto.hasOwnProperty;

        // ECMAScript 5 原生方法
        var
            nativeForEach       = ArrayProto.forEach,
            nativeMap           = ArrayProto.map,
            nativeReduce        = ArrayProto.reduce,
            nativeReduceRight   = ArrayProto.reduceRight,
            nativeFilter        = ArrayProto.filter,
            nativeEvery         = ArrayProto.every,
            nativeSome          = ArrayProto.some,
            nativeIndexOf       = ArrayProto.indexOf,
            nativeLastIndexOf   = ArrayProto.lastIndexOf;

        if(!Array.indexOf) {
            Array.prototype.indexOf = function(obj) {
                for(var i = 0; i < this.length; i++) {
                    if(this[i] == obj) {
                        return i;
                    }
                }
                return -1;
            }
        }

        if(!Date.now) {
            Date.now = function() {
                return(new Date()).getTime();
            }
        }
        /**************************************
         *             工具函数相关             *
         **************************************/
        var Util = {
            /**
             * 获取 Cookie
             */
            getCookie: function(name){
                var arg = name + "=",
                    alen = arg.length,
                    valArray = document.cookie.split( '; ' ),
                    i = 0;
                for(  i = 0; i < valArray.length; i++ ){
                    if( valArray[ i ].substring( 0, alen ) === arg ){
                        return valArray[ i ].substring( alen );
                    }
                }
                return "";
            },
            /**
             * 设置 Cookie
             */
            setCookie: function(name, value, expires, path, domain, secure){
                document.cookie = name + "=" + escape(value) +
                    ((expires) ? ";expires=" + expires : "") +
                    ((path) ? ";path=" + path : "") +
                    ((domain) ? ";domain=" + domain : "") +
                    ((secure) ? ";secure" : "");
            },
            /**
             * 登录
             */
            login: function( loginData, callback ){
                Util.ajax( {
                        url: Util.parseAPI( '/interface/auth/aj_login.php' ),
                        type: 'POST',
                        dataType: 'json',
                        data: loginData,
                        success: function( resp ){
                            if( resp.suc ){
                                Util.setCookie( '_user', loginData.account, 3600 , '/' );
                                Util.setCookie( '_uid', resp.data.uid,3600 , '/'  );
                                Util.setCookie( '_auth', resp.data.auth,3600 , '/'  );
                                if( callback ){
                                    callback.call();
                                }
                            }
                            else{
                                window.MessageBox.alert( resp.msg );
                            }
                        }
                    } );
            },
            /**
             * 退出登录
             */
             logout: function( callback ){
                var me = this,
                    loData = {};
                Util.ajax( {
                    url: Util.parseAPI( '/interface/auth/aj_logout.php' ),
                    type: 'POST',
                    dataType: 'json',
                    data: loData,
                    success: function( resp ){
                        if( resp.suc ){
                            if( callback ){
                                callback.call();
                            }
                            Util.setCookie( '_auth', '',3600 , '/'  );
                        }
                    }
                });
            },
            getUserInfo: function(){
                return {
                    uid: this.getCookie( '_uid' ),
                    login: this.getCookie( '_auth' ) ? true: false
                }
            },
            parseAPI: function( url ){
                return '/php' + url;
            }
        };
        /*
         * 遍历一个对象 或 数组
         */
        Util.foreach = Util.each = Util.forEach = function(obj, func, context) {
            if(!obj) {
                return;
            }
            //原生方法
            if(obj.foreach) {
                obj.foreach(func, context);
            }
            //数组
            else if(typeof obj.length === "number") {
                for(var ii = 0; ii < obj.length; ii++) {
                    if(func.call(context, obj[ii], ii) === false) {
                        return;
                    }
                }
            }
            //对象
            else {
                for(var key in obj) {
                    if(Object.prototype.hasOwnProperty.call(obj, key)) {
                        if(func.call(context, obj[key], key) === false) {
                            return;
                        }
                    }
                }
            }
        }
        /*
         * 向对象中附加字段；
         */
        Util.mix = function(obj, append) {
            if(!append) {
                return obj;
            }
            if(!obj) {
                if(typeof append.length === "number") {
                    obj = [];
                } else {
                    obj = {};
                }
            }

            Util.foreach(append, function(value, iter) {
                obj[iter] = value;
            });

            return obj;
        } /*工具函数*/
        Util.mix(Util, {
            log: function(msg) {
                if(console && console.log) {
                    console.log(msg);
                } else {
                    alert(msg);
                }
            },
            /**
             * 自定义的 通知框，带自消失功能；
             * options.msg { string } 显示的消息
             * options.time{ int } 显示的时间 单位：ms
             */
            alert: function(options) {
                alert(options.msg);
            },
            browser: function() {

            }
        });

        /*工具函数*/
        Util.mix(Util, {
            bind : function(func, context) {
                var extraArgs = Array.prototype.slice.call(arguments, 2);
                return function() {
                    context = context || (this == K.global ? false : this);
                    var args = extraArgs.concat(Array.prototype.slice.call(arguments));
                    if (typeof(func) == "string" && context[func]) {
                        context[func].apply(context, args);
                    } else if ( Util.isFunction(func)) {
                        return func.apply(context, args);
                    } else {
                        Util.log("not function", func);
                    }
                };
            },
            clone : function(obj) {
                return Util.isArray(obj) ? obj.slice() : Util.mix({}, obj);
            },
            map : function(obj, iterator, context) {
                var results = [];
                if (obj == null) {
                    return results;
                }
                if (nativeMap && obj.map === nativeMap) {
                    return obj.map(iterator, context);
                }
                Util.forEach(obj, function(value, index, list) {
                  results[results.length] = iterator.call(context, value, index, list);
                });
                return results;
            },
            keys: function(obj) {
                if(obj !== Object(obj)) {
                    throw new TypeError('Invalid object');
                }
                var keys = [];
                for(var key in obj) if(Object.prototype.hasOwnProperty.call(obj, key)) {
                    keys[keys.length] = key;
                }
                return keys;
            },
            isPlainObject: function(obj) {

            },
            isArray: function(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            },

            isFunction: function(obj) {
                return !!(obj && obj.constructor && obj.call && obj.apply);
            },
            isString: function(obj) {
                return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
            },
            isNumber: function(obj) {
                return !!(obj === 0 || (obj && obj.toExponential && obj.toFixed));
            },
            isNull: function( obj ){
                return !obj;
            },
            isUndefined: function(obj) {
                return obj === void 0;
            },
            isNaN: function(obj) {
                return obj !== obj;
            },
            //使数组中的元素 唯一化
            unique: function(obj) {
                var res = [];
                Util.foreach(obj, function(item) {
                    if(res.indexOf(item) === -1) {
                        res.push(item);
                    }
                })

                return(obj = res);
            },
            //去除 obj 中与base内相同的子项
            diff: function(base, obj) {
                var res = null;
                if(!base) {
                    return obj;
                }
                if(!obj) {
                    return obj;
                }

                //数组
                if(Util.isNumber(obj.length)) {
                    res = [];
                    Util.foreach(obj, function(item, key) {
                        if(base.indexOf(item) == -1) {
                            res.push(item);
                        }
                    })
                }
                //对象
                else {
                    var keys = Util.keys(base),
                        res = {};
                    Util.foreach(obj, function(item, key) {
                        if(keys.indexOf(key) === -1) {
                            res[key] = item;
                        }
                    })
                }

                return(obj = res);
            }

        });

        Framework.Util = Util;

    })(SDFW);

    /*
     * 自定义消息
     */

    (function(Framework, Util) {
        var Events = function() {
                //存储自定义消息的栈
                this.__msgStack__ = {};
            };

        Util.mix(Events.prototype, {
            //注册自定义消息
            on: function(signal, callback) {
                //check parameter
                if(!Util.isString(signal) || !Util.isFunction(callback)) {
                    return;
                }
                var namespace = null,
                    sig = signal;
                signal.replace(/(.*)\.(.*)/, function() {
                    sig = arguments[1];
                    namespace = arguments[2];
                });

                namespace = namespace ? namespace : '__default__';

                this.__msgStack__ = this.__msgStack__ ? this.__msgStack__ : {};

                this.__msgStack__[namespace] = this.__msgStack__[namespace] || {};
                this.__msgStack__[namespace][sig] = this.__msgStack__[namespace][sig] || [];
                this.__msgStack__[namespace][sig].push(callback);
            },
            //register a message that can be triggered for once;
            once: function(signal, callback) {
                var me = this,
                    func = function() {
                        callback.call(null, arguments[0]);
                        me.un(signal, func);
                    };
                this.on(signal, func);
            },
            //删除自定义消息
            un: function(signal, callback) {
                if(!Util.isString(signal)) {
                    signal = '';
                }
                var namespace = null,
                    sig = signal;
                signal.replace(/(.*)\.(.*)/, function() {
                    sig = arguments[1];
                    namespace = arguments[2];
                });

                namespace = namespace ? namespace : '__default__';

                this.__msgStack__ = this.__msgStack__ ? this.__msgStack__ : {};

                //指定了特定命名控件
                //未指定了特定消息
                if(!this.__msgStack__[namespace]) {
                    return;
                }
                if(sig === '') {
                    delete this.__msgStack__[namespace];
                    return;
                }
                if(!this.__msgStack__[namespace][sig]) {
                    return;
                }
                //未指定了特定函数
                if(!Util.isFunction(callback)) {
                    delete this.__msgStack__[namespace][sig];
                }
                //指定了特定消息 特定函数
                else {
                    this.__msgStack__[namespace][sig].splice(this.__msgStack__[namespace][sig].indexOf(callback), 1);
                }
            },
            //触发自定义消息
            fire: function(signal) {
                if(!Util.isString(signal)) {
                    signal = '';
                }
                var namespace = null,
                    sig = signal,
                    data = arguments[1];
                signal.replace(/(.*)\.(.*)/, function() {
                    sig = arguments[1];
                    namespace = arguments[2];
                });

                namespace = namespace ? namespace : '__default__';
                this.__msgStack__ = this.__msgStack__ ? this.__msgStack__ : {};

                if(!this.__msgStack__[namespace] || !this.__msgStack__[namespace][sig]) {
                    return;
                }

                Util.foreach(this.__msgStack__[namespace][sig], function(item, key) {
                    item.call(null, data);
                })
            }
        });

        Framework.Events = Events;
        //全局消息
        Framework.GEvent = new Events();

    })(SDFW, SDFW.Util);

    /**
     * 封装 ajax 请求，作一些统一的处理；
     */
    (function(Util, Event) {
        Util.ajax = function(options) {
            return $.ajax({
                url: options.url,
                type: options.type ? options.type : 'POST',
                dataType: options.dataType ? options.dataType : 'json',
                data: options.data,
                success: function(resp) {
                    if( resp.suc === false ){
                        if( resp.errno === 1001 ){
                            window.alert( 'need login' );
                        }
                    }
                    if(Util.isFunction(options.success)) {
                        options.success.call(this, resp);
                    }
                },
                error: function(xhr, status, error) {
                    if(Util.isFunction(options.error)) {
                        options.error.call(this, [xhr, status, error]);
                    }
                },
                complete: function(xhr, status, responseText) {
                    if(status == 0 && responseText == '') {
                        Event.fire('error:network');
                    }
                    if(Util.isFunction(options.complete)) {
                        options.complete.call(this, [xhr, status, responseText]);
                    }

                }
            });
        }
    })(SDFW.Util, SDFW.GEvent);

    /**
     * JS自定义模块 加载
     * @module states
     *                      defined
     *  被依赖     ->  文件被加载   ->  依赖未被加载      ->  迭代加载依赖   ->
     *                                          defined , __module__.defined
     *                          依赖被加载完毕 ->  模块被定义   ->  依赖全被装载 -> 调用 callback
     * @advantage:
     *  以callback 函数为核心，加载依赖；简洁，过程清晰，无视循环依赖；
     * @disadvantage:
     *  调用时才加载所有 模块，会形成明显的加载高峰；
     *  @think
     *      预加载
     */

    /**
        @Usage:
        define( 'moduleName', [ dependency_modules ] , function( require, exports, mod ){
            var requireModule = require( 'moduleName' );
            
            var module = ...;

            return module;
        });
     */
    /**
     * 自动加载器
     */
    (function(Framework, Util, Event) {
        var Cache = {
            __cache: {},
            __autoID: 0,
            add: function(){}
        };
        var Loader = function(){
        };
        Util.mix( Loader, {
            load: function( files, callback ){
                var me = this;
                Util.forEach( files, function( item ){
                    var url = me._makeupUrl( item );
                    if( /\.js$/.text( item ) ){
                        me._loadJS( url );
                    }
                    else if( /\.css$/.text( item )  ){
                        me._loadCSS( url );
                    }
                } );
            },
            _loadJS: function( url, callback ){
                var script = document.createElement('script');
                    script.setAttribute('type', 'text/javascript');
                    script.setAttribute('src', url );
                    script.onload = function(){
                        callback.call();
                    }
                    var headSec = document.getElementsByTagName('head')[0];
                    headSec.appendChild(script);
            },
            _loadCSS: function( url ){
                var style = document.createElement('link');
                    style.setAttribute('rel', 'stylesheet');
                    style.setAttribute('type', 'text/css');
                    style.setAttribute('src', url );
                    var headSec = document.getElementsByTagName('head')[0];
                    headSec.appendChild(style);
            },
            _makeupUrl: function( url ){
                if( ! /^http:\/\//.text( url ) ){
                    url = Framework.Env.SCRIPT_HOST + name;
                }
                if( !/\.js$/.text( item ) && !/\.css$/.text( url ) ){
                    url += '.js';
                }
                return url;
            }
        } );

        Framework.Require = new Loader();

    })(SDFW, SDFW.Util, SDFW.GEvent);

    /**
     * 自定义模块
     */
    (function(Framework, Util, Event) {
        //waiting module pool
        var waitList = [],
            // module pool
            defined = {};

        var Module = function(name, depends, factory) {
                //in case of reloading the same app;
                if(defined[name]) {
                    throw new Error('Module:' + name + 'has been defined!');
                }
                this.name = name;
                this.depends = depends;
                this.factory = factory;
            };

        Util.mix(Module, {
            /*
             * @param{string}   name
             * @param{array}    depends
             * @param{object}   factory
             */
            define: function(name, depends, factory) {
                //record modules that have been defined.
                defined[name] = new Module(name, depends, factory);

                Util.mix(waitList, depends);

                Event.fire('__' + name + '__.defined', {
                    name: name
                });
            },
            //load a module
            _load: function(name, host) {
                var me = this;

                if(defined[name]) {
                    return;
                } else {
                    if(!host) {
                        host = Framework.Env.SCRIPT_HOST;
                    }
                    var script = document.createElement('script');
                    script.setAttribute('type', 'text/javascript');
                    script.setAttribute('src', host + name + '.js');
                    var headSec = document.getElementsByTagName('head')[0];
                    headSec.appendChild(script);
                }
            },
            //wait modules to be loaded
            wait: function(name, modules, callback, context) {
                modules = this.getUndefinedModule(modules);

                if(modules.length > 0) {
                    //load depends modules and call callback
                    this.fetchDepends(modules, callback, context);
                } else {
                    callback.call(context);
                }
            },
            //diff with module pool to get undefined modules;
            getUndefinedModule: function(modules) {
                return Util.diff(Util.keys(defined), modules);
            },
            //iteratelly load depends modules and call callback；
            fetchDepends: function(depends, callback, context) {
                //differ with modules in the pool to identity undefined modules;
                depends = this.getUndefinedModule(depends);
                var dependsCount = depends.length,
                    me = this,
                    item = null;
                //all modules needed by the callback are loaded;
                if(dependsCount === 0) {
                    callback.call(context);
                    return;
                }
                while(item = depends.shift()) {
                    // a module is loaded;
                    Event.once('__' + item + '__.defined', function(data) {
                        --dependsCount;
                        var newDep = (defined[data.name] || 0).depends;
                        if(newDep) {
                            newDep = me.getUndefinedModule(newDep);
                            //the loaded module depends on some other modules that need to be loaded;
                            if(newDep.length > 0) {
                                dependsCount += newDep.length;
                                me.fetchDepends(newDep, function() {
                                    dependsCount -= newDep.length;
                                    if(dependsCount === 0) {
                                        callback.call(context);
                                    }
                                });
                            }
                        }
                        //all necessary modules for the callback have been loaded
                        if(dependsCount === 0) {
                            callback.call(context);
                        }
                    });
                    //load a module
                    Module._load(item);
                }
            },
            //function used to get the defination of a spacified module
            require: function(name, callback, context) {
                if(defined[name]) {
                    Module.createRequire(defined[name]);
                    return defined[name].exports;
                } else {
                    Util.log('module ' + name + ' is undefined;');
                    return null;
                }
            },

            createRequire: function(mod) {
                var factory = mod.factory,
                    ret;

                if(mod.exports) {
                    return mod.exports;
                } else if(Util.isFunction(factory)) {
                    ret = factory.call(null, Module.require, mod.exports, mod)
                    if(ret) {
                        mod.exports = ret;
                    }
                } else {
                    mod.exports = factory;
                }
                //module 独立的自定义消息
                if(Util.isFunction(mod.exports) && !('on' in mod.exports.prototype)) {
                    Util.mix(mod.exports.prototype, Framework.Events.prototype);
                }
                delete mod.factory;
            },

            log: function(type) {
                if(type === 'loaded') {
                    Util.log(defined);
                }
            }
        });

        Framework.Module = function() {
            return Module
        };

        Global.define = function() {
            Module.define(arguments[0], arguments[1], arguments[2]);
        }

    })(SDFW, SDFW.Util, SDFW.GEvent);

    /**
     * 预定义的 模块
     */
    define('jQuery', [], function() {
        return Global.$;
    });
    define('Util', [], function() {
        return SDFW.Util;
    });
    define('Framework', [], function() {
        return SDFW;
    });
    define('Events', [], function() {
        return SDFW.Events;
    });
    define('GEvent', [], function() {
        return SDFW.GEvent;
    });
    define('Env', [], function() {
        return SDFW.Env;
    });
    /**
     * 浏览器环境 相关
     */
    define('Browser', [], function() {
        var Browser = {};
        return Browser;
    });
    /**
     * DOM操作相关
     */
    define('GDOM', [], function() {
        var DOM = {
            /**
             * 创建一个空的iframe
             * @param  {object} opts 相关初始化参数
             *                      width:
             *                      height:
             *                      domain:
             *                      title:
             *                      editable:
             *                      classes:
             *                      container:
             *                      
             */
            buildPlainIframe: function( opts ){
                var iframe,
                callback = opts.callback,
                    me = this,
                    tempDiv,
                    ieScript = '',
                    ie = $.browser.msie,
                    sizeStr = 'width:'+ opts.width +';height:' + opts.height;

                var openDesignMode =  function( doc ) {
                    if ( $.browser.msie ) {
                        doc.body.contentEditable = true;
                    } else if ( $.browser.webkit ) {
                        doc.body.parentNode.contentEditable = true;
                    } else {
                        doc.designMode = 'on';
                    }
                }
                
                DOM.fnIframeDocInit = function( opts  ){
                    var doc = iframe.contentWindow.document,
                        csses = '',
                        javascripts = '',
                        ii=0;

                    doc.open('text/html', 'replace');
                    doc.domain = opts.domain || document.domain;

                    if( opts.csses ){
                        for( ii = 0; ii < opts.csses.length; ii++){
                            csses +='<link type="text/css" rel="stylesheet" media="screen" href="'+opts.csses[ii]+'" /> ';
                        }
                    }
                    if( opts.javascripts ){
                        for( ii = 0; ii < opts.javascripts.length; ii++){
                            javascripts +='<script type="text/javascript" src="'+opts.javascripts[ii]+'" /> ';
                        }
                    }

                    doc.write( [
                        '<html> ',
                            '<head>  ',
                                '<title>',opts.title,'</title> ',
                                csses,
                                javascripts,
                            '</head> ',
                            '<body></body> ',
                        '</html> ',
                    ].join('') );

                    doc.close();
                    
                    // 文档已完毕
                    if( opts.editable ){
                        openDesignMode( doc );
                    }
                    if( callback ){
                        callback.call( this, {iframe:iframe});
                    }
                };

                
                var iframeOpts = {
                        domain: opts.domain,
                        csses: opts.csses,
                        javascript:opts.javascripts,
                        title: opts.title,
                        editable: opts.editable
                    },
                    srcScript =  encodeURIComponent(
                                    'document.open();document.domain="' + (opts.domain||document.domain ) + '";' +
                                    'parent.'+SDFW.name+'.DOM.fnIframeDocInit('+JSON.stringify(iframeOpts)+');document.close();'
                                );
                
                tempDiv = document.createElement( 'div' );
                tempDiv.innerHTML = [
                    '<iframe class="',opts.classes,'" frameborder="0" style="' , sizeStr , 
                        '" src="' ,  'javascript:void( function(){  ' , srcScript  , '}() )' ,
                    '"></iframe>'].join('');

                iframe = tempDiv.getElementsByTagName( 'iframe' )[ 0 ];
                ( opts.container || $(document.body) ).append( iframe );
                tempDiv = null;
                
                // firefox 缓存动态iframe内容bug
                if ( $.browser.mozilla ) {
                    iframe.contentWindow.location.replace( iframe.src );
                }
                return iframe;
            }
        };

        SDFW.DOM = DOM;
        return DOM;
    });

    define( 'GRange', [], function( require){
        var $ = require( 'jQuery' ),
            Util = reuquire( 'Util' );

        var Range = function( win ){
            this.win = win;
        }

        Util.mix( Range.prototype, {
            focusWindow: function(){
                this.getWindow().focus();
            },
            getWindow: function(){
                return this.win;
            },
            getDocument: function(){
                return this.win.document;
            },
            /**
             * 当前选中区域
             */
            getSelection: function(){
                var w = this.getWindow(),
                    doc = w.document;

                if ( w.getSelection ) {
                    return w.getSelection();    
                } else if ( doc.selection ) {
                    return doc.selection;   
                }

                return null;
            },
            /**
             * 当前range
             */
            getRanges: function() {
                var selection = this.getSelection();
                if ( selection ) {
                    if ( selection.getRangeAt ) {
                        var ranges = [];
                        for ( var i = 0, len = selection.rangeCount; i < len; i++ ) {
                            ranges.push( selection.getRangeAt( i ) );   
                        }
                        return ranges;  
                    } else {
                        //var range = this.getDocument().body.createTextRange();//selection.createRange();
                        var range = this.getDocument().selection.createRange();
                        return [ range ];       
                    }
                }

                return null;
            },
            /**
             * 当前选中的文本内容
             */
            getRangeText: function(){
                var ranges = this.getRanges(),
                    range = ranges[ 0 ],
                    text = '';
                // 获取选中的文字
                if ( $.browser.msie ) {
                    range = this.getCacheRange() || ranges[ 0 ];
                    if( !range || !range.text ){
                        text = '';
                    }
                    else{
                        text = $.trim( range.text );
                    }
                } else {
                    if( !range ){
                        text = '';
                    }
                    else{
                        text = $.trim( range.toString() );
                    }
                }
                return text;
            },
            insertHtml: function( html ){
                var doc = this.getDocument();

                this.focusWindow();

                if ( !$.browser.msie ) {
                    doc.execCommand( 'insertHtml', false, html );
                } else {
                    var sel = this.getSelection();
                    
                    if ( sel.type == 'Control' ) {
                        sel.clear();
                    }
                    //range 丢失
                    if( !range ) {
                                    range = this.editor.dom.getRanges();
                                    if( !range || range.length === 0 ){
                                        return;
                                    }
                                    range = range[0];
                                }
                    // IE9 
                    if ( range.insertNode ) {
                        var el = doc.createElement("div");
                        el.innerHTML = html;
                        var frag = doc.createDocumentFragment(), node, lastNode;
                        while ( (node = el.firstChild) ) {
                            lastNode = frag.appendChild(node);
                        }
                        range.insertNode(frag);

                        // Preserve the selection
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            range.collapse(true);
                           sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                    //for IE6-IE8
                    else{
                        if(!range || range && !range.pasteHTML) {
                                        range = sel.createRange();
                                    }

                        range.pasteHTML( html );

                        range.select();
                    }
                }
            },
            /**
             * 选中一个节点
             */
            selectNode: function( domNode, isMulti ){
                var pindex = 0,
                    selection = this.getSelection(),
                    range = this.getRanges();

                if( !domNode || !range ){
                    return;
                }
                range = range[0];

                if ( $.browser.msie ) {
                    if( selection.type === 'Control'){
                        range.clear();
                        range = this.getDocument().body.createTextRange();
                    }

                    range.moveToElementText( domNode );
                    range.select();

                }
                else{
                    for (var i=0; i < domNode.parentNode.childNodes.length; i++) {
                        if ( domNode.parentNode.childNodes[i] == domNode ) {
                            pindex = i;
                            break;
                        }
                    }
                    
                    range.setStart( domNode.parentNode, pindex );
                    range.setEnd( domNode.parentNode, pindex + 1 );
                    /**
                     * 允许多选区
                     */
                    if(  !isMulti ){
                        selection.removeAllRanges();
                    }
                    /**
                     * 添加range至选中区域
                     */
                    selection.addRange( range );
                }
            },
            /**
             * 获得缓存的range
             */
            getCacheRange : function(){
                return this.cacheRange || null;
            },
            /**
             * 缓存range
             */
            saveCacheRange : function( range ){
                this.cacheRange = range;
            }
        });

        return Range;
    } );
    

    /*app管理*/
    /**
        @Usage:
        SDFW.App( 'appName', [ dependency_modules ] ).define(function( require ){
            var module = require( 'moduleName' );

            return {
                container: 'jQuery selector',
                events:{
                    'eventType jQuery_selector', 'handleFunctionName',
                    ...
                },
                main: function(){
                    //your logical code goes here;
                },
                handleFunction: function( evt ){
                    evt.preventDefault();//if needed;
                    evt.stopPropagation();//if needed;
                    return false;//if needed;
                }
            }
        });
    **/
    (function(Framework, Util, Module) {
        //record loaded app
        var appList = {};

        var App = function(name, depends) {
                //in case of reloading the same app;
                if(appList[name]) {
                    throw new Error('APP:' + name + 'has been defined!');
                }
                this.appName = name;
                appList[name] = true;

                this._requireModule = ['jQuery'];
                if(depends) {
                    this._requireModule = ['jQuery'].concat(depends);
                    this._requireModule = Util.unique(this._requireModule);
                }
            };

        Util.mix(App.prototype, {
            /*
             * @param{string}   name
             * @param{array}    depends
             * @param{object}   app
             */
            define: function(app) {
                var me = this;
                Module.wait(this.appName, this._requireModule, function() {
                    if(Util.isFunction(app)) {
                        app = app.call(this, Module.require);
                    }
                    app.toString = function(){
                        return me.appName;
                    }
                    var $ = Module.require('jQuery');
                    if(!$) {
                        Util.log('jQuery is not defined.');
                    }
                    //检查 app 容器
                    if( App.parseContainer(app, $) === false) {
                        Util.log(me.appName + ': Invalid container');
                        return;
                    }
                    //检查 app 事件
                    if( App.parseEvents(app) === false) {
                        Util.log(me.appName + ': Invalid container');
                        return;
                    }
                    //app 独立的自定义消息
                    Util.mix(app, Framework.Events.prototype);
                    //运行 app
                    App.start(app);

                })
            }
        });
        Util.mix( App, {
            //app 容器
            parseContainer: function(app, $) {
                if(app.container) {
                    app.container = $(app.container);
                    if(app.container.length === 0) {
                        return false;
                    }
                } else {
                    app.container = $(document.body);
                }
                return true;
            },
            //app 绑定于容器的消息
            parseEvents: function(app) {
                var me = this;
                if(!app.container || app.container.length === 0) {
                    return false;
                }
                if(app.events) {
                    Util.forEach(app.events, function(item, key) {
                        if(!Util.isString(item)) {
                            return;
                        }
                        key.replace(/([^\s]+)\s*(.*)/, function(match) {
                            if(!match) {
                                Util.log(app.toString() + ': invalid event--' + key);
                                return '';
                            } else if(arguments[1] && arguments[2]) {
                                app.container.delegate(arguments[2], arguments[1], function(evt) {
                                    if(app[item]) {
                                        return app[item].call(app, evt);
                                    }
                                });
                            } else {
                                app.container.bind(arguments[1], function(evt) {
                                    if(app[item]) {
                                        return app[item].call(app, evt);
                                    }
                                });
                            }
                        })

                    })
                }
                return true;
            },
            // 初始化后 运行 app.main();
            start: function(app) {
                if(Util.isFunction(app.main)) {
                    app.main.call(app);
                }
            }
        } )

        Framework.App = function(name, depends) {
            if(appList[name]) {
                Util.log('APP:' + name + 'has been defined!');
                return {
                    define: function() {}
                };
            } else {
                return new App(name, depends);
            }
        };

    })(SDFW, SDFW.Util, SDFW.Module());
    /**
     * 独立页面: 一个页面，只有一个 page 定义
     */
    (function( Framework, Util, Module ){
        var pageList = {};
        var Pager = function(name, depends) {
                //in case of reloading the same app;
                if(pageList[name]) {
                    throw new Error('APP:' + name + 'has been defined!');
                }
                this.pageName = name;
                pageList[name] = this;

                this._requireModule = ['jQuery'];
                if(depends) {
                    this._requireModule = ['jQuery'].concat(depends);
                    this._requireModule = Util.unique(this._requireModule);
                }
            };

        Util.mix( Pager.prototype, {
            define: function( app ){
                var me = this;
                Module.wait(this.appName, this._requireModule, function() {
                    if(Util.isFunction(app)) {
                        app = app.call(this, Module.require);
                    }
                    //app 独立的自定义消息
                    Util.mix(app, Framework.Events.prototype);
                    me.app = app;
                });
            }
        } );

        Util.mix( Pager, {
            changePage: function( toPage, option ){
                var instPage = pageList[ toPage ];
                if( !instPage ){
                    return false;
                }

                var $ = Module.require('jQuery');
                //检查 app 容器
                if( Pager.parseContainer(app, $) === false) {
                    Util.log(me.appName + ': Invalid container');
                    return;
                }
                //检查 app 事件
                if( Pager.parseEvents(app) === false) {
                    Util.log(me.appName + ': Invalid container');
                    return;
                }
                
                //运行 app
                Pager.start(app);
            },
             //app 容器
            parseContainer: function(app, $) {
                if(app.container) {
                    app.container = $(app.container);
                    if(app.container.length === 0) {
                        return false;
                    }
                } else {
                    app.container = $(document.body);
                }
                return true;
            },
            //app 绑定于容器的消息
            parseEvents: function(app) {
                var me = this;
                if(!app.container || app.container.length === 0) {
                    return false;
                }
                app.container.undelegate();
                app.container.unbind();
                if(app.events) {
                    Util.forEach(app.events, function(item, key) {
                        if(!Util.isString(item)) {
                            return;
                        }
                        key.replace(/([^\s]+)\s*(.*)/, function(match) {
                            if(!match) {
                                Util.log(app.toString() + ': invalid event--' + key);
                                return '';
                            } else if(arguments[1] && arguments[2]) {
                                app.container.delegate(arguments[2], arguments[1], function(evt) {
                                    if(app[item]) {
                                        return app[item].call(app, evt);
                                    }
                                });
                            } else {
                                app.container.bind(arguments[1], function(evt) {
                                    if(app[item]) {
                                        return app[item].call(app, evt);
                                    }
                                });
                            }
                        })

                    })
                }
                return true;
            },
            // 初始化后 运行 app.main();
            start: function(app) {
                if(Util.isFunction(app.main)) {
                    app.main.call(app);
                }
            }
        } );

        Framework.Pager = function(name, depends) {
            if(appList[name]) {
                Util.log('Pager:' + name + 'has been defined!');
                return {
                    define: function() {}
                };
            } else {
                return new Pager(name, depends);
            }
        };
    })( SDFW, SDFW.Util, SDFW.Module() )

    Global[ SDFW.name ] = SDFW 
})( window );

(function() {
    $(document).ready(function() {
     //    $( document.body ).css( 'background', 'url("/css/img/bg.jpg") center top no-repeat fixed' );
    });
})();