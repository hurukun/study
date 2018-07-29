<?php
require( 'global.php' );

class CAIndex extends CB_Application{
    function main(){
        $smarty = CL_SmartyFactory::instance();
        $smarty->display( 'motto/index.tpl' );
    }
}

$app = new CAIndex();
$app->run();
?>