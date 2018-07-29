/*global K:false,define:false,window:false,document:false,setTimeout:false,clearTimeout:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/

define('core/camera/Camera', ['jQuery'], function( require ){
    var $ = require( 'jQuery' ),
        SWFObject = window.SWFObject,
        Util = K,
        UCamera = null;

    /**
     * flash 回调的全局函数
     * @param  {string} command 
     * @param  {sgring} value   
     */
    window.cam_swf_DoFSCommand = function(command, value) {
        /**
         * 未检查到摄像头
         */
        if (command === "noCamera") {
            UCamera.swfParent.trigger('camera:nocamera', []);
        } 
        /**
         * 用户拒绝访问摄像头
         */
        else if (command === "denyCamera") {
            UCamera.swfParent.trigger('camera:deny', []);
        } 
        /**
         * 还未允许摄像头访问
         */
        else if( command === 'isCamMuted' ){
            UCamera.swfParent.trigger('camera:muted', []);
        }
        /**
         * 允许摄像头
         */
        else if (command === "allowCamera") {
            UCamera.allowcamera = true;
        } 
        /**
         * 拍照后返回图像数据
         */
        else if (command === "getCameraData") {
            UCamera.photodata = value;
            UCamera.swfParent.trigger('camera:shot');
        } 
        /**
         * 重拍
         */
        else if (command === "resetCameraData") {
            UCamera.photodata = "";
            UCamera.swfParent.trigger('camera:reset');
        } 
        /**
         * 图像保存到服务器成功
         */
        else if(command === "saveOk") {
            var r = $.parseJSON(value);
            UCamera.swfParent.trigger('camera:saveok', [r.iconsrc]);
        } 
        /**
         * 图像保存到服务器失败
         */
        else if(command === "saveFail") {
            UCamera.swfParent.trigger('camera:savefail');
        }
    };

    /**
     * flash 操作摄像头
     */
    var Camera = function( options ){
        this.swfParent = $( options.parent );
        /**
         * flash 的 ID
         * @type {String}
         */
        this.swfId = options.id || 'cam_swf';
        this.btnShot = $( options.btnShot );
        this.swfWidth = options.width;
        this.swfHeight = options.height;

        this.saveUrl = options.saveUrl || '/set/aj_camera_upload.php';

        this.allowcamera = false;
        this.photodata = "";

        UCamera = this;

        this.init();
        this.bindEvents();
    };

    Util.mix( Camera.prototype, {
        /**
         * 初始化 flash
         */
        init : function() {
            if( !$("#" + this.swfId ).length ) {
                this.oswf = new SWFObject("/swf/cam.1.6.swf", this.swfId, this.swfWidth, this.swfHeight, "0", "#ffffff", true);
                this.oswf.addParam("allowscriptaccess", "always");
                this.oswf.addParam("wmode", "Transparent");
                this.oswf.addParam("menu", "false");
                this.oswf.addParam("quality", "high");
                this.oswf.addVariable("autoplay","0");
                this.oswf.addVariable( 'saveurl', this.saveUrl );
                /**
                 * 添加 flash 入 DOM
                 */
                this.oswf.write( this.swfParent.attr( 'id' ) );
            }
        },
        /**
         * 绑定相关事件
         */
        bindEvents: function(){
            var me = this;
            this.btnShot.bind( 'click', function( evt ){
                /**
                 * 拍照或重拍
                 */
                evt.preventDefault();
                evt.stopPropagation();

                me.shot();

                return false;
            } );
        },
        /**
         * 重载 flash
         */
        reload: function(){
            /**
             * 删除旧 flash
             */
            $("#" + this.swfId ).remove();
            /**
             * 加入新flash;
             */
            this.init();
        },
        /**
         * 设置 flash 开始重拍
         */
        reset : function () {
            this.photodata = "";
            if (this.allowcamera) {
                $( '#' + this.swfId )[0].reset();
            } else {
                try {
                    $( '#' + this.swfId )[0].reset();
                } catch(e) {
                    this.swfParent.trigger('camera:resetfail', []);
                }
            }
        },
        /**
         * 保存头像
         */
        save : function () {
            /**
             * 还未拍照
             */
            if( this.photodata.length === 0 ) {
                window.alert( '\u8BF7\u5148\u62CD\u7167\uFF01' );
                return;
            } try {
                $( '#' + this.swfId )[0].save();
            } catch(e) {
                this.swfParent.trigger('camera:savefail', []);
            }
        },
        /**
         * 拍照
         */
        shot : function () {
            if( this.hasData() ){
                this.reset();
                return;
            }
            if (this.allowcamera) {
                $( '#' + this.swfId )[0].shot();
            } else {
                try {
                    $( '#' + this.swfId )[0].shot();
                } catch(e) {
                    this.swfParent.trigger('camera:shotfail', []);
                }
            }
        },

        /**
         * 是否有图像数据
         */
        hasData: function(){
            return !( this.photodata === '' );
        }

    } );

    return Camera;

});
