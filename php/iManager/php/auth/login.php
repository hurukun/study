<?php
/**
 * 注册页
 */
require_once( 'global.php' );

define( NEED_NO_AUTH, 'true' );

 class CALogin extends CB_Application{
    function __construct(){
        parent::__construct();
    }
    function main(){
        $smarty = CL_SmartyFactory::instance();
        //显示 页面
        $smarty->display( "auth/login.tpl" );
    }
}

$app = new CALogin();
$app->run();

?>