<?php
/**
 * blog 正文相关操作
 * 传入参数：
 * $_POST[ 'act' ]      :  操作类型；[ r|w|d ] => [read|write|delete]
 * $_POST[ 'uid' ]       :  用户uid
 * $_POST[ 'time' ]    :  时间
 * $_POST[ 'content' ]    :  内容
 * $_POST[ 'id' ]       :  diary 对应 id;
 * 返回参数：
 * 
 */
require_once( 'global.php' );

debug( 'CPublishBlog.php' );

class CPublishBlog extends CB_Ajax{
    function main(){
        //数据处理类
        $dd = new CA_Diary_Data();
        //获取传回数据
        $act = $_POST[ 'act' ];
        $id = $_POST[ 'id' ];

        //读 blog
        if( $act == "r" ){
            $data = $dd->get( $id );

            $smarty = CL_SmartyFactory::instance();
        }
        //创建/更新 
        else if( $act == 'w' ){
            $title = $_POST[ 'title' ];
            $content = $_POST[ 'content' ];
            $appendix = $_POST[ 'appendix' ];
            $keyword = $_POST['keyword'];
            $OS = $_POST[ 'os' ];

            if( $id != NULL ){
                $this->data[ 'suc' ] = $ba->write( $title, 'guardian',$content, $appendix, $keyword, $id );
            }
            else{
                $this->data[ 'suc' ] = $ba->write( $title, 'guardian', $content, $appendix, $keyword );
            }           
        }
        //删除 blog
        else if( $act == 'd' ){
            $this->data[ 'suc' ] = $ba->delete( $id );
        }
        
    }
};

$app = new CPublishBlog();
$app->run();

?>