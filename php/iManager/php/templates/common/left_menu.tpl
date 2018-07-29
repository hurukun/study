{{*左侧导航*}}
    <!--一个随机显示的内容-->
    <div class="box drop-shadow" data-sigil="leftRandom">
      <div class="rd-p"></div>
    </div>
    <!--分类菜单-->
    
    <div class="box drop-shadow"  data-sigil="leftMenu">
      <dl class="ver-menu def-vmenu">
        <dt></dt>
        {{foreach $menu_list as $menu_item}}
        <dd>
          <a href="#" data-tid="{{$menu_item.id}}">{{$menu_item.content}}</a>
          <ul>
            {{foreach $menu_item.children as $sub_item}}
            <li>
              <a href="#" data-tid="{{$sub_item.id}}">{{$sub_item.content}}</a>
            </li>
            {{/foreach}}
          </ul>
        </dd>
        {{/foreach}}
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
    </div>