/**
 * index Controller类
 */

exports.class = function() {
    Render.apply(this, arguments); //[Required]
};
exports.class.prototype = {
    index: function() {
        this.vendor('index', {msg: '<h1>Hello World!</h1>', kmy:'dynamic'});
    }
};
//继承自Controller基类
iUtil.inherit(exports.class, Render); //[Required]