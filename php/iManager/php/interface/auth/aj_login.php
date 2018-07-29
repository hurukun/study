<?php
/**
 * 登录
 */
require_once( 'global.php' );

define( NEED_NO_AUTH, 'true' );

 class CALogin extends CB_Ajax{
    function __construct(){
        parent::__construct();
    }
    function main(){
        $smarty = CL_SmartyFactory::instance();

        //获取注册数据
        $account = $_POST[ 'account' ];
        $passwd = $_POST[ 'passwd' ];

        //获取 关键字
        $auth = new CA_Auth_Authorize( true ); 
        $result = $auth->login( $account, $passwd );

        if( isset( $result[ 'auth' ] )  ){
            $this->data[ 'suc' ] = true;
            $this->data[ 'data' ] = $result;
        }
        else{
            $this->data[ 'suc' ] = false;
            $this->data[ 'errno' ] = $result;
        }
    }
}

$app = new CALogin();
$app->run();

?>