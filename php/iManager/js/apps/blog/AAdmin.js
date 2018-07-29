/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * 管理页 js
 */
GD.App('apps/blog/AAdmin', ['apps/blog/Publisher']).define(function(require) {
    var $ = require('jQuery'),
        Util = require('Util'),
        Env = require('Env'),
        Publisher = require('apps/blog/Publisher');

    return {
        api: {
            aj_article: Util.parseAPI( '/blog/ajax/aj_article.php' )
        },
        main: function() {
            this._bindEvents();

            new Publisher({
                container: $(document.body),
                title: '#com_edt_tit',
                content: '#com_edt_cnt',
                appendix: '#com_edt_apd',
                keyword: '#com_edt_keyword',
                submit: '#com_edt_submit',
                url: this.api.aj_article
            });
        },
        _bindEvents: function() {

        }
    };

});