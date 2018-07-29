<?php
/**
 *  处理 blog 配置表；
 */
/**
 * 数据库表结构
 * @ colume
 *     id：diary 唯一ID；
 *     uid：用户唯一 ID
 *     day：diary日期
 *     modifytime：diary修改日期
 *     content：内容
 */
class CA_Diary_Data{
    private $tbName;
    private $codebook;
    private $uid;
    /**
     * 初始化 数据库链接、以及表名；
     */
    function __construct( $uid ){
        parent::__construct();
        $this->db = CB_DBProxy::instance();
        $this->uid = $uid;
    }

    /**
     * 向表中添加数据；
     * @param{ string } day    :   diary 日期
     * @param{ string } content     :   diary 内容
     * 返回值：
     *      TRUE 
     *      FALSE 
     */
    public function insert( $data ){
        $this->db->init( $this->tbName );
        $data[ 'modifytime' ] = date( 'Y-m-d H:i:s' );
        $data[ 'uid' ] = $this->uid;

        return $this->db->set( $data );
    }
    /**
     * 从表中删除记录；
     * @param{ string }     $condition     :   条件
     * 返回值：
     *      TRUE 
     *      FALSE 
     */
    public function del( $condition ){
        $this->db->init( $this->tbName );
        return $this->db->delete( $condition );
    }

    /**
     * 修改表中数据；
     * @param{ string } content     :   diary 内容
     * @param{ string } condition     :   更新条件
     * 返回值：
     *      TRUE 
     *      FALSE 
     */
    public function update( $data, $condition ){
        $this->db->init( $this->tbName );
        $theData[ 'modifytime' ] = date( 'Y-m-d H:i:s' );
        $theData[ 'uid' ] = $this->uid;
        $theData[ 'content' ] = $data[ 'content' ];
        
        return $this->db->set( $theData );
    }
    /**
     * 获得表中数据；
     * @param{ string } $data     :   diary 字段名
     * @param{ string } condition     :   取值条件
     */
    public function get(  $data, $condition ){
        $this->db->init( $this->tbName );
        $result = $this->db->get( $data, $condition );
        return $result;
    }
}
?>