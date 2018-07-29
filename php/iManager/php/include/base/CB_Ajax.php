<?php
/**
 * 应用类基类 
 */
class CB_Ajax{
	protected $data;

	function __construct(){
	}
	function main(){
	}
	/**
	 * Ajax 接口入口
	 */
	public function run(){
		$this->data  = array( 'suc' => false );
		/**
		 * 检查授权
		 */
		$auth = new CA_Auth_Authorize( defined( NEED_NO_AUTH) );
		if( !$auth->check() ){
			$this->data[ 'msg' ] = 'not authorized.';
			$this->data[ 'errno' ] = ERR_NO_AUTH;
		}
		else{
			$this->main();
		}
		/**
		 * 将数据转为 json 格式
		 */
		$data = new stdclass();

		foreach( $this->data as $key=>$value ){
			$data->$key = $value;
		}

		echo json_encode( $data );
	}
}
?>