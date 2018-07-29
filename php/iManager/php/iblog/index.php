<?php
/**
 * 首页页面
 */
require_once( 'php/global.php' );

 class CAIndex extends CB_Application{
    function __construct(){
        parent::__construct();
    }
    function main(){
        $smarty = CL_SmartyFactory::instance();

        //获取 关键字
        $tb = new CA_iBlog_Config(); 
        $classes = $tb->getByType();

        $data = new CA_Blog_Data();
        $count = $data->count();
        //获取 内容摘要列表
        $al = new CA_Blog_AbstractList($data, $tb );
        $abstract = $al->getList( 'time',0,6 );

        //页面附加的 css
        $smarty->assign( "stylesheets", array( 'css/_combo/blog.css' ) );
        //页面附加的 js
        $smarty->assign( "scripts", array( 'js/apps/blog/Aindex.js' ) );
        //左侧 菜单
        $smarty->assign( "menu_list", $classes );
        //记录数
        $smarty->assign( 'totalNumber', $count );
        //blog 摘要 列表
        $smarty->assign( "abstract_list", $abstract );
        //权限
        $smarty->assign( "author" , array( "edit" => true ) );
        //显示 页面
        $smarty->display( "blog/index.tpl" );
    }
}

$app = new CAIndex();
$app->run();

?>