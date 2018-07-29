<?php
/**
 * 封装 blog_conf 数据库提供接口
 */
class CA_Blog_Config{
    private $tb = NULL;
    private $parser = NULL;

    function __construct(){
        $this->tb = new CA_Blog_TbAdmin();
        $this->parser = new CC_TxtParser();
    }
    /**
     * 删除一条配置信息
     * @param  integer $type 类型
     * @param  string $key  键值
     */
    public function delete( $type, $key ){
        return $this->tb->del( $type, $key );
    }
    /**
     * 根据类型，获得配置信息
     * @param  integer $type 类型 
     * @param  string  $key  键值
     */
    public function getByType( $type = 0, $key = '@0' ){
        return $this->tb->getByType( $type, $key );
    }
    /**
     * 新建一条配置信息
     * @param  integer $type    类型
     * @param  string  $key     键值
     * @param  string  $content 内容
     */
    public function insert( $type=0, $key='', $content='' ){
        return $this->tb->insert( $type, $key, $content );
    }

    /**
     * 将记录类型数组中的  id 转换为 文本
     * @param  array $list [description]
     * @return [type]       [description]
     */
    public function parseClasses( &$list=array() ){
        //记录的 index 
        $ii = 0;

        if(  isset( $list[ 'classes' ] ) ){
            //一条记录的 keywords 信息
            $list[ 'classes' ] = $this->parseClass( $list[ 'classes' ] );
        }
        else{
            //对应每一条记录
            foreach( $list as $key => $value ){
                //一条记录的 keywords 信息
                $list[ $ii++ ][ 'classes' ] = $this->parseClass( $value[ 'classes' ] );
            }
        }
        
    }
    /** 
    *将一条记录的 class id 转换为 文本
    */
    public function parseClass( $class ){
        //获得 keyword 数组
        $classes = $this->parser->tagString2Array( $class );
        //获得字典
        $codebook = $this->tb->getCodebook();
        if( count( $codebook ) === 0 ){
            $this->tb->getByType();
            $codebook = $this->tb->getCodebook();
        }

        $result = array();
        //keyword 的index
        $sii = 0;

        //转换每一个关键字
        foreach( $classes as $key => $id ){
            $result[ $sii++ ] = array(
                    "id" => $id,
                    "content" => $codebook[ $id ]
                );
        }
        
        return $result;
    }
}

?>