<?php /* Smarty version Smarty-3.1.11, created on 2013-05-29 16:02:14
         compiled from "/Library/WebServer/Documents/php/templates/blog/article.tpl" */ ?>
<?php /*%%SmartyHeaderCode:200483049751947b3728a7d6-47451009%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'a61ee01f8dd886e551b7c5f107d41be0599496e3' => 
    array (
      0 => '/Library/WebServer/Documents/php/templates/blog/article.tpl',
      1 => 1361945638,
      2 => 'file',
    ),
    'cd63d105aa876e86904db953361e5972ed455067' => 
    array (
      0 => '/Library/WebServer/Documents/php/templates/layout/base_one_colume.tpl',
      1 => 1348563890,
      2 => 'file',
    ),
    'd8a105a64e0f4d24fa23f3ec3431390b3dcd77fe' => 
    array (
      0 => '/Library/WebServer/Documents/php/templates/common/base.tpl',
      1 => 1368686059,
      2 => 'file',
    ),
    '37f285d642f09f8f2668a63f75728e3ab7da9472' => 
    array (
      0 => '/Library/WebServer/Documents/php/templates/common/editor.tpl',
      1 => 1354010768,
      2 => 'file',
    ),
    '60e8f77f589a7911cba2caf4eb7fcab7a2d6f149' => 
    array (
      0 => '/Library/WebServer/Documents/php/templates/blog/publisher.tpl',
      1 => 1364451487,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '200483049751947b3728a7d6-47451009',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_51947b374c43d7_13831474',
  'variables' => 
  array (
    '__HOST__' => 0,
    'stylesheets' => 0,
    'css' => 0,
    'scripts' => 0,
    'script' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51947b374c43d7_13831474')) {function content_51947b374c43d7_13831474($_smarty_tpl) {?>
<!DOCTYPE html>
<html>
    <head>
      <meta charset="utf-8">
      <script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['__HOST__']->value;?>
/js/base/jquery-1.7.2.js" charset="utf-8"></script>
      <script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['__HOST__']->value;?>
/js/base/jquery.tmpl.js" charset="utf-8"></script>
        <script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['__HOST__']->value;?>
/js/base/frame.js" charset="utf-8"></script>
        <link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['__HOST__']->value;?>
/css/_combo/common.css"></style>
        <?php  $_smarty_tpl->tpl_vars['css'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['css']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['stylesheets']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['css']->key => $_smarty_tpl->tpl_vars['css']->value){
$_smarty_tpl->tpl_vars['css']->_loop = true;
?>
          <link rel="stylesheet" type="text/css" href="<?php echo (($_smarty_tpl->tpl_vars['__HOST__']->value).('/')).($_smarty_tpl->tpl_vars['css']->value);?>
"></link>
        <?php } ?>
    </head>
    <body>
        <!--头部-->
        <header>
            <span class="hdTrigger hdTgShow">L</span>
            <div class="headContent" style="display:none;">
                <!--登录条-->
                <div class="fr loginBar" data-sigil="login">
                  <label class="fl" for="account">Account:</label>
                  <input class="fl" type="text" id="account"/>
                  <label class="fl" for="passwd">Password:</label>
                  <input class="fl" type="password" id="passwd"/>
                  <button class="btn fl" id="loginBtn">Login</button>              
                </div>
                <div class="fr logoutBar" data-sigil="logout" style="display:none;">
                  <button class="btn fl" id="logoutBtn">Logout</button>              
                </div>
            </div>
            <script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['__HOST__']->value;?>
/js/common/AHeader.js" charset="utf-8"></script>
        </header>
        <div id="main">
          <div class="mt-theme">All secrets will be understood and mastered, in time.</div>
          <!--主内容-->
          
  <!--主内容-->
  <div class="content" id="mainContent">
    <!--内容面板-->
      
                <div style="height:20px;"></div>
                <div class="article">
                    <?php if ($_smarty_tpl->tpl_vars['author']->value&&$_smarty_tpl->tpl_vars['author']->value['edit']==true){?>
                        <?php /*  Call merged included template "blog/publisher.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate("blog/publisher.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '200483049751947b3728a7d6-47451009');
content_51a5b606ec16c3_54590052($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "blog/publisher.tpl" */?>
                    <?php }else{ ?>
                    <div class="artTitle tac"><?php echo $_smarty_tpl->tpl_vars['article']->value['title'];?>
</div>
                    <div class="pubInfo tac">
                        <time><?php echo $_smarty_tpl->tpl_vars['article']->value['time'];?>
</time>
                        <span><?php echo $_smarty_tpl->tpl_vars['article']->value['author'];?>
</span>
                    </div>
                    <div class= "itemFooter hTabList" style="margin:5px 5px;">
                        <ul class="fr comList">
                            <?php  $_smarty_tpl->tpl_vars['keyword'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['keyword']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['article']->value['classes']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['keyword']->key => $_smarty_tpl->tpl_vars['keyword']->value){
$_smarty_tpl->tpl_vars['keyword']->_loop = true;
?>
                            <li><a href="#" data-tid="<?php echo $_smarty_tpl->tpl_vars['keyword']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['keyword']->value['content'];?>
</a></li>
                            <?php } ?>
                        </ul>
                        <div class="c"></div>
                    </div>
                    <div class="ww">
                       <?php echo $_smarty_tpl->tpl_vars['article']->value['content'];?>

                    </div>
                    <?php }?>
                    <div class="artAppend"></div>
                    <div class="cmtWrapper">
                        <h3>这里是评论</h3>
                        <div class="cmtList">
                            <ul>
                                <?php  $_smarty_tpl->tpl_vars['comment'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['comment']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['article']->value['comments']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['comment']->key => $_smarty_tpl->tpl_vars['comment']->value){
$_smarty_tpl->tpl_vars['comment']->_loop = true;
?>
                                <li>
                                    <div class="cmter p10 bgGray">
                                        <span><?php echo $_smarty_tpl->tpl_vars['comment']->value['user'];?>
 评论道</span>
                                        <time class="fr mr10"><?php echo $_smarty_tpl->tpl_vars['comment']->value['time'];?>
</time>
                                    </div>
                                    <div class="cmtItem p10">
                                        <?php echo $_smarty_tpl->tpl_vars['comment']->value['content'];?>

                                    </div>
                                </li>
                                <?php } ?>
                            </ul>
                        </div>
                        <div class="cmtPublisher">
                            <div class="pubCmt">
                                <div>
                                    <label>昵称</label>
                                    <input class="mr5" type="text" data-type="auther"/>
                                    <label>联系方式</label>
                                    <input class="mr5" type="text" data-type="contact"/>
                                </div>
                                <div class="mt10">
                                    <label class="b mb5">内容</label>
                                    <div class="taCmt" contenteditable="true" data-type="content"></div>
                                </div>
                                <div>
                                    <button class="pubBtn" data-type="pubBtn"><span>发表</span></button>
                                </div>
                            </div>
                        </div><!-- .cmtPublisher -->
                    </div> <!-- .cmtWrapper -->
                </div> <!-- .article -->

  </div>

          
          <div id="ft" class="c"></div>
        </div>
        <!-- 页面 js -->
        <?php  $_smarty_tpl->tpl_vars['script'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['script']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['scripts']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['script']->key => $_smarty_tpl->tpl_vars['script']->value){
$_smarty_tpl->tpl_vars['script']->_loop = true;
?>
          <script type="text/javascript" src="<?php echo (($_smarty_tpl->tpl_vars['__HOST__']->value).('/')).($_smarty_tpl->tpl_vars['script']->value);?>
"></script>
        <?php } ?>
    </body>
