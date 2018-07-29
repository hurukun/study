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
{{/block}}
