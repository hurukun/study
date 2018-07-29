<?php
/**
 * 引用 smarty 框架
 */

require_once( dirname(__FILE__)."/Smarty-3.1.11/libs/Smarty.class.php" );

class CL_SmartyFactory{
	private static  $smarty = NULL;

	public static function instance(){
		 if( CL_SmartyFactory::$smarty == NULL ){
            CL_SmartyFactory::$smarty = new Smarty();
			define('SMARTY_ROOT', dirname( dirname( dirname(__FILE__) ) ));
            CL_SmartyFactory::$smarty->template_dir = SMARTY_ROOT."/templates/";
            CL_SmartyFactory::$smarty->compile_dir = SMARTY_ROOT."/templates/_cache/templates_c/";
            CL_SmartyFactory::$smarty->config_dir = SMARTY_ROOT."/templates/_cache/configs/";
            CL_SmartyFactory::$smarty->cache_dir = SMARTY_ROOT."/templates/_cache/cache/";
            CL_SmartyFactory::$smarty->caching= 0;
            CL_SmartyFactory::$smarty->cache_lifetime=60*60*24;
            CL_SmartyFactory::$smarty->left_delimiter = '{{';
            CL_SmartyFactory::$smarty->right_delimiter = '}}';

             CL_SmartyFactory::$smarty->assign( "__HOST__", "http://".$_SERVER["HTTP_HOST"]  );
		 }
		 return CL_SmartyFactory::$smarty;
	}
}
?>