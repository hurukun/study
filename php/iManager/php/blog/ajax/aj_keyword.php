<?php
/**
 * 添加 keyword
 * 传入参数：
 * $_POST[ 'act' ]		:  操作类型[ add|del ]
 * $_POST[ 'key' ]		:  key
 * $_POST[ 'content' ]	:  keyword
 * 返回参数：
 * 
 */
require_once( 'global.php' );

class CModKeyword extends CB_Ajax{
	function main(){
		//获取传回数据
		$act = $_POST[ 'act' ];
		$key = $_POST[ 'key' ];
		$content = $_POST[ 'content' ];

		//结果放入数据库
		$tb = new CA_Blog_Config();

		if( $act == 'add' ){
			//返回值
			$this->data[ 'suc' ] = $tb->insert( 1 , $key, $content );
		}
		else if( $act == 'del' ){
			$this->data[ 'suc' ] = $tb->delete( 1, $key );
		}
	}
};

$app = new CModKeyword();
$app->run();

?>