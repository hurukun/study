/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title 擦除显示图像
 */
/**
 * 已知: 图像像素值组成的一维数组: ImageData = [ r,g,b,o,r,g,b,o,... ];
 * 方案(1):
 *     1. 初始化时创建节点金字塔结构,包含所有可能出现的节点;
 *         a). 最底层为半径为 r[0] = 2 的节点, 上层节点半径为下层节点半径的2倍 r[n] = 2* r[n-1];
 *         b). 上层节点颜色是下层颜色的平均值;
 *     2. document.body检测 mousemove事件,擦除当前层节点,显示相同位置的下层节点;
 *         a). 记录当前鼠标位置,计算当前坐标与前一次记录坐标的直线,并将直线分为 n 个点.
 *         b). 对于直线上相邻的两个点, 搜索金字塔中节点, 以两点中的终点对应金字塔最底层点, 再往上;
 *             1). 节点对应了DOM中的节点;
 *             2). 两点跨越节点边界;
 *             则用该节点的子节点替代该节点;( 动画: 每显示一个子节点,父节点透明度增加,直至消失; )
 *          c). 重复 a - b;
 *  方案(2):
 *      1. 初始化第一个节点: 
 *          n( x,y,r ) = ( size/2,size/2,size/2 ); 
 *          n(x,y,r).color = avg( n( 0,0, 2 ), n( 0, size-1, 2 ), n( size-1, 0, 2 ), n( size-1, size-1,2) );
 *      2. 检测节点的 mousemove 事件, 分裂元素;
 *          a). 对每个节点绑定事件, 记录需要处理的节点,并延时处理
 *          b). 在 document.body 上绑定事件,同上;
 *          c). 记录当前显示的所有节点, 使用方案(1)中步骤 2 ;
 *      3. 分裂元素:
 *          nchild( xc,yc,rc ) = nparent( xp - rc/2, yc - rc/2, rc/2);
 *          nchild( xc,yc,rc ) = avg( n( xc - rc, yc - rc, 2 ), n( xc + rc - 1, yc - rc, 2 ), n( xc - rc, yc - rc, 2 ), n( xc + rc - 1, yc + rc - 1, 2 ) );
 *
 * 注意事项:
 *     1. 一次鼠标滑动中, 重复触发分裂: 上层分裂后下层接着分裂; 
 */

