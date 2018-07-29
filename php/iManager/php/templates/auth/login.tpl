{{* 首页 *}}
{{extends file="layout/base_one_colume.tpl"}}

{{block name="main_panel"}}
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
        <button id="loginSubmit">Login</button>
        <button id="loginReset">Reset</button>
    </p>
    <script type="text/javascript">
        GD.App( 'ALogin', [] ).define( function( require){
            var Util = require( 'Util' );

            return {
                container: '.registerWrapper',
                events: {
                    'click #loginSubmit' : 'onSubmit',
                    'click #loginReset': 'onReset'
                },
                main: function(){

                },
                /**
                 * 提交注册
                 */
                onSubmit: function( evt ){
                    var loginData = {
                        account: this.container.find( '#account' ).val(),
                        passwd: this.container.find( '#passwd' ).val()
                    };

                    if( loginData.account.length === 0 ||
                         loginData.passwd.length === 0 ){
                        window.MessageBox.alert( 'invalide value' );
                        return
                    }

                    Util.login( loginData, function(){ window.location.href =  '/index.php';} );
                },
                onReset: function( evt ){
                    this.container.find( '#account' ).val('');
                    this.container.find( '#passwd' ).val('');
                }
            };
        });
    </script>
</div>
{{/block}}
