/**
* Module: 用于播放vedio，audio(mp3,wma);
* 相关参数：
* MediaBox = function(options,mediapro)
*   options：
*       width(="460px")         播放器外容器宽度
*       height(="370px")        播放器外容器高度
*       el(=null):          播放器插入DOM时依赖的元素的jQuery选择器
*       id(=""):            播放器本身的ID
*       autoRender(=true):[true,false]  初始化后立即显示
*       insertMode(="after"):[before after inner outer] 插入DOM时相对于el的位置类型
*       insertIndex(=null):     
*       mediaType(=""):[vedio, audio ]  媒体类型
*   mediapro：
*       width：              播放器宽度
*       height：             播放器高度
*       src：                媒体资源url
*       localurl:           跳转新页面的url
*
* 调用实例：(详见：apps/records/AShowMedia.js.gb 或 apps/home/ANewsList.js.gb)
        //引用 模块
        var MediaBox = require('apps/records/MediaBox');
        ……
        //初始化 相关参数
        var options = {
                        el:panel,
                        id:id,
                        mediaType:mtype
                   };
            var mpro = {
                 localurl:lurl,
                 src:src,
                 width:width,
                 height:height
            };
        //生产对象
        media = new MediaBox(options,mpro);
        //添加 播放器显示、隐藏消息响应函数
            media.addListeners({
                "show":show,
                "hide":hide
            });
        //显示播放器
            media.show();
**/