GD.App( 'apps/tester/AScratchImage', ['base/swfobject'] ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' ),
        Event = require( 'Events' ),
        SWFObject = require( 'base/swfobject' ),
        MEvent = new Event();
    /**
     * SVG 元素相关的操作;
     * @class SVG
     */
    var SVG = {
        index: 1,
        namespaceURI: 'http://www.w3.org/2000/svg',
        createElement: function( tag ){
            var ele = document.createElementNS(this.namespaceURI, tag) ;
            ele._index = SVG.index++;
            return $( ele );
        },
        insert: function( nNode, oNode){
            oNode.parentNode.insertBefore( nNode, oNode );
        }
    };

    /**
     * 鼠标相关数据 处理类
     * @type {Object}
     */
    var Mouse = {
        /**
         * 计算 鼠标位置相对与容器的相对位置
         */
        relativePosition: function( baseXY , e) {
            return [e.pageX - baseXY.left, e.pageY - baseXY.top];
        },
        /**
         * 对鼠标经过的直线路径进行抽样
         * @param  {array} startPoint 数据路径起始点
         * @param  {array} endPoint   鼠标路径终点
         * @param  {int} maxLength  抽样点间间隔
         */
        traceMove: function(startPoint, endPoint, maxLength) {
            function intervalLength(startPoint, endPoint) {
                var dx = endPoint[0] - startPoint[0],
                    dy = endPoint[1] - startPoint[1];

                return Math.sqrt(dx * dx + dy * dy);
            }
            var breaks = [],
                length = intervalLength(startPoint, endPoint),
                numSplits = Math.max(Math.floor(length / maxLength), 1),
                dx = (endPoint[0] - startPoint[0]) / numSplits,
                dy = (endPoint[1] - startPoint[1]) / numSplits,
                startX = startPoint[0], 
                startY = startPoint[1];

            for(var i = 0; i <= numSplits; i++) {
                breaks.push([startX + dx * i, startY + dy * i]);
            }
            return breaks;
        }
    };

    /**
     * 颜色处理相关类
     * @class Color
     */
    var Color = function( r,g,b ){
        this.r = r;
        if( arguments.length === 3 ){
            this.g = g;
            this.b = b;
        }
    }
    Util.mix( Color.prototype, {
        /**
         * 转 16进程
         */
        toHex: function( val ){
            return val < 16 ? '0' + Math.max( 0, val ).toString( 16 ): Math.min( 255, val ).toString( 16 );
        },
        /**
         * 转为 16进制字符串
         */
        toString: function(){
            return Util.isUndefined( this.b ) ? '#' + this.r.toString( 16 ):'#' + this.toHex( this.r ) +  this.toHex( this.g ) + this.toHex( this.b );
        }
    } );

    var Canvas = function( width, height, img ){
        this.width = width;
        this.height = height;
        this.img = img;
    };

    Util.mix( Canvas.prototype, {
        /**
         * read image color data;   
         * @param  {string} img image source url
         */
        getImageData: function() {
            // Create a canvas for image data resizing and extraction
            var canvas = document.createElement('canvas').getContext('2d');
            // Draw the image into the corner, resizing it to dim x dim
            canvas.drawImage( this.img, 0, 0, this.width, this.height );
            // Extract the pixel data from the same area of canvas
            // Note: This call will throw a security exception if imageData
            // was loaded from a different domain than the script.
            return{
                step: 4,
                data: canvas.getImageData(0, 0, this.width, this.height).data
            };
        },
        /**
         * load image;
         */
        load: function(){
             MEvent.fire( 'image.load' );
        }
    } );

    var Flash = function( width, height, img ){
        this.width = width;
        this.height = height;
        this.img = img;
        this.bindEvent();
    };

    Util.mix( Flash.prototype, {
        bindEvent: function(){
            var me = this;
            GD.GEvent.on( 'dataReady', function(){
                MEvent.fire( 'image.load' );
            } );
        },
        /**
         * read image color data;   
         * @param  {string} img image source url
         */
        getImageData: function( ) {
            return {
                step: 1,
                data: document.getElementById( 'ImageLoader' ).getImageData()
            };
        },
        /**
         * laod image;
         */
        load: function(){
            var swfVersionStr = "11.1.0";
            // To use express install, set to playerProductInstall.swf, otherwise the empty string. 
            var xiSwfUrlStr = "playerProductInstall.swf";
            var flashvars = {};
            var params = {};
            params.quality = "high";
            params.bgcolor = "#ffffff";
            params.allowscriptaccess = "sameDomain";
            params.allowfullscreen = "true";
            params.FlashVars = 'img=' + this.img+'&xSample='+this.width+'&ySample='+this.height;
            var attributes = {};
            attributes.id = "ImageLoader";
            attributes.name = "ImageLoader";
            attributes.align = "middle";
            SWFObject.embedSWF(
                "/resource/flash/Railings.swf", "imageLoader", 
                "512px", "512px", 
                swfVersionStr, xiSwfUrlStr, 
                flashvars, params, attributes);
            // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
            swfobject.createCSS("#flashContent", "display:block;text-align:left;");

            // var html = [
            //     '<object type="application/x-shockwave-flash" id="ImageLoader" name="ImageLoader" align="middle" data="/resource/flash/ImageLoader.swf" width="100px" height="100px">',
            //         '<param name="quality" value="high">',
            //         '<param name="bgcolor" value="#ffffff">',
            //         '<param name="allowscriptaccess" value="sameDomain">',
            //         '<param name="allowfullscreen" value="true">',
            //         '<param name="FlashVars" value="img='+'http://192.168.10.33' + this.img+'&xSample='+this.width+'&ySample='+this.height+ '">',
            //         '<embed wmode="transparent" src="/resource/flash/imageLoader.swf" ',
            //             'FlashVars="img='+this.img+'&xSample='+this.width+'&ySample='+this.height+ '" ',
            //             'quality="high" width="100%" height="100%" ',
            //             'allowScriptAccess="sameDomain" ',
            //             'type="application/x-shockwave-flash" ',
            //             'pluginspage="http://www.macromedia.com/go/getflashplayer" />',
            //     '</object>'].join('');

            // $(document.body).append( html );
        }
    } );

    /**
     * 组成图像的基本形状类
     * @param {int} x        x坐标
     * @param {int} y        y坐标
     * @param {int} radius   半径
     * @param {[type]} railings [description]
     */
    var Circle = function( x, y, radius, color ){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.opacity = 0.68;
    }
    Util.mix( Circle, {
        /**
         * 获取像素平均值
         */
        avgColor : function( colorSource, x, y, radius ){

            var ll = colorSource.getColor(  x - radius, y - radius ),
                lr = colorSource.getColor( x + radius - 1, y - radius ),
                hl = colorSource.getColor( x - radius, y + radius - 1 ),
                hr = colorSource.getColor( x + radius - 1, y + radius - 1 );
            if( ll.length > 1 ){
                return new Color( 
                    Math.round( ( ll[0] + lr[0] + hl[0] + hr[0] )/4 ),
                    Math.round( ( ll[1] + lr[1] + hl[1] + hr[1] )/4 ),
                    Math.round( ( ll[2] + lr[2] + hl[2] + hr[2] )/4 )
                    );
            }
            else{
                return  new Color( Math.round( ( ll[0] + lr[0] + hl[0] + hr[0] )/4 ) );
            }   

        },
        /**
         * 根据低层节点,计算上层节点位置;
         * 设 lv 为层数[1,...], n 为 当层节点的 index[0,1,,,,], s 为当层节点半径;
         * c( lv, n ) = 2^( lv - 1) + 2*s( lv )*n = 2^( lv - 1) + 2^lv*n;
         * s( lv + 1 ) = 2* s( lv ) = 2^lv, s(1) = 1;
         * 设低层节点 (x[i],y[i]), 高层节点(x[i+1],y[i+1])
         * n = ceil( x[i]/s( i + 1 ) )
         * x[i+1] = 2^i + 2^( i + 1 ) * ( n - 1 );
         * 
         * @param  {int} x    低层节点 x 坐标;
         * @param  {int} y    低层节点 y 坐标;
         * @param  {int} step 高层坐标间步长;
         */
        getParentPos: function( x, y, step ){
            var d = Math.pow( 2, step ),
                nxp = Math.max( 0, Math.ceil( x / d ) - 1 ),
                nyp = Math.max( 0, Math.ceil( y / d ) - 1 ),
                xh = d/2 + d * nxp,
                yh = d/2 + d * nyp;

            return [ xh, yh];
        }
    } );

    Util.mix( Circle.prototype, {
        /**
         * get children circles;
         */
        split: function( colorSource ){
            var halfRadius = this.radius/2,
                centers = [
                    [ this.x -  halfRadius, this.y -  halfRadius ],
                    [ this.x + halfRadius, this.y -  halfRadius ],
                    [ this.x -  halfRadius, this.y + halfRadius ],
                    [ this.x + halfRadius, this.y + halfRadius ]
                ];

            return [
                new Circle( centers[0][0], centers[0][1],  halfRadius, Circle.avgColor( colorSource, centers[0][0],centers[0][1], halfRadius ) ),
                new Circle( centers[1][0], centers[1][1],  halfRadius, Circle.avgColor( colorSource, centers[1][0],centers[1][1], halfRadius ) ),
                new Circle( centers[2][0], centers[2][1],  halfRadius, Circle.avgColor( colorSource, centers[2][0],centers[2][1], halfRadius ) ),
                new Circle( centers[3][0], centers[3][1],  halfRadius, Circle.avgColor( colorSource, centers[3][0],centers[3][1], halfRadius ) )
            ];
        },
        /**
         * check if a line across the border of the circle
         * @param  {array} startPoint start point coordinate;
         * @param  {array} endPoint   end point coordinate;
         */
        checkIntersection: function(startPoint, endPoint, ampFactor) {
            ampFactor = ampFactor||1;
            var edx = this.x - Math.floor( endPoint[0]/ampFactor ), 
            edy = this.y - Math.floor(endPoint[1]/ampFactor ), 
            sdx = this.x - Math.floor(startPoint[0]/ampFactor ), 
            sdy = this.y - Math.floor(startPoint[1]/ampFactor ), 
            r2 = this.radius;
            
            r2 = r2 * r2; // Radius squared

            // End point is inside the circle and start point is outside
            return edx * edx + edy * edy <= r2 && sdx * sdx + sdy * sdy > r2;
        },
        /**
         * 创建圆节点
         * @param  {int} ampFactor 放大因子
         */
        createElement: function( ampFactor ){
            ampFactor = ampFactor || 1;
            return SVG.createElement( 'circle' ).
                    attr( 'cx', this.x * ampFactor ).
                    attr( 'cy', this.y * ampFactor ).
                    attr( 'r', this.radius * ampFactor ).
                    attr( 'fill', this.color.toString( ) ).
                    attr( 'fill-opacity', this.opacity );
        }
    } );

    var ImageLoader = function( domImg, width, height ){
        this.domImg = domImg;
        this.width = width;
        this.height = height;
        this.imgData = {};
        this.loader  = null;
        this.bindEvent();
    }
    Util.mix( ImageLoader.prototype, {
        bindEvent: function(){
            var me =  this;
            MEvent.on( 'image.load', function(){
                me.imgData = me.loader.getImageData();
                me.loader = null;
                MEvent.fire( 'imageData.load' );
            } );
        },
        /**
         * load image and get image pixel information;
         * @param  {string} type method to load image;
         */
        load: function( ){
             this.loader = new Canvas( this.width, this.height, this.domImg);
            this.loader.load();
        },
        /**
         * 查询颜色表,获取颜色
         * @param  {int} x    x坐标
         * @param  {int} y    y坐标
         */
        getColor: function( x, y ){
            var index = ( y * this.width  + x ) * this.imgData.step;

            if( this.imgData.step > 1 ){
                return [ this.imgData.data[ index ], this.imgData.data[ index + 1 ], this.imgData.data[ index + 2 ] ];
            }
            else{
                return [ this.imgData.data[ index ] ];
            }
        }
    } );

    var Railings = function( container, img ){
        this.container = container;
        this.maxSize = 512;
        this.ampFactor = 4;
        this.dim = this.maxSize / this.ampFactor ;
        this.imageLoader = null;

        this.aniQueue = {};
        this.preQueue = {};
        /**
         * 初始化 SVG
         */
        this.init( img );
    }

    Util.mix( Railings.prototype, {
        /**
         * 初始化 SVG
         */
        init: function( img ){
            var me = this,
                 html = [
                    '<p>利用Canvas实现：</p>',
                    '<svg id="svgdemo" width="',this.maxSize,'" height="',this.maxSize,'">',
                    '</svg>'
                ].join('');

            this.container.append( html );
            this.container = this.container.find( '#svgdemo' );

            MEvent.on( 'imageData.load', function(){
                var shape = new Circle( me.dim/2, me.dim/2, me.dim/2, Circle.avgColor( me.imageLoader,  me.dim/2, me.dim/2, me.dim/2 ) ),
                    node =  me.createElements( [ shape ] )[0] ;
                me.refreshCache();
                me.container.append( node );

                var ele = me.container.find( 'circle' );
                me.bindEvents( ele );
                ele.data( 'shape', shape );
            } );

            this.imageLoader = new ImageLoader( img, this.dim, this.dim );
            this.imageLoader.load();
        },
        /**
         * bind relative events;
         * @param  {jQuery Objects} eles elems will be used;
         */
        bindEvents: function( eles ){
            var me = this,
                baseAbsPosition = this.container.offset(),
                prevPosition = [];

            $(  document.body).bind( 'mousemove', function( evt ){
                var curPosition = Mouse.relativePosition( baseAbsPosition, evt ),
                    trace = Mouse.traceMove( prevPosition, curPosition, 4 );
                //find circle on the trace and split
                //console.log( '[' +curPosition[0] + ', ' + curPosition[1] + ']' );
                me.hitAndSplit(  trace );
                //save current position for next turn;
                prevPosition = curPosition;
                evt.preventDefault();
            });
        },
        /**
         * build svg elements based on parameters;
         */
        createElements: function( shapes ){
            var eles = [],
                ele = null;
            for( var ii = 0; ii < shapes.length; ii++ ){
                ele = shapes[ ii ].createElement( this.ampFactor );
                ele.data( 'shape', shapes[ ii ] );
                if( Math.floor( shapes[ ii ].x ) === shapes[ ii ].x 
                    && Math.floor( shapes[ ii ].y ) === shapes[ ii ].y ){
                    this.cacheNode( shapes[ ii ].x, shapes[ ii ].y, ele, 1 );
                }
                eles.push( ele );
            }
            return eles;
        },
        /**
         * 缓存当前显示的节点
         * @param  {int} x    x坐标
         * @param  {int} y    y坐标
         * @param  {Object} node 节点
         */
        cacheNode: function( x, y, node, flag ){
            if( flag ){
                this.preQueue[ x + ':' + y ] = node;
            }
            else{
                this.aniQueue[ x + ':' + y ] = node;
            }
        },
        refreshCache: function(){
            Util.mix( this.aniQueue, this.preQueue );
            this.preQueue = {};
        },
        /**
         * 获取缓存的节点
         * @param  {int} x    x坐标
         * @param  {int} y    y坐标
         */
        getCacheNode: function( x,y ){
            return this.aniQueue[ x + ':' + y ];
        },
        /**
         * 删除缓存的节点
         * @param  {int} x    x坐标
         * @param  {int} y    y坐标
         */
        flushCacheNode: function( x, y){
            delete this.aniQueue[ x + ':' + y ];
        },
        /**
         * 查询点所在的节点
         * @param  {array} point 点坐标
         */
        hitCircle: function( point ) {
            var xi = Math.floor(point[0] / this.ampFactor),
                yi = Math.floor(point[1] / this.ampFactor);
            // invalid circle center;
            if ( xi < 0 || xi >  this.dim || yi < 0 || yi > this.dim) {
                return null;
            }
            //search circle and its parent;
            var node = null,
                lv = 1,
                r = 1,
                parentPos = [ xi, yi];
            do{
                node = this.getCacheNode( parentPos[ 0 ], parentPos[ 1 ] );
                if( node ){
                    return node;
                }
                parentPos = Circle.getParentPos( parentPos[0], parentPos[1], lv );
                lv ++;
                r *=2;
            }while ( r <= this.dim );

            return null;
        },
        /**
         * split circle into 4 parts, draw and bind events for the new parts;
         */
        split: function( ele ){
            var circle = ele.data( 'shape' ),
                children = this.createElements( circle.split( this.imageLoader ) );
            //use children to replace parent circle;
            
            Util.foreach( children, function( item, ii ){
                SVG.insert( item[0], ele[ 0 ] );
                ele.attr( 'fill-opacity',  0.68 - 0.17 * ii );
            });
            
            ele.remove();
            this.flushCacheNode( circle.x, circle.y );
            
        },
        /**
         * 鼠标滑过 元素, 分裂
         * @param  {Array} points 鼠标轨迹抽样;
         */
        hitAndSplit: function( points ){
            var me = this,
                needRefresh = false,
                ele = null,
                circle = null;
            for( var ii = 1; ii < points.length; ii++ ){
                ele = this.hitCircle( points[ ii ] );
                circle = ele && ele.data( 'shape' );
                if( circle &&circle.checkIntersection( points[ ii - 1 ], points[ ii ], this.ampFactor ) ){
                    this.split( ele );
                    needRefresh = true;
                }
            }
            //防止重复触发分裂
            if( needRefresh ){
                setTimeout( function(){ me.refreshCache();}, 500);
            }
        } 
    } );

    var DemoFlash = function( container, imgurl ){
        this.container = container;
        this.width = 128;
        this.height = 128;
        this.img = imgurl;
        this.init();
    };
    Util.mix( DemoFlash.prototype, {
        init: function(){
            var html = [
                    '<p>利用Flash实现：</p>',
                    '<div id="imageLoader"></div>'
                ].join('');
            this.container.append( html );
            
            var inst = new Flash( this.width, this.height, this.img );
            inst.load();
        }
    } );
    

    return {
        container: '#mainContent',
        events: {
            'click #start' : 'onStart'
        },
        main: function(){
                this.img = '/resource/image/w_mengchong.jpg';
                this._build();
                this._init();
                this._bindEvents();
            },
            _build: function(){
                var ele = $([
                        '<div style="margin:15px;">',
                            '<img id="simg" src="',this.img,'" style="float:left;width:256px;height:256px;"/>',
                            '<button id="start" style="width:100px;height:25px;">获取图像</button>',
                            '<div id="dots" style="float:right;margin:10px;">',
                        '</div>'
                    ].join('') );
                ele.appendTo( this.container );
            },
            _init: function(){

            },
            _bindEvents: function(){
               
            },

            onStart: function( evt ){
                evt.preventDefault();
                var container = $('#dots'),
                    img = $(simg)[0] ,
                    imgurl = img.getAttribute( 'src' );

                new Railings( container, img );
                new DemoFlash( container, imgurl);

            }
    };

} );

