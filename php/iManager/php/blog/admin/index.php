<?php
/**
 * 管理页面 页面
 */
require_once( 'global.php' );

debug( 'CAIndex.php' );

class CAIndex extends CB_Application{
	function __construct(){
		parent::__construct();
	}
	function main(){
		$smarty = CL_SmartyFactory::instance();
		$tb = new CA_Blog_Config();
	
		$classes = $tb->getByType();
		//页面附加的 css
		$smarty->assign( "stylesheets", array( 'css/_combo/blog.css' ) );
		$smarty->assign( "scripts", array( 'js/apps/blog/AAdmin.js' ) );
		$smarty->assign( "class_list", $classes );
		$smarty->display( "blog/admin.tpl" );
	}
}

$app = new CAIndex();
$app->run();

?>