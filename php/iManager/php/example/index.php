<?php
/**
 * 首页页面
 */
require_once( 'global.php' );

 class CAIndex extends CB_Application{
	function __construct(){
		parent::__construct();
	}
	function main(){
		$smarty = CL_SmartyFactory::instance();
		//显示 页面
		$smarty->display( "example/index.tpl" );
	}
}

$app = new CAIndex();
$app->run();

?>