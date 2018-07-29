{{* blog 发布框 *}}
{{block name="publisher"}}
<div class="contentWrapper" data-id="{{$id}}">
    <!-- 标题 -->
    <label class="b m5">标题</label>
    <input class="b" type="text" name="title" id ="com_edt_tit" value="{{$article.title}}"/>
    <!-- 发布框 -->
    <label class="b m5">内容</label>
    {{include file="common/editor.tpl"}}
    <!--编辑器 附加 -->
    <div id="com_edt_apd">
        <!-- 关键字 -->
        <div class="keywod">
            <label class="b m5">关键字</label>
            <input class="b" type="text" name="title" id ="com_edt_keyword" value="{{$article.keywords}}"/>
        </div>
        <!-- 分类-->
        {{if $class_list|count>0}}
        <div class="b m5"><label>分类：</label><span class="bTrigger" data-type="newClass">+</span></div>

        {{foreach $class_list as $class_item}}
        <div class="itemFooter hTabList" data-kid="{{$class_item.key}}">

          <dl>
            <dt data-kid="{{$class_item.key}}"><input type="checkbox" data-tid="{{$class_item.id}}"/><label for="">{{$class_item.content}}</label></dt>
            {{foreach $class_item.children as $sub_item}}
            <dd data-kid="{{$sub_item.key}}"><input type="checkbox" data-tid="{{$sub_item.id}}"/><label for="">{{$sub_item.content}}</label></dd>
            {{/foreach}}
            <dd><span class="bTrigger" data-type="newClass">+</span></dd>
          </dl>
        </div>
        {{/foreach}}<!-- $class_list as $class_item -->
        <script type="text/javascript">
        //初始化 选中的 类别
        var class_list = [];
            {{foreach $article.classes as $item}}
            class_list.push( '{{$item.id}}' );
            {{/foreach}}
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
        {{/if}}<!-- $class_list|count>0 -->
    </div>
    <div class="ofa">
      <div class="button fr mr30" id="com_edt_submit" data-id="{{$article.id}}">提交</div>
    </div>
</div>
{{/block}}