GD.App( 'apps/tester/ATestEraseMask' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    return {
    container: '#mainContent',
    main: function(){
                this._build();
                this._bindEvents();
                this._queue = [];
                this._erasing = false;
            },
            _build: function(){
                var ele = $( '<div id="erase_mask" style="display:block;height:400px;width:100%;background:#efe;border:1px solid red;">' ),
                     blk_size = { 
                        width: 10, 
                        height:10
                     };
                ele.appendTo( this.container );

                setTimeout( function(){
                    var container_size = { 
                            width: ele.width(),
                            height:ele.height()
                        },
                        blk_num = {
                            col: Math.floor( container_size.width / blk_size.width ),
                            row: Math.floor( container_size.height/blk_size.height )
                        };

                        for( var ii = 0; ii < blk_num.row; ii ++ ){
                            for( var jj = 0; jj < blk_num.col; jj ++ ){
                                $( '<div class="masker bgGray">' ).css( 'width', blk_size.width + 'px' ).
                                    css( 'height', blk_size.height + 'px' ).
                                    css( 'float', 'left' ).
                                    appendTo( ele );
                            } 
                        }
                },500 )
            },
            _bindEvents: function(){
                var me = this;
                $('#erase_mask').delegate( 'div.bgGray', 'mouseenter', function( evt ){
                    me._queue.push( evt.currentTarget );
                    if( me._erasing === false ){
                        me._erasing = true;
                        me.timer = setTimeout( function(){
                            me._erase();
                        }, 10 );
                    }
                } );

            },
            _erase: function(){
                var me = this;
                if( this.timer ){
                    clearTimeout( this.timer );
                    this.timer = null;
                }
                var target = me._queue.shift();
                if( target ){
                    $( target ).removeClass( 'bgGray' ) ;
                    
                    me.timer = setTimeout( function(){
                        me._erase();
                    }, 10 );
                }
                else{
                    this._erasing =false;
                }
            }
    };

} );

