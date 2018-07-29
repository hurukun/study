<?php
/**
 * blog 正文相关操作
 */

debug( 'CA_Blog_Article.php' );

class CA_Blog_Article{
    //数据库
    private $tb = NULL;
    //文本处理
    private $parser = NULL;

    function __construct(){
        $this->tb = new CA_Blog_Data();
        $this->parser = new CC_TxtParser();
    }
    /** 
     *读取一篇 blog
     */
    public function read( $id ){
        $data = $this->tb->getById( $id );

        //未取到数据
        if( $data[0][ 'id' ] == NULL ){
            return array();
        }
        else{
            return $data[0];
        }
    } 
    /**
     * 新建或更新一篇 blog
     * arg[0] => title; arg[1] => author; arg[2] => content; arg[3] => classes; arg[4] => keywords; arg[5] => id
     */
    public function write(){
        $argNum = func_num_args();

        //参数数目不对
        if( $argNum < 4 ){
            return false;
        }
        //获得参数
        $args = func_get_args();
        //标题 内容 不能为空
        if( strlen( $args[0] ) == 0 || strlen( $args[1] ) == 0 ){
            return false;
        }
        
        //新建一篇 blog
        if( $argNum == 5 ){
            return $this->tb->insert($args[0], $args[1], $args[2], $args[3], $args[4] );
        }
        //更新一篇 blog
        else if( $argNum == 6 ){
            return $this->tb->update($args[5], $args[0], $args[2], $args[3],$args[4]);
        }
        return false;
    }
    /**
     * 删除 blog
     * @param  integer $id blog对应的id
     */
    public function delete( $id ){
        return $this->tb->delete( $id );
    }
};
?>