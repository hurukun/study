<?php
/**
 *	数据库基类
 *	提供数据库链接，并统一处理数据库访问异常；
 */

class CB_DBBase{
	protected static $conn = null;

	/**
	 * 连接 数据库
	 */
	function __construct( $dbname ){

		if( self::$conn == null ){
			self::$conn = mysql_connect( DB_HOST, DB_USER, DB_PASSWD ) or die ("Can't connect to server:".mysql_error());
		}
		mysql_select_db( $dbname,self::$conn) or die("Can't connect to the database:".mysql_error());
		mysql_query( "set names latin1" );
	}
	/**
	 * 释放 数据库连接
	 */
	function __destruct()
	{
		mysql_close( self::$conn );
		self::$conn = NULL;
	}
	/**
	 * 执行 sql 语句
	 */
	public function sql( $sql ){
		$query =  mysql_query( $sql, self::$conn ) or die( "SQL can't take action:".mysql_error() );
		return $query;
	}
}
?>