<?php /* Smarty version Smarty-3.1.11, created on 2013-05-16 14:22:39
         compiled from "/Library/WebServer/Documents/php/templates/blog/abstract_list.tpl" */ ?>
<?php /*%%SmartyHeaderCode:112805024451947b2f0df244-93957329%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '213b67762c63f52766a90044a8261672842a7b58' => 
    array (
      0 => '/Library/WebServer/Documents/php/templates/blog/abstract_list.tpl',
      1 => 1365760670,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '112805024451947b2f0df244-93957329',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'abstract_list' => 0,
    'abstract' => 0,
    'author' => 0,
    'keyword' => 0,
    'class' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_51947b2f15d211_23078364',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51947b2f15d211_23078364')) {function content_51947b2f15d211_23078364($_smarty_tpl) {?>
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