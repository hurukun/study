<?php
/**
 * 登录
 */
require_once( 'global.php' );

 class CAUserCard extends CB_Ajax{
    function __construct(){
        parent::__construct();
    }
    function main(){
        $smarty = CL_SmartyFactory::instance();

        //获取注册数据
        $uid = $_POST[ 'uid' ];

        $smarty = CL_SmartyFactory::instance();

        $this->data[ 'suc' ] = true;
        $this->data[ 'data' ] = array( "html" => $smarty->fetch( "widgets/card.tpl" ) );

    }
}

$app = new CAUserCard();
$app->run();

?>