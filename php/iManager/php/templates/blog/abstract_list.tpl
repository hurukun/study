{{* 内容摘要 *}}
<!--内容列表-->
    {{if $abstract_list|count > 0}}
    {{foreach $abstract_list as $abstract}}
    <li class="box rbwrinkle" data-id="{{$abstract.id}}">
      <div class="itemHead">
        <div><a href="#" data-type="absDetail" class="absTitle">{{$abstract.title}}{{if $author and $author.edit == true}}</a><a href="#" class="absEdit" data-type="absEdit">编辑</a>{{/if}}</div>
      </div>
      <div class="itemContent">
        <div >
          <ul class="comList hTabList">
            {{foreach $abstract.keywords as $keyword}}
            <li><a href="#" data-kid="{{$keyword}}">{{$keyword}}</a></li>
            {{/foreach}}
          </ul>
        </div>
        <div class="wordWrap">
          {{$abstract.content}}
        </div>
      </div>
      <div class="itemFooter hTabList">
          <ul class="comList">
            {{foreach $abstract.classes as $class}}
            <li><a href="#" data-tid="{{$class.id}}">{{$class.content}}</a></li>
            {{/foreach}}
          </ul>
      </div>
    </li>
    {{/foreach}}
    {{else}}
    <li class="box box-rbwrinkle" data-id="{{$abstract.id}}">
      <div class="itemHead">
        <h3></h3>
      </div>
      <div class="itemContent">
        <div class="wordWrapper">
          当前无相关数据
        </div> 
      </div> 
    </li>
    {{/if}}