<?php
/**
 * 记录文章、或评论内容；
 * 使用 post 方法发送至服务器；
 */

class CA_Blog_Publisher{
	function __construct(){
	}

	// 发布框
	public function getEditor( $keywords ){
		$smarty = CSmartyFactory::instance();
		$smarty->assign( 'keyword_list', $keywords );
		return $smarty->fetch( 'blog/publisher.tpl' );
	}
}
?>