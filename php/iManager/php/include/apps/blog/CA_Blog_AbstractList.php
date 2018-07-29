<?php
/**
 * 获得 摘要列表；
 */

class CA_Blog_AbstractList{
	private $data;
	private $config;

	function __construct( $data = null, $config= null){
		$this->data = $data ? $data : new CA_Blog_Data();
		$this->config = $config? $config: new CA_Blog_Config();
	}
	/**
	 * 获取 列表 HTML
	 * @param  string  $type  列表数据类型
	 * @param  integer $start 开始记录位置
	 * @param  integer $num   记录数目
	 */
	public function fetchListHTML( $type='time', $start=0, $num=20 ){
		$args = func_get_args();
		$smarty = CL_SmartyFactory::instance();

		//获取 内容摘要列表
		$abstract = $this->getList( $type, $start, $num, $args[3] );
		//blog 摘要 列表
		$smarty->assign( "abstract_list", $abstract );
		//权限
		$smarty->assign( "author" , array( "edit" => true ) );
		//显示 页面
		return $smarty->fetch( "blog/abstract_list.tpl" );
	}
	/**
	 * 获得摘要记录；
	 * @param {int} $start
	 * @param {int} $num
	 * @param {string} $type
	 * type: [ 'time'|'keyword' |'class'];
	 * if type == 'time' : function( $type, $start, $num );
	 * if type == 'keyword': function( $keyword, $start, ... )
	 * if type == 'class': function( $class, $start, ... )
	 */
	public function getList( $type, $start = 0, $num = 0 ){
		$args = func_get_args();
		//获取 内容摘要列表
		//发布时间
		if( $type == 'time' ){
			$abstract = $this->data->getByTime( 'create', 1, $start, $num );
		}
		//类别
		else if( $type == 'class' ){
			$abstract = $this->data->getByClasses( $args[3], 1, $start, $num );
		}
		//关键字
		else if( $type == 'keyword' ){
			$abstract = $this->data->getByKeyword( $args[3], 1, $start, $num );
		}

		//转换类型
		$this->config->parseClasses( $abstract );

		return $abstract;
	}
}
?>