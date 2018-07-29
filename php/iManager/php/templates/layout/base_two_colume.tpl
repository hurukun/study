{{* 两列结构 模板 *}}
{{extends file="common/base.tpl"}}
{{block name="main_content"}}
  <!--主内容-->
  <div class="content" id="mainContent">
    <!--左侧导航-->
    <div class="l-p">
      {{block name="left_panel"}}
      {{/block}}
    </div>
    <!--内容面板-->
    <div class="r-p">
      {{block name="main_panel"}}
      {{/block}}
    </div>
  </div>
{{/block}}
