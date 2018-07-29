<?php
/**
 * 记录文章、或评论内容；
 * 使用 post 方法发送至服务器；
 */

class CPublisher{
	function __construct(){
	}

	// blog 发布框
	public function getBlogEditor( $keywords ){
		$smarty = CSmartyFactory::instance();
		$smarty->assign( 'keyword_list', $keywords );
		return $smarty->fetch( 'blog/publisher.tpl' );
	}
}
?>