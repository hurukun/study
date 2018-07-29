<?php
/**
 * 首页页面
 */
require_once( 'global.php' );

 class CItem extends CB_Application{
	function __construct(){
		parent::__construct();
	}
	function main(){
                $handler = $_GET[ 'handler' ];
                $handler = explode( '_', $handler );
                $handler = 'js/'.implode( '/', $handler ).'.js';
	   $smarty = CL_SmartyFactory::instance();
	   //显示 页面
                $smarty->assign( 'scripts', array( $handler ) );
	   $smarty->display( "example/item.tpl" );
	}
}

$app = new CItem();
$app->run();

?>