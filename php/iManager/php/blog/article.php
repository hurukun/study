<?php
/**
 * 首页页面
 */
require_once( 'global.php' );

 class CAArticle extends CB_Application{
	function __construct(){
		parent::__construct();
	}
	function main(){
		$id = $_GET[ 'id' ];
		$editable = $_GET[ 'edit' ];
		$smarty = CL_SmartyFactory::instance();
		//获取 内容
		$al = new CA_Blog_Article();
		$article = $al->read( $id );

		//获取 关键字
		$tb = new CA_Blog_Config();	
		$classes = $tb->getByType();
		//转换关键字
		$tb->parseClasses( $article );

		//页面附加的 js
		$smarty->assign( "scripts", array( 'js/apps/blog/AArticle.js' ) );

		//关键字转为 字符串
		if( is_array( $article['keywords' ] ) ){
			$article['keywords' ] = implode( ',' , $article['keywords' ] );
		}

		$smarty->assign( "article", $article );

		//权限
		if( $editable ){
			$smarty->assign( "author", array( "edit" => true ) );
			$smarty->assign( "class_list", $classes );
		}
		//显示 页面
		$smarty->display( "blog/article.tpl" );
	}
}

$app = new CAArticle();
$app->run();

?>