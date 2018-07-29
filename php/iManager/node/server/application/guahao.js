var url = require('url'),
    http = require('http'),
    querystring = require('querystring'),
    Proxy = require( './proxy' ).class;

var g_urls = {
    index: 'http://www.bjguahao.gov.cn/comm/index.html',
    departments: 'http://www.bjguahao.gov.cn/comm/yyks.php',
    monthlyDetail: 'http://www.bjguahao.gov.cn/comm/content.php',
    dailyDetail: 'http://www.bjguahao.gov.cn/comm/ghao.php',
    bookForm: 'http://www.bjguahao.gov.cn/comm/guahao.php'
}

exports.class = function() {
    Render.apply(this, arguments); //[Required]
    this.host = 'www.bjguahao.gov.cn';
    this.proxy = new Proxy(this._req, this._res);
    this.parser = new WebParser( this._req, this._res );
};

exports.class.prototype = {
    /**
     * 渲染输出 登录页面
     */
    login : function( ){
        this.vendor('guahao/login', {msg: '<h1>Hello World!</h1>', global:'bd-style'});
    },
    /**
     * dispatch reqest based on the method
     */
    index: function(){
        var urlObject = url.parse( this._req.url ),
            queryObject = querystring.parse( urlObject.query ),
            options = {};

        if( queryObject.url ){
            options = url.parse( queryObject.url ); 
        }
        else if( queryObject.path ){
            options = {
                host: this.host,
                path:  queryObject.path
            }
        }
        if( this._req.method === 'GET' ){ 
            if( !options.host ){
                this.hospitals();
            }
            else{
                this.proxy.get( options );
            }
        }
        else if( this._req.method === 'POST' ){
            this.proxy.post( options );
        }
    },
    /**
     * 医院列表
     */
    hospitals: function(){
        var me = this;

        this.parser.index( function( lists){
            var html = '<div id="hostpital_list">';
            for( var id in lists ){
                var length = lists[ id ][ 'hospital' ].length;
                html += ['<dl id="district_',id,'">'].join('');
                html += [ '<dt>',lists[ id ]['title'],'</dt>' ].join('');
                for( var ii  = 0; ii < length; ii++ ){
                    var href = lists[ id ][ 'hospital' ][ ii ][ 'href' ].replace( /\.php/, '' );
                    html += ['<dd><a href="/guahao/',href,'">',lists[ id ][ 'hospital' ][ ii ]['title'],'</a></dd>'].join('')
                }
                html +='</dl>';
            }
            html +='</div>';
            me.vendor('guahao/hospital', {content: html});
        });
    },
    /**
     * 科室列表请求
     */
    yyks: function(){
        var me = this;

        this.parser.departments( function( lists ){
            var html = '<div id="department_list">';
            for( var id in lists ){
                var length = lists[ id ][ 'department' ].length;
                html += ['<dl id="department_',id,'">'].join('');
                html += [ '<dt>',lists[ id ]['title'],'</dt>' ].join('');
                for( var ii  = 0; ii < length; ii++ ){
                    var href = lists[ id ][ 'department' ][ ii ][ 'href' ].replace( /content\.php/, 'monthlyDetail' );
                    html += ['<dd><a href="/guahao/',href,'">',lists[ id ][ 'department' ][ ii ]['title'],'</a></dd>'].join('')
                }
                html +='</dl>';
            }
            html +='</div>';

            me.vendor('guahao/departments', {content: html});
        } );
    },
    /**
     * 一月科室可预约信息请求
     */
    monthlyDetail: function(){
        var me = this;
        this.parser.monthlyDetail( function( html ){
            var html = html.replace( /ghao\.php/ig, 'dailyDetail' );
            me.vendor( 'guahao/monthlyDetail', {content: html} );
        } );
    },
    /**
     * 一日科室可预约信息请求
     */
    dailyDetail: function(){
        var me = this;
        this.parser.dailyDetail( function( html ){
            var html = html.replace( /guahao\.php/ig, 'bookForm' );
            me.vendor( 'guahao/dailyDetail', {content: html} );
        } );
    },
    /**
     * 渲染输出 预约单
     */
    bookForm: function(){
        var me = this;
        this.parser.bookForm( function( html ){
            me.vendor( 'guahao/bookForm', {content: html} );
        } );
    },
    /**
     * 渲染输出 成功预约单
     */
    sucBookForm: function(){

    }
    
};

//继承自Controller基类
iUtil.inherit(exports.class, Render); //[Required]

/**
 * 网页解析
 */
var iconv = require('iconv-lite'),
    Iconv = require('iconv').Iconv,
    BufferHelper = require( 'bufferhelper' ),
    cheerio = require('cheerio' );

