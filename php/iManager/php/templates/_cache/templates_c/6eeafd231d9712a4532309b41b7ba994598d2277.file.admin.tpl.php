<?php /* Smarty version Smarty-3.1.11, created on 2013-05-06 19:09:34
         compiled from "/Library/WebServer/Documents/templates/blog/admin.tpl" */ ?>
<?php /*%%SmartyHeaderCode:27443690516bad3f286b10-39324943%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '6eeafd231d9712a4532309b41b7ba994598d2277' => 
    array (
      0 => '/Library/WebServer/Documents/templates/blog/admin.tpl',
      1 => 1354688217,
      2 => 'file',
    ),
    '2aa898c9f456467f7b9e02280893ec3a3214c556' => 
    array (
      0 => '/Library/WebServer/Documents/templates/layout/base_two_colume.tpl',
      1 => 1348563903,
      2 => 'file',
    ),
    'cf76821046a5d4210d3b11131b0b4ccef2781af0' => 
    array (
      0 => '/Library/WebServer/Documents/templates/common/base.tpl',
      1 => 1367834072,
      2 => 'file',
    ),
    'd0da5543c2d36935f99023b2ff9e09aca3c7e211' => 
    array (
      0 => '/Library/WebServer/Documents/templates/common/left_menu.tpl',
      1 => 1365759994,
      2 => 'file',
    ),
    '199a70d74236b65e1b67eb2a69a3ed7b19843de2' => 
    array (
      0 => '/Library/WebServer/Documents/templates/common/editor.tpl',
      1 => 1354010768,
      2 => 'file',
    ),
    'e174ada4a58829f47018ff4f4d2120e0961af872' => 
    array (
      0 => '/Library/WebServer/Documents/templates/blog/publisher.tpl',
      1 => 1364451487,
      2 => 'file',
    ),
    '0bbcefd589f7a80e5c1a11f4b99c9c2c0ad5fc4c' => 
    array (
      0 => '/Library/WebServer/Documents/templates/blog/content_list.tpl',
      1 => 1365760663,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '27443690516bad3f286b10-39324943',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_516bad3f5a2af6_83196541',
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
<?php if ($_valid && !is_callable('content_516bad3f5a2af6_83196541')) {function content_516bad3f5a2af6_83196541($_smarty_tpl) {?>
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
    <!--左侧导航-->
    <div class="l-p">
      
  <?php /*  Call merged included template "common/left_menu.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate("common/left_menu.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '27443690516bad3f286b10-39324943');
content_51878f6e321ff5_99568385($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "common/left_menu.tpl" */?>

    </div>
    <!--内容面板-->
    <div class="r-p">
      
  <?php /*  Call merged included template "blog/content_list.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate("blog/content_list.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '27443690516bad3f286b10-39324943');
content_51878f6e34e895_02316980($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "blog/content_list.tpl" */?>

    </div>
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
<?php }} ?><?php /* Smarty version Smarty-3.1.11, created on 2013-05-06 19:09:34
         compiled from "/Library/WebServer/Documents/templates/common/left_menu.tpl" */ ?>
<?php if ($_valid && !is_callable('content_51878f6e321ff5_99568385')) {function content_51878f6e321ff5_99568385($_smarty_tpl) {?>
    <!--一个随机显示的内容-->
    <div class="box drop-shadow" data-sigil="leftRandom">
      <div class="rd-p"></div>
    </div>
    <!--分类菜单-->
    
    <div class="box drop-shadow"  data-sigil="leftMenu">
      <dl class="ver-menu def-vmenu">
        <dt></dt>
        <?php  $_smarty_tpl->tpl_vars['menu_item'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['menu_item']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['menu_list']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['menu_item']->key => $_smarty_tpl->tpl_vars['menu_item']->value){
$_smarty_tpl->tpl_vars['menu_item']->_loop = true;
?>
        <dd>
          <a href="#" data-tid="<?php echo $_smarty_tpl->tpl_vars['menu_item']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['menu_item']->value['content'];?>
</a>
          <ul>
            <?php  $_smarty_tpl->tpl_vars['sub_item'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['sub_item']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['menu_item']->value['children']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['sub_item']->key => $_smarty_tpl->tpl_vars['sub_item']->value){
$_smarty_tpl->tpl_vars['sub_item']->_loop = true;
?>
            <li>
              <a href="#" data-tid="<?php echo $_smarty_tpl->tpl_vars['sub_item']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['sub_item']->value['content'];?>
</a>
            </li>
            <?php } ?>
          </ul>
        </dd>
        <?php } ?>
      </dl>
      <script type="text/javascript">

        GD.App( 'AToggleMenu', [] ).define( function( require){
          var $ = require( 'jQuery' );
          return {
            container: '#main',
            events: {
                'mouseenter .ver-menu dd': '_showSubMenu',
                'mouseleave .ver-menu dd': '_hideSubMenu'
            },
            main: function(){

            },
            _showSubMenu: function( evt ){
              evt.preventDefault();
              evt.stopPropagation();
              $( evt.currentTarget ).find( 'ul' ).show();
              return false;
            },
            _hideSubMenu: function( evt ){
              evt.preventDefault();
              evt.stopPropagation();
              $( evt.currentTarget ).find( 'ul' ).hide();
              return false;
            } 
          };
        } );
      </script>
    </div><?php }} ?><?php /* Smarty version Smarty-3.1.11, created on 2013-05-06 19:09:34
         compiled from "/Library/WebServer/Documents/templates/blog/content_list.tpl" */ ?>
<?php if ($_valid && !is_callable('content_51878f6e34e895_02316980')) {function content_51878f6e34e895_02316980($_smarty_tpl) {?>
<!--内容列表-->
<div class="mcontent-panel">
  <ul>
    <li class="box drop-shadow">
    	<?php /*  Call merged included template "blog/publisher.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate("blog/publisher.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '27443690516bad3f286b10-39324943');
content_51878f6e3595a8_74120384($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "blog/publisher.tpl" */?>
    </li>
  </ul>
</div><?php }} ?><?php /* Smarty version Smarty-3.1.11, created on 2013-05-06 19:09:34
         compiled from "/Library/WebServer/Documents/templates/blog/publisher.tpl" */ ?>
<?php if ($_valid && !is_callable('content_51878f6e3595a8_74120384')) {function content_51878f6e3595a8_74120384($_smarty_tpl) {?>

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
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate("common/editor.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '27443690516bad3f286b10-39324943');
content_51878f6e36be19_16479998($_smarty_tpl);
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
<?php }} ?><?php /* Smarty version Smarty-3.1.11, created on 2013-05-06 19:09:34
         compiled from "/Library/WebServer/Documents/templates/common/editor.tpl" */ ?>
<?php if ($_valid && !is_callable('content_51878f6e36be19_16479998')) {function content_51878f6e36be19_16479998($_smarty_tpl) {?>

    <div class="js_rich_editor">
        <div data-type="comEdtContent" style="display:none"><?php echo $_smarty_tpl->tpl_vars['article']->value['content'];?>
</div>
    </div>
<?php }} ?>