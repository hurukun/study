<?php
/**
 * 退出
 */
require_once( 'global.php' );

 class CALogout extends CB_Ajax{
    function __construct(){
        parent::__construct();
    }
    function main(){
        $smarty = CL_SmartyFactory::instance();

        //获取 关键字
        $auth = new CA_Auth_Authorize(); 
        $auth->logout();
        $this->data[ 'suc' ] = true;
    }
}

$app = new CALogout();
$app->run();

?>