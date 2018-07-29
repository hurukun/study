<?php
/**
 *  处理 授权相关事宜；
 */
class CA_Auth_Authorize {
    private $tbName;
    private $db;
    private $isAuthed;
    /**
     * 初始化 数据库链接、以及表名；
     */
    function __construct( $isAuthorized = false ){
        $this->tbName = 'account';
        $this->db = CB_DBProxy::instance( DB_DEFAULT );
        $this->isAuthed = $isAuthorized;
    }
    /**
     * 注册用户
     */
    public function register( $account, $passwd='000000', $gender = 1 ){
        $this->db->init( $this->tbName );
        $accounts = $this->db->get( array( 'account' ) , "account='".$account."'" );
        /**
         * 用户已存在
         */
        if( count( $accounts ) > 0 ){
            return -1;
        }
        /**
         * 开始注册
         */
        else{
            $uid = date('ymdhis').rand( 1000, 9999 );
            $result = $this->db->set( array( 
                'uid' => $uid,
                'account' => $account,
                'uname' => $account,
                'passwd' => md5( $passwd ),
                'gender' => $gender
            ) );

            return $this->login( $account, $passwd );
        }
    }
    /**
     * 用户登录
     */
    public function login( $account, $passwd ){
        $this->db->init( $this->tbName );
        $accounts = $this->db->get( array( 'account', 'uname', 'uid' ), "account='".$account."' and passwd='".md5( $passwd )."'" );
        $result = array();
        $auth = '';
        if( count( $accounts ) == 1 ){
            $auth = md5( $account.$passwd.date('ymdHis') ); 
            $this->db->set( array( 'auth' => $auth), "account='$account'" );
            $result = array(
                'uid' => $accounts[ 0 ][ 'uid' ],
                'auth' => $auth
            );
        }

        return $result;
    }
    /**
     * 用户退出登录
     */
    public function logout( ){
        $uid = $_COOKIE["_uid"];
        $this->db->init( $this->tbName );
        $this->db->set( array( 'auth' => '' ), "uid='".$uid."'");
    }
    /**
     * 检查用户的合法性
     */
    public function check(){
        if( $this->isAuthed ){
            return true;
        }
        $account = $_COOKIE["_user"];
        $auth = $_COOKIE["_auth"];

        $this->db->init( $this->tbName );
        $accounts = $this->db->get( array( 'account', 'auth'), "account='".$account."' and auth='".$auth."'" );
        if( count( $accounts ) == 1 && strlen( $accounts[ 0 ][ 'auth' ]  ) > 0 ){
            return true;
        }

        return false;
    }

    public function showNeedAuth(){
        header("Location: /php/auth/login.php");
    }
    
}
?>