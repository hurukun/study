<?php
/**
 *	处理 blog 配置表；
 */

class CA_Blog_TbAdmin extends CA_Blog_DBBase{
	private $tbName;
	private $codebook;
	/**
	 * 初始化 数据库链接、以及表名；
	 */
	function __construct(){
		parent::__construct();
		$this->tbName = "blog_conf";
		$this->codebook = array();
	}

	/**
	 * 向表中天剑数据；
	 * @param{ int } 	type 	: 	配置项 类型 列表
	 * @param{ string } key 	:	配置项 结构字符串： e.g.：@1@2
	 * @param{ string } content :	配置项 值
	 * 返回值：
	 *		TRUE 
	 *		FALSE 
	 */
	public function insert( $type, $key, $content ){
		$sql = "insert into ".$this->tbName."(type,ckey,content) values('$type','$key','$content')";
		return $this->sql( $sql );
	}
	/**
	 * 从表中删除记录；
	 * @param{ int } 	type 	: 	配置项 类型 列表
	 * @param{ string } 	key 	:	配置项 结构字符串： e.g.：@1@2
	 * 返回值：
	 *		TRUE 
	 *		FALSE 
	 */
	public function del( $type, $key ){
		$sql = "delete from ".$this->tbName." where type=".$type." and ckey=".$key;
		return $this->sql( $sql );
	}

	/**
	 * 获取所有配置项信息
	 * @param{ int } 	type 	: 	配置项 类型，0表示任意类型
	 * @param{ int } 	key 	:	配置项 键值，"@0"表示任意类型
	 * 返回值：
	 *		array 
	 */
	public function getByType( $type = 0 , $key = "@0" ){
		$sql = "select * from ".$this->tbName;
		$conStr = " where ";
		//根据参数 构造 sql 语句；
		if( $type > 0 ){
			$sql = $sql.$conStr."type=$type";
			$conStr = " and ";
		}
		if( strcmp($key, "@0") != 0 ){
			$sql = $sql.$conStr."ckey like '$key%'";
		}

		$query = $this->sql( $sql );

		//处理 查询结果；
		$i = 0;
		while( $item = mysql_fetch_array( $query ) ){
			//转换为 id <-> value 的列表结构
			$this->codebook[ $item[ 'id' ] ] = $item[ 'content' ];

			//转换为树结构
			$keyArr = explode( "@", $item[ "ckey" ] );

			if( $result[ $keyArr[ 0 ] ] == NULL ){
				$result[ $keyArr[ 0 ] ] = array(
						"type"	=> $item[ 'type' ],
						"key"	=> $item[ 'ckey' ],
						"id"	=> $item[ 'id' ],
						"content" => $item[ 'content' ],
						"children" => array()
					);
			}
			else{
				$result[ $keyArr[ 0 ] ][ "children" ][ $keyArr[ 1 ] ] = array(
						"type"	=> $item[ 'type' ],
						"key"	=> $item[ 'ckey' ],
						"id"	=> $item[ 'id' ],
						"content" => $item[ 'content' ]
					);
			}
		}

		return $result;
	}
	/**
	 * 获取类型映射关系
	 * @return [type] [description]
	 */
	public function getCodebook(){
		return $this->codebook;
	}
}
?>