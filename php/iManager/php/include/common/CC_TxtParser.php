<?php
/**
 * 对用户输入的文本进行处理
 */

class CC_TxtParser{
    function __construct(){
    }

    // 文本过滤 策略函数
    public function parse( &$content, $level = 0 ){
        return call_user_func( array( 'CC_TxtParser','parseLv'.$level ), $content );
    }
    /**
     *  具体处理函数，Lvn 中 n 越大，限制越严格；
     */
    /**
     * 默认的处理函数，什么都不处理
     * @param  {string} $content 待处理的内容
     * @return {string} 处理后的内容
     */
    function parseLv0( $content ){
        return $content;
    }
    /**
     * 只过滤 <script> 标签，且将 @html( ... ) 中的标签还原：&lt; => <；&gt; => > 
     * @param  [string] $content 待处理的文本
     * @return {string} 处理后的内容
     */
    function parseLv1( $content ){
        $reg = "@html\(.*[&lt;|&gt;].*?\)";
        return $content;
    }
    /**
     * 字符串截断
     * @param  [string]  $String [待处理文本]
     * @param  [int]  $Length [截取长度]
     * @param  boolean $Append [是否添加 ... ]
     * @return  [string]          [截取后的字符串]
     */
    public function subStr($String, $Length, $Append = false) { 

        return $this->phpos_chsubstr_ahtml( $String, $Length, $Append );

        // if (strlen($String) <= $Length ){ 
        //     return $String;
        // } 
        // else {
        //     $I = 0; 
        //     while ($I < $Length){
        //         $StringTMP = substr($String,$I,1);
        //         if ( ord($StringTMP) >=224 ){
        //             $StringTMP = substr($String,$I,3);
        //             $I = $I + 3; 
        //         }
        //         elseif( ord($StringTMP) >=192 ){
        //             $StringTMP = substr($String,$I,2);
        //             $I = $I + 2; 
        //         }
        //         else{ 
        //             $I = $I + 1; 
        //         }
        //         $StringLast[] = $StringTMP; 
        //     }
        //     $StringLast = implode("",$StringLast); 
        //     if($Append){
        //         $StringLast .= "..."; 
        //     }
        //     return $StringLast;
        // }
    }

    /**  
    * 截取HTML字符串 允许忽略HTML标志不计  
    *  
    * Author：学无止境  
    * Email：xjtdy888@163.com  
    * QQ: 339534039  
    * Home:http://www.phpos.org  
    * Blog:http://hi.baidu.com/phps  
    *  
    * 转载请保留作者信息  
    *   
    * @param 要截取的HTML $str  
    * @param 截取的数量 $num  
    * @param 是否需要加上更多 $more  
    * @return 截取串  
    */  
    function phpos_chsubstr_ahtml($str,$num,$more=false){   
        $leng=strlen($str);   
        if($num>=$leng)      return $str;   
        $word=0;   
        $i=0;                        /** 字符串指针 **/  
        $stag=array(array());        /** 存放开始HTML的标志 **/  
        $etag=array(array());        /** 存放结束HTML的标志 **/  
        $sp = 0;   
        $ep = 0;   
          while($word!=$num)   
          {   
      
              if(ord($str[$i])>128)   
              {   
                //$re.=substr($str,$i,3);   
                $i+=3;   
                $word++;   
              }   
              else if ($str[$i]=='<')   
              {   
                  if ($str[$i+1] == '!')   
                  {   
                    $i++;   
                      continue;   
                  }   
      
                  if ($str[$i+1]=='/')       
                  {   
                    $ptag=$etag ;   
                    $k=$ep;   
                    $i+=2;   
                  }   
                  else                       
                  {   
                    $ptag=$stag;   
                    $i+=1;   
                    $k=$sp;   
                  }   
      
                  for(;$i<$leng;$i++)           
                  {   
                      if ($str[$i] == ' ')   
                      {   
                        $ptag[$k] = implode('',$ptag[$k]);   
                        $k++;   
                          break;   
                      }   
                      if ($str[$i] != '>')    
                      {   
                        $ptag[$k][]=$str[$i];   
                          continue;   
                      }   
                      else                   
                      {   
                        $ptag[$k] = implode('',$ptag[$k]);   
                        $k++;   
                          break;   
                      }   
                  }   
                $i++;   
                  continue;   
              }   
              else  
              {   
                //$re.=substr($str,$i,1);   
                $word++;   
                $i++;   
              }   
          }   
          foreach ($etag as $val)   
          {   
            $key1=array_search($val,$stag);   
              if ($key1 !== false)          unset($stag[$key]);   
          }   
          foreach ($stag as $key => $val)   
          {   
              if (in_array($val,array('br','img'))) unset($stag[$key1]);   
          }   
        array_reverse($stag);   
        $ends = '</'.implode('></',$stag).'>';   
        $re = substr($str,0,$i).$ends;   
          if($more)    $re.='...';   
          return $re;   
    }
    /**
     * 规范 标签 字符串,以符合数据库模糊查询；
     * @param {string} 源字符串
     * @return {string} 标准化后的字符串，每个标签用 %< >% 包含；
     */
    public function sqlTagString( $source ){
        if( !is_array( $source ) ){
            $tags = explode( ',', $source );
        }

        sort( $tags );
        $source = "%<".implode( '>%<', $tags ).">%";
        
        return $source;
    }
    /**
     * 规范 标签 字符串；
     * @param {string} 源字符串
     * @return {string} 标准化后的字符串，每个标签用 < > 包含；
     */
    public function normTagString( $source ){
        $tags = explode( ',', $source );
        sort( $tags );

        $source = "<".implode( '><', $tags ).">";

        return $source;
    }
    /**
     * 将标签字符串 转化为 数组
     * @return {array} 数组每一项为一个标签
     */
    public function tagString2Array( $source ){
        if( strlen( $source ) < 3 ){
          return array();
        }

        $tags = substr( $source, 1, strlen( $source ) - 2 ) ;
        $tags = explode( '><', $tags );

        return $tags;
    }

}// class CC_TxtParser
?>