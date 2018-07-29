<?php /* Smarty version Smarty-3.1.11, created on 2013-05-07 16:18:36
         compiled from "/Library/WebServer/Documents/templates/auth/register.tpl" */ ?>
<?php /*%%SmartyHeaderCode:414092114517cc4fecd9982-75854132%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4380674d28fd9912a4bd8af5ea0a7702fc14e1d2' => 
    array (
      0 => '/Library/WebServer/Documents/templates/auth/register.tpl',
      1 => 1367914705,
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
  'nocache_hash' => '414092114517cc4fecd9982-75854132',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_517cc4fef02918_38838480',
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
<?php if ($_valid && !is_callable('content_517cc4fef02918_38838480')) {function content_517cc4fef02918_38838480($_smarty_tpl) {?>
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
      
<style type="text/css">
    .registerWrapper input{width:150px;}
</style>
<div class="registerWrapper">
    <p>
        <label for="account">Account</label>
        <input type="text" name="account" id="account" placeholder="please input your account"/>
    </p>
    <p>
        <label for="passwd">Password</label>
        <input type="password" name="passwd" id="passwd" placeholder="please input your password"/>
    </p>
    <p>
        <label for="gender">Gender</label>
        <select name="gender" id="gender">
            <option value="1">Male</option>
            <option value="0">Female</option>
        </select>
    </p>
    <p>
        <button id="registerSubmit">Submit</button>
        <button id="registerReset">Reset</button>
    </p>
    <script type="text/javascript">
        GD.App( 'ARegister', [] ).define( function( require){
            var Util = require( 'Util' );

            return {
                container: '.registerWrapper',
                events: {
                    'click #registerSubmit' : 'onSubmit',
                    'click #registerReset': 'onReset'
                },
                main: function(){

                },
                /**
                 * 提交注册
                 */
                onSubmit: function( evt ){
                    var regData = {
                        account: this.container.find( '#account' ).val(),
                        passwd: this.container.find( '#passwd' ).val(),
                        gender: this.container.find( '#gender' ).val()
                    };

                    if( regData.account.length === 0 ||
                         regData.passwd.length === 0 ||
                         regData.gender.length === 0){
                        window.MessageBox.alert( 'invalide value' );
                        return
                    }

                    Util.ajax( {
                        url: '/interface/auth/aj_register.php',
                        type: 'POST',
                        dataType: 'json',
                        data: regData,
                        success: function( resp ){
                            if( resp.suc === true ){
                                Util.setCookie( '_user', regData.account, 3600 , '/' );
                                Util.setCookie( '_uid', resp.data.uid,3600 , '/'  );
                                Util.setCookie( '_auth', resp.data.auth,3600 , '/'  );
                                window.location.href = '/';
                            }
                        }
                    } );
                },
                onReset: function( evt ){
                    this.container.find( '#account' ).val('');
                    this.container.find( '#passwd' ).val('');
                }
            };
        });
    </script>
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