var WebParser = function( req, res ){
    this._req = req; this._res = res;
};

WebParser.prototype = {
    /**
     * 获取页面
     */
    getPage: function( options ){
        var opt = {}, me = this;

        if( options.url ){
            opt = url.parse( options.url );
            opt.headers = options.headers || {};
            opt.headers[ 'Cookie' ] = this._req.headers[ 'cookie' ];
        }

        var request = http.get(opt, function(res) {
            var buffers = [], size = 0;
            res.on('data', function(buffer) {
                buffers.push(buffer);
                size += buffer.length;
            });

            res.on('end', function() {
                var buffer = new Buffer(size), pos = 0;
                for(var i = 0, l = buffers.length; i < l; i++) {
                    buffers[i].copy(buffer, pos);
                    pos += buffers[i].length;
                }
                // 'content-type': 'text/html;charset=gbk'
                if( options.encoding === 'GBK' ){
                    var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
                    var utf8_buffer = gbk_to_utf8_iconv.convert(buffer);
                }

                var html = utf8_buffer.toString();

                if( /请先登录/.test( html ) ){
                    me._res.writeHead( 302, {
                        Location: '/guahao/login'
                    } );
                    me._res.end();
                }
                else if( options.callback ){
                    options.callback( html );
                }
                
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    },
    /**
     * 解析首页, 返回 hospital 列表
     */
    index: function(vendor ){
        this.getPage( {
            url : g_urls.index,
            encoding: 'GBK',
            callback: function( html ){
                $ = cheerio.load( html );
                var directory = {};

                var district = $( '#produce21  .lmmenu li' );
                district.each( function(){
                    var id = this.attr( 'id' ).replace( /[^0-9]/ig, '' );
                    directory[ id ] = {
                        title: this.text()
                    }
                } );

                var hospitals = $('#produce21 .lm_content');
                hospitals.each( function(){
                    var id = this.attr( 'id' ).replace( /[^0-9]/ig, '' );
                    directory[ id ][ 'hospital' ] = [];
                    this.find( 'li a' ).each( function(){
                        directory[ id ][ 'hospital' ].push( { title: this.attr( 'title' ) , href: this.attr( 'href' ) } );
                    } );
                } );

                vendor.call( null, directory );
            }
        } );
    },
    /**
     * 一个医院所有科室信息
     */
    departments: function(vendor){
        var urlObject = url.parse( this._req.url );
            
        this.getPage( {
            url : g_urls.departments + '?' + urlObject.query,
            encoding: 'GBK',
            callback: function( html ){
                $ = cheerio.load( html );
                var directory = {},
                    id= 0;

                var departments = $( '.yyksbox' );
                departments.each( function(id){
                    var title = this.find( '.yyksdl' ).text();
                    directory[ id ] = {
                        title: title
                    }

                    directory[ id ][ 'department' ] = [];
                    this.find( 'li a' ).each( function(){
                            directory[ id ][ 'department' ].push( { title: this.text() , href: this.attr( 'href' ) } );
                    } );
                } );

                vendor.call( null, directory );
            }
        } );
    },
    /**
     * 一个科室信息
     */
    monthlyDetail: function( vendor){
        var urlObject = url.parse( this._req.url );

        this.getPage( {
            url : g_urls.monthlyDetail + '?' + urlObject.query,
            encoding: 'GBK',
            callback: function( html ){
                $ = cheerio.load( html );
                var directory = {},
                    id= 0;

                var calendar = $( '.detail' );

                calendar.children( 'table:nth-child(1)' ).remove();

                vendor.call( null, calendar.html() );
            }
        } );
    },
    /**
     * 一日 科室信息
     */
    dailyDetail: function( vendor ){
        var urlObject = url.parse( this._req.url );
        this.getPage( {
            url : g_urls.dailyDetail + '?' + urlObject.query,
            encoding: 'GBK',
            callback: function( html ){
                $ = cheerio.load( html );
                var directory = {},
                    id= 0;

                var detail = $( 'table:nth-child(2)' );
                console.log( detail );
                vendor.call( null, '<table>' + detail.html() + '</table>' );
            }
        } );
    },
    /**
     * 填写预约单
     */
    bookForm: function( vendor ){
        var urlObject = url.parse( this._req.url );
        this.getPage( {
            url : g_urls.bookForm + '?' + urlObject.query,
            encoding: 'GBK',
            callback: function( html ){
                $ = cheerio.load( html );
                var directory = {},
                    id= 0;

                var detail = $( '.listbox' );
                console.log( detail );
                vendor.call( null, '<div>' + detail.html() + '</div>' );
            }
        } );
    }
};