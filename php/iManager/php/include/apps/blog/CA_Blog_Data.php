<?php
/**
 * 获得 blog 数据
 */

class CA_Blog_Data {
    private $tb;
    private $parser;

    function __construct(){
        $this->tb = new CA_Blog_TbContent();
        $this->parser = new CC_TxtParser();
    }

    /**
     * 删除表中数据；
     * @param {int} $id 记录 id
     * @return {bool} 返回成功(true)或失败( false )
     */
    public function delete( $id ){
        return $this->tb->delete( $id );
    }

    /**
     * 根据 时间顺序 获取数据特定条数的记录；
     * @param {int} $start 记录开始位置
     * @param {int} $num 记录条数
     * @param {int} $timeType 查询的时间类型  [ create| modify ]
     * @param {int} $contentParseLv 调用 CTxtParser 对 content 进行处理时的等级，0为不处理；
     */
    public function getByTime( $timeType='create',$contentParseLv = 0, $start = 0, $num = 0 ){
        return $this->tb->getByTime($timeType, $contentParseLv, $start, $num  );
    }
    /**
     * 获得记录条数
     * @param  {string|array} $type 记录类型
     */
    public function count( $type='default' ){
        $args = func_get_args();
        if( $type == 'keyword'  ){
            return $this->tb->countByKeyword( $args[1] );
        }
        else if( $type == 'class' ){
            return $this->tb->countByClasses( $args[1] );
        }
        else{
            return $this->tb->countAll();
        }
    }
    /**
     * 根据 记录类型 id 获取数据；
     * @param {string} $classesIds 记录对应的类型的 id 数组
     * @param {int} $contentParseLv 调用 CTxtParser 对 content 进行处理时的等级，0为不处理；
     * @return {array} 记录数组
     */
    public function getByClasses( $classesIds, $contentParseLv = 0, $start = 0, $num = 0 ){
        return $this->tb->getByClasses( $classesIds, $contentParseLv, $start, $num );
    }
    /**
     * 根据 关键字 获取数据；
     * @param {string} $keyword 记录对应的关键字
     * @param {int} $contentParseLv 调用 CTxtParser 对 content 进行处理时的等级，0为不处理；
     * @return {array} 记录数组
     */
    public function getByKeyword( $keyword, $contentParseLv = 0, $start = 0, $num = 0 ){
        return $this->tb->getByKeyword( $keyword, $contentParseLv, $start, $num );
    }
    /**
     * 根据 记录id 获取数据；
     * @param {int} $id 记录id;
     * @param {int} $contentParseLv 对记录 content 进行 过滤的等级
     * @return {array} 记录数组
     */
    public function getById( $id, $contentParseLv = 0 ){
        return $this->tb->getById( $id );
    }
    /**
     * 向表中添加新数据
     * @param  {string} $title        标题  
     * @param  {string} $author   作者
     * @param  {string} $content  内容
     * @param  {string} $classes  类别
     * @param  {string} $keywords 关键字
     */ 
    function insert( $title, $author, $content, $classes, $keywords ){
        // 分类
        if( strlen( $classes ) > 0 ){
            $classes = $this->parser->normTagString( $classes );
        }
        //关键字
        if( strlen( $keywords ) > 0 ){
            $keywords = $this->parser->normTagString( $keywords );
        }
        return $this->tb->insert( $title, $author, $content, date( "Y-m-d H:i:s" ), $classes, $keywords );
    }
    /**
     * 更新表中数据；
     * @param  {string} $id   记录 ID
     * @param  {string} $title        标题  
     * @param  {string} $content  内容
     * @param  {string} $classes  类别
     * @param  {string} $keywords 关键字
     */
    public function update( $id, $title, $content, $classes, $keywords ){
        // 分类
        if( strlen( $classes ) > 0 ){
            $classes = $this->parser->normTagString( $classes );
        }
        //关键字
        if( strlen( $keywords ) > 0 ){
            $keywords = $this->parser->normTagString( $keywords );
        }
        return $this->tb->update( $id, $title, $content, date( "Y-m-d H:i:s" ), $classes, $keywords );
    }
}
?>