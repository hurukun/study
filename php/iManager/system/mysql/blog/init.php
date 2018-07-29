<?php
/**
 * 首页页面
 */
require_once( 'global.php' );

debug( 'init.php' );

class CBlogDBInit extends CB_Application{
	function __construct(){
		parent::__construct();
	}
	function main(){
		$this->initBlogConf();
	}

	function initBlogConf(){
		$tb = new CA_Blog_TbAdmin();

		$tb->insert( 1, "1", "计算机基础" );
		$tb->insert( 1, "1@1", "操作系统" );
		$tb->insert( 1, "1@2", "数据结构" );
		$tb->insert( 1, "1@3", "算法理论" );
		$tb->insert( 1, "1@4", "计算机网络" );
		$tb->insert( 1, "1@5", "数据库基础" );

		$tb->insert( 1, "2", "语言集锦" );
		$tb->insert( 1, "2@1", "C/C++编程语言" );
		$tb->insert( 1, "2@2", "OC编程语言" );
		$tb->insert( 1, "2@3", "Java编程语言" );
		$tb->insert( 1, "2@4", "PHP脚本语言" );
		$tb->insert( 1, "2@5", "HTML标记语言" );
		$tb->insert( 1, "2@6", "CSS样式表" );
		$tb->insert( 1, "2@7", "Javascript语言" );
		
		$tb->insert( 1, "3", "OS平台" );
		$tb->insert( 1, "3@1", "Windows平台" );
		$tb->insert( 1, "3@2", "Linux平台" );
		$tb->insert( 1, "3@3", "Mac平台" );
		$tb->insert( 1, "3@4", "iOS平台" );
		$tb->insert( 1, "3@5", "Android平台" );

		$tb->insert( 1, "4", "开发工具" );
		$tb->insert( 1, "4@1", "项目管理" );
		$tb->insert( 1, "4@2", "文本编辑器" );
		$tb->insert( 1, "4@3", "C/C++编程语言" );
		$tb->insert( 1, "4@4", "OC编程语言" );
		$tb->insert( 1, "4@5", "Java编程语言" );

		$tb->insert( 1, "5", "技术之美" );
		$tb->insert( 1, "5@1", "设计模式" );
		$tb->insert( 1, "5@2", "软件构架" );
		$tb->insert( 1, "5@3", "数据库管理" );
		$tb->insert( 1, "5@4", "数据挖掘" );
		$tb->insert( 1, "5@5", "信息安全" );

		$tb->insert( 1, "6", "开源与工具" );

		echo "Work is done!";
	}
}

$app = new CBlogDBInit();
$app->run();

?>