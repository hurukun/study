<?php
/**
 * 添加 keyword
 * 传入参数：
 * $_POST[ 'keywords' ]	:  关键字；
 * $_POST[ 'cid' ]		:  关键字id
 * $_POST[ 'start' ]	:  上一条记录id
 * 返回参数：
 * 
 */
require_once( 'global.php' );

class CAJBlogAbsList extends CB_Ajax{
	function main(){
		//获取传回数据
		$id = $_POST[ 'id' ];
		$start = $_POST[ 'start' ];
		$type = $_POST[ 'type' ] || 'keyword';
		$num = $_POST['num'] || 6;

		//结果放入数据库
		$data = new CA_Blog_Data();
		$al = new CA_Blog_AbstractList( $data, null );
		if( $id != NULL ){
			$type = 'class';
			$this->data[ 'total' ] = $data->count( 'class', $id );
		}
		else if( $start != NULL ){
			$type = 'time';
			$this->data[ 'total' ] = $data->count( );
		}
		
		$this->data[ 'suc' ] = true;
		$this->data[ 'html' ] = $al->fetchListHTML( $type, $start, 6, $id );
	}
};

$app = new CAJBlogAbsList();
$app->run();

?>