</html>
<?php }} ?><?php /* Smarty version Smarty-3.1.11, created on 2013-05-29 16:02:14
         compiled from "/Library/WebServer/Documents/php/templates/blog/publisher.tpl" */ ?>
<?php if ($_valid && !is_callable('content_51a5b606ec16c3_54590052')) {function content_51a5b606ec16c3_54590052($_smarty_tpl) {?>

<div class="contentWrapper" data-id="<?php echo $_smarty_tpl->tpl_vars['id']->value;?>
">
    <!-- 标题 -->
    <label class="b m5">标题</label>
    <input class="b" type="text" name="title" id ="com_edt_tit" value="<?php echo $_smarty_tpl->tpl_vars['article']->value['title'];?>
"/>
    <!-- 发布框 -->
    <label class="b m5">内容</label>
    <?php /*  Call merged included template "common/editor.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate("common/editor.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '200483049751947b3728a7d6-47451009');
content_51a5b606f1db51_23444635($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "common/editor.tpl" */?>
    <!--编辑器 附加 -->
    <div id="com_edt_apd">
        <!-- 关键字 -->
        <div class="keywod">
            <label class="b m5">关键字</label>
            <input class="b" type="text" name="title" id ="com_edt_keyword" value="<?php echo $_smarty_tpl->tpl_vars['article']->value['keywords'];?>
"/>
        </div>
        <!-- 分类-->
        <?php if (count($_smarty_tpl->tpl_vars['class_list']->value)>0){?>
        <div class="b m5"><label>分类：</label><span class="bTrigger" data-type="newClass">+</span></div>

        <?php  $_smarty_tpl->tpl_vars['class_item'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['class_item']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['class_list']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['class_item']->key => $_smarty_tpl->tpl_vars['class_item']->value){
$_smarty_tpl->tpl_vars['class_item']->_loop = true;
?>
        <div class="itemFooter hTabList" data-kid="<?php echo $_smarty_tpl->tpl_vars['class_item']->value['key'];?>
">

          <dl>
            <dt data-kid="<?php echo $_smarty_tpl->tpl_vars['class_item']->value['key'];?>
"><input type="checkbox" data-tid="<?php echo $_smarty_tpl->tpl_vars['class_item']->value['id'];?>
"/><label for=""><?php echo $_smarty_tpl->tpl_vars['class_item']->value['content'];?>
</label></dt>
            <?php  $_smarty_tpl->tpl_vars['sub_item'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['sub_item']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['class_item']->value['children']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['sub_item']->key => $_smarty_tpl->tpl_vars['sub_item']->value){
$_smarty_tpl->tpl_vars['sub_item']->_loop = true;
?>
            <dd data-kid="<?php echo $_smarty_tpl->tpl_vars['sub_item']->value['key'];?>
"><input type="checkbox" data-tid="<?php echo $_smarty_tpl->tpl_vars['sub_item']->value['id'];?>
"/><label for=""><?php echo $_smarty_tpl->tpl_vars['sub_item']->value['content'];?>
</label></dd>
            <?php } ?>
            <dd><span class="bTrigger" data-type="newClass">+</span></dd>
          </dl>
        </div>
        <?php } ?><!-- $class_list as $class_item -->
        <script type="text/javascript">
        //初始化 选中的 类别
        var class_list = [];
            <?php  $_smarty_tpl->tpl_vars['item'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['item']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['article']->value['classes']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['item']->key => $_smarty_tpl->tpl_vars['item']->value){
$_smarty_tpl->tpl_vars['item']->_loop = true;
?>
            class_list.push( '<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
' );
            <?php } ?>
        GD.App( '' ).define( function( require ){
            var $ = require( 'jQuery' ),
                Util = require( 'Util' );

            return {
                container: '#com_edt_apd',
                main: function(){
                    Util.foreach( class_list, function( item, key){
                        $( 'input[data-tid='+ item +']' ).attr( 'checked', 'checked' );
                    } );
                }
            };
        } );
        </script>
        <?php }?><!-- $class_list|count>0 -->
    </div>
    <div class="ofa">
      <div class="button fr mr30" id="com_edt_submit" data-id="<?php echo $_smarty_tpl->tpl_vars['article']->value['id'];?>
">提交</div>
    </div>
</div>
<?php }} ?><?php /* Smarty version Smarty-3.1.11, created on 2013-05-29 16:02:14
         compiled from "/Library/WebServer/Documents/php/templates/common/editor.tpl" */ ?>
<?php if ($_valid && !is_callable('content_51a5b606f1db51_23444635')) {function content_51a5b606f1db51_23444635($_smarty_tpl) {?>

    <div class="js_rich_editor">
        <div data-type="comEdtContent" style="display:none"><?php echo $_smarty_tpl->tpl_vars['article']->value['content'];?>
</div>
    </div>
<?php }} ?>