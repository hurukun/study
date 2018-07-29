/*global define:false,window:false,document:false*/
/*jslint sloppy: true,nomen:true,white: true, vars:true*/
/**
 * @title 元素与文件的拖拽
 */
/**
 * 元素拖拽
 */
GD.App( 'apps/tester/ADragDrop' ).define( function( require ){
    var $ = require( 'jQuery' );

    return {
        container:'#mainContent',
        main: function(){
            this.build();
            this.bindLocalEvents();
        },
        build: function(){
            var html = [
                '<style>',
                    '#drag_ele_src > *{float: left;}',
                    '#drag_ele_src > img{border: thin solid black;padding: 2px;margin: 4px;}',
                    '#drag_ele_dst{border: thin solid black;margin: 4px;}',
                    '#drag_ele_dst{height: 123px;width: 220px;text-align: center; display: table;}',
                    '#drag_ele_dst > p{display: table-cell;vertical-align: middle;}',
                    'img.dragged{background-color: Orange;}',
                '</style>',
                '<p>元素拖拽</p>',
                '<div id="drag_ele_src" style="display:block;width:100%;">',
                    '<img draggable="true" id="car1" src="/resource/image/sample/01.jpeg" alt="car1" />',
                    '<img draggable="true" id="car2" src="/resource/image/sample/02.jpeg" alt="car2" />',
                    '<img draggable="true" id="car3" src="/resource/image/sample/03.jpeg" alt="car3" />',
                    '<div id="drag_ele_dst">',
                        '<p id="msg">drop here</p>',
                    '</div>',
                '</div>',
                '<div style="clear:both;"></div>' ].join('');
            this.container.append( html );
        },
        bindLocalEvents: function(){
            var src = document.getElementById("drag_ele_src");
            var target = document.getElementById("drag_ele_dst");
            target.ondragenter = handleDrag;
            target.ondragover = handleDrag;
            function handleDrag(e) {
              e.preventDefault();
            }
            target.ondrop = function (e) {
              var droppedID = e.dataTransfer.getData("Text");
              var newElem = document.getElementById(droppedID).cloneNode(false);
              target.innerHTML = "";
              target.appendChild(newElem);
              e.preventDefault();
            }
            src.ondragstart = function (e) {
              e.dataTransfer.setData("Text", e.target.id);
              e.target.classList.add("dragged");
            }
            src.ondragend = function (e) {
              var elems = document.querySelectorAll(".dragged");
              for (var i = 0; i < elems.length; i++) {
                  elems[i].classList.remove("dragged");
              }
            }
        }
      };
});
/**
 * 文件拖拽上传
 */
GD.App( 'apps/tester/ADragUploader', [ 'core/uploader/DDUploader' ] ).define( function( require ){
    var $ = require( 'jQuery' ),
        DDUploader = require( 'core/uploader/DDUploader' ),
        Util = require( 'Util' )  ;

    return {
        container:'#mainContent',
        api: {
          upload: Util.parseAPI( "/example/uploader/ajax_uploader.php" )
        },
        main: function(){
            this.build();

            new DDUploader('#dragtohere', {
                    posturl : this.api.upload,
                    postdata_handler : $.proxy( this.postdata_handler, this) ,
                    loadedhandler : $.proxy( this.loadedhandler, this),
                    progresshandler : $.proxy( this.progresshandler, this),
                    onupload_success_handler : $.proxy( this.onupload_success_handler, this),
                    onupload_failed_handler: $.proxy( this.onupload_failed_handler, this)
            });
        },
        /**
         * create related DOM elements
         */
        build: function(){
            var html = [
                '<p>文件拖拽上传</p>',
                '<form enctype="multipart/form-data" action="', this.api.upload ,'" method="post"> ',
                '<input type="hidden" name="max_file_size" value="100000"> ',
                '<input name="files[]" type="file">　　 ',
                '<input type="submit" value="上传文件"> ',
                '</form>',
                 '<style type="text/css">',
                    '#dragtohere {',
                      'width:552px;',
                      'height: 152px;',
                      'margin: 20px auto;',
                      'border:2pt solid black;',
                    '}',
                '</style>',
                '<div id="display-area">',
                  '<h2>Drag and Drop Upload Sample</h2>',
                  '<div id="dragtohere">Drag and Drop to here</div>',
                  '<div id="progressbar"></div>',
                  '<div id="result"></div>',
                '</div>'
            ].join('');
            this.container.append( html );
        },
        /**
         * post data in 'Content-Disposition'
         */
        postdata_handler : function(file, container){   
            return '{"albumid":"'+ container.id +'","filename":"'+file.name+'"}';
        },
        /**
         * handler on local file loaded
         */
        loadedhandler : function(fileName, fileContent){   
            console.log( fileName + ':' + fileContent );
        },
         /**
          * handler on upload progress
          */
        progresshandler : function(file, percentage, container){  
            console.log(percentage);
        },
        /**
         * handler on success upload(status = 200)
         */
        onupload_success_handler : function(xhr, evt, container){   
            console.log(xhr.responseText);
        },
        /**
         * handler on failed upload(status != 200)
         */
        onupload_failed_handler : function(evt){   
            if( evt.errmsg ){
              alert( evt.errmsg );
            }
            else{
              alert( 'unknown error type' );
            }
        }
    };
});


