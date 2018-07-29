<?php
require_once( 'global.php' );

class CAJUploader extends CB_Ajax{
    function main(){    
        CC_Uploader::start();

        $this->data[ 'suc' ] = true;    
    }
};

$app = new CAJUploader();
$app->run();

?>