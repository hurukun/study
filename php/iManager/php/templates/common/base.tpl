{{* 页面主框架 *}}
<!DOCTYPE html>
<html>
    <head>
      <meta charset="utf-8">
      <script type="text/javascript" src="{{$__HOST__}}/js/base/jquery-1.7.2.js" charset="utf-8"></script>
      <script type="text/javascript" src="{{$__HOST__}}/js/base/jquery.tmpl.js" charset="utf-8"></script>
        <script type="text/javascript" src="{{$__HOST__}}/js/base/frame.js" charset="utf-8"></script>
        <link rel="stylesheet" type="text/css" href="{{$__HOST__}}/css/_combo/common.css"></style>
        {{foreach $stylesheets as $css}}
          <link rel="stylesheet" type="text/css" href="{{$__HOST__|cat:'/'|cat:$css}}"></link>
        {{/foreach}}
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
            <script type="text/javascript" src="{{$__HOST__}}/js/common/AHeader.js" charset="utf-8"></script>
        </header>
        <div id="main">
          <div class="mt-theme">All secrets will be understood and mastered, in time.</div>
          <!--主内容-->
          {{block name="main_content"}}
          {{/block}}
          
          <div id="ft" class="c"></div>
        </div>
        <!-- 页面 js -->
        {{foreach $scripts as $script}}
          <script type="text/javascript" src="{{$__HOST__|cat:'/'|cat:$script}}"></script>
        {{/foreach}}
    </body>
</html>