GD.App( 'apps/tester/AScratchToSee' ).define( function( require ){
    var $ = require( 'jQuery' );

    return {
        container: '#mainContent',
        main: function(){
            this.ready = false;
            this.canvas = null;
            this.canvasId = 'asts_canvas'
            this.context = null;
            this.BRUSH_SIZE=18;//this.BRUSH_SIZE指的是鼠标表示的画刷,"橡皮擦"的大小
            this.img =new Image();
            this.cimg =new Image();
            this.init();
        },
        init: function(){
            var html = [
                '<p>按下鼠标移动，擦除上图看下图</p>',
                '<canvas id="',this.canvasId,'"></canvas>'
            ].join('');
            this.container.append( html )
            this.canvas= document.getElementById( this.canvasId );//获取canvas元素
            this.context = this.canvas.getContext('2d');//获取canvas画布
            this.loading();
            var me = this,
                pics =['/resource/img/2009-07-18_125722.png','/resource/img/js_fn_scope_chain.png'],//图片数组，pics[0]为当前图片，pics[1]为替换后的图片
                load=0;//初始化标志两幅图片加载次数的变量
            this.cimg.onload = this.img.onload = function (){
                if(++load==2){//表明两幅图均加载完成
                    me.initCoverImage();
                }
            }
            this.cimg.onerror = this.img.onerror = function (){//有图像加载过程中发生错误
                    me.context.clearRect(0,0, me.canvas.width, me.canvas.height);
                    me.context.font = '12px sans-serif';//显示字体格式
                    me.context.fillStyle = '#00ff00';
                    me.context.textAlign = 'center';
                    me.context.fillText('Load images failure!', me.canvas.width>>1, me.canvas.height-50);//其中canvas>>1典型的右移运算，即除以2
                }
            //上述所有事件设置完成后，设置图片的src
            this.cimg.src = pics[0];
            this.img.src = pics[1];
        },

        loading:function(){//设置及显示
            this.context.clearRect(0,0, this.canvas.width, this.canvas.height);//清空canvas窗口
            this.context.fillText('Loading...', this.canvas.width>>1, this.canvas.height-50);//若图片获取较慢，会显示loading...
        },

        initCoverImage:function(){//绘制当前图像
            this.canvas.width = this.cimg.width;//调整canvas大小，符合真实图片
            this.canvas.height = this.cimg.height;
            this.context.drawImage( this.cimg, 0, 0, this.canvas.width, this.canvas.height);
            this.bindIsolateEvents();//绑定事件
        },

        bindIsolateEvents: function(){
            var me = this;
            this.canvas.ontouchstart = this.canvas.onmousedown = $.proxy( function(e) {    this.ready = true; }, this) ;//鼠标摁下
            this.canvas.ontouchend = this.canvas.ontouchcancel = this.canvas.onmouseup = this.canvas.onmouseout = $.proxy(function(e) { this.ready = false; }, this);//鼠标未摁下
            this.canvas.ontouchmove = this.canvas.onmousemove = $.proxy( this.updateCanvas, this );//相应鼠标的移动事件
        },

        updateCanvas :function(e){
            if(!this.ready) {//鼠标未摁下
                return;
            }
            var r = this.canvas.getBoundingClientRect();//获取当前canvas区域的坐标
            var vx = e.clientX - r.left;//横向距离
            var vy = e.clientY - r.top;//纵向距离

            var bs = this.BRUSH_SIZE;
            var bsr = bs/2;

            if ( vx < bsr || vy < bsr) {//据canvas边缘太近，则指定此时"擦拭"无效
                return;
            }
            this.context.rect(vx-bsr, vy-bsr, bs, bs);//否则圈定当前一块区域方便被"替换"为下一幅图的相同区域
            this.context.drawImage( this.img, vx-bsr, vy-bsr, bs, bs, vx-bsr, vy-bsr, bs, bs);//替换
        }
    };
} );