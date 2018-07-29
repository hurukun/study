<?php
/**
 * 应用类基类 
 */
class CB_Application{
	function __construct(){
	}
	function main(){
	}
            /**
             * App 接口入口
             */
	public function run(){
                /**
                 * 检查授权
                 */
                $auth = new CA_Auth_Authorize( defined( NEED_NO_AUTH) );
                if( !$auth->check() ){
                    $auth->showNeedAuth();
                }
                else{
                    $this->main();
                }
	}
}
?>