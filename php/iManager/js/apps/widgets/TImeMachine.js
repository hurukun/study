/*global K:false,define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * 个人首页 新手引导
 * @author rukun rukun@corp.kaixin001.com
 */
define( 'apps/widgets/TimeMachine', ['jQuery', 'core/stage/FloatStage', 'core/media/MediaBox' ], function( require ){
    var $ = require( 'jQuery' ),
        FloatStage = require( 'core/stage/FloatStage' ),
        MediaBox = require( 'core/media/MediaBox' ),
        Util = require( 'Util' ),
        Browser = require(  'Browser' );


    var SceneStore = {
        widgetGallery: null,
        tmDefault: 600,
        tmSlowBack: 300,
        posInitInRight: 600,
        posInitOutsideRight: 800,
        scenePos : 800,
        /**
         * 淡入动画
         */
        aniFadeIn: function(  opt ){
            var def ={
                            type: [ FloatStage.Switcher.Type.Hide, FloatStage.Switcher.Type.FadeIn ],
                            pos:opt.pos||[],
                            time: opt.time || [ 0, this.tmDefault],
                            delay: opt.delay || [ 0, 0 ],
                            group: opt.group || 0
                        };
            return def;
        },
        /**
         * 淡出动画
         */
        aniFadeOut: function(  opt ){
            opt = opt || {};
            var def ={
                            type: [ FloatStage.Switcher.Type.FadeOut ],
                            pos:opt.pos||[],
                            time: opt.time || [ 200],
                            delay: opt.delay || [ 0, 0 ],
                            group: opt.group || -1
                        };
            return def;
        },
        /**
         * 水平滚动
         */
        aniHScroll: function( opt ){
            var def ={
                            type: [ FloatStage.Switcher.Type.Show ],
                            pos: opt.pos||[],
                            time: opt.time || [ 0, this.tmDefault],
                            delay: opt.delay || [ 0, 0 ],
                            group: opt.group || 0
                        };
            Util.mix( def, opt );

            var ii = 0;
            for ( ii =1; ii < opt.phase; ii ++ ){
                def.type.push( FloatStage.Switcher.Type.HScroll );
            }

            return def;
        },
        /**
         * 根据参数，创建场景
         */
        buildScene : function( page, bkgCls, content ){
            var end = this.scenePos;
            this.scenePos = this.scenePos - 800;
           var scene = {
                switcher: {
                    swin: this.aniHScroll( {
                                    phase: 2,
                                    pos: [ [ end + 800, 0], [ end, 0 ] ],
                                    time: [ 0, this.tmDefault - 200],
                                    group: 0
                                } ),
                    swout: this.aniFadeOut( {  group: 0 } )
                },
                content: ['<li data-type="page" class="tm_scene ',bkgCls,'" >', ( content||'' ),'</li>'].join(''),
                ready: function(){}
            };
            /**
                 * 调整舞台
                 * @param  {jQuery Object} eleFront 舞台前景
                 * @param  {jQuery Object} eleEnd   舞台背景
                 */
            if( page === 0 ){
                scene.stage = function( eleFront, eleEnd){
                    var width = 800,
                        height = 480;

                    eleFront.css( {
                            'top': '100px',
                            'left': ($( window ).width() - width )/2 + 'px',
                            'overflow':'hidden',
                            'width': width + 'px',
                            'height': height + 'px'
                        } );

                    /**
                     * 蒙板位置
                     */
                    if( Browser.ie6 || $(window).height() < 580 ){
                        eleFront.css( {
                            position: 'absolute',
                            top: ( $(window).scrollTop() + 100 )  + 'px'
                        } );
                        eleEnd.css( {
                            'position': 'absolute',
                            'height': Math.max( $(document.body).height() , 2000 ) + 'px'
                        } );
                    }
                    else{
                        eleFront.css( {
                            position: 'fixed'
                        } );
                        eleEnd.css( 'position', 'fixed' );
                    }
                };
            }
            return scene;
        },
        /**
         * 该活动共17个页面，每个页面中的元素位置都不同，所以写17个动画模板，分别对应每个页面
         */
        buidWidgets: function( page, user ){
            var me = this;

            if( !this.widgetGallery ){
                this.widgetGallery = [  
                    /**
                     * page 0
                     */
                    [
                        {
                            content: '<div class="widget '+(user.gender? 'p0_char_wm':'p0_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 160, 60] ],
                                    time: [ 0, me.tmDefault + 200],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut( {group: -1} )
                            }
                        },
                        {
                            content: '<div class="widget p0_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 180], [ 35, 180 ],[85,180] ],
                                    delay: [ 300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut(  {group: -1} )
                            }
                        },
                        {
                            content: '<div class="widget p0_cloud_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 60], [ 310, 60 ],[360,60] ],
                                    delay: [ 300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut( {group: -1} )
                            }
                        },
                        {
                            content: '<div class="widget p0_char_star" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight - 100, 227], [ 169, 227 ],[190,227] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut( {group: -1} )
                            }
                        },
                        {
                            content:  (function(){
                                                    var str = ['<div class="widget p0_text" style="display:none">',
                                                                        '<p class="time fsl fsnum">', user.regdate.substr( 0,10 ).replace(/-/ig, '.' ), '</p>'
                                                            ];
                                                    if( user.age_real > 10 && user.age_real < 80 ){
                                                        str.push( '<p class="pdes fsl">\u90A3\u5E74<span class="fsnum">' + user.age_whenreg+ '</span>\u5C81\u7684\u4F60\uFF0C</p>' );
                                                    }
                                                    else{
                                                        str.push( '<p class="pdes fsl">\u5F53\u5E74\u7684\u4F60\uFF0C</p>' );   
                                                    }
                                                    str.push('</div>');
                                                    return str.join('');
                                                })(),
                            switcher: {
                                swin: me.aniHScroll( {
                                    phase: 3,
                                    pos: [[ me.posInitOutsideRight , 125], [ 320, 125 ], [ 360, 125] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 360 , 125], [ 360 - 800, 125 ] ],
                                    posH: [[ 360 , 125], [ 360 + 800, 125 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                    ],
                    /*************************************
                     * page 1
                     *************************************/
                    [
                        {
                            content: '<div class="widget '+(user.gender? 'p1_char_wm':'p1_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 140, 90] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget '+(user.friend_first.gender? 'p1_char_wm':'p1_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 90], [ 265, 90 ],[295,90] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut( )
                            }
                        },
                        {
                            content: '<div class="widget p1_line" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 180, 358] ],
                                    time: [ 0, me.tmDefault],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut( )
                            }
                        },

                        {
                            content: '<div class="widget p1_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 95], [ 40, 95 ],[70,95] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p1_cloud_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 90], [ 455, 90 ],[485,90] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: ['<div class="widget p1_text" style="display:none">',
                                                '<span class="name fsl">',
                                                user.friend_first.nick,
                                            '</span></div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 190], [ 435, 190 ],[465, 190] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 5
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 465 , 190], [ 465 - 800 , 190 ] ],
                                    posH: [[ 465 , 190], [ 465 + 800 , 190 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                    ],
                    /*************************************
                     * page 2
                     *************************************/
                    [
                        {
                            content: '<div class="widget '+(user.gender? 'p2_char_wm':'p2_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 225, 165] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut( )
                            }
                        },
                        {
                            content: '<div class="widget p2_char_frd0" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 95, 100] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p2_char_frd1" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 355, 30] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut( )
                            }
                        },
                        {
                            content: '<div class="widget p2_char_frd2" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 370, 290] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut( )
                            }
                        },
                        {
                            content: '<div class="widget p2_char_frd3" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 100, 270] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut( )
                            }
                        },
                        {
                            content: ['<div class="widget p2_text" style="display:none">',
                                                '<span class="num fsl dyn_fill"><span class="fsnum">',user.friend_num,'</span>位</span>',
                                            '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 165], [ 465, 165 ],[495,165] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 495 , 165], [ 495 - 800 , 165 ] ],
                                    posH: [[ 495 , 165], [ 495 + 800 , 165 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                    ],
                    /*************************************
                     * page 3
                     *************************************/
                     [
                        {
                            content: '<div class="widget p3_msg" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 70], [ 105, 70 ],[135,70] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p3_camera" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 65], [ 330, 65 ],[360,65] ],
                                    delay: [300, 0, 0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p3_heart" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 70], [ 535, 70 ],[565,70] ],
                                    delay: [600, 0, 0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content:(function(){
                                            var str = '',
                                                day = 0;
                                            if( user.records_num > 0|| user.photo_num > 0|| user.diary_num > 0){
                                                str = [
                                                    '<div class="widget p3_text_1" style="display:none">',
                                                        '<span class="r_num fsl dyn_fill fsnum">', user.records_num , '</span>',
                                                        '<span class="p_num fsl dyn_fill fsnum">', user.photo_num , '</span>',
                                                        '<span class="d_num fsl dyn_fill fsnum">', user.diary_num , '</span>',
                                                    '</div>'
                                                ].join('');
                                            }
                                            else{
                                                day = ( new Date() ) - ( new Date( user.regdate ));
                                                day = Math.floor( day/( 1000*60*60*24 ) );
                                                str = [
                                                    '<div class="widget p3_text_0" style="display:none">',
                                                        '<span class="day dyn_fill fsl fsnum">', day||1 , '</span>',
                                                    '</div>'
                                                ].join('');
                                            }
                                            return str;
                                        })(),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 290], [ 120, 290 ],[150,290] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 150 , 290], [ 150 - 800 , 290 ] ],
                                    posH: [[ 150 , 290], [ 150 + 800 , 290 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 4
                     *************************************/
                     [
                        {
                            content: '<div class="widget p4_line" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 30, 240] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut( )
                            }
                        },
                        {
                            content: '<div class="widget p4_char_m" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 60], [ 155, 60 ],[185,60] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p4_char_wm" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 70], [ 280, 70 ],[310,70] ],
                                    delay: [ 300, 0, 0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p4_char_m1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 65], [ 430, 65 ],[440,65] ],
                                    delay: [ 600, 0, 0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p4_cloud" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 100], [ 40, 100 ],[70,100] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p4_cloud" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 70], [ 580, 70 ],[610,70] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: ['<div class="widget p4_text" style="display:none">',
                                            '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 350], [ 125, 350 ],[155,350] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 155 , 350], [ 155 - 800 , 350 ] ],
                                    posH: [[ 155 , 350], [ 155 + 800 , 350 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 5
                     *************************************/
                     [
                        {
                            content: '<div class="widget '+(user.gender? 'p5_char_wm':'p5_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 120, 100] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p5_book" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 190], [ 200, 190 ],[235,190] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p5_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 130], [ 15, 130 ],[45,130] ],
                                    delay:[300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p5_cloud_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 50], [ 300, 50 ],[330,50] ],
                                    delay:[300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: (function(){
                                            var str = '', month = 0;
                                            if( user.repaste_num < 1999 ){
                                                month = Math.floor( user.repaste_num/ 50 );
                                                str =[
                                                    '<div class="widget p5_text_0" style="display:none">',
                                                        '<span class="rp_num fsl dyn_fill fsnum">' , user.repaste_num , '</span>',
                                                        '<span class="m_num fsl dyn_fill fsnum">' , month , '</span>',
                                                    '</div>'
                                                ].join('');
                                            }
                                            else {
                                                str =[
                                                    '<div class="widget p5_text_1" style="display:none">',
                                                        '<span class="rp_num fsl dyn_fill fsnum">' , user.repaste_num , '</span>',
                                                    '</div>'
                                                ].join('');
                                            }
                                            return str;
                                        })(),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 210], [ 440, 210 ],[470,210] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 470 , 210], [ 470 - 800 , 210 ] ],
                                    posH: [[ 470 , 210], [ 470 + 800 , 210 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 6
                     *************************************/
                     [
                        {
                            content: '<div class="widget '+(user.gender? 'p6_char_wm':'p6_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 120, 100] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p6_gift" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 255], [ 200, 255 ],[230,255] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p5_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 130], [ 15, 130 ],[45,130] ],
                                    delay:[300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p5_cloud_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 50], [ 300, 50 ],[330,50] ],
                                    delay:[300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: ['<div class="widget p6_text" style="display:none">',
                                                (function(){
                                                    var pnum = Math.floor( user.gift_num / 50 ) || 1,
                                                          str = '<span class="g_num fsn dyn_fill fsnum">'+user.gift_num+'</span><span class="p_num fsn dyn_fill fsnum">'+pnum+'</span>';
                                                    return str;
                                                })(),
                                           '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 210], [ 440, 215 ],[475,215] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 475 , 215], [ 475 - 800 , 215 ] ],
                                    posH: [[ 475 , 215], [ 475 + 800 , 215 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 7
                     *************************************/
                     [
                        {
                            content: '<div class="widget '+(user.gender? 'p7_char_wm':'p7_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 90, 100] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p7_vs" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 220], [ 180, 220 ],[210,220] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p7_char_m1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 100], [ 240, 100 ],[270,100] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    delay: [ 300,0,0 ],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p7_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 145], [ 0, 145 ],[30,145] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p7_cloud_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 60], [ 290, 60 ],[320,60] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: ['<div class="widget p7_text" style="display:none">',
                                                (function(){
                                                    var pnum = Math.floor( user.rating_num / 50 ) || 1,
                                                          str = '<span class="r_num fsn dyn_fill fsnum">'+user.rating_num+'</span><span class="p_num fsn dyn_fill fsnum">'+pnum+'</span>';
                                                    return str;
                                                })(),
                                           '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 190], [ 440, 190 ],[470,190] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 470 , 190], [ 470 - 800 , 190 ] ],
                                    posH: [[ 470 , 190], [ 470 + 800 , 190 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 8
                     *************************************/
                     [
                        {
                            content: '<div class="widget '+(user.gender? 'p8_char_wm':'p8_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 135, 100] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p8_vbox" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 270], [ 200, 270 ],[240,270] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p8_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 100], [ 15, 100 ],[50,100] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p5_cloud_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 60], [ 280, 60 ],[310,60] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: ['<div class="widget p8_text" style="display:none">',
                                                (function(){
                                                    var pnum = Math.floor( user.vote_num / 50 ) || 1,
                                                          str = '<span class="v_num fsn dyn_fill fsnum">'+user.vote_num+'</span><span class="p_num fsn dyn_fill fsnum">'+pnum+'</span>';
                                                    return str;
                                                })(),
                                           '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 220], [ 430, 220 ],[460,220] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout:  me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 460 , 220], [ 460 - 800 , 220 ] ],
                                    posH: [[ 460 , 220], [ 460 + 800 , 220 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 9
                     *************************************/
                     [
                        {
                            content: '<div class="widget '+(user.gender? 'p9_char_wm':'p9_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 165, 105] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p9_group" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 60, 100] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: ['<div class="widget p9_text" style="display:none">',
                                                '<span class="num fsn dyn_fill fsnum">',user.slaveprice,'</span>',
                                           '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 190], [ 440, 190 ],[480,190] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 480 , 190], [ 480 - 800 , 190 ] ],
                                    posH: [[ 480 , 190], [ 480 + 800 , 190 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                    ],
                    /*************************************
                     * page 10
                     *************************************/
                     [
                        {
                            content: '<div class="widget p10_pmark" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 35, 150] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p10_car" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 2,
                                    pos: [ [ 0, 200], [160,200] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p5_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitInRight, 80], [ 420, 80 ],[450,80] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: 
                                            (function(){
                                                var str = '摇不到车号？约不到驾校？';
                                                if( user.car_count === 0 ){
                                                    str = [
                                                        '<div class="widget p10_text_0" style="display:none">',
                                                        '</div>'].join('');
                                                }
                                                else if( user.car_count === 1 ){
                                                    str = [
                                                        '<div class="widget p10_text_1" style="display:none">',
                                                            '<span class="name fsn dyn_fill">', user.car_name, '</span>',
                                                        '</div>'].join('');
                                                }
                                                else{
                                                    str = [
                                                        '<div class="widget p10_text_2" style="display:none">',
                                                            '<span class="count fsn dyn_fill fsnum">', user.car_count, '</span>',
                                                        '</div>'].join('');
                                                }
                                                return str;
                                            })(),
                                           
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 140], [ 440, 140 ],[480,140] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 480 , 140], [ 480 - 800 , 140 ] ],
                                    posH: [[ 480 , 140], [ 480 + 800 , 140 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 11
                     *************************************/
                     [
                        {
                            content: '<div class="widget p11_tree" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 135], [ 100, 135 ],[130,135] ],
                                    time: [ 0, me.tmDefault + 300 , me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p11_carrot" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 135], [ 205, 135 ],[235,135] ],
                                    delay:[ 300,0,0],
                                    time: [ 0, me.tmDefault+ 250, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p11_strawberry" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 135], [ 280, 135 ],[310,135] ],
                                    delay:[ 600,0,0],
                                    time: [ 0, me.tmDefault+ 200, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p11_pepper" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 135], [ 360, 135 ],[390,135] ],
                                    delay:[ 900,0,0],
                                    time: [ 0, me.tmDefault+ 150, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p11_grass" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 135], [ 430, 135 ],[460,135] ],
                                    delay:[ 1200,0,0],
                                    time: [ 0, me.tmDefault+ 100, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p11_watermelon" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 135], [ 500, 135 ],[530,135] ],
                                    delay:[ 1500,0,0],
                                    time: [ 0, me.tmDefault + 50, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p11_eggplant" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 135], [ 590, 135 ],[620,135] ],
                                    delay:[ 1800,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: ['<div class="widget p11_text" style="display:none">',
                                           '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 310], [ 160, 310 ],[190,310] ],
                                    delay:[ 1600,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 190 , 310], [ 190 - 800 , 310 ] ],
                                    posH: [[ 190 , 310], [ 190 + 800 , 310 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                    ],
                    /*************************************
                     * page 12
                     *************************************/
                     [
                        {
                            content: '<div class="widget p12_house_0" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 360, 105] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p12_house_1" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 130, 65] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p12_house_2" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 315, 50] ],
                                    time: [ 0, me.tmDefault],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p12_house_3" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 630, 50] ],
                                    time: [ 0, me.tmDefault],
                                    group: 4
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p12_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 70], [ 30, 70 ],[70,70] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p12_cloud_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 75], [ 520, 65 ],[550,65] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: ['<div class="widget p12_text" style="display:none">',
                                                '<span class="name_l fsl dyn_fill">',user.house_room,'</span><span class="name_m fsl dyn_fill">',user.house_name,'</span>',
                                           '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 325], [ 70, 325 ],[100,325] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 5
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 100 , 325], [ 100 - 800 , 325 ] ],
                                    posH: [[ 100 , 325], [ 100 + 800 , 325 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 13
                     *************************************/
                     [
                        {
                            content: '<div class="widget p13_light" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 345, 5] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p13_table" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 140], [ 180, 140 ],[215,140] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p13_chair_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 150], [ 90, 150 ],[120,150] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p13_chair_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 150], [ 570, 150 ],[600,150] ],
                                    delay: [300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p13_tip" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 50], [ 80, 50 ],[110,50] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: ['<div class="widget p13_text" style="display:none">',
                                                '<span class="name fsl dyn_fill">', user.cafe_name,
                                                '</span>',
                                            '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 360], [ 80, 360 ],[110,360] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 4
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 110 , 360], [ 110 - 800 , 360 ] ],
                                    posH: [[ 110 , 360], [ 110 + 800 , 360 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 14
                     *************************************/
                     [
                        {
                            content: '<div class="widget '+(user.gender? 'p14_char_wm':'p14_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 90, 70] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p14_city" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 290], [ 170, 290 ],[200,290] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p14_cloud_0" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 145], [ 10, 145 ],[40,145] ],
                                    delay: [ 300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: '<div class="widget p14_cloud_1" style="display:none"></div>',
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 65], [ 300, 65 ],[330,65] ],
                                    delay: [300,0,0],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut()
                            }
                        },
                        {
                            content: ['<div class="widget p14_text" style="display:none">',
                                            '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 190], [ 450, 190 ],[480,190] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 480 , 190], [ 480 - 800 , 190 ] ],
                                    posH: [[ 480 , 190], [ 480 + 800 , 190 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 15
                     *************************************/
                     [
                        {
                            content: '<div class="widget '+(user.gender? 'p15_char_wm':'p15_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 175, 100] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p15_app_list" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 55, 30] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: ['<div class="widget p15_text" style="display:none">',
                                            '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 205], [ 420, 205 ],[450,205] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 450 , 205], [ 450 - 800 , 205 ] ],
                                    posH: [[ 450 , 205], [ 450 + 800 , 205 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 16
                     *************************************/
                     [
                        {
                            content: '<div class="widget '+(user.gender? 'p16_char_wm':'p16_char_m')+'" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 190, 150] ],
                                    time: [ 0, me.tmDefault],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: '<div class="widget p16_friends" style="display:none"></div>',
                            switcher: {
                                swin: me.aniFadeIn( {
                                    pos: [ [ 70, 110] ],
                                    time: [ 0, me.tmDefault],
                                    group: 2
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        },
                        {
                            content: ['<div class="widget p16_text" style="display:none">',
                                            '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 155], [ 430, 155 ],[465,155] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 3
                                } ),
                                swout: me.aniHScroll( {
                                    phase: 2,
                                    posL: [[ 465 , 155], [ 465 - 800 , 155 ] ],
                                    posH: [[ 465 , 155], [ 465 + 800 , 155 ] ],
                                    time: [ 0, me.tmDefault],
                                    group: -1
                                } )
                            }
                        }
                     ],
                     /*************************************
                     * page 封面
                     *************************************/
                     [
                        {
                            content: ['<div class="widget tm_cover_name fsl dyn_fill" style="display:none">',user.real_name,
                                            '</div>'].join(''),
                            switcher: {
                                swin: this.aniHScroll( {
                                    phase: 3,
                                    pos: [ [ me.posInitOutsideRight, 100], [ 230, 100 ],[270,100] ],
                                    time: [ 0, me.tmDefault, me.tmSlowBack],
                                    group: 1
                                } ),
                                swout: me.aniFadeOut(  )
                            }
                        }
                     ]
                ];
            }
            return this.widgetGallery[ page ];
        },
        /**
         * 创建下方静态 条
         */
        buildBarItem: function( index ){
            return '<span class="bar_item ' + ( index > 0 ? 'bar_g_line':'' ) + '"><i class="bar_g_star fr" data-page="'+ index +'"></i></span>' ;
        },
        flush: function(){
            this.widgetGallery = null;
        }
    };

    var TimeMachine = function(){
        this.autoTimer = null;
        this.data = {};
        this.floatStage = null;
        this.audioPlayer = null;
        this.init();
    };
    Util.mix( TimeMachine.prototype, {
        init: function(){            
            this.fetchData();
            this.preloadImage();
        },
        /**
         * 获取用户数据
         */
        fetchData: function( run ){
            var me = this;
this.data = {
    error_code:0,
    result:{
        age_real:28,
        age_whenreg:25,
        birthday:"1986-03-11",
        cafe_name:'西北餐车',
        real_name: '胡汝坤',
        logo120: 'http://pic.kaixin002.com.cn/logo/92/70/120_92927070_35.jpg',
        gender: 1,
        car_count:1,
        car_name: '宝来',
        diary_num:0,
        friend_first:{
            gender:0,
            logo120:"http://pic.kaixin002.com.cn/logo/92/70/120_92927070_35.jpg",
            logo20:"http://pic.kaixin002.com.cn/logo/92/70/20_92927070_35.jpg",
            logo25:"http://pic.kaixin002.com.cn/logo/92/70/25_92927070_35.jpg",
            logo50:"http://pic.kaixin002.com.cn/logo/92/70/50_92927070_35.jpg",
            nick:"胡汝坤",
            online:1,
            real_name:"胡汝坤",
            uid:92927070
        },
        friend_intimacy:[
            {
                gender:0,
                logo120:"http://pic.kaixin002.com.cn/logo/44/28/120_122442846_1.jpg",
                logo20:"http://pic.kaixin002.com.cn/logo/44/28/20_122442846_1.jpg",
                logo25:"http://pic.kaixin002.com.cn/logo/44/28/25_122442846_1.jpg",
                logo50:"http://pic.kaixin002.com.cn/logo/44/28/50_122442846_1.jpg",
                nick:"胡汝坤",
                online:0,
                real_name:"胡汝坤",
                uid:122442846
            },
            {
                gender:1,
                logo120:"http://pic.kaixin002.com.cn/logo/5/92/120_18059218_5.jpg",
                logo20:"http://pic.kaixin002.com.cn/logo/5/92/20_18059218_5.jpg",
                logo25:"http://pic.kaixin002.com.cn/logo/5/92/25_18059218_5.jpg",
                logo50:"http://pic.kaixin002.com.cn/logo/5/92/50_18059218_5.jpg",
                nick:"李梅",
                online:0,
                real_name:"李梅",
                uid:18059218
            }
        ],
        friend_num:277,
        gift_num:239,
        house_name:"天天向上",
        house_room:"3室一厅",
        photo_num:"53",
        rating_num:101,
        records_num:68,
        regdate:"2010-10-20 14:28:58",
        repaste_num:81,
        slaveprice:600,
        vote_num:1
    }
};
            $.ajax( {
                url: '/award2013/fiveyear/api.php',
                dataType:'json',
                type: 'post',
                data: {act:'getMyInfo'},
                success: function( resp ){
                    if( resp.error_code === 0 ){
           //             me.data = resp;
                        if( run ){  
                            me.showStage( me.data.result );
                        }
                    }
                    else if( run && resp.error_code == -99 ){
                        MessageBox.alert( '\u8BF7\u5148\u767B\u5F55\uFF01', '\u6388\u6743\u9519\u8BEF' );
                    }
                }
            } );
        },
        /**
         * 预加载 大图
         */
        preloadImage: function(){
            try{
                $( '<img src="/css/i3/5thanni/tmm_cover.png"/>' );
            }
            catch( err ){

            }
        },
        /**
         * 创建音乐播放器
         */
        buildAudioPlayer: function(){
            this.audioPlayer = null;
            var options = {
                    el:$('#fifth_tm_audio'),
                    id:'fifth_tm_audio_player',
                    insertMode: 'inner',
                    mediaType:'audio',
                    flash: '/resource/flash/musicplayer_records.swf'
                };
            var mpro = {
                    localurl:'#',
                    src:'/resource/audio/tmm_music_bkg.mp3',
                    width:'10px',
                    height:'10px',
                    loop: 1
                };

            this.audioPlayer = new MediaBox(options,mpro);
            /**
             * 显示 播放器
             */
            this.audioPlayer.show();
        },
        /**
         * 创建场景
         * @return {Array} 场景数组
         */
        buildScenes: function( user ){
            var scenes = [],
                widgets = [],
                bar = [ '<div class="bar">' ],
                sceIndex = 0,
                page = 0;

            scenes.push( SceneStore.buildScene( sceIndex , 'pbkg_cover', [
                    '<img class="widget tm_cover_logo" src="', user.logo120 ,'"/>'
                ].join('') ) );
            widgets.push( SceneStore.buidWidgets( 17, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
            /**
             * page 0
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_0' ) );
            widgets.push( SceneStore.buidWidgets( 0, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
            /**
             * page 1
             */
            if( user.friend_first.uid ){
                scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_1' ) );
                widgets.push( SceneStore.buidWidgets( 1, user ) );
                bar.push( SceneStore.buildBarItem( page++ ) );
            }
            /**
             * page 2
             */
            if( user.friend_intimacy.length >= 2 ){
                scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_2' ) );
                widgets.push( SceneStore.buidWidgets( 2, user ) );
                bar.push( SceneStore.buildBarItem( page++ ) );
            }
            /**
             * page 3
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_3' ) );
            widgets.push( SceneStore.buidWidgets( 3, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
            /**
             * page 4
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_4' ) );
            widgets.push( SceneStore.buidWidgets( 4, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
            /**
             * page 5
             */
            if( user.repaste_num > 50 ){
                scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_5' ) );
                widgets.push( SceneStore.buidWidgets( 5, user ) );
                bar.push( SceneStore.buildBarItem( page++ ) );
            }
            /**
             * page 6
             */
            if( user.gift_num > 50 ){
                scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_6' ) );
                widgets.push( SceneStore.buidWidgets( 6, user ) );
                bar.push( SceneStore.buildBarItem( page++ ) );
            }
            /**
             * page 7
             */
            if( user.rating_num > 50 ){
                scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_7' ) );
                widgets.push( SceneStore.buidWidgets( 7, user ) );
                bar.push( SceneStore.buildBarItem( page++ ) );
            }
            /**
             * page 8
             */
            if( user.vote_num > 50 ){
                scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_8' ) );
                widgets.push( SceneStore.buidWidgets( 8, user ) );
                bar.push( SceneStore.buildBarItem( page++ ) );
            }
            /**
             * page 9
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_9' ) );
            widgets.push( SceneStore.buidWidgets( 9, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
            /**
             * page 10
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_10' ) );
            widgets.push( SceneStore.buidWidgets( 10, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
             /**
             * page 11
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_11' ) );
            widgets.push( SceneStore.buidWidgets( 11, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
             /**
             * page 12
             */
            if( user.house_name ){
                scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_12' ) );
                widgets.push( SceneStore.buidWidgets( 12, user ) );
                bar.push( SceneStore.buildBarItem( page++ ) );
            }
            /**
             * page 13
             */
            if( user.cafe_name ){
                scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_13' ) );
                widgets.push( SceneStore.buidWidgets( 13, user ) );
                bar.push( SceneStore.buildBarItem( page++ ) );
            }
            /**
             * page 14
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_14' ) );
            widgets.push( SceneStore.buidWidgets( 14, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
            /**
             * page 15
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_15' ) );
            widgets.push( SceneStore.buidWidgets( 15, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );
            /**
             * page 16
             */
            scenes.push( SceneStore.buildScene( sceIndex++, 'pbkg_16' ) );
            widgets.push( SceneStore.buidWidgets( 16, user ) );
            bar.push( SceneStore.buildBarItem( page++ ) );

            bar.push( '</div>' );

            return{
                scenes: scenes,
                widgets: widgets,
                bar: bar
            };
        },
        /**
         * 创建并显示引导
         * @param  {Array} data 场景数组
         */
        showStage: function( data ){
            var components = this.buildScenes( data ),
                barItemNum = components.bar.length - 2,
                me = this;

            var fs = new FloatStage( {
                wrapper: '<div data-sigil="stage"></div>',
                sceneContainer: '<ul data-sigil="scenes" class="tm_scenes"></ul>',
                widgetsContainer: '<div data-sigil="widgets"></div>',
                staticElement: '<div data-sigil="statics" class="bar_wrapper" style="display:none">' + components.bar.join('') + '</div><a class="tm_close" data-sigil="close" href="#" style="display:none;"></a><div id="fifth_tm_audio"></div>',
                events:{
                    'click [data-sigil="close"]' : 'onClose'
                },
                /**
                 * 舞台调整
                 */
                stage: function( eleFront, eleEnd ){
                    eleEnd.addClass( 'tm_mask' );
                    eleFront.find( '[data-sigil="scenes"]' ).css( 'top', '0px' );
                },
                /**
                 * 关闭舞台
                 */
                onClose: function( stage,evt ){
                    evt.preventDefault();
                    evt.stopPropagation();
                    me.close();
                },
                /**
                 * 舞台场景
                 */
                scenes: components.scenes,
                /**
                 * 舞台场景相关但不同步的元素
                 */
                widgets: components.widgets
            } );

            fs.once( 'ani:over', function( data ){
                var container =  fs.sigil('foreground'),
                    staticBar = container.find( '[data-sigil=statics]' ),
                    barWidth = staticBar.width(),
                    barItemLen = ( barWidth - 12 ) / (barItemNum - 1 );
                /**
                 * 调整bar位置，与每项的宽度
                 */
                container.find( '.bar' ).css( 'left', (12 - barItemLen ) + 'px' );
                container.find( '.bar_item' ).css( 'width', barItemLen + 'px' );
                /**
                 * 点亮第一页
                 */
                staticBar.find( 'span:eq(0) i' ).toggleClass( 'bar_g_star' ).toggleClass( 'bar_star' );
                fs.sigil('statics').show();
                /**
                 * 点击进度条跳转
                 */
                staticBar.delegate( 'i', 'click', function(  evt ){
                    evt.preventDefault();
                    evt.stopPropagation();
                    /**
                     * 正在翻页中，不能操作
                     */
                    if( fs.isBusy() ){
                        return;
                    }
                    window.clearTimeout( me.autoTimer ); 
                    /**
                     * 翻页
                     * @type {[type]}
                     */
                    var target = $( evt.currentTarget ),
                        index = target.data( 'page' );

                    fs.to( index );
                } );/*click*/
            } );/*once*/
            fs.on( 'beforeswitch', function( data ){

                var index = data.toIndex;
                /**
                 * 更新bar 样式
                 */
                fs.sigil( 'statics' ).find( 'span' ).each( function(){
                        var target = $(this),
                            star = target.find( 'i' ),
                            ind = star.data( 'page' );
                        if(ind <= index ){
                            target.removeClass( 'bar_g_line' ).addClass( ( ind>0 ?'bar_line':'' ) );
                            star.removeClass( 'bar_g_star' ).addClass( 'bar_star' );
                        }
                        else{
                            target.addClass( 'bar_g_line' ).removeClass( 'bar_line' );
                            star.addClass( 'bar_g_star' ).removeClass( 'bar_star' );
                        }
                    } );/*each*/
            } );/*beforeswitch*/

            this.floatStage = fs;
            this.handleAfterSwitch();

            /**
             * 音乐播放器
             */
            this.buildAudioPlayer();
        },
        /**
         * 处理每页切换完后的事件
         */
        handleAfterSwitch: function( ){
            var me = this;
            this.floatStage.on( 'afterswitch', function( data ){
                /**
                 * 关闭按钮
                 */
                me.floatStage.sigil( 'close' ).toggle( data.toIndex > 0 );
                /**
                 * 自动播放
                 */
                me.autoTimer = window.setTimeout( function(){
                    me.floatStage.next();
                }, 5000 );
                if( me.floatStage.atEnd() ){
                   me.fire( 'tm:reachEnd' );
                }
            } );/*afterswitch*/
        },
        /**
         * 关闭并清除资源
         */
        close: function(){
            window.clearTimeout( this.autoTimer );
            this.floatStage.close();
            this.floatStage = null;
            SceneStore.flush();
            this.data = null;
            this.fire( 'tm:close' );
        },
        /**
         * 隐藏
         */
        hide: function(){
            window.clearTimeout( this.autoTimer );
            /**
             * 未被删除
             */
            if( this.floatStage ){
                this.floatStage.hide();
                this.floatStage.un( 'afterswitch' );
                this.audioPlayer.remove();
            }
        },
        /**
         * 播放动画
         */
        run: function( index ){
            /**
             * 已初始化 floatstage;
             */
            if( this.floatStage ){
                /**
                 * 自动播放等相关事件
                 */
                this.floatStage.un( 'afterswitch' );
                this.handleAfterSwitch();
                this.floatStage.show( 800 );
                this.buildAudioPlayer();
                /**
                 * 跳转第一页
                 */
                this.floatStage.to( index );
            }
            else{
                /**
                 * 已有数据，播放
                 */
                if( this.data && this.data.result ){
                    this.showStage( this.data.result );
                }
                else{
                    /**
                     * 请求数据并播放
                     */
                    this.fetchData( true );
                }
            }
        }
    });

    return TimeMachine;
} );
