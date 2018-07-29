/* 引入基础库文件, 需要 jQuery 支持 */
/*
 * 基础工具函数
 * hurukun@126.com
 */
var GD = {};

(function(Framework) {
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
     *             工具寒素相关             *
     **************************************/
    var Util = {};
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

})(GD);

module.exports = GD.Util;