<?php /* Smarty version Smarty-3.1.11, created on 2013-05-17 09:33:02
         compiled from "/Library/WebServer/Documents/php/templates/home/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1173476865194781f06e5c5-51748859%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'cd333deb8916f079f5f364ee1f2c8b0bbe7d1628' => 
    array (
      0 => '/Library/WebServer/Documents/php/templates/home/index.tpl',
      1 => 1368684704,
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
  'nocache_hash' => '1173476865194781f06e5c5-51748859',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_5194781f289777_74755581',
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
<?php if ($_valid && !is_callable('content_5194781f289777_74755581')) {function content_5194781f289777_74755581($_smarty_tpl) {?>
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
      
<div id="calender">
                <ul>
                    <li class="calCard">
                        <div class="calDate">
                            <span class="calMonth">12</span>月<span class="calDay">3</span>日
                        </div>
                        <div class="calEvent">
                        </div>
                    </li>
                </ul>
            </div>
            <div id="apps">
                <button id="mainPagePrev" class="pageSwitcher" style="left:10px;">&lt;</button>
                <div id="appPages">
                    <ul id="appList">
                        <li class="appPage">
                            <div class="app">
                                <a href="./blog/" class="appIcon b" title="无限未知">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Blog</p>
                            </div>
                            <div class="app">
                                <a href="./iblog/" class="appIcon b" title="无限未知">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">iBlog</p>
                            </div>
                            <div class="app">
                                <a href="./diary/" class="appIcon b" title="记忆长河">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Diary</p>
                            </div>
                            <div class="app">
                                <a href="./affairs/" class="appIcon b" title="预见未来">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Affairs</p>
                            </div>
                            <div class="app">
                                <a href="./contacts/" class="appIcon b" title="实验田">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Contacts</p>
                            </div>
                            <div class="app">
                                <a href="./example/" class="appIcon b" title="实验田">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Examples</p>
                            </div>
                            <div class="c"></div>
                        </li>
                        </li>
                        <li class="appPage">
                            <div class="app">
                                <a href="./blog/admin/" class="appIcon b" title="知识入库">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Blog Admin</p>
                            </div>
                            <div class="app">
                                <a href="./motto/admin" class="appIcon b" title="智慧真言">
                                    <img src="" alt=""/>
                                </a>
                                <p class="appName">Motto</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <button id="mainPageNext" class="pageSwitcher" style="right:10px;">&gt;</button>
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