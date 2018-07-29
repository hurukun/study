{{* 首页 *}}
{{extends file="layout/base_two_colume.tpl"}}

{{block name="left_panel"}}
  {{include file="common/left_menu.tpl"}}
{{/block}}
{{block name="main_panel"}}
    <!--内容列表-->
    <div class="mcontent-panel">
        <ul data-start="0" data-total="{{$totalNumber}}">
  {{include file="diary/abstract_list.tpl"}}
        </ul>
    </div>
    <div class="tac" data-type="pageTurner"/>
{{/block}}
