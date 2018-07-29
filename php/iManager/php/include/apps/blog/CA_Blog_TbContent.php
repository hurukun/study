<?php
/**
 *	处理 blog 内容表；
 */

class CA_Blog_TbContent extends CA_Blog_DBBase{
	private $tbName;
	private $txtParser;

	function __construct(){
		parent::__construct();
		$this->tbName = "blog_data";
		//文本处理器
		$this->txtParser = new CC_TxtParser();
	}

	/**
	 * 向表中添加数据；
	 */
	public function insert( $title, $author, $content, $time, $classes, $keywords='' ){
		//过滤单引号
		$title = str_replace(  "'","''", $title  );
		$content = str_replace(  "'","''", $content  );
		//数据 入数据库表
		$sql="insert into ".$this->tbName."(title, author, content, createtime, modifytime, classes, keywords) values('$title', '$author', '$content', '$time', '$time', '$classes', '$keywords')";
		return $this->sql( $sql );
	}
	/**
	 * 更新表中数据；
	 */
	public function update( $id, $title, $content, $time, $classes, $keywords ){
		//过滤单引号
		$title = str_replace(  "'","''", $title  );
		$content = str_replace(  "'","''", $content  );
		//数据 更新数据库表
		$sql="update ".$this->tbName." set title='".$title."', content='".$content."', modifytime='".$time."', classes='".$classes."', keywords='".$keywords."' where id=".$id;
		return $this->sql( $sql );
	}
	/**
	 * 删除表中数据；
	 * @param {int} $id 记录 id
	 * @return {bool} 返回成功(true)或失败( false )
	 */
	public function delete( $id ){
		//数据 删除数据库表中记录
		$sql="delete from ".$this->tbName." where id=".$id;
		return $this->sql( $sql );
	}
	/**
	 *  将数据库 返回数据转为 数组返回
	 *  @param {queryid} $query 数据库访问返回的 资源标识符;
	 *  @param {int} $contentParseLv 调用 CTxtParser 对 content 进行处理时的等级，0为不处理；
	 *  @return {array} 返回数据数组
	 */

	private function parseRecord( $query, $contentParseLv = 0 ){
		$ii = 0;
		$reuslt = array();
		$item = array();
		while( $item = mysql_fetch_array( $query ) ){
			//格式化数据
			$item['content'] = $this->txtParser->parse( $item['content'], $contentParseLv );
			$item['keywords'] = $this->txtParser->tagString2Array( $item['keywords'] );

			//构建返回数组
			$result[ $ii++ ] = array(
				"title" => $item[ 'title'],
				'author'  => $item[ 'author' ],
				"content" => $item['content'],
				'time'	 => $item[ 'modifytime' ],
				"classes" => $item[ 'classes'],
				"keywords"=> $item['keywords'],
				"id"	 => $item[ "id" ]
				
			);
		}
		return $result;
	}
	/**
	 * 根据 记录类型 id 获取数据；
	 * @param {string|array} $classesIds 记录对应的类型的 id 数组
	 * @param {int} $contentParseLv 调用 CTxtParser 对 content 进行处理时的等级，0为不处理；
	 * @return {array} 记录数组
	 */
	public function getByClasses( $classesIds, $contentParseLv = 0, $start = 0, $num = 0 ){
		$sql = "select * from ".$this->tbName;
		//处理参数；
		$args = $this->txtParser->sqlTagString( $classesIds );

		$sql = $sql." where classes like '".$args."'";

		if( $num > 0 ){
			$sql = $sql." limit ".$start.",".$num;
		}

		$query = $this->sql( $sql );

		return $this->parseRecord( $query, $contentParseLv );
	}
	/**
	 * 按类别查询记录条数
	 * @param  {string|array} $classesIds 类别
	 */
	public function countByClasses( $classesIds ){
		$sql = "select count(*) from ".$this->tbName;
		//处理参数；
		$args = $this->txtParser->sqlTagString( $classesIds );

		$sql = $sql." where classes like '".$args."'";

		$query = $this->sql( $sql );
		$item = mysql_fetch_array( $query ) ;
		return $item[0] ;
	}
	/**
	 * 根据 关键字 获取数据；
	 * @param {string} $keyword 记录对应的关键字
	 * @param {int} $contentParseLv 调用 CTxtParser 对 content 进行处理时的等级，0为不处理；
	 * @return {array} 记录数组
	 */
	public function getByKeyword( $keyword, $contentParseLv = 0, $start = 0, $num = 0 ){
		$sql = "select * from ".$this->tbName." where keywords like '$keyword'";

		if( $num > 0 ){
			$sql = $sql." limit ".$start.",".$num;
		}

		$query = $this->sql( $sql );

		return $this->parseRecord( $query, $contentParseLv );
	}
	/**
	 * 按关键字查询记录条数
	 * @param  {string} $keyword 关键字
	 */
	public function countByKeyword( $keyword ){
		$sql = "select count(*) from ".$this->tbName." where keywords like '$keyword'";

		$query = $this->sql( $sql );
		$item = mysql_fetch_array( $query ) ;
		return $item[0] ;
	}
	/**
	 * 根据 时间顺序 获取数据特定条数的记录；
	 * @param {int} $start 记录开始位置
	 * @param {int} $num 记录条数
	 * @param {int} $timeType 查询的时间类型  [ create| modify ]
	 * @param {int} $contentParseLv 调用 CTxtParser 对 content 进行处理时的等级，0为不处理；
	 */
	public function getByTime( $timeType='create', $contentParseLv = 0, $start = 0, $num = 0 ){
		$sql = "select * from ".$this->tbName." order by ".$timeType."time desc";
		if( $num > 0 ){
			$sql = $sql." limit ".$start.",".$num;
		}

		$query = $this->sql( $sql );

		return $this->parseRecord( $query, $contentParseLv );
	}
	/**
	 * 查询记录条数
	 */
	public function countAll(){
		$sql = "select count(*) from ".$this->tbName;

		$query = $this->sql( $sql );
		$item = mysql_fetch_array( $query ) ;
		return $item[0] ;
	}
	/**
	 * 根据 记录id 获取数据；
	 * @param {int} $id 记录id;
	 * @param {int} $contentParseLv 对记录 content 进行 过滤的等级
	 * @return {array} 记录数组
	 */
	public function getById( $id, $contentParseLv = 0 ){
		$sql = "select * from ".$this->tbName." where id=".$id;

		$query = $this->sql( $sql );

		return $this->parseRecord( $query, $contentParseLv );
	}
}
?>