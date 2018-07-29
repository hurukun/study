<?php
require( 'global.php' );

class CAIndex extends CB_Application{
    function main(){
        $smarty = CL_SmartyFactory::instance();

        //获取 内容
        $dd = new CA_Diary_Data();
        //获取 内容摘要列表
        $abstract = $data->getYear();
        //页面附加的 js
        $smarty->assign( "scripts", array( 'js/apps/diary/AIndex.js' ) );
        //权限
        $smarty->assign( "author" , array( "edit" => true ) );
        //显示 页面
        $smarty->display( "diary/index.tpl" );
    }
}

$app = new CAIndex();
$app->run();
?>