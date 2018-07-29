<?php /* Smarty version Smarty-3.1.11, created on 2013-05-06 17:54:37
         compiled from "/Library/WebServer/Documents/templates/blog/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:449420547516b7211b93f23-70401150%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7ac826f8371243df0e00bb7c0c857bed63e85ea9' => 
    array (
      0 => '/Library/WebServer/Documents/templates/blog/index.tpl',
      1 => 1365764747,
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
    'ce0a3b7f6b84e816cc6695a42975c3fd3651c7e2' => 
    array (
      0 => '/Library/WebServer/Documents/templates/blog/abstract_list.tpl',
      1 => 1365760670,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '449420547516b7211b93f23-70401150',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_516b7211e9a379_80987511',
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
<?php if ($_valid && !is_callable('content_516b7211e9a379_80987511')) {function content_516b7211e9a379_80987511($_smarty_tpl) {?>
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
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate("common/left_menu.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '449420547516b7211b93f23-70401150');
content_51877ddddff5f8_58035989($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "common/left_menu.tpl" */?>

    </div>
    <!--内容面板-->
    <div class="r-p">
      
    <!--内容列表-->
    <div class="mcontent-panel">
        <ul data-start="0" data-total="<?php echo $_smarty_tpl->tpl_vars['totalNumber']->value;?>
">
  <?php /*  Call merged included template "blog/abstract_list.tpl" */
$_tpl_stack[] = $_smarty_tpl;
 $_smarty_tpl = $_smarty_tpl->setupInlineSubTemplate("blog/abstract_list.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0, '449420547516b7211b93f23-70401150');
content_51877ddde3f311_33661746($_smarty_tpl);
$_smarty_tpl = array_pop($_tpl_stack); /*  End of included template "blog/abstract_list.tpl" */?>
        </ul>
    </div>
    <div class="tac" data-type="pageTurner"/>

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
<?php }} ?><?php /* Smarty version Smarty-3.1.11, created on 2013-05-06 17:54:37
         compiled from "/Library/WebServer/Documents/templates/common/left_menu.tpl" */ ?>
<?php if ($_valid && !is_callable('content_51877ddddff5f8_58035989')) {function content_51877ddddff5f8_58035989($_smarty_tpl) {?>
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
    </div><?php }} ?><?php /* Smarty version Smarty-3.1.11, created on 2013-05-06 17:54:37
         compiled from "/Library/WebServer/Documents/templates/blog/abstract_list.tpl" */ ?>
<?php if ($_valid && !is_callable('content_51877ddde3f311_33661746')) {function content_51877ddde3f311_33661746($_smarty_tpl) {?>
<!--内容列表-->
    <?php if (count($_smarty_tpl->tpl_vars['abstract_list']->value)>0){?>
    <?php  $_smarty_tpl->tpl_vars['abstract'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['abstract']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['abstract_list']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['abstract']->key => $_smarty_tpl->tpl_vars['abstract']->value){
$_smarty_tpl->tpl_vars['abstract']->_loop = true;
?>
    <li class="box rbwrinkle" data-id="<?php echo $_smarty_tpl->tpl_vars['abstract']->value['id'];?>
">
      <div class="itemHead">
        <div><a href="#" data-type="absDetail" class="absTitle"><?php echo $_smarty_tpl->tpl_vars['abstract']->value['title'];?>
<?php if ($_smarty_tpl->tpl_vars['author']->value&&$_smarty_tpl->tpl_vars['author']->value['edit']==true){?></a><a href="#" class="absEdit" data-type="absEdit">编辑</a><?php }?></div>
      </div>
      <div class="itemContent">
        <div >
          <ul class="comList hTabList">
            <?php  $_smarty_tpl->tpl_vars['keyword'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['keyword']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['abstract']->value['keywords']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['keyword']->key => $_smarty_tpl->tpl_vars['keyword']->value){
$_smarty_tpl->tpl_vars['keyword']->_loop = true;
?>
            <li><a href="#" data-kid="<?php echo $_smarty_tpl->tpl_vars['keyword']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['keyword']->value;?>
</a></li>
            <?php } ?>
          </ul>
        </div>
        <div class="wordWrap">
          <?php echo $_smarty_tpl->tpl_vars['abstract']->value['content'];?>

        </div>
      </div>
      <div class="itemFooter hTabList">
          <ul class="comList">
            <?php  $_smarty_tpl->tpl_vars['class'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['class']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['abstract']->value['classes']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['class']->key => $_smarty_tpl->tpl_vars['class']->value){
$_smarty_tpl->tpl_vars['class']->_loop = true;
?>
            <li><a href="#" data-tid="<?php echo $_smarty_tpl->tpl_vars['class']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['class']->value['content'];?>
</a></li>
            <?php } ?>
          </ul>
      </div>
    </li>
    <?php } ?>
    <?php }else{ ?>
    <li class="box box-rbwrinkle" data-id="<?php echo $_smarty_tpl->tpl_vars['abstract']->value['id'];?>
">
      <div class="itemHead">
        <h3></h3>
      </div>
      <div class="itemContent">
        <div class="wordWrapper">
          当前无相关数据
        </div> 
      </div> 
    </li>
    <?php }?><?php }} ?>