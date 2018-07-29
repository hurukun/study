/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * 发布组件相关
 */
define('apps/blog/Publisher', ['jQuery', 'common/RichEditor'], function(require) {
    var $ = require('jQuery'),
        Env = require('Env'),
        Util = require('Util'),
        RichEditor = require('common/RichEditor');
    /**
     * options.container{ jq_object|jq_sel } 发布框容器
     * options.title    { jq_object|jq_sel } 标题
     * options.toolbar  { jq_object|jq_sel } 工具栏
     * options.content  { jq_object|jq_sel } 内容
     * options.appendix { jq_object|jq_sel } 附加内容
     * options.submit   ( jq_object|jq_sel ) 提交按钮
     * options.url      { string } 发送请求的链接
     * options.fnSubmit { function } 自定义 递交函数
     * options.fnParseData { function } 自定义 数据处理函数
     */
    var Publisher = function(options) {
            this.api  = {
                aj_keyword: Util.parseAPI( '/blog/ajax/aj_keyword.php' )
            };
            /**
             * 初始化 相关参数
             */
            this._container = Util.isString(options.container) ? $(options.container) : options.container;
            this._title = Util.isString(options.title) ? $(options.title) : options.title;
            this._toolbar = Util.isString(options.toolbar) ? $(options.toolbar) : options.toolbar;
            this._content = Util.isString(options.content) ? $(options.content) : options.content;
            this._appendix = Util.isString(options.appendix) ? $(options.appendix) : options.appendix;
            this._keyword = Util.isString(options.keyword) ? $(options.keyword) : options.keyword;
            this._btnSubmit = Util.isString(options.submit) ? $(options.submit) : options.submit;
            this._url = options.url;
            /**
             * 额外可选参数
             */
            // 自定义 递交函数
            this._optSubmit = Util.isFunction(options.fnSubmit) ? options.fnSubmit : null;
            //自定义 获取附加递交参数的函数（ 递交请求中除 title 和 content 以外的字段数据 ）
            this._optParseClasses = Util.isFunction(options.fnParseData) ? options.fnParseData : null;

            this._init();
        };

    Util.mix(Publisher.prototype, {
        _init: function() {
            if( this._container.length === 0 ){
                return;
            }
            var editorContainer = this._container.find('div.js_rich_editor'),
                editorConentEle =  this._container.find( 'div[data-type="comEdtContent"]' );
            if(  editorContainer.length === 0 ){
                return;
            }
            this._editor = new RichEditor({
                container: editorContainer,
                toolbar: {
                    bold: true,
                    italic: true,
                    underline: true,
                    backcolor: true,
                    forecolor: true,
                    fontsize: true,
                    fontface: true,
                    link: true,
                    unlink: true,
                    indent: true,
                    undent: true,
                    ul: true,
                    ol: true,
                    hn: true,
                    jl: true,
                    jc: true,
                    jr: true,
                    redo: true,
                    undo: true,
                    rf: true
                },
                content: editorConentEle.html()
            });
            editorConentEle.remove();
            
            this._bindEvents();
        },
        /**
         * 处理相关消息
         */
        _bindEvents: function() {
            var me = this;
            if(this._btnSubmit) {
                this._btnSubmit.bind('click', $.proxy(this._submit, this));
            }
            //选择 关键字
            if(this._appendix) {
                this._appendix.delegate('dd:has(input[type="checkbox"])', 'click', function(evt) {
                    var target = $(evt.currentTarget).find('input[type="checkbox"]');

                    if(evt.target.tagName !== 'INPUT') {
                        target[0].check = !target[0].check;
                        target[0].checked = !target[0].checked;
                    }

                    me._checkKeywords(target);
                });
            }
            //添加新关键字
            this._container.delegate('[data-type="newClass"]', 'click', function(evt) {
                me._createKeyword($(evt.currentTarget));
            });
        },
        /**
         * 选择 关键字
         */
        _checkKeywords: function(target) {
            var root = target.closest('dl'),
                cbox = null;
            /**
             * 选中 一个关键字
             */
            if(target[0].checked) {
                cbox = root.find('dt input[type="checkbox"]');
                if(cbox[0].checked === false) {
                    cbox[0].checked = true;
                }
            } else {}
        },
        /**
         * 提交内容
         */
        _submit: function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if(Util.isFunction(this._optSubmit)) {
                this._optSubmit.call(this, evt);
            } else {
                this._defaultSubmit(evt);
            }

            return false;
        },
        /**
         * 默认 递交函数
         */
        _defaultSubmit: function(evt) {
            var title = this._title.val(),
                content = this._editor.getContent(),
                appendix = this._optParseClasses ? this._optParseClasses() : this.defaultClasses(),
                keywords = this._optParseKeywords ? this._optParseKeywords() : this.defaultKeywords(),
                me = this;

            if(!title || !content) {
                alert( 'Man, title or content can not be empty!' )
                return;
            }

            Util.ajax({
                url: this._url,
                type: 'post',
                dataType: 'json',
                data: {
                    act: 'w',
                    id: $(evt.currentTarget).data('id'),
                    title: title,
                    content: content,
                    appendix: appendix,
                    keyword: keywords
                },
                success: function(resp) {
                    //发表成功，删除发表内容；
                    if(resp.suc === true) {
                        me._title.val('');
                        me._editor.empty();
                        me._keyword.val('');
                        $('input:checked', me._appendix).each(function(ii, item) {
                            item.checked = false;
                            item.check = false;
                        });

                        Util.alert({
                            msg: 'Work is done',
                            time: 6000
                        });
                    }
                },
                error: function(xhr, status) {

                },
                complete: function(xhr) {

                }
            });
        },
        /**
         * 默认 从html中 获取请求总额外数据的函数；默认为keyword列表；
         */
        defaultClasses: function() {
            //无效附加信息区
            if(!this._appendix || this._appendix.length === 0) {
                return '';
            }

            var keywords = $('input:checked', this._appendix),
                val = '';

            keywords.each(function(ii, item) {
                val += $(item).data('tid') + ',';
            });
            return val.substr(0, val.length - 1);
        },
        /**
         * 默认 处理 关键字
         */
        defaultKeywords: function(){
            if( !this._keyword || this._keyword.length === 0 ){
                return '';
            }

            return this._keyword.val();
        },
        /**
         * 创建新的关键字
         */
        _createKeyword: function(target) {
            var keyword = window.prompt('请输入新关键字');
            if(!keyword) {
                return;
            }

            var parent = target.closest('[data-kid]'),
                siblings = null,
                kid = 0,
                ckid = 0,
                key = 0;
            //添加顶级的 keyword
            if(parent.length == 0) {
                siblings = this._container.find('[data-kid]');
                siblings.each(function(ii, item) {
                    kid = $(item).data('kid');
                    if(kid > key) {
                        key = kid;
                    }
                });

                key++;
            }
            //添加 次级的 keyword
            else {
                siblings = parent.find('[data-kid]');
                siblings.each(function(ii, item) {
                    kid = $(item).attr('data-kid');
                    kid = kid.split('@');
                    if(kid.length <= 1) {
                        ckid = 0;
                    } else {
                        ckid = parseInt(kid.splice(-1)[0], 10);
                    }

                    if(ckid > key) {
                        key = ckid;
                    }
                });

                key = kid.join('@') + '@' + ++key;
            }

            Util.ajax({
                url: this.api.aj_keyword,
                type: 'post',
                dataType: 'JSON',
                data: {
                    act: 'add',
                    key: key,
                    content: keyword
                },
                success: function(resp) {
                    //添加成功，更新显示；
                    if(resp.suc === true) {

                    }
                },
                error: function(xhr, status) {

                },
                complete: function(xhr) {

                }
            });
        }

    });

    return Publisher;
});