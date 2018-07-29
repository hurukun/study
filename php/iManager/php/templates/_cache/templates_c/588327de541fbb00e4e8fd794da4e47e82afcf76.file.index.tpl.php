<?php /* Smarty version Smarty-3.1.11, created on 2013-05-07 11:10:21
         compiled from "/Library/WebServer/Documents/templates/example/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:37152123516ba2d649db32-66911291%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '588327de541fbb00e4e8fd794da4e47e82afcf76' => 
    array (
      0 => '/Library/WebServer/Documents/templates/example/index.tpl',
      1 => 1366008582,
      2 => 'file',
    ),
    '6f1dfb30fa7e8548ee2fa2b63d09a308350216b5' => 
    array (
      0 => '/Library/WebServer/Documents/templates/layout/base_one_colume.tpl',
      1 => 1348563890,
      2 => 'file',
    ),
    'cf76821046a5d4210d3b11131b0b4ccef2781af0' => 
    array (
      0 => '/Library/WebServer/Documents/templates/common/base.tpl',
      1 => 1367834072,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '37152123516ba2d649db32-66911291',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_516ba2d66e1d45_36845727',
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
<?php if ($_valid && !is_callable('content_516ba2d66e1d45_36845727')) {function content_516ba2d66e1d45_36845727($_smarty_tpl) {?>
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
            <a target="_blank" href="/example/item.php?handler=apps_example_AIESlidedown">IE6，IE7(Q)，IE8(Q) 动画导致overflow=hidden</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_AScratchImage">蒙板擦除显示图像效果</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_ARichEditor">富文本编辑器</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_seajs_ASeaJS">sea.js应用</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_ACanvas">Canvas应用</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_ACrossDomain">跨域问题</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_ADOMEvents">DOM事件</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_ASlideShow">滚动控件</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_AFloatStage">时差动画</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_ADeferredObject">jQuery 异步对象</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_ADragDrop">元素与文件拖拽上传</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_AWebSocket">HTML5--WebSocket</a>
        </li>
        <li>
            <a target="_blank" href="/example/item.php?handler=apps_example_ABaiduMap">百度地图</a>
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