define('core/media/MediaBox',['jQuery'],function(require){
        var $ =  require('jQuery'),
            Browser = require( 'Browser' );

        var o_width = "280";
        if($.browser.msie == true && /6\.0/g.test($.browser.version)){
            o_width ="230";
        }
        MediaBox = function(options,mediapro){
              var me =  $.extend(this,options);
              if(mediapro && mediapro.src){
                this.mediapro = mediapro;
              }else{
                alert("未获取媒体路径!");
                return false;
              }
              this.init();
        }
        MediaBox.prototype = {
                //container property
                width:"460px",
                height:"370px",
                el:null, //所要渲染的DOM
                id:"", //播放器本身的ID
                autoRender:true,//初始化即显示 默认是true
                insertMode:"after", //插入DOM类型 默认after  有before inner outer
                insertIndex:null, //默认是null
                //self property
                mediaType:"",//媒体类型
               // handlers:{}, //显示前显示后事件
                //praviate 
                init:function(){
                    this.initTemplate(this.mediaType);
                    var mediaHtml ="";
                this.outDom = $( this.el );
                    if(this.outDom[0]){
                         mediaHtml = this.renderBody();
                         var container = this.container = $(mediaHtml);
                         this.media_parent = container.find("div[op='media_parent']");
                         if($("#media_"+this.id)[0]){
                            $("#media_"+this.id).hide();
                            $("#media_"+this.id).remove();
                         }
                     
                    }else{
                        //alert("未指定加载容器");
                        return false;
                    }
                    this.initEvent();
                    this.render();
                },
        //播放器容器，播放器模板
                initTemplate:function(type){
                    var tpl =  {};
                    if(this.mediaType == "video"){
                        tpl.container = ["<div class='vdo_play media_player' id='media_{id}' style='display:block;'><b class='vdoloading'><img src='http://img1.kaixin001.com.cn/i/home/dt_loading.gif'></b>" ,
                                     "{player}<p><a class='original' id='org_href_{id}' title='查看原视频' href='#'></a><a id='media_close_{id}' title='收起' href='#'></a></p></div>"];   
                        var type = this.getVideoType();
                        switch(type){
                            case "videox":tpl.player = ['<div style="background:transparent;width:{p_width}px;" op="media_parent" ><object id=mdflash_{id} type="application/x-shockwave-flash" data="{src}" width="{width}" height="{height}">',
                                            '<param name="movie" value="{src}" />',
                                            '<param name="quality" value="high" />',
                                            '<param name="wmode" value="transparent">',
                                            '<param name="allowFullscreen" value="true">',
                                            '<param name="allowScriptAccess" value="always" />',
                                            '<param name="flashvars" value="playMovie=true&amp;{flashvars}">',
                                            '</object></div>'];
                                            break;
                            case "video" :  tpl.player = ['<div style="background:transparent;width:{p_width}px;" op="media_parent" ><embed name="mdflash_{id}" width="{width}" height="{height}" ',
                                        'wmode="transparent" flashvars="playMovie=true&amp;{flashvars}" autostart="true" ',
                                        'allownetworking="internal" allowfullscreen="true" quality="high" ',
                                        'allowscriptaccess="never" type="application/x-shockwave-flash" ',
                                        'pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" ',
                                        'src="{src}"></embed></div>'] ;
                                        break;    
                           }
                    }else if(this.mediaType =="audio"){
                         var type = this.getAudioType(this.mediapro.src);
                         switch(type){
                              case "mp3":tpl.container = ["<div class='ado_i media_player' id='media_{id}' style='display:block;width:215px;background-image:none;'>{player}</div>"]; 
                                        tpl.player = ['<embed name="mdflash_{id}"  pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" allowfullscreen="false" allowscriptaccess="always" bgcolor="#ffffff"' ,
                                                       'salign="lt" scale="noscale" quality="high" menu="false" loop="false" wmode="transparent" height="32" width="317" align="middle" ',
                                                       'src="http://{_IMGHOST_}/swf/diary/musicplayer_records-2.swf" ' ,
                                                       'FlashVars="url={src}&amp;autoplay=1&amp;domain={_WWW_HOST_}"/>'];
                                                       break;
                              case "wma":tpl.container = ["<div class='ado_i media_player' id='media_{id}' style='display:block;width:210px;height:55px;background-image:none;'>{player}</div>"];
                                         tpl.player =['<object id=mdflash_{id} width="{o_width}" height="45" classid="CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" >',
                                                      '<param value="-1" name="autostart" />',
                                                      '<param value="0" name="showstatusbar" />',
                                                      '<param value="1" name="playcount" />',   
                                                       '<param  value="{src}"  name="filename" />',
                                                       '<param value="transparent" name ="wmode" />',
                                                      '<embed name="mdflash_{id}" width="{o_width}" height="45"  type="application/x-mplayer2" src="{src}" wmode="transparent" showstatusbar="0" AutoStart="-1" PlayCount="1" clicktoplay="-1" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"></embed>',
                                                       '</object>'];
                                                       break;
                         }
                         
                    }
                    this.template = tpl;
                },
                initEvent:function(){
                    var me  = this, container= this.container,handlerDom = this.handlerDom;
                    var id = me.id;
                    container.find("#org_href_"+id).click(function(){
                           var url = me.mediapro.localurl ;
                           window.open(url,"_blank");
                           return false;
                    });
                    container.find("#media_close_"+id).click(function(){
                           me.hideMedia();
                           return false;
                    });
                    container.bind("click",function(event){
                         var ev_obj = $(event.target);
                          
                    });
                },
                //根据不同视频源，获得相关参数
                getAutoPlayParam:function(url){
                        var autoVar, host,
                        link = document.createElement('a'),
                        autoSet = ['auto=true', 'auto=1', 'isAutoPlay=true', 'isAutoPlay=1', 'autoPlay=true', 'autoPlay=1','autoplay=true'];
                            
                        link.href = url;
                        host = link.hostname;
                        if(host.indexOf('youku.com') !== -1) {
                            autoVar = autoSet[2];
                        } else if(host.indexOf('tudou.com') !== -1) {
                            autoVar = autoSet[4];
                        } else if(host.indexOf('sina.com') !== -1) {
                            autoVar = autoSet[5];
                        } else if(host.indexOf('ku6.com') !== -1) {
                            autoVar = autoSet[1];
                        } else if(host.indexOf('56.com') !== -1){
                            autoVar = "autoplay=1";
                        } else if(host.indexOf('sohu.com') !== -1){
                            autoVar =autoSet[6];
                        } else {
                            autoVar ="auto=1";
                        }
                        link = null;
                        return autoVar;
                },
                //获得视频类型
                getVideoType:function(){
                    if( Browser.isIE && !Browser.isIE9){
                        return "videox";        
                    }else{
                        return "video";
                    }
                },
                //获得音乐文件类型
                getAudioType:function(src){
                     if(src.lastIndexOf(".mp3") !== -1){
                        return "mp3";
                     }else if(src.lastIndexOf(".wma") !==-1){
                        return  "wma";
                     }
                },
                //根据模板，生成播放器外容器
                renderBody:function(){
                     var me =this,tpl = me.template,mediapro = me.mediapro;
                     var bodyTpl =  me.template.container;
                     var body = {id:me.id,width:me.width,height:me.height};
                     var mpro = { id:me.id,
                                  width:mediapro.width,
                                  height:mediapro.height,
                                  src :mediapro.src
                                };
                     body.player = this.renderPlayer(mpro,tpl.player);
                     var btpl = {};//new Kx.HtmlTpl(tpl.container);

                     return $.tmpl( tpl.container.join(''), body ); //btpl.applyTpl(body);       
                },
                //根据模板，生成播放器
                renderPlayer:function(mpro,playerTpl){
                    var autoVar =  this.getAutoPlayParam(mpro.src);
                    var  player_pro = {id:mpro.id,
                                       p_width:(parseInt(mpro.width)),
                                       width:mpro.width,
                                       height:mpro.height,
                                       src:mpro.src,
                                       flashvars:autoVar,
                                       o_width:o_width
                                      };
                    var player = {};// new Kx.HtmlTpl(playerTpl);
                    return $.tmpl( playerTpl.join(''),  player_pro );//player.applyTpl(player_pro);
                },
                //根据options，将播放器插入DOM结构中
                afterInsert:function(container,index){
                    this.outDom.after(container);
                },
                beforeInsert:function(container,index){
                    this.outDom.before(container);
                },
                innerInsert:function(container,index){
                
                    if(typeof index!=="undefind" && index !=null){
                       if(index>=0){
                           container.insertAfter($(this.outDom.children()[index]));
                       }else{
                           container.prependTo(this.outDom);
                       }   
                    }else{
                        this.outDom.append(container);
                    }
                    
                },
                outerInsert:function(container,index){
                    var dom =  this.outDom;
                    container.append(dom.get(0));
                    dom.after(container);
                    dom.hide();     
                },
                //public
                getContainer:function(){
                    return this.container;
                },
                //调用相关函数，将播放器插入DOM中
                render:function(){
                    var funcName = this.insertMode+"Insert";
                    this[funcName](this.container,this.insertIndex);
                },
                //显示
                show:function(){
                   this.fire("show",this);
                   this.container.show(800);
                },
                //隐藏
                hideMedia:function(){
                    this.container.hide();
                    this.container.remove();
                    this.fire("hide",this);
                },
                //显示前的回调（已有 event 代替）
                beforeShow:function(){
                    var me=this,hdl_obj = me.handlers;
                    if(hdl_obj.beforeShow){
                         hdl_obj.beforeShow(me);                        
                    }
                },
                //关闭后的回调（已有 event 代替）
                afterHide:function(){
                    var me=this,hdl_obj = me.handlers;
                    if(hdl_obj.afterHide){
                         hdl_obj.afterHide(me);                     
                    }
                },
                setMediaParentCss:function(value){
                    this.media_parent.css(value);
                }
                
        };
        return MediaBox;
});
