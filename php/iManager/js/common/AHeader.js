/**
 * 管理头部
 */
GD.App('ACommonHead', []).define(function(require) {
    var $ = require('jQuery'),
        Util = require('Util');
    return {
        container: 'header',
        events: {
            'click .hdTrigger': 'onClickTrigger',
            'click #loginBtn': 'onLogin',
            'click #logoutBtn': 'onLogout'
        },
        main: function() {
            this.init();
        },
        /**
         * 初始化头部显示
         */
        init: function(){
            var isLogin = Util.getUserInfo().login;
            this.changeStatus( isLogin );
        },
        /**
         * 触发头部的现实、隐藏
         */
        onClickTrigger: function(e) {
            var target = $(e.currentTarget);
            /**
             * hide head bar
             */
            if (target.hasClass('hdTgHide')) {
                this.hideHead();
            } else {
                this.showHead();
            }
            target.toggleClass('hdTgHide');
            target.toggleClass('hdTgShow');
        },
        /**
         * 登录
         */
        onLogin: function(evt) {
            var me = this,
                loginData = {
                    account: this.container.find('#account').val(),
                    passwd: this.container.find('#passwd').val()
                };
            if (loginData.account.length === 0 || loginData.passwd.length === 0) {
                window.MessageBox.alert('invalid value.');
                return;
            }

            Util.login(loginData, function() {
                me.changeStatus( true );
            });
        },
        /**
         * 退出登录
         */
        onLogout: function( evt ){
            var me = this;
            Util.logout( function(){
                me.changeStatus( false );
            });
        },
        /**
         * 切换显示状态
         */
        changeStatus: function( isLogin ){
            this.container.find( '[data-sigil="login"]' ).toggle( !isLogin ); 
            this.container.find( '[data-sigil="logout"]').toggle( isLogin );
        },
        /**
         * 显示头部
         */
        showHead: function() {
            this.container.find('.headContent').slideDown();
        },
        /**
         * 隐藏头部
         */
        hideHead: function() {
            this.container.find('.headContent').slideUp();
        }
    };
});