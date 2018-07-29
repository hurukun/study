<?php
    class CC_Uploader {
        function __construct(){
        }
        /**
         * 开始接受文件上传
         */
        public static function start($filesKey= 'files',  $destDir = UPLOAD_DIR ){
            if( !file_exists(  $destDir ) ){  
                mkdir(  $destDir );  
            }

            $fn = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);
            /**
             * AJAX call
             * @javascript code:
             *             var files = e.target.files || e.dataTransfer.files;
             *             forEach( files, function( file ){} );
             *             xhr.open("POST", url, true);
             *             xhr.setRequestHeader("X_FILENAME", file.name);
             *             xhr.send(file);
             */
            if ($fn) {
                echo 'streamUpload';
                file_put_contents(
                    $destDir.date('ymdHis').$fn,
                    file_get_contents('php://input')
                );
            }
            /**
             * form submit
             * @javascript code:
             *             Content-Disposition: form-data; name="files[]"; filename="..."
             *             Content-Type: text/php
             */
            else {
                $files = $_FILES[ $filesKey ];
                foreach ($files['error'] as $id => $err) {
                    /**
                     * $err :UPLOAD_ERR_OK == 0, UPLOAD_ERR_SIZE == 2
                     */
                    if ($err == UPLOAD_ERR_OK) {
                        $fn = $files['name'][$id];
                        move_uploaded_file(
                            $files['tmp_name'][$id],
                            $destDir.date('ymdHis') . $fn
                        );
                    }
                    else{
                        echo $err;
                    }
                }/*foreach*/
            }/*if else*/
        }/*function start*/
    };
?>