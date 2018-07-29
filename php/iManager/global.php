<?php
/**
 *  每个 App 都包含的公共文件
 *  1、定义了一些 公共的变量、数据结构等；
 *  2、包含一些使用的库文件、框架文件等；
 *  3、定义自动加载函数；
 */

ini_set("display_errors","On"); //显示所有错误信息
error_reporting( E_ERROR );

/**
 * 默认文件上传路径
 */
if( !defined( UPLOAD_DIR ) ){
    define( UPLOAD_DIR, dirname( __FILE__ ).'/uploads/'  );
}

define( DEBUG, false );

/**
 *定义数据库相关的一些常量
 */

if( !defined( DB_NAME ) ){
    define( "DB_HOST", "localhost" );
    define( "DB_USER", "hurukun" );
    define( "DB_PASSWD", "itnog2010" );

    define( "DB_DEFAULT", "heartbeat" );
    define( "DB_BLOG", "hurukun" );
}

/**
 * 定义错误码
 */
define( ERR_NO_AUTH, 1001 );

/**
 * php include 路径
 */
if( !defined( INCLUDE_PATH ) ){
    define( INCLUDE_PATH, dirname( __FILE__ ).'/php/include'  );
}
/**
 * 自动加载 类开头对应的 一级目录名
 * @var array
 */
$al_base_rule = array(
        'C'       =>  '',
        'CA'    =>  'apps',
        'CB'    =>  'base',
        'CC'    =>  'common',
        'CL'    =>  'libs'
    );
/**
 * 以 C 开头的类才享受自动加载待遇
 * @param  {string} $className 类名
 */
function _autoload( $className ){
    //以 C 开头的类
    if( $className[ 0 ] == 'C' ){
        $paths = explode( '_', $className );
        //是否 可自动加载
        if( !array_key_exists( $paths[0], $GLOBALS[ 'al_base_rule' ] ) ){
            return;
        }
        //替换配置的目录
        $paths[0] = $GLOBALS[ 'al_base_rule' ][ $paths[0] ];
        array_pop( $paths );
        //目录必须小写
        $path = strtolower( implode( '/', $paths ) );
        $path = INCLUDE_PATH.'/'.$path.'/'.$className.'.php';
        //文件必须存在
        if( file_exists( $path ) ){
            require_once( $path );
            return;
        }
    }
}
//注册 自动加载函数
spl_autoload_register( '_autoload' );  

function debug( $var ){
    if( DEBUG == false ){
        return;
    }
    if( is_array( $var ) ){
        print_r( $var );
    }
    else{
        echo $var;
    }
}
?>