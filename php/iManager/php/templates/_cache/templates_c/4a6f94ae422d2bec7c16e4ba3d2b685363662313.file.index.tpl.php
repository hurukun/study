<?php /* Smarty version Smarty-3.1.11, created on 2013-05-29 11:00:25
         compiled from "/Library/WebServer/Documents/php/templates/example/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:103408139651a56bc327d041-08637755%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4a6f94ae422d2bec7c16e4ba3d2b685363662313' => 
    array (
      0 => '/Library/WebServer/Documents/php/templates/example/index.tpl',
      1 => 1369795720,
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
  ),
  'nocache_hash' => '103408139651a56bc327d041-08637755',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_51a56bc339dcf1_08883520',
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
<?php if ($_valid && !is_callable('content_51a56bc339dcf1_08883520')) {function content_51a56bc339dcf1_08883520($_smarty_tpl) {?>
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
      
<div class="itemList">
    <ul>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_AIESlidedown">IE6，IE7(Q)，IE8(Q) 动画导致overflow=hidden</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_AScratchImage">蒙板擦除显示图像效果</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ARichEditor">富文本编辑器</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_seajs_ASeaJS">sea.js应用</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ACanvas">Canvas应用</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ACrossDomain">跨域问题</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ADOMEvents">DOM事件</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ASlideShow">滚动控件</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_AFloatStage">时差动画</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ADeferredObject">jQuery 异步对象</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ADragDrop">元素与文件拖拽上传</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_AWebSocket">HTML5--WebSocket</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ABaiduMap">百度地图</a>
        </li>
        <li>
            <a target="_blank" href="/php/example/item.php?handler=apps_example_ACard">用户名片</a>
        </li>
    </ul>
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
<?php }} ?>