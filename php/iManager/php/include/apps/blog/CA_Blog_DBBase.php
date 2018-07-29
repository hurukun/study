<?php
/**
 *	数据库基类
 *	提供数据库链接，并统一处理数据库访问异常；
 */

class CA_Blog_DBBase extends CB_DBBase{
	/**
	 * 具体数据库名 初始化数据库连接
	 */
	function __construct(){
		parent::__construct( DB_BLOG );
	}
}
?>