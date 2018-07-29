<?php
/**
 *  数据库 代理类
 *  提供数据库 数据访问相关代理；
 */
class CB_DBProxy{
    private static $DB = null;

    /**
     * 获取代理实例
     */
    public static function instance( $dbname){
        /**
         * 初始化
         */
        if( CB_DBProxy::$DB == NULL ){
            CB_DBProxy::$DB = array();
        }
        /**
         * 检查特点数据库的连接
         */
        if( !isset( CB_DBProxy::$DB[ $dbname ] )){
            CB_DBProxy::$DB[ $dbname ] = new DBOperation( $dbname );
        }

        return CB_DBProxy::$DB[ $dbname ];
    }
}
/**
 * 数据库相关操作代理类
 * tableName: string
 * action: string
 * content: key-value
 * condition: key-value
 */
class DBOperation {
    private $dbConn = NULL;
    private $cache = NULL;
    private $tbName = NULL;
    private $condition = NULL;
    /**
     * 连接 数据库
     */
    function __construct( $dbname ){
        $this->dbConn = new CB_DBBase( $dbname );
        $this->cache = array();
    }
    /**
     * 表是否存在
     */
    public function exist( $tbName ){
        return  ( mysql_num_rows(mysql_query("SHOW TABLES LIKE '".$this->tbName."'") == 1 ) );
    }
    /**
     * 创建表
     */
    public function create( $tbName, $cmd ){
        
    }
   
    /**
     * 设置当前表名, 并初始化记录结构
     */
    public function init( $tbName ){
        $this->tbName = $tbName;
        if( !isset( $this->cache[ $this->tbName ] ) ){
             $this->cache[ $this->tbName ] = array(
                    'insert' => array(),
                    'update' =>array(
                            'condition' => '',
                            'content' =>array()
                        ),
                    'delete' => array()
                );
        }
    }
    /**
     * 删除记录
     * @param string $condition 条件
     */
    public function delete( $condition ){
        array_push( $this->cache[ $this->tbName ][ 'delete' ] , $condition );
    }
    /**
     * 获取数据
     * @param  [array] $content   [description]
     * @param  [string] $condition [description]
     */
    public function get( $content, $condition ){
        $content= implode( $content, ',' );
        $sql = 'select '.$content.' from '.$this->tbName;
        if( strlen( $condition ) > 0 ){
            $sql = $sql.' where '.$condition;
        }

        $query = $this->dbConn->sql( $sql );
        $ii = 0;
        $result = array();
        while( $item = mysql_fetch_array( $query ) ){
            $result[ $ii++ ] = $item;
        }
        return $result;
    }
    /**
     * 设置记录
     * @param  array $content    数据
     * @param array $condition  条件
     */
    public function set($content, $condition ){
         if( !is_array( $content ) ){
            return;
        }
        if( isset( $condition ) ){
            $this->update( $content, $condition );  
        }
        else{
            $this->insert( $content );  
        }
        return $this->flush();
    }
    /**
     * 运行命令
     */
    public function flush( $discard = false ){
        $cmds = $this->parseCmd();
        $result = NULL;
        foreach( $cmds as $sql ){
            $result = $this->dbConn->sql( $sql );
        }
        return $result;
    }
    /**
     * 添加记录
     * @param array $content 插入数据
     */
    private function insert( $content ){
        $this->cache[ $this->tbName ][ 'insert' ] = array_merge( $this->cache[ $this->tbName ][ 'insert' ], $content );
    }
    
    /**
     * 更新记录
     * @param  array $content    更新数据
     * @param array $condition  条件
     */
    private function update($content, $condition ){
        /**
         * 更新条件
         */
        if( $condition ){
            $this->cache[ $this->tbName ][ 'update' ][ 'condition' ] = $condition;
        }

        $this->cache[ $this->tbName ][ 'update' ][ 'content' ] = array_merge( $this->cache[ $this->tbName ][ 'update' ][ 'content' ], $content );
    }
    /**
     * 拼装sql语句；
     */
    private function parseCmd(){
        $sqls = array();
        foreach( $this->cache as $tbName => $cmds ){
            $sql = '';
            $tmp = '';
            /**
             * insert 命令
             */
            if( count( $cmds[ 'insert' ] ) > 0 ){
                $sql = 'insert into '.$tbName.'(';
                $tmp = " values(";
                foreach( $cmds[ 'insert' ] as $key => $value ){
                    //过滤单引号
                    $key = str_replace(  "'","''", $key  );
                    $value = str_replace(  "'","''", $value  );
                    $sql = $sql.$key.",";
                    $tmp = $tmp."'".$value."',";
                }
                $sql = substr( $sql, 0, strlen( $sql ) - 1 ).")";
                $tmp = substr( $tmp, 0, strlen( $tmp ) - 1 ).")";
                $sql = $sql.$tmp;
            }
            /**
             * update 命令
             */
            if( count( $cmds[ 'update' ][ 'content' ] ) > 0 ){
                $sql = 'update '.$tbName.' set ';
                foreach( $cmds[ 'update' ]['content'] as $key => $value ){
                    //过滤单引号
                    $key = str_replace(  "'","''", $key  );
                    $value = str_replace(  "'","''", $value  );

                    $sql = $sql." $key='$value',";
                }
                $sql = substr( $sql, 0, strlen( $sql ) - 1 );

                if( strlen( $cmds[ 'update' ][ 'condition' ] ) > 0 ){
                    $sql = $sql." where ".$cmds[ 'update' ][ 'condition' ];
                }
            }
            /**
             * delete 命令
             */
            if( count( $cmds[ 'delete' ] ) > 0 ){
                $sql = 'delete from '.$tbName.' where ';
                $tmp = '';
                foreach( $cmds[ 'delete' ] as $key => $value ){
                    if( strlen( $tmp > 0 ) ){
                        $tmp = $tmp." and ";
                    }
                    //过滤单引号
                    $key = str_replace(  "'","''", $key  );
                    $value = str_replace(  "'","''", $value  );

                    $tmp = $tmp." $key='$value',";
                }
                $sql = $sql.$tmp;
            }

            array_push( $sqls, $sql );
        }
        return $sqls;
    }
}
?>