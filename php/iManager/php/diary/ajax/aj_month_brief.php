<?php
/**
 * blog 正文相关操作
 * 传入参数：
 * $_POST[ 'uid' ]      :  用户uid
 * $_POST[ 'year' ]       :  正文 id
 * $_POST[ 'month' ]    :  标题
 * 返回参数：
 * 
 */
require_once( 'global.php' );

class CMonthBriefData extends CB_Ajax{
    function main(){
        //blog 文章处理类
        $dd = new CA_Diary_Data();
        //获取传回数据
        $uid = $_POST[ 'uid' ];
        $year = $_POST[ 'year' ];
        $month = $_POST[ 'month' ];

        $data = $dd->get();

        $this->data[ 'suc' ] = $ba->write( $title, 'guardian', $content, $appendix, $keyword );
    }
};

$app = new CMonthBriefData();
$app->run();

?>