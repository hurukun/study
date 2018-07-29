var Template = require('./template').class;
/**
 * Controller 基类
 * @param req
 * @param res
 */

exports.class = function(req, res) {
    this._req = req, this._res = res;
};
exports.class.prototype = {
    _template: new Template(),
    vendor: function( page, assign) {
        this._res.writeHead(200, {'Content-Type': Config.mimes['html']});
        //找到view文件
        var file = require('path').join(TEMPLATE_PATH, page + '.html'); //一定是html结尾
        this._res.write(this._template.parse(file, assign));
        this._res.end();
    }
};