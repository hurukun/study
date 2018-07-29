/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title Cavans的应用
 */
GD.App( 'apps/tester/ACanvasClock' ).define( function( require ){
    var $ = require( 'jQuery' );

    return {
        container: '#mainContent',
        main:function(){ //数据初始化  
            this.init();
            this.canvas = document.getElementById('canvasContainer');  
            this.cxt = this.canvas.getContext("2d");  
            this.drawSomething();  
            window.setInterval( $.proxy( this.drawClock, this ),1000);  
        },
        init: function(){
            var html = [
                '<canvas width="500" height="500" id="canvasContainer">Your Browser does not support Canvas</canvas>  '
            ].join( '' );
            this.container.append( html );
        },
        savePic:function(){//图片保存方法  
            var img = new Image();  
            img.src = this.canvas.toDataURL();//这句是重点  
            document.body.appendChild(img);  
        },
        changePic:function(pic){  
            pic = "images/"+pic+".png";  
            var img = document.getElementById("myimg");  
            img.onload = function(){  
                ctx.drawImage(img,0,0,128,128,150,0,200,200);//右侧背景图片显示,以区别时钟区域的刷新  
            }  
            img.src = pic;  
        },
        drawClock: function() {
            var now = new Date();
            var sec = now.getSeconds();
            var min = now.getMinutes();
            var hour = now.getHours();
            hour > 12 ? hour - 12 : hour;
            hour += (min / 60);

            var cxt = this.cxt;

            //先清空画布
            cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);


            //美女图片作为表盘背景    
            var img = new Image();
            img.src = "tw.png";
            cxt.drawImage(img, 46, 46);
            //img.onload = function () {
            //    cxt.drawImage(img, 0, 0);
            //}

            //画表盘大圆 圆心：x=250 y=250
            cxt.strokeStyle = "#00FFFF";
            cxt.lineWidth = 10;
            cxt.beginPath();
            cxt.arc(250, 250, 200, 0, 360);
            cxt.stroke();
            cxt.closePath();

            //时刻度
            for (var i = 0; i < 12; i++) {
                cxt.save();//保存当前状态
                cxt.lineWidth = 7;
                cxt.strokeStyle = "#FFFF00";

                //设置原点
                cxt.translate(250, 250);
                //设置旋转角度
                cxt.rotate(30 * i * Math.PI / 180);//弧度   角度*Math.PI/180
                cxt.beginPath();
                cxt.moveTo(0, -175);
                cxt.lineTo(0, -195);
                cxt.stroke();
                cxt.closePath();
                cxt.restore();//把原来状态恢复回来
            }

            //分刻度
            for (var i = 0; i < 60; i++) {
                cxt.save();
                cxt.lineWidth = 5;
                cxt.strokeStyle = "#FFFF00";
                cxt.translate(250, 250);
                cxt.rotate(i * 6 * Math.PI / 180);
                cxt.beginPath();
                cxt.moveTo(0, -185);
                cxt.lineTo(0, -195);
                cxt.stroke();
                cxt.closePath();
                cxt.restore();
            }


           
            //以下的时针、分针、秒针均要转动，所以在这里要设置其异次元空间的位置
            //根据当前的小时数、分钟数、秒数分别设置各个针的角度即可
            //-----------------------------时针-----------------------------
            cxt.save();
            cxt.lineWidth = 7;
            cxt.strokeStyle = "#00FFFF";
            cxt.translate(250, 250);
            cxt.rotate(hour * 30 * Math.PI / 180);//每小时旋转30度
            cxt.beginPath();
            cxt.moveTo(0, -130);
            cxt.lineTo(0, 10);
            cxt.stroke();
            cxt.closePath();
            cxt.restore();

            //-----------------------------分针-----------------------------
            cxt.save();
            cxt.lineWidth = 5;
            cxt.strokeStyle = "#FFFF00";
            cxt.translate(250, 250);
            cxt.rotate(min * 6 * Math.PI / 180);//每分钟旋转6度
            cxt.beginPath();
            cxt.moveTo(0, -150);
            cxt.lineTo(0, 10);
            cxt.stroke();
            cxt.closePath();
            cxt.restore();

            //-----------------------------秒针-----------------------------
            cxt.save();
            cxt.lineWidth = 3;
            cxt.strokeStyle = "#FF0000";
            cxt.translate(250, 250);
            cxt.rotate(sec * 6 * Math.PI / 180);//每秒旋转6度
            cxt.beginPath();
            cxt.moveTo(0, -170);
            cxt.lineTo(0, 10);
            cxt.stroke();
            cxt.closePath();


            //美化表盘，画中间的小圆
            cxt.beginPath();
            cxt.arc(0, 0, 7, 0, 360);
            cxt.fillStyle = "#FFFF00";
            cxt.fill();
            cxt.strokeStyle = "#FF0000";
            cxt.stroke();
            cxt.closePath();

            //秒针上的小圆
            cxt.beginPath();
            cxt.arc(0, -140, 7, 0, 360);
            cxt.fillStyle = "#FFFF00";
            cxt.fill();
            cxt.stroke();
            cxt.closePath();
            cxt.restore();


            //显示时间
            cxt.font = "18px 微软雅黑";
            cxt.lineWidth = 2;
            cxt.fillStyle = "#0000FF";
            hour=now.getHours();
            var str = hour > 10 ? hour : ("0" + hour) + ":" + (min > 10 ? min : ("0" + min))
            cxt.fillText(str, 225, 380);

            //中国制造
            cxt.font = "12px 宋体";
            cxt.lineWidth = 1;
            cxt.fillText("Made In China", 210, 400);
        },
        drawSomething:function(){//显示年月日,与右侧时钟背景作用类似,以区别这里不被重绘  
            var ctx = this.cxt;

            ctx.fillStyle = "#eee";  
            ctx.fillRect(0,0,640,480);  
            ctx.fillStyle = "#333";  
            ctx.fillRect(0,128,128,20);  
            ctx.fillStyle = "#fff";  
            ctx.font = "14px Arial";  
            ctx.textAlign = "center";  
            ctx.textBaseline = "top";  
            var dt = new Date();  
            var dy = dt.getFullYear(),dm=dt.getMonth()+1,dd=dt.getDate();  
            var str = dy + "年" + dm+"月" + dd + "日";  
            ctx.fillText(str,64,128);  
        }
    };
} );

GD.App( 'apps/tester/ACanvas' ).define( function ( require ){
    var   $ = require( 'jQuery' ),
        Util = require( 'Util' ),
        Env = require( 'Env' );

    return {
    container: '#mainContent',
    events: {
        'click #btnCopyImg' : '_onCopyImg'
    },
    main: function(){
                this._build();
                this._draw();
                this._bindEvents();
            },
            _build: function(){
                var ele = $([
                        '<div style="margin:15px;">',
                            '<canvas id="canvas" style="float:left;width:400px;height:200px;"/>',
                            '<button id="btnCopyImg" style="width:100px;height:25px;">获取图像</button>',
                            '<img id="img"/ style="float:right;margin:10px;">',
                        '</div>'
                    ].join('') );
                ele.appendTo( this.container );
            },
            _bindEvents: function(){
            },
            _draw: function(){
                var canvas = $('#canvas')[0],
                    context  = canvas.getContext( '2d' );

                context.fillStyle="#00aa88";
                context.fillRect( 10,20,100,100 );

            },
            _onCopyImg: function( evt ){
                $('#img').attr( 'src',  $('#canvas')[0].toDataURL() );
            }
    };

} );