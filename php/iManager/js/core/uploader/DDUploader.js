/*global K:false,define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/

define( 'core/uploader/DDUploader', ['jQuery'], function( require ){
    var $ = require( 'jQuery' ),
        Util = require( 'Util' );

    var default_settings = {
        enterbackcolor:"#CDEB8B",
        filetypes:'*',
        filelimit: 8*1024*1024
    };


    /**
     * HTML5 FileReader and XMLHttpRequest2
     */
    var HTML5Uploader = function( opts ){
        /**
         * not support html5 uploader
         */
        if ( !window.File || !window.FileList || !window.FileReader) {
            return;
        }
        this.input = $( opts.input );
        this.dragBox = $( opts.dragBox );
        /**
         * 上传接口
         * @type {string}
         */
        this.uploadUrl = opts.url;
        /**
         * 允许的上传文件类型
         * @type {string}
         */
        this.fileTypes = opts.fileTypes;
        /**
         * 上传文件大小
         * @type {number}
         */
        this.fileLimit = opts.fileLimit;
        /**
         * 附加数据
         */
        this.postData = opts.postData;
        /**
         * 读取文件内容成功
         * @type {function}
         */
        this.fnFileLoaded = opts.fileLoaded || function( name, data){};
        /**
         * 显示进度
         * @type {function}
         */
        this.fnProcess = opts.showProcess || function(name, percent){};
        /**
         * 成功回调
         * @type {function}
         */
        this.fnSuccess = opts.success || function(){};
        /**
         * 失败回调
         * @type {function}
         */
        this.fnError = opts.error || function(){};

        this.init();

    };
    Util.mix( HTML5Uploader.prototype, {
        init:function(){
            // file select
            this.input.bind("change", $.proxy( this.onUpload, this ) );

            // is XHR2 available?
            var xhr = new XMLHttpRequest();
            if (xhr.upload) {
                // file drop
                this.dragBox[0].addEventListener("drop", $.proxy( this.onUpload, this ) );
            }
        },
        /**
         * begin to upload
         * @param {event object} e 拖拽消息，或input change消息；
         */
        onUpload: function(e) {
            // fetch FileList object
            var files = e.target.files || e.dataTransfer.files;
            // process all File objects
            var ii = 0,
                file = {};
            for ( ii= 0; file = files[ii]; ii++) {
                /* check file ext */
                    var filename = file.name.split('.'),
                        ext = filename[filename.length-1];

                    if ( this.fileTypes === '*' || this.fileTypes.indexOf(ext) >= 0 ){
                        this.showFileBrief( file );
                        this.uploadFile( file );
                    }
                    else{
                        this.fnError( {file:file, errmsg: 'unsupported file type.'} )
                    }
            }
        },
        /**
         * output file information
         */
        showFileBrief: function(file) {
            var me = this;
            // display an image
            if (file.type.indexOf("image") == 0) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    me.fnFileLoaded( file.name, e.target.result );
                }
                reader.readAsDataURL(file);
            }

            // display text
            if (file.type.indexOf("text") == 0) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    me.fnFileLoaded( file.name, e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") );
                }
                reader.readAsText(file);
            }
        },
        /**
         * upload files
         */
        uploadFile: function(file) {
            var me = this,
                xhr = new XMLHttpRequest();
            if (xhr.upload ) {
                // progress bar
                xhr.upload.addEventListener("progress", function(e) {
                    var pc = parseInt(100 - (e.loaded / e.total * 100));
                    me.fnProcess( file.name, pc );
                }, false);
                // file received/failed
                xhr.addEventListener("error", me.fnError, false );
                xhr.onreadystatechange = function(e) {
                    e.file = file;
                    if (xhr.readyState == 4) {
                        if( xhr.status === 200 ){
                            me.fnSuccess && me.fnSuccess.call( xhr, e );
                        }
                        else{
                            me.fnError && me.fnError.call( xhr, e );
                        }
                    }
                };
                // start upload
                xhr.open("POST", this.uploadUrl, true);
                xhr.setRequestHeader("X_FILENAME", file.name);
                xhr.send(file);
            }
        },
        uploadWithFormData: function( files ){
            /*
             * FormData for XMLHttpRequest 2  -  Polyfill for Web Worker  (c) 2012 Rob W
             * License: Creative Commons BY - http://creativecommons.org/licenses/by/3.0/
             * - append(name, value[, filename])
             * - toString: Returns an ArrayBuffer object
             * 
             * Specification: http://www.w3.org/TR/XMLHttpRequest/#formdata
             *                http://www.w3.org/TR/XMLHttpRequest/#the-send-method
             * The .append() implementation also accepts Uint8Array and ArrayBuffer objects
             * Web Workers do not natively support FormData:
             *                http://dev.w3.org/html5/workers/#apis-available-to-workers
             **/
            (function() {
                var debug= window.FormData? false: true;
                if (debug===true) {
                    // Export variable to the global scope
                    (this == undefined ? self : this)['FormData'] = FormData;   
                 
                    var ___send$rw = XMLHttpRequest.prototype.send;
                    XMLHttpRequest.prototype['send'] = function(data) {
                        if (data instanceof FormData) {
                            if (!data.__endedMultipart) data.__append('--' + data.boundary + '--\r\n');
                            data.__endedMultipart = true;
                            this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + data.boundary);
                            data = new Uint8Array(data.data).buffer;
                        }
                        // Invoke original XHR.send
                        return ___send$rw.call(this, data);
                    };
                 
                    var ___open$rw = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype['open'] = function() {
                        console.log(arguments);
                        // Invoke original XHR.open
                        return ___open$rw.apply(this, arguments);
                    };
                 
                    function FormData() {
                        var myself=this;
                        // Force a Constructor        
                        if (!(this instanceof FormData)) return new FormData();
                        //得到参数的类型？
                        // var argumentsType = Object.prototype.toString.call(arguments[0]);
                        // console.log("argumentsType???"+argumentsType);
                 
                 
                        // Generate a random boundary - This must be unique with respect to the form's contents.
                        this.boundary = '------WebKitFormBoundary' + Math.random().toString(36);
                        var internal_data = this.data = [];
                        this.args=arguments;
                        
                        var internal_data_string=this.data_string=[];
                        /**
                        * Internal method.
                        * @param inp String | ArrayBuffer | Uint8Array  Input
                        */
                        this.__append = function(inp) {
                            var i=0, len;
                            if (typeof inp === 'string') {
                                internal_data_string.push(inp);
                                for (len=inp.length; i<len; i++){
                                    internal_data.push(inp.charCodeAt(i) & 0xff);                   
                                }
                            } else if (inp && inp.byteLength) {/*If ArrayBuffer or typed array */   
                                if (!('byteOffset' in inp))   /* If ArrayBuffer, wrap in view */
                                    inp = new Uint8Array(inp);
                                for (len=inp.byteLength; i<len; i++)
                                    internal_data.push(inp[i] & 0xff);
                            }
                        };
                 
                    //使用了JQ和UNDERSCORE，来搞定传入的如果是一个现有FORM时的问题
                    if (arguments[0] instanceof HTMLFormElement){
                        var form_ser=$(arguments[0]).serializeArray();
                              //console.log("I am a HTMLFormElement");
                              //console.log(form_ser);
                        _.each(form_ser, function(item){ 
                                //console.log("I am in each");
                                //console.log(item.name);
                                myself.append(item.name,item.value);
                        });
                                
                        }
                    }
                    /**
                    * @param name     String                                  Key name
                    * @param value    String|Blob|File|Uint8Array|ArrayBuffer Value
                    * @param filename String                                  Optional File name (when value is not a string).
                    **/
                    FormData.prototype['append'] = function(name, value, filename) {
                        if (this.__endedMultipart) {
                            // Truncate the closing boundary
                            this.data.length -= this.boundary.length + 6;
                            this.__endedMultipart = false;
                        }
                        var valueType = Object.prototype.toString.call(value),
                            part = '--' + this.boundary + '\r\n' + 
                                'Content-Disposition: form-data; name="' + name + '"';
                 
                        if (/^\[object (?:Blob|File)(?:Constructor)?\]$/.test(valueType)) {
                            return this.append(name,
                                            new Uint8Array(new FileReaderSync().readAsArrayBuffer(value)),
                                            filename || value.name);
                        } else if (/^\[object (?:Uint8Array|ArrayBuffer)(?:Constructor)?\]$/.test(valueType)) {
                            part += '; filename="'+ (filename || 'render.png').replace(/"/g,'%22') +'"\r\n';
                            part += 'Content-Type: image/png\r\n\r\n';
                            this.__append(part);
                            this.__append(value);
                            part = '\r\n';
                        } else {
                            part += '\r\n\r\n' + value + '\r\n';
                        }
                        this.__append(part);
                    };
                };//End of debug==true??
            })(); 
            var formData = new FormData();
            //将所有文件插入formData
            for (var i=0; i<files.length; i++) {
                formData.append( files[i].name, files[i] );
            }
                         
            var xhr = new XMLHttpRequest();
            xhr.open('POST',this.uploadUrl,true);
            //即可上传
            xhr.send(formData);
        }
    });



    /*jQuery Object*/
    var DDUploader = function (container, settings) {
        this.container = $(container);
        this.savedBackColor = this.container.css( 'background-color');
        this.enterbackcolor = settings.enterbackcolor || default_settings.enterbackcolor;

        new HTML5Uploader({
            url: settings.posturl,
            fileTypes: settings.filetypes || default_settings.filetypes,
            fileLimit: settings.filelimit || default_settings.filelimit,
            dragBox: this.container[0],
            postData: settings.postdata_handler,
            fileLoaded: settings.loadedhandler,
            showProcess: settings.progresshandler,
            success: settings.onupload_success_handler,
            error: settings.onupload_failed_handler
        });

        this.bindEvents();
    };

    Util.mix( DDUploader.prototype, {
        bindEvents: function(){
            var me = this;

            this.container[0].addEventListener("dragenter", function(event){
                event.stopPropagation();
                event.preventDefault();
                me.container.css( 'background-color', me.enterbackcolor );
            }, false);
            this.container[0].addEventListener("dragover", function(event){
                event.stopPropagation();
                event.preventDefault();
                me.container.css( 'background-color', me.enterbackcolor );
            }, false);
            this.container[0].addEventListener("dragleave", function(event){
                event.stopPropagation();
                event.preventDefault();
                me.container.css( 'background-color', me.savedBackcolor );
            }, false);
            this.container[0].addEventListener("drop", function(event){
                event.stopPropagation();
                event.preventDefault();
                me.container.css( 'background-color', me.savedBackColor);
            }, false);
        },
        upload_error: function (error) {
            alert("ddu upload error: " + error.code);
        }
    });
    return DDUploader